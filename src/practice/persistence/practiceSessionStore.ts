import { saveBaseline } from "../../services/baselineStorage";
import type { PracticeSessionPersistencePayload } from "../runtime/types";

export async function convertAudioBlob(blob: Blob | null): Promise<string | null> {
  if (!blob) return null;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function persistPracticeSession({
  focusMode,
  isBaseline,
  techniqueContext,
  metrics,
  audioData,
  transcript,
  fillerEvents,
  wordTimings,
  reconciledFillers,
  averageConfidence,
  lowConfidenceSegments,
  qualityWarnings,
}: PracticeSessionPersistencePayload): Promise<void> {
  if (isBaseline) {
    const durationMinutes = metrics.durationSeconds / 60 || 1;
    const pauseRate = metrics.silenceDuration > 0
      ? metrics.silenceDuration / 1000 / durationMinutes
      : 0;

    saveBaseline({
      wpm: metrics.wpm,
      fillerRate: metrics.fillerRate,
      fillerCount: metrics.fillerCount,
      pauseRate,
      wordCount: metrics.wordCount,
      durationSeconds: metrics.durationSeconds,
      timestamp: Date.now(),
    });
  }

  const sessionData = {
    durationSeconds: metrics.durationSeconds,
    wordCount: metrics.wordCount,
    wpm: metrics.wpm,
    fillerCount: metrics.fillerCount,
    fillerRate: metrics.fillerRate,
    focusMode,
    is_baseline: isBaseline,
    audioData,
    ...(techniqueContext?.techniqueId
      ? {
          techniqueId: techniqueContext.techniqueId,
          techniqueName: techniqueContext.techniqueName,
          practicePrompt: techniqueContext.practicePrompt,
        }
      : {}),
  };

  try {
    sessionStorage.setItem(
      "voicelab_last_session",
      JSON.stringify({
        ...sessionData,
        transcript,
        fillerEvents: [...fillerEvents],
        wordTimings: [...wordTimings],
        reconciledFillers,
        averageConfidence,
        lowConfidenceSegments,
        qualityWarnings: [...qualityWarnings],
      }),
    );
  } catch (error) {
    console.warn("[PracticeRuntime] Unable to write last session payload", error);
  }
}
