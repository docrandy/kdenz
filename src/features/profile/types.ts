/**
 * Profile Module - Type Definitions
 * User profile for personalization, AI context, and founder insights
 *
 * Research basis: 2-level decision tree for goals/focus (see PROFILE_PAGE_REDESIGN_RESEARCH.md)
 * - 71% activation boost with decision-tree onboarding (Guru case study)
 * - 74% drop-off with complex forms - keep it simple
 * - Progressive profiling: collect more over time through practice sessions
 */

// ===== DECISION TREE TYPES =====

export type GoalCategory = 'business' | 'personal' | 'other';

export interface TreeSelection {
  category: GoalCategory;
  specificGoal?: string;  // Level 2 selection (or custom text for 'other')
  additionalContext?: string;  // Optional "tell us more" text
}

// Level 2 options for each category
export const GOAL_OPTIONS: Record<Exclude<GoalCategory, 'other'>, {
  value: string;
  label: string;
  description: string;
}[]> = {
  business: [
    { value: 'career-advancement', label: 'Career advancement', description: 'Promotions, raises, leadership roles' },
    { value: 'better-negotiations', label: 'Better negotiations', description: 'Deals, contracts, partnerships' },
    { value: 'team-leadership', label: 'Team leadership', description: 'Managing people, feedback, difficult conversations' },
    { value: 'client-relationships', label: 'Client relationships', description: 'Sales, stakeholder management, presentations' },
  ],
  personal: [
    { value: 'relationship-communication', label: 'Relationship communication', description: 'Partner, family, friends' },
    { value: 'confidence-building', label: 'Confidence building', description: 'Self-advocacy, speaking up' },
    { value: 'conflict-handling', label: 'Conflict handling', description: 'Confrontation without escalation' },
    { value: 'boundary-setting', label: 'Boundary setting', description: 'Saying no, protecting time/energy' },
  ],
};

// Focus areas use same structure but different framing
export const FOCUS_OPTIONS: Record<Exclude<GoalCategory, 'other'>, {
  value: string;
  label: string;
  description: string;
}[]> = {
  business: [
    { value: 'salary-negotiation', label: 'Salary negotiation', description: 'Asking for raises, promotions' },
    { value: 'difficult-feedback', label: 'Difficult feedback', description: 'Giving or receiving tough messages' },
    { value: 'stakeholder-buy-in', label: 'Stakeholder buy-in', description: 'Persuading decision-makers' },
    { value: 'team-conflicts', label: 'Team conflicts', description: 'Resolving workplace disagreements' },
  ],
  personal: [
    { value: 'saying-no', label: 'Saying no', description: 'Setting boundaries with grace' },
    { value: 'tough-conversations', label: 'Tough conversations', description: 'Addressing sensitive topics' },
    { value: 'speaking-up', label: 'Speaking up', description: 'Voicing opinions and needs' },
    { value: 'handling-criticism', label: 'Handling criticism', description: 'Receiving feedback without defensiveness' },
  ],
};

// ===== PROFILE STRUCTURE =====

export interface UserProfile {
  id: string;
  createdAt: number;
  updatedAt: number;

  // Demographics (TOP of form - intake style)
  demographics: {
    preferredName?: string;
    pronouns?: string;
    jobTitle?: string;
    industry?: string;
    teamSize?: string;        // "solo", "small", "medium", "large"
    reportsTo?: string;
  };

  // Long-term Goals (decision tree - multi-select)
  longTermGoals: TreeSelection[];

  // Focus Areas (separate decision tree)
  focusAreas: TreeSelection;

  // Self-Assessment (with toggle for options vs text)
  selfAssessment: {
    biggestChallenges?: string[];   // Multi-select OR free text
    biggestChallengesText?: string; // Free text alternative
    useTextInput?: boolean;          // Toggle state
  };

  // Preferences (open text for AI interpretation)
  preferences: {
    feedbackStyle?: 'direct' | 'gentle' | 'balanced';
    pacePreference?: 'take-it-slow' | 'moderate' | 'fast-paced';
    openPreferences?: string;  // Free text - AI interprets
  };

  // Additional context (free text for anything else)
  additionalContext?: string;

  // History (notable past experiences)
  history: {
    pastConversations?: HistoryEntry[];
    notableOutcomes?: string[];
  };

  // Miscellaneous (catch-all for quick notes)
  miscellaneous: MiscNote[];

  // === DEPRECATED (kept for migration) ===
  basics?: { preferredName?: string; pronouns?: string; };
  workContext?: { jobTitle?: string; industry?: string; teamSize?: string; reportsTo?: string; yearsExperience?: string; };
  communicationGoals?: { currentFocus?: string[]; upcomingConversation?: string; longTermGoal?: string; };
  relationshipContext?: { maritalStatus?: string; familyDynamics?: string; };
}

