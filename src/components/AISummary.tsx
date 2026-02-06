/**
 * AI Summary Component
 * Displays AI-generated coaching summary with loading state and fallback
 */

import { useState, useCallback } from 'react';
import {
  generateCoachingSummary,
  getStoredApiKey,
  storeApiKey,
  isValidApiKeyFormat,
} from '../services/geminiService';
import { loadDiagnosticResults, summarizeInsights } from '../lib/diagnosticQuestions';
import type { ReconciledFiller } from '../lib/fillerReconciler';

interface AISummaryProps {
  transcript: string;
  wpm: number;
  wordCount: number;
  fillerCount: number;
  fillerRate: number;
  durationSeconds: number;
  reconciledFillers: ReconciledFiller[];
}

type SummaryState = 'idle' | 'loading' | 'success' | 'error';

function countFillerWords(fillers: ReconciledFiller[]): { word: string; count: number }[] {
  const counts = new Map<string, number>();

  fillers.forEach((f) => {
    const word = f.word.toLowerCase();
    counts.set(word, (counts.get(word) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

export default function AISummary({
  transcript,
  wpm,
  wordCount,
  fillerCount,
  fillerRate,
  durationSeconds,
  reconciledFillers,
}: AISummaryProps) {
  const [state, setState] = useState<SummaryState>('idle');
  const [summary, setSummary] = useState<string>('');
  const [isAI, setIsAI] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const generateSummary = useCallback(async () => {
    setState('loading');

    const apiKey = getStoredApiKey();
    const fillerWords = countFillerWords(reconciledFillers);

    // Load diagnostic insights for personalized coaching
    const diagnosticResults = loadDiagnosticResults();
    const diagnosticContext = summarizeInsights(diagnosticResults);

    try {
      const result = await generateCoachingSummary(
        {
          transcript,
          stats: {
            wpm,
            wordCount,
            fillerCount,
            fillerRate,
            durationSeconds,
            topFillerWords: fillerWords,
          },
          fillerWords,
          diagnosticContext,
        },
        apiKey
      );

      setSummary(result.summary);
      setIsAI(result.isAI);
      setState('success');
    } catch {
      setState('error');
    }
  }, [transcript, wpm, wordCount, fillerCount, fillerRate, durationSeconds, reconciledFillers]);

  const handleSaveApiKey = useCallback(() => {
    if (isValidApiKeyFormat(apiKeyInput)) {
      storeApiKey(apiKeyInput);
      setShowApiKeyInput(false);
      setApiKeyInput('');
    }
  }, [apiKeyInput]);

  const hasApiKey = !!getStoredApiKey();

  return (
    <div className="bg-white border border-clinical-border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-clinical-text">Coaching Summary</h3>
        {state === 'success' && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-clinical-muted">
            {isAI ? '✨ AI Generated' : '📊 Local Analysis'}
          </span>
        )}
      </div>

      {/* Idle state - show generate button */}
      {state === 'idle' && (
        <div className="text-center py-4">
          <button
            onClick={generateSummary}
            className="px-6 py-2 bg-clinical-text text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Generate Summary
          </button>

          {/* API key setup hint */}
          {!hasApiKey && (
            <div className="mt-4">
              <button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs text-clinical-muted hover:text-clinical-accent transition-colors"
              >
                {showApiKeyInput ? 'Cancel' : 'Add Gemini API key for AI summaries'}
              </button>

              {showApiKeyInput && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="Paste your Gemini API key"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-clinical-accent"
                  />
                  <button
                    onClick={handleSaveApiKey}
                    disabled={!isValidApiKeyFormat(apiKeyInput)}
                    className="mt-2 w-full px-4 py-2 text-sm bg-clinical-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Key
                  </button>
                  <p className="mt-2 text-xs text-clinical-muted">
                    Get a free key at{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-clinical-accent hover:underline"
                    >
                      aistudio.google.com
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Loading state */}
      {state === 'loading' && (
        <div className="text-center py-6">
          <div className="inline-flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-clinical-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-clinical-muted">Analyzing your session...</span>
          </div>
        </div>
      )}

      {/* Success state - show summary */}
      {state === 'success' && (
        <div className="py-2">
          <p className="text-sm text-clinical-text leading-relaxed whitespace-pre-line">
            {summary}
          </p>

          {/* Regenerate button - only show for AI summaries since local is deterministic */}
          {isAI && (
            <div className="mt-4 pt-4 border-t border-clinical-border">
              <button
                onClick={generateSummary}
                className="text-xs text-clinical-muted hover:text-clinical-accent transition-colors"
              >
                ↻ Regenerate
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error state */}
      {state === 'error' && (
        <div className="text-center py-4">
          <p className="text-sm text-red-600 mb-3">Something went wrong. Please try again.</p>
          <button
            onClick={generateSummary}
            className="text-sm text-clinical-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
