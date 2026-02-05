import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBaseline, type BaselineMetrics } from '../services/baselineStorage';

export default function BaselineResults() {
  const navigate = useNavigate();
  const [baseline, setBaseline] = useState<BaselineMetrics | null>(null);

  useEffect(() => {
    const data = getBaseline();
    if (!data) {
      // No baseline found — redirect to home
      navigate('/');
      return;
    }
    setBaseline(data);
  }, [navigate]);

  if (!baseline) {
    // Loading or redirecting
    return null;
  }

  const handleStartPracticing = () => {
    navigate('/practice/filler/setup');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-clinical-accent flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Baseline Complete</h1>
          <p className="text-lg text-gray-600">
            Here's your starting point. Future sessions will compare to these numbers.
          </p>
        </div>

        {/* Key metrics */}
        <div className="space-y-4">
          {/* WPM */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Your typical pace</p>
            <p className="text-3xl font-bold text-gray-900">
              {baseline.wpm} words per minute
            </p>
          </div>

          {/* Filler rate */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Fillers per minute</p>
            <p className="text-3xl font-bold text-gray-900">
              {baseline.fillerRate.toFixed(1)}/min
            </p>
          </div>

          {/* Duration */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-sm text-gray-500 mb-1">Baseline duration</p>
            <p className="text-3xl font-bold text-gray-900">3 min</p>
          </div>
        </div>

        {/* Start practicing button */}
        <button
          onClick={handleStartPracticing}
          className="w-full px-6 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          Start Practicing
        </button>

        {/* Small note */}
        <p className="text-xs text-gray-500 text-center">
          You can re-record your baseline anytime from Settings.
        </p>
      </div>
    </div>
  );
}
