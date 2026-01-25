import { useState } from 'react';

export default function PracticeSession() {
  const [isActive, setIsActive] = useState(false);

  const handleStartSession = () => {
    console.log('Start Session button clicked - ready for audio integration');
    setIsActive(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-clinical-bg px-4">
      <div className="w-full max-w-md">
        {/* Card with teal accent border */}
        <div className="bg-white border-2 border-clinical-accent rounded-lg shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-clinical-text mb-2">
            Voice Practice Session
          </h1>

          {/* Subtitle */}
          <p className="text-clinical-muted mb-8">
            Ready for audio integration
          </p>

          {/* Status indicator with accent color */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive ? 'bg-clinical-accent' : 'bg-clinical-muted'
              }`}
            />
            <span className="text-sm text-clinical-muted">
              {isActive ? 'Session active' : 'Session ready'}
            </span>
          </div>

          {/* Start Session button */}
          <button
            onClick={handleStartSession}
            className="w-full bg-clinical-text text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Start Session
          </button>

          {/* Decorative accent element */}
          <div className="mt-6 pt-6 border-t border-clinical-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-clinical-accent" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-60" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
