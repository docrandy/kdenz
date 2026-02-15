---
phase: 06-scorecard-ai-summary
plan: 02
subsystem: ui
tags: [react, typescript, baseline, metrics, foundation-copy]

# Dependency graph
requires:
  - phase: 03-duration-controls-timer
    provides: baseline storage and metrics infrastructure
  - phase: 05-transcript-with-highlights
    provides: reconciled filler data for breakdown
provides:
  - MetricCard component with baseline delta and uncertainty display
  - Scorecard refactored to use MetricCard composition
  - Baseline comparison in PostSessionResults
  - Foundation copy templates applied (context notes, reflection prompts)
affects: [06-03-ai-summary, scorecard-enhancements]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "MetricCard composition pattern for reusable metric displays"
    - "Baseline delta calculation with improvement/change coloring"
    - "Foundation copy verbatim usage for claim-safe messaging"

key-files:
  created:
    - src/components/MetricCard.tsx
  modified:
    - src/components/Scorecard.tsx
    - src/pages/PostSessionResults.tsx

key-decisions:
  - "Remove judgment colors (green/yellow/red) per design principle #2"
  - "Delta colors are informational (green=improvement, amber=change), not judgmental"
  - "Confidence intervals heuristic based on session length (shorter = wider margin)"
  - "Foundation copy used verbatim from locked templates"

patterns-established:
  - "MetricCard: Reusable component for individual metrics with baseline deltas"
  - "Confidence interval display: +/- margin shown for uncertainty transparency"
  - "Filler breakdown: Aggregate by word, sort by count descending"

# Metrics
duration: 22min
completed: 2026-02-05
---

# Phase 06 Plan 02: Scorecard with Baseline Deltas and Uncertainty

**MetricCard component composition with baseline deltas, confidence intervals, and verbatim foundation copy for ethical coaching per core principles #2 and #3**

## Performance

- **Duration:** 22 min
- **Started:** 2026-02-05T20:02:56Z
- **Completed:** 2026-02-05T20:24:56Z (estimated)
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Created MetricCard component with baseline comparison and uncertainty display
- Refactored Scorecard to remove judgment language and use MetricCard composition
- Integrated Scorecard into PostSessionResults with baseline data and filler breakdown
- Applied locked foundation copy templates verbatim (context notes, reflection prompts)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create MetricCard component with baseline delta and uncertainty** - `ff2d9ac` (feat)
2. **Task 2: Refactor Scorecard to use MetricCard components** - `798a0ad` (refactor)
3. **Task 3: Integrate Scorecard into PostSessionResults metrics phase** - `6c21bec` (feat)

## Files Created/Modified
- `src/components/MetricCard.tsx` - Individual metric display with baseline comparison, confidence intervals, and foundation copy slots
- `src/components/Scorecard.tsx` - Refactored to use MetricCard composition; removed judgment colors and performance indicator
- `src/pages/PostSessionResults.tsx` - Integrated Scorecard with baseline data and calculated filler breakdown from reconciledFillers

## Decisions Made

**Key decisions with rationale:**

1. **Remove judgment colors and labels** - Eliminated green/yellow/red coloring and "Excellent/Good/Needs Work" labels per design principle #2 ("no judgment in visuals"). Delta colors are informational only.

2. **Confidence interval heuristic** - Shorter sessions get wider confidence margins (< 60s: ±15 WPM, < 120s: ±10 WPM, ≥120s: ±5 WPM). Per core principle #3 ("show uncertainty").

3. **Verbatim foundation copy** - Context notes and reflection prompts copied exactly from `metric-card-templates-v1.md` (locked foundation docs) to ensure claim-safe messaging.

4. **Filler breakdown calculation** - Aggregate reconciledFillers by word, sort by count descending. Provides transparency into which specific fillers were detected.

5. **Baseline null for baseline sessions** - Don't show baseline comparison for first session (is_baseline=true) since there's no prior data.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Remove unused parameter from ImplementationIntention**
- **Found during:** Task 1 (TypeScript build check)
- **Issue:** `fillerCount` parameter declared but never used, causing TypeScript error
- **Fix:** Removed unused parameter from function signature
- **Files modified:** `src/components/ImplementationIntention.tsx`
- **Verification:** `npm run build` passes
- **Committed in:** ff2d9ac (Task 1 commit)

**2. [Rule 1 - Bug] Remove unused phase flow code from PostSessionResults**
- **Found during:** Task 2 (TypeScript build check)
- **Issue:** Unused imports (`SelfAssessment`, `ImplementationIntention`) and unused handlers/state variables causing TypeScript errors. Phase flow infrastructure not yet integrated.
- **Fix:** Removed unused imports, phase state, and handlers
- **Files modified:** `src/pages/PostSessionResults.tsx`
- **Verification:** `npm run build` passes
- **Committed in:** 798a0ad (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both auto-fixes necessary for build to pass. No scope creep. Phase flow infrastructure will be re-added in plan 06-01 or 06-03.

## Issues Encountered

None - plan executed smoothly after build fixes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for next phase:**
- Scorecard displays baseline deltas and uncertainty per core principles
- Foundation copy templates applied for claim-safe messaging
- MetricCard component reusable for future metric additions (pauses, pitch range)
- Filler breakdown shows individual word counts for transparency

**No blockers:**
- All must-haves verified (baseline delta display, uncertainty, verbatim copy, reflection prompts)
- No judgment language in visuals (GAIN framework enforced)
- Ready for AI summary integration (plan 06-03)

---
*Phase: 06-scorecard-ai-summary*
*Completed: 2026-02-05*
