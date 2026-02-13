import { useState, useEffect, useMemo, useRef, useCallback } from "react";

interface UseMetricsEngineOptions {
  durationSeconds: number;
  isBaseline: boolean;
  isCapturing: boolean;
  isPaused: boolean;
  audioContext: AudioContext | null;
  sourceNode: MediaStreamAudioSourceNode | null;
  elapsedTime: number;
  wordCount: number;
  finalTranscript: string;
  interimTranscript: string;
}

const SILENCE_AUDIO_THRESHOLD = 0.02;
const SPEECH_IDLE_CHECK_MS = 2000;
const SILENCE_NUDGE_MS = 10000;

const FILLER_PHRASES = ["you know", "i mean", "kind of", "sort of"];
const FILLER_WORDS = [
  "like",
  "um",
  "uh",
  "so",
  "basically",
  "actually",
  "literally",
  "honestly",
  "essentially",
  "obviously",
  "right",
];

export function countFillerWords(text: string): number {
  if (!text.trim()) return 0;

  const lower = text.toLowerCase();
  let count = 0;

  for (const phrase of FILLER_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    count += lower.match(regex)?.length ?? 0;
  }

  for (const word of FILLER_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    count += lower.match(regex)?.length ?? 0;
  }

  return count;
}

export interface MetricsEngineReturn {
  wpm: number;
  audioLevel: number;
  silenceDuration: number;
  liveFillerCount: number;
  countdownRemaining?: number;
  showSilenceNudge: boolean;
  handleNudgeDismissed: () => void;
  resetForSession: () => void;
}

export function useMetricsEngine({
  durationSeconds,
  isBaseline,
  isCapturing,
  isPaused,
  audioContext,
  sourceNode,
  elapsedTime,
  wordCount,
  finalTranscript,
  interimTranscript,
}: UseMetricsEngineOptions): MetricsEngineReturn {
  const [wpm, setWpm] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [silenceDuration, setSilenceDuration] = useState(0);
  const [showSilenceNudge, setShowSilenceNudge] = useState(false);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<number | null>(null);
  const speechIdleTimerRef = useRef<number | null>(null);
  const speechIdleRef = useRef(true);
  const lastWordCountRef = useRef(0);
  const nudgeShownRef = useRef(false);

  useEffect(() => {
    if (isCapturing && elapsedTime > 0 && wordCount > 0) {
      const elapsedMinutes = elapsedTime / 60;
      setWpm(Math.round(wordCount / elapsedMinutes));
    }
  }, [isCapturing, elapsedTime, wordCount]);

  useEffect(() => {
    if (!audioContext || !sourceNode || !isCapturing) {
      setAudioLevel(0);
      analyserRef.current = null;
      return;
    }

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);
    analyserRef.current = analyser;

    let animationFrameId: number;

    const updateAudioLevel = () => {
      analyser.getByteTimeDomainData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i += 1) {
        const normalized = (dataArray[i] - 128) / 128;
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);
      setAudioLevel(Math.min(rms * 3, 1));
      animationFrameId = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      try {
        sourceNode.disconnect(analyser);
      } catch {
        // Source already disconnected, ignore
      }
    };
  }, [audioContext, sourceNode, isCapturing]);

  useEffect(() => {
    const clearSilenceTimer = () => {
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    const clearSpeechIdleTimer = () => {
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
        speechIdleTimerRef.current = null;
      }
    };

    if (!isCapturing || isPaused) {
      clearSilenceTimer();
      clearSpeechIdleTimer();
      setSilenceDuration(0);
      speechIdleRef.current = true;
      lastWordCountRef.current = 0;
      setShowSilenceNudge(false);
      return () => {
        clearSilenceTimer();
        clearSpeechIdleTimer();
      };
    }

    if (wordCount > lastWordCountRef.current) {
      lastWordCountRef.current = wordCount;
      speechIdleRef.current = false;
      clearSpeechIdleTimer();
      speechIdleTimerRef.current = window.setTimeout(() => {
        speechIdleRef.current = true;
      }, SPEECH_IDLE_CHECK_MS);
    }

    const isSilent = audioLevel < SILENCE_AUDIO_THRESHOLD || speechIdleRef.current;

    if (isSilent && !silenceTimerRef.current) {
      silenceTimerRef.current = window.setInterval(() => {
        setSilenceDuration((prev) => prev + 100);
      }, 100);
    }

    if (!isSilent) {
      clearSilenceTimer();
      setSilenceDuration(0);
    }

    return () => {
      clearSilenceTimer();
      clearSpeechIdleTimer();
    };
  }, [isCapturing, isPaused, audioLevel, wordCount]);

  useEffect(() => {
    if (
      isCapturing &&
      !isPaused &&
      !isBaseline &&
      !nudgeShownRef.current &&
      silenceDuration >= SILENCE_NUDGE_MS
    ) {
      setShowSilenceNudge(true);
    }

    if (!isCapturing || isPaused || silenceDuration < SILENCE_NUDGE_MS) {
      setShowSilenceNudge(false);
    }
  }, [isCapturing, isPaused, silenceDuration, isBaseline]);

  const handleNudgeDismissed = useCallback(() => {
    nudgeShownRef.current = true;
    setShowSilenceNudge(false);
  }, []);

  const resetForSession = useCallback(() => {
    nudgeShownRef.current = false;
    setSilenceDuration(0);
    setShowSilenceNudge(false);
    setWpm(0);
  }, []);

  const liveFillerCount = useMemo(() => {
    const combined = `${finalTranscript} ${interimTranscript}`;
    return countFillerWords(combined);
  }, [finalTranscript, interimTranscript]);

  const countdownRemaining = useMemo(() => {
    if (durationSeconds === 0) {
      return undefined;
    }

    return Math.max(0, 1 - elapsedTime / durationSeconds);
  }, [durationSeconds, elapsedTime]);

  return {
    wpm,
    audioLevel,
    silenceDuration,
    liveFillerCount,
    countdownRemaining,
    showSilenceNudge,
    handleNudgeDismissed,
    resetForSession,
  };
}
