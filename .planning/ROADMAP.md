# Roadmap: VoiceLab (Kdenz MVP)

**Created:** 2026-01-25
**Timeline:** 2.5 week sprint (~17 days)
**Target:** Private beta with 5-10 testers

## Phases

### Phase 01: Project Setup & Scaffolding ✓

**Status:** Complete (2026-01-25)

**Goal:** Deployable shell with design system and browser detection

**Requirements:** UI-01, UI-02, PLAT-01, PLAT-02, PLAT-03

**Plans:** 2/2 complete

Plans:
- [x] 01-01-PLAN.md - Initialize project with Vite/React/Tailwind and High-Performance Clinical theme
- [x] 01-02-PLAN.md - Add Chrome browser detection and deploy to Vercel

**Deployed:** https://kdenz-sandbox.vercel.app

**Success Criteria:**
- [x] Project folder created (fork from Black Swan or new)
- [x] Unused components stripped from Dashboard
- [x] Tailwind config has High-Performance Clinical theme
- [x] PracticeSession.tsx component shell exists
- [x] Chrome detection + non-Chrome warning displays
- [x] Vercel project deployed with placeholder

---

### Phase 02: Audio Pipeline & Visual Gauge

**Goal:** Focus-mode session experience with neon green SessionOrb, real-time feedback, and post-session results page

**Requirements:** AUDIO-01, AUDIO-02, AUDIO-03, FILLER-01, VIZ-01, VIZ-02, AUDIO-04

**Status:** Complete (2026-02-03) — 3/3 plans done

**Plans:** 3/3 complete

Plans:
- [x] 02-01-PLAN.md -- SessionOrb + WaveformVisualizer standalone components
- [x] 02-02-PLAN.md -- Focus-mode session page refactor + BottomControlBar
- [x] 02-03-PLAN.md -- Post-session results page + silence nudge update + end-to-end checkpoint

**Previous plans (REJECTED at checkpoint 2026-02-03):**
- ~~02-01-PLAN.md -- PlasmaOrb (rejected: teal plasma → neon green circle + icon)~~
- ~~02-02-PLAN.md -- Orb-centric layout (rejected: flanking metrics → focus-mode layouts)~~
- ~~02-03-PLAN.md -- Silence nudge + progress bar (not executed, superseded)~~

**Success Criteria (updated per CONTEXT.md v2):**
- [x] SessionOrb renders as neon green circle with icon (waveform bars idle, red stop recording)
- [x] SessionOrb brightness tracks voice volume during recording
- [x] SessionOrb color shifts green → yellow for pace feedback
- [x] Filler mode: orb + filler count below (no flanking metrics)
- [x] Pace mode: orb with color feedback + waveform visualization below
- [x] Bottom control bar: Pause → Stop/Continue two-step pattern
- [x] Silence detection triggers one-and-done nudge after 10s (coach tone)
- [x] Progress bar at top during session
- [x] Post-session results on separate page/route
- [x] Dashboard offers focus mode selection (filler words / speech pace)
- [x] Weekly trend chart deferred to Phase 06

---

### Phase 03: Session Foundation — Timing, Baseline & First-Run ✓

**Goal:** Complete session lifecycle: first-run consent/baseline flow, duration selection, countdown timer, persistent baseline storage, and design system color alignment

**Status:** Complete (2026-02-04)

**Requirements:** SESS-01, SESS-02, SESS-03, SESS-04, BASE-01, BASE-02, CONSENT-01, DESIGN-01

**Plans:** 4/4 complete

Plans:
- [x] 03-01-PLAN.md — Design system color alignment (Signal Green) + session data model + baseline storage service
- [x] 03-02-PLAN.md — Consent/disclosure modal with locked foundation copy + first-run gating
- [x] 03-03-PLAN.md — Pre-session duration picker + countdown bar + dynamic timer + Unlimited mode
- [x] 03-04-PLAN.md — Baseline session flow + baseline results + PostSessionResults delta display + end-to-end checkpoint

