/**
 * CriticismBrainstorm - Phase 1: User brainstorms potential criticisms
 */

import { useState } from 'react';
import type { AuditScenario } from './types';

interface CriticismBrainstormProps {
  scenario: AuditScenario;
  brainstormed: string[];
  onAdd: (criticism: string) => void;
  onDone: () => void;
}

export function CriticismBrainstorm({
  scenario,
  brainstormed,
  onAdd,
  onDone,
}: CriticismBrainstormProps) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-2 block">🧠</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What might they be thinking?
        </h2>
        <p className="text-gray-600">
          List every negative assumption they could have about you.
        </p>
      </div>

      {/* Scenario reminder */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-gray-600 text-sm">
          <strong>{scenario.counterpartRole}:</strong> {scenario.context.slice(0, 100)}...
        </p>
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="They might think I'm..."
          className="flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-4 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:bg-gray-300"
        >
          Add
        </button>
      </div>

      {/* Brainstormed list */}
      {brainstormed.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Your brainstorm:</h3>
          <div className="space-y-2">
            {brainstormed.map((item, index) => (
              <div
                key={index}
                className="bg-white border rounded-lg p-3 flex items-center gap-2"
              >
                <span className="text-cyan-500">•</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints from scenario */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h3 className="font-semibold text-amber-800 mb-2">💡 Common concerns in this situation:</h3>
        <ul className="text-amber-700 text-sm space-y-1">
          {scenario.commonCriticisms
            .filter((c) => c.importance === 'critical')
            .slice(0, 2)
            .map((c) => (
              <li key={c.id}>• {c.text}</li>
            ))}
          <li className="text-amber-600 italic">• ...what else?</li>
        </ul>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full py-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
      >
        Done Brainstorming → Record Audit
      </button>
    </div>
  );
}
