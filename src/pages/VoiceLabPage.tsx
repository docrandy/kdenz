/**
 * VoiceLabPage - Voice practice hub
 * Filler Words + Speech Pace modes, recent sessions, voice stats
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllSessions,
  type SessionSummary,
} from "../services/sessionStorage";
import { hasBaseline } from "../services/baselineStorage";

export default function VoiceLabPage() {
  const navigate = useNavigate();
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);

  useEffect(() => {
    setRecentSessions(getAllSessions().slice(-5).reverse());
  }, []);

  const allSessions = getAllSessions();

  const handlePracticeClick = (mode: "filler" | "pace") => {
    if (!hasBaseline()) {
      navigate("/baseline");
    } else {
      navigate(`/practice/${mode}/setup`);
    }
  };

  const totalMinutes = Math.round(
    allSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60,
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Practice Modes */}
      <section>
        <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
          Practice Modes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handlePracticeClick("filler")}
            className="card-surface border-l-4 border-l-accent text-left hover:bg-accent/5 active:bg-accent/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-accent"
                >
                  <rect
                    x="9"
                    y="2"
                    width="6"
                    height="12"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M5 10a7 7 0 0014 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12"
                    y2="22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-h5 text-text-heading mb-1">
                  Filler Words
                </h3>
                <p className="text-body-sm text-text-body">
                  Reduce ums, uhs, and likes with real-time acoustic detection
                  and visual feedback
                </p>
              </div>
              <span className="text-text-subtle flex-shrink-0 mt-1">
                &rarr;
              </span>
            </div>
          </button>

          <button
            onClick={() => handlePracticeClick("pace")}
            className="card-surface border-l-4 border-l-info text-left hover:bg-info/5 active:bg-info/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-info"
                >
                  <path
                    d="M3 12h4l3-9 4 18 3-9h4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-h5 text-text-heading mb-1">
                  Speech Pace
                </h3>
                <p className="text-body-sm text-text-body">
                  Practice speaking at the right tempo with a live WPM gauge and
                  visual feedback
                </p>
              </div>
              <span className="text-text-subtle flex-shrink-0 mt-1">
                &rarr;
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      {allSessions.length > 0 && (
        <section>
          <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
            Voice Stats
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="card-surface text-center">
              <p className="text-h4 font-bold text-accent">
                {allSessions.length}
              </p>
              <p className="text-caption text-text-muted">Sessions</p>
            </div>
            <div className="card-surface text-center">
              <p className="text-h4 font-bold text-accent">{totalMinutes}</p>
              <p className="text-caption text-text-muted">Minutes</p>
            </div>
            <div className="card-surface text-center">
              <p className="text-h4 font-bold text-accent">
                {allSessions.length > 0
                  ? Math.round(
                      allSessions.reduce(
                        (sum, s) => sum + (s.fillerRate || 0),
                        0,
                      ) / allSessions.length,
                    )
                  : 0}
              </p>
              <p className="text-caption text-text-muted">Avg Fillers/min</p>
            </div>
          </div>
        </section>
      )}

      {/* Voice Profile link */}
      <button
        onClick={() => navigate("/voice-profile")}
        className="w-full card-surface text-left hover:bg-accent/5 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-accent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v-2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M22 21v-2a4 4 0 00-3-3.87"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16 3.13a4 4 0 010 7.75"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-body font-medium text-text-heading">
              Voice Profile
            </p>
            <p className="text-caption text-text-muted">
              View your voice analytics and history
            </p>
          </div>
        </div>
        <span className="text-text-subtle">&rarr;</span>
      </button>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <section>
          <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
            Recent Sessions
          </h2>
          <div className="space-y-2">
            {recentSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/session/${session.id}`)}
                className="w-full card-surface text-left hover:border-accent/20 active:bg-accent/5 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-body font-medium text-text-heading">
                      {session.durationSeconds
                        ? `${Math.round(session.durationSeconds)}s session`
                        : "Practice session"}
                    </p>
                    <p className="text-caption text-text-muted">
                      {formatTimeAgo(session.timestamp)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-body-lg font-bold text-accent">
                        {session.fillerCount}
                      </p>
                      <p className="text-caption text-text-muted">fillers</p>
                    </div>
                    {session.wpm && (
                      <div className="text-right">
                        <p className="text-body-lg font-bold text-text-heading">
                          {Math.round(session.wpm)}
                        </p>
                        <p className="text-caption text-text-muted">WPM</p>
                      </div>
                    )}
                    <span className="text-text-subtle">&rarr;</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {allSessions.length === 0 && (
        <div className="card-surface text-center py-12">
          <p className="text-h4 mb-2">Ready to start?</p>
          <p className="text-body text-text-muted mb-6">
            Record your first voice session to see stats and track progress.
          </p>
          <button
            onClick={() => handlePracticeClick("filler")}
            className="btn-primary px-6 py-3"
          >
            Start Practice
          </button>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
