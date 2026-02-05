/**
 * Audio Quality Warning Component
 * Displays warnings for audio quality issues during session
 *
 * Phase 07-01: Polish & Error Handling
 * - Shows noise and clipping warnings
 * - Uses verbatim copy from foundation docs
 * - Dismissible per warning
 * - Clinical-warm-amber styling per design system
 */

import { useState, useEffect } from 'react';

interface AudioQualityWarningProps {
  warnings: ('noise' | 'clipping')[];
  className?: string;
}

// Warning messages from foundation docs (VERBATIM)
const WARNING_MESSAGES: Record<'noise' | 'clipping', string> = {
  noise: 'Background noise detected; pause metrics may be inaccurate.',
  clipping: 'Microphone clipping detected; pitch/volume estimates may be distorted.',
};

export default function AudioQualityWarning({ warnings, className = '' }: AudioQualityWarningProps) {
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set());

  // Reset dismissed warnings when warnings array changes (new session)
  useEffect(() => {
    if (warnings.length === 0) {
      setDismissedWarnings(new Set());
    }
  }, [warnings.length]);

  const handleDismiss = (warning: 'noise' | 'clipping') => {
    setDismissedWarnings(prev => new Set(prev).add(warning));
  };

  // Filter out dismissed warnings
  const activeWarnings = warnings.filter(w => !dismissedWarnings.has(w));

  // Only show unique warnings (no duplicates)
  const uniqueWarnings = Array.from(new Set(activeWarnings));

  // Max 2 warnings visible at once
  const visibleWarnings = uniqueWarnings.slice(0, 2);

  if (visibleWarnings.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 w-full max-w-md ${className}`}>
      {visibleWarnings.map((warning) => (
        <div
          key={warning}
          className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm animate-fade-in"
          role="alert"
        >
          {/* AlertTriangle icon */}
          <svg
            className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-sm text-amber-900 flex-1">
            {WARNING_MESSAGES[warning]}
          </p>
          <button
            onClick={() => handleDismiss(warning)}
            className="flex-shrink-0 p-1 hover:bg-amber-100 rounded transition-colors"
            aria-label="Dismiss warning"
          >
            {/* X icon */}
            <svg
              className="w-4 h-4 text-amber-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
