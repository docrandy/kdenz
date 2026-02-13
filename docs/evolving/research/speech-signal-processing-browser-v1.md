# Real-Time Speech & Voice Signal Processing for Browser-Based Coaching

- **Tier:** Evolving
- **Status:** OPEN
- **Version:** v1
- **Source:** Real-Time Speech & Voice Signal Processing for Browser-Based Coaching Tools - Google Docs.pdf (Note: duplicate copy "1-" also existed in inbox; identical content, skipped)
- **Summary:** Technical research on browser-based speech processing. Covers filler word detection (KWS vs ASR), pause detection/classification, prosody/cadence analysis, voice tone classification limitations, and a real-time vs post-session decision framework with readiness ratings.

---

## 1. Filler Word Detection

### Two Approaches

| Approach | How It Works | Accuracy | Latency | Browser Support |
|----------|-------------|----------|---------|----------------|
| **Keyword Spotting (KWS)** | Acoustic pattern matching for "um", "uh" | 65-75% F1 | <100ms (real-time capable) | Web Audio API + TensorFlow.js |
| **ASR-Based** | Transcribe speech, find fillers in transcript | 90-95%+ F1 | 1-5s delay | Web Speech API or streaming ASR |

### Recommendation: Hybrid Approach
- **Real-time:** KWS for immediate filler alerts (acoustic detection)
- **Post-session:** ASR transcript reconciliation to correct false positives/negatives
- **Display:** Show real-time count with "estimated" label; update to "final" count after transcript reconciliation

### Key Technical Notes
- KWS models: Teachable Machine, custom TF.js model trained on filler corpus
- "Um" detection is easier (77% F1) than "uh" (65% F1) due to vowel distinctiveness
- "Like" and "you know" require ASR (they're real words used as fillers contextually)
- False positives (flagging non-fillers) damage UX more than false negatives (missing fillers)

## 2. Pause Detection & Classification

### Detection Method
- **Voice Activity Detection (VAD):** Silero VAD or WebRTC VAD via Web Audio API
- **Threshold:** Silence >200ms between speech segments = pause
- **Accuracy:** 92% on clean audio; drops to 70-80% with background noise

### Classification (Post-Session Only)

| Pause Type | Definition | Real-Time Capable? |
|-----------|------------|-------------------|
| Breath pause | <300ms, natural speech rhythm | No (too short to classify in real-time) |
| Cognitive pause | 300ms-2s, thinking/processing | No (requires context analysis) |
| Hesitation pause | >500ms with preceding filler | Partially (if combined with filler detection) |
| Rhetorical pause | Deliberate, for emphasis | No (requires intent inference) |

### What to Show Users
- **Real-time:** Total pause count, pause frequency (pauses per minute)
- **Post-session:** Pause duration distribution, longest pauses with timestamps, pauses near fillers
- **Never claim:** Pause classification as "confident" vs "hesitant" (insufficient evidence for coaching context)

## 3. Prosody & Cadence Analysis

### Speech Rate
- **Method:** Syllables per second from VAD + transcript alignment
- **Accuracy:** High on clean audio (+-5% WPM)
- **Real-time capable:** Yes -- robust and simple
- **Display:** WPM with comparison to user's baseline

### Pitch (F0) Extraction
- **Method:** Autocorrelation or ML-based (CREPE model)
- **Accuracy:** +-5% on sustained tones; +-10-15% on natural speech
- **Limitation:** Octave errors common; gender/age/physiology confound heavily
- **Real-time capable:** Partially -- relative changes (trends) are OK; absolute values are risky
- **Display:** Pitch range in semitones (relative to user baseline), NOT Hz values

### What NOT to Build

| Feature | Why Not |
|---------|---------|
| Pitch-based confidence scoring | Gender bias: females score systematically lower despite identical skill |
| Emotion/tone classification | 45-65% accuracy, severe bias against non-native speakers and women |
| Rhythm smoothness / dysrhythmia | Only validated clinically (dementia/Parkinson's), not for coaching |
| Pitch jitter (micro-F0 variation) | Conflates fatigue, emotion, and medical conditions |

## 4. Real-Time vs Post-Session Decision Framework

### Green Light (Deploy Real-Time)

| Feature | Rationale |
|---------|-----------|
| Filler word counter (KWS) | Low latency, acceptable accuracy, high user value |
| Speech rate (WPM) | Robust, simple computation |
| Pause count | Simple VAD threshold |
| Visual pacing gauge | Composite of rate + pause, easy to update live |

### Yellow Light (Post-Session Only)

| Feature | Rationale |
|---------|-----------|
| Filler word reconciliation (ASR) | Needs full transcript for accuracy |
| Pause classification | Requires context and surrounding speech analysis |
| Pitch range / trends | Relative metrics OK but need baseline comparison |
| Transcript with highlights | Needs complete recording |

### Red Light (Do Not Deploy)

| Feature | Rationale |
|---------|-----------|
| Emotion/tone detection | <65% accuracy, severe demographic bias |
| Confidence scoring | No valid measurement; gender/cultural bias |
| Speech quality scoring | Subjective, no universal standard |
| Prescriptive coaching ("slow down") | Culturally variable, may increase anxiety |

## 5. Browser Technology Stack

| Component | Technology | Notes |
|-----------|-----------|-------|
| Audio capture | MediaRecorder API + Web Audio API | Chrome required (Safari issues) |
| VAD | Silero VAD (ONNX.js) or WebRTC VAD | Runs client-side |
| KWS for fillers | TensorFlow.js + custom model | ~2MB model, runs in browser |
| ASR (streaming) | Web Speech API or Deepgram streaming | Web Speech API is free but Chrome-only |
| Pitch extraction | Autocorrelation in AudioWorklet | Lightweight, real-time capable |
| Post-session ASR | Whisper API or Deepgram batch | Server-side, higher accuracy |

## Related Files

- [validation-standards-and-study-design-v1.md](validation-standards-and-study-design-v1.md) -- accuracy benchmarks per metric
- [bias-risks-and-mitigation-v1.md](bias-risks-and-mitigation-v1.md) -- demographic accuracy gaps
- `foundation/product/core-principles-v1.md` -- descriptive not diagnostic principle
