import { useSessionTimer } from "../../core/audio";

interface UseTimerEngineOptions {
  durationSeconds: number;
  onComplete?: () => void;
}

export function useTimerEngine({ durationSeconds, onComplete }: UseTimerEngineOptions) {
  return useSessionTimer({ durationSeconds, onComplete });
}

export type TimerEngine = ReturnType<typeof useTimerEngine>;
