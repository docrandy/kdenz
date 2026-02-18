/**
 * src/features/drill-engine/useDrillSession.ts
 *
 * State machine hook for the v3.0 Generic Prompt-Response Drill Engine.
 *
 * Responsibilities:
 *   - Manages all drill state transitions (idle → presenting → recording →
 *     scoring → feedback → [next or complete])
 *   - Picks random scenarios without repeating within a session
 *   - Calls the evaluation service and persists attempt records
 *   - Tracks attempt count and consecutive streak
 *   - Exposes a flat, typed interface for DrillScreen to consume
 *
 * NOT responsible for:
 *   - Starting/stopping the Web Speech API (DrillScreen's job)
 *   - Chrome detection (DrillScreen's job)
 *   - Rendering any UI (DrillScreen's job)
 */

import { useState, useCallback } from "react";
import { Technique, Scenario } from "../../types/drill";
import {
  getTechnique,
  getScenariosForTechnique,
} from "../../utils/drill-storage";
import {
  DrillEvaluationResult,
  evaluateDrillResponse,
} from "../../services/drillEvaluationService";
import {
  saveDrillAttempt,
  generateAttemptId,
} from "../../utils/drillAttemptStorage";
import { getStoredApiKey } from "../../services/geminiService";

// ---------------------------------------------------------------------------
// DrillState
// ---------------------------------------------------------------------------

/**
 * The full set of states the drill session state machine can be in.
 *
 * Transitions:
 *   idle        → presenting  (startSession)
 *   presenting  → recording   (startRecording)
 *   recording   → scoring     (submitTranscript)
 *   scoring     → feedback    (on success)
 *   scoring     → presenting  (on error)
 *   feedback    → presenting  (nextScenario, when scenarios remain)
 *   feedback    → complete    (nextScenario, when all scenarios used and pool reset attempted)
 */
export type DrillState =
  | "idle" // no technique loaded; initial state
  | "presenting" // scenario displayed, user ready to respond
  | "recording" // Web Speech API active, transcript accumulating
  | "scoring" // evaluation in progress (Gemini in flight)
  | "feedback" // evaluation complete, scores shown
  | "complete"; // session ended (no more unused scenarios)

// ---------------------------------------------------------------------------
// useDrillSession hook
// ---------------------------------------------------------------------------

export interface UseDrillSessionResult {
  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------

  /** Current state machine position */
  state: DrillState;

  /** Loaded technique, undefined until startSession() succeeds */
  technique: Technique | undefined;

  /** Active scenario for this round, undefined until first scenario is picked */
  currentScenario: Scenario | undefined;

  /** Live transcript text — accumulates as DrillScreen fires appendTranscript() */
  transcript: string;

  /** Most recent evaluation result, null before first submission */
  evaluation: DrillEvaluationResult | null;

  /** Total attempts submitted this session */
  attemptCount: number;

  /**
   * Consecutive correct attempts (streak).
   * Increments when formScore >= 80 AND (accuracyScore is null OR accuracyScore >= 75).
   * Resets to 0 on any incorrect attempt.
   */
  streak: number;

  /** ISO 8601 timestamp set when startSession() is first called */
  sessionStartTime: string;

  /** Error message to display (inaudible response, API failure, etc.) */
  error: string | null;

  // --------------------------------------------------------------------------
  // Handlers
  // --------------------------------------------------------------------------

  /** Load technique + first scenario, transition from idle → presenting */
  startSession: () => void;

  /** Transition from presenting → recording */
  startRecording: () => void;

  /**
   * Accumulate transcript text as the Web Speech API fires results.
   * DrillScreen calls this on each SpeechRecognitionEvent with interim/final results.
   */
  appendTranscript: (text: string) => void;

  /**
   * Submit the accumulated transcript for evaluation.
   * - Validates transcript is non-empty
   * - Transitions to scoring
   * - Calls evaluateDrillResponse (async)
   * - Saves attempt to localStorage
   * - Transitions to feedback (or back to presenting on error)
   */
  submitTranscript: () => Promise<void>;

  /**
   * Pick next random scenario (from unused pool) and transition to presenting.
   * Resets transcript and evaluation. Pool resets after all scenarios used.
   */
  nextScenario: () => void;

  /** Set error message (stays in presenting state for retry) */
  setError: (msg: string) => void;

  /** Clear the current error message */
  clearError: () => void;
}

