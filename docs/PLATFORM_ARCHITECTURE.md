# KDENZ Platform Architecture — Post-Decision Map

**Created:** 2026-02-13
**Based on:** D1-D7 decisions, Platform Plan, existing codebase analysis
**Core identity:** A diagnostic engine that prescribes communication plans through motivational interviewing

---

## What We Have (Proven, Working)

```
LOCAL CODEBASE (v2.0, deployed)
├── Audio Pipeline
│   ├── Mic capture (MediaRecorder API)
│   ├── Web Speech API transcript (Chrome, real-time)
│   ├── FillerDetector (acoustic, real-time)
│   ├── Hybrid filler reconciliation (acoustic + transcript)
│   └── Audio playback with filler markers
├── Voice Practice Modules
│   ├── Filler Words practice (live)
│   ├── Speech Pace practice (live)
│   ├── Labeling practice (built, removed from routes)
│   └── Accusation Audit practice (built, removed from routes)
├── Post-Session
│   ├── Scorecard with metrics
│   ├── AI Summary (Gemini, graceful degradation)
│   ├── Transcript with highlight toggle (fillers/pace)
│   ├── Weekly trend chart
│   └── Audio playback with timeline scrubber
├── Onboarding
│   ├── Welcome screen (3-step guide)
│   ├── Light diagnostics (4 questions, Volitional framework)
│   └── Profile page (decision tree goals, focus areas)
├── Infrastructure
│   ├── Design system (CSS variables, semantic tokens, Tailwind)
│   ├── SessionOrb (animated, volume-responsive)
│   ├── Settings page
│   ├── Privacy page
│   └── Error handling (mic permissions, error boundary)
└── Deployment
    └── Vercel (https://kdenz.vercel.app)
```

---

## What We Need to Build (Platform Plan Scope)

```
KDENZ PLATFORM
├── LAYER 1: Practice Surfaces (User-Facing)
│   │
│   ├── Vocal Performance Lab ← MOSTLY BUILT (filler + pace practice)
│   │   ├── Free practice mode ✅
│   │   ├── Prompted practice ✅
│   │   ├── Real-time filler gauge ✅
│   │   ├── Playback with markers ✅
│   │   ├── Post-session Hume.ai batch analysis ❌ NEEDS BACKEND PROXY
│   │   └── Freeze detection feedback ❌ NEEDS HUME INTEGRATION
│   │
│   ├── Applied Skills Lab ← CODE EXISTS, NEEDS RE-INTEGRATION
│   │   ├── Labeling drills ✅ (in src/features/labeling/, removed from routes)
│   │   ├── Accusation Audit ✅ (in src/features/accusation-audit/, removed from routes)
│   │   ├── Mirroring drills ❌ NOT BUILT
│   │   ├── Calibrated Questions ❌ NOT BUILT
│   │   ├── Tactical Empathy ❌ NOT BUILT
│   │   └── Gemini evaluation of responses ❌ NEEDS PROMPT ENGINEERING
│   │
│   ├── Simulation Studio ← NOT BUILT
│   │   ├── Gemini 2.5 Flash as AI opponent ❌
│   │   ├── Scenario library ❌
│   │   ├── Multi-turn conversation ❌
│   │   ├── Recording + Hume batch analysis ❌
│   │   └── Technique detection in conversation ❌
│   │
│   └── KDENZ Institute ← NOT BUILT
│       └── YouTube unlisted embeds (simple) ❌
│
├── LAYER 2: Diagnostic Engine (Invisible)
│   │
│   ├── VCM (Volitional Chain Model) ← NOT BUILT, MODEL NOT FINALIZED
│   │   ├── 8 gates (expanded from original 4)
│   │   ├── 5-8 root causes per gate
│   │   ├── Fed by: Hume data + drill results + planted questions + keywords
│   │   ├── Implementation: TBD (Python script / custom AI / rule-based)
│   │   └── Data model: NEEDS DESIGN
│   │
│   ├── Hume.ai Batch Analysis ← POC COMPLETE, NOT INTEGRATED
│   │   ├── Prosody analysis ✅ (POC proven)
│   │   ├── Freeze detection ✅ (POC proven)
│   │   ├── Feedback templates ✅ (POC proven)
│   │   ├── Backend proxy ❌ NEEDS BUILDING
│   │   └── Audio format conversion ❌ NEEDS RESEARCH (WebM→WAV?)
│   │
│   └── Adaptive Recommendation Engine ← NOT BUILT
│       ├── 2:1 to 3:1 ratio logic ❌
│       ├── Style testing (subtle vs. explained) ❌
│       ├── Recommendation tracking ❌
│       └── MI-constrained feedback generation ❌
│
├── LAYER 3: Data & Persistence
│   │
│   ├── Current: localStorage only
│   ├── Needed: User profiles, session history, VCM state, recommendations
│   ├── Decision: Supabase vs localStorage (see R6 research)
│   └── Audio storage for Hume batch (see R7 research)
│
└── LAYER 4: Analytics & Insights
    │
    ├── Communication Index ← FORMULA TBD
    ├── Performance trends ← WEEKLY CHART EXISTS
    ├── Session history ← NOT BUILT (deferred in v1, now in scope)
    └── Insights page ← NOT BUILT
```

