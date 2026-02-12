import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useAudioCapture,
  useWebSpeech,
  useFillerDetector,
  useSessionTimer,
} from "../core/audio";
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
import { saveBaseline } from "../services/baselineStorage";
import { reconcileFillers } from "../lib/fillerReconciler";

// Helper function to convert Blob to base64 for sessionStorage
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Filler phrases to detect in real-time (multi-word phrases checked first)
const FILLER_PHRASES = ["you know", "i mean", "kind of", "sort of"];
// Single filler words checked with word boundary matching
const FILLER_WORDS = [
  "like",
  "um",
  "uh",
  "so",
  "basically",
  "actually",
  "literally",
  "honestly",
  "essentially",
  "obviously",
  "right",
];

// Count filler words/phrases in text using regex word boundaries
function countFillerWords(text: string): number {
  if (!text.trim()) return 0;
  const lower = text.toLowerCase();
  let count = 0;

  // Count multi-word phrases first
  for (const phrase of FILLER_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }

  // Count single filler words with word boundaries (prevents "unlikely" matching "like")
  for (const word of FILLER_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const matches = lower.match(regex);
    if (matches) count += matches.length;
  }

  return count;
}

// Baseline speaking prompts — shown one at a time during recording, rotated on silence
const BASELINE_PROMPTS = [
  "Walk me through your typical morning routine.",
  "Tell me about yourself — what do you do and what are you into?",
  "Describe the last trip or outing you went on.",
];
// TODO: Add silence-based auto-rotation (BASELINE_PROMPT_SILENCE_MS = 8000) in a future phase

interface PracticeSessionProps {
  focusMode: "filler" | "pace";
}

