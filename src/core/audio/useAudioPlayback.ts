/**
 * Audio Playback Hook
 * Manages HTMLAudioElement for session playback
 *
 * Responsibilities:
 * - Create object URL from audio blob
 * - Track playback state (currentTime, duration, isPlaying)
 * - Provide play/pause/seek controls
 * - Support playback speed adjustment (0.75x, 1x, 1.25x)
 * - Clean up resources on unmount
 */

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseAudioPlaybackResult {
  /** Object URL for the audio (for debugging/display) */
  objectUrl: string | null;
  /** Current playback position in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Current playback rate (0.75, 1, 1.25) */
  playbackRate: number;
  /** Start or resume playback */
  play: () => void;
  /** Pause playback */
  pause: () => void;
  /** Seek to specific time in seconds */
  seek: (seconds: number) => void;
  /** Set playback speed */
  setPlaybackRate: (rate: number) => void;
}

export function useAudioPlayback(audioBlob: Blob | null): UseAudioPlaybackResult {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create object URL and audio element when blob changes
  useEffect(() => {
    if (!audioBlob) {
      setObjectUrl(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      return;
    }

    // Create object URL
    const url = URL.createObjectURL(audioBlob);
    setObjectUrl(url);

    // Create audio element
    const audio = new Audio(url);
    audioRef.current = audio;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      // MediaRecorder blobs sometimes report Infinity or 0
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      // Fallback: sometimes duration becomes available later
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Another fallback: infer duration from max time reached
      if (audio.currentTime > 0 && audio.currentTime > duration) {
        setDuration(audio.currentTime);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Use current time as duration if we didn't get it otherwise
      if (audio.currentTime > 0) {
        setDuration(audio.currentTime);
      }
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
      URL.revokeObjectURL(url);
    };
  }, [audioBlob, duration]);

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error('[useAudioPlayback] Play failed:', err);
      });
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      const clampedTime = Math.max(0, Math.min(seconds, audioRef.current.duration || 0));
      audioRef.current.currentTime = clampedTime;
      setCurrentTime(clampedTime);
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setPlaybackRateState(rate);
  }, []);

  return {
    objectUrl,
    currentTime,
    duration,
    isPlaying,
    playbackRate,
    play,
    pause,
    seek,
    setPlaybackRate,
  };
}
