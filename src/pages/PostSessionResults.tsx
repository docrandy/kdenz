import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getBaseline } from "../services/baselineStorage";
import { saveSession } from "../services/sessionStorage";
import { AudioPlayback } from "../components/AudioPlayback";
import MetricCard from "../components/MetricCard";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import TranscriptConfidenceIndicator from "../components/TranscriptConfidenceIndicator";
import TranscriptView from "../components/TranscriptView";
import HighlightToggle, { HighlightMode } from "../components/HighlightToggle";
import { CardCarousel } from "../components/CardCarousel";
import SegmentedControl from "../components/SegmentedControl";
import { WordTiming } from "../core/audio/useWebSpeech";
import { ReconciledFiller } from "../lib/fillerReconciler";
import SelfAssessment, {
  SelfAssessmentResponse,
} from "../components/SelfAssessment";
import ImplementationIntention from "../components/ImplementationIntention";
import { AppHeader } from "../components/AppHeader";
import {
  generateCoachingSummary,
  getStoredApiKey,
} from "../services/geminiService";
import {
  loadDiagnosticResults,
  summarizeInsights,
} from "../lib/diagnosticQuestions";

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

type ResultsPhase = "self-assess" | "results" | "intention" | "complete";
type ResultsTab = "coaching" | "analytics" | "transcript";

