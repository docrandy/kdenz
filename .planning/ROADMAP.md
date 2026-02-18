# Roadmap: VoiceLab (Kdenz)

**Current:** v3.0 - Generic Drill Engine
**Previous:** v2.0 Dark Premium Transformation (COMPLETE), v1.0 Private Beta (SHIPPED)

## Milestones

- **v3.0 Generic Drill Engine** — Phases 19-22 (4 phases, 20 requirements)
- **v2.0 Dark Premium** — Phases 11-18 (7 phases, 44 requirements, complete)
- **v1.0 Private Beta** — Phases 01-10 (shipped 2026-02-05, archived)

## Phases

<details open>
<summary>v3.0 Generic Drill Engine (Phases 19-22) — IN PROGRESS</summary>

- [x] Phase 19: Technique Data Foundation — 8 Tier A techniques + scenarios seeded as structured data (2026-02-17)
- [ ] Phase 20: Drill Engine + Scoring — Prompt-Response loop with rules + LLM evaluation and feedback
- [ ] Phase 20.1: AI Practice Sessions & Simulation — Gemini-powered character responses, state object pattern, AI interpretation and improvement feedback (INSERTED)
- [ ] Phase 21: Mastery Tracking — Attempt history, mastery levels, and review scheduling
- [ ] Phase 22: Skills Lab Integration — Browsable technique list, detail view, drill launch, existing drills preserved

**Total:** 4 phases, 20 requirements
**Depth:** Balanced (standard grouping, natural delivery boundaries)

---

### Phase 19: Technique Data Foundation

**Goal:** All 8 Tier A techniques and their drill scenarios exist as structured data that the engine can consume.

**Dependencies:** None (foundation for all subsequent phases)

**Requirements:** TDM-01, TDM-02, TDM-03

**Success Criteria:**
1. Developer can import a techniques array and find all 8 named techniques (Mirroring, Labeling, Open-Ended Questions, I-Statements, No-Oriented Questions, NVC Observation, NVC Feeling, Contrasting) with their full metadata.
2. Each technique has at least 5 drill scenarios, each with a prompt, correct syntax pattern, and a model answer that a reviewer could evaluate against.
3. Each technique record carries supported_formats and primary_format fields, so the engine can route to the correct drill UI without knowing technique specifics.

---

### Phase 20: Drill Engine + Scoring

**Goal:** Users can complete a full Prompt-Response drill cycle — read a scenario, type a response, submit, and receive immediate scored feedback with per-dimension breakdown.

**Dependencies:** Phase 19 (technique + scenario data must exist)

**Requirements:** ENG-01, ENG-02, ENG-03, ENG-04, ENG-05, SCR-01, SCR-02, SCR-03, SCR-04

**Success Criteria:**
1. User can open any of the 8 techniques and start a drill — a scenario prompt appears and a text input accepts a response.
2. The drill UI is identical for all 8 techniques (no hardcoded technique-specific layouts); only the content differs.
3. Each drill round shows a randomly selected scenario from the technique's pool, so repeated practice within a session yields different prompts.
4. After submitting a response, user sees a feedback card with scores for Form, Accuracy, and Impact (as numbers and labels) plus a text explanation of what worked and what to improve.
5. When LLM is unavailable, user still sees a Form score and a clear message that Accuracy/Impact scoring is pending — the session is not blocked.
6. User can advance from the feedback card to a new scenario without leaving the drill context.

---

### Phase 20.1: AI Practice Sessions & Simulation (INSERTED)

**Goal:** Full AI-powered practice sessions — multi-turn conversations with richer opponent modeling, AI interpretation of technique quality as a conversational judge (not just a scorer), per-exchange improvement coaching, and a session-level debrief identifying patterns and growth edges.

**Depends on:** Phase 20 (ConversationalDrill with Gemini character responses must exist; Phase 20.1 extends the AI capabilities further)

**Plans:** 4 plans

Plans:
- [ ] 20.1-01-PLAN.md — Extended state object + pattern detection (Gemini Call 2) + Panel B enhancement
- [ ] 20.1-02-PLAN.md — Aspiration setting UX + 7 voice archetypes + localStorage persistence
- [ ] 20.1-03-PLAN.md — Institute content schema + 10 seed items + routing algorithm + learner profile
- [ ] 20.1-04-PLAN.md — Session debrief (Gemini Call 3 + 5-card DebriefCardStack + wire to session end)

