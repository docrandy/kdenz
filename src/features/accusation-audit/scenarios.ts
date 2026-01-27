/**
 * Accusation Audit Practice Scenarios
 * Based on Chris Voss research - pre-emptively naming negative assumptions
 */

import type { AuditScenario } from './types';

export const AUDIT_SCENARIOS: AuditScenario[] = [
  // ===== SALARY NEGOTIATION =====
  {
    id: 'audit-salary-001',
    context: "You're about to ask your manager for a 15% raise during your annual review. You've prepared your case but know this is above the typical increase.",
    relationship: 'Direct report to manager (2 years)',
    stakes: 'Compensation, relationship with manager, career trajectory',
    counterpartRole: 'Your direct manager',
    commonCriticisms: [
      {
        id: 'ungrateful',
        text: "You're ungrateful for what you already have",
        inTheirVoice: "I'm being ungrateful",
        keywords: ['ungrateful', 'not appreciating', 'taking for granted', 'entitled', 'appreciate'],
        importance: 'critical',
      },
      {
        id: 'money-motivated',
        text: "You're only motivated by money",
        inTheirVoice: "I'm only motivated by money",
        keywords: ['money', 'motivated by money', 'mercenary', 'greedy', 'just about money'],
        importance: 'critical',
      },
      {
        id: 'not-team-player',
        text: "You're not thinking about the team",
        inTheirVoice: "I'm not thinking about the team",
        keywords: ['team', 'selfish', 'not a team player', 'only thinking about myself'],
        importance: 'common',
      },
      {
        id: 'job-shopping',
        text: "You might be job shopping",
        inTheirVoice: "I might be job shopping",
        keywords: ['job shopping', 'looking elsewhere', 'leaving', 'other offers', 'leverage'],
        importance: 'common',
      },
      {
        id: 'budget-ignorant',
        text: "You don't understand budget constraints",
        inTheirVoice: "I don't understand budget constraints",
        keywords: ['budget', 'constraints', 'realistic', 'understand'],
        importance: 'minor',
      },
    ],
    hiddenConcern: "I'm actually worried about how to justify this to my boss, not about your request itself.",
    category: 'salary-negotiation',
    difficulty: 'beginner',
  },
  {
    id: 'audit-salary-002',
    context: "You received a job offer and want to negotiate a higher salary. You're about to counter-offer 20% above their initial number.",
    relationship: 'Candidate to hiring manager',
    stakes: 'Starting salary, first impression, negotiation precedent',
    counterpartRole: 'Hiring manager / HR',
    commonCriticisms: [
      {
        id: 'greedy',
        text: "You're being greedy",
        inTheirVoice: "I'm being greedy",
        keywords: ['greedy', 'asking too much', 'unrealistic', 'pushing'],
        importance: 'critical',
      },
      {
        id: 'not-excited',
        text: "You're not that excited about the role",
        inTheirVoice: "I'm not that excited about the role",
        keywords: ['excited', 'want the job', 'really want', 'passionate', 'committed'],
        importance: 'critical',
      },
      {
        id: 'using-leverage',
        text: "You're just using this as leverage",
        inTheirVoice: "I'm just using this as leverage",
        keywords: ['leverage', 'using', 'another offer', 'playing games'],
        importance: 'common',
      },
      {
        id: 'flight-risk',
        text: "You'll leave for more money later",
        inTheirVoice: "I'll leave for more money later",
        keywords: ['leave', 'flight risk', 'stay', 'loyal', 'stick around'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I'm worried about setting a precedent that makes other candidates expect the same.",
    category: 'salary-negotiation',
    difficulty: 'intermediate',
  },
  {
    id: 'audit-salary-003',
    context: "You believe you're ready for promotion but weren't offered one. You're meeting with your skip-level manager to make your case.",
    relationship: 'Skip-level report',
    stakes: 'Promotion, compensation, career progression, team dynamics',
    counterpartRole: 'Your skip-level manager',
    commonCriticisms: [
      {
        id: 'entitled',
        text: "You feel entitled to this",
        inTheirVoice: "I feel entitled",
        keywords: ['entitled', 'deserve', 'owed', 'earned'],
        importance: 'critical',
      },
      {
        id: 'not-ready',
        text: "You're not ready and can't see it",
        inTheirVoice: "I'm not ready",
        keywords: ['ready', 'not there yet', 'gaps', 'experience'],
        importance: 'critical',
      },
      {
        id: 'impatient',
        text: "You're being impatient",
        inTheirVoice: "I'm being impatient",
        keywords: ['impatient', 'rushing', 'too fast', 'wait', 'time'],
        importance: 'common',
      },
      {
        id: 'no-big-picture',
        text: "You don't see the bigger picture",
        inTheirVoice: "I don't see the bigger picture",
        keywords: ['bigger picture', 'org', 'company', 'understand'],
        importance: 'common',
      },
      {
        id: 'undermining',
        text: "You're going over your manager's head",
        inTheirVoice: "I'm going over my manager's head",
        keywords: ['manager', 'skip', 'over', 'behind'],
        importance: 'minor',
      },
    ],
    hiddenConcern: "I'm actually concerned about the team dynamics if we promote you now.",
    category: 'salary-negotiation',
    difficulty: 'advanced',
  },

  // ===== SAYING NO =====
  {
    id: 'audit-sayno-001',
    context: "Your boss asks you to take on an extra project. You're already at capacity and need to decline.",
    relationship: 'Direct report to manager',
    stakes: 'Workload, reputation, relationship with boss',
    counterpartRole: 'Your manager',
    commonCriticisms: [
      {
        id: 'not-team-player',
        text: "You're not a team player",
        inTheirVoice: "I'm not being a team player",
        keywords: ['team player', 'team', 'help out', 'pitch in'],
        importance: 'critical',
      },
      {
        id: 'not-committed',
        text: "You're not committed enough",
        inTheirVoice: "I'm not committed enough",
        keywords: ['committed', 'dedication', 'care', 'invested'],
        importance: 'critical',
      },
      {
        id: 'difficult',
        text: "You're being difficult",
        inTheirVoice: "I'm being difficult",
        keywords: ['difficult', 'hard to work with', 'inflexible', 'rigid'],
        importance: 'common',
      },
      {
        id: 'lazy',
        text: "You're lazy or not working hard enough",
        inTheirVoice: "I'm being lazy",
        keywords: ['lazy', 'work hard', 'effort', 'capacity'],
        importance: 'minor',
      },
    ],
    hiddenConcern: "I'm stressed about my own deadline and was hoping you'd help take the pressure off.",
    category: 'saying-no',
    difficulty: 'beginner',
  },
  {
    id: 'audit-sayno-002',
    context: "A close friend wants you to do free consulting work for their startup. You need to decline.",
    relationship: 'Close friend (5+ years)',
    stakes: 'Friendship, boundaries, your time',
    counterpartRole: 'Your close friend',
    commonCriticisms: [
      {
        id: 'bad-friend',
        text: "You don't value the friendship",
        inTheirVoice: "I don't value our friendship",
        keywords: ['friendship', 'friend', 'care about', 'value'],
        importance: 'critical',
      },
      {
        id: 'selfish',
        text: "You're being selfish",
        inTheirVoice: "I'm being selfish",
        keywords: ['selfish', 'self', 'only care about myself'],
        importance: 'critical',
      },
      {
        id: 'too-good',
        text: "You think you're too good for this",
        inTheirVoice: "I think I'm too good for this",
        keywords: ['too good', 'above', 'beneath'],
        importance: 'common',
      },
      {
        id: 'not-supportive',
        text: "You're not supportive of their dreams",
        inTheirVoice: "I'm not supportive",
        keywords: ['supportive', 'support', 'believe in', 'dream'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I'm feeling vulnerable about my business and your 'no' makes me feel like it's not worth supporting.",
    category: 'saying-no',
    difficulty: 'intermediate',
  },
  {
    id: 'audit-sayno-003',
    context: "You're offered a management role but want to stay as an individual contributor. You need to decline the promotion.",
    relationship: 'Direct report to manager',
    stakes: 'Career path, manager relationship, team structure',
    counterpartRole: 'Your manager',
    commonCriticisms: [
      {
        id: 'not-ambitious',
        text: "You're not ambitious",
        inTheirVoice: "I'm not ambitious",
        keywords: ['ambitious', 'ambition', 'drive', 'growth'],
        importance: 'critical',
      },
      {
        id: 'not-leadership',
        text: "You're not leadership material",
        inTheirVoice: "I'm not leadership material",
        keywords: ['leadership', 'leader', 'manage', 'material'],
        importance: 'critical',
      },
      {
        id: 'flight-risk',
        text: "You might leave the company",
        inTheirVoice: "I might be planning to leave",
        keywords: ['leave', 'leaving', 'stay', 'future', 'committed'],
        importance: 'common',
      },
      {
        id: 'not-growing',
        text: "You're not committed to growing here",
        inTheirVoice: "I'm not committed to growing here",
        keywords: ['growing', 'grow', 'development', 'committed'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I had planned the team structure around your promotion and now I need to rethink everything.",
    category: 'saying-no',
    difficulty: 'advanced',
  },

  // ===== DIFFICULT CONVERSATIONS =====
  {
    id: 'audit-difficult-001',
    context: "You need to give critical feedback to a direct report whose work hasn't been meeting expectations.",
    relationship: 'Manager to direct report (1 year)',
    stakes: 'Performance, trust, team morale',
    counterpartRole: 'Your direct report',
    commonCriticisms: [
      {
        id: 'unfair',
        text: "You're being unfair",
        inTheirVoice: "I'm being unfair",
        keywords: ['unfair', 'fair', 'objective', 'bias'],
        importance: 'critical',
      },
      {
        id: 'no-effort',
        text: "You don't see their effort",
        inTheirVoice: "I don't see your effort",
        keywords: ['effort', 'trying', 'hard work', 'see'],
        importance: 'critical',
      },
      {
        id: 'unrealistic',
        text: "You have unrealistic standards",
        inTheirVoice: "I have unrealistic standards",
        keywords: ['unrealistic', 'standards', 'expect', 'impossible'],
        importance: 'common',
      },
      {
        id: 'personal',
        text: "You don't like them personally",
        inTheirVoice: "I don't like you personally",
        keywords: ['personal', 'like', 'favor', 'against'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I'm dealing with things outside of work that have been affecting my performance.",
    category: 'difficult-conversation',
    difficulty: 'beginner',
  },
  {
    id: 'audit-difficult-002',
    context: "A colleague missed a deadline that impacted your project. You need to address it directly with them.",
    relationship: 'Peer colleague (same level)',
    stakes: 'Working relationship, project delivery, team trust',
    counterpartRole: 'Your peer colleague',
    commonCriticisms: [
      {
        id: 'blaming',
        text: "You're blaming them for your problems",
        inTheirVoice: "I'm blaming you for my problems",
        keywords: ['blame', 'fault', 'problem', 'your issue'],
        importance: 'critical',
      },
      {
        id: 'not-understanding',
        text: "You're not being understanding",
        inTheirVoice: "I'm not being understanding",
        keywords: ['understand', 'understanding', 'empathy', 'situation'],
        importance: 'critical',
      },
      {
        id: 'look-bad',
        text: "You're trying to make them look bad",
        inTheirVoice: "I'm trying to make you look bad",
        keywords: ['look bad', 'throw under', 'reputation'],
        importance: 'common',
      },
      {
        id: 'no-context',
        text: "You don't see the bigger picture",
        inTheirVoice: "I don't see the bigger picture",
        keywords: ['bigger picture', 'context', 'everything else'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I had a blocker I was too embarrassed to escalate and it spiraled.",
    category: 'difficult-conversation',
    difficulty: 'intermediate',
  },

  // ===== WORKPLACE =====
  {
    id: 'audit-workplace-001',
    context: "You want to ask for remote work flexibility, but the company prefers in-office presence.",
    relationship: 'Employee to manager',
    stakes: 'Work arrangement, career perception, flexibility',
    counterpartRole: 'Your manager',
    commonCriticisms: [
      {
        id: 'not-committed',
        text: "You're not committed to the team",
        inTheirVoice: "I'm not committed to the team",
        keywords: ['committed', 'team', 'present', 'care'],
        importance: 'critical',
      },
      {
        id: 'slack-off',
        text: "You want to slack off",
        inTheirVoice: "I want to slack off",
        keywords: ['slack', 'lazy', 'less work', 'productivity'],
        importance: 'common',
      },
      {
        id: 'no-collaboration',
        text: "You don't value collaboration",
        inTheirVoice: "I don't value collaboration",
        keywords: ['collaboration', 'collab', 'together', 'in person'],
        importance: 'common',
      },
      {
        id: 'special',
        text: "You think you're special",
        inTheirVoice: "I think I'm special",
        keywords: ['special', 'exception', 'different', 'rules'],
        importance: 'minor',
      },
    ],
    hiddenConcern: "I'm under pressure from leadership about return-to-office and it's not really my call.",
    category: 'workplace',
    difficulty: 'beginner',
  },
  {
    id: 'audit-workplace-002',
    context: "You want to propose changing a process that a senior colleague owns. You believe it's inefficient.",
    relationship: 'Junior to senior colleague',
    stakes: 'Professional relationship, process improvement, reputation',
    counterpartRole: 'Senior colleague (process owner)',
    commonCriticisms: [
      {
        id: 'criticizing',
        text: "You're criticizing their work",
        inTheirVoice: "I'm criticizing your work",
        keywords: ['criticiz', 'attack', 'wrong', 'bad'],
        importance: 'critical',
      },
      {
        id: 'know-better',
        text: "You think you know better",
        inTheirVoice: "I think I know better",
        keywords: ['know better', 'smarter', 'right', 'wrong'],
        importance: 'critical',
      },
      {
        id: 'no-respect',
        text: "You don't respect how we got here",
        inTheirVoice: "I don't respect how we got here",
        keywords: ['respect', 'history', 'context', 'reason'],
        importance: 'common',
      },
      {
        id: 'difficult',
        text: "You're being difficult or disruptive",
        inTheirVoice: "I'm being difficult",
        keywords: ['difficult', 'disruptive', 'change for change'],
        importance: 'common',
      },
    ],
    hiddenConcern: "I know the process has issues, but I feel ownership over it and defensive when it's questioned.",
    category: 'workplace',
    difficulty: 'intermediate',
  },
];

// Helper to get scenarios by category
export function getScenariosByCategory(category: AuditScenario['category']): AuditScenario[] {
  return AUDIT_SCENARIOS.filter(s => s.category === category);
}

// Helper to get scenarios by difficulty
export function getScenariosByDifficulty(difficulty: AuditScenario['difficulty']): AuditScenario[] {
  return AUDIT_SCENARIOS.filter(s => s.difficulty === difficulty);
}

// Get a random scenario, optionally filtered
export function getRandomScenario(
  category?: AuditScenario['category'],
  difficulty?: AuditScenario['difficulty']
): AuditScenario {
  let pool = AUDIT_SCENARIOS;

  if (category) {
    pool = pool.filter(s => s.category === category);
  }
  if (difficulty) {
    pool = pool.filter(s => s.difficulty === difficulty);
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

// Get scenario by ID
export function getScenarioById(id: string): AuditScenario | undefined {
  return AUDIT_SCENARIOS.find(s => s.id === id);
}
