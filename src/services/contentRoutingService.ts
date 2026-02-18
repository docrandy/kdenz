/**
 * src/services/contentRoutingService.ts
 *
 * Content routing algorithm for Institute personalization.
 *
 * Scores each Institute content item against the learner's profile and
 * returns the top N items most relevant to their current pattern,
 * stated aspiration, skill gaps, and VCM gate failures.
 *
 * Scoring weights:
 *   Pattern match     +50  (addresses the user's detected communicator pattern)
 *   Aspiration match  +30  (supports the user's target voice archetype)
 *   Skill gap match   +20  (covers a technique the user hasn't mastered yet)
 *                          — intentionally inactive until Phase 21 fills skill_gaps
 *   VCM gate match    +10  (targets a detected VCM gate failure)
 *                          — stub until Phase 24 VCM diagnostics
 *
 * Penalties:
 *   Already consumed  -100 (don't re-recommend finished content)
 *   Dismissed         -100 (user explicitly declined)
 *   Unmet prereqs     -50  (can't unlock yet)
 *
 * Surface order: score desc, then tier asc (lower tier surfaces first on ties).
 */

import type { InstituteContentItem, LearnerProfile } from "../types/institute";
import { INSTITUTE_CONTENT } from "../data/instituteContent";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * A content item with its computed routing score and reason string.
 * Consumed by debrief cards and Institute recommendation rails.
 */
export interface ScoredContent {
  item: InstituteContentItem;

  /**
   * Composite routing score. Positive = recommend. Negative or zero = suppress.
   * Score > 0 required for inclusion in getTopContent() results.
   */
  score: number;

  /**
   * Human-readable reason why this item was surfaced.
   * Used in debrief cards and recommendation tooltips.
   * Examples: "Addresses your hedger pattern", "Builds toward your target voice"
   */
  reason: string;
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

/**
 * Scores a single content item against the learner profile.
 *
 * Returns a ScoredContent with the composite score and primary reason string.
 * Items with score <= 0 should not be surfaced.
 */
export function scoreContentItem(
  item: InstituteContentItem,
  profile: LearnerProfile,
): ScoredContent {
  let score = 0;
  const reasons: string[] = [];

  // Pattern match (50 points)
  if (
    profile.current_pattern &&
    item.addresses_patterns.includes(profile.current_pattern)
  ) {
    score += 50;
    const patternLabel = profile.current_pattern.replace(/-/g, " ");
    reasons.push(`Addresses your ${patternLabel} pattern`);
  }

  // Aspiration match (30 points)
  if (
    profile.stated_aspiration &&
    item.supports_aspirations.includes(profile.stated_aspiration)
  ) {
    score += 30;
    reasons.push("Builds toward your target voice");
  }

  // Skill gap match (20 points)
  // Intentionally inactive until Phase 21 fills profile.skill_gaps
  const gapOverlap = item.technique_ids.filter((t) =>
    profile.skill_gaps.includes(t),
  );
  if (gapOverlap.length > 0) {
    score += 20;
    reasons.push("Covers a technique you are still building");
  }

  // VCM gate match (10 points)
  // Stub — empty until Phase 24 VCM diagnostics populate vcm_gate_failures
  const gateOverlap = item.vcm_gates.filter((g) =>
    profile.vcm_gate_failures.includes(g),
  );
  if (gateOverlap.length > 0) {
    score += 10;
    reasons.push("Targets your current practice barrier");
  }

  // Penalties
  if (profile.consumed_content_ids.includes(item.id)) {
    score -= 100; // Already finished — don't re-recommend
  }
  if (profile.dismissed_content_ids.includes(item.id)) {
    score -= 100; // User explicitly declined
  }

  // Unmet prerequisites penalty
  const unmetPrereqs = item.prerequisite_ids.filter(
    (prereqId) => !profile.consumed_content_ids.includes(prereqId),
  );
  if (unmetPrereqs.length > 0) {
    score -= 50; // Prerequisites not yet completed
  }

  const reason = reasons.length > 0 ? reasons[0] : "Recommended for your level";

  return { item, score, reason };
}

// ---------------------------------------------------------------------------
// Top-N selection
// ---------------------------------------------------------------------------

/**
 * Returns the top N content items ranked by score for this learner profile.
 *
 * @param profile - Assembled LearnerProfile from getLearnerProfile()
 * @param count - Maximum number of items to return (default: 2)
 * @param debriefOnly - If true, only return debrief_eligible items
 *
 * Items with score <= 0 are excluded. Ties broken by tier (lower = higher priority).
 */
export function getTopContent(
  profile: LearnerProfile,
  count: number = 2,
  debriefOnly: boolean = false,
): ScoredContent[] {
  let items = INSTITUTE_CONTENT;

  if (debriefOnly) {
    items = items.filter((item) => item.debrief_eligible);
  }

  return items
    .map((item) => scoreContentItem(item, profile))
    .filter((s) => s.score > 0)
    .sort((a, b) => {
      // Primary: score descending
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: tier ascending (lower tier surfaces first on ties)
      return a.item.tier - b.item.tier;
    })
    .slice(0, count);
}

// ---------------------------------------------------------------------------
// Debrief hook formatting
// ---------------------------------------------------------------------------

/**
 * Replaces placeholder tokens in a debrief hook string with session data.
 *
 * Supported placeholders:
 *   {count}        — number of pattern occurrences detected (e.g., hedge count)
 *   {avgWordCount} — average word count per exchange
 *
 * @param hook - Raw debrief_hook string from InstituteContentItem
 * @param sessionData - Session metrics to inject into the hook
 */
export function formatDebriefHook(
  hook: string,
  sessionData: { patternCount?: number; avgWordCount?: number },
): string {
  let formatted = hook;

  if (sessionData.patternCount !== undefined) {
    formatted = formatted.replace("{count}", String(sessionData.patternCount));
  }
  if (sessionData.avgWordCount !== undefined) {
    formatted = formatted.replace(
      "{avgWordCount}",
      String(sessionData.avgWordCount),
    );
  }

  return formatted;
}
