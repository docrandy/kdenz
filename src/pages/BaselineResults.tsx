import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBaseline, type BaselineMetrics } from "../services/baselineStorage";

export default function BaselineResults() {
  const navigate = useNavigate();
  const [baseline, setBaseline] = useState<BaselineMetrics | null>(null);

  useEffect(() => {
    const data = getBaseline();
    if (!data) {
      // No baseline found — redirect to home
      navigate("/");
      return;
    }
    setBaseline(data);
  }, [navigate]);

  if (!baseline) {
    // Loading or redirecting
    return null;
  }

  const handleStartPracticing = () => {
    navigate("/practice/filler/setup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <svg
                className="w-8 h-8 text-text-inverse"
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
          <h1 className="text-h3 font-bold text-text mb-2">
            Baseline Complete
          </h1>
          <p className="text-body-lg text-text-muted">
            Here's your starting point. Future sessions will compare to these
            numbers.
          </p>
        </div>

        {/* Key metrics */}
        <div className="space-y-4">
          {/* WPM */}
          <div className="bg-background-surface border border-background-elevated rounded-lg p-6">
            <p className="text-body-sm text-text-muted mb-1">Your typical pace</p>
            <p className="text-h3 font-bold text-text">
              {baseline.wpm} words per minute
            </p>
          </div>

          {/* Filler rate */}
          <div className="bg-background-surface border border-background-elevated rounded-lg p-6">
            <p className="text-body-sm text-text-muted mb-1">Fillers per minute</p>
            <p className="text-h3 font-bold text-text">
              {baseline.fillerRate.toFixed(1)}/min
            </p>
          </div>

          {/* Duration */}
          <div className="bg-background-surface border border-background-elevated rounded-lg p-6">
            <p className="text-body-sm text-text-muted mb-1">Baseline duration</p>
            <p className="text-h3 font-bold text-text">3 min</p>
          </div>
        </div>

        {/* Start practicing button */}
        <button
          onClick={handleStartPracticing}
          className="btn-primary w-full text-body-lg"
        >
          Start Practicing
        </button>

        {/* Small note */}
        <p className="text-caption text-text-muted text-center">
          You can re-record your baseline anytime from Settings.
        </p>
      </div>
    </div>
  );
}
