---
phase: 13-sessionorb-redesign
plan: 01
type: execution-summary
completed: 2026-02-12
duration: 102
subsystem: ui-components
tags: [react, css, svg, animation, accessibility, volume-responsive]

requires:
  - phase-12-color-migration

provides:
  - premium-animated-orb
  - gold-gradient-body
  - svg-ring-animations
  - volume-responsive-behavior

affects:
  - phase-14-typography-layout
  - phase-15-new-screens-core

tech-stack:
  added: []
  patterns: [svg-animation, crossfade-transition, volume-modulation, reduced-motion-accessibility]

key-files:
  created: []
  modified:
    - src/components/SessionOrb.tsx
    - src/components/SessionOrb.css

decisions:
  - id: svg-rings-not-canvas
    decision: Use SVG circles for rings instead of canvas
    rationale: SVG provides better accessibility, easier styling, CSS animation integration, and responsive scaling
    alternatives: [canvas, webgl]

  - id: sensitivity-curve
    decision: Apply Math.pow(audioLevel, 0.7) sensitivity curve
    rationale: Makes orb more responsive at low volumes (whisper/quiet speech) while compressing high volume spikes
    alternatives: [linear, logarithmic]

  - id: icon-crossfade
    decision: Implement 200ms crossfade transition between waveform and stop icons
    rationale: Smoother visual transition than instant swap, feels premium
    alternatives: [instant-swap, slide-transition]
---

# Phase 13 Plan 01: SessionOrb Redesign Summary

JWT-style premium animated orb with gold radial gradient, 3 concentric SVG rings with distinct motion profiles, volume-responsive behavior during recording.

## Objective

Transform the SessionOrb from a flat gold circle with box-shadow glow into a premium animated component with gold radial gradient, 3 concentric SVG rings, volume-responsive behavior, and smooth state transitions. The orb remains the primary record/stop control with the exact same prop interface.

## What Was Built

