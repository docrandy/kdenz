/**
 * DecisionTreeSelect - 2-level decision tree for goal/focus selection
 *
 * Research basis (PROFILE_PAGE_REDESIGN_RESEARCH.md):
 * - 2 levels keeps onboarding under 2 minutes
 * - 71% activation boost with decision-tree logic (Guru)
 * - Progressive disclosure prevents 74% drop-off
 */

import { useState } from "react";
import type { GoalCategory, TreeSelection } from "../types";

interface DecisionTreeSelectProps {
  label: string;
  value: TreeSelection;
  options: Record<
    Exclude<GoalCategory, "other">,
    {
      value: string;
      label: string;
      description: string;
    }[]
  >;
  onChange: (value: TreeSelection) => void;
}

const CATEGORY_OPTIONS: { value: GoalCategory; label: string }[] = [
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

export function DecisionTreeSelect({
  label,
  value,
  options,
  onChange,
}: DecisionTreeSelectProps) {
  const [showContext, setShowContext] = useState(!!value.additionalContext);

  const handleCategoryChange = (category: GoalCategory) => {
    onChange({
      category,
      specificGoal: undefined,
      additionalContext: value.additionalContext,
    });
  };

  const handleSpecificGoalChange = (specificGoal: string) => {
    onChange({
      ...value,
      specificGoal,
    });
  };

  const handleOtherTextChange = (text: string) => {
    onChange({
      ...value,
      specificGoal: text,
    });
  };

  const handleContextChange = (context: string) => {
    onChange({
      ...value,
      additionalContext: context,
    });
  };

  const currentOptions =
    value.category !== "other" ? options[value.category] : [];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-text-muted">
        {label}
      </label>

      {/* Level 1: Category Selection */}
      <div className="flex gap-2">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleCategoryChange(cat.value)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              value.category === cat.value
                ? "bg-accent text-text-inverse"
                : "bg-background-elevated text-text-muted hover:bg-background-subtle"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Level 2: Specific Options (or text input for 'other') */}
      {value.category === "other" ? (
        <div>
          <input
            type="text"
            value={value.specificGoal || ""}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            placeholder="Describe your goal..."
            className="input w-full"
          />
        </div>
      ) : (
        <div className="space-y-2">
          {currentOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSpecificGoalChange(opt.value)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                value.specificGoal === opt.value
                  ? "border-accent bg-accent/10"
                  : "border-background-elevated hover:border-background-subtle"
              }`}
            >
              <div className="font-medium text-text">{opt.label}</div>
              <div className="text-sm text-text-subtle">{opt.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Optional: Additional Context */}
      {(value.specificGoal || value.category === "other") && (
        <div>
          {!showContext ? (
            <button
              type="button"
              onClick={() => setShowContext(true)}
              className="text-sm text-accent hover:text-accent/80"
            >
              + Add more context (optional)
            </button>
          ) : (
            <textarea
              value={value.additionalContext || ""}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="Tell us more about this goal..."
              rows={2}
              className="input w-full resize-none"
            />
          )}
        </div>
      )}
    </div>
  );
}
