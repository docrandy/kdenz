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
  const [iconOpacity, setIconOpacity] = useState(1);

  // Sync icon state with recording state with crossfade transition
  useEffect(() => {
    const newState = isRecording ? "stop" : "waveform";
    if (newState !== iconState) {
      // Fade out current icon
      setIconOpacity(0);
      // After fade out, switch icon and fade in
      setTimeout(() => {
        setIconState(newState);
        setTimeout(() => setIconOpacity(1), 10);
      }, 200);
    }
  }, [isRecording, iconState]);

  // Volume sensitivity curve - more responsive at low volumes
  const sensitiveAudioLevel = isRecording ? Math.pow(audioLevel, 0.7) : 0;

  // Ring properties modulated by volume
  const outerRingOpacity = 0.2 + sensitiveAudioLevel * 0.3;
  const outerRingStroke = 1.5 + sensitiveAudioLevel * 0.5;

  const middleRingOpacity = 0.3 + sensitiveAudioLevel * 0.4;
  const middleRingStroke = 2 + sensitiveAudioLevel * 0.5;

  const innerRingOpacity = 0.35 + sensitiveAudioLevel * 0.45;
  const innerRingStroke = 1.5 + sensitiveAudioLevel * 1;

  // Body scale and glow modulation
  const bodyScale = 1.0 + sensitiveAudioLevel * 0.03;
  const glowSpread = 20 + sensitiveAudioLevel * 40;
  const glowOpacity = 0.4 + sensitiveAudioLevel * 0.3;

  // Ring radii (gaps from body edge)
  const innerRingRadius = size / 2 + 8;
  const middleRingRadius = size / 2 + 18;
  const outerRingRadius = size / 2 + 28;

  // Total footprint for SVG viewBox
  const ringSpread = 35; // max radius extension
  const totalSize = size + ringSpread * 2;
  const viewBoxSize = totalSize;
  const center = viewBoxSize / 2;

  // Gold gradient colors
  const baseGold = "#c9a84c";
  const lightGold = "#d4b35a";
  const darkGold = "#b8963f";

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

  // State-based wrapper classes
  const wrapperClasses = [
    "session-orb-wrapper",
    isLoading && "loading",
    disabled && "disabled",
    isRecording && "recording",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={wrapperClasses}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      style={{
        width: totalSize,
        height: totalSize,
      }}
    >
      {/* SVG rings layer */}
      <svg
        className="session-orb-rings"
        width={totalSize}
        height={totalSize}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Outer ring - slow rotation */}
        <circle
          className="orb-ring orb-ring-outer"
          cx={center}
          cy={center}
          r={outerRingRadius}
          fill="none"
          stroke={`rgba(201, 168, 76, ${outerRingOpacity})`}
          strokeWidth={outerRingStroke}
          strokeDasharray="40 20"
          style={{
            transition: "stroke-opacity 0.15s ease, stroke-width 0.15s ease",
          }}
        />

        {/* Middle ring - breathe pulse */}
        <circle
          className="orb-ring orb-ring-middle"
          cx={center}
          cy={center}
          r={middleRingRadius}
          fill="none"
          stroke={`rgba(201, 168, 76, ${middleRingOpacity})`}
          strokeWidth={middleRingStroke}
          strokeDasharray="15 10"
          style={{
            transition: "stroke-opacity 0.15s ease, stroke-width 0.15s ease",
          }}
        />

        {/* Inner ring - shimmer */}
        <circle
          className="orb-ring orb-ring-inner"
          cx={center}
          cy={center}
          r={innerRingRadius}
          fill="none"
          stroke={`rgba(201, 168, 76, ${innerRingOpacity})`}
          strokeWidth={innerRingStroke}
          strokeDasharray="8 6"
          style={{
            transition: "stroke-opacity 0.15s ease, stroke-width 0.15s ease",
          }}
        />
      </svg>

      {/* Orb body with radial gradient */}
      <div
        className="session-orb-body"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 35%, ${lightGold} 0%, ${baseGold} 50%, ${darkGold} 100%)`,
          boxShadow: `
            0 0 ${glowSpread}px rgba(201, 168, 76, ${glowOpacity}),
            0 0 ${glowSpread * 3}px rgba(201, 168, 76, ${glowOpacity * 0.5}),
            0 0 ${glowSpread * 5}px rgba(201, 168, 76, ${glowOpacity * 0.25})
          `,
          transform: `scale(${bodyScale})`,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        {/* Icon overlay with crossfade */}
        <div
          style={{
            opacity: iconOpacity,
            transition: "opacity 0.2s ease",
          }}
        >
          {iconState === "waveform" ? <WaveformBarsIcon /> : <StopSquareIcon />}
        </div>
      </div>
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
    <rect
      x="8"
      y="20"
      width="6"
      height="20"
      rx="3"
      fill="var(--color-navy-950)"
    />
    <rect
      x="18"
      y="12"
      width="6"
      height="36"
      rx="3"
      fill="var(--color-navy-950)"
    />
    <rect
      x="28"
      y="8"
      width="6"
      height="44"
      rx="3"
      fill="var(--color-navy-950)"
    />
    <rect
      x="38"
      y="16"
      width="6"
      height="28"
      rx="3"
      fill="var(--color-navy-950)"
    />
    <rect
      x="48"
      y="22"
      width="6"
      height="16"
      rx="3"
      fill="var(--color-navy-950)"
    />
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
    <rect
      x="15"
      y="15"
      width="30"
      height="30"
      rx="4"
      fill="var(--color-cream-100)"
    />
  </svg>
);
