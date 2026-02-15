/**
 * StatCard - Reusable stat card component with trend indicators
 * Used in Voice Profile page to display metrics with trend arrows
 */

interface StatCardProps {
  label: string; // "Filler Rate", "Speech Pace", "Sessions", etc.
  value: number | string; // Current value
  unit?: string; // "per min", "WPM", etc.
  trend?: {
    direction: "up" | "down" | "stable";
    percentage: number; // e.g., -15.3 for 15.3% decrease
    period: string; // "vs last week", "vs first session"
  };
  empty?: boolean; // Show empty state placeholder
}

export default function StatCard({
  label,
  value,
  unit,
  trend,
  empty = false,
}: StatCardProps) {
  if (empty) {
    return (
      <div className="card-surface">
        <div className="text-body-sm text-text-muted mb-2">{label}</div>
        <div className="text-h3 font-bold text-text-muted">—</div>
      </div>
    );
  }

  // Determine trend color and icon
  let trendColor = "text-text-muted";
  let trendIcon = "→";
  let trendText = "No change";

  if (trend) {
    if (trend.direction === "down") {
      // For filler rate, down is improvement (green)
      // For other metrics, down might be neutral or amber
      if (label === "Filler Rate") {
        trendColor = "text-status-success";
        trendIcon = "↓";
        trendText = `${Math.abs(trend.percentage).toFixed(1)}%`;
      } else {
        trendColor = "text-status-warning";
        trendIcon = "↓";
        trendText = `${Math.abs(trend.percentage).toFixed(1)}%`;
      }
    } else if (trend.direction === "up") {
      // For filler rate, up is worse (amber)
      // For sessions, up is good (green)
      if (label === "Filler Rate") {
        trendColor = "text-status-warning";
        trendIcon = "↑";
        trendText = `+${trend.percentage.toFixed(1)}%`;
      } else if (label === "Total Sessions") {
        trendColor = "text-status-success";
        trendIcon = "↑";
        trendText = `+${trend.percentage.toFixed(1)}%`;
      } else {
        trendColor = "text-status-warning";
        trendIcon = "↑";
        trendText = `+${trend.percentage.toFixed(1)}%`;
      }
    } else {
      // Stable - green for WPM (stable is good), gray for others
      if (label === "Speech Pace") {
        trendColor = "text-status-success";
      }
      trendIcon = "→";
      trendText = "No change";
    }
  }

  return (
    <div className="card-surface">
      {/* Label */}
      <div className="text-body-sm text-text-muted mb-2">{label}</div>

      {/* Value */}
      <div className="mb-3">
        <span className="text-h2 font-bold text-accent">
          {typeof value === "number" ? value.toFixed(label === "Filler Rate" ? 1 : 0) : value}
        </span>
        {unit && (
          <span className="text-body text-text-body ml-2">{unit}</span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && (
        <div className={`flex items-center gap-2 text-body-sm ${trendColor}`}>
          <span className="text-lg">{trendIcon}</span>
          <span>{trendText}</span>
          <span className="text-text-muted text-caption">({trend.period})</span>
        </div>
      )}
    </div>
  );
}
