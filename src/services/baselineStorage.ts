const STORAGE_KEY = 'voicelab_baseline';

export interface BaselineMetrics {
  wpm: number;           // words per minute
  fillerRate: number;    // fillers per minute
  fillerCount: number;   // total fillers in baseline session
  pauseRate: number;     // pauses per minute (estimated from silence detection)
  wordCount: number;     // total words spoken
  durationSeconds: number; // actual duration of baseline
  timestamp: number;     // when baseline was recorded (Date.now())
}

export const BASELINE_DURATION_SECONDS = 180; // 3 minutes

/**
 * Save baseline metrics to localStorage
 */
export function saveBaseline(metrics: BaselineMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
  } catch {
    // Storage not available - fail silently
  }
}

/**
 * Retrieve baseline metrics from localStorage
 * @returns BaselineMetrics if found and valid, null otherwise
 */
export function getBaseline(): BaselineMetrics | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Basic validation - check required fields exist
    if (
      typeof parsed.wpm !== 'number' ||
      typeof parsed.fillerRate !== 'number' ||
      typeof parsed.timestamp !== 'number'
    ) {
      return null;
    }

    return parsed as BaselineMetrics;
  } catch {
    return null;
  }
}

/**
 * Check if a valid baseline exists in localStorage
 */
export function hasBaseline(): boolean {
  return getBaseline() !== null;
}

/**
 * Clear baseline from localStorage
 */
export function clearBaseline(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage not available - fail silently
  }
}
