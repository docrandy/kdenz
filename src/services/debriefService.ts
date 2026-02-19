/**
 * src/services/debriefService.ts
 *
 * Session debrief synthesis — Gemini Call 3.
 *
 * After a ConversationalDrill session ends, this service synthesizes all
 * accumulated session data into a 5-card debrief:
 *   1. RevealCard    — "What was actually there" (receiving channel: subtext)
 *   2. SendingCard   — "What you signaled" (sending channel: pattern)
 *   3. GrowthEdge    — One specific behavior for next session
 *   4. NextStep      — Personalized Institute content recommendation
 *   5. Progress      — Trajectory toward/holding/away from aspiration target
 *
 * CRITICAL CONSTRAINT:
 *   NEVER say "you are a Hedger". Always "you tend to X when Y".
 *   Pattern name badge appears AFTER behavioral framing, never before.
 *
 * Graceful degradation:
 *   No API key → fallback debrief assembled entirely from local data.
 *   Gemini failure → same fallback. User always sees a complete debrief.
 */

import type { SessionPatternData, PatternType } from "../types/simulation";
import { COMMUNICATOR_PATTERNS } from "../types/simulation";
import type { UserAspiration } from "../types/aspiration";
import type { ScoredContent } from "./contentRoutingService";
import { addPatternToHistory } from "../utils/learnerProfileStorage";
import { VOICE_ARCHETYPES } from "../data/voiceArchetypes";

// ---------------------------------------------------------------------------
// SubtextLayer — inline interface (LabelingScenario fields renamed for debrief)
// ---------------------------------------------------------------------------

/**
 * Subtext context extracted from the LabelingScenario for debrief synthesis.
 * Maps directly from scenario fields — no new data, just a cleaner shape.
 */
export interface SubtextLayer {
  /** Maps to LabelingScenario.underlyingDriver */
  underlyingFear: string;
  /** Maps to LabelingScenario.surfaceEmotion */
  surfaceEmotion: string;
  /** Maps to LabelingScenario.characterName */
  characterName: string;
  /** Maps to LabelingScenario.expertLabel */
  expertLabel: string;
}

// ---------------------------------------------------------------------------
// SessionDebrief — the 5-card output shape
// ---------------------------------------------------------------------------

export interface SessionDebrief {
  // ScenarioCard data
  /** Brief synopsis of the scenario setup */
  scenarioSynopsis: string;

  // ExchangeBreakdownCard data
  /** What the character said initially */
  characterInitialMessage: string;
  /** How the user responded */
  userResponse: string;
  /** What was effective or good about the response */
  whatWasGood: string;
  /** What could have been improved */
  whatCouldImprove: string;

  // RevealCard data
  /** 1 sentence: what the character was really feeling beneath the surface */
  characterSubtext: string;
  /** 1 sentence: what the user responded to vs the actual signal */
  missedSignal: string;

  // SendingFeedbackCard data
  /** 2-3 turn-referenced behavioral observations (not labels, not judgments) */
  behavioralObservations: string[];
  /** Pattern name (e.g., "Hedger") — only populated when confidence >= 0.75 */
  patternName: string;
  /** "you tend to X when Y" — framing FIRST, pattern name badge AFTER */
  patternFraming: string;
  /** 0-1 confidence score for the session pattern */
  patternConfidence: number;

  // GrowthEdgeCard data
  /** Single behavior to try in next session — always prefixed "In your next session, try..." */
  growthEdge: string;
  /** How this growth edge connects to the user's aspiration */
  growthEdgeContext: string;

  // NextStepCard data
  nextStepType: "drill" | "institute";
  nextStepId: string;
  nextStepTitle: string;
  /** "why this for you" — personalized reason this content was surfaced */
  nextStepPersonalization: string;

  // ProgressSignalCard data
  trajectoryDirection: "toward_target" | "holding" | "away_from_target";
  trajectoryNote: string;
  /** 1-indexed: patternHistory.length + 1 */
  sessionNumber: number;
}

