/**
 * Audio Quality Warning Component
 * Displays warnings for audio quality issues during session
 *
 * Phase 07-01: Polish & Error Handling
 * - Shows noise and clipping warnings
 * - Uses verbatim copy from foundation docs
 * - Dismissible per warning
 * - Clinical-warm-amber styling per design system
 */

interface AudioQualityWarningProps {
  warnings: ("noise" | "clipping")[];
  className?: string;
}

// Warning messages from foundation docs (VERBATIM)
const WARNING_MESSAGES: Record<"noise" | "clipping", string> = {
  noise: "Background noise detected; pause metrics may be inaccurate.",
  clipping:
    "Microphone clipping detected; pitch/volume estimates may be distorted.",
};

export default function AudioQualityWarning({
  warnings,
  className = "",
}: AudioQualityWarningProps) {
  // Only show unique warnings (no duplicates)
  const uniqueWarnings = Array.from(new Set(warnings));

  // Show only 1 warning at a time (most relevant)
  const visibleWarnings = uniqueWarnings.slice(0, 1);

  if (visibleWarnings.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      {visibleWarnings.map((warning) => (
        <div
          key={warning}
          className="flex items-center gap-1.5 animate-fade-in"
        >
          {/* AlertTriangle icon - small and muted */}
          <svg
            className="w-3.5 h-3.5 text-text-subtle flex-shrink-0"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-caption text-text-subtle">
            {WARNING_MESSAGES[warning]}
          </p>
        </div>
      ))}
    </div>
  );
}
