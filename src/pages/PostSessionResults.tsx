import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseline } from '../services/baselineStorage';
import { AudioPlayback } from '../components/AudioPlayback';

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

        {/* Key stats */}
        <div className="flex items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">
              {sessionData.focusMode === 'filler'
                ? sessionData.fillerCount
                : sessionData.wpm}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {sessionData.focusMode === 'filler' ? 'Filler Words' : 'Words Per Minute'}
            </p>
            {/* Baseline delta - only show if baseline exists and this is NOT a baseline session */}
            {baseline && !sessionData.is_baseline && (
              <>
                {sessionData.focusMode === 'filler' && (() => {
                  const deltaRate = sessionData.fillerRate - baseline.fillerRate;
                  const isImprovement = deltaRate < 0;
                  const isSame = Math.abs(deltaRate) < 0.1;

                  if (isSame) {
                    return <p className="text-xs text-gray-500 mt-1">Same as baseline</p>;
                  } else if (isImprovement) {
                    return (
                      <p className="text-xs text-green-600 mt-1">
                        ↓ {Math.abs(deltaRate).toFixed(1)} fewer/min than baseline
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-xs text-amber-600 mt-1">
                        ↑ {deltaRate.toFixed(1)} more/min than baseline
                      </p>
                    );
                  }
                })()}
                {sessionData.focusMode === 'pace' && (() => {
                  const deltaWpm = sessionData.wpm - baseline.wpm;

                  if (Math.abs(deltaWpm) < 5) {
                    return <p className="text-xs text-gray-500 mt-1">Same as baseline</p>;
                  } else if (deltaWpm > 0) {
                    return (
                      <p className="text-xs text-gray-500 mt-1">
                        +{deltaWpm} WPM from baseline
                      </p>
                    );
                  } else {
                    return (
                      <p className="text-xs text-gray-500 mt-1">
                        {deltaWpm} WPM from baseline
                      </p>
                    );
                  }
                })()}
              </>
            )}
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900">
              {formatDuration(sessionData.durationSeconds)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Duration</p>
          </div>
        </div>

        {/* Audio playback */}
        {sessionData.audioData && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-3">Listen to your session</p>
            <AudioPlayback
              audioData={sessionData.audioData}
              durationSeconds={sessionData.durationSeconds}
            />
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
