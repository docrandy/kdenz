const STORAGE_KEY = 'voicelab_settings';

export interface AppSettings {
  // Filler rate thresholds (fillers per minute)
  fillerRateGood: number;      // <= this = green
  fillerRateWarning: number;   // <= this = yellow, > = red

  // Default session duration (seconds)
  defaultDuration: number;

  // Timer warning thresholds (seconds remaining)
  timerWarning: number;        // <= this = yellow
  timerCritical: number;       // <= this = red
}

export const DEFAULT_SETTINGS: AppSettings = {
  fillerRateGood: 2,
  fillerRateWarning: 5,
  defaultDuration: 60,
  timerWarning: 10,
  timerCritical: 5,
};

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(stored) as Partial<AppSettings>;
    // Merge with defaults to handle missing keys
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetSettings(): AppSettings {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_SETTINGS };
}