---

## Build Sequence (Recommended)

Based on decisions and what's proven, here's the suggested build order:

### Phase A: Platform Foundation (Next)
1. **Re-integrate Applied Skills modules** — Labeling and Accusation Audit code exists in `src/features/`, was removed from routes in v2.0 cleanup. Add them back with proper navigation.
2. **Platform navigation** — Sidebar or tab structure for Voice Lab / Skills Lab / Simulation Studio / Institute
3. **Finish Phase 15-16** of v2.0 (new screens for core flow)

### Phase B: Hume.ai Integration
1. **Backend proxy** — Vercel serverless function to call Hume batch API
2. **Audio pipeline** — Send recorded blob to proxy after session ends
3. **Response parsing** — Port POC's `extract_segments()` and `detect_freezes()` to TypeScript
4. **Feedback rendering** — Port POC's `feedback_mapping.py` templates to TypeScript

### Phase C: Simulation Studio (New)
1. **Scenario library** — Define initial scenarios (salary, difficult client, feedback)
2. **Gemini 2.5 Flash integration** — Multi-turn conversation API
3. **Recording during simulation** — Capture user's voice for Hume batch analysis
4. **Technique detection** — Gemini 2.0 Flash evaluates whether user applied techniques

### Phase D: VCM Data Model
1. **Design interfaces** — TypeScript types for gates, root causes, diagnosis results
2. **Extension points** — Architecture that supports both rule-based and AI-driven diagnosis
3. **Stub implementation** — Mock diagnostic that returns plausible results for UI development
4. **Wait for finalized model** — Implement real logic when VCM template is ready

### Phase E: Recommendation Engine
1. **Recommendation data model** — What was shown, accepted, ignored
2. **Ratio logic** — 2:1/3:1 user-aligned to system-diagnosed
3. **Persistence** — Requires Supabase or equivalent (beyond localStorage)
4. **MI-constrained generation** — Gemini generates feedback using action language templates

---

## Architecture Decisions Locked

| Decision | Answer | Source |
|----------|--------|--------|
| Codebase | Local (Vercel), not Lovable | D1 |
| Design | Dark navy + gold (temporary, Framer exploration coming) | D2 |
| Scope | Full platform (Voice + Skills + Simulation + VCM) | D3 |
| Hume.ai | Batch only, for analytics/diagnostics | D4 |
| Real-time speech | Gemini for simulation, Web Speech API for transcript | D4 |
| VCM | Design data model now, implement later when finalized | D5 |
| VCM gates | 8 gates (not 4), 5-8 root causes each | D5 |
| Browser | Chrome-only for now, Deepgram later for cross-browser | D6 |
| Theme | Dark only, defer light to post-Framer | D7 |

---

## Open Items (From D8-D12)

Still need answers for:
- D8: Are existing labeling/accusation audit modules the right UX for Applied Skills Lab?
- D9: Is Simulation Studio a near-term or long-term build?
- D10: KDENZ Institute — simple YouTube embeds or expanded version?
- D11: Communication Index formula
- D12: Recommendation engine — near-term or long-term?

These don't block Phase A but will affect Phases B-E.
