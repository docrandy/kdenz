/**
 * MultiSelectDecisionTree - Multi-select version of DecisionTreeSelect
 * Allows selecting multiple level-2 options across categories
 */

import { useState } from 'react';
import type { GoalCategory, TreeSelection } from '../types';

interface MultiSelectDecisionTreeProps {
  label: string;
  value: TreeSelection[];
  options: Record<Exclude<GoalCategory, 'other'>, {
    value: string;
    label: string;
    description: string;
  }[]>;
  onChange: (value: TreeSelection[]) => void;
  maxSelections?: number;
}

const CATEGORY_OPTIONS: { value: GoalCategory; label: string }[] = [
  { value: 'business', label: 'Business' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
];

export function MultiSelectDecisionTree({
  label,
  value,
  options,
  onChange,
  maxSelections = 5,
}: MultiSelectDecisionTreeProps) {
  const [activeCategory, setActiveCategory] = useState<GoalCategory>(
    value[0]?.category || 'business'
  );
  const [otherText, setOtherText] = useState(
    value.find(v => v.category === 'other')?.specificGoal || ''
  );

  const isSelected = (category: GoalCategory, specificGoal: string): boolean => {
    return value.some(v => v.category === category && v.specificGoal === specificGoal);
  };

  const hasOtherSelection = value.some(v => v.category === 'other');

  const toggleSelection = (category: GoalCategory, specificGoal: string) => {
    const exists = isSelected(category, specificGoal);

    if (exists) {
      // Remove selection
      onChange(value.filter(v => !(v.category === category && v.specificGoal === specificGoal)));
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
      const withoutOther = value.filter(v => v.category !== 'other');
      onChange([...withoutOther, { category: 'other', specificGoal: text }]);
    } else {
      // Remove 'other' selection
      onChange(value.filter(v => v.category !== 'other'));
    }
  };

  const removeSelection = (selection: TreeSelection) => {
    onChange(value.filter(v => !(v.category === selection.category && v.specificGoal === selection.specificGoal)));
    if (selection.category === 'other') {
      setOtherText('');
    }
  };

  const currentOptions = activeCategory !== 'other' ? options[activeCategory] : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <span className="text-xs text-gray-500">
          {value.length}/{maxSelections} selected
        </span>
      </div>

      {/* Selected items as chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((selection, idx) => {
            const opt = selection.category !== 'other'
              ? options[selection.category]?.find(o => o.value === selection.specificGoal)
              : null;
            const displayLabel = opt?.label || selection.specificGoal || 'Other';

            return (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 text-cyan-700 text-sm rounded-full border border-cyan-200"
              >
                <span className="text-xs text-cyan-500 capitalize">{selection.category}:</span>
                {displayLabel}
                <button
                  type="button"
                  onClick={() => removeSelection(selection)}
                  className="ml-1 text-cyan-400 hover:text-cyan-600"
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
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Level 2: Specific Options (or text input for 'other') */}
      {activeCategory === 'other' ? (
        <div>
          <input
            type="text"
            value={otherText}
            onChange={(e) => handleOtherTextChange(e.target.value)}
            placeholder="Describe your goal..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
          />
          {hasOtherSelection && (
            <p className="mt-1 text-xs text-green-600">Added to selections</p>
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
                onClick={() => !atMax && toggleSelection(activeCategory, opt.value)}
                disabled={atMax}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selected
                    ? 'border-cyan-500 bg-cyan-50'
                    : atMax
                    ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.description}</div>
                  </div>
                  {selected && (
                    <span className="text-cyan-500 text-lg">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
