/**
 * BreathingScreen - Box breathing (4-4-4-4) exercise with animated circle
 * Available as pre-session warm-up and standalone from navigation
 */

import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import "./BreathingScreen.css";

type BreathingPhase = "inhale" | "hold1" | "exhale" | "hold2";

const PHASE_DURATION = 4000; // 4 seconds per phase
const PHASE_LABELS: Record<BreathingPhase, string> = {
  inhale: "Breathe In",
  hold1: "Hold",
  exhale: "Breathe Out",
  hold2: "Hold",
};

export default function BreathingScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [cycleCount, setCycleCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cycleProgress, setCycleProgress] = useState<number>(0); // 0-100 for entire cycle (all 4 phases)
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if pre-session context
  const isPreSession = new URLSearchParams(location.search).get("context") === "pre-session";
  const practiceMode = location.state?.mode as "filler" | "pace" | "technique" | undefined;
  const practiceState = location.state;

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const startBreathing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    setIsActive(true);
    const phases: BreathingPhase[] = ["inhale", "hold1", "exhale", "hold2"];
    let currentPhaseIndex = 0;
    const TOTAL_CYCLE_DURATION = PHASE_DURATION * 4; // 16 seconds total

    // Continuous progress bar update (every 50ms for smooth animation)
    // Progress goes from 0-100% across all 4 phases (16 seconds total)
    const updateProgress = () => {
      setCycleProgress((prev) => {
        const increment = (100 / (TOTAL_CYCLE_DURATION / 50));
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          // Reset to 0 and increment cycle count
          setCycleCount((count) => count + 1);
          return 0;
        }
        return newProgress;
      });
    };

    // Start progress bar from 0
    setCycleProgress(0);
    progressIntervalRef.current = setInterval(updateProgress, 50);

    const advancePhase = () => {
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const newPhase = phases[currentPhaseIndex];
      setPhase(newPhase);
    };

    // Set initial phase
    setPhase(phases[0]);

    // Advance phase every 4 seconds
    intervalRef.current = setInterval(advancePhase, PHASE_DURATION);
  };

  const handleStart = () => {
    startBreathing();
  };

  const handleEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    setIsActive(false);
    setCycleProgress(0);

    // Navigate based on context
    if (isPreSession && practiceMode) {
      if (practiceMode === "technique") {
        // Navigate to technique practice
        navigate("/practice/technique", {
          state: practiceState,
        });
      } else {
        // Navigate to free practice recording
        navigate(`/practice/${practiceMode}`, {
          state: practiceState,
        });
      }
    } else {
      // Navigate to dashboard
      navigate("/");
    }
  };

  const handleBack = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    if (isPreSession) {
      // Go back to pre-session screen
      navigate(-1);
    } else {
      // Go to dashboard
      navigate("/");
    }
  };

  // Get animation class based on phase
  const getAnimationClass = () => {
    if (!isActive) return "";
    switch (phase) {
      case "inhale":
        return "breathing-inhale";
      case "hold1":
        return "breathing-hold";
      case "exhale":
        return "breathing-exhale";
      case "hold2":
        return "breathing-hold2";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showBack onBack={handleBack} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md text-center">
          {/* Animated breathing circle with progress ring */}
          <div className="mb-8 flex items-center justify-center relative">
            {/* Progress ring (SVG circle) - single color */}
            <svg
              className="absolute w-64 h-64 transform -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="2"
                strokeOpacity="0.2"
              />
              {/* Progress circle - single color */}
              {isActive && (
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--color-gold-500)"
                  strokeWidth="3"
                  strokeOpacity="0.8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - cycleProgress / 100)}`}
                  className="transition-all duration-50"
                />
              )}
            </svg>
            {/* Animated breathing circle with pie chart inside */}
            <div
              className={`w-64 h-64 rounded-full bg-accent/30 flex items-center justify-center transition-all duration-300 relative ${getAnimationClass()}`}
            >
              {/* Pie chart showing 60% inhale, 40% exhale */}
              <svg
                className="absolute w-48 h-48"
                viewBox="0 0 100 100"
              >
                {/* Inhale segment (60% = 216 degrees) - Gold */}
                {/* Start at top (0°), sweep 216° clockwise */}
                <path
                  d="M 50,50 L 50,0 A 50,50 0 1,1 9.55,20.6 Z"
                  fill="var(--color-gold-500)"
                  fillOpacity="0.5"
                />
                {/* Exhale segment (40% = 144 degrees) - Blue */}
                {/* Continue from 216° to 360° (back to top) */}
                <path
                  d="M 50,50 L 9.55,20.6 A 50,50 0 0,1 50,0 Z"
                  fill="#60a5fa"
                  fillOpacity="0.5"
                />
              </svg>
              <div className="w-48 h-48 rounded-full bg-accent/20 relative z-10" />
            </div>
          </div>

          {/* Phase text */}
          <h2 className="text-h2 font-display font-semibold text-text-heading mb-4">
            {PHASE_LABELS[phase]}
          </h2>

          {/* Cycle counter */}
          <p className="text-body-sm text-text-muted mb-8">
            {isActive
              ? cycleCount > 0
                ? `Cycle ${cycleCount}`
                : "Starting..."
              : "Ready to begin"}
          </p>

          {/* Control buttons */}
          {!isActive ? (
            <button
              onClick={handleStart}
              className="btn btn-primary min-w-[120px]"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleEnd}
              className="btn btn-secondary min-w-[120px]"
            >
              {isPreSession ? "Skip" : "End"}
            </button>
          )}

          {/* Helper text */}
          <p className="text-caption text-text-muted mt-6">
            {!isActive
              ? "Take a moment to center yourself with box breathing (4-4-4-4)"
              : isPreSession
                ? "Take your time. When you're ready, tap Skip to begin your session."
                : "Continue until you feel centered and ready."}
          </p>
        </div>
      </main>
    </div>
  );
}
