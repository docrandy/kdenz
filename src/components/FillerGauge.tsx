/**
 * FillerGauge Component
 * Peloton-style visual gauge for real-time filler count display
 *
 * UI Rule (agents.md): Visual gauges required, not plain numbers (3.5x retention)
 */

interface FillerGaugeProps {
  fillerCount: number;
  fillerRate: number;
  /** Good threshold - at or below this rate is green */
  thresholdGood?: number;
  /** Warning threshold - above good, at or below this is yellow */
  thresholdWarning?: number;
  /** Maximum for gauge scale (defaults to 10) */
  maxCount?: number;
}

function getGaugeColor(rate: number, good: number, warning: number): string {
  if (rate <= good) return "hsl(var(--status-success))";
  if (rate <= warning) return "hsl(var(--status-warning))";
  return "hsl(var(--status-error))";
}

function getStatusLabel(rate: number, good: number, warning: number): string {
  if (rate <= good) return "Great";
  if (rate <= warning) return "OK";
  return "High";
}

export default function FillerGauge({
  fillerCount,
  fillerRate,
  thresholdGood = 2,
  thresholdWarning = 5,
  maxCount = 10,
}: FillerGaugeProps) {
  const gaugeColor = getGaugeColor(fillerRate, thresholdGood, thresholdWarning);
  const statusLabel = getStatusLabel(
    fillerRate,
    thresholdGood,
    thresholdWarning,
  );

  // Calculate fill percentage (capped at 100%)
  const fillPercentage = Math.min((fillerCount / maxCount) * 100, 100);

  // SVG arc calculations for circular gauge
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (fillPercentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-3 bg-background-surface rounded-lg">
      {/* Circular Gauge */}
      <div className="relative w-28 h-28">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="hsl(var(--background-elevated))"
            strokeWidth={strokeWidth}
          />
          {/* Filled arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-h3 font-bold transition-colors duration-300"
            style={{ color: gaugeColor }}
          >
            {fillerCount}
          </span>
          <span className="text-caption text-text-subtle">fillers</span>
        </div>
      </div>

      {/* Status label */}
      <div
        className="mt-2 px-3 py-1 rounded-full text-caption font-medium text-text-inverse transition-colors duration-300"
        style={{ backgroundColor: gaugeColor }}
      >
        {statusLabel}
      </div>

      {/* Rate display */}
      <p className="text-caption text-text-subtle mt-2">
        {fillerRate.toFixed(1)}/min
      </p>
    </div>
  );
}
