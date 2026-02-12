/**
 * SegmentedControl Component
 * iOS-style segmented control with sliding gold highlight
 * Used for tab navigation with premium feel
 */

interface SegmentedControlProps {
  segments: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

export default function SegmentedControl({
  segments,
  activeIndex,
  onChange,
  className = "",
}: SegmentedControlProps) {
  const segmentWidth = 100 / segments.length;

  return (
    <div
      className={`relative flex items-center bg-background-elevated rounded-full p-1 ${className}`}
    >
      {/* Sliding gold background indicator */}
      <div
        className="absolute top-1 bottom-1 bg-accent rounded-full transition-transform duration-200 ease-out"
        style={{
          width: `calc(${segmentWidth}% - 8px)`,
          transform: `translateX(calc(${activeIndex * 100}% + 4px))`,
        }}
      />

      {/* Segment buttons */}
      {segments.map((segment, index) => (
        <button
          key={segment}
          onClick={() => onChange(index)}
          className={`relative z-10 flex-1 px-4 py-2.5 text-body-sm font-medium rounded-full transition-colors min-h-[44px] ${
            activeIndex === index ? "text-text-inverse" : "text-text-muted"
          }`}
        >
          {segment}
        </button>
      ))}
    </div>
  );
}
