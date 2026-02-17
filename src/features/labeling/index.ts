/**
 * Labeling Practice Module
 * Interactive practice for Chris Voss labeling technique
 */

// Main component
export { LabelingPractice } from "./LabelingPractice";

// Sub-components
export { ScenarioPresenter } from "./ScenarioPresenter";
export { LabelFeedback } from "./LabelFeedback";
export { PatternSummary } from "./PatternSummary";

// Hooks
export { useLabelingSession } from "./useLabelingSession";

// Services
export { analyzeLabel, analyzeSyntax, analyzeDepth } from "./labelAnalyzer";
export {
  saveLabelAttempt,
  getLabelAttempts,
  getLabelingPatterns,
  clearLabelingData,
} from "./labelingStorage";
export {
  LABELING_SCENARIOS,
  getScenariosByCategory,
  getScenariosByDifficulty,
  getScenariosByLabelType,
  getRandomScenario,
  getScenarioById,
} from "./scenarioBank";

// Types
export type {
  LabelingScenario,
  ScenarioCategory,
  DifficultyLevel,
  SyntaxScore,
  DepthScore,
  LabelAnalysis,
  LabelGrade,
  LabelAttempt,
  AIResponse,
  LabelingPatterns,
  LabelingSessionState,
  LabelingSessionData,
} from "./types";
