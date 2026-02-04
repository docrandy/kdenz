# Phase 03: Duration Controls & Timer - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Session timing and duration management. User selects how long they want to practice before starting a session, sees time remaining during practice, and the session auto-stops when time expires. Audio recording is captured during the session for playback in Phase 04. The existing hardcoded 120s timer is replaced with user-selectable durations.

Duration selection, countdown display, auto-stop, manual stop, and audio recording capture are in scope. Playback UI, transcript, scorecard, and AI summary are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Duration picker placement
- Pre-session screen: after tapping a focus mode on the dashboard, user sees a brief duration selection screen before proceeding to the session page with the orb
- This is a separate screen/step in the flow, not inline on the session page
- Should be quick — pick duration and go, not a heavy configuration page

### Duration options
- Include an "Unlimited" option (no timer, user stops manually when done)
- Specific timed options: Claude's discretion on which values make sense for voice practice reps

### Duration memory
- Pre-select the user's last used duration (stored in localStorage)
- All options remain visible and selectable — it's a default, not a lock-in
- First-time users get a sensible default pre-selected

### Timer display
- Countdown bar only — visual bar that depletes as time runs out
- Do NOT show digital time numbers (no MM:SS readout)
- Replaces the current progress bar behavior (one element, not two)
- Unlimited mode: no bar at all — remove the top bar entirely for a cleaner look

### End-of-session behavior
- Timer expiry = immediate stop + navigate to results page
- Same flow as manual stop — no warning, no audio cue, no countdown alert
- Unified stop path: both manual and auto-stop trigger the same save-and-navigate logic

### Claude's Discretion
- Audio recording implementation (MediaRecorder setup, storage approach for Phase 04)
- Exact duration values (30s/60s/90s/2min/5min or similar range)
- Pre-session screen layout and styling
- Recording indicator presence (if any)

</decisions>

<specifics>
## Specific Ideas

- Pre-session screen should be quick — pick duration and go, not a heavy configuration page
- Unlimited mode means the existing manual stop flow (Pause -> Stop) is the only way to end
- Countdown bar is purely visual — user sees it shrinking but no numbers

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-duration-controls-timer*
*Context gathered: 2026-02-04*
