/**
 * ContributionHeatmap - GitHub-style activity heatmap
 * Shows 12 weeks of practice session frequency
 */

import { useMemo, useState } from "react";
import { getSessionsByDate } from "../services/sessionStorage";

interface DayData {
  date: string;
  count: number;
  dayOfWeek: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getColorClass(count: number): string {
  if (count === 0) return "bg-background-elevated";
  if (count === 1) return "bg-accent/30";
  if (count === 2) return "bg-accent/60";
  return "bg-accent";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function ContributionHeatmap() {
  const [tooltip, setTooltip] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const { grid, weeks } = useMemo(() => {
    const sessionsByDate = getSessionsByDate();
    const today = new Date();
    const data: DayData[] = [];

    // Generate 84 days (12 weeks) of data
    for (let i = 83; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const sessions = sessionsByDate.get(dateString) || [];

      data.push({
        date: dateString,
        count: sessions.length,
        dayOfWeek: date.getDay(),
      });
    }

    // Organize into weeks (columns)
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];

    // Fill in empty days at the start of the first week
    const firstDayOfWeek = data[0]?.dayOfWeek || 0;
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", count: -1, dayOfWeek: i });
    }

    data.forEach((day) => {
      if (day.dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });

    if (currentWeek.length > 0) {
      // Fill remaining days in the last week
      while (currentWeek.length < 7) {
        currentWeek.push({
          date: "",
          count: -1,
          dayOfWeek: currentWeek.length,
        });
      }
      weeks.push(currentWeek);
    }

    return { grid: data, weeks };
  }, []);

  const handleMouseEnter = (day: DayData, event: React.MouseEvent) => {
    if (day.count >= 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        date: day.date,
        count: day.count,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div>
      <h3 className="text-body-sm font-display font-semibold text-text-heading mb-4">Practice Frequency</h3>

      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {[0, 2, 4, 6].map((i) => (
            <div
              key={i}
              className="h-3 text-[10px] text-text-subtle leading-3"
              style={{ marginTop: i === 0 ? 0 : "4px" }}
            >
              {i % 2 === 0 ? DAY_LABELS[i].charAt(0) : ""}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${
                    day.count < 0 ? "bg-transparent" : getColorClass(day.count)
                  } ${day.date === grid[grid.length - 1]?.date ? "ring-1 ring-accent" : ""}`}
                  onMouseEnter={(e) => handleMouseEnter(day, e)}
                  onMouseLeave={handleMouseLeave}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 text-caption text-text-muted">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-background-elevated" />
        <div className="w-3 h-3 rounded-sm bg-accent/30" />
        <div className="w-3 h-3 rounded-sm bg-accent/60" />
        <div className="w-3 h-3 rounded-sm bg-accent" />
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-background-surface text-text-body text-caption px-3 py-2 rounded-lg pointer-events-none transform -translate-x-1/2 -translate-y-full border border-background-elevated shadow-lg"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold text-text-heading">
            {tooltip.count} session{tooltip.count !== 1 ? "s" : ""}
          </div>
          <div className="text-text-muted">
            {formatDate(tooltip.date)}
          </div>
        </div>
      )}
    </div>
  );
}
