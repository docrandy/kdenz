/**
 * Playback Timeline Component
 * Visual progress bar with scrubber for audio playback
 */

import { useRef, useCallback, MouseEvent } from "react";

interface PlaybackTimelineProps {
  /** Current playback position in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Callback when user seeks to a position */
  onSeek: (seconds: number) => void;
  /** Children (e.g., FillerMarkers) to overlay on timeline */
  children?: React.ReactNode;
}

/**
 * Format seconds to MM:SS
 */
function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlaybackTimeline({
  currentTime,
  duration,
  onSeek,
  children,
}: PlaybackTimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle click/drag on track to seek
  const handleSeek = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!trackRef.current || duration <= 0) return;

      const rect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const seekTime = percentage * duration;
      onSeek(seekTime);
    },
    [duration, onSeek],
  );

  return (
    <div className="w-full">
      {/* Timeline track */}
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer group"
        onClick={handleSeek}
      >
        {/* Background track */}
        <div className="absolute top-1/2 left-0 right-0 h-2 -translate-y-1/2 bg-background-elevated rounded-full overflow-hidden">
          {/* Progress fill */}
          <div
            className="h-full bg-accent transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Scrubber handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full shadow-md transition-transform group-hover:scale-110"
          style={{ left: `${progress}%` }}
        />

        {/* Filler markers overlay */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-2 pointer-events-none">
          {children}
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between mt-1">
        <span className="text-xs text-text-muted font-mono">
          {formatTime(currentTime)}
        </span>
        <span className="text-xs text-text-muted font-mono">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
