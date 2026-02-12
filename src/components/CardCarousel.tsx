/**
 * CardCarousel Component
 * Displays children one at a time with navigation:
 * - Touch/swipe support for mobile
 * - Arrow buttons for desktop
 * - Dot indicators for position
 * - Keyboard navigation (arrow keys)
 * - Smooth slide transitions
 */

import { useState, useEffect } from "react";

interface CardCarouselProps {
  children: React.ReactNode[]; // Array of card elements
  className?: string; // Optional wrapper class
  onSlideChange?: (index: number) => void; // Optional callback
}

export function CardCarousel({
  children,
  className = "",
  onSlideChange,
}: CardCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const totalCards = children.length;

  // Navigate to a specific card
  const goToCard = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, totalCards - 1));
    setCurrentIndex(clampedIndex);
    onSlideChange?.(clampedIndex);
  };

  // Navigation functions
  const goToPrevious = () => goToCard(currentIndex - 1);
  const goToNext = () => goToCard(currentIndex + 1);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const delta = touchStartX - touchEndX;

    // Swipe threshold: 50px
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        // Swiped left → next card
        goToNext();
      } else {
        // Swiped right → previous card
        goToPrevious();
      }
    }

    setTouchStartX(null);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  };

  // Focus on mount for keyboard support
  useEffect(() => {
    const container = document.getElementById("card-carousel-container");
    container?.focus();
  }, []);

  return (
    <div
      id="card-carousel-container"
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Slide container */}
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children.map((child, i) => (
          <div key={i} className="w-full flex-shrink-0 px-4">
            {child}
          </div>
        ))}
      </div>

      {/* Left arrow button */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background-elevated/60 hover:bg-background-elevated rounded-full w-10 h-10 flex items-center justify-center text-text-muted hover:text-text transition-colors z-10"
          aria-label="Previous card"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right arrow button */}
      {currentIndex < totalCards - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background-elevated/60 hover:bg-background-elevated rounded-full w-10 h-10 flex items-center justify-center text-text-muted hover:text-text transition-colors z-10"
          aria-label="Next card"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      <div className="flex items-center justify-center py-6 gap-2">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => goToCard(i)}
            className={`rounded-full transition-all ${
              i === currentIndex
                ? "bg-accent w-2.5 h-2.5"
                : "bg-background-elevated w-2 h-2"
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
