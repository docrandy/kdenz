/**
 * Scorecard Component
 * Post-session metrics summary with visual indicators
 */

interface ScorecardProps {
  wpm: number;
  wordCount: number;
  fillerCount: number;
  fillerRate: number;
  durationSeconds: number;
  thresholdGood?: number;
  thresholdWarning?: number;
}

function getFillerRateColor(rate: number, good: number, warning: number): string {
  if (rate <= good) return 'text-green-600';
  if (rate <= warning) return 'text-yellow-600';
  return 'text-red-600';
}

function getFillerRateLabel(rate: number, good: number, warning: number): string {
  if (rate <= good) return 'Excellent';
  if (rate <= warning) return 'Good';
  return 'Needs Work';
}

function getWpmLabel(wpm: number): string {
  if (wpm < 100) return 'Slow';
  if (wpm <= 150) return 'Conversational';
  if (wpm <= 180) return 'Energetic';
  return 'Fast';
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

export default function Scorecard({
  wpm,
  wordCount,
  fillerCount,
  fillerRate,
  durationSeconds,
  thresholdGood = 2,
  thresholdWarning = 5,
}: ScorecardProps) {
  const fillerRateColor = getFillerRateColor(fillerRate, thresholdGood, thresholdWarning);
  const fillerRateLabel = getFillerRateLabel(fillerRate, thresholdGood, thresholdWarning);
  const wpmLabel = getWpmLabel(wpm);

  return (
    <div className="bg-white border border-clinical-border rounded-lg p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-clinical-text">Session Scorecard</h3>
        <span className="text-sm text-clinical-muted">{formatDuration(durationSeconds)}</span>
      </div>

      {/* Primary metric - Filler Rate */}
      <div className="mb-5 p-4 bg-gray-50 rounded-lg text-center">
        <div className={`text-4xl font-bold ${fillerRateColor}`}>
          {fillerRate.toFixed(1)}
        </div>
        <div className="text-sm text-clinical-muted mt-1">fillers per minute</div>
        <div className={`text-xs font-medium mt-2 ${fillerRateColor}`}>
          {fillerRateLabel}
        </div>
      </div>

      {/* Secondary metrics grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* WPM */}
        <div className="text-center">
          <div className="text-2xl font-bold text-clinical-text">{wpm}</div>
          <div className="text-xs text-clinical-muted mt-1">WPM</div>
          <div className="text-xs text-clinical-accent mt-0.5">{wpmLabel}</div>
        </div>

        {/* Word Count */}
        <div className="text-center">
          <div className="text-2xl font-bold text-clinical-text">{wordCount}</div>
          <div className="text-xs text-clinical-muted mt-1">Words</div>
        </div>

        {/* Filler Count */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${fillerRateColor}`}>{fillerCount}</div>
          <div className="text-xs text-clinical-muted mt-1">Fillers</div>
        </div>
      </div>

      {/* Visual divider */}
      <div className="mt-4 pt-4 border-t border-clinical-border">
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i < Math.ceil((1 - Math.min(fillerRate / 10, 1)) * 5)
                  ? 'bg-clinical-accent'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-clinical-muted text-center mt-2">
          Performance indicator
        </p>
      </div>
    </div>
  );
}
