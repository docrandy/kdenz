/**
 * Session Types (REC-01, REC-02)
 *
 * Core types for recording session state management.
 * Integrates with Time Authority for monotonic timestamps.
 */

import type { SessionTimeContext } from '../lib/timeAuthority';

/**
 * Recording state machine states
 */
export type RecordingState = 'idle' | 'recording' | 'stopped';

/**
 * Session metadata and recording data
 */
export interface SessionData {
  /** Current recording state */
  state: RecordingState;

  /** Time context for this session (null when idle) */
  timeContext: SessionTimeContext | null;

  /** Recorded audio blob (null until recording stops) */
  audioBlob: Blob | null;

  /** Audio context for real-time processing */
  audioContext: AudioContext | null;

  /** Source node for VAD and FillerDetector */
  sourceNode: MediaStreamAudioSourceNode | null;

  /** Session start time (absolute, for display) */
  startTime: number | null;

  /** Session end time (absolute, for display) */
  endTime: number | null;

  /** Session duration in milliseconds */
  duration: number | null;

  /** Error if any occurred during recording */
  error: string | null;
}

/**
 * Initial session state
 */
export const initialSessionData: SessionData = {
  state: 'idle',
  timeContext: null,
  audioBlob: null,
  audioContext: null,
  sourceNode: null,
  startTime: null,
  endTime: null,
  duration: null,
  error: null,
};

/**
 * Recording control actions
 */
export interface RecordingControls {
  /** Start recording session */
  start: () => Promise<void>;

  /** Stop recording session */
  stop: () => Promise<void>;

  /** Reset session to idle state */
  reset: () => void;

  /** Current session state */
  isIdle: boolean;
  isRecording: boolean;
  isStopped: boolean;
}
