/**
 * VoiceLab - Voice Practice MVP
 * Main Application Component
 */

import { BrowserGate, useRecordingAllowed } from './components/BrowserGate';

function MainApp() {
  const recordingAllowed = useRecordingAllowed();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-surface-elevated">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            VoiceLab
          </h1>
          <span className="text-xs text-text-muted bg-surface px-2 py-1 rounded">
            Beta
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {recordingAllowed ? (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-surface-elevated flex items-center justify-center">
              <svg
                className="w-12 h-12 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Ready to Practice
            </h2>

            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Discover your unconscious speaking habits. Get real-time feedback on filler words and speaking pace.
            </p>

            <button
              className="bg-accent text-black px-8 py-4 rounded-lg font-semibold text-lg hover:bg-accent-hover transition-colors"
              onClick={() => {
                // Recording functionality will be implemented in Phase 2
                console.log('Start recording - Phase 2 implementation');
              }}
            >
              Start Practice Session
            </button>

            <p className="text-text-muted text-sm mt-4">
              Phase 1 Complete: Foundation ready
            </p>
          </div>
        ) : (
          <div className="text-center text-text-secondary">
            <p>Recording is not available in this browser.</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-surface-elevated bg-background">
        <div className="max-w-4xl mx-auto px-4 py-3 text-center text-text-muted text-sm">
          VoiceLab v0.1.0 • Chrome-only Beta
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserGate>
      <MainApp />
    </BrowserGate>
  );
}

export default App;
