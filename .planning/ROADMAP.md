# Roadmap: VoiceLab (Kdenz)

**Current:** v2.0 - Dark Premium Transformation
**Previous:** v1.0 Private Beta (shipped 2026-02-05)

## Milestones

- **v2.0 Dark Premium** — Phases 11-16 (6 phases, 7 waves, 44 requirements)
- **v1.0 Private Beta** — Phases 01-10 (shipped 2026-02-05, archived)

## Phases

<details open>
<summary>v2.0 Dark Premium Transformation (Phases 11-16) — IN PROGRESS</summary>

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
- [ ] Phase 14: Typography & Layout (Wave 4: Cormorant + Outfit, mobile-first 420px) — 2-3 days
  **Plans:** 4 plans
  Plans:
  - [ ] 14-01-PLAN.md — Typography scale upgrade (Calm-level sizes) + brightness hierarchy + migrate all ~48 files to semantic tokens
  - [ ] 14-02-PLAN.md — Card carousel component + PostSessionResults carousel integration
  - [ ] 14-03-PLAN.md — Layout spacing, immersive recording, Dashboard mobile carousel, warning/nudge fixes
  - [ ] 14-04-PLAN.md — Visual verification checkpoint (browser testing of all typography & layout changes)
- [ ] Phase 15: New Screens — Core Flow (Wave 5: Welcome, Pre-Session, Recording, Post-Session) — 3-4 days
- [ ] Phase 16: New Screens — Advanced (Wave 6: Analysis Loader, Voice Profile, Bridge, Breathing, Before/After) — 3-4 days

**Total:** 6 phases, 44 requirements
**Estimated duration:** 15-20 days
**Deferred:** Phase 17 (Dashboard redesign — v2.1 with UX specialist)

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

### v2.0 Dark Premium Transformation

| Phase | Title | Requirements | Status | Target |
|-------|-------|--------------|--------|--------|
| 11 | Design System Foundation | DS-01 to DS-06 | Complete (2/2 plans) | 2026-02-12 |
| 12 | Color Migration | CM-01 to CM-06 | Complete (7/7 plans) | 2026-02-12 |
| 13 | SessionOrb Redesign | ORB-01 to ORB-07 | Complete (2/2 plans) | 2026-02-12 |
| 14 | Typography & Layout | TYP-01 to TYP-06, LAY-01 to LAY-03 | Planned (4 plans) | 2-3 days |
| 15 | New Screens — Core Flow | SCR-01 to SCR-06 | Pending | 3-4 days |
| 16 | New Screens — Advanced | SCR-07 to SCR-12 | Pending | 3-4 days |

**Coverage:**
- v2.0 requirements: 44 total
- Mapped to phases: 44
- Estimated total duration: 15-20 days

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
*Last updated: 2026-02-12 - Phase 14 planned (4 plans in 3 waves)*
