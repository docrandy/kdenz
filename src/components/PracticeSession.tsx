import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAudioCapture, useWebSpeech, useFillerDetector, useSessionTimer, FillerDetection, WordTiming } from '../core/audio';
import DurationSelector from './DurationSelector';
import SettingsPanel from './SettingsPanel';
import AudioPlayback from './AudioPlayback';
import TranscriptView from './TranscriptView';
import HighlightToggle, { HighlightMode } from './HighlightToggle';
import Scorecard from './Scorecard';
import AISummary from './AISummary';
import MicPermissionError from './MicPermissionError';
import PromptSelector, { ActivePrompt } from './PromptSelector';
import PlasmaOrb from './PlasmaOrb';
import SessionMetrics from './SessionMetrics';
import SilenceNudge from './SilenceNudge';
import SessionProgressBar from './SessionProgressBar';
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

  // Audio level for orb reactivity (0-1 normalized)
  const [audioLevel, setAudioLevel] = useState(0);

  // Silence tracking — dual signal: audio level + speech recognition activity
  const [silenceDuration, setSilenceDuration] = useState(0);
  const silenceTimerRef = useRef<number | null>(null);
  const lastWordCountRef = useRef<number>(0);
  const speechIdleRef = useRef<boolean>(true);
  const speechIdleTimerRef = useRef<number | null>(null);

  const SILENCE_AUDIO_THRESHOLD = 0.02; // audioLevel below this = no voice signal
  const SPEECH_IDLE_CHECK_MS = 2000; // if wordCount hasn't changed in 2s, speech recognition is idle
  const SILENCE_NUDGE_MS = 10000; // 10 seconds of combined silence before nudge

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

  // Audio level extraction for orb reactivity
  useEffect(() => {
    if (!audioContext || !sourceNode || !isCapturing) {
      setAudioLevel(0);
      return;
    }

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    sourceNode.connect(analyser);

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
    if (!isCapturing) {
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
    // Use OR logic: if EITHER signal says "no speech", count as silence.
    // This catches: (1) quiet mic + no words, (2) ambient noise + no words
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
  }, [isCapturing, audioLevel, wordCount, SILENCE_AUDIO_THRESHOLD, SPEECH_IDLE_CHECK_MS]);

  const showSilenceNudge = isCapturing && silenceDuration >= SILENCE_NUDGE_MS;

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

  // Filler intensity for orb (0-1, where 10 fillers/min = 1.0)
  const fillerIntensity = useMemo(() => {
    return Math.min(liveFillerRate / 10, 1);
  }, [liveFillerRate]);

  // Start filler detection when audio context is ready
  useEffect(() => {
    if (isCapturing && audioContext && sourceNode && !isDetecting) {
      startFillerDetection();
    }
  }, [isCapturing, audioContext, sourceNode, isDetecting, startFillerDetection]);

  // Session progress calculation (0-1)
  const sessionProgress = selectedDuration > 0 ? Math.min(elapsedTime / selectedDuration, 1) : 0;

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
      {/* Session progress bar - fixed at top of viewport */}
      <SessionProgressBar progress={sessionProgress} visible={isCapturing} />

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

          {/* Pre-session: Duration and Prompt Selectors */}
          {!isCapturing && !lastSession && (
            <>
              <div className="mb-6">
                <p className="text-xs text-clinical-muted mb-2 text-center">Session Duration</p>
                <DurationSelector
                  selected={selectedDuration}
                  onChange={setSelectedDuration}
                  disabled={isCapturing}
                />
              </div>
              <div className="mb-6">
                <PromptSelector
                  onSelect={setSelectedPrompt}
                  selectedDuration={selectedDuration}
                />
              </div>
            </>
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

          {/* Orb-centric layout: BEFORE session */}
          {!isCapturing && !lastSession && (
            <div className="flex flex-col items-center mb-6">
              <PlasmaOrb
                audioLevel={0}
                fillerIntensity={0}
                isActive={false}
                onClick={handleToggleSession}
                isLoading={isStarting}
                disabled={isStarting}
                size={250}
              />
              <p className="text-sm text-clinical-muted mt-4">
                Tap orb to start
              </p>
            </div>
          )}

          {/* Orb-centric layout: DURING session */}
          {isCapturing && (
            <>
              <SessionMetrics
                fillerCount={liveFillerCount}
                fillerRate={liveFillerRate}
                wpm={wpm}
                isActive={isCapturing}
              >
                <PlasmaOrb
                  audioLevel={audioLevel}
                  fillerIntensity={fillerIntensity}
                  isActive={true}
                  onClick={handleToggleSession}
                  isLoading={false}
                  disabled={false}
                  size={250}
                />
              </SessionMetrics>

              {/* Silence nudge - appears below orb after 10s silence */}
              <SilenceNudge visible={showSilenceNudge} />

              {/* Words count and speech status below orb */}
              <div className="text-center mb-4">
                <span className="text-lg font-semibold text-clinical-text">{wordCount}</span>
                <span className="text-sm text-clinical-muted ml-2">words spoken</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-clinical-muted">
                  {isListening ? 'Listening...' : 'Starting...'}
                </span>
              </div>

              {/* Interim transcript preview */}
              {interimTranscript && (
                <div className="mb-6 p-3 bg-white rounded border border-clinical-border">
                  <p className="text-base text-clinical-text italic">"{interimTranscript}"</p>
                </div>
              )}
            </>
          )}

          {/* Orb-centric layout: AFTER session */}
          {!isCapturing && lastSession && (
            <div className="flex flex-col items-center mb-6">
              <PlasmaOrb
                audioLevel={0}
                fillerIntensity={0}
                isActive={false}
                onClick={handleToggleSession}
                isLoading={isStarting}
                disabled={isStarting}
                size={250}
              />
              <p className="text-sm text-clinical-muted mt-4">
                Tap orb to start new session
              </p>
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

        {/* Skill Practice Modules */}
        <div className="mt-4 bg-white border border-clinical-border rounded-lg p-4">
          <h3 className="text-sm font-semibold text-clinical-text mb-3">Skill Practice</h3>
          <div className="space-y-2">
            <Link
              to="/practice/labeling"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-cyan-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-medium text-clinical-text group-hover:text-clinical-accent">
                    Labeling Practice
                  </p>
                  <p className="text-xs text-clinical-muted">
                    Practice identifying underlying emotions
                  </p>
                </div>
              </div>
              <span className="text-clinical-muted group-hover:text-clinical-accent">→</span>
            </Link>
            <Link
              to="/practice/accusation-audit"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-cyan-50 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="font-medium text-clinical-text group-hover:text-clinical-accent">
                    Accusation Audit
                  </p>
                  <p className="text-xs text-clinical-muted">
                    Pre-emptively neutralize defensiveness
                  </p>
                </div>
              </div>
              <span className="text-clinical-muted group-hover:text-clinical-accent">→</span>
            </Link>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-50 cursor-not-allowed">
              <div className="flex items-center gap-3">
                <span className="text-xl">✋</span>
                <div>
                  <p className="font-medium text-clinical-text">Saying No</p>
                  <p className="text-xs text-clinical-muted">Coming soon</p>
                </div>
              </div>
            </div>
          </div>
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
