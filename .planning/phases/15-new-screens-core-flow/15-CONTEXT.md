# Phase 15: New Screens — Core Flow - Context

**Gathered:** 2026-02-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign the 4 core screens users move through: Welcome, Pre-Session, Recording, and Post-Session. Apply the dark premium design system (Phases 11-14) to the actual user journey. Screens exist today but need full visual overhaul + structural changes based on user feedback from Phases 13-14.

**Requirements:** SCR-01 through SCR-06
**Visual reference:** kdenz-session-flow-prototype.html (277KB, 10-screen flow) — use as visual north star

</domain>

<decisions>
## Implementation Decisions

### Welcome Screen (SCR-01)
- Full-viewport immersive hero — not a compact card
- Animated SessionOrb as centerpiece visual, gently pulsing on welcome
- Aspirational premium copy tone (e.g. "Master Every Conversation", not "Practice speaking")
- Technique-focused 3-step intro: "Choose a technique → Practice with AI → Get personalized coaching"
- Auto-skip for returning users — first visit shows full welcome, subsequent visits go straight to dashboard
- Inline profile setup for first-time users after welcome hero CTA:
  - Step 1: Name/display name
  - Step 2: What do you want to improve? (multi-select goals)
  - Under 30 seconds total, 2 screens max

### Pre-Session Screen (SCR-02)
- Technique practice: briefing card showing technique name, what to practice, success criteria
- AI persona shown as name + style label only (e.g. "Negotiation Coach — Direct & challenging") — no avatar art assets
- Duration selector below the briefing card
- Free practice mode: simplified — just speaking prompt selector + duration, no briefing card
- Single CTA button at bottom to start session

### Recording Screen (SCR-03, SCR-04)
- SessionOrb dominates center of screen (already built in Phase 13)
- Practice prompt persistent but dimmed at top — glanceable, doesn't compete with orb
- Real-time metrics (WPM + filler count) in thin bottom strip — minimal distraction
- 3-second countdown animation before recording begins
- Progress bar at top for time remaining (keep existing pattern)
- No visible countdown timer during recording — progress bar is sufficient
- Stop only — no pause button. Sessions are continuous like real conversations
- Stop = square overlay on orb (already implemented in Phase 13)

### Post-Session Screen (SCR-05)
- Flow: Self-assessment first → then 3-tab results view → "Practice Again" CTA
- Self-assessment: mixed but low friction — feeling scale + optional quick reflection, no required text entry
- Segmented control (iOS-style) for tab navigation, swipeable panels on mobile, gold highlight on active segment
- **Coaching tab:** Card-by-card carousel — each AI coaching point as its own card, swipe through one at a time (leverages Phase 14 CardCarousel component)
- **Voice Analytics tab:** Key stat cards at top (WPM, filler rate, duration) + weekly trend chart below + baseline comparison if available
- **Transcript tab:** Filler words highlighted in gold + tap-to-play integration (tap word to jump to that moment in playback) — keep existing proven feature
- Primary CTA: "Practice Again" (gold button) + secondary "Dashboard" link
- Implementation intention step retained after viewing results (existing flow)

### Screen Navigation (SCR-06)
- Consistent header on all screens: hamburger (☰) + "VoiceLab" + circular profile image
- Back arrow replaces hamburger when inside a sub-flow (pre-session, recording, post-session)
- Smooth horizontal slide transitions between screens (forward = slide left, back = slide right)
- Premium native-app feel throughout

### Claude's Discretion
- Specific animation durations and easing curves for transitions
- Exact metric card layouts in analytics tab
- Loading/skeleton states between screens
- Error states and edge-case handling
- Self-assessment visual design (emoji scale, slider, etc. — just keep it low friction)
- Exact hero headline and body copy wordsmithing
- Welcome orb animation intensity (subtle pulse, not full recording animation)

</decisions>

<specifics>
## Specific Ideas

- "I liked the 3-second countdown before recordings begin" — this is the only timer element wanted
- Progress bar at top during recording — "like it has now" — existing pattern works
- Prototype HTML (kdenz-session-flow-prototype.html) is the visual north star — match its look and feel
- Phase 14 feedback to integrate:
  1. Profile setup should be part of signup/welcome flow, not a standalone dashboard card
  2. Navigation: hamburger (☰) + circular profile image button in top bar
  3. Activity/Progress content moved off dashboard (separate phase/page, not Phase 15 scope)
- Phase 13 feedback addressed: cards shown one at a time via carousel (not stacked), isolated focused view per card

</specifics>

<deferred>
## Deferred Ideas

- Activity/Progress page (dedicated page for "My Activity" and "Recent Sessions") — separate work, not Phase 15
- Dashboard redesign — Phase 17 / v2.1 with UX specialist
- Advanced persona features (avatar illustrations, voice, personality depth) — future enhancement

</deferred>

---

*Phase: 15-new-screens-core-flow*
*Context gathered: 2026-02-12*
