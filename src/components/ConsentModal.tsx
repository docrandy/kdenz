interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* VoiceLab title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-clinical-text">VoiceLab</h1>
          <p className="text-lg text-gray-600 mt-2">Before we begin</p>
        </div>

        {/* What we analyze section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-clinical-text mb-3">
            We analyze your speech to provide feedback on:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-clinical-accent mt-1">✓</span>
              <span>Speaking pace (words per minute)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-clinical-accent mt-1">✓</span>
              <span>Pause patterns (frequency, duration)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-clinical-accent mt-1">✓</span>
              <span>Filler word usage ("um," "uh," etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-clinical-accent mt-1">✓</span>
              <span>Pitch and volume range</span>
            </li>
          </ul>
        </div>

        {/* What we DON'T analyze section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-clinical-text mb-3">
            What we DON'T analyze:
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">✗</span>
              <span>Emotion or confidence (this is unreliable)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">✗</span>
              <span>Your mental health or psychological state</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">✗</span>
              <span>Personality or character</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">✗</span>
              <span>Whether you're "good" or "bad" at communication</span>
            </li>
          </ul>
        </div>

        {/* Privacy section */}
        <div className="mb-8">
          <p className="text-sm text-gray-600 leading-relaxed space-y-2">
            <span className="block">
              Your audio is processed locally and not stored on any server.
            </span>
            <span className="block">
              You can pause recording or close the app at any time.
            </span>
            <span className="block">
              This tool is for learning purposes only. It is not a medical or diagnostic tool.
            </span>
          </p>
        </div>

        {/* Accept button */}
        <button
          onClick={onAccept}
          className="w-full bg-black text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
        >
          I Understand
        </button>
      </div>
    </div>
  );
}
