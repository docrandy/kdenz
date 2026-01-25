/**
 * Silence Semantics (TF-02)
 *
 * Clear distinction between silence types for accurate metrics.
 *
 * DEFINITIONS:
 * - Unfilled Pause: Natural silence between words/phrases (< 2.0s)
 *   → NOT counted as problematic, part of normal speech rhythm
 *   → Used for WPM calculation (excluded from speaking time)
 *
 * - Extended Silence: Continuous VAD silence > 2.0s threshold
 *   → Triggers silence nudge
 *   → Counted in session statistics
 *   → May indicate loss of thought, nervousness, etc.
 *
 * - Filled Pause: Vocalized hesitation (um, uh, like, you know)
 *   → Detected by FillerDetector
 *   → Counted in filler metrics
 *   → NOT silence (VAD shows speech during fillers)
 *
 * IMPORTANT: WPM is calculated from VAD-active time only.
 * Wall-clock time minus silence gives speaking time.
 */

/**
 * Silence classification
 */
export type SilenceType =
  | 'unfilled_pause'    // Natural brief pause (< threshold)
  | 'extended_silence'  // Problematic silence (>= threshold)
  | 'none';             // Currently speaking

/**
 * Default silence threshold in milliseconds
 * User can configure this in settings
 */
export const DEFAULT_SILENCE_THRESHOLD_MS = 2000;

/**
 * Minimum pause duration to be considered a pause at all
 * Anything shorter is just normal speech rhythm
 */
export const MIN_PAUSE_DURATION_MS = 300;

/**
 * Silence metrics for a session
 */
export interface SilenceMetrics {
  /** Count of extended silences (>= threshold) */
  extendedSilenceCount: number;
  /** Longest single silence duration (ms) */
  longestSilenceDuration: number;
  /** Total time spent in extended silence (ms) */
  totalExtendedSilenceTime: number;
  /** All silence events with timestamps */
  silenceEvents: SilenceEvent[];
}

/**
 * Individual silence event
 */
export interface SilenceEvent {
  /** Start time relative to session (ms) */
  startTime: number;
  /** End time relative to session (ms) */
  endTime: number;
  /** Duration (ms) */
  duration: number;
  /** Classification */
  type: SilenceType;
}

/**
 * Classify a silence duration
 */
export function classifySilence(
  durationMs: number,
  thresholdMs: number = DEFAULT_SILENCE_THRESHOLD_MS
): SilenceType {
  if (durationMs < MIN_PAUSE_DURATION_MS) {
    return 'none'; // Too short to be a meaningful pause
  }
  if (durationMs >= thresholdMs) {
    return 'extended_silence';
  }
  return 'unfilled_pause';
}

/**
 * Calculate speaking time from total time and silence events
 *
 * Speaking Time = Total Time - Sum of all silences
 *
 * This is used for accurate WPM calculation.
 */
export function calculateSpeakingTime(
  totalDurationMs: number,
  silenceEvents: SilenceEvent[]
): number {
  const totalSilence = silenceEvents.reduce(
    (sum, event) => sum + event.duration,
    0
  );
  return Math.max(0, totalDurationMs - totalSilence);
}

/**
 * Create initial silence metrics
 */
export function createSilenceMetrics(): SilenceMetrics {
  return {
    extendedSilenceCount: 0,
    longestSilenceDuration: 0,
    totalExtendedSilenceTime: 0,
    silenceEvents: [],
  };
}

/**
 * Add a silence event to metrics
 */
export function addSilenceEvent(
  metrics: SilenceMetrics,
  event: SilenceEvent
): SilenceMetrics {
  const newMetrics = {
    ...metrics,
    silenceEvents: [...metrics.silenceEvents, event],
    longestSilenceDuration: Math.max(metrics.longestSilenceDuration, event.duration),
  };

  if (event.type === 'extended_silence') {
    newMetrics.extendedSilenceCount = metrics.extendedSilenceCount + 1;
    newMetrics.totalExtendedSilenceTime = metrics.totalExtendedSilenceTime + event.duration;
  }

  return newMetrics;
}
