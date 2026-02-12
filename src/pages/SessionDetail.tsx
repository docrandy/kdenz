/**
 * SessionDetail - View details of a past practice session
 */

import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById } from '../services/sessionStorage';

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function getFillerRateColor(rate: number): string {
  if (rate <= 2) return 'text-status-success';
  if (rate <= 4) return 'text-status-warning';
  return 'text-status-error';
}

export function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const session = sessionId ? getSessionById(sessionId) : null;

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-h5 font-semibold text-text mb-2">Session Not Found</h1>
          <p className="text-text-muted mb-4">This session may have expired or been deleted.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 btn-primary rounded-lg text-body-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b border-background-elevated z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-text-muted hover:text-text"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-body-lg font-semibold text-text">Session Details</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Date/Time */}
        <div className="mb-6">
          <p className="text-body-sm text-text-muted">Session recorded</p>
          <p className="text-body-lg font-medium text-text">{formatDate(session.timestamp)}</p>
        </div>

        {/* Primary Metric */}
        <div className="bg-background-surface rounded-xl p-6 mb-6">
          <p className="text-body-sm text-text-muted mb-1">Filler Rate</p>
          <p className={`text-h2 font-bold ${getFillerRateColor(session.fillerRate)}`}>
            {session.fillerRate.toFixed(1)}%
          </p>
          <p className="text-body-sm text-text-muted mt-1">fillers per 100 words</p>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-background border border-background-elevated rounded-xl p-4 text-center">
            <p className="text-h4 font-semibold text-text">{session.wpm}</p>
            <p className="text-caption text-text-muted">WPM</p>
          </div>
          <div className="bg-background border border-background-elevated rounded-xl p-4 text-center">
            <p className="text-h4 font-semibold text-text">{session.wordCount}</p>
            <p className="text-caption text-text-muted">Words</p>
          </div>
          <div className="bg-background border border-background-elevated rounded-xl p-4 text-center">
            <p className="text-h4 font-semibold text-text">{session.fillerCount}</p>
            <p className="text-caption text-text-muted">Fillers</p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-background border border-background-elevated rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-text-muted">Duration</span>
            <span className="text-body-sm font-medium text-text">{formatDuration(session.durationSeconds)}</span>
          </div>
        </div>

        {/* Note about playback */}
        <div className="text-center text-body-sm text-text-subtle mt-8">
          Audio playback is only available immediately after a session.
        </div>
      </main>
    </div>
  );
}
