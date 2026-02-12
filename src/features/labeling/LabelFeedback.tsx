/**
 * LabelFeedback - Affect-based feedback display
 * Shows emotional impact on counterpart, not scores
 */

import type { LabelAttempt, AffectLevel } from "./types";

interface LabelFeedbackProps {
  attempt: LabelAttempt;
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

export function LabelFeedback({
  attempt,
  onSeeResponse,
  onRetry,
}: LabelFeedbackProps) {
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

      {/* Label depth indicator - Simplified */}
      {analysis.depth.emotionLabeled && (
        <div className="bg-background-surface border border-background-elevated rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-sm">You labeled:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                analysis.depth.targetsUnderlyingDriver
                  ? "bg-status-success/10 text-status-success"
                  : "bg-background-elevated text-text-muted"
              }`}
            >
              {analysis.depth.emotionLabeled}
              {analysis.depth.targetsUnderlyingDriver && " ✓"}
            </span>
          </div>
          <p className="text-xs text-text-subtle mt-2">
            {analysis.depth.targetsUnderlyingDriver
              ? "Underlying driver identified"
              : "Surface emotion - try going deeper next time"}
          </p>
        </div>
      )}

      {/* Expert example - as bullets, no "expert" label */}
      <div className="bg-background-elevated rounded-xl p-4">
        <p className="text-text-muted text-sm mb-2">Example response:</p>
        <p className="text-text-muted text-sm italic">
          "{analysis.expertExample}"
        </p>
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
