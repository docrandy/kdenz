/**
 * AuditFeedback - Affect-based feedback display
 * Shows emotional impact on counterpart, not scores
 */

import type { AuditAttempt, AuditScenario, AffectLevel } from "./types";

interface AuditFeedbackProps {
  attempt: AuditAttempt;
  scenario: AuditScenario;
  onSeeResponse: () => void;
  onRetry: () => void;
}

// Affect level display configuration
const AFFECT_CONFIG: Record<
  AffectLevel,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  guarded: {
    label: "GUARDED",
    color: "text-text-subtle",
    bgColor: "bg-background-elevated",
    borderColor: "border-background-elevated",
  },
  acknowledged: {
    label: "ACKNOWLEDGED",
    color: "text-text-muted",
    bgColor: "bg-background-elevated",
    borderColor: "border-background-elevated",
  },
  understood: {
    label: "UNDERSTOOD",
    color: "text-status-success",
    bgColor: "bg-status-success/10",
    borderColor: "border-status-success/30",
  },
  deeply_connected: {
    label: "DEEPLY CONNECTED",
    color: "text-status-success",
    bgColor: "bg-status-success/15",
    borderColor: "border-status-success/40",
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
      <div
        className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-5`}
      >
        <div className="text-center mb-4">
          <p className="text-sm text-text-subtle mb-1">Their Response</p>
          <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
        </div>

        {/* What they experienced */}
        <p className="text-text-muted text-center mb-4">{affect.description}</p>

        {/* Observable indicator */}
        <div className="flex items-center justify-center gap-2 text-sm text-text-subtle">
          <span className="inline-block w-2 h-2 bg-text-subtle rounded-full" />
          <span>{affect.observableIndicator}</span>
        </div>
      </div>

      {/* Pattern to Explore - Single micro-action */}
      {affect.patternToExplore && (
        <div className="bg-status-success/10 border border-status-success/30 rounded-xl p-4">
          <p className="text-sm text-status-success font-medium mb-1">
            Pattern to explore
          </p>
          <p className="text-text-muted">{affect.patternToExplore}</p>
        </div>
      )}

      {/* What you said */}
      <div className="bg-background-elevated rounded-xl p-4">
        <p className="text-text-subtle text-sm mb-2">You said:</p>
        <p className="text-text italic">"{attempt.transcript}"</p>
      </div>

      {/* Concerns Check - Simplified */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
        <h3 className="font-medium text-text-muted mb-3 text-sm">
          Concerns addressed
        </h3>
        <div className="flex flex-wrap gap-2">
          {scenario.commonCriticisms.map((criticism) => {
            const covered = analysis.coverage.criticismsCovered.includes(
              criticism.id,
            );
            return (
              <span
                key={criticism.id}
                className={`px-3 py-1 rounded-full text-sm ${
                  covered
                    ? "bg-status-success/10 text-status-success"
                    : "bg-background-elevated text-text-subtle"
                }`}
              >
                {covered ? "✓" : "○"} {criticism.text}
              </span>
            );
          })}
        </div>
      </div>

      {/* Example responses - as bullets, no "expert" label */}
      <div className="bg-background-elevated rounded-xl p-4">
        <p className="text-text-muted text-sm mb-2">Example responses:</p>
        <ul className="text-text-muted text-sm space-y-1">
          {scenario.commonCriticisms
            .filter((c) => c.importance !== "minor")
            .slice(0, 2)
            .map((c, i) => (
              <li key={i}>• "I might seem like {c.inTheirVoice}..."</li>
            ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={onRetry} className="btn-secondary flex-1">
          Try Again
        </button>
        <button onClick={onSeeResponse} className="btn-primary flex-1">
          See Their Response →
        </button>
      </div>
    </div>
  );
}
