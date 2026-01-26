/**
 * LabelFeedback Component
 * Displays analysis results for a labeling attempt
 */

import type { LabelAttempt, LabelGrade } from './types';

interface LabelFeedbackProps {
  attempt: LabelAttempt;
  onSeeResponse: () => void;
  onRetry: () => void;
}

export function LabelFeedback({ attempt, onSeeResponse, onRetry }: LabelFeedbackProps) {
  const { analysis } = attempt;

  // Grade display config
  const gradeConfig: Record<LabelGrade, { label: string; color: string; emoji: string }> = {
    expert: { label: 'Expert', color: 'text-green-600', emoji: '🎯' },
    proficient: { label: 'Proficient', color: 'text-cyan-600', emoji: '👍' },
    developing: { label: 'Developing', color: 'text-yellow-600', emoji: '📈' },
    novice: { label: 'Keep Practicing', color: 'text-orange-600', emoji: '💪' },
  };

  const grade = gradeConfig[analysis.grade];

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-cyan-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="space-y-6">
      {/* What they said */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-sm mb-2">You said:</p>
        <p className="text-lg text-gray-900 italic">"{attempt.transcript}"</p>
      </div>

      {/* Score and Grade */}
      <div className="flex items-center justify-between p-4 bg-white border rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{grade.emoji}</span>
          <div>
            <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
            <p className="text-gray-500 text-sm">Label Quality</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}
          </p>
          <p className="text-gray-500 text-sm">/ 100</p>
        </div>
      </div>

      {/* Syntax Breakdown */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Syntax Check</h3>
        <div className="space-y-2">
          <CheckItem
            label="Correct opener (It seems/sounds/looks like...)"
            passed={analysis.syntax.hasCorrectOpener}
          />
          <CheckItem
            label='Avoids "I" framing'
            passed={analysis.syntax.avoidsIFraming}
          />
          <CheckItem
            label='Avoids "You" framing'
            passed={analysis.syntax.avoidsYouFraming}
          />
          <CheckItem
            label="Statement (not question)"
            passed={analysis.syntax.isStatement}
          />
        </div>
        {analysis.syntax.openerUsed && (
          <p className="mt-3 text-sm text-gray-600">
            Opener used: <span className="font-medium">"{analysis.syntax.openerUsed}"</span>
          </p>
        )}
      </div>

      {/* Depth Breakdown */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Emotional Depth</h3>
        <div className="flex items-center gap-3 mb-3">
          <SpecificityBadge level={analysis.depth.specificity} />
          {analysis.depth.emotionLabeled && (
            <span className="text-gray-600">
              Labeled: <span className="font-medium">{analysis.depth.emotionLabeled}</span>
            </span>
          )}
        </div>
        <div className="space-y-2">
          <CheckItem
            label="Targets underlying driver (not surface emotion)"
            passed={analysis.depth.targetsUnderlyingDriver}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {analysis.allFeedback.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="font-semibold text-amber-800 mb-3">💡 Feedback</h3>
          <ul className="space-y-2">
            {analysis.allFeedback.map((feedback, i) => (
              <li key={i} className="text-amber-700 flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                {feedback}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Expert Example */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 className="font-semibold text-green-800 mb-2">🎯 Expert Example</h3>
        <p className="text-green-700 italic">"{analysis.expertExample}"</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRetry}
          className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
        <button
          onClick={onSeeResponse}
          className="flex-1 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          See Their Response →
        </button>
      </div>
    </div>
  );
}

// Helper component for check items
function CheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={passed ? 'text-green-500' : 'text-red-400'}>
        {passed ? '✓' : '✗'}
      </span>
      <span className={passed ? 'text-gray-700' : 'text-gray-500'}>{label}</span>
    </div>
  );
}

// Helper component for specificity badge
function SpecificityBadge({ level }: { level: 'generic' | 'specific' | 'highly-specific' }) {
  const config = {
    generic: { label: 'Generic', color: 'bg-orange-100 text-orange-700' },
    specific: { label: 'Specific', color: 'bg-cyan-100 text-cyan-700' },
    'highly-specific': { label: 'Highly Specific', color: 'bg-green-100 text-green-700' },
  };

  const { label, color } = config[level];

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {label}
    </span>
  );
}
