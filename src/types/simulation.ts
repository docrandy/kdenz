/**
 * src/types/simulation.ts
 *
 * Simulation and pattern detection types for Phase 20.1 AI Practice Sessions.
 *
 * These types support the biofeedback mirror — making invisible communication
 * visible in both directions:
 *   - Receiving channel (Panel A): What was beneath THEIR words
 *   - Sending channel (Panel B): What YOUR communication is actually signaling
 */

// ---------------------------------------------------------------------------
// Extended State Object — richer opponent / session state
// ---------------------------------------------------------------------------

/**
 * Extended state object that tracks the character's internal state
 * and the session progression across exchanges.
 *
 * Passed each turn for opponent consistency (per R14 state object pattern).
 */
export interface ExtendedStateObject {
  /** Character's current emotional posture */
  mood: "guarded" | "neutral" | "opening" | "open" | "closed";

  /** Character's trust in the user: 0-100 */
  trust_level: number;

  /** Character's willingness to share: 0-100 */
  openness: number;

  /** Depth of the user's last label attempt */
  last_depth_reached: "missed" | "surface" | "underlying" | "identity";

  /** Things the character has revealed so far in this session */
  concessions: string[];

  /** How much of the character's story has emerged: 0-4 */
  revelation_stage: number;

  /** The technique detected in the user's last exchange, or null */
  last_tactic_detected: string | null;
}

/**
 * Creates a fresh ExtendedStateObject with default starting values.
 * Characters begin guarded with low trust and openness.
 */
export function createInitialStateObject(): ExtendedStateObject {
  return {
    mood: "guarded",
    trust_level: 30,
    openness: 20,
    last_depth_reached: "missed",
    concessions: [],
    revelation_stage: 0,
    last_tactic_detected: null,
  };
}

// ---------------------------------------------------------------------------
// Communicator Pattern taxonomy — the 8 user communication patterns
// ---------------------------------------------------------------------------

/**
 * The 8 communicator patterns identified through session behavioral analysis.
 * These are user-facing pattern names — users CAN see them (self-identification).
 *
 * Internal VCM gate labels are never shown. Pattern names are useful for
 * self-identification: users can name, own, and build a plan around them.
 */
export type PatternType =
  | "surface-reader"
  | "hedger"
  | "fixer"
  | "diplomat"
  | "intellectualizer"
  | "presumptuous"
  | "rusher"
  | "explainer";

/**
 * Full definition of a communicator pattern.
 * Used in pattern detection output and session debrief.
 */
export interface CommunicatorPattern {
  /** Machine identifier — matches PatternType */
  id: PatternType;

  /** User-facing name: "Surface Reader", "Hedger", etc. */
  name: string;

  /** 1-sentence behavioral description */
  description: string;

  /** Observable behavioral indicators detected in exchanges */
  signalBehaviors: string[];

  /** Technique IDs whose drills close this gap */
  prescribedDrills: string[];
}

/**
 * All 8 communicator patterns with full definitions.
 * Source: RESEARCH_PATTERNS.md + behavioral signal analysis.
 */
export const COMMUNICATOR_PATTERNS: Record<PatternType, CommunicatorPattern> = {
  "surface-reader": {
    id: "surface-reader",
    name: "Surface Reader",
    description: "Responds to literal content, misses the subtext beneath.",
    signalBehaviors: [
      "Names obvious emotion only",
      "Misses underlying fear or need",
      "Responds to words, not meaning",
    ],
    prescribedDrills: ["labeling", "open-ended-questions"],
  },
  hedger: {
    id: "hedger",
    name: "Hedger",
    description:
      "Adds uncertainty markers to accurate observations, undermining their impact.",
    signalBehaviors: [
      '"I think maybe...", "...right?"',
      "Softening prefixes before accurate labels",
      "Tag questions seeking validation",
    ],
    prescribedDrills: ["labeling", "i-statements"],
  },
  fixer: {
    id: "fixer",
    name: "Fixer",
    description: "Jumps to solutions before demonstrating empathy.",
    signalBehaviors: [
      '"You should...", "Have you tried..."',
      "Advice within first 2 exchanges",
      "Problem-solving before acknowledgment",
    ],
    prescribedDrills: ["labeling", "open-ended-questions", "nvc-feeling"],
  },
  diplomat: {
    id: "diplomat",
    name: "Diplomat",
    description: "Avoids conflict by hiding their real read of the situation.",
    signalBehaviors: [
      "Overly agreeable responses",
      "Avoids naming negative emotions",
      "Deflects from direct observation",
    ],
    prescribedDrills: ["accusation-audit", "no-oriented-questions"],
  },
  intellectualizer: {
    id: "intellectualizer",
    name: "Intellectualizer",
    description:
      "Analyzes emotionally charged situations instead of connecting with them.",
    signalBehaviors: [
      "Uses analysis words instead of emotion words",
      "Treats feelings as problems to solve",
      "Clinical framing of personal situations",
    ],
    prescribedDrills: ["nvc-feeling", "nvc-observation", "labeling"],
  },
  presumptuous: {
    id: "presumptuous",
    name: "Presumptuous",
    description: "States interpretations as facts rather than hypotheses.",
    signalBehaviors: [
      '"You clearly...", "You must feel..."',
      "Declarative framing of others' emotions",
      "No hedging where hedging is appropriate",
    ],
    prescribedDrills: ["mirroring", "labeling"],
  },
  rusher: {
    id: "rusher",
    name: "Rusher",
    description:
      "Fills silence and stacks questions without waiting for responses.",
    signalBehaviors: [
      "Multiple questions in one turn",
      "Very short exchanges with rapid follow-ups",
      "No pauses between thoughts",
    ],
    prescribedDrills: ["labeling", "open-ended-questions"],
  },
  explainer: {
    id: "explainer",
    name: "Explainer",
    description: "Over-justifies positions instead of listening and labeling.",
    signalBehaviors: [
      'High "because" frequency',
      "Long statements under emotional pressure",
      "Explains when labeling would serve better",
    ],
    prescribedDrills: ["mirroring", "no-oriented-questions"],
  },
};

// ---------------------------------------------------------------------------
// Pattern detection output — per-exchange and session-level
// ---------------------------------------------------------------------------

/**
 * Per-exchange pattern detection output.
 * Produced by detectPatternSignals() after each user exchange.
 * This is what Panel B ("What you signaled") displays.
 */
export interface PatternSignal {
  /** Specific behavioral observations: "Tag question detected", "Advice before empathy" */
  signals: string[];

  /**
   * Non-judgmental, behavioral observation for Panel B display.
   * Written as: "You tend to X when Y" — specific, not shaming.
   */
  patternNote: string;

  /** Pattern classification for this exchange */
  dominant_pattern: PatternType | "appropriate" | "mixed";

  /** Confidence level: 0-1 */
  confidence: number;
}

/**
 * Session-level pattern accumulation.
 * Accumulates across all exchanges to identify the user's dominant pattern.
 * Passed to onComplete() for debrief screen consumption.
 */
export interface SessionPatternData {
  /** One PatternSignal per user exchange (parallel to message list) */
  exchangeSignals: PatternSignal[];

  /** Immediate regex-detected signals accumulated across the session */
  regexSignals: string[];

  /**
   * Session-level dominant pattern — only set after 3+ consistent exchanges
   * with >= 0.75 confidence and dominant pattern in >= 60% of exchanges.
   */
  sessionPattern: PatternType | null;

  /** Session-level confidence: 0-1. Must be >= 0.75 to surface in debrief. */
  patternConfidence: number;
}
