import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAudioCapture, useWebSpeech, useFillerDetector, useSessionTimer, FillerDetection, WordTiming } from '../core/audio';
import DurationSelector from './DurationSelector';
import CountdownTimer from './CountdownTimer';
import WeeklyTrendChart from './WeeklyTrendChart';
import SettingsPanel from './SettingsPanel';
import AudioPlayback from './AudioPlayback';
import TranscriptView from './TranscriptView';
import HighlightToggle, { HighlightMode } from './HighlightToggle';
import Scorecard from './Scorecard';
import AISummary from './AISummary';
import MicPermissionError from './MicPermissionError';
import PromptSelector, { ActivePrompt } from './PromptSelector';
import { SpeakingPrompt } from '../data/speakingPrompts';
import { saveSession } from '../services/sessionStorage';
import { getSettings, AppSettings } from '../services/settingsStorage';
import { reconcileFillers, ReconciledFiller } from '../lib/fillerReconciler';

// Filler words to detect in real-time
const FILLER_WORDS = ['like', 'um', 'uh', 'basically', 'actually', 'literally', 'you know'];

// Count filler words in text
function countFillerWords(text: string): number {
  if (!text.trim()) return 0;
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(word => FILLER_WORDS.some(filler => word.includes(filler))).length;
}

export default function PracticeSession() {
  const {
    isCapturing,
    audioContext,
    sourceNode,
    audioBlob,
    error: audioError,
    start: startAudio,
    stop: stopAudio,
  } = useAudioCapture();

  const {
    interimTranscript,
    finalTranscript,
    wordCount,
    wordTimings,
    isListening,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useWebSpeech();

  const {
    fillerCount,
    fillerRate,
    fillerEvents,
    isDetecting,
    start: startFillerDetection,
    stop: stopFillerDetection,
  } = useFillerDetector(audioContext, sourceNode);

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(getSettings);

  // Duration selection state (initialized from settings)
  const [selectedDuration, setSelectedDuration] = useState(() => getSettings().defaultDuration);

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

  // Preserve filler events for playback after session ends
  const [lastFillerEvents, setLastFillerEvents] = useState<FillerDetection[]>([]);

  // Preserve transcript data for post-session display
  const [lastTranscript, setLastTranscript] = useState('');
  const [lastWordTimings, setLastWordTimings] = useState<WordTiming[]>([]);
  const [lastDurationMs, setLastDurationMs] = useState(0);

  // Highlight mode for transcript view (default to 'none' to show raw transcript first)
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('none');

  // Loading state for start button
  const [isStarting, setIsStarting] = useState(false);

  // Selected speaking prompt (optional)
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt | null>(null);

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

  // Real-time filler count from transcript
  const liveFillerCount = useMemo(() => {
    const allText = finalTranscript + ' ' + interimTranscript;
    return countFillerWords(allText);
  }, [finalTranscript, interimTranscript]);

  // Real-time filler rate (per minute)
  const liveFillerRate = useMemo(() => {
    if (elapsedTime <= 0) return 0;
    const elapsedMinutes = elapsedTime / 60;
    return liveFillerCount / elapsedMinutes;
  }, [liveFillerCount, elapsedTime]);

  // Start filler detection when audio context is ready
  useEffect(() => {
    if (isCapturing && audioContext && sourceNode && !isDetecting) {
      startFillerDetection();
    }
  }, [isCapturing, audioContext, sourceNode, isDetecting, startFillerDetection]);

  const handleToggleSession = useCallback(async () => {
    if (isCapturing) {
      // Calculate filler count from transcript
      const transcriptFillerCount = countFillerWords(finalTranscript + ' ' + interimTranscript);
      const elapsedMinutes = elapsedTime / 60;
      const transcriptFillerRate = elapsedMinutes > 0 ? transcriptFillerCount / elapsedMinutes : 0;

      // Save session data before stopping (if there was activity)
      const sessionData = {
        durationSeconds: Math.round(elapsedTime),
        wordCount,
        wpm,
        fillerCount: transcriptFillerCount,
        fillerRate: transcriptFillerRate,
      };

      if (elapsedTime > 0 && wordCount > 0) {
        saveSession(sessionData);
        setChartRefreshKey(k => k + 1);
      }

      // Store for post-session summary display
      if (elapsedTime > 0) {
        setLastSession(sessionData);
        setLastFillerEvents([...fillerEvents]);
        setLastTranscript(finalTranscript);
        setLastWordTimings([...wordTimings]);
        setLastDurationMs(elapsedTime * 1000);
      }

      // Stop everything
      stopTimer();
      stopFillerDetection();
      stopSpeech();
      stopAudio();
    } else {
      // Clear last session when starting new
      setLastSession(null);
      setLastFillerEvents([]);
      setLastTranscript('');
      setLastWordTimings([]);
      setLastDurationMs(0);
      // Start everything with loading state
      setIsStarting(true);
      setWpm(0);
      resetTimer();
      try {
        await startAudio();
        startSpeech();
        startTimer();
        // Filler detection starts via useEffect when audioContext/sourceNode are ready
      } finally {
        setIsStarting(false);
      }
    }
  }, [isCapturing, elapsedTime, wordCount, wpm, fillerCount, fillerRate, fillerEvents, finalTranscript, wordTimings, stopTimer, stopFillerDetection, stopSpeech, stopAudio, resetTimer, startAudio, startSpeech, startTimer]);

  // Keep stopSessionRef updated for timer auto-stop callback
  useEffect(() => {
    stopSessionRef.current = handleToggleSession;
  }, [handleToggleSession]);

  // Combined error display
  const error = audioError || speechError;

  // Reconcile filler detections for transcript highlighting
  const reconciledFillers = useMemo<ReconciledFiller[]>(() => {
    if (!lastTranscript || lastWordTimings.length === 0) {
      return [];
    }
    return reconcileFillers(lastTranscript, lastFillerEvents, lastWordTimings);
  }, [lastTranscript, lastFillerEvents, lastWordTimings]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-clinical-bg px-4 py-6">
      <div className="w-full max-w-md">
        {/* Card with teal accent border */}
        <div className="bg-white border-2 border-clinical-accent rounded-lg shadow-lg p-5 sm:p-8">
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-clinical-text mb-2">
            Voice Practice Session
          </h1>

          {/* Subtitle */}
          <p className="text-clinical-muted mb-8">
            {isCapturing ? 'Recording in progress...' : 'Ready to practice'}
          </p>

          {/* Error display - enhanced for mic permissions */}
          {error && (
            <div className="mb-6">
              <MicPermissionError
                error={error}
                onRetry={handleToggleSession}
              />
            </div>
          )}

          {/* Duration selector - shown before session */}
          {!isCapturing && !lastSession && (
            <div className="mb-6">
              <p className="text-xs text-clinical-muted mb-2 text-center">Session Duration</p>
              <DurationSelector
                selected={selectedDuration}
                onChange={setSelectedDuration}
                disabled={isCapturing}
              />
            </div>
          )}

          {/* Speaking prompt selector - shown before session */}
          {!isCapturing && !lastSession && (
            <div className="mb-6">
              <PromptSelector
                onSelect={setSelectedPrompt}
                selectedDuration={selectedDuration}
              />
            </div>
          )}

          {/* Active prompt display - shown during session */}
          {isCapturing && selectedPrompt && (
            <div className="mb-6">
              <ActivePrompt
                prompt={selectedPrompt}
                onClear={() => setSelectedPrompt(null)}
              />
            </div>
          )}

          {/* Countdown timer - shown during session */}
          <CountdownTimer
            timeRemaining={timeRemaining}
            isActive={isCapturing}
            warningThreshold={settings.timerWarning}
            criticalThreshold={settings.timerCritical}
          />

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
                <div className="text-center p-3 bg-white rounded-lg">
                  <span className="text-4xl font-bold text-clinical-text">{wpm}</span>
                  <p className="text-sm text-clinical-muted mt-1">WPM</p>
                  <p className="text-xs text-clinical-muted">
                    {wpm < 100 ? 'Slow' : wpm <= 150 ? 'Good' : wpm <= 180 ? 'Fast' : 'Very Fast'}
                  </p>
                </div>

                {/* Fillers */}
                <div className="text-center p-3 bg-white rounded-lg">
                  <span className={`text-4xl font-bold ${liveFillerCount > 5 ? 'text-red-500' : liveFillerCount > 2 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {liveFillerCount}
                  </span>
                  <p className="text-sm text-clinical-muted mt-1">Fillers</p>
                  <p className="text-xs text-clinical-muted">
                    {liveFillerRate.toFixed(1)}/min
                  </p>
                </div>
              </div>

              {/* Words count */}
              <div className="text-center mt-3">
                <span className="text-lg font-semibold text-clinical-text">{wordCount}</span>
                <span className="text-sm text-clinical-muted ml-2">words spoken</span>
              </div>

              {/* Speech recognition status */}
              <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-200">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-clinical-muted">
                  {isListening ? 'Listening...' : 'Starting...'}
                </span>
              </div>

              {/* Interim transcript preview */}
              {interimTranscript && (
                <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                  <p className="text-base text-clinical-text italic">"{interimTranscript}"</p>
                </div>
              )}
            </div>
          )}

          {/* Post-session Scorecard - after session ends */}
          {!isCapturing && lastSession && (
            <div className="mb-6">
              <Scorecard
                wpm={lastSession.wpm}
                wordCount={lastSession.wordCount}
                fillerCount={lastSession.fillerCount}
                fillerRate={lastSession.fillerRate}
                durationSeconds={lastSession.durationSeconds}
                thresholdGood={settings.fillerRateGood}
                thresholdWarning={settings.fillerRateWarning}
              />
            </div>
          )}

          {/* Start/Stop Session button */}
          <button
            onClick={handleToggleSession}
            disabled={isStarting}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              isCapturing
                ? 'bg-red-600 text-white hover:bg-red-700'
                : isStarting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-clinical-text text-white hover:bg-gray-800'
            }`}
          >
            {isStarting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isStarting ? 'Starting...' : isCapturing ? 'Stop Session' : 'Start Session'}
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

        {/* Audio Playback - shown after session ends */}
        {!isCapturing && audioBlob && lastSession && (
          <div className="mt-4">
            <AudioPlayback
              audioBlob={audioBlob}
              fillerEvents={lastFillerEvents}
              sessionDurationSeconds={lastSession.durationSeconds}
            />
          </div>
        )}

        {/* Transcript with Highlights - shown after session ends */}
        {!isCapturing && lastSession && lastTranscript && (
          <div className="mt-4 bg-white border border-clinical-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-clinical-text">Transcript</h3>
              <HighlightToggle
                mode={highlightMode}
                onChange={setHighlightMode}
                fillerCount={reconciledFillers.length}
              />
            </div>
            <TranscriptView
              transcript={lastTranscript}
              reconciledFillers={reconciledFillers}
              wordTimings={lastWordTimings}
              highlightMode={highlightMode}
              sessionDurationMs={lastDurationMs}
            />
          </div>
        )}

        {/* AI Coaching Summary - shown after session ends */}
        {!isCapturing && lastSession && (
          <div className="mt-4">
            <AISummary
              transcript={lastTranscript}
              wpm={lastSession.wpm}
              wordCount={lastSession.wordCount}
              fillerCount={lastSession.fillerCount}
              fillerRate={lastSession.fillerRate}
              durationSeconds={lastSession.durationSeconds}
              reconciledFillers={reconciledFillers}
            />
          </div>
        )}

        {/* Weekly Trend Chart */}
        <div className="mt-4">
          <WeeklyTrendChart
            refreshKey={chartRefreshKey}
            thresholdGood={settings.fillerRateGood}
            thresholdWarning={settings.fillerRateWarning}
          />
        </div>

        {/* Settings Panel */}
        <div className="mt-4">
          <SettingsPanel onSettingsChange={setSettings} />
        </div>

        {/* Footer with privacy link */}
        <div className="mt-6 text-center">
          <Link
            to="/privacy"
            className="text-xs text-clinical-muted hover:text-clinical-accent transition-colors"
          >
            Privacy & Your Data
          </Link>
        </div>
      </div>
    </div>
  );
}