export function useDrillSession(techniqueId: string): UseDrillSessionResult {
  // --------------------------------------------------------------------------
  // Core state
  // --------------------------------------------------------------------------

  const [state, setState] = useState<DrillState>("idle");
  const [technique, setTechnique] = useState<Technique | undefined>(undefined);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<Scenario | undefined>(
    undefined,
  );
  const [usedScenarioIds, setUsedScenarioIds] = useState<string[]>([]);
  const [transcript, setTranscript] = useState<string>("");
  const [evaluation, setEvaluation] = useState<DrillEvaluationResult | null>(
    null,
  );
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [sessionStartTime, setSessionStartTime] = useState<string>("");
  const [error, setErrorState] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // Scenario pool helpers (not exposed, used internally)
  // --------------------------------------------------------------------------

  /**
   * Pick a random scenario that has not been used in this session.
   * If all scenarios have been used, reset the pool and pick from all.
   * Returns the chosen scenario and the updated used-IDs list.
   */
  function pickFromPool(
    allScenarios: Scenario[],
    used: string[],
  ): { chosen: Scenario; updatedUsed: string[] } {
    const available = allScenarios.filter((s) => !used.includes(s.id));

    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      return { chosen, updatedUsed: used };
    }

    // Pool exhausted — reset and pick from all
    const chosen =
      allScenarios[Math.floor(Math.random() * allScenarios.length)];
    return { chosen, updatedUsed: [] };
  }

  // --------------------------------------------------------------------------
  // startSession
  // --------------------------------------------------------------------------

  const startSession = useCallback(() => {
    const loadedTechnique = getTechnique(techniqueId);
    if (!loadedTechnique) {
      setErrorState(`Technique "${techniqueId}" not found. Please try again.`);
      return;
    }

    const loadedScenarios = getScenariosForTechnique(techniqueId);
    if (loadedScenarios.length === 0) {
      setErrorState(
        `No scenarios available for "${loadedTechnique.name}". Please try again later.`,
      );
      return;
    }

    const now = new Date().toISOString();
    const { chosen, updatedUsed } = pickFromPool(loadedScenarios, []);
    const newUsed = [...updatedUsed, chosen.id];

    setTechnique(loadedTechnique);
    setScenarios(loadedScenarios);
    setCurrentScenario(chosen);
    setUsedScenarioIds(newUsed);
    setSessionStartTime(now);
    setTranscript("");
    setEvaluation(null);
    setAttemptCount(0);
    setStreak(0);
    setErrorState(null);
    setState("presenting");
  }, [techniqueId]);

  // --------------------------------------------------------------------------
  // startRecording
  // --------------------------------------------------------------------------

  const startRecording = useCallback(() => {
    setTranscript("");
    setErrorState(null);
    setState("recording");
  }, []);

  // --------------------------------------------------------------------------
  // appendTranscript
  // --------------------------------------------------------------------------

  const appendTranscript = useCallback((text: string) => {
    setTranscript((prev) => {
      // Avoid duplicate appends (Web Speech API may fire final results multiple times)
      if (prev === text) return prev;
      return text;
    });
  }, []);

  // --------------------------------------------------------------------------
  // submitTranscript
  // --------------------------------------------------------------------------

  const submitTranscript = useCallback(async () => {
    // Validate non-empty transcript
    if (!transcript || transcript.trim().length === 0) {
      setErrorState("Inaudible response. Please speak clearly and try again.");
      setState("presenting");
      return;
    }

    if (!technique || !currentScenario) {
      setErrorState("Session error. Please restart the drill.");
      setState("presenting");
      return;
    }

    // Transition to scoring (shows loading state in UI)
    setState("scoring");

    try {
      const apiKey = getStoredApiKey();

      const result = await evaluateDrillResponse(
        transcript,
        technique,
        currentScenario,
        apiKey,
      );

      // Streak logic:
      // Correct = formScore >= 80 AND (accuracyScore is null OR accuracyScore >= 75)
      const isCorrect =
        result.formScore >= 80 &&
        (result.accuracyScore === null || result.accuracyScore >= 75);

      // Persist attempt to localStorage
      saveDrillAttempt({
        id: generateAttemptId(),
        timestamp: new Date().toISOString(),
        techniqueId,
        scenarioId: currentScenario.id,
        transcript,
        formScore: result.formScore,
        accuracyScore: result.accuracyScore,
        impactScore: result.impactScore,
        timingScore: 0,
        compositeScore: result.compositeScore,
        explanation: result.explanation,
        geminiSucceeded: result.geminiSucceeded,
      });

      // Update counts and streak before transitioning to feedback
      setAttemptCount((prev) => prev + 1);
      setStreak((prev) => (isCorrect ? prev + 1 : 0));
      setEvaluation(result);
      setState("feedback");
    } catch (err) {
      // Unexpected error (evaluateDrillResponse shouldn't throw, but guard anyway)
      console.error("[useDrillSession] submitTranscript error:", err);
      setErrorState("Could not process your response. Please try again.");
      setState("presenting");
    }
  }, [transcript, technique, currentScenario, techniqueId]);

  // --------------------------------------------------------------------------
  // nextScenario
  // --------------------------------------------------------------------------

  const nextScenario = useCallback(() => {
    if (scenarios.length === 0) return;

    // Add current scenario to used list, then pick next
    const currentId = currentScenario?.id;
    const alreadyUsed = currentId
      ? [...usedScenarioIds, currentId]
      : usedScenarioIds;

    const { chosen, updatedUsed } = pickFromPool(scenarios, alreadyUsed);
    const newUsed = [...updatedUsed, chosen.id];

    setCurrentScenario(chosen);
    setUsedScenarioIds(newUsed);
    setTranscript("");
    setEvaluation(null);
    setErrorState(null);
    setState("presenting");
  }, [scenarios, currentScenario, usedScenarioIds]);

  // --------------------------------------------------------------------------
  // setError / clearError
  // --------------------------------------------------------------------------

  const setError = useCallback((msg: string) => {
    setErrorState(msg);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  // --------------------------------------------------------------------------
  // Return
  // --------------------------------------------------------------------------

  return {
    state,
    technique,
    currentScenario,
    transcript,
    evaluation,
    attemptCount,
    streak,
    sessionStartTime,
    error,
    startSession,
    startRecording,
    appendTranscript,
    submitTranscript,
    nextScenario,
    setError,
    clearError,
  };
}
