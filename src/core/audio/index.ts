/**
 * Audio Core Module Exports
 * Vendored from Black Swan project
 */

// Classes
export { MicrophoneCapture } from './MicrophoneCapture';
export { VoiceActivityDetector } from './VoiceActivityDetector';
export { FillerDetector } from './FillerDetector';

// Hooks
export { useMicrophone } from './useMicrophone';
export { useVAD, useVADEvent } from './useVAD';
export { useFillerDetector } from './useFillerDetector';

// Types
export type {
  MicrophoneState,
  MicrophoneConfig,
  MicrophoneError,
} from './MicrophoneCapture';

export type {
  VADEvent,
  VADState,
  VADConfig,
  VADMetrics,
} from './VoiceActivityDetector';

export type {
  FillerType,
  FillerDetection,
  FillerMetrics,
  FillerConfig,
} from './FillerDetector';

export type { UseMicrophoneResult } from './useMicrophone';
export type { UseVADResult } from './useVAD';
export type { UseFillerDetectorResult } from './useFillerDetector';
