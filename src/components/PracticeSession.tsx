import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import MicPermissionError from "./MicPermissionError";
import AudioQualityWarning from "./AudioQualityWarning";
import { SessionOrb } from "./SessionOrb";
import SilenceNudge from "./SilenceNudge";
import SessionProgressBar from "./SessionProgressBar";
import LoadingSpinner from "./LoadingSpinner";
import CountdownOverlay from "./CountdownOverlay";
// Unused imports (for future recording screen redesign in Phase 15)
// import BottomControlBar from "./BottomControlBar";
// import WaveformVisualizer from "./WaveformVisualizer";
import { usePracticeRuntime } from "../practice/runtime/usePracticeRuntime";

// Baseline speaking prompts -- shown one at a time during recording, rotated on silence
const BASELINE_PROMPTS = [
  "Walk me through your typical morning routine.",
  "Tell me about yourself -- what do you do and what are you into?",
  "Describe the last trip or outing you went on.",
];

interface PracticeSessionProps {
  focusMode: "filler" | "pace";
}

export default function PracticeSession({ focusMode }: PracticeSessionProps) {
  const location = useLocation();

  // Read duration from route state with 120s (2min) fallback
  const durationSeconds = (location.state as any)?.durationSeconds ?? 120;
  const isBaseline = (location.state as any)?.isBaseline ?? false;

  // Technique context (from ScenarioDetail -> /practice/technique route)
  const techniqueId = (location.state as any)?.techniqueId as
    | string
    | undefined;
  const practicePrompt = (location.state as any)?.practicePrompt as
    | string
    | undefined;
  const techniqueName = (location.state as any)?.techniqueName as
    | string
    | undefined;

  const runtime = usePracticeRuntime({
    focusMode,
    durationSeconds,
    isBaseline,
    techniqueContext: {
      techniqueId,
      techniqueName,
      practicePrompt,
    },
  });

  const { audio, metrics, lifecycle, errors, qualityWarnings } = runtime;

  // Baseline prompt rotation -- user-controlled via "Next" button
  const [baselinePromptIndex, setBaselinePromptIndex] = useState(0);

  const handleCountdownComplete = useCallback(() => {
    setBaselinePromptIndex(0);
    lifecycle.handleCountdownComplete();
  }, [lifecycle]);

  const handleManualStart = useCallback(() => {
    setBaselinePromptIndex(0);
    void lifecycle.handleStart();
  }, [lifecycle]);

  const error = errors.audio || errors.speech;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Countdown overlay (shows before recording starts) */}
      {lifecycle.showCountdown && !audio.isCapturing && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}

      {/* Progress bar at top (hidden in Unlimited mode when durationSeconds === 0) */}
      <SessionProgressBar
        remaining={metrics.countdownRemaining}
        visible={
          audio.isCapturing && !lifecycle.isPaused && durationSeconds > 0
        }
      />

      {/* Processing overlay */}
      {lifecycle.isProcessing && (
        <div className="fixed inset-0 bg-background bg-opacity-90 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-body-sm text-text-muted">
              Processing your session...
            </p>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mb-6 max-w-md w-full mx-auto px-4">
          <MicPermissionError error={error} onRetry={handleManualStart} />
        </div>
      )}

      {/* RECORDING SCREEN LAYOUT */}
      {audio.isCapturing && (
        <div className="flex flex-col h-screen">
          {/* Top section: Audio quality warnings only */}
          <div className="px-4 pt-4 pb-2">
            {/* Audio quality warnings */}
            {!lifecycle.isPaused && qualityWarnings.length > 0 && (
              <AudioQualityWarning
                warnings={qualityWarnings}
                className="mb-2"
              />
            )}
          </div>

          {/* Center section: SessionOrb dominates with prompt below */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            <SessionOrb
              audioLevel={metrics.audioLevel}
              isRecording={!lifecycle.isPaused}
              onClick={() => {}}
              disabled
            />

            {/* Practice prompt - positioned right under SessionOrb */}
            {practicePrompt && (
              <div className="max-w-lg mx-auto px-4">
                <p className="text-body-lg text-text-muted text-center">
                  {practicePrompt}
                </p>
              </div>
            )}

            {/* Baseline speaking prompt - positioned right under SessionOrb */}
            {isBaseline && baselinePromptIndex < BASELINE_PROMPTS.length && (
              <div
                key={baselinePromptIndex}
                className="max-w-lg mx-auto px-4 animate-fade-in"
              >
                <p className="text-body-lg text-text-muted text-center">
                  {BASELINE_PROMPTS[baselinePromptIndex]}
                </p>
                {baselinePromptIndex < BASELINE_PROMPTS.length - 1 && (
                  <button
                    onClick={() => setBaselinePromptIndex((prev) => prev + 1)}
                    className="mt-2 text-body-sm text-text-muted hover:text-text transition-colors block mx-auto"
                  >
                    Next topic &rarr;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Silence nudge overlay */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
            <SilenceNudge
              triggered={metrics.showSilenceNudge}
              onDismissed={metrics.handleNudgeDismissed}
            />
          </div>

          {/* Bottom section: Real-time metrics strip + Stop button */}
          <div className="border-t border-background-elevated">
            {/* Metrics strip - thin, minimal */}
            <div className="flex justify-between items-center px-6 py-2 max-w-md mx-auto">
              <div className="text-body-sm text-text-muted">
                {metrics.liveFillerCount} fillers
              </div>
              <div className="text-body-sm text-text-muted">
                {metrics.wpm} WPM
              </div>
            </div>

            {/* Stop button */}
            <div className="flex justify-center pb-6 pt-2">
              <button
                onClick={lifecycle.handleStop}
                className="px-6 py-3 text-body-sm text-text-subtle hover:text-text transition-colors"
                aria-label="End session"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
