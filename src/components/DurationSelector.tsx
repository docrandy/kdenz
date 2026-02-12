import { DURATION_OPTIONS } from "../services/durationConfig";

interface DurationSelectorProps {
  selected: number;
  onChange: (duration: number) => void;
  disabled?: boolean;
}

export default function DurationSelector({
  selected,
  onChange,
  disabled = false,
}: DurationSelectorProps) {
  return (
    <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
      {DURATION_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              px-5 sm:px-6 py-3 rounded-full border text-sm sm:text-base font-medium transition-colors
              min-h-[44px] min-w-[80px] sm:min-w-[100px]
              ${
                isSelected
                  ? "bg-accent text-text-inverse border-accent"
                  : "bg-background-surface text-text-muted border-background-elevated hover:border-accent hover:bg-background-elevated"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {option.value === 0 ? "∞" : option.label}
          </button>
        );
      })}
    </div>
  );
}
