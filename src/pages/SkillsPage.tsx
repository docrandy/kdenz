/**
 * SkillsPage - Skills Lab hub
 * Active drills (Labeling, Accusation Audit) + 6 generic engine technique drills + technique library link
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLabelAttempts } from "../features/labeling";
import { drillTechniquesArray } from "../data/drill-techniques";

// Framework badge color helper
const frameworkColor = (fw: string) =>
  (
    ({
      Voss: "text-accent",
      MI: "text-info",
      CBT: "text-status-success",
      NVC: "text-status-warning",
    }) as Record<string, string>
  )[fw] ?? "text-text-muted";

export default function SkillsPage() {
  const navigate = useNavigate();
  const [labelingCount, setLabelingCount] = useState(0);
  const [labelingAvg, setLabelingAvg] = useState(0);

  useEffect(() => {
    const attempts = getLabelAttempts();
    setLabelingCount(attempts.length);
    if (attempts.length > 0) {
      const avg =
        attempts.reduce((sum, a) => sum + a.analysis.overallScore, 0) /
        attempts.length;
      setLabelingAvg(Math.round(avg));
    }
  }, []);

  // 6 generic engine techniques — exclude labeling and accusation-audit (they have their own routes)
  const genericTechniques = drillTechniquesArray.filter(
    (t) => t.id !== "labeling" && t.id !== "accusation-audit",
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Section 1: Practice Drills — existing 2 cards, unchanged */}
      <section>
        <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
          Practice Drills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Labeling Drill */}
          <button
            onClick={() => navigate("/practice/labeling")}
            className="card-surface border-l-4 border-l-accent text-left hover:bg-accent/5 active:bg-accent/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-2xl">
                <span role="img" aria-label="label">
                  🏷️
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-h5 text-text-heading mb-1">
                  Labeling
                </h3>
                <p className="text-body-sm text-text-body mb-2">
                  Name emotions and underlying drivers using Chris Voss
                  technique
                </p>
                {labelingCount > 0 && (
                  <div className="flex gap-3 text-caption">
                    <span className="text-text-muted">
                      {labelingCount} attempts
                    </span>
                    <span className="text-accent">Avg: {labelingAvg}/100</span>
                  </div>
                )}
              </div>
              <span className="text-text-subtle flex-shrink-0 mt-1">
                &rarr;
              </span>
            </div>
          </button>

          {/* Accusation Audit Drill */}
          <button
            onClick={() => navigate("/practice/audit")}
            className="card-surface border-l-4 border-l-info text-left hover:bg-info/5 active:bg-info/10 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center flex-shrink-0 text-2xl">
                <span role="img" aria-label="shield">
                  🛡️
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-h5 text-text-heading mb-1">
                  Accusation Audit
                </h3>
                <p className="text-body-sm text-text-body">
                  Surface every negative thought before presenting your position
                </p>
              </div>
              <span className="text-text-subtle flex-shrink-0 mt-1">
                &rarr;
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Section 2: Technique Drills — 6 generic engine cards */}
      <section>
        <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
          Technique Drills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {genericTechniques.map((technique) => {
            // First sentence only — slice at first period
            const firstSentence = technique.description.split(".")[0] + ".";

            return (
              <button
                key={technique.id}
                onClick={() => navigate(`/practice/drill/${technique.id}`)}
                className="card-surface border-l-4 border-l-accent text-left hover:bg-accent/5 active:bg-accent/10 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-semibold text-h5 text-text-heading">
                        {technique.name}
                      </h3>
                      <span
                        className={`text-caption font-medium ${frameworkColor(technique.framework)}`}
                      >
                        {technique.framework}
                      </span>
                    </div>
                    <p className="text-body-sm text-text-body">
                      {firstSentence}
                    </p>
                  </div>
                  <span className="text-text-subtle flex-shrink-0 mt-1">
                    &rarr;
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Technique Library — unchanged */}
      <section>
        <button
          onClick={() => navigate("/library")}
          className="w-full card-surface text-left hover:bg-accent/5 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M21 21l-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-body font-medium text-text-heading">
                Technique Library
              </p>
              <p className="text-caption text-text-muted">
                Browse all 51 techniques across 5 frameworks
              </p>
            </div>
          </div>
          <span className="text-text-subtle">&rarr;</span>
        </button>
      </section>
    </div>
  );
}
