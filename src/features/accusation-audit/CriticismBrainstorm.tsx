/**
 * CriticismBrainstorm - Phase 1: User brainstorms potential criticisms
 */

import { useState } from "react";
import type { AuditScenario } from "./types";

interface CriticismBrainstormProps {
  scenario: AuditScenario;
  brainstormed: string[];
  onAdd: (criticism: string) => void;
  onDone: () => void;
  onSkip?: () => void;
}

export function CriticismBrainstorm({
  scenario,
  brainstormed,
  onAdd,
  onDone,
  onSkip,
}: CriticismBrainstormProps) {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <span className="text-4xl mb-2 block">🧠</span>
        <h2 className="text-2xl font-bold text-text mb-2">
          First: What might they be thinking?
        </h2>
        <p className="text-text-muted">
          Before you see the full scenario, brainstorm what concerns they might
          have.
        </p>
      </div>

      {/* Minimal scenario context (just the type, not full details) */}
      <div className="bg-background-elevated rounded-xl p-4">
        <p className="text-text-muted text-sm">
          <strong>Situation:</strong> {scenario.category.replace(/-/g, " ")}{" "}
          conversation with your {scenario.counterpartRole.toLowerCase()}
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
          className="flex-1 p-3 border border-background-elevated rounded-xl bg-background-elevated text-text focus:ring-2 focus:ring-accent focus:border-transparent"
        />
        <button
          onClick={handleAdd}
          disabled={!input.trim()}
          className="px-4 py-3 bg-accent text-text-inverse font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:bg-background-elevated disabled:text-text-subtle"
        >
          Add
        </button>
      </div>

      {/* Brainstormed list */}
      {brainstormed.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-text-muted">
            Your brainstorm ({brainstormed.length}):
          </h3>
          <div className="space-y-2">
            {brainstormed.map((item, index) => (
              <div
                key={index}
                className="bg-background-surface border border-background-elevated rounded-lg p-3 flex items-center gap-2"
              >
                <span className="text-accent">•</span>
                <span className="text-text-muted">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidance (no hints - that would give away answers) */}
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
        <h3 className="font-semibold text-accent mb-2">💡 Think about:</h3>
        <ul className="text-text-muted text-sm space-y-1">
          <li>• What negative assumptions might they make about you?</li>
          <li>• What criticism would they have of your request?</li>
          <li>• What fears or concerns might your action trigger?</li>
        </ul>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button onClick={onDone} className="btn-primary w-full">
          {brainstormed.length > 0
            ? "Continue → See Scenario"
            : "Skip Brainstorming"}
        </button>
        {onSkip && brainstormed.length > 0 && (
          <button
            onClick={onSkip}
            className="w-full py-3 text-text-muted hover:text-text text-sm"
          >
            Skip and go straight to recording
          </button>
        )}
      </div>
    </div>
  );
}
