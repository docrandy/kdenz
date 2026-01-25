# Silence Semantics (TF-02)

This document defines the authoritative semantics for silence detection and classification in VoiceLab.

## Overview

VoiceLab distinguishes between different types of speech pauses to provide accurate metrics and feedback. This distinction is critical for:

1. **Accurate WPM calculation** - Speaking pace measured against actual speaking time
2. **Appropriate feedback** - Different pause types require different responses
3. **Meaningful statistics** - Session summaries that reflect true speaking patterns

## Pause Classifications

### 1. Unfilled Pause

**Definition:** Natural silence between words or phrases lasting less than the silence threshold (default: 2.0 seconds).

**Characteristics:**
- Duration: 300ms to 2000ms
- Occurs naturally in speech rhythm
- Part of normal pacing and breathing
- NOT problematic

**System behavior:**
- Excluded from speaking time (for WPM calculation)
- NOT counted in session statistics
- No feedback triggered

### 2. Extended Silence

**Definition:** Continuous VAD silence exceeding the configurable threshold (default: 2.0 seconds).

**Characteristics:**
- Duration: ≥ 2000ms (configurable)
- May indicate:
  - Loss of thought
  - Nervousness
  - Technical issues
  - Intentional pause for effect

**System behavior:**
- Triggers silence nudge (visual cue)
- Counted in session statistics
- Recorded with timestamp for playback markers

### 3. Filled Pause (Filler)

**Definition:** Vocalized hesitation such as "um", "uh", "like", "you know".

**Characteristics:**
- VAD shows SPEECH (not silence)
- Detected by FillerDetector
- Typically 80-600ms duration

**System behavior:**
- Counted separately from silence
- Real-time feedback (heat gauge pulse)
- Marked on playback timeline

## Key Distinction

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Silence (VAD = silence)        vs    Filler (VAD = speech)    │
│  ─────────────────────                ───────────────────       │
│  • Unfilled pause (<2s)               • "um", "uh", "like"     │
│  • Extended silence (≥2s)             • Vocalized hesitation   │
│  • No sound                           • Sound present          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## WPM Calculation

Words Per Minute is calculated using VAD-active speaking time, NOT wall-clock time:

```
Speaking Time = Total Duration - Sum of All Silences
WPM = (Word Count / Speaking Time in Minutes)
```

This ensures that natural pauses don't artificially deflate WPM.

## Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SILENCE_THRESHOLD_MS` | 2000 | Duration (ms) that triggers extended silence |
| `MIN_PAUSE_DURATION_MS` | 300 | Minimum duration to count as any pause |

Users can adjust `SILENCE_THRESHOLD_MS` in settings for personal preference.

## Implementation

See: `src/lib/silenceSemantics.ts`

The implementation provides:
- `classifySilence(durationMs)` - Classify a pause by duration
- `calculateSpeakingTime()` - Derive speaking time from total and silences
- `SilenceMetrics` - Aggregate silence statistics for a session
- `SilenceEvent` - Individual silence event with timestamps

## Usage in Components

```typescript
import {
  classifySilence,
  calculateSpeakingTime,
  DEFAULT_SILENCE_THRESHOLD_MS
} from '@/lib/silenceSemantics';

// Classify a detected pause
const type = classifySilence(pauseDuration);

// Calculate actual speaking time
const speakingTime = calculateSpeakingTime(totalDuration, silenceEvents);
const wpm = wordCount / (speakingTime / 60000);
```

## Related Requirements

- **TF-02**: Silence semantics (this document)
- **RT-06**: Silence nudge after extended silence
- **RT-07**: Configurable silence threshold
- **SUM-04**: Pause statistics in session summary
