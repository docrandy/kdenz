---
phase: 15-new-screens-core-flow
plan: 02
subsystem: ui
tags: [react, welcome-screen, onboarding, profile, SessionOrb, dark-premium]

# Dependency graph
requires:
  - phase: 13-sessionorb-redesign
    provides: Gold gradient SessionOrb with animated rings
  - phase: 14-typography-layout
    provides: Cormorant Garamond + Outfit fonts, text-* classes

provides:
  - Full-viewport immersive welcome hero with animated orb centerpiece
  - 2-step inline profile setup (name + goals) for first-time users
  - Updated onboarding flow: Consent → Welcome → Profile Setup → Diagnostic → Dashboard

affects:
  - 15-03 (Pre-Session Screen)
  - 15-04 (Recording Screen)
  - 15-05 (Post-Session Screen)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Full-viewport immersive hero design pattern
    - Multi-step inline onboarding with skip functionality
    - LocalStorage-based onboarding state management

key-files:
  created:
    - src/components/InlineProfileSetup.tsx
  modified:
    - src/components/WelcomeScreen.tsx
    - src/App.tsx

key-decisions:
  - "Welcome hero uses SessionOrb as centerpiece with gentle pulse animation (3s ease-in-out)"
  - "Profile setup limited to 2 steps (name + goals) for <30 second completion"
  - "Goal selection capped at 3 options from 8 total (prevents overwhelming)"
  - "Skippable at each step — onboarding is low-friction"
  - "Auto-skip for returning users via PROFILE_SETUP_SEEN_KEY + preferredName check"

patterns-established:
  - "Immersive full-viewport layout with gradient overlays"
  - "Onboarding flows check localStorage keys + profile data for conditional rendering"
  - "Step indicators (dots) for multi-step flows"

# Metrics
duration: 5 min
completed: 2026-02-12
---

# Phase 15 Plan 02: Welcome + Profile Setup Summary

**Full-viewport welcome hero with animated SessionOrb and 2-step inline profile setup (name + goals) integrated into onboarding flow**

## Performance

- **Duration:** 5 min
- **Started:** 2026-02-12T14:50:45Z
- **Completed:** 2026-02-12T14:56:01Z
- **Tasks:** 2/2
- **Files modified:** 3

## Accomplishments

- Redesigned WelcomeScreen from compact card to immersive full-viewport hero
- SessionOrb centerpiece with gentle pulse animation (3s ease-in-out infinite loop)
- Aspirational premium copy ("Master Every Conversation") with 3-step technique intro
- Created InlineProfileSetup component with 2-step flow (name → goals)
- Integrated profile setup into onboarding: Consent → Welcome → Profile Setup → Diagnostic → Dashboard
- Auto-skip logic for returning users (checks both localStorage key and profile data)

## Task Commits

Each task was committed atomically:

1. **Task 1: Redesign WelcomeScreen as immersive hero** - `83f25cf` (feat)
   - Full-viewport layout with background gradient overlay
   - SessionOrb with gentle pulse animation
   - Aspirational copy with 3-step technique-focused intro
   - Gold CTA button with hover scale effects

2. **Task 2: Create InlineProfileSetup and integrate into onboarding flow** - `af87181` (feat)
   - 2-step component: name input + goal multi-select
   - Saves to profileStorage (preferredName + longTermGoals)
   - App.tsx integration with new onboarding flow
   - Skip functionality at each step
   - Auto-skip for returning users

## Files Created/Modified

- `src/components/InlineProfileSetup.tsx` - 2-step inline profile setup (name + goals, skippable)
- `src/components/WelcomeScreen.tsx` - Redesigned as full-viewport immersive hero with SessionOrb centerpiece
- `src/App.tsx` - Integrated profile setup into onboarding flow between welcome and diagnostic

## Decisions Made

1. **SessionOrb animation intensity**: Gentle pulse (scale 1.0 → 1.03) over 3s ease-in-out infinite — subtle presence, not distracting
2. **Goal selection limit**: Cap at 3 selections from 8 options to prevent decision fatigue (research: >5 options = analysis paralysis)
3. **Profile setup placement**: After welcome, before diagnostic — users need context (welcome) before providing personal info
4. **Skip at each step**: Profile setup can be skipped entirely or partially — low-friction onboarding
5. **Auto-skip logic**: Check both PROFILE_SETUP_SEEN_KEY and profile.demographics.preferredName existence for robust detection
6. **Step indicators**: 2 dots showing current step — minimal visual overhead, clear progress

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Next Phase Readiness

Ready for 15-03 (Pre-Session Screen).

New onboarding flow is complete and ready for testing:
- First-time users: Consent → Welcome → Profile Setup → Diagnostic → Dashboard
- Returning users: Consent → Dashboard (all steps auto-skipped)

Profile data now captured early in onboarding for personalization throughout the app.

---
*Phase: 15-new-screens-core-flow*
*Completed: 2026-02-12*


## Self-Check: PASSED

All created files exist and all commits verified.
