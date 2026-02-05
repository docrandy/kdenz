import { useState } from 'react';

/**
 * ImplementationIntention Component
 * Post-metrics commitment prompt (research: d >= 0.5 effect size)
 * "When X happens, I will Y" format proven to improve transfer from practice to real-world
 *
 * Reference: transfer-of-practice-evidence-v1.md
 * Evidence: Gollwitzer's implementation intentions meta-analysis shows
 * when/then pre-commitments significantly improve skill transfer (d >= 0.5)
 */

interface ImplementationIntentionProps {
  focusMode: 'filler' | 'pace';
  fillerCount?: number;  // For personalization
  onComplete: (intention: string) => void;
  onSkip: () => void;
}

export default function ImplementationIntention({
  focusMode,
  onComplete,
  onSkip
}: ImplementationIntentionProps) {
  const [customText, setCustomText] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  // Pre-filled template based on focus mode
  const whenClause = focusMode === 'filler'
    ? 'When I notice myself about to say a filler word'
    : 'When I notice I\'m speaking too fast';

  // Suggested completions
  const suggestions = focusMode === 'filler'
    ? [
        'pause and take a breath',
        'slow down',
        'embrace the silence'
      ]
    : [
        'take a breath',
        'pause between sentences',
        'slow my next phrase'
      ];

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setCustomText('');
  };

  const handleComplete = () => {
    const intention = customText.trim() || selectedSuggestion;
    if (!intention) return;

    const fullIntention = `${whenClause}, I will ${intention}`;
    // Store in sessionStorage for potential future recall
    sessionStorage.setItem('voicelab_last_intention', fullIntention);
    onComplete(fullIntention);
  };

  const isValid = customText.trim() !== '' || selectedSuggestion !== null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-clinical-text mb-4">
            Try This Next Time
          </h1>
          <p className="text-lg text-clinical-muted mb-2">
            Pick one thing to try in your next conversation
          </p>
          <p className="text-sm text-clinical-muted">
            Research shows when/then commitments improve transfer to real situations
          </p>
        </div>

        {/* When/Then template */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-clinical-muted uppercase tracking-wide mb-2">
              When
            </p>
            <p className="text-lg text-clinical-text">
              {whenClause}
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-clinical-muted uppercase tracking-wide mb-2">
              I will
            </p>

            {/* Suggested completions */}
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSuggestion === suggestion
                      ? 'bg-clinical-accent text-white'
                      : 'bg-white border-2 border-gray-200 text-clinical-text hover:border-clinical-accent'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="relative">
              <input
                type="text"
                value={customText}
                onChange={(e) => {
                  setCustomText(e.target.value);
                  setSelectedSuggestion(null);
                }}
                placeholder="or type your own..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-clinical-accent focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {isValid && (
          <div className="bg-clinical-accent/5 border-2 border-clinical-accent/20 rounded-lg p-4">
            <p className="text-sm text-clinical-muted mb-1">Your commitment:</p>
            <p className="text-clinical-text font-medium">
              {whenClause}, I will {customText.trim() || selectedSuggestion}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleComplete}
            disabled={!isValid}
            className={`w-full px-6 py-4 rounded-lg font-semibold transition-all ${
              !isValid
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:opacity-90'
            }`}
          >
            Save & Continue
          </button>
          <button
            onClick={onSkip}
            className="text-clinical-muted hover:text-clinical-text text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