// ---------------------------------------------------------------------------
// Gemini API types
// ---------------------------------------------------------------------------

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: {
    message: string;
  };
}

// ---------------------------------------------------------------------------
// Trajectory computation
// ---------------------------------------------------------------------------

/**
 * Computes trajectory direction from the rolling pattern history.
 *
 * Rules:
 *   - length < 2              → 'holding' + "Building your baseline..."
 *   - Last 3 same + decreasing confidence → 'toward_target'
 *   - Last 3 same + stable confidence    → 'holding'
 *   - Last 3 different/new pattern       → 'away_from_target'
 *
 * @param patternHistory Rolling history of past session patterns (most recent last)
 * @param currentPattern  The pattern detected in this session (may be null)
 * @param currentConfidence Confidence for this session's pattern
 */
function computeTrajectory(
  patternHistory: PatternType[],
  currentPattern: PatternType | null,
  currentConfidence: number,
): {
  direction: SessionDebrief["trajectoryDirection"];
  note: string;
} {
  // Not enough history to compute meaningful trajectory
  if (patternHistory.length < 2) {
    return {
      direction: "holding",
      note: "Building your baseline. Complete 2+ sessions to see your trajectory.",
    };
  }

  // Take last 3 entries (most recent is the right end of the array)
  const recent = patternHistory.slice(-3);
  const allSame = recent.every((p) => p === recent[recent.length - 1]);

  if (!allSame) {
    // Pattern shifting — user is exploring or regressing
    return {
      direction: "away_from_target",
      note: "Your pattern is shifting across sessions. Consistent practice on one technique will help.",
    };
  }

  // All recent sessions share the same pattern — check if confidence is decreasing
  // We use the simple heuristic: if current session confidence is below 0.8,
  // we consider it improving (moving toward target = pattern weakening).
  // If confidence is >= 0.8 consistently, it's holding.
  if (currentPattern && recent.every((p) => p === currentPattern)) {
    if (currentConfidence < 0.8) {
      return {
        direction: "toward_target",
        note: "This pattern is becoming less dominant. Your targeted practice is working.",
      };
    } else {
      return {
        direction: "holding",
        note: "Your pattern is consistent. Focused practice on your growth edge will start moving the needle.",
      };
    }
  }

  return {
    direction: "holding",
    note: "Building your pattern baseline across sessions.",
  };
}

// ---------------------------------------------------------------------------
// Fallback debrief builder
// ---------------------------------------------------------------------------

/**
 * Builds a complete SessionDebrief from local data alone — no Gemini required.
 * Called when there is no API key or when Gemini fails.
 *
 * Always returns a fully populated debrief (no empty strings in critical fields).
 */
