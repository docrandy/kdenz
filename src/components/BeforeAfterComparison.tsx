/**
 * BeforeAfterComparison - Side-by-side session comparison component
 * Shows metrics from two sessions with delta indicators
 */

import { useState, useMemo } from "react";
import type { SessionSummary } from "../services/sessionStorage";
import { getBaseline } from "../services/baselineStorage";

interface BeforeAfterComparisonProps {
  sessions: SessionSummary[]; // All sessions from sessionStorage
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function formatDeltaDuration(seconds: number): string {
  const sign = seconds >= 0 ? "+" : "";
  return `${sign}${formatDuration(Math.abs(seconds))}`;
}

export default function BeforeAfterComparison({
  sessions,
}: BeforeAfterComparisonProps) {
  const baseline = getBaseline();
  
  // Sort sessions by timestamp (newest first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => b.timestamp - a.timestamp);
  }, [sessions]);

  // Default selections: most recent vs first session (or baseline)
  const mostRecent = sortedSessions[0];
  const firstSession = sortedSessions[sortedSessions.length - 1];
  const baselineSession = baseline
    ? {
        id: "baseline",
        timestamp: baseline.timestamp,
        date: new Date(baseline.timestamp).toISOString().split("T")[0],
        durationSeconds: baseline.durationSeconds,
        wordCount: baseline.wordCount,
        wpm: baseline.wpm,
        fillerCount: baseline.fillerCount,
        fillerRate: baseline.fillerRate,
        is_baseline: true,
      }
    : null;

  const [sessionAId, setSessionAId] = useState<string>(
    mostRecent?.id || "none"
  );
  const [sessionBId, setSessionBId] = useState<string>(
    baselineSession?.id || firstSession?.id || "none"
  );

  // Get selected sessions
  const sessionA =
    sessionAId === "baseline"
      ? baselineSession
      : sortedSessions.find((s) => s.id === sessionAId);
  const sessionB =
    sessionBId === "baseline"
      ? baselineSession
      : sortedSessions.find((s) => s.id === sessionBId);

  // Calculate deltas
  const deltas = useMemo(() => {
    if (!sessionA || !sessionB) return null;

    const fillerRateDelta =
      sessionA.fillerRate > 0
        ? ((sessionB.fillerRate - sessionA.fillerRate) / sessionA.fillerRate) *
          100
        : 0;
    const wpmDelta =
      sessionA.wpm > 0
        ? ((sessionB.wpm - sessionA.wpm) / sessionA.wpm) * 100
        : 0;
    const durationDelta = sessionB.durationSeconds - sessionA.durationSeconds;
    const fillerCountDelta = sessionB.fillerCount - sessionA.fillerCount;

    return {
      fillerRate: fillerRateDelta,
      wpm: wpmDelta,
      duration: durationDelta,
      fillerCount: fillerCountDelta,
    };
  }, [sessionA, sessionB]);

  // Format session label
  const getSessionLabel = (session: SessionSummary | null, id: string) => {
    if (!session) return "Select session";
    if (id === "baseline") return "Baseline";
    if (session === mostRecent) return "Most Recent";
    if (session === firstSession && !baselineSession) return "First Session";
    const date = new Date(session.timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (sortedSessions.length === 0) {
    return (
      <div className="card-surface">
        <h3 className="text-h3 font-semibold text-text-heading mb-4">
          Progress Comparison
        </h3>
        <p className="text-body text-text-muted">
          Complete at least one session to see progress comparisons.
        </p>
      </div>
    );
  }

  return (
    <div className="card-surface">
      <h3 className="text-h3 font-semibold text-text-heading mb-6">
        Progress Comparison
      </h3>

      {/* Session selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-body-sm text-text-muted mb-2">
            Compare
          </label>
          <select
            value={sessionAId}
            onChange={(e) => setSessionAId(e.target.value)}
            className="w-full px-4 py-2 bg-background-surface border border-background-elevated rounded-lg text-body text-text-body focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {mostRecent && (
              <option value={mostRecent.id}>Most Recent</option>
            )}
            {baselineSession && (
              <option value="baseline">Baseline</option>
            )}
            {firstSession && firstSession !== mostRecent && (
              <option value={firstSession.id}>First Session</option>
            )}
            {sortedSessions.map((session) => {
              if (
                session === mostRecent ||
                session === firstSession ||
                session.id === "baseline"
              )
                return null;
              const date = new Date(session.timestamp);
              return (
                <option key={session.id} value={session.id}>
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-body-sm text-text-muted mb-2">
            With
          </label>
          <select
            value={sessionBId}
            onChange={(e) => setSessionBId(e.target.value)}
            className="w-full px-4 py-2 bg-background-surface border border-background-elevated rounded-lg text-body text-text-body focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {mostRecent && (
              <option value={mostRecent.id}>Most Recent</option>
            )}
            {baselineSession && (
              <option value="baseline">Baseline</option>
            )}
            {firstSession && firstSession !== mostRecent && (
              <option value={firstSession.id}>First Session</option>
            )}
            {sortedSessions.map((session) => {
              if (
                session === mostRecent ||
                session === firstSession ||
                session.id === "baseline"
              )
                return null;
              const date = new Date(session.timestamp);
              return (
                <option key={session.id} value={session.id}>
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Side-by-side comparison */}
      {sessionA && sessionB && deltas && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Session A */}
          <div className="card-surface bg-background-surface">
            <div className="text-body-sm text-text-muted mb-4">
              {getSessionLabel(sessionA, sessionAId)}
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Filler Rate
                </div>
                <div className="text-h4 font-bold text-accent">
                  {sessionA.fillerRate.toFixed(1)} per min
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Speech Pace
                </div>
                <div className="text-h4 font-bold text-accent">
                  {sessionA.wpm} WPM
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Duration
                </div>
                <div className="text-h4 font-bold text-accent">
                  {formatDuration(sessionA.durationSeconds)}
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Fillers
                </div>
                <div className="text-h4 font-bold text-accent">
                  {sessionA.fillerCount}
                </div>
              </div>
            </div>
          </div>

          {/* Session B */}
          <div className="card-surface bg-background-surface">
            <div className="text-body-sm text-text-muted mb-4">
              {getSessionLabel(sessionB, sessionBId)}
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Filler Rate
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-h4 font-bold text-accent">
                    {sessionB.fillerRate.toFixed(1)} per min
                  </div>
                  <div
                    className={`text-body-sm ${
                      deltas.fillerRate < 0
                        ? "text-status-success"
                        : deltas.fillerRate > 0
                          ? "text-status-warning"
                          : "text-text-muted"
                    }`}
                  >
                    {deltas.fillerRate > 0 ? "+" : ""}
                    {deltas.fillerRate.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Speech Pace
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-h4 font-bold text-accent">
                    {sessionB.wpm} WPM
                  </div>
                  <div
                    className={`text-body-sm ${
                      Math.abs(deltas.wpm) < 5
                        ? "text-status-success"
                        : "text-status-warning"
                    }`}
                  >
                    {deltas.wpm > 0 ? "+" : ""}
                    {deltas.wpm.toFixed(1)}%
                  </div>
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Duration
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-h4 font-bold text-accent">
                    {formatDuration(sessionB.durationSeconds)}
                  </div>
                  <div className="text-body-sm text-text-muted">
                    {formatDeltaDuration(deltas.duration)}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-body-sm text-text-muted mb-1">
                  Fillers
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-h4 font-bold text-accent">
                    {sessionB.fillerCount}
                  </div>
                  <div
                    className={`text-body-sm ${
                      deltas.fillerCount < 0
                        ? "text-status-success"
                        : deltas.fillerCount > 0
                          ? "text-status-warning"
                          : "text-text-muted"
                    }`}
                  >
                    {deltas.fillerCount > 0 ? "+" : ""}
                    {deltas.fillerCount}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
