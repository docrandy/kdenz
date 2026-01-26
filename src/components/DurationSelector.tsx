interface DurationSelectorProps {
  selected: number;
  onChange: (duration: number) => void;
  disabled?: boolean;
}

const DURATION_OPTIONS = [
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
  { value: 90, label: '90s' },
  { value: 120, label: '2min' },
];

export default function DurationSelector({
  selected,
  onChange,
  disabled = false,
}: DurationSelectorProps) {
  return (
    <div className="flex justify-center gap-2">
      {DURATION_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-full border text-sm font-medium transition-colors
              ${isSelected
                ? 'bg-clinical-accent text-white border-clinical-accent'
                : 'bg-white text-clinical-muted border-clinical-border hover:border-clinical-accent'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
