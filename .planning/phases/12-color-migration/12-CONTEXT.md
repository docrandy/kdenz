# Phase 12: Color Migration - Context

**Gathered:** 2026-02-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Systematically replace the v1.0 clinical palette (white background, black text, teal accent) with the v2.0 dark premium palette (dark navy, gold accent, cream text) across ~51 files. Design tokens from Phase 11 are the target — this phase migrates existing hardcoded colors to semantic tokens and removes the old clinical palette. No new components or features.

</domain>

<decisions>
## Implementation Decisions

### Accent glow & gradient character
- Warm & luxurious feel — soft gold radiance, not electric/neon
- Think candlelight or premium jewelry lighting, not Peloton/gaming energy
- Gold accent used sparingly — reserved for primary CTAs only
- Secondary interactive elements (links, toggles, secondary buttons) use cream/white tones
- Gold stays special by being rare

### Status colors on dark
- Muted & sophisticated — desaturated tones (sage green, dusty rose, muted amber)
- Status colors should be visible but not scream — blend with premium aesthetic
- No garish saturated primaries on dark navy

### Claude's Discretion
- **Hover/focus effects:** Choose treatment matching warm & luxurious direction (subtle brightening vs glow aura)
- **Gradient text placement:** Determine where gradient gold text adds impact without overuse
- **Status background tints:** Decide per-context whether badges get tinted surfaces vs text-only color
- **Scorecard score colors:** Balance quick readability with muted aesthetic (may be slightly more vivid than general status)
- **Filler word highlight treatment:** Choose visible-but-not-jarring approach on dark (gold underline, rose tint, or other)
- **Card/panel depth strategy:** Lighter surfaces, subtle borders, or combination — whatever creates clean depth on dark
- **Disabled & loading states:** Opacity-based vs distinct muted colors — pick what looks right
- **Shadow treatment on dark:** Rethink light-mode shadows for dark context (may need glow, border, or brightness-based alternatives)

</decisions>

<specifics>
## Specific Ideas

- The overall direction is "premium restraint" — gold is the signature but should feel earned, not sprayed everywhere
- Status colors should feel like they belong in the same family as the gold/navy/cream palette, not like bolted-on Bootstrap defaults
- The prototype HTML (kdenz-session-flow-prototype.html) is the visual target for the final look

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-color-migration*
*Context gathered: 2026-02-11*
