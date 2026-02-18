/**
 * characterResponseService — Gemini Call 1
 * Generates contextual character responses in ConversationalDrill.
 */

import type {
  LabelingScenario,
  LabelAnalysis,
} from "../features/labeling/types";
import type { ExtendedStateObject } from "../types/simulation";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

interface ConversationTurn {
  role: "character" | "user";
  text: string;
}

// ---------------------------------------------------------------------------
// Contextual fallbacks (no API key / error path)
// ---------------------------------------------------------------------------

const FALLBACKS_UNDERLYING: string[] = [
  "Yeah... you get it. That's exactly what's been eating at me. I didn't think anyone would actually notice.",
  "That's closer to the truth than I expected. I've been carrying this around for a while and nobody's asked.",
  "You're right. I keep telling myself it's fine, but it's not. It hasn't been fine for a long time.",
  "I didn't think I was being that obvious. But yeah, that's exactly it.",
];

const FALLBACKS_SURFACE: string[] = [
  "I mean, yeah, I'm frustrated. But it's more than that — I'm not sure I can explain it.",
  "That's part of it, I guess. There's just a lot going on that I haven't figured out how to say.",
  "Sure, that's how it looks from the outside. I get why you'd see it that way.",
  "I suppose. It's just... it's complicated, and I don't think I'm being heard on the real issue.",
];

const FALLBACKS_MISS: string[] = [
  "That's not quite it. I'm not sure that's what I'm dealing with at all, honestly.",
  "I don't think that's what I'm trying to say. You're not really seeing what's going on.",
  "Hmm. I'm not sure where you got that from. That's not really what I meant.",
  "That's... not what I meant at all. I feel like you're missing the bigger picture here.",
];

function pickFallback(
  quality: "underlying" | "surface" | "miss",
  scenario?: LabelingScenario,
  isFirstExchange?: boolean,
): string {
  // First exchange + correct label → use the scenario's pre-written response
  if (
    quality === "underlying" &&
    isFirstExchange &&
    scenario?.counterpartResponse
  ) {
    return scenario.counterpartResponse;
  }
  const pool =
    quality === "underlying"
      ? FALLBACKS_UNDERLYING
      : quality === "surface"
        ? FALLBACKS_SURFACE
        : FALLBACKS_MISS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function generateCharacterResponse(
  scenario: LabelingScenario,
  history: ConversationTurn[],
  userLabel: string,
  analysis: LabelAnalysis,
  extendedState: ExtendedStateObject,
  apiKey: string | null,
): Promise<string> {
  const quality: "underlying" | "surface" | "miss" =
    analysis.depth.targetsUnderlyingDriver && analysis.syntax.hasCorrectOpener
      ? "underlying"
      : analysis.depth.targetsSurfaceEmotion && analysis.syntax.hasCorrectOpener
        ? "surface"
        : "miss";

  const isFirstExchange = history.filter((t) => t.role === "user").length === 0;

  if (!apiKey) {
    return pickFallback(quality, scenario, isFirstExchange);
  }

  // Build conversation history (last 6 turns max)
  const historyText = history
    .slice(-6)
    .map(
      (t) =>
        `${t.role === "character" ? scenario.characterName : "Other person"}: ${t.text}`,
    )
    .join("\n");

  const reactionGuidance =
    quality === "underlying"
      ? "They identified your real underlying need accurately. You feel understood — let something genuine through. Show relief, gratitude, or a small reveal of something deeper you haven't said yet."
      : quality === "surface"
        ? "They named only your surface emotion. You feel partially seen but not fully understood. Acknowledge it but stay somewhat guarded — don't elaborate too much."
        : "They completely missed what you meant. You feel misunderstood. Show mild confusion, redirect, or stay closed off.";

  const prompt = `You are ${scenario.characterName}, ${scenario.characterRole}. Setting: ${scenario.setting}.

Background: ${scenario.context}${scenario.backstory ? ` ${scenario.backstory}` : ""}

Your emotional state: On the surface you appear ${scenario.surfaceEmotion}. But your real underlying need is: ${scenario.underlyingDriver}. Trust level: ${extendedState.trust_level}/100. Openness: ${extendedState.openness}/100.

Conversation so far:
${historyText || "(This is the first response)"}

The other person just said: "${userLabel}"

${reactionGuidance}

Write your response as ${scenario.characterName}. REQUIREMENTS:
- Write exactly 2 to 3 complete sentences. No more, no less.
- Stay completely in character — never mention trust levels or emotional labels.
- Reference what they actually said so it feels like a real response.
- Show emotion through actions and words, not by saying "I feel".
- Do NOT start your response with your own name.
- Output only the spoken response, nothing else.`;

  try {
    const resp = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 250,
        },
      }),
    });

    if (!resp.ok) {
      console.warn("Character response API error:", resp.status);
      return pickFallback(quality, scenario, isFirstExchange);
    }

    const data = await resp.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text?.trim()) {
      console.warn("Character response: empty response from Gemini");
      return pickFallback(quality, scenario, isFirstExchange);
    }

    return text.trim();
  } catch (err) {
    console.warn("Character response fetch failed:", err);
    return pickFallback(quality, scenario, isFirstExchange);
  }
}
