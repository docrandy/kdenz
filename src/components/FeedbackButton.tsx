/**
 * Feedback Button Component
 * Floating button that opens feedback form/email with session context
 */

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface FeedbackButtonProps {
  email?: string;
  subject?: string;
  showPrompt?: boolean;
}

export default function FeedbackButton({
  email = "feedback@voicelab.app",
  subject = "VoiceLab Beta Feedback",
  showPrompt = false,
}: FeedbackButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const location = useLocation();

  // Show prompt after session if requested
  useEffect(() => {
    if (showPrompt && !hasAnimated) {
      setIsExpanded(true);
      setHasAnimated(true);

      // Auto-collapse after 10 seconds
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showPrompt, hasAnimated]);

  // Pulse animation on first appearance (once per session)
  useEffect(() => {
    const hasSeenPulse = sessionStorage.getItem(
      "voicelab_feedback_pulse_shown",
    );
    if (!hasSeenPulse) {
      sessionStorage.setItem("voicelab_feedback_pulse_shown", "true");
    }
  }, []);

  const handleClick = () => {
    // Get current page info
    const currentPage =
      location.pathname === "/" ? "Dashboard" : location.pathname;

    // Try to get recent session info from sessionStorage
    let sessionContext = "";
    try {
      const lastSession = sessionStorage.getItem("voicelab_last_session");
      if (lastSession) {
        const data = JSON.parse(lastSession);
        const sessionDate = new Date().toLocaleDateString();
        sessionContext = `\nRecent session: ${sessionDate}, ${data.durationSeconds}s, ${data.fillerCount} fillers`;
      }
    } catch {
      // No session data available
    }

    const body = encodeURIComponent(
      `Hi VoiceLab team,\n\nI wanted to share some feedback about my experience:\n\n[Your feedback here]\n\n---\nPage: ${currentPage}${sessionContext}\nBrowser: ${navigator.userAgent}\nTime: ${new Date().toISOString()}`,
    );
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  const handleDismiss = () => {
    setIsExpanded(false);
  };

  const shouldPulse = !sessionStorage.getItem("voicelab_feedback_pulse_shown");

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Expanded prompt (shown after session) */}
      {isExpanded && (
        <div className="bg-background-surface border border-background-elevated rounded-lg shadow-lg p-3 max-w-xs animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <p className="text-body-sm text-text">How was your session?</p>
            <button
              onClick={handleDismiss}
              className="text-text-subtle hover:text-text-muted transition-colors"
              aria-label="Dismiss"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={handleClick}
            className="mt-2 w-full text-body-sm text-accent hover:underline text-left"
          >
            Send feedback →
          </button>
        </div>
      )}

      {/* Main feedback button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`flex items-center gap-2 bg-text text-text-inverse px-4 py-2 rounded-full shadow-lg hover:opacity-90 transition-all ${
          shouldPulse ? "animate-pulse-subtle" : ""
        }`}
        aria-label="Send feedback"
      >
        {/* Icon */}
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>

        {/* Label - shown on hover */}
        <span
          className={`text-body-sm font-medium overflow-hidden transition-all duration-200 ${
            isHovered ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          Feedback
        </span>
      </button>
    </div>
  );
}
