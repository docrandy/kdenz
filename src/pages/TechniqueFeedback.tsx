/**
 * TechniqueFeedback — 3-tab post-session feedback page for technique practice.
 * Tab 1: Coaching (success criteria checklist + AI coaching narrative)
 * Tab 2: Voice Analytics (scorecard + audio playback)
 * Tab 3: Transcript (full transcript with filler highlighting)
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTechniqueById, resolveTechniqueIds } from "../data/techniques";
import { FRAMEWORK_DISPLAY } from "../types/technique";
import Scorecard from "../components/Scorecard";
import { AudioPlayback } from "../components/AudioPlayback";
import WeeklyTrendChart from "../components/WeeklyTrendChart";
import AISummary from "../components/AISummary";
import { getBaseline } from "../services/baselineStorage";
import { saveSession } from "../services/sessionStorage";
import { analyzeTranscript, storeVcmAnalysis } from "../services/vcmAnalyzer";
import type { ReconciledFiller } from "../lib/fillerReconciler";

interface FillerEvent {
  type: string;
  timestamp: number;
  confidence: number;
}

interface SessionData {
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  focusMode: "filler" | "pace";
  transcript: string;
  audioData?: string | null;
  fillerEvents?: FillerEvent[];
  reconciledFillers?: ReconciledFiller[];
  techniqueId?: string;
  techniqueName?: string;
  practicePrompt?: string;
}

type Tab = "coaching" | "analytics" | "transcript";

export default function TechniqueFeedback() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("coaching");
  const [sessionSaved, setSessionSaved] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load session data
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("voicelab_last_session");
      if (!stored) {
        navigate("/");
        return;
      }
      const data = JSON.parse(stored) as SessionData;
      setSessionData(data);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  // Save session + run silent VCM analysis
  useEffect(() => {
    if (sessionData && !sessionSaved) {
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

      // Silent VCM analysis
      if (sessionData.transcript) {
        const vcmResult = analyzeTranscript(sessionData.transcript);
        storeVcmAnalysis(Date.now(), vcmResult);
      }
    }
  }, [sessionData, sessionSaved]);

  const technique = sessionData?.techniqueId
    ? getTechniqueById(sessionData.techniqueId)
    : undefined;

  const baseline = getBaseline();

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

  if (!sessionData) return null;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  const fw = technique ? FRAMEWORK_DISPLAY[technique.framework] : null;
  const pairedTechniques = technique
    ? resolveTechniqueIds(technique.pairs_well_with)
    : [];

  const handlePracticeAgain = () => {
    if (technique) {
      navigate("/practice/technique", {
        state: {
          techniqueId: technique.id,
          durationSeconds: technique.duration_seconds,
          practicePrompt: technique.practice_prompt,
          techniqueName: technique.technique_name,
        },
      });
    } else {
      navigate("/practice/filler");
    }
  };

  const handleNextTechnique = () => {
    if (pairedTechniques.length > 0) {
      navigate(`/technique/${pairedTechniques[0].id}`);
    } else {
      navigate("/library");
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "coaching", label: "Coaching" },
    { id: "analytics", label: "Voice Analytics" },
    { id: "transcript", label: "Transcript" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-safe">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/library")}
              className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm min-h-[44px]"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Library
            </button>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {sessionData.techniqueName || "Practice Session"}
              </p>
              {fw && (
                <p className="text-xs text-gray-500">
                  {fw.label} · {formatDuration(sessionData.durationSeconds)}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b bg-white sticky top-[57px] z-10">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === "coaching" && (
            <CoachingTab sessionData={sessionData} technique={technique} />
          )}
          {activeTab === "analytics" && (
            <AnalyticsTab
              sessionData={sessionData}
              baseline={baseline}
              fillerBreakdown={fillerBreakdown}
              refreshKey={refreshKey}
            />
          )}
          {activeTab === "transcript" && (
            <TranscriptTab sessionData={sessionData} />
          )}
        </div>
      </div>

      {/* Bottom CTAs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex gap-3">
          <button
            onClick={handlePracticeAgain}
            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-900 active:bg-gray-800 transition-colors min-h-[48px]"
          >
            Practice Again
          </button>
          <button
            onClick={handleNextTechnique}
            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
          >
            {pairedTechniques.length > 0 ? "Next Technique" : "Back to Library"}
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[48px]"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Tab Components =====

function CoachingTab({
  sessionData,
  technique,
}: {
  sessionData: SessionData;
  technique: ReturnType<typeof getTechniqueById>;
}) {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-full bg-clinical-accent flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
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
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          Session Complete
        </h2>
        <p className="text-sm text-gray-500">
          {sessionData.wordCount} words · {sessionData.wpm} WPM ·{" "}
          {sessionData.fillerCount} filler
          {sessionData.fillerCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Success criteria checklist */}
      {technique && technique.success_criteria.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            WHAT SUCCESS LOOKS LIKE
          </h3>
          <ul className="space-y-2.5">
            {technique.success_criteria.map((criterion, i) => (
              <li key={i} className="flex gap-2.5 text-sm sm:text-base">
                <span className="text-gray-300 mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect
                      x="1"
                      y="1"
                      width="14"
                      height="14"
                      rx="3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span className="text-gray-700">{criterion}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3">
            AI-powered criterion scoring coming soon. For now, self-assess
            against these criteria.
          </p>
        </section>
      )}

      {/* AI Coaching Summary */}
      <AISummary
        transcript={sessionData.transcript}
        wpm={sessionData.wpm}
        wordCount={sessionData.wordCount}
        fillerCount={sessionData.fillerCount}
        fillerRate={sessionData.fillerRate}
        durationSeconds={sessionData.durationSeconds}
        reconciledFillers={sessionData.reconciledFillers || []}
      />

      {/* Common mistakes reminder */}
      {technique && technique.common_mistakes.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            WATCH OUT FOR
          </h3>
          <ul className="space-y-2">
            {technique.common_mistakes.map((mistake, i) => (
              <li key={i} className="flex gap-2.5 text-sm">
                <span className="text-red-400 mt-0.5 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="text-gray-600">{mistake}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function AnalyticsTab({
  sessionData,
  baseline,
  fillerBreakdown,
  refreshKey,
}: {
  sessionData: SessionData;
  baseline: ReturnType<typeof getBaseline>;
  fillerBreakdown: { word: string; count: number }[];
  refreshKey: number;
}) {
  return (
    <div className="space-y-6">
      {/* Scorecard */}
      <Scorecard
        wpm={sessionData.wpm}
        wordCount={sessionData.wordCount}
        fillerCount={sessionData.fillerCount}
        fillerRate={sessionData.fillerRate}
        durationSeconds={sessionData.durationSeconds}
        baseline={baseline}
        fillerBreakdown={fillerBreakdown}
      />

      {/* Audio playback */}
      {sessionData.audioData && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-3">
            Listen to your session
          </p>
          <AudioPlayback
            audioData={sessionData.audioData}
            durationSeconds={sessionData.durationSeconds}
            fillerEvents={sessionData.fillerEvents}
          />
        </div>
      )}

      {/* Weekly trend chart */}
      <WeeklyTrendChart refreshKey={refreshKey} />
    </div>
  );
}

function TranscriptTab({ sessionData }: { sessionData: SessionData }) {
  const [showFillers, setShowFillers] = useState(true);

  if (!sessionData.transcript) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No transcript available for this session.
        </p>
      </div>
    );
  }

  // Simple filler highlighting in transcript text
  const highlightedTranscript = useMemo(() => {
    if (
      !showFillers ||
      !sessionData.reconciledFillers ||
      sessionData.reconciledFillers.length === 0
    ) {
      return sessionData.transcript;
    }
    // Return raw text — highlight applied via HTML below
    return sessionData.transcript;
  }, [sessionData.transcript, sessionData.reconciledFillers, showFillers]);

  // Build highlighted segments
  const renderTranscript = () => {
    if (
      !showFillers ||
      !sessionData.reconciledFillers ||
      sessionData.reconciledFillers.length === 0
    ) {
      return (
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {highlightedTranscript}
        </p>
      );
    }

    // Get unique filler words for simple text-based highlighting
    const fillerWords = [
      ...new Set(
        sessionData.reconciledFillers.map((f) => f.word.toLowerCase()),
      ),
    ];
    const pattern = fillerWords.map((w) => `\\b${w}\\b`).join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = sessionData.transcript.split(regex);

    return (
      <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {parts.map((part, i) => {
          const isFillerWord = fillerWords.some(
            (fw) => fw === part.toLowerCase(),
          );
          if (isFillerWord) {
            return (
              <span key={i} className="bg-red-100 text-red-700 px-0.5 rounded">
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          TRANSCRIPT
        </h3>
        <button
          onClick={() => setShowFillers(!showFillers)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            showFillers
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {showFillers ? "Fillers: ON" : "Fillers: OFF"}
        </button>
      </div>

      {/* Transcript content */}
      <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
        {renderTranscript()}
      </div>

      {/* Audio playback for transcript scrubbing */}
      {sessionData.audioData && (
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <AudioPlayback
            audioData={sessionData.audioData}
            durationSeconds={sessionData.durationSeconds}
            fillerEvents={sessionData.fillerEvents}
          />
        </div>
      )}
    </div>
  );
}
