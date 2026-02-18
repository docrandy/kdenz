/**
 * src/features/drill-engine/DrillScreen.tsx
 *
 * Main container for the v3.0 Generic Prompt-Response Drill.
 *
 * Responsibilities:
 *   - Owns Web Speech API lifecycle (init, start, stop, cleanup)
 *   - Delegates all drill business logic to useDrillSession
 *   - Renders each DrillState variant (idle, presenting, recording, scoring,
 *     feedback, complete)
 *   - Shows inline (non-blocking) Chrome warning for non-Chrome browsers
 *
 * NOT responsible for:
 *   - Scoring logic (drillEvaluationService)
 *   - Scenario selection (useDrillSession)
 *   - localStorage reads/writes (drillAttemptStorage)
 */

import { useState, useEffect, useRef } from "react";
import { isChrome, getBrowserName } from "../../utils/browserDetection";
import { useDrillSession } from "./useDrillSession";
import { FeedbackCard } from "./FeedbackCard";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DrillScreenProps {
  techniqueId: string;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Waveform component (5 bars, CSS animation, no external libs)
// ---------------------------------------------------------------------------

function RecordingWaveform() {
  return (
    <div
      className="flex items-center justify-center gap-1 h-12"
      aria-label="Recording in progress"
    >
      <style>{`
        @keyframes drillWave {
          0%, 100% { transform: scaleY(0.3); }
          50%       { transform: scaleY(1.0); }
        }
      `}</style>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1.5 rounded-full bg-accent"
          style={{
            height: "32px",
            animation: "drillWave 0.9s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DrillScreen
// ---------------------------------------------------------------------------

export function DrillScreen({ techniqueId, onBack }: DrillScreenProps) {
  const hook = useDrillSession(techniqueId);
  const recognitionRef = useRef<any>(null);

  // Track whether we've dismissed the non-Chrome banner (state just for banner)
  const [browserWarningDismissed, setBrowserWarningDismissed] = useState(false);
  const browserIsChrome = isChrome();
  const browserName = getBrowserName();

  // ---------------------------------------------------------------------------
  // Web Speech API — init on mount, cleanup on unmount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          hook.appendTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("[DrillScreen] Speech recognition error:", event.error);
        // Stop recognition cleanly; hook stays in recording state until stop is called
        recognitionRef.current?.stop();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Auto-start session on mount (idle → presenting)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (hook.state === "idle") {
      hook.startSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Recording handlers
  // ---------------------------------------------------------------------------

  const handleStartRecording = async () => {
    hook.startRecording();
    recognitionRef.current?.start();
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setTimeout(() => {
      hook.submitTranscript();
    }, 500);
  };

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  const {
    state,
    technique,
    currentScenario,
    transcript,
    evaluation,
    attemptCount,
    streak,
    error,
  } = hook;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <div className="bg-background-surface border-b border-background-elevated sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-text-muted hover:text-text flex items-center gap-2 text-sm"
          >
            ← Back
          </button>
          <h1 className="font-semibold text-text text-sm">Skill Drill</h1>
          {/* Spacer to balance the back button */}
          <div className="w-12" />
        </div>
      </div>

      {/* Non-Chrome inline warning (non-blocking) */}
      {!browserIsChrome && !browserWarningDismissed && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-status-warning mt-0.5 flex-shrink-0">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </span>
            <div className="flex-1 text-sm">
              <p className="text-status-warning font-semibold mb-1">
                Voice input works best in Chrome
              </p>
              <p className="text-text-muted">
                You're using {browserName}. Web Speech API accuracy may be
                reduced. For the best experience, open in Google Chrome.
              </p>
            </div>
            <button
              onClick={() => setBrowserWarningDismissed(true)}
              className="text-text-subtle hover:text-text text-xs flex-shrink-0 ml-2"
              aria-label="Dismiss browser warning"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* ------------------------------------------------------------------ */}
        {/* IDLE state — nothing shown; useEffect calls startSession()          */}
        {/* ------------------------------------------------------------------ */}
        {state === "idle" && (
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-text-muted text-sm mt-4">Loading drill...</p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* PRESENTING state                                                    */}
        {/* ------------------------------------------------------------------ */}
        {state === "presenting" && technique && currentScenario && (
          <div className="space-y-5">
            {/* Technique name */}
            <div>
              <h2 className="text-h4 font-display text-text">
                {technique.name}
              </h2>
              {/* Syntax template badge */}
              <div className="mt-2 inline-block bg-accent/10 border border-accent/30 rounded-lg px-3 py-1">
                <span className="text-xs text-accent font-medium">
                  Template:{" "}
                </span>
                <span className="text-xs text-accent/90">
                  {currentScenario.syntax_template}
                </span>
              </div>
            </div>

            {/* Scenario prompt */}
            <div className="card-surface rounded-xl p-5">
              <p className="text-xs text-text-subtle uppercase tracking-widest mb-3">
                Scenario
              </p>
              <p className="text-text leading-relaxed">
                {currentScenario.prompt}
              </p>
            </div>

            {/* Inline error (transcription failure, session error) */}
            {error && (
              <div className="bg-status-error/10 border border-status-error/30 rounded-xl p-4 flex items-start gap-3">
                <span className="text-status-error mt-0.5 flex-shrink-0 text-sm">
                  !
                </span>
                <div className="flex-1">
                  <p className="text-status-error text-sm">{error}</p>
                </div>
                <button
                  onClick={hook.clearError}
                  className="text-xs text-text-muted hover:text-text ml-2"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Attempt / streak badges (only after first attempt) */}
            {attemptCount > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-subtle bg-background-elevated rounded-full px-3 py-1">
                  Attempt {attemptCount}
                </span>
                {streak > 0 && (
                  <span className="text-xs text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 font-medium">
                    {streak} in a row
                  </span>
                )}
              </div>
            )}

            {/* Record button */}
            <button
              onClick={handleStartRecording}
              className="btn-primary w-full py-4 text-base font-semibold"
            >
              Tap to Record Response
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* RECORDING state                                                     */}
        {/* ------------------------------------------------------------------ */}
        {state === "recording" && technique && currentScenario && (
          <div className="space-y-5">
            {/* Technique name + dimmed scenario */}
            <div>
              <h2 className="text-h4 font-display text-text">
                {technique.name}
              </h2>
              <p className="text-text-subtle text-sm mt-2 line-clamp-2 opacity-60">
                {currentScenario.prompt}
              </p>
            </div>

            {/* Waveform animation */}
            <div className="card-surface rounded-xl p-6 flex flex-col items-center gap-4">
              <RecordingWaveform />
              <p className="text-text-muted text-sm">Recording... speak now</p>
            </div>

            {/* Live transcript */}
            {transcript && (
              <div className="bg-background-elevated rounded-xl p-4">
                <p className="text-text-subtle text-xs mb-2">Hearing:</p>
                <p className="text-text italic text-sm leading-relaxed">
                  "{transcript}"
                </p>
              </div>
            )}

            {/* Stop button */}
            <button
              onClick={handleStop}
              className="w-full py-4 bg-status-error text-text-inverse font-semibold rounded-xl hover:bg-status-error/90 transition-colors text-base"
            >
              Stop &amp; Submit
            </button>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* SCORING state                                                       */}
        {/* ------------------------------------------------------------------ */}
        {state === "scoring" && (
          <div className="text-center py-16 space-y-4">
            <div className="w-12 h-12 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-text font-semibold">Scoring your response...</p>
            <p className="text-text-muted text-sm">
              Form score ready. Analyzing accuracy and impact...
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* FEEDBACK state                                                      */}
        {/* ------------------------------------------------------------------ */}
        {state === "feedback" && evaluation && technique && (
          <FeedbackCard
            techniqueName={technique.name}
            formScore={evaluation.formScore}
            accuracyScore={evaluation.accuracyScore}
            impactScore={evaluation.impactScore}
            compositeScore={evaluation.compositeScore}
            explanation={evaluation.explanation}
            geminiSucceeded={evaluation.geminiSucceeded}
            geminiLoading={false}
            onNext={hook.nextScenario}
            attemptCount={attemptCount}
            streak={streak}
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* COMPLETE state                                                      */}
        {/* ------------------------------------------------------------------ */}
        {state === "complete" && (
          <div className="text-center py-16 space-y-6">
            <div className="text-4xl">&#127775;</div>
            <div>
              <h2 className="text-h3 font-display text-text mb-2">
                Excellent Practice!
              </h2>
              <p className="text-text-muted">No more scenarios. Great work!</p>
            </div>
            <button onClick={onBack} className="btn-primary px-8">
              Back to Skills Lab
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