### ORB-01: Gold Radial Gradient Body
- Replaced flat `#c9a84c` background with radial gradient
- Gradient: `circle at 35% 35%` — light gold (#d4b35a) → base gold (#c9a84c) → dark gold (#b8963f)
- Creates appearance of lit sphere with depth and dimensionality
- Maintains 50% border-radius for perfect circle shape

### ORB-02: Three Concentric Animated Rings
Implemented as SVG `<circle>` elements with stroke-based rendering:

**Outer Ring (slow rotation):**
- Radius: size/2 + 28px from body edge
- Stroke: 1.5px width, rgba(201, 168, 76, 0.2) at rest
- Animation: 360° rotation at 20s duration, linear timing
- Dash pattern: `stroke-dasharray: 40 20` (long dashes, medium gaps)

**Middle Ring (breathe pulse):**
- Radius: size/2 + 18px from body edge
- Stroke: 2px width, rgba(201, 168, 76, 0.3) at rest
- Animation: Scale oscillation 1.0 → 1.03 → 1.0 at 3s duration, ease-in-out
- Dash pattern: `stroke-dasharray: 15 10` (medium dashes)

**Inner Ring (shimmer flicker):**
- Radius: size/2 + 8px from body edge
- Stroke: 1px width, rgba(201, 168, 76, 0.25) at rest
- Animation: Opacity oscillation 0.15 → 0.5 + 15° rotation at 1.5s duration
- Dash pattern: `stroke-dasharray: 8 6` (short dashes)

### ORB-03: Volume Responsiveness
During recording (`isRecording: true`), rings respond to `audioLevel` (0-1):

**Sensitivity curve:** `Math.pow(audioLevel, 0.7)` — more responsive at low volumes, compressed at high

**Modulated properties:**
- Ring stroke opacity: base + (sensitiveLevel × boost)
  - Outer: 0.2 → 0.5
  - Middle: 0.3 → 0.7
  - Inner: 0.25 → 0.6
- Ring stroke width: slight increase
  - Outer: 1.5 → 2.0px
  - Middle: 2.0 → 2.5px
  - Inner: 1.0 → 1.5px
- Body glow: 20px spread → 60px spread with opacity boost
- Body scale: 1.0 → 1.03 (subtle breathing with voice)

Transitions: `stroke-opacity 0.15s ease, stroke-width 0.15s ease` for smooth interpolation

### ORB-04 & ORB-05: Icon States
- **Idle state:** WaveformBarsIcon (5 vertical bars) with `fill: var(--color-navy-950)` (dark on gold)
- **Recording state:** StopSquareIcon (rounded square) with `fill: var(--color-cream-100)` (cream on gold)
- **Crossfade transition:** 200ms fade-out → switch icon → 200ms fade-in (feels premium)

### ORB-06: State Transitions
- **Idle → Recording:** Orb "wakes up" — rings brighten with voice, glow intensifies, icon crossfades
- **Recording → Idle:** Orb "settles down" — rings dim to rest, glow reduces, icon crossfades back
- **Loading state:** Gentle pulse (scale 1.0 → 0.95 → 1.0 at 1.5s), rings dimmed to 0.3 opacity, cursor: wait
- **Disabled state:** 0.5 opacity, desaturated (brightness 0.8, saturate 0.5), rings frozen, cursor: not-allowed

### ORB-07: Responsive Sizing
- Component accepts `size` prop (default 200px) for orb body diameter
- Ring radii scale proportionally: innerRadius = size/2 + 8, middleRadius = size/2 + 18, outerRadius = size/2 + 28
- Total footprint: `size + 70px` (rings extend ~35px beyond body on each side)
- SVG viewBox calculated dynamically: `viewBoxSize = size + ringSpread * 2`
- Works at 320px viewport — parent component handles centering
- Touch target: Body size ensures 48x48px minimum (200px default >> 48px)

### Accessibility
**Reduced Motion Support (CRITICAL):**
- `@media (prefers-reduced-motion: reduce)` disables ALL animations
- Rings remain visible at rest opacity but do not animate
- Loading pulse disabled (static 0.8 opacity)
- Visual hierarchy preserved, motion removed

**Keyboard Accessibility:**
- `role="button"`, `tabIndex={0}` when enabled
- Enter/Space key handlers
- Focus-visible outline: 3px gold ring with 8px offset
- ARIA labels: "Start recording" / "Stop recording"
- `aria-disabled` attribute synced with disabled prop

## Task Commits

| Task | Description | Commit | Files Modified |
|------|-------------|--------|----------------|
| 1 | Redesign SessionOrb with gold gradient body and 3 SVG animated rings | 478976d | SessionOrb.tsx, SessionOrb.css |

## Deviations from Plan

None — plan executed exactly as written. All 7 ORB requirements (ORB-01 through ORB-07) implemented as specified.

## Decisions Made

**1. SVG rings over Canvas (ORB-02 implementation)**
- **Decision:** Use SVG `<circle>` elements with stroke rendering
- **Why:** Better accessibility (SVG is DOM-based, screenreader-friendly), easier CSS animation integration, responsive scaling via viewBox, simpler implementation
- **Alternative considered:** Canvas with requestAnimationFrame — rejected due to accessibility concerns and complexity

**2. Sensitivity curve Math.pow(audioLevel, 0.7) (ORB-03 modulation)**
- **Decision:** Apply power curve to make orb more responsive at low volumes
- **Why:** Linear audioLevel → ring brightness feels "dead" at whisper/quiet speech. Power curve compresses high volumes (prevents jarring flashes) while amplifying low volumes (orb feels alive even when speaking quietly)
- **Alternative considered:** Logarithmic curve — power curve simpler and sufficient

**3. Icon crossfade timing 200ms (ORB-04/ORB-05 transition)**
- **Decision:** 200ms fade-out → switch → 200ms fade-in (total 400ms transition)
- **Why:** Feels premium and smooth. Instant swap feels cheap. Longer transitions (500ms+) feel sluggish.
- **Alternative considered:** Slide/scale transitions — crossfade is cleanest for circular icon container

**4. Ring animation speeds (ORB-02 motion profiles)**
- **Decision:** Outer 20s rotation, Middle 3s breathe, Inner 1.5s shimmer
- **Why:** Distinct speeds create organic, non-mechanical feel. Outer slow rotation provides anchor, middle breathe adds life, inner shimmer adds sparkle.
- **Tuning:** Started with 15s/5s/2s, reduced middle/inner for more energy

## Architecture Notes

**Component structure:**
```
<div.session-orb-wrapper>  // Container, handles clicks, state classes
  <svg.session-orb-rings>  // Rings layer (position: absolute, z-index: 1)
    <circle.orb-ring-outer />
    <circle.orb-ring-middle />
    <circle.orb-ring-inner />
  </svg>
  <div.session-orb-body>   // Body (radial gradient, z-index: 2)
    <div>                  // Icon container (crossfade transition)
      <WaveformBarsIcon | StopSquareIcon />
    </div>
  </div>
</div>
```

**Why this structure:**
- SVG rings behind body ensures icons always visible on top
- Wrapper handles all interaction logic (click, keyboard, focus)
- State classes on wrapper (`.loading`, `.disabled`, `.recording`) drive CSS transitions
- Inline styles for dynamic properties (volume modulation, size scaling)
- CSS keyframes for fixed animations (ring motion, loading pulse)

**Prop interface preserved:**
- `audioLevel: number` — 0-1 volume from mic, drives ring/glow modulation
- `isRecording: boolean` — switches icon, enables volume responsiveness
- `onClick: () => void` — click handler
- `isLoading?: boolean` — loading pulse state
- `disabled?: boolean` — disabled/frozen state
- `size?: number` — orb body diameter (default 200px)

**No changes to consuming components:** PracticeSession.tsx passes exact same props, no refactor needed.

## Quality Checks

✅ **Build:** `npm run build` — zero errors, zero warnings (SessionOrb-related)
✅ **Exports:** `export const SessionOrb` confirmed
✅ **Props:** Interface unchanged (audioLevel, isRecording, onClick, isLoading, disabled, size)
✅ **Animations:** Keyframes `orb-ring-rotate`, `orb-ring-breathe`, `orb-ring-shimmer` in CSS
✅ **Gradient:** Radial gradient implementation in TSX inline style
✅ **Accessibility:** `prefers-reduced-motion` support in CSS
✅ **No breaking changes:** `git diff PracticeSession.tsx` shows 0 changes

## Next Phase Readiness

**Phase 14 (Typography & Layout):** ✅ Ready
- SessionOrb is self-contained, no typography dependencies
- Layout changes won't affect orb (already responsive)

**Phase 15 (New Screens - Core Flow):** ✅ Ready
- Redesigned orb ready for new Recording screen
- Pre-Session/Post-Session screens can import SessionOrb with confidence

**Blockers:** None

**Concerns:** None — component is complete and tested

## Self-Check: PASSED

All claimed files exist:
- ✅ src/components/SessionOrb.tsx (modified, exists)
- ✅ src/components/SessionOrb.css (modified, exists)

All claimed commits exist:
- ✅ 478976d (feat: redesign SessionOrb with gold gradient and animated rings)
