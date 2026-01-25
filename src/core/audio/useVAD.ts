/**
 * React hook for Voice Activity Detection
 * Vendored from Black Swan project
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { VoiceActivityDetector } from './VoiceActivityDetector';
import type { VADConfig, VADState, VADMetrics, VADEvent } from './VoiceActivityDetector';

export interface UseVADResult {
  state: VADState;
  metrics: VADMetrics | null;
  isActive: boolean;
  start: () => void;
  stop: () => void;
  updateConfig: (config: Partial<VADConfig>) => void;
}

export function useVAD(
  audioContext: AudioContext | null,
  sourceNode: AudioNode | null,
  config?: Partial<VADConfig>
): UseVADResult {
  const vadRef = useRef<VoiceActivityDetector | null>(null);
  const [state, setState] = useState<VADState>('silence');
  const [metrics, setMetrics] = useState<VADMetrics | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Initialize VAD when audio context and source are available
  useEffect(() => {
    if (!audioContext || !sourceNode) {
      return;
    }

    // Create VAD instance
    vadRef.current = new VoiceActivityDetector(audioContext, sourceNode, config);

    // Subscribe to events
    const unsubscribeSpeechStart = vadRef.current.on('speech_start', () => {
      console.log('[VAD] Speech started');
      setState('speech');
    });

    const unsubscribeSpeechEnd = vadRef.current.on('speech_end', () => {
      console.log('[VAD] Speech ended');
      setState('silence');
    });

    // Subscribe to metrics
    const unsubscribeMetrics = vadRef.current.onMetrics(setMetrics);

    // Cleanup
    return () => {
      unsubscribeSpeechStart();
      unsubscribeSpeechEnd();
      unsubscribeMetrics();
      if (vadRef.current) {
        vadRef.current.stop();
      }
    };
  }, [audioContext, sourceNode, config]);

  const start = useCallback(() => {
    if (vadRef.current) {
      vadRef.current.start();
      setIsActive(true);
      console.log('[VAD] Started');
    }
  }, []);

  const stop = useCallback(() => {
    if (vadRef.current) {
      vadRef.current.stop();
      setIsActive(false);
      setState('silence');
      setMetrics(null);
      console.log('[VAD] Stopped');
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<VADConfig>) => {
    if (vadRef.current) {
      vadRef.current.updateConfig(newConfig);
      console.log('[VAD] Config updated', newConfig);
    }
  }, []);

  return {
    state,
    metrics,
    isActive,
    start,
    stop,
    updateConfig,
  };
}

/**
 * Hook to listen for specific VAD events
 */
export function useVADEvent(
  vad: VoiceActivityDetector | null,
  event: VADEvent,
  callback: () => void
): void {
  useEffect(() => {
    if (!vad) {
      return;
    }

    return vad.on(event, callback);
  }, [vad, event, callback]);
}
