/**
 * Diagnostic Questions
 * Light diagnostics from Volitional framework to understand user's speaking challenges
 */

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    insight: string; // Used to contextualize AI summary
  }[];
}

export interface DiagnosticResult {
  questionId: string;
  selectedValue: string;
  insight: string;
  timestamp: number;
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 'primary-challenge',
    question: "What's your biggest speaking challenge?",
    options: [
      {
        value: 'fillers',
        label: 'Using too many filler words (um, like, you know)',
        insight: 'User is aware of filler word usage and wants to reduce it',
      },
      {
        value: 'pace',
        label: 'Speaking too fast or too slow',
        insight: 'User struggles with pacing and wants to find optimal speed',
      },
      {
        value: 'confidence',
        label: 'Feeling nervous or lacking confidence',
        insight: 'User experiences anxiety when speaking',
      },
      {
        value: 'clarity',
        label: 'Organizing thoughts clearly',
        insight: 'User wants to improve message clarity and structure',
      },
    ],
  },
  {
    id: 'context',
    question: 'Where do you most want to improve?',
    options: [
      {
        value: 'work-meetings',
        label: 'Work meetings and presentations',
        insight: 'Professional context - stakes feel high',
      },
      {
        value: 'interviews',
        label: 'Job interviews',
        insight: 'High-pressure evaluation situations',
      },
      {
        value: 'social',
        label: 'Social conversations',
        insight: 'Casual but wants to come across better',
      },
      {
        value: 'public',
        label: 'Public speaking or large groups',
        insight: 'Audience size increases pressure',
      },
    ],
  },
  {
    id: 'awareness',
    question: 'How aware are you of your speaking habits?',
    options: [
      {
        value: 'very-aware',
        label: 'Very aware - I notice them in the moment',
        insight: 'High self-awareness, may need strategies not just awareness',
      },
      {
        value: 'somewhat',
        label: 'Somewhat - I notice after the fact',
        insight: 'Developing awareness, real-time feedback will help',
      },
      {
        value: 'others-tell',
        label: 'Only when others point it out',
        insight: 'Low self-awareness, will benefit most from feedback',
      },
      {
        value: 'not-sure',
        label: 'Not sure - that\'s why I\'m here',
        insight: 'Discovery phase, first session will be eye-opening',
      },
    ],
  },
  {
    id: 'goal',
    question: 'What would success look like for you?',
    options: [
      {
        value: 'reduce-fillers',
        label: 'Noticeably fewer filler words',
        insight: 'Concrete metric-focused goal',
      },
      {
        value: 'feel-confident',
        label: 'Feeling more confident when speaking',
        insight: 'Emotional/internal goal',
      },
      {
        value: 'positive-feedback',
        label: 'Getting positive feedback from others',
        insight: 'External validation focused',
      },
      {
        value: 'natural',
        label: 'Speaking more naturally without overthinking',
        insight: 'Wants to reduce cognitive load while speaking',
      },
    ],
  },
];

/**
 * Get summary insights from diagnostic results for AI context
 */
export function summarizeInsights(results: DiagnosticResult[]): string {
  if (results.length === 0) return '';

  const insights = results.map((r) => r.insight).filter(Boolean);
  return insights.join('. ') + '.';
}

/**
 * Storage key for diagnostic results
 */
export const DIAGNOSTIC_STORAGE_KEY = 'voicelab_diagnostic';

/**
 * Save diagnostic results to localStorage
 */
export function saveDiagnosticResults(results: DiagnosticResult[]): void {
  try {
    localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(results));
  } catch {
    // Storage not available
  }
}

/**
 * Load diagnostic results from localStorage
 */
export function loadDiagnosticResults(): DiagnosticResult[] {
  try {
    const stored = localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Check if diagnostics were completed
 */
export function hasDiagnosticResults(): boolean {
  return loadDiagnosticResults().length > 0;
}

/**
 * Check if re-diagnostic is due (e.g., after 7 days)
 */
export function isReDiagnosticDue(daysInterval: number = 7): boolean {
  const results = loadDiagnosticResults();
  if (results.length === 0) return true;

  const lastTimestamp = Math.max(...results.map((r) => r.timestamp));
  const daysSince = (Date.now() - lastTimestamp) / (1000 * 60 * 60 * 24);

  return daysSince >= daysInterval;
}
