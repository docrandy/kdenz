interface SilenceNudgeProps {
  /** Whether the nudge should be visible */
  visible: boolean;
}

export default function SilenceNudge({ visible }: SilenceNudgeProps) {
  return (
    <div
      className={`
        transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex items-center justify-center py-4">
        <div className="bg-cyan-50 border border-clinical-accent rounded-lg px-6 py-3">
          <p className="text-sm text-clinical-accent font-medium text-center">
            Still there? Start speaking to continue...
          </p>
        </div>
      </div>
    </div>
  );
}
