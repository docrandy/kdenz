# Phase 14: Typography & Layout - Context

**Gathered:** 2026-02-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement Cormorant Garamond + Outfit font pairing, establish typographic scale, and refine layout for mobile-first usability. Address Phase 13 feedback: font sizes too small, brightness hierarchy needed, cards overwhelming, layout not conducive to learning. This phase does NOT add new screens (Phase 15-16) or redesign the dashboard (deferred Phase 17).

</domain>

<decisions>
## Implementation Decisions

### Font hierarchy & sizing
- Cormorant Garamond for headings + key elevated moments (breathing prompts, session titles, insight callouts); Outfit for body text, metrics, scores, and all other text
- Font scale targets Calm/Headspace aesthetic: large, generous, unhurried — increase current sizes by 2-3 levels
- Gentle brightness contrast: headings warm-white (#d4cbb8 range), body text slightly muted (#a09888 range) — subtle hierarchy, everything readable
- Gold accent (#c9a84c) usage in typography: Claude's discretion — use where it adds clarity without feeling overdone

### Card presentation & flow
- One card at a time, full-screen style — no stacked cards, no scrolling through all at once
- Navigation: swipe gestures on mobile + arrow/next-back buttons visible on all sizes
- Dot indicators at bottom showing position and total count
- Smooth slide transitions between cards (horizontal carousel feel)

### Information density & breathing room
- Card content grouping: Claude's discretion — group content however feels most learnable (themed sections vs single insight)
- Warnings (background noise, mic issues): subtle inline — small muted text or icon near relevant content, not interrupting
- "Take a breath" button: soft, diffused glow when active — inviting not blinding, text always readable
- Generous Calm-level spacing throughout — lots of breathing room, content feels spacious and meditative

### Mobile layout strategy
- Both phone and desktop are equal priorities — full experience on both devices
- Dashboard on mobile: horizontal card carousel (swipeable) — matches one-card-at-a-time pattern from results
- Desktop width: Claude's discretion — keep premium feel consistent across sizes
- Recording session: fully immersive — hide nav, status, everything except orb and essential controls

### Claude's Discretion
- Cormorant Garamond placement for "key moments" (exact components)
- Gold accent in typography (where, how sparingly)
- Card content grouping strategy (themed sections vs single insight per card)
- Desktop layout approach (centered max-width vs expanding grid)
- Exact typographic scale values and spacing tokens
- Loading skeleton and error state typography

</decisions>

<specifics>
## Specific Ideas

- "Think Calm or Headspace" — the overall font sizing and spacing reference point
- Phase 13 feedback drove most decisions: fonts too small, brightness hierarchy needed, cards stacked and overwhelming, "Take a breath" button surround too bright
- Recording session should feel immersive — only orb and essential controls visible
- Dashboard carousel on mobile matches the card-at-a-time pattern established for post-session results

</specifics>

<deferred>
## Deferred Ideas

- Dashboard full redesign — Phase 17 (v2.1 with UX specialist)
- Background noise warning sensitivity tuning — separate fix (not typography/layout)

</deferred>

---

*Phase: 14-typography-layout*
*Context gathered: 2026-02-12*
