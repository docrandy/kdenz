---
phase: 07-polish-error-handling
plan: 01
subsystem: ui
tags: [audio, monitoring, error-handling, ux, react]

# Dependency graph
requires:
  - phase: 02-audio-pipeline
    provides: useAudioCapture hook with audio processing
  - phase: 03-session-foundation
    provides: PracticeSession component structure
provides:
  - Audio quality monitoring (noise and clipping detection)
  - Real-time quality warnings displayed during session
  - Verbatim foundation copy for warning messages
  - AudioQualityWarning component for quality issue display
affects: [post-session-results, polish-error-handling]

# Tech tracking
tech-stack:
  added: []
  patterns: [inline SVG icons, verbatim foundation copy usage, quality monitoring via AnalyserNode]

key-files:
  created:
    - src/components/AudioQualityWarning.tsx
  modified:
    - src/core/audio/useAudioCapture.ts
    - src/core/audio/useWebSpeech.ts
    - src/components/PracticeSession.tsx

key-decisions:
  - "Use inline SVG icons instead of icon library (project has no icon dependencies)"
  - "Quality warnings only shown during active session (not when paused)"
  - "Verbatim copy from foundation docs (locked messaging)"

patterns-established:
  - "Quality monitoring: Check every 500ms via AnalyserNode frequency/time-domain data"
  - "Dismissible warnings: Per-warning dismissal with session-scoped persistence"
  - "Foundation copy: VERBATIM usage with locked messaging"

# Metrics
duration: 52min
completed: 2026-02-05
---

# Phase 07 Plan 01: Audio Quality Monitoring Summary

**Real-time noise and clipping detection with dismissible warnings using verbatim foundation copy**

## Performance

- **Duration:** 52 minutes
- **Started:** 2026-02-05T21:26:42Z
- **Completed:** 2026-02-05T22:18:30Z (estimated)
- **Tasks:** 4 (3 executed, 1 pre-existing)
- **Files modified:** 3

## Accomplishments
- Audio quality monitoring detects noise (low frequency analysis) and clipping (time-domain sample analysis)
- AudioQualityWarning component displays warnings with clinical-warm-amber styling per design system
- Warnings integrated into PracticeSession with proper positioning and storage
- MicPermissionError component already existed with complete error handling

## Task Commits

Each task was committed atomically:

1. **Task 1: Add audio quality detection to useAudioCapture hook** - Already in HEAD (pre-existing)
   - Quality detection logic present: noise floor calculation, clipping detection
   - Fixed missing confidence fields in useWebSpeech return (bug fix)

2. **Task 2: Create AudioQualityWarning component** - Auto-committed (component created)
   - Verbatim foundation copy for warning messages
   - Inline SVG icons (no external dependencies)
   - Dismissible per-warning with max 2 visible at once
   - Clinical-warm-amber styling (amber-50 bg, amber-600 icon, amber-900 text)

3. **Task 3: Wire warnings into PracticeSession** - `d505829` (feat)
   - Import and destructure qualityWarnings from useAudioCapture
   - Display warnings above SessionOrb during active session
   - Save qualityWarnings to sessionStorage for post-session display
   - Add dependencies to handleStop callback

4. **Task 4: MicPermissionError and permission handling** - Pre-existing (no changes needed)
   - Component already existed with complete error handling
   - Handles denied, unavailable, in-use, and unknown error types
   - Provides helpful guidance with numbered steps per error type
   - Retry button wired to onRetry callback

## Files Created/Modified
- `src/components/AudioQualityWarning.tsx` - Displays dismissible quality warnings with verbatim foundation copy
- `src/core/audio/useAudioCapture.ts` - Quality monitoring (noise/clipping detection), analyserNode creation
- `src/core/audio/useWebSpeech.ts` - Fixed missing confidence fields in return statement (bug fix)
- `src/components/PracticeSession.tsx` - Integrated AudioQualityWarning, save qualityWarnings to sessionStorage

## Decisions Made
- Used inline SVG icons instead of external library (project has no icon dependencies, keeps bundle small)
- Quality warnings only displayed during active session (not when paused) to avoid distraction
- Warnings positioned above SessionOrb per layout specification
- Verbatim copy from foundation docs (locked messaging for legal/UX compliance)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed missing confidence fields in useWebSpeech return**
- **Found during:** Task 1 (Building useAudioCapture)
- **Issue:** TypeScript error - useWebSpeech interface declared averageConfidence and lowConfidenceSegments but they weren't returned
- **Fix:** Added averageConfidence and lowConfidenceSegments to return statement (values were already being computed)
- **Files modified:** src/core/audio/useWebSpeech.ts
- **Verification:** TypeScript build passes, no compiler errors
- **Committed in:** Same session as Task 1 (pre-existing work)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Bug fix necessary for TypeScript compilation. No scope creep. Confidence tracking was already implemented, just missing from return.

## Issues Encountered
- lucide-react import attempted but library not in dependencies - linter auto-converted to inline SVG (correct resolution)
- Some tasks (Task 1, Task 2, Task 4) were pre-existing or auto-committed - execution proceeded with Task 3 manual commit

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Audio quality warnings functional and ready for user testing
- qualityWarnings saved to sessionStorage for potential post-session display
- MicPermissionError handles all error states with helpful guidance
- Ready for transcript confidence indicator (Phase 07-02) and mobile polish (Phase 07-04)

---
*Phase: 07-polish-error-handling*
*Completed: 2026-02-05*
