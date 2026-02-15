# Context Handoff — Source-of-Truth Complete + Folder Cleanup

**Session:** 2026-02-14
**Trigger:** User requested handoff
**Status:** Source-of-truth updated, folder cleanup complete, ready to build

---

## What Was Done

### 1. Source-of-Truth Rewrite (3 parallel agents)

All three canonical files rewritten from voice-practice-only MVP to full platform scope:

**PRD.json** — Full rewrite:
- 5 product pillars defined (Voice Practice, Skills Lab, Simulation Studio, Institute, VCM Diagnostics)
- New task structure for platform build phases
- Tech stack updated: Supabase (22 tables), Gemini 2.5 Flash, Hume batch API, HLR spaced repetition
- Success metrics: skill progression, drill completion, simulation engagement, mastery decay, technique transfer
- active_task set to "source-of-truth-update" (needs updating to first build task)

**CLAUDE.md** — Major update:
- Project description: full Communication Training Platform
- 5 pillar descriptions with technical details
- Complete tech stack section (Supabase, Gemini, Hume, Deepgram path, HLR)
- Key architectural patterns: generic drill engine, state object, practice-before-exposure
- Old MVP restrictions removed (skill detection, simulation, session history now in scope)
- Design system updated to "Dark Premium" variant

**agents.md** — 10 new research-proven invariants added:
1. Generic drill engine (R8, R10, R13)
2. Diagnose internally, intervene externally (R11)
3. Three skill types with different decay rates (R15)
4. Practice before exposure (R12)
5. Adjacency list for skill DAG (R9, R16)
6. State object pattern (R4, R14)
7. 4-dimension quality scoring (R5)
8. Rule-based diagnostics first (R11)
9. Behavioral event logging (R11, R16)
10. Never miss twice (R11, R15)
- Old MVP restrictions updated to platform scope

### 2. Folder Cleanup

**Deleted (junk):**
- `nul`, `New Text Document.txt` (x3), `index.html`, `Reddit2GoSearch.png`
- `files (2).zip`, `files (3).zip`, `files (3)/`
- Duplicate Python files: `feedback_mapping.py`, `hume_voice_analyzer.py`, `local_voice_analyzer.py`, `requirements.txt` (originals in kdenz-poc/)
- `Claude code created/` folder (entire directory)

**Archived to docs/archive/:**
- 19 misplaced root files (.docx, .xlsx, .md, .json, .jsx)
- `docs/evolving/` (old v1 docs, superseded by R1-R16)
- 19 loose docs files (VCM research, environmental friction, etc.)

**Archived to .planning/archive/:**
- `phases/` (15 old MVP phase folders, ~90 files)
- `milestones/` (old v1.0 MVP milestone)
- `codebase/` (old codebase analysis)
- `features/` (old labeling + accusation audit specs)
- `css-refactoring-roadmap.md`, `FEEDBACK-2026-02-03.md`

**Not touched (kept intact):**
- `kdenz-poc/` — connected to Hume.ai, kept as-is
- `src/` — app source code, clean
- `.planning/research/` — R1-R16 active research
- `.planning/handoffs/` — active handoff chain
- `docs/foundation/` — philosophy, copy guidelines, brand (still relevant)
- `dist/` — already in .gitignore, not tracked

### 3. R15 Update

Added "Post-Launch: Real-World Usage Tracking" section to R15_SPACED_REPETITION_MASTERY_DECAY.md:
- Transfer rate metric (app practice vs real-world usage)
- Real-world usage credits SRS (1.3-1.5x interval extension)
- Post-event reflection prompts
- Skill usage events table
- Priority: Phase 2-3 feature

### 4. FSRS Evaluation

Evaluated FSRS (Free Spaced Repetition Scheduler) from open-spaced-repetition repo. Conclusion: not worth implementing at launch. R15's HLR model with simple interval fallback is the right starting point. FSRS could be the "graduated" algorithm after 3-6 months of review data.

---

## Current State

### Clean Folder Structure
```
kdenz/
├── .planning/
│   ├── archive/          # Old phases, milestones, codebase, features
│   ├── handoffs/         # Active handoff chain
│   ├── research/         # R1-R16 active research (20 files)
│   └── [GSD state files]
├── docs/
│   ├── archive/          # All old artifacts (~50 files)
│   ├── beta-testing/     # Interview script
│   ├── foundation/       # Philosophy, copy, brand
│   └── [active docs]     # DECISIONS_NEEDED, PLATFORM_ARCHITECTURE, RESEARCH_PROMPTS
├── kdenz-poc/            # Hume.ai connected POC
├── src/                  # App source (clean)
├── CLAUDE.md, PRD.json, agents.md, progress.txt
└── [config files]
```

### Source of Truth Status
- PRD.json: CURRENT (full platform scope)
- CLAUDE.md: CURRENT (platform dev rules)
- agents.md: CURRENT (10 research invariants + platform constraints)
- progress.txt: Needs session entry appended (this handoff covers it)

---

## What Is Next

The source-of-truth update was the ONLY prerequisite before building. Next steps:

1. **Update PRD.json active_task** — Change from "source-of-truth-update" to first build task
2. **Decide build order** — Likely Voice Practice polish first (most code exists), then generic drill engine, then Supabase schema deployment
3. **Start building** — Phase 1 target: Voice Practice + Skills Lab foundation + Supabase schema + behavioral event logging

### Suggested First Build Task
Deploy Supabase schema (R16) and set up auth — this unblocks everything else since all 5 pillars need persistence.

---

## Files Modified This Session

- `PRD.json` — Full rewrite (platform scope)
- `CLAUDE.md` — Full rewrite (platform dev rules)
- `agents.md` — Full rewrite (10 research invariants)
- `.planning/research/R15_SPACED_REPETITION_MASTERY_DECAY.md` — Added transfer measurement section
- ~50 files moved to archive locations
- ~20 files deleted

## Files Created This Session

- `.planning/handoffs/handoff-2026-02-14-source-of-truth-complete.md` (this file)

---

## Files to Read on Resume

1. `PRD.json` — NEW (full platform scope, read first)
2. `CLAUDE.md` — NEW (platform dev rules)
3. `agents.md` — NEW (10 research invariants)
4. `progress.txt` — Append-only log (read from bottom for latest)
5. This handoff — session context

---

## Re-Entry Token Estimate

CLAUDE.md (~2,500) + PRD.json (~4,000) + agents.md (~1,500) + handoff (~2,000) = ~10,000 tokens

--- RESUME BLOCK ---
Last task: source-of-truth-update -- Rewrote PRD.json, CLAUDE.md, agents.md for full platform + folder cleanup
Next task: first-build-task -- Start building (likely Supabase schema deployment or Voice Practice polish)
Next action: Update PRD.json active_task, decide build order, start first implementation task
Blockers: None -- all prerequisites complete, ready to build
