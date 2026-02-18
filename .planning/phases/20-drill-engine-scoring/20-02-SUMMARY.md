---
phase: 20-drill-engine-scoring
plan: 02
subsystem: drill-engine
tags: [react, typescript, hooks, state-machine, localStorage, gemini]

# Dependency graph
requires:
  - phase: 20-01
    provides: drillEvaluationService.ts (evaluateDrillResponse, DrillEvaluationResult), drillAttemptStorage.ts (saveDrillAttempt, generateAttemptId)
  - phase: 19-01
    provides: drill-storage.ts (getTechnique, getScenariosForTechnique), types/drill.ts (Technique, Scenario)
provides:
  - useDrillSession hook with full state machine (idle → presenting → recording → scoring → feedback)
  - DrillState union type exported for DrillScreen consumption
  - Scenario pool management (random pick, no same-session repeats, auto-resets after full cycle)
  - Attempt count + streak tracking per session
  - Attempt persistence wired (saveDrillAttempt after each evaluation)
affects: [20-03-DrillScreen, 20-04-SkillsLabIntegration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hook-as-state-machine: all drill business logic centralized in useDrillSession, zero logic in DrillScreen"
    - "Flat hook return: no nested objects, each field named to match DrillScreen's prop needs exactly"
    - "Pool reset pattern: usedScenarioIds tracked in state; full reset when all scenarios exhausted"
    - "Streak-with-null-safety: accuracyScore=null (Gemini failed) falls back to formScore-only for streak"

key-files:
  created:
    - src/features/drill-engine/useDrillSession.ts
  modified: []

key-decisions:
  - "appendTranscript replaces (not appends) transcript — Web Speech API fires cumulative final results, not incremental additions"
  - "nextScenario adds currentScenario.id to usedScenarioIds before picking next — avoids immediate repeat"
  - "submitTranscript validates empty transcript first, then gates on technique/currentScenario existence"
  - "Pool reset: when all scenarios used, reset usedScenarioIds to [] and pick from full pool (allow repeats after full cycle)"

patterns-established:
  - "Feature folder pattern: src/features/drill-engine/ for all drill-engine hooks and components"
  - "State machine hooks: useState for all drill state, useCallback for all handlers"

# Metrics
duration: 20min
completed: 2026-02-18
---

# Phase 20 Plan 02: useDrillSession Hook Summary

**React state machine hook centralizing all prompt-response drill logic — scenario pool, scoring pipeline, streak tracking, and attempt persistence — behind a flat typed interface**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-02-18T00:25Z
- **Completed:** 2026-02-18T00:45Z
- **Tasks:** 1 (plus 2 prerequisite files verified from 20-01)
- **Files created:** 1

## Accomplishments

- Created `src/features/drill-engine/useDrillSession.ts` with complete 6-state machine
- Implemented scenario pool: random pick, no same-session repeats, resets after full cycle
- Wired evaluation pipeline: `evaluateDrillResponse` → `saveDrillAttempt` → streak update → `feedback` state
- Streak logic: increments when `formScore >= 80 AND (accuracyScore is null OR accuracyScore >= 75)`, resets on miss
- All 6 imports resolve cleanly; `npx tsc --noEmit` and `npm run build` pass with 0 errors

## Hook Interface

### State fields

| Field | Type | Description |
|---|---|---|
| `state` | `DrillState` | Current state machine position |
| `technique` | `Technique \| undefined` | Loaded technique (undefined until startSession) |
| `currentScenario` | `Scenario \| undefined` | Active scenario for this round |
| `transcript` | `string` | Live transcript accumulating during recording |
| `evaluation` | `DrillEvaluationResult \| null` | Most recent evaluation result |
| `attemptCount` | `number` | Total attempts submitted this session |
| `streak` | `number` | Consecutive correct attempts |
| `sessionStartTime` | `string` | ISO 8601, set on first startSession() call |
| `error` | `string \| null` | Error message for display |

### Handlers

| Handler | Signature | Description |
|---|---|---|
| `startSession` | `() => void` | Load technique + first scenario, idle → presenting |
| `startRecording` | `() => void` | presenting → recording |
| `appendTranscript` | `(text: string) => void` | Called by DrillScreen on each Speech API result |
| `submitTranscript` | `() => Promise<void>` | recording → scoring → feedback (or presenting on error) |
| `nextScenario` | `() => void` | Pick next scenario, go to presenting |
| `setError` | `(msg: string) => void` | Set error message |
| `clearError` | `() => void` | Clear error message |

### DrillState transitions

```
idle → presenting       (startSession)
presenting → recording  (startRecording)
recording → scoring     (submitTranscript — after validation)
scoring → feedback      (evaluateDrillResponse succeeds)
scoring → presenting    (evaluateDrillResponse throws)
feedback → presenting   (nextScenario)
```

Note: `complete` state is defined in the union type for future use but not yet triggered — the pool resets instead of terminating. DrillScreen 20-03 can decide when to call it.

## Task Commits

1. **Task 1: Create useDrillSession hook** - `7bf256e` (feat)

**Plan metadata:** included in this SUMMARY commit

## Files Created

- `src/features/drill-engine/useDrillSession.ts` — Full state machine hook, 368 lines

## Decisions Made

- `appendTranscript` uses assignment (not concatenation): Web Speech API fires cumulative final results, so each call replaces the transcript rather than appending. DrillScreen should pass the full current transcript each time.
- `nextScenario` adds the current scenario to used IDs before picking the next one — prevents the same scenario from appearing back-to-back across the pool reset boundary.
- `complete` state is defined but not auto-triggered — pool resets instead. DrillScreen 20-03 decides session termination logic.
- `sessionStartTime` in `useState` (not `useRef`) per plan spec — persists across re-renders.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Verified 20-01 dependency files before writing hook**

- **Found during:** Pre-execution check
- **Issue:** `drillEvaluationService.ts` and `drillAttemptStorage.ts` were listed as plan 20-02 dependencies but 20-01 had no SUMMARY.md. Could not confirm files existed without checking.
- **Fix:** Verified both files exist and are complete (committed at `327e27a` and `ab80576` from a previous session). No code changes needed — dependency was already satisfied.
- **Files modified:** None
- **Verification:** `npx tsc --noEmit` — 0 errors; all imports resolve

---

**Total deviations:** 1 (verification check only — no code changes)
**Impact on plan:** None. The dependency files were already present and correct from a prior execution of 20-01.

## Issues Encountered

None — all dependencies present, type-check and build clean.

## Next Phase Readiness

- `useDrillSession` ready for `DrillScreen` (Plan 20-03) to consume
- Hook provides exactly the interface DrillScreen needs: scenario display, recording state, transcript, evaluation result, streak, error
- `src/features/drill-engine/` directory established for future drill-engine components (DrillScreen.tsx, etc.)

---

*Phase: 20-drill-engine-scoring*
*Completed: 2026-02-18*

## Self-Check: PASSED
