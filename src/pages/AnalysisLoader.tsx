/**
 * AnalysisLoader - Premium loading screen shown after session recording stops
 * 
 * Features:
 * - Animated concentric rings (conveys intelligence/processing)
 * - Sequential step indicators with fade-in transitions
 * - Minimum 3.6 seconds display time
 * - Auto-navigates to post-session results
 */

import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import "./AnalysisLoader.css";

interface LocationState {
  destination?: string;
}

const STEPS = [
  "Analyzing your session...",
  "Detecting patterns...",
  "Generating insights...",
] as const;

const STEP_TIMINGS = [0, 1200, 2400]; // milliseconds
const COMPLETE_TIME = 3600; // 3.6 seconds total

export default function AnalysisLoader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState<number>(-1);

  // Get destination from route state, default to /practice/results
  const destination =
    (location.state as LocationState)?.destination || "/practice/results";

  useEffect(() => {
    // Check if session data exists (same guard as PostSessionResults)
    const stored = sessionStorage.getItem("voicelab_last_session");
    if (!stored) {
      navigate("/");
      return;
    }

    // Progress through steps
    const timeouts: NodeJS.Timeout[] = [];

    // Step 0 at 0ms
    timeouts.push(
      setTimeout(() => {
        setActiveStep(0);
      }, STEP_TIMINGS[0]),
    );

    // Step 1 at 1200ms
    timeouts.push(
      setTimeout(() => {
        setActiveStep(1);
      }, STEP_TIMINGS[1]),
    );

    // Step 2 at 2400ms
    timeouts.push(
      setTimeout(() => {
        setActiveStep(2);
      }, STEP_TIMINGS[2]),
    );

    // Complete at 3600ms, then navigate
    timeouts.push(
      setTimeout(() => {
        // Use replace: true so back button doesn't return to loader
        navigate(destination, { replace: true });
      }, COMPLETE_TIME),
    );

    // Cleanup timeouts on unmount
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [navigate, destination]);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showBack onBack={handleBack} />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Animated concentric rings */}
          <div className="relative w-[120px] h-[120px] mx-auto mb-8">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer ring - slow rotation */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="2"
                strokeOpacity="0.15"
                className="analysis-ring-1"
              />
              {/* Middle ring - medium rotation */}
              <circle
                cx="60"
                cy="60"
                r="40"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="2"
                strokeOpacity="0.25"
                className="analysis-ring-2"
              />
              {/* Inner ring - fast rotation */}
              <circle
                cx="60"
                cy="60"
                r="25"
                fill="none"
                stroke="var(--color-gold-500)"
                strokeWidth="2"
                strokeOpacity="0.4"
                className="analysis-ring-3"
              />
              {/* Center pulse */}
              <circle
                cx="60"
                cy="60"
                r="8"
                fill="var(--color-gold-500)"
                className="analysis-pulse"
              />
            </svg>
          </div>

          {/* Step indicators */}
          <div className="space-y-5">
            {STEPS.map((step, index) => {
              const isActive = activeStep >= index;
              const isCurrent = activeStep === index;

              return (
                <div
                  key={index}
                  className={`flex items-center justify-center gap-3 transition-all duration-400 ${
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2"
                  }`}
                >
                  {/* Dot indicator */}
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isCurrent
                        ? "bg-accent scale-125"
                        : isActive
                          ? "bg-accent opacity-50"
                          : "bg-text-muted opacity-30"
                    }`}
                  />
                  {/* Step text */}
                  <span
                    className={`font-display text-lg ${
                      isCurrent
                        ? "text-text-heading"
                        : isActive
                          ? "text-text-muted"
                          : "text-text-muted opacity-50"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
