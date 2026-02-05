/**
 * Filler Reconciler
 * Combines acoustic filler detections with transcript text analysis
 * for improved accuracy (hybrid detection per PRD)
 */

import { FillerDetection } from '../core/audio/FillerDetector';
import { WordTiming } from '../core/audio/useWebSpeech';

/** Filler word categories for display */
export const FILLER_CATEGORIES = {
  hesitation: ['um', 'uh', 'er', 'ah'],
  discourse: ['like', 'so', 'right', 'okay'],
  hedge: ['basically', 'actually', 'literally', 'honestly', 'essentially', 'obviously'],
  phrase: ['you know', 'i mean', 'kind of', 'sort of'],
} as const;

export type FillerCategory = keyof typeof FILLER_CATEGORIES;

/** Filler words to detect in transcript */
const FILLER_WORDS = ['like', 'um', 'uh', 'basically', 'actually', 'literally', 'you know'];

/** Time window (ms) for matching acoustic detections to transcript words */
const MATCH_WINDOW_MS = 500;

/** Reconciled filler with source information */
export interface ReconciledFiller {
  word: string;
  timestamp: number;     // ms from session start
  source: 'acoustic' | 'transcript' | 'both';
  wordIndex: number;     // position in transcript for highlighting
  confidence?: number;   // from acoustic detection if available
  category?: FillerCategory;  // filler type for display
}

/**
 * Get the category for a filler word
 */
export function getFillerCategory(word: string): FillerCategory {
  const normalized = word.toLowerCase().trim();

  for (const [category, words] of Object.entries(FILLER_CATEGORIES)) {
    if ((words as readonly string[]).includes(normalized)) {
      return category as FillerCategory;
    }
  }
  return 'hesitation'; // Default category
}

/**
 * Check if a word is a filler word (case-insensitive)
 */
function isFillerWord(word: string): boolean {
  const normalized = word.toLowerCase().replace(/[^a-z\s]/g, '');
  return FILLER_WORDS.includes(normalized);
}

/**
 * Find filler words in the transcript text
 */
function findTranscriptFillers(wordTimings: WordTiming[]): ReconciledFiller[] {
  const fillers: ReconciledFiller[] = [];

  wordTimings.forEach((wt) => {
    if (isFillerWord(wt.word)) {
      fillers.push({
        word: wt.word.toLowerCase(),
        timestamp: wt.timestamp,
        source: 'transcript',
        wordIndex: wt.index,
        category: getFillerCategory(wt.word),
      });
    }
  });

  return fillers;
}

/**
 * Match acoustic detections to transcript words by timestamp
 */
function matchAcousticToTranscript(
  acousticFillers: FillerDetection[],
  wordTimings: WordTiming[]
): Map<number, { wordIndex: number; word: string }> {
  const matches = new Map<number, { wordIndex: number; word: string }>();

  acousticFillers.forEach((acoustic) => {
    // Find the closest word within the match window
    let closestWord: WordTiming | undefined = undefined;
    let closestDistance = Infinity;

    for (const wt of wordTimings) {
      const distance = Math.abs(wt.timestamp - acoustic.timestamp);
      if (distance < MATCH_WINDOW_MS && distance < closestDistance) {
        closestDistance = distance;
        closestWord = wt;
      }
    }

    if (closestWord) {
      matches.set(acoustic.timestamp, {
        wordIndex: closestWord.index,
        word: closestWord.word,
      });
    }
  });

  return matches;
}

/**
 * Reconcile acoustic filler detections with transcript text analysis
 *
 * Strategy:
 * 1. Find filler words in transcript text (high accuracy)
 * 2. Find acoustic detections that match transcript words (validation)
 * 3. Keep unmatched acoustic detections with approximate word position
 * 4. Deduplicate within time window
 */
export function reconcileFillers(
  transcript: string,
  acousticFillers: FillerDetection[],
  wordTimings: WordTiming[]
): ReconciledFiller[] {
  if (!transcript.trim() && acousticFillers.length === 0) {
    return [];
  }

  // Step 1: Find fillers in transcript
  const transcriptFillers = findTranscriptFillers(wordTimings);

  // Step 2: Match acoustic detections to transcript words
  const acousticMatches = matchAcousticToTranscript(acousticFillers, wordTimings);

  // Step 3: Merge and deduplicate
  const reconciledMap = new Map<number, ReconciledFiller>();

  // Add transcript fillers first (higher confidence)
  transcriptFillers.forEach((tf) => {
    reconciledMap.set(tf.wordIndex, tf);
  });

  // Process acoustic detections
  acousticFillers.forEach((acoustic) => {
    const match = acousticMatches.get(acoustic.timestamp);

    if (match) {
      // Acoustic detection matched to a transcript word
      const existing = reconciledMap.get(match.wordIndex);

      if (existing) {
        // Both sources detected this filler
        existing.source = 'both';
        existing.confidence = acoustic.confidence;
      } else {
        // Acoustic found a filler not in transcript filler list
        reconciledMap.set(match.wordIndex, {
          word: match.word,
          timestamp: acoustic.timestamp,
          source: 'acoustic',
          wordIndex: match.wordIndex,
          confidence: acoustic.confidence,
          category: getFillerCategory(match.word),
        });
      }
    } else {
      // Acoustic detection without transcript match
      // Estimate word index from timestamp
      const estimatedIndex = estimateWordIndex(acoustic.timestamp, wordTimings);
      const key = -acoustic.timestamp; // Negative to avoid collision with word indices

      reconciledMap.set(key, {
        word: acoustic.type,
        timestamp: acoustic.timestamp,
        source: 'acoustic',
        wordIndex: estimatedIndex,
        confidence: acoustic.confidence,
        category: getFillerCategory(acoustic.type),
      });
    }
  });

  // Convert to array and sort by word index
  const reconciled = Array.from(reconciledMap.values());
  reconciled.sort((a, b) => a.wordIndex - b.wordIndex);

  return reconciled;
}

/**
 * Estimate word index from timestamp
 */
function estimateWordIndex(timestamp: number, wordTimings: WordTiming[]): number {
  if (wordTimings.length === 0) return 0;

  // Find the word with the closest timestamp
  let closestIndex = 0;
  let closestDistance = Infinity;

  wordTimings.forEach((wt) => {
    const distance = Math.abs(wt.timestamp - timestamp);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = wt.index;
    }
  });

  return closestIndex;
}

/**
 * Get filler word indices for highlighting
 */
export function getFillerWordIndices(reconciledFillers: ReconciledFiller[]): Set<number> {
  return new Set(reconciledFillers.map((f) => f.wordIndex));
}
