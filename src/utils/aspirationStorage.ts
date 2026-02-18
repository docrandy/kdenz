import type { UserAspiration } from "../types/aspiration";

const STORAGE_KEY = "kdenz:user-aspiration";

export function getAspiration(): UserAspiration | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserAspiration;
  } catch {
    return null;
  }
}

export function saveAspiration(aspiration: UserAspiration): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(aspiration));
  } catch {
    console.warn("[AspirationStorage] Failed to save");
  }
}

export function hasAspiration(): boolean {
  return getAspiration() !== null;
}
