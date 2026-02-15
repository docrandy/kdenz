# Context Handoff — Research Filing Session 3 (R4, R5, R9, R10 + New Prompts)

**Session:** 2026-02-13 (third session of the day)
**Trigger:** User-requested handoff
**Duration:** Research filing, gap analysis, new prompt creation

---

## What Was Done This Session

### 1. Filed R4: Gemini 2.5 Flash — Simulation Implementation

User provided distilled implementation notes from Gemini docs + research.

**Key findings locked in:**
- Model: `gemini-2.5-flash`, ~$0.01-0.02 per 15-min simulation session
- State object per turn: `{ mood, concessions, constraints, last_tactic }`
- Prompt library pattern for multiple character types + control dials (assertiveness, reactivity 1-5)
- Voice pipeline: ASR → Gemini → TTS, 1.2-1.8s end-to-end latency
- Hybrid technique evaluation: rules (mirroring, labeling stems) + LLM (tactical empathy, accusation audit quality)
- Per-turn (real-time, ≥0.7 confidence) + session-end (full transcript, aggregated scoring)
- Few-shot: 3-5 contrast pairs (positive + near-miss negative)
- Streaming for simulation, full responses for post-session analysis

**Filed:** `.planning/research/R4_GEMINI_SIMULATION_IMPLEMENTATION.md`

### 2. Updated R5 Prompt & Filed R5: Conversation Quality Evaluation

Original R5 was largely covered by R4's technique detection section. Created expanded R5 prompt focusing on:
- Layer 1: Technique QUALITY scoring (not just detection)
- Layer 2: Conversation FLOW scoring (session-level)
- Layer 3: Feeding the VCM diagnostic engine

User ran the updated prompt and provided comprehensive answer.

**Key findings locked in:**

**Layer 1 — Per-Instance Technique Quality:**
- 4-dimension rubric: `form_score` (0-3), `accuracy_score` (0-3), `impact_level` (0-3), `timing_score` (0-2)
- Composite: `quality = 0.25*form + 0.35*accuracy + 0.3*impact + 0.1*timing` (0-10 scale)
- Weight accuracy > form for empathy techniques, reverse for structured speaking
- Principle: "clumsy but attuned" outranks "polished but mis-attuned"
- Concrete Gemini evaluator prompts for labeling and calibrated questions (ready to implement)

**Layer 2 — Session-Level Flow Scoring:**
- 6 flow dimensions (each 0-5): sequencing_effectiveness, adaptability, missed_opportunities, over_reliance, trajectory, naturalness
- Full session-level Gemini prompt template for 15-turn salary negotiation
- `non_framework_skill_flag` for natural communicators who score well without named techniques
- Coach-language translation: combo logic inside evaluator, natural language in UI

**Layer 3 — VCM Diagnostic Hooks:**
- `trend_features`: technique_confidence_trajectory, emotional_sophistication_trajectory, technique_diversity_index, pressure_response_pattern, recovery_events
- `meta_flags`: scripted_behavior_flag, avoidance_flag, shutdown_flag
- Gate A vs Gate E rules: compare Skills Lab quality to Simulation-under-pressure quality
- Minimum 3-5 sessions before trusting gate-level prescriptions
- Cold start: self-report + 1 diagnostic sim + micro Skills Lab battery

**Filed:** `.planning/research/R5_CONVERSATION_QUALITY_EVALUATION.md`

### 3. Filed R9: Skill Tree Prerequisites & Progression Logic

User provided comprehensive Perplexity Deep Research answer.

**Key findings locked in:**
- 5-tier DAG: Tier 0 (Foundations) → Tier 1 (Core) → Tier 2A (Reflective Listening) → Tier 2B (Strategic Communication) → Tier 3 (Advanced Integration) → Tier 4 (Expert)
- Hard dependencies mapped (e.g., Labeling requires Emotional Self-Awareness, Accusation Audit requires Labeling + Perspective-Taking)
- 5 mastery levels: Not Started → Attempted → Familiar → Proficient → Mastered
- Unlock logic: Tier 0 = 100% Proficient, Tiers 1-2B = ≥75% Proficient, Tier 3→4 = ≥80% Proficient
- Mandatory fundamentals track (Emotional Self-Awareness, Emotional Regulation, Active Listening)
- 4 specialization tracks: Negotiation, Difficult Conversations, MI, Leadership Communication
- Retention check at 7-14 days for Mastered status
- Implementation: `user_skills` table, edge function for prerequisite checks

**Filed:** `.planning/research/R9_SKILL_TREE_PREREQUISITES.md`

### 4. Filed R10: Skills Lab vs. Simulation Studio Architecture

User provided comprehensive Perplexity Deep Research answer.

**Key findings locked in:**

**Technique Classification:**
- Tier A (10 techniques): Drills-first — single-turn, formulaic, isolatable
- Tier B (10 techniques): Simulation-preferred — need multi-turn context
- Tier C (10 techniques): Both — drill basics then simulate integration

