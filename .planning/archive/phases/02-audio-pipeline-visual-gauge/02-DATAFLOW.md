# Phase 02: Data Flow Diagram

## Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERACTION                                │
│                                                                             │
│                         [Start Button] ──► [Stop Button]                    │
└─────────────────────────────┬───────────────────┬───────────────────────────┘
                              │                   │
                              ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AUDIO CAPTURE                                   │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         getUserMedia()                                │   │
│  │                              │                                        │   │
│  │                              ▼                                        │   │
│  │                      MediaStream (mic)                                │   │
│  │                         │       │                                     │   │
│  │            ┌────────────┘       └────────────┐                        │   │
│  │            ▼                                 ▼                        │   │
│  │    MediaRecorder                      Analysis Stream                 │   │
│  │         │                                    │                        │   │
│  │         ▼                    ┌───────────────┼───────────────┐        │   │
│  │    Blob (on stop)            │               │               │        │   │
│  │    [saved for Phase 04]      ▼               ▼               ▼        │   │
│  │                          VAD Engine    FillerDetector   Web Speech    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │               │               │
                                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PROCESSING LAYER                                │
│                                                                             │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────────┐        │
│  │  Silence Timer │    │ Filler Counter │    │   WPM Calculator   │        │
│  │                │    │                │    │                    │        │
│  │  VAD signal    │    │  Event stream  │    │  Interim results   │        │
│  │      │         │    │      │         │    │       │            │        │
│  │      ▼         │    │      ▼         │    │       ▼            │        │
│  │  Duration (ms) │    │  Count + Rate  │    │  Word count        │        │
│  │      │         │    │      │         │    │       │            │        │
│  │      ▼         │    │      ▼         │    │       ▼            │        │
│  │  showNudge     │    │  fillerEvents  │    │  WPM = words/time  │        │
│  │  (bool @ 10s)  │    │  (timestamps)  │    │       × 60         │        │
│  └────────────────┘    └────────────────┘    └────────────────────┘        │
│           │                    │                      │                     │
└───────────┼────────────────────┼──────────────────────┼─────────────────────┘
            │                    │                      │
            │                    │                      │
            ▼                    ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           250ms UPDATE CADENCE                               │
│                                                                             │
│                    setInterval(() => updateUI(), 250)                       │
│                                    │                                        │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         │                          │                          │             │
│         ▼                          ▼                          ▼             │
└─────────────────────────────────────────────────────────────────────────────┘
          │                          │                          │
          ▼                          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VISUAL LAYER                                    │
│                                                                             │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────────┐        │
│  │  SilenceNudge  │    │  FillerGauge   │    │   WPMIndicator     │        │
│  │                │    │                │    │                    │        │
│  │  visible=bool  │    │  count=N       │    │   wpm=N            │        │
│  │                │    │                │    │                    │        │
│  │  ┌──────────┐  │    │   ╭───────╮    │    │  ┌──────────────┐  │        │
│  │  │ "Still   │  │    │  ╱  ###   ╲   │    │  │    142       │  │        │
│  │  │ there?"  │  │    │ │   ###    │  │    │  │  ████████░░  │  │        │
│  │  └──────────┘  │    │  ╲   3    ╱   │    │  │    WPM       │  │        │
│  │                │    │   ╰─────╯     │    │  └──────────────┘  │        │
│  └────────────────┘    └────────────────┘    └────────────────────┘        │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        WeeklyTrendChart (Shell)                       │   │
│  │                                                                       │   │
│  │     %  │                                                              │   │
│  │    10  │     ░░░                                                      │   │
│  │     5  │  ░░░░░░░░░                                                   │   │
│  │     0  └─────────────────────────────                                 │   │
│  │          Mon Tue Wed Thu Fri Sat Sun                                  │   │
│  │                                                                       │   │
│  │              "Complete sessions to see trends"                        │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Flow: Start Session