**Success Criteria:**
- [x] First-run consent/disclosure modal gates first recording (copy from foundation docs)
- [x] First session is a fixed 3-minute baseline capture with onboarding instructions
- [x] Baseline metrics stored in localStorage (WPM, filler rate, pause rate, timestamp)
- [x] Duration selection UI (1min / 2min / 3min / Unlimited) for regular sessions
- [x] Countdown bar displays correctly (visual bar only, no digital numbers)
- [x] Session auto-stops at duration end
- [x] Manual stop button works
- [x] Audio recording captured for playback
- [x] Last-used duration remembered (localStorage)
- [x] SessionOrb color updated to Signal Green (#00C851) per locked design system
- [x] Pace hue shift (green→yellow) removed; pace shown as number/label instead
- [x] Session data model distinguishes baseline vs regular sessions

---

### Phase 04: Playback with Filler Highlighting ✓

**Goal:** Audio playback with visual filler markers on the post-session results page

**Status:** Complete (2026-02-04)

**Requirements:** PLAY-01, PLAY-02, PLAY-03, PLAY-04, FILLER-03

**Plans:** 2/2 complete

Plans:
- [x] 04-01-PLAN.md — Wire audio blob to session storage + AudioPlayback component with play/pause/seek
- [x] 04-02-PLAN.md — Filler markers on timeline + tap-to-seek + speed controls (0.75x, 1x, 1.25x)

**Success Criteria:**
- [x] Audio playback controls (play/pause/seek)
- [x] Filler timestamps synced to audio timeline
- [x] Visual markers on playback timeline at filler locations
- [x] Tap filler marker jumps to that moment
- [x] Playback speed controls (0.75x, 1x, 1.25x)

---

### Phase 05: Transcript with Highlights ✓

**Goal:** Transcript display with toggle-able highlighting on Evaluation page

**Status:** Complete (2026-02-05)

**Requirements:** TRANS-01, TRANS-02, TRANS-03, TRANS-04, FILLER-02, FILLER-04

**Plans:** 3/3 complete

Plans:
- [x] 05-01-PLAN.md — Wire hybrid filler reconciliation + store to sessionStorage
- [x] 05-02-PLAN.md — EvaluationPage with TranscriptView + HighlightToggle
- [x] 05-03-PLAN.md — Filler type distinction with neutral color (design principle alignment)

**Success Criteria:**
- [x] Transcript captured via Web Speech API (Chrome)
- [x] Hybrid filler detection: acoustic + transcript reconciliation
- [x] Transcript segments stored with timestamps
- [x] Toggle between pace OR filler highlight views
- [x] Transcript display styled per design system
- [x] Filler types distinguished (um, uh, like, you know)

---

### Phase 06: Scorecard & AI Summary ✓

**Status:** Complete (2026-02-05)

**Goal:** Post-session results with baseline comparison, self-reflection, implementation intentions, and optional AI insights

**Requirements:** VIZ-03, VIZ-04, AI-01, AI-02, AI-03, REFLECT-01, TRANSFER-01

**Plans:** 3/3 complete

Plans:
- [x] 06-01-PLAN.md — Self-assessment and implementation intention prompts (research-backed d=0.4-0.5)
- [x] 06-02-PLAN.md — MetricCard composition with baseline deltas and uncertainty
- [x] 06-03-PLAN.md — Weekly trend chart with neutral colors + AI summary with graceful degradation

**Success Criteria:**
- [x] Self-assessment prompt before data reveal ("How do you think that went?")
- [x] Post-session Scorecard component displays
- [x] Metrics show as delta from baseline (e.g., "Filler rate: 6% (+2% from baseline)")
- [x] Confidence intervals / uncertainty shown on each metric (per core principle #3)
- [x] Weekly trend chart populated with session data
- [x] Implementation intention prompt post-scorecard ("When I notice a filler, I will ___")
- [x] Generate AI Summary button works
- [x] Gemini integration returns coaching insights
- [x] API error falls back to local stats only

---

### Phase 07: Polish & Error Handling

**Goal:** Production-ready UX with error states, audio quality warnings, and copy compliance

**Requirements:** UI-03, PAGE-02, QUALITY-01, COPY-01

**Status:** Planned (2026-02-05)

**Plans:** 5 plans

Plans:
- [ ] 07-01-PLAN.md — Audio quality monitoring (noise/clipping detection) with foundation copy warnings
- [ ] 07-02-PLAN.md — Transcript confidence indicator with uncertainty display
- [ ] 07-03-PLAN.md — Copy-lint script for language boundary enforcement
- [ ] 07-04-PLAN.md — Mobile responsive polish (Chrome mobile usability)
- [ ] 07-05-PLAN.md — Feedback button enhancement + loading states + end-to-end verification

**Success Criteria:**
- [ ] Mic permission error handling works
- [ ] Audio quality monitoring: noise/clipping detection with warning messages (copy from foundation docs)
- [ ] Transcript confidence indicator shown before downstream metrics
- [ ] Copy-lint check: all UI strings validated against locked language boundaries
- [ ] Full session flow tested end-to-end
- [ ] UI transitions and loading states polished
- [ ] Mobile layout usable (Chrome mobile)
- [ ] In-app feedback button opens email/form

---

### Phase 08: Deployment & Beta Prep

**Goal:** Live URL ready for testers

**Requirements:** PLAT-03

**Success Criteria:**
- [ ] Final Vercel deploy successful
- [ ] Tested on Chrome desktop + Chrome mobile
- [ ] Non-Chrome browser warning displays correctly
- [ ] Simple onboarding/instructions created
- [ ] Sent to 5-10 testers

---

### Phase 09: Light Diagnostics (Parallel)

**Goal:** Onboarding diagnostic that differentiates from competitors

**Requirements:** DIAG-01, DIAG-02, DIAG-03

**Success Criteria:**
- [ ] 3-5 questions selected from Volitional Diagnostic framework
- [ ] Onboarding diagnostic UI component created
- [ ] Diagnostic results stored locally
- [ ] Results passed to AI summary context

---

### Phase 10: Privacy & Prompts (Parallel)

**Goal:** Trust-building content pages

**Requirements:** PAGE-01, PAGE-03

**Success Criteria:**
- [ ] /privacy page created with transparency content
- [ ] Explains: no emotion detection, local processing, what Gemini sees
- [ ] 1-2 speaking prompts adapted from Black Swan
- [ ] Prompt selection UI before session start

---

## Phase Summary

| Phase | Name | Requirements | Status |
|-------|------|--------------|--------|
| 01 | Project Setup & Scaffolding | 5 | Complete |
| 02 | Audio Pipeline & Visual Gauge | 7 | Complete |
| 03 | Session Foundation — Timing, Baseline & First-Run | 8 | Complete |
| 04 | Playback with Filler Highlighting | 5 | Complete |
| 05 | Transcript with Highlights | 6 | Complete |
| 06 | Scorecard & AI Summary | 9 | Complete |
| 07 | Polish & Error Handling | 4 | Planned (5 plans) |
| 08 | Deployment & Beta Prep | 1 | Pending |
| 09 | Light Diagnostics (Parallel) | 3 | Pending |
| 10 | Privacy & Prompts (Parallel) | 2 | Pending |

**Total phases:** 10
**Total requirements mapped:** 41 (some requirements appear in multiple phases)
**Parallel tracks:** Phases 09-10 can run alongside main development

---
*Roadmap created: 2026-01-25*
*Last updated: 2026-02-05 - Phase 07 planned (5 plans in 2 waves)*
