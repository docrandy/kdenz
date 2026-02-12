import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTechniqueById, resolveTechniqueIds } from "../data/techniques";
import {
  FRAMEWORK_DISPLAY,
  CATEGORY_DISPLAY,
  DIFFICULTY_CONFIG,
} from "../types/technique";

type Tab = "briefing" | "learn";

export default function ScenarioDetail() {
  const { techniqueId } = useParams<{ techniqueId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("briefing");

  const technique = techniqueId ? getTechniqueById(techniqueId) : undefined;

  if (!technique) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted text-lg">Technique not found</p>
          <button
            onClick={() => navigate("/library")}
            className="mt-4 text-accent hover:text-accent font-medium"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const fw = FRAMEWORK_DISPLAY[technique.framework];
  const diff = DIFFICULTY_CONFIG[technique.difficulty];
  const durationLabel =
    technique.duration_seconds >= 60
      ? `${Math.round(technique.duration_seconds / 60)}m`
      : `${technique.duration_seconds}s`;
  const pairedTechniques = resolveTechniqueIds(technique.pairs_well_with);

  const handleStartPractice = () => {
    // Navigate to technique practice with full context
    navigate("/practice/technique", {
      state: {
        techniqueId: technique.id,
        durationSeconds: technique.duration_seconds,
        practicePrompt: technique.practice_prompt,
        techniqueName: technique.technique_name,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <button
            onClick={() => navigate("/library")}
            className="text-text-muted hover:text-text active:text-text flex items-center gap-2 text-sm min-h-[44px]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Library
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
          {/* Technique header */}
          <div className="mb-6">
            {/* Framework + Author */}
            <p className="text-sm text-text-muted mb-1">
              {fw.author} — <span className="italic">{fw.book}</span>
            </p>

            {/* Technique name */}
            <h1 className="text-2xl sm:text-3xl font-bold text-text mb-3">
              {technique.technique_name}
            </h1>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs font-bold rounded uppercase tracking-wide">
                {fw.label}
              </span>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded ${diff.color} ${diff.bg}`}
              >
                {diff.label}
              </span>
              <span className="px-2.5 py-1 bg-background-elevated text-text-muted text-xs rounded">
                {CATEGORY_DISPLAY[technique.category]}
              </span>
              <span className="px-2.5 py-1 bg-background-elevated text-text-muted text-xs rounded flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M6 3.5V6L7.5 7.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {durationLabel}
              </span>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("briefing")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "briefing"
                  ? "border-accent text-text"
                  : "border-transparent text-text-muted hover:text-text-muted"
              }`}
            >
              Briefing
            </button>
            <button
              onClick={() => setActiveTab("learn")}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "learn"
                  ? "border-accent text-text"
                  : "border-transparent text-text-muted hover:text-text-muted"
              }`}
            >
              Learn
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "briefing" ? (
            <BriefingTab
              technique={technique}
              pairedTechniques={pairedTechniques}
              onTechniqueClick={(id) => navigate(`/technique/${id}`)}
            />
          ) : (
            <LearnTab technique={technique} />
          )}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3">
          <button
            onClick={handleStartPractice}
            className="w-full btn-primary py-4 rounded-xl font-semibold text-base sm:text-lg hover:opacity-90 active:opacity-80 transition-colors flex items-center justify-center gap-3 min-h-[56px]"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 4L16 10L6 16V4Z" fill="currentColor" />
            </svg>
            Start Practice
            <span className="text-text-inverse/60 font-normal">
              [{durationLabel}]
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== Tab Components =====

function BriefingTab({
  technique,
  pairedTechniques,
  onTechniqueClick,
}: {
  technique: ReturnType<typeof getTechniqueById> & {};
  pairedTechniques: ReturnType<typeof resolveTechniqueIds>;
  onTechniqueClick: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* What This Is */}
      <BriefingSection title="WHAT THIS IS">
        <p className="text-text-muted text-sm sm:text-base leading-relaxed">
          {technique.description}
        </p>
      </BriefingSection>

      {/* What Success Looks Like */}
      <BriefingSection title="WHAT SUCCESS LOOKS LIKE">
        <ul className="space-y-2.5">
          {technique.success_criteria.map((criterion, i) => (
            <li key={i} className="flex gap-2.5 text-sm sm:text-base">
              <span className="text-status-success mt-0.5 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8L6.5 11.5L13 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-text-muted">{criterion}</span>
            </li>
          ))}
        </ul>
      </BriefingSection>

      {/* Common Mistakes */}
      <BriefingSection title="COMMON MISTAKES">
        <ul className="space-y-2.5">
          {technique.common_mistakes.map((mistake, i) => (
            <li key={i} className="flex gap-2.5 text-sm sm:text-base">
              <span className="text-status-error mt-0.5 flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-text-muted">{mistake}</span>
            </li>
          ))}
        </ul>
      </BriefingSection>

      {/* Session Structure */}
      <BriefingSection title="SESSION STRUCTURE">
        <div className="bg-background-surface rounded-lg p-4">
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            {technique.structure}
          </p>
        </div>
      </BriefingSection>

      {/* Pairs Well With */}
      {pairedTechniques.length > 0 && (
        <BriefingSection title="PAIRS WELL WITH">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {pairedTechniques.map((paired) => (
              <button
                key={paired.id}
                onClick={() => onTechniqueClick(paired.id)}
                className="flex-shrink-0 w-44 sm:w-52 bg-background-surface hover:bg-background-elevated rounded-xl border p-3 text-left transition-colors"
              >
                <span className="text-[10px] font-bold text-accent uppercase tracking-wide">
                  {FRAMEWORK_DISPLAY[paired.framework].label}
                </span>
                <p className="font-semibold text-text text-sm mt-1 leading-tight">
                  {paired.technique_name}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  {DIFFICULTY_CONFIG[paired.difficulty].label} ·{" "}
                  {CATEGORY_DISPLAY[paired.category]}
                </p>
              </button>
            ))}
          </div>
        </BriefingSection>
      )}
    </div>
  );
}

function LearnTab({
  technique,
}: {
  technique: ReturnType<typeof getTechniqueById> & {};
}) {
  return (
    <div className="space-y-6">
      {/* Coaching notes as educational content */}
      {technique.coaching_notes ? (
        <BriefingSection title="TECHNIQUE BREAKDOWN">
          <p className="text-text-muted text-sm sm:text-base leading-relaxed">
            {technique.coaching_notes}
          </p>
        </BriefingSection>
      ) : null}

      {/* Framework context */}
      <BriefingSection title="FRAMEWORK CONTEXT">
        <div className="bg-background-surface rounded-lg p-4">
          <p className="text-sm font-medium text-text mb-1">
            {FRAMEWORK_DISPLAY[technique.framework].author}
          </p>
          <p className="text-xs text-text-muted italic mb-3">
            {FRAMEWORK_DISPLAY[technique.framework].book}
          </p>
        </div>
      </BriefingSection>

      {/* Placeholder for future content */}
      <div className="bg-background-surface rounded-xl p-6 text-center">
        <p className="text-text-muted text-sm">
          Written breakdown coming soon. Practice first — the feedback will
          teach you.
        </p>
      </div>
    </div>
  );
}

// ===== Shared Components =====

function BriefingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-bold text-text-subtle uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </section>
  );
}