export interface HistoryEntry {
  id: string;
  date: number;
  description: string;
  outcome?: 'positive' | 'negative' | 'mixed' | 'unknown';
  lessonsLearned?: string;
}

export interface MiscNote {
  id: string;
  createdAt: number;
  content: string;
  suggestedCategory?: ProfileCategory;  // AI-suggested categorization
  categorized: boolean;                  // Has user moved it to a category?
}

// Categories for AI categorization suggestions
export type ProfileCategory =
  | 'demographics'
  | 'longTermGoals'
  | 'focusAreas'
  | 'selfAssessment'
  | 'preferences'
  | 'history'
  | 'miscellaneous'
  // Deprecated (kept for migration)
  | 'basics'
  | 'workContext'
  | 'communicationGoals'
  | 'relationshipContext';

// Category metadata for display
export const PROFILE_CATEGORIES: Record<ProfileCategory, {
  label: string;
  description: string;
  icon: string;
}> = {
  demographics: {
    label: 'About You',
    description: 'Name, role, and work context',
    icon: '👤',
  },
  longTermGoals: {
    label: 'Long-term Goals',
    description: 'Where you want to be',
    icon: '🎯',
  },
  focusAreas: {
    label: 'Focus Areas',
    description: 'What you want to work on now',
    icon: '🔍',
  },
  selfAssessment: {
    label: 'Self-Assessment',
    description: 'Your challenges and triggers',
    icon: '📋',
  },
  preferences: {
    label: 'Preferences',
    description: 'How you like to receive feedback',
    icon: '⚙️',
  },
  history: {
    label: 'History',
    description: 'Past conversations and outcomes',
    icon: '📜',
  },
  miscellaneous: {
    label: 'Notes',
    description: 'Quick notes from sessions',
    icon: '📝',
  },
  // Deprecated - kept for backward compatibility
  basics: { label: 'Basics', description: '', icon: '' },
  workContext: { label: 'Work Context', description: '', icon: '' },
  communicationGoals: { label: 'Communication Goals', description: '', icon: '' },
  relationshipContext: { label: 'Relationship Context', description: '', icon: '' },
};

// Default empty profile
export function createEmptyProfile(): UserProfile {
  return {
    id: `profile-${Date.now()}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    demographics: {},
    longTermGoals: [],
    focusAreas: { category: 'business' },
    selfAssessment: { useTextInput: false },
    preferences: {
      feedbackStyle: 'balanced',
      pacePreference: 'moderate',
    },
    history: {},
    miscellaneous: [],
  };
}

// Migration helper: convert old profile structure to new
export function migrateProfile(oldProfile: any): UserProfile {
  const newProfile = createEmptyProfile();
  newProfile.id = oldProfile.id || newProfile.id;
  newProfile.createdAt = oldProfile.createdAt || newProfile.createdAt;
  newProfile.updatedAt = Date.now();

  // Migrate basics + workContext → demographics
  if (oldProfile.basics || oldProfile.workContext) {
    newProfile.demographics = {
      preferredName: oldProfile.basics?.preferredName,
      pronouns: oldProfile.basics?.pronouns,
      jobTitle: oldProfile.workContext?.jobTitle,
      industry: oldProfile.workContext?.industry,
      teamSize: oldProfile.workContext?.teamSize,
      reportsTo: oldProfile.workContext?.reportsTo,
    };
  }

  // Migrate communicationGoals → longTermGoals + focusAreas
  if (oldProfile.communicationGoals?.longTermGoal) {
    newProfile.longTermGoals = [{
      category: 'other',
      specificGoal: oldProfile.communicationGoals.longTermGoal,
    }];
  }
  if (oldProfile.communicationGoals?.currentFocus?.length > 0) {
    newProfile.focusAreas = {
      category: 'other',
      specificGoal: oldProfile.communicationGoals.currentFocus.join(', '),
    };
  }

  // Migrate selfAssessment (remove strengthAreas)
  if (oldProfile.selfAssessment) {
    newProfile.selfAssessment = {
      biggestChallenges: oldProfile.selfAssessment.biggestChallenges,
      useTextInput: false,
    };
  }

  // Migrate preferences (remove celebrateWins)
  if (oldProfile.preferences) {
    newProfile.preferences = {
      feedbackStyle: oldProfile.preferences.feedbackStyle,
      pacePreference: oldProfile.preferences.pacePreference,
    };
  }

  // Keep history and miscellaneous
  newProfile.history = oldProfile.history || {};
  newProfile.miscellaneous = oldProfile.miscellaneous || [];

  return newProfile;
}