export default function PracticeSession({ focusMode }: PracticeSessionProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Read duration from route state with 120s (2min) fallback
  const durationSeconds = (location.state as any)?.durationSeconds ?? 120;
  const isBaseline = (location.state as any)?.isBaseline ?? false;

  // Technique context (from ScenarioDetail → /practice/technique route)
  const techniqueId = (location.state as any)?.techniqueId as
    | string
    | undefined;
  const practicePrompt = (location.state as any)?.practicePrompt as
    | string
    | undefined;
  const techniqueName = (location.state as any)?.techniqueName as
    | string
    | undefined;

  const {
    isCapturing,
    audioContext,
    sourceNode,
    audioBlob,
    qualityWarnings,
    error: audioError,
    start: startAudio,
    stop: stopAudio,
  } = useAudioCapture();

  const {
    interimTranscript,
    finalTranscript,
    wordCount,
    wordTimings,
    averageConfidence,
    lowConfidenceSegments,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useWebSpeech();

  const {
    fillerEvents,
    start: startFillerDetection,
    stop: stopFillerDetection,
  } = useFillerDetector(audioContext, sourceNode);

  // WPM calculation state
  const [wpm, setWpm] = useState(0);

  // Audio level for orb reactivity (0-1 normalized)
  const [audioLevel, setAudioLevel] = useState(0);

  // Countdown state
  const [showCountdown, setShowCountdown] = useState(true);

  // Pause/resume state (kept for backwards compatibility, but pause UI removed)
  const [isPaused, setIsPaused] = useState(false);

  // Silence tracking — dual signal: audio level + speech recognition activity
  const [silenceDuration, setSilenceDuration] = useState(0);
  const silenceTimerRef = useRef<number | null>(null);
  const lastWordCountRef = useRef<number>(0);
  const speechIdleRef = useRef<boolean>(true);
  const speechIdleTimerRef = useRef<number | null>(null);
  const nudgeShownRef = useRef(false); // Track if nudge has been shown this session

  const SILENCE_AUDIO_THRESHOLD = 0.02; // audioLevel below this = no voice signal
  const SPEECH_IDLE_CHECK_MS = 2000; // if wordCount hasn't changed in 2s, speech recognition is idle
  const SILENCE_NUDGE_MS = 10000; // 10 seconds of combined silence before nudge

  // Loading state for session end processing
  const [isProcessing, setIsProcessing] = useState(false);

  // AnalyserNode ref for WaveformVisualizer
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Stop session handler - defined before useSessionTimer
  const stopSessionRef = useRef<(() => void) | null>(null);

  // Session timer with auto-stop
  const handleTimerComplete = useCallback(() => {
    stopSessionRef.current?.();
  }, []);

  const {
    elapsedTime,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useSessionTimer({
    durationSeconds: durationSeconds,
    onComplete: handleTimerComplete,
  });

  // WPM calculation - runs on each elapsedTime update (100ms from timer)
  useEffect(() => {
    if (isCapturing && elapsedTime > 0 && wordCount > 0) {
      const elapsedMinutes = elapsedTime / 60;
      setWpm(Math.round(wordCount / elapsedMinutes));
    }
  }, [isCapturing, elapsedTime, wordCount]);

  // Audio level extraction for orb reactivity and store analyserNode
  useEffect(() => {
    if (!audioContext || !sourceNode || !isCapturing) {
      setAudioLevel(0);
      analyserRef.current = null;
      return;
    }

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);
    analyserRef.current = analyser;

    let animationFrameId: number;

    const updateAudioLevel = () => {
      analyser.getByteTimeDomainData(dataArray);

      // Calculate RMS (root mean square) for volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128; // -1 to 1
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);

      // Normalize to 0-1 range (amplify for better visual response)
      const normalized = Math.min(rms * 3, 1);

      setAudioLevel(normalized);
      animationFrameId = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      try {
        sourceNode.disconnect(analyser);
      } catch {
        // Already disconnected, ignore
      }
    };
  }, [audioContext, sourceNode, isCapturing]);

  // Silence detection - dual signal approach
  useEffect(() => {
    if (!isCapturing || isPaused) {
      // Session not active — clear everything
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
        speechIdleTimerRef.current = null;
      }
      setSilenceDuration(0);
      speechIdleRef.current = true;
      lastWordCountRef.current = 0;
      return;
    }

    // Check if wordCount changed (speech recognition produced new words)
    if (wordCount > lastWordCountRef.current) {
      lastWordCountRef.current = wordCount;
      speechIdleRef.current = false;

      // Reset the speech idle timer — user just spoke
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
      }
      speechIdleTimerRef.current = window.setTimeout(() => {
        speechIdleRef.current = true;
      }, SPEECH_IDLE_CHECK_MS);
    }

    // Combined silence check: low audio OR speech recognition idle
    const isSilent =
      audioLevel < SILENCE_AUDIO_THRESHOLD || speechIdleRef.current;

    if (isSilent) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = window.setInterval(() => {
          setSilenceDuration((prev) => prev + 100);
        }, 100);
      }
    } else {
      // Active speech detected on BOTH signals — reset
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setSilenceDuration(0);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
        speechIdleTimerRef.current = null;
      }
    };
  }, [
    isCapturing,
    isPaused,
    audioLevel,
    wordCount,
    SILENCE_AUDIO_THRESHOLD,
    SPEECH_IDLE_CHECK_MS,
  ]);

  // Only trigger once per session (suppressed during baseline — prompts handle silence instead)
  const showSilenceNudge =
    isCapturing &&
    !isPaused &&
    !nudgeShownRef.current &&
    !isBaseline &&
    silenceDuration >= SILENCE_NUDGE_MS;

  // Callback when nudge is dismissed
  const handleNudgeDismissed = useCallback(() => {
    nudgeShownRef.current = true;
  }, []);

  // Baseline prompt rotation — user-controlled via "Next" button
  const [baselinePromptIndex, setBaselinePromptIndex] = useState(0);

  // Real-time filler count from transcript
  const liveFillerCount = useMemo(() => {
    const allText = finalTranscript + " " + interimTranscript;
    return countFillerWords(allText);
  }, [finalTranscript, interimTranscript]);

  // Start filler detection when audio context is ready
  useEffect(() => {
    if (isCapturing && !isPaused && audioContext && sourceNode) {
      startFillerDetection();
    }
  }, [isCapturing, isPaused, audioContext, sourceNode, startFillerDetection]);

  // Countdown remaining calculation (1 -> 0) for countdown bar
  const countdownRemaining =
    durationSeconds > 0
      ? Math.max(0, 1 - elapsedTime / durationSeconds)
      : undefined;

  const handleStart = useCallback(async () => {
    setWpm(0);
    resetTimer();
    nudgeShownRef.current = false; // Reset nudge for new session
    setBaselinePromptIndex(0); // Reset baseline prompts
    await startAudio();
    startSpeech();
    startTimer();
    setIsPaused(false);
    // Filler detection starts via useEffect when audioContext/sourceNode are ready
  }, [resetTimer, startAudio, startSpeech, startTimer]);

  // Countdown complete handler - auto-start recording
  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    handleStart();
  }, [handleStart]);

  const handleStop = useCallback(async () => {
    // Show processing state
    setIsProcessing(true);

    // Stop everything first to finalize audioBlob
    setIsPaused(false);
    stopTimer();
    stopFillerDetection();
    stopSpeech();
    stopAudio();

    // Calculate filler count from transcript
    const transcriptFillerCount = countFillerWords(
      finalTranscript + " " + interimTranscript,
    );
    const elapsedMinutes = elapsedTime / 60;
    const transcriptFillerRate =
      elapsedMinutes > 0 ? transcriptFillerCount / elapsedMinutes : 0;

    // Hybrid filler detection: combine acoustic + transcript
    // fillerEvents is already FillerDetection[] type — no mapping needed
    const reconciledFillers = reconcileFillers(
      finalTranscript + " " + interimTranscript,
      fillerEvents, // Already FillerDetection[] from useFillerDetector
      wordTimings, // Already WordTiming[] from useWebSpeech (captured at line 84)
    );

    // Convert audio blob to base64 for storage (show loading during this)
    let audioData: string | null = null;
    if (audioBlob) {
      try {
        audioData = await blobToBase64(audioBlob);
      } catch {
        console.warn("[PracticeSession] Failed to convert audio blob");
      }
    }

    // If this is a baseline session, save baseline metrics
    if (isBaseline) {
      // Calculate pause rate from silence duration
      const pauseRate =
        silenceDuration > 0 ? silenceDuration / 1000 / (elapsedTime / 60) : 0;

      saveBaseline({
        wpm,
        fillerRate: transcriptFillerRate,
        fillerCount: transcriptFillerCount,
        pauseRate,
        wordCount,
        durationSeconds: Math.round(elapsedTime),
        timestamp: Date.now(),
      });
    }

    // Save session data to sessionStorage for post-session page
    const sessionData = {
      durationSeconds: Math.round(elapsedTime),
      wordCount,
      wpm,
      fillerCount: transcriptFillerCount,
      fillerRate: transcriptFillerRate,
      focusMode,
      is_baseline: isBaseline,
      audioData,
      // Technique context (if practicing a specific technique)
      ...(techniqueId && { techniqueId, techniqueName, practicePrompt }),
    };

    try {
      sessionStorage.setItem(
        "voicelab_last_session",
        JSON.stringify({
          ...sessionData,
          transcript: finalTranscript,
          fillerEvents: [...fillerEvents],
          wordTimings: [...wordTimings],
          reconciledFillers: reconciledFillers,
          averageConfidence: averageConfidence,
          lowConfidenceSegments: lowConfidenceSegments,
          qualityWarnings: [...qualityWarnings],
        }),
      );
    } catch {
      // sessionStorage not available
    }

    // Navigate to appropriate results page
    if (isBaseline) {
      navigate("/baseline/results");
    } else if (techniqueId) {
      navigate("/practice/technique-results");
    } else {
      navigate("/practice/results");
    }

    // Reset processing state
    setIsProcessing(false);
  }, [
    elapsedTime,
    wordCount,
    wpm,
    fillerEvents,
    finalTranscript,
    wordTimings,
    focusMode,
    interimTranscript,
    isBaseline,
    silenceDuration,
    audioBlob,
    qualityWarnings,
    averageConfidence,
    lowConfidenceSegments,
    techniqueId,
    techniqueName,
    practicePrompt,
    stopTimer,
    stopFillerDetection,
    stopSpeech,
    stopAudio,
    navigate,
  ]);

  // Keep stopSessionRef updated for timer auto-stop callback
  useEffect(() => {
    stopSessionRef.current = handleStop;
  }, [handleStop]);

  // Combined error display
  const error = audioError || speechError;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Countdown overlay (shows before recording starts) */}
      {showCountdown && !isCapturing && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}

      {/* Progress bar at top (hidden in Unlimited mode when durationSeconds === 0) */}
      <SessionProgressBar
        remaining={countdownRemaining}
        visible={isCapturing && !isPaused && durationSeconds > 0}
      />

      {/* Processing overlay */}
      {isProcessing && (
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
          <MicPermissionError error={error} onRetry={handleStart} />
        </div>
      )}

      {/* RECORDING SCREEN LAYOUT */}
      {isCapturing && (
        <div className="flex flex-col h-screen">
          {/* Top section: Practice prompt (dimmed, persistent) */}
          <div className="px-4 pt-4 pb-2">
            {/* Audio quality warnings */}
            {!isPaused && qualityWarnings.length > 0 && (
              <AudioQualityWarning
                warnings={qualityWarnings}
                className="mb-2"
              />
            )}

            {/* Practice prompt - dimmed at top, glanceable */}
            {practicePrompt && (
              <div className="max-w-lg mx-auto px-3 py-2 rounded-lg">
                <p className="text-body-sm text-text-subtle text-center line-clamp-2">
                  {practicePrompt}
                </p>
              </div>
            )}

            {/* Baseline speaking prompt */}
            {isBaseline && baselinePromptIndex < BASELINE_PROMPTS.length && (
              <div
                key={baselinePromptIndex}
                className="max-w-lg mx-auto animate-fade-in"
              >
                <div className="px-3 py-2 rounded-lg">
                  <p className="text-body-sm text-text-subtle text-center line-clamp-2">
                    {BASELINE_PROMPTS[baselinePromptIndex]}
                  </p>
                </div>
                {baselinePromptIndex < BASELINE_PROMPTS.length - 1 && (
                  <button
                    onClick={() => setBaselinePromptIndex((prev) => prev + 1)}
                    className="mt-1 text-caption text-text-subtle hover:text-text-muted transition-colors block mx-auto"
                  >
                    Next topic &rarr;
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Center section: SessionOrb dominates */}
          <div className="flex-1 flex items-center justify-center">
            <SessionOrb
              audioLevel={audioLevel}
              isRecording={!isPaused}
              onClick={() => {}}
              disabled={true}
            />
          </div>

          {/* Silence nudge overlay */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
            <SilenceNudge
              triggered={showSilenceNudge}
              onDismissed={handleNudgeDismissed}
            />
          </div>

          {/* Bottom section: Real-time metrics strip + Stop button */}
          <div className="border-t border-background-elevated">
            {/* Metrics strip - thin, minimal */}
            <div className="flex justify-between items-center px-6 py-2 max-w-md mx-auto">
              <div className="text-body-sm text-text-muted">
                {liveFillerCount} fillers
              </div>
              <div className="text-body-sm text-text-muted">{wpm} WPM</div>
            </div>

            {/* Stop button */}
            <div className="flex justify-center pb-6 pt-2">
              <button
                onClick={handleStop}
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
