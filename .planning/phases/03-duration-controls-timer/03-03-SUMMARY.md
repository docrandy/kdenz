---
phase: 03-duration-controls-timer
plan: 03
subsystem: session-lifecycle, ui
tags: [duration-picker, countdown-timer, unlimited-mode, localStorage, route-state]

dependency:
  requires:
    - phase: 03-01
      provides: durationConfig service with DURATION_OPTIONS
    - phase: 03-02
      provides: consent modal and first-run gating
  provides:
    - PreSessionScreen route at /practice/:mode/setup
    - Duration selection UI (1min/2min/3min/Unlimited)
    - Countdown bar component (depleting, not filling)
    - Unlimited mode support (no timer, manual stop only)
    - Duration persistence via localStorage
    - Dynamic session duration via route state
  affects:
    - Phase 03-04 (baseline flow will use PreSessionScreen pattern)
    - Phase 04 (playback needs duration from session data)
    - Phase 06 (scorecard displays session duration)

tech-stack:
  added: []
  patterns:
    - route-state-for-session-config
    - localStorage-last-used-preferences
    - countdown-bar-visual-only
    - unlimited-mode-conditional-rendering

key-files:
  created:
    - src/pages/PreSessionScreen.tsx
  modified:
    - src/components/DurationSelector.tsx
    - src/components/SessionProgressBar.tsx
    - src/components/PracticeSession.tsx
    - src/core/audio/useSessionTimer.ts
    - src/App.tsx
    - src/pages/Dashboard.tsx

key-decisions:
  - "Infinity symbol (∞) for Unlimited option display"
  - "Black selected state per design system (not teal)"
  - "Countdown bar hidden entirely in Unlimited mode (not just static)"
  - "Route state for duration passing (not query params)"
  - "2min default fallback for direct navigation without setup screen"

patterns-established:
  - "Pre-session screens for session configuration"
  - "Countdown remaining (1->0) instead of progress (0->1)"
  - "Conditional rendering based on durationSeconds === 0"

duration: 5min
completed: 2026-02-05
---

# Phase 03 Plan 03: Duration Picker + Countdown Timer Summary

**Pre-session duration selection (1min/2min/3min/∞) with countdown bar and unlimited mode support**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-05T00:21:41Z
- **Completed:** 2026-02-05T00:26:35Z
- **Tasks:** 2/2
- **Files modified:** 6

## Accomplishments

- PreSessionScreen route enables duration selection before session starts
- DurationSelector rewritten with 4 options (1min/2min/3min/Unlimited)
- Countdown bar depletes from full to empty (not fills empty to full)
- Unlimited mode hides countdown bar completely
- Session auto-stops at timer end for timed sessions
- Manual Pause → Stop works in all modes
- Last-used duration remembered via localStorage
- Dashboard practice cards navigate to setup screen

## Task Commits

Each task was committed atomically:

1. **Task 1: Pre-session screen with duration picker and localStorage memory** - `ed89992` (feat)
2. **Task 2: Countdown bar + dynamic duration in PracticeSession + Unlimited mode** - `4817490` (feat)

## Files Created/Modified

- `src/pages/PreSessionScreen.tsx` - Duration selection screen between dashboard and session
- `src/components/DurationSelector.tsx` - Rewritten with 1/2/3/∞ options, imports from durationConfig
- `src/components/SessionProgressBar.tsx` - Countdown bar (remaining prop, 1->0 depletion)
- `src/components/PracticeSession.tsx` - Reads durationSeconds from route state, countdown calculation
- `src/core/audio/useSessionTimer.ts` - Unlimited mode support (skip completion check when duration === 0)
- `src/App.tsx` - Added /practice/:mode/setup route
- `src/pages/Dashboard.tsx` - Practice cards navigate to setup screen

## Decisions Made

- **Infinity symbol for Unlimited:** Used `∞` character instead of text "Unlimited" for cleaner UI
- **Black selected state:** Followed design system (buttons are black) instead of teal accent
- **Hide countdown bar in Unlimited:** Cleaner than showing a static bar, reduces visual clutter
- **Route state for duration:** More React-idiomatic than query params, ensures type safety
- **2min fallback:** Direct navigation to /practice/{mode} without setup defaults to 2min for backwards compatibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

**Blockers:** None

**Concerns:** None

**Ready for:** Plan 03-04 (Baseline Session Flow) execution

**Notes:**
- PreSessionScreen pattern established for baseline flow to reuse
- First-time users (no baseline) should skip PreSessionScreen - logic will be added in Plan 04
- Unlimited mode tested conceptually but needs end-to-end validation with real audio session

---

*Phase: 03-duration-controls-timer*
*Plan: 03*
*Completed: 2026-02-05*
