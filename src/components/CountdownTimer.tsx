interface CountdownTimerProps {
  timeRemaining: number;
  isActive: boolean;
}

function formatTime(seconds: number): string {
  const rounded = Math.ceil(seconds);
  if (rounded >= 60) {
    const mins = Math.floor(rounded / 60);
    const secs = rounded % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return rounded.toString();
}

export default function CountdownTimer({
  timeRemaining,
  isActive,
}: CountdownTimerProps) {
  if (!isActive) return null;

  const rounded = Math.ceil(timeRemaining);
  const isWarning = rounded <= 10 && rounded > 5;
  const isCritical = rounded <= 5;

  let colorClass = 'text-clinical-text';
  if (isCritical) {
    colorClass = 'text-red-500 animate-pulse';
  } else if (isWarning) {
    colorClass = 'text-yellow-500';
  }

  return (
    <div className="flex flex-col items-center mb-6">
      <span className="text-xs text-clinical-muted mb-1 uppercase tracking-wide">
        Time Remaining
      </span>
      <span className={`text-5xl font-mono font-bold ${colorClass}`}>
        {formatTime(timeRemaining)}
      </span>
    </div>
  );
}
