import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { TechniquePracticeContext } from "../runtime/types";

interface GoToResultsOptions {
  isBaseline?: boolean;
  techniqueContext?: TechniquePracticeContext;
}

export function useNavigationEngine() {
  const navigate = useNavigate();

  const goToResults = useCallback(
    ({ isBaseline, techniqueContext }: GoToResultsOptions) => {
      // Baseline sessions skip the loader and go directly to results
      if (isBaseline) {
        navigate("/baseline/results");
        return;
      }

      // For technique sessions, route through analysis loader
      if (techniqueContext?.techniqueId) {
        navigate("/practice/analysis", {
          state: { destination: "/practice/technique-results" },
        });
        return;
      }

      // For regular practice sessions, route through analysis loader
      navigate("/practice/analysis", {
        state: { destination: "/practice/results" },
      });
    },
    [navigate],
  );

  return {
    goToResults,
  };
}

export type NavigationEngine = ReturnType<typeof useNavigationEngine>;
