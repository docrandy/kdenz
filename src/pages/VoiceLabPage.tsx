const practiceModes = [
  {
    title: "Filler Control",
    description: "Reduce verbal fillers under pressure with guided reps.",
  },
  {
    title: "Pace Calibration",
    description: "Dial in tempo by alternating bursts vs. calm delivery.",
  },
  {
    title: "Technique Lab",
    description: "Layer mirroring, labeling, and calibrated questions.",
  },
];

const recentSessions = [
  { name: "Baseline Warmup", date: "Feb 10", wpm: 138, filler: "5", duration: "08:00" },
  { name: "Investor Pitch Loop", date: "Feb 08", wpm: 152, filler: "3", duration: "10:30" },
  { name: "Calibrated Story", date: "Feb 05", wpm: 147, filler: "4", duration: "09:15" },
];

export default function VoiceLabPage() {
  return (
    <div className="page-wrapper page--voicelab">
      <div className="page-wrapper__inner">
        <section className="section">
          <div className="u-flex u-flex-between u-flex-wrap">
            <h2 className="heading-lg">Practice Modes</h2>
          </div>
          <div className="grid-3 gap-lg">
            {practiceModes.map((mode) => (
              <article key={mode.title} className="card card--practice practice-card">
                <h3 className="heading-md">{mode.title}</h3>
                <p className="text-secondary">{mode.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="u-flex u-flex-between u-flex-wrap u-gap-sm">
            <h2 className="heading-lg">Recent Sessions</h2>
          </div>
          <div className="card card--practice">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Session</th>
                  <th>Date</th>
                  <th>Avg WPM</th>
                  <th>Fillers</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.name}>
                    <td>{session.name}</td>
                    <td>{session.date}</td>
                    <td>{session.wpm}</td>
                    <td>{session.filler}</td>
                    <td>{session.duration}</td>
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
