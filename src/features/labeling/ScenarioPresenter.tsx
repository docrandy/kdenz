/**
 * ScenarioPresenter Component
 * Displays the scenario context and AI statement for labeling practice
 */

import type { LabelingScenario } from './types';

interface ScenarioPresenterProps {
  scenario: LabelingScenario;
  onReady: () => void;
}

export function ScenarioPresenter({ scenario, onReady }: ScenarioPresenterProps) {
  // Category display names
  const categoryLabels: Record<string, string> = {
    'salary-negotiation': 'Salary Negotiation',
    'saying-no': 'Saying No',
    'difficult-conversation': 'Difficult Conversation',
    'workplace': 'Workplace',
  };

  // Difficulty colors
  const difficultyColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  return (
    <div className="space-y-6">
      {/* Category and difficulty badges */}
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
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
      <div className="text-gray-600 text-lg">
        {scenario.context}
      </div>

      {/* AI Statement - the main focus */}
      <div className="bg-gray-50 border-l-4 border-cyan-500 p-6 rounded-r-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💬</span>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">They say:</p>
            <p className="text-xl font-medium text-gray-900 italic">
              "{scenario.statement}"
            </p>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
        <p className="text-cyan-800 font-medium mb-2">Your task:</p>
        <p className="text-cyan-700">
          Label the <strong>underlying emotion or driver</strong> behind this statement.
          Use the formula: <strong>"It seems like..." / "It sounds like..."</strong>
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={onReady}
        className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
      >
        <span className="text-xl">🎤</span>
        Start Recording My Label
      </button>
    </div>
  );
}
