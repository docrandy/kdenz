/**
 * FlashcardDrill — Level 1 multiple-choice label recognition
 *
 * Shows a character's statement and 4 label options:
 *   1. Expert label (correct, targets underlying driver)
 *   2. Surface-level label (correct syntax, surface emotion only)
 *   3. Wrong syntax — I-framing ("I'm hearing that...")
 *   4. Wrong syntax — question form ("...right?")
 *
 * CriteriaBar lights up based on which option the user chooses.
 * 3 consecutive correct = level advancement (handled by parent).
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { CriteriaBar } from "./CriteriaBar";
import type { LabelingScenario, DrillStats } from "./types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FlashcardDrillProps {
  scenarios: LabelingScenario[];
  onComplete: (stats: DrillStats) => void;
  onBack: () => void;
}

// ---------------------------------------------------------------------------
// Option generation
// ---------------------------------------------------------------------------

interface FlashcardOption {
  text: string;
  quality: "expert" | "surface" | "wrong-syntax" | "wrong-question";
}

function generateFlashcardOptions(
  scenario: LabelingScenario,
): FlashcardOption[] {
  const options: FlashcardOption[] = [
    { text: scenario.expertLabel, quality: "expert" },
    {
      text: `It seems like you're ${scenario.surfaceEmotion.split(",")[0].trim()}.`,
      quality: "surface",
    },
    {
      text: `I'm hearing that you're ${scenario.surfaceEmotion.split(",")[0].trim()}.`,
      quality: "wrong-syntax",
    },
    {
      text: `It seems like you're ${scenario.surfaceEmotion.split(",")[0].trim()}, right?`,
      quality: "wrong-question",
    },
  ];

  // Shuffle using Fisher-Yates
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  return options;
}

// Map option quality to CriteriaBar props
function criteriaForOption(quality: FlashcardOption["quality"]) {
  switch (quality) {
    case "expert":
      return {
        syntax: { hit: true },
        emotion: { hit: true },
        depth: { level: "underlying" as const },
      };
    case "surface":
      return {
        syntax: { hit: true },
        emotion: { hit: true },
        depth: { level: "surface" as const },
      };
    case "wrong-syntax":
      return {
        syntax: { hit: false, details: "I-framing detected" },
        emotion: { hit: true },
        depth: { level: "surface" as const },
      };
    case "wrong-question":
      return {
        syntax: { hit: false, details: "Question form weakens label" },
        emotion: { hit: true },
        depth: { level: "surface" as const },
      };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MAX_EXCHANGES = 10;

export function FlashcardDrill({
  scenarios,
  onComplete,
  onBack,
}: FlashcardDrillProps) {
  // -- Pool management -------------------------------------------------------
  const poolRef = useRef<LabelingScenario[]>([]);

  // Initialise a shuffled pool once
  if (poolRef.current.length === 0) {
    poolRef.current = [...scenarios].sort(() => Math.random() - 0.5);
  }

  // -- State -----------------------------------------------------------------
  const [exchangeIndex, setExchangeIndex] = useState(0);
  const [scenario, setScenario] = useState<LabelingScenario>(
    poolRef.current[0],
  );
  const [options, setOptions] = useState<FlashcardOption[]>(() =>
    generateFlashcardOptions(poolRef.current[0]),
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [criteriaState, setCriteriaState] = useState<ReturnType<
    typeof criteriaForOption
  > | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // -- Stats -----------------------------------------------------------------
  const statsRef = useRef<DrillStats>({
    totalExchanges: 0,
    correctCount: 0,
    consecutiveCorrect: 0,
    criteriaHits: { syntax: 0, emotion: 0, underlyingDepth: 0 },
  });

  // -- Pick next scenario from pool ------------------------------------------
  const advanceScenario = useCallback(() => {
    const nextIdx = exchangeIndex + 1;
    if (nextIdx >= MAX_EXCHANGES || nextIdx >= poolRef.current.length) {
      onComplete(statsRef.current);
      return;
    }
    const nextScenario = poolRef.current[nextIdx % poolRef.current.length];
    setExchangeIndex(nextIdx);
    setScenario(nextScenario);
    setOptions(generateFlashcardOptions(nextScenario));
    setSelectedIndex(null);
    setCriteriaState(null);
    setIsTransitioning(false);
  }, [exchangeIndex, onComplete]);

  // -- Handle option tap -----------------------------------------------------
  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null || isTransitioning) return; // already answered

      const option = options[index];
      setSelectedIndex(index);

      // Update CriteriaBar
      const criteria = criteriaForOption(option.quality);
      setCriteriaState(criteria);

      // Update stats
      const s = statsRef.current;
      s.totalExchanges += 1;
      if (criteria.syntax.hit) s.criteriaHits.syntax += 1;
      if (criteria.emotion.hit) s.criteriaHits.emotion += 1;
      if (criteria.depth.level === "underlying") {
        s.criteriaHits.underlyingDepth += 1;
      }

      const isCorrect =
        option.quality === "expert" || option.quality === "surface";
      if (isCorrect) {
        s.correctCount += 1;
        s.consecutiveCorrect += 1;
      } else {
        s.consecutiveCorrect = 0;
      }

      // Auto-advance after 1.5s
      setIsTransitioning(true);
      setTimeout(() => advanceScenario(), 1500);
    },
    [options, selectedIndex, isTransitioning, advanceScenario],
  );

  // -- Early exit if no scenarios -------------------------------------------
  useEffect(() => {
    if (scenarios.length === 0) {
      onComplete(statsRef.current);
    }
  }, [scenarios, onComplete]);

  if (scenarios.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 text-text-muted">
        No scenarios available for this level.
      </div>
    );
  }

  // -- Render ---------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-text-subtle hover:text-text text-sm transition-colors"
        >
          &larr; Back
        </button>
        <span className="text-xs text-text-subtle">
          {exchangeIndex + 1} /{" "}
          {Math.min(MAX_EXCHANGES, poolRef.current.length)}
        </span>
      </div>

      {/* CriteriaBar (shows results after selection) */}
      {criteriaState && (
        <CriteriaBar
          mode="flashcard"
          syntax={criteriaState.syntax}
          emotion={criteriaState.emotion}
          depth={criteriaState.depth}
          expertExample={scenario.expertLabel}
        />
      )}

      {/* Character statement */}
      <div className="bg-background-surface border border-background-elevated rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
            {scenario.characterName.charAt(0)}
          </div>
          <span className="font-medium text-text">
            {scenario.characterName}
          </span>
          <span className="text-text-subtle text-xs">
            — {scenario.characterRole}
          </span>
        </div>
        <p className="text-text leading-relaxed italic">
          &ldquo;{scenario.statement}&rdquo;
        </p>
      </div>

      {/* Label options */}
      <div className="space-y-3">
        <p className="text-xs text-text-subtle">Choose the best label:</p>
        {options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          const answered = selectedIndex !== null;
          const isCorrect =
            option.quality === "expert" || option.quality === "surface";

          let cardClass =
            "w-full text-left px-4 py-3 rounded-xl border transition-colors text-sm leading-relaxed";

          if (!answered) {
            // Unanswered — neutral interactive state
            cardClass +=
              " bg-background-surface border-background-elevated hover:border-accent/40 cursor-pointer";
          } else if (isSelected && isCorrect) {
            // Correct selection
            cardClass +=
              " bg-status-success/10 border-status-success/50 text-status-success";
          } else if (isSelected && !isCorrect) {
            // Wrong selection
            cardClass += " bg-red-500/10 border-red-500/50 text-red-400";
          } else if (answered && isCorrect) {
            // Reveal the correct one even if not selected
            cardClass +=
              " bg-status-success/5 border-status-success/20 text-text-muted";
          } else {
            // Other wrong options after answer
            cardClass +=
              " bg-background-surface border-background-elevated text-text-subtle opacity-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={cardClass}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
