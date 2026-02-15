/**
 * PracticeBridge - "What's next?" interstitial screen after post-session results
 * Provides performance-aware suggestions using simple IF/THEN rules
 * Always skippable with prominent "Done for today" button
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";

interface SessionResultData {
  durationSeconds: number;
  wordCount: number;
  wpm: number;
  fillerCount: number;
  fillerRate: number;
  focusMode: "filler" | "pace";
  transcript?: string;
  is_baseline?: boolean;
}

interface LocationState {
  sessionData?: SessionResultData;
}

interface Suggestion {
  text: string;
  action: string; // Button text
  route: string; // Navigation route
}

export default function PracticeBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionData, setSessionData] = useState<SessionResultData | null>(
    null,
  );

  useEffect(() => {
    // Get session data from route state or sessionStorage
    const state = location.state as LocationState | null;
    if (state?.sessionData) {
      setSessionData(state.sessionData);
    } else {
      // Fallback to sessionStorage
      try {
        const stored = sessionStorage.getItem("voicelab_last_session");
        if (stored) {
          const data = JSON.parse(stored) as SessionResultData;
          setSessionData(data);
        } else {
          // No session data, redirect to dashboard
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    }
  }, [location.state, navigate]);

  // Generate suggestion based on session performance
  const suggestion = useMemo<Suggestion | null>(() => {
    if (!sessionData) return null;

    const { focusMode, fillerRate } = sessionData;

    // Rule 1: Filler practice with high rate (>5/min)
    if (focusMode === "filler" && fillerRate > 5) {
      return {
        text: "You're making progress! Try another filler practice session to lock in the improvement.",
        action: "Try Filler Practice",
        route: "/practice/filler/setup",
      };
    }

    // Rule 2: Filler practice with low rate (≤2/min)
    if (focusMode === "filler" && fillerRate <= 2) {
      return {
        text: "Great job on fillers! Ready to work on speech pace or try a new technique?",
        action: "Try Pace Practice",
        route: "/practice/pace/setup",
      };
    }

    // Rule 3: Pace practice
    if (focusMode === "pace") {
      return {
        text: "Nice work on pace! Try filler practice or explore a new technique.",
        action: "Try Filler Practice",
        route: "/practice/filler/setup",
      };
    }

    // Default: suggest library/techniques
    return {
      text: "Well done! Try another technique or practice freely.",
      action: "Browse Library",
      route: "/library",
    };
  }, [sessionData]);

  const handleBack = () => {
    navigate("/practice/results");
  };

  const handleTrySuggestion = () => {
    if (suggestion) {
      navigate(suggestion.route);
    }
  };

  const handleDoneForToday = () => {
    navigate("/");
  };

  if (!sessionData || !suggestion) {
    return null; // Will redirect or show loading
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader showBack onBack={handleBack} />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[600px]">
          <div className="card-surface text-center">
            {/* Title */}
            <h1 className="text-h2 font-display font-semibold text-text-heading mb-6">
              What's next?
            </h1>

            {/* Suggestion text */}
            <p className="text-body-lg text-text-body mb-8 leading-relaxed">
              {suggestion.text}
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleTrySuggestion}
                className="btn btn-primary flex-1 sm:flex-none"
              >
                {suggestion.action}
              </button>
              <button
                onClick={handleDoneForToday}
                className="btn btn-secondary flex-1 sm:flex-none"
              >
                Done for today
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
