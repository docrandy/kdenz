import React from "react";

interface BottomControlBarProps {
  /** Current session state */
  sessionState: "recording" | "paused";
  /** Called when user presses Pause */
  onPause: () => void;
  /** Called when user presses Stop (end session) */
  onStop: () => void;
  /** Called when user presses Continue (resume recording) */
  onContinue: () => void;
}

export const BottomControlBar: React.FC<BottomControlBarProps> = ({
  onStop,
}) => {
  // Stop-only controls (no pause button) per Phase 15 design
  // onPause, onContinue, and sessionState props removed - stop-only flow
  return (
    <div className="w-full border-t border-background-elevated pt-6 pb-2">
      <div className="flex justify-center">
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-6 py-3 text-text-subtle hover:text-text transition-colors min-h-[44px]"
          aria-label="End session"
        >
          <StopIcon />
          <span className="font-medium">End Session</span>
        </button>
      </div>
    </div>
  );
};

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
