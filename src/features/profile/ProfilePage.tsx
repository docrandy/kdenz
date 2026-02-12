/**
 * ProfilePage - 4-step wizard for goal and preference setup
 *
 * Layout (sequential, non-scrolling):
 * 1. Long-term Goals (multi-select)
 * 2. Focus Areas (single select)
 * 3. Self-Assessment (toggle options/text)
 * 4. Preferences + Additional Context
 *
 * Demographics moved to Settings page.
 * Quick Notes moved to Dashboard.
 */

import { useState } from "react";
import type { UserProfile, TreeSelection } from "./types";
import { GOAL_OPTIONS, FOCUS_OPTIONS } from "./types";
import { getProfile, saveProfile } from "./profileStorage";
import { MultiSelectDecisionTree } from "./components/MultiSelectDecisionTree";
import { DecisionTreeSelect } from "./components/DecisionTreeSelect";
import { ToggleInput } from "./components/ToggleInput";

interface ProfilePageProps {
  onBack: () => void;
}

const STEPS = [
  { id: 1, title: "Long-term Goals", subtitle: "Where do you want to be?" },
  { id: 2, title: "Focus Areas", subtitle: "What do you want to work on now?" },
  { id: 3, title: "Self-Assessment", subtitle: "What challenges do you face?" },
  { id: 4, title: "Preferences", subtitle: "How should we work with you?" },
];

const CHALLENGE_OPTIONS = [
  "Filler words (um, like)",
  "Speaking too fast",
  "Speaking too slow",
  "Avoiding conflict",
  "Being too passive",
  "Being too aggressive",
  "Losing train of thought",
  "Not listening well",
];

export function ProfilePage({ onBack }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile>(getProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  // Check if profile has been set up before (has goals or name)
  const isReturningUser =
    profile.longTermGoals.length > 0 || !!profile.demographics.preferredName;

  // Generic field updater
  const updateField = <K extends keyof UserProfile>(
    category: K,
    updates: Partial<UserProfile[K]>,
  ) => {
    setProfile((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] as object),
        ...updates,
      },
    }));
  };

  const handleGoalsChange = (goals: TreeSelection[]) => {
    setProfile((prev) => ({ ...prev, longTermGoals: goals }));
  };

  const handleFocusChange = (focus: TreeSelection) => {
    setProfile((prev) => ({ ...prev, focusAreas: focus }));
  };

  const handleAdditionalContextChange = (context: string) => {
    setProfile((prev) => ({ ...prev, additionalContext: context }));
  };

  const handleSave = () => {
    setSaveStatus("saving");
    saveProfile(profile);
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
        onBack();
      }, 500);
    }, 300);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSave();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get summary text for returning users
  const getSummaryText = () => {
    const name = profile.demographics.preferredName;
    const goalCount = profile.longTermGoals.length;
    const focus = profile.focusAreas.specificGoal;

    const parts = [];
    if (name) parts.push(name);
    if (goalCount > 0)
      parts.push(`${goalCount} goal${goalCount > 1 ? "s" : ""}`);
    if (focus) {
      const focusLabel =
        profile.focusAreas.category !== "other"
          ? FOCUS_OPTIONS[profile.focusAreas.category]?.find(
              (o) => o.value === focus,
            )?.label
          : focus;
      if (focusLabel) parts.push(`Focus: ${focusLabel}`);
    }

    return parts.join(" • ");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background-surface border-b border-background-elevated sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-text-muted hover:text-text flex items-center gap-1 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <span className="text-sm text-text-subtle">
            Step {currentStep} of 4
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-background-elevated h-1">
        <div
          className="bg-accent h-1 transition-all duration-300"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Profile Summary (returning users) */}
      {isReturningUser && currentStep === 1 && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/60 to-accent flex items-center justify-center text-text-inverse font-medium">
              {profile.demographics.preferredName?.charAt(0).toUpperCase() ||
                "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-accent truncate">
                {getSummaryText()}
              </p>
              <p className="text-xs text-accent/80">Tap to edit your profile</p>
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4">
        {/* Step Title */}
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-text">
            {STEPS[currentStep - 1].title}
          </h1>
          <p className="text-sm text-text-subtle">
            {STEPS[currentStep - 1].subtitle}
          </p>
        </div>

        {/* Step 1: Long-term Goals (Multi-select) */}
        {currentStep === 1 && (
          <MultiSelectDecisionTree
            label="Select your goals"
            value={profile.longTermGoals}
            options={GOAL_OPTIONS}
            onChange={handleGoalsChange}
            maxSelections={5}
          />
        )}

        {/* Step 2: Focus Areas (Single select) */}
        {currentStep === 2 && (
          <DecisionTreeSelect
            label="What do you want to focus on?"
            value={profile.focusAreas}
            options={FOCUS_OPTIONS}
            onChange={handleFocusChange}
          />
        )}

        {/* Step 3: Self-Assessment */}
        {currentStep === 3 && (
          <ToggleInput
            label="Biggest Challenges"
            selectedOptions={profile.selfAssessment.biggestChallenges || []}
            textValue={profile.selfAssessment.biggestChallengesText || ""}
            useTextInput={profile.selfAssessment.useTextInput || false}
            options={CHALLENGE_OPTIONS}
            onOptionsChange={(v) =>
              updateField("selfAssessment", { biggestChallenges: v })
            }
            onTextChange={(v) =>
              updateField("selfAssessment", { biggestChallengesText: v })
            }
            onToggle={(v) => updateField("selfAssessment", { useTextInput: v })}
          />
        )}

        {/* Step 4: Preferences + Additional Context */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Feedback Style
              </label>
              <select
                value={profile.preferences.feedbackStyle || "balanced"}
                onChange={(e) =>
                  updateField("preferences", {
                    feedbackStyle: e.target
                      .value as UserProfile["preferences"]["feedbackStyle"],
                  })
                }
                className="input w-full"
              >
                <option value="direct">Direct - Tell me straight</option>
                <option value="balanced">Balanced - Honest but kind</option>
                <option value="gentle">Gentle - Ease me in</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Learning Pace
              </label>
              <select
                value={profile.preferences.pacePreference || "moderate"}
                onChange={(e) =>
                  updateField("preferences", {
                    pacePreference: e.target
                      .value as UserProfile["preferences"]["pacePreference"],
                  })
                }
                className="input w-full"
              >
                <option value="take-it-slow">Take it slow</option>
                <option value="moderate">Moderate</option>
                <option value="fast-paced">Fast-paced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Additional Context{" "}
                <span className="text-text-subtle font-normal">(optional)</span>
              </label>
              <textarea
                value={profile.additionalContext || ""}
                onChange={(e) => handleAdditionalContextChange(e.target.value)}
                placeholder="Anything else we should know? e.g., I prefer morning practice, I learn best with examples..."
                rows={3}
                className="input w-full resize-none"
              />
            </div>
          </div>
        )}
      </main>

      {/* Navigation Buttons */}
      <footer className="bg-background-surface border-t border-background-elevated px-4 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          {currentStep > 1 && (
            <button onClick={handlePrevious} className="btn-ghost flex-1">
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={saveStatus === "saving"}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              saveStatus === "saved"
                ? "bg-status-success text-text-inverse"
                : "btn-primary"
            }`}
          >
            {currentStep < 4
              ? "Next"
              : saveStatus === "saving"
                ? "Saving..."
                : saveStatus === "saved"
                  ? "Saved!"
                  : "Save Profile"}
          </button>
        </div>
      </footer>
    </div>
  );
}
