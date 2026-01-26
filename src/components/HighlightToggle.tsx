/**
 * Highlight Toggle Component
 * Toggle between filler/pace/none highlight modes for transcript
 */

export type HighlightMode = 'none' | 'fillers' | 'pace';

interface HighlightToggleProps {
  mode: HighlightMode;
  onChange: (mode: HighlightMode) => void;
  fillerCount: number;
}

const MODES: { value: HighlightMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'fillers', label: 'Fillers' },
  { value: 'pace', label: 'Pace' },
];

export default function HighlightToggle({
  mode,
  onChange,
  fillerCount,
}: HighlightToggleProps) {
  return (
    <div className="flex justify-center gap-2">
      {MODES.map(({ value, label }) => {
        const isActive = mode === value;
        const showBadge = value === 'fillers' && fillerCount > 0;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`relative px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
              isActive
                ? 'bg-clinical-accent text-white'
                : 'bg-gray-100 text-clinical-muted hover:bg-gray-200'
            }`}
          >
            {label}
            {showBadge && (
              <span
                className={`ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full ${
                  isActive
                    ? 'bg-white/30 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {fillerCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
