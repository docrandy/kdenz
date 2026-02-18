/**
 * ConversationalDrill — Level 2+ chat-style labeling drill
 *
 * Chat UI where:
 *   1. Character's statement appears as left-aligned bubble
 *   2. User responds via text (L2) or audio (L2+L3)
 *   3. labelAnalyzer scores the response
 *   4. CriteriaBar updates inline
 *   5. Character reacts based on label quality
 *   6. Up to 10 exchanges per session
 *
 * Phase 20.1 additions:
 *   - ExtendedStateObject tracks mood, trust, openness, revelations across session
 *   - Gemini Call 2 fires per exchange for pattern detection (sending channel)
 *   - Panel B ("What you signaled") shows real behavioral observations
 *   - Regex signals appear immediately; Gemini signals appear after ~1s
 *   - SessionPatternData passed to onComplete for debrief consumption
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { CriteriaBar } from "./CriteriaBar";
import { analyzeLabel } from "./labelAnalyzer";
import type { LabelingScenario, DrillStats, LabelAnalysis } from "./types";
import type {
  ExtendedStateObject,
  SessionPatternData,
  PatternSignal,
} from "../../types/simulation";
import {
  createInitialStateObject,
  COMMUNICATOR_PATTERNS,
} from "../../types/simulation";
import {
  detectPatternSignals,
  updateSessionPatterns,
} from "../../services/patternDetectionService";
import { getStoredApiKey } from "../../services/geminiService";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ConversationalDrillProps {
  scenario: LabelingScenario;
  level: number; // 2 = text+audio, 3+ = audio-only
  onComplete: (stats: DrillStats) => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Chat message model
// ---------------------------------------------------------------------------

interface ChatMessage {
  id: string;
  role: "character" | "user";
  text: string;
  analysis?: LabelAnalysis;
}

// ---------------------------------------------------------------------------
// Character reaction helpers
// ---------------------------------------------------------------------------

const SURFACE_REACTIONS = [
  "Yeah... I guess so.",
  "Mm-hmm.",
  "Sure, something like that.",
  "I suppose.",
];

const BAD_REACTIONS = [
  "That's not really it.",
  "I don't think that's what I meant.",
  "Hmm, not exactly.",
  "That's... not quite right.",
];

function pickReaction(
  quality: "good" | "surface" | "bad",
  scenario: LabelingScenario,
): string {
  if (quality === "good" && scenario.counterpartResponse) {
    return scenario.counterpartResponse;
  }
  if (quality === "surface") {
    return SURFACE_REACTIONS[
      Math.floor(Math.random() * SURFACE_REACTIONS.length)
    ];
  }
  return BAD_REACTIONS[Math.floor(Math.random() * BAD_REACTIONS.length)];
}

function qualityFromAnalysis(
  analysis: LabelAnalysis,
): "good" | "surface" | "bad" {
  if (
    analysis.depth.targetsUnderlyingDriver &&
    analysis.syntax.hasCorrectOpener
  ) {
    return "good";
  }
  if (
    analysis.depth.targetsSurfaceEmotion &&
    analysis.syntax.hasCorrectOpener
  ) {
    return "surface";
  }
  return "bad";
}

// ---------------------------------------------------------------------------
// Panel B: "What you signaled" — sending channel biofeedback
// ---------------------------------------------------------------------------

interface PanelBProps {
  currentSignal: PatternSignal | null;
  patternData: SessionPatternData;
  isWaiting: boolean;
}

function PanelB({ currentSignal, patternData, isWaiting }: PanelBProps) {
  // Determine what to show
  const hasSignal = currentSignal !== null;
  const hasRegexSignals = patternData.regexSignals.length > 0;
  const sessionPattern = patternData.sessionPattern;
  const patternDef = sessionPattern
    ? COMMUNICATOR_PATTERNS[sessionPattern]
    : null;

  // Show Panel B only after first exchange
  if (!hasSignal && !hasRegexSignals && !isWaiting) {
    return null;
  }

  return (
    <div className="mb-3 bg-blue-900/10 border-l-4 border-blue-400 rounded-xl p-3">
      {/* Section label */}
      <div className="text-xs font-medium text-blue-400/70 mb-1.5 uppercase tracking-wide">
        What you signaled
      </div>

      {/* Session pattern emergence (after 3+ consistent exchanges) */}
      {patternDef && patternData.patternConfidence >= 0.75 && (
        <div className="mb-2 text-xs text-blue-300/90 font-medium">
          Pattern emerging: {patternDef.name}
        </div>
      )}

      {/* Current exchange observation */}
      {hasSignal && currentSignal.patternNote && (
        <p className="text-xs text-text-subtle leading-relaxed mb-1">
          {currentSignal.patternNote}
        </p>
      )}

      {/* Specific signal bullets */}
      {hasSignal && currentSignal.signals.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {currentSignal.signals.map((sig, i) => (
            <li
              key={i}
              className="text-xs text-text-subtle/70 flex gap-1.5 items-start"
            >
              <span className="text-blue-400/50 mt-0.5 flex-shrink-0">·</span>
              <span>{sig}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Placeholder while waiting for Gemini, show regex signals if available */}
      {!hasSignal && isWaiting && hasRegexSignals && (
        <ul className="space-y-0.5">
          {patternData.regexSignals.slice(-3).map((sig, i) => (
            <li
              key={i}
              className="text-xs text-text-subtle/70 flex gap-1.5 items-start"
            >
              <span className="text-blue-400/50 mt-0.5 flex-shrink-0">·</span>
              <span>{sig}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Placeholder when no signals yet */}
      {!hasSignal && isWaiting && !hasRegexSignals && (
        <p className="text-xs text-text-subtle/50 italic">
          Analyzing your communication patterns...
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MAX_EXCHANGES = 10;

export function ConversationalDrill({
  scenario,
  level,
  onComplete,
  onBack,
}: ConversationalDrillProps) {
  // -- Messages --------------------------------------------------------------
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "opening",
      role: "character",
      text: scenario.statement,
    },
  ]);

  // -- Input -----------------------------------------------------------------
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const recordStartRef = useRef<number>(0);

  // -- Criteria state --------------------------------------------------------
  const [latestCriteria, setLatestCriteria] = useState<{
    syntax: { hit: boolean; details?: string };
    emotion: { hit: boolean; label?: string };
    depth: { level: "none" | "surface" | "underlying" | "identity" };
    silence?: { hit: boolean; duration?: number };
  } | null>(null);

  // -- Extended state object (Phase 20.1) ------------------------------------
  // Tracked via ref (not useState) since it's written per-exchange but consumed
  // by future plans (Gemini Call 1 for character AI responses) rather than rendered.
  const extendedStateRef = useRef<ExtendedStateObject>(
    createInitialStateObject(),
  );

  // -- Pattern detection state (Phase 20.1) ----------------------------------
  const [patternData, setPatternData] = useState<SessionPatternData>({
    exchangeSignals: [],
    regexSignals: [],
    sessionPattern: null,
    patternConfidence: 0,
  });
  const [currentPatternSignal, setCurrentPatternSignal] =
    useState<PatternSignal | null>(null);
  const [patternDetectionPending, setPatternDetectionPending] = useState(false);

  // -- Stats -----------------------------------------------------------------
  const exchangeCountRef = useRef(0);
  const statsRef = useRef<DrillStats>({
    totalExchanges: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    criteriaHits: { syntax: 0, emotion: 0, underlyingDepth: 0 },
  });

  // -- Scroll ----------------------------------------------------------------
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // -- Audio only for L3+ ---------------------------------------------------
  const textInputDisabled = level >= 3;

  // -- Init speech recognition -----------------------------------------------
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        setLiveTranscript(final + interim);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.abort();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // -- Start recording -------------------------------------------------------
  const startRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    setLiveTranscript("");
    recordStartRef.current = Date.now();
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {
      // already started
    }
  }, []);

  // -- Stop recording and submit ---------------------------------------------
  const stopRecording = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // already stopped
    }
    setIsRecording(false);
    const text = liveTranscript.trim();
    if (text) {
      // Estimate silence duration: time between last speech and stop
      const elapsed = (Date.now() - recordStartRef.current) / 1000;
      submitLabel(text, elapsed > 3 ? elapsed : undefined);
    }
  }, [liveTranscript]);

  // -- Submit label (text or audio) ------------------------------------------
  const submitLabel = useCallback(
    (text: string, silenceDuration?: number) => {
      if (!text.trim() || exchangeCountRef.current >= MAX_EXCHANGES) return;

      // Score with labelAnalyzer
      const analysis = analyzeLabel(text, scenario);

      // Determine CriteriaBar state
      const depthLevel: "none" | "surface" | "underlying" | "identity" =
        analysis.depth.specificity === "highly-specific"
          ? "identity"
          : analysis.depth.targetsUnderlyingDriver
            ? "underlying"
            : analysis.depth.targetsSurfaceEmotion
              ? "surface"
              : "none";

      const criteria = {
        syntax: {
          hit: analysis.syntax.syntaxPoints >= 30,
          details: analysis.syntax.syntaxFeedback[0],
        },
        emotion: {
          hit: analysis.depth.emotionLabeled !== null,
          label: analysis.depth.emotionLabeled ?? undefined,
        },
        depth: { level: depthLevel },
        silence:
          silenceDuration !== undefined
            ? { hit: silenceDuration >= 3, duration: silenceDuration }
            : undefined,
      };
      setLatestCriteria(criteria);

      // Update stats
      const stats = statsRef.current;
      stats.totalExchanges += 1;
      if (criteria.syntax.hit) stats.criteriaHits.syntax += 1;
      if (criteria.emotion.hit) stats.criteriaHits.emotion += 1;
      if (depthLevel === "underlying" || depthLevel === "identity") {
        stats.criteriaHits.underlyingDepth += 1;
      }

      const isCorrect =
        criteria.syntax.hit &&
        (depthLevel === "underlying" || depthLevel === "identity");
      if (isCorrect) {
        stats.correctCount += 1;
        stats.consecutiveCorrect += 1;
      } else {
        stats.consecutiveCorrect = 0;
      }

      exchangeCountRef.current += 1;

      // Update extended state object based on label quality (Phase 20.1)
      // Using ref (not state) since extendedState is consumed by future Gemini Call 1
      // for character AI responses — not rendered directly in JSX.
      const prevState = extendedStateRef.current;
      const depthReached: ExtendedStateObject["last_depth_reached"] =
        depthLevel === "identity"
          ? "identity"
          : depthLevel === "underlying"
            ? "underlying"
            : depthLevel === "surface"
              ? "surface"
              : "missed";
      extendedStateRef.current = {
        ...prevState,
        last_depth_reached: depthReached,
        trust_level: isCorrect
          ? Math.min(100, prevState.trust_level + 5)
          : Math.max(0, prevState.trust_level - 2),
        openness: isCorrect
          ? Math.min(100, prevState.openness + 8)
          : prevState.openness,
        revelation_stage:
          isCorrect && prevState.openness > 60
            ? Math.min(4, prevState.revelation_stage + 1)
            : prevState.revelation_stage,
        mood:
          isCorrect && prevState.trust_level >= 80
            ? "open"
            : isCorrect && prevState.trust_level >= 60
              ? "opening"
              : prevState.mood,
      };

      // Fire Gemini Call 2 for pattern detection — fire-and-forget, non-blocking
      const apiKey = getStoredApiKey();
      const conversationHistory = messages.map((m) => ({
        role: m.role as "user" | "character",
        text: m.text,
      }));

      setPatternDetectionPending(true);
      setCurrentPatternSignal(null); // Clear previous signal while new one loads

      detectPatternSignals(text, conversationHistory, apiKey)
        .then((patternResult) => {
          setCurrentPatternSignal(patternResult);
          setPatternData((prev) => updateSessionPatterns(prev, patternResult));
        })
        .catch(() => {
          // Graceful degradation: silently swallow error, Panel B keeps last signal
        })
        .finally(() => {
          setPatternDetectionPending(false);
        });

      // Add user message
      const userMsg: ChatMessage = {
        id: `user-${exchangeCountRef.current}`,
        role: "user",
        text,
        analysis,
      };

      // Generate character reaction
      const quality = qualityFromAnalysis(analysis);
      const reaction = pickReaction(quality, scenario);
      const charMsg: ChatMessage = {
        id: `char-${exchangeCountRef.current}`,
        role: "character",
        text: reaction,
      };

      setMessages((prev) => [...prev, userMsg, charMsg]);
      setInputText("");
      setLiveTranscript("");

      // Check if session should end
      if (exchangeCountRef.current >= MAX_EXCHANGES) {
        // Include pattern data in final stats before completing
        setTimeout(() => {
          setPatternData((finalPatternData) => {
            statsRef.current.sessionPatternData = finalPatternData;
            onComplete(statsRef.current);
            return finalPatternData;
          });
        }, 1500);
      }
    },
    [scenario, onComplete, messages],
  );

  // -- Handle text submit ----------------------------------------------------
  const handleTextSubmit = useCallback(() => {
    if (inputText.trim()) {
      submitLabel(inputText.trim());
    }
  }, [inputText, submitLabel]);

  // -- Handle key press ------------------------------------------------------
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleTextSubmit();
      }
    },
    [handleTextSubmit],
  );

  // -- Done button -----------------------------------------------------------
  const handleFinish = useCallback(() => {
    statsRef.current.sessionPatternData = patternData;
    onComplete(statsRef.current);
  }, [onComplete, patternData]);

  // -- Render ----------------------------------------------------------------
  const initial = scenario.characterName.charAt(0).toUpperCase();

  // Determine if Panel B should show (after first exchange has been attempted)
  const showPanelB =
    exchangeCountRef.current > 0 ||
    patternDetectionPending ||
    currentPatternSignal !== null;

  return (
    <div
      className="max-w-2xl mx-auto flex flex-col h-full"
      style={{ minHeight: "60vh" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <button
          onClick={onBack}
          className="text-text-subtle hover:text-text text-sm transition-colors"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-subtle">
            {exchangeCountRef.current} / {MAX_EXCHANGES} exchanges
          </span>
          {exchangeCountRef.current > 0 && (
            <button
              onClick={handleFinish}
              className="text-xs text-accent hover:text-accent/80 transition-colors"
            >
              Finish
            </button>
          )}
        </div>
      </div>

      {/* CriteriaBar (sticky above chat) */}
      {latestCriteria && (
        <div className="pb-3">
          <CriteriaBar
            mode="conversational"
            syntax={latestCriteria.syntax}
            emotion={latestCriteria.emotion}
            depth={latestCriteria.depth}
            silence={latestCriteria.silence}
            expertExample={scenario.expertLabel}
          />
        </div>
      )}

      {/* Panel B: What you signaled (sending channel biofeedback) */}
      {showPanelB && (
        <PanelB
          currentSignal={currentPatternSignal}
          patternData={patternData}
          isWaiting={patternDetectionPending}
        />
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((msg) => {
          if (msg.role === "character") {
            return (
              <div key={msg.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                  {initial}
                </div>
                <div className="bg-background-elevated border-l-4 border-accent rounded-xl rounded-tl-none px-4 py-3 max-w-[80%]">
                  <p className="text-text text-sm leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          }

          // User message
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="bg-accent/10 border border-accent/20 rounded-xl rounded-tr-none px-4 py-3 max-w-[80%]">
                <p className="text-text text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-background-elevated pt-3 pb-2">
        {/* Show live transcript when recording */}
        {isRecording && liveTranscript && (
          <div className="text-xs text-text-subtle italic mb-2 px-1">
            {liveTranscript}
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Text input (hidden at L3+) */}
          {!textInputDisabled && (
            <input
              type="text"
              value={isRecording ? liveTranscript : inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your label..."
              disabled={isRecording}
              className="flex-1 bg-background-surface border border-background-elevated rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:border-accent/40"
            />
          )}

          {/* Audio-only placeholder at L3+ */}
          {textInputDisabled && !isRecording && (
            <div className="flex-1 bg-background-surface border border-background-elevated rounded-lg px-3 py-2 text-sm text-text-subtle italic">
              Tap the mic to speak your label...
            </div>
          )}

          {textInputDisabled && isRecording && (
            <div className="flex-1 bg-background-surface border border-accent/30 rounded-lg px-3 py-2 text-sm text-text italic">
              {liveTranscript || "Listening..."}
            </div>
          )}

          {/* Mic button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
              isRecording
                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                : "bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30",
            ].join(" ")}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? (
              // Stop icon
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <rect x="3" y="3" width="10" height="10" rx="1" />
              </svg>
            ) : (
              // Mic icon
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 1a2 2 0 0 0-2 2v4a2 2 0 1 0 4 0V3a2 2 0 0 0-2-2z" />
                <path d="M4 7a4 4 0 0 0 8 0h-1a3 3 0 0 1-6 0H4z" />
                <path d="M7.5 12.9V14H6v1h4v-1H8.5v-1.1a5 5 0 0 0 4.5-4.9h-1a4 4 0 0 1-8 0H3a5 5 0 0 0 4.5 4.9z" />
              </svg>
            )}
          </button>

          {/* Send button (text mode only) */}
          {!textInputDisabled && !isRecording && (
            <button
              onClick={handleTextSubmit}
              disabled={!inputText.trim()}
              className="w-10 h-10 rounded-full bg-accent/20 text-accent border border-accent/40 flex items-center justify-center transition-colors hover:bg-accent/30 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Send label"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M1 8l6-6v4h8v4H7v4L1 8z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
