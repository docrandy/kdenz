/**
 * React hook for Filler Detector
 * Adapted from Black Swan - simplified for Kdenz
 *
 * Changes from Black Swan:
 * - Removed VAD state dependency (session controls start/stop directly)
 * - Simplified interface for real-time count display
 * - No toggle logic (always enabled during session)
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { FillerDetector, FillerDetection, FillerMetrics } from './FillerDetector';

export interface UseFillerDetectorResult {
  /** Current filler count (real-time) */
  fillerCount: number;
  /** Current filler rate per minute */
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
  audioContext: AudioContext | null,
  sourceNode: AudioNode | null
): UseFillerDetectorResult {
  const detectorRef = useRef<FillerDetector | null>(null);
  const [fillerCount, setFillerCount] = useState(0);
  const [fillerRate, setFillerRate] = useState(0);
  const [fillerEvents, setFillerEvents] = useState<FillerDetection[]>([]);
  const [finalMetrics, setFinalMetrics] = useState<FillerMetrics | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const updateIntervalRef = useRef<number | null>(null);

  // Initialize detector when audio context and source are available
  useEffect(() => {
    if (!audioContext || !sourceNode) {
      return;
    }

    // Create detector instance
    detectorRef.current = new FillerDetector(audioContext, sourceNode);

    // Cleanup
    return () => {
      if (detectorRef.current?.isActive()) {
        detectorRef.current.stop();
      }
      if (updateIntervalRef.current !== null) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [audioContext, sourceNode]);

  const start = useCallback(() => {
    if (!detectorRef.current || isDetecting) {
      return;
    }

    // Clear previous state
    setFillerCount(0);
    setFillerRate(0);
    setFillerEvents([]);
    setFinalMetrics(null);

    // Start detector
    detectorRef.current.start();
    setIsDetecting(true);

    // Start 250ms update cadence for real-time display
    updateIntervalRef.current = window.setInterval(() => {
      if (detectorRef.current) {
        const count = detectorRef.current.getCurrentCount();
        const events = detectorRef.current.getCurrentDetections();
        setFillerCount(count);
        setFillerEvents(events);

        // Calculate rate (fillers per minute based on elapsed time)
        // Note: This is an estimate; final rate comes from stop()
        if (events.length > 0) {
          const elapsedMs = events[events.length - 1].timestamp;
          const elapsedMin = elapsedMs / 60000;
          setFillerRate(elapsedMin > 0 ? count / elapsedMin : 0);
        }
      }
    }, 250);
  }, [isDetecting]);

  const stop = useCallback(() => {
    if (!detectorRef.current || !isDetecting) {
      return;
    }

    // Clear update interval
    if (updateIntervalRef.current !== null) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // Stop detector and get final metrics
    const metrics = detectorRef.current.stop();
    setFinalMetrics(metrics);
    setFillerCount(metrics.totalFillers);
    setFillerRate(metrics.fillerRate);
    setFillerEvents(metrics.detections);
    setIsDetecting(false);
  }, [isDetecting]);

  return {
    fillerCount,
    fillerRate,
    fillerEvents,
    finalMetrics,
    isDetecting,
    start,
    stop,
  };
}
