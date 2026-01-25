import { useState, useEffect, useRef } from 'react';
import { useAudioCapture, useWebSpeech } from '../core/audio';

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
    wordCount,
    isListening,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useWebSpeech();

  // WPM calculation state
  const [wpm, setWpm] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const wpmIntervalRef = useRef<number | null>(null);

  // 250ms WPM update cadence
  useEffect(() => {
    if (isCapturing && sessionStartTime) {
      wpmIntervalRef.current = window.setInterval(() => {
        const elapsedMs = Date.now() - sessionStartTime;
        const elapsedMinutes = elapsedMs / 60000;
        if (elapsedMinutes > 0 && wordCount > 0) {
          setWpm(Math.round(wordCount / elapsedMinutes));
        }
      }, 250);

      return () => {
        if (wpmIntervalRef.current) {
          clearInterval(wpmIntervalRef.current);
        }
      };
    }
  }, [isCapturing, sessionStartTime, wordCount]);

  const handleToggleSession = async () => {
    if (isCapturing) {
      // Stop everything
      stopSpeech();
      stopAudio();
      setSessionStartTime(null);
      if (wpmIntervalRef.current) {
        clearInterval(wpmIntervalRef.current);
      }
    } else {
      // Start everything
      setWpm(0);
      setSessionStartTime(Date.now());
      await startAudio();
      startSpeech();
    }
  };

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

          {/* Real-time metrics display */}
          {isCapturing && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              {/* WPM Display */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-clinical-muted">Words per minute</span>
                <span className="text-2xl font-bold text-clinical-text">{wpm}</span>
              </div>

              {/* Word count */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-clinical-muted">Words spoken</span>
                <span className="text-lg font-semibold text-clinical-text">{wordCount}</span>
              </div>

              {/* Speech recognition status */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-clinical-muted">
                  {isListening ? 'Speech recognition active' : 'Speech recognition starting...'}
                </span>
              </div>

              {/* Interim transcript preview */}
              {interimTranscript && (
                <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                  <p className="text-xs text-clinical-muted mb-1">Live transcript:</p>
                  <p className="text-sm text-clinical-text italic">"{interimTranscript}"</p>
                </div>
              )}
            </div>
          )}

          {/* Audio context status (for debugging) */}
          {audioContext && (
            <div className="mb-4 text-xs text-clinical-muted">
              Audio: {audioContext.state} | Sample rate: {audioContext.sampleRate}Hz
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

          {/* Audio blob info (for debugging) */}
          {audioBlob && !isCapturing && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Recording saved: {(audioBlob.size / 1024).toFixed(1)} KB
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

          {/* Debug: Source node status */}
          {sourceNode && (
            <div className="mt-2 text-xs text-center text-clinical-muted">
              Source node connected (ready for analysis)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
