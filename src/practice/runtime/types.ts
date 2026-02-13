import type { FillerDetection } from "../../core/audio/FillerDetector";
import type { WordTiming } from "../../core/audio/useWebSpeech";
import type { ReconciledFiller } from "../../lib/fillerReconciler";

export type PracticeMode = "filler" | "pace";

export interface TechniquePracticeContext {
  techniqueId?: string;
  techniqueName?: string;
  practicePrompt?: string;
}

export interface PracticeRuntimeConfig {
  focusMode: PracticeMode;
  durationSeconds: number;
  isBaseline?: boolean;
  techniqueContext?: TechniquePracticeContext;
}

export interface PracticeSessionMetricsSnapshot {
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  silenceDuration: number;
}

export interface PracticeSessionPersistencePayload {
  focusMode: PracticeMode;
  isBaseline?: boolean;
  techniqueContext?: TechniquePracticeContext;
  metrics: PracticeSessionMetricsSnapshot;
  audioData: string | null;
  transcript: string;
  fillerEvents: FillerDetection[];
  wordTimings: WordTiming[];
  reconciledFillers: ReconciledFiller[];
  averageConfidence: number;
  lowConfidenceSegments: number;
  qualityWarnings: ("noise" | "clipping")[];
}
