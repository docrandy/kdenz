/**
 * Filler Markers Component
 * Renders clickable dots on the playback timeline showing filler positions
 */

import { FillerDetection } from "../core/audio/FillerDetector";

interface FillerMarkersProps {
  /** Array of filler detection events */
  fillerEvents: FillerDetection[];
  /** Total duration in seconds (for positioning) */
  duration: number;
  /** Callback when user clicks a marker to seek */
  onSeek: (seconds: number) => void;
}

export default function FillerMarkers({
  fillerEvents,
  duration,
  onSeek,
}: FillerMarkersProps) {
  if (duration <= 0 || fillerEvents.length === 0) {
    return null;
  }

  return (
    <>
      {fillerEvents.map((event, index) => {
        // Convert timestamp from ms to seconds, then to percentage
        const timestampSeconds = event.timestamp / 1000;
        const position = (timestampSeconds / duration) * 100;

        // Skip markers outside valid range
        if (position < 0 || position > 100) return null;

        return (
          <button
            key={`${event.timestamp}-${index}`}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-status-warning rounded-full pointer-events-auto hover:scale-150 hover:bg-status-warning/80 transition-transform cursor-pointer z-10"
            style={{ left: `${position}%` }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent timeline click
              onSeek(timestampSeconds);
            }}
            title={`${event.type} (${(event.confidence * 100).toFixed(0)}% confidence)`}
            aria-label={`Filler: ${event.type} at ${timestampSeconds.toFixed(1)}s`}
          />
        );
      })}
    </>
  );
}
