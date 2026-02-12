import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DurationSelector from "../components/DurationSelector";
import PromptSelector from "../components/PromptSelector";
import { SpeakingPrompt } from "../data/speakingPrompts";
import { getLastDuration, saveLastDuration } from "../services/durationConfig";

export default function PreSessionScreen() {
  const { mode } = useParams<{ mode: "filler" | "pace" }>();
  const navigate = useNavigate();

  const [selectedDuration, setSelectedDuration] = useState(() =>
    getLastDuration(),
  );
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(
    null,
  );

  const handleStartSession = () => {
    // Save duration preference
    saveLastDuration(selectedDuration);

    // Navigate to session with duration and optional prompt in route state
    navigate(`/practice/${mode}`, {
      state: {
        durationSeconds: selectedDuration,
        speakingPrompt: selectedPrompt,
      },
    });
  };

  const getModeTitle = () => {
    if (mode === "filler") return "Filler Words";
    if (mode === "pace") return "Speech Pace";
    return "Practice Session";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-safe">
      {/* Header with back button */}
      <div className="border-b border-background-elevated sticky top-0 z-10 bg-background-surface">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="text-text-muted hover:text-text active:text-text flex items-center gap-2 text-body-sm sm:text-body min-h-[44px]"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pb-20">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-h4 sm:text-h3 font-bold text-text">
              {getModeTitle()}
            </h1>
            <p className="text-body-sm sm:text-body text-text-muted mt-2">
              Choose your session length
            </p>
          </div>

          {/* Duration selector */}
          <DurationSelector
            selected={selectedDuration}
            onChange={setSelectedDuration}
          />

          {/* Prompt selector */}
          <PromptSelector
            onSelect={setSelectedPrompt}
            selectedDuration={selectedDuration}
          />

          {/* Start button */}
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
