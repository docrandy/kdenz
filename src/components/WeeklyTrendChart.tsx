import { useMemo } from 'react';
import { getWeeklyAggregates, DailyAggregate } from '../services/sessionStorage';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeeklyTrendChartProps {
  refreshKey?: number;
}

export default function WeeklyTrendChart({
  refreshKey,
}: WeeklyTrendChartProps) {
  const aggregates = useMemo(() => {
    // refreshKey forces recalculation when sessions change
    void refreshKey;
    return getWeeklyAggregates();
  }, [refreshKey]);

  const maxFillerRate = useMemo(() => {
    const rates = aggregates.map(a => a.avgFillerRate).filter(r => r > 0);
    if (rates.length === 0) return 10; // Default scale
    return Math.max(...rates, 5); // Minimum scale of 5
  }, [aggregates]);

  const hasData = aggregates.some(a => a.sessionCount > 0);

  return (
    <div className="bg-white border border-clinical-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-clinical-text">Weekly Trend</h3>
        <span className="text-xs text-clinical-muted">Fillers/min</span>
      </div>

      {!hasData ? (
        <div className="h-32 flex items-center justify-center">
          <p className="text-sm text-clinical-muted">Complete a session to see trends</p>
        </div>
      ) : (
        <div className="h-32 flex items-end justify-between gap-1">
          {aggregates.map((day, idx) => (
            <DayBar
              key={day.date}
              day={day}
              maxValue={maxFillerRate}
              isToday={idx === aggregates.length - 1}
            />
          ))}
        </div>
      )}

      {/* Day labels */}
      <div className="flex justify-between mt-2">
        {aggregates.map((day) => (
          <span
            key={day.date}
            className="text-xs text-clinical-muted w-8 text-center"
          >
            {DAY_LABELS[day.dayOfWeek]}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DayBarProps {
  day: DailyAggregate;
  maxValue: number;
  isToday: boolean;
}

function DayBar({ day, maxValue, isToday }: DayBarProps) {
  const heightPercent = day.sessionCount > 0
    ? Math.max((day.avgFillerRate / maxValue) * 100, 8) // Min 8% for visibility
    : 0;

  // Use neutral color (clinical-accent) for all bars - no judgment
  const barColor = day.sessionCount > 0
    ? 'bg-clinical-accent'
    : 'bg-gray-200';

  return (
    <div className="flex-1 flex flex-col items-center">
      <div className="w-full h-28 flex items-end justify-center">
        {day.sessionCount > 0 ? (
          <div
            className={`w-full max-w-6 rounded-t ${barColor} ${isToday ? 'ring-2 ring-clinical-accent ring-offset-1' : ''} transition-all duration-300`}
            style={{ height: `${heightPercent}%` }}
            title={`${day.avgFillerRate} fillers/min (${day.sessionCount} session${day.sessionCount > 1 ? 's' : ''})`}
          />
        ) : (
          <div
            className={`w-full max-w-6 h-1 rounded ${isToday ? 'bg-clinical-accent/30' : 'bg-gray-200'}`}
          />
        )}
      </div>
      {day.sessionCount > 0 && (
        <span className="text-xs text-clinical-muted mt-1">
          {day.avgFillerRate}
        </span>
      )}
    </div>
  );
}
