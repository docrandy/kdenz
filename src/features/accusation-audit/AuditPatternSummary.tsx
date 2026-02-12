/**
 * AuditPatternSummary - Shows cross-session pattern analysis
 */

import { getAuditPatterns, getRecentAttempts } from "./auditStorage";

interface AuditPatternSummaryProps {
  onClose: () => void;
}

export function AuditPatternSummary({ onClose }: AuditPatternSummaryProps) {
  const patterns = getAuditPatterns();
  const recentAttempts = getRecentAttempts(10);

  if (!patterns || patterns.totalAttempts === 0) {
    return (
      <div className="space-y-6 text-center">
        <span className="text-6xl">📊</span>
        <h2 className="text-2xl font-bold text-text">No Data Yet</h2>
        <p className="text-text-muted">
          Complete some accusation audit practice sessions to see your patterns.
        </p>
        <button onClick={onClose} className="btn-primary w-full">
          Start Practicing
        </button>
      </div>
    );
  }

  // Trend arrow and color
  const trendConfig = {
    improving: { arrow: "↑", color: "text-status-success", label: "Improving" },
    stable: { arrow: "→", color: "text-text-muted", label: "Stable" },
    declining: { arrow: "↓", color: "text-status-error", label: "Needs Work" },
  };
  const trend = trendConfig[patterns.improvementTrend];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-2 block">📊</span>
        <h2 className="text-2xl font-bold text-text mb-2">
          Your Accusation Audit Patterns
        </h2>
        <p className="text-text-muted">
          Based on {patterns.totalAttempts} practice attempts
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-text">
            {Math.round(patterns.averageScore)}
          </p>
          <p className="text-sm text-text-subtle">Avg Score</p>
        </div>
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-text">
            {Math.round(patterns.avgCoverage)}%
          </p>
          <p className="text-sm text-text-subtle">Avg Coverage</p>
        </div>
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className={`text-3xl font-bold ${trend.color}`}>{trend.arrow}</p>
          <p className="text-sm text-text-subtle">{trend.label}</p>
        </div>
      </div>

      {/* Commonly Missed */}
      {patterns.commonMisses.length > 0 && (
        <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4">
          <h3 className="font-semibold text-status-warning mb-3">
            ⚠️ Concerns You Often Miss
          </h3>
          <ul className="space-y-2">
            {patterns.commonMisses.slice(0, 3).map((missed) => (
              <li
                key={missed.criticismId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-text-muted">{missed.criticismText}</span>
                <span className="text-status-warning text-xs">
                  Missed {missed.missCount}x
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Defensive Triggers */}
      {patterns.defenseTriggers.length > 0 && (
        <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-4">
          <h3 className="font-semibold text-status-error mb-3">
            🛡️ Defense Phrases to Avoid
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.defenseTriggers.map((phrase, idx) => (
              <span
                key={idx}
                className="bg-status-error/10 text-status-error px-2 py-1 rounded text-sm"
              >
                "{phrase}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scores */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
        <h3 className="font-semibold text-text mb-3">Recent Scores</h3>
        <div className="flex items-end gap-1 h-24">
          {recentAttempts.map((attempt, idx) => {
            const height = (attempt.analysis.overallScore / 100) * 100;
            const color =
              attempt.analysis.overallScore >= 75
                ? "bg-status-success"
                : attempt.analysis.overallScore >= 50
                  ? "bg-accent"
                  : "bg-status-warning";
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end"
              >
                <div
                  className={`w-full rounded-t ${color}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-text-subtle mt-1">
                  {attempt.analysis.overallScore}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
        <h3 className="font-semibold text-accent mb-2">💡 Focus Areas</h3>
        <ul className="text-text-muted text-sm space-y-1">
          {patterns.avgCoverage < 60 && (
            <li>• Practice listing more criticisms - aim for 3-4 per audit</li>
          )}
          {patterns.defenseTriggers.length > 0 && (
            <li>• Work on avoiding defensive language after naming concerns</li>
          )}
          {patterns.commonMisses.length > 0 && (
            <li>• Focus on the concerns you commonly miss (see above)</li>
          )}
          {patterns.averageScore >= 75 && (
            <li>• Great progress! Try more advanced scenarios</li>
          )}
        </ul>
      </div>

      {/* Continue Button */}
      <button onClick={onClose} className="btn-primary w-full">
        Continue Practicing
      </button>
    </div>
  );
}
