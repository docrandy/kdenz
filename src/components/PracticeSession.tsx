import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudioCapture, useWebSpeech, useFillerDetector, useSessionTimer } from '../core/audio';
import MicPermissionError from './MicPermissionError';
import { SessionOrb } from './SessionOrb';
import { BottomControlBar } from './BottomControlBar';
import { WaveformVisualizer } from './WaveformVisualizer';
import SilenceNudge from './SilenceNudge';
import SessionProgressBar from './SessionProgressBar';

// Filler words to detect in real-time
const FILLER_WORDS = ['like', 'um', 'uh', 'basically', 'actually', 'literally', 'you know'];

// Count filler words in text
function countFillerWords(text: string): number {
  if (!text.trim()) return 0;
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(word => FILLER_WORDS.some(filler => word.includes(filler))).length;
}

interface PracticeSessionProps {
  focusMode: 'filler' | 'pace';
}

export default function PracticeSession({ focusMode }: PracticeSessionProps) {
  const navigate = useNavigate();

  const {
    isCapturing,
    audioContext,
    sourceNode,
    error: audioError,
    start: startAudio,
    stop: stopAudio,
  } = useAudioCapture();

  const {
    interimTranscript,
    finalTranscript,
    wordCount,
    wordTimings,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useWebSpeech();

  const {
    fillerEvents,
    start: startFillerDetection,
    stop: stopFillerDetection,
  } = useFillerDetector(audioContext, sourceNode);

  // Duration - default 2 minutes for free practice
  const selectedDuration = 120;

  // WPM calculation state
  const [wpm, setWpm] = useState(0);

  // Audio level for orb reactivity (0-1 normalized)
  const [audioLevel, setAudioLevel] = useState(0);

  // Pause/resume state
  const [isPaused, setIsPaused] = useState(false);

  // Silence tracking — dual signal: audio level + speech recognition activity
  const [silenceDuration, setSilenceDuration] = useState(0);
  const silenceTimerRef = useRef<number | null>(null);
  const lastWordCountRef = useRef<number>(0);
  const speechIdleRef = useRef<boolean>(true);
  const speechIdleTimerRef = useRef<number | null>(null);
  const nudgeShownRef = useRef(false); // Track if nudge has been shown this session

  const SILENCE_AUDIO_THRESHOLD = 0.02; // audioLevel below this = no voice signal
  const SPEECH_IDLE_CHECK_MS = 2000; // if wordCount hasn't changed in 2s, speech recognition is idle
  const SILENCE_NUDGE_MS = 10000; // 10 seconds of combined silence before nudge

  // Loading state for start button
  const [isStarting, setIsStarting] = useState(false);

  // AnalyserNode ref for WaveformVisualizer
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Stop session handler - defined before useSessionTimer
  const stopSessionRef = useRef<(() => void) | null>(null);

  // Session timer with auto-stop
  const handleTimerComplete = useCallback(() => {
    stopSessionRef.current?.();
  }, []);

  const {
    elapsedTime,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useSessionTimer({
    durationSeconds: selectedDuration,
    onComplete: handleTimerComplete,
  });

  // WPM calculation - runs on each elapsedTime update (100ms from timer)
  useEffect(() => {
    if (isCapturing && elapsedTime > 0 && wordCount > 0) {
      const elapsedMinutes = elapsedTime / 60;
      setWpm(Math.round(wordCount / elapsedMinutes));
    }
  }, [isCapturing, elapsedTime, wordCount]);

  // Audio level extraction for orb reactivity and store analyserNode
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

      // Calculate RMS (root mean square) for volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128; // -1 to 1
        sum += normalized * normalized;
      }
      const rms = Math.sqrt(sum / bufferLength);

      // Normalize to 0-1 range (amplify for better visual response)
      const normalized = Math.min(rms * 3, 1);

      setAudioLevel(normalized);
      animationFrameId = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();

    return () => {
      cancelAnimationFrame(animationFrameId);
      try {
        sourceNode.disconnect(analyser);
      } catch {
        // Already disconnected, ignore
      }
    };
  }, [audioContext, sourceNode, isCapturing]);

  // Silence detection - dual signal approach
  useEffect(() => {
    if (!isCapturing || isPaused) {
      // Session not active — clear everything
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
        speechIdleTimerRef.current = null;
      }
      setSilenceDuration(0);
      speechIdleRef.current = true;
      lastWordCountRef.current = 0;
      return;
    }

    // Check if wordCount changed (speech recognition produced new words)
    if (wordCount > lastWordCountRef.current) {
      lastWordCountRef.current = wordCount;
      speechIdleRef.current = false;

      // Reset the speech idle timer — user just spoke
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
      }
      speechIdleTimerRef.current = window.setTimeout(() => {
        speechIdleRef.current = true;
      }, SPEECH_IDLE_CHECK_MS);
    }

    // Combined silence check: low audio OR speech recognition idle
    const isSilent = audioLevel < SILENCE_AUDIO_THRESHOLD || speechIdleRef.current;

    if (isSilent) {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = window.setInterval(() => {
          setSilenceDuration(prev => prev + 100);
        }, 100);
      }
    } else {
      // Active speech detected on BOTH signals — reset
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      setSilenceDuration(0);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (speechIdleTimerRef.current) {
        clearTimeout(speechIdleTimerRef.current);
        speechIdleTimerRef.current = null;
      }
    };
  }, [isCapturing, isPaused, audioLevel, wordCount, SILENCE_AUDIO_THRESHOLD, SPEECH_IDLE_CHECK_MS]);

  // Only trigger once per session
  const showSilenceNudge = isCapturing && !isPaused && !nudgeShownRef.current && silenceDuration >= SILENCE_NUDGE_MS;

  // Callback when nudge is dismissed
  const handleNudgeDismissed = useCallback(() => {
    nudgeShownRef.current = true;
  }, []);

  // Real-time filler count from transcript
  const liveFillerCount = useMemo(() => {
    const allText = finalTranscript + ' ' + interimTranscript;
    return countFillerWords(allText);
  }, [finalTranscript, interimTranscript]);

  // Start filler detection when audio context is ready
  useEffect(() => {
    if (isCapturing && !isPaused && audioContext && sourceNode) {
      startFillerDetection();
    }
  }, [isCapturing, isPaused, audioContext, sourceNode, startFillerDetection]);

  // Session progress calculation (0-1)
  const sessionProgress = selectedDuration > 0 ? Math.min(elapsedTime / selectedDuration, 1) : 0;

  const handleStart = useCallback(async () => {
    setIsStarting(true);
    setWpm(0);
    resetTimer();
    nudgeShownRef.current = false; // Reset nudge for new session
    try {
      await startAudio();
      startSpeech();
      startTimer();
      setIsPaused(false);
      // Filler detection starts via useEffect when audioContext/sourceNode are ready
    } finally {
      setIsStarting(false);
    }
  }, [resetTimer, startAudio, startSpeech, startTimer]);

  const handlePause = useCallback(() => {
    setIsPaused(true);
    stopSpeech();
    stopTimer();
  }, [stopSpeech, stopTimer]);

  const handleContinue = useCallback(() => {
    setIsPaused(false);
    startSpeech();
    startTimer();
  }, [startSpeech, startTimer]);

  const handleStop = useCallback(() => {
    // Calculate filler count from transcript
    const transcriptFillerCount = countFillerWords(finalTranscript + ' ' + interimTranscript);
    const elapsedMinutes = elapsedTime / 60;
    const transcriptFillerRate = elapsedMinutes > 0 ? transcriptFillerCount / elapsedMinutes : 0;

    // Save session data to sessionStorage for post-session page
    const sessionData = {
      durationSeconds: Math.round(elapsedTime),
      wordCount,
      wpm,
      fillerCount: transcriptFillerCount,
      fillerRate: transcriptFillerRate,
      focusMode,
    };

    try {
      sessionStorage.setItem('voicelab_last_session', JSON.stringify({
        ...sessionData,
        transcript: finalTranscript,
        fillerEvents: [...fillerEvents],
        wordTimings: [...wordTimings],
      }));
    } catch {
      // sessionStorage not available
    }

    // Stop everything
    setIsPaused(false);
    stopTimer();
    stopFillerDetection();
    stopSpeech();
    stopAudio();

    // Navigate to post-session results page
    navigate('/practice/results');
  }, [elapsedTime, wordCount, wpm, fillerEvents, finalTranscript, wordTimings, focusMode, interimTranscript, stopTimer, stopFillerDetection, stopSpeech, stopAudio, navigate]);

  // Keep stopSessionRef updated for timer auto-stop callback
  useEffect(() => {
    stopSessionRef.current = handleStop;
  }, [handleStop]);

  // Combined error display
  const error = audioError || speechError;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Progress bar at top */}
      <SessionProgressBar progress={sessionProgress} visible={isCapturing && !isPaused} />

      {/* Error display */}
      {error && (
        <div className="mb-6 max-w-md w-full">
          <MicPermissionError
            error={error}
            onRetry={handleStart}
          />
        </div>
      )}

      {/* Session content - centered vertically */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* PRE-SESSION: Show orb in idle state */}
        {!isCapturing && (
          <div className="flex flex-col items-center gap-4">
            <SessionOrb
              audioLevel={0}
              isRecording={false}
              onClick={handleStart}
              isLoading={isStarting}
              disabled={isStarting}
            />
            <p className="text-sm text-gray-500">Tap to start</p>
          </div>
        )}

        {/* DURING SESSION */}
        {isCapturing && (
          <>
            <SessionOrb
              audioLevel={audioLevel}
              isRecording={!isPaused}
              onClick={() => {}}
              disabled={true}
            />

            {/* Focus-specific feedback */}
            {focusMode === 'filler' && (
              <div className="text-center">
                <span className="text-5xl font-bold text-gray-900">{liveFillerCount}</span>
                <p className="text-sm text-gray-500 mt-1">fillers detected</p>
              </div>
            )}

            {focusMode === 'pace' && (
              <>
                <WaveformVisualizer
                  analyserNode={analyserRef.current}
                  isActive={isCapturing && !isPaused}
                  height={120}
                />
                <div className="text-center mt-2">
                  <span className="text-2xl font-semibold text-gray-900">{wpm} WPM</span>
                  <p className="text-sm text-gray-500 mt-1">Speaking Pace</p>
                </div>
              </>
            )}

            {/* Silence nudge */}
            <SilenceNudge
              triggered={showSilenceNudge}
              onDismissed={handleNudgeDismissed}
            />

            {/* Bottom control bar */}
            <BottomControlBar
              sessionState={isPaused ? 'paused' : 'recording'}
              onPause={handlePause}
              onStop={handleStop}
              onContinue={handleContinue}
            />
          </>
        )}
      </div>
    </div>
  );
}
