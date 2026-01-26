/**
 * useLabelingSession Hook
 * Manages the labeling practice session flow
 */

import { useState, useCallback, useRef } from 'react';
import type {
  LabelingScenario,
  LabelAttempt,
  LabelingSessionData,
  AIResponse,
} from './types';
import { analyzeLabel } from './labelAnalyzer';
import { saveLabelAttempt } from './labelingStorage';
import { getRandomScenario, getScenarioById } from './scenarioBank';

// AI responses based on label quality
const AI_RESPONSES = {
  open: [
    "Yeah... that's exactly it. I didn't realize how much that was weighing on me.",
    "You're right. I guess I am worried about that.",
    "That's... actually what's been bothering me. I didn't know how to say it.",
  ],
  partial: [
    "I mean... kind of. It's more complicated than that.",
    "That's part of it, I suppose.",
    "I hadn't thought of it that way, but maybe.",
  ],
  guarded: [
    "I don't know. Can we just move on?",
    "That's not really... look, let's just focus on the issue.",
    "I'm not sure what you want me to say.",
  ],
};

function getAIResponse(score: number, _scenario: LabelingScenario): AIResponse {
  let tone: 'open' | 'partial' | 'guarded';
  let responses: string[];

  if (score >= 75) {
    tone = 'open';
    responses = AI_RESPONSES.open;
  } else if (score >= 50) {
    tone = 'partial';
    responses = AI_RESPONSES.partial;
  } else {
    tone = 'guarded';
    responses = AI_RESPONSES.guarded;
  }

  const text = responses[Math.floor(Math.random() * responses.length)];

  return {
    text,
    tone,
    followUp: tone === 'guarded' ? 'Try again with a different approach?' : undefined,
  };
}

export interface UseLabelingSessionResult {
  // State
  sessionData: LabelingSessionData;
  currentAttempt: LabelAttempt | null;
  aiResponse: AIResponse | null;

  // Actions
  selectScenario: (scenarioId?: string, category?: string, difficulty?: string) => void;
  startRecording: () => void;
  submitLabel: (transcript: string, audioBlob?: Blob, silenceDuration?: number) => void;
  showAIResponse: () => void;
  nextScenario: () => void;
  retryScenario: () => void;
  endSession: () => void;
}

export function useLabelingSession(): UseLabelingSessionResult {
  const [sessionData, setSessionData] = useState<LabelingSessionData>({
    state: 'selecting',
    currentScenario: null,
    attempts: [],
    sessionStartTime: Date.now(),
  });

  const [currentAttempt, setCurrentAttempt] = useState<LabelAttempt | null>(null);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const attemptIdRef = useRef(0);

  // Select a scenario to practice
  const selectScenario = useCallback(
    (scenarioId?: string, category?: string, difficulty?: string) => {
      let scenario: LabelingScenario;

      if (scenarioId) {
        const found = getScenarioById(scenarioId);
        if (!found) {
          console.error('Scenario not found:', scenarioId);
          return;
        }
        scenario = found;
      } else {
        scenario = getRandomScenario(
          category as any,
          difficulty as any
        );
      }

      setSessionData((prev) => ({
        ...prev,
        state: 'presenting',
        currentScenario: scenario,
      }));
      setCurrentAttempt(null);
      setAIResponse(null);
    },
    []
  );

  // Transition to recording state
  const startRecording = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'recording',
    }));
  }, []);

  // Submit a label attempt for analysis
  const submitLabel = useCallback(
    (transcript: string, audioBlob?: Blob, silenceDuration?: number) => {
      const scenario = sessionData.currentScenario;
      if (!scenario) return;

      // Set analyzing state
      setSessionData((prev) => ({
        ...prev,
        state: 'analyzing',
      }));

      // Analyze the label
      const analysis = analyzeLabel(transcript, scenario);

      // Create attempt record
      const attempt: LabelAttempt = {
        id: `attempt-${++attemptIdRef.current}-${Date.now()}`,
        scenarioId: scenario.id,
        timestamp: Date.now(),
        transcript,
        audioBlob,
        silenceDuration,
        analysis,
      };

      // Save attempt
      saveLabelAttempt(attempt);

      // Update state
      setCurrentAttempt(attempt);
      setSessionData((prev) => ({
        ...prev,
        state: 'feedback',
        attempts: [...prev.attempts, attempt],
      }));
    },
    [sessionData.currentScenario]
  );

  // Show AI response after feedback
  const showAIResponse = useCallback(() => {
    if (!currentAttempt || !sessionData.currentScenario) return;

    const response = getAIResponse(
      currentAttempt.analysis.overallScore,
      sessionData.currentScenario
    );

    setAIResponse(response);
    setSessionData((prev) => ({
      ...prev,
      state: 'responding',
    }));
  }, [currentAttempt, sessionData.currentScenario]);

  // Move to next scenario
  const nextScenario = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'selecting',
      currentScenario: null,
    }));
    setCurrentAttempt(null);
    setAIResponse(null);
  }, []);

  // Retry the same scenario
  const retryScenario = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'presenting',
    }));
    setCurrentAttempt(null);
    setAIResponse(null);
  }, []);

  // End the session and show summary
  const endSession = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'summary',
    }));
  }, []);

  return {
    sessionData,
    currentAttempt,
    aiResponse,
    selectScenario,
    startRecording,
    submitLabel,
    showAIResponse,
    nextScenario,
    retryScenario,
    endSession,
  };
}
