/**
 * AuditScenarioPresenter - Displays scenario context for accusation audit
 */

import type { AuditScenario } from "./types";

interface AuditScenarioPresenterProps {
  scenario: AuditScenario;
  onStart: () => void;
}

export function AuditScenarioPresenter({
  scenario,
  onStart,
}: AuditScenarioPresenterProps) {
  return (
    <div className="space-y-6">
      {/* Scenario Context */}
      <div className="bg-background-surface rounded-2xl p-6 shadow-sm border border-background-elevated">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎭</span>
          <h2 className="text-xl font-bold text-text">The Situation</h2>
        </div>

        <p className="text-text-muted text-lg leading-relaxed mb-6">
          {scenario.context}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-background-elevated rounded-lg p-3">
            <span className="text-text-subtle block mb-1">
              You're talking to:
            </span>
            <span className="font-medium text-text">
              {scenario.counterpartRole}
            </span>
          </div>
          <div className="bg-background-elevated rounded-lg p-3">
            <span className="text-text-subtle block mb-1">Relationship:</span>
            <span className="font-medium text-text">
              {scenario.relationship}
            </span>
          </div>
        </div>

        <div className="mt-4 bg-status-warning/10 rounded-lg p-3">
          <span className="text-status-warning text-sm">
            <strong>At stake:</strong> {scenario.stakes}
          </span>
        </div>
      </div>

      {/* What to do */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
        <h3 className="font-semibold text-accent mb-2">📋 Your Task</h3>
        <p className="text-text-muted text-sm mb-3">
          <strong>
            Pre-emptively name all the negative things they might be thinking
            about you.
          </strong>
        </p>
        <p className="text-text-subtle text-sm">
          The goal is to neutralize their defensiveness by acknowledging their
          concerns before they voice them.
        </p>
      </div>

      {/* What they might think (hints) */}
      <div className="bg-background-elevated rounded-xl p-4">
        <h3 className="font-semibold text-text-muted mb-2">
          🤔 They might be thinking...
        </h3>
        <p className="text-text-subtle text-sm italic">
          What criticisms would they have of you? What assumptions might they
          make?
        </p>
      </div>

      {/* Action button */}
      <button onClick={onStart} className="btn-primary w-full">
        Start →
      </button>

      {/* Quick reminder */}
      <div className="text-center text-sm text-text-subtle">
        <p>
          <strong>Structure:</strong> "I know this might seem like [concern],
          [concern], [concern]. I get why that would be concerning."
        </p>
      </div>
    </div>
  );
}
