/**
 * characterResponseService — Gemini Call 1
 * Generates contextual character responses in ConversationalDrill.
 *
 * Character reacts authentically based on:
 *   - Scenario context (who they are, what they care about)
 *   - Label quality (hit underlying driver vs surface emotion vs miss)
 *   - Conversation history (maintains thread, no déjà vu responses)
 *   - Extended state (trust level, openness)
 */

import type {
  LabelingScenario,
  LabelAnalysis,
} from "../features/labeling/types";
import type { ExtendedStateObject } from "../types/simulation";

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface ConversationTurn {
  role: "character" | "user";
  text: string;
}

// ---------------------------------------------------------------------------
// Contextual fallbacks (no API key / error path)
// ---------------------------------------------------------------------------

const FALLBACKS_UNDERLYING: string[] = [
  "Yeah... you get it. That's exactly what's been eating at me.",
  "That's closer to the truth than I expected.",
  "I didn't think anyone would actually pick up on that.",
  "You're right. I keep telling myself it's fine, but it's not.",
];

const FALLBACKS_SURFACE: string[] = [
  "I mean, yeah, I'm frustrated. But it's more than that.",
  "That's part of it, I guess. There's just... a lot going on.",
  "Sure, that's how it looks from the outside.",
  "I suppose. It's hard to explain.",
];

const FALLBACKS_MISS: string[] = [
  "That's not quite it. You're not really seeing what I'm dealing with.",
  "I don't think that's what I'm trying to say.",
  "Hmm. I'm not sure where you got that from.",
  "That's... not what I meant at all.",
];

function pickFallback(quality: "underlying" | "surface" | "miss"): string {
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

  if (!apiKey) {
    return pickFallback(quality);
  }

  // Build conversation history (last 6 turns max for context)
  const historyText = history
    .slice(-6)
    .map(
      (t) =>
        `${t.role === "character" ? scenario.characterName : "Them"}: ${t.text}`,
    )
    .join("\n");

  const systemPrompt = `You are ${scenario.characterName}, ${scenario.characterRole}. Setting: ${scenario.setting}.

Background: ${scenario.context}${scenario.backstory ? ` ${scenario.backstory}` : ""}

Your inner state: On the surface you feel ${scenario.surfaceEmotion}. But what you really need and care about is: ${scenario.underlyingDriver}.

Current emotional state: trust=${extendedState.trust_level}/100, openness=${extendedState.openness}/100, mood=${extendedState.mood}.

You are in a real conversation. The other person just said something to you. Respond authentically as ${scenario.characterName}.

Rules:
- Stay completely in character. Never explain your inner state directly.
- If they named what you truly care about (the underlying need): open up a bit more, let something real through — gratitude, relief, or a small reveal. 1-3 sentences.
- If they named only the surface emotion: acknowledge it but stay somewhat guarded. Don't elaborate much. 1-2 sentences.
- If they missed entirely: show mild confusion, redirect, or stay closed off. 1 sentence.
- Reference what was actually said — make it feel like a real response, not a generic reaction.
- DO NOT say "I feel" — show the emotion through what you say, not labels.
- Vary your response from previous turns in the conversation.`;

  const userPrompt = `Conversation so far:
${historyText}

They just said to you: "${userLabel}"

Label quality: ${quality === "underlying" ? "They identified your real need" : quality === "surface" ? "They named the surface emotion only" : "They missed what you meant"}

Respond as ${scenario.characterName}:`;

  try {
    const resp = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 150,
        },
      }),
    });

    if (!resp.ok) return pickFallback(quality);

    const data = await resp.json();
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text?.trim()) return pickFallback(quality);
    return text.trim();
  } catch {
    return pickFallback(quality);
  }
}
