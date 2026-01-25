# kdenz

## What This Is

A Chrome-only speech practice web app that helps users reduce filler words (um/uh) and improve speaking pace. Records mic audio, detects filled pauses in real-time, displays a glanceable heat gauge, and provides playback with timeline markers and session statistics. Built for personal use first, then small beta testers.

## Core Value

Users can see exactly when and how often they say "um/uh" so they can consciously reduce filler words while speaking.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Record mic audio in browser with start/stop controls
- [ ] Detect voice activity using vendored VAD from Black Swan
- [ ] Detect filled pauses (um/uh) using vendored FillerDetector
- [ ] Show real-time filler heat gauge (fillers/min over 15-30s rolling window)
- [ ] Pulse the gauge briefly on each detected filler
- [ ] Display running WPM with banding (slow/normal/fast)
- [ ] Track unfilled pauses; show silence nudge after >2.0s continuous silence
- [ ] Provide playback with seekable timeline and filler markers
- [ ] Show session summary: total fillers, fillers/min, avg WPM, longest pause, pauses >2s, speaking/silence ratio
- [ ] Block core functionality on non-Chrome browsers with global warning
- [ ] Deploy to Vercel from GitHub

### Out of Scope

- Negotiation scenarios, persona switcher, skill detectors — not relevant to speech practice
- User accounts / authentication — localStorage only for MVP
- Firebase or any backend database — keep it client-side
- Lexical fillers (like, you know, so, basically) — post-MVP via ASR transcript
- Pixel-perfect UI polish — functional clarity is priority
- Non-Chrome browser support — Chrome-only beta

## Context

**Source code to vendor:**
- AudioEngine, VoiceActivityDetector (VAD), FillerDetector from `C:\Users\randy\.claude\projects\bLACK SwaN`
- Copy/vendor directly into kdenz (no cross-project dependency)

**Filler detection (MVP):**
- Filled pauses only: "uh", "um" (optionally "er", "ah" if already supported)
- Lexical fillers deferred to post-MVP

**Silence nudge behavior:**
- Track unfilled pauses separately from filled pauses
- Threshold: >2.0s continuous silence (configurable)
- Visual nudge only (no sound), subtle, with timer
- Don't punish intentional rhetorical pauses

**Real-time gauges:**
- Filler heat gauge: rolling window (15-30s), pulses on detection
- Optional: small running total + "clean streak" timer
- Keep primary signal glanceable — user is speaking, can't stare at UI

**Session summary stats:**
- Total um/uh count
- Fillers per minute
- Average WPM with banding
- Longest pause duration
- Count of pauses >2.0s
- Speaking vs silence ratio
- Timeline with filler markers (seekable)

**UI theme:**
- Peloton-style dark performance UI (dark canvas, high-contrast text, bold accent)
- Optimized for glanceable real-time coaching
- Functional clarity over polish

**Design Tokens:**
- Canvas: #0D0D0D | Surface: #1A1A1A | Surface Elevated: #262626
- Text: #FFFFFF / #A3A3A3 | Accent: #FF5F00 or #00D4FF
- Success: #22C55E | Warning: #FBBF24 | Error: #EF4444

## Constraints

- **Browser:** Chrome-only (WebRTC/MediaRecorder APIs) — show warning and block on other browsers
- **Deployment:** Vercel from GitHub
- **Storage:** localStorage only, no backend
- **Timeline:** Week 1 MVP

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Vendor Black Swan modules | Avoid cross-project dependency, keep kdenz self-contained | — Pending |
| Chrome-only | Simplifies audio API surface, acceptable for beta | — Pending |
| No auth/accounts | Reduces scope, localStorage sufficient for personal use | — Pending |
| Filled pauses only for MVP | Simpler detection, lexical fillers need ASR | — Pending |

---
*Last updated: 2025-01-25 after initialization*
