---
phase: 15-new-screens-core-flow
plan: 04
subsystem: ui
tags: [recording-screen, countdown, SessionOrb, react, dark-premium]

# Dependency graph
requires:
  - phase: 13-sessionorb-redesign
    provides: Gold gradient SessionOrb with animated rings and stop overlay
  - phase: 15-01
    provides: Navigation framework and screen layout infrastructure

provides:
  - 3-second countdown animation before recording auto-starts
  - Redesigned recording screen with SessionOrb dominating center
  - Stop-only controls (no pause button)
  - Dimmed practice prompt at top for glanceability
  - Real-time metrics strip (WPM + filler count) at bottom

affects:
  - 15-05 (Post-Session Screen - will receive session data from this redesigned flow)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Countdown overlay pattern with scale+fade CSS animations
    - Full-height recording layout (top prompt, center orb, bottom metrics)
    - Stop-only session control (continuous conversation pattern)

key-files:
  created:
    - src/components/CountdownOverlay.tsx
  modified:
    - src/components/PracticeSession.tsx
    - src/components/BottomControlBar.tsx
    - src/App.css

key-decisions:
  - "3-second countdown with scale+fade animation (800ms per number)"
  - "Auto-start recording after countdown completes (no manual tap)"
  - "Stop-only controls - removed pause/continue buttons for continuous conversation flow"
  - "Practice prompt dimmed at top (text-text-subtle, 2-line clamp) - glanceable but doesn't compete with orb"
  - "Real-time metrics in thin bottom strip - minimal distraction"
  - "SessionOrb gets maximum vertical real estate with flex-1 container"

patterns-established:
  - "Countdown overlay: full-screen, dark bg, centered animated number, auto-complete callback"
  - "Recording layout: 3-section vertical (prompt top, orb center, controls bottom)"
  - "Metrics strip: horizontal flex with left/right alignment, py-2 minimal height"

# Metrics
duration: 8 min
completed: 2026-02-12
---

# Phase 15 Plan 04: Recording Screen Redesign Summary

**3-second countdown animation, SessionOrb-dominant recording screen with dimmed prompt, stop-only controls, and minimal real-time metrics strip**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-12T15:01:43Z
- **Completed:** 2026-02-12T15:10:24Z
- **Tasks:** 2/2
- **Files modified:** 4

## Accomplishments

- Created CountdownOverlay component with 3-2-1 scale+fade animation before recording
- Redesigned PracticeSession recording screen with immersive full-height layout
- SessionOrb dominates center of screen with flex-1 container for maximum visual presence
- Practice prompt persistent but dimmed at top (text-text-subtle, 2-line clamp) - glanceable, doesn't compete
- Real-time metrics (WPM + filler count) in thin bottom strip - minimal distraction
- Stop-only controls - removed pause/continue buttons for continuous conversation flow
- Progress bar at top shows time remaining (existing pattern preserved)
- All audio/speech/filler detection logic preserved unchanged

## Task Commits

Each task was committed atomically:

1. **Task 1: Create CountdownOverlay component** - `fe18657` (feat)
   - Full-screen overlay with dark background
   - 3-2-1 animated countdown (scale 0.5→1.0 + fade)
   - Gold accent glow around number
   - CSS animation keyframe added to App.css
   - Auto-calls onComplete after countdown finishes

2. **Task 2: Redesign PracticeSession recording experience** - `2b576fd` (feat)
   - Add countdown overlay that auto-starts recording after 3 seconds
   - Restructure recording layout: top prompt, center orb, bottom metrics
   - Practice prompt dimmed and persistent (2-line max, text-text-subtle)
   - SessionOrb center stage with flex-1 container
   - Real-time metrics strip: filler count + WPM in thin bottom bar
   - Simplified BottomControlBar to stop-only (removed pause/play UI)
   - All existing session logic preserved (audio, speech, filler, timer, baseline)

## Files Created/Modified

- `src/components/CountdownOverlay.tsx` - Full-screen 3-2-1 countdown animation overlay
- `src/components/PracticeSession.tsx` - Redesigned recording screen layout with countdown integration
- `src/components/BottomControlBar.tsx` - Simplified to stop-only control (pause/continue removed)
- `src/App.css` - Added countdownPulse keyframe animation

## Decisions Made

1. **Countdown auto-starts recording**: After 3-second countdown completes, recording begins automatically without manual tap. Builds anticipation and creates clear start moment.

2. **Stop-only controls (no pause button)**: Sessions are continuous like real conversations. Pause functionality removed from UI to reinforce this pattern. Users can only end the session.

3. **Practice prompt dimmed and clamped**: Shown at top in text-text-subtle with 2-line clamp. Glanceable reference without competing with SessionOrb for attention.

4. **Metrics strip minimal**: Thin bottom bar (py-2) with horizontal flex layout. Shows filler count (left) and WPM (right) in text-body-sm text-text-muted. Non-distracting real-time feedback.

5. **SessionOrb gets flex-1 container**: Center section uses flex-1 to maximize SessionOrb's vertical real estate. Orb is the dominant visual element during recording.

6. **Countdown animation intensity**: Scale from 0.5 to 1.0 over 800ms with ease-in-out. Gold accent glow (rgba(201, 168, 76, 0.3)) around number for premium feel.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

Ready for 15-05 (Post-Session Screen redesign).

Recording screen redesign complete with:
- Countdown animation working
- SessionOrb dominating center during recording
- Dimmed practice prompt at top
- Real-time metrics in bottom strip
- Stop-only controls (no pause)
- Progress bar at top for time remaining
- All audio/speech/filler logic working unchanged

Session data flows correctly to post-session results page.

## Self-Check: PASSED

All created files exist and all commits verified.

---
*Phase: 15-new-screens-core-flow*
*Completed: 2026-02-12*
