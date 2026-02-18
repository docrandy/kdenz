/**
 * LevelComplete — Celebration screen shown when user advances a level
 *
 * Usage:
 *   <LevelComplete
 *     completedLevel={1}
 *     onContinue={() => { advanceLevel(); goToNextDrill(); }}
 *   />
 */

interface LevelCompleteProps {
  completedLevel: number;
  onContinue: () => void;
}

function getNextLevelDescription(completedLevel: number): string {
  switch (completedLevel) {
    case 1:
      return "Now you'll practice in conversation. A character will react to your labels in real time.";
    case 2:
      return "Time to use your voice. Tonality, pace, and silence come into play.";
    default:
      return "New scenarios and label types await. Keep sharpening your skills.";
  }
}

export function LevelComplete({
  completedLevel,
  onContinue,
}: LevelCompleteProps) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-12">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-accent">
        Level {completedLevel} Complete!
      </h2>

      {/* Summary */}
      <p className="text-text-muted text-sm">You got 3 in a row. Nice work.</p>

      {/* What's next */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-5">
        <p className="text-xs text-text-subtle uppercase tracking-wider mb-2">
          What's next
        </p>
        <p className="text-text text-sm leading-relaxed">
          {getNextLevelDescription(completedLevel)}
        </p>
      </div>

      {/* Continue button */}
      <button
        onClick={onContinue}
        className="btn-primary w-full py-3 text-base font-medium"
      >
        Continue
      </button>
    </div>
  );
}
