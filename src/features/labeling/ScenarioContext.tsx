/**
 * ScenarioContext Component
 * Shows WHO the user is talking to, WHERE they are, and relevant backstory
 * BEFORE the drill starts. Does NOT reveal the character's statement.
 *
 * Usage:
 *   <ScenarioContext scenario={scenario} onStart={() => setState("presenting")} />
 */

import type { LabelingScenario } from "./types";

interface ScenarioContextProps {
  scenario: LabelingScenario;
  onStart: () => void;
}

export function ScenarioContext({ scenario, onStart }: ScenarioContextProps) {
  const initial = scenario.characterName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar + name + role row */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center text-lg font-bold flex-shrink-0"
          aria-hidden="true"
        >
          {initial}
        </div>
        <div>
          <span className="text-lg font-semibold text-text">
            {scenario.characterName}
          </span>
          <span className="text-text-subtle"> — </span>
          <span className="text-text-muted">{scenario.characterRole}</span>
        </div>
      </div>

      {/* Setting */}
      <p className="text-sm text-text-subtle italic">{scenario.setting}</p>

      {/* Context card */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-5">
        <p className="text-text-muted leading-relaxed">{scenario.context}</p>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="btn-primary w-full py-3 text-base font-medium"
      >
        Start Practice
      </button>
    </div>
  );
}
