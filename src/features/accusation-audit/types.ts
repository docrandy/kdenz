/**
 * Accusation Audit Practice Module - Type Definitions
 * Based on Chris Voss accusation audit technique research
 */

// ===== AFFECT SYSTEM =====
// The Trust Cascade: shows emotional impact on the other person

export type AffectLevel =
  | 'guarded'          // Still defensive, concerns not addressed
  | 'acknowledged'     // Visible emotion validated, they feel seen
  | 'understood'       // WHY addressed, perspective-taking demonstrated
  | 'deeply_connected'; // Identity-level validation, psychological safety created

export interface AffectResult {
  level: AffectLevel;
  description: string;      // What the other person experienced
  observableIndicator: string; // What you'd see in real conversation
  patternToExplore?: string;   // One micro-action for next time
}

// Affect feedback messages for each level
export const AUDIT_AFFECT_FEEDBACK: Record<AffectLevel, {
  description: string;
  indicator: string;
}> = {
  guarded: {
    description: "Unaddressed concerns are still consuming their mental energy. They remain defensive.",
    indicator: "They deflect, change subject, or shut down"
  },
  acknowledged: {
    description: "You named some of their concerns. They feel partially seen but not fully understood.",
    indicator: "They nod but haven't opened up yet"
  },
  understood: {
    description: "You cleared defensive mental space by addressing key concerns. They're willing to engage constructively.",
    indicator: "They opened up about the real issue"
  },
  deeply_connected: {
    description: "You named concerns they hadn't articulated. This signals exceptional empathy and builds rapid trust.",
    indicator: "They revealed something they weren't planning to share"
  }
};

// ===== SCENARIO DEFINITION =====

// Scenario definition
export interface AuditScenario {
  id: string;
  context: string;              // Setup text explaining the situation
  relationship: string;         // Your relationship to counterpart
  stakes: string;               // What's at risk
  counterpartRole: string;      // "Your manager", "Your colleague", etc.

  // What they might think
  commonCriticisms: Criticism[];
  hiddenConcern: string;        // The real issue (revealed if audit is good)

  category: ScenarioCategory;
  difficulty: DifficultyLevel;
}

export interface Criticism {
  id: string;
  text: string;                 // Display text: "You're ungrateful"
  inTheirVoice: string;         // First person: "I'm being ungrateful"
  keywords: string[];           // Detection keywords
  importance: 'critical' | 'common' | 'minor';
}

export type ScenarioCategory =
  | 'salary-negotiation'
  | 'saying-no'
  | 'difficult-conversation'
  | 'workplace';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Coverage analysis result
export interface CoverageScore {
  criticismsCovered: string[];      // IDs of criticisms addressed
  criticismsMissed: string[];       // IDs of criticisms missed
  coveragePercent: number;          // % of important criticisms covered
  coveredCritical: boolean;         // Did they hit the critical ones?
  coveragePoints: number;           // 0-40 points
  coverageFeedback: string[];       // Specific feedback messages
}

// Delivery analysis result
export interface DeliveryScore {
  usesFirstPerson: boolean;         // "I might seem..." not "You think..."
  avoidsDefense: boolean;           // No justifications or explanations
  acknowledgesImpact: boolean;      // "I get why that would be concerning"
  multiplePoints: boolean;          // Listed several criticisms
  appropriateTone: 'defensive' | 'neutral' | 'empathetic';
  deliveryPoints: number;           // 0-35 points
  deliveryFeedback: string[];       // Specific feedback messages
}

// Structure analysis result
export interface StructureScore {
  hasOpener: boolean;               // "I know this might look like..."
  listsMultiple: boolean;           // Multiple criticisms listed
  hasAcknowledgment: boolean;       // "I understand why that's concerning"
  appropriateLength: boolean;       // Not too long, not too short
  structurePoints: number;          // 0-25 points
  structureFeedback: string[];      // Specific feedback messages
}

// Complete analysis result for an audit attempt
export interface AuditAnalysis {
  // Affect-based feedback (primary)
  affect: AffectResult;

  // Internal scoring (used for AI response, not shown to user)
  coverage: CoverageScore;
  delivery: DeliveryScore;
  structure: StructureScore;
  overallScore: number;             // 0-100 (internal use)
  grade: AuditGrade;                // Internal use

  // Feedback
  allFeedback: string[];            // Combined feedback
  missedOpportunities: string[];    // Critical points not addressed
  expertExample: string;            // What an expert would say
}

export type AuditGrade = 'expert' | 'proficient' | 'developing' | 'novice';

// User's audit attempt
export interface AuditAttempt {
  id: string;
  scenarioId: string;
  timestamp: number;

  // Preparation phase (optional)
  brainstormedCriticisms: string[];

  // Delivery phase
  transcript: string;
  audioBlob?: Blob;
  audioDuration?: number;

  analysis: AuditAnalysis;
}

// AI response after user's audit
export interface AIResponse {
  text: string;
  type: 'opens' | 'partial' | 'guarded';
  interpretation: string;           // What the response means
}

// Pattern tracking across sessions
export interface AuditPatterns {
  totalAttempts: number;
  averageScore: number;
  avgCoverage: number;              // Average % of criticisms covered
  commonMisses: MissedCriticism[];  // Criticisms frequently missed
  defenseTriggers: string[];        // Phrases that signal defensiveness
  scoreHistory: ScoreHistoryEntry[];
  coverageHistory: number[];        // Coverage % over time
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export interface MissedCriticism {
  criticismId: string;
  criticismText: string;
  missCount: number;
  lastMissed: number;
}

export interface ScoreHistoryEntry {
  timestamp: number;
  scenarioId: string;
  score: number;
  coverage: number;
}

// Session state
export type AuditSessionState =
  | 'selecting'       // Choosing scenario
  | 'presenting'      // Showing scenario context
  | 'recording'       // User delivers audit
  | 'analyzing'       // Processing transcript
  | 'feedback'        // Showing results
  | 'responding'      // AI responding
  | 'continuing'      // Recording follow-up in multi-turn conversation
  | 'summary';        // Session complete

// Conversation turn for multi-turn practice
export interface ConversationTurn {
  id: string;
  turnNumber: number;
  role: 'user' | 'ai';
  transcript: string;
  timestamp: number;
  analysis?: AuditAnalysis;  // Only for user turns
}

export interface AuditSessionData {
  state: AuditSessionState;
  currentScenario: AuditScenario | null;
  brainstormedCriticisms: string[];
  attempts: AuditAttempt[];
  sessionStartTime: number;

  // Multi-turn conversation tracking
  conversationTurns: ConversationTurn[];
  currentTurnNumber: number;
}
