/**
 * Web Speech API Hook
 * Wraps SpeechRecognition for real-time transcript and WPM calculation
 *
 * Phase 05: Enhanced with transcript segments and word timings
 * - Exposes final transcript for post-session display
 * - Tracks segments with timestamps for highlighting
 * - Approximates word timings for filler reconciliation
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

/** A segment of transcript with timing info */
export interface TranscriptSegment {
  text: string;
  startTime: number;  // ms from session start
  endTime: number;    // ms from session start
  isFinal: boolean;
}

/** Word with approximate timestamp */
export interface WordTiming {
  word: string;
  timestamp: number;  // ms from session start
  index: number;      // position in full transcript (word index)
}

export interface UseWebSpeechResult {
  /** Current interim transcript */
  interimTranscript: string;
  /** Complete final transcript */
  finalTranscript: string;
  /** Total word count from all results */
  wordCount: number;
  /** Transcript segments with timing */
  transcriptSegments: TranscriptSegment[];
  /** Word timings for highlighting */
  wordTimings: WordTiming[];
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

/**
 * Extract words from text
 */
function extractWords(text: string): string[] {
  if (!text.trim()) return [];
  return text.trim().split(/\s+/);
}

export function useWebSpeech(): UseWebSpeechResult {
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[]>([]);
  const [wordTimings, setWordTimings] = useState<WordTiming[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef('');
  const sessionStartRef = useRef<number>(0);
  const lastSegmentEndRef = useRef<number>(0);
  const wordIndexRef = useRef<number>(0);

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
      const now = Date.now();
      let interim = '';
      let final = finalTranscriptRef.current;
      const newSegments: TranscriptSegment[] = [];
      const newWordTimings: WordTiming[] = [];

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          // Calculate segment timing
          const segmentStart = lastSegmentEndRef.current || (now - sessionStartRef.current);
          const segmentEnd = now - sessionStartRef.current;

          newSegments.push({
            text: transcript,
            startTime: segmentStart,
            endTime: segmentEnd,
            isFinal: true,
          });

          // Approximate word timings within segment
          const words = extractWords(transcript);
          const segmentDuration = segmentEnd - segmentStart;
          const wordDuration = words.length > 0 ? segmentDuration / words.length : 0;

          words.forEach((word, idx) => {
            newWordTimings.push({
              word,
              timestamp: segmentStart + (idx * wordDuration),
              index: wordIndexRef.current + idx,
            });
          });

          wordIndexRef.current += words.length;
          lastSegmentEndRef.current = segmentEnd;
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      finalTranscriptRef.current = final;
      setFinalTranscript(final.trim());
      setInterimTranscript(interim);

      // Append new segments and word timings
      if (newSegments.length > 0) {
        setTranscriptSegments(prev => [...prev, ...newSegments]);
        setWordTimings(prev => [...prev, ...newWordTimings]);
      }

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
    setFinalTranscript('');
    setWordCount(0);
    setTranscriptSegments([]);
    setWordTimings([]);
    setError(null);
    finalTranscriptRef.current = '';
    sessionStartRef.current = Date.now();
    lastSegmentEndRef.current = 0;
    wordIndexRef.current = 0;

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
    finalTranscript,
    wordCount,
    transcriptSegments,
    wordTimings,
    isListening,
    error,
    start,
    stop,
  };
}
