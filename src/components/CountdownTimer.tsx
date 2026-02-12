interface CountdownTimerProps {
  timeRemaining: number;
  isActive: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
}

function formatTime(seconds: number): string {
  const rounded = Math.ceil(seconds);
  if (rounded >= 60) {
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  return rounded.toString();
}

export default function CountdownTimer({
  timeRemaining,
  isActive,
  warningThreshold = 10,
  criticalThreshold = 5,
}: CountdownTimerProps) {
  if (!isActive) return null;

  const rounded = Math.ceil(timeRemaining);
  const isWarning = rounded <= warningThreshold && rounded > criticalThreshold;
  const isCritical = rounded <= criticalThreshold;

  let colorClass = "text-text";
  if (isCritical) {
    colorClass = "text-status-error animate-pulse";
  } else if (isWarning) {
    colorClass = "text-status-warning";
  }

  return (
    <div className="flex flex-col items-center mb-6">
      <span className="text-xs text-text-muted mb-1 uppercase tracking-wide">
        Time Remaining
      </span>
      <span className={`text-5xl font-mono font-bold ${colorClass}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
