/**
 * src/features/debrief/DebriefCardStack.tsx
 *
 * 5-card sequential debrief UI — the culmination of the biofeedback mirror.
 *
 * Card sequence:
 *   1. RevealCard         — "What was actually there" (receiving channel: subtext)
 *   2. SendingFeedbackCard — "What you signaled" (sending channel: pattern)
 *   3. GrowthEdgeCard     — One specific behavior for next session
 *   4. NextStepCard       — Personalized Institute content recommendation
 *   5. ProgressSignalCard — Trajectory toward/holding/away from aspiration target
 *
 * Design system: bg-background-surface rounded-xl p-6, border-l-4 variants,
 * text-accent "Next" button, text-xs text-text-subtle card indicator.
 *
 * CONSTRAINT: SendingFeedbackCard shows "you tend to X when Y" BEFORE
 * pattern name badge — framing always comes first.
 */

import { useState } from "react";
import type { SessionDebrief } from "../../services/debriefService";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DebriefCardStackProps {
  debrief: SessionDebrief;
  onComplete: () => void;
  onNextStep: (type: "drill" | "institute", id: string) => void;
}

// ---------------------------------------------------------------------------
// Card 1: ScenarioCard — "Scenario"
// ---------------------------------------------------------------------------

function ScenarioCard({ debrief }: { debrief: SessionDebrief }) {
  return (
    <div className="bg-background-surface rounded-xl p-6 border-l-4 border-amber-400 min-h-[200px]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text">Scenario</h2>
      </div>

      {/* Scenario synopsis */}
      <p className="text-base text-text leading-relaxed">
        {debrief.scenarioSynopsis}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 2: ExchangeBreakdownCard — "The exchange"
// ---------------------------------------------------------------------------

function ExchangeBreakdownCard({ debrief }: { debrief: SessionDebrief }) {
  return (
    <div className="bg-background-surface rounded-xl p-6 border-l-4 border-blue-300 min-h-[200px]">
      {/* Header */}
      <div className="mb-4">
        <p className="text-lg font-semibold text-text">The intro</p>
      </div>

      {/* What was said */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-subtle mb-1">
          They said:
        </h3>
        <p className="text-sm text-text leading-relaxed">
          {debrief.characterInitialMessage}
        </p>
      </div>

      {/* How I responded */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-text-subtle mb-1">
          You responded:
        </h3>
        <p className="text-sm text-text leading-relaxed">
          {debrief.userResponse}
        </p>
      </div>

      {/* What was good */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-emerald-400 mb-1">
          What was good:
        </h3>
        <p className="text-sm text-text leading-relaxed">
          {debrief.whatWasGood}
        </p>
      </div>

      {/* What could improve */}
      <div>
        <h3 className="text-sm font-medium text-amber-400/70 mb-1">
          What could improve:
        </h3>
        <p className="text-sm text-text leading-relaxed">
          {debrief.whatCouldImprove}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 3: RevealCard — "What was actually there"
// ---------------------------------------------------------------------------

function RevealCard({ debrief }: { debrief: SessionDebrief }) {
  return (
    <div className="bg-background-surface rounded-xl p-6 border-l-4 border-accent min-h-[200px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        {/* Eye icon — inline SVG */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent flex-shrink-0"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <div>
          <h2 className="text-sm text-text-subtle/60 font-medium uppercase tracking-wide">
            The real issue
          </h2>
          <p className="text-lg font-semibold text-text">
            What was actually there
          </p>
        </div>
      </div>

      {/* The holy shit moment — large and prominent */}
      <p className="text-base text-text leading-relaxed mb-4">
        {debrief.characterSubtext}
      </p>

      {/* Missed signal — increased visibility */}
      <p className="text-sm text-text-subtle/80 leading-relaxed">
        {debrief.missedSignal}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 2: SendingFeedbackCard — "What you signaled"
// ---------------------------------------------------------------------------

function SendingFeedbackCard({ debrief }: { debrief: SessionDebrief }) {
  const showPattern = debrief.patternConfidence >= 0.75 && debrief.patternName;

  return (
    <div className="bg-background-surface rounded-xl p-6 border-l-4 border-blue-400 min-h-[200px]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-sm text-text-subtle/60 font-medium uppercase tracking-wide">
          Your communication
        </h2>
        <p className="text-lg font-semibold text-text">What you signaled</p>
      </div>

      {/* Behavioral observations — bullet list */}
      <ul className="space-y-2 mb-4">
        {debrief.behavioralObservations.map((obs, i) => (
          <li key={i} className="flex gap-2 items-start">
            <span className="text-blue-400/60 mt-1 flex-shrink-0 text-xs">
              &bull;
            </span>
            <span className="text-sm text-text leading-relaxed">{obs}</span>
          </li>
        ))}
      </ul>

      {/* Pattern section — framing FIRST, name badge AFTER */}
      {showPattern ? (
        <div className="mt-3 pt-3 border-t border-background-elevated">
          {/* "you tend to X when Y" — framing sentence comes first */}
          <p className="text-sm text-text-subtle leading-relaxed mb-2">
            {debrief.patternFraming}
          </p>
          {/* Pattern name badge — subtle, appears AFTER framing */}
          <span className="inline-block bg-blue-900/20 text-blue-300 text-xs px-2 py-0.5 rounded-full">
            {debrief.patternName}
          </span>
        </div>
      ) : (
        <p className="text-xs text-text-subtle/70 mt-3 italic">
          {debrief.patternConfidence > 0 && debrief.patternConfidence < 0.75
            ? "Pattern emerging — keep practicing to confirm."
            : "Complete more exchanges to identify your pattern."}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 4: NextStepCard — "Recommended for you"
// ---------------------------------------------------------------------------

function NextStepCard({
  debrief,
  onNextStep,
}: {
  debrief: SessionDebrief;
  onNextStep: (type: "drill" | "institute", id: string) => void;
}) {
  const navigate = useNavigate();
  const hasContent = debrief.nextStepId && debrief.nextStepId.length > 0;

  const contentTypeLabel =
    debrief.nextStepType === "institute" ? "Institute" : "Drill";

  return (
    <div className="bg-background-surface rounded-xl p-6 border-l-4 border-accent min-h-[200px]">
      {/* Header */}
      <h2 className="text-lg font-semibold text-text mb-4">
        Recommended for you
      </h2>

      {hasContent ? (
        <>
          {/* Content type badge */}
          <span className="inline-block bg-background-elevated text-text-subtle text-xs px-2 py-0.5 rounded-full mb-3">
            {contentTypeLabel}
          </span>

          {/* Title */}
          <p className="text-base font-medium text-text mb-2">
            {debrief.nextStepTitle}
          </p>

          {/* Personalization — "why this for you" */}
          <p className="text-sm text-text-subtle mb-4 leading-relaxed">
            {debrief.nextStepPersonalization}
          </p>

          {/* Primary CTA */}
          <button
            onClick={() => onNextStep(debrief.nextStepType, debrief.nextStepId)}
            className="w-full bg-accent text-background font-medium py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            Start
          </button>

          {/* Secondary link */}
          <button
            onClick={() => navigate("/institute")}
            className="text-xs text-text-subtle hover:text-text mt-2 block text-center w-full transition-colors"
          >
            See all options
          </button>
        </>
      ) : (
        /* No content — prompt to set aspiration */
        <div className="text-sm text-text-subtle leading-relaxed">
          <p className="mb-3">
            Set your communication target to get personalized recommendations.
          </p>
          <button
            onClick={() => navigate("/aspiration/setup")}
            className="text-accent text-sm hover:opacity-80 transition-opacity"
          >
            Set your target voice &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card 5: ProgressSignalCard — "Where you're heading"
// ---------------------------------------------------------------------------

function ProgressSignalCard({ debrief }: { debrief: SessionDebrief }) {
  const navigate = useNavigate();
  const isFirstSession = debrief.sessionNumber < 2;

  const trajectoryConfig = {
    toward_target: {
      arrow: "\u2191", // ↑
      label: "Moving toward your target",
      color: "text-emerald-400",
    },
    holding: {
      arrow: "\u2192", // →
      label: "Holding steady",
      color: "text-amber-400",
    },
    away_from_target: {
      arrow: "\u2193", // ↓
      label: "Drifting from target",
      color: "text-red-400/70",
    },
  };

  const config = trajectoryConfig[debrief.trajectoryDirection];

  return (
    <div className="bg-background-surface rounded-xl p-6 border border-background-elevated min-h-[200px]">
      {/* Header */}
      <h2 className="text-lg font-semibold text-text mb-4">
        Where you&apos;re heading
      </h2>

      {isFirstSession ? (
        /* First session — show baseline message */
        <div>
          <p className="text-sm text-text leading-relaxed">
            Building your baseline. Check back after 2+ sessions to see your
            trajectory.
          </p>
          <button
            onClick={() => navigate("/aspiration/setup")}
            className="text-accent text-sm hover:opacity-80 transition-opacity mt-3 block"
          >
            Set your target voice &rarr;
          </button>
        </div>
      ) : (
        /* 2+ sessions — show trajectory */
        <div>
          {/* Trajectory indicator */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xl font-bold ${config.color}`}>
              {config.arrow}
            </span>
            <span className={`text-sm font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>

          {/* Trajectory note */}
          <p className="text-sm text-text-subtle leading-relaxed">
            {debrief.trajectoryNote}
          </p>
        </div>
      )}

      {/* Session count — very subtle */}
      <p className="text-xs text-text-subtle/50 mt-4">
        Session {debrief.sessionNumber}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DebriefCardStack — main component
// ---------------------------------------------------------------------------

const CARDS = [
  "scenario",
  "exchange",
  "reveal",
  "sending",
  "nextstep",
  "progress",
] as const;

const TOTAL_CARDS = CARDS.length;

export function DebriefCardStack({
  debrief,
  onComplete,
  onNextStep,
}: DebriefCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    if (currentIndex < TOTAL_CARDS - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const isLastCard = currentIndex === TOTAL_CARDS - 1;
  const cardKey = CARDS[currentIndex];

  return (
    <div className="max-w-lg mx-auto py-4">
      {/* Page-level title — context for entire debrief sequence */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-text">Session Review</h1>
      </div>

      {/* Card content with navigation arrows */}
      <div key={cardKey} className="animate-fade-in relative">
        {cardKey === "scenario" && <ScenarioCard debrief={debrief} />}
        {cardKey === "exchange" && <ExchangeBreakdownCard debrief={debrief} />}
        {cardKey === "reveal" && <RevealCard debrief={debrief} />}
        {cardKey === "sending" && <SendingFeedbackCard debrief={debrief} />}
        {cardKey === "nextstep" && (
          <NextStepCard debrief={debrief} onNextStep={onNextStep} />
        )}
        {cardKey === "progress" && <ProgressSignalCard debrief={debrief} />}

        {/* Left arrow button — only show if not on first card */}
        {currentIndex > 0 && (
          <button
            onClick={goBack}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80 transition-colors p-1"
            aria-label="Previous card"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Right arrow button — only show if not on last card */}
        {!isLastCard && (
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80 transition-colors p-1"
            aria-label="Next card"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        )}

        {/* Card counter at bottom right of card */}
        <div className="absolute bottom-3 right-3 text-xs text-text-subtle/60">
          {currentIndex + 1} of {TOTAL_CARDS}
        </div>

        {/* Done button for last card */}
        {isLastCard && (
          <button
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-accent hover:text-accent/80 transition-colors"
            aria-label="Done"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
