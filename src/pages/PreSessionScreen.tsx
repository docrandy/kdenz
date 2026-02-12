import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DurationSelector from "../components/DurationSelector";
import PromptSelector from "../components/PromptSelector";
import { AppHeader } from "../components/AppHeader";
import { SpeakingPrompt } from "../data/speakingPrompts";
import { getLastDuration, saveLastDuration } from "../services/durationConfig";
import { getTechniqueById } from "../data/techniques";
import { FRAMEWORK_DISPLAY, DIFFICULTY_CONFIG } from "../types/technique";

export default function PreSessionScreen() {
  const { mode } = useParams<{ mode: "filler" | "pace" }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if this is technique practice mode
  const techniqueId = location.state?.techniqueId as string | undefined;
  const technique = techniqueId ? getTechniqueById(techniqueId) : undefined;

  const [selectedDuration, setSelectedDuration] = useState(() =>
    technique ? technique.duration_seconds : getLastDuration(),
  );
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(
    null,
  );

  const handleStartSession = () => {
    // Save duration preference (for free practice only)
    if (!technique) {
      saveLastDuration(selectedDuration);
    }

    if (technique) {
      // Technique practice mode
      navigate("/practice/technique", {
        state: {
          techniqueId: technique.id,
          durationSeconds: selectedDuration,
          practicePrompt: technique.practice_prompt,
          techniqueName: technique.technique_name,
        },
      });
    } else {
      // Free practice mode
      navigate(`/practice/${mode}`, {
        state: {
          durationSeconds: selectedDuration,
          speakingPrompt: selectedPrompt,
        },
      });
    }
  };

  const getModeTitle = () => {
    if (mode === "filler") return "Filler Words";
    if (mode === "pace") return "Speech Pace";
    return "Practice Session";
  };

  const handleBack = () => {
    if (technique) {
      navigate(`/technique/${technique.id}`);
    } else {
      navigate("/");
    }
  };

  // Technique Practice Mode
  if (technique) {
    const fw = FRAMEWORK_DISPLAY[technique.framework];
    const diff = DIFFICULTY_CONFIG[technique.difficulty];

    return (
      <div className="min-h-screen bg-background flex flex-col pb-safe">
        <AppHeader showBack onBack={handleBack} />

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
          <div className="w-full max-w-md space-y-6">
            {/* Technique Briefing Card */}
            <div className="bg-background-surface rounded-2xl p-6 border border-background-elevated space-y-4">
              {/* Technique name */}
              <h2 className="text-h3 font-display text-text-heading">
                {technique.technique_name}
              </h2>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 bg-accent/10 text-accent text-caption font-bold rounded uppercase tracking-wide">
                  {fw.label}
                </span>
                <span
                  className={`px-2.5 py-1 text-caption font-medium rounded ${diff.color} ${diff.bg}`}
                >
                  {diff.label}
                </span>
              </div>

              {/* What to practice */}
              <div>
                <h3 className="text-body font-semibold text-text mb-2">
                  What to practice
                </h3>
                <p className="text-body-sm text-text-muted leading-relaxed">
                  {technique.practice_prompt}
                </p>
              </div>

              {/* Success criteria */}
              <div>
                <h3 className="text-body font-semibold text-text mb-2">
                  Success criteria
                </h3>
                <ul className="space-y-1.5">
                  {technique.success_criteria.map((criterion, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-body-sm text-text-muted"
                    >
                      <span className="text-status-success mt-0.5 flex-shrink-0">
                        •
                      </span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Persona label */}
            <div className="flex items-center gap-2 text-body-sm text-text-muted">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="flex-shrink-0"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" />
                <circle cx="8" cy="6" r="2" fill="currentColor" />
                <path
                  d="M4 13C4 11 6 10 8 10C10 10 12 11 12 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>
                AI Coach — {fw.author} style, {diff.label.toLowerCase()}{" "}
                difficulty
              </span>
            </div>

            {/* Duration selector */}
            <DurationSelector
              selected={selectedDuration}
              onChange={setSelectedDuration}
            />

            {/* Start Practice CTA */}
            <button
              onClick={handleStartSession}
              className="btn-primary w-full text-body sm:text-body-lg min-h-[56px]"
            >
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Free Practice Mode
  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      <AppHeader showBack onBack={handleBack} />

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-h2 font-display text-text-heading">
              {getModeTitle()}
            </h1>
            <p className="text-body-sm sm:text-body text-text-muted mt-2">
              Choose your session length
            </p>
          </div>

          {/* Prompt selector */}
          <PromptSelector
            onSelect={setSelectedPrompt}
            selectedDuration={selectedDuration}
          />

          {/* Duration selector */}
          <DurationSelector
            selected={selectedDuration}
            onChange={setSelectedDuration}
          />

          {/* Start Session CTA */}
          <button
            onClick={handleStartSession}
            className="btn-primary w-full text-body sm:text-body-lg min-h-[56px]"
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}
