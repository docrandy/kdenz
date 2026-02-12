# Phase 13: SessionOrb Redesign - Context

**Gathered:** 2026-02-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the SessionOrb from a flat gold circle with box-shadow glow into a premium animated component with gold radial gradient, 3 concentric animated rings, and volume-responsive behavior. The orb remains the primary record/stop control. No new functionality — purely visual/animation upgrade within the existing component interface (audioLevel, isRecording, onClick, isLoading, disabled).

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User granted full discretion on all implementation areas. Claude should make decisions that align with the dark premium design system (#0b0e14 background, #c9a84c gold accent) and premium SaaS aesthetic.

**Ring animation style:**
- 3 concentric rings around the central orb body
- Outer ring: slow rotation (elegant, not distracting)
- Middle ring: medium pulse (breathing rhythm)
- Inner ring: fast flicker/shimmer (energy, responsiveness)
- Overall feel should be organic/breathing, not mechanical — premium meditation-app quality
- Claude decides: rotation speeds, easing curves, ring opacity, ring thickness, gap between rings

**Volume responsiveness:**
- Rings respond to audioLevel prop (0-1 normalized mic input)
- Claude decides: which properties respond (brightness, scale, speed, opacity), sensitivity curve, behavior during silence vs speech
- Goal: the orb should feel alive when the user speaks, calm when silent

**State transitions:**
- Idle → Recording → Analyzing (existing states)
- Claude decides: transition style (morph/fade/scale), duration, analyzing state visual treatment
- Requirements lock: mic icon in idle (ORB-04), stop square when recording (ORB-05), smooth transitions (ORB-06)

**Visual weight & sizing:**
- Claude decides: ring spread, ring thickness, gradient stops, overall prominence
- Must be mobile responsive at 320px+ (ORB-07)
- Current default size: 200px — Claude can adjust as appropriate
- Should feel commanding but not overwhelming — it's the centerpiece of the recording screen

</decisions>

<specifics>
## Specific Ideas

- Gold radial gradient (ORB-01) — replace current flat #c9a84c with a gradient that gives depth
- Three concentric animated rings (ORB-02) — outer/middle/inner with distinct motion profiles
- Volume-responsive ring brightness (ORB-03) — rings brighten with voice volume
- Dark premium aesthetic — should feel like a high-end audio app (think: premium podcast studio, not gaming)
- Reference: current orb uses simple box-shadow glow + brightness filter — the redesign should use CSS animations or SVG for the rings

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 13-sessionorb-redesign*
*Context gathered: 2026-02-12*
