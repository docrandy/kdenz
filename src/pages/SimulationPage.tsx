/**
 * SimulationPage - Coming soon placeholder for Simulation Studio
 * AI-powered multi-turn conversations
 */

export default function SimulationPage() {
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
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
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
            Simulation Studio
          </h1>
          <span className="inline-block px-3 py-1 text-caption font-medium bg-accent/10 text-accent rounded-full">
            Coming Soon
          </span>
        </div>

        {/* Description */}
        <p className="text-body text-text-body leading-relaxed">
          Practice techniques against AI-powered opponents in realistic
          multi-turn conversations across 5 difficulty levels.
        </p>

        {/* Feature preview */}
        <div className="card-surface text-left space-y-4">
          <h3 className="text-body-sm font-semibold text-text-heading">
            What to expect
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "Multi-turn AI opponents",
                desc: "Realistic counterparts that adapt to your techniques",
              },
              {
                title: "Technique detection",
                desc: "Real-time recognition of labeling, mirroring, and more",
              },
              {
                title: "Post-session analysis",
                desc: "Detailed breakdown of what worked and what to improve",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-3">
                <span className="text-accent mt-0.5 flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 8l1.5 1.5L10 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-body-sm font-medium text-text-heading">
                    {feature.title}
                  </p>
                  <p className="text-caption text-text-muted">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
