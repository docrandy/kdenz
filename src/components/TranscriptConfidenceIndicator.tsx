/**
 * Transcript Confidence Indicator
 *
 * Displays transcript quality status to inform users about metric reliability.
 * Per Core Principle #3: communicate uncertainty without judgment.
 *
 * Phase 07-02: Transcript confidence tracking
 */

interface TranscriptConfidenceIndicatorProps {
  /** Average confidence score from Web Speech API (0-1) */
  averageConfidence: number;
  /** Count of segments below 0.7 confidence threshold */
  lowSegmentCount: number;
  /** Optional additional CSS classes */
  className?: string;
}

type ConfidenceTier = "high" | "medium" | "low";

export default function TranscriptConfidenceIndicator({
  averageConfidence,
  lowSegmentCount,
  className = "",
}: TranscriptConfidenceIndicatorProps) {
  // Determine confidence tier (neutral language only)
  const tier: ConfidenceTier =
    averageConfidence >= 0.85
      ? "high"
      : averageConfidence >= 0.7
        ? "medium"
        : "low";

  // High confidence = no display (only show when < 0.85)
  if (tier === "high") {
    return null;
  }

  // Warning messages from foundation docs (locked copy)
  const getMessage = (): string => {
    if (tier === "low") {
      return "Low transcription confidence in this segment; filler counts may be under- or over-estimated.";
    }
    // Medium tier
    return "Transcription confidence is medium; some variation in filler counts may occur.";
  };

  const message = getMessage();
  const showExpanded = tier === "low" || tier === "medium";

  const tierColor =
    tier === "low" ? "text-status-error" : "text-status-warning";

  return (
    <div className={`flex items-start gap-2 text-sm ${className}`}>
      {/* Info icon - uses status color */}
      <div className="flex-shrink-0 mt-0.5">
        <svg
          className={`w-4 h-4 ${tierColor}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Confidence status and message */}
      <div className="flex-1">
        <p className="text-text-muted">
          <span className="font-medium">
            Transcription confidence:{" "}
            {tier.charAt(0).toUpperCase() + tier.slice(1)}
          </span>
          {showExpanded && (
            <span className="block mt-1 text-text-subtle">{message}</span>
          )}
        </p>

        {/* Show segment count for context (low tier only) */}
        {tier === "low" && lowSegmentCount > 0 && (
          <p className="text-xs text-text-subtle mt-1">
            {lowSegmentCount} segment{lowSegmentCount !== 1 ? "s" : ""} below
            confidence threshold
          </p>
        )}
      </div>
    </div>
  );
}
