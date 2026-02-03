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
  if (rate <= 2) return 'text-green-600';
  if (rate <= 4) return 'text-yellow-600';
  return 'text-red-600';
}

export function SessionDetail() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const session = sessionId ? getSessionById(sessionId) : null;

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Session Not Found</h1>
          <p className="text-gray-500 mb-4">This session may have expired or been deleted.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Session Details</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Date/Time */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">Session recorded</p>
          <p className="text-lg font-medium text-gray-900">{formatDate(session.timestamp)}</p>
        </div>

        {/* Primary Metric */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-500 mb-1">Filler Rate</p>
          <p className={`text-4xl font-bold ${getFillerRateColor(session.fillerRate)}`}>
            {session.fillerRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">fillers per 100 words</p>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{session.wpm}</p>
            <p className="text-xs text-gray-500">WPM</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{session.wordCount}</p>
            <p className="text-xs text-gray-500">Words</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-semibold text-gray-900">{session.fillerCount}</p>
            <p className="text-xs text-gray-500">Fillers</p>
          </div>
        </div>

        {/* Duration */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Duration</span>
            <span className="text-sm font-medium text-gray-900">{formatDuration(session.durationSeconds)}</span>
          </div>
        </div>

        {/* Note about playback */}
        <div className="text-center text-sm text-gray-400 mt-8">
          Audio playback is only available immediately after a session.
        </div>
      </main>
    </div>
  );
}
