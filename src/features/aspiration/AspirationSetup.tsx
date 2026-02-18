import { useState } from "react";
import type { ArchetypeId, UserAspiration } from "../../types/aspiration";
import { saveAspiration } from "../../utils/aspirationStorage";
import { getArchetypeById } from "../../data/voiceArchetypes";

interface AspirationSetupProps {
  onComplete: (aspiration: UserAspiration) => void;
  onSkip?: () => void;
  initialAspiration?: UserAspiration | null;
}

type Question = 1 | 2 | 3;

// Feeling pill -> archetype mapping (some resolve to disambiguation)
interface FeelingOption {
  label: string;
  archetype: ArchetypeId | "calm_and_safe_disambiguation";
}

const FEELING_OPTIONS: FeelingOption[] = [
  { label: "Respected & confident", archetype: "grounded_authority" },
  { label: "Calm & safe", archetype: "calm_and_safe_disambiguation" },
  { label: "Connected & understood", archetype: "warm_connector" },
  { label: "Energized & inspired", archetype: "motivator" },
  { label: "Clear & precise", archetype: "analytical_clarifier" },
  { label: "Relaxed & disarmed", archetype: "playful_persuader" },
];

const GAP_OPTIONS = [
  "I speed up under pressure",
  "I hedge with 'I think' and 'maybe'",
  "I fill every silence",
  "I over-explain when challenged",
  "I go flat/monotone when it matters",
  "I avoid saying what I actually see",
  "I come across as cold when I'm focused",
];

// Determine archetype from feeling selection (resolves disambiguation)
function resolveArchetype(
  option: FeelingOption,
  disambiguationChoice: "fm_dj" | "calm_negotiator" | null,
): ArchetypeId {
  if (option.archetype === "calm_and_safe_disambiguation") {
    return disambiguationChoice ?? "fm_dj";
  }
  return option.archetype as ArchetypeId;
}

