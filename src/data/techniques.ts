/**
 * Data access layer for the Phase 2 technique database.
 * Imports Kdenzphase2.json and provides typed access + helper functions.
 */

import techniquesDb from "../../Kdenzphase2.json";
import type {
  Technique,
  Framework,
  FrameworkId,
  Difficulty,
  TechniqueCategory,
  TechniquesDatabase,
} from "../types/technique";

const db = techniquesDb as TechniquesDatabase;

/** All 51 techniques */
export const techniques: Technique[] = db.techniques;

/** Framework metadata map */
export const frameworks: Record<FrameworkId, Framework> = db.frameworks;

/** Get a single technique by ID */
export function getTechniqueById(id: string): Technique | undefined {
  return techniques.find((t) => t.id === id);
}

/** Get techniques by framework */
export function getTechniquesByFramework(
  frameworkId: FrameworkId,
): Technique[] {
  return techniques.filter((t) => t.framework === frameworkId);
}

/** Resolve an array of technique IDs to full Technique objects */
export function resolveTechniqueIds(ids: string[]): Technique[] {
  return ids
    .map((id) => getTechniqueById(id))
    .filter((t): t is Technique => t !== undefined);
}

/** Get all unique categories present in the data */
export function getUniqueCategories(): TechniqueCategory[] {
  const categories = new Set(techniques.map((t) => t.category));
  return Array.from(categories).sort() as TechniqueCategory[];
}

/** Filter and sort techniques based on library filter state */
export function filterTechniques(opts: {
  framework?: FrameworkId | "all";
  difficulty?: Difficulty | "all";
  category?: TechniqueCategory | "all";
  search?: string;
  sort?: "recommended" | "difficulty" | "framework" | "recent";
}): Technique[] {
  let result = [...techniques];

  // Framework filter
  if (opts.framework && opts.framework !== "all") {
    result = result.filter((t) => t.framework === opts.framework);
  }

  // Difficulty filter
  if (opts.difficulty && opts.difficulty !== "all") {
    result = result.filter((t) => t.difficulty === opts.difficulty);
  }

  // Category filter
  if (opts.category && opts.category !== "all") {
    result = result.filter((t) => t.category === opts.category);
  }

  // Search filter
  if (opts.search && opts.search.trim()) {
    const q = opts.search.toLowerCase().trim();
    result = result.filter(
      (t) =>
        t.technique_name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.framework.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }

  // Sort
  const difficultyOrder: Record<Difficulty, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };

  switch (opts.sort) {
    case "difficulty":
      result.sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
      );
      break;
    case "framework":
      result.sort((a, b) => a.framework.localeCompare(b.framework));
      break;
    case "recommended":
    default:
      // Default order: beginner first, then by framework
      result.sort((a, b) => {
        const diffDelta =
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        if (diffDelta !== 0) return diffDelta;
        return a.framework.localeCompare(b.framework);
      });
      break;
  }

  return result;
}
