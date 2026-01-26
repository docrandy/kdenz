/**
 * React hook for Filler Detector
 *
 * DISABLED: Acoustic filler detection was too unreliable (false positives on silence).
 * Now uses TRANSCRIPT-ONLY detection via fillerReconciler.ts (95% F1 accuracy).
 *
 * This hook is kept as a stub to avoid breaking imports.
 * Real filler detection happens in PracticeSession via reconcileFillers().
 */

import { useState, useCallback } from 'react';
import { FillerDetection, FillerMetrics } from './FillerDetector';

export interface UseFillerDetectorResult {
  /** Current filler count (real-time) - DISABLED, always 0 during session */
  fillerCount: number;
  /** Current filler rate per minute - DISABLED, always 0 during session */
  fillerRate: number;
  /** All filler events with timestamps */
  fillerEvents: FillerDetection[];
  /** Final metrics (available after stop) */
  finalMetrics: FillerMetrics | null;
  /** Whether detector is currently running */
  isDetecting: boolean;
  /** Start detection */
  start: () => void;
  /** Stop detection and get final metrics */
  stop: () => void;
}

export function useFillerDetector(
  _audioContext: AudioContext | null,
  _sourceNode: AudioNode | null
): UseFillerDetectorResult {
  const [isDetecting, setIsDetecting] = useState(false);

  // Acoustic detection DISABLED - too many false positives
  // Filler detection now happens post-session via transcript analysis

  const start = useCallback(() => {
    setIsDetecting(true);
  }, []);

  const stop = useCallback(() => {
    setIsDetecting(false);
  }, []);

  return {
    fillerCount: 0,        // Always 0 - real count comes from transcript
    fillerRate: 0,         // Always 0 - real rate comes from transcript
    fillerEvents: [],      // Empty - real events come from transcript
    finalMetrics: null,
    isDetecting,
    start,
    stop,
  };
}
