/**
 * DecisionTreeSelect - 2-level decision tree for goal/focus selection
 *
 * Research basis (PROFILE_PAGE_REDESIGN_RESEARCH.md):
 * - 2 levels keeps onboarding under 2 minutes
 * - 71% activation boost with decision-tree logic (Guru)
 * - Progressive disclosure prevents 74% drop-off
 */

import { useState } from 'react';
import type { GoalCategory, TreeSelection } from '../types';

interface DecisionTreeSelectProps {
  label: string;
  value: TreeSelection;
  options: Record<Exclude<GoalCategory, 'other'>, {
    value: string;
    label: string;
    description: string;
  }[]>;
  onChange: (value: TreeSelection) => void;
}

const CATEGORY_OPTIONS: { value: GoalCategory; label: string }[] = [
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
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

  const currentOptions = value.category !== 'other' ? options[value.category] : [];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Level 1: Category Selection */}
      <div className="flex gap-2">
        {CATEGORY_OPTIONS.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => handleCategoryChange(cat.value)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
              value.category === cat.value
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Level 2: Specific Options (or text input for 'other') */}
      {value.category === 'other' ? (
        <div>
          <input
            type="text"
            value={value.specificGoal || ''}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            placeholder="Describe your goal..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900">{opt.label}</div>
              <div className="text-sm text-gray-500">{opt.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Optional: Additional Context */}
      {(value.specificGoal || value.category === 'other') && (
        <div>
          {!showContext ? (
            <button
              type="button"
              onClick={() => setShowContext(true)}
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              + Add more context (optional)
            </button>
          ) : (
            <textarea
              value={value.additionalContext || ''}
              onChange={(e) => handleContextChange(e.target.value)}
              placeholder="Tell us more about this goal..."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
