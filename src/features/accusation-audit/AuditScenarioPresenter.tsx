/**
 * AuditScenarioPresenter - Displays scenario context for accusation audit
 */

import type { AuditScenario } from './types';

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
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎭</span>
          <h2 className="text-xl font-bold text-gray-900">The Situation</h2>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-6">
          {scenario.context}
        </p>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500 block mb-1">You're talking to:</span>
            <span className="font-medium text-gray-900">{scenario.counterpartRole}</span>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500 block mb-1">Relationship:</span>
            <span className="font-medium text-gray-900">{scenario.relationship}</span>
          </div>
        </div>

        <div className="mt-4 bg-orange-50 rounded-lg p-3">
          <span className="text-orange-700 text-sm">
            <strong>At stake:</strong> {scenario.stakes}
          </span>
        </div>
      </div>

      {/* What to do */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
        <h3 className="font-semibold text-cyan-800 mb-2">📋 Your Task</h3>
        <p className="text-cyan-700 text-sm mb-3">
          <strong>Pre-emptively name all the negative things they might be thinking about you.</strong>
        </p>
        <p className="text-cyan-600 text-sm">
          The goal is to neutralize their defensiveness by acknowledging their concerns before they voice them.
        </p>
      </div>

      {/* What they might think (hints) */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-semibold text-gray-700 mb-2">🤔 They might be thinking...</h3>
        <p className="text-gray-500 text-sm italic">
          What criticisms would they have of you? What assumptions might they make?
        </p>
      </div>

      {/* Action button */}
      <button
        onClick={onStart}
        className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Start →
      </button>

      {/* Quick reminder */}
      <div className="text-center text-sm text-gray-500">
        <p>
          <strong>Structure:</strong> "I know this might seem like [concern], [concern], [concern].
          I get why that would be concerning."
        </p>
      </div>
    </div>
  );
}
