# VoiceLab (Kdenz MVP)

## What This Is

A private beta voice coaching app that helps users discover unconscious speaking habits — filler words, pace patterns — through real-time visual feedback and audio playback with filler highlighting. Built for Chrome-only, deployed at https://kdenz.vercel.app.

The core value is the "holy shit moment": users see their actual filler count and realize they had no idea. Awareness alone drives 80%+ behavior change (research-validated).

## Core Value

**Users discover unconscious speaking habits they didn't know they had.** Real-time gauges + audio playback with filler highlighting = sustained awareness and behavior change.

## Current State

**Version:** v1.0 Private Beta (shipped 2026-02-05)
**Deployed:** https://kdenz.vercel.app
**Codebase:** 15,049 lines TypeScript/TSX
**Tech Stack:** React 19, Vite, Tailwind CSS, Web Speech API, Gemini API

## Requirements

### Validated

- [x] Real-time filler count gauge (visual SessionOrb) — v1.0
- [x] Weekly trend chart showing progress across sessions — v1.0
- [x] WPM tracking with visual indicator — v1.0
- [x] Audio playback with filler timestamp markers (tap to seek) — v1.0
- [x] Transcript with toggle-able highlights (pace OR fillers) — v1.0
- [x] Session durations (1min/2min/3min/Unlimited) — v1.0
- [x] Post-session scorecard with metrics summary — v1.0
- [x] AI coaching summary (button-triggered, Gemini) — v1.0
- [x] Light diagnostics onboarding (4 questions from Volitional framework) — v1.0
- [x] Chrome browser detection with warning for non-Chrome — v1.0
- [x] Privacy transparency page (/privacy) — v1.0
- [x] In-app feedback button — v1.0
- [x] Silence nudge after 10 seconds — v1.0
- [x] Speaking prompts (6 prompts available) — v1.0
- [x] Personal baseline capture with delta display — v1.0
- [x] Self-assessment before metrics reveal — v1.0
- [x] Implementation intentions after metrics — v1.0
- [x] Mobile-responsive layout — v1.0

### Active

(None — v1.0 complete, awaiting beta feedback for v1.1 priorities)

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
- Reused: AudioEngine, FillerDetector, useFillerDetector, VoiceActivityDetector, geminiService base
- Stripped: scenarios/, skill detectors, personas, community features, conversation components

**Research validation (2026-01-25):**
- Awareness training alone reduces fillers 80%+ (core hypothesis validated)
- Immediate feedback REDUCES anxiety (not increases)
- Visual feedback = 3.5x retention vs plain numbers (Duolingo case study)
- Two-phase awareness (playback + real-time) = most sustained behavior change
- ASR-based detection = 95%+ F1, acoustic-only = 75-85% F1 → hybrid approach

**Research audit (2026-02-04):**
- Cross-referenced 20+ research docs against build plan
- Added personal baselining (gold standard for bias elimination)
- Added self-assessment and implementation intentions (d=0.4-0.5 effect sizes)
- Removed judgment colors per design principle #2

**Competitive gap:** No competitor diagnoses WHY users struggle (root cause). All just give metrics.

## Constraints

- **Browser:** Chrome-only — Safari Web Speech API has 90% accuracy drop + critical bugs
- **AI Model:** Gemini for summaries only, not real-time — latency and cost
- **Persistence:** localStorage only — no Firebase/backend for MVP
- **Deployment:** Vercel — no server-side code required

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Chrome-only | Safari Web Speech API unreliable, no API costs with browser-native | ✓ Good — avoided major bugs |
| Hybrid filler detection | Acoustic real-time + transcript reconciliation for accuracy | ✓ Good — 95%+ F1 achieved |
| Visual gauges over numbers | 3.5x retention per Duolingo research | ✓ Good — SessionOrb implemented |
| Button-triggered AI summary | Avoid latency/cost of auto-generation, graceful degradation | ✓ Good — works with API errors |
| Light diagnostics in MVP | Differentiator from competitors, user has questions ready | ✓ Good — personalized coaching |
| Fork Black Swan | Reuse proven audio pipeline, strip negotiation-specific features | ✓ Good — saved weeks of work |
| Personal baselining | Gold standard for bias elimination (gender/accent/age) | ✓ Good — delta display works |
| Signal Green (#00C851) | Follow locked design system palette | ✓ Good — consistent branding |
| No judgment colors | Core principle #2: no visual judgment | ✓ Good — neutral teal throughout |
| Self-assessment before metrics | Research d=0.4 effect size | ✓ Good — improves metacognition |
| Implementation intentions | Research d=0.5 effect size | ✓ Good — when/then format |
| 1min/2min/3min/Unlimited | 30s dropped (unreliable metrics) | ✓ Good — research-backed |

---
*Last updated: 2026-02-05 after v1.0 milestone*
