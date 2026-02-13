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
      if (isBaseline) {
        navigate("/baseline/results");
        return;
      }

      if (techniqueContext?.techniqueId) {
        navigate("/practice/technique-results");
        return;
      }

      navigate("/practice/results");
    },
    [navigate],
  );

  return {
    goToResults,
  };
}

export type NavigationEngine = ReturnType<typeof useNavigationEngine>;
