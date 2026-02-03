# Phase 02: Audio Pipeline & Visual Gauge - Context

**Gathered:** 2026-02-03 (updated — replaces rejected 2026-02-02 context)
**Status:** Ready for planning

<domain>
## Phase Boundary

Real-time mic capture feeding a mode-specific visual feedback loop. User picks a practice focus (filler words or speech pace) from the dashboard, taps the orb to start, sees live feedback relevant to their focus, and navigates to a post-session results page when done. AudioEngine and FillerDetector integrated into session. Silence nudge after 10s. This phase delivers the core feedback loop — the "holy shit moment."

Duration selection, playback, transcript, scorecard/AI summary, and leveling system are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Orb visual design
- Neon green circle with audio waveform bars icon inside (equalizer-style vertical bars — see reference image)
- Subtle green ambient glow around the circle — concentric gradient effect
- Sits on brand background (white clinical) — orb's glow provides its own contrast
- Recording state: icon swaps from waveform bars to red stop square
- Tap orb to start → tap again (stop square) to end session
- Idle state (not recording): completely static — no animation
- Only the session page has the orb — rest of app stays standard clinical theme

### Orb reactivity during recording
- Green intensity modulation only — stays within green family, no color shifts
- Volume-responsive: brightness tracks actual voice volume continuously (whisper = dim, speaking = vivid, loud = brightest)
- Orb does NOT change size — only intensity/brightness changes
- Subtle enough to signal "I hear you" without distracting from practice

### Practice focus model
- Sessions are mode-specific: user picks ONE focus before starting (filler words OR speech pace)
- Focus selection happens from the dashboard alongside other practice modes (labeling, accusation audit, etc.)
- During session, only the metric relevant to that focus is shown — not both

### Filler word focus — active session
- Running filler count displayed below the orb (simple incrementing number)
- No filler rate during real-time — just raw count
- Screen contains: orb + filler count below + progress bar at top

### Speech pace focus — active session
- No persistent metric on screen — just the orb + progress bar
- Actionable coaching nudge text appears ONLY when pace gets too fast
- Nudge is encouraging and action-oriented (e.g., "Try pausing between thoughts") — not judgmental ("You're going too fast")
- Nudge appears then fades — not persistent

### Progress bar
- Thin progress bar at top of screen (YouTube loading bar style) — kept from original plan
- Visible during all session types

### Post-session page
- Separate page/route — NOT below the session container
- Templated summary paragraph (locally generated, no AI) + key stats
- Filler session stats: filler count + session duration
- Pace session stats: Claude's discretion on what's meaningful
- Navigation layout: **Dashboard** (left) | **Try Again** (center, same focus) | **New Session** (right, pick new focus)

### Silence nudge
- Text appears below the orb after 10 seconds of silence
- Encouraging coach tone (warm, motivating — e.g., "You've got this — start whenever you're ready")
- Message appears briefly then fades away after a few seconds
- One and done — does not repeat if silence continues
- Disappears immediately when user starts speaking

### Claude's Discretion
- Exact green color value for the orb (vivid neon green — not muted or pastel)
- Ambient glow implementation (CSS box-shadow, radial gradient, canvas, etc.)
- Waveform bars icon style/proportions inside orb
- Orb sizing and spacing on session page
- Coaching nudge text content for pace sessions
- Silence nudge message text options
- Post-session templated paragraph copy
- Pace session post-session stats
- Loading/transition states between pages
- Progress bar color and styling

</decisions>

<specifics>
## Specific Ideas

- Reference image provided: neon green circle on dark surface with audio waveform bars icon, concentric green glow — this IS the target orb design
- "Don't distract — just show we hear them" — reactivity should be subtle intensity change, not dramatic
- Coaching nudges must be actionable: tell them what TO DO, not what they're doing wrong
- "One metric at a time" — don't overwhelm with multiple numbers during practice
- Post-session navigation: three clear options, evenly spaced across the bottom

</specifics>

<deferred>
## Deferred Ideas

- **Motivational interviewing techniques as practice modes** (rolling with resistance, reflective listening, summarization) — new practice modes for future phase
- **Outcome-based dashboard navigation** — reorganize dashboard by outcomes (what users want to achieve) with techniques nested inside — dashboard architecture redesign for future phase
- **Auto-leveling system** — start all users at baseline, level up automatically based on performance — separate phase
- **Technique education pages** — dedicated pages explaining each technique (what/when/why/how) — separate phase

</deferred>

---

*Phase: 02-audio-pipeline-visual-gauge*
*Context gathered: 2026-02-03*
