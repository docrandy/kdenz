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

export function useAudioPlayback(
  audioBlob: Blob | null,
  estimatedDuration?: number
): UseAudioPlaybackResult {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxTimeReachedRef = useRef(0);

  // Create object URL and audio element when blob changes
  useEffect(() => {
    if (!audioBlob) {
      setObjectUrl(null);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      maxTimeReachedRef.current = 0;
      return;
    }

    console.log('[useAudioPlayback] Setting up audio, blob size:', audioBlob.size);

    // Use estimated duration if provided
    if (estimatedDuration && estimatedDuration > 0) {
      console.log('[useAudioPlayback] Using estimated duration:', estimatedDuration);
      setDuration(estimatedDuration);
    }

    // Create object URL
    const url = URL.createObjectURL(audioBlob);
    setObjectUrl(url);
    console.log('[useAudioPlayback] Created object URL:', url);

    // Create audio element
    const audio = new Audio(url);
    audioRef.current = audio;

    // Set up event listeners
    const handleLoadedMetadata = () => {
      console.log('[useAudioPlayback] loadedmetadata - reported duration:', audio.duration);
      // MediaRecorder blobs sometimes report Infinity or 0
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleDurationChange = () => {
      console.log('[useAudioPlayback] durationchange - reported duration:', audio.duration);
      // Fallback: sometimes duration becomes available later
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      // Track max time reached for duration inference
      if (audio.currentTime > maxTimeReachedRef.current) {
        maxTimeReachedRef.current = audio.currentTime;
      }
    };

    const handlePlay = () => {
      console.log('[useAudioPlayback] Play started');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('[useAudioPlayback] Paused at:', audio.currentTime);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('[useAudioPlayback] Ended at:', audio.currentTime, 'max reached:', maxTimeReachedRef.current);
      setIsPlaying(false);
      // Use max time reached as actual duration
      const actualDuration = Math.max(audio.currentTime, maxTimeReachedRef.current);
      if (actualDuration > 0) {
        setDuration(actualDuration);
      }
      setCurrentTime(0);
      audio.currentTime = 0;
    };

    const handleError = (e: Event) => {
      console.error('[useAudioPlayback] Audio error:', e);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audioRef.current = null;
      URL.revokeObjectURL(url);
    };
  }, [audioBlob, estimatedDuration]);

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
