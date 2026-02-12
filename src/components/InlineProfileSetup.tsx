/**
 * InlineProfileSetup Component
 * 2-step inline profile setup for first-time users (name + goals)
 * Appears after welcome screen, under 30 seconds to complete
 */

import { useState } from "react";
import { getProfile, saveProfile } from "../features/profile/profileStorage";

interface InlineProfileSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const GOAL_OPTIONS = [
  { value: "salary-negotiation", label: "Salary negotiations" },
  { value: "difficult-conversations", label: "Difficult conversations" },
  { value: "team-leadership", label: "Team leadership" },
  { value: "client-relationships", label: "Client relationships" },
  { value: "confidence-building", label: "Confidence building" },
  { value: "conflict-handling", label: "Conflict handling" },
  { value: "boundary-setting", label: "Boundary setting" },
  { value: "speaking-up", label: "Speaking up" },
];

export default function InlineProfileSetup({
  onComplete,
  onSkip,
}: InlineProfileSetupProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleContinueFromName = () => {
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleToggleGoal = (goalValue: string) => {
    if (selectedGoals.includes(goalValue)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goalValue));
    } else {
      // Limit to 3 selections
      if (selectedGoals.length < 3) {
        setSelectedGoals([...selectedGoals, goalValue]);
      }
    }
  };

  const handleComplete = () => {
    // Save to profile
    const profile = getProfile();
    profile.demographics.preferredName = name.trim();

    // Convert selected goals to TreeSelection format
    profile.longTermGoals = selectedGoals.map((goal) => ({
      category: "other" as const,
      specificGoal: goal,
    }));

    saveProfile(profile);
    onComplete();
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background px-6 py-12">
      {/* Background gradient overlay (consistent with welcome) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background-surface/30 pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === 1 ? "bg-accent" : "bg-accent/30"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full transition-colors ${
              step === 2 ? "bg-accent" : "bg-accent/30"
            }`}
          />
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <h2 className="font-display text-h1 text-text-heading">
              What should we call you?
            </h2>
            <p className="text-body text-text-body mb-8">
              We'll use this to personalize your experience
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  handleContinueFromName();
                }
              }}
              placeholder="Your name"
              autoFocus
              className="w-full px-6 py-4 bg-background-elevated border-2 border-background-surface focus:border-accent rounded-lg text-body text-text-heading placeholder:text-text-subtle transition-colors outline-none"
            />

            <button
              onClick={handleContinueFromName}
              disabled={!name.trim()}
              className="w-full btn-primary px-8 py-4 text-body-lg font-medium rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue
            </button>

            <button
              onClick={handleSkip}
              className="text-body-sm text-text-subtle hover:text-text-body transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="text-center space-y-6">
            <h2 className="font-display text-h1 text-text-heading">
              What do you want to improve?
            </h2>
            <p className="text-body text-text-body mb-2">
              Select up to 3 areas you'd like to focus on
            </p>
            <p className="text-body-sm text-text-subtle mb-8">
              {selectedGoals.length}/3 selected
            </p>

            {/* Goal pills grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = selectedGoals.includes(goal.value);
                const isDisabled = !isSelected && selectedGoals.length >= 3;

                return (
                  <button
                    key={goal.value}
                    onClick={() => handleToggleGoal(goal.value)}
                    disabled={isDisabled}
                    className={`px-4 py-3 rounded-lg text-body-sm font-medium transition-all ${
                      isSelected
                        ? "bg-accent/20 border-2 border-accent text-text-heading"
                        : "bg-background-elevated border-2 border-background-surface text-text-body hover:border-accent/50"
                    } ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95"
                    }`}
                  >
                    {goal.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleComplete}
              disabled={selectedGoals.length === 0}
              className="w-full btn-primary px-8 py-4 text-body-lg font-medium rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Get Started
            </button>

            <button
              onClick={handleSkip}
              className="text-body-sm text-text-subtle hover:text-text-body transition-colors"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
