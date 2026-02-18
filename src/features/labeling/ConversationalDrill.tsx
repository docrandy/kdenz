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
import { generateCharacterResponse } from "../../services/characterResponseService";
import {
  generateSessionDebrief,
  type SessionDebrief,
} from "../../services/debriefService";
import { DebriefCardStack } from "../debrief";
import { getAspiration } from "../../utils/aspirationStorage";
import { getLearnerProfile } from "../../utils/learnerProfileStorage";
import { getTopContent } from "../../services/contentRoutingService";

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
  const [sessionActive, setSessionActive] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const recordStartRef = useRef<number>(0);

  // Refs that mirror state — needed for stale-closure-safe timer callbacks
  const liveTranscriptRef = useRef("");
  const isRecordingRef = useRef(false);
  const sessionActiveRef = useRef(false);

  // Tracks the Web Speech API result index so continuous mode can reset per utterance
  const resultOffsetRef = useRef(0);
  const latestResultCountRef = useRef(0);

  // -- Character response typing indicator -----------------------------------
  const [characterTyping, setCharacterTyping] = useState(false);

  // Silence detection threshold: ms of quiet before auto-submit (0 = manual only)
  const THRESHOLD_OPTIONS = [0, 1000, 1500, 2000, 3000] as const;
  const THRESHOLD_LABELS: Record<number, string> = {
    0: "Manual",
    1000: "1s",
    1500: "1.5s",
    2000: "2s",
    3000: "3s",
  };
  const [silenceThresholdMs, setSilenceThresholdMs] = useState<number>(1500);

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

  // -- Debrief state (Phase 20.1 Plan 04) -----------------------------------
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefData, setDebriefData] = useState<SessionDebrief | null>(null);
  const [debriefLoading, setDebriefLoading] = useState(false);

  // Mirror patternData into a ref so handleSessionEnd always reads the latest value
  // (avoids stale closure issue when patternData is updated just before session ends)
  const patternDataRef = useRef<SessionPatternData>({
    exchangeSignals: [],
    regexSignals: [],
    sessionPattern: null,
    patternConfidence: 0,
  });

  // Ref that always points to latest submitLabel — used by silence timer to avoid stale closure
  const submitLabelRef = useRef<
    (text: string, silenceDuration?: number) => void
  >(() => {});

  // Sync silence threshold to recognition object whenever it changes
  useEffect(() => {
    if (recognitionRef.current) {
      (recognitionRef.current as any).__silenceThreshold = silenceThresholdMs;
    }
  }, [silenceThresholdMs]);

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
        latestResultCountRef.current = event.results.length;
        let interim = "";
        let final = "";
        // Only read results since the last utterance was submitted
        for (let i = resultOffsetRef.current; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript;
          } else {
            interim += result[0].transcript;
          }
        }
        const text = final + interim;
        liveTranscriptRef.current = text;
        setLiveTranscript(text);

        // Reset silence timer on every speech event
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        const threshold =
          (recognitionRef.current as any).__silenceThreshold ?? 1500;
        if (threshold > 0 && isRecordingRef.current && text.trim()) {
          silenceTimerRef.current = window.setTimeout(() => {
            if (!isRecordingRef.current) return;
            const transcript = liveTranscriptRef.current.trim();
            if (!transcript) return;
            // Advance offset so next utterance starts fresh
            resultOffsetRef.current = latestResultCountRef.current;
            liveTranscriptRef.current = "";
            setLiveTranscript("");
            const elapsed = (Date.now() - recordStartRef.current) / 1000;
            recordStartRef.current = Date.now(); // reset for next utterance
            submitLabelRef.current(
              transcript,
              elapsed > 3 ? elapsed : undefined,
            );
            // Recognition keeps running — session stays active
          }, threshold);
        }
      };

      recognition.onerror = (event: any) => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        isRecordingRef.current = false;
        setIsRecording(false);
        // Kill session on hard errors; let no-speech restart via onend
        if (event.error !== "no-speech" && event.error !== "aborted") {
          sessionActiveRef.current = false;
          setSessionActive(false);
        }
      };

      recognition.onend = () => {
        isRecordingRef.current = false;
        setIsRecording(false);
        // Auto-restart if session is still active (continuous mode)
        if (sessionActiveRef.current) {
          setTimeout(() => {
            if (!sessionActiveRef.current) return;
            try {
              recognitionRef.current?.start();
              isRecordingRef.current = true;
              setIsRecording(true);
              // Reset offset for fresh start
              resultOffsetRef.current = 0;
              latestResultCountRef.current = 0;
            } catch {
              /* already running */
            }
          }, 150);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      sessionActiveRef.current = false;
      recognitionRef.current?.abort();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // -- Start session (continuous mic) ----------------------------------------
  const startSession = useCallback(() => {
    if (!recognitionRef.current) return;
    sessionActiveRef.current = true;
    setSessionActive(true);
    liveTranscriptRef.current = "";
    setLiveTranscript("");
    resultOffsetRef.current = 0;
    latestResultCountRef.current = 0;
    recordStartRef.current = Date.now();
    try {
      recognitionRef.current.start();
      isRecordingRef.current = true;
      setIsRecording(true);
    } catch {
      /* already running */
    }
  }, []);

  // -- Stop session (manual stop) --------------------------------------------
  const stopSession = useCallback(() => {
    sessionActiveRef.current = false;
    setSessionActive(false);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    isRecordingRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* already stopped */
    }
    setIsRecording(false);
    // Submit any pending transcript
    const text = liveTranscriptRef.current.trim();
    liveTranscriptRef.current = "";
    setLiveTranscript("");
    if (text) {
      const elapsed = (Date.now() - recordStartRef.current) / 1000;
      submitLabelRef.current(text, elapsed > 3 ? elapsed : undefined);
    }
  }, []);

  // -- Submit label (text or audio) ------------------------------------------
  const submitLabel = useCallback(
    (text: string, silenceDuration?: number) => {
      if (
        !text.trim() ||
        exchangeCountRef.current >= MAX_EXCHANGES ||
        characterTyping
      )
        return;

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
          setPatternData((prev) => {
            const updated = updateSessionPatterns(prev, patternResult);
            patternDataRef.current = updated;
            return updated;
          });
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

      setMessages((prev) => [...prev, userMsg]);
      setInputText("");

      // Pause silence timer while character is "typing"
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      setCharacterTyping(true);

      const charHistory = messages.map((m) => ({
        role: m.role as "user" | "character",
        text: m.text,
      }));

      generateCharacterResponse(
        scenario,
        charHistory,
        text,
        analysis,
        extendedStateRef.current,
        getStoredApiKey(),
      ).then((reaction) => {
        const charMsg: ChatMessage = {
          id: `char-${exchangeCountRef.current}`,
          role: "character",
          text: reaction,
        };
        setMessages((prev) => [...prev, charMsg]);
        setCharacterTyping(false);

        // Check if session should end
        if (exchangeCountRef.current >= MAX_EXCHANGES) {
          setTimeout(() => {
            handleSessionEnd(patternDataRef.current);
          }, 1500);
        }
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenario, messages, characterTyping],
  );

  // Keep ref in sync so silence timer always calls the latest version
  submitLabelRef.current = submitLabel;

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

  // -- Session end: generate debrief then show DebriefCardStack ------------
  const handleSessionEnd = useCallback(
    async (finalPatternData: SessionPatternData) => {
      setDebriefLoading(true);

      const profile = getLearnerProfile();
      const subtext = {
        underlyingFear: scenario.underlyingDriver,
        surfaceEmotion: scenario.surfaceEmotion,
        characterName: scenario.characterName,
        expertLabel: scenario.expertLabel,
      };

      const scenarioContext = `${scenario.context || "A communication practice scenario"}`;

      const debrief = await generateSessionDebrief(
        messages.map((m) => ({
          role: m.role as "user" | "character",
          text: m.text,
        })),
        finalPatternData.exchangeSignals.map((s) => s.patternNote),
        finalPatternData,
        subtext,
        getAspiration(),
        getTopContent(profile, 5, true),
        profile.pattern_history,
        getStoredApiKey(),
        scenarioContext,
      );

      setDebriefData(debrief);
      setDebriefLoading(false);
      setShowDebrief(true);
    },
    [scenario, messages],
  );

  // -- Done button -----------------------------------------------------------
  const handleFinish = useCallback(() => {
    handleSessionEnd(patternDataRef.current);
  }, [handleSessionEnd]);

  // -- Render ----------------------------------------------------------------
  const initial = scenario.characterName.charAt(0).toUpperCase();

  // Debrief loading state — shown while Gemini generates the debrief
  if (debriefLoading) {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <p className="text-text-subtle text-sm animate-pulse">
          Generating your debrief...
        </p>
      </div>
    );
  }

  // Debrief ready — show 5-card stack instead of drill UI
  if (showDebrief && debriefData) {
    return (
      <DebriefCardStack
        debrief={debriefData}
        onComplete={() => {
          statsRef.current.sessionPatternData = patternDataRef.current;
          onComplete(statsRef.current);
        }}
        onNextStep={(_type, _id) => {
          // Navigate to recommended content — for now complete and let parent handle
          // Future: navigate to /practice/drill/:id or /institute/:id
          statsRef.current.sessionPatternData = patternDataRef.current;
          onComplete(statsRef.current);
        }}
      />
    );
  }

  // Determine if Panel B should show (after first exchange has been attempted)
  const showPanelB =
    exchangeCountRef.current > 0 ||
    patternDetectionPending ||
    currentPatternSignal !== null;

  return (
    <div
      className="max-w-2xl mx-auto flex flex-col overflow-hidden"
      style={{ height: "calc(100dvh - 90px)" }}
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
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pb-4">
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
        {/* Character typing indicator */}
        {characterTyping && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
              {initial}
            </div>
            <div className="bg-background-elevated border-l-4 border-accent rounded-xl rounded-tl-none px-4 py-3">
              <span className="inline-flex gap-1 items-center">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-text-subtle/40 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-text-subtle/40 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-text-subtle/40 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-background-elevated pt-3 pb-2">
        {/* Show live transcript when session active */}
        {sessionActive && liveTranscript && (
          <div className="text-xs text-text-subtle italic mb-2 px-1">
            {liveTranscript}
          </div>
        )}

        {/* Session active hint */}
        {sessionActive && !liveTranscript && !characterTyping && (
          <div className="text-xs text-text-subtle/40 italic mb-2 px-1">
            Listening…
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
          {textInputDisabled && !sessionActive && (
            <div className="flex-1 bg-background-surface border border-background-elevated rounded-lg px-3 py-2 text-sm text-text-subtle italic">
              Tap the mic to start…
            </div>
          )}

          {textInputDisabled && sessionActive && (
            <div className="flex-1 bg-background-surface border border-accent/30 rounded-lg px-3 py-2 text-sm text-text italic">
              {liveTranscript || "Listening…"}
            </div>
          )}

          {/* Mic button — toggles entire listening session */}
          <button
            onClick={sessionActive ? stopSession : startSession}
            className={[
              "w-10 h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
              sessionActive
                ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                : "bg-accent/20 text-accent border border-accent/40 hover:bg-accent/30",
            ].join(" ")}
            aria-label={sessionActive ? "Stop listening" : "Start listening"}
          >
            {sessionActive ? (
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

        {/* Silence threshold selector */}
        <div className="flex items-center gap-1.5 mt-2 px-1">
          <span className="text-xs text-text-subtle/50">Auto-submit:</span>
          {THRESHOLD_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSilenceThresholdMs(opt)}
              className={[
                "px-2 py-0.5 rounded text-xs transition-colors",
                silenceThresholdMs === opt
                  ? "bg-accent/20 text-accent border border-accent/30"
                  : "text-text-subtle/50 hover:text-text-subtle",
              ].join(" ")}
            >
              {THRESHOLD_LABELS[opt]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