**Details:**
Extends Phase 20's biofeedback foundation into full simulation + self-identification capability:

**Richer opponent modeling:**
- State object: `{ mood, trust_level, concessions, revelation_stage, last_tactic_detected }` — opponent evolves across the full session arc
- Difficulty progression: opponent starts cooperative, escalates toward resistant/deceptive as user advances

**Self-identification engine (the missing piece):**
- Across a session, the AI tracks the user's communication PATTERNS — not just scores
- Pattern categories: Surface Reader, Avoider, Intellectualizer, Hedger, Rusher, Presumptuous, Accurate but Cold
- After the session: "Here's what you do — your default pattern as a communicator right now"
- Not diagnosis, not judgment — observation: "In 7 of 10 exchanges you stopped at surface pain.
  You're not missing the depth — you're not looking for it yet."
- This self-identification is what makes a personalized plan possible: user knows WHAT they are,
  platform prescribes practice for THAT specific gap

**The aspiration gap (FM DJ to current voice):**
- Users set an aspirational communication identity (warm authority, calm confidence, magnetic presence)
- Session debrief shows the gap between aspiration and what their patterns actually signal
- Gives them a concrete target: "Your labels are accurate. Your delivery says you're asking permission.
  The gap is tone, not perception."

**Session debrief:**
- Pattern map: receiving channel (what % hit underlying vs. identity vs. surface) + sending channel (tone, hedging, confidence signals)
- Pattern name for this session — the label they can use to guide their own practice
- One concrete next drill recommended based on their specific pattern

**Scenario library:**
- Longer-arc scenarios designed for 10-exchange sessions (not single-exchange drills)
- Opponent has a full emotional arc: guarded → resistant → opening → trust

---

### Phase 21: Mastery Tracking

**Goal:** Users can see how well they know each technique and the system surfaces which techniques need practice soonest.

**Dependencies:** Phase 20 (attempts must be generated and stored to track mastery)

**Requirements:** MAS-01, MAS-02, MAS-03, MAS-04

**Success Criteria:**
1. After completing drill attempts, the mastery level badge for that technique updates — user can watch it move from Not Started through Attempted, Familiar, Proficient to Mastered as scores accumulate.
2. Each technique shows a total attempt count and current consecutive-correct streak, visible to the user.
3. After practice, the technique shows a "next review" date derived from its skill_type interval table (syntax, judgment, or recognition cadence).
4. The Skills Lab surface highlights techniques whose review date has passed, so the user sees a distinct visual cue on overdue techniques without any manual tracking.

---

### Phase 22: Skills Lab Integration

**Goal:** Users can browse all 8 techniques, inspect their progress on each, launch drills directly, and still access the existing labeling and accusation audit drills.

**Dependencies:** Phases 19-21 (data, drill engine, and mastery must all exist before the UI layer is meaningful)

**Requirements:** INT-01, INT-02, INT-03, INT-04

**Success Criteria:**
1. The Skills Lab page shows all 8 seeded techniques in a list or grid, each displaying its mastery level indicator and how many times the user has practiced it.
2. Tapping any technique opens a detail view showing the technique's description, its syntax template, current mastery stats, and recent attempt history.
3. From the technique detail view, user can tap a button to launch a Prompt-Response drill for that technique — the drill engine opens with the correct technique loaded.
4. The existing Labeling and Accusation Audit drills remain reachable from Skills Lab alongside the engine-driven techniques — no regression in existing drill access.

</details>

<details>
<summary>v2.0 Dark Premium Transformation (Phases 11-18) — COMPLETE</summary>

- [x] Phase 11: Design System Foundation (Wave 1: Design tokens, Tailwind, CSS variables) — 2026-02-12
  **Plans:** 2/2 complete
  Plans:
  - [x] 11-01-PLAN.md — @fontsource fonts, primitive CSS vars (18 colors + shadows), semantic Tailwind tokens
  - [x] 11-02-PLAN.md — Typography scale, component base classes (buttons, cards, inputs, badges), utility extensions
