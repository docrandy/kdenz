/**
 * Accusation Audit Storage
 * Persists attempts and patterns to localStorage
 */

import type {
  AuditAttempt,
  AuditPatterns,
  MissedCriticism,
  ScoreHistoryEntry,
} from './types';
import { detectDefensivePhrases } from './auditAnalyzer';
import { AUDIT_SCENARIOS } from './scenarios';

const STORAGE_KEY = 'kdenz_audit_attempts';
const PATTERNS_KEY = 'kdenz_audit_patterns';
const MAX_ATTEMPTS = 100; // Keep last 100 attempts

/**
 * Save an audit attempt
 */
export function saveAuditAttempt(attempt: AuditAttempt): void {
  const attempts = getAuditAttempts();
  attempts.push(attempt);

  // Keep only last N attempts
  const trimmed = attempts.slice(-MAX_ATTEMPTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  // Update patterns
  updatePatterns(trimmed);
}

/**
 * Get all saved audit attempts
 */
export function getAuditAttempts(): AuditAttempt[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as AuditAttempt[];
  } catch {
    return [];
  }
}

/**
 * Get attempts for a specific scenario
 */
export function getAttemptsForScenario(scenarioId: string): AuditAttempt[] {
  return getAuditAttempts().filter((a) => a.scenarioId === scenarioId);
}

/**
 * Get recent attempts (last N)
 */
export function getRecentAttempts(count: number = 10): AuditAttempt[] {
  return getAuditAttempts().slice(-count);
}

/**
 * Update pattern analysis based on all attempts
 */
function updatePatterns(attempts: AuditAttempt[]): void {
  if (attempts.length === 0) {
    localStorage.removeItem(PATTERNS_KEY);
    return;
  }

  const transcripts = attempts.map((a) => a.transcript);

  // Calculate average score
  const averageScore =
    attempts.reduce((sum, a) => sum + a.analysis.overallScore, 0) /
    attempts.length;

  // Calculate average coverage
  const avgCoverage =
    attempts.reduce((sum, a) => sum + a.analysis.coverage.coveragePercent, 0) /
    attempts.length;

  // Track commonly missed criticisms
  const missedCounts = new Map<string, MissedCriticism>();

  for (const attempt of attempts) {
    const scenario = AUDIT_SCENARIOS.find(s => s.id === attempt.scenarioId);
    if (!scenario) continue;

    for (const missedId of attempt.analysis.coverage.criticismsMissed) {
      const criticism = scenario.commonCriticisms.find(c => c.id === missedId);
      if (!criticism) continue;

      const key = `${attempt.scenarioId}-${missedId}`;
      const existing = missedCounts.get(key);

      if (existing) {
        existing.missCount++;
        existing.lastMissed = attempt.timestamp;
      } else {
        missedCounts.set(key, {
          criticismId: missedId,
          criticismText: criticism.text,
          missCount: 1,
          lastMissed: attempt.timestamp,
        });
      }
    }
  }

  // Get most commonly missed
  const commonMisses = Array.from(missedCounts.values())
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 5);

  // Detect defensive phrases used
  const defenseTriggers = detectDefensivePhrases(transcripts);

  // Build score history
  const scoreHistory: ScoreHistoryEntry[] = attempts.map((a) => ({
    timestamp: a.timestamp,
    scenarioId: a.scenarioId,
    score: a.analysis.overallScore,
    coverage: a.analysis.coverage.coveragePercent,
  }));

  // Coverage history
  const coverageHistory = attempts.map(a => a.analysis.coverage.coveragePercent);

  // Determine improvement trend (compare first half to second half)
  let improvementTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (attempts.length >= 6) {
    const midpoint = Math.floor(attempts.length / 2);
    const firstHalf = attempts.slice(0, midpoint);
    const secondHalf = attempts.slice(midpoint);

    const firstAvg =
      firstHalf.reduce((sum, a) => sum + a.analysis.overallScore, 0) /
      firstHalf.length;
    const secondAvg =
      secondHalf.reduce((sum, a) => sum + a.analysis.overallScore, 0) /
      secondHalf.length;

    const diff = secondAvg - firstAvg;
    if (diff > 5) improvementTrend = 'improving';
    else if (diff < -5) improvementTrend = 'declining';
  }

  const patterns: AuditPatterns = {
    totalAttempts: attempts.length,
    averageScore,
    avgCoverage,
    commonMisses,
    defenseTriggers,
    scoreHistory,
    coverageHistory,
    improvementTrend,
  };

  localStorage.setItem(PATTERNS_KEY, JSON.stringify(patterns));
}

/**
 * Get current patterns analysis
 */
export function getAuditPatterns(): AuditPatterns | null {
  const stored = localStorage.getItem(PATTERNS_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuditPatterns;
  } catch {
    return null;
  }
}

/**
 * Clear all audit data
 */
export function clearAuditData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PATTERNS_KEY);
}
