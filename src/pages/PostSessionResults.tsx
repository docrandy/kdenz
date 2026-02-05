import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseline } from '../services/baselineStorage';
import { AudioPlayback } from '../components/AudioPlayback';
import Scorecard from '../components/Scorecard';
import { WordTiming } from '../core/audio/useWebSpeech';
import { ReconciledFiller } from '../lib/fillerReconciler';

interface FillerEvent {
  type: string;
  timestamp: number;
  confidence: number;
}

interface SessionResultData {
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  focusMode: 'filler' | 'pace';
  transcript: string;
  is_baseline?: boolean;
  audioData?: string | null;
  fillerEvents?: FillerEvent[];
  wordTimings?: WordTiming[];
  reconciledFillers?: ReconciledFiller[];
}

export default function PostSessionResults() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionResultData | null>(null);

  useEffect(() => {
    // Load session data from sessionStorage
    try {
      const stored = sessionStorage.getItem('voicelab_last_session');
      if (!stored) {
        // No session data — redirect to dashboard
        navigate('/');
        return;
      }
      const data = JSON.parse(stored) as SessionResultData;
      setSessionData(data);
    } catch {
      // Corrupted data — redirect to dashboard
      navigate('/');
    }
  }, [navigate]);

  // Load baseline for delta calculation
  const baseline = getBaseline();

  // Calculate filler breakdown from reconciledFillers
  const fillerBreakdown = useMemo(() => {
    if (!sessionData?.reconciledFillers) return [];
    const counts = new Map<string, number>();
    sessionData.reconciledFillers.forEach(f => {
      const word = f.word.toLowerCase();
      counts.set(word, (counts.get(word) || 0) + 1);
    });
    return Array.from(counts.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);
  }, [sessionData?.reconciledFillers]);

  if (!sessionData) {
    // Loading or redirecting
    return null;
  }

  // Format duration as "Xm Ys"
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Generate templated summary paragraph based on focus mode
  const generateSummary = (): string => {
    const duration = formatDuration(sessionData.durationSeconds);

    if (sessionData.focusMode === 'filler') {
      const count = sessionData.fillerCount;
      let commentary = '';

      if (count === 0) {
        commentary = 'Amazing — not a single filler word!';
      } else if (count <= 3) {
        commentary = 'Great job — minimal filler usage.';
      } else if (count <= 7) {
        commentary = 'Good practice session. Keep working on awareness.';
      } else {
        commentary = 'Lots to work with! Awareness is the first step.';
      }

      return `You spoke for ${duration} and used ${count} filler word${count === 1 ? '' : 's'}. ${commentary}`;
    } else {
      // Pace mode
      const wpm = sessionData.wpm;
      let commentary = '';

      if (wpm < 100) {
        commentary = 'Your pace was on the slower side — try picking up a bit.';
      } else if (wpm <= 150) {
        commentary = 'Great conversational pace!';
      } else if (wpm <= 180) {
        commentary = 'You were speaking fairly quickly — try slowing down.';
      } else {
        commentary = 'You were speaking quite fast. Practice pausing between thoughts.';
      }

      return `You spoke for ${duration} at an average pace of ${wpm} WPM. ${commentary}`;
    }
  };

  // Navigation handlers
  const handleDashboard = () => {
    navigate('/');
  };

  const handleTryAgain = () => {
    navigate(`/practice/${sessionData.focusMode}`);
  };

  const handleNewSession = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-clinical-accent flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Session Complete</h1>
        </div>

        {/* Summary paragraph */}
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="text-lg text-gray-700 text-center leading-relaxed">
            {generateSummary()}
          </p>
        </div>

        {/* Scorecard with metrics */}
        <Scorecard
          wpm={sessionData.wpm}
          wordCount={sessionData.wordCount}
          fillerCount={sessionData.fillerCount}
          fillerRate={sessionData.fillerRate}
          durationSeconds={sessionData.durationSeconds}
          baseline={sessionData.is_baseline ? null : baseline}
          fillerBreakdown={fillerBreakdown}
        />

        {/* Audio playback */}
        {sessionData.audioData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">Listen to your session</p>
            <AudioPlayback
              audioData={sessionData.audioData}
              durationSeconds={sessionData.durationSeconds}
              fillerEvents={sessionData.fillerEvents}
            />
          </div>
        )}

        {/* View Transcript link */}
        {sessionData.transcript && sessionData.wordTimings && (
          <div className="text-center">
            <button
              onClick={() => navigate('/practice/evaluation')}
              className="text-clinical-accent hover:underline text-sm"
            >
              View full transcript with highlights →
            </button>
          </div>
        )}

        {/* Navigation bar */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleDashboard}
            className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={handleTryAgain}
            className="px-4 py-3 bg-clinical-accent text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <button
            onClick={handleNewSession}
            className="px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
