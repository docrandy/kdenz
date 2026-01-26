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
import { FillerDetector, FillerDetection, FillerMetrics, FillerType } from './FillerDetector';

// Primary filler word target for this app
const TARGET_FILLER: FillerType = 'like';

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
        const allEvents = detectorRef.current.getCurrentDetections();
        // Filter to only target filler type
        const events = allEvents.filter(e => e.type === TARGET_FILLER);
        const count = events.length;
        setFillerCount(count);
        setFillerEvents(events);

        // Calculate rate (fillers per minute based on elapsed time)
        // Note: This is an estimate; final rate comes from stop()
        if (allEvents.length > 0) {
          const elapsedMs = allEvents[allEvents.length - 1].timestamp;
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

    // Filter to only target filler type
    const targetDetections = metrics.detections.filter(e => e.type === TARGET_FILLER);
    const targetCount = targetDetections.length;

    // Calculate rate: use same speech duration as original (derived from original rate)
    // speechMinutes = totalFillers / fillerRate, so targetRate = targetCount / speechMinutes
    const targetRate = metrics.fillerRate > 0 && metrics.totalFillers > 0
      ? (targetCount / metrics.totalFillers) * metrics.fillerRate
      : 0;

    // Create filtered metrics for final display
    const filteredMetrics: FillerMetrics = {
      ...metrics,
      totalFillers: targetCount,
      fillerRate: targetRate,
      detections: targetDetections,
    };

    setFinalMetrics(filteredMetrics);
    setFillerCount(targetCount);
    setFillerRate(targetRate);
    setFillerEvents(targetDetections);
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
