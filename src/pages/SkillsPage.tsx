/**
 * SkillsPage - Skills Lab hub
 * Active drills (Labeling, Accusation Audit) + technique library link + coming soon teasers
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLabelAttempts } from "../features/labeling";

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

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 space-y-8">
      {/* Active Drills */}
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

      {/* Technique Library link */}
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

      {/* Coming Soon Drills */}
      <section>
        <h2 className="text-h5 font-display font-semibold text-text-heading mb-4">
          Coming Soon
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              name: "Tactical Mirroring",
              desc: "Repeat the last 1-3 words to keep them talking",
            },
            {
              name: "Calibrated Questions",
              desc: "Ask how/what questions that guide without pushing",
            },
            {
              name: "Strategic Summarizing",
              desc: "Paraphrase + label to trigger 'that's right'",
            },
            {
              name: "Dynamic Silence",
              desc: "Use deliberate pauses after labels and mirrors",
            },
          ].map((drill) => (
            <div
              key={drill.name}
              className="card-surface opacity-60 cursor-default"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-background-elevated flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-text-subtle"
                  >
                    <rect
                      x="3"
                      y="11"
                      width="18"
                      height="11"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 11V7a5 5 0 0110 0v4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-text-heading">
                    {drill.name}
                  </p>
                  <p className="text-caption text-text-muted">{drill.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
