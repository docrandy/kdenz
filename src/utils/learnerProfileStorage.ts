/**
 * src/utils/learnerProfileStorage.ts
 *
 * Assembles and persists the LearnerProfile used for content routing.
 *
 * The LearnerProfile aggregates from multiple localStorage sources:
 *   - Pattern history: kdenz:pattern-history (this file)
 *   - Aspiration: kdenz:user-aspiration (via aspirationStorage)
 *   - Institute progress: kdenz:institute-progress (via instituteStorage)
 *   - Skill mastery stubs: empty arrays until Phase 21
 *   - VCM gate stubs: empty arrays until Phase 24
 */

import type { PatternType } from "../types/simulation";
import type { LearnerProfile } from "../types/institute";
import { getAspiration } from "./aspirationStorage";
import { getInstituteProgress } from "./instituteStorage";

const PATTERN_HISTORY_KEY = "kdenz:pattern-history";
const MAX_PATTERN_HISTORY = 10;

// ---------------------------------------------------------------------------
// Internal: pattern history
// ---------------------------------------------------------------------------

function getPatternHistory(): PatternType[] {
  try {
    const raw = localStorage.getItem(PATTERN_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as PatternType[];
  } catch {
    return [];
  }
}

/**
 * Calculates confidence level based on pattern history consistency.
 *
 * Rules:
 *   - 'high': the same pattern appears in >= 70% of history AND 5+ sessions
 *   - 'medium': the same pattern appears in >= 40% of history OR 3+ sessions with any pattern
 *   - 'low': everything else (< 3 sessions or no dominant pattern)
 */
function calculateConfidence(
  history: PatternType[],
  current: PatternType | null,
): "low" | "medium" | "high" {
  if (!current || history.length < 3) return "low";

  const totalSessions = history.length;
  const matchCount = history.filter((p) => p === current).length;
  const matchRatio = matchCount / totalSessions;

  if (matchRatio >= 0.7 && totalSessions >= 5) return "high";
  if (matchRatio >= 0.4 || totalSessions >= 3) return "medium";
  return "low";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Assembles the full LearnerProfile from all available localStorage sources.
 *
 * This is the single entry point for content routing — call this before
 * invoking scoreContentItem() or getTopContent().
 */
export function getLearnerProfile(): LearnerProfile {
  const history = getPatternHistory();
  const current = history.length > 0 ? history[history.length - 1] : null;
  const confidence = calculateConfidence(history, current);

  const aspiration = getAspiration();
  const progress = getInstituteProgress();

  return {
    current_pattern: current,
    pattern_history: history,
    pattern_confidence: confidence,
    stated_aspiration: aspiration?.primary_archetype_id ?? null,

    // Stubs — Phase 21 mastery tracking will populate these
    mastered_technique_ids: [],
    attempted_technique_ids: [],

    // Intentionally empty until Phase 21 fills skill gaps from mastery data
    skill_gaps: [],

    consumed_content_ids: progress.consumed,
    prescribed_content_ids: progress.prescribed,
    dismissed_content_ids: progress.dismissed,

    // Stub — Phase 24 VCM diagnostics will populate these
    vcm_gate_failures: [],
  };
}

/**
 * Adds a detected pattern to the rolling history window.
 *
 * Maintains MAX_PATTERN_HISTORY (10) entries — oldest are dropped
 * when the window is full.
 */
export function addPatternToHistory(pattern: PatternType): void {
  try {
    const history = getPatternHistory();
    const updated = [...history, pattern].slice(-MAX_PATTERN_HISTORY);
    localStorage.setItem(PATTERN_HISTORY_KEY, JSON.stringify(updated));
  } catch {
    console.warn("[LearnerProfileStorage] Failed to save pattern history");
  }
}
