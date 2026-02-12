import { useState, useEffect } from "react";

interface CountdownOverlayProps {
  onComplete: () => void;
}

/**
 * CountdownOverlay
 *
 * Full-screen countdown animation (3-2-1) that plays before recording begins.
 * Each number scales up and fades in/out over ~800ms, with 200ms pause after "1" before calling onComplete.
 *
 * Visual design: Dark background, large centered number with scale+fade animation, gold accent ring.
 */
export default function CountdownOverlay({
  onComplete,
}: CountdownOverlayProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // After "1" fades (count reaches 0), wait 200ms then call onComplete
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 200);
      return () => clearTimeout(completeTimer);
    }
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      {count > 0 && (
        <div
          key={count}
          className="animate-countdown-pulse"
          style={{
            // Gold accent ring around number
            boxShadow: "0 0 60px rgba(201, 168, 76, 0.3)",
          }}
        >
          <span className="text-display font-display text-text-heading">
            {count}
          </span>
        </div>
      )}
    </div>
  );
}
