/**
 * useAuditSession Hook
 * Manages the accusation audit practice session flow
 * Supports multi-turn conversations
 */

import { useState, useCallback, useRef } from 'react';
import type {
  AuditScenario,
  AuditAttempt,
  AuditSessionData,
  AIResponse,
  ConversationTurn,
} from './types';
import { analyzeAudit } from './auditAnalyzer';
import { saveAuditAttempt } from './auditStorage';
import { getRandomScenario, getScenarioById } from './scenarios';

// AI responses based on audit quality
const AI_RESPONSES = {
  opens: [
    "Actually, it's not that at all. The real issue is...",
    "Hm... that's not quite it. What I'm really concerned about is...",
    "No, I wasn't thinking any of that. It's more that...",
  ],
  partial: [
    "Well... I wouldn't say all that, but some of it is true.",
    "That's part of it, I suppose. But there's more.",
    "You're getting warmer, but that's not the whole picture.",
  ],
  guarded: [
    "Look, let's just focus on the issue at hand.",
    "I'm not sure what you want me to say.",
    "Can we move on? This feels awkward.",
  ],
};

// Follow-up responses for multi-turn conversations
const FOLLOWUP_RESPONSES = {
  opens: [
    "Yeah, exactly. I appreciate you getting that.",
    "That's it. I feel like you really understand now.",
    "Yes, and there's actually more I haven't mentioned...",
  ],
  partial: [
    "Getting closer... but there's still something you're missing.",
    "Part of it, yes. But I'm not sure you fully get it yet.",
    "Okay, that helps a bit. Let me think about it.",
  ],
  guarded: [
    "I don't know. I'm not sure this is going anywhere.",
    "Can we just move on?",
    "I'd rather not keep talking about this.",
  ],
};

function getAIResponse(
  score: number,
  scenario: AuditScenario,
  turnNumber: number
): AIResponse {
  let type: 'opens' | 'partial' | 'guarded';
  let responses: string[];
  let interpretation: string;

  // Use different response pools for follow-up turns
  const isFollowUp = turnNumber > 1;

  if (score >= 75) {
    type = 'opens';
    responses = isFollowUp ? FOLLOWUP_RESPONSES.opens : AI_RESPONSES.opens;
    interpretation = isFollowUp
      ? "They're opening up more. You've built trust."
      : "Your audit worked - they revealed what's really on their mind.";
  } else if (score >= 50) {
    type = 'partial';
    responses = isFollowUp ? FOLLOWUP_RESPONSES.partial : AI_RESPONSES.partial;
    interpretation = isFollowUp
      ? "They're considering what you said. Keep going."
      : "They softened but didn't fully open. Try hitting more concerns.";
  } else {
    type = 'guarded';
    responses = isFollowUp ? FOLLOWUP_RESPONSES.guarded : AI_RESPONSES.guarded;
    interpretation = isFollowUp
      ? "They're shutting down. Consider a different approach."
      : "They're still defensive. Your audit didn't surface enough concerns.";
  }

  // For "opens" responses on first turn, include the hidden concern
  let text = responses[Math.floor(Math.random() * responses.length)];
  if (type === 'opens' && !isFollowUp) {
    text = `Actually, it's not really about any of that. ${scenario.hiddenConcern}`;
  }

  return {
    text,
    type,
    interpretation,
  };
}

export interface UseAuditSessionResult {
  // State
  sessionData: AuditSessionData;
  currentAttempt: AuditAttempt | null;
  aiResponse: AIResponse | null;

  // Actions
  selectScenario: (scenarioId?: string, category?: string, difficulty?: string) => void;
  addBrainstormItem: (item: string) => void;
  skipBrainstorm: () => void;
  completeBrainstorm: () => void;
  startRecording: () => void;
  submitAudit: (transcript: string, audioBlob?: Blob) => void;
  showAIResponse: () => void;
  continueConversation: () => void;
  submitContinuation: (transcript: string, audioBlob?: Blob) => void;
  nextScenario: () => void;
  retryScenario: () => void;
  endSession: () => void;
}

