/**
 * Prompt Selector Component
 * UI to select an optional speaking prompt before starting a session
 */

import { useState } from 'react';
import { speakingPrompts, SpeakingPrompt } from '../data/speakingPrompts';

interface PromptSelectorProps {
  onSelect: (prompt: SpeakingPrompt | null) => void;
  selectedDuration: number; // in seconds
}

export default function PromptSelector({ onSelect, selectedDuration }: PromptSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter prompts based on selected duration
  const suitablePrompts = speakingPrompts.filter((p) => {
    if (selectedDuration <= 60) return p.duration === 'short';
    return true; // show all for longer durations
  });

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full p-3 text-sm text-clinical-muted border border-dashed border-clinical-border rounded-lg hover:border-clinical-accent hover:text-clinical-accent transition-colors"
      >
        + Add a speaking prompt (optional)
      </button>
    );
  }

  return (
    <div className="border border-clinical-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-clinical-text">Choose a prompt</h4>
        <button
          onClick={() => {
            setIsExpanded(false);
            onSelect(null);
          }}
          className="text-xs text-clinical-muted hover:text-clinical-accent"
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
            className="w-full p-3 text-left border border-clinical-border rounded-lg hover:border-clinical-accent hover:bg-clinical-accent/5 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-clinical-text">{prompt.title}</span>
              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-clinical-muted rounded">
                {prompt.category}
              </span>
            </div>
            <p className="text-xs text-clinical-muted line-clamp-2">{prompt.prompt}</p>
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
    <div className="bg-clinical-accent/5 border border-clinical-accent/20 rounded-lg p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium text-clinical-accent mb-1">Speaking Prompt</p>
          <p className="text-sm text-clinical-text">{prompt.prompt}</p>
          {prompt.tips && (
            <div className="mt-2">
              <p className="text-xs text-clinical-muted">
                Tips: {prompt.tips.join(' • ')}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onClear}
          className="flex-shrink-0 text-clinical-muted hover:text-clinical-text"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
