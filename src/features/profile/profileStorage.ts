/**
 * Profile Storage Service
 * Persists user profile to localStorage
 */

import type { UserProfile, MiscNote, ProfileCategory } from './types';
import { createEmptyProfile, migrateProfile } from './types';

const STORAGE_KEY = 'voicelab_user_profile';

/**
 * Get the user profile from storage
 * Handles migration from old profile structure to new
 */
export function getProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);

      // Check if migration needed (old structure has 'basics' but not 'demographics')
      if (profile.basics && !profile.demographics) {
        console.log('Migrating profile to new structure...');
        const migrated = migrateProfile(profile);
        saveProfile(migrated);
        return migrated;
      }

      // Ensure required fields exist
      if (!profile.miscellaneous) profile.miscellaneous = [];
      if (!profile.demographics) profile.demographics = {};
      if (!profile.longTermGoals) profile.longTermGoals = { category: 'business' };
      if (!profile.focusAreas) profile.focusAreas = { category: 'business' };
      if (!profile.selfAssessment) profile.selfAssessment = { useTextInput: false };

      return profile as UserProfile;
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
  return createEmptyProfile();
}

/**
 * Save the user profile to storage
 */
export function saveProfile(profile: UserProfile): void {
  try {
    profile.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile:', error);
  }
}

/**
 * Update a specific field in the profile
 */
export function updateProfileField<K extends keyof UserProfile>(
  category: K,
  field: keyof UserProfile[K],
  value: any
): UserProfile {
  const profile = getProfile();
  (profile[category] as any)[field] = value;
  saveProfile(profile);
  return profile;
}

/**
 * Add a quick note to miscellaneous
 */
export function addMiscNote(
  content: string,
  suggestedCategory?: ProfileCategory
): UserProfile {
  const profile = getProfile();
  const note: MiscNote = {
    id: `note-${Date.now()}`,
    createdAt: Date.now(),
    content,
    suggestedCategory,
    categorized: false,
  };
  profile.miscellaneous.push(note);
  saveProfile(profile);
  return profile;
}

/**
 * Remove a misc note (after categorizing)
 */
export function removeMiscNote(noteId: string): UserProfile {
  const profile = getProfile();
  profile.miscellaneous = profile.miscellaneous.filter(n => n.id !== noteId);
  saveProfile(profile);
  return profile;
}

/**
 * Mark a misc note as categorized
 */
export function markNoteCategorized(noteId: string): UserProfile {
  const profile = getProfile();
  const note = profile.miscellaneous.find(n => n.id === noteId);
  if (note) {
    note.categorized = true;
  }
  saveProfile(profile);
  return profile;
}

/**
 * Get uncategorized notes count
 */
export function getUncategorizedNotesCount(): number {
  const profile = getProfile();
  return profile.miscellaneous.filter(n => !n.categorized).length;
}

/**
 * Clear entire profile (for testing/reset)
 */
export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Export profile data (for backup or data portability)
 */
export function exportProfile(): string {
  const profile = getProfile();
  return JSON.stringify(profile, null, 2);
}

/**
 * Import profile data
 */
export function importProfile(jsonString: string): boolean {
  try {
    const profile = JSON.parse(jsonString) as UserProfile;
    if (profile.id && profile.createdAt) {
      saveProfile(profile);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
