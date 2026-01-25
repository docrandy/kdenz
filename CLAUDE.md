# CLAUDE.md - Kdenz Project

**Project:** Kdenz (Voice Practice MVP)
**Type:** Private Beta Voice Coaching Application
**Status:** Pre-development

---

## Project Context

This project builds a voice practice application that helps users discover unconscious speaking habits (filler words, pace) through real-time feedback. The core value proposition is the "holy shit moment" where users become aware of patterns they didn't know they had.

### Working Title
"VoiceLab" for beta (Kdenz positioning deferred to post-PMF validation)

### Design System
"High-Performance Clinical"
- Mode: Light
- Background: #FFFFFF (white)
- Buttons: #000000 (black)
- Accent: #00D4FF (electric teal/cyan)
- Vibe: Peloton energy + Apple Health precision

---

## Source Codebase

Built on Black Swan foundation:
- Source: `C:\Users\randy\.claude\projects\bLACK SwaN`
- Reusing: Audio pipeline, FillerDetector, voice metrics
- Stripping: Scenarios, skill detection, community features

---

## Key Files Reference

### From Black Swan (to reuse)
- `src/core/audio/FillerDetector.ts` - Filler word detection (complete)
- `src/core/audio/useFillerDetector.ts` - React hook for filler detection
- `src/core/audio/AudioEngine.ts` - Audio pipeline
- `src/services/geminiService.ts` - Gemini integration

### Analysis Document
- Full architecture analysis: `C:\Users\randy\.claude\plans\glowing-purring-wombat.md`

---

## Development Rules

1. **MVP Focus**: Only build what's in the locked feature scope
2. **Chrome-Only**: Safari Web Speech API has 90% accuracy drop + critical bugs. Show browser warning for non-Chrome users.
3. **Visual Feedback Required**: Real-time filler gauge + weekly trend chart (research shows 3.5x retention vs plain numbers)
4. **Playback Required**: Audio playback with filler highlighting is core feature (research-validated for behavior change)
5. **Light Diagnostics In Scope**: 3-5 question onboarding from Volitional framework (not deferred)
6. **No Skill Detection**: Mirroring, labeling, etc. deferred to v1.2
7. **No Full NegotiateAI Integration**: Deep psychological profiling deferred to v1.3
8. **No Session History**: Deferred to v1.1
9. **Graceful Degradation**: Any Gemini API error = show local stats only
10. **Hybrid Filler Detection**: Acoustic real-time + transcript reconciliation at session end
11. **Light Mode Only**: No dark mode for beta

---

## Research Validation (2026-01-25)

Evidence from Perplexity research that informs development:

| Finding | Impact on Build |
|---------|-----------------|
| Awareness training alone reduces fillers 80%+ | Core hypothesis validated - playback + real-time feedback is the product |
| Immediate feedback REDUCES anxiety (not increases) | Don't worry about "judgment stress" - feedback helps |
| Safari Web Speech API has 90% accuracy drop | Chrome-only for beta is correct decision |
| Visual feedback = 3.5x retention (Duolingo) | Gauges and charts are mandatory, not nice-to-have |
| Two-phase awareness critical (playback + real-time) | Playback feature is core, not optional |
| ASR-based detection = 95%+ F1, acoustic = 75-85% | Hybrid approach is correct - transcript reconciliation catches acoustic misses |

---

## Deployment

- Platform: Vercel
- Target: Deployed URL for friend/family testers (Chrome users)
- Browser: Chrome-only with warning for Safari/Firefox
- Fallback: Local demo if deployment adds complexity

---

## Inherits From

This project follows workspace-level rules defined in:
`C:\Users\randy\CLAUDE.md`
