import React from 'react';

interface BottomControlBarProps {
  /** Current session state */
  sessionState: 'recording' | 'paused';
  /** Called when user presses Pause */
  onPause: () => void;
  /** Called when user presses Stop (end session) */
  onStop: () => void;
  /** Called when user presses Continue (resume recording) */
  onContinue: () => void;
}

export const BottomControlBar: React.FC<BottomControlBarProps> = ({
  sessionState,
  onPause,
  onStop,
  onContinue,
}) => {
  return (
    <div className="w-full border-t border-gray-200 pt-6 pb-2">
      {sessionState === 'recording' && (
        <div className="flex justify-center">
          <button
            onClick={onPause}
            className="flex items-center gap-2 px-8 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded-full transition-all duration-300 min-h-[44px]"
            aria-label="Pause recording"
          >
            <PauseIcon />
            <span className="font-medium">Pause</span>
          </button>
        </div>
      )}

      {sessionState === 'paused' && (
        <div className="flex justify-center gap-4 transition-all duration-300">
          <button
            onClick={onStop}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-300 min-h-[44px]"
            aria-label="End session"
          >
            <StopIcon />
            <span className="font-medium">End Session</span>
          </button>
          <button
            onClick={onContinue}
            className="flex items-center gap-2 px-6 py-3 bg-[#39FF14] hover:bg-[#2ECC10] text-black rounded-full transition-all duration-300 min-h-[44px]"
            aria-label="Continue recording"
          >
            <PlayIcon />
            <span className="font-medium">Continue</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Pause icon (two vertical bars)
const PauseIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="4" y="2" width="3" height="12" rx="1" fill="currentColor" />
    <rect x="9" y="2" width="3" height="12" rx="1" fill="currentColor" />
  </svg>
);

// Stop icon (square)
const StopIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="10" height="10" rx="2" fill="currentColor" />
  </svg>
);

// Play icon (triangle)
const PlayIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M4 2L13 8L4 14V2Z" fill="currentColor" />
  </svg>
);
