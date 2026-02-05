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

import { useState, useRef, useCallback, useEffect } from 'react';

export interface UseAudioCaptureResult {
  /** Whether mic is currently capturing */
  isCapturing: boolean;
  /** Audio context for analysis (null when not capturing) */
  audioContext: AudioContext | null;
  /** Source node for connecting analyzers (null when not capturing) */
  sourceNode: MediaStreamAudioSourceNode | null;
  /** Recorded audio blob (available after stop) */
  audioBlob: Blob | null;
  /** Debug: size of recorded blob in bytes */
  audioBlobSize: number;
  /** Error message if mic access failed */
  error: string | null;
  /** Active audio quality warnings */
  qualityWarnings: ('noise' | 'clipping')[];
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
  const [audioBlobSize, setAudioBlobSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [qualityWarnings, setQualityWarnings] = useState<('noise' | 'clipping')[]>([]);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isStoppingRef = useRef(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const qualityCheckIntervalRef = useRef<number | null>(null);

  const start = useCallback(async () => {
    if (isCapturing) {
      return;
    }

    try {
      setError(null);
      setAudioBlob(null);
      setAudioBlobSize(0);
      chunksRef.current = [];
      isStoppingRef.current = false;

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

      // Create AnalyserNode for quality monitoring
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setAudioContext(ctx);
      setSourceNode(source);

      // Create MediaRecorder for blob capture
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      recorder.ondataavailable = (event) => {
        console.log('[useAudioCapture] Data chunk received:', event.data.size, 'bytes');
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }

        // If we're stopping and this is the final chunk, create the blob
        if (isStoppingRef.current && recorder.state === 'inactive') {
          const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
          console.log('[useAudioCapture] Creating blob from', chunksRef.current.length, 'chunks, total size:', totalSize);
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioBlobSize(blob.size);
        }
      };

      recorder.onstop = () => {
        console.log('[useAudioCapture] Recorder stopped, chunks:', chunksRef.current.length);
        // Create blob here as fallback if ondataavailable already fired
        if (chunksRef.current.length > 0) {
          const totalSize = chunksRef.current.reduce((sum, chunk) => sum + chunk.size, 0);
          console.log('[useAudioCapture] onstop: Creating blob, total size:', totalSize);
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          setAudioBlobSize(blob.size);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000); // Collect in 1s chunks
      console.log('[useAudioCapture] Recording started');

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

    console.log('[useAudioCapture] Stopping capture...');
    isStoppingRef.current = true;

    // Stop MediaRecorder - this triggers final ondataavailable + onstop
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      console.log('[useAudioCapture] Stopping MediaRecorder, current state:', mediaRecorderRef.current.state);
      // Request any pending data first
      try {
        mediaRecorderRef.current.requestData();
      } catch {
        // requestData may fail if no data available, that's ok
      }
      // Small delay to allow requestData to process, then stop
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
      }, 100);
    }

    // Stop all tracks on the stream (but keep recorder reference for onstop callback)
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
    analyserRef.current = null;

    setIsCapturing(false);
  }, [isCapturing, audioContext]);

  // Audio quality monitoring - runs every 500ms during capture
  useEffect(() => {
    if (!isCapturing || !analyserRef.current) {
      setQualityWarnings([]);
      if (qualityCheckIntervalRef.current) {
        clearInterval(qualityCheckIntervalRef.current);
        qualityCheckIntervalRef.current = null;
      }
      return;
    }

    const analyser = analyserRef.current;
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const timeDomainData = new Uint8Array(analyser.fftSize);

    const checkQuality = () => {
      const warnings: ('noise' | 'clipping')[] = [];

      // Noise detection: analyze low frequencies (< 300Hz)
      analyser.getByteFrequencyData(frequencyData);

      // Calculate noise floor from first 10% of frequency bins (low frequencies)
      const lowFreqBins = Math.floor(frequencyData.length * 0.1);
      let lowFreqSum = 0;
      for (let i = 0; i < lowFreqBins; i++) {
        lowFreqSum += frequencyData[i];
      }
      const noiseFloor = lowFreqSum / (lowFreqBins * 255); // Normalize to 0-1

      if (noiseFloor > 0.3) {
        warnings.push('noise');
      }

      // Clipping detection: check if samples reach max values
      analyser.getByteTimeDomainData(timeDomainData);

      let clippingCount = 0;
      for (let i = 0; i < timeDomainData.length; i++) {
        const sample = timeDomainData[i];
        // Check if at or very near max/min (0 or 255 in byte format)
        if (sample <= 1 || sample >= 254) {
          clippingCount++;
          // Check for consecutive samples
          if (clippingCount >= 3) {
            warnings.push('clipping');
            break;
          }
        } else {
          clippingCount = 0;
        }
      }

      setQualityWarnings(warnings);
    };

    // Check quality every 500ms
    qualityCheckIntervalRef.current = window.setInterval(checkQuality, 500);

    return () => {
      if (qualityCheckIntervalRef.current) {
        clearInterval(qualityCheckIntervalRef.current);
        qualityCheckIntervalRef.current = null;
      }
    };
  }, [isCapturing]);

  return {
    isCapturing,
    audioContext,
    sourceNode,
    audioBlob,
    audioBlobSize,
    error,
    qualityWarnings,
    start,
    stop,
  };
}
