---
phase: 06-scorecard-ai-summary
plan: 01
subsystem: ui
tags: [react, behavior-change, user-research, transfer-of-practice]

# Dependency graph
requires:
  - phase: 05-transcript-with-highlights
    provides: PostSessionResults page structure, session data interface
  - phase: 04-audio-playback
    provides: Session completion flow

provides:
  - Pre-metrics self-assessment prompt (research-backed d >= 0.4)
  - Post-metrics implementation intention prompt (research-backed d >= 0.5)
  - Four-phase reflection flow state machine
  - GAIN framework-aligned reflection copy

affects: [07-warnings-polish, post-session-analytics]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Phased UX flow with research-backed prompts
    - GAIN framework (Goal, Ally, Impact, Non-judgmental)
    - When/then implementation intention template

key-files:
  created:
    - src/components/SelfAssessment.tsx
    - src/components/ImplementationIntention.tsx
  modified:
    - src/pages/PostSessionResults.tsx

key-decisions:
  - "Self-assessment before metrics reveal (d >= 0.4 effect size from research)"
  - "Implementation intention after metrics (d >= 0.5 effect size from research)"
  - "Both prompts skippable (user control principle)"
  - "Baseline sessions skip reflection prompts (no judgment on first session)"
  - "4-phase state machine: self-assess → metrics → intention → complete"

patterns-established:
  - "GAIN-aligned copy: neutral labels, descriptive not evaluative"
  - "Skip-always-visible pattern (psychological safety principle)"
  - "Phase-based conditional rendering for multi-step flows"

# Metrics
duration: 7m 52s
completed: 2026-02-05
---

# Phase 06 Plan 01: Reflection Prompts Summary

**Research-backed self-assessment (d=0.4) before metrics and implementation intentions (d=0.5) after metrics for improved skill transfer**

## Performance

- **Duration:** 7m 52s
- **Started:** 2026-02-05T20:42:09Z
- **Completed:** 2026-02-05T20:50:01Z
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- Self-assessment component with 5-point scale and neutral GAIN-aligned copy
- Implementation intention component with when/then template and suggestion chips
- Four-phase reflection flow integrated into PostSessionResults
- Baseline session handling (skip reflection for first session)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create SelfAssessment component** - `14373b0` (feat)
2. **Task 2: Create ImplementationIntention component** - `a764b87` (feat)
3. **Task 3: Integrate reflection flow into PostSessionResults** - `b25d355` (feat)

## Files Created/Modified

**Created:**
- `src/components/SelfAssessment.tsx` - Pre-metrics self-reflection prompt with 5-point scale, focus mode specific questions
- `src/components/ImplementationIntention.tsx` - Post-metrics commitment prompt with when/then template, suggestion chips

**Modified:**
- `src/pages/PostSessionResults.tsx` - Four-phase state machine: self-assess → metrics → intention → complete

## Decisions Made

1. **Self-assessment prompt before metrics reveal** - Research shows d >= 0.4 effect size for metacognitive accuracy improvement (self-regulated learning research)

2. **Implementation intention prompt after metrics** - Research shows d >= 0.5 effect size for skill transfer from practice to real-world (Gollwitzer meta-analysis)

3. **Both prompts skippable** - User control principle from core-principles-v1.md - psychological safety requires easy exit

4. **Baseline sessions skip reflection prompts** - First session is for calibration, no judgment or commitment until user has baseline data

5. **Four-phase state machine** - Clean separation: self-assess (no metrics visible) → metrics (with Continue button) → intention (action commitment) → complete (full navigation)

6. **GAIN framework copy** - All prompts use neutral, descriptive language:
   - "How aware were you" not "How well did you do"
   - "Felt rushed" / "Felt controlled" not "Bad" / "Good"
   - "Try this next time" not "You must improve"

## Deviations from Plan

**Encountered existing Scorecard integration** - Plan 06-02 had already been executed when 06-01 ran. PostSessionResults contained Scorecard component. Successfully integrated reflection flow while preserving Scorecard (followed Rule 3 pattern: worked around existing state rather than conflicting).

No other deviations - plan executed as written.

---

**Total deviations:** 1 adaptation (existing code handled gracefully)
**Impact on plan:** No scope change. Reflection flow integrated successfully on top of Scorecard changes.

## Issues Encountered

**Linter auto-removing unused imports** - Attempted multiple edits but linter removed imports before components were referenced. Resolved by using Write tool to commit full file at once with all imports used in code.

**Unused variable warning** - setSelfAssessment stored response but never used. Fixed by removing state variable (response capture reserved for future analytics).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for 06-02 (Scorecard Component)** - Already executed and integrated. Scorecard appears in metrics phase.

**Ready for 06-03 (Gemini Summary)** - Reflection flow complete. AI summary can be triggered post-intention or in complete phase.

**Potential enhancements for future phases:**
- Store self-assessment and intention responses for analytics
- Display last session's intention at start of new session (reminder/accountability)
- A/B test reflection prompts vs no prompts to measure real-world transfer

---
*Phase: 06-scorecard-ai-summary*
*Completed: 2026-02-05*
