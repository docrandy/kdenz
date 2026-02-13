import type { CSSProperties } from "react";

type ProgressVars = CSSProperties & {
  "--progress"?: string;
};

const WEEKLY_PROGRESS = {
  percent: "40%",
  completed: 2,
  target: 5,
  label: "Weekly consistency",
};

const DRILL_LIBRARY = [
  {
    title: "Labeling",
    description: "Identify the emotional residue and say it aloud with precision.",
  },
  {
    title: "Accusation Audit",
    description: "Surface every negative thought before presenting your position.",
  },
  {
    title: "Calibrated Close",
    description: "Close loops using calibrated question ladders.",
  },
  {
    title: "Mirroring Burst",
    description: "Rapid mirrors to keep counterparts expanding on details.",
  },
];

const NEXT_SUGGESTED = {
  eyebrow: "Next suggested drill",
  title: "Handle a pricing pushback",
  instructions: "Run the four-step loop twice before increasing difficulty.",
  loop: ["Acknowledge", "Label", "Calibrate", "Confirm"],
};

const SKILL_ACTIVITY = [
  { drill: "Labeling", status: "Completed", lastRun: "Feb 11", streak: "3d" },
  { drill: "Accusation Audit", status: "In Progress", lastRun: "Feb 09", streak: "-" },
  { drill: "Mirroring Burst", status: "Queued", lastRun: "Feb 08", streak: "-" },
];

export default function SkillsPage() {
  const progressStyle: ProgressVars = {
    "--progress": WEEKLY_PROGRESS.percent,
  };

  return (
    <div className="page-wrapper page--skills">
      <div className="page-wrapper__inner">
        <header className="page-header">
          <div>
            <h1 className="heading-xl">Skills</h1>
            <p className="text-secondary">Independent drill engines</p>
          </div>
        </header>

        <section className="section">
          <div className="progress-strip" style={progressStyle}>
            <div className="progress-strip__label">{WEEKLY_PROGRESS.label}</div>
            <div className="progress-strip__track">
              <div className="progress-strip__fill" />
            </div>
            <div className="progress-strip__label u-text-bold">
              {WEEKLY_PROGRESS.completed} / {WEEKLY_PROGRESS.target} sessions
            </div>
          </div>
        </section>

        <section className="section">
          <div className="u-flex u-flex-between u-flex-wrap u-gap-sm">
            <h2 className="heading-lg">Drill Library</h2>
          </div>
          <div className="grid-2">
            {DRILL_LIBRARY.map((drill) => (
              <article key={drill.title} className="card card--skill skill-card stack-md">
                <h3 className="heading-md">{drill.title}</h3>
                <p className="text-secondary">{drill.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="panel--scenario stack-md">
            <div className="panel__eyebrow">{NEXT_SUGGESTED.eyebrow}</div>
            <h3 className="heading-md">{NEXT_SUGGESTED.title}</h3>
            <p className="text-secondary">{NEXT_SUGGESTED.instructions}</p>
            <ul className="stack-sm">
              {NEXT_SUGGESTED.loop.map((step) => (
                <li key={step} className="text-secondary">
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section">
          <div className="u-flex u-flex-between u-flex-wrap u-gap-sm">
            <h2 className="heading-lg">Recent Skill Activity</h2>
          </div>
          <div className="card card--skill">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Drill</th>
                  <th>Status</th>
                  <th>Last Run</th>
                  <th>Streak</th>
                </tr>
              </thead>
              <tbody>
                {SKILL_ACTIVITY.map((entry) => (
                  <tr key={entry.drill}>
                    <td>{entry.drill}</td>
                    <td>{entry.status}</td>
                    <td>{entry.lastRun}</td>
                    <td>{entry.streak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
