interface SessionProgressBarProps {
  /** Countdown remaining from 1 (full time left) to 0 (time's up) */
  remaining?: number;
  /** Whether bar is visible */
  visible: boolean;
}

export default function SessionProgressBar({ remaining, visible }: SessionProgressBarProps) {
  // Hide if not visible OR if remaining is undefined/null (Unlimited mode)
  if (!visible || remaining === undefined || remaining === null) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-100">
      <div
        className="h-full bg-clinical-accent transition-all duration-300 ease-out"
        style={{ width: `${Math.max(0, Math.min(remaining * 100, 100))}%` }}
      />
    </div>
  );
}
