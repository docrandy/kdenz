/**
 * src/utils/instituteStorage.ts
 *
 * localStorage persistence for Institute content progress.
 *
 * Tracks three content ID lists:
 *   - consumed: content the user has finished
 *   - prescribed: content currently recommended to the user
 *   - dismissed: content the user explicitly declined
 *
 * Storage key: 'kdenz:institute-progress'
 */

const STORAGE_KEY = "kdenz:institute-progress";

interface InstituteProgress {
  consumed: string[];
  prescribed: string[];
  dismissed: string[];
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getProgress(): InstituteProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { consumed: [], prescribed: [], dismissed: [] };
    const parsed = JSON.parse(raw) as Partial<InstituteProgress>;
    return {
      consumed: Array.isArray(parsed.consumed) ? parsed.consumed : [],
      prescribed: Array.isArray(parsed.prescribed) ? parsed.prescribed : [],
      dismissed: Array.isArray(parsed.dismissed) ? parsed.dismissed : [],
    };
  } catch {
    return { consumed: [], prescribed: [], dismissed: [] };
  }
}

function saveProgress(progress: InstituteProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn("[InstituteStorage] Failed to save progress");
  }
}

function appendToList(
  progress: InstituteProgress,
  list: keyof InstituteProgress,
  id: string,
): InstituteProgress {
  if (progress[list].includes(id)) return progress;
  return { ...progress, [list]: [...progress[list], id] };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns the current Institute progress object.
 */
export function getInstituteProgress(): InstituteProgress {
  return getProgress();
}

/**
 * Marks a content item as consumed (finished by the user).
 * Deduplicates before appending.
 */
export function markContentConsumed(id: string): void {
  const progress = getProgress();
  saveProgress(appendToList(progress, "consumed", id));
}

/**
 * Marks a content item as prescribed (recommended to the user).
 * Deduplicates before appending.
 */
export function markContentPrescribed(id: string): void {
  const progress = getProgress();
  saveProgress(appendToList(progress, "prescribed", id));
}

/**
 * Marks a content item as dismissed (explicitly declined by the user).
 * Deduplicates before appending.
 */
export function markContentDismissed(id: string): void {
  const progress = getProgress();
  saveProgress(appendToList(progress, "dismissed", id));
}
