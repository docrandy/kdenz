---
phase: 14-typography-layout
plan: 03
subsystem: layout-spacing
tags: [spacing, immersive-ui, mobile-carousel, calm-design, generous-layout]
requires:
  - phase: 14-01
    provides: Typography scale and brightness hierarchy
  - phase: 14-02
    provides: CardCarousel component for mobile one-at-a-time display
provides:
  - Spacing token system (24px desktop gutters, 16px mobile, 32px card padding, 40px section spacing)
  - Immersive recording mode (no header/nav during active session)
  - Dashboard mobile carousel for practice cards
  - Subdued audio quality warnings (inline muted text)
  - Soft silence nudge glow (inviting not blinding)
  - Desktop max-width 1200px centered (LAY-03)
affects: [15-new-screens-core, 16-new-screens-advanced]
tech-stack:
  added: []
  patterns:
    - Calm-level generous spacing throughout app
    - Immersive full-screen recording experience
    - Mobile-first carousel for card-based content
    - Subdued inline warnings vs. prominent banners
key-files:
  created: []
  modified:
    - src/index.css
    - src/components/PracticeSession.tsx
    - src/components/AudioQualityWarning.tsx
    - src/components/SilenceNudge.tsx
    - src/components/SessionProgressBar.tsx
    - src/App.tsx
    - src/pages/Dashboard.tsx
decisions:
  - id: immersive-recording-approach
    choice: "Removed header bars from route wrappers, added Back button in pre-recording state"
    rationale: "Cleaner than conditional rendering — immersive during recording, minimal chrome before starting"
  - id: warning-prominence-level
    choice: "Small muted inline text (caption size) with tiny icon, not dismissible banner"
    rationale: "Addresses feedback #3/#4 — warnings should inform without interrupting flow"
  - id: nudge-glow-intensity
    choice: "Soft diffused gold glow (rgba 0.08 and 0.04 opacity) with readable text color"
    rationale: "Inviting not blinding — feedback #7 said bright background made text unreadable"
  - id: mobile-carousel-implementation
    choice: "Reused CardCarousel from 14-02 with responsive grid/carousel switch"
    rationale: "Addresses feedback #5/#8 — one card at a time on mobile, side-by-side on desktop"
metrics:
  duration: "6m"
  completed: 2026-02-12
---

# Phase 14 Plan 03: Layout & Spacing Summary

**One-liner:** Implemented Calm/Headspace-level generous spacing with 32px card padding and 40px section spacing, immersive full-screen recording mode with hidden chrome, Dashboard mobile carousel for one-at-a-time practice cards, and subdued inline warnings with soft readable nudge glow

## What Was Built

Applied generous spacing throughout the app, made recording sessions fully immersive, added mobile carousel to Dashboard, and fixed Phase 13 feedback items about warning prominence, breathing button brightness, and information density.

### 1. Spacing Token System

**Added to `src/index.css`:**
```css
--spacing-gutter-desktop: 1.5rem;  /* 24px */
--spacing-gutter-mobile: 1rem;     /* 16px */
--spacing-section: 2.5rem;         /* 40px vertical between sections */
--spacing-card-padding: 2rem;      /* 32px internal card padding */
```

**Applied:**
- Card components (`.card-surface`, `.card-elevated`): increased from `p-6` (24px) to `p-8` (32px)
- Dashboard section spacing: increased from `space-y-6` to `space-y-10` (40px between sections)
- Dashboard container: `py-6` → `py-8` for more top/bottom breathing room
- Stats section: `gap-3 sm:gap-4` → `gap-6` for generous column spacing

### 2. Immersive Recording Mode

**Problem:** Phase 13 feedback said recording UI should be fully immersive — no header, no nav, no status bar.

**Solution:**
- Removed sticky header bars from `FreePracticeFillerRoute`, `FreePracticePaceRoute`, and `TechniquePracticeRoute` in `App.tsx`
- Added small "Back" button in `PracticeSession.tsx` pre-recording state (top-left, muted text)
- Made `SessionProgressBar` ultra-subtle: thin line (0.5px height) with no background container
- Recording session now full-screen with only orb and essential controls visible

**Result:** Clean, distraction-free recording experience. User can focus entirely on practice without UI chrome.

### 3. Dashboard Mobile Carousel

**Problem:** Phase 13 feedback #5/#8 — practice cards stacked on mobile, need one-at-a-time display.

**Solution:**
- Imported `CardCarousel` component (built in 14-02)
- Added responsive layout:
  - **Mobile (< 768px):** Practice cards in swipeable carousel (one at a time)
  - **Desktop (≥ 768px):** Practice cards in 3-column grid (all visible)
- Recent Sessions: 2-column grid on desktop for better width utilization