export function useAuditSession(): UseAuditSessionResult {
  const [sessionData, setSessionData] = useState<AuditSessionData>({
    state: 'selecting',
    currentScenario: null,
    brainstormedCriticisms: [],
    attempts: [],
    sessionStartTime: Date.now(),
    conversationTurns: [],
    currentTurnNumber: 0,
  });

  const [currentAttempt, setCurrentAttempt] = useState<AuditAttempt | null>(null);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);
  const attemptIdRef = useRef(0);
  const turnIdRef = useRef(0);

  // Select a scenario to practice - now goes to brainstorming first
  const selectScenario = useCallback(
    (scenarioId?: string, category?: string, difficulty?: string) => {
      let scenario: AuditScenario;

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

      // Go to brainstorming phase FIRST (before showing full scenario)
      setSessionData((prev) => ({
        ...prev,
        state: 'brainstorming',
        currentScenario: scenario,
        brainstormedCriticisms: [],
        conversationTurns: [],
        currentTurnNumber: 0,
      }));
      setCurrentAttempt(null);
      setAIResponse(null);
    },
    []
  );

  // Add a brainstormed criticism
  const addBrainstormItem = useCallback((item: string) => {
    setSessionData((prev) => ({
      ...prev,
      brainstormedCriticisms: [...prev.brainstormedCriticisms, item],
    }));
  }, []);

  // Skip brainstorming and go directly to presenting
  const skipBrainstorm = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'presenting',
    }));
  }, []);

  // Complete brainstorming and move to presenting
  const completeBrainstorm = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'presenting',
    }));
  }, []);

  // Transition to recording state
  const startRecording = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'recording',
    }));
  }, []);

  // Submit an audit attempt for analysis
  const submitAudit = useCallback(
    (transcript: string, audioBlob?: Blob) => {
      const scenario = sessionData.currentScenario;
      if (!scenario) return;

      // Set analyzing state
      setSessionData((prev) => ({
        ...prev,
        state: 'analyzing',
      }));

      // Analyze the audit
      const analysis = analyzeAudit(transcript, scenario);

      // Create attempt record
      const attempt: AuditAttempt = {
        id: `audit-attempt-${++attemptIdRef.current}-${Date.now()}`,
        scenarioId: scenario.id,
        timestamp: Date.now(),
        brainstormedCriticisms: sessionData.brainstormedCriticisms,
        transcript,
        audioBlob,
        analysis,
      };

      // Save attempt
      saveAuditAttempt(attempt);

      // Create conversation turn
      const userTurn: ConversationTurn = {
        id: `turn-${++turnIdRef.current}`,
        turnNumber: 1,
        role: 'user',
        transcript,
        timestamp: Date.now(),
        analysis,
      };

      // Update state
      setCurrentAttempt(attempt);
      setSessionData((prev) => ({
        ...prev,
        state: 'feedback',
        attempts: [...prev.attempts, attempt],
        conversationTurns: [userTurn],
        currentTurnNumber: 1,
      }));
    },
    [sessionData.currentScenario, sessionData.brainstormedCriticisms]
  );

  // Show AI response after feedback
  const showAIResponse = useCallback(() => {
    if (!currentAttempt || !sessionData.currentScenario) return;

    const response = getAIResponse(
      currentAttempt.analysis.overallScore,
      sessionData.currentScenario,
      sessionData.currentTurnNumber
    );

    // Create AI turn
    const aiTurn: ConversationTurn = {
      id: `turn-${++turnIdRef.current}`,
      turnNumber: sessionData.currentTurnNumber + 1,
      role: 'ai',
      transcript: response.text,
      timestamp: Date.now(),
    };

    setAIResponse(response);
    setSessionData((prev) => ({
      ...prev,
      state: 'responding',
      conversationTurns: [...prev.conversationTurns, aiTurn],
      currentTurnNumber: prev.currentTurnNumber + 1,
    }));
  }, [currentAttempt, sessionData.currentScenario, sessionData.currentTurnNumber]);

  // Continue the conversation (multi-turn)
  const continueConversation = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'continuing',
    }));
  }, []);

  // Submit a continuation response
  const submitContinuation = useCallback(
    (transcript: string, audioBlob?: Blob) => {
      const scenario = sessionData.currentScenario;
      if (!scenario) return;

      // Set analyzing state
      setSessionData((prev) => ({
        ...prev,
        state: 'analyzing',
      }));

      // Analyze the continuation
      const analysis = analyzeAudit(transcript, scenario);

      // Create attempt record (for pattern tracking)
      const attempt: AuditAttempt = {
        id: `audit-attempt-${++attemptIdRef.current}-${Date.now()}`,
        scenarioId: scenario.id,
        timestamp: Date.now(),
        brainstormedCriticisms: [],
        transcript,
        audioBlob,
        analysis,
      };

      // Create user turn
      const userTurn: ConversationTurn = {
        id: `turn-${++turnIdRef.current}`,
        turnNumber: sessionData.currentTurnNumber + 1,
        role: 'user',
        transcript,
        timestamp: Date.now(),
        analysis,
      };

      // Update state
      setCurrentAttempt(attempt);
      setSessionData((prev) => ({
        ...prev,
        state: 'feedback',
        attempts: [...prev.attempts, attempt],
        conversationTurns: [...prev.conversationTurns, userTurn],
        currentTurnNumber: prev.currentTurnNumber + 1,
      }));
    },
    [sessionData.currentScenario, sessionData.currentTurnNumber]
  );

  // Move to next scenario
  const nextScenario = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'selecting',
      currentScenario: null,
      brainstormedCriticisms: [],
      conversationTurns: [],
      currentTurnNumber: 0,
    }));
    setCurrentAttempt(null);
    setAIResponse(null);
  }, []);

  // Retry the same scenario
  const retryScenario = useCallback(() => {
    setSessionData((prev) => ({
      ...prev,
      state: 'presenting',
      brainstormedCriticisms: [],
      conversationTurns: [],
      currentTurnNumber: 0,
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
    addBrainstormItem,
    skipBrainstorm,
    completeBrainstorm,
    startRecording,
    submitAudit,
    showAIResponse,
    continueConversation,
    submitContinuation,
    nextScenario,
    retryScenario,
    endSession,
  };
}
