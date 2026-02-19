/**
 * src/features/drill-engine/FeedbackCard.tsx
 *
 * Pure display component for drill evaluation results.
 * No hooks, no state, no logic — renders what useDrillSession provides.
 *
 * Three score states per dimension:
 *   loaded      — accuracyScore / impactScore are numbers
 *   geminiLoading — spinner shown
 *   failed      — "— (Pending)" shown
 */

interface FeedbackCardProps {
  techniqueName: string;
  formScore: number;
  accuracyScore: number | null;
  impactScore: number | null;
  compositeScore: number;
  explanation: string;
  geminiSucceeded: boolean;
  geminiLoading: boolean;
  onNext: () => void;
  attemptCount: number;
  streak: number;
  patternSignals?: string[]; // Optional pattern signals from detection
  patternNote?: string; // Optional pattern coaching note
}

// ---------------------------------------------------------------------------
// Helper: scoreLabel
// ---------------------------------------------------------------------------

type ScoreDimension = "form" | "accuracy" | "impact" | "composite";

function scoreLabel(score: number, dimension: ScoreDimension): string {
  if (dimension === "form") {
    if (score >= 90) return "Mastered";
    if (score >= 75) return "Well-formed";
    if (score >= 60) return "Close";
    return "Needs work";
  }
  if (dimension === "accuracy") {
    if (score >= 90) return "Mastered";
    if (score >= 75) return "Strong";
    if (score >= 60) return "Adequate";
    return "Off-target";
  }
  if (dimension === "impact") {
    if (score >= 90) return "Mastered";
    if (score >= 75) return "Effective";
    if (score >= 60) return "Moderate";
    return "Weak";
  }
  // composite
  if (score >= 90) return "Mastered";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Close";
  return "Needs work";
}

// ---------------------------------------------------------------------------
// Helper: scoreColor
// ---------------------------------------------------------------------------

function scoreColor(score: number): string {
  if (score >= 90) return "text-status-success";
  if (score >= 75) return "text-accent";
  if (score >= 60) return "text-text-muted";
  return "text-status-error";
}

// ---------------------------------------------------------------------------
// Sub-component: ScoreRow
// ---------------------------------------------------------------------------

interface ScoreRowProps {
  label: string;
  score: number | null;
  dimension: ScoreDimension;
  geminiLoading: boolean;
  geminiSucceeded: boolean;
}

function ScoreRow({
  label,
  score,
  dimension,
  geminiLoading,
  geminiSucceeded,
}: ScoreRowProps) {
  // Form score is always available (rules-based)
  if (dimension === "form" && score !== null) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-text-muted text-sm font-medium">{label}</span>
        <span className={`font-semibold text-sm ${scoreColor(score)}`}>
          {score}% — {scoreLabel(score, dimension)}
        </span>
      </div>
    );
  }

  // Gemini dimensions
  if (geminiLoading) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-text-muted text-sm font-medium">{label}</span>
        <span className="flex items-center gap-2 text-text-muted text-sm">
          <span
            className="inline-block w-3 h-3 border-2 border-accent border-t-transparent rounded-full animate-spin"
            aria-label="Scoring"
          />
          Scoring...
        </span>
      </div>
    );
  }

  if (score !== null) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-text-muted text-sm font-medium">{label}</span>
        <span className={`font-semibold text-sm ${scoreColor(score)}`}>
          {score}% — {scoreLabel(score, dimension)}
        </span>
      </div>
    );
  }

  // Gemini failed and score is null
  if (!geminiSucceeded) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-text-muted text-sm font-medium">{label}</span>
        <span className="text-text-subtle text-sm">— (Pending)</span>
      </div>
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// FeedbackCard
// ---------------------------------------------------------------------------

export function FeedbackCard({
  techniqueName,
  formScore,
  accuracyScore,
  impactScore,
  compositeScore,
  explanation,
  geminiSucceeded,
  geminiLoading,
  onNext,
  attemptCount,
  streak,
  patternSignals,
  patternNote,
}: FeedbackCardProps) {
  // Composite is only shown once all Gemini scores are available
  const showComposite = !geminiLoading && (geminiSucceeded || !geminiLoading);
  const compositeReady = !geminiLoading && geminiSucceeded;

  return (
    <div className="card-surface rounded-2xl p-6 space-y-5">
      {/* Technique name */}
      <div>
        <h3 className="text-h4 font-display text-text">{techniqueName}</h3>
        <p className="text-text-subtle text-xs mt-1 uppercase tracking-widest">
          Feedback
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-background-elevated" />

      {/* Score rows */}
      <div className="space-y-1">
        <ScoreRow
          label="Form"
          score={formScore}
          dimension="form"
          geminiLoading={false}
          geminiSucceeded={true}
        />
        <ScoreRow
          label="Accuracy"
          score={accuracyScore}
          dimension="accuracy"
          geminiLoading={geminiLoading}
          geminiSucceeded={geminiSucceeded}
        />
        <ScoreRow
          label="Impact"
          score={impactScore}
          dimension="impact"
          geminiLoading={geminiLoading}
          geminiSucceeded={geminiSucceeded}
        />
      </div>

      {/* Composite — only visible when all scores loaded */}
      {showComposite && (
        <>
          <div className="border-t border-background-elevated" />
          <div className="flex items-center justify-between">
            <span className="text-text text-sm font-semibold">Composite</span>
            {compositeReady ? (
              <span
                className={`font-bold text-base ${scoreColor(compositeScore)}`}
              >
                {compositeScore}% — {scoreLabel(compositeScore, "composite")}
              </span>
            ) : (
              <span className="text-text-muted text-sm">
                {formScore}% (Form only)
              </span>
            )}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="border-t border-background-elevated" />

      {/* Coaching text */}
      <p className="text-text-muted text-base leading-relaxed">{explanation}</p>

      {/* Pattern Signals — if provided */}
      {(patternSignals || patternNote) && (
        <>
          <div className="border-t border-background-elevated" />
          <div className="space-y-3">
            {patternSignals && patternSignals.length > 0 && (
              <div className="space-y-2">
                {patternSignals.map((signal, idx) => (
                  <p key={idx} className="text-text text-base leading-relaxed">
                    {signal}
                  </p>
                ))}
              </div>
            )}
            {patternNote && (
              <p className="text-accent text-base font-medium leading-relaxed">
                {patternNote}
              </p>
            )}
          </div>
        </>
      )}

      {/* Divider */}
      <div className="border-t border-background-elevated" />

      {/* Attempt / streak badges */}
      {attemptCount > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-subtle bg-background-elevated rounded-full px-3 py-1">
            Attempt {attemptCount}
          </span>
          {streak > 0 && (
            <span className="text-xs text-accent bg-accent/10 border border-accent/30 rounded-full px-3 py-1 font-medium">
              {streak} in a row
            </span>
          )}
        </div>
      )}

      {/* Next Scenario button */}
      <button onClick={onNext} className="btn-primary w-full">
        Next Scenario
      </button>
    </div>
  );
}
