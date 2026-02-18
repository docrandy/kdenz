/**
 * src/services/drillEvaluationService.ts
 *
 * Scoring engine for the v3.0 Generic Drill Engine.
 * Responsibility: evaluate a user's drill response across all four
 * quality dimensions (Form, Accuracy, Impact, Timing) and return a
 * composite score with coaching narrative.
 *
 * Form scoring is synchronous (regex pattern matching).
 * Accuracy + Impact scoring is async (Gemini LLM call).
 * Timing is always 0 for Phase 20 isolated drills.
 *
 * Graceful degradation: if Gemini fails or no API key is present,
 * the composite score falls back to the Form score alone.
 */

import type { Technique, Scenario } from "../types/drill";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DrillEvaluationResult = {
  /** 0-100, computed instantly via SyntaxRule pattern matching */
  formScore: number;

  /** 0-100 from Gemini, null if pending or if Gemini call failed */
  accuracyScore: number | null;

  /** 0-100 from Gemini, null if pending or if Gemini call failed */
  impactScore: number | null;

  /** Always 0 for Phase 20 isolated drills (no time pressure) */
  timingScore: number;

  /**
   * Weighted composite score:
   * - With Gemini: form*0.25 + accuracy*0.35 + impact*0.30 + timing*0.10
   * - Without Gemini: formScore (shown as-is when LLM unavailable)
   */
  compositeScore: number;

  /** Coaching narrative from Gemini, or fallback string if Gemini fails */
  explanation: string;

  /** false if Gemini failed or no API key was provided */
  geminiSucceeded: boolean;
};

// ---------------------------------------------------------------------------
// Gemini response type
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

interface GeminiDrillScore {
  accuracy: number;
  impact: number;
  explanation: string;
}

// ---------------------------------------------------------------------------
// scoreForm
// ---------------------------------------------------------------------------

/**
 * Apply all SyntaxRules from a technique to the user's transcript and
 * compute a form score (0-100).
 *
 * Rule types:
 * - 'regex'     — pass if RegExp(pattern, 'i') matches transcript
 * - 'negation'  — pass if RegExp(pattern, 'i') does NOT match transcript
 * - 'inclusion' — pass if RegExp(pattern, 'i') matches transcript (same as regex)
 *
 * Score = Math.round( passedWeight / totalWeight * 100 )
 *
 * Edge cases:
 * - Empty/whitespace transcript → 0
 * - No syntax rules → 100 (nothing to fail)
 */
export function scoreForm(transcript: string, technique: Technique): number {
  // Edge case: empty or whitespace-only transcript
  if (!transcript || transcript.trim().length === 0) {
    return 0;
  }

  const rules = technique.syntax_rules;

  // Edge case: no rules defined — perfect form by default
  if (!rules || rules.length === 0) {
    return 100;
  }

  let totalWeight = 0;
  let passedWeight = 0;

  for (const rule of rules) {
    const weight = rule.weight !== undefined ? rule.weight : 1.0;
    totalWeight += weight;

    let passed = false;

    try {
      const regex = new RegExp(rule.pattern, "i");

      if (rule.type === "regex" || rule.type === "inclusion") {
        // Pass = pattern IS present in transcript
        passed = regex.test(transcript);
      } else if (rule.type === "negation") {
        // Pass = pattern is NOT present in transcript
        passed = !regex.test(transcript);
      }
    } catch {
      // Invalid regex pattern — treat as failed rule, do not crash
      console.warn(
        `[DrillEval] Invalid regex pattern in rule "${rule.id}": ${rule.pattern}`,
      );
      passed = false;
    }

    if (passed) {
      passedWeight += weight;
    }
  }

  // Avoid division by zero (shouldn't happen given length check above, but guard anyway)
  if (totalWeight === 0) {
    return 100;
  }

  return Math.round((passedWeight / totalWeight) * 100);
}

// ---------------------------------------------------------------------------
// scoreWithGemini
// ---------------------------------------------------------------------------

/**
 * Build the evaluation prompt for Gemini.
 */
function buildDrillEvalPrompt(
  transcript: string,
  technique: Technique,
  scenario: Scenario,
): string {
  const evalNotes = scenario.evaluation_notes
    ? `EVALUATOR NOTES: ${scenario.evaluation_notes}\n\n`
    : "";

  return `You are evaluating a communication technique drill response.

TECHNIQUE: ${technique.name}
DESCRIPTION: ${technique.description}
SYNTAX TEMPLATE: ${technique.syntax_template}

SCENARIO PROMPT:
${scenario.prompt}

MODEL ANSWER (reference, not required to match exactly):
${scenario.model_answer}

USER'S RESPONSE:
"${transcript}"

${evalNotes}Rate the response on two dimensions (0-100 each):

ACCURACY (0-100): How well does the response apply the core technique? Does it match the intent of the model answer? Does it address what the scenario requires?

IMPACT (0-100): How effective would this response be on the counterpart in a real conversation? Would it create the intended effect (connection, open dialogue, de-escalation, etc.)?

Respond with ONLY valid JSON in this exact format:
{"accuracy": <number>, "impact": <number>, "explanation": "<3-4 sentence coaching narrative>"}

The explanation should address what worked and one concrete improvement. Be specific.`;
}

