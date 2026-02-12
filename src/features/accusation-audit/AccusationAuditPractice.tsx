/**
 * AccusationAuditPractice - Main Container Component
 * Interactive practice module for accusation audit technique
 */

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuditSession } from "./useAuditSession";
import { AuditScenarioPresenter } from "./AuditScenarioPresenter";
import { CriticismBrainstorm } from "./CriticismBrainstorm";
import { AuditFeedback } from "./AuditFeedback";
import { AuditPatternSummary } from "./AuditPatternSummary";
import { QuickNoteBox } from "../../components/QuickNoteBox";
import type { ScenarioCategory, DifficultyLevel } from "./types";

interface AccusationAuditPracticeProps {
  onBack: () => void;
}

export function AccusationAuditPractice({
  onBack,
}: AccusationAuditPracticeProps) {
  const {
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
  } = useAuditSession();

  // Recording state
  const [, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Initialize speech recognition
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
          setTranscript((prev) => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        stopRecording();
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Start recording
  const handleStartRecording = async () => {
    setTranscript("");
    setIsRecording(true);
    audioChunksRef.current = [];

    // Start speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }

    // Start audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Failed to start audio recording:", error);
    }

    startRecording();
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);

    // Stop speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Stop audio recording
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // Submit the audit after recording stops
  const handleSubmit = () => {
    if (!transcript.trim()) {
      alert("No speech detected. Please try again.");
      return;
    }

    const audioBlob =
      audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: "audio/webm" })
        : undefined;

    submitAudit(transcript.trim(), audioBlob);
  };

  // Submit continuation in multi-turn conversation
  const handleSubmitContinuation = () => {
    if (!transcript.trim()) {
      alert("No speech detected. Please try again.");
      return;
    }

    const audioBlob =
      audioChunksRef.current.length > 0
        ? new Blob(audioChunksRef.current, { type: "audio/webm" })
        : undefined;

    submitContinuation(transcript.trim(), audioBlob);
  };

  // Start recording for continuation
  const handleStartContinuation = async () => {
    setTranscript("");
    setIsRecording(true);
    audioChunksRef.current = [];

    // Start speech recognition
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }

    // Start audio recording
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error("Failed to start audio recording:", error);
    }

    continueConversation();
  };

  // URL params for pre-selection from Dashboard
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") as ScenarioCategory | null;
  const urlDifficulty = searchParams.get(
    "difficulty",
  ) as DifficultyLevel | null;

  // Category and difficulty selection (initialized from URL params if present)
  const [selectedCategory, setSelectedCategory] = useState<
    ScenarioCategory | ""
  >(urlCategory || "");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    DifficultyLevel | ""
  >(urlDifficulty || "");

  const handleSelectScenario = () => {
    selectScenario(
      undefined,
      selectedCategory || undefined,
      selectedDifficulty || undefined,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background-surface border-b border-background-elevated sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-text-muted hover:text-text flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-semibold text-text">Accusation Audit</h1>
          <button
            onClick={endSession}
            className="text-accent hover:text-accent/80 font-medium"
          >
            Summary
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* SELECTING STATE */}
        {sessionData.state === "selecting" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-text mb-2">
                Practice Accusation Audits
              </h2>
              <p className="text-text-muted">
                Pre-emptively name every negative thing they might think about
                you.
              </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value as ScenarioCategory)
                  }
                  className="w-full p-3 border border-background-elevated rounded-xl bg-background-elevated text-text"
                >
                  <option value="">Any</option>
                  <option value="salary-negotiation">Salary Negotiation</option>
                  <option value="saying-no">Saying No</option>
                  <option value="difficult-conversation">
                    Difficult Conversation
                  </option>
                  <option value="workplace">Workplace</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) =>
                    setSelectedDifficulty(e.target.value as DifficultyLevel)
                  }
                  className="w-full p-3 border border-background-elevated rounded-xl bg-background-elevated text-text"
                >
                  <option value="">Any</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={handleSelectScenario}
              className="btn-primary w-full"
            >
              Start Practice
            </button>

            {/* Quick info */}
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
              <h3 className="font-semibold text-accent mb-2">
                💡 What is an Accusation Audit?
              </h3>
              <p className="text-text-muted text-sm mb-3">
                Before a difficult conversation, you pre-emptively name every
                negative assumption the other person might have about you.
              </p>
              <p className="text-text-subtle text-sm">
                <strong>Example:</strong> "I know this might seem like I'm
                ungrateful, only motivated by money, and not thinking about the
                team. I get why that would be concerning."
              </p>
            </div>

            {/* Key difference from labeling */}
            <div className="bg-background-elevated rounded-xl p-4">
              <h3 className="font-semibold text-text-muted mb-2">
                vs Labeling
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-background-elevated">
                    <td className="py-2 text-text-subtle">Timing</td>
                    <td className="py-2 text-text">
                      <strong>Start</strong> of conversation
                    </td>
                  </tr>
                  <tr className="border-b border-background-elevated">
                    <td className="py-2 text-text-subtle">Focus</td>
                    <td className="py-2 text-text">
                      Their <strong>thoughts about you</strong>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 text-text-subtle">Success</td>
                    <td className="py-2 text-text">
                      They say <strong>"Actually..."</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BRAINSTORMING STATE (before scenario details) */}
        {sessionData.state === "brainstorming" &&
          sessionData.currentScenario && (
            <CriticismBrainstorm
              scenario={sessionData.currentScenario}
              brainstormed={sessionData.brainstormedCriticisms}
              onAdd={addBrainstormItem}
              onDone={completeBrainstorm}
              onSkip={skipBrainstorm}
            />
          )}

        {/* PRESENTING STATE */}
        {sessionData.state === "presenting" && sessionData.currentScenario && (
          <AuditScenarioPresenter
            scenario={sessionData.currentScenario}
            onStart={handleStartRecording}
          />
        )}

        {/* RECORDING STATE */}
        {sessionData.state === "recording" && (
          <div className="space-y-6 text-center">
            <div className="py-12">
              <div className="w-24 h-24 mx-auto bg-status-error/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-4xl">🎤</span>
              </div>
              <p className="text-xl font-semibold text-text mt-4">
                Recording...
              </p>
              <p className="text-text-muted mt-2">Respond</p>
            </div>

            {/* Reminder */}
            <div className="bg-background-elevated rounded-xl p-4 text-left text-sm text-text-muted">
              <strong>Structure:</strong> "I know this might seem like
              [concern], [concern], [concern]. I get why that would be
              concerning."
            </div>

            {/* Live transcript */}
            {transcript && (
              <div className="bg-background-elevated rounded-xl p-4 text-left">
                <p className="text-text-subtle text-sm mb-1">Hearing:</p>
                <p className="text-text italic">"{transcript}"</p>
              </div>
            )}

            <button
              onClick={() => {
                stopRecording();
                // Small delay to ensure transcript is complete
                setTimeout(handleSubmit, 500);
              }}
              className="w-full py-4 bg-status-error text-text-inverse font-semibold rounded-xl hover:bg-status-error/90 transition-colors"
            >
              Stop & Analyze
            </button>
          </div>
        )}

        {/* CONTINUING STATE (multi-turn) */}
        {sessionData.state === "continuing" && (
          <div className="space-y-6">
            {/* Conversation history */}
            <div className="space-y-3">
              {sessionData.conversationTurns.map((turn) => (
                <div
                  key={turn.id}
                  className={`p-4 rounded-xl ${
                    turn.role === "user"
                      ? "bg-background-elevated ml-8"
                      : "bg-accent/10 mr-8 border-l-4 border-accent"
                  }`}
                >
                  <p className="text-xs text-text-subtle mb-1">
                    {turn.role === "user" ? "You" : "Them"}
                  </p>
                  <p className="text-text italic">"{turn.transcript}"</p>
                </div>
              ))}
            </div>

            {/* Recording UI */}
            <div className="text-center py-8">
              <div className="w-20 h-20 mx-auto bg-status-error/10 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-3xl">🎤</span>
              </div>
              <p className="text-lg font-semibold text-text mt-4">
                Recording...
              </p>
              <p className="text-text-muted mt-1">Continue the conversation</p>
            </div>

            {/* Live transcript */}
            {transcript && (
              <div className="bg-background-elevated rounded-xl p-4">
                <p className="text-text-subtle text-sm mb-1">Hearing:</p>
                <p className="text-text italic">"{transcript}"</p>
              </div>
            )}

            <button
              onClick={() => {
                stopRecording();
                setTimeout(handleSubmitContinuation, 500);
              }}
              className="w-full py-4 bg-status-error text-text-inverse font-semibold rounded-xl hover:bg-status-error/90 transition-colors"
            >
              Stop & Analyze
            </button>
          </div>
        )}

        {/* ANALYZING STATE */}
        {sessionData.state === "analyzing" && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-xl font-semibold text-text mt-4">Analyzing...</p>
          </div>
        )}

        {/* FEEDBACK STATE */}
        {sessionData.state === "feedback" &&
          currentAttempt &&
          sessionData.currentScenario && (
            <AuditFeedback
              attempt={currentAttempt}
              scenario={sessionData.currentScenario}
              onSeeResponse={showAIResponse}
              onRetry={retryScenario}
            />
          )}

        {/* RESPONDING STATE */}
        {sessionData.state === "responding" && aiResponse && (
          <div className="space-y-6">
            {/* Conversation history (if multi-turn) */}
            {sessionData.conversationTurns.length > 2 && (
              <div className="space-y-3">
                {sessionData.conversationTurns.slice(0, -1).map((turn) => (
                  <div
                    key={turn.id}
                    className={`p-3 rounded-xl text-sm ${
                      turn.role === "user"
                        ? "bg-background-elevated ml-8"
                        : "bg-accent/10 mr-8"
                    }`}
                  >
                    <p className="text-text italic">"{turn.transcript}"</p>
                  </div>
                ))}
              </div>
            )}

            {/* Latest AI response */}
            <div className="bg-background-surface border-l-4 border-accent p-6 rounded-r-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">💬</span>
                </div>
                <div>
                  <p className="text-text-subtle text-sm mb-2">They respond:</p>
                  <p className="text-xl text-text italic">
                    "{aiResponse.text}"
                  </p>
                </div>
              </div>
            </div>

            {/* Response quality indicator - no yellow */}
            <div
              className={`p-4 rounded-xl text-center ${
                aiResponse.type === "opens"
                  ? "bg-status-success/10 text-status-success"
                  : aiResponse.type === "partial"
                    ? "bg-background-elevated text-text-muted"
                    : "bg-background-elevated text-text-subtle"
              }`}
            >
              {aiResponse.type === "opens" && (
                <p>
                  ✨ <strong>They revealed their real concern!</strong> Your
                  audit worked.
                </p>
              )}
              {aiResponse.type === "partial" && (
                <p>{aiResponse.interpretation}</p>
              )}
              {aiResponse.type === "guarded" && (
                <p>{aiResponse.interpretation}</p>
              )}
            </div>

            {/* Actions - now includes Continue Conversation */}
            <div className="space-y-3">
              {/* Primary action: Continue the conversation */}
              <button
                onClick={handleStartContinuation}
                className="btn-primary w-full"
              >
                Continue Conversation
              </button>

              {/* Secondary actions */}
              <div className="flex gap-3">
                <button
                  onClick={retryScenario}
                  className="btn-secondary flex-1"
                >
                  Start Over
                </button>
                <button
                  onClick={nextScenario}
                  className="btn-secondary flex-1"
                >
                  Next Scenario
                </button>
              </div>

              {/* Turn count indicator */}
              <p className="text-center text-sm text-text-subtle">
                Turn {Math.floor(sessionData.currentTurnNumber / 2) + 1}
              </p>
            </div>
          </div>
        )}

        {/* SUMMARY STATE */}
        {sessionData.state === "summary" && (
          <AuditPatternSummary onClose={nextScenario} />
        )}
      </div>

      {/* Quick Note Box - visible during practice, not during summary */}
      {sessionData.state !== "summary" && (
        <QuickNoteBox practiceContext="accusation audits" />
      )}
    </div>
  );
}
