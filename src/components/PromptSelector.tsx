/**
 * Prompt Selector Component
 * UI to select an optional speaking prompt before starting a session
 */

import { useState } from "react";
import { speakingPrompts, SpeakingPrompt } from "../data/speakingPrompts";

interface PromptSelectorProps {
  onSelect: (prompt: SpeakingPrompt | null) => void;
  selectedDuration: number; // in seconds
}

export default function PromptSelector({
  onSelect,
  selectedDuration,
}: PromptSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter prompts based on selected duration
  const suitablePrompts = speakingPrompts.filter((p) => {
    if (selectedDuration <= 60) return p.duration === "short";
    return true; // show all for longer durations
  });

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-3 text-body-sm text-text-muted border border-dashed border-background-elevated rounded-lg hover:border-accent hover:text-accent transition-colors"
      >
        + Add a speaking prompt (optional)
      </button>
    );
  }

  return (
    <div className="border border-background-elevated rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-body-sm font-medium text-text">Choose a prompt</h4>
        <button
          onClick={() => {
            setIsExpanded(false);
            onSelect(null);
          }}
          className="text-caption text-text-muted hover:text-accent"
        >
          Skip
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {suitablePrompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => {
              onSelect(prompt);
              setIsExpanded(false);
            }}
            className="w-full p-3 text-left border border-background-elevated rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-body-sm font-medium text-text">
                {prompt.title}
              </span>
              <span className="text-caption px-1.5 py-0.5 bg-background-elevated text-text-muted rounded">
                {prompt.category}
              </span>
            </div>
            <p className="text-caption text-text-muted line-clamp-2">
              {prompt.prompt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Active Prompt Display
 * Shows the selected prompt during a session
 */
interface ActivePromptProps {
  prompt: SpeakingPrompt;
  onClear: () => void;
}

export function ActivePrompt({ prompt, onClear }: ActivePromptProps) {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-caption font-medium text-accent mb-1">
            Speaking Prompt
          </p>
          <p className="text-body-sm text-text">{prompt.prompt}</p>
          {prompt.tips && (
            <div className="mt-3 p-2 bg-background-elevated/50 rounded">
              <p className="text-caption font-medium text-accent mb-1">Tips:</p>
              <ul className="text-body-sm text-text-muted space-y-1">
                {prompt.tips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button
          onClick={onClear}
          className="flex-shrink-0 text-text-muted hover:text-text"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
