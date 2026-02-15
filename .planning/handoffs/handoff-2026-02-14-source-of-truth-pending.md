# Context Handoff — Source-of-Truth Update Pending

**Session:** 2026-02-14 (late)
**Trigger:** Context continuation — no new work performed
**Status:** All research complete, source-of-truth update is the ONLY task before building

---

## Current State

All 16 research prompts (R1-R16) are filed and complete across 5 priority tiers. No new work was done this session — context was recovered from prior handoff.

**The three source-of-truth files are 3+ sessions stale.** They still reflect the voice-practice-only MVP, not the full platform pivot that emerged from decisions D1-D12 and research R1-R16.

---

## What Needs to Happen: Source-of-Truth Update

### 1. PRD.json — Full Rewrite Required

**Current state:** Describes "Kdenz Voice Practice MVP" with 11 done tasks for a Chrome-only filler-detection app. Feature scope covers only voice practice. Roadmap shows v1.1-v3 as incremental additions.

**Target state:** Full KDENZ Communication Training Platform with 5 product pillars:
- **Voice Practice** (existing MVP — filler detection, playback, real-time feedback)
- **Skills Lab** (generic drill engine for 57+ techniques across MI, CBT, and Voss frameworks)
- **Simulation Studio** (Gemini-powered AI opponents, 5 difficulty levels, state object pattern)
- **Institute** (educational content — interleaved learning, video demos, quizzes)
- **VCM Diagnostics** (8-gate behavioral model, rule-based prescriptions, "diagnose internally" pattern)

**Key changes needed:**
- Project name/description: platform, not just voice practice
- New task structure reflecting platform phases (not 2.5-week MVP sprint)
- Feature scope expanded with all 5 pillars
- Technical decisions updated (Supabase instead of localStorage, Gemini for simulations, Hume batch API, Deepgram for cross-browser)
- Business model updated with platform positioning
- Research validation section expanded to cover all 16 findings
- Version roadmap reflecting platform build phases

### 2. CLAUDE.md (Project-Level) — Major Update Required

**Current state:** Describes "Voice Practice MVP" with Chrome-only rules, Black Swan reuse instructions, and MVP-scoped development rules (no skill detection, no profiling, no session history).

**Target state:** Development rules for full platform:
- Remove MVP-only restrictions that are now in scope (skill detection, simulation, session history)
- Add platform architecture constraints from research
- Update technical decisions (Supabase, Gemini simulation, Hume batch, spaced repetition)
- Add generic drill engine as architectural pattern
- Add state object pattern for simulations
- Keep Chrome-only for beta voice features, note Deepgram path for cross-browser
- Update design system if needed

### 3. agents.md — Add Research Invariants

**Current state:** 7 architectural invariants, 7 technical constraints, 7 UI rules, 4 reuse rules, scope protection list. All scoped to voice-practice MVP.

**Target state:** Add platform-level invariants proven across multiple research documents:

1. **Generic drill engine** — 16 of 23 score-5 techniques reuse labeling infrastructure (R8, R10, R13)
2. **Diagnose internally, intervene externally** — Users never see gate labels (R11)
3. **Three skill types with different decay rates** — syntax (0.08/mo), judgment (0.06/mo), recognition (slowest) (R15)
4. **Practice before exposure** — Attempt technique blind, THEN show expert demo (R12)
5. **Adjacency list for skill DAG** — 57 techniques, max depth 5 (R9, R16)
6. **State object pattern** — { mood, trust_level, concessions, revelation_stage } passed each turn (R4, R14)
7. **4-dimension quality scoring** — form + accuracy + impact + timing (R5)
8. **Rule-based diagnostics first** — Graduate to ML after 3-6 months of data (R11)
9. **Behavioral event logging** — Track all interactions, not just completions (R11, R16)
10. **Never miss twice** — 37% longer habit retention, implement explicitly (R11, R15)

Also update existing invariants:
- "No Skill Detection in MVP" → now in scope
- "No Psychological Profiling" → VCM diagnostics now in scope
- "No Firebase for MVP" → Supabase is the persistence layer
- "localStorage for persistence" → Supabase + localStorage migration path

---

## Research Index (Reference)

All filed at `.planning/research/`:

| # | File | Key Decision |
|---|------|-------------|
| R1 | `R1_HUME_BATCH_API_2026.md` | Hume batch via backend proxy |
| R3 | `docs/perplexityresearch2_13.txt` | Hybrid architecture |
| R4 | `R4_GEMINI_SIMULATION_IMPLEMENTATION.md` | Gemini 2.5 Flash, ~$0.01/session |
| R5 | `R5_CONVERSATION_QUALITY_EVALUATION.md` | 4-dimension rubric |
| R6 | `docs/Perplexity research 3.txt` | Supabase for persistence |
| R7 | `R7_AUDIO_STORAGE_HUME_BATCH.md` | Temporary blob, 24h delete |
| R8 | `R8_*.md` | 83 techniques -> 22 beta |
| R9 | `R9_SKILL_TREE_PREREQUISITES.md` | 5-tier DAG |
| R10 | `R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md` | Tier A/B/C, 5 drill formats |
| R11 | `R11_VCM_GATE_EXERCISE_PRESCRIPTIONS.md` | 8 gates, diagnose internally |
| R12 | `R12_INSTITUTE_CONTENT_ARCHITECTURE.md` | Interleaved learning |
| R13 | `R13_CBT_MI_TECHNIQUE_INVENTORY.md` | 89 techniques, 54 app-suitable |
| R14 | `R14_AI_OPPONENT_PROMPT_ENGINEERING.md` | 4 prompts, 3 dials, state object |
| R15 | `R15_SPACED_REPETITION_MASTERY_DECAY.md` | HLR model, 3 decay rates |
| R16 | `R16_FULL_PLATFORM_SUPABASE_SCHEMA.md` | 22 tables, RLS, migration |

---

## Files to Read on Resume

1. `progress.txt` — Full session history (read from line 1280+)
2. `PRD.json` — STALE (voice-practice MVP only)
3. `agents.md` — STALE (MVP constraints only)
4. `CLAUDE.md` (project) — STALE (MVP development rules)
5. `docs/RESEARCH_PROMPTS.md` — Research index, all 16 COMPLETE
6. This handoff — scope for source-of-truth update

For the actual rewrite, also read key research files:
- R8 (technique taxonomy) — defines what's in scope
- R9 (skill tree) — defines prerequisite structure
- R10 (Skills Lab vs Simulation) — defines product pillars
- R16 (Supabase schema) — defines data architecture

---

## Re-Entry Token Estimate

CLAUDE.md (~1,200) + PRD.json (~2,000) + agents.md (~600) + handoff (~2,500) + key research files (~8,000) = ~14,300 tokens

Note: The source-of-truth update will require reading several research files for accurate rewrite. Consider doing it in 2-3 focused passes (PRD.json first, then CLAUDE.md, then agents.md) to manage context.

--- RESUME BLOCK ---
Last task: all-research-complete -- All 16 research prompts filed, handoff created
Next task: update-source-of-truth -- Rewrite PRD.json, CLAUDE.md, agents.md to reflect platform pivot
Next action: Read current PRD.json + key research files (R8, R9, R10, R16), rewrite PRD.json with full platform scope
Blockers: None -- source-of-truth update is the ONLY prerequisite before building
