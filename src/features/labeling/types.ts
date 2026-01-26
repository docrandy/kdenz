/**
 * Labeling Practice Module - Type Definitions
 * Based on Chris Voss labeling technique research
 */

// Scenario definition
export interface LabelingScenario {
  id: string;
  context: string;           // Setup text explaining the situation
  statement: string;         // What the AI "says"
  surfaceEmotion: string;    // What novices typically label (e.g., "frustrated")
  underlyingDriver: string;  // What experts label (e.g., "worried about precedent")
  expertLabel: string;       // Example of an expert-level label
  category: ScenarioCategory;
  difficulty: DifficultyLevel;
}

export type ScenarioCategory =
  | 'salary-negotiation'
  | 'saying-no'
  | 'difficult-conversation'
  | 'workplace';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Syntax analysis result
export interface SyntaxScore {
  hasCorrectOpener: boolean;        // "It seems/sounds/looks like..."
  openerUsed: string | null;        // Which opener was detected
  avoidsIFraming: boolean;          // No "I'm hearing", "I think"
  avoidsYouFraming: boolean;        // No "You seem", "You're"
  isStatement: boolean;             // Not a question (no "?", no "right?")
  syntaxPoints: number;             // 0-40 points
  syntaxFeedback: string[];         // Specific feedback messages
}

// Depth analysis result
export interface DepthScore {
  targetsSurfaceEmotion: boolean;   // Generic (weak)
  targetsUnderlyingDriver: boolean; // Specific (strong)
  emotionLabeled: string | null;    // What emotion/driver they labeled
  specificity: SpecificityLevel;
  depthPoints: number;              // 0-60 points
  depthFeedback: string[];          // Specific feedback messages
}

export type SpecificityLevel = 'generic' | 'specific' | 'highly-specific';

// Complete analysis result for a label attempt
export interface LabelAnalysis {
  syntax: SyntaxScore;
  depth: DepthScore;
  overallScore: number;             // 0-100
  grade: LabelGrade;
  allFeedback: string[];            // Combined feedback
  expertExample: string;            // What an expert would say
}

export type LabelGrade = 'expert' | 'proficient' | 'developing' | 'novice';

// User's label attempt
export interface LabelAttempt {
  id: string;
  scenarioId: string;
  timestamp: number;
  transcript: string;
  audioBlob?: Blob;
  audioDuration?: number;
  silenceDuration?: number;         // Pause after label (in seconds)
  analysis: LabelAnalysis;
}

// AI response after user's label
export interface AIResponse {
  text: string;
  tone: 'open' | 'partial' | 'guarded';
  followUp?: string;                // Optional follow-up prompt
}

// Pattern tracking across sessions
export interface LabelingPatterns {
  totalAttempts: number;
  averageScore: number;
  syntaxErrorRate: number;          // % of attempts with syntax errors
  commonMistakes: MistakeCount[];
  emotionVocabulary: string[];      // Unique emotions/drivers labeled
  vocabularyTTR: number;            // Type-token ratio (diversity)
  repetitiveTemplates: TemplateCount[];
  scoreHistory: ScoreHistoryEntry[];
  improvementTrend: 'improving' | 'stable' | 'declining';
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
  | 'selecting'       // Choosing scenario
  | 'presenting'      // Showing AI statement
  | 'recording'       // User is speaking
  | 'analyzing'       // Processing transcript
  | 'feedback'        // Showing results
  | 'responding'      // AI responding
  | 'summary';        // Session complete

export interface LabelingSessionData {
  state: LabelingSessionState;
  currentScenario: LabelingScenario | null;
  attempts: LabelAttempt[];
  sessionStartTime: number;
}
