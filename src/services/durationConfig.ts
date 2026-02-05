export const DURATION_OPTIONS = [
  { value: 60, label: '1 min', seconds: 60 },
  { value: 120, label: '2 min', seconds: 120 },
  { value: 180, label: '3 min', seconds: 180 },
  { value: 0, label: 'Unlimited', seconds: 0 },  // 0 = unlimited
] as const;

export const DEFAULT_DURATION_SECONDS = 120; // 2 minutes
export const LAST_DURATION_KEY = 'voicelab_last_duration';

/**
 * Retrieve the last used duration from localStorage
 * @returns Last duration in seconds, or default if not found/invalid
 */
export function getLastDuration(): number {
  try {
    const stored = localStorage.getItem(LAST_DURATION_KEY);
    if (stored === null) return DEFAULT_DURATION_SECONDS;

    const parsed = parseInt(stored, 10);

    // Validate it's one of our options
    if (DURATION_OPTIONS.some(opt => opt.value === parsed)) {
      return parsed;
    }

    return DEFAULT_DURATION_SECONDS;
  } catch {
    return DEFAULT_DURATION_SECONDS;
  }
}

/**
 * Save the selected duration to localStorage
 */
export function saveLastDuration(seconds: number): void {
  try {
    localStorage.setItem(LAST_DURATION_KEY, String(seconds));
  } catch {
    // Storage not available - fail silently
  }
}
