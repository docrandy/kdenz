/**
 * PatternSummary Component
 * Shows cross-session pattern analysis for labeling practice
 */

import { useMemo } from 'react';
import { getLabelingPatterns } from './labelingStorage';

interface PatternSummaryProps {
  onClose: () => void;
}

export function PatternSummary({ onClose }: PatternSummaryProps) {
  const patterns = useMemo(() => getLabelingPatterns(), []);

  if (!patterns || patterns.totalAttempts === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Session Summary</h2>
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-500">No practice data yet. Complete some labeling exercises to see your patterns.</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          Continue Practicing
        </button>
      </div>
    );
  }

  // Trend indicator
  const trendConfig = {
    improving: { label: 'Improving', color: 'text-green-600', emoji: '📈' },
    stable: { label: 'Stable', color: 'text-cyan-600', emoji: '➡️' },
    declining: { label: 'Needs Focus', color: 'text-orange-600', emoji: '📉' },
  };
  const trend = trendConfig[patterns.improvementTrend];

  // Vocabulary assessment
  const vocabAssessment =
    patterns.vocabularyTTR >= 0.6
      ? { label: 'Diverse', color: 'text-green-600' }
      : patterns.vocabularyTTR >= 0.4
      ? { label: 'Moderate', color: 'text-yellow-600' }
      : { label: 'Limited', color: 'text-orange-600' };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Your Labeling Patterns</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-gray-900">{patterns.totalAttempts}</p>
          <p className="text-gray-500 text-sm">Total Attempts</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-cyan-600">
            {Math.round(patterns.averageScore)}
          </p>
          <p className="text-gray-500 text-sm">Avg Score</p>
        </div>
        <div className="bg-white border rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${trend.color}`}>
            {trend.emoji} {trend.label}
          </p>
          <p className="text-gray-500 text-sm">Trend</p>
        </div>
      </div>

      {/* Syntax Error Rate */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Syntax Accuracy</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-cyan-500 h-3 rounded-full transition-all"
              style={{ width: `${(1 - patterns.syntaxErrorRate) * 100}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-gray-700">
            {Math.round((1 - patterns.syntaxErrorRate) * 100)}%
          </span>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {patterns.syntaxErrorRate < 0.2
            ? 'Excellent syntax consistency!'
            : patterns.syntaxErrorRate < 0.5
            ? 'Good progress on syntax.'
            : 'Focus on correct opening phrases.'}
        </p>
      </div>

      {/* Common Mistakes */}
      {patterns.commonMistakes.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-3">⚠️ Common Mistakes</h3>
          <ul className="space-y-2">
            {patterns.commonMistakes.slice(0, 3).map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-700">
                <span className="bg-amber-200 text-amber-800 px-2 py-0.5 rounded text-xs font-medium">
                  {mistake.count}x
                </span>
                <span className="text-sm">{mistake.mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vocabulary Diversity */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Emotional Vocabulary</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Diversity Score</span>
          <span className={`font-semibold ${vocabAssessment.color}`}>
            {vocabAssessment.label} ({(patterns.vocabularyTTR * 100).toFixed(0)}%)
          </span>
        </div>
        {patterns.emotionVocabulary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patterns.emotionVocabulary.map((word, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
              >
                {word}
              </span>
            ))}
          </div>
        )}
        {patterns.vocabularyTTR < 0.4 && (
          <p className="text-orange-600 text-sm mt-3">
            💡 Try using more varied emotion words to avoid repetitive patterns.
          </p>
        )}
      </div>

      {/* Repetitive Templates */}
      {patterns.repetitiveTemplates.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h3 className="font-semibold text-orange-800 mb-3">🔁 Repetitive Patterns</h3>
          <p className="text-orange-700 text-sm mb-3">
            You're using similar phrases repeatedly. Try varying your approach:
          </p>
          <ul className="space-y-2">
            {patterns.repetitiveTemplates.slice(0, 3).map((template, i) => (
              <li key={i} className="flex items-center gap-2 text-orange-700">
                <span className="bg-orange-200 text-orange-800 px-2 py-0.5 rounded text-xs font-medium">
                  {template.count}x
                </span>
                <span className="text-sm italic">"{template.template}..."</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Score History Mini Chart */}
      {patterns.scoreHistory.length >= 3 && (
        <div className="bg-white border rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Scores</h3>
          <div className="flex items-end gap-1 h-20">
            {patterns.scoreHistory.slice(-10).map((entry, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500 rounded-t transition-all hover:bg-cyan-600"
                style={{ height: `${entry.score}%` }}
                title={`Score: ${entry.score}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Older</span>
            <span>Recent</span>
          </div>
        </div>
      )}

      {/* Action */}
      <button
        onClick={onClose}
        className="w-full py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Continue Practicing
      </button>
    </div>
  );
}
