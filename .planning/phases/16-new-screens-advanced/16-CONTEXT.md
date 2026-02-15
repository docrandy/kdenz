# Phase 16: New Screens — Advanced - Context

**Gathered:** 2026-02-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Build 5 advanced screens (Analysis Loader, Voice Profile, Practice Bridge, Breathing, Before/After) that complete the v2.0 Dark Premium Transformation. All screens use current localStorage data only — no backend shells, no "coming soon" placeholders. SCR-12 (design system compliance) applies to all screens.

Requirements: SCR-07 through SCR-12

</domain>

<decisions>
## Implementation Decisions

### Analysis Loader (SCR-07)
- Appears immediately after session recording stops, before post-session results
- Replaces the current abrupt transition to results
- Wraps existing processing (Gemini AI summary generation) into a premium loading experience
- Visual: animated progress with step indicators ("Analyzing your session...", "Detecting patterns...", "Generating insights...") — NOT the SessionOrb (orb is associated with recording only)
- Custom thinking/analyzing animation — something that conveys processing/intelligence
- Minimum 3 seconds display time even if processing completes faster (perceived thoroughness)
- After completion, transitions to PostSessionResults

### Voice Profile (SCR-08)
- Personal stats dashboard built from real session data in localStorage
- Data sources: filler counts, filler rate, WPM, session durations, session history, common filler words
- No placeholder sections for future features (Hume, prosody, emotion) — only show what works today
- Visual format: stat cards with trend arrows (like a fitness app dashboard)
- Always accessible even with 0 sessions — show friendly message "Complete your first session to see your profile" with illustration for empty state; contextualize sparse data ("Record more sessions to unlock trends") rather than blocking access
- Accessible as a dedicated page from the hamburger menu
- Before/After comparison section embedded within this page (see SCR-11)

### Practice Bridge (SCR-09)
- Appears after post-session results as a "What's next?" interstitial before going home
- Driven by simple performance-aware IF/THEN rules (not a real recommendation engine):
  - If practiced filler and rate was high → suggest filler practice again with encouragement
  - If practiced filler and rate was low → suggest pace practice or technique practice
  - If practiced pace → suggest filler or technique
  - If practiced technique → suggest a different technique or free practice
- Always skippable — prominent "Done for today" button alongside the suggestion
- Design the suggestion to be genuinely compelling (motivational framing, show potential benefit)
- User never feels trapped

### Breathing Screen (SCR-10)
- Available in two contexts: (1) offered pre-session as warm-up between setup and countdown, (2) accessible standalone from navigation anytime
- Default pattern: box breathing (4-4-4-4: inhale 4s, hold 4s, exhale 4s, hold 4s)
- Duration: user-controlled — "Until you're ready" with tap/button to end. Show cycle count for awareness
- Always offered pre-session with a visible "Skip" button — never hidden, never mandatory
- Animated breathing visualization (expand/contract circle or similar)

### Before/After Comparison (SCR-11)
- Metrics compared: same metrics shown on the post-session scorecard (keep consistent)
- Self-comparison only — never compare to other users or benchmarks. Only compare user against their own history
- Default comparison: most recent session vs. first session (or baseline), with option for user to change selection
- Visual format: side-by-side cards (Session A | Session B) with delta indicators (percentage change, arrows)
- Lives as a section within Voice Profile page (SCR-08)
- Also linkable from post-session results ("Compare with previous")

### Design System Compliance (SCR-12)
- All 5 screens follow the dark premium design system (dark navy + gold accent)
- Use existing design tokens, semantic CSS variables, Tailwind classes from Phase 11-12
- Typography: Cormorant Garamond headings, Outfit body text from Phase 14
- Empty states: friendly illustration + contextual message (consistent style across all screens)

### Claude's Discretion
- Exact animation design for Analysis Loader (specific keyframes, easing)
- Stat card layout and spacing on Voice Profile
- Breathing circle animation implementation details
- Exact routing structure for new pages
- Loading skeleton designs
- Responsive breakpoints for new screens
- Transition animations between screens

</decisions>

<specifics>
## Specific Ideas

- Analysis Loader should feel like "intelligence at work" — thinking/analyzing, not just waiting. Step indicators create sense of thoroughness.
- SessionOrb is strictly associated with recording/sessions — do NOT reuse it for the loader animation.
- Voice Profile is an honest stats dashboard — no vanity metrics, no fake "voice fingerprint". Real numbers from real practice.
- Breathing screen should feel calming and premium — the animation IS the feature.
- Before/After should deliver the "look how far you've come" moment — the motivational payoff for consistent practice.
- Practice Bridge should feel like a coach suggesting your next move, not a system demanding more reps.

</specifics>

<deferred>
## Deferred Ideas

- Dashboard redesign — Phase 17 (v2.1 with UX specialist)
- Hume prosody integration for Voice Profile — Phase D (backend integration)
- Real recommendation engine for Practice Bridge — Phase E
- VCM diagnostic engine (Analysis Loader currently wraps Gemini summary, not real VCM) — Phase D
- Multiple breathing patterns (4-7-8, custom) — stretch goal, not required
- Voice Profile radar/spider chart — needs more data dimensions from Hume before meaningful
- Communication Index score — deferred per D11 (post-Hume integration)

</deferred>

---

*Phase: 16-new-screens-advanced*
*Context gathered: 2026-02-14*
