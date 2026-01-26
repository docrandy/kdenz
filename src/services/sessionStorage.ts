const STORAGE_KEY = 'voicelab_sessions';

export interface SessionSummary {
  id: string;
  timestamp: number;
  date: string; // YYYY-MM-DD
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
}

export interface DailyAggregate {
  date: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  sessionCount: number;
  avgWpm: number;
  avgFillerRate: number;
  totalFillers: number;
  totalWords: number;
  totalDuration: number;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getDateString(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function saveSession(data: Omit<SessionSummary, 'id' | 'timestamp' | 'date'>): SessionSummary {
  const sessions = getAllSessions();
  const timestamp = Date.now();

  const session: SessionSummary = {
    ...data,
    id: generateId(),
    timestamp,
    date: getDateString(timestamp),
  };

  sessions.push(session);

  // Keep only last 30 days of sessions
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const filtered = sessions.filter(s => s.timestamp > thirtyDaysAgo);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

  return session;
}

export function getAllSessions(): SessionSummary[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as SessionSummary[];
  } catch {
    return [];
  }
}

export function getWeeklyAggregates(): DailyAggregate[] {
  const sessions = getAllSessions();
  const now = new Date();

  // Get dates for last 7 days (today and 6 days before)
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(getDateString(d.getTime()));
  }

  // Aggregate sessions by date
  const aggregates: DailyAggregate[] = dates.map(date => {
    const daySessions = sessions.filter(s => s.date === date);
    const d = new Date(date + 'T12:00:00');

    if (daySessions.length === 0) {
      return {
        date,
        dayOfWeek: d.getDay(),
        sessionCount: 0,
        avgWpm: 0,
        avgFillerRate: 0,
        totalFillers: 0,
        totalWords: 0,
        totalDuration: 0,
      };
    }

    const totalFillers = daySessions.reduce((sum, s) => sum + s.fillerCount, 0);
    const totalWords = daySessions.reduce((sum, s) => sum + s.wordCount, 0);
    const totalDuration = daySessions.reduce((sum, s) => sum + s.durationSeconds, 0);
    const avgWpm = daySessions.reduce((sum, s) => sum + s.wpm, 0) / daySessions.length;
    const avgFillerRate = daySessions.reduce((sum, s) => sum + s.fillerRate, 0) / daySessions.length;

    return {
      date,
      dayOfWeek: d.getDay(),
      sessionCount: daySessions.length,
      avgWpm: Math.round(avgWpm),
      avgFillerRate: Math.round(avgFillerRate * 10) / 10,
      totalFillers,
      totalWords,
      totalDuration,
    };
  });

  return aggregates;
}

export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY);
}
