# Phase 02: Audio Pipeline & Visual Gauge - Context

**Gathered:** 2026-02-03 (v2 — replaces rejected 2026-02-02 context)
**Status:** Ready for planning

<domain>
## Phase Boundary

Real-time mic capture feeding a mode-specific visual feedback loop. User picks a practice focus (filler words or speech pace) from the dashboard, taps the orb to start, sees live feedback relevant to their focus, and navigates to a post-session results page when done. AudioEngine and FillerDetector integrated into session. Silence nudge after 10s. This phase delivers the core feedback loop — the "holy shit moment."

Duration selection, playback, transcript, scorecard/AI summary, and leveling system are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Orb visual design
- Neon green circle with audio waveform bars icon inside (equalizer-style vertical bars — see reference image 1)
- Subtle green ambient glow around the circle — concentric gradient effect
- Sits on brand background (white clinical) — orb's glow provides its own contrast
- Recording state: icon swaps from waveform bars to red stop square
- Tap orb to START a session
- Idle state (not recording): completely static — no animation
- Only the session page has the orb — rest of app stays standard clinical theme

### Orb reactivity during recording
- Volume-responsive: brightness tracks actual voice volume continuously (whisper = dim, speaking = vivid, loud = brightest)
- Orb does NOT change size — only intensity/brightness changes
- No ripple rings or expanding effects — intensity modulation only
- Subtle enough to signal "I hear you" without distracting from practice

### Orb color as pace feedback
- **Green** = good speaking pace (default during recording)
- **Yellow** = speaking too fast — signals "slow down" without text
- **Red** = deferred to future phase (pause practice exercise)
- For pace-focused sessions, the orb color IS the feedback — no text nudges for pace
- Color transitions should be smooth, not jarring

### Speech waveform visualization
- Classic audio editor-style amplitude waveform below the orb (see reference image 2)
- Gray/dark vertical bars on light background showing real-time speech amplitude
- Builds left-to-right as the person speaks — like watching yourself in an audio editor
- Visible during designated voice practice modes ONLY — not during skills sessions or simulations
- Useful for tone work — user can see their speech patterns visually

### Practice focus model
- Sessions are mode-specific: user picks ONE focus before starting (filler words OR speech pace)
- Focus selection happens from the dashboard alongside other practice modes (labeling, accusation audit, etc.)
- During session, only the metric/visual relevant to that focus is shown

### Focus-specific session layouts
- **Filler word focus:** orb + filler count below orb (no waveform)
- **Pace/tone focus:** orb (with color feedback) + waveform below orb (no count)
- Future: mode-to-layout mapping will be defined as more practice modes are added

### Filler word focus — active session
- Running filler count displayed below the orb (simple incrementing number)
- No filler rate during real-time — just raw count
- Screen contains: progress bar at top + orb + filler count below + bottom control bar

### Speech pace focus — active session
- No persistent number metric on screen
- Orb color change IS the pace feedback (green → yellow when too fast)
- Waveform visualization below the orb for tone awareness
- Screen contains: progress bar at top + orb + waveform below + bottom control bar
- A text area may exist for other feedback types, but pace feedback is purely visual (orb color)

### Bottom control bar
- Visible during active session below the orb/waveform area
- During recording: shows **Pause** button
- When paused: Pause button reveals **Stop** (end session) and **Continue** (resume recording) options
- Two-step stop pattern prevents accidental session endings
- Orb tap starts the session; bottom bar handles pause/stop/continue

### Progress bar
- Thin progress bar at top of screen (YouTube loading bar style)
- Visible during all session types
- No timer inside the orb — progress bar is the only time indicator

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
- Exact neon green color value (vivid, not muted or pastel)
- Exact yellow value for pace warning
- Ambient glow implementation (CSS box-shadow, radial gradient, canvas, etc.)
- Waveform bars icon style/proportions inside orb
- Waveform visualization implementation (Canvas API, Web Audio API visualization, etc.)
- Orb sizing and spacing on session page
- Bottom control bar styling and icon choices
- Silence nudge message text options
- Post-session templated paragraph copy
- Pace session post-session stats
- Loading/transition states between pages
- Progress bar color and styling
- Smooth color transition timing for orb pace feedback

</decisions>

<specifics>
## Specific Ideas

- **Reference image 1 (orb):** neon green circle on dark surface with audio waveform bars icon, concentric green glow — this IS the target orb design
- **Reference image 2 (waveform):** classic audio editor amplitude waveform — gray bars on light background, varying heights, with scrubber/time marker
- **Reference image 3 (session UI layout):** centered orb, clean layout, bottom control bar — general layout inspiration (but neon green, no timer in orb, no ripple rings)
- "Don't distract — just show we hear them" — reactivity should be subtle intensity change, not dramatic
- "One metric at a time" — don't overwhelm with multiple numbers during practice
- Orb color as feedback is intuitive — no need for text when color communicates clearly
- Post-session navigation: three clear options, evenly spaced across the bottom
- Pause → Stop/Continue pattern prevents accidental session endings

</specifics>

<deferred>
## Deferred Ideas

- **Red orb state for pause practice** — red color reserved for future exercise focused on practicing pauses when speaking
- **Motivational interviewing techniques as practice modes** (rolling with resistance, reflective listening, summarization) — new practice modes for future phase
- **Outcome-based dashboard navigation** — reorganize dashboard by outcomes (what users want to achieve) with techniques nested inside — dashboard architecture redesign for future phase
- **Auto-leveling system** — start all users at baseline, level up automatically based on performance — separate phase
- **Technique education pages** — dedicated pages explaining each technique (what/when/why/how) — separate phase
- **Mode-to-layout mapping** — comprehensive mapping of which practice modes get which UI elements — to be defined as modes are added

</deferred>

---

*Phase: 02-audio-pipeline-visual-gauge*
*Context gathered: 2026-02-03*
