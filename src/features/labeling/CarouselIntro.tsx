/**
 * CarouselIntro - One-time swipeable intro carousel for labeling drill levels
 *
 * Shows 3 intro cards on first entry to a given level.
 * Tracks "seen" state in localStorage: key `labeling_intro_seen_L{level}`
 * Once dismissed, calls onComplete() immediately on re-entry (parent controls mount).
 *
 * Usage:
 *   <CarouselIntro level={1} onComplete={() => setShowIntro(false)} />
 */

import { useState, useEffect } from "react";

interface CarouselIntroProps {
  level: number; // 1, 2, or 3+
  onComplete: () => void; // called when user dismisses the carousel
}

interface Card {
  title: string;
  body: React.ReactNode;
}

// ---- Card content per level ----

const LEVEL_1_CARDS: Card[] = [
  {
    title: "What is Labeling?",
    body: (
      <ul className="space-y-2">
        <li>A label names what someone is feeling or experiencing.</li>
        <li>It's an observation, not a question or judgment.</li>
        <li>
          Formula:{" "}
          <span className="font-medium text-text">
            "It seems like..." / "It sounds like..." / "It looks like..."
          </span>
        </li>
      </ul>
    ),
  },
  {
    title: "Emotion Depth Levels",
    body: (
      <ul className="space-y-2">
        <li>
          <span className="font-medium text-text">Surface:</span> The obvious
          emotion (frustrated, angry, upset)
        </li>
        <li>
          <span className="font-medium text-text">Underlying:</span> WHY they
          feel that way (fear of losing control, worried about reputation)
        </li>
        <li>
          <span className="font-medium text-text">Identity:</span> WHO they're
          trying to be (someone who protects their team)
        </li>
        <li>Better labels go deeper.</li>
      </ul>
    ),
  },
  {
    title: "How This Works",
    body: (
      <ul className="space-y-2">
        <li>You'll see a situation and pick the best label.</li>
        <li>The criteria bar shows what you got right.</li>
        <li>Get 3 in a row to advance to conversational practice.</li>
      </ul>
    ),
  },
];

const LEVEL_2_CARDS: Card[] = [
  {
    title: "Now It's a Conversation",
    body: (
      <ul className="space-y-2">
        <li>A character will speak to you. You respond with a label.</li>
        <li>
          They'll react naturally — your label quality affects their response.
        </li>
      </ul>
    ),
  },
  {
    title: "The Criteria Bar",
    body: (
      <ul className="space-y-2">
        <li>Watch the bar above the conversation.</li>
        <li>Syntax, emotion accuracy, and depth light up when you hit them.</li>
        <li>Tap any criterion to learn more.</li>
      </ul>
    ),
  },
  {
    title: "Aim for Underlying",
    body: (
      <ul className="space-y-2">
        <li>Don't just name the obvious emotion.</li>
        <li>
          Ask yourself: what do they stand to{" "}
          <span className="font-medium text-text">LOSE?</span>
        </li>
        <li>That's the underlying driver.</li>
      </ul>
    ),
  },
];

const LEVEL_3_CARDS: Card[] = [
  {
    title: "Audio Only",
    body: (
      <ul className="space-y-2">
        <li>From here on, type your label using your voice.</li>
        <li>Tonality, pace, and silence all matter.</li>
      </ul>
    ),
  },
  {
    title: "Dynamic Silence",
    body: (
      <ul className="space-y-2">
        <li>After your label, pause for at least 3 seconds.</li>
        <li>The silence is where the magic happens.</li>
        <li>
          Count:{" "}
          <span className="font-medium text-text">
            one-one-thousand, two-one-thousand, three-one-thousand.
          </span>
        </li>
      </ul>
    ),
  },
  {
    title: "New Label Types",
    body: (
      <ul className="space-y-2">
        <li>You'll encounter behavior probes, opening labels, and more.</li>
        <li>Each has different syntax and delivery requirements.</li>
        <li>The criteria bar adapts to show what matters for each type.</li>
      </ul>
    ),
  },
];

function getCardsForLevel(level: number): Card[] {
  if (level === 1) return LEVEL_1_CARDS;
  if (level === 2) return LEVEL_2_CARDS;
  return LEVEL_3_CARDS; // level 3+
}

function storageKey(level: number): string {
  return `labeling_intro_seen_L${level}`;
}

// ---- Component ----

export function CarouselIntro({ level, onComplete }: CarouselIntroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track animation direction: "forward" | "back" — reserved for future slide animation
  const [, setDirection] = useState<"forward" | "back">("forward");
  // Animating flag for CSS transition
  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  const cards = getCardsForLevel(level);
  const isLastCard = currentIndex === cards.length - 1;

  // On mount: check if this level's intro has already been seen
  useEffect(() => {
    const seen = localStorage.getItem(storageKey(level));
    if (seen === "true") {
      onComplete();
    } else {
      setVisible(true);
    }
    // onComplete is intentionally excluded — calling it in deps would re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  function handleNext() {
    if (isAnimating) return;
    setDirection("forward");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);
    }, 150);
  }

  function handleDismiss() {
    localStorage.setItem(storageKey(level), "true");
    onComplete();
  }

  // Don't render anything until we know the intro should be shown
  if (!visible) return null;

  const card = cards[currentIndex];

  return (
    <div
      className="w-full max-w-2xl mx-auto px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Level ${level} introduction`}
    >
      {/* Card */}
      <div
        className="bg-background-surface border border-background-elevated rounded-2xl p-6"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? "translateX(12px)" : "translateX(0)",
          transition: "opacity 150ms ease, transform 150ms ease",
        }}
      >
        {/* Card header */}
        <h2 className="text-xl font-semibold text-text mb-4">{card.title}</h2>

        {/* Card body */}
        <div className="text-text-muted text-sm leading-relaxed space-y-2">
          {card.body}
        </div>

        {/* Dot indicators */}
        <div
          className="flex justify-center gap-2 mt-6 mb-6"
          role="tablist"
          aria-label="Card progress"
        >
          {cards.map((_, idx) => (
            <span
              key={idx}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Card ${idx + 1} of ${cards.length}`}
              className="block w-2 h-2 rounded-full transition-colors duration-200"
              style={{
                backgroundColor:
                  idx === currentIndex
                    ? "var(--color-accent)"
                    : "var(--color-background-elevated, #2a2d3a)",
              }}
            />
          ))}
        </div>

        {/* Action button */}
        {isLastCard ? (
          <button
            onClick={handleDismiss}
            className="btn-primary w-full"
            aria-label="Dismiss introduction and start practice"
          >
            Got it, let's go
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="btn-secondary w-full"
            aria-label={`Go to card ${currentIndex + 2} of ${cards.length}`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
