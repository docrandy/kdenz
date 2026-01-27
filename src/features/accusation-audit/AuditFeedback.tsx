/**
 * AuditFeedback - Affect-based feedback display
 * Shows emotional impact on counterpart, not scores
 */

import type { AuditAttempt, AuditScenario, AffectLevel } from './types';

interface AuditFeedbackProps {
  attempt: AuditAttempt;
  scenario: AuditScenario;
  onSeeResponse: () => void;
  onRetry: () => void;
}

// Affect level display configuration
const AFFECT_CONFIG: Record<AffectLevel, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  guarded: {
    label: 'GUARDED',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  acknowledged: {
    label: 'ACKNOWLEDGED',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
  },
  understood: {
    label: 'UNDERSTOOD',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  deeply_connected: {
    label: 'DEEPLY CONNECTED',
    color: 'text-green-800',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
};

export function AuditFeedback({
  attempt,
  scenario,
  onSeeResponse,
  onRetry,
}: AuditFeedbackProps) {
  const { analysis } = attempt;
  const { affect } = analysis;
  const config = AFFECT_CONFIG[affect.level];

  return (
    <div className="space-y-5">
      {/* Affect Level - Primary Display */}
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-5`}>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500 mb-1">Their Response</p>
          <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
        </div>

        {/* What they experienced */}
        <p className="text-gray-700 text-center mb-4">
          {affect.description}
        </p>

        {/* Observable indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span className="inline-block w-2 h-2 bg-gray-400 rounded-full" />
          <span>{affect.observableIndicator}</span>
        </div>
      </div>

      {/* Pattern to Explore - Single micro-action */}
      {affect.patternToExplore && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-sm text-green-600 font-medium mb-1">Pattern to explore</p>
          <p className="text-green-800">{affect.patternToExplore}</p>
        </div>
      )}

      {/* What you said */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-500 text-sm mb-2">You said:</p>
        <p className="text-gray-900 italic">"{attempt.transcript}"</p>
      </div>

      {/* Concerns Check - Simplified */}
      <div className="bg-white border rounded-xl p-4">
        <h3 className="font-medium text-gray-700 mb-3 text-sm">Concerns addressed</h3>
        <div className="flex flex-wrap gap-2">
          {scenario.commonCriticisms.map((criticism) => {
            const covered = analysis.coverage.criticismsCovered.includes(criticism.id);
            return (
              <span
                key={criticism.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  covered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {covered ? '✓' : '○'} {criticism.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Example responses - as bullets, no "expert" label */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-600 text-sm mb-2">Example responses:</p>
        <ul className="text-gray-700 text-sm space-y-1">
          {scenario.commonCriticisms
            .filter(c => c.importance !== 'minor')
            .slice(0, 2)
            .map((c, i) => (
              <li key={i}>• "I might seem like {c.inTheirVoice}..."</li>
            ))}
        </ul>
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
