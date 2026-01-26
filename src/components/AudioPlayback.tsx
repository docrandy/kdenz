/**
 * Audio Playback Component
 * Container for session audio playback with filler markers
 */

import { useAudioPlayback } from '../core/audio/useAudioPlayback';
import { FillerDetection } from '../core/audio/FillerDetector';
import PlaybackTimeline from './PlaybackTimeline';
import FillerMarkers from './FillerMarkers';

interface AudioPlaybackProps {
  /** Recorded audio blob from session */
  audioBlob: Blob;
  /** Filler events detected during session */
  fillerEvents: FillerDetection[];
  /** Session duration in seconds (used as fallback for blob duration) */
  sessionDurationSeconds?: number;
}

const PLAYBACK_RATES = [0.75, 1, 1.25] as const;

export default function AudioPlayback({ audioBlob, fillerEvents, sessionDurationSeconds }: AudioPlaybackProps) {
  const {
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    play,
    pause,
    seek,
    setPlaybackRate,
  } = useAudioPlayback(audioBlob, sessionDurationSeconds);

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="bg-white border border-clinical-border rounded-lg p-4">
      <h3 className="text-sm font-semibold text-clinical-text mb-3">Session Recording</h3>

      {/* Play/Pause button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handlePlayPause}
          className="w-12 h-12 flex items-center justify-center bg-clinical-text text-white rounded-full hover:bg-gray-800 transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            // Pause icon
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            // Play icon
            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>

      {/* Timeline with filler markers */}
      <PlaybackTimeline
        currentTime={currentTime}
        duration={duration}
        onSeek={seek}
      >
        <FillerMarkers
          fillerEvents={fillerEvents}
          duration={duration}
          onSeek={seek}
        />
      </PlaybackTimeline>

      {/* Filler count indicator */}
      {fillerEvents.length > 0 && (
        <p className="text-xs text-clinical-muted text-center mt-2">
          {fillerEvents.length} filler{fillerEvents.length !== 1 ? 's' : ''} detected
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2 align-middle" />
        </p>
      )}

      {/* Playback speed selector */}
      <div className="flex justify-center gap-2 mt-4">
        {PLAYBACK_RATES.map((rate) => (
          <button
            key={rate}
            onClick={() => setPlaybackRate(rate)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              playbackRate === rate
                ? 'bg-clinical-accent text-white'
                : 'bg-gray-100 text-clinical-muted hover:bg-gray-200'
            }`}
          >
            {rate}x
          </button>
        ))}
      </div>

      {/* Debug info - remove for production */}
      {audioBlob && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Recording: {(audioBlob.size / 1024).toFixed(1)}KB
        </p>
      )}
    </div>
  );
}