**Implementation:**
```tsx
{/* Desktop: grid layout */}
<div className="hidden md:grid md:grid-cols-3 gap-4">
  {/* 3 PracticeCard components */}
</div>

{/* Mobile: carousel */}
<div className="md:hidden">
  <CardCarousel>
    {/* Same 3 PracticeCard components */}
  </CardCarousel>
</div>
```

### 4. Subdued Audio Quality Warnings

**Problem:** Phase 13 feedback #3/#4 — warning banners too prominent, interrupting flow.

**Before:**
- Prominent alert-style warning with colored background, border, alert role
- "Background noise detected" as large status-warning text with dismiss X button
- Max 2 warnings visible

**After:**
- Small muted inline indicator: tiny icon (14px) + caption text in `text-subtle`
- No colored background, no border, no dismiss button
- Max 1 warning visible (most relevant only)
- Fades in smoothly but doesn't interrupt workflow

**Result:** Warnings inform without demanding attention. User stays in flow.

### 5. Soft Silence Nudge Glow

**Problem:** Phase 13 feedback #7 — "Take a breath" button surround too bright, text unreadable when lit.

**Before:**
- Solid background with visible border
- When active, background became bright and text disappeared

**After:**
- Semi-transparent background (`bg-background-surface/80`) with backdrop blur
- Soft diffused gold glow: `0 0 30px rgba(201,168,76,0.08), 0 0 60px rgba(201,168,76,0.04)`
- Very subtle gold border (`border-accent/10`)
- Text color: `text-text-body` (muted but always readable)

**Result:** Warm inviting glow that feels calm, not like a spotlight. Text stays readable.

### 6. Desktop Max-Width (LAY-03)

**Requirement:** Maximum content width 1200px, centered on desktop.

**Applied:**
- Dashboard: `max-w-4xl` → `max-w-[1200px]` (all instances)
- PracticeSession: remains full-width during recording (immersive mode exception)

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Spacing tokens + immersive recording + warning/nudge fixes | b0f3cf1 | index.css, PracticeSession.tsx, AudioQualityWarning.tsx, SilenceNudge.tsx, SessionProgressBar.tsx, App.tsx, Dashboard.tsx (max-width) |
| 2 | Dashboard mobile carousel + section spacing | 6cead41 | Dashboard.tsx (carousel integration, section spacing) |

## Decisions Made

### Immersive Recording Approach
**Decision:** Removed header bars from route wrappers entirely, added Back button in PracticeSession pre-recording state.

**Context:** Could have used conditional rendering based on `isCapturing` state, but wrappers don't have access to PracticeSession internal state.

**Rationale:**
- Simpler: no state passing needed
- Cleaner: recording component manages its own pre/during/post states
- Immersive: truly full-screen during recording
- Back button in pre-recording state provides necessary navigation without chrome during session

**Impact:** Recording experience is distraction-free. User can focus entirely on practice.

### Warning Prominence Level
**Decision:** Changed from prominent alert banner to small muted inline text (caption size with tiny icon).

**Context:** Phase 13 feedback said warnings were "too prominent" and "too many messages — reduce noise."

