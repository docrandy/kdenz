/**
 * Types for the Phase 2 technique/scenario database (Kdenzphase2.json)
 * 51 techniques across 5 negotiation frameworks
 */

export type FrameworkId = "voss" | "camp" | "belfort" | "bustamante" | "ury";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type TechniqueCategory =
  | "rapport"
  | "empathy"
  | "tonality"
  | "pacing"
  | "questioning"
  | "strategy"
  | "framing"
  | "intelligence"
  | "closing"
  | "mindset"
  | "preparation"
  | "opening"
  | "engagement"
  | "objection_handling"
  | "language"
  | "assertiveness"
  | "self_management";

export interface Framework {
  name: string;
  id: FrameworkId;
  description: string;
  technique_count: number;
  core_philosophy: string;
}

export interface Technique {
  id: string;
  technique_name: string;
  framework: FrameworkId;
  difficulty: Difficulty;
  category: TechniqueCategory;
  description: string;
  practice_prompt: string;
  success_criteria: string[];
  common_mistakes: string[];
  duration_seconds: number;
  structure: string;
  pairs_well_with: string[];
  coaching_notes: string;
}

export interface TechniquesDatabase {
  metadata: {
    version: string;
    created: string;
    total_techniques: number;
    frameworks: number;
    total_scenarios: number;
    difficulty_distribution: Record<Difficulty, number>;
    target_user: string;
    session_format: string;
  };
  frameworks: Record<FrameworkId, Framework>;
  techniques: Technique[];
}

/** Filter state for the Scenario Library */
export interface LibraryFilters {
  framework: FrameworkId | "all";
  difficulty: Difficulty | "all";
  category: TechniqueCategory | "all";
  status: "all" | "new" | "practiced" | "mastered";
  search: string;
  sort: "recommended" | "difficulty" | "framework" | "recent";
}

/** Display names for frameworks */
export const FRAMEWORK_DISPLAY: Record<
  FrameworkId,
  { label: string; author: string; book: string }
> = {
  voss: {
    label: "VOSS",
    author: "Chris Voss",
    book: "Never Split the Difference",
  },
  camp: { label: "CAMP", author: "Jim Camp", book: "Start With No" },
  belfort: {
    label: "BELFORT",
    author: "Jordan Belfort",
    book: "Straight Line Persuasion",
  },
  bustamante: {
    label: "BUSTAMANTE",
    author: "Andrew Bustamante",
    book: "CIA Influence",
  },
  ury: { label: "URY", author: "William Ury", book: "Getting Past No" },
};

/** Humanized category labels */
export const CATEGORY_DISPLAY: Record<TechniqueCategory, string> = {
  rapport: "Rapport",
  empathy: "Empathy",
  tonality: "Tonality",
  pacing: "Pacing",
  questioning: "Questioning",
  strategy: "Strategy",
  framing: "Framing",
  intelligence: "Intelligence",
  closing: "Closing",
  mindset: "Mindset",
  preparation: "Preparation",
  opening: "Opening",
  engagement: "Engagement",
  objection_handling: "Objection Handling",
  language: "Language",
  assertiveness: "Assertiveness",
  self_management: "Self-Management",
};

/** Difficulty colors and labels */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bg: string }
> = {
  beginner: { label: "Beginner", color: "text-green-700", bg: "bg-green-100" },
  intermediate: {
    label: "Intermediate",
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  advanced: { label: "Advanced", color: "text-red-700", bg: "bg-red-100" },
};
