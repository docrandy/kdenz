import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBaseline } from "../services/baselineStorage";
import { saveSession } from "../services/sessionStorage";
import { AudioPlayback } from "../components/AudioPlayback";
import MetricCard from "../components/MetricCard";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import AISummary from "../components/AISummary";
import TranscriptConfidenceIndicator from "../components/TranscriptConfidenceIndicator";
import { CardCarousel } from "../components/CardCarousel";
import { WordTiming } from "../core/audio/useWebSpeech";
import { ReconciledFiller } from "../lib/fillerReconciler";
import SelfAssessment, {
  SelfAssessmentResponse,
} from "../components/SelfAssessment";
import ImplementationIntention from "../components/ImplementationIntention";

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
  focusMode: "filler" | "pace";
  transcript: string;
  is_baseline?: boolean;
  audioData?: string | null;
  fillerEvents?: FillerEvent[];
  wordTimings?: WordTiming[];
  reconciledFillers?: ReconciledFiller[];
  averageConfidence?: number;
  lowConfidenceSegments?: number;
}

type ResultsPhase = "self-assess" | "metrics" | "intention" | "complete";

export default function PostSessionResults() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionResultData | null>(
    null,
  );
  const [phase, setPhase] = useState<ResultsPhase>("self-assess");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Load session data from sessionStorage
    try {
      const stored = sessionStorage.getItem("voicelab_last_session");
      if (!stored) {
        // No session data — redirect to dashboard
        navigate("/");
        return;
      }
      const data = JSON.parse(stored) as SessionResultData;
      setSessionData(data);

      // If baseline session, skip reflection prompts and go straight to metrics
      if (data.is_baseline) {
        setPhase("metrics");
      }
    } catch {
      // Corrupted data — redirect to dashboard
      navigate("/");
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
      setRefreshKey((k) => k + 1); // Trigger chart refresh
    }
  }, [sessionData, sessionSaved]);

  // Load baseline for delta calculation
  const baseline = getBaseline();

  // Calculate filler breakdown from reconciledFillers
  const fillerBreakdown = useMemo(() => {
    if (!sessionData?.reconciledFillers) return [];
    const counts = new Map<string, number>();
    sessionData.reconciledFillers.forEach((f) => {
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

    if (sessionData.focusMode === "filler") {
      const count = sessionData.fillerCount;
      let commentary = "";

      if (count === 0) {
        commentary = "Amazing — not a single filler word!";
      } else if (count <= 3) {
        commentary = "Great job — minimal filler usage.";
      } else if (count <= 7) {
        commentary = "Good practice session. Keep working on awareness.";
      } else {
        commentary = "Lots to work with! Awareness is the first step.";
      }

      return `You spoke for ${duration} and used ${count} filler word${count === 1 ? "" : "s"}. ${commentary}`;
    } else {
      // Pace mode
      const wpm = sessionData.wpm;
      let commentary = "";

      if (wpm < 100) {
        commentary = "Your pace was on the slower side — try picking up a bit.";
      } else if (wpm <= 150) {
        commentary = "Great conversational pace!";
      } else if (wpm <= 180) {
        commentary = "You were speaking fairly quickly — try slowing down.";
      } else {
        commentary =
          "You were speaking quite fast. Practice pausing between thoughts.";
      }

      return `You spoke for ${duration} at an average pace of ${wpm} WPM. ${commentary}`;
    }
  };

  // Phase transition handlers
  const handleSelfAssessComplete = (_response: SelfAssessmentResponse) => {
    // Response captured for future analytics/storage
    setPhase("metrics");
  };

  const handleSelfAssessSkip = () => {
    setPhase("metrics");
  };

  const handleMetricsContinue = () => {
    setPhase("intention");
  };

  const handleIntentionComplete = (intention: string) => {
    // Intention is already stored in sessionStorage by component
    console.log("Implementation intention set:", intention);
    setPhase("complete");
  };

  const handleIntentionSkip = () => {
    setPhase("complete");
  };

  // Navigation handlers
  const handleDashboard = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    navigate(`/practice/${sessionData.focusMode}`);
  };

  const handleNewSession = () => {
    navigate("/");
  };

  // Phase 1: Self-assessment (before metrics reveal)
  if (phase === "self-assess") {
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
  if (phase === "metrics") {
    // Calculate confidence intervals (heuristic based on session length)
    const wpmCI =
      sessionData.durationSeconds < 60
        ? 15
        : sessionData.durationSeconds < 120
          ? 10
          : 5;
    const fillerCI =
      sessionData.durationSeconds < 60
        ? 1.5
        : sessionData.durationSeconds < 120
          ? 1.0
          : 0.5;

    // Helper component for filler breakdown detail
    const FillerBreakdown = () => {
      if (!fillerBreakdown || fillerBreakdown.length === 0) return null;
      return (
        <div className="text-sm text-text-muted">
          You used:{" "}
          {fillerBreakdown.map((item, index) => (
            <span key={item.word}>
              {index > 0 && ", "}
              <span className="font-medium">'{item.word}'</span> {item.count}x
            </span>
          ))}
        </div>
      );
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 pb-safe transition-opacity duration-300">
        <div className="max-w-md w-full">
          <CardCarousel>
            {/* Card 1: Session Summary */}
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-text-inverse"
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
                <h1 className="text-3xl font-bold text-text">
                  Session Complete
                </h1>
              </div>

              <div className="bg-background-surface rounded-lg p-4 sm:p-6 border border-background-elevated">
                <p className="text-base sm:text-lg text-text-muted text-center leading-relaxed">
                  {generateSummary()}
                </p>
              </div>

              {/* Transcript confidence indicator (show if < 0.85) */}
              {sessionData.averageConfidence !== undefined &&
                sessionData.averageConfidence < 0.85 && (
                  <div className="bg-background-surface rounded-lg p-4 border border-background-elevated">
                    <TranscriptConfidenceIndicator
                      averageConfidence={sessionData.averageConfidence}
                      lowSegmentCount={sessionData.lowConfidenceSegments || 0}
                    />
                  </div>
                )}
            </div>

            {/* Card 2: Speech Rate */}
            <div className="space-y-4 py-8">
              <MetricCard
                label="Speech Rate"
                value={sessionData.wpm}
                unit="WPM"
                baseline={baseline?.wpm}
                confidenceInterval={wpmCI}
                contextNote="Note: Accuracy is highest in quiet environments. Background noise can widen the margin of error."
                reflectionPrompt="What do you think drove the pace in this section?"
              />
            </div>

            {/* Card 3: Filler Words */}
            <div className="space-y-4 py-8">
              <MetricCard
                label="Filler Words"
                value={sessionData.fillerRate}
                unit="per minute"
                baseline={baseline?.fillerRate}
                confidenceInterval={fillerCI}
                details={<FillerBreakdown />}
                contextNote="Context note: Fillers are common in conversational speech. In more formal settings, they may be more noticeable."
                reflectionPrompt="Did you feel more time-pressure or uncertainty in this part?"
              />
            </div>

            {/* Card 4: Listen & Review */}
            <div className="space-y-4 py-8">
              {/* Audio playback */}
              {sessionData.audioData && (
                <div className="bg-background-surface rounded-lg p-3 sm:p-4 border border-background-elevated">
                  <p className="text-xs sm:text-sm text-text-muted mb-3">
                    Listen to your session
                  </p>
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
                    onClick={() => navigate("/practice/evaluation")}
                    className="text-accent hover:underline text-sm"
                  >
                    View full transcript with highlights →
                  </button>
                </div>
              )}

              {/* Weekly trend chart (non-baseline sessions only) */}
              {!sessionData.is_baseline && (
                <div className="mt-6">
                  <WeeklyTrendChart refreshKey={refreshKey} />
                </div>
              )}
            </div>
          </CardCarousel>

          {/* Continue button - always visible below carousel */}
          <div className="flex justify-center py-6">
            <button
              onClick={() =>
                sessionData.is_baseline
                  ? setPhase("complete")
                  : handleMetricsContinue()
              }
              className="btn-primary min-h-[56px] min-w-[160px]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Phase 3: Implementation intention (post-metrics commitment)
  if (phase === "intention") {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 sm:px-6 pb-safe transition-opacity duration-300">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-inverse"
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
          <h1 className="text-3xl font-bold text-text">All Set!</h1>
          <p className="text-text-muted mt-2">Ready to practice again?</p>
        </div>

        {/* Key stats summary */}
        <div className="bg-background-surface rounded-lg p-4 sm:p-6 border border-background-elevated">
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-text">
                {sessionData.focusMode === "filler"
                  ? sessionData.fillerCount
                  : sessionData.wpm}
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                {sessionData.focusMode === "filler" ? "Filler Words" : "WPM"}
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-text">
                {formatDuration(sessionData.durationSeconds)}
              </div>
              <p className="text-xs sm:text-sm text-text-muted mt-1">
                Duration
              </p>
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
            className="px-2 sm:px-4 py-3 bg-background-surface border-2 border-background-elevated rounded-lg text-text font-medium hover:bg-background-elevated active:bg-background-elevated transition-colors text-xs sm:text-base min-h-[48px]"
          >
            Dashboard
          </button>
          <button
            onClick={handleTryAgain}
            className="btn-primary text-xs sm:text-base min-h-[48px]"
          >
            Try Again
          </button>
          <button
            onClick={handleNewSession}
            className="px-2 sm:px-4 py-3 bg-background-surface border-2 border-background-elevated rounded-lg text-text font-medium hover:bg-background-elevated active:bg-background-elevated transition-colors text-xs sm:text-base min-h-[48px]"
          >
            New Session
          </button>
        </div>
      </div>
    </div>
  );
}
