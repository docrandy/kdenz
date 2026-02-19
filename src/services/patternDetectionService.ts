/**
 * src/services/patternDetectionService.ts
 *
 * Pattern detection service for Phase 20.1 — the SENDING channel of biofeedback.
 *
 * Two detection channels:
 *   A. Regex signals: instant, free, high confidence — fire before Gemini
 *   B. Gemini Call 2: per-exchange LLM classification (~$0.001/call)
 *
 * Graceful degradation: regex-only results when Gemini unavailable.
 * Never blocks the conversation — always fire-and-forget from the caller.
 *
 * Follows the Gemini call pattern established in drillEvaluationService.ts.
 */

import type {
  PatternSignal,
  SessionPatternData,
  PatternType,
} from "../types/simulation";
import { COMMUNICATOR_PATTERNS } from "../types/simulation";

// Re-export for convenience (importers can get everything from this service)
export { COMMUNICATOR_PATTERNS };

// ---------------------------------------------------------------------------
// Regex signal detection — instant, no API dependency
// ---------------------------------------------------------------------------

/**
 * Runs 6 regex patterns against the user's text.
 * Returns an array of observable behavioral signals (empty if none detected).
 *
 * These fire immediately — shown in Panel B before Gemini responds.
 * High precision: only fire when pattern is clearly present.
 */
