interface SessionProgressBarProps {
  /** Countdown remaining from 1 (full time left) to 0 (time's up) */
  remaining?: number;
  /** Whether bar is visible */
  visible: boolean;
}

export default function SessionProgressBar({
  remaining,
  visible,
}: SessionProgressBarProps) {
  // Hide if not visible OR if remaining is undefined/null (Unlimited mode)
  if (!visible || remaining === undefined || remaining === null) return null;

  // Convert remaining (1.0 -> 0.0) to elapsed (0% -> 100%) for left-to-right animation
  const elapsedPercentage = (1 - remaining) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-background-elevated">
      <div
        className="h-full bg-accent transition-all duration-1000 ease-linear"
        style={{ width: `${Math.max(0, Math.min(elapsedPercentage, 100))}%` }}
      />
    </div>
  );
}