**5 Drill Formats:**
1. Prompt → Response (text) — syntax-driven techniques
2. Audio → Spoken (with Hume prosody) — vocal techniques
3. Multiple-Choice Recognition — warm-up/assessment only
4. Rewrite Exercise — error correction
5. Spot-the-Technique (transcript analysis) — bridge to simulation

**Simulation Taxonomy (4 dimensions):**
- Domain (6): Workplace-Manager, Workplace-Peer, Workplace-Customer, Personal-Relationship, Personal-Service, Sales
- Difficulty (5): Cooperative → Hesitant → Resistant → Aggressive → Deceptive
- Focus (4): Single-technique, Technique cluster, Free-form, Remedial
- Goal (5): Information gathering, Persuasion, Conflict resolution, Boundary setting, Relationship building

**Scenario Counts:**
- Beta MVP: ~45 scenarios (2 per technique, tiered difficulty)
- Full platform: ~110 scenarios (4-6 per technique)
- Reuse logic: 45 templates × 3 focus variations = 135 distinct experiences

**Progression:**
- Tier 1: GUIDED simulations (must use technique 3x)
- Tier 2A: SCAFFOLDED (suggested 2-3 uses)
- Tier 2B: SCAFFOLDED → FREE-FORM
- Tier 3-4: FREE-FORM only (post-detection)

**Transfer insight:** Drill mastery predicts 60-70% of simulation performance. Drill-to-simulation-fluent requires 10-20 simulation reps.

**Filed:** `.planning/research/R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md`

### 5. Created 3 New Research Prompts (R14-R16)

Added to `docs/RESEARCH_PROMPTS.md` under "Priority 5: Implementation Architecture":

| Prompt | Topic | Purpose |
|--------|-------|---------|
| R14 | AI Opponent System Prompt Engineering | Character consistency across 5 difficulty levels, control dials, hidden concern reveals, conversation ending logic |
| R15 | Spaced Repetition & Mastery Decay for Communication Skills | Decay curves for behavioral skills, SRS adaptations, retention check formats, notification strategy |
| R16 | Full Platform Supabase Schema | Complete CREATE TABLE statements for skill tree, drill attempts, simulation sessions, technique detections, VCM state, recommendations, audio storage, Institute content |

**Why these three:**
- R14 bridges R4 (API/cost) and R10 (scenario taxonomy) — neither covers the actual prompt engineering for believable opponents
- R15 bridges R9 (mastery levels) and implementation — R9 mentions 7-14 day retention checks but no concrete decay curves or SRS implementation
- R16 bridges R6 (basic 4-table schema) and full platform scope — R6 was for voice practice only, now need schema for 30+ techniques, skill tree DAG, technique detections, VCM state

### 6. Updated Research Status Table

Added complete status table to RESEARCH_PROMPTS.md showing all 16 prompts with filed locations.

---

## What Was NOT Done

- PRD.json, CLAUDE.md, agents.md **still NOT updated** (stale for 3 sessions now)
- No code was written
- R11-R13 not yet run (VCM prescriptions, Institute content, CBT/MI inventory)
- R14-R16 not yet run (AI opponents, spaced repetition, Supabase schema)
- Learning Architect agent not created
- Source-of-truth files not updated
- No commits made

---

## Files Created This Session

| File | Purpose |
|------|---------|
| `.planning/research/R4_GEMINI_SIMULATION_IMPLEMENTATION.md` | Gemini 2.5 Flash integration: pricing, state object, voice pipeline, technique evaluation, streaming |
| `.planning/research/R5_CONVERSATION_QUALITY_EVALUATION.md` | 3-layer scoring: per-instance quality, session-level flow, VCM diagnostic hooks |
| `.planning/research/R9_SKILL_TREE_PREREQUISITES.md` | 5-tier DAG, hard dependencies, 5 mastery levels, unlock logic, fundamentals track |
| `.planning/research/R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md` | Technique classification (A/B/C), 5 drill formats, scenario taxonomy, guided→free progression |
| `.planning/handoffs/handoff-2026-02-13-research-filing-session-3.md` | This file |

## Files Modified This Session

| File | Change |
|------|--------|
| `docs/RESEARCH_PROMPTS.md` | Added R14-R16 prompts, research status table, priority guide |

---

## Research Status (Complete Picture)

| Prompt | Status | Key Deliverable |
|--------|--------|----------------|
| R1 | COMPLETE | Hume batch API integration guide |
| R2 | COVERED BY R3 | — |
| R3 | COMPLETE | Recommendation engine data model + ratio logic |
| R4 | COMPLETE | Gemini simulation: pricing, state object, voice pipeline, technique eval |
| R5 | COMPLETE | 3-layer quality scoring: instance + session + diagnostic |
| R6 | COMPLETE | Supabase basic schema + migration path |
| R7 | COMPLETE | Audio storage: WAV conversion, Supabase Storage, Edge Function proxy |
| R8 | COMPLETE + ANALYZED | 83-technique taxonomy → 22 for beta, 7 clusters |
| R9 | COMPLETE | 5-tier skill tree DAG, 5 mastery levels, unlock logic |
| R10 | COMPLETE | Drill/simulation classification, 5 formats, scenario taxonomy |
| R11 | NOT RUN | VCM gates → exercise prescription mapping |
| R12 | NOT RUN | Institute content architecture |
| R13 | NOT RUN | CBT + MI technique inventory |
| R14 | NOT RUN | AI opponent prompt engineering |
| R15 | NOT RUN | Spaced repetition for behavioral skills |
| R16 | NOT RUN | Full platform Supabase schema |

