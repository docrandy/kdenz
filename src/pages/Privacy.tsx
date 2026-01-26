/**
 * Privacy Page
 * Transparent explanation of data handling and privacy practices
 */

import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-clinical-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-clinical-muted hover:text-clinical-accent mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to practice
        </Link>

        <div className="bg-white border border-clinical-border rounded-lg p-6 sm:p-8">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl font-bold text-clinical-text mb-2">
            Privacy & Your Data
          </h1>
          <p className="text-clinical-muted mb-8">
            We believe in complete transparency about how your data is handled.
          </p>

          {/* Key points */}
          <div className="space-y-6">
            {/* Local Processing */}
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-clinical-text">Audio stays on your device</h3>
                  <p className="text-sm text-clinical-muted mt-1">
                    Your voice recordings are processed entirely in your browser using Chrome's
                    built-in speech recognition. Audio never leaves your device and is never
                    sent to our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* No Emotion Detection */}
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-clinical-text">No emotion or sentiment analysis</h3>
                  <p className="text-sm text-clinical-muted mt-1">
                    We don't analyze your emotions, tone, or sentiment. We only count filler words
                    and measure speaking pace. Nothing more.
                  </p>
                </div>
              </div>
            </section>

            {/* What Gemini Sees */}
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-clinical-text">AI Summary (optional)</h3>
                  <p className="text-sm text-clinical-muted mt-1">
                    If you choose to generate an AI coaching summary, only your <strong>transcript text</strong> and
                    <strong> session metrics</strong> (word count, filler count, pace) are sent to Google's Gemini API.
                    No audio is ever sent.
                  </p>
                  <p className="text-sm text-clinical-muted mt-2">
                    You can skip AI summaries entirely and still get local analysis of your session.
                  </p>
                </div>
              </div>
            </section>

            {/* No Training */}
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-clinical-text">Not used for AI training</h3>
                  <p className="text-sm text-clinical-muted mt-1">
                    Your data is never used to train AI models. We use the Gemini API in a way that
                    explicitly opts out of data retention for model improvement.
                  </p>
                </div>
              </div>
            </section>

            {/* Local Storage */}
            <section>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-clinical-text">Session history stored locally</h3>
                  <p className="text-sm text-clinical-muted mt-1">
                    Your session summaries (metrics only, not transcripts) are stored in your browser's
                    local storage to show your weekly trends. This data never leaves your device.
                  </p>
                  <p className="text-sm text-clinical-muted mt-2">
                    Clear your browser data anytime to delete all stored information.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Comparison note */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-clinical-muted">
              <strong>Why this matters:</strong> Some voice coaching apps have faced criticism for
              unclear data practices. We designed VoiceLab with privacy-first principles from day one.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-8 pt-6 border-t border-clinical-border">
            <p className="text-sm text-clinical-muted">
              Questions about privacy? Reach out via the feedback button or email us at{' '}
              <a href="mailto:privacy@voicelab.app" className="text-clinical-accent hover:underline">
                privacy@voicelab.app
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
