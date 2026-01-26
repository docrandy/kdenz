/**
 * Filler Detection
 * Vendored from Black Swan project
 *
 * Purpose: Detect filler words using acoustic pattern matching
 * - Local keyword spotting: um, uh, like, you know
 * - Acoustic pattern matching (MVP approach)
 */

export type FillerType = 'um' | 'uh' | 'like' | 'you-know';

export interface FillerDetection {
  type: FillerType;
  timestamp: number;      // ms since session start
  confidence: number;     // 0-1
}

export interface FillerMetrics {
  umCount: number;
  uhCount: number;
  likeCount: number;
  youKnowCount: number;
  totalFillers: number;
  fillerRate: number;     // Fillers per minute
  detections: FillerDetection[];
}

export interface FillerConfig {
  // Energy thresholds for filler detection
  minEnergy: number;              // Minimum RMS for voiced sound
  maxEnergy: number;              // Maximum RMS (fillers are usually quiet)

  // Duration constraints (ms)
  minDuration: number;            // Minimum duration for filler
  maxDuration: number;            // Maximum duration for filler

  // Pattern matching
  umUhThreshold: number;          // Confidence threshold for um/uh
  likeThreshold: number;          // Confidence threshold for like
  youKnowMinDuration: number;     // Min duration for "you know" (longer phrase)

  // Detection sensitivity
  enabled: boolean;               // Enable/disable filler detection
}

const DEFAULT_CONFIG: FillerConfig = {
  minEnergy: 0.005,              // Quiet but voiced
  maxEnergy: 0.03,               // Typically quieter than speech
  minDuration: 80,               // ~80ms minimum for "uh"
  maxDuration: 600,              // ~600ms maximum for "you know"
  umUhThreshold: 0.5,
  likeThreshold: 0.5,
  youKnowMinDuration: 300,       // "you know" is longer
  enabled: true,
};

/**
 * Filler Detector
 *
 * Detects filler words using acoustic pattern matching.
 * For v1: Uses heuristic approach (energy + duration + spectral features)
 */
export class FillerDetector {
  private config: FillerConfig;
  private audioContext: AudioContext;
  private analyserNode: AnalyserNode;
  private dataArray: Float32Array<ArrayBuffer>;
  private frequencyData: Uint8Array<ArrayBuffer>;
  private animationFrameId: number | null = null;

  // Detection state
  private sessionStartTime: number = 0;
  private detections: FillerDetection[] = [];
  private isDetecting: boolean = false;

  // Pattern tracking
  private segmentStart: number = 0;
  private segmentEnergy: number[] = [];
  private segmentDuration: number = 0;

  // Metrics calculation
  private speechDuration: number = 0;  // Total speech time in ms

  constructor(
    audioContext: AudioContext,
    sourceNode: AudioNode,
    config: Partial<FillerConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.audioContext = audioContext;

    // Create analyser node for spectral analysis
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 1024;
    this.analyserNode.smoothingTimeConstant = 0.3;

    // Connect source to analyser
    sourceNode.connect(this.analyserNode);

    // Initialize data arrays
    this.dataArray = new Float32Array(this.analyserNode.fftSize);
    this.frequencyData = new Uint8Array(this.analyserNode.frequencyBinCount);
  }

  /**
   * Start detecting fillers (during speech turn)
   */
  start(): void {
    if (this.animationFrameId !== null || !this.config.enabled) {
      return;
    }

    this.sessionStartTime = Date.now();
    this.isDetecting = true;
    this.detections = [];
    this.speechDuration = 0;
    this.processAudio();
  }

  /**
   * Stop detecting and return accumulated metrics
   */
  stop(): FillerMetrics {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.isDetecting = false;

    // Calculate metrics
    const metrics = this.calculateMetrics();

    // Reset state
    this.reset();

    return metrics;
  }

  /**
   * Enable or disable filler detection
   */
  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;

