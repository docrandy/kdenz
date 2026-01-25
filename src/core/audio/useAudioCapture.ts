/**
 * Audio Capture Hook
 * Handles mic access, MediaRecorder, and stream management
 *
 * Responsibilities:
 * - Request mic permission via getUserMedia
 * - Create MediaRecorder for blob capture (playback in Phase 04)
 * - Provide AudioContext and source node for analysis hooks
 * - Clean up all resources on stop
 *
 * Does NOT:
 * - Perform any analysis (pure capture)
 * - Handle errors (caller's responsibility via error state)
 * - Manage UI state beyond capture status
 */

import { useState, useRef, useCallback } from 'react';

export interface UseAudioCaptureResult {
  /** Whether mic is currently capturing */
  isCapturing: boolean;
  /** Audio context for analysis (null when not capturing) */
  audioContext: AudioContext | null;
  /** Source node for connecting analyzers (null when not capturing) */
  sourceNode: MediaStreamAudioSourceNode | null;
  /** Recorded audio blob (available after stop) */
  audioBlob: Blob | null;
  /** Error message if mic access failed */
  error: string | null;
  /** Start capturing audio */
  start: () => Promise<void>;
  /** Stop capturing and finalize blob */
  stop: () => void;
}

export function useAudioCapture(): UseAudioCaptureResult {
  const [isCapturing, setIsCapturing] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaStreamAudioSourceNode | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = useCallback(async () => {
    if (isCapturing) {
      return;
    }

    try {
      setError(null);
      setAudioBlob(null);
      chunksRef.current = [];

      // Request mic access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      // Create AudioContext for analysis
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      setAudioContext(ctx);
      setSourceNode(source);

      // Create MediaRecorder for blob capture
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Collect in 1s chunks

      setIsCapturing(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(message);
      console.error('[useAudioCapture] Error:', message);
    }
  }, [isCapturing]);

  const stop = useCallback(() => {
    if (!isCapturing) {
      return;
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;

    // Stop all tracks on the stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close AudioContext
    if (audioContext) {
      audioContext.close();
    }
    setAudioContext(null);
    setSourceNode(null);

    setIsCapturing(false);
  }, [isCapturing, audioContext]);

  return {
    isCapturing,
    audioContext,
    sourceNode,
    audioBlob,
    error,
    start,
    stop,
  };
}