**Rationale:**
- Warnings are informational, not critical (background noise/clipping affects metric accuracy but doesn't break the app)
- Inline display informs without interrupting workflow
- Caption size + muted color conveys "FYI" not "urgent alert"
- Removed dismiss button — warning clears when condition resolves

**Impact:** Warnings present but don't demand attention. User stays in flow.

### Nudge Glow Intensity
**Decision:** Soft diffused gold glow with very low opacity (0.08 and 0.04) and readable text color.

**Context:** Phase 13 feedback #7: "Take a breath button surround too bright when lit (text unreadable)."

**Rationale:**
- Original design: bright background made text disappear
- New approach: subtle glow + semi-transparent background + readable text color
- Inviting not blinding: warm gold glow feels encouraging, not jarring
- Matches "soft, diffused glow when active" requirement from plan

**Impact:** Silence nudge is now inviting and readable. Feels like gentle encouragement.

### Mobile Carousel Implementation
**Decision:** Reused CardCarousel component from 14-02 with responsive grid/carousel pattern.

**Context:** Dashboard practice cards were stacked on mobile (feedback #5/#8).

**Rationale:**
- CardCarousel already built and tested in 14-02
- Responsive pattern: desktop grid (3 columns) + mobile carousel (1 at a time)
- Reusing component maintains consistency (same swipe behavior, dot indicators, etc.)
- Desktop users benefit from seeing all options at once, mobile users get focused one-at-a-time view

**Impact:** Mobile experience matches PostSessionResults carousel pattern. One card at a time reduces cognitive load.

## Deviations from Plan

None — plan executed exactly as written. All feedback items addressed as specified.

## Verification Results

**Build Status:** ✅ PASSED
```
npm run build
✓ built in 3.67s
Zero TypeScript errors
```

**Must-Haves Satisfied:**

1. ✅ Recording session fully immersive — no header, no nav, only orb + controls during recording
2. ✅ Dashboard mobile carousel — one card at a time, swipeable
3. ✅ Desktop Dashboard grid — 3 practice cards side by side
4. ✅ Audio quality warnings — small muted inline text, not prominent banner
5. ✅ Silence nudge — soft diffused gold glow, text readable
6. ✅ Calm-level spacing — 32px card padding, 40px section spacing, generous throughout
7. ✅ Desktop max-width 1200px centered (LAY-03)
8. ✅ Build passes with zero TypeScript errors

**Artifacts Modified:**
- ✅ `src/index.css` — spacing tokens, increased card padding to p-8
- ✅ `src/components/PracticeSession.tsx` — Back button in pre-recording state
- ✅ `src/components/AudioQualityWarning.tsx` — subdued inline text
- ✅ `src/components/SilenceNudge.tsx` — soft gold glow with readable text
- ✅ `src/components/SessionProgressBar.tsx` — thin line with no container
- ✅ `src/App.tsx` — immersive recording (removed header bars)
- ✅ `src/pages/Dashboard.tsx` — mobile carousel, section spacing, max-width 1200px

**Key Links Verified:**
- ✅ Dashboard imports CardCarousel from `../components/CardCarousel`
- ✅ Responsive pattern: carousel on mobile, grid on desktop

## Phase 13 Feedback Addressed

This plan directly addresses 7 feedback items from Phase 13 visual verification:

| Feedback | Status | Solution |
|----------|--------|----------|
| #3: Background Noise warning triggers on normal speech | ✅ | Subdued inline warning (tiny icon + caption text) — less prominent |
| #4: Too many warning messages | ✅ | Max 1 warning visible (most relevant only), no dismiss button |
| #5: Cards stacked — show individually | ✅ | Dashboard mobile carousel (one card at a time) |
| #6: No scrolling — isolated focused view per card | ✅ | Carousel + immersive recording |
| #7: "Take a breath" button too bright when lit | ✅ | Soft gold glow (0.08/0.04 opacity), readable text |
| #8: Dashboard cards need better distribution | ✅ | Mobile carousel + desktop 3-column grid |
| #9: Information density — layout conducive to learning | ✅ | Generous spacing (32px cards, 40px sections) |

## Next Phase Readiness

**For 15-new-screens-core (Welcome, Pre-Session, Recording, Post-Session):**
- ✅ Spacing tokens established — can be reused in new screens
- ✅ Immersive recording pattern validated — new screens can follow same approach
- ✅ Carousel pattern available for card-based flows
- ✅ Design system maturity: spacing, warnings, nudges all refined

**No blockers for next phase.**

## Lessons Learned

### What Went Well
- Spacing tokens in CSS make consistent spacing easy to apply
- Immersive recording mode significantly improves focus
- Subdued warnings feel more appropriate than alert banners
- Soft gold glow is inviting without being distracting
- Mobile carousel reuse from 14-02 was seamless

### Technical Notes
- Removing header bars from route wrappers cleaner than conditional rendering
- CSS custom properties for spacing make future adjustments easier
- Semi-transparent backgrounds (`bg-background-surface/80`) with backdrop blur look premium
- Box-shadow with very low opacity (0.08) creates subtle glow without overwhelming

### User Experience Impact
**Addresses Phase 13 Feedback:**
- ✅ Feedback #3: Warnings less prominent
- ✅ Feedback #4: Reduced warning noise
- ✅ Feedback #5: Cards shown individually on mobile
- ✅ Feedback #7: Breathing nudge readable with inviting glow
- ✅ Feedback #8: Dashboard practice cards better distributed
- ✅ Feedback #9: Generous spacing makes layout conducive to learning

**Expected Improvements:**
- Reduced cognitive load (generous spacing, one card at a time)
- Better focus during recording (immersive full-screen)
- Less interruption from warnings (subdued inline text)
- More inviting silence nudges (soft glow vs. bright background)

## Self-Check: PASSED

**Created files verified:**
```
No new files created (only modifications)
```

**Modified files verified:**
```
✓ src/index.css exists
✓ src/components/PracticeSession.tsx exists
✓ src/components/AudioQualityWarning.tsx exists
✓ src/components/SilenceNudge.tsx exists
✓ src/components/SessionProgressBar.tsx exists
✓ src/App.tsx exists
✓ src/pages/Dashboard.tsx exists
```

**Commits verified:**
```
✓ b0f3cf1 found in git log (Task 1: immersive recording + spacing + warnings/nudge fixes)
✓ 6cead41 found in git log (Task 2: Dashboard mobile carousel + section spacing)
```
