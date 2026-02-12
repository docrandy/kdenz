/**
 * MultiSelectDecisionTree - Multi-select version of DecisionTreeSelect
 * Allows selecting multiple level-2 options across categories
 */

import { useState } from "react";
import type { GoalCategory, TreeSelection } from "../types";

interface MultiSelectDecisionTreeProps {
  label: string;
  value: TreeSelection[];
  options: Record<
    Exclude<GoalCategory, "other">,
    {
      value: string;
      label: string;
      description: string;
    }[]
  >;
  onChange: (value: TreeSelection[]) => void;
  maxSelections?: number;
}

const CATEGORY_OPTIONS: { value: GoalCategory; label: string }[] = [
  { value: "business", label: "Business" },
  { value: "personal", label: "Personal" },
  { value: "other", label: "Other" },
];

export function MultiSelectDecisionTree({
  label,
  value,
  options,
  onChange,
  maxSelections = 5,
}: MultiSelectDecisionTreeProps) {
  const [activeCategory, setActiveCategory] = useState<GoalCategory>(
    value[0]?.category || "business",
  );
  const [otherText, setOtherText] = useState(
    value.find((v) => v.category === "other")?.specificGoal || "",
  );

  const isSelected = (
    category: GoalCategory,
    specificGoal: string,
  ): boolean => {
    return value.some(
      (v) => v.category === category && v.specificGoal === specificGoal,
    );
  };

  const hasOtherSelection = value.some((v) => v.category === "other");

  const toggleSelection = (category: GoalCategory, specificGoal: string) => {
    const exists = isSelected(category, specificGoal);

    if (exists) {
      // Remove selection
      onChange(
        value.filter(
          (v) => !(v.category === category && v.specificGoal === specificGoal),
        ),
      );
    } else {
      // Add selection (if under max)
      if (value.length < maxSelections) {
        onChange([...value, { category, specificGoal }]);
      }
    }
  };

  const handleOtherTextChange = (text: string) => {
    setOtherText(text);
    if (text.trim()) {
      // Update or add 'other' selection
      const withoutOther = value.filter((v) => v.category !== "other");
      onChange([...withoutOther, { category: "other", specificGoal: text }]);
    } else {
      // Remove 'other' selection
      onChange(value.filter((v) => v.category !== "other"));
    }
  };

  const removeSelection = (selection: TreeSelection) => {
    onChange(
      value.filter(
        (v) =>
          !(
            v.category === selection.category &&
            v.specificGoal === selection.specificGoal
          ),
      ),
    );
    if (selection.category === "other") {
      setOtherText("");
    }
  };

  const currentOptions =
    activeCategory !== "other" ? options[activeCategory] : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-muted">
          {label}
        </label>
        <span className="text-xs text-text-subtle">
          {value.length}/{maxSelections} selected
        </span>
      </div>

      {/* Selected items as chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((selection, idx) => {
            const opt =
              selection.category !== "other"
                ? options[selection.category]?.find(
                    (o) => o.value === selection.specificGoal,
                  )
                : null;
            const displayLabel =
              opt?.label || selection.specificGoal || "Other";

            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/30"
              >
                <span className="text-xs text-accent/70 capitalize">
                  {selection.category}:
                </span>
                {displayLabel}
                <button
                  type="button"
                  onClick={() => removeSelection(selection)}
                  className="ml-1 text-accent/60 hover:text-accent"
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActiveCategory(cat.value)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-accent text-text-inverse"
                : "bg-background-elevated text-text-muted hover:bg-background-subtle"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Level 2: Specific Options (or text input for 'other') */}
      {activeCategory === "other" ? (
        <div>
          <input
            type="text"
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            placeholder="Describe your goal..."
            className="input w-full"
          />
          {hasOtherSelection && (
            <p className="mt-1 text-xs text-status-success">
              Added to selections
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {currentOptions.map((opt) => {
            const selected = isSelected(activeCategory, opt.value);
            const atMax = value.length >= maxSelections && !selected;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  !atMax && toggleSelection(activeCategory, opt.value)
                }
                disabled={atMax}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected
                    ? "border-accent bg-accent/10"
                    : atMax
                      ? "border-background-elevated bg-background-elevated/50 opacity-50 cursor-not-allowed"
                      : "border-background-elevated hover:border-background-subtle"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-text text-sm">
                      {opt.label}
                    </div>
                    <div className="text-xs text-text-subtle">
                      {opt.description}
                    </div>
                  </div>
                  {selected && <span className="text-accent text-lg">✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
