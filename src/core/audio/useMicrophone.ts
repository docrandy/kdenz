/**
 * React hook for microphone capture
 * Vendored from Black Swan project
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { MicrophoneCapture } from './MicrophoneCapture';
import type { MicrophoneState, MicrophoneError, MicrophoneConfig } from './MicrophoneCapture';

export interface UseMicrophoneResult {
  state: MicrophoneState;
  error: MicrophoneError | null;
  audioContext: AudioContext | null;
  sourceNode: MediaStreamAudioSourceNode | null;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  isActive: boolean;
}

export function useMicrophone(config?: Partial<MicrophoneConfig>): UseMicrophoneResult {
  const microphoneRef = useRef<MicrophoneCapture | null>(null);
  const [state, setState] = useState<MicrophoneState>('idle');
  const [error, setError] = useState<MicrophoneError | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaStreamAudioSourceNode | null>(null);

  // Initialize microphone capture instance
  useEffect(() => {
    microphoneRef.current = new MicrophoneCapture(config);

    // Subscribe to state changes
    const unsubscribeState = microphoneRef.current.onStateChange(setState);

    // Subscribe to errors
    const unsubscribeError = microphoneRef.current.onError(setError);

    // Cleanup on unmount
    return () => {
      unsubscribeState();
      unsubscribeError();
      if (microphoneRef.current) {
        microphoneRef.current.stop();
      }
    };
  }, [config]);

  const start = useCallback(async () => {
    if (!microphoneRef.current) {
      throw new Error('Microphone not initialized');
    }

    setError(null);

    try {
      const { context, source } = await microphoneRef.current.start();
      setAudioContext(context);
      setSourceNode(source);
    } catch (err) {
      // Error already set by error listener
      console.error('Failed to start microphone:', err);
      throw err;
    }
  }, []);

  const stop = useCallback(async () => {
    if (!microphoneRef.current) {
      return;
    }

    try {
      await microphoneRef.current.stop();
      setAudioContext(null);
      setSourceNode(null);
      setError(null);
    } catch (err) {
      console.error('Failed to stop microphone:', err);
    }
  }, []);

  return {
    state,
    error,
    audioContext,
    sourceNode,
    start,
    stop,
    isActive: state === 'active',
  };
}
