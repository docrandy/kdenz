/**
 * Voice Activity Detection (VAD)
 * Vendored from Black Swan project
 *
 * Purpose: Detect speech vs silence and turn boundaries
 * - Implement energy-based VAD
 * - Emit: speech_start, speech_end
 * - Latency ≤20ms
 */

export type VADEvent = 'speech_start' | 'speech_end';
export type VADState = 'silence' | 'speech';

export interface VADConfig {
  /**
   * Energy threshold for speech detection (0-1)
   * Higher values = less sensitive
   */
  energyThreshold: number;

  /**
   * Minimum duration of speech to trigger speech_start (ms)
   * Prevents false positives from brief noise
   */
  minSpeechDuration: number;

  /**
   * Minimum duration of silence to trigger speech_end (ms)
   * Prevents false negatives from brief pauses
   */
  minSilenceDuration: number;

  /**
   * Frame size for analysis (ms)
   * Smaller = lower latency but more CPU
   */
  frameSizeMs: number;
}

export interface VADMetrics {
  currentEnergy: number;
  state: VADState;
  speechDuration: number;
  silenceDuration: number;
}

const DEFAULT_CONFIG: VADConfig = {
  energyThreshold: 0.01,     // Sensitive to speech
  minSpeechDuration: 100,     // 100ms minimum speech
  minSilenceDuration: 300,    // 300ms silence to end turn
  frameSizeMs: 10,            // 10ms frames = very low latency
};

export class VoiceActivityDetector {
  private config: VADConfig;
  private analyserNode: AnalyserNode;
  private sourceNode: AudioNode;
  private dataArray: Float32Array<ArrayBuffer>;
  private animationFrameId: number | null = null;

  private currentState: VADState = 'silence';
  private speechStartTime: number = 0;
  private silenceStartTime: number = 0;
  private lastProcessTime: number = 0;

  private eventListeners: Map<VADEvent, Set<() => void>> = new Map();
  private metricsListeners: Set<(metrics: VADMetrics) => void> = new Set();

  constructor(
    audioContext: AudioContext,
    sourceNode: AudioNode,
    config: Partial<VADConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sourceNode = sourceNode;

    // Create analyser node for energy detection
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0.3;

    // Connect source to analyser
    this.sourceNode.connect(this.analyserNode);

    // Initialize data array
    this.dataArray = new Float32Array(this.analyserNode.fftSize);

    // Initialize event maps
    this.eventListeners.set('speech_start', new Set());
    this.eventListeners.set('speech_end', new Set());
  }

  /**
   * Start VAD processing
   */
  start(): void {
    if (this.animationFrameId !== null) {
      return; // Already running
    }

    this.lastProcessTime = performance.now();
    this.processAudio();
  }

  /**
   * Stop VAD processing
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Disconnect analyser
    this.analyserNode.disconnect();

    // Reset state
    this.currentState = 'silence';
    this.speechStartTime = 0;
    this.silenceStartTime = 0;
  }

  /**
   * Get current VAD state
   */
  getState(): VADState {
    return this.currentState;
  }

  /**
   * Get current metrics
   */
  getMetrics(): VADMetrics {
    const now = performance.now();
    return {
      currentEnergy: this.calculateEnergy(),
      state: this.currentState,
      speechDuration: this.currentState === 'speech' ? now - this.speechStartTime : 0,
      silenceDuration: this.currentState === 'silence' ? now - this.silenceStartTime : 0,
    };
  }

  /**
   * Subscribe to VAD events
   */
  on(event: VADEvent, callback: () => void): () => void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Subscribe to metrics updates
   */
  onMetrics(callback: (metrics: VADMetrics) => void): () => void {
    this.metricsListeners.add(callback);
    // Return unsubscribe function
    return () => this.metricsListeners.delete(callback);
  }

  /**
   * Update VAD configuration
   */
  updateConfig(config: Partial<VADConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Main audio processing loop
   * Runs at ~60fps for low latency (< 17ms per frame)
   */
  private processAudio = (): void => {
    const now = performance.now();
    const elapsed = now - this.lastProcessTime;

    // Process at the configured frame rate
    if (elapsed >= this.config.frameSizeMs) {
      this.lastProcessTime = now;

      // Get audio data
      this.analyserNode.getFloatTimeDomainData(this.dataArray);

      // Calculate energy
      const energy = this.calculateEnergy();

      // Detect speech/silence
      this.detectVoiceActivity(energy, now);

      // Notify metrics listeners
      this.notifyMetricsListeners();
    }

    // Continue processing
    this.animationFrameId = requestAnimationFrame(this.processAudio);
  };

  /**
   * Calculate audio energy (RMS)
   */
  private calculateEnergy(): number {
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    return Math.sqrt(sum / this.dataArray.length);
  }

  /**
   * Detect voice activity based on energy
   */
  private detectVoiceActivity(energy: number, now: number): void {
    const isSpeech = energy > this.config.energyThreshold;

    if (this.currentState === 'silence') {
      if (isSpeech) {
        // Potential speech start
        if (this.speechStartTime === 0) {
          this.speechStartTime = now;
        } else {
          const speechDuration = now - this.speechStartTime;
          if (speechDuration >= this.config.minSpeechDuration) {
            // Confirmed speech start
            this.currentState = 'speech';
            this.silenceStartTime = 0;
            this.emit('speech_start');
          }
        }
      } else {
        // Reset speech timer if energy drops
        this.speechStartTime = 0;
      }
    } else {
      // Current state is 'speech'
      if (!isSpeech) {
        // Potential speech end
        if (this.silenceStartTime === 0) {
          this.silenceStartTime = now;
        } else {
          const silenceDuration = now - this.silenceStartTime;
          if (silenceDuration >= this.config.minSilenceDuration) {
            // Confirmed speech end
            this.currentState = 'silence';
            this.speechStartTime = 0;
            this.emit('speech_end');
          }
        }
      } else {
        // Reset silence timer if energy rises
        this.silenceStartTime = 0;
      }
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: VADEvent): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback());
    }
  }

  /**
   * Notify metrics listeners
   */
  private notifyMetricsListeners(): void {
    if (this.metricsListeners.size > 0) {
      const metrics = this.getMetrics();
      this.metricsListeners.forEach(callback => callback(metrics));
    }
  }
}
