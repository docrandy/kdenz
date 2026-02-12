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
      {/* Header with hamburger menu */}
      <header className="bg-background-surface border-b border-background-elevated sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <h1 className="text-h4 font-bold text-text-heading">VoiceLab</h1>
          <HamburgerMenu
            onProfile={() => navigate("/profile")}
            onSettings={() => navigate("/settings")}
            onPrivacy={() => navigate("/privacy")}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Preview Card */}
        <section
          onClick={() => navigate("/profile")}
          className="bg-background-surface rounded-2xl p-4 sm:p-6 border border-background-elevated cursor-pointer hover:border-accent/20 transition-colors"
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

        {/* Practice Modules */}
        <section>
          <h2 className="text-h5 font-semibold text-text-heading mb-3">Practice</h2>
          <div className="grid gap-3">
            {/* Filler Words Practice */}
            <PracticeCard
              icon="🎤"
              title="Filler Words"
              description="Practice reducing ums, uhs, and likes with real-time feedback"
              onClick={() => handlePracticeClick("filler")}
              accent="cyan"
            />

            {/* Speech Pace Practice */}
            <PracticeCard
              icon="📊"
              title="Speech Pace"
              description="Practice speaking at the right pace with visual feedback"
              onClick={() => handlePracticeClick("pace")}
              accent="cyan"
            />

            {/* Scenario Library - 51 techniques across 5 frameworks */}
            <PracticeCard
              icon="🎯"
              title="Technique Library"
              description="51 negotiation techniques from 5 frameworks — browse, learn, practice"
              onClick={() => navigate("/library")}
              accent="cyan"
            />
          </div>
        </section>

        {/* Recent Sessions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h5 font-semibold text-text-heading">Recent Sessions</h2>
            {allSessions.length > 5 && (
              <button
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="text-body-sm text-accent hover:text-accent/80"
              >
                {showAllSessions
                  ? "Show less"
                  : `View all (${allSessions.length})`}
              </button>
            )}
          </div>

          {recentSessions.length === 0 ? (
            <div className="bg-background-surface rounded-xl p-6 text-center border border-background-elevated">
              <p className="text-text-subtle">
                No sessions yet. Start practicing!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {(showAllSessions ? allSessions : recentSessions).map(
                (session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onClick={() => navigate(`/session/${session.id}`)}
                  />
                ),
              )}
            </div>
          )}
        </section>

        {/* Quick Notes */}
        {quickNotes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-text">Quick Notes</h2>
              <button
                onClick={() => navigate("/profile")}
                className="text-sm text-accent hover:text-accent/80"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {quickNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-background-surface rounded-xl p-4 border border-background-elevated"
                >
                  <p className="text-text text-sm line-clamp-2">
                    {note.content}
                  </p>
                  <p className="text-xs text-text-subtle mt-1">
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Activity Heatmap */}
        {allSessions.length > 0 && <ContributionHeatmap />}

        {/* Quick Stats */}
        {allSessions.length > 0 && (
          <section className="bg-background-surface rounded-2xl p-4 sm:p-6 border border-background-elevated">
            <h2 className="text-lg font-semibold text-text mb-4">
              Your Progress
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
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
      className={`w-full bg-background-surface rounded-xl p-4 sm:p-5 border border-background-elevated border-l-4 ${accentColors[accent]} text-left transition-colors min-h-[60px] active:bg-accent/10`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-body text-text-heading">
            {title}
          </h3>
          <p className="text-body-sm text-text-body line-clamp-2">
            {description}
          </p>
        </div>
        <span className="text-text-subtle flex-shrink-0">→</span>
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
      className="w-full bg-background-surface rounded-xl p-4 border border-background-elevated text-left hover:bg-background-elevated active:bg-background-elevated transition-colors min-h-[72px]"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-text text-sm sm:text-base truncate">
            {session.durationSeconds
              ? `${Math.round(session.durationSeconds)}s session`
              : "Practice session"}
          </p>
          <p className="text-xs sm:text-sm text-text-muted">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-base sm:text-lg font-semibold text-text">
              {session.fillerCount}
            </p>
            <p className="text-xs sm:text-sm text-text-muted">
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
