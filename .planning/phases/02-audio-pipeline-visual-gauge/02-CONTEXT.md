# Phase 02: Audio Pipeline & Visual Gauge - Context

**Gathered:** 2026-02-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Real-time mic capture feeding live visual metrics display. User speaks into mic, sees live filler count and WPM updating in real-time. AudioEngine and FillerDetector integrated into PracticeSession. Silence nudge triggers after 10s. This phase delivers the core feedback loop — the "holy shit moment."

Duration selection, playback, transcript, and scorecard are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Central orb visualization
- Centerpiece of the practice session screen is a "Volumetric Plasma Sphere" / "Data Filament Orb"
- Aesthetic: gaseous energy / plasma with fine filament lines and wave interference patterns (not solid/glossy)
- Palette: monochromatic electric blue/cyan — uses the existing teal accent (#00D4FF) brought to life as the orb
- Orb sits on the white background — it IS the accent color come to life, not a separate dark-mode element
- Surrounding area stays subdued/clean so the orb draws focus without visual clutter
- Only appears on the practice session screen (rest of app stays standard light clinical theme)

### Orb as interaction target
- Tap/click the orb to START a session
- Tap/click the orb again to STOP a session
- No separate start/stop buttons — the orb is the control

### Orb reactivity
- Orb glows brighter and becomes more active (more filament movement) when user is speaking
- Orb dims and calms during silence
- Filament density increases as filler rate climbs — more fillers = more intense internal activity
- No color shifts (stays in teal/cyan family) — reactivity is through intensity, not hue changes

### Metric placement
- Filler count/rate displayed on the LEFT side of the orb
- WPM displayed on the RIGHT side of the orb
- Clean symmetry — orb centered, metrics flanking
- Metrics are separate from the orb (not overlaid inside it)

### Progress bar (replaces countdown timer)
- No countdown timer with numbers — too distracting
- Thin progress bar across the top edge of the screen (YouTube loading bar style)
- Single color, no color transitions during session
- Moves smoothly from left to right as session progresses
- Toggle to hide it entirely for users who don't want even that distraction

### Claude's Discretion
- Stop button placement (secondary to orb tap — may not be needed, but available as fallback)
- Exact filament animation implementation (CSS, Canvas, WebGL — whatever achieves the plasma effect)
- Loading/transition states between idle orb and active session
- Exact metric card styling and typography
- Silence nudge visual treatment (must integrate with orb-centric layout)

</decisions>

<specifics>
## Specific Ideas

- "Volumetric Plasma Sphere" / "Data Filament Orb" — internal structure and translucency, like swirling smoke or fiber optic cables or neural energy trapped inside a sphere
- Feels "smart" and "helper-focused" — precision and data-driven, not trippy art
- Think "Command Center" / "Personal Assistant" aesthetic
- Pairs with the High-Performance Clinical design system — Peloton energy + Apple Health precision
- The orb is the only "special" visual element — everything else stays clean and clinical

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-audio-pipeline-visual-gauge*
*Context gathered: 2026-02-02*