export function detectRegexSignals(userText: string): string[] {
  const signals: string[] = [];

  // 1. Tag questions (hedger pattern)
  // "right?", "yeah?", "you know?", "correct?", "don't you think?"
  if (
    /[.!]?\s*(right|yeah|you know|correct|don't you think)\?$/i.test(userText)
  ) {
    signals.push("Tag question detected — signals need for validation");
  }

  // 2. Presumptuous framing (presumptuous pattern)
  // "you clearly", "you must feel/be", "you're definitely", "you always/never"
  if (
    /\b(you clearly|you must (feel|be)|you're definitely|you always|you never)\b/i.test(
      userText,
    )
  ) {
    signals.push("Presumptuous framing — stating interpretation as fact");
  }

  // 3. Righting reflex / fixer pattern
  // "you should", "have you tried", "why don't you", "my suggestion"
  if (
    /\b(you should|have you tried|why don't you|my suggestion)\b/i.test(
      userText,
    )
  ) {
    signals.push("Advice before empathy — righting reflex detected");
  }

  // 4. Softening prefixes (hedger pattern)
  // "I just ", "I was just ", "just wondering", "not to be "
  if (/^(I just |I was just |just wondering|not to be )/i.test(userText)) {
    signals.push("Softening prefix — minimizes the observation");
  }

  // 5. Multiple questions stacked (rusher pattern)
  const questionCount = (userText.match(/\?/g) || []).length;
  if (questionCount >= 2) {
    signals.push("Multiple questions stacked — not holding space for response");
  }

  // 6. Over-justifying with "because" (explainer pattern)
  const becauseCount = (userText.match(/\bbecause\b/gi) || []).length;
  if (becauseCount >= 2) {
    signals.push(
      "Over-justifying — explaining when labeling would serve better",
    );
  }

  return signals;
}

// ---------------------------------------------------------------------------
// Gemini Call 2 — per-exchange pattern classification
// ---------------------------------------------------------------------------

/**
 * Builds the pattern detection prompt for Gemini Call 2.
 * Includes 3 few-shot examples to anchor classification.
 */
function buildPatternDetectionPrompt(
  userText: string,
  conversationHistory: Array<{ role: "user" | "character"; text: string }>,
): string {
  // Take last 3 exchanges for context (6 messages max: 3 character + 3 user)
  const recentHistory = conversationHistory.slice(-6);
  const historyText = recentHistory
    .map((m) => `${m.role === "character" ? "Character" : "User"}: "${m.text}"`)
    .join("\n");

  return `You are analyzing a user's communication style in a labeling practice drill.
The user is practicing emotional labeling (e.g., "It seems like you're feeling X").

Classify the user's LATEST response for communication patterns that might undermine their effectiveness.

RECENT CONVERSATION:
${historyText || "(First exchange)"}

USER'S LATEST RESPONSE:
"${userText}"

CLASSIFICATION CATEGORIES:
- hedging: Accurate insight undermined by uncertainty markers ("I think maybe...", "...right?", softening prefixes)
- validation_seeking: Needs confirmation rather than making a confident observation
- intellectualizing: Analyzing the situation analytically instead of naming the emotion
- presumptuous: States interpretation as fact ("You clearly feel...", "You must be...")
- problem_solving_rush: Jumps to advice/solutions before establishing empathy
- deflection: Avoids the emotional core, stays on surface or topic-switches
- appropriate: Response demonstrates good technique — labeling, empathy, open curiosity
- mixed: Shows multiple patterns, no single dominant one

FEW-SHOT EXAMPLES:
1. "I think maybe she's kind of frustrated, right?" → hedging
   patternNote: "Your label was accurate but hedged — 'I think maybe' and the tag question 'right?' both signal uncertainty in what you actually saw clearly."

2. "You clearly feel betrayed by the decision." → presumptuous
   patternNote: "Stating their emotion as a fact ('You clearly feel') rather than offering it as an observation removes their ability to confirm or correct."

3. "It seems like you're worried this sets a pattern." → appropriate
   patternNote: "Clean label — hypothetical framing with 'It seems like' invites confirmation without demanding it."

Respond with ONLY valid JSON in this exact format:
{"signals": ["<specific observation 1>", "<specific observation 2>"], "patternNote": "<non-judgmental, behavioral, 1-2 sentences>", "dominant_pattern": "<category>", "confidence": <0.0-1.0>}

Rules:
- patternNote must be behavioral and specific, not shaming ("Your label..." not "You failed to...")
- signals are specific observations about THIS response, not generic advice
- confidence reflects how clearly the pattern shows (0.9 = obvious, 0.5 = subtle, 0.3 = might be appropriate)
- If response is "appropriate", signals should be empty [] and patternNote should affirm what worked`;
}

/**
 * Fallback result when Gemini is unavailable.
 * Returns regex-only signals or minimal placeholder.
 */
function fallbackResult(regexSignals: string[]): PatternSignal {
  return {
    signals: regexSignals,
    patternNote:
      regexSignals.length > 0
        ? regexSignals[0]
        : "Analyzing your communication patterns...",
    dominant_pattern: regexSignals.length > 0 ? "mixed" : "appropriate",
    confidence: regexSignals.length > 0 ? 0.6 : 0,
  };
}

/**
 * Detect communication patterns in the user's exchange.
 *
 * Detection flow:
 * 1. Run regex signals (instant, always)
 * 2. If no API key, return regex-only result
 * 3. Call Gemini 2.5 Flash for nuanced classification
 * 4. Merge regex + Gemini signals
 * 5. Graceful degradation on any Gemini failure
 *
 * This is Gemini Call 2 (per R14 pattern: Call 1 = character response, Call 2 = pattern detection).
 */
export async function detectPatternSignals(
  userText: string,
  conversationHistory: Array<{ role: "user" | "character"; text: string }>,
  apiKey: string | null,
): Promise<PatternSignal> {
  // Step 1: Regex signals (instant, always run)
  const regexSignals = detectRegexSignals(userText);

  // Step 2: No API key — return regex-only result
  if (!apiKey) {
    return {
      signals: regexSignals,
      patternNote:
        regexSignals.length > 0
          ? regexSignals[0]
          : "Pattern analysis requires a Gemini API key.",
      dominant_pattern: "mixed",
      confidence: regexSignals.length > 0 ? 0.6 : 0,
    };
  }

  // Step 3: Gemini Call 2
  const prompt = buildPatternDetectionPrompt(userText, conversationHistory);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1, // deterministic classification
            maxOutputTokens: 200,
          },
        }),
      },
    );

    if (!response.ok) {
      console.warn("[PatternDetect] Gemini API error:", response.status);
      return fallbackResult(regexSignals);
    }

    const data = await response.json();
    const rawText: string | undefined =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.warn("[PatternDetect] Gemini API returned empty response");
      return fallbackResult(regexSignals);
    }

    // Extract JSON — handle both raw JSON and ```json code block wrapping
    let jsonText = rawText.trim();

    // Step 1: Remove markdown code block markers if present
    if (jsonText.startsWith("```")) {
      // Remove opening ``` and optional "json" language marker
      jsonText = jsonText.replace(/^```(?:json)?\s*/, "");
    }
    if (jsonText.endsWith("```")) {
      // Remove closing ```
      jsonText = jsonText.replace(/\s*```$/, "");
    }

    // Step 2: Extract JSON object by finding matching braces
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
          jsonText = jsonText.substring(startIdx, endIdx + 1);
        }
      }
    }

    // Final trim to remove any remaining whitespace
    jsonText = jsonText.trim();

    console.log(
      "[PatternDetect] Attempting to parse JSON. First 80 chars:",
      jsonText.substring(0, 80),
    );
    console.log("[PatternDetect] Full JSON text length:", jsonText.length);

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("[PatternDetect] JSON parse failed. Full text:", jsonText);
      console.error("[PatternDetect] Parse error:", parseError);
      return fallbackResult(regexSignals);
    }

    // Validate shape — if malformed, fall back gracefully
    if (
      typeof parsed.patternNote !== "string" ||
      typeof parsed.dominant_pattern !== "string"
    ) {
      console.warn("[PatternDetect] Gemini response malformed:", parsed);
      return fallbackResult(regexSignals);
    }

    // Merge regex signals with Gemini-detected signals
    const geminiSignals: string[] = Array.isArray(parsed.signals)
      ? parsed.signals
      : [];
    const allSignals = [...regexSignals, ...geminiSignals];

    // Deduplicate signals
    const uniqueSignals = Array.from(new Set(allSignals));

    return {
      signals: uniqueSignals,
      patternNote: parsed.patternNote,
      dominant_pattern: parsed.dominant_pattern || "mixed",
      confidence:
        typeof parsed.confidence === "number"
          ? Math.max(0, Math.min(1, parsed.confidence))
          : 0.5,
    };
  } catch (error) {
    console.warn("[PatternDetect] Gemini Call 2 failed:", error);
    return fallbackResult(regexSignals);
  }
}

// ---------------------------------------------------------------------------
// Session pattern accumulation
// ---------------------------------------------------------------------------

/**
 * Updates session-level pattern data with a new per-exchange signal.
 *
 * Rules:
 * - Always appends newSignal to exchangeSignals
 * - sessionPattern only set after 3+ exchanges
 * - Requires dominant pattern in >= 60% of exchanges
 * - Requires pattern confidence >= 0.75 to surface in debrief
 * - 'appropriate' and 'mixed' do not count toward pattern accumulation
 */
export function updateSessionPatterns(
  existing: SessionPatternData,
  newSignal: PatternSignal,
): SessionPatternData {
  const updatedSignals = [...existing.exchangeSignals, newSignal];
  const updatedRegex = [
    ...existing.regexSignals,
    ...newSignal.signals.filter((s) => !existing.regexSignals.includes(s)),
  ];

  // Need at least 3 exchanges before calling a pattern
  if (updatedSignals.length < 3) {
    return {
      exchangeSignals: updatedSignals,
      regexSignals: updatedRegex,
      sessionPattern: null,
      patternConfidence: 0,
    };
  }

  // Count pattern frequencies — exclude 'appropriate' and 'mixed'
  const patternCounts: Partial<Record<PatternType, number>> = {};
  let scoredExchanges = 0;

  for (const signal of updatedSignals) {
    const dp = signal.dominant_pattern;
    if (dp !== "appropriate" && dp !== "mixed") {
      patternCounts[dp as PatternType] =
        (patternCounts[dp as PatternType] || 0) + 1;
      scoredExchanges += 1;
    }
  }

  // Need at least 2 non-appropriate exchanges to identify a pattern
  if (scoredExchanges < 2) {
    return {
      exchangeSignals: updatedSignals,
      regexSignals: updatedRegex,
      sessionPattern: null,
      patternConfidence: 0,
    };
  }

  // Find the dominant pattern
  let dominantPattern: PatternType | null = null;
  let maxCount = 0;

  for (const [pattern, count] of Object.entries(patternCounts) as [
    PatternType,
    number,
  ][]) {
    if (count > maxCount) {
      maxCount = count;
      dominantPattern = pattern;
    }
  }

  if (!dominantPattern) {
    return {
      exchangeSignals: updatedSignals,
      regexSignals: updatedRegex,
      sessionPattern: null,
      patternConfidence: 0,
    };
  }

  // Check frequency threshold: dominant pattern in >= 60% of non-appropriate exchanges
  const dominanceRatio = maxCount / scoredExchanges;
  if (dominanceRatio < 0.6) {
    return {
      exchangeSignals: updatedSignals,
      regexSignals: updatedRegex,
      sessionPattern: null,
      patternConfidence: 0,
    };
  }

  // Compute confidence: average of exchange confidence scores for the dominant pattern
  const relevantSignals = updatedSignals.filter(
    (s) => s.dominant_pattern === dominantPattern,
  );
  const avgConfidence =
    relevantSignals.reduce((sum, s) => sum + s.confidence, 0) /
    relevantSignals.length;

  // Must meet 0.75 threshold to surface in debrief
  const sessionPattern = avgConfidence >= 0.75 ? dominantPattern : null;

  return {
    exchangeSignals: updatedSignals,
    regexSignals: updatedRegex,
    sessionPattern,
    patternConfidence: avgConfidence,
  };
}
