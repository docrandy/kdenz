interface SessionProgressBarProps {
  /** Progress from 0 to 1 */
  progress: number;
  /** Whether bar is visible */
  visible: boolean;
}

export default function SessionProgressBar({ progress, visible }: SessionProgressBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-gray-100">
      <div
        className="h-full bg-clinical-accent transition-all duration-300 ease-out"
        style={{ width: `${Math.min(progress * 100, 100)}%` }}
      />
    </div>
  );
}
