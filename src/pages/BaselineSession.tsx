import { useNavigate } from "react-router-dom";

export default function BaselineSession() {
  const navigate = useNavigate();

  const handleBeginBaseline = () => {
    // Navigate to practice session with baseline configuration
    navigate("/practice/baseline", {
      state: {
        durationSeconds: 180,
        isBaseline: true,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text mb-3">
            Let's establish your baseline
          </h1>
        </div>

        {/* Main instructional copy */}
        <div className="bg-background-surface border border-background-elevated rounded-lg p-6 space-y-4">
          <p className="text-lg text-text-muted leading-relaxed">
            For the next 3 minutes, we'll measure your typical pace, pauses, and
            filler word usage. Just speak naturally — there are no wrong
            answers.
          </p>

          <p className="text-base text-text-muted">
            From your next session onward, we'll show your progress relative to
            this baseline — not comparisons to other people.
          </p>
        </div>

        {/* What to expect */}
        <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
          <p className="text-sm text-text-muted">
            We'll give you a few topics to talk about. New prompts will appear
            as you go — just speak naturally.
          </p>
        </div>

        {/* Begin button */}
        <button
          onClick={handleBeginBaseline}
          className="btn-primary w-full text-lg"
        >
          Begin Baseline
        </button>
      </div>
    </div>
  );
}
