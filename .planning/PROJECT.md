# VoiceLab (Kdenz MVP)

## What This Is

A private beta voice coaching app that helps users discover unconscious speaking habits — filler words, pace patterns — through real-time visual feedback and audio playback. Built for Chrome-only, targeting 5-10 friends/family testers.

The core value is the "holy shit moment": users see their actual filler count and realize they had no idea. Awareness alone drives 80%+ behavior change (research-validated).

## Core Value

**Users discover unconscious speaking habits they didn't know they had.** Real-time gauges + audio playback with filler highlighting = sustained awareness and behavior change.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Real-time filler count gauge (visual, Peloton-style)
- [ ] Weekly trend chart showing progress across sessions
- [ ] WPM tracking with visual indicator
- [ ] Audio playback with filler timestamp markers (tap to seek)
- [ ] Transcript with toggle-able highlights (pace OR fillers)
- [ ] Session durations (30s/60s/90s+)
- [ ] Post-session scorecard with metrics summary
- [ ] AI coaching summary (button-triggered, Gemini)
- [ ] Light diagnostics onboarding (3-5 questions from Volitional framework)
- [ ] Chrome browser detection with warning for non-Chrome
- [ ] Privacy transparency page (/privacy)
- [ ] In-app feedback button
- [ ] Silence nudge after 10 seconds
- [ ] 1-2 optional speaking prompts

### Out of Scope

- Session history — v1.1 (adds complexity, not core to awareness moment)
- User accounts/auth — not needed for private beta
- Streak counter/badges — v1.1 gamification layer
- Skill detection (mirroring, labeling) — v1.2 (not core to filler awareness)
- Real-time AI coaching during session — v2 (latency + cost concerns)
- Full psychological profiling — v1.3 NegotiateAI integration
- Safari/Firefox support — Safari Web Speech API has 90% accuracy drop
- Dark mode — single theme for beta simplicity
- PDF/export features — not needed for awareness validation

## Context

**Source codebase:** Black Swan (`C:\Users\randy\.claude\projects\bLACK SwaN`)
- Reusing: AudioEngine, FillerDetector, useFillerDetector, VoiceActivityDetector, geminiService base
- Stripping: scenarios/, skill detectors, personas, community features, conversation components

**Research validation (2026-01-25):**
- Awareness training alone reduces fillers 80%+ (core hypothesis validated)
- Immediate feedback REDUCES anxiety (not increases)
- Visual feedback = 3.5x retention vs plain numbers (Duolingo case study)
- Two-phase awareness (playback + real-time) = most sustained behavior change
- ASR-based detection = 95%+ F1, acoustic-only = 75-85% F1 → hybrid approach

**Competitive gap:** No competitor diagnoses WHY users struggle (root cause). All just give metrics.

## Constraints

- **Browser:** Chrome-only — Safari Web Speech API has 90% accuracy drop + critical bugs
- **AI Model:** Gemini for summaries only, not real-time — latency and cost
- **Persistence:** localStorage only — no Firebase/backend for MVP
- **Deployment:** Vercel — no server-side code required
- **Timeline:** 2.5 week sprint (17 days) — beta-ready for testers

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Chrome-only | Safari Web Speech API unreliable, no API costs with browser-native | — Pending |
| Hybrid filler detection | Acoustic real-time + transcript reconciliation for accuracy | — Pending |
| Visual gauges over numbers | 3.5x retention per Duolingo research | — Pending |
| Button-triggered AI summary | Avoid latency/cost of auto-generation, graceful degradation | — Pending |
| Light diagnostics in MVP | Differentiator from competitors, user has questions ready | — Pending |
| Fork Black Swan | Reuse proven audio pipeline, strip negotiation-specific features | — Pending |

---
*Last updated: 2026-01-25 after GSD initialization (migrated from PRD.json)*