/**
 * Call Gemini to get Accuracy and Impact scores for the user's response.
 *
 * Returns null scores (not throws) on any failure — callers must handle
 * the { succeeded: false } case for graceful degradation.
 */
export async function scoreWithGemini(
  transcript: string,
  technique: Technique,
  scenario: Scenario,
  apiKey: string | null,
): Promise<{
  accuracyScore: number | null;
  impactScore: number | null;
  explanation: string;
  succeeded: boolean;
}> {
  // No API key — short circuit without a network call
  if (!apiKey) {
    return {
      accuracyScore: null,
      impactScore: null,
      explanation: "Accuracy and Impact scoring requires a Gemini API key.",
      succeeded: false,
    };
  }

  try {
    const prompt = buildDrillEvalPrompt(transcript, technique, scenario);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 300,
          },
        }),
      },
    );

    if (!response.ok) {
      console.warn(`[DrillEval] Gemini API error: ${response.status}`);
      return {
        accuracyScore: null,
        impactScore: null,
        explanation: "Accuracy and Impact scoring is temporarily unavailable.",
        succeeded: false,
      };
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.warn(
        `[DrillEval] Gemini API returned error: ${data.error.message}`,
      );
      return {
        accuracyScore: null,
        impactScore: null,
        explanation: "Accuracy and Impact scoring is temporarily unavailable.",
        succeeded: false,
      };
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      console.warn("[DrillEval] Gemini API returned empty response");
      return {
        accuracyScore: null,
        impactScore: null,
        explanation: "Accuracy and Impact scoring is temporarily unavailable.",
        succeeded: false,
      };
    }

    // Extract JSON — handle both ```json ... ``` code blocks and raw JSON
    let jsonText = rawText.trim();
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    } else {
      // Try to extract a JSON object directly if it's not in a code block
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
    }

    const parsed: GeminiDrillScore = JSON.parse(jsonText);

    // Validate shape
    if (
      typeof parsed.accuracy !== "number" ||
      typeof parsed.impact !== "number" ||
      typeof parsed.explanation !== "string"
    ) {
      throw new Error("Gemini response missing required fields");
    }

    // Clamp to 0-100
    const accuracyScore = Math.max(
      0,
      Math.min(100, Math.round(parsed.accuracy)),
    );
    const impactScore = Math.max(0, Math.min(100, Math.round(parsed.impact)));

    return {
      accuracyScore,
      impactScore,
      explanation: parsed.explanation,
      succeeded: true,
    };
  } catch (error) {
    console.warn("[DrillEval] Gemini scoring failed:", error);
    return {
      accuracyScore: null,
      impactScore: null,
      explanation: "Accuracy and Impact scoring is temporarily unavailable.",
      succeeded: false,
    };
  }
}

// ---------------------------------------------------------------------------
// evaluateDrillResponse
// ---------------------------------------------------------------------------

/**
 * Full evaluation pipeline for a single drill response.
 *
 * 1. Form score computed synchronously (regex matching)
 * 2. Gemini called for Accuracy + Impact (async)
 * 3. Composite computed:
 *    - With Gemini: form*0.25 + accuracy*0.35 + impact*0.30 + timing*0.10
 *    - Without Gemini: formScore as composite (LLM unavailable fallback)
 *
 * This function never throws — all errors are caught internally.
 */
export async function evaluateDrillResponse(
  transcript: string,
  technique: Technique,
  scenario: Scenario,
  apiKey: string | null,
): Promise<DrillEvaluationResult> {
  // 1. Synchronous form scoring
  const formScore = scoreForm(transcript, technique);

  // 2. Async Gemini scoring
  const geminiResult = await scoreWithGemini(
    transcript,
    technique,
    scenario,
    apiKey,
  );

  const {
    accuracyScore,
    impactScore,
    explanation,
    succeeded: geminiSucceeded,
  } = geminiResult;
  const timingScore = 0; // Phase 20: no time pressure in isolated drills

  // 3. Compute composite
  let compositeScore: number;

  if (accuracyScore !== null && impactScore !== null) {
    // Full weighted composite: form*0.25 + accuracy*0.35 + impact*0.30 + timing*0.10
    compositeScore = Math.round(
      formScore * 0.25 +
        accuracyScore * 0.35 +
        impactScore * 0.3 +
        timingScore * 0.1,
    );
  } else {
    // Gemini unavailable — use form score as composite
    compositeScore = formScore;
  }

  return {
    formScore,
    accuracyScore,
    impactScore,
    timingScore,
    compositeScore,
    explanation,
    geminiSucceeded,
  };
}
