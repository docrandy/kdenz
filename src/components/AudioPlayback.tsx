import { useState, useRef, useEffect } from 'react';

interface AudioPlaybackProps {
  audioData: string | null; // base64 data URL
  durationSeconds: number;  // for timeline display
}

export function AudioPlayback({ audioData, durationSeconds }: AudioPlaybackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds);

  // Convert base64 to object URL on mount
  useEffect(() => {
    if (!audioData || !audioRef.current) return;

    // base64 data URL can be used directly as src
    audioRef.current.src = audioData;

    return () => {
      // Cleanup: revoke if we created a blob URL
    };
  }, [audioData]);

  // Time update handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = ratio * duration;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioData) {
    return null; // Graceful fallback if no audio
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full">
      <audio ref={audioRef} preload="metadata" />

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full bg-clinical-accent text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Scrub bar + time */}
        <div className="flex-1">
          <div
            className="h-2 bg-gray-200 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-clinical-accent rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