- [x] Phase 12: Color Migration (Wave 2: ~57 files, teal → gold, white → dark navy) — 2026-02-12
  **Plans:** 7/7 complete
  Plans:
  - [x] 12-01-PLAN.md — App shell + core infrastructure (5 files)
  - [x] 12-02-PLAN.md — Practice session + audio components (9 files)
  - [x] 12-03-PLAN.md — Feedback, metrics & transcript components (9 files)
  - [x] 12-04-PLAN.md — Onboarding, modals, settings components + types (14 files)
  - [x] 12-05-PLAN.md — All pages (12 files)
  - [x] 12-06-PLAN.md — All features (13 files)
  - [x] 12-07-PLAN.md — Clinical palette removal + build verification + visual checkpoint
- [x] Phase 13: SessionOrb Redesign (Wave 3: Gold gradient, 3 animated rings, volume-responsive) — 2026-02-12
  **Plans:** 2/2 complete
  Plans:
  - [x] 13-01-PLAN.md — Gold gradient body, 3 SVG animated rings, volume responsiveness, state transitions, responsive sizing
  - [x] 13-02-PLAN.md — Visual verification checkpoint (browser testing of all ORB requirements)
- [x] Phase 14: Typography & Layout (Wave 4: Cormorant + Outfit, mobile-first 420px) — 2026-02-12
  **Plans:** 4/4 complete
  Plans:
  - [x] 14-01-PLAN.md — Typography scale upgrade (Calm-level sizes) + brightness hierarchy + migrate all ~48 files to semantic tokens
  - [x] 14-02-PLAN.md — Card carousel component + PostSessionResults carousel integration
  - [x] 14-03-PLAN.md — Layout spacing, immersive recording, Dashboard mobile carousel, warning/nudge fixes
  - [x] 14-04-PLAN.md — Visual verification checkpoint (browser testing of all typography & layout changes)
- [x] Phase 15: New Screens — Core Flow (Wave 5: Welcome, Pre-Session, Recording, Post-Session) — 2026-02-14
  **Plans:** 7/7 complete (including gap closure)
  Plans:
  - [x] 15-01-PLAN.md — Navigation framework: AppHeader (hamburger/back/profile), SlideTransition, layout shell
  - [x] 15-02-PLAN.md — Welcome screen: immersive hero with animated SessionOrb + inline profile setup
  - [x] 15-03-PLAN.md — Pre-Session screen: technique briefing card + free practice mode
  - [x] 15-04-PLAN.md — Recording screen: 3-sec countdown, stop-only controls, metrics strip
  - [x] 15-05-PLAN.md — Post-Session screen: 3-tab segmented control (Coaching, Analytics, Transcript)
- [x] Phase 16: New Screens — Advanced (Wave 6: Analysis Loader, Voice Profile, Practice Bridge, Breathing) — 2026-02-14
  **Plans:** 5/5 complete
  Plans:
  - [x] 16-01-PLAN.md — Analysis Loader: animated concentric rings, step indicators, 3-second minimum
  - [x] 16-02-PLAN.md — Voice Profile: stat cards with trends, Before/After comparison component
  - [x] 16-03-PLAN.md — Practice Bridge: performance-aware suggestions, skippable interstitial
  - [x] 16-04-PLAN.md — Breathing Screen: box breathing (4-4-4-4), animated circle, pie chart (60/40)
  - [x] 16-05-PLAN.md — Integration: menu updates, route registration, SlideTransition depths, cross-screen links
- [x] Phase 17: v2.0 Final Verification — 2026-02-14
  **Plans:** 1/1 complete
  Plans:
  - [x] 17-01-PLAN.md — Comprehensive verification: build, routes, design system, navigation flows, screens, regression check

**Total:** 7 phases (6 implementation + 1 verification), 44 requirements
**Completed:** 2026-02-14
**Deferred:** Dashboard redesign — v2.1 with UX specialist

</details>

<details>
<summary>v1.0 Private Beta (Phases 01-10) — SHIPPED 2026-02-05</summary>

