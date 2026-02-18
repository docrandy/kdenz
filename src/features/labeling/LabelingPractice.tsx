/**
 * LabelingPractice - Main Container Component
 *
 * Orchestrates the multi-level labeling drill flow:
 *   intro → context → drill → level-complete → context (next scenario)
 *
 * State machine:
 *   "intro"         — CarouselIntro (handles its own localStorage "already seen" skip)
 *   "context"       — ScenarioContext (character, setting, NO dialogue revealed)
 *   "drill"         — FlashcardDrill (L1) or ConversationalDrill (L2+)
 *   "level-complete"— LevelComplete celebration before advancing
 *   "summary"       — PatternSummary end-of-session stats
 */

import { useState, useCallback, useRef } from "react";
import { CarouselIntro } from "./CarouselIntro";
import { ScenarioContext } from "./ScenarioContext";
import { FlashcardDrill } from "./FlashcardDrill";
import { ConversationalDrill } from "./ConversationalDrill";
import { LevelComplete } from "./LevelComplete";
import { PatternSummary } from "./PatternSummary";
import { QuickNoteBox } from "../../components/QuickNoteBox";
import { useLabelingProgression } from "./useLabelingProgression";
import { getScenariosByLevel } from "./scenarioBank";
import type { LabelingScenario, DrillStats } from "./types";

type FlowState = "intro" | "context" | "drill" | "level-complete" | "summary";

const MAX_RECENT = 5;
const ADVANCEMENT_THRESHOLD = 3;

function pickScenario(
  level: number,
  recentIds: string[],
): LabelingScenario | null {
  const clampedLevel = Math.min(level, 3) as 1 | 2 | 3;
  const pool = getScenariosByLevel(clampedLevel);
  if (!pool.length) return null;
  const filtered = pool.filter((s) => !recentIds.includes(s.id));
  const candidates = filtered.length > 0 ? filtered : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface LabelingPracticeProps {
  onBack: () => void;
}

export function LabelingPractice({ onBack }: LabelingPracticeProps) {
  const { progression, advanceLevel } = useLabelingProgression();
  const currentLevel = progression.currentLevel;

  // Always start at intro — CarouselIntro handles "already seen" skip internally
  const [flowState, setFlowState] = useState<FlowState>("intro");

  const [currentScenario, setCurrentScenario] =
    useState<LabelingScenario | null>(() => pickScenario(currentLevel, []));

  // Track recently seen scenario IDs to avoid repeats within a session
  const recentIds = useRef<string[]>([]);
  const pushRecentId = useCallback((id: string) => {
    recentIds.current = [id, ...recentIds.current].slice(0, MAX_RECENT);
  }, []);

  // --- Transition handlers ---

  const handleIntroDismiss = useCallback(() => {
    setFlowState("context");
  }, []);

  const handleContextStart = useCallback(() => {
    setFlowState("drill");
  }, []);

  const handleDrillComplete = useCallback(
    (stats: DrillStats) => {
      if (currentScenario) pushRecentId(currentScenario.id);

      const hitThreshold = stats.consecutiveCorrect >= ADVANCEMENT_THRESHOLD;

      if (hitThreshold) {
        setFlowState("level-complete");
      } else {
        const next = pickScenario(currentLevel, recentIds.current);
        setCurrentScenario(next);
        setFlowState("context");
      }
    },
    [currentScenario, currentLevel, pushRecentId],
  );

  const handleLevelContinue = useCallback(() => {
    // Advance the level in the hook (currentLevel updates on next render)
    advanceLevel();
    const nextLevel = currentLevel + 1;

    const next = pickScenario(nextLevel, []);
    setCurrentScenario(next);
    recentIds.current = [];

    // Always go through intro state — CarouselIntro skips automatically if seen
    setFlowState("intro");
  }, [advanceLevel, currentLevel]);

  const handleSummary = useCallback(() => {
    setFlowState("summary");
  }, []);

  const handleSummaryClose = useCallback(() => {
    const next = pickScenario(currentLevel, recentIds.current);
    setCurrentScenario(next);
    setFlowState("context");
  }, [currentLevel]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background-surface border-b border-background-elevated sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-text-muted hover:text-text flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="font-semibold text-text">Labeling Practice</h1>
          <button
            onClick={handleSummary}
            className="text-accent hover:text-accent/80 font-medium"
          >
            Summary
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {flowState === "intro" && (
          <CarouselIntro level={currentLevel} onComplete={handleIntroDismiss} />
        )}

        {flowState === "context" && currentScenario && (
          <ScenarioContext
            scenario={currentScenario}
            onStart={handleContextStart}
          />
        )}

        {flowState === "drill" &&
          currentScenario &&
          (currentLevel === 1 ? (
            <FlashcardDrill
              scenarios={getScenariosByLevel(1)}
              onComplete={handleDrillComplete}
              onBack={() => setFlowState("context")}
            />
          ) : (
            <ConversationalDrill
              scenario={currentScenario}
              level={currentLevel}
              onComplete={handleDrillComplete}
              onBack={() => setFlowState("context")}
            />
          ))}

        {flowState === "level-complete" && (
          <LevelComplete
            completedLevel={currentLevel}
            onContinue={handleLevelContinue}
          />
        )}

        {flowState === "summary" && (
          <PatternSummary onClose={handleSummaryClose} />
        )}
      </div>

      {/* Quick Note Box — not shown during summary */}
      {flowState !== "summary" && (
        <QuickNoteBox practiceContext="labeling emotions" />
      )}
    </div>
  );
}
