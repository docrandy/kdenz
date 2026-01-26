/**
 * useRecordingSession Hook (REC-01, REC-02)
 *
 * Manages recording session lifecycle:
 * - State machine: idle -> recording -> stopped
 * - MediaRecorder integration for audio capture
 * - Time Authority integration for timestamps
 * - Exposes audioContext/sourceNode for VAD/FillerDetector
 */

import { useState, useRef, useCallback } from 'react';
import { useMicrophone } from '../core/audio/useMicrophone';
import { timeAuthority } from '../lib/timeAuthority';
import type { SessionData, RecordingControls } from '../types/session';
import { initialSessionData } from '../types/session';

export interface UseRecordingSessionResult extends RecordingControls {
  /** Current session data */
  session: SessionData;
}

export function useRecordingSession(): UseRecordingSessionResult {
  const [session, setSession] = useState<SessionData>(initialSessionData);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const microphone = useMicrophone({
    sampleRate: 16000, // Standard for speech recognition
  });

  const start = useCallback(async () => {
    if (session.state !== 'idle') {
      console.warn('Cannot start: session already in progress');
      return;
    }

    try {
      // Start microphone
      await microphone.start();

      // Wait for audioContext and sourceNode to be available
      if (!microphone.audioContext || !microphone.sourceNode) {
        throw new Error('Failed to initialize audio context');
      }

      // Start time authority session
      const timeContext = timeAuthority.startSession();

      // Get media stream from sourceNode
      const mediaStream = (microphone.sourceNode as any).mediaStream;
      if (!mediaStream) {
        // If sourceNode doesn't have mediaStream, we need to get it from the microphone
        // This is a fallback for browsers where the stream isn't directly accessible
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create MediaRecorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
        });

        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const endTime = Date.now();
          const duration = timeContext.now();

          setSession((prev) => ({
            ...prev,
            state: 'stopped',
            audioBlob,
            endTime,
            duration,
          }));

          timeAuthority.endSession();
        };

        mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          setSession((prev) => ({
            ...prev,
            state: 'idle',
            error: 'Recording failed',
          }));
          timeAuthority.endSession();
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(100); // Collect data every 100ms
      }

      // Update session state
      setSession({
        state: 'recording',
        timeContext,
        audioBlob: null,
        audioContext: microphone.audioContext,
        sourceNode: microphone.sourceNode,
        startTime: Date.now(),
        endTime: null,
        duration: null,
        error: null,
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      setSession((prev) => ({
        ...prev,
        state: 'idle',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      microphone.stop();
    }
  }, [session.state, microphone]);

  const stop = useCallback(async () => {
    if (session.state !== 'recording') {
      console.warn('Cannot stop: no recording in progress');
      return;
    }

    try {
      // Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      // Stop microphone
      await microphone.stop();

      // MediaRecorder onstop handler will update state to 'stopped'
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setSession((prev) => ({
        ...prev,
        state: 'stopped',
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      timeAuthority.endSession();
    }
  }, [session.state, microphone]);

  const reset = useCallback(() => {
    if (session.state === 'recording') {
      console.warn('Cannot reset: recording in progress');
      return;
    }

    setSession(initialSessionData);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  }, [session.state]);

  return {
    session,
    start,
    stop,
    reset,
    isIdle: session.state === 'idle',
    isRecording: session.state === 'recording',
    isStopped: session.state === 'stopped',
  };
}
