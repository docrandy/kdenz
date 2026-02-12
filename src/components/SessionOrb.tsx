import React, { useEffect, useState } from "react";
import "./SessionOrb.css";

interface SessionOrbProps {
  /** 0-1 audio level from mic — drives brightness during recording */
  audioLevel: number;
  /** Whether currently recording */
  isRecording: boolean;
  /** Click handler */
  onClick: () => void;
  /** Whether the orb is in a loading/starting state */
  isLoading?: boolean;
  /** Whether click is disabled */
  disabled?: boolean;
  /** Optional size override in px (default 200) */
  size?: number;
}

export const SessionOrb: React.FC<SessionOrbProps> = ({
  audioLevel,
  isRecording,
  onClick,
  isLoading = false,
  disabled = false,
  size = 200,
}) => {
  const [iconState, setIconState] = useState<"waveform" | "stop">("waveform");

  // Sync icon state with recording state
  useEffect(() => {
    setIconState(isRecording ? "stop" : "waveform");
  }, [isRecording]);

  // Calculate brightness based on audio level during recording
  // Whisper (0-0.1): dim (0.7), speaking (0.1-0.5): normal (0.7-1.0), loud (0.5-1.0): brightest (1.0-1.3)
  const brightness = isRecording ? 0.7 + audioLevel * 0.6 : 1.0;

  // Calculate glow intensity based on audio level
  const glowIntensity = isRecording ? 0.5 + audioLevel * 0.5 : 0.6;

  // Gold accent from v2.0 design system
  const baseColor = "#c9a84c";
  const glowColor = "rgba(201, 168, 76, OPACITY)";

  // Build dynamic box-shadow for ambient glow
  const boxShadow = `
    0 0 ${20 * glowIntensity}px ${glowColor.replace("OPACITY", "0.4")},
    0 0 ${60 * glowIntensity}px ${glowColor.replace("OPACITY", "0.2")},
    0 0 ${100 * glowIntensity}px ${glowColor.replace("OPACITY", "0.1")}
  `;

  // Accessibility label
  const ariaLabel = isRecording ? "Stop recording" : "Start recording";

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  return (
    <div
      className={`session-orb-container ${isLoading ? "loading" : ""} ${disabled ? "disabled" : ""}`}
      style={{
        width: size,
        height: size,
        backgroundColor: baseColor,
        boxShadow,
        filter: `brightness(${brightness})`,
      }}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {iconState === "waveform" ? <WaveformBarsIcon /> : <StopSquareIcon />}
    </div>
  );
};

// Waveform bars icon (equalizer-style vertical bars of varying heights)
const WaveformBarsIcon: React.FC = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="8" y="20" width="6" height="20" rx="3" fill="#0b0e14" />
    <rect x="18" y="12" width="6" height="36" rx="3" fill="#0b0e14" />
    <rect x="28" y="8" width="6" height="44" rx="3" fill="#0b0e14" />
    <rect x="38" y="16" width="6" height="28" rx="3" fill="#0b0e14" />
    <rect x="48" y="22" width="6" height="16" rx="3" fill="#0b0e14" />
  </svg>
);

// Cream stop square icon
const StopSquareIcon: React.FC = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="15" y="15" width="30" height="30" rx="4" fill="#e8e2d6" />
  </svg>
);
