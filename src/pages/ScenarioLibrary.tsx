import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { filterTechniques, getUniqueCategories } from "../data/techniques";
import type {
  Technique,
  FrameworkId,
  Difficulty,
  TechniqueCategory,
} from "../types/technique";
import {
  FRAMEWORK_DISPLAY,
  CATEGORY_DISPLAY,
  DIFFICULTY_CONFIG,
} from "../types/technique";

type SortOption = "recommended" | "difficulty" | "framework" | "recent";

export default function ScenarioLibrary() {
  const navigate = useNavigate();

  // Filter state
  const [framework, setFramework] = useState<FrameworkId | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [category, setCategory] = useState<TechniqueCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const categories = useMemo(() => getUniqueCategories(), []);

  const filteredTechniques = useMemo(
    () => filterTechniques({ framework, difficulty, category, search, sort }),
    [framework, difficulty, category, search, sort],
  );

  // Check if any filters are active
  const hasActiveFilters =
    framework !== "all" || difficulty !== "all" || category !== "all";

  const clearAllFilters = () => {
    setFramework("all");
    setDifficulty("all");
    setCategory("all");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-background-surface pb-safe">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="text-text-muted hover:text-text active:text-text min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Back to Dashboard"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-text">Practice</h1>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="text-sm text-text-muted hover:text-text flex items-center gap-1 min-h-[44px] px-2"
              >
                Sort:{" "}
                {sort === "recommended"
                  ? "Recommended"
                  : sort === "difficulty"
                    ? "Difficulty"
                    : sort === "framework"
                      ? "Framework"
                      : "Recent"}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 5L6 8L9 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showSortMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowSortMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-background rounded-xl shadow-lg border z-40 py-1">
                    {(
                      ["recommended", "difficulty", "framework"] as SortOption[]
                    ).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSort(opt);
                          setShowSortMenu(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-sm hover:bg-background-surface ${sort === opt ? "font-semibold text-accent" : "text-text-muted"}`}
                      >
                        {opt === "recommended"
                          ? "Recommended"
                          : opt === "difficulty"
                            ? "Difficulty"
                            : "Framework"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-3 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search techniques..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-background-elevated rounded-xl text-sm text-text placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-background transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-muted"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M4 4L10 10M10 4L4 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filter pills - horizontally scrollable */}
          <div className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-1">
              {/* Framework pills */}
              <FilterPill
                label="All Frameworks"
                active={framework === "all"}
                onClick={() => setFramework("all")}
              />
              {(
                [
                  "voss",
                  "camp",
                  "belfort",
                  "bustamante",
                  "ury",
                ] as FrameworkId[]
              ).map((fw) => (
                <FilterPill
                  key={fw}
                  label={FRAMEWORK_DISPLAY[fw].label}
                  active={framework === fw}
                  onClick={() => setFramework(framework === fw ? "all" : fw)}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-2 pb-1">
              {/* Difficulty pills */}
              {(["beginner", "intermediate", "advanced"] as Difficulty[]).map(
                (diff) => (
                  <FilterPill
                    key={diff}
                    label={DIFFICULTY_CONFIG[diff].label}
                    active={difficulty === diff}
                    onClick={() =>
                      setDifficulty(difficulty === diff ? "all" : diff)
                    }
                  />
                ),
              )}
              {/* Category dropdown-style pill */}
              <CategoryFilterPill
                value={category}
                categories={categories}
                onChange={setCategory}
              />
            </div>
          </div>

          {/* Active filters chips */}
          {hasActiveFilters && (
            <div className="mt-2 flex flex-wrap gap-1.5 items-center">
              {framework !== "all" && (
                <DismissibleChip
                  label={FRAMEWORK_DISPLAY[framework].label}
                  onDismiss={() => setFramework("all")}
                />
              )}
              {difficulty !== "all" && (
                <DismissibleChip
                  label={DIFFICULTY_CONFIG[difficulty].label}
                  onDismiss={() => setDifficulty("all")}
                />
              )}
              {category !== "all" && (
                <DismissibleChip
                  label={CATEGORY_DISPLAY[category]}
                  onDismiss={() => setCategory("all")}
                />
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs text-accent hover:text-accent ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Results count */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <p className="text-sm text-text-muted">
          {filteredTechniques.length} technique
          {filteredTechniques.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Card grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        {filteredTechniques.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-text-muted text-base">
              No techniques match your filters.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-3 text-accent hover:text-accent text-sm font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filteredTechniques.map((technique) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                onClick={() => navigate(`/technique/${technique.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ===== Sub-components =====

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors min-h-[32px] ${
        active
          ? "btn-primary"
          : "bg-background-elevated text-text-muted hover:bg-background-elevated"
      }`}
    >
      {label}
    </button>
  );
}

function CategoryFilterPill({
  value,
  categories,
  onChange,
}: {
  value: TechniqueCategory | "all";
  categories: TechniqueCategory[];
  onChange: (v: TechniqueCategory | "all") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 min-h-[32px] ${
          value !== "all"
            ? "btn-primary"
            : "bg-background-elevated text-text-muted hover:bg-background-elevated"
        }`}
      >
        {value === "all" ? "Category" : CATEGORY_DISPLAY[value]}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2.5 4L5 6.5L7.5 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-48 bg-background rounded-xl shadow-lg border z-40 py-1 max-h-64 overflow-y-auto">
            <button
              onClick={() => {
                onChange("all");
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-background-surface ${value === "all" ? "font-semibold text-accent" : "text-text-muted"}`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onChange(cat);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-background-surface ${value === cat ? "font-semibold text-accent" : "text-text-muted"}`}
              >
                {CATEGORY_DISPLAY[cat]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function DismissibleChip({
  label,
  onDismiss,
}: {
  label: string;
  onDismiss: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full">
      {label}
      <button
        onClick={onDismiss}
        className="hover:text-accent/80"
        aria-label={`Remove ${label} filter`}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M3 3L7 7M7 3L3 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  );
}

function TechniqueCard({
  technique,
  onClick,
}: {
  technique: Technique;
  onClick: () => void;
}) {
  const fw = FRAMEWORK_DISPLAY[technique.framework];
  const diff = DIFFICULTY_CONFIG[technique.difficulty];
  const durationLabel =
    technique.duration_seconds >= 60
      ? `${Math.round(technique.duration_seconds / 60)}m`
      : `${technique.duration_seconds}s`;

  return (
    <button
      onClick={onClick}
      className="bg-background rounded-xl border p-3 sm:p-4 text-left hover:shadow-md active:bg-background-surface transition-all flex flex-col h-full"
    >
      {/* Top row: framework badge + difficulty */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] sm:text-xs font-bold rounded uppercase tracking-wide">
          {fw.label}
        </span>
        <span
          className={`text-[10px] sm:text-xs font-medium ${diff.color} ${diff.bg} px-1.5 py-0.5 rounded`}
        >
          {diff.label}
        </span>
      </div>

      {/* Technique name */}
      <h3 className="font-semibold text-text text-sm sm:text-base leading-tight mb-1.5">
        {technique.technique_name}
      </h3>

      {/* Description truncated */}
      <p className="text-xs text-text-muted line-clamp-2 mb-3 flex-1">
        {technique.description}
      </p>

      {/* Bottom row: category + duration */}
      <div className="flex items-center justify-between gap-2 mt-auto">
        <span className="text-[10px] sm:text-xs text-text-muted bg-background-elevated px-2 py-0.5 rounded-full">
          {CATEGORY_DISPLAY[technique.category]}
        </span>
        <span className="text-[10px] sm:text-xs text-text-subtle font-medium">
          {durationLabel}
        </span>
      </div>
    </button>
  );
}
