/**
 * Gemini Service
 * Handles AI coaching summary generation with graceful fallback
 */

import { formatLocalSummary, type SessionStats } from '../lib/localStatsFormatter';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
  error?: {
    message: string;
  };
}

interface SummaryRequest {
  transcript: string;
  stats: SessionStats;
  fillerWords: { word: string; count: number }[];
}

function buildPrompt(request: SummaryRequest): string {
  const { transcript, stats, fillerWords } = request;
  const { wpm, wordCount, fillerCount, fillerRate, durationSeconds } = stats;

  const fillerList =
    fillerWords.length > 0
      ? fillerWords.map((f) => `"${f.word}" (${f.count}x)`).join(', ')
      : 'none detected';

  return `You are a supportive voice coach analyzing a practice session. Provide brief, actionable feedback.

SESSION DATA:
- Duration: ${durationSeconds} seconds
- Words spoken: ${wordCount}
- Speaking pace: ${wpm} WPM
- Filler words: ${fillerCount} total (${fillerRate.toFixed(1)} per minute)
- Filler breakdown: ${fillerList}

TRANSCRIPT:
"${transcript.slice(0, 1500)}"${transcript.length > 1500 ? '...' : ''}

Provide a 2-3 sentence coaching summary that:
1. Acknowledges what went well (be specific if possible)
2. Identifies the primary area for improvement
3. Gives one concrete tip they can try next session

Keep the tone encouraging but honest. Be concise.`;
}

/**
 * Generate AI coaching summary using Gemini
 * Falls back to local stats formatting if API fails
 */
export async function generateCoachingSummary(
  request: SummaryRequest,
  apiKey: string | null
): Promise<{ summary: string; isAI: boolean }> {
  // No API key - use local fallback
  if (!apiKey) {
    return {
      summary: formatLocalSummary({
        ...request.stats,
        topFillerWords: request.fillerWords,
      }),
      isAI: false,
    };
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: buildPrompt(request) }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API error:', response.status);
      return {
        summary: formatLocalSummary({
          ...request.stats,
          topFillerWords: request.fillerWords,
        }),
        isAI: false,
      };
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      console.warn('Gemini API returned error:', data.error.message);
      return {
        summary: formatLocalSummary({
          ...request.stats,
          topFillerWords: request.fillerWords,
        }),
        isAI: false,
      };
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn('Gemini API returned empty response');
      return {
        summary: formatLocalSummary({
          ...request.stats,
          topFillerWords: request.fillerWords,
        }),
        isAI: false,
      };
    }

    return {
      summary: text.trim(),
      isAI: true,
    };
  } catch (error) {
    console.warn('Gemini API request failed:', error);
    return {
      summary: formatLocalSummary({
        ...request.stats,
        topFillerWords: request.fillerWords,
      }),
      isAI: false,
    };
  }
}

/**
 * Validate API key format (basic check)
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.length >= 30 && /^[A-Za-z0-9_-]+$/.test(key);
}

/**
 * Get API key from localStorage
 */
export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem('voicelab_gemini_key');
  } catch {
    return null;
  }
}

/**
 * Store API key in localStorage
 */
export function storeApiKey(key: string): void {
  try {
    localStorage.setItem('voicelab_gemini_key', key);
  } catch {
    // Storage not available
  }
}

/**
 * Remove stored API key
 */
export function removeApiKey(): void {
  try {
    localStorage.removeItem('voicelab_gemini_key');
  } catch {
    // Storage not available
  }
}
