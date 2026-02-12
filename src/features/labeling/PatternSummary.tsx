/**
 * PatternSummary Component
 * Shows cross-session pattern analysis for labeling practice
 */

import { useMemo } from "react";
import { getLabelingPatterns } from "./labelingStorage";

interface PatternSummaryProps {
  onClose: () => void;
}

export function PatternSummary({ onClose }: PatternSummaryProps) {
  const patterns = useMemo(() => getLabelingPatterns(), []);

  if (!patterns || patterns.totalAttempts === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-text">Session Summary</h2>
        <div className="bg-background-elevated rounded-xl p-8 text-center">
          <p className="text-text-subtle">
            No practice data yet. Complete some labeling exercises to see your
            patterns.
          </p>
        </div>
        <button onClick={onClose} className="btn-primary w-full">
          Continue Practicing
        </button>
      </div>
    );
  }

  // Trend indicator
  const trendConfig = {
    improving: {
      label: "Improving",
      color: "text-status-success",
      emoji: "📈",
    },
    stable: { label: "Stable", color: "text-accent", emoji: "➡️" },
    declining: {
      label: "Needs Focus",
      color: "text-status-warning",
      emoji: "📉",
    },
  };
  const trend = trendConfig[patterns.improvementTrend];

  // Vocabulary assessment
  const vocabAssessment =
    patterns.vocabularyTTR >= 0.6
      ? { label: "Diverse", color: "text-status-success" }
      : patterns.vocabularyTTR >= 0.4
        ? { label: "Moderate", color: "text-status-warning" }
        : { label: "Limited", color: "text-status-warning" };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-text">Your Labeling Patterns</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-text">
            {patterns.totalAttempts}
          </p>
          <p className="text-text-subtle text-sm">Total Attempts</p>
        </div>
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-accent">
            {Math.round(patterns.averageScore)}
          </p>
          <p className="text-text-subtle text-sm">Avg Score</p>
        </div>
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4 text-center">
          <p className={`text-2xl font-bold ${trend.color}`}>
            {trend.emoji} {trend.label}
          </p>
          <p className="text-text-subtle text-sm">Trend</p>
        </div>
      </div>

      {/* Syntax Error Rate */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
        <h3 className="font-semibold text-text mb-3">Syntax Accuracy</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-background-elevated rounded-full h-3">
            <div
              className="bg-accent h-3 rounded-full transition-all"
              style={{ width: `${(1 - patterns.syntaxErrorRate) * 100}%` }}
            />
          </div>
          <span className="text-lg font-semibold text-text-muted">
            {Math.round((1 - patterns.syntaxErrorRate) * 100)}%
          </span>
        </div>
        <p className="text-text-subtle text-sm mt-2">
          {patterns.syntaxErrorRate < 0.2
            ? "Excellent syntax consistency!"
            : patterns.syntaxErrorRate < 0.5
              ? "Good progress on syntax."
              : "Focus on correct opening phrases."}
        </p>
      </div>

      {/* Common Mistakes */}
      {patterns.commonMistakes.length > 0 && (
        <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4">
          <h3 className="font-semibold text-status-warning mb-3">
            ⚠️ Common Mistakes
          </h3>
          <ul className="space-y-2">
            {patterns.commonMistakes.slice(0, 3).map((mistake, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-status-warning"
              >
                <span className="bg-status-warning/20 text-status-warning px-2 py-0.5 rounded text-xs font-medium">
                  {mistake.count}x
                </span>
                <span className="text-sm">{mistake.mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Vocabulary Diversity */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
        <h3 className="font-semibold text-text mb-3">Emotional Vocabulary</h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-text-muted">Diversity Score</span>
          <span className={`font-semibold ${vocabAssessment.color}`}>
            {vocabAssessment.label} ({(patterns.vocabularyTTR * 100).toFixed(0)}
            %)
          </span>
        </div>
        {patterns.emotionVocabulary.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {patterns.emotionVocabulary.map((word, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-background-elevated text-text-muted text-sm rounded"
              >
                {word}
              </span>
            ))}
          </div>
        )}
        {patterns.vocabularyTTR < 0.4 && (
          <p className="text-status-warning text-sm mt-3">
            💡 Try using more varied emotion words to avoid repetitive patterns.
          </p>
        )}
      </div>

      {/* Repetitive Templates */}
      {patterns.repetitiveTemplates.length > 0 && (
        <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4">
          <h3 className="font-semibold text-status-warning mb-3">
            🔁 Repetitive Patterns
          </h3>
          <p className="text-status-warning text-sm mb-3">
            You're using similar phrases repeatedly. Try varying your approach:
          </p>
          <ul className="space-y-2">
            {patterns.repetitiveTemplates.slice(0, 3).map((template, i) => (
              <li
                key={i}
                className="flex items-center gap-2 text-status-warning"
              >
                <span className="bg-status-warning/20 text-status-warning px-2 py-0.5 rounded text-xs font-medium">
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
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
          <h3 className="font-semibold text-text mb-3">Recent Scores</h3>
          <div className="flex items-end gap-1 h-20">
            {patterns.scoreHistory.slice(-10).map((entry, i) => (
              <div
                key={i}
                className="flex-1 bg-accent rounded-t transition-all hover:bg-accent/80"
                style={{ height: `${entry.score}%` }}
                title={`Score: ${entry.score}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-text-subtle mt-1">
            <span>Older</span>
            <span>Recent</span>
          </div>
        </div>
      )}

      {/* Action */}
      <button onClick={onClose} className="btn-primary w-full">
        Continue Practicing
      </button>
    </div>
  );
}
