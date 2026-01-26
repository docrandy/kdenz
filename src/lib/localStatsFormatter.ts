/**
 * Local Stats Formatter
 * Generates coaching summaries without AI when Gemini API fails
 */

export interface SessionStats {
  wpm: number;
  wordCount: number;
  fillerCount: number;
  fillerRate: number;
  durationSeconds: number;
  topFillerWords?: { word: string; count: number }[];
}

function getFillerAssessment(rate: number): string {
  if (rate <= 1) {
    return "Excellent control! You're using very few filler words.";
  }
  if (rate <= 2) {
    return 'Great job! Your filler word usage is within a natural range.';
  }
  if (rate <= 5) {
    return 'Good effort. There is room to reduce filler words with practice.';
  }
  return 'Focus on pausing instead of using filler words. This is a common pattern that improves with awareness.';
}

function getPaceAssessment(wpm: number): string {
  if (wpm < 100) {
    return 'Your pace is on the slower side. This can convey thoughtfulness, but consider picking up slightly for more energy.';
  }
  if (wpm <= 150) {
    return 'Your speaking pace is conversational and easy to follow.';
  }
  if (wpm <= 180) {
    return 'You have an energetic speaking pace. Make sure key points land clearly.';
  }
  return 'Your pace is quite fast. Consider slowing down to let important points breathe.';
}

function getTopFillerAdvice(topFillers?: { word: string; count: number }[]): string {
  if (!topFillers || topFillers.length === 0) {
    return '';
  }

  const primary = topFillers[0];
  if (primary.count <= 1) {
    return '';
  }

  return `\n\nYour most frequent filler is "${primary.word}" (${primary.count} times). Try pausing briefly instead when you feel the urge to use it.`;
}

function getDurationNote(seconds: number): string {
  if (seconds < 30) {
    return 'This was a short session. Longer practice sessions give more reliable metrics.';
  }
  return '';
}

/**
 * Format session stats into a human-readable coaching summary
 */
export function formatLocalSummary(stats: SessionStats): string {
  const { wpm, fillerRate, durationSeconds, topFillerWords } = stats;

  const parts: string[] = [];

  // Main assessments
  parts.push(getFillerAssessment(fillerRate));
  parts.push(getPaceAssessment(wpm));

  // Top filler advice
  const fillerAdvice = getTopFillerAdvice(topFillerWords);
  if (fillerAdvice) {
    parts.push(fillerAdvice.trim());
  }

  // Duration note
  const durationNote = getDurationNote(durationSeconds);
  if (durationNote) {
    parts.push(durationNote);
  }

  // Encouragement
  parts.push('\nKeep practicing! Awareness is the first step to improvement.');

  return parts.join(' ').replace(/\s+/g, ' ').replace(/ \n/g, '\n').trim();
}

/**
 * Format quick stats summary (one-liner)
 */
export function formatQuickStats(stats: SessionStats): string {
  const { wpm, fillerCount, fillerRate, durationSeconds } = stats;
  return `${durationSeconds}s session • ${wpm} WPM • ${fillerCount} fillers (${fillerRate.toFixed(1)}/min)`;
}
