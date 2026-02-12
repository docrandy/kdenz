import { useState, useEffect, useRef } from "react";

interface SilenceNudgeProps {
  /** Whether the silence threshold has been reached */
  triggered: boolean;
  /** Called when the nudge has been shown and dismissed (so parent can mark it as done) */
  onDismissed?: () => void;
}

// Warm, encouraging coach-tone messages
const COACH_MESSAGES = [
  "You've got this — start whenever you're ready",
  "Take your time. Begin when you feel ready",
  "No rush — speak when you're comfortable",
];

export default function SilenceNudge({
  triggered,
  onDismissed,
}: SilenceNudgeProps) {
  const [visible, setVisible] = useState(false);
  const [message] = useState(
    () => COACH_MESSAGES[Math.floor(Math.random() * COACH_MESSAGES.length)],
  );
  const dismissTimerRef = useRef<number | null>(null);
  const hasShownRef = useRef(false);

  useEffect(() => {
    // If already shown once, never show again
    if (hasShownRef.current) {
      return;
    }

    // Triggered becomes true — show the nudge
    if (triggered && !visible) {
      setVisible(true);
      hasShownRef.current = true;

      // Auto-dismiss after 5 seconds
      dismissTimerRef.current = window.setTimeout(() => {
        setVisible(false);
        onDismissed?.();
      }, 5000);
    }

    // Triggered becomes false while visible (user started speaking) — immediate dismiss
    if (!triggered && visible) {
      setVisible(false);
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      onDismissed?.();
    }

    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [triggered, visible, onDismissed]);

  return (
    <div
      className={`
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div className="flex items-center justify-center py-4">
        <div className="bg-background-surface border border-background-elevated rounded-lg px-6 py-3">
          <p className="text-sm text-text-muted font-medium text-center">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
