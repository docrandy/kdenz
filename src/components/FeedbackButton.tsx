/**
 * Feedback Button Component
 * Floating button that opens feedback form/email
 */

import { useState } from 'react';

interface FeedbackButtonProps {
  email?: string;
  subject?: string;
}

export default function FeedbackButton({
  email = 'feedback@voicelab.app',
  subject = 'VoiceLab Beta Feedback',
}: FeedbackButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    const body = encodeURIComponent(
      `Hi VoiceLab team,\n\nI wanted to share some feedback about my experience:\n\n[Your feedback here]\n\n---\nBrowser: ${navigator.userAgent}\nTime: ${new Date().toISOString()}`
    );
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-4 right-4 flex items-center gap-2 bg-clinical-text text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-all z-50"
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
        className={`text-sm font-medium overflow-hidden transition-all duration-200 ${
          isHovered ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0'
        }`}
      >
        Feedback
      </span>
    </button>
  );
}
