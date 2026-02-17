/**
 * Dashboard - Main hub for the app
 * Shows profile preview, quick-start practice cards, progress stats, activity heatmap, sessions
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../features/profile";
import type { UserProfile } from "../features/profile";
import {
  getAllSessions,
  type SessionSummary,
} from "../services/sessionStorage";
import { ContributionHeatmap } from "../components/ContributionHeatmap";
import { hasBaseline } from "../services/baselineStorage";
import { CardCarousel } from "../components/CardCarousel";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);
  const [showAllSessions, setShowAllSessions] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setRecentSessions(getAllSessions().slice(-5).reverse());
  }, []);

  const allSessions = getAllSessions().reverse();

  const quickNotes = profile?.miscellaneous?.slice(-3).reverse() || [];

  const handlePracticeClick = (mode: "filler" | "pace") => {
    if (!hasBaseline()) {
      navigate("/baseline");
    } else {
      navigate(`/practice/${mode}/setup`);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Profile Preview Card */}
      <section
        onClick={() => navigate("/profile")}
        className="card-surface cursor-pointer hover:border-accent/20 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent/80 to-accent rounded-full flex items-center justify-center text-text-inverse text-h4 font-bold flex-shrink-0">
            {profile?.demographics?.preferredName?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-body-lg font-bold text-text-heading truncate">
              {profile?.demographics?.preferredName || "Set up your profile"}
            </h2>
            {profile?.demographics?.jobTitle && (
              <p className="text-body-sm text-text-body truncate">
                {profile.demographics.jobTitle}
              </p>
            )}
            {profile?.focusAreas?.specificGoal && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="px-2 py-0.5 bg-accent/10 text-accent text-caption rounded-full">
                  {profile.focusAreas.specificGoal.replace(/-/g, " ")}
                </span>
              </div>
            )}
          </div>
          <span className="text-text-subtle flex-shrink-0">&rarr;</span>
        </div>
      </section>

      {/* Quick Start Practice */}
      <section>
        <h2 className="text-h5 font-display font-semibold text-text-heading mb-6">
          Quick Start
        </h2>
        <CardCarousel>
          <PracticeCard
            icon="🎤"
            title="Filler Words"
            description="Practice reducing ums, uhs, and likes with real-time feedback"
            onClick={() => handlePracticeClick("filler")}
          />
          <PracticeCard
            icon="📊"
            title="Speech Pace"
            description="Practice speaking at the right pace with visual feedback"
            onClick={() => handlePracticeClick("pace")}
          />
        </CardCarousel>
      </section>

      {/* Progress Tracking */}
      {allSessions.length > 0 && (
        <section>
          <h2 className="text-h5 font-display font-semibold text-text-heading mb-6">
            Your Progress
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(() => {
              const recent = allSessions.slice(0, 5);
              const older = allSessions.slice(5, 10);

              const recentAvgFiller =
                recent.length > 0
                  ? recent.reduce((sum, s) => sum + (s.fillerRate || 0), 0) /
                    recent.length
                  : 0;
              const olderAvgFiller =
                older.length > 0
                  ? older.reduce((sum, s) => sum + (s.fillerRate || 0), 0) /
                    older.length
                  : 0;

              const recentAvgWpm =
                recent.length > 0
                  ? recent.reduce((sum, s) => sum + (s.wpm || 0), 0) /
                    recent.length
                  : 0;
              const olderAvgWpm =
                older.length > 0
                  ? older.reduce((sum, s) => sum + (s.wpm || 0), 0) /
                    older.length
                  : 0;

              const fillerTrend =
                olderAvgFiller > 0 && recentAvgFiller > 0
                  ? {
                      direction:
                        recentAvgFiller < olderAvgFiller
                          ? ("down" as const)
                          : recentAvgFiller > olderAvgFiller
                            ? ("up" as const)
                            : ("stable" as const),
                      percentage:
                        ((recentAvgFiller - olderAvgFiller) / olderAvgFiller) *
                        100,
                      period: "vs last 5 sessions",
                    }
                  : undefined;

              const wpmTrend =
                olderAvgWpm > 0 && recentAvgWpm > 0
                  ? {
                      direction:
                        recentAvgWpm > olderAvgWpm
                          ? ("up" as const)
                          : recentAvgWpm < olderAvgWpm
                            ? ("down" as const)
                            : ("stable" as const),
                      percentage:
                        ((recentAvgWpm - olderAvgWpm) / olderAvgWpm) * 100,
                      period: "vs last 5 sessions",
                    }
                  : undefined;

              return (
                <>
                  <StatCard
                    label="Filler Rate"
                    value={
                      recentAvgFiller > 0 ? recentAvgFiller.toFixed(1) : "—"
                    }
                    unit="per min"
                    trend={fillerTrend}
                    empty={recent.length === 0}
                  />
                  <StatCard
                    label="Speech Pace"
                    value={recentAvgWpm > 0 ? Math.round(recentAvgWpm) : "—"}
                    unit="WPM"
                    trend={wpmTrend}
                    empty={recent.length === 0}
                  />
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* Activity & Stats */}
      {allSessions.length > 0 && (
        <section className="card-surface space-y-6">
          <h2 className="text-h5 font-display font-semibold text-text-heading">
            Your Activity
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-h3 font-bold text-accent">
                {allSessions.length}
              </p>
              <p className="text-caption text-text-muted">Sessions</p>
            </div>
            <div>
              <p className="text-h3 font-bold text-accent">
                {Math.round(
                  allSessions.reduce(
                    (acc, s) => acc + (s.durationSeconds || 0),
                    0,
                  ) / 60,
                )}
              </p>
              <p className="text-caption text-text-muted">Minutes</p>
            </div>
            <div>
              <p className="text-h3 font-bold text-accent">
                {calculateStreak(allSessions)}
              </p>
              <p className="text-caption text-text-muted">Day Streak</p>
            </div>
          </div>
          <ContributionHeatmap />
        </section>
      )}

      {/* Recent Sessions */}
      {allSessions.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-h5 font-display font-semibold text-text-heading">
              Recent Sessions
            </h2>
            {allSessions.length > 5 && (
              <button
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="text-body-sm text-accent hover:text-accent/80 transition-colors"
              >
                {showAllSessions
                  ? "Show less"
                  : `View all (${allSessions.length})`}
              </button>
            )}
          </div>

          {recentSessions.length === 0 ? (
            <div className="card-surface text-center py-12">
              <p className="text-body text-text-muted">
                No sessions yet. Start practicing!
              </p>
            </div>
          ) : (
            <CardCarousel>
              {(showAllSessions ? allSessions : recentSessions).map(
                (session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/session/${session.id}`)}
                  />
                ),
              )}
            </CardCarousel>
          )}
        </section>
      )}

      {/* Quick Notes */}
      {quickNotes.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h5 font-display font-semibold text-text-heading">
              Quick Notes
            </h2>
            <button
              onClick={() => navigate("/profile")}
              className="text-body-sm text-accent hover:text-accent/80 transition-colors"
            >
              View all
            </button>
          </div>
          <CardCarousel>
            {quickNotes.map((note) => (
              <div key={note.id} className="card-surface">
                <p className="text-body text-text-body mb-3">{note.content}</p>
                <p className="text-caption text-text-muted">
                  {new Date(note.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </CardCarousel>
        </section>
      )}
    </div>
  );
}

// ===== Components =====

function PracticeCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full card-surface border-l-4 border-l-accent hover:bg-accent/5 text-left transition-colors min-h-[120px] active:bg-accent/10"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-h5 text-text-heading mb-2">
            {title}
          </h3>
          <p className="text-body text-text-body">{description}</p>
        </div>
        <span className="text-text-subtle flex-shrink-0 mt-1">&rarr;</span>
      </div>
    </button>
  );
}

function SessionCard({
  session,
  onClick,
}: {
  session: SessionSummary;
  onClick: () => void;
}) {
  const timeAgo = formatTimeAgo(session.timestamp);

  return (
    <button
      onClick={onClick}
      className="w-full card-surface text-left hover:border-accent/20 active:bg-accent/5 transition-colors min-h-[100px]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-body-lg text-text-heading mb-1">
            {session.durationSeconds
              ? `${Math.round(session.durationSeconds)}s session`
              : "Practice session"}
          </p>
          <p className="text-body-sm text-text-muted">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-h4 font-bold text-accent">
              {session.fillerCount}
            </p>
            <p className="text-caption text-text-muted">
              {session.wpm ? `${Math.round(session.wpm)} WPM` : "fillers"}
            </p>
          </div>
          <span className="text-text-subtle">&rarr;</span>
        </div>
      </div>
    </button>
  );
}

// ===== Helpers =====

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

function calculateStreak(sessions: SessionSummary[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionDates = new Set(
    sessions.map((s) => {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );

  let streak = 0;
  let checkDate = today;

  if (!sessionDates.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
    if (!sessionDates.has(checkDate.getTime())) {
      return 0;
    }
  }

  while (sessionDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