export default function PostSessionResults() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionResultData | null>(
    null,
  );
  const [phase, setPhase] = useState<ResultsPhase>("self-assess");
  const [activeTab, setActiveTab] = useState<ResultsTab>("coaching");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [highlightMode, setHighlightMode] = useState<HighlightMode>("fillers");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // AI summary state
  const [aiSummaryState, setAiSummaryState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [aiCoachingPoints, setAiCoachingPoints] = useState<string[]>([]);

  useEffect(() => {
    // Load session data from sessionStorage
    try {
      const stored = sessionStorage.getItem("voicelab_last_session");
      if (!stored) {
        navigate("/");
        return;
      }
      const data = JSON.parse(stored) as SessionResultData;
      setSessionData(data);

      // If baseline session, skip reflection prompts and go straight to results
      if (data.is_baseline) {
        setPhase("results");
      }
    } catch {
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
      setRefreshKey((k) => k + 1);
    }
  }, [sessionData, sessionSaved]);

  // Auto-trigger AI summary when coaching tab is first viewed
  useEffect(() => {
    if (
      phase === "results" &&
      activeTab === "coaching" &&
      aiSummaryState === "idle" &&
      sessionData &&
      !sessionData.is_baseline
    ) {
      generateAISummary();
    }
  }, [phase, activeTab, aiSummaryState, sessionData]);

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

  // Format duration as "Xm Ys"
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  // Generate templated summary paragraph based on focus mode
  const generateSummary = (): string => {
    if (!sessionData) return "";
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

  // Generate AI coaching summary
  const generateAISummary = async () => {
    if (!sessionData) return;

    setAiSummaryState("loading");

    const apiKey = getStoredApiKey();

    const diagnosticResults = loadDiagnosticResults();
    const diagnosticContext = summarizeInsights(diagnosticResults);

    try {
      const result = await generateCoachingSummary(
        {
          transcript: sessionData.transcript,
          stats: {
            wpm: sessionData.wpm,
            wordCount: sessionData.wordCount,
            fillerCount: sessionData.fillerCount,
            fillerRate: sessionData.fillerRate,
            durationSeconds: sessionData.durationSeconds,
            topFillerWords: fillerBreakdown,
          },
          fillerWords: fillerBreakdown,
          diagnosticContext,
        },
        apiKey,
      );

      // Parse coaching points from summary (split by newlines or bullets)
      const points = result.summary
        .split(/\n+/)
        .map((p) => p.trim().replace(/^[•\-\*]\s*/, ""))
        .filter((p) => p.length > 20); // Filter out short lines

      setAiCoachingPoints(points.length > 0 ? points : [result.summary]);
      setAiSummaryState("success");
    } catch {
      // Fallback to templated summary
      const fallbackSummary = generateSummary();
      setAiCoachingPoints([fallbackSummary]);
      setAiSummaryState("success");
    }
  };

  // Phase transition handlers
  const handleSelfAssessComplete = (_response: SelfAssessmentResponse) => {
    setPhase("results");
  };

  const handleSelfAssessSkip = () => {
    setPhase("results");
  };

  const handleResultsContinue = () => {
    if (sessionData?.is_baseline) {
      setPhase("complete");
    } else {
      setPhase("intention");
    }
  };

  const handleIntentionComplete = (intention: string) => {
    console.log("Implementation intention set:", intention);
    setPhase("complete");
  };

  const handleIntentionSkip = () => {
    setPhase("complete");
  };

  // Navigation handlers
  const handleBack = () => {
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const handlePracticeAgain = () => {
    if (sessionData) {
      navigate(`/practice/${sessionData.focusMode}`);
    } else {
      navigate("/");
    }
  };

  // Tab swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;

    // Swipe threshold: 50px
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        // Swiped left → next tab
        if (activeTab === "coaching") setActiveTab("analytics");
        else if (activeTab === "analytics") setActiveTab("transcript");
      } else {
        // Swiped right → previous tab
        if (activeTab === "transcript") setActiveTab("analytics");
        else if (activeTab === "analytics") setActiveTab("coaching");
      }
    }

    setTouchStartX(null);
  };

  if (!sessionData) {
    return null;
  }

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

  // Phase 2: Results view with 3 tabs
  if (phase === "results") {
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
        <div className="text-body-sm text-text-muted">
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

    const tabSegments = ["Coaching", "Voice Analytics", "Transcript"];
    const tabMapping: Record<number, ResultsTab> = {
      0: "coaching",
      1: "analytics",
      2: "transcript",
    };
    const reverseTabMapping: Record<ResultsTab, number> = {
      coaching: 0,
      analytics: 1,
      transcript: 2,
    };

    return (
      <div className="min-h-screen bg-background pb-safe">
        <AppHeader showBack onBack={handleBack} />

        <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
          {/* Session complete header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-text-inverse"
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
            <h1 className="text-h3 font-bold text-text-heading">
              Session Complete
            </h1>
            <p className="text-body text-text-muted mt-2">
              {generateSummary()}
            </p>
          </div>

          {/* Segmented control for tabs */}
          <SegmentedControl
            segments={tabSegments}
            activeIndex={reverseTabMapping[activeTab]}
            onChange={(index) => setActiveTab(tabMapping[index])}
            className="mb-6"
          />

          {/* Tab panels with swipe support */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="min-h-[400px]"
          >
            {/* Coaching Tab */}
            {activeTab === "coaching" && (
              <div className="space-y-6">
                {aiSummaryState === "loading" && (
                  <div className="card-surface text-center py-12">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-body text-text-muted">
                        Analyzing your session...
                      </span>
                    </div>
                  </div>
                )}

                {aiSummaryState === "success" &&
                  aiCoachingPoints.length > 0 && (
                    <CardCarousel>
                      {aiCoachingPoints.map((point, index) => (
                        <div key={index} className="card-surface py-8">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-body-sm font-bold text-accent">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-h5 font-semibold text-text-heading mb-3">
                                Coaching Point {index + 1}
                              </h3>
                              <p className="text-body text-text-body leading-relaxed">
                                {point}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardCarousel>
                  )}

                {aiSummaryState === "idle" && (
                  <div className="card-surface text-center py-12">
                    <p className="text-body-sm text-text-muted">
                      Loading coaching insights...
                    </p>
                  </div>
                )}

                {aiSummaryState === "error" && (
                  <div className="card-surface text-center py-12">
                    <p className="text-body-sm text-status-error mb-4">
                      Could not generate AI coaching. Showing basic summary.
                    </p>
                    <button
                      onClick={generateAISummary}
                      className="text-body-sm text-accent hover:underline"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Voice Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                {/* Key stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WPM Card */}
                  <MetricCard
                    label="Speech Rate"
                    value={sessionData.wpm}
                    unit="WPM"
                    baseline={baseline?.wpm}
                    confidenceInterval={wpmCI}
                    contextNote="Note: Accuracy is highest in quiet environments. Background noise can widen the margin of error."
                  />

                  {/* Filler Rate Card */}
                  <MetricCard
                    label="Filler Words"
                    value={sessionData.fillerRate}
                    unit="per minute"
                    baseline={baseline?.fillerRate}
                    confidenceInterval={fillerCI}
                    details={<FillerBreakdown />}
                    contextNote="Context note: Fillers are common in conversational speech. In more formal settings, they may be more noticeable."
                  />
                </div>

                {/* Duration stat */}
                <div className="card-surface">
                  <h4 className="text-body-lg font-semibold text-text-heading mb-3">
                    Session Duration
                  </h4>
                  <div className="text-h3 font-bold text-accent">
                    {formatDuration(sessionData.durationSeconds)}
                  </div>
                </div>

                {/* Weekly trend chart */}
                {!sessionData.is_baseline && (
                  <WeeklyTrendChart refreshKey={refreshKey} />
                )}

                {/* Transcript confidence indicator (if low confidence) */}
                {sessionData.averageConfidence !== undefined &&
                  sessionData.averageConfidence < 0.85 && (
                    <div className="card-surface">
                      <TranscriptConfidenceIndicator
                        averageConfidence={sessionData.averageConfidence}
                        lowSegmentCount={sessionData.lowConfidenceSegments || 0}
                      />
                    </div>
                  )}
              </div>
            )}

            {/* Transcript Tab */}
            {activeTab === "transcript" && (
              <div className="space-y-6">
                {/* Audio playback controls */}
                {sessionData.audioData && (
                  <div className="card-surface">
                    <p className="text-body-sm text-text-muted mb-3">
                      Listen to your session
                    </p>
                    <AudioPlayback
                      audioData={sessionData.audioData}
                      durationSeconds={sessionData.durationSeconds}
                      fillerEvents={sessionData.fillerEvents}
                    />
                  </div>
                )}

                {/* Highlight toggle */}
                {sessionData.transcript && sessionData.wordTimings && (
                  <HighlightToggle
                    mode={highlightMode}
                    onChange={setHighlightMode}
                    fillerCount={sessionData.fillerCount}
                  />
                )}

                {/* Transcript view with highlighted fillers */}
                {sessionData.transcript && sessionData.wordTimings && (
                  <div className="card-surface">
                    <h3 className="text-h5 font-semibold text-text-heading mb-4">
                      Transcript
                    </h3>
                    <TranscriptView
                      transcript={sessionData.transcript}
                      reconciledFillers={sessionData.reconciledFillers || []}
                      wordTimings={sessionData.wordTimings}
                      highlightMode={highlightMode}
                      sessionDurationMs={sessionData.durationSeconds * 1000}
                    />
                  </div>
                )}

                {!sessionData.transcript && (
                  <div className="card-surface text-center py-12">
                    <p className="text-body text-text-muted">
                      No transcript available
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Continue button - fixed at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-background-elevated p-4 pb-safe">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={handleResultsContinue}
                className="btn-primary w-full min-h-[56px]"
              >
                Continue
              </button>
            </div>
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

  // Phase 4: Complete (final navigation)
  return (
    <div className="min-h-screen bg-background pb-safe">
      <AppHeader showBack onBack={handleBack} />

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6">
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
            <h1 className="text-h3 font-bold text-text-heading">All Set!</h1>
            <p className="text-body text-text-muted mt-2">
              Ready to practice again?
            </p>
          </div>

          {/* Key stats summary */}
          <div className="card-surface">
            <div className="flex items-center justify-center gap-6 sm:gap-8">
              <div className="text-center">
                <div className="text-h3 sm:text-h2 font-bold text-accent">
                  {sessionData.focusMode === "filler"
                    ? sessionData.fillerCount
                    : sessionData.wpm}
                </div>
                <p className="text-caption sm:text-body-sm text-text-muted mt-1">
                  {sessionData.focusMode === "filler" ? "Filler Words" : "WPM"}
                </p>
              </div>
              <div className="text-center">
                <div className="text-h3 sm:text-h2 font-bold text-accent">
                  {formatDuration(sessionData.durationSeconds)}
                </div>
                <p className="text-caption sm:text-body-sm text-text-muted mt-1">
                  Duration
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA: Practice Again (gold button) */}
          <button
            onClick={handlePracticeAgain}
            className="btn-primary w-full min-h-[56px]"
          >
            Practice Again
          </button>

          {/* Secondary link: Dashboard */}
          <div className="text-center">
            <button
              onClick={handleDashboard}
              className="text-body text-text-muted hover:text-accent transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
