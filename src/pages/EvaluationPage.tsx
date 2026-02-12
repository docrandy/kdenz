import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TranscriptView from '../components/TranscriptView';
import HighlightToggle, { HighlightMode } from '../components/HighlightToggle';
import TranscriptConfidenceIndicator from '../components/TranscriptConfidenceIndicator';
import { WordTiming } from '../core/audio/useWebSpeech';
import { ReconciledFiller } from '../lib/fillerReconciler';

interface SessionEvalData {
  transcript: string;
  wordTimings: WordTiming[];
  reconciledFillers: ReconciledFiller[];
  durationSeconds: number;
  fillerCount: number;
  wpm: number;
  focusMode: 'filler' | 'pace';
  averageConfidence?: number;
  lowConfidenceSegments?: number;
}

export default function EvaluationPage() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionEvalData | null>(null);
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('fillers');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('voicelab_last_session');
      if (!stored) {
        navigate('/');
        return;
      }
      const data = JSON.parse(stored);
      // Validate required fields for evaluation
      if (!data.transcript || !data.wordTimings) {
        navigate('/practice/results');
        return;
      }
      setSessionData({
        transcript: data.transcript,
        wordTimings: data.wordTimings || [],
        reconciledFillers: data.reconciledFillers || [],
        durationSeconds: data.durationSeconds,
        fillerCount: data.fillerCount,
        wpm: data.wpm,
        focusMode: data.focusMode,
        averageConfidence: data.averageConfidence,
        lowConfidenceSegments: data.lowConfidenceSegments,
      });
      // Default to filler highlight for filler mode, pace for pace mode
      setHighlightMode(data.focusMode === 'filler' ? 'fillers' : 'pace');
    } catch {
      navigate('/');
    }
  }, [navigate]);

  if (!sessionData) {
    return null;
  }

  const handleBack = () => {
    navigate('/practice/results');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-text-muted hover:text-text flex items-center gap-2"
          >
            ← Back to Results
          </button>
          <h1 className="text-lg font-semibold text-text">Session Transcript</h1>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Transcript confidence indicator (show if < 0.85) */}
        {sessionData.averageConfidence !== undefined && sessionData.averageConfidence < 0.85 && (
          <div className="bg-background-surface rounded-lg p-4">
            <TranscriptConfidenceIndicator
              averageConfidence={sessionData.averageConfidence}
              lowSegmentCount={sessionData.lowConfidenceSegments || 0}
            />
          </div>
        )}

        {/* Highlight toggle */}
        <div className="flex justify-center">
          <HighlightToggle
            mode={highlightMode}
            onChange={setHighlightMode}
            fillerCount={sessionData.reconciledFillers.length}
          />
        </div>

        {/* Transcript with highlighting */}
        <div className="bg-background border rounded-lg shadow-sm">
          <TranscriptView
            transcript={sessionData.transcript}
            reconciledFillers={sessionData.reconciledFillers}
            wordTimings={sessionData.wordTimings}
            highlightMode={highlightMode}
            sessionDurationMs={sessionData.durationSeconds * 1000}
          />
        </div>

        {/* Session stats summary */}
        <div className="flex justify-center gap-8 text-sm text-text-muted">
          <span>{sessionData.fillerCount} filler{sessionData.fillerCount !== 1 ? 's' : ''}</span>
          <span>{sessionData.wpm} WPM</span>
          <span>{Math.floor(sessionData.durationSeconds / 60)}m {sessionData.durationSeconds % 60}s</span>
        </div>
      </div>
    </div>
  );
}