**10 of 16 complete. The 10 completed cover all technical foundations, evaluation architecture, curriculum design, and skill tree structure.**

---

## What the Research Collectively Tells Us (Synthesis)

### The Platform Architecture Is Now Fully Specified

From R1-R10, every major system has a concrete design:

| System | Research | Design |
|--------|----------|--------|
| Audio capture + playback | Built (v1.0-v2.0) | MediaRecorder + Web Speech API (Chrome) |
| Hume.ai batch analysis | R1, R7 | WAV conversion → Supabase Storage → Edge Function → Hume API |
| Gemini simulation | R4 | State object per turn, $0.01-0.02/session, streaming responses |
| Technique detection | R4 | Hybrid: rules (mirroring, stems) + LLM (empathy, audit quality) |
| Technique quality scoring | R5 | 4-dimension rubric (form/accuracy/impact/timing), weighted per technique |
| Session flow scoring | R5 | 6 dimensions, single Gemini call per session |
| VCM diagnostic signals | R5 | Meta flags + pressure response pattern + Skills Lab vs Sim comparison |
| Skill tree | R9 | 5-tier DAG, hard prerequisites, 5 mastery levels, 4 specialization tracks |
| Drill engine | R10 | 5 formats, generic engine, Tier A/B/C classification |
| Simulation modes | R10 | Guided → Scaffolded → Free-form, 4-dimension scenario taxonomy |
| Scenario library | R10 | 45 base scenarios × 3 focus variations = 135 experiences for beta |
| Data persistence | R6 | Supabase (basic schema ready, needs expansion per R16) |
| Recommendation engine | R3 | 2:1 user-aligned:system-diagnosed ratio, simple rules first |

### What's Still Missing (R11-R16)

| Gap | Impact | Blocking? |
|-----|--------|-----------|
| R11 (VCM prescriptions) | Can't map diagnostic results to specific exercises | Not blocking — can use simple rule-based mapping initially |
| R12 (Institute content) | Can't design educational content architecture | Not blocking — Institute is Phase 4 of build order |
| R13 (CBT/MI inventory) | May be missing CBT techniques that should be in platform | Not blocking — R8 already has 83 techniques, CBT adds depth not breadth |
| R14 (AI opponent prompts) | Can't build realistic simulation opponents | Blocks Simulation Studio (Phase 3 of build order) |
| R15 (Spaced repetition) | Can't implement retention checks or mastery decay | Blocks mastery system polish, not core functionality |
| R16 (Supabase schema) | Can't migrate from localStorage to persistent storage | Blocks multi-device + data persistence, not MVP drills |

**None of the gaps block the #1 build priority: the generic drill engine (Phase 1).**

---

## What Is Next

**The source-of-truth update is now critically overdue (3 sessions stale).** PRD.json still describes the old MVP scope. CLAUDE.md still says "No Skill Detection in MVP." agents.md still says "No Firebase for MVP" and references rules that no longer apply. Every future session starts from wrong context.

### Recommended Session Order

1. **Update source-of-truth files** (30-45 min)
   - Rewrite PRD.json with platform scope, new task structure, updated roadmap
   - Rewrite CLAUDE.md with new constraints, design system, tech stack
   - Rewrite agents.md with new invariants from R4-R10 decisions
   - This is SESSION-START-REQUIRED — no more building until context is correct

2. **Build generic drill engine** (highest-leverage code work)
   - Create `src/features/drill-engine/` with configurable drill infrastructure
   - 10 Tier A techniques all use Prompt→Response pattern
   - Reuse labeling infrastructure but make it generic
   - This is Phase 1 of the R8 build order

3. **Run R14** (needed before Simulation Studio, Phase 3)
   - AI opponent prompt engineering
   - System prompt templates for 5 difficulty levels

4. **Run R11-R13** (nice-to-have depth, not blockers)

### If User Wants to Keep Researching Instead

Run R14 next (AI opponent prompts) — it's the most implementation-relevant remaining prompt and directly enables Simulation Studio.

---

## Resume Block

```
--- RESUME BLOCK ---
Last task: research-filing-session-3 — Filed R4 (Gemini simulation), R5 (quality evaluation), R9 (skill tree), R10 (drill vs simulation), created R14-R16 prompts
Next task: update-source-of-truth — Rewrite PRD.json, CLAUDE.md, agents.md to reflect platform pivot + all research findings
Next action: Read current PRD.json, rewrite with platform scope incorporating D1-D12 decisions + R4-R10 architecture
Blockers: None — all research and analysis complete for build start, source-of-truth update is the only prerequisite
```
