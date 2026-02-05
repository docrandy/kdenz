/**
 * Scorecard Component
 * Post-session metrics summary using MetricCard components
 * Displays baseline deltas and uncertainty per core principles #2 and #3
 */

import MetricCard from './MetricCard';
import type { BaselineMetrics } from '../services/baselineStorage';

interface ScorecardProps {
  wpm: number;
  wordCount: number;
  fillerCount: number;
  fillerRate: number;
  durationSeconds: number;
  baseline?: BaselineMetrics | null;
  fillerBreakdown?: { word: string; count: number }[];
}

function FillerBreakdown({ breakdown }: { breakdown: { word: string; count: number }[] }) {
  if (!breakdown || breakdown.length === 0) return null;

  return (
    <div className="text-sm text-clinical-muted">
      You used: {breakdown.map((item, index) => (
        <span key={item.word}>
          {index > 0 && ', '}
          <span className="font-medium">'{item.word}'</span> {item.count}x
        </span>
      ))}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export default function Scorecard({
  wpm,
  wordCount,
  fillerCount,
  fillerRate,
  durationSeconds,
  baseline,
  fillerBreakdown
}: ScorecardProps) {
  // Estimated confidence intervals (heuristic based on session length)
  // Longer sessions = tighter confidence
  const wpmCI = durationSeconds < 60 ? 15 : durationSeconds < 120 ? 10 : 5;
  const fillerCI = durationSeconds < 60 ? 1.5 : durationSeconds < 120 ? 1.0 : 0.5;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-clinical-text">Session Scorecard</h3>

      {/* Speech Rate Card */}
      <MetricCard
        label="Speech Rate"
        value={wpm}
        unit="WPM"
        baseline={baseline?.wpm}
        confidenceInterval={wpmCI}
        contextNote="Note: Accuracy is highest in quiet environments. Background noise can widen the margin of error."
        reflectionPrompt="What do you think drove the pace in this section?"
      />

      {/* Filler Words Card */}
      <MetricCard
        label="Filler Words"
        value={fillerRate}
        unit="per minute"
        baseline={baseline?.fillerRate}
        confidenceInterval={fillerCI}
        details={fillerBreakdown && <FillerBreakdown breakdown={fillerBreakdown} />}
        contextNote="Context note: Fillers are common in conversational speech. In more formal settings, they may be more noticeable."
        reflectionPrompt="Did you feel more time-pressure or uncertainty in this part?"
      />

      {/* Summary stats row */}
      <div className="flex justify-between text-sm text-clinical-muted pt-2 border-t border-clinical-border">
        <span>{wordCount} words</span>
        <span>{fillerCount} fillers total</span>
        <span>{formatDuration(durationSeconds)}</span>
      </div>
    </div>
  );
}