```
User clicks [Start]
        │
        ▼
┌───────────────────┐
│ useAudioCapture   │
│ .start()          │
└─────────┬─────────┘
          │
          ▼
    getUserMedia()
          │
          ├──► Permission granted ──► MediaStream created
          │                                  │
          │                    ┌─────────────┴─────────────┐
          │                    │                           │
          │                    ▼                           ▼
          │            MediaRecorder              Stream clone for analysis
          │            .start()                            │
          │                                   ┌────────────┼────────────┐
          │                                   │            │            │
          │                                   ▼            ▼            ▼
          │                              VAD Engine   FillerDet    WebSpeech
          │                              .connect()   .connect()   .start()
          │
          └──► Permission denied ──► Error state (handled by caller)
```

---

## Detailed Flow: During Session (250ms tick)

```
Every 250ms:
        │
        ▼
┌───────────────────────────────────────────────────────────┐
│                     COLLECT METRICS                        │
│                                                           │
│  fillerCount ◄── useFillerDetector.fillerCount            │
│  wordCount   ◄── useWebSpeech.wordCount                   │
│  showNudge   ◄── useSilenceTimer.showNudge                │
│                                                           │
│  elapsed = Date.now() - sessionStart                      │
│  wpm = (wordCount / (elapsed / 1000)) * 60                │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│                     UPDATE STATE                           │
│                                                           │
│  setState({                                               │
│    fillerCount,                                           │
│    wpm,                                                   │
│    showNudge                                              │
│  })                                                       │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          ▼
┌───────────────────────────────────────────────────────────┐
│                     RE-RENDER                              │
│                                                           │
│  <FillerGauge count={fillerCount} />                      │
│  <WPMIndicator wpm={wpm} />                               │
│  <SilenceNudge visible={showNudge} />                     │
└───────────────────────────────────────────────────────────┘
```

---

## Detailed Flow: Stop Session

```
User clicks [Stop]
        │
        ▼
┌───────────────────┐
│ Clear 250ms       │
│ interval          │
└─────────┬─────────┘
          │
          ├──► useAudioCapture.stop()
          │           │
          │           ├──► MediaRecorder.stop() ──► Blob created
          │           └──► MediaStream.getTracks().forEach(t => t.stop())
          │
          ├──► useWebSpeech.stop()
          │           │
          │           └──► SpeechRecognition.stop()
          │
          ├──► useFillerDetector.stop()
          │           │
          │           └──► Disconnect from stream
          │
          └──► useSilenceTimer.stop()
                      │
                      └──► Clear internal timers
                              │
                              ▼
                      Session data available:
                      - audioBlob (for Phase 04)
                      - fillerEvents[] (for Phase 04)
                      - final fillerCount
                      - final WPM
```

---

## Data Shapes

### FillerEvent (internal)

```
{
  type: 'um' | 'uh' | 'like' | 'you_know'
  timestamp: number      // ms from session start
  confidence: number     // 0.0 - 1.0
}
```

### Session Output (end of Phase 02)

```
{
  audioBlob: Blob                    // For playback (Phase 04)
  fillerEvents: FillerEvent[]        // For timeline markers (Phase 04)
  fillerCount: number                // Display value
  fillerRate: number                 // Per minute rate
  wpm: number                        // Final WPM
  duration: number                   // Session length in ms
}
```

### Weekly Trend (shell only)

```
{
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
  fillerRate: number     // Percentage (0-100)
  sessionCount: number   // Sessions that day
}
```

---

## State Ownership

| State | Owner | Consumers |
|-------|-------|-----------|
| `isRecording` | PracticeSession | All hooks, UI |
| `audioStream` | useAudioCapture | useFillerDetector, useSilenceTimer |
| `wordCount` | useWebSpeech | PracticeSession (WPM calc) |
| `fillerCount` | useFillerDetector | FillerGauge |
| `fillerEvents` | useFillerDetector | (Phase 04) |
| `showNudge` | useSilenceTimer | SilenceNudge |
| `audioBlob` | useAudioCapture | (Phase 04) |

---

## Browser API Dependencies

| API | Used By | Chrome Support |
|-----|---------|----------------|
| `getUserMedia` | useAudioCapture | Full |
| `MediaRecorder` | useAudioCapture | Full |
| `SpeechRecognition` | useWebSpeech | Full (webkit prefix) |
| `AudioContext` | VAD, FillerDetector | Full |
| `AnalyserNode` | VAD | Full |

---

*Data flow diagram created: 2026-01-25*
