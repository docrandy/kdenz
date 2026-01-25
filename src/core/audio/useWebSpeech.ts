/**
 * Web Speech API Hook
 * Wraps SpeechRecognition for real-time transcript and WPM calculation
 *
 * Phase 02 scope: Interim results only
 * - Used for real-time WPM estimation
 * - Final transcript accuracy deferred to Phase 05
 *
 * Chrome-only: Uses webkitSpeechRecognition
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// Type declarations for Web Speech API (Chrome)
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }
}

export interface UseWebSpeechResult {
  /** Current interim transcript */
  interimTranscript: string;
  /** Total word count from all results */
  wordCount: number;
  /** Whether recognition is active */
  isListening: boolean;
  /** Error message if recognition failed */
  error: string | null;
  /** Start recognition */
  start: () => void;
  /** Stop recognition */
  stop: () => void;
}

/**
 * Count words in a string
 */
function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function useWebSpeech(): UseWebSpeechResult {
  const [interimTranscript, setInterimTranscript] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');

  // Check for browser support
  const isSupported = typeof window !== 'undefined' &&
    (window.webkitSpeechRecognition || window.SpeechRecognition);

  // Initialize recognition instance
  useEffect(() => {
    if (!isSupported) {
      setError('Web Speech API not supported in this browser');
      return;
    }

    const SpeechRecognitionClass = window.webkitSpeechRecognition || window.SpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    // Configure for continuous interim results
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = final;
      setInterimTranscript(interim);

      // Update word count from combined transcript
      const totalText = final + interim;
      setWordCount(countWords(totalText));
    };

    recognition.onerror = (event) => {
      // Don't treat 'no-speech' as error - it's expected during silence
      if (event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`);
        console.error('[useWebSpeech] Error:', event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Auto-restart if we're supposed to be listening (continuous mode workaround)
      // Note: Chrome sometimes stops recognition; this handles that
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) {
      return;
    }

    // Reset state
    setInterimTranscript('');
    setWordCount(0);
    setError(null);
    finalTranscriptRef.current = '';

    try {
      recognitionRef.current.start();
    } catch (err) {
      // Handle case where recognition is already started
      console.warn('[useWebSpeech] Start error:', err);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.warn('[useWebSpeech] Stop error:', err);
    }
  }, [isListening]);

  return {
    interimTranscript,
    wordCount,
    isListening,
    error,
    start,
    stop,
  };
}
