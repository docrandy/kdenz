# Project State: VoiceLab

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Users practice negotiation and difficult conversation techniques through data-driven drills and real-time feedback
**Current focus:** v3.0 Generic Drill Engine — Phase 20: Drill Engine + Scoring

## Current State

**Status:** Phase 19 complete — ready for Phase 20
**Version:** v3.0 Generic Drill Engine
**Previous:** v2.0 Dark Premium Transformation (COMPLETE), v1.0 shipped 2026-02-05
**Deployed:** https://kdenz.vercel.app (v2.0 + 5-pillar navigation active)
**Last Action:** 2026-02-17 - Phase 19 complete (technique data foundation — 4 files, 8 techniques, 40 scenarios)

**Progress:** [█--------------------] 25% (1/4 phases complete)

## Milestone Summary

**v3.0 Generic Drill Engine — IN PROGRESS**

**Scope:** Prompt-Response drill engine for 8 Tier A techniques, rules + LLM evaluation, mastery tracking with spaced repetition intervals, Skills Lab integration. localStorage persistence.

**Phase structure:**
- Phase 19: Technique Data Foundation — COMPLETE
- Phase 20: Drill Engine + Scoring (ENG-01 to ENG-05, SCR-01 to SCR-04)
- Phase 21: Mastery Tracking (MAS-01 to MAS-04)
- Phase 22: Skills Lab Integration (INT-01 to INT-04)

**Previous milestones:**
- v2.0 Dark Premium Transformation — COMPLETE (Phases 11-18, 44 requirements)
- v1.0 Private Beta — SHIPPED (Phases 01-10, 30 requirements)

## Current Position

Phase: 20 — Drill Engine + Scoring
Plan: Not started
Status: Ready to plan
Last activity: 2026-02-17 — Completed 19-01-PLAN.md (all 6 tasks)

## Accumulated Context

### Key Decisions
- Generic drill engine over technique-specific UIs (CLAUDE.md D8)
- Prompt-Response is the only format for v3.0 (5 formats total planned, 1 implemented now)
- 8 Tier A techniques: Mirroring, Labeling, Open-Ended Questions, I-Statements, No-Oriented Questions, NVC Observation, NVC Feeling, Accusation Audit (id: 'accusation-audit', maps to Contrasting framework)
- 4-dimension quality scoring: form 0.25, accuracy 0.35, impact 0.30, timing 0.10 (R5)
- Timing weight effectively 0 in isolated drills — timing field recorded but not prominently displayed
- HLR spaced repetition simplified to interval tables for v3.0 (3 tables by skill_type): syntax [3,7,14,30,60,90], judgment [3,7,21,45,75,90], recognition [7,14,30,60,90,90]
- Form scoring = regex/pattern match via SyntaxRule types (regex/negation/inclusion)
- Accuracy + Impact = single Gemini LLM call per attempt with structured rubric
- Graceful degradation: LLM failure shows Form score only, session not blocked
- localStorage persistence (no Supabase yet for this milestone)
- All 8 Tier A techniques use skill_type='syntax' in v3.0
- No type-check npm script — use npx tsc --noEmit for TypeScript verification
- Chunk size warning (~1.17 MB JS) is pre-existing, not a Phase 19 concern

### Data Layer Ready (Phase 19)
- `src/types/drill.ts` — Technique, Scenario, SyntaxRule, DrillDataStore types
- `src/data/drill-techniques.ts` — 8 techniques with syntax rules; drillTechniques Record + drillTechniquesArray
- `src/data/drill-scenarios.ts` — 40 scenarios (5 per technique), difficulty 1-2
- `src/utils/drill-storage.ts` — initDrillData(), getDrillData(), getTechnique(), getScenariosForTechnique(), getScenarioById()
- `src/main.tsx` — initDrillData() called before ReactDOM.createRoot().render()
- localStorage key: 'kdenz:drill-data' (colon separator, distinct from underscore-keyed legacy keys)

### Research Available
- R8: Complete technique taxonomy (83 techniques, 22 scored 5/5 for beta)
- R10: Skills Lab vs Simulation Studio classification (tier A/B/C, 5 drill formats)
- R13: CBT/MI technique inventory (89 techniques, 54 app-suitable)
- R15: Spaced repetition mastery decay (HLR model, 3 decay rates)
- R5: Conversation quality evaluation (4-dimension rubric)

### Existing Code
- src/features/labeling/ — existing labeling drill (working, untouched by Phase 19)
- src/features/accusation-audit/ — existing accusation audit drill (working, untouched by Phase 19)

## Blockers

None.

## Pending Todos

1 pending todo in .planning/todos/pending/:
- Gamification system (streaks, badges, progress enhancements) — future candidate

## Session Continuity

Last session: 2026-02-17T23:08:05Z
Stopped at: Completed 19-01-PLAN.md (all 6 tasks, including verification)
Resume file: None

---
*State initialized: 2026-01-25*
*Last updated: 2026-02-17 - Phase 19 complete, positioned at Phase 20*
