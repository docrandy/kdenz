/**
 * Microphone Capture
 * Vendored from Black Swan project
 *
 * Purpose: Get clean audio into the browser
 * - Use WebAudio + getUserMedia
 * - Support desktop browsers only
 * - Handle permission denial gracefully
 */

export type MicrophoneState = 'idle' | 'requesting' | 'active' | 'error' | 'denied';

export interface MicrophoneConfig {
  sampleRate: number;
  channelCount: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

export interface MicrophoneError {
  type: 'permission_denied' | 'not_found' | 'not_readable' | 'overconstrained' | 'unknown';
  message: string;
  originalError?: Error;
}

const DEFAULT_CONFIG: MicrophoneConfig = {
  sampleRate: 16000, // Optimal for speech processing
  channelCount: 1,   // Mono for speech
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

export class MicrophoneCapture {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private state: MicrophoneState = 'idle';
  private config: MicrophoneConfig;
  private stateListeners: Set<(state: MicrophoneState) => void> = new Set();
  private errorListeners: Set<(error: MicrophoneError) => void> = new Set();

  constructor(config: Partial<MicrophoneConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Initialize microphone capture
   * Returns AudioContext and source node for DSP pipeline
   */
  async start(): Promise<{ context: AudioContext; source: MediaStreamAudioSourceNode }> {
    if (this.state === 'active') {
      if (!this.audioContext || !this.sourceNode) {
        throw new Error('Invalid state: active but no context/source');
      }
      return { context: this.audioContext, source: this.sourceNode };
    }

    this.setState('requesting');

    try {
      // Request microphone access
      const stream = await this.requestMicrophoneAccess();

      // Create Web Audio context
      const context = new AudioContext({
        sampleRate: this.config.sampleRate,
        latencyHint: 'interactive', // Minimize latency for real-time processing
      });

      // Create source node from stream
      const source = context.createMediaStreamSource(stream);

      // Store references
      this.audioContext = context;
      this.mediaStream = stream;
      this.sourceNode = source;

      this.setState('active');

      return { context, source };
    } catch (error) {
      const micError = this.handleError(error);
      this.setState('error');
      this.notifyError(micError);
      throw micError;
    }
  }

  /**
   * Stop microphone capture and cleanup resources
   */
  async stop(): Promise<void> {
    try {
      // Stop all tracks in the media stream
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      // Disconnect and cleanup audio nodes
      if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
      }

      // Close audio context
      if (this.audioContext && this.audioContext.state !== 'closed') {
        await this.audioContext.close();
        this.audioContext = null;
      }

      this.setState('idle');
    } catch (error) {
      console.error('Error stopping microphone:', error);
      this.setState('idle'); // Reset state even on error
    }
  }

  /**
   * Get current microphone state
   */
  getState(): MicrophoneState {
    return this.state;
  }

  /**
   * Check if microphone is currently active
   */
  isActive(): boolean {
    return this.state === 'active';
  }

  /**
   * Get audio context (null if not started)
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Get source node (null if not started)
   */
  getSourceNode(): MediaStreamAudioSourceNode | null {
    return this.sourceNode;
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(listener: (state: MicrophoneState) => void): () => void {
    this.stateListeners.add(listener);
    // Return unsubscribe function
    return () => this.stateListeners.delete(listener);
  }

  /**
   * Subscribe to errors
   */
  onError(listener: (error: MicrophoneError) => void): () => void {
    this.errorListeners.add(listener);
    // Return unsubscribe function
    return () => this.errorListeners.delete(listener);
  }

  /**
   * Request microphone access with proper constraints
   */
  private async requestMicrophoneAccess(): Promise<MediaStream> {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('getUserMedia is not supported in this browser');
    }

    const constraints: MediaStreamConstraints = {
      audio: {
        channelCount: this.config.channelCount,
        echoCancellation: this.config.echoCancellation,
        noiseSuppression: this.config.noiseSuppression,
        autoGainControl: this.config.autoGainControl,
        sampleRate: this.config.sampleRate,
      },
      video: false,
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * Handle and classify errors
   */
  private handleError(error: unknown): MicrophoneError {
    if (error instanceof DOMException) {
      switch (error.name) {
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          return {
            type: 'permission_denied',
            message: 'Microphone permission denied. Please allow microphone access to continue.',
            originalError: error,
          };
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          return {
            type: 'not_found',
            message: 'No microphone found. Please connect a microphone and try again.',
            originalError: error,
          };
        case 'NotReadableError':
        case 'TrackStartError':
          return {
            type: 'not_readable',
            message: 'Microphone is in use by another application. Please close other applications and try again.',
            originalError: error,
          };
        case 'OverconstrainedError':
          return {
            type: 'overconstrained',
            message: 'Microphone does not meet requirements. Please use a different microphone.',
            originalError: error,
          };
      }
    }

    return {
      type: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error occurred while accessing microphone',
      originalError: error instanceof Error ? error : undefined,
    };
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: MicrophoneState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach(listener => listener(newState));
    }
  }

  /**
   * Notify error listeners
   */
  private notifyError(error: MicrophoneError): void {
    this.errorListeners.forEach(listener => listener(error));
  }
}
