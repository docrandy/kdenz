/**
 * Speaking Prompts
 * Optional scenarios adapted from Black Swan for practice sessions
 */

export interface SpeakingPrompt {
  id: string;
  title: string;
  category: 'professional' | 'personal' | 'creative';
  duration: 'short' | 'medium'; // short = 30-60s, medium = 60-90s
  prompt: string;
  tips?: string[];
}

export const speakingPrompts: SpeakingPrompt[] = [
  {
    id: 'elevator-pitch',
    title: 'Your Elevator Pitch',
    category: 'professional',
    duration: 'short',
    prompt:
      "Imagine you're in an elevator with someone who could help your career. You have 30 seconds to introduce yourself and what you do. What would you say?",
    tips: [
      'Start with your name and role',
      'Focus on the value you provide',
      'End with what makes you unique',
    ],
  },
  {
    id: 'explain-concept',
    title: 'Explain Like I\'m Five',
    category: 'creative',
    duration: 'medium',
    prompt:
      'Pick something you know well (your job, a hobby, a topic you\'re passionate about) and explain it as if you\'re talking to a curious 5-year-old. Keep it simple and engaging.',
    tips: [
      'Use simple words and analogies',
      'Break complex ideas into small pieces',
      'Make it fun and relatable',
    ],
  },
  {
    id: 'meeting-update',
    title: 'Project Status Update',
    category: 'professional',
    duration: 'medium',
    prompt:
      "You're in a team meeting and it's your turn to give a status update on your current project. Share what you've accomplished, what's next, and any blockers.",
    tips: [
      'Structure: Done, Doing, Blockers',
      'Be specific with accomplishments',
      'Keep it concise and actionable',
    ],
  },
  {
    id: 'tell-story',
    title: 'A Memorable Experience',
    category: 'personal',
    duration: 'medium',
    prompt:
      'Tell a short story about a memorable experience - it could be a trip, a challenge you overcame, or something that changed your perspective.',
    tips: [
      'Set the scene briefly',
      'Focus on one key moment',
      'Share what you learned or felt',
    ],
  },
  {
    id: 'disagree-respectfully',
    title: 'Respectful Disagreement',
    category: 'professional',
    duration: 'short',
    prompt:
      "Imagine a colleague proposes an idea you disagree with. Practice expressing your different viewpoint respectfully while acknowledging their perspective.",
    tips: [
      'Start by acknowledging their point',
      'Use "I" statements for your view',
      'Focus on the idea, not the person',
    ],
  },
];

/**
 * Get prompts filtered by category
 */
export function getPromptsByCategory(category: SpeakingPrompt['category']): SpeakingPrompt[] {
  return speakingPrompts.filter((p) => p.category === category);
}

/**
 * Get prompts filtered by duration
 */
export function getPromptsByDuration(duration: SpeakingPrompt['duration']): SpeakingPrompt[] {
  return speakingPrompts.filter((p) => p.duration === duration);
}

/**
 * Get a random prompt
 */
export function getRandomPrompt(): SpeakingPrompt {
  const index = Math.floor(Math.random() * speakingPrompts.length);
  return speakingPrompts[index];
}
