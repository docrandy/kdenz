import { useEffect, useRef, useState } from "react";
import { useFillerDetector } from "../../core/audio";
import { useAudioAdapter } from "../adapters/audioAdapter";
import { useSpeechAdapter } from "../adapters/speechAdapter";
import { useNavigationEngine } from "../engines/useNavigationEngine";
import { useTimerEngine } from "../engines/useTimerEngine";
import { useMetricsEngine } from "../engines/useMetricsEngine";
import { useSessionLifecycle } from "../engines/useSessionLifecycle";
import type { PracticeRuntimeConfig } from "./types";

export function usePracticeRuntime(config: PracticeRuntimeConfig) {
  const audio = useAudioAdapter();
  const speech = useSpeechAdapter();
  const fillerDetector = useFillerDetector(audio.audioContext, audio.sourceNode);
  const navigation = useNavigationEngine();
  const [isPaused, setIsPaused] = useState(false);

  const stopRef = useRef<(() => Promise<void>) | null>(null);

  const timer = useTimerEngine({
    durationSeconds: config.durationSeconds,
    onComplete: () => {
    void stopRef.current?.();
  },
  });

  const metrics = useMetricsEngine({
    durationSeconds: config.durationSeconds,
    isBaseline: config.isBaseline ?? false,
    isCapturing: audio.isCapturing,
    isPaused,
    audioContext: audio.audioContext,
    sourceNode: audio.sourceNode,
    elapsedTime: timer.elapsedTime,
    wordCount: speech.wordCount,
    finalTranscript: speech.finalTranscript,
    interimTranscript: speech.interimTranscript,
  });

  const lifecycle = useSessionLifecycle({
    audio,
    speech,
    fillerEvents: fillerDetector.fillerEvents,
    startFillerDetection: fillerDetector.start,
    stopFillerDetection: fillerDetector.stop,
    timer,
    metrics,
    config,
    navigation,
    isPaused,
    setIsPaused,
  });

  useEffect(() => {
    stopRef.current = lifecycle.handleStop;
  }, [lifecycle.handleStop]);

  useEffect(() => {
    return () => {
      fillerDetector.stop();
    };
  }, [fillerDetector]);

  return {
    audio,
    speech,
    metrics,
    lifecycle,
    navigation,
    errors: {
      audio: audio.error,
      speech: speech.error,
    },
    qualityWarnings: audio.qualityWarnings,
  };
}
