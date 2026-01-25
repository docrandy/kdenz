/**
 * Browser Gate Component
 *
 * Shows warning banner for non-Chrome browsers and blocks
 * access to recording features.
 */

import { detectBrowser, checkBrowserCapabilities } from '../lib/browserDetect';
import type { BrowserInfo } from '../lib/browserDetect';

interface BrowserGateProps {
  children: React.ReactNode;
}

const browserInfo: BrowserInfo = detectBrowser();
const capabilities = checkBrowserCapabilities();

function BrowserWarningBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-warning/90 text-black px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <p className="font-semibold">Chrome Required</p>
            <p className="text-sm opacity-90">
              VoiceLab works best in Google Chrome. Other browsers have known speech recognition issues.
            </p>
          </div>
        </div>
        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Get Chrome
        </a>
      </div>
    </div>
  );
}

function UnsupportedBrowserScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-surface-elevated flex items-center justify-center">
          <svg
            className="w-10 h-10 text-warning"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Chrome Required
        </h1>

        <p className="text-text-secondary mb-6">
          VoiceLab uses advanced audio features that only work reliably in Google Chrome.
          Safari and Firefox have known issues with speech recognition accuracy.
        </p>

        <p className="text-text-muted text-sm mb-8">
          Detected browser: <span className="capitalize">{browserInfo.type}</span>
          {browserInfo.version && ` (v${browserInfo.version})`}
        </p>

        <a
          href="https://www.google.com/chrome/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent text-black px-6 py-3 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
          Download Chrome
        </a>

        {!capabilities.allSupported && (
          <div className="mt-8 p-4 bg-surface rounded-lg text-left">
            <p className="text-text-secondary text-sm">
              <strong>Missing capabilities:</strong>
            </p>
            <ul className="text-text-muted text-sm mt-2 space-y-1">
              {!capabilities.hasGetUserMedia && <li>• Microphone access (getUserMedia)</li>}
              {!capabilities.hasAudioContext && <li>• Audio processing (AudioContext)</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export function BrowserGate({ children }: BrowserGateProps) {
  // Chrome users: show app normally
  if (browserInfo.isSupported) {
    return <>{children}</>;
  }

  // Non-Chrome users: show warning and block recording features
  return (
    <>
      <BrowserWarningBanner />
      <div className="pt-20">
        <UnsupportedBrowserScreen />
      </div>
    </>
  );
}

/**
 * Hook to check if recording is allowed
 */
export function useRecordingAllowed(): boolean {
  return browserInfo.isSupported && capabilities.allSupported;
}

/**
 * Export browser info for other components
 */
export { browserInfo, capabilities };
