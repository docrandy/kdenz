/**
 * src/types/drill.ts
 *
 * TypeScript types for the v3.0 Generic Drill Engine.
 * This file has zero dependencies — no imports from any other project file.
 *
 * NOTE: Do NOT confuse with src/types/technique.ts, which is the Phase 2
 * technique library (51 techniques from Kdenzphase2.json). These types are
 * drill-engine specific and use different field names.
 */

// ---------------------------------------------------------------------------
// SyntaxRule
// ---------------------------------------------------------------------------

/**
 * A single rule used to evaluate the syntactic form of a drill response.
 * The scoring engine applies each rule to the user's answer and combines
 * weighted results into a "form" score (one of the 4 scoring dimensions).
 */
export type SyntaxRule = {
  /** Unique identifier within the technique's rule set (e.g., 'opener-match') */
  id: string;

  /**
   * Discriminator for how the pattern is evaluated:
   * - 'regex'     — response MUST match this pattern (pass = present)
   * - 'negation'  — response MUST NOT match this pattern (pass = absent)
   * - 'inclusion' — response MUST contain this substring/pattern (case-insensitive)
   */
  type: "regex" | "negation" | "inclusion";

  /**
   * Regular expression string (without delimiters) evaluated against the
   * user's response. Use anchors (^/$) where applicable.
   */
  pattern: string;

  /**
   * 2-3 illustrative examples.
   * - For 'regex' and 'inclusion': correct examples that match the pattern.
   * - For 'negation': incorrect examples that trigger the rule (i.e., things
   *   the user should NOT write).
   */
  examples?: string[];

  /**
   * Contribution to the overall form score (0-1).
   * Defaults to 1.0 if absent.
   * Allows rules to be weighted differently (e.g., a critical stem check
   * vs. a secondary style check).
   */
  weight?: number;
};

// ---------------------------------------------------------------------------
// Technique
// ---------------------------------------------------------------------------

/**
 * A communication technique available in the drill engine.
 * The id is a human-readable slug that serves as the Record key in
 * DrillDataStore.techniques and as technique_id in Scenario.
 */
export type Technique = {
  /** Human-readable slug (e.g., 'mirroring', 'labeling', 'open-ended-question') */
  id: string;

  /** Display name (e.g., "Mirroring", "Labeling") */
  name: string;

  /** One-paragraph explanation of the technique and its purpose */
  description: string;

  /** Source framework */
  framework: "Voss" | "MI" | "CBT" | "NVC";

  /**
   * Skill-tree tier:
   * - 'A' — drill-first (strong verbal template, suits isolated practice)
   * - 'B' — simulation-preferred (context-dependent, needs full conversation)
   * - 'C' — both (suitable for drills AND simulation)
   */
  tier: "A" | "B" | "C";

  /**
   * Spaced repetition decay rate category:
   * - 'syntax'      — learnable verbal pattern, fastest decay (0.08/month)
   * - 'judgment'    — context-dependent skill, medium decay (0.06/month)
   * - 'recognition' — identify-the-technique, slowest decay
   */
  skill_type: "syntax" | "judgment" | "recognition";

  /**
   * The active drill format in v3.0.
   * Literal type ensures the engine only schedules supported formats.
   * Additional formats (audio-spoken, multiple-choice, rewrite, spot-the-technique)
   * will be activated in Phase 20+.
   */
  primary_format: "prompt-response";

  /**
   * All formats this technique supports (including future activations).
   * e.g., ['prompt-response', 'audio-spoken', 'multiple-choice']
   */
  supported_formats: string[];

  /**
   * Verbal template the user should follow when forming a response.
   * e.g., "It seems/sounds/looks like [observation]."
   */
  syntax_template: string;

  /**
   * Ordered set of rules the scoring engine applies to evaluate form.
   * Each rule covers a required pattern, a forbidden pattern, or a
   * required inclusion.
   */
  syntax_rules: SyntaxRule[];

  /**
   * Technique IDs that should be practiced before this one (soft prerequisite).
   * Used by the skill DAG in Phase 22+ for unlock sequencing.
   */
  prerequisites?: string[];

  /**
   * Relative difficulty on a 1-3 scale:
   * 1 = foundational, 2 = intermediate, 3 = advanced
   */
  difficulty?: number;
};

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

/**
 * A single practice prompt for a technique.
 * The id uses a short prefix + sequential number (e.g., 'mirror-1', 'label-3').
 */
export type Scenario = {
  /** Unique identifier across all scenarios (e.g., 'mirror-1', 'label-3') */
  id: string;

  /** ID of the technique this scenario drills (matches Technique.id) */
  technique_id: string;

  /**
   * Full user-facing prompt text.
   * Combines: context (1-2 sentences) + counterpart statement + instruction.
   * e.g., "A colleague says: '...' Respond using mirroring."
   */
  prompt: string;

  /**
   * Verbal template reminder shown alongside the prompt.
   * Copied from Technique.syntax_template for display convenience.
   */
  syntax_template: string;

  /** A correct, high-quality example response the evaluator uses as reference */
  model_answer: string;

  /**
   * Difficulty on a 1-3 scale.
   * v3.0 uses only 1 and 2; level 3 reserved for future scenario sets.
   */
  difficulty_level: number;

  /**
   * 1-2 sentence guidance for the Phase 20 LLM evaluator.
   * Specifies what to reward, what to penalize, and edge cases to handle.
   */
  evaluation_notes?: string;

  /**
   * Thematic tags for filtering and curriculum sequencing.
   * Deferred to Phase 23 — include field but leave as empty array.
   */
  context_tags?: string[];

  /**
   * Emotional state of the counterpart in the scenario.
   * Deferred to Phase 23 — include field but leave as undefined.
   */
  counterpart_mood?: string;
};

// ---------------------------------------------------------------------------
// DrillDataStore
// ---------------------------------------------------------------------------

/**
 * Root structure stored in localStorage under 'kdenz:drill-data'.
 * Seeded on first app boot by initDrillData() in src/utils/drill-storage.ts.
 *
 * Phase 21 will add userProgress: Record<string, UserTechniqueProgress>
 * to this interface for mastery tracking and spaced repetition state.
 */
export interface DrillDataStore {
  /**
   * Schema version string (e.g., '3.0').
   * Checked on boot to detect version mismatch and trigger re-seeding.
   */
  version: string;

  /**
   * All available techniques, keyed by technique ID slug.
   * e.g., { mirroring: Technique, labeling: Technique, ... }
   */
  techniques: Record<string, Technique>;

  /**
   * All drill scenarios grouped by technique ID.
   * e.g., { mirroring: Scenario[], labeling: Scenario[], ... }
   */
  scenarios: Record<string, Scenario[]>;
}
