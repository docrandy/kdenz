/**
 * InstitutePage - Coming soon placeholder for KDENZ Institute
 * Educational content: videos, demos, articles, quizzes
 */

export default function InstitutePage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-12">
      <div className="max-w-md mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto rounded-2xl bg-background-elevated flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent"
          >
            <path
              d="M4 19.5A2.5 2.5 0 016.5 17H20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-h3 font-display font-bold text-text-heading mb-2">
            KDENZ Institute
          </h1>
          <span className="inline-block px-3 py-1 text-caption font-medium bg-accent/10 text-accent rounded-full">
            Coming Soon
          </span>
        </div>

        {/* Description */}
        <p className="text-body text-text-body leading-relaxed">
          Educational content across all frameworks: video explainers, technique
          demonstrations, articles, and quizzes.
        </p>

        {/* Content type badges */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "Video Lessons", color: "text-warning" },
            { label: "Technique Demos", color: "text-info" },
            { label: "Articles", color: "text-success" },
            { label: "Quizzes", color: "text-accent" },
          ].map((type) => (
            <span
              key={type.label}
              className={`px-3 py-1.5 text-caption font-medium bg-background-elevated rounded-lg ${type.color}`}
            >
              {type.label}
            </span>
          ))}
        </div>

        {/* Learning sequence card */}
        <div className="card-surface text-left space-y-4">
          <h3 className="text-body-sm font-semibold text-text-heading">
            Practice-First Learning
          </h3>
          <div className="space-y-3">
            {[
              { step: "1", text: "Attempt techniques blind in Skills Lab" },
              { step: "2", text: "Watch expert demonstrations" },
              { step: "3", text: "Study the breakdown and theory" },
              { step: "4", text: "Return to practice with new insight" },
            ].map((item) => (
              <div key={item.step} className="flex gap-3 items-start">
                <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-caption font-bold flex items-center justify-center flex-shrink-0">
                  {item.step}
                </span>
                <p className="text-body-sm text-text-body">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
