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
export { CriteriaBar } from "./CriteriaBar";
export { CarouselIntro } from "./CarouselIntro";
export { ScenarioContext } from "./ScenarioContext";
export { FlashcardDrill } from "./FlashcardDrill";
export { ConversationalDrill } from "./ConversationalDrill";
export { LevelComplete } from "./LevelComplete";

// Hooks
export { useLabelingSession } from "./useLabelingSession";
export { useLabelingProgression } from "./useLabelingProgression";

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
  getScenariosByLevel,
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
  DrillStats,
  LabelingProgression,
} from "./types";
