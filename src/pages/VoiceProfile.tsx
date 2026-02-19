/**
 * VoiceProfile - Personal stats dashboard with progress tracking
 * Shows stat cards with trend indicators and Before/After comparison
 */

import { useMemo } from "react";
import StatCard from "../components/StatCard";
import BeforeAfterComparison from "../components/BeforeAfterComparison";
import {
  getAllSessions,
  type SessionSummary,
} from "../services/sessionStorage";

export default function VoiceProfile() {
  const sessions = useMemo(() => getAllSessions(), []);

  // Sort sessions by timestamp (newest first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.timestamp - a.timestamp);
  }, [sessions]);

  // Calculate stat card data
  const stats = useMemo(() => {
    if (sortedSessions.length === 0) {
      return {
        fillerRate: { value: 0, trend: undefined },
        speechPace: { value: 0, trend: undefined },
        totalSessions: { value: 0, trend: undefined },
        practiceStreak: { value: 0 },
      };
    }

    // Recent sessions (last 5)
    const recentSessions = sortedSessions.slice(0, 5);
    const olderSessions = sortedSessions.slice(5, 10);

    // Calculate averages
    const recentFillerRate =
      recentSessions.length > 0
        ? recentSessions.reduce((sum, s) => sum + s.fillerRate, 0) /
          recentSessions.length
        : 0;
    const recentWpm =
      recentSessions.length > 0
        ? recentSessions.reduce((sum, s) => sum + s.wpm, 0) /
          recentSessions.length
        : 0;

    const olderFillerRate =
      olderSessions.length > 0
        ? olderSessions.reduce((sum, s) => sum + s.fillerRate, 0) /
          olderSessions.length
        : recentFillerRate;
    const olderWpm =
      olderSessions.length > 0
        ? olderSessions.reduce((sum, s) => sum + s.wpm, 0) /
          olderSessions.length
        : recentWpm;

    // Calculate trends
    const fillerRateTrend:
      | {
          direction: "up" | "down" | "stable";
          percentage: number;
          period: string;
        }
      | undefined =
      olderSessions.length > 0 && olderFillerRate > 0
        ? {
            direction:
              recentFillerRate < olderFillerRate
                ? ("down" as const)
                : recentFillerRate > olderFillerRate
                  ? ("up" as const)
                  : ("stable" as const),
            percentage:
              ((recentFillerRate - olderFillerRate) / olderFillerRate) * 100,
            period: "vs previous",
          }
        : undefined;

    const wpmTrend:
      | {
          direction: "up" | "down" | "stable";
          percentage: number;
          period: string;
        }
      | undefined =
      olderSessions.length > 0 && olderWpm > 0
        ? {
            direction:
              Math.abs(recentWpm - olderWpm) < 5
                ? ("stable" as const)
                : recentWpm > olderWpm
                  ? ("up" as const)
                  : ("down" as const),
            percentage: ((recentWpm - olderWpm) / olderWpm) * 100,
            period: "vs previous",
          }
        : undefined;

    // Calculate practice streak (consecutive days with at least one session)
    const streak = calculateStreak(sortedSessions);

    return {
      fillerRate: {
        value: recentFillerRate,
        trend: fillerRateTrend,
      },
      speechPace: {
        value: recentWpm,
        trend: wpmTrend,
      },
      totalSessions: {
        value: sortedSessions.length,
        trend:
          olderSessions.length > 0
            ? {
                direction: "up" as const,
                percentage:
                  ((recentSessions.length - olderSessions.length) /
                    olderSessions.length) *
                  100,
                period: "vs previous",
              }
            : undefined,
      },
      practiceStreak: {
        value: streak,
      },
    };
  }, [sortedSessions]);

  // Empty state
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🎙️</div>
          <h1 className="text-h2 font-display font-semibold text-text-heading mb-4">
            Voice Profile
          </h1>
          <p className="text-body-lg text-text-muted mb-8">
            Complete your first session to see your profile
          </p>
          <button
            onClick={() => (window.location.href = "/practice/filler/setup")}
            className="btn btn-primary"
          >
            Start Your First Session
          </button>
        </div>
      </div>
    );
  }

  // Sparse data state (< 3 sessions)
  const hasEnoughData = sessions.length >= 3;

  return (
    <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 py-8">
      {/* Page title */}
      <h1 className="text-h1 font-display font-semibold text-text-heading mb-8">
        Voice Profile
      </h1>

      {/* Sparse data message */}
      {!hasEnoughData && (
        <div className="card-surface bg-background-surface border-accent/20 mb-6">
          <p className="text-body text-text-muted">
            Record more sessions to unlock trends and detailed insights.
          </p>
        </div>
      )}

      {/* Stat cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <StatCard
          label="Filler Rate"
          value={stats.fillerRate.value}
          unit="per min"
          trend={hasEnoughData ? stats.fillerRate.trend : undefined}
          empty={stats.fillerRate.value === 0}
        />
        <StatCard
          label="Speech Pace"
          value={stats.speechPace.value}
          unit="WPM"
          trend={hasEnoughData ? stats.speechPace.trend : undefined}
          empty={stats.speechPace.value === 0}
        />
        <StatCard
          label="Total Sessions"
          value={stats.totalSessions.value}
          trend={hasEnoughData ? stats.totalSessions.trend : undefined}
        />
        <StatCard
          label="Practice Streak"
          value={
            stats.practiceStreak.value > 0
              ? `${stats.practiceStreak.value} days`
              : "Keep practicing!"
          }
          trend={undefined}
        />
      </div>

      {/* Before/After comparison */}
      <div id="before-after">
        <BeforeAfterComparison sessions={sessions} />
      </div>
    </div>
  );
}

/**
 * Calculate practice streak (consecutive days with at least one session)
 */
function calculateStreak(sessions: SessionSummary[]): number {
  if (sessions.length === 0) return 0;

  // Get unique dates
  const dates = new Set(sessions.map((s) => s.date));
  const sortedDates = Array.from(dates)
    .map((d) => new Date(d + "T12:00:00").getTime())
    .sort((a, b) => b - a);

  if (sortedDates.length === 0) return 0;

  // Check consecutive days starting from today
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const todayTime = today.getTime();

  let streak = 0;
  let currentDate = todayTime;

  for (const dateTime of sortedDates) {
    const daysDiff = Math.floor(
      (currentDate - dateTime) / (1000 * 60 * 60 * 24),
    );

    if (daysDiff === streak) {
      // This date is exactly streak days ago (consecutive)
      streak++;
      currentDate = dateTime;
    } else if (daysDiff > streak) {
      // Gap found, streak broken
      break;
    }
  }

  return streak;
}
