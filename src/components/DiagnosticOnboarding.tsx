/**
 * Diagnostic Onboarding Component
 * Light diagnostic questions to understand user's speaking challenges
 */

import { useState } from "react";
import {
  diagnosticQuestions,
  DiagnosticResult,
  saveDiagnosticResults,
} from "../lib/diagnosticQuestions";

interface DiagnosticOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function DiagnosticOnboarding({
  onComplete,
  onSkip,
}: DiagnosticOnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const currentQuestion = diagnosticQuestions[currentIndex];
  const isLastQuestion = currentIndex === diagnosticQuestions.length - 1;
  const progress = ((currentIndex + 1) / diagnosticQuestions.length) * 100;

  const handleSelect = (value: string, insight: string) => {
    const result: DiagnosticResult = {
      questionId: currentQuestion.id,
      selectedValue: value,
      insight,
      timestamp: Date.now(),
    };

    const updatedResults = [...results, result];
    setResults(updatedResults);

    if (isLastQuestion) {
      saveDiagnosticResults(updatedResults);
      onComplete();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-background-surface border border-background-elevated rounded-lg shadow-lg p-6 sm:p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-caption text-text-muted mb-2">
              <span>Quick diagnostic</span>
              <span>
                {currentIndex + 1} of {diagnosticQuestions.length}
              </span>
            </div>
            <div className="h-1 bg-background-elevated rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-h5 font-semibold text-text mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value, option.insight)}
                className="w-full p-4 text-left border border-background-elevated rounded-lg hover:border-accent hover:bg-accent/5 transition-colors"
              >
                <span className="text-body-sm text-text">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Skip option */}
          <div className="text-center">
            <button
              onClick={onSkip}
              className="text-caption text-text-muted hover:text-accent transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
