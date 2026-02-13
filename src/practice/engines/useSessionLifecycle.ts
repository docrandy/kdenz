import { useState, useCallback } from "react";
import { reconcileFillers } from "../../lib/fillerReconciler";
import type { AudioAdapter } from "../adapters/audioAdapter";
import type { SpeechAdapter } from "../adapters/speechAdapter";
import type { PracticeRuntimeConfig } from "../runtime/types";
import type { TimerEngine } from "./useTimerEngine";
import type { MetricsEngineReturn } from "./useMetricsEngine";
import { countFillerWords } from "./useMetricsEngine";
import type { NavigationEngine } from "./useNavigationEngine";
import {
  persistPracticeSession,
  convertAudioBlob,
} from "../persistence/practiceSessionStore";
import type { FillerDetection } from "../../core/audio/FillerDetector";

interface UseSessionLifecycleOptions {
  audio: AudioAdapter;
  speech: SpeechAdapter;
  fillerEvents: FillerDetection[];
  startFillerDetection: () => void;
  stopFillerDetection: () => void;
  timer: TimerEngine;
  metrics: MetricsEngineReturn;
  config: PracticeRuntimeConfig;
  navigation: NavigationEngine;
  isPaused: boolean;
  setIsPaused: (value: boolean) => void;
}

export interface SessionLifecycleReturn {
  showCountdown: boolean;
  isProcessing: boolean;
  isPaused: boolean;
  handleStart: () => Promise<void>;
  handleStop: () => Promise<void>;
  handleCountdownComplete: () => void;
}

export function useSessionLifecycle({
  audio,
  speech,
  fillerEvents,
  startFillerDetection,
  stopFillerDetection,
  timer,
  metrics,
  config,
  navigation,
  isPaused,
  setIsPaused,
}: UseSessionLifecycleOptions): SessionLifecycleReturn {
  const [showCountdown, setShowCountdown] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStart = useCallback(async () => {
    setShowCountdown(false);
    metrics.resetForSession();
    timer.reset();
    await audio.start();
    speech.start();
    timer.start();
    startFillerDetection();
    setIsPaused(false);
  }, [metrics, timer, audio, speech, startFillerDetection]);

  const handleCountdownComplete = useCallback(() => {
    void handleStart();
  }, [handleStart]);

  const handleStop = useCallback(async () => {
    setIsProcessing(true);
    setIsPaused(false);

    timer.stop();
    stopFillerDetection();
    speech.stop();
    audio.stop();

    const transcript = `${speech.finalTranscript} ${speech.interimTranscript}`.trim();
    const fillerCount = countFillerWords(transcript);
    const durationSeconds = Math.round(timer.elapsedTime);
    const elapsedMinutes = durationSeconds / 60;
    const fillerRate = elapsedMinutes > 0 ? fillerCount / elapsedMinutes : 0;

    const reconciledFillers = reconcileFillers(
      transcript,
      fillerEvents,
      speech.wordTimings,
    );

    const audioData = await convertAudioBlob(audio.audioBlob);

    try {
      await persistPracticeSession({
        focusMode: config.focusMode,
        isBaseline: config.isBaseline,
        techniqueContext: config.techniqueContext,
        metrics: {
          durationSeconds,
          wordCount: speech.wordCount,
          wpm: metrics.wpm,
          fillerCount,
          fillerRate,
          silenceDuration: metrics.silenceDuration,
        },
        audioData,
        transcript,
        fillerEvents,
        wordTimings: speech.wordTimings,
        reconciledFillers,
        averageConfidence: speech.averageConfidence,
        lowConfidenceSegments: speech.lowConfidenceSegments,
        qualityWarnings: audio.qualityWarnings,
      });
    } catch (error) {
      console.error("[PracticeRuntime] Failed to persist session", error);
    } finally {
      navigation.goToResults({
        isBaseline: config.isBaseline,
        techniqueContext: config.techniqueContext,
      });
      setIsProcessing(false);
    }
  }, [
    audio,
    speech,
    fillerEvents,
    stopFillerDetection,
    timer,
    metrics,
    config,
    navigation,
  ]);

  return {
    showCountdown,
    isProcessing,
    isPaused,
    handleStart,
    handleStop,
    handleCountdownComplete,
  };
}
