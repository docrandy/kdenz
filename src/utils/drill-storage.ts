/**
 * src/utils/drill-storage.ts
 *
 * localStorage initialization and access helpers for the v3.0 Generic Drill Engine.
 *
 * Key: 'kdenz:drill-data' (colon separator — distinct from existing underscore-keyed
 * keys 'kdenz_labeling_attempts' and 'kdenz_labeling_patterns').
 *
 * Version: '3.0'
 * The version field enables future migrations. Phase 20 may increment to '3.1', etc.
 * This file only handles the seed check — no complex migration system.
 *
 * NOTE: No destructive exports (clearDrillData etc.) in Phase 19.
 * Phase 20 can add those if needed.
 */

import { DrillDataStore, Technique, Scenario } from "../types/drill";
import { drillTechniques } from "../data/drill-techniques";
import { drillScenarios } from "../data/drill-scenarios";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRILL_STORAGE_KEY = "kdenz:drill-data";
const DRILL_DATA_VERSION = "3.0";

// ---------------------------------------------------------------------------
// initDrillData
// ---------------------------------------------------------------------------

/**
 * Seeds 'kdenz:drill-data' in localStorage on first load.
 *
 * Idempotent: if the key already exists with the correct version, returns
 * immediately without writing. If the key is absent or the version does not
 * match, writes the full data store.
 *
 * Graceful degradation: if localStorage is unavailable (e.g., private
 * browsing with storage blocked), logs a warning and returns — does not throw.
 */
export function initDrillData(): void {
  try {
    const existing = localStorage.getItem(DRILL_STORAGE_KEY);

    if (existing !== null) {
      try {
        const parsed = JSON.parse(existing) as DrillDataStore;
        if (parsed.version === DRILL_DATA_VERSION) {
          // Data is present and version matches — nothing to do.
          return;
        }
      } catch {
        // Corrupt JSON — fall through to re-seed.
      }
    }

    // Either key is absent or version does not match — seed with initial data.
    const store: DrillDataStore = {
      version: DRILL_DATA_VERSION,
      techniques: drillTechniques,
      scenarios: drillScenarios,
    };

    localStorage.setItem(DRILL_STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.warn(
      "[drill-storage] localStorage unavailable — drill data will not be persisted.",
      err,
    );
  }
}

// ---------------------------------------------------------------------------
// getDrillData
// ---------------------------------------------------------------------------

/**
 * Returns the full DrillDataStore from localStorage, or null if absent or
 * unparseable.
 */
export function getDrillData(): DrillDataStore | null {
  try {
    const raw = localStorage.getItem(DRILL_STORAGE_KEY);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw) as DrillDataStore;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// getTechnique
// ---------------------------------------------------------------------------

/**
 * Returns the Technique with the given id, or undefined if not found.
 *
 * @param id  Human-readable technique slug (e.g., 'mirroring', 'labeling').
 */
export function getTechnique(id: string): Technique | undefined {
  const data = getDrillData();
  return data?.techniques[id];
}

// ---------------------------------------------------------------------------
// getScenariosForTechnique
// ---------------------------------------------------------------------------

/**
 * Returns all Scenario objects for a given technique id.
 * Returns an empty array if the technique has no scenarios or data is absent.
 *
 * @param techniqueId  Technique slug (e.g., 'labeling').
 */
export function getScenariosForTechnique(techniqueId: string): Scenario[] {
  const data = getDrillData();
  return data?.scenarios[techniqueId] ?? [];
}

// ---------------------------------------------------------------------------
// getScenarioById
// ---------------------------------------------------------------------------

/**
 * Returns a single Scenario by its id within a technique's scenario list.
 * Returns undefined if not found.
 *
 * @param techniqueId  Technique slug (e.g., 'labeling').
 * @param scenarioId   Scenario id (e.g., 'label-1').
 */
export function getScenarioById(
  techniqueId: string,
  scenarioId: string,
): Scenario | undefined {
  const scenarios = getScenariosForTechnique(techniqueId);
  return scenarios.find((s) => s.id === scenarioId);
}
