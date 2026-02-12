/**
 * MetricCard Component
 * Individual metric display with baseline comparison and uncertainty
 * Uses locked copy from foundation/copy/metric-card-templates-v1.md
 */

interface MetricCardProps {
  label: string; // "Speech Rate" or "Filler Words"
  value: number; // Current session value
  unit: string; // "WPM" or "per minute"
  baseline?: number; // Baseline value (if exists)
  confidenceInterval?: number; // +/- margin
  contextNote?: string; // From foundation copy
  reflectionPrompt?: string; // From foundation copy
  details?: React.ReactNode; // Optional breakdown (e.g., um: 3, uh: 2)
}

export default function MetricCard({
  label,
  value,
  unit,
  baseline,
  confidenceInterval,
  contextNote,
  reflectionPrompt,
  details,
}: MetricCardProps) {
  // Calculate delta from baseline
  const delta = baseline !== undefined ? value - baseline : undefined;
  const deltaSign = delta && delta > 0 ? "+" : "";

  // Determine if delta indicates improvement (lower filler rate is better, stable pace is better)
  // For now, show delta color as: green if filler went down, amber if changed
  // Note: Pace delta is informational (no judgment)
  const isDeltaImprovement =
    label === "Filler Words" && delta !== undefined && delta < 0;
  const isDeltaChanged = delta !== undefined && Math.abs(delta) > 0.1;
  const deltaColor = isDeltaImprovement
    ? "text-status-success"
    : isDeltaChanged && label === "Filler Words"
      ? "text-status-warning"
      : "text-text-muted";

  return (
    <div className="card-surface">
      {/* Header */}
      <h4 className="text-sm sm:text-base font-semibold text-text mb-3">
        {label}
      </h4>

      {/* Primary value with confidence interval */}
      <div className="mb-2">
        <span className="text-2xl sm:text-3xl font-bold text-text">
          {value.toFixed(label === "Filler Words" ? 1 : 0)}
        </span>
        <span className="text-base sm:text-lg text-text ml-2">{unit}</span>
        {confidenceInterval !== undefined && (
          <span className="text-xs sm:text-sm text-text-muted ml-2">
            (+/-{confidenceInterval.toFixed(label === "Filler Words" ? 1 : 0)}{" "}
            {unit})
          </span>
        )}
      </div>

      {/* Baseline comparison (if exists) */}
      {baseline !== undefined && (
        <div className="space-y-1 mb-3 text-sm">
          <div className="text-text-muted">
            Baseline: {baseline.toFixed(label === "Filler Words" ? 1 : 0)}{" "}
            {unit}
          </div>
          {delta !== undefined && (
            <div className={deltaColor}>
              Difference: {deltaSign}
              {delta.toFixed(label === "Filler Words" ? 1 : 0)} {unit}
            </div>
          )}
        </div>
      )}

      {/* Details (e.g., filler breakdown) */}
      {details && <div className="mb-3">{details}</div>}

      {/* Context note and reflection prompt */}
      <div className="space-y-2 mt-4 pt-3 border-t border-background-elevated">
        {contextNote && (
          <p className="text-xs text-text-muted italic leading-relaxed">
            {contextNote}
          </p>
        )}
        {reflectionPrompt && (
          <p className="text-xs text-text-muted italic leading-relaxed">
            {reflectionPrompt}
          </p>
        )}
      </div>
    </div>
  );
}
