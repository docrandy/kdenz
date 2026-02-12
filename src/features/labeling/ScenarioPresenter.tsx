/**
 * ScenarioPresenter Component
 * Displays the scenario context and AI statement for labeling practice
 */

import type { LabelingScenario } from "./types";

interface ScenarioPresenterProps {
  scenario: LabelingScenario;
  onReady: () => void;
}

export function ScenarioPresenter({
  scenario,
  onReady,
}: ScenarioPresenterProps) {
  // Category display names
  const categoryLabels: Record<string, string> = {
    "salary-negotiation": "Salary Negotiation",
    "saying-no": "Saying No",
    "difficult-conversation": "Difficult Conversation",
    workplace: "Workplace",
  };

  // Difficulty colors
  const difficultyColors: Record<string, string> = {
    beginner: "badge-success",
    intermediate: "badge-warning",
    advanced: "badge-error",
  };

  return (
    <div className="space-y-6">
      {/* Category and difficulty badges */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-background-elevated text-text-muted text-sm rounded-full">
          {categoryLabels[scenario.category] || scenario.category}
        </span>
        <span
          className={`px-3 py-1 text-sm rounded-full capitalize ${
            difficultyColors[scenario.difficulty]
          }`}
        >
          {scenario.difficulty}
        </span>
      </div>

      {/* Context */}
      <div className="text-text-muted text-lg">{scenario.context}</div>

      {/* AI Statement - the main focus */}
      <div className="bg-background-elevated border-l-4 border-accent p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <p className="text-text-subtle text-sm mb-2">They say:</p>
            <p className="text-xl font-medium text-text italic">
              "{scenario.statement}"
            </p>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
        <p className="text-accent font-medium mb-2">Your task:</p>
        <p className="text-accent/90">
          Label the <strong>underlying emotion or driver</strong> behind this
          statement. Use the formula:{" "}
          <strong>"It seems like..." / "It sounds like..."</strong>
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={onReady}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span className="text-xl">🎤</span>
        Start Recording My Label
      </button>
    </div>
  );
}
