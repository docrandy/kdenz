# Phase 03: Session Foundation — Timing, Baseline & First-Run — Context

**Gathered:** 2026-02-04
**Status:** Ready for planning
**Updated:** 2026-02-04 (expanded scope after research audit)

<domain>
## Phase Boundary

Session lifecycle management: first-run consent flow, baseline capture, duration selection, countdown timer, persistent storage, and design system color alignment.

This phase establishes the foundational session data model that Phases 04-06 build on. The baseline architecture must be in place before playback, transcript, and scorecard phases so they can display delta-from-baseline metrics without rework.

**In scope:** Consent modal, baseline session flow, duration picker, countdown bar, auto-stop, manual stop, audio recording capture, localStorage schema, SessionOrb color fix, pace feedback rework.

**Out of scope:** Playback UI (Phase 04), transcript (Phase 05), scorecard/AI summary (Phase 06), audio quality warnings (Phase 07).

</domain>

<decisions>
## Implementation Decisions

### First-run flow (NEW — from research audit)
- First-time users see a consent/disclosure modal before any recording
- Copy sourced from locked foundation doc: `docs/foundation/copy/consent-and-onboarding-copy-v1.md`
- After consent, user enters a fixed 3-minute baseline capture session
- Baseline framing: "Speak on any topic for 3 minutes. We'll measure your typical pace, fillers, and pauses in a relaxed context."
- After baseline, show baseline results: "Here's your starting point. Future sessions compare to this."
- Baseline is NOT user-selectable — it's calibration, not practice

### Baseline storage (NEW — from research audit)
- localStorage schema stores baseline metrics: WPM, filler rate, pause rate, filler count, timestamp
- Session data model includes `is_baseline` flag to distinguish baseline from regular sessions
- This is NOT full session history (deferred to v1.1) — just baseline reference data
- Delta calculation: regular session metrics compared against stored baseline values
- Baseline can be re-recorded (settings option) but defaults to first session

### Duration options (UPDATED)
- Regular sessions: 1min / 2min / 3min / Unlimited
- 30s REMOVED — research shows ~50-80 words is statistically unreliable for filler rate
- 90s REMOVED — awkward middle ground, simplify to clean minute increments
- Unlimited mode: no timer bar, user stops manually via Pause → Stop flow
- Research basis: spaced practice (d=0.6) favors frequent short sessions; 1min is the quick check-in option

### Duration picker placement
- Pre-session screen: after tapping a focus mode on the dashboard, user sees a brief duration selection screen before proceeding to the session page
- This is a separate screen/step in the flow, not inline on the session page
- Should be quick — pick duration and go, not a heavy configuration page
- First-time users skip this (go straight to baseline flow)

### Duration memory
- Pre-select the user's last used duration (stored in localStorage)
- All options remain visible and selectable — it's a default, not a lock-in
- First-time regular session defaults to 2min

### Timer display
- Countdown bar only — visual bar that depletes as time runs out
- Do NOT show digital time numbers (no MM:SS readout)
- Replaces the current progress bar behavior (one element, not two)
- Unlimited mode: no bar at all — remove the top bar entirely for a cleaner look
- Baseline session: show countdown bar for the fixed 3-minute duration

### End-of-session behavior
- Timer expiry = immediate stop + navigate to results page
- Same flow as manual stop — no warning, no audio cue, no countdown alert
- Unified stop path: both manual and auto-stop trigger the same save-and-navigate logic

### Design system alignment (NEW — from research audit)
- SessionOrb color: change from #39FF14 (neon green) to #00C851 (Signal Green) per locked design system
- Pace feedback: REMOVE green→yellow hue shift (violates design principle "no judgment in visuals")
- Pace shown as WPM number/label near the orb instead of color change
- Orb retains volume-reactive brightness (0.7-1.3 range) — this is non-judgmental, just reflects audio input
- Orb states: idle (waveform icon), recording (volume-reactive brightness), paused (dimmed)

### Claude's Discretion
- Audio recording implementation (MediaRecorder setup, storage approach for Phase 04)
- Pre-session screen layout and styling
- Consent modal UI design (content is locked, presentation is flexible)
- Baseline results display layout
- localStorage schema structure details

</decisions>

<specifics>
## Specific Ideas

- Pre-session screen should be quick — pick duration and go, not a heavy configuration page
- Unlimited mode means the existing manual stop flow (Pause → Stop) is the only way to end
- Countdown bar is purely visual — user sees it shrinking but no numbers
- Consent modal copy is locked in foundation docs — do not rewrite, use as-is
- Baseline instructions should feel warm and low-pressure, not clinical
- Consider: "re-record baseline" option in a simple settings menu for users who want to reset

</specifics>

<research_basis>
## Research Backing

Key research findings driving Phase 03 decisions:

| Decision | Research Source | Finding |
|----------|---------------|---------|
| 3-minute baseline | research-gaps-tracker-v1.md | "3-5 minute baseline recording" for reliable calibration |
| Drop 30s option | validation-standards-v1.md | 50-80 words insufficient for stable filler rate calculation |
| 1min/2min/3min options | transfer-of-practice-evidence-v1.md | Spaced practice (d=0.6): frequent short sessions > infrequent long |
| Personal baselining | bias-risks-and-mitigation-v1.md | "Gold standard" — eliminates gender/accent/age comparison bias |
| Consent modal first | consent-and-onboarding-copy-v1.md (Foundation) | Locked copy for what we analyze and don't analyze |
| #00C851 Signal Green | design-system-v1.md (Foundation) | Locked color palette, Signal Green for positive feedback |
| Remove pace hue shift | core-principles-v1.md (Foundation) | Design principle #2: "No judgment in visuals" |
| Baseline-first UX | feature-scope-and-engineering-plan-v1.md | "Session 1: Baseline capture in low-stakes context" |

</research_basis>

<deferred>
## Deferred Ideas

- Full session history storage (v1.1)
- Baseline comparison across multiple sessions (trend lines — Phase 06)
- Re-baseline prompt after N sessions
- Stress inoculation levels (timed pressure — post-MVP)

</deferred>

---

*Phase: 03-duration-controls-timer*
*Context gathered: 2026-02-04*
*Updated: 2026-02-04 — expanded scope after docs/REGISTRY.md research audit*
