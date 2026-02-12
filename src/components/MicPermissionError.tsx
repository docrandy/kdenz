/**
 * Mic Permission Error Component
 * Displays helpful guidance when microphone access is denied or unavailable
 */

interface MicPermissionErrorProps {
  error: string;
  onRetry: () => void;
}

function getErrorType(
  error: string,
): "denied" | "unavailable" | "in-use" | "unknown" {
  const lowerError = error.toLowerCase();
  if (lowerError.includes("denied") || lowerError.includes("permission")) {
    return "denied";
  }
  if (lowerError.includes("not found") || lowerError.includes("no device")) {
    return "unavailable";
  }
  if (lowerError.includes("in use") || lowerError.includes("busy")) {
    return "in-use";
  }
  return "unknown";
}

const errorContent = {
  denied: {
    title: "Microphone Access Denied",
    description: "VoiceLab needs microphone access to analyze your speech.",
    steps: [
      "Click the lock/camera icon in your browser address bar",
      'Find "Microphone" in the permissions list',
      'Change it from "Block" to "Allow"',
      "Refresh the page and try again",
    ],
  },
  unavailable: {
    title: "No Microphone Found",
    description: "We couldn't detect a microphone connected to your device.",
    steps: [
      "Check that your microphone is properly connected",
      "Make sure it's not muted at the hardware level",
      "Try using a different microphone or headset",
      "Restart your browser and try again",
    ],
  },
  "in-use": {
    title: "Microphone In Use",
    description: "Your microphone is being used by another application.",
    steps: [
      "Close other apps that might be using your microphone",
      "Check for video calls, voice recorders, or other audio apps",
      "Restart your browser if the issue persists",
    ],
  },
  unknown: {
    title: "Microphone Error",
    description: "Something went wrong while accessing your microphone.",
    steps: [
      "Refresh the page and try again",
      "Check your browser's microphone settings",
      "Try using a different browser (Chrome recommended)",
      "Restart your device if the issue persists",
    ],
  },
};

export default function MicPermissionError({
  error,
  onRetry,
}: MicPermissionErrorProps) {
  const errorType = getErrorType(error);
  const content = errorContent[errorType];

  return (
    <div className="bg-status-error/10 border border-status-error/30 rounded-lg p-6">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-status-error/15 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-status-error"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-status-error text-center mb-2">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-status-error text-center mb-4">
        {content.description}
      </p>

      {/* Steps */}
      <div className="bg-background-surface rounded-lg p-4 mb-4">
        <p className="text-xs font-medium text-text-muted mb-2">How to fix:</p>
        <ol className="text-sm text-text space-y-2">
          {content.steps.map((step, index) => (
            <li key={index} className="flex gap-2">
              <span className="flex-shrink-0 w-5 h-5 bg-background-elevated rounded-full text-xs flex items-center justify-center text-text-subtle">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Retry button */}
      <button onClick={onRetry} className="btn-primary w-full">
        Try Again
      </button>

      {/* Technical error */}
      <p className="text-xs text-text-subtle text-center mt-3">
        Error: {error}
      </p>
    </div>
  );
}
