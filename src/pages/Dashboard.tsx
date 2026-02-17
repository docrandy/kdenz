/**
 * Dashboard - Main hub for the app
 * Shows profile preview, practice modules, session summaries, and activity heatmap
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
    setRecentSessions(getAllSessions().slice(-5).reverse()); // Last 5 sessions, newest first
  }, []);

  const allSessions = getAllSessions().reverse(); // Newest first

  // Quick Notes from profile
  const quickNotes = profile?.miscellaneous?.slice(-3).reverse() || [];

  // Check if baseline exists for first-run routing
  const handlePracticeClick = (mode: "filler" | "pace") => {
    if (!hasBaseline()) {
      // First-time user - redirect to baseline
      navigate("/baseline");
    } else {
      // Regular user - go to duration picker
      navigate(`/practice/${mode}/setup`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-safe">
      {/* Header with centered title and hamburger menu */}
      <header className="bg-background-surface border-b border-background-elevated sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5 flex items-center justify-center relative">
          <h1 className="text-h2 font-display font-bold text-text-heading tracking-wide">
            VoiceLab
          </h1>
          <div className="absolute right-4 sm:right-6">
            <HamburgerMenu
              onProfile={() => navigate("/profile")}
              onSettings={() => navigate("/settings")}
              onPrivacy={() => navigate("/privacy")}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
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
            <span className="text-text-subtle flex-shrink-0">→</span>
          </div>
        </section>

        {/* Practice Modules - Always use carousel for focused view */}
        <section>
          <h2 className="text-h5 font-display font-semibold text-text-heading mb-6">
            Practice
          </h2>
          <CardCarousel>
            <PracticeCard
              icon="🎤"
              title="Filler Words"
              description="Practice reducing ums, uhs, and likes with real-time feedback"
              onClick={() => handlePracticeClick("filler")}
              accent="cyan"
            />
            <PracticeCard
              icon="📊"
              title="Speech Pace"
              description="Practice speaking at the right pace with visual feedback"
              onClick={() => handlePracticeClick("pace")}
              accent="cyan"
            />
            <PracticeCard
              icon="🏷️"
              title="Labeling Practice"
              description="Practice Chris Voss labeling — name emotions and underlying drivers"
              onClick={() => navigate("/practice/labeling")}
              accent="cyan"
            />
            <PracticeCard
              icon="🎯"
              title="Technique Library"
              description="51 negotiation techniques from 5 frameworks — browse, learn, practice"
              onClick={() => navigate("/library")}
              accent="cyan"
            />
          </CardCarousel>
        </section>

        {/* Progress Tracking - New section */}
        {allSessions.length > 0 && (
          <section>
            <h2 className="text-h5 font-display font-semibold text-text-heading mb-6">
              Your Progress
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(() => {
                // Calculate trends for progress tracking
                const recentSessions = allSessions.slice(0, 5);
                const olderSessions = allSessions.slice(5, 10);

                const recentAvgFiller =
                  recentSessions.length > 0
                    ? recentSessions.reduce(
                        (sum, s) => sum + (s.fillerRate || 0),
                        0,
                      ) / recentSessions.length
                    : 0;
                const olderAvgFiller =
                  olderSessions.length > 0
                    ? olderSessions.reduce(
                        (sum, s) => sum + (s.fillerRate || 0),
                        0,
                      ) / olderSessions.length
                    : 0;

                const recentAvgWpm =
                  recentSessions.length > 0
                    ? recentSessions.reduce((sum, s) => sum + (s.wpm || 0), 0) /
                      recentSessions.length
                    : 0;
                const olderAvgWpm =
                  olderSessions.length > 0
                    ? olderSessions.reduce((sum, s) => sum + (s.wpm || 0), 0) /
                      olderSessions.length
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
                          ((recentAvgFiller - olderAvgFiller) /
                            olderAvgFiller) *
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
                      empty={recentSessions.length === 0}
                    />
                    <StatCard
                      label="Speech Pace"
                      value={recentAvgWpm > 0 ? Math.round(recentAvgWpm) : "—"}
                      unit="WPM"
                      trend={wpmTrend}
                      empty={recentSessions.length === 0}
                    />
                  </>
                );
              })()}
            </div>
          </section>
        )}

        {/* Activity & Stats - Unified card with heatmap */}
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

        {/* Recent Sessions - Use carousel for focused view */}
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

        {/* Quick Notes - Optional, only show if exists */}
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
                  <p className="text-body text-text-body mb-3">
                    {note.content}
                  </p>
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
      </main>
    </div>
  );
}

// ===== Components =====

function HamburgerMenu({
  onProfile,
  onSettings,
  onPrivacy,
}: {
  onProfile: () => void;
  onSettings: () => void;
  onPrivacy: () => void;
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-background-elevated rounded-lg transition-colors"
        aria-label="Menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className="w-full h-0.5 bg-text-muted rounded" />
          <span className="w-full h-0.5 bg-text-muted rounded" />
          <span className="w-full h-0.5 bg-text-muted rounded" />
        </div>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-background-surface rounded-xl shadow-lg border border-background-elevated z-40 py-2 max-w-[calc(100vw-2rem)]">
            <button
              onClick={() => {
                setIsOpen(false);
                onProfile();
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/voice-profile");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🎙️</span>
              <span>Voice Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/breathing");
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🧘</span>
              <span>Breathing</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onSettings();
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onPrivacy();
              }}
              className="w-full px-4 py-3 text-left hover:bg-background-elevated active:bg-background-elevated flex items-center gap-3 text-body text-text-body"
            >
              <span>🔒</span>
              <span>Privacy</span>
            </button>
            <hr className="my-2 border-background-elevated" />
            <div className="px-4 py-2 text-caption text-text-subtle">
              Sign in coming soon
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PracticeCard({
  icon,
  title,
  description,
  onClick,
  accent,
}: {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  accent: "cyan";
}) {
  const accentColors = {
    cyan: "border-l-accent hover:bg-accent/5",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full card-surface border-l-4 ${accentColors[accent]} text-left transition-colors min-h-[120px] active:bg-accent/10`}
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-h5 text-text-heading mb-2">
            {title}
          </h3>
          <p className="text-body text-text-body">{description}</p>
        </div>
        <span className="text-text-subtle flex-shrink-0 mt-1">→</span>
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
          <span className="text-text-subtle">→</span>
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

  // Get unique dates with sessions
  const sessionDates = new Set(
    sessions.map((s) => {
      const d = new Date(s.timestamp);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }),
  );

  let streak = 0;
  let checkDate = today;

  // Check if there's a session today or yesterday to start the streak
  if (!sessionDates.has(checkDate.getTime())) {
    checkDate.setDate(checkDate.getDate() - 1);
    if (!sessionDates.has(checkDate.getTime())) {
      return 0; // No session today or yesterday = no streak
    }
  }

  // Count consecutive days
  while (sessionDates.has(checkDate.getTime())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
