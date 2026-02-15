# Comprehensive Project Analysis: Black Swan + NegotiateAI

**Purpose:** MVP Architecture Planning Handoff Document
**Generated:** 2026-01-24

---

## Executive Summary

Two related but architecturally distinct negotiation coaching applications exist:

| Project | Location | Focus | AI Model | Status |
|---------|----------|-------|----------|--------|
| **Black Swan** | `C:\Users\randy\.claude\projects\bLACK SwaN` | Real-time voice coaching | Gemini 2.0 Flash | ~80% complete |
| **NegotiateAI** | `C:\Users\randy\negotiateai` | Psychological profiling + text simulation | Gemini 2.5 Flash | Core features working |

**Key Insight:** These projects have complementary strengths. Black Swan excels at real-time audio processing and skill detection. NegotiateAI excels at psychological assessment and personalized coaching based on volitional blocks.

---

## 1. Architecture Overview

### Black Swan (Voice-First Real-Time Coaching)

```
bLACK SwaN/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx              (Main 3-column layout)
│   │   ├── voice/                     (6 voice coaching components)
│   │   ├── conversation/              (Negotiation practice components)
│   │   └── scenarios/                 (Scenario selection UI)
│   ├── services/
│   │   ├── geminiService.ts           (WebSocket → Gemini 2.0 Flash)
│   │   └── audio/                     (Audio processing pipeline)
│   ├── lib/
│   │   ├── scoreEngine.ts             (Weighted composite scoring)
│   │   ├── coachingLoop.ts            (Real-time feedback engine)
│   │   ├── voiceSkillDetector.ts      (7 skill detection algorithms)
│   │   ├── feedbackBank.ts            (Contextual feedback templates)
│   │   └── personaSwitcher.ts         (Dynamic prompt generation)
│   └── constants/voicePresets.ts      (Target ranges for voice metrics)
├── practice_engine/
│   └── scenarios/                     (17 JSON scenario definitions)
└── backend/                           (WebSocket server - optional)
```

### NegotiateAI (Assessment-First Personalized Coaching)

```
negotiateai/
├── App.tsx                            (Main flow controller)
├── constants.ts                       (26KB - archetypes, prompts, config)
├── types.ts                           (Full TypeScript definitions)
├── components/
│   ├── QuizCard.tsx                   (5-question quick assessment)
│   ├── VolitionalDiagnostic.tsx       (15-question deep diagnostic)
│   ├── ResultsDashboard.tsx           (Archetype + profile display)
│   ├── NegotiationDojo.tsx            (Practice simulation UI)
│   └── StriveDashboard.tsx            (Session scoring display)
├── services/
│   └── geminiService.ts               (Gemini 2.5 Flash integration)
└── utils/
    └── diagnosticCalculations.ts      (Psychological scoring algorithms)
```

---

## 2. Data Flow Comparison

### Black Swan: Real-Time Audio Pipeline

```
Microphone Input
    ↓
AudioContext (16kHz) → MediaStreamAudioSourceNode
    ↓
[Parallel Processing]
├── ScriptProcessor → Float32Array buffer
│   ├── getPitch() - Autocorrelation algorithm
│   ├── getLoudness() - RMS calculation
│   └── estimateTempo() - Silence-based segment detection
│
├── AnalyserNode → FFT Data
│   ├── Breath Support (volume stability)
│   ├── Cadence (mid-range frequency activity)
│   └── Clarity (high-frequency consonant presence)
│
└── Web Speech API → Transcript
    ↓
    [Skill Detection Algorithms]
    ├── detectMirroring()
    ├── detectLabeling()
    ├── detectCalibratedQuestions()
    ├── detectNoOrientedQuestions()
    ├── detectFMDJVoice()
    ├── detectStrategicSilence()
    └── detectTacticalEmpathy()
    ↓
    [Coaching Loop]
    ├── Confidence scoring (0-1)
    ├── Feedback selection (success/partial/miss)
    └── Session score update
    ↓
WebSocket → Gemini 2.0 Flash (Audio I/O)
    ↓
Speaker Output + Live Coaching Feedback
```

### NegotiateAI: Assessment-Driven Pipeline

```
Landing Page → Quick Assessment (5 questions)
    ↓
AI Archetype Classification (generateNegotiationAdvice)
    ↓
Volitional Diagnostic (15 questions across 5 modules)
    ├── Perception: threat sensitivity, power bias
    ├── Motivation: value ranking, risk tolerance
    ├── Intention: scenario pivots, self-efficacy
    ├── Commitment: commitment ladder, contingency
    └── Feedback: post-negotiation behavior
    ↓
[Failure Vector Calculation]
├── Perception Score = (threatSensitivity + powerAppraisalBias) / 2
├── Motivation Score = (ambivalence + (100 - riskTolerance)) / 2
├── Action Score = ((100 - actionCompleteness) + (100 - followThrough)) / 2
└── Feedback Score = (ruminationScore + (100 - learningOrientation)) / 2
    ↓
Primary Block Selection (argmax) → Archetype Assignment
    ↓
Negotiation Dojo (3-panel simulation)
├── Opponent AI: Hiring manager tactics
├── Coach AI: Selective feedback (turns 2, 4, 6 only)
└── User text input → multi-turn conversation
    ↓
Session Scoring (STRIVE metrics)
├── Clarity (0-100)
├── Assertiveness (0-100)
├── Listening (0-100)
└── Anchoring (0-100)
    ↓
Final Report: Highlights + Opportunities
```

