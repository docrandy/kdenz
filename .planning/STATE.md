# Project State: VoiceLab

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Users practice negotiation and difficult conversation techniques through data-driven drills and real-time feedback
**Current focus:** v3.0 Generic Drill Engine — Phase 19: Technique Data Foundation

## Current State

**Status:** Ready to plan Phase 19
**Version:** v3.0 Generic Drill Engine
**Previous:** v2.0 Dark Premium Transformation (COMPLETE), v1.0 shipped 2026-02-05
**Deployed:** https://kdenz.vercel.app (v2.0 + 5-pillar navigation active)
**Last Action:** 2026-02-17 - v3.0 roadmap created (4 phases, 20 requirements)

**Progress:** [--------------------] 0% (0/4 phases complete)

## Milestone Summary

**v3.0 Generic Drill Engine — IN PROGRESS**

**Scope:** Prompt-Response drill engine for 8 Tier A techniques, rules + LLM evaluation, mastery tracking with spaced repetition intervals, Skills Lab integration. localStorage persistence.

**Phase structure:**
- Phase 19: Technique Data Foundation (TDM-01, TDM-02, TDM-03)
- Phase 20: Drill Engine + Scoring (ENG-01 to ENG-05, SCR-01 to SCR-04)
- Phase 21: Mastery Tracking (MAS-01 to MAS-04)
- Phase 22: Skills Lab Integration (INT-01 to INT-04)

**Previous milestones:**
- v2.0 Dark Premium Transformation — COMPLETE (Phases 11-18, 44 requirements)
- v1.0 Private Beta — SHIPPED (Phases 01-10, 30 requirements)

## Current Position

Phase: 19 — Technique Data Foundation
Plan: Not started
Status: Ready to plan
Last activity: 2026-02-17 — Roadmap created

## Accumulated Context

### Key Decisions
- Generic drill engine over technique-specific UIs (CLAUDE.md D8)
- Prompt-Response is the only format for v3.0 (5 formats total planned, 1 implemented now)
- 8 Tier A techniques: Mirroring, Labeling, Open-Ended Questions, I-Statements, No-Oriented Questions, NVC Observation, NVC Feeling, Contrasting
- 4-dimension quality scoring: form 0.25, accuracy 0.35, impact 0.30, timing 0.10 (R5)
- Timing weight effectively 0 in isolated drills — timing field recorded but not prominently displayed
- HLR spaced repetition simplified to interval tables for v3.0 (3 tables by skill_type): syntax [3,7,14,30,60,90], judgment [3,7,21,45,75,90], recognition [7,14,30,60,90,90]
- Form scoring = regex/pattern match against syntax_template (rules-based)
- Accuracy + Impact = single Gemini LLM call per attempt with structured rubric
- Graceful degradation: LLM failure shows Form score only, session not blocked
- localStorage persistence (no Supabase yet for this milestone)
- Existing labeling and accusation audit drills must remain accessible (INT-04 — no regression)

### Research Available
- R8: Complete technique taxonomy (83 techniques, 22 scored 5/5 for beta)
- R10: Skills Lab vs Simulation Studio classification (tier A/B/C, 5 drill formats)
- R13: CBT/MI technique inventory (89 techniques, 54 app-suitable)
- R15: Spaced repetition mastery decay (HLR model, 3 decay rates)
- R5: Conversation quality evaluation (4-dimension rubric)

### Existing Code
- src/features/labeling/ — existing labeling drill (must remain working)
- src/features/accusation-audit/ — existing accusation audit drill (must remain working)

## Blockers

None.

## Pending Todos

1 pending todo in .planning/todos/pending/:
- Gamification system (streaks, badges, progress enhancements) — future candidate

---
*State initialized: 2026-01-25*
*Last updated: 2026-02-17 - v3.0 roadmap created, positioned at Phase 19*
