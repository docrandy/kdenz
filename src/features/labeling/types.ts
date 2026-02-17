/**
 * Labeling Practice Module - Type Definitions
 * Based on Chris Voss labeling technique research
 */

// ===== AFFECT SYSTEM =====
// The Trust Cascade: shows emotional impact on the other person

export type AffectLevel =
  | "guarded" // Still defensive, label didn't land
  | "acknowledged" // Surface emotion named, they feel seen
  | "understood" // Underlying driver named, perspective-taking demonstrated
  | "deeply_connected"; // Identity/core need named, psychological safety created

export interface AffectResult {
  level: AffectLevel;
  description: string; // What the other person experienced
  observableIndicator: string; // What you'd see in real conversation
  patternToExplore?: string; // One micro-action for next time
}

// Affect feedback messages for labeling
export const LABEL_AFFECT_FEEDBACK: Record<
  AffectLevel,
  {
    description: string;
    indicator: string;
  }
> = {
  guarded: {
    description:
      "Your label didn't land. They remain closed off, perhaps feeling judged or misunderstood.",
    indicator: "They deflect, give short answers, or change the subject",
  },
  acknowledged: {
    description:
      "Naming the visible emotion validates their experience. They feel seen but not yet understood.",
    indicator: "They nod or say 'yeah' but don't elaborate",
  },
  understood: {
    description:
      "By naming WHY they feel this way, you demonstrated perspective-taking. Expect increased openness.",
    indicator: "They lean in, share more details, or express relief",
  },
  deeply_connected: {
    description:
      "Identity-level validation creates psychological safety. This is where relationship acceleration occurs.",
    indicator:
      "They reveal something vulnerable they weren't planning to share",
  },
};

// ===== SCENARIO DEFINITION =====

export type LabelTypeTag =
  | "affect-shift" // Labels 1-3
  | "behavior-probe" // Labels 4-5
  | "impasse" // Label 6
  | "opening" // Label 7
  | "value" // Label 8
  | "mis-label"; // Advanced Mis-Label practice

// Scenario definition
export interface LabelingScenario {
  id: string;
  context: string; // Setup text explaining the situation
  statement: string; // What the AI "says"
  surfaceEmotion: string; // What novices typically label (e.g., "frustrated")
  underlyingDriver: string; // What experts label (e.g., "worried about precedent")
  expertLabel: string; // Example of an expert-level label
  category: ScenarioCategory;
  difficulty: DifficultyLevel;
  labelType?: LabelTypeTag; // Which of the 8 label types this practices
  deliveryGuidance?: string; // Specific delivery instruction for this scenario
  silenceExpectation?: string; // What to expect during Dynamic Silence
  counterpartResponse?: string; // What AI says after a good label
}

export type ScenarioCategory =
  | "salary-negotiation"
  | "saying-no"
  | "difficult-conversation"
  | "workplace";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

// Syntax analysis result
export interface SyntaxScore {
  hasCorrectOpener: boolean; // "It seems/sounds/looks like..."
  openerUsed: string | null; // Which opener was detected
  avoidsIFraming: boolean; // No "I'm hearing", "I think"
  avoidsYouFraming: boolean; // No "You seem", "You're"
  isStatement: boolean; // Not a question (no "?", no "right?")
  syntaxPoints: number; // 0-40 points
  syntaxFeedback: string[]; // Specific feedback messages
}

// Depth analysis result
export interface DepthScore {
  targetsSurfaceEmotion: boolean; // Generic (weak)
  targetsUnderlyingDriver: boolean; // Specific (strong)
  emotionLabeled: string | null; // What emotion/driver they labeled
  specificity: SpecificityLevel;
  depthPoints: number; // 0-60 points
  depthFeedback: string[]; // Specific feedback messages
}

export type SpecificityLevel = "generic" | "specific" | "highly-specific";

// Complete analysis result for a label attempt
export interface LabelAnalysis {
  // Affect-based feedback (primary)
  affect: AffectResult;

  // Internal scoring (used for AI response, not shown to user)
  syntax: SyntaxScore;
  depth: DepthScore;
  overallScore: number; // 0-100 (internal use)
  grade: LabelGrade; // Internal use

  // Feedback
  allFeedback: string[]; // Combined feedback
  expertExample: string; // What an expert would say
}

export type LabelGrade = "expert" | "proficient" | "developing" | "novice";

// User's label attempt
export interface LabelAttempt {
  id: string;
  scenarioId: string;
  timestamp: number;
  transcript: string;
  audioBlob?: Blob;
  audioDuration?: number;
  silenceDuration?: number; // Pause after label (in seconds)
  analysis: LabelAnalysis;
}

// AI response after user's label
export interface AIResponse {
  text: string;
  tone: "open" | "partial" | "guarded";
  followUp?: string; // Optional follow-up prompt
}

// Pattern tracking across sessions
export interface LabelingPatterns {
  totalAttempts: number;
  averageScore: number;
  syntaxErrorRate: number; // % of attempts with syntax errors
  commonMistakes: MistakeCount[];
  emotionVocabulary: string[]; // Unique emotions/drivers labeled
  vocabularyTTR: number; // Type-token ratio (diversity)
  repetitiveTemplates: TemplateCount[];
  scoreHistory: ScoreHistoryEntry[];
  improvementTrend: "improving" | "stable" | "declining";
}

export interface MistakeCount {
  mistake: string;
  count: number;
  lastOccurred: number;
}

export interface TemplateCount {
  template: string;
  count: number;
}

export interface ScoreHistoryEntry {
  timestamp: number;
  scenarioId: string;
  score: number;
}

// Session state
export type LabelingSessionState =
  | "selecting" // Choosing scenario
  | "presenting" // Showing AI statement
  | "recording" // User is speaking
  | "analyzing" // Processing transcript
  | "feedback" // Showing results
  | "responding" // AI responding
  | "continuing" // Recording follow-up in multi-turn conversation
  | "summary"; // Session complete

// Conversation turn for multi-turn practice
export interface ConversationTurn {
  id: string;
  turnNumber: number;
  role: "user" | "ai";
  transcript: string;
  timestamp: number;
  analysis?: LabelAnalysis; // Only for user turns
}

export interface LabelingSessionData {
  state: LabelingSessionState;
  currentScenario: LabelingScenario | null;
  attempts: LabelAttempt[];
  sessionStartTime: number;

  // Multi-turn conversation tracking
  conversationTurns: ConversationTurn[];
  currentTurnNumber: number;
}