    if (!enabled && this.isDetecting) {
      this.stop();
    }
  }

  /**
   * Check if detector is currently active
   */
  isActive(): boolean {
    return this.isDetecting;
  }

  /**
   * Main processing loop
   */
  private processAudio = (): void => {
    if (!this.config.enabled) {
      return;
    }

    // Get time-domain data
    this.analyserNode.getFloatTimeDomainData(this.dataArray);

    // Get frequency data for pattern matching
    this.analyserNode.getByteFrequencyData(this.frequencyData);

    // Calculate current energy
    const energy = this.calculateRMS(this.dataArray);

    // Track speech segments and detect patterns
    this.trackSegment(energy);

    // Continue processing
    this.animationFrameId = requestAnimationFrame(this.processAudio);
  };

  /**
   * Track audio segments and detect filler patterns
   */
  private trackSegment(energy: number): void {
    const now = Date.now();
    const isVoiced = energy >= this.config.minEnergy && energy <= this.config.maxEnergy;

    if (isVoiced) {
      // Continue or start segment
      if (this.segmentStart === 0) {
        this.segmentStart = now;
        this.segmentEnergy = [];
      }

      this.segmentEnergy.push(energy);
      this.segmentDuration = now - this.segmentStart;
      this.speechDuration += 16; // ~16ms per frame
    } else {
      // Segment ended - analyze if it was a filler
      if (this.segmentStart > 0) {
        this.analyzeSegment();
      }

      // Reset segment
      this.segmentStart = 0;
      this.segmentEnergy = [];
      this.segmentDuration = 0;
    }
  }

  /**
   * Analyze completed segment for filler patterns
   */
  private analyzeSegment(): void {
    const duration = this.segmentDuration;

    // Check duration constraints
    if (duration < this.config.minDuration || duration > this.config.maxDuration) {
      return;
    }

    // Get spectral characteristics
    const spectralCentroid = this.calculateSpectralCentroid();
    const spectralFlatness = this.calculateSpectralFlatness();

    // Pattern matching based on duration and spectral features

    // Um/Uh detection: Short duration (80-250ms), low centroid, flat spectrum
    if (duration >= 80 && duration <= 250) {
      if (spectralCentroid < 800 && spectralFlatness > 0.3) {
        const confidence = Math.min(
          (1 - Math.abs(spectralCentroid - 400) / 400) * 0.7 + 0.3,
          1.0
        );

        if (confidence >= this.config.umUhThreshold) {
          // Distinguish um vs uh by subtle frequency characteristics
          const type: FillerType = spectralCentroid < 500 ? 'um' : 'uh';
          this.addDetection(type, confidence);
        }
      }
    }

    // "Like" detection: Medium duration (150-400ms), higher centroid
    if (duration >= 150 && duration <= 400) {
      if (spectralCentroid > 900 && spectralCentroid < 1500) {
        const confidence = Math.min(
          (1 - Math.abs(spectralCentroid - 1200) / 600) * 0.6 + 0.4,
          1.0
        );

        if (confidence >= this.config.likeThreshold) {
          this.addDetection('like', confidence);
        }
      }
    }

    // "You know" detection: Longer duration (300-600ms), varied spectrum
    if (duration >= this.config.youKnowMinDuration && duration <= 600) {
      // "You know" has more variation in energy and spectrum
      const energyVariance = this.calculateVariance(this.segmentEnergy);

      if (energyVariance > 0.0001 && spectralFlatness < 0.4) {
        const confidence = Math.min(0.5 + (duration / 600) * 0.3, 0.8);
        this.addDetection('you-know', confidence);
      }
    }
  }

  /**
   * Add a filler detection
   */
  private addDetection(type: FillerType, confidence: number): void {
    const timestamp = Date.now() - this.sessionStartTime;

    this.detections.push({
      type,
      timestamp,
      confidence,
    });
  }

  /**
   * Calculate RMS energy
   */
  private calculateRMS(data: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  /**
   * Calculate spectral centroid (brightness)
   */
  private calculateSpectralCentroid(): number {
    let weightedSum = 0;
    let sum = 0;

    for (let i = 0; i < this.frequencyData.length; i++) {
      const magnitude = this.frequencyData[i];
      const frequency = (i * this.audioContext.sampleRate) / (this.analyserNode.fftSize * 2);
      weightedSum += frequency * magnitude;
      sum += magnitude;
    }

    return sum > 0 ? weightedSum / sum : 0;
  }

  /**
   * Calculate spectral flatness (noisiness)
   */
  private calculateSpectralFlatness(): number {
    let geometricMean = 1;
    let arithmeticMean = 0;
    const n = this.frequencyData.length;

    for (let i = 0; i < n; i++) {
      const magnitude = this.frequencyData[i] + 1; // Avoid log(0)
      geometricMean *= Math.pow(magnitude, 1 / n);
      arithmeticMean += magnitude / n;
    }

    return arithmeticMean > 0 ? geometricMean / arithmeticMean : 0;
  }

  /**
   * Calculate variance
   */
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    return squaredDiffs.reduce((sum, v) => sum + v, 0) / values.length;
  }

  /**
   * Calculate final metrics from detections
   */
  private calculateMetrics(): FillerMetrics {
    const umCount = this.detections.filter(d => d.type === 'um').length;
    const uhCount = this.detections.filter(d => d.type === 'uh').length;
    const likeCount = this.detections.filter(d => d.type === 'like').length;
    const youKnowCount = this.detections.filter(d => d.type === 'you-know').length;
    const totalFillers = umCount + uhCount + likeCount + youKnowCount;

    // Calculate fillers per minute
    const speechMinutes = this.speechDuration / 60000;
    const fillerRate = speechMinutes > 0 ? totalFillers / speechMinutes : 0;

    return {
      umCount,
      uhCount,
      likeCount,
      youKnowCount,
      totalFillers,
      fillerRate,
      detections: [...this.detections],
    };
  }

  /**
   * Reset detector state
   */
  private reset(): void {
    this.detections = [];
    this.segmentStart = 0;
    this.segmentEnergy = [];
    this.segmentDuration = 0;
    this.speechDuration = 0;
  }
}
