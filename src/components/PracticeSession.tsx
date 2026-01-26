import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioCapture, useWebSpeech, useFillerDetector, useSessionTimer } from '../core/audio';
import DurationSelector from './DurationSelector';
import CountdownTimer from './CountdownTimer';
import WeeklyTrendChart from './WeeklyTrendChart';
import { saveSession } from '../services/sessionStorage';

export default function PracticeSession() {
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
    wordCount,
    isListening,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useWebSpeech();

  const {
    fillerCount,
    fillerRate,
    isDetecting,
    start: startFillerDetection,
    stop: stopFillerDetection,
  } = useFillerDetector(audioContext, sourceNode);

  // Duration selection state
  const [selectedDuration, setSelectedDuration] = useState(60);

  // WPM calculation state
  const [wpm, setWpm] = useState(0);

  // Chart refresh trigger
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  // Track last completed session for post-session summary
  const [lastSession, setLastSession] = useState<{
    wpm: number;
    wordCount: number;
    fillerCount: number;
    fillerRate: number;
    durationSeconds: number;
  } | null>(null);

  // Stop session handler - defined before useSessionTimer
  const stopSessionRef = useRef<(() => void) | null>(null);

  // Session timer with auto-stop
  const handleTimerComplete = useCallback(() => {
    stopSessionRef.current?.();
  }, []);

  const {
    timeRemaining,
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

  // Start filler detection when audio context is ready
  useEffect(() => {
    if (isCapturing && audioContext && sourceNode && !isDetecting) {
      startFillerDetection();
    }
  }, [isCapturing, audioContext, sourceNode, isDetecting, startFillerDetection]);

  const handleToggleSession = useCallback(async () => {
    if (isCapturing) {
      // Save session data before stopping (if there was activity)
      const sessionData = {
        durationSeconds: Math.round(elapsedTime),
        wordCount,
        wpm,
        fillerCount,
        fillerRate,
      };

      if (elapsedTime > 0 && wordCount > 0) {
        saveSession(sessionData);
        setChartRefreshKey(k => k + 1);
      }

      // Store for post-session summary display
      if (elapsedTime > 0) {
        setLastSession(sessionData);
      }

      // Stop everything
      stopTimer();
      stopFillerDetection();
      stopSpeech();
      stopAudio();
    } else {
      // Clear last session when starting new
      setLastSession(null);
      // Start everything
      setWpm(0);
      resetTimer();
      await startAudio();
      startSpeech();
      startTimer();
      // Filler detection starts via useEffect when audioContext/sourceNode are ready
    }
  }, [isCapturing, elapsedTime, wordCount, wpm, fillerCount, fillerRate, stopTimer, stopFillerDetection, stopSpeech, stopAudio, resetTimer, startAudio, startSpeech, startTimer]);

  // Keep stopSessionRef updated for timer auto-stop callback
  useEffect(() => {
    stopSessionRef.current = handleToggleSession;
  }, [handleToggleSession]);

  // Combined error display
  const error = audioError || speechError;

  return (
    <div className="flex items-center justify-center min-h-screen bg-clinical-bg px-4">
      <div className="w-full max-w-md">
        {/* Card with teal accent border */}
        <div className="bg-white border-2 border-clinical-accent rounded-lg shadow-lg p-8">
          {/* Title */}
          <h1 className="text-3xl font-bold text-clinical-text mb-2">
            Voice Practice Session
          </h1>

          {/* Subtitle */}
          <p className="text-clinical-muted mb-8">
            {isCapturing ? 'Recording in progress...' : 'Ready to practice'}
          </p>

          {/* Error display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Duration selector - shown before session */}
          {!isCapturing && (
            <div className="mb-6">
              <p className="text-xs text-clinical-muted mb-2 text-center">Session Duration</p>
              <DurationSelector
                selected={selectedDuration}
                onChange={setSelectedDuration}
                disabled={isCapturing}
              />
            </div>
          )}

          {/* Countdown timer - shown during session */}
          <CountdownTimer timeRemaining={timeRemaining} isActive={isCapturing} />

          {/* Status indicator with accent color */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${
                isCapturing ? 'bg-clinical-accent animate-pulse' : 'bg-clinical-muted'
              }`}
            />
            <span className="text-sm text-clinical-muted">
              {isCapturing ? 'Mic active' : 'Mic ready'}
            </span>
          </div>

          {/* Real-time metrics display - during session */}
          {isCapturing && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                {/* WPM */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{wpm}</span>
                  <p className="text-xs text-clinical-muted mt-1">WPM</p>
                </div>

                {/* Words */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{wordCount}</span>
                  <p className="text-xs text-clinical-muted mt-1">Words</p>
                </div>

                {/* Fillers */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-accent">{fillerCount}</span>
                  <p className="text-xs text-clinical-muted mt-1">Fillers</p>
                </div>

                {/* Filler rate */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{fillerRate.toFixed(1)}</span>
                  <p className="text-xs text-clinical-muted mt-1">Fillers/min</p>
                </div>
              </div>

              {/* Speech recognition status */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-200">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-clinical-muted">
                  {isListening ? 'Listening...' : 'Starting...'}
                </span>
              </div>

              {/* Interim transcript preview */}
              {interimTranscript && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <p className="text-sm text-clinical-text italic truncate">"{interimTranscript}"</p>
                </div>
              )}
            </div>
          )}

          {/* Post-session summary - after session ends */}
          {!isCapturing && lastSession && (
            <div className="mb-6 p-4 bg-clinical-accent/5 border border-clinical-accent/20 rounded-lg">
              <p className="text-xs font-medium text-clinical-accent mb-3 text-center uppercase tracking-wide">
                Session Complete
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* WPM */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{lastSession.wpm}</span>
                  <p className="text-xs text-clinical-muted mt-1">WPM</p>
                </div>

                {/* Words */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{lastSession.wordCount}</span>
                  <p className="text-xs text-clinical-muted mt-1">Words</p>
                </div>

                {/* Fillers */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-accent">{lastSession.fillerCount}</span>
                  <p className="text-xs text-clinical-muted mt-1">Fillers</p>
                </div>

                {/* Duration */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-clinical-text">{lastSession.durationSeconds}s</span>
                  <p className="text-xs text-clinical-muted mt-1">Duration</p>
                </div>
              </div>

              {/* Filler rate summary */}
              <div className="mt-4 pt-3 border-t border-clinical-accent/20 text-center">
                <span className="text-lg font-semibold text-clinical-text">
                  {lastSession.fillerRate.toFixed(1)} fillers/min
                </span>
              </div>
            </div>
          )}

          {/* Start/Stop Session button */}
          <button
            onClick={handleToggleSession}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
              isCapturing
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-clinical-text text-white hover:bg-gray-800'
            }`}
          >
            {isCapturing ? 'Stop Session' : 'Start Session'}
          </button>

          {/* Decorative accent element */}
          <div className="mt-6 pt-6 border-t border-clinical-border">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-clinical-accent" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-60" />
              <div className="w-2 h-2 rounded-full bg-clinical-accent opacity-30" />
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        <div className="mt-4">
          <WeeklyTrendChart refreshKey={chartRefreshKey} />
        </div>
      </div>
    </div>
  );
}
