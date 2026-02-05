import { useState } from 'react';

/**
 * SelfAssessment Component
 * Pre-metrics reflection prompt (research: d >= 0.4 effect size)
 * Shows before revealing session data to improve metacognitive accuracy
 *
 * Reference: transfer-of-practice-evidence-v1.md
 * Evidence: Self-regulated learning research shows asking users to self-assess
 * before showing data improves metacognitive accuracy and skill transfer
 */

interface SelfAssessmentProps {
  focusMode: 'filler' | 'pace';
  onComplete: (response: SelfAssessmentResponse) => void;
  onSkip: () => void;
}

export interface SelfAssessmentResponse {
  rating: 1 | 2 | 3 | 4 | 5;  // 1=low awareness, 5=high awareness
  note?: string;  // Optional brief note
}

export default function SelfAssessment({ focusMode, onComplete, onSkip }: SelfAssessmentProps) {
  const [selectedRating, setSelectedRating] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [note, setNote] = useState('');

  const handleComplete = () => {
    if (selectedRating === null) return;
    onComplete({ rating: selectedRating, note: note.trim() || undefined });
  };

  // Question and labels vary by focus mode
  const question = focusMode === 'filler'
    ? 'Before we show your results, how aware were you of your filler words?'
    : 'Before we show your results, how did your speaking pace feel?';

  const labels: Record<1 | 2 | 3 | 4 | 5, string> = focusMode === 'filler'
    ? {
        1: 'Not very aware',
        2: 'Somewhat aware',
        3: 'Moderately aware',
        4: 'Quite aware',
        5: 'Very aware'
      }
    : {
        1: 'Felt rushed',
        2: 'A bit fast',
        3: 'About right',
        4: 'Comfortable',
        5: 'Felt controlled'
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-clinical-text mb-4">
            Quick Reflection
          </h1>
          <p className="text-lg text-clinical-muted">
            {question}
          </p>
        </div>

        {/* 5-point scale */}
        <div className="space-y-3">
          {([1, 2, 3, 4, 5] as const).map((rating) => (
            <button
              key={rating}
              onClick={() => setSelectedRating(rating)}
              className={`w-full px-6 py-4 rounded-lg text-left border-2 transition-all ${
                selectedRating === rating
                  ? 'border-clinical-accent bg-clinical-accent/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-clinical-text font-medium">
                  {labels[rating]}
                </span>
                <span className={`text-sm ${
                  selectedRating === rating
                    ? 'text-clinical-accent font-semibold'
                    : 'text-gray-400'
                }`}>
                  {rating}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Optional note */}
        <div>
          <label
            htmlFor="self-assess-note"
            className="block text-sm text-clinical-muted mb-2"
          >
            Any thoughts about this session? (optional)
          </label>
          <input
            id="self-assess-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., Felt distracted today"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-clinical-accent focus:outline-none transition-colors"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleComplete}
            disabled={selectedRating === null}
            className={`w-full px-6 py-4 rounded-lg font-semibold transition-all ${
              selectedRating === null
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:opacity-90'
            }`}
          >
            Show My Results
          </button>
          <button
            onClick={onSkip}
            className="text-clinical-muted hover:text-clinical-text text-sm transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
