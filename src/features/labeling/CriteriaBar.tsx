/**
 * CriteriaBar
 *
 * Compact horizontal pill row showing label quality criteria in real-time.
 * Lives above the conversation/drill area. Each criterion lights up when met.
 * Each pill is clickable and navigates to the corresponding Institute lesson.
 *
 * Usage (flashcard mode — no silence criterion):
 *   <CriteriaBar
 *     mode="flashcard"
 *     syntax={{ hit: true }}
 *     emotion={{ hit: true, label: "frustrated" }}
 *     depth={{ level: "underlying" }}
 *     expertExample="It seems like you're worried this decision will set a bad precedent."
 *   />
 *
 * Usage (conversational mode — silence criterion visible):
 *   <CriteriaBar
 *     mode="conversational"
 *     syntax={{ hit: false, details: "Missing opener" }}
 *     emotion={{ hit: true, label: "anxious" }}
 *     depth={{ level: "surface" }}
 *     silence={{ hit: true, duration: 4.2 }}
 *   />
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface CriteriaBarProps {
  syntax: { hit: boolean; details?: string };
  emotion: { hit: boolean; label?: string };
  depth: { level: "none" | "surface" | "underlying" | "identity" };
  /** Undefined = hidden entirely (flashcard/text mode has no silence criterion) */
  silence?: { hit: boolean; duration?: number };
  /** When provided, renders the "See expert example" toggle link */
  expertExample?: string;
  /** Controls which criteria are shown */
  mode: "flashcard" | "conversational";
}

// ---------------------------------------------------------------------------
// Pill style helpers
// ---------------------------------------------------------------------------

/** Lit (criterion met) */
const LIT =
  "bg-status-success/20 text-status-success border border-status-success/40";

/** Dim (criterion not met) */
const DIM = "bg-background-elevated text-text-subtle border border-transparent";

/** Depth: surface (partial credit) */
const SURFACE = "bg-amber-500/10 text-amber-400 border border-amber-500/30";

/** Depth: identity (gold accent, highest level) */
const IDENTITY = "bg-accent/20 text-accent border border-accent/40";

// ---------------------------------------------------------------------------
// Sub-component: individual criterion pill
// ---------------------------------------------------------------------------

interface PillProps {
  label: string;
  styleClass: string;
  onClick: () => void;
  /** Screen-reader description of the criterion state */
  ariaLabel: string;
}

function CriterionPill({ label, styleClass, onClick, ariaLabel }: PillProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer",
        "transition-colors hover:underline focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "focus-visible:ring-offset-background",
        styleClass,
      ].join(" ")}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CriteriaBar
// ---------------------------------------------------------------------------

export function CriteriaBar({
  syntax,
  emotion,
  depth,
  silence,
  expertExample,
  mode,
}: CriteriaBarProps) {
  const navigate = useNavigate();
  const [exampleOpen, setExampleOpen] = useState(false);

  // ---- Depth pill config ---------------------------------------------------

  const depthConfig: Record<
    "none" | "surface" | "underlying" | "identity",
    { label: string; styleClass: string; ariaState: string }
  > = {
    none: {
      label: "Depth",
      styleClass: DIM,
      ariaState: "no depth detected",
    },
    surface: {
      label: "Surface",
      styleClass: SURFACE,
      ariaState: "surface emotion named",
    },
    underlying: {
      label: "Underlying",
      styleClass: LIT,
      ariaState: "underlying driver named",
    },
    identity: {
      label: "Identity",
      styleClass: IDENTITY,
      ariaState: "identity-level driver named",
    },
  };

  const depthPill = depthConfig[depth.level];

  // ---- Silence pill (audio mode only) -------------------------------------

  // `silence === undefined` means hidden (flashcard / text mode)
  const showSilence = mode === "conversational" && silence !== undefined;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="space-y-2">
      {/* Pill row */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Label quality criteria"
      >
        {/* 1. Syntax */}
        <CriterionPill
          label={syntax.hit ? "Syntax \u2713" : "Syntax"}
          styleClass={syntax.hit ? LIT : DIM}
          onClick={() => navigate("/institute/labeling/syntax")}
          ariaLabel={`Syntax criterion: ${syntax.hit ? "met" : (syntax.details ?? "not met")}. Tap to learn more.`}
        />

        {/* 2. Emotion */}
        <CriterionPill
          label={emotion.hit && emotion.label ? `Emotion \u2713` : "Emotion"}
          styleClass={emotion.hit ? LIT : DIM}
          onClick={() => navigate("/institute/labeling/emotion")}
          ariaLabel={`Emotion criterion: ${emotion.hit ? `named ${emotion.label ?? "an emotion"}` : "no emotion named"}. Tap to learn more.`}
        />

        {/* 3. Depth */}
        <CriterionPill
          label={depthPill.label}
          styleClass={depthPill.styleClass}
          onClick={() => navigate("/institute/labeling/depth")}
          ariaLabel={`Depth criterion: ${depthPill.ariaState}. Tap to learn more.`}
        />

        {/* 4. Silence (hidden in flashcard / text mode) */}
        {showSilence && (
          <CriterionPill
            label={silence!.hit ? "Silence \u2713" : "Silence"}
            styleClass={silence!.hit ? LIT : DIM}
            onClick={() => navigate("/institute/labeling/silence")}
            ariaLabel={`Silence criterion: ${
              silence!.hit
                ? `held ${silence!.duration !== undefined ? `${silence!.duration.toFixed(1)}s` : "3+ seconds"}`
                : "did not hold silence after label"
            }. Tap to learn more.`}
          />
        )}
      </div>

      {/* Expert example toggle */}
      {expertExample && (
        <div>
          <button
            onClick={() => setExampleOpen((prev) => !prev)}
            aria-expanded={exampleOpen}
            aria-controls="criteria-bar-expert-example"
            className="text-xs text-text-subtle hover:text-text transition-colors"
          >
            See expert example {exampleOpen ? "\u25BE" : "\u25B8"}
          </button>

          {exampleOpen && (
            <div
              id="criteria-bar-expert-example"
              className="mt-2 bg-background-elevated border border-background-elevated rounded-lg px-4 py-3"
            >
              <p className="text-xs text-text-subtle italic leading-relaxed">
                &ldquo;{expertExample}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
