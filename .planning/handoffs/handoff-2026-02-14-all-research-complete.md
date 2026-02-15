# Context Handoff — All Research Complete

**Session:** 2026-02-14
**Trigger:** All 16 research prompts filed
**Duration:** Single session — filed 6 research documents (R11-R16)

---

## What Was Done

Filed all remaining research prompts (R11-R16), completing the full research phase:

| Filed | Source | Key Deliverable |
|-------|--------|----------------|
| R11 | Perplexity Deep Research | VCM gate-to-intervention mapping (8 gates, failure signatures, prescriptions) |
| R12 | Perplexity | Institute content architecture (video formats, quiz types, CMS strategy) |
| R13 | Perplexity Deep Research | CBT + MI technique inventory (89 techniques, 54 app-suitable) |
| R14 | Claude (generated) | AI opponent prompt templates (4 complete prompts, control dials, state evolution) |
| R15 | Perplexity | Spaced repetition for behavioral skills (decay curves, HLR model, interval tables) |
| R16 | Claude (generated) | Full Supabase schema (22 tables, RLS, indexes, Edge Functions, migration script) |

**All 16 research prompts (R1-R16) are now COMPLETE.**
**All 5 priority tiers are ALL COMPLETE.**

---

## What Is Next

**ONE TASK REMAINS before building:** Update source-of-truth files.

The PRD.json, CLAUDE.md, and agents.md are 3+ sessions stale — they still reflect the old MVP scope (voice practice only), not the full platform pivot (D1-D12 decisions + R1-R16 architecture).

### Source-of-Truth Update Scope:
1. **PRD.json** — Rewrite with full platform scope: Voice Practice + Skills Lab + Simulation Studio + Institute + VCM Diagnostics
2. **CLAUDE.md** — Update development rules to reflect platform architecture (not just MVP)
3. **agents.md** — Add invariants from research (generic drill engine, diagnose-internally, 22-table schema, etc.)

### After Source-of-Truth Update:
- Start building the generic drill engine (reuses labeling infrastructure for 16+ techniques)
- Deploy Supabase schema (R16 provides production-ready SQL)
- Begin Skills Lab expansion (OARS drills first — highest practicability scores)

---

## Research Index (All 16 Filed)

| Prompt | File | Key Decision |
|--------|------|-------------|
| R1 | `.planning/research/R1_HUME_BATCH_API_2026.md` | Hume batch via backend proxy, Python POC as reference |
| R3 | `docs/perplexityresearch2_13.txt` | Hybrid architecture: client + edge + database |
| R4 | `.planning/research/R4_GEMINI_SIMULATION_IMPLEMENTATION.md` | Gemini 2.5 Flash, ~$0.01/session, state object pattern |
| R5 | `.planning/research/R5_CONVERSATION_QUALITY_EVALUATION.md` | 4-dimension rubric (form/accuracy/impact/timing) |
| R6 | `docs/Perplexity research 3.txt` | Supabase for persistence, Deepgram for cross-browser later |
| R7 | `.planning/research/R7_AUDIO_STORAGE_HUME_BATCH.md` | Temporary blob storage, 24h auto-delete |
| R8 | `.planning/research/R8_*.md` | 83 techniques -> 22 for beta, 7 curriculum clusters |
| R9 | `.planning/research/R9_SKILL_TREE_PREREQUISITES.md` | 5-tier DAG, hard dependencies, 4 specialization tracks |
| R10 | `.planning/research/R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md` | Tier A/B/C classification, 5 drill formats |
| R11 | `.planning/research/R11_VCM_GATE_EXERCISE_PRESCRIPTIONS.md` | 8 gates mapped to interventions, diagnose internally |
| R12 | `.planning/research/R12_INSTITUTE_CONTENT_ARCHITECTURE.md` | Interleaved learning, practice before exposure |
| R13 | `.planning/research/R13_CBT_MI_TECHNIQUE_INVENTORY.md` | 89 techniques (54 app-suitable), framework overlaps |
| R14 | `.planning/research/R14_AI_OPPONENT_PROMPT_ENGINEERING.md` | 4 complete prompts, 3 control dials, hidden concern mechanics |
| R15 | `.planning/research/R15_SPACED_REPETITION_MASTERY_DECAY.md` | Behavioral skill decay rates, HLR model, interval tables |
| R16 | `.planning/research/R16_FULL_PLATFORM_SUPABASE_SCHEMA.md` | 22 tables, RLS, indexes, Edge Functions, migration |

---

## Critical Architectural Decisions (Cross-Research)

These decisions emerged across multiple research documents and should be treated as invariants:

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

---

## Files to Read on Resume

1. `progress.txt` — Full session history
2. `PRD.json` — STALE (still reflects old MVP scope, needs rewrite)
3. `agents.md` — STALE (needs invariants from research)
4. `docs/RESEARCH_PROMPTS.md` — Research index with all statuses

---

## Re-Entry Token Estimate

CLAUDE.md (~1,200) + project files (~3,000) + handoff (~1,500) = ~5,700 tokens

--- RESUME BLOCK ---
Last task: all-research-complete -- All 16 research prompts filed (R1-R16), handoff created
Next task: update-source-of-truth -- Rewrite PRD.json, CLAUDE.md, agents.md to reflect platform pivot + all research
Next action: Read current PRD.json, rewrite with platform scope incorporating D1-D12 decisions + R1-R16 architecture
Blockers: None -- all research complete, source-of-truth update is the ONLY prerequisite before building
