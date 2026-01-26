/**
 * Labeling Practice Storage
 * Persists attempts and patterns to localStorage
 */

import type {
  LabelAttempt,
  LabelingPatterns,
  MistakeCount,
  TemplateCount,
  ScoreHistoryEntry,
} from './types';
import {
  calculateTTR,
  detectRepetitiveTemplates,
  extractEmotionVocabulary,
} from './labelAnalyzer';

const STORAGE_KEY = 'kdenz_labeling_attempts';
const PATTERNS_KEY = 'kdenz_labeling_patterns';
const MAX_ATTEMPTS = 100; // Keep last 100 attempts

/**
 * Save a label attempt
 */
export function saveLabelAttempt(attempt: LabelAttempt): void {
  const attempts = getLabelAttempts();
  attempts.push(attempt);

  // Keep only last N attempts
  const trimmed = attempts.slice(-MAX_ATTEMPTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

  // Update patterns
  updatePatterns(trimmed);
}

/**
 * Get all saved label attempts
 */
export function getLabelAttempts(): LabelAttempt[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as LabelAttempt[];
  } catch {
    return [];
  }
}

/**
 * Get attempts for a specific scenario
 */
export function getAttemptsForScenario(scenarioId: string): LabelAttempt[] {
  return getLabelAttempts().filter((a) => a.scenarioId === scenarioId);
}

/**
 * Get recent attempts (last N)
 */
export function getRecentAttempts(count: number = 10): LabelAttempt[] {
  return getLabelAttempts().slice(-count);
}

/**
 * Update pattern analysis based on all attempts
 */
function updatePatterns(attempts: LabelAttempt[]): void {
  if (attempts.length === 0) {
    localStorage.removeItem(PATTERNS_KEY);
    return;
  }

  const transcripts = attempts.map((a) => a.transcript);

  // Calculate syntax error rate
  const syntaxErrors = attempts.filter(
    (a) =>
      !a.analysis.syntax.hasCorrectOpener ||
      !a.analysis.syntax.avoidsIFraming ||
      !a.analysis.syntax.avoidsYouFraming ||
      !a.analysis.syntax.isStatement
  );
  const syntaxErrorRate = syntaxErrors.length / attempts.length;

  // Count common mistakes
  const mistakeCounts = new Map<string, MistakeCount>();
  for (const attempt of attempts) {
    for (const feedback of attempt.analysis.syntax.syntaxFeedback) {
      const existing = mistakeCounts.get(feedback);
      if (existing) {
        existing.count++;
        existing.lastOccurred = attempt.timestamp;
      } else {
        mistakeCounts.set(feedback, {
          mistake: feedback,
          count: 1,
          lastOccurred: attempt.timestamp,
        });
      }
    }
  }

  // Calculate vocabulary metrics
  const emotionVocabulary = extractEmotionVocabulary(transcripts);
  const vocabularyTTR = calculateTTR(transcripts);

  // Detect repetitive templates
  const repetitiveTemplates = detectRepetitiveTemplates(transcripts);

  // Build score history
  const scoreHistory: ScoreHistoryEntry[] = attempts.map((a) => ({
    timestamp: a.timestamp,
    scenarioId: a.scenarioId,
    score: a.analysis.overallScore,
  }));

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

  // Calculate average score
  const averageScore =
    attempts.reduce((sum, a) => sum + a.analysis.overallScore, 0) /
    attempts.length;

  const patterns: LabelingPatterns = {
    totalAttempts: attempts.length,
    averageScore,
    syntaxErrorRate,
    commonMistakes: Array.from(mistakeCounts.values()).sort(
      (a, b) => b.count - a.count
    ),
    emotionVocabulary,
    vocabularyTTR,
    repetitiveTemplates: repetitiveTemplates as TemplateCount[],
    scoreHistory,
    improvementTrend,
  };

  localStorage.setItem(PATTERNS_KEY, JSON.stringify(patterns));
}

/**
 * Get current patterns analysis
 */
export function getLabelingPatterns(): LabelingPatterns | null {
  const stored = localStorage.getItem(PATTERNS_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as LabelingPatterns;
  } catch {
    return null;
  }
}

/**
 * Clear all labeling data
 */
export function clearLabelingData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(PATTERNS_KEY);
}
