interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-surface border border-background-elevated rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* VoiceLab title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-text">VoiceLab</h1>
          <p className="text-lg text-text-muted mt-2">Before we begin</p>
        </div>

        {/* What we analyze section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">
            We analyze your speech to provide feedback on:
          </h2>
          <ul className="space-y-2 text-text">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Speaking pace (words per minute)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Pause patterns (frequency, duration)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Filler word usage ("um," "uh," etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-1">✓</span>
              <span>Pitch and volume range</span>
            </li>
          </ul>
        </div>

        {/* What we DON'T analyze section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">
            What we DON'T analyze:
          </h2>
          <ul className="space-y-2 text-text">
            <li className="flex items-start gap-2">
              <span className="text-text-subtle mt-1">✗</span>
              <span>Emotion or confidence (this is unreliable)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-subtle mt-1">✗</span>
              <span>Your mental health or psychological state</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-subtle mt-1">✗</span>
              <span>Personality or character</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-text-subtle mt-1">✗</span>
              <span>Whether you're "good" or "bad" at communication</span>
            </li>
          </ul>
        </div>

        {/* Privacy section */}
        <div className="mb-8">
          <p className="text-sm text-text-muted leading-relaxed space-y-2">
            <span className="block">
              Your audio is processed locally and not stored on any server.
            </span>
            <span className="block">
              You can pause recording or close the app at any time.
            </span>
            <span className="block">
              This tool is for learning purposes only. It is not a medical or
              diagnostic tool.
            </span>
          </p>
        </div>

        {/* Accept button */}
        <button onClick={onAccept} className="btn-primary w-full">
          I Understand
        </button>
      </div>
    </div>
  );
}
