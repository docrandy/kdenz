/**
 * src/types/institute.ts
 *
 * Institute content tagging schema and learner profile types.
 *
 * These types connect pattern detection and aspiration to personalized
 * learning content. The routing algorithm uses these to surface 1-2
 * most relevant Institute items when the session debrief fires.
 */

import type { PatternType } from "./simulation";
import type { ArchetypeId } from "./aspiration";

// Re-export for convenience
export type { PatternType, ArchetypeId };

// ---------------------------------------------------------------------------
// Institute Content Item
// ---------------------------------------------------------------------------

/**
 * A single piece of Institute learning content with full routing tags.
 *
 * Every item carries:
 *   - addresses_patterns: which communicator patterns this helps fix
 *   - supports_aspirations: which archetype targets benefit from this
 *   - technique_ids: which Skills Lab techniques this covers
 *   - vcm_gates: which VCM gate failures this addresses
 *
 * These four tag arrays are what make personalized routing possible.
 */
export interface InstituteContentItem {
  /** Unique identifier, e.g., 'inst-001' */
  id: string;

  /** Display title */
  title: string;

  /** Content format */
  content_type:
    | "video_explainer"
    | "video_demo"
    | "before_after"
    | "article"
    | "annotated_example"
    | "exercise"
    | "quiz";

  /** Technique IDs covered (matches drill-techniques ids) */
  technique_ids: string[];

  /** Communicator patterns this content directly addresses */
  addresses_patterns: PatternType[];

  /** Voice archetypes this content supports building toward */
  supports_aspirations: ArchetypeId[];

  /** VCM gate labels this content targets (e.g., 'awareness', 'belief') */
  vcm_gates: string[];

  /** IDs of content items that must be consumed before this one */
  prerequisite_ids: string[];

  /** Curriculum tier — lower tiers surface first */
  tier: 1 | 2 | 3;

  /** Whether this item follows "practice before exposure" ordering */
  practice_before_exposure: boolean;

  /** Estimated completion time */
  duration_minutes: number;

  /** Difficulty level */
  difficulty: "intro" | "standard" | "advanced";

  /**
   * Whether this item can be surfaced in the session debrief card.
   * Debrief-eligible items appear immediately after the "holy shit moment".
   */
  debrief_eligible: boolean;

  /**
   * Hook text for debrief card — why THIS item NOW.
   * May contain {count} or {avgWordCount} placeholders.
   * Only required when debrief_eligible: true.
   */
  debrief_hook: string;

  /** Brief one-sentence description */
  description: string;
}

// ---------------------------------------------------------------------------
// Learner Profile
// ---------------------------------------------------------------------------

/**
 * Assembled learner state used for content routing.
 *
 * Aggregated from multiple localStorage sources:
 *   - Pattern history (kdenz:pattern-history)
 *   - Aspiration (kdenz:user-aspiration via aspirationStorage)
 *   - Institute progress (kdenz:institute-progress via instituteStorage)
 *   - Skill mastery stubs (Phase 21 will populate)
 *   - VCM gate stubs (Phase 24 will populate)
 */
export interface LearnerProfile {
  /** Dominant pattern from most recent session, or null if none */
  current_pattern: PatternType | null;

  /** Rolling history of detected patterns (max 10 entries) */
  pattern_history: PatternType[];

  /** Confidence level based on pattern consistency across sessions */
  pattern_confidence: "low" | "medium" | "high";

  /** User's primary archetype target, or null if not set */
  stated_aspiration: ArchetypeId | null;

  /** Technique IDs where mastery >= Proficient (stub until Phase 21) */
  mastered_technique_ids: string[];

  /** Technique IDs the user has attempted at least once (stub until Phase 21) */
  attempted_technique_ids: string[];

  /**
   * Technique IDs with skill gaps — used for content routing gap-match scoring.
   * Intentionally empty until Phase 21 mastery tracking is implemented.
   */
  skill_gaps: string[];

  /** IDs of Institute content the user has finished */
  consumed_content_ids: string[];

  /** IDs of Institute content currently prescribed to the user */
  prescribed_content_ids: string[];

  /** IDs of Institute content the user explicitly dismissed */
  dismissed_content_ids: string[];

  /**
   * VCM gate IDs where failure was detected (e.g., 'awareness', 'belief').
   * Stub — empty until Phase 24 VCM diagnostics are implemented.
   */
  vcm_gate_failures: string[];
}
