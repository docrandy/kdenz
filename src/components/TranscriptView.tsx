/**
 * Transcript View Component
 * Displays session transcript with optional filler/pace highlighting
 */

import { useMemo } from 'react';
import { WordTiming } from '../core/audio/useWebSpeech';
import { ReconciledFiller, getFillerWordIndices, getFillerCategory, FillerCategory } from '../lib/fillerReconciler';
import { HighlightMode } from './HighlightToggle';

interface TranscriptViewProps {
  transcript: string;
  reconciledFillers: ReconciledFiller[];
  wordTimings: WordTiming[];
  highlightMode: HighlightMode;
  sessionDurationMs: number;
}

/** WPM thresholds for pace highlighting */
const PACE_FAST_WPM = 180;
const PACE_SLOW_WPM = 100;

/** Window size for pace calculation (number of words) */
const PACE_WINDOW_SIZE = 5;

/** Filler category colors for highlighting */
const FILLER_CATEGORY_COLORS: Record<FillerCategory, { bg: string; text: string }> = {
  hesitation: { bg: 'bg-red-200', text: 'text-red-800' },
  discourse: { bg: 'bg-orange-200', text: 'text-orange-800' },
  hedge: { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  phrase: { bg: 'bg-purple-200', text: 'text-purple-800' },
};

export default function TranscriptView({
  transcript,
  reconciledFillers,
  wordTimings,
  highlightMode,
  sessionDurationMs: _sessionDurationMs,
}: TranscriptViewProps) {
  // Get filler word indices for highlighting
  const fillerIndices = useMemo(
    () => getFillerWordIndices(reconciledFillers),
    [reconciledFillers]
  );

  // Map word index to filler details for display
  const fillerDetails = useMemo(() => {
    const details = new Map<number, ReconciledFiller>();
    reconciledFillers.forEach((f) => {
      details.set(f.wordIndex, f);
    });
    return details;
  }, [reconciledFillers]);

  // Calculate pace for each word (rolling window WPM)
  const wordPaces = useMemo(() => {
    if (wordTimings.length < 2) return new Map<number, 'fast' | 'slow' | 'normal'>();

    const paces = new Map<number, 'fast' | 'slow' | 'normal'>();

    wordTimings.forEach((wt, i) => {
      // Calculate WPM using a window around this word
      const windowStart = Math.max(0, i - Math.floor(PACE_WINDOW_SIZE / 2));
      const windowEnd = Math.min(wordTimings.length - 1, i + Math.floor(PACE_WINDOW_SIZE / 2));

      if (windowEnd > windowStart) {
        const startTime = wordTimings[windowStart].timestamp;
        const endTime = wordTimings[windowEnd].timestamp;
        const durationMs = endTime - startTime;
        const wordCount = windowEnd - windowStart;

        if (durationMs > 0) {
          const wpm = (wordCount / durationMs) * 60000;

          if (wpm >= PACE_FAST_WPM) {
            paces.set(wt.index, 'fast');
          } else if (wpm <= PACE_SLOW_WPM) {
            paces.set(wt.index, 'slow');
          } else {
            paces.set(wt.index, 'normal');
          }
        }
      }
    });

    return paces;
  }, [wordTimings]);

  // Split transcript into words for rendering
  const words = useMemo(() => {
    if (!transcript.trim()) return [];
    return transcript.trim().split(/\s+/);
  }, [transcript]);

  if (!transcript.trim()) {
    return (
      <div className="p-4 text-center text-clinical-muted text-sm">
        No transcript available
      </div>
    );
  }

  return (
    <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg">
      <p className="text-sm text-clinical-text leading-relaxed">
        {words.map((word, index) => {
          const isFiller = fillerIndices.has(index);
          const pace = wordPaces.get(index);

          // Determine highlight class based on mode
          let highlightClass = '';
          let title: string | undefined = undefined;

          if (highlightMode === 'fillers' && isFiller) {
            const filler = fillerDetails.get(index);
            const category = filler?.category || getFillerCategory(word);
            const colors = FILLER_CATEGORY_COLORS[category];
            highlightClass = `${colors.bg} ${colors.text} rounded px-0.5`;
            title = `Filler: ${word}`;
          } else if (highlightMode === 'pace') {
            if (pace === 'fast') {
              highlightClass = 'bg-orange-200 text-orange-800 rounded px-0.5';
            } else if (pace === 'slow') {
              highlightClass = 'bg-blue-200 text-blue-800 rounded px-0.5';
            }
          }

          return (
            <span key={index}>
              <span className={highlightClass} title={title}>{word}</span>
              {index < words.length - 1 && ' '}
            </span>
          );
        })}
      </p>

      {/* Legend for filler mode */}
      {highlightMode === 'fillers' && (
        <div className="mt-3 pt-2 border-t border-gray-200 flex flex-wrap justify-center gap-3 text-xs text-clinical-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-red-200 rounded" />
            Hesitation (um, uh)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-orange-200 rounded" />
            Discourse (like, so)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-yellow-200 rounded" />
            Hedge (basically, actually)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-purple-200 rounded" />
            Phrase (you know, I mean)
          </span>
        </div>
      )}

      {/* Legend for pace mode */}
      {highlightMode === 'pace' && (
        <div className="mt-3 pt-2 border-t border-gray-200 flex justify-center gap-4 text-xs text-clinical-muted">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-orange-200 rounded" />
            Fast ({'>'}180 WPM)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 bg-blue-200 rounded" />
            Slow ({'<'}100 WPM)
          </span>
        </div>
      )}
    </div>
  );
}
