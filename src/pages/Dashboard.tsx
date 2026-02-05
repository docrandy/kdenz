/**
 * Dashboard - Main hub for the app
 * Shows profile preview, practice modules, session summaries, and activity heatmap
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../features/profile';
import type { UserProfile } from '../features/profile';
import { getAllSessions, type SessionSummary } from '../services/sessionStorage';
import { ContributionHeatmap } from '../components/ContributionHeatmap';
import { hasBaseline } from '../services/baselineStorage';


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
  const handlePracticeClick = (mode: 'filler' | 'pace') => {
    if (!hasBaseline()) {
      // First-time user - redirect to baseline
      navigate('/baseline');
    } else {
      // Regular user - go to duration picker
      navigate(`/practice/${mode}/setup`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with hamburger menu */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">VoiceLab</h1>
          <HamburgerMenu
            onProfile={() => navigate('/profile')}
            onSettings={() => navigate('/settings')}
            onPrivacy={() => navigate('/privacy')}
          />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Preview Card */}
        <section
          onClick={() => navigate('/profile')}
          className="bg-white rounded-2xl p-6 shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {profile?.demographics?.preferredName?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.demographics?.preferredName || 'Set up your profile'}
              </h2>
              {profile?.demographics?.jobTitle && (
                <p className="text-gray-600">{profile.demographics.jobTitle}</p>
              )}
              {profile?.focusAreas?.specificGoal && (
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs rounded-full">
                    {profile.focusAreas.specificGoal.replace(/-/g, ' ')}
                  </span>
                </div>
              )}
            </div>
            <span className="text-gray-400">→</span>
          </div>
        </section>

        {/* Practice Modules */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Practice</h2>
          <div className="grid gap-3">
            {/* Filler Words Practice */}
            <PracticeCard
              icon="🎤"
              title="Filler Words"
              description="Practice reducing ums, uhs, and likes with real-time feedback"
              onClick={() => handlePracticeClick('filler')}
              accent="cyan"
            />

            {/* Speech Pace Practice */}
            <PracticeCard
              icon="📊"
              title="Speech Pace"
              description="Practice speaking at the right pace with visual feedback"
              onClick={() => handlePracticeClick('pace')}
              accent="cyan"
            />

          </div>
        </section>

        {/* Recent Sessions */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Recent Sessions</h2>
            {allSessions.length > 5 && (
              <button
                onClick={() => setShowAllSessions(!showAllSessions)}
                className="text-sm text-cyan-600 hover:text-cyan-700"
              >
                {showAllSessions ? 'Show less' : `View all (${allSessions.length})`}
              </button>
            )}
          </div>

          {recentSessions.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center border">
              <p className="text-gray-500">No sessions yet. Start practicing!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {(showAllSessions ? allSessions : recentSessions).map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => navigate(`/session/${session.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick Notes */}
        {quickNotes.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Quick Notes</h2>
              <button
                onClick={() => navigate('/profile')}
                className="text-sm text-cyan-600 hover:text-cyan-700"
              >
                View all
              </button>
            </div>
            <div className="space-y-2">
              {quickNotes.map((note) => (
                <div key={note.id} className="bg-white rounded-xl p-4 border">
                  <p className="text-gray-900 text-sm line-clamp-2">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
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
          <section className="bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-cyan-600">{allSessions.length}</p>
                <p className="text-sm text-gray-500">Sessions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-600">
                  {Math.round(
                    allSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
                  )}
                </p>
                <p className="text-sm text-gray-500">Minutes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-600">
                  {calculateStreak(allSessions)}
                </p>
                <p className="text-sm text-gray-500">Day Streak</p>
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
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Menu"
      >
        <div className="w-5 h-4 flex flex-col justify-between">
          <span className="w-full h-0.5 bg-gray-700 rounded" />
          <span className="w-full h-0.5 bg-gray-700 rounded" />
          <span className="w-full h-0.5 bg-gray-700 rounded" />
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
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border z-40 py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onProfile();
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <span>👤</span>
              <span>Profile</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onSettings();
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                onPrivacy();
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <span>🔒</span>
              <span>Privacy</span>
            </button>
            <hr className="my-2" />
            <div className="px-4 py-2 text-xs text-gray-400">
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
  accent: 'cyan';
}) {
  const accentColors = {
    cyan: 'border-l-cyan-500 hover:bg-cyan-50',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full bg-white rounded-xl p-4 border border-l-4 ${accentColors[accent]} text-left transition-colors`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <span className="text-gray-400">→</span>
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
      className="w-full bg-white rounded-xl p-4 border text-left hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-900">
            {session.durationSeconds ? `${Math.round(session.durationSeconds)}s session` : 'Practice session'}
          </p>
          <p className="text-sm text-gray-500">{timeAgo}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
              {session.fillerCount} fillers
            </p>
            <p className="text-sm text-gray-500">
              {session.wpm ? `${Math.round(session.wpm)} WPM` : ''}
            </p>
          </div>
          <span className="text-gray-300">→</span>
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

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
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
    })
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