---

## 3. Gemini Integration (Verbatim Prompts)

### Black Swan: Real-Time Negotiation Coach

**Setup Message Structure:**
```typescript
{
  setup: {
    model: "models/gemini-2.0-flash-exp",
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    generation_config: {
      response_modalities: ["AUDIO"],
      speech_config: {
        voice_config: {
          prebuilt_voice_config: { voice_name: "Fenrir" }
        }
      }
    }
  }
}
```

**Default System Prompt:**
```
You are BLACK SWAN, a real-time negotiation and persuasion coach.

PERSONA BLEND:
- Chris Voss: 100%
- Jim Camp: 0%
- Jordan Belfort: 0%

DOMINANT STYLE: Chris Voss (Tactical Empathy)

CORE BEHAVIORAL RULES:
1. Voice and tone: Speak like a "late-night FM DJ" - calm, low, slow, controlled
2. Question discipline: Never ask "Why?" - Use "What" and "How" instead
3. Tactical empathy: Separate understanding from agreement
4. Silence: Treat silence as a tool, not a problem
5. Ethics: Train effective negotiators, not manipulators

VOSS TACTICS (Tactical Empathy):
   - LABELING: Use "It seems like...", "It sounds like...", "It looks like..."
   - MIRRORING: Repeat last 1-3 words with upward inflection
   - CALIBRATED QUESTIONS: "How am I supposed to...?", "What's the biggest obstacle...?"
   - FM DJ VOICE: Low, slow, downward inflection
   - SEEK "THAT'S RIGHT": Not "Yes" or "You're right"

COACHING RESPONSIBILITIES:
- During conversation: Give short, surgical suggestions
- After conversation: Provide 0-10 scores for 7 skills
- Output style: Concise, precise, behavior-focused

Your goal: Turn the user into a negotiator who is emotionally precise (Voss),
boundaried and non-needy (Camp), and clear, structured, and convincing (Belfort).
```

**Voice Practice Prompt:**
```
You are a Voice Confidence Coach. You analyze how someone speaks — their pitch,
pace, tone, and word usage.

CORE IDENTITY:
- Tone: Warm, honest, mentor-like. Never robotic.
- Philosophy: "How you say it matters more than what you say."
- Goal: Build vocal authority, clarity, and presence.

WHAT TO DETECT & ANALYZE:
1. Pitch Stability & Range: Are they monotonous or dynamic?
2. Pacing: Too fast (nervous), too slow (boring), or erratic?
3. Tone: Harsh, monotone, nervous, confident, warm, cold?
4. Filler Words: Excessive use of "uh," "um," "like," "you know."
5. Breath & Silence: Do they rush? Do they pause effectively?
6. Vocal Authority: Do they sound sure of themselves?

RESPONSE STRUCTURE:
1. Praise Insight: One specific thing they did well vocally.
2. Coaching Suggestion: One constructive observation on delivery.
3. Quick Drill: One 10-second vocal exercise.
```

---

## 4. Metrics Implementation

### Black Swan: Client-Side Voice Metrics

| Metric | Algorithm | Location | Output |
|--------|-----------|----------|--------|
| **Pitch** | Autocorrelation (Modified Difference) | `PitchDetector.ts` | 50-400 Hz |
| **Loudness** | RMS × 5, capped at 1 | `LoudnessMeter.ts` | 0-1 normalized |
| **Tempo** | Silence-based segment detection | `TempoEstimator.ts` | 0-5 segments/sec |
| **Breath Support** | FFT average / 255 × 400 | `Dashboard.tsx` | 0-100 |
| **Cadence** | Mid-range FFT (85-255 Hz) normalized | `Dashboard.tsx` | 0-100 |
| **Clarity** | High-frequency FFT (>2kHz) normalized | `Dashboard.tsx` | 0-100 |

### Black Swan: Skill Detection Algorithms

**7 Detection Functions (voiceSkillDetector.ts):**

| Skill | Detection Method | Confidence Formula |
|-------|------------------|-------------------|
| **Mirroring** | 1-3 words + upward inflection + "?" | 0.4 (phrase) + 0.4 (inflection) + 0.2 (question) |
| **Labeling** | "It seems/sounds/looks like..." + emotion word | 0.5 (phrase) + 0.3 (downward) + 0.2 (emotion) |
| **Calibrated Qs** | Starts with How/What + avoids Why + is question | 0.5 + 0.3 + 0.2 |
| **No-Oriented Qs** | Patterns: "would it be ridiculous...", "is it impossible..." | 0.7 (pattern) + 0.3 (question) |
| **FM DJ Voice** | Downward inflection + pace < 150 WPM + pitch < 180 Hz | 0.4 + 0.3 + 0.3 |
| **Strategic Silence** | Silence ≥2s | +0.3 (2s), +0.3 (3s), +0.4 (5s+) |
| **Tactical Empathy** | "I understand/get/see..." + no "but" + warm tone | 0.5 + 0.3 + 0.2 |

