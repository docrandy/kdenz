/**
 * React hook for Filler Detector
 * Vendored from Black Swan project
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { FillerDetector } from './FillerDetector';
import type { FillerMetrics, FillerConfig } from './FillerDetector';
import type { VADState } from './VoiceActivityDetector';

export interface UseFillerDetectorResult {
  metrics: FillerMetrics | null;      // Only available after turn ends
  isEnabled: boolean;
  isDetecting: boolean;
  enable: () => void;
  disable: () => void;
  reset: () => void;
}

export function useFillerDetector(
  audioContext: AudioContext | null,
  sourceNode: AudioNode | null,
  vadState: VADState,
  config?: Partial<FillerConfig>
): UseFillerDetectorResult {
  const detectorRef = useRef<FillerDetector | null>(null);
  const [metrics, setMetrics] = useState<FillerMetrics | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  // Initialize detector when audio context and source are available
  useEffect(() => {
    if (!audioContext || !sourceNode) {
      return;
    }

    // Create detector instance
    detectorRef.current = new FillerDetector(audioContext, sourceNode, config);

    // Cleanup
    return () => {
      if (detectorRef.current) {
        detectorRef.current.stop();
      }
    };
  }, [audioContext, sourceNode, config]);

  // React to VAD state changes: start on speech_start, stop on speech_end
  useEffect(() => {
    if (!detectorRef.current || !isEnabled) {
      return;
    }

    if (vadState === 'speech') {
      // Start detecting fillers during speech turn
      if (!detectorRef.current.isActive()) {
        detectorRef.current.start();
        setIsDetecting(true);
        // Clear previous metrics when new turn starts
        setMetrics(null);
        console.log('[FillerDetector] Started detecting (turn began)');
      }
    } else if (vadState === 'silence') {
      // Stop detecting and emit metrics at end of turn
      if (detectorRef.current.isActive()) {
        const turnMetrics = detectorRef.current.stop();
        setIsDetecting(false);
        setMetrics(turnMetrics);
        console.log('[FillerDetector] Turn ended - metrics:', turnMetrics);
      }
    }
  }, [vadState, isEnabled]);

  const enable = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.setEnabled(true);
      setIsEnabled(true);
      console.log('[FillerDetector] Enabled');
    }
  }, []);

  const disable = useCallback(() => {
    if (detectorRef.current) {
      detectorRef.current.setEnabled(false);
      setIsEnabled(false);
      setIsDetecting(false);
      setMetrics(null);
      console.log('[FillerDetector] Disabled');
    }
  }, []);

  const reset = useCallback(() => {
    setMetrics(null);
    console.log('[FillerDetector] Metrics reset');
  }, []);

  return {
    metrics,
    isEnabled,
    isDetecting,
    enable,
    disable,
    reset,
  };
}
