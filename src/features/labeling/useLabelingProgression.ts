/**
 * useLabelingProgression — Tracks user's labeling drill level and advancement
 *
 * Persisted in localStorage under key "labeling_progression".
 *
 * Advancement rules:
 *   Level 1 → Level 2: 3 consecutive correct flashcard answers
 *   Level 2 → Level 3: 3 consecutive drills where depth >= 'underlying'
 *   Level 3+ → TBD (not implemented yet)
 */

import { useState, useCallback } from "react";
import type { LabelingProgression } from "./types";

const STORAGE_KEY = "labeling_progression";
const ADVANCEMENT_THRESHOLD = 3;

function loadProgression(): LabelingProgression {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // corrupt data — reset
  }
  return {
    currentLevel: 1,
    consecutiveSuccesses: 0,
    totalAttempts: 0,
    levelHistory: [],
  };
}

function saveProgression(p: LabelingProgression) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage unavailable
  }
}

export function useLabelingProgression() {
  const [progression, setProgression] =
    useState<LabelingProgression>(loadProgression);

  const persist = useCallback((next: LabelingProgression) => {
    setProgression(next);
    saveProgression(next);
  }, []);

  const recordSuccess = useCallback(() => {
    setProgression((prev) => {
      const next: LabelingProgression = {
        ...prev,
        consecutiveSuccesses: prev.consecutiveSuccesses + 1,
        totalAttempts: prev.totalAttempts + 1,
      };
      saveProgression(next);
      return next;
    });
  }, []);

  const recordFailure = useCallback(() => {
    setProgression((prev) => {
      const next: LabelingProgression = {
        ...prev,
        consecutiveSuccesses: 0,
        totalAttempts: prev.totalAttempts + 1,
      };
      saveProgression(next);
      return next;
    });
  }, []);

  const shouldAdvance = useCallback((): boolean => {
    return progression.consecutiveSuccesses >= ADVANCEMENT_THRESHOLD;
  }, [progression.consecutiveSuccesses]);

  const advanceLevel = useCallback(() => {
    setProgression((prev) => {
      const next: LabelingProgression = {
        currentLevel: prev.currentLevel + 1,
        consecutiveSuccesses: 0,
        totalAttempts: prev.totalAttempts,
        levelHistory: [
          ...prev.levelHistory,
          {
            level: prev.currentLevel,
            completedAt: Date.now(),
            attempts: prev.totalAttempts,
          },
        ],
      };
      saveProgression(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh: LabelingProgression = {
      currentLevel: 1,
      consecutiveSuccesses: 0,
      totalAttempts: 0,
      levelHistory: [],
    };
    persist(fresh);
  }, [persist]);

  return {
    progression,
    recordSuccess,
    recordFailure,
    shouldAdvance,
    advanceLevel,
    resetProgress,
  };
}
