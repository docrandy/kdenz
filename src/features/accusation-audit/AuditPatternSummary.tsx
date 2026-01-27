/**
 * AuditPatternSummary - Shows cross-session pattern analysis
 */

import { getAuditPatterns, getRecentAttempts } from './auditStorage';

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
        <h2 className="text-2xl font-bold text-gray-900">No Data Yet</h2>
        <p className="text-gray-600">
          Complete some accusation audit practice sessions to see your patterns.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Start Practicing
        </button>
      </div>
    );
  }

  // Trend arrow and color
  const trendConfig = {
    improving: { arrow: '↑', color: 'text-green-600', label: 'Improving' },
    stable: { arrow: '→', color: 'text-gray-600', label: 'Stable' },
    declining: { arrow: '↓', color: 'text-red-600', label: 'Needs Work' },
  };
  const trend = trendConfig[patterns.improvementTrend];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-2 block">📊</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Accusation Audit Patterns
        </h2>
        <p className="text-gray-600">
          Based on {patterns.totalAttempts} practice attempts
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(patterns.averageScore)}
          </p>
          <p className="text-sm text-gray-500">Avg Score</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(patterns.avgCoverage)}%
          </p>
          <p className="text-sm text-gray-500">Avg Coverage</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className={`text-3xl font-bold ${trend.color}`}>
            {trend.arrow}
          </p>
          <p className="text-sm text-gray-500">{trend.label}</p>
        </div>
      </div>

      {/* Commonly Missed */}
      {patterns.commonMisses.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h3 className="font-semibold text-orange-800 mb-3">
            ⚠️ Concerns You Often Miss
          </h3>
          <ul className="space-y-2">
            {patterns.commonMisses.slice(0, 3).map((missed) => (
              <li
                key={missed.criticismId}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-orange-700">{missed.criticismText}</span>
                <span className="text-orange-500 text-xs">
                  Missed {missed.missCount}x
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Defensive Triggers */}
      {patterns.defenseTriggers.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-3">
            🛡️ Defense Phrases to Avoid
          </h3>
          <div className="flex flex-wrap gap-2">
            {patterns.defenseTriggers.map((phrase, idx) => (
              <span
                key={idx}
                className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
              >
                "{phrase}"
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Scores */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Recent Scores</h3>
        <div className="flex items-end gap-1 h-24">
          {recentAttempts.map((attempt, idx) => {
            const height = (attempt.analysis.overallScore / 100) * 100;
            const color =
              attempt.analysis.overallScore >= 75
                ? 'bg-green-400'
                : attempt.analysis.overallScore >= 50
                ? 'bg-cyan-400'
                : 'bg-orange-400';
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-end"
              >
                <div
                  className={`w-full rounded-t ${color}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400 mt-1">
                  {attempt.analysis.overallScore}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
        <h3 className="font-semibold text-cyan-800 mb-2">💡 Focus Areas</h3>
        <ul className="text-cyan-700 text-sm space-y-1">
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
      <button
        onClick={onClose}
        className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Continue Practicing
      </button>
    </div>
  );
}
