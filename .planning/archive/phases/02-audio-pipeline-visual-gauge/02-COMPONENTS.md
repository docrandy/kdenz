# Phase 02: Component Responsibility Breakdown

## Hooks (src/core/audio/)

### useAudioCapture

**Responsibility:** Mic access and stream management

| Input | Output |
|-------|--------|
| None (user-triggered) | `audioStream: MediaStream` |
| | `audioBlob: Blob` (on stop) |
| | `isCapturing: boolean` |
| | `start(): void` |
| | `stop(): void` |

**Behavior:**
- Requests mic permission via `getUserMedia`
- Creates MediaRecorder for blob capture
- Splits stream for parallel analysis
- Cleans up on stop (revokes stream, stops recorder)

**Does NOT:**
- Perform any analysis
- Handle errors (caller's responsibility)
- Manage UI state

---

### useWebSpeech

**Responsibility:** Web Speech API wrapper for interim transcripts

| Input | Output |
|-------|--------|
| `isActive: boolean` | `interimTranscript: string` |
| | `wordCount: number` |
| | `isListening: boolean` |

**Behavior:**
- Starts SpeechRecognition when `isActive` true
- Configures `continuous: true`, `interimResults: true`
- Extracts word count from interim results
- Stops recognition when `isActive` false

**Does NOT:**
- Store final transcripts (Phase 05)
- Calculate WPM (caller computes from wordCount + time)
- Handle non-Chrome browsers (assumes Chrome)

---

### useFillerDetector

**Responsibility:** Acoustic filler detection from audio stream

| Input | Output |
|-------|--------|
| `audioStream: MediaStream` | `fillerCount: number` |
| `isActive: boolean` | `fillerEvents: FillerEvent[]` |
| | `fillerRate: number` (per minute) |

**FillerEvent shape:**
```
{
  type: 'um' | 'uh' | 'like' | 'you_know'
  timestamp: number (ms from session start)
  confidence: number (0-1)
}
```

**Behavior:**
- Connects FillerDetector to audio stream
- Emits events on filler detection
- Accumulates count and computes rate
- Stores timestamps for Phase 04 playback

**Does NOT:**
- Perform transcript reconciliation (Phase 05)
- Display anything (pure data)
- Filter by confidence (all detections reported)

---

### useSilenceTimer

**Responsibility:** VAD-based silence detection

| Input | Output |
|-------|--------|
| `audioStream: MediaStream` | `silenceDuration: number` (ms) |
| `isActive: boolean` | `isSilent: boolean` |
| `threshold: number` (default 10000) | `showNudge: boolean` |

**Behavior:**
- Monitors audio stream for voice activity
- Increments timer during silence
- Resets timer on voice detection
- Sets `showNudge` when threshold exceeded

**Does NOT:**
- Render UI (returns boolean for display logic)
- Use transcript gaps (audio-only)
- Persist silence events

---

## Visual Components (src/components/)

### FillerGauge

**Responsibility:** Display filler count as circular arc gauge

| Props | Renders |
|-------|---------|
| `count: number` | 270° arc gauge |
| `maxCount?: number` (default 10) | Fill-only (no needle) |
| | Color gradient: green→yellow→red |

**Visual Spec:**
- Arc opens at bottom (270° total)
- Fill percentage: `min(count / maxCount, 1)`
- Gradient stops: 0% green (#00FF00), 50% yellow (#FFD700), 100% red (#FF4444)
- Center displays numeric count
- Styled: black stroke, white background, teal accent on label

**Does NOT:**
- Fetch data (pure display)
- Animate between values (instant update)
- Show historical data

---

### WPMIndicator

**Responsibility:** Display words per minute with visual indicator

| Props | Renders |
|-------|---------|
| `wpm: number` | Numeric WPM value |
| `targetRange?: [min, max]` | Horizontal bar indicator |
| (default [120, 150]) | Color coding by range |

**Visual Spec:**
- Large numeric display (current WPM)
- Horizontal bar showing position in range
- Colors: below range (blue), in range (green), above range (orange)
- Label: "WPM" with High-Performance Clinical styling

**Does NOT:**
- Calculate WPM (receives as prop)
- Store history
- Show trend direction

---

### SilenceNudge

**Responsibility:** Gentle prompt after 10s silence

| Props | Renders |
|-------|---------|
| `visible: boolean` | Overlay/toast message |
| `onDismiss?: () => void` | Dismissible UI |

**Visual Spec:**
- Appears centered or bottom-third
- Message: "Still there? Say something to continue..."
- Subtle animation (fade in)
- Teal accent color
- Auto-dismisses when `visible` becomes false

**Does NOT:**
- Track silence (receives boolean)
- Play audio prompts
- Block interaction

---

### WeeklyTrendChart

**Responsibility:** Shell for weekly filler rate chart

| Props | Renders |
|-------|---------|
| `data?: WeeklyData[]` | Bar or line chart |
| | X-axis: Mon–Sun |
| | Y-axis: Filler rate (%) |

**WeeklyData shape (future):**
```
{
  day: 'Mon' | 'Tue' | ... | 'Sun'
  fillerRate: number (0-100)
  sessionCount: number
}
```

**Phase 02 Behavior:**
- Renders chart structure with placeholder/mock data
- Shows empty state: "Complete sessions to see trends"
- Styled per design system

**Does NOT:**
- Fetch or compute data (Phase 06)
- Persist anything
- Show individual sessions

---

## Container Component

### PracticeSession (modified)

**Responsibility:** Orchestrate session flow and wire components

| State | Children |
|-------|----------|
| `isRecording: boolean` | FillerGauge |
| `sessionStart: number` | WPMIndicator |
| `audioStream: MediaStream` | SilenceNudge |
| `audioBlob: Blob` | WeeklyTrendChart |
| | Start/Stop button |

**Behavior:**
- Start button → calls all hooks' start methods
- Stop button → calls all hooks' stop methods
- Passes hook outputs to visual components
- Computes WPM: `(wordCount / elapsedSeconds) * 60`
- Updates all displays on 250ms cadence via `setInterval`

**Does NOT:**
- Manage duration/timer (Phase 03)
- Handle playback (Phase 04)
- Show scorecard (Phase 06)

---

## Dependency Graph

```
PracticeSession
├── useAudioCapture ─────────────────┐
│   └── provides: audioStream        │
│                                    │
├── useWebSpeech ◄───────────────────┤ (needs isActive)
│   └── provides: wordCount          │
│                                    │
├── useFillerDetector ◄──────────────┤ (needs audioStream)
│   └── provides: fillerCount,       │
│                 fillerEvents       │
│                                    │
├── useSilenceTimer ◄────────────────┘ (needs audioStream)
│   └── provides: showNudge
│
├── FillerGauge ◄─── fillerCount
├── WPMIndicator ◄─── computed WPM
├── SilenceNudge ◄─── showNudge
└── WeeklyTrendChart ◄─── (placeholder data)
```

---

*Component breakdown created: 2026-01-25*
