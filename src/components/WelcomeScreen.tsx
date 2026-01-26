/**
 * Welcome Screen Component
 * Simple onboarding for first-time users
 */

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-clinical-bg px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white border-2 border-clinical-accent rounded-lg shadow-lg p-6 sm:p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-clinical-accent rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-clinical-text text-center mb-2">
            Welcome to VoiceLab
          </h1>

          {/* Subtitle */}
          <p className="text-clinical-muted text-center mb-8">
            Discover your speaking habits and improve with practice
          </p>

          {/* How it works */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-clinical-accent/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-clinical-accent">1</span>
              </div>
              <div>
                <p className="font-medium text-clinical-text">Choose a duration</p>
                <p className="text-sm text-clinical-muted">30 seconds to 2 minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-clinical-accent/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-clinical-accent">2</span>
              </div>
              <div>
                <p className="font-medium text-clinical-text">Speak freely</p>
                <p className="text-sm text-clinical-muted">Talk about anything - your day, a topic, or practice a presentation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-clinical-accent/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-clinical-accent">3</span>
              </div>
              <div>
                <p className="font-medium text-clinical-text">Review your results</p>
                <p className="text-sm text-clinical-muted">See filler words, pace, and play back your recording</p>
              </div>
            </div>
          </div>

          {/* Mic permission note */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-clinical-muted text-center">
              <span className="font-medium">Note:</span> You'll be asked to allow microphone access.
              Your audio is processed locally and never stored on our servers.
            </p>
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="w-full py-3 px-6 bg-clinical-text text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Get Started
          </button>

          {/* Beta note */}
          <p className="text-xs text-clinical-muted text-center mt-4">
            Beta version - We'd love your feedback!
          </p>
        </div>
      </div>
    </div>
  );
}
