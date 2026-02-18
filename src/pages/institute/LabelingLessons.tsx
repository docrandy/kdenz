/**
 * Institute Lesson Pages for Labeling Criteria
 *
 * Routes:
 *   /institute/labeling/syntax
 *   /institute/labeling/emotion
 *   /institute/labeling/depth
 *   /institute/labeling/silence
 *
 * Each page is the target when users click a criterion in the CriteriaBar.
 */

import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Example card sub-component
// ---------------------------------------------------------------------------

function ExampleCard({
  novice,
  expert,
  label,
}: {
  novice: string;
  expert: string;
  label?: string;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-red-400 mb-1">
          Novice{label ? ` — ${label}` : ""}
        </p>
        <p className="text-sm text-text-muted italic">&ldquo;{novice}&rdquo;</p>
      </div>
      <div className="bg-status-success/5 border border-status-success/20 rounded-lg p-3">
        <p className="text-[10px] uppercase tracking-wider text-status-success mb-1">
          Expert
        </p>
        <p className="text-sm text-text italic">&ldquo;{expert}&rdquo;</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section component
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold text-text">{title}</h3>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Page content per topic
// ---------------------------------------------------------------------------

function SyntaxContent() {
  return (
    <div className="space-y-6">
      <Section title="The Formula">
        <p className="text-sm text-text-muted leading-relaxed">
          Every label starts with one of three openers. The subject is always{" "}
          <span className="text-text font-medium">&ldquo;it&rdquo;</span> —
          never &ldquo;I&rdquo; or &ldquo;you.&rdquo;
        </p>
        <div className="bg-background-elevated rounded-lg p-4 space-y-2">
          <p className="text-sm text-accent font-medium">
            &ldquo;It seems like...&rdquo;
          </p>
          <p className="text-sm text-accent font-medium">
            &ldquo;It sounds like...&rdquo;
          </p>
          <p className="text-sm text-accent font-medium">
            &ldquo;It looks like...&rdquo;
          </p>
        </div>
      </Section>

      <Section title="Statement, Not Question">
        <p className="text-sm text-text-muted leading-relaxed">
          Labels are statements. Never end with &ldquo;?&rdquo; or
          &ldquo;right?&rdquo; Questions trigger cognitive defense — the
          listener starts constructing a rebuttal instead of processing the
          observation.
        </p>
      </Section>

      <Section title="No Hedging">
        <p className="text-sm text-text-muted leading-relaxed">
          Remove &ldquo;maybe,&rdquo; &ldquo;kind of,&rdquo; &ldquo;sort
          of,&rdquo; and &ldquo;I think.&rdquo; Fillers and qualifiers destroy
          conviction. The listener cannot trust a hesitant observation.
        </p>
      </Section>

      <Section title="Examples">
        <ExampleCard
          label="I-framing"
          novice="I'm hearing that you're frustrated."
          expert="It sounds like something about this is frustrating."
        />
        <ExampleCard
          label="You-framing"
          novice="You seem upset about the timeline."
          expert="It seems like the timeline landed differently than expected."
        />
        <ExampleCard
          label="Question form"
          novice="It seems like you're hesitant, right?"
          expert="It seems like you're hesitant."
        />
      </Section>
    </div>
  );
}

function EmotionContent() {
  return (
    <div className="space-y-6">
      <Section title="Name an Emotion, Not Content">
        <p className="text-sm text-text-muted leading-relaxed">
          A label names an emotion or experience — not the facts of the
          situation. Naming content (&ldquo;the price is wrong&rdquo;) is
          paraphrasing. Naming emotion (&ldquo;concerned about the
          investment&rdquo;) is labeling.
        </p>
        <ExampleCard
          label="Content"
          novice="It seems like the price is the problem."
          expert="It seems like you're concerned about the investment."
        />
      </Section>

      <Section title="Useful Emotion Vocabulary">
        <div className="bg-background-elevated rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {[
              "concerned",
              "frustrated",
              "worried",
              "overwhelmed",
              "hesitant",
              "uncertain",
              "uncomfortable",
              "anxious",
              "disappointed",
              "pressured",
              "conflicted",
              "unsettled",
              "guarded",
              "skeptical",
              "vulnerable",
            ].map((word) => (
              <span
                key={word}
                className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Go Beyond the Obvious">
        <p className="text-sm text-text-muted leading-relaxed">
          &ldquo;Frustrated&rdquo; and &ldquo;upset&rdquo; are common but vague.
          Try to be more specific: &ldquo;worried about how this looks to
          leadership&rdquo; is far more powerful than &ldquo;upset about the
          situation.&rdquo;
        </p>
        <ExampleCard
          novice="It seems like you're upset."
          expert="It seems like you're worried this puts you in a difficult position."
        />
      </Section>
    </div>
  );
}

function DepthContent() {
  return (
    <div className="space-y-6">
      <Section title="Three Depth Levels">
        <p className="text-sm text-text-muted leading-relaxed">
          Every label operates at one of three depth levels. Better labels go
          deeper.
        </p>
      </Section>

      {/* Surface */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-amber-400 font-medium">
          Surface
        </p>
        <p className="text-sm text-text-muted">
          The obvious emotion: frustrated, angry, upset.
        </p>
        <p className="text-sm text-text italic">
          &ldquo;It seems like you're frustrated.&rdquo;
        </p>
        <p className="text-xs text-text-subtle">
          Impact: They feel seen but not understood.
        </p>
      </div>

      {/* Underlying */}
      <div className="bg-status-success/5 border border-status-success/20 rounded-xl p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-status-success font-medium">
          Underlying
        </p>
        <p className="text-sm text-text-muted">
          WHY they feel that way — the driver, fear, or constraint.
        </p>
        <p className="text-sm text-text italic">
          &ldquo;It seems like you're worried this sets a precedent.&rdquo;
        </p>
        <p className="text-xs text-text-subtle">
          Impact: They feel perspective-taking. They open up.
        </p>
      </div>

      {/* Identity */}
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-4 space-y-2">
        <p className="text-xs uppercase tracking-wider text-accent font-medium">
          Identity
        </p>
        <p className="text-sm text-text-muted">
          WHO they're trying to be — their core need or self-concept.
        </p>
        <p className="text-sm text-text italic">
          &ldquo;It seems like being seen as someone who protects the team
          matters here.&rdquo;
        </p>
        <p className="text-xs text-text-subtle">
          Impact: Deep psychological safety. &ldquo;That's right!&rdquo;
          response.
        </p>
      </div>

      <Section title="The Key Question">
        <div className="bg-background-elevated rounded-lg p-4">
          <p className="text-sm text-text font-medium text-center">
            Ask yourself:{" "}
            <span className="text-accent">
              &ldquo;What do they stand to LOSE?&rdquo;
            </span>
          </p>
          <p className="text-xs text-text-subtle text-center mt-2">
            That's the underlying driver.
          </p>
        </div>
      </Section>
    </div>
  );
}

function SilenceContent() {
  return (
    <div className="space-y-6">
      <Section title="The 3-Second Rule">
        <p className="text-sm text-text-muted leading-relaxed">
          After your label, pause for at least 3 seconds. The silence gives the
          other person space to process the observation and formulate a
          response.
        </p>
        <div className="bg-background-elevated rounded-lg p-4 text-center">
          <p className="text-sm text-text font-medium">Count silently:</p>
          <p className="text-accent text-lg font-medium mt-2">
            one-one-thousand, two-one-thousand, three-one-thousand.
          </p>
        </div>
      </Section>

      <Section title="Typical Range">
        <p className="text-sm text-text-muted leading-relaxed">
          3-12 seconds is normal. Some of the most productive silences last 5-8
          seconds. The other person is thinking — let them.
        </p>
      </Section>

      <Section title="Common Mistake: Filling the Silence">
        <p className="text-sm text-text-muted leading-relaxed">
          The most common mistake is adding filler after the label:
        </p>
        <div className="space-y-2 mt-2">
          <ExampleCard
            novice="It seems like you're hesitant. I mean, I just want to understand..."
            expert="It seems like you're hesitant. [3+ seconds of silence]"
          />
        </div>
        <p className="text-sm text-text-muted leading-relaxed mt-2">
          Resist the urge to explain, rephrase, or ask a follow-up. The label
          was the observation. The silence is where the magic happens.
        </p>
      </Section>

      <Section title="Why It Works">
        <p className="text-sm text-text-muted leading-relaxed">
          Silence after a label creates productive tension. The other person
          feels compelled to confirm, correct, or elaborate — all of which give
          you information you didn't have before.
        </p>
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Topic metadata
// ---------------------------------------------------------------------------

const TOPIC_MAP: Record<string, { title: string; Content: () => ReactNode }> = {
  syntax: { title: "Label Syntax", Content: SyntaxContent },
  emotion: { title: "Naming Emotions", Content: EmotionContent },
  depth: { title: "Emotion Depth Levels", Content: DepthContent },
  silence: { title: "Dynamic Silence", Content: SilenceContent },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LabelingLessons() {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();

  const entry = topic ? TOPIC_MAP[topic] : undefined;

  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-text-muted">Topic not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="text-accent text-sm mt-4 hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const { title, Content } = entry;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-text-subtle hover:text-text text-sm transition-colors"
          aria-label="Go back"
        >
          &larr;
        </button>
        <h1 className="text-xl font-semibold text-text">{title}</h1>
      </div>

      {/* Content */}
      <Content />

      {/* Back to Practice */}
      <button
        onClick={() => navigate("/practice/labeling")}
        className="btn-primary w-full py-3 text-base font-medium"
      >
        Back to Practice
      </button>
    </div>
  );
}