function buildFallbackDebrief(
  sessionPatternData: SessionPatternData,
  subtextLayer: SubtextLayer,
  aspirationProfile: UserAspiration | null,
  topInstituteItems: ScoredContent[],
  patternHistory: PatternType[],
  scenarioContext?: string,
): SessionDebrief {
  const sessionNumber = patternHistory.length + 1;

  // ScenarioCard fields
  const scenarioSynopsis =
    scenarioContext || `You're talking with ${subtextLayer.characterName}.`;

  // ExchangeBreakdownCard fields — fallback stubs (would need session history to populate)
  const characterInitialMessage = "Review the exchange above.";
  const userResponse = "Your opening response was captured.";
  const whatWasGood = "You attempted to engage directly.";
  const whatCouldImprove =
    "Listen for the underlying concern before responding.";

  // RevealCard fields — derived from scenario subtext
  const characterSubtext = `It seems like ${subtextLayer.underlyingFear} was the real issue — not just ${subtextLayer.surfaceEmotion}.`;
  const missedSignal = `${subtextLayer.characterName} signaled ${subtextLayer.surfaceEmotion} on the surface — beneath that was something deeper they needed you to name.`;

  // SendingFeedbackCard fields — from regex signals and pattern data
  const rawObservations = sessionPatternData.regexSignals.slice(0, 3);
  const behavioralObservations =
    rawObservations.length > 0
      ? rawObservations
      : [
          "Your label structure was logged for this session.",
          "Review the expert example to compare framing approaches.",
        ];

  const sessionPattern = sessionPatternData.sessionPattern;
  const patternDef = sessionPattern
    ? COMMUNICATOR_PATTERNS[sessionPattern]
    : null;

  const patternName =
    patternDef && sessionPatternData.patternConfidence >= 0.75
      ? patternDef.name
      : "";

  const patternFraming = sessionPattern
    ? `you tend to ${sessionPattern.replace(/-/g, " ")} when the stakes feel high`
    : "Too few exchanges to identify a consistent pattern yet";

  const patternConfidence = sessionPatternData.patternConfidence;

  // GrowthEdgeCard — derived from pattern or generic
  const growthEdge = patternDef
    ? `name the underlying fear, not just the surface emotion — like ${subtextLayer.expertLabel}`
    : "try naming the underlying fear directly, not just the visible emotion";

  const growthEdgeContext = aspirationProfile
    ? `Building toward ${getArchetypeName(aspirationProfile.primary_archetype_id)}`
    : "Building your communication awareness one session at a time";

  // NextStepCard — from Institute content or prescribed drill
  let nextStepType: SessionDebrief["nextStepType"] = "drill";
  let nextStepId = "labeling";
  let nextStepTitle = "Labeling Practice";
  let nextStepPersonalization =
    "Practice naming underlying drivers to build your core labeling muscle.";

  if (topInstituteItems.length > 0) {
    const top = topInstituteItems[0];
    nextStepType = "institute";
    nextStepId = top.item.id;
    nextStepTitle = top.item.title;
    nextStepPersonalization =
      top.item.debrief_hook ||
      top.reason ||
      "Recommended based on your session";
  } else if (patternDef && patternDef.prescribedDrills.length > 0) {
    nextStepType = "drill";
    nextStepId = patternDef.prescribedDrills[0];
    nextStepTitle = formatDrillTitle(patternDef.prescribedDrills[0]);
    nextStepPersonalization = `Addresses your ${patternDef.name} pattern directly.`;
  }

  // ProgressSignalCard — computed from history
  const trajectory = computeTrajectory(
    patternHistory,
    sessionPatternData.sessionPattern,
    sessionPatternData.patternConfidence,
  );

  return {
    scenarioSynopsis,
    characterInitialMessage,
    userResponse,
    whatWasGood,
    whatCouldImprove,
    characterSubtext,
    missedSignal,
    behavioralObservations,
    patternName,
    patternFraming,
    patternConfidence,
    growthEdge,
    growthEdgeContext,
    nextStepType,
    nextStepId,
    nextStepTitle,
    nextStepPersonalization,
    trajectoryDirection: trajectory.direction,
    trajectoryNote: trajectory.note,
    sessionNumber,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getArchetypeName(id: string): string {
  const archetype = VOICE_ARCHETYPES[id as keyof typeof VOICE_ARCHETYPES];
  return archetype ? archetype.name : id.replace(/_/g, " ");
}

function formatDrillTitle(drillId: string): string {
  const titles: Record<string, string> = {
    labeling: "Labeling Practice",
    mirroring: "Mirroring Practice",
    "open-ended-questions": "Open-Ended Questions",
    "i-statements": "I-Statements",
    "no-oriented-questions": "No-Oriented Questions",
    "nvc-feeling": "NVC Feeling Statements",
    "nvc-observation": "NVC Observations",
    "accusation-audit": "Accusation Audit",
  };
  return titles[drillId] || drillId.replace(/-/g, " ");
}

// ---------------------------------------------------------------------------
// Gemini prompt builder
// ---------------------------------------------------------------------------

function buildDebriefPrompt(
  sessionHistory: Array<{ role: "user" | "character"; text: string }>,
  patternNotes: string[],
  subtextLayer: SubtextLayer,
  aspirationProfile: UserAspiration | null,
  topInstituteItems: ScoredContent[],
  patternHistory: PatternType[],
  scenarioContext?: string,
): string {
  // Truncate session history to last 10 exchanges
  const truncatedHistory = sessionHistory.slice(-10);
  const historyText = truncatedHistory
    .map((m) => `${m.role === "user" ? "USER" : "CHARACTER"}: ${m.text}`)
    .join("\n");

  // Last 5 pattern notes
  const recentNotes = patternNotes.slice(-5);
  const notesText =
    recentNotes.length > 0
      ? recentNotes.join("\n")
      : "No pattern notes generated this session.";

  // Aspiration context
  const aspirationText = aspirationProfile
    ? `User's target voice: ${getArchetypeName(aspirationProfile.primary_archetype_id)} (${aspirationProfile.primary_archetype_id})`
    : "No aspiration set.";

  // Pattern history summary
  const historyCount = patternHistory.length;
  const patternHistoryText =
    historyCount > 0
      ? `Last ${historyCount} sessions: ${patternHistory.join(", ")}`
      : "First session (no prior history).";

  // Top Institute candidates
  const candidatesText =
    topInstituteItems.length > 0
      ? topInstituteItems
          .slice(0, 3)
          .map((s) => `- id: "${s.item.id}", title: "${s.item.title}"`)
          .join("\n")
      : "No Institute candidates available.";

  return `You are synthesizing a session debrief for a communication practice app.

SCENARIO:
${scenarioContext || "No scenario context provided"}

SESSION DATA:
${historyText}

WHAT WAS REALLY THERE (subtext):
- Character's underlying fear: ${subtextLayer.underlyingFear}
- Surface emotion displayed: ${subtextLayer.surfaceEmotion}
- Character: ${subtextLayer.characterName}
- Expert label example: ${subtextLayer.expertLabel}

PER-EXCHANGE PATTERN NOTES (from behavioral analysis):
${notesText}

USER ASPIRATION:
${aspirationText}

PATTERN HISTORY:
${patternHistoryText}

INSTITUTE CONTENT CANDIDATES (select one as nextStep):
${candidatesText}

INSTRUCTIONS:
- ScenarioCard: scenarioSynopsis should be a 1-2 sentence overview of the setup (character + context). Example: "You're talking with Carol, who's stressed about a deadline."
- ExchangeBreakdownCard: Extract the FIRST message from the CHARACTER in the session history for characterInitialMessage. Extract the user's first substantive response for userResponse. Write whatWasGood (what worked in the response) and whatCouldImprove (one specific thing to refine).
- RevealCard: Write ONE sentence for characterSubtext (what the character was REALLY feeling — not the surface emotion). Write ONE sentence for missedSignal (what the user responded to vs the real signal).
- SendingFeedbackCard: Write 2-3 specific behavioral observations as an array. Write patternFraming as "you tend to [behavior] when [context]" — NEVER "you are a [pattern]". Only include patternName if it clearly emerged.
- GrowthEdgeCard: Write one specific behavior to try in next session (just the behavior, no "In your next session" prefix). Write growthEdgeContext explaining how it connects to their aspiration.
- NextStepCard: Select the most relevant Institute item from candidates. If none fit, use nextStepType: "drill" with id: "labeling". Write a 1-sentence personalization ("why this for you").
- ProgressSignalCard: Assess trajectory honestly. If first session, use "holding".

OUTPUT FORMAT: Return ONLY valid JSON matching this exact shape. No markdown, no explanation:
{
  "scenarioSynopsis": "string",
  "characterInitialMessage": "string",
  "userResponse": "string",
  "whatWasGood": "string",
  "whatCouldImprove": "string",
  "characterSubtext": "string",
  "missedSignal": "string",
  "behavioralObservations": ["string", "string"],
  "patternName": "string (empty if not clear)",
  "patternFraming": "you tend to X when Y",
  "patternConfidence": 0.0,
  "growthEdge": "string",
  "growthEdgeContext": "string",
  "nextStepType": "drill or institute",
  "nextStepId": "string",
  "nextStepTitle": "string",
  "nextStepPersonalization": "string",
  "trajectoryDirection": "toward_target or holding or away_from_target",
  "trajectoryNote": "string",
  "sessionNumber": ${patternHistory.length + 1}
}`;
}

// ---------------------------------------------------------------------------
// JSON extraction (mirrors drillEvaluationService pattern)
// ---------------------------------------------------------------------------

function extractJsonFromText(rawText: string): string {
  let jsonText = rawText.trim();
  console.log(
    "[extractJsonFromText] Initial text length:",
    jsonText.length,
    "First 50 chars:",
    jsonText.substring(0, 50),
  );

  // Step 1: Remove markdown code block markers if present
  if (jsonText.startsWith("```")) {
    // Remove opening ``` and optional "json" language marker
    jsonText = jsonText.replace(/^```(?:json)?\s*/, "");
    console.log(
      "[extractJsonFromText] After removing opening backticks, length:",
      jsonText.length,
    );
  }
  if (jsonText.endsWith("```")) {
    // Remove closing ```
    jsonText = jsonText.replace(/\s*```$/, "");
    console.log(
      "[extractJsonFromText] After removing closing backticks, length:",
      jsonText.length,
    );
  }

  // Step 2: Extract JSON object by finding matching braces (most reliable method)
  if (jsonText.includes("{")) {
    let braceCount = 0;
    let startIdx = jsonText.indexOf("{");
    let endIdx = -1;

    if (startIdx !== -1) {
      for (let i = startIdx; i < jsonText.length; i++) {
        if (jsonText[i] === "{") braceCount++;
        else if (jsonText[i] === "}") {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i;
            break;
          }
        }
      }

      if (endIdx !== -1) {
        const result = jsonText.substring(startIdx, endIdx + 1).trim();
        console.log(
          "[extractJsonFromText] Extracted JSON length:",
          result.length,
          "First 50 chars:",
          result.substring(0, 50),
        );
        return result;
      }
    }
  }

  return jsonText.trim();
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function isValidDebrief(obj: unknown): obj is SessionDebrief {
  if (!obj || typeof obj !== "object") return false;
  const d = obj as Record<string, unknown>;
  return (
    typeof d.scenarioSynopsis === "string" &&
    typeof d.characterInitialMessage === "string" &&
    typeof d.userResponse === "string" &&
    typeof d.whatWasGood === "string" &&
    typeof d.whatCouldImprove === "string" &&
    typeof d.characterSubtext === "string" &&
    typeof d.missedSignal === "string" &&
    Array.isArray(d.behavioralObservations) &&
    typeof d.patternName === "string" &&
    typeof d.patternFraming === "string" &&
    typeof d.patternConfidence === "number" &&
    typeof d.growthEdge === "string" &&
    typeof d.growthEdgeContext === "string" &&
    (d.nextStepType === "drill" || d.nextStepType === "institute") &&
    typeof d.nextStepId === "string" &&
    typeof d.nextStepTitle === "string" &&
    typeof d.nextStepPersonalization === "string" &&
    (d.trajectoryDirection === "toward_target" ||
      d.trajectoryDirection === "holding" ||
      d.trajectoryDirection === "away_from_target") &&
    typeof d.trajectoryNote === "string" &&
    typeof d.sessionNumber === "number"
  );
}

// ---------------------------------------------------------------------------
// generateSessionDebrief — main export
// ---------------------------------------------------------------------------

/**
 * Generates a complete 5-card session debrief after a conversational drill ends.
 *
 * Flow:
 *   1. If no API key → return fallback debrief immediately
 *   2. If API key → call Gemini (Call 3) with session + pattern + aspiration data
 *   3. Parse and validate response
 *   4. If Gemini fails → return fallback debrief
 *   5. After debrief generated → persist pattern to history (addPatternToHistory)
 *
 * @param sessionHistory  Full message history from ConversationalDrill
 * @param patternNotes    Per-exchange pattern notes from Gemini Call 2
 * @param sessionPatternData  Session-level pattern accumulation
 * @param subtextLayer    Scenario subtext context (from LabelingScenario fields)
 * @param aspirationProfile  User's target voice archetype (may be null)
 * @param topInstituteItems  Scored Institute content from contentRoutingService
 * @param patternHistory  Rolling 10-session pattern history
 * @param apiKey          Gemini API key (may be null for graceful degradation)
 */
export async function generateSessionDebrief(
  sessionHistory: Array<{ role: "user" | "character"; text: string }>,
  patternNotes: string[],
  sessionPatternData: SessionPatternData,
  subtextLayer: SubtextLayer,
  aspirationProfile: UserAspiration | null,
  topInstituteItems: ScoredContent[],
  patternHistory: PatternType[],
  apiKey: string | null,
  scenarioContext?: string,
): Promise<SessionDebrief> {
  // Fallback path — no API key
  if (!apiKey) {
    const debrief = buildFallbackDebrief(
      sessionPatternData,
      subtextLayer,
      aspirationProfile,
      topInstituteItems,
      patternHistory,
      scenarioContext,
    );
    // Persist pattern to history after generating debrief
    if (sessionPatternData.sessionPattern) {
      addPatternToHistory(sessionPatternData.sessionPattern);
    }
    return debrief;
  }

  // Gemini path
  try {
    const prompt = buildDebriefPrompt(
      sessionHistory,
      patternNotes,
      subtextLayer,
      aspirationProfile,
      topInstituteItems,
      patternHistory,
      scenarioContext,
    );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [
              {
                text: "You are a communication coach synthesizing a practice session debrief. Your tone is warm, observational, and growth-oriented. NEVER say 'you are a [pattern]'. Always say 'you tend to [behavior] when [context]'. Pattern name appears AFTER behavioral observation. Growth edge uses 'In your next session, try...' framing in the UI — output the behavior only, without the prefix. Output valid JSON only, no markdown code blocks.",
              },
            ],
          },
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
          },
        }),
      },
    );

    if (!response.ok) {
      console.warn(`[DebriefService] Gemini API error: ${response.status}`);
      throw new Error(`HTTP ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.warn(`[DebriefService] Gemini API error: ${data.error.message}`);
      throw new Error(data.error.message);
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      console.warn("[DebriefService] Gemini returned empty response");
      throw new Error("Empty response");
    }

    const jsonText = extractJsonFromText(rawText);
    console.log(
      "[DebriefService] Attempting to parse JSON. First 100 chars:",
      jsonText.substring(0, 100),
    );

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("[DebriefService] JSON parse failed. Full text:", jsonText);
      console.error("[DebriefService] Parse error:", parseError);
      throw parseError;
    }

    // Clamp patternConfidence to 0-1
    if (typeof parsed.patternConfidence === "number") {
      parsed.patternConfidence = Math.max(
        0,
        Math.min(1, parsed.patternConfidence),
      );
    }

    // Validate shape — fall back if invalid
    if (!isValidDebrief(parsed)) {
      console.warn("[DebriefService] Gemini response failed validation", {
        parsed,
        missingFields: {
          scenarioSynopsis: typeof parsed.scenarioSynopsis,
          characterInitialMessage: typeof parsed.characterInitialMessage,
          userResponse: typeof parsed.userResponse,
          whatWasGood: typeof parsed.whatWasGood,
          whatCouldImprove: typeof parsed.whatCouldImprove,
          growthEdge: typeof parsed.growthEdge,
          growthEdgeContext: typeof parsed.growthEdgeContext,
        },
      });
      throw new Error("Invalid debrief shape");
    }

    // Persist pattern to history
    if (sessionPatternData.sessionPattern) {
      addPatternToHistory(sessionPatternData.sessionPattern);
    }

    return parsed;
  } catch (error) {
    console.warn("[DebriefService] Gemini call failed, using fallback:", error);

    // Fallback debrief from local data
    const debrief = buildFallbackDebrief(
      sessionPatternData,
      subtextLayer,
      aspirationProfile,
      topInstituteItems,
      patternHistory,
      scenarioContext,
    );

    // Still persist pattern even on Gemini failure
    if (sessionPatternData.sessionPattern) {
      addPatternToHistory(sessionPatternData.sessionPattern);
    }

    return debrief;
  }
}
