interface BrowserWarningProps {
  browserName: string;
  onDismiss: () => void;
}

export default function BrowserWarning({ browserName, onDismiss }: BrowserWarningProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-6">
      <div className="max-w-lg text-center">
        {/* Warning Icon */}
        <div className="mb-6 flex justify-center">
          <svg
            className="w-20 h-20 text-clinical-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-clinical-text mb-4">
          Chrome Required
        </h1>

        {/* Main Message */}
        <p className="text-lg text-clinical-muted mb-4">
          VoiceLab uses Chrome's Web Speech API for accurate voice transcription.
          Safari and Firefox have significant accuracy issues that would hurt your practice experience.
        </p>

        {/* Subtext */}
        <p className="text-base text-clinical-muted mb-6">
          Please open this page in <span className="font-semibold">Google Chrome</span> for the best results.
        </p>

        {/* Detected Browser */}
        <p className="text-sm text-clinical-muted mb-8">
          You're currently using: <span className="font-semibold">{browserName}</span>
        </p>

        {/* Continue Anyway Button (for testing) */}
        <button
          onClick={() => {
            console.warn('⚠️ User continuing on non-Chrome browser:', browserName);
            onDismiss();
          }}
          className="px-6 py-3 bg-clinical-accent text-white rounded-lg hover:bg-clinical-accent-hover transition-colors"
        >
          Continue Anyway (Not Recommended)
        </button>
      </div>
    </div>
  );
}