export function AspirationSetup({
  onComplete,
  onSkip,
  initialAspiration,
}: AspirationSetupProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(1);
  const [aspirationText, setAspirationText] = useState(
    initialAspiration?.aspiration_text ?? "",
  );
  const [selectedFeelings, setSelectedFeelings] = useState<FeelingOption[]>(
    () => {
      if (!initialAspiration) return [];
      // Re-hydrate from saved archetype ids
      return FEELING_OPTIONS.filter((opt) => {
        const resolved = resolveArchetype(opt, "fm_dj");
        return (
          resolved === initialAspiration.primary_archetype_id ||
          resolved === initialAspiration.secondary_archetype_id
        );
      });
    },
  );
  const [disambiguationChoice, setDisambiguationChoice] = useState<
    "fm_dj" | "calm_negotiator" | null
  >(() => {
    if (!initialAspiration) return null;
    if (initialAspiration.primary_archetype_id === "fm_dj") return "fm_dj";
    if (initialAspiration.primary_archetype_id === "calm_negotiator")
      return "calm_negotiator";
    if (initialAspiration.secondary_archetype_id === "fm_dj") return "fm_dj";
    if (initialAspiration.secondary_archetype_id === "calm_negotiator")
      return "calm_negotiator";
    return null;
  });
  const [selectedGaps, setSelectedGaps] = useState<string[]>(
    initialAspiration?.gap_awareness ?? [],
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedAspiration, setSavedAspiration] = useState<UserAspiration | null>(
    null,
  );
  const [transitioning, setTransitioning] = useState(false);

  // Resolve primary/secondary from selected feelings
  const getPrimaryArchetype = (): ArchetypeId | null => {
    if (selectedFeelings.length === 0) return null;
    return resolveArchetype(selectedFeelings[0], disambiguationChoice);
  };

  const getSecondaryArchetype = (): ArchetypeId | undefined => {
    if (selectedFeelings.length < 2) return undefined;
    return resolveArchetype(selectedFeelings[1], disambiguationChoice);
  };

  const isCalmAndSafeSelected = selectedFeelings.some(
    (f) => f.archetype === "calm_and_safe_disambiguation",
  );

  const navigateTo = (question: Question) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentQuestion(question);
      setTransitioning(false);
    }, 150);
  };

  const handleFeelingToggle = (option: FeelingOption) => {
    setSelectedFeelings((prev) => {
      const already = prev.find((f) => f.label === option.label);
      if (already) {
        // Deselect
        const next = prev.filter((f) => f.label !== option.label);
        // Clear disambiguation if calm_and_safe deselected
        if (option.archetype === "calm_and_safe_disambiguation") {
          setDisambiguationChoice(null);
        }
        return next;
      }
      if (prev.length >= 2) {
        // Replace second selection
        return [prev[0], option];
      }
      return [...prev, option];
    });
  };

  const handleGapToggle = (gap: string) => {
    setSelectedGaps((prev) => {
      if (prev.includes(gap)) return prev.filter((g) => g !== gap);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, gap];
    });
  };

  const handleDone = () => {
    const primary = getPrimaryArchetype();
    if (!primary) return;

    const now = new Date().toISOString();
    const aspiration: UserAspiration = {
      primary_archetype_id: primary,
      secondary_archetype_id: getSecondaryArchetype(),
      aspiration_text: aspirationText.trim() || undefined,
      gap_awareness: selectedGaps.length > 0 ? selectedGaps : undefined,
      set_at: initialAspiration?.set_at ?? now,
      updated_at: now,
    };

    saveAspiration(aspiration);
    setSavedAspiration(aspiration);
    setShowConfirmation(true);

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      onComplete(aspiration);
    }, 2000);
  };

  // Confirmation card
  if (showConfirmation && savedAspiration) {
    const archetype = getArchetypeById(savedAspiration.primary_archetype_id);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4 animate-fade-in">
          <p className="text-4xl font-bold text-accent">{archetype.name}</p>
          <p className="text-text-subtle text-base">{archetype.description}</p>
          <p className="text-text-muted text-sm mt-6">
            This is your target. We'll show you the gap.
          </p>
        </div>
      </div>
    );
  }

  const stepDots = (
    <div className="flex justify-center gap-2 mb-8">
      {([1, 2, 3] as Question[]).map((q) => (
        <div
          key={q}
          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
            q === currentQuestion
              ? "bg-accent"
              : q < currentQuestion
                ? "bg-accent/40"
                : "bg-background-elevated"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Back button (Q2, Q3) */}
      <header className="px-4 pt-4 pb-2 flex items-center">
        {currentQuestion > 1 ? (
          <button
            onClick={() => navigateTo((currentQuestion - 1) as Question)}
            className="text-text-muted hover:text-text flex items-center gap-1 text-sm"
            aria-label="Go back"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        ) : onSkip ? (
          <button
            onClick={onSkip}
            className="text-text-muted hover:text-text text-sm ml-auto"
          >
            Skip
          </button>
        ) : (
          <div />
        )}
        {/* Skip link on Q1 when onSkip exists (right side) */}
        {currentQuestion === 1 && !onSkip && <div />}
      </header>

      <main
        className={`flex-1 flex flex-col max-w-md mx-auto w-full px-4 pb-4 transition-opacity duration-150 ${
          transitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {stepDots}

        {/* Question 1: Reference Communicator */}
        {currentQuestion === 1 && (
          <div className="flex flex-col flex-1">
            <h1 className="text-xl font-semibold text-text mb-2">
              Think of someone whose voice made you think: 'I want that.'
            </h1>
            <p className="text-sm text-text-subtle mb-6">
              A speaker, a host, a negotiator, a friend — anyone.
            </p>
            <textarea
              value={aspirationText}
              onChange={(e) => setAspirationText(e.target.value)}
              placeholder="e.g., 'My thesis advisor — always calm, never rushed'"
              rows={3}
              className="input w-full resize-none mb-3"
              autoFocus
            />
            <button
              onClick={() => navigateTo(2)}
              disabled={aspirationText.trim().length < 3}
              className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed mb-3"
            >
              Next
            </button>
            <button
              onClick={() => {
                setAspirationText("");
                navigateTo(2);
              }}
              className="text-text-muted hover:text-text text-sm text-center"
            >
              I'm not sure &rarr;
            </button>
          </div>
        )}

        {/* Question 2: Feeling Selection */}
        {currentQuestion === 2 && (
          <div className="flex flex-col flex-1">
            <h1 className="text-xl font-semibold text-text mb-2">
              How do people feel when they hear you at your best?
            </h1>
            <p className="text-sm text-text-subtle mb-6">
              Pick the 1-2 words that matter most.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {FEELING_OPTIONS.map((option) => {
                const isSelected = selectedFeelings.some(
                  (f) => f.label === option.label,
                );
                return (
                  <button
                    key={option.label}
                    onClick={() => handleFeelingToggle(option)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors duration-150 ${
                      isSelected
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-background-elevated border-background-elevated hover:border-accent/40 text-text"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            {/* Disambiguation for "Calm & safe" */}
            {isCalmAndSafeSelected && (
              <div className="bg-background-elevated rounded-lg p-4 mb-4 border border-background-elevated">
                <p className="text-sm text-text-muted mb-3">
                  More like a late-night radio host (warm + authoritative) or a
                  therapist (slow, holding space)?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDisambiguationChoice("fm_dj")}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      disambiguationChoice === "fm_dj"
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-background border-background-elevated text-text-muted hover:border-accent/40"
                    }`}
                  >
                    Radio host
                  </button>
                  <button
                    onClick={() => setDisambiguationChoice("calm_negotiator")}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                      disambiguationChoice === "calm_negotiator"
                        ? "bg-accent/10 border-accent text-accent"
                        : "bg-background border-background-elevated text-text-muted hover:border-accent/40"
                    }`}
                  >
                    Therapist
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => navigateTo(3)}
              disabled={
                selectedFeelings.length === 0 ||
                (isCalmAndSafeSelected && disambiguationChoice === null)
              }
              className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
            >
              Next
            </button>
          </div>
        )}

        {/* Question 3: Gap Awareness */}
        {currentQuestion === 3 && (
          <div className="flex flex-col flex-1">
            <h1 className="text-xl font-semibold text-text mb-2">
              What gets in the way?
            </h1>
            <p className="text-sm text-text-subtle mb-6">
              What keeps you from sounding like that naturally?
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {GAP_OPTIONS.map((gap) => {
                const isSelected = selectedGaps.includes(gap);
                const isDisabled = !isSelected && selectedGaps.length >= 3;
                return (
                  <button
                    key={gap}
                    onClick={() => !isDisabled && handleGapToggle(gap)}
                    className={`px-4 py-3 rounded-lg border text-sm text-left transition-colors duration-150 ${
                      isSelected
                        ? "bg-accent/10 border-accent text-accent font-medium"
                        : isDisabled
                          ? "bg-background-elevated border-background-elevated text-text-muted opacity-50 cursor-not-allowed"
                          : "bg-background-elevated border-background-elevated hover:border-accent/40 text-text"
                    }`}
                  >
                    {gap}
                  </button>
                );
              })}
            </div>

            {selectedGaps.length > 0 && selectedGaps.length < 3 && (
              <p className="text-xs text-text-subtle text-center mb-4">
                Select up to {3 - selectedGaps.length} more, or tap Done
              </p>
            )}

            <button
              onClick={handleDone}
              disabled={selectedGaps.length === 0}
              className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed mt-auto"
            >
              Done
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