- [x] Phase 01: Project Setup & Scaffolding (2/2 plans) — 2026-01-25
- [x] Phase 02: Audio Pipeline & Visual Gauge (3/3 plans) — 2026-02-03
- [x] Phase 03: Session Foundation — Timing, Baseline & First-Run (4/4 plans) — 2026-02-04
- [x] Phase 04: Playback with Filler Highlighting (2/2 plans) — 2026-02-04
- [x] Phase 05: Transcript with Highlights (3/3 plans) — 2026-02-05
- [x] Phase 06: Scorecard & AI Summary (3/3 plans) — 2026-02-05
- [x] Phase 07: Polish & Error Handling (5/5 plans) — 2026-02-05
- [x] Phase 08: Deployment & Beta Prep (2/2 plans) — 2026-02-05
- [x] Phase 09: Light Diagnostics (2/2 plans) — 2026-02-05
- [x] Phase 10: Privacy & Prompts (1/1 plan) — 2026-02-05

**Total:** 10 phases, 27 plans
**Deployed:** https://kdenz.vercel.app
**Archive:** [milestones/v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

</details>

## Progress

### v3.0 Generic Drill Engine

| Phase | Title | Requirements | Status |
|-------|-------|--------------|--------|
| 19 | Technique Data Foundation | TDM-01, TDM-02, TDM-03 | Pending |
| 20 | Drill Engine + Scoring | ENG-01 to ENG-05, SCR-01 to SCR-04 | Pending |
| 20.1 | AI Practice Sessions & Simulation | SIM-01 to SIM-07, ASP-01 to ASP-07, INST-01 to INST-07, DEB-01 to DEB-10 | Pending (INSERTED) |
| 21 | Mastery Tracking | MAS-01 to MAS-04 | Pending |
| 22 | Skills Lab Integration | INT-01 to INT-04 | Pending |

**Coverage:**
- v3.0 requirements: 20 defined + 31 Phase 20.1 requirements
- Mapped to phases: 51/51
- Unmapped: 0

---

### v2.0 Dark Premium Transformation (COMPLETE)

| Phase | Title | Requirements | Status | Completed |
|-------|-------|--------------|--------|-----------|
| 11 | Design System Foundation | DS-01 to DS-06 | Complete (2/2 plans) | 2026-02-12 |
| 12 | Color Migration | CM-01 to CM-06 | Complete (7/7 plans) | 2026-02-12 |
| 13 | SessionOrb Redesign | ORB-01 to ORB-07 | Complete (2/2 plans) | 2026-02-12 |
| 14 | Typography & Layout | TYP-01 to TYP-06, LAY-01 to LAY-03 | Complete (4/4 plans) | 2026-02-12 |
| 15 | New Screens — Core Flow | SCR-01 to SCR-06 | Complete (7/7 plans, gaps closed) | 2026-02-14 |
| 16 | New Screens — Advanced | SCR-07 to SCR-12 | Complete (5/5 plans) | 2026-02-14 |
| 17 | v2.0 Final Verification | — | Complete (1/1 plan) | 2026-02-14 |

---

### v1.0 Private Beta (Archived)

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 01. Project Setup | v1.0 | 2/2 | Complete | 2026-01-25 |
| 02. Audio Pipeline | v1.0 | 3/3 | Complete | 2026-02-03 |
| 03. Session Foundation | v1.0 | 4/4 | Complete | 2026-02-04 |
| 04. Playback | v1.0 | 2/2 | Complete | 2026-02-04 |
| 05. Transcript | v1.0 | 3/3 | Complete | 2026-02-05 |
| 06. Scorecard | v1.0 | 3/3 | Complete | 2026-02-05 |
| 07. Polish | v1.0 | 5/5 | Complete | 2026-02-05 |
| 08. Deployment | v1.0 | 2/2 | Complete | 2026-02-05 |
| 09. Diagnostics | v1.0 | 2/2 | Complete | 2026-02-05 |
| 10. Privacy & Prompts | v1.0 | 1/1 | Complete | 2026-02-05 |

---
*Roadmap created: 2026-01-25*
*Last updated: 2026-02-17 - v3.0 Generic Drill Engine roadmap added (Phases 19-22, 20 requirements)*
*2026-02-18 - Phase 20.1 inserted (AI Practice Sessions & Simulation — Gemini-powered character responses, AI interpretation and coaching)*
*2026-02-18 - Phase 20.1 planned: 4 plans in 2 waves (pattern detection, aspiration, institute routing, session debrief)*
