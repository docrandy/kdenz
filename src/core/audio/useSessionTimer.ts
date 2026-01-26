import { useState, useRef, useCallback, useEffect } from 'react';

interface UseSessionTimerOptions {
  durationSeconds: number;
  onComplete?: () => void;
}

interface UseSessionTimerReturn {
  timeRemaining: number;
  elapsedTime: number;
  isComplete: boolean;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useSessionTimer({
  durationSeconds,
  onComplete,
}: UseSessionTimerOptions): UseSessionTimerReturn {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const timeRemaining = Math.max(0, durationSeconds - elapsedTime);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    setIsComplete(false);
    startTimeRef.current = Date.now() - (elapsedTime * 1000);

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current === null) return;

      const newElapsed = (Date.now() - startTimeRef.current) / 1000;
      setElapsedTime(newElapsed);

      if (newElapsed >= durationSeconds) {
        clearTimer();
        setIsRunning(false);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, 100);
  }, [isRunning, elapsedTime, durationSeconds, clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setElapsedTime(0);
    setIsRunning(false);
    setIsComplete(false);
    startTimeRef.current = null;
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Reset elapsed when duration changes while not running
  useEffect(() => {
    if (!isRunning) {
      setElapsedTime(0);
      setIsComplete(false);
    }
  }, [durationSeconds, isRunning]);

  return {
    timeRemaining,
    elapsedTime,
    isComplete,
    isRunning,
    start,
    stop,
    reset,
  };
}
