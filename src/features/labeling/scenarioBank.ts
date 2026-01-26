/**
 * Labeling Practice Scenarios
 * Based on Chris Voss research - each scenario has surface emotion vs underlying driver
 */

import type { LabelingScenario } from './types';

export const LABELING_SCENARIOS: LabelingScenario[] = [
  // ===== SALARY NEGOTIATION =====
  {
    id: 'salary-001',
    context: 'You asked your manager for a 15% raise. They pause and respond:',
    statement: "I don't know if we can make that work right now.",
    surfaceEmotion: 'hesitant, uncertain',
    underlyingDriver: 'worried about setting a precedent or facing leadership pressure',
    expertLabel: "It sounds like you're concerned this could set a precedent that's hard to manage.",
    category: 'salary-negotiation',
    difficulty: 'beginner',
  },
  {
    id: 'salary-002',
    context: 'During your compensation discussion, your manager looks at the number and says:',
    statement: "That's quite a bit more than we budgeted for this role.",
    surfaceEmotion: 'surprised, concerned',
    underlyingDriver: 'worried about justifying this to leadership or HR',
    expertLabel: "It seems like you're worried about how to justify this number above you.",
    category: 'salary-negotiation',
    difficulty: 'beginner',
  },
  {
    id: 'salary-003',
    context: 'After presenting your case for a promotion, your manager says:',
    statement: "Let me think about it and get back to you.",
    surfaceEmotion: 'uncertain, stalling',
    underlyingDriver: 'needs to maintain control, doesn\'t want to commit without checking options',
    expertLabel: "It sounds like you want to make sure you're making the right call here.",
    category: 'salary-negotiation',
    difficulty: 'intermediate',
  },
  {
    id: 'salary-004',
    context: 'You mention a competing offer during negotiation. Your manager\'s tone shifts:',
    statement: "Well, if you think that's a better opportunity...",
    surfaceEmotion: 'defensive, dismissive',
    underlyingDriver: 'feels threatened, worried about losing leverage or respect',
    expertLabel: "It seems like this feels like I'm putting you in an uncomfortable position.",
    category: 'salary-negotiation',
    difficulty: 'advanced',
  },

  // ===== SAYING NO =====
  {
    id: 'sayno-001',
    context: 'A colleague approaches you about a project with a tight deadline:',
    statement: "I really need you on this project. You're the only one who can do it.",
    surfaceEmotion: 'desperate, pressuring',
    underlyingDriver: 'worried about their own deadline and reputation',
    expertLabel: "It sounds like you're under a lot of pressure to deliver this.",
    category: 'saying-no',
    difficulty: 'beginner',
  },
  {
    id: 'sayno-002',
    context: 'A friend asks to borrow money again. When you hesitate, they say:',
    statement: "But you've always helped me before. I thought I could count on you.",
    surfaceEmotion: 'disappointed, guilt-tripping',
    underlyingDriver: 'fears losing reliable support, feels vulnerable',
    expertLabel: "It seems like you're worried about what it means if I say no this time.",
    category: 'saying-no',
    difficulty: 'intermediate',
  },
  {
    id: 'sayno-003',
    context: 'Your boss asks you to work the weekend again. You mention you have plans:',
    statement: "This is really important. The team is counting on you.",
    surfaceEmotion: 'pressuring, urgent',
    underlyingDriver: 'worried about project failure reflecting on them',
    expertLabel: "It sounds like there's a lot riding on this for you personally.",
    category: 'saying-no',
    difficulty: 'intermediate',
  },
  {
    id: 'sayno-004',
    context: 'A client asks for additional work outside the agreed scope:',
    statement: "I thought this would be included. We\'ve been working together for years.",
    surfaceEmotion: 'entitled, disappointed',
    underlyingDriver: 'worried about budget, hopes relationship grants exceptions',
    expertLabel: "It seems like you're concerned about staying within budget on this.",
    category: 'saying-no',
    difficulty: 'advanced',
  },

  // ===== DIFFICULT CONVERSATIONS =====
  {
    id: 'difficult-001',
    context: 'Your partner comes home and seems withdrawn. When you ask how they are:',
    statement: "I had a rough day today.",
    surfaceEmotion: 'tired, stressed',
    underlyingDriver: 'needs acknowledgment, wants to feel heard without fixing',
    expertLabel: "It sounds like you need to just decompress without me trying to fix anything.",
    category: 'difficult-conversation',
    difficulty: 'beginner',
  },
  {
    id: 'difficult-002',
    context: 'You ask a team member for their opinion on a decision. They shrug and say:',
    statement: "Whatever you think is best.",
    surfaceEmotion: 'passive, agreeable',
    underlyingDriver: 'feels their input doesn\'t matter, has checked out',
    expertLabel: "It seems like you feel like your opinion won't really change anything.",
    category: 'difficult-conversation',
    difficulty: 'intermediate',
  },
  {
    id: 'difficult-003',
    context: 'You need to give critical feedback to a direct report. They respond:',
    statement: "I thought I was doing a good job. No one told me there was a problem.",
    surfaceEmotion: 'defensive, surprised',
    underlyingDriver: 'feels blindsided, worried about job security',
    expertLabel: "It sounds like this feels like it's coming out of nowhere and that's unsettling.",
    category: 'difficult-conversation',
    difficulty: 'intermediate',
  },
  {
    id: 'difficult-004',
    context: 'A friend cancels on important plans at the last minute:',
    statement: "Something came up. I\'m sure you understand.",
    surfaceEmotion: 'dismissive, casual',
    underlyingDriver: 'overwhelmed, avoiding conflict about real reason',
    expertLabel: "It seems like there's something going on that made this harder than just rescheduling.",
    category: 'difficult-conversation',
    difficulty: 'advanced',
  },

  // ===== WORKPLACE =====
  {
    id: 'workplace-001',
    context: 'In a meeting, a colleague interrupts your presentation to say:',
    statement: "Actually, we tried that before and it didn't work.",
    surfaceEmotion: 'dismissive, superior',
    underlyingDriver: 'feels their experience is being ignored, wants recognition',
    expertLabel: "It sounds like you have valuable experience with this that hasn't been acknowledged.",
    category: 'workplace',
    difficulty: 'intermediate',
  },
  {
    id: 'workplace-002',
    context: 'You propose a new process. A senior colleague responds:',
    statement: "That's interesting, but I'm not sure leadership will go for it.",
    surfaceEmotion: 'skeptical, cautious',
    underlyingDriver: 'worried about being associated with a failed initiative',
    expertLabel: "It seems like you're concerned about the risk if this doesn't land well.",
    category: 'workplace',
    difficulty: 'advanced',
  },
];

// Helper to get scenarios by category
export function getScenariosByCategory(category: LabelingScenario['category']): LabelingScenario[] {
  return LABELING_SCENARIOS.filter(s => s.category === category);
}

// Helper to get scenarios by difficulty
export function getScenariosByDifficulty(difficulty: LabelingScenario['difficulty']): LabelingScenario[] {
  return LABELING_SCENARIOS.filter(s => s.difficulty === difficulty);
}

// Get a random scenario, optionally filtered
export function getRandomScenario(
  category?: LabelingScenario['category'],
  difficulty?: LabelingScenario['difficulty']
): LabelingScenario {
  let pool = LABELING_SCENARIOS;

  if (category) {
    pool = pool.filter(s => s.category === category);
  }
  if (difficulty) {
    pool = pool.filter(s => s.difficulty === difficulty);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Get scenario by ID
export function getScenarioById(id: string): LabelingScenario | undefined {
  return LABELING_SCENARIOS.find(s => s.id === id);
}
