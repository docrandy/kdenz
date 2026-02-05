import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseline } from '../services/baselineStorage';
import { saveSession } from '../services/sessionStorage';
import { AudioPlayback } from '../components/AudioPlayback';
import Scorecard from '../components/Scorecard';
import WeeklyTrendChart from '../components/WeeklyTrendChart';
import AISummary from '../components/AISummary';
import TranscriptConfidenceIndicator from '../components/TranscriptConfidenceIndicator';
import { WordTiming } from '../core/audio/useWebSpeech';
import { ReconciledFiller } from '../lib/fillerReconciler';
import SelfAssessment, { SelfAssessmentResponse } from '../components/SelfAssessment';
import ImplementationIntention from '../components/ImplementationIntention';

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
  averageConfidence?: number;
  lowConfidenceSegments?: number;
}

type ResultsPhase = 'self-assess' | 'metrics' | 'intention' | 'complete';

export default function PostSessionResults() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionResultData | null>(null);
  const [phase, setPhase] = useState<ResultsPhase>('self-assess');
  const [sessionSaved, setSessionSaved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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

      // If baseline session, skip reflection prompts and go straight to metrics
      if (data.is_baseline) {
        setPhase('metrics');
      }
    } catch {
      // Corrupted data — redirect to dashboard
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    // Save session to storage (for trend chart) after loading session data
    if (sessionData && !sessionSaved && !sessionData.is_baseline) {
      saveSession({
        durationSeconds: sessionData.durationSeconds,
        wordCount: sessionData.wordCount,
        wpm: sessionData.wpm,
        fillerCount: sessionData.fillerCount,
        fillerRate: sessionData.fillerRate,
        focusMode: sessionData.focusMode,
      });
      setSessionSaved(true);
      setRefreshKey(k => k + 1); // Trigger chart refresh
    }
  }, [sessionData, sessionSaved]);

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

  // Phase transition handlers
  const handleSelfAssessComplete = (_response: SelfAssessmentResponse) => {
    // Response captured for future analytics/storage
    setPhase('metrics');
  };

  const handleSelfAssessSkip = () => {
    setPhase('metrics');
  };

  const handleMetricsContinue = () => {
    setPhase('intention');
  };

  const handleIntentionComplete = (intention: string) => {
    // Intention is already stored in sessionStorage by component
    console.log('Implementation intention set:', intention);
    setPhase('complete');
  };

  const handleIntentionSkip = () => {
    setPhase('complete');
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

  // Phase 1: Self-assessment (before metrics reveal)
  if (phase === 'self-assess') {
    return (
      <div className="transition-opacity duration-300">
        <SelfAssessment
          focusMode={sessionData.focusMode}
          onComplete={handleSelfAssessComplete}
          onSkip={handleSelfAssessSkip}
        />
      </div>
    );
  }

  // Phase 2: Metrics display
  if (phase === 'metrics') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-6 pb-safe transition-opacity duration-300">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
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
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
            <p className="text-base sm:text-lg text-gray-700 text-center leading-relaxed">
              {generateSummary()}
            </p>
          </div>

          {/* Transcript confidence indicator (show if < 0.85) */}
          {sessionData.averageConfidence !== undefined && sessionData.averageConfidence < 0.85 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <TranscriptConfidenceIndicator
                averageConfidence={sessionData.averageConfidence}
                lowSegmentCount={sessionData.lowConfidenceSegments || 0}
              />
            </div>
          )}

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
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-3">Listen to your session</p>
              <AudioPlayback
                audioData={sessionData.audioData}
                durationSeconds={sessionData.durationSeconds}
                fillerEvents={sessionData.fillerEvents}
              />
            </div>
          )}

          {/* Weekly trend chart (non-baseline sessions only) */}
          {!sessionData.is_baseline && (
            <div className="mt-6">
              <WeeklyTrendChart refreshKey={refreshKey} />
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

          {/* Continue button - for baseline sessions, go straight to complete */}
          <div className="flex justify-center">
            <button
              onClick={() => sessionData.is_baseline ? setPhase('complete') : handleMetricsContinue()}
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:opacity-90 active:opacity-80 transition-opacity min-h-[56px] min-w-[160px]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Implementation intention (post-metrics commitment)
  if (phase === 'intention') {
    return (
      <div className="transition-opacity duration-300">
        <ImplementationIntention
          focusMode={sessionData.focusMode}
          fillerCount={sessionData.fillerCount}
          onComplete={handleIntentionComplete}
          onSkip={handleIntentionSkip}
        />
      </div>
    );
  }

  // Phase 4: Complete (full navigation)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-6 pb-safe transition-opacity duration-300">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
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
          <h1 className="text-3xl font-bold text-gray-900">All Set!</h1>
          <p className="text-clinical-muted mt-2">Ready to practice again?</p>
        </div>

        {/* Key stats summary */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {sessionData.focusMode === 'filler'
                  ? sessionData.fillerCount
                  : sessionData.wpm}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {sessionData.focusMode === 'filler' ? 'Filler Words' : 'WPM'}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-gray-900">
                {formatDuration(sessionData.durationSeconds)}
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">Duration</p>
            </div>
          </div>
        </div>

        {/* AI Summary (button-triggered, secondary action) */}
        {!sessionData.is_baseline && (
          <div className="mt-6">
            <AISummary
              transcript={sessionData.transcript}
              wpm={sessionData.wpm}
              wordCount={sessionData.wordCount}
              fillerCount={sessionData.fillerCount}
              fillerRate={sessionData.fillerRate}
              durationSeconds={sessionData.durationSeconds}
              reconciledFillers={sessionData.reconciledFillers || []}
            />
          </div>
        )}

        {/* Navigation bar */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <button
            onClick={handleDashboard}
            className="px-2 sm:px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors text-xs sm:text-base min-h-[48px]"
          >
            Dashboard
          </button>
          <button
            onClick={handleTryAgain}
            className="px-2 sm:px-4 py-3 bg-clinical-accent text-white rounded-lg font-medium hover:opacity-90 active:opacity-80 transition-opacity text-xs sm:text-base min-h-[48px]"
          >
            Try Again
          </button>
          <button
            onClick={handleNewSession}
            className="px-2 sm:px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors text-xs sm:text-base min-h-[48px]"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