---

## 5. FillerDetector Implementation

**Location:** `src/core/audio/FillerDetector.ts` + `useFillerDetector.ts`

### Filler Types Detected
```typescript
type FillerType = 'um' | 'uh' | 'like' | 'you-know';
```

### Detection Algorithms

**Um/Uh Detection (80-250ms duration):**
- Spectral centroid < 800 Hz
- Spectral flatness > 0.3 (flat spectrum)
- Distinguishes um (centroid < 500 Hz) vs uh (centroid >= 500 Hz)

**"Like" Detection (150-400ms duration):**
- Spectral centroid 900-1500 Hz (higher pitch)

**"You Know" Detection (300-600ms duration):**
- Energy variance > 0.0001 (varied pattern)
- Spectral flatness < 0.4 (more tonal)

### Configuration Defaults
```typescript
const DEFAULT_CONFIG = {
  minEnergy: 0.005,        // Quiet but voiced
  maxEnergy: 0.03,         // Quieter than normal speech
  minDuration: 80,         // ~80ms minimum for "uh"
  maxDuration: 600,        // ~600ms maximum for "you know"
  umUhThreshold: 0.5,      // Confidence threshold
  likeThreshold: 0.5,      // Confidence threshold
  youKnowMinDuration: 300, // Min for multi-word filler
  enabled: true
};
```

### Metrics Output
```typescript
interface FillerMetrics {
  umCount: number;
  uhCount: number;
  likeCount: number;
  youKnowCount: number;
  totalFillers: number;
  fillerRate: number;      // Fillers per minute
  detections: FillerDetection[];
}
```

---

## 6. Reusable Assets

### From Black Swan

| Asset | File | Purpose |
|-------|------|---------|
| **Skill Detectors** | `voiceSkillDetector.ts` | 7 negotiation technique detectors |
| **Score Engine** | `scoreEngine.ts` | Weighted composite scoring with tiers |
| **Feedback Bank** | `feedbackBank.ts` | 24+ contextual feedback templates |
| **Audio Utils** | `audio-utils.ts` | Base64 ↔ PCM16 encoding |
| **Persona Switcher** | `personaSwitcher.ts` | Dynamic prompt blending |
| **Voice Presets** | `voicePresets.ts` | 5 target range configurations |
| **Coaching Loop** | `coachingLoop.ts` | Real-time feedback engine |
| **Session State** | `sessionState.ts` | Full session tracking |
| **17 Scenarios** | `practice_engine/scenarios/` | JSON scenario definitions |
| **10 Characters** | `data/characters.ts` | Character profiles with relationships |

### From NegotiateAI

| Asset | File | Purpose |
|-------|------|---------|
| **Archetypes** | `constants.ts` | 4 psychological profiles |
| **Volitional Diagnostic** | `VolitionalDiagnostic.tsx` | 15-question assessment |
| **Diagnostic Calculations** | `diagnosticCalculations.ts` | Failure vector algorithms |
| **STRIVE Metrics** | `constants.ts` | 4 negotiation skill definitions |
| **Multi-Agent Prompts** | `constants.ts` | Opponent/Coach/Scorer prompts |

---

## 7. Gaps and TODOs

### Black Swan Gaps

1. **Scorecard Modal Disabled** (Dashboard.tsx:145-159) - Causes navigation issues
2. **Filler Word Detection** - Implemented but not integrated to UI
3. **Voice Activity Detection** - Hook exists but unused
4. **No Transcript Persistence** - Audio processed but transcripts not stored
5. **No Session Replay** - Sessions can't be reviewed after completion
6. **Experimental Model** - Using `gemini-2.0-flash-exp` not production
7. **No WebSocket Reconnection** - Connection failures not handled

### NegotiateAI Gaps

1. **No Git Version Control**
2. **API Key Management** - Hardcoded fallbacks
3. **No Voice Integration** - Text-only
4. **Mock Fallbacks** - All AI functions have hardcoded responses
5. **No Session History**

---

## 8. Dependencies

### Black Swan (package.json)

| Package | Version | Purpose |
|---------|---------|---------|
| `@google/genai` | ^1.31.0 | Gemini AI SDK |
| `react` | ^19.2.0 | UI framework |
| `react-router-dom` | ^7.10.1 | Routing |
| `firebase` | ^12.6.0 | Auth + Firestore |
| `typescript` | ~5.9.3 | Type checking |
| `vite` | ^5.4.11 | Build tool |
| `tailwindcss` | ^3.4.18 | Styling |

---

*This document was generated for MVP architecture planning. Both codebases are production-viable with complementary strengths.*
