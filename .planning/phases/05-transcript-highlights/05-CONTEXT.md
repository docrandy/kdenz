# Phase 05: Transcript with Highlights - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Transcript display after session with toggle-able highlighting for fillers and pace. Hybrid filler detection: acoustic real-time + transcript-based reconciliation at session end. Transcript lives on the full evaluation page (separate from the quick post-session results page).

Transcript capture, display, filler reconciliation, filler/pace highlighting, and highlight toggle are in scope. Playback sync with transcript and AI summary are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Transcript location
- Full evaluation page (separate route from the quick post-session results page)
- This is the "deep review" destination — transcript + scorecard + detailed analysis

### Filler highlighting style
- **Needs research** — user wants evidence-based design
- Perplexity prompt: "What are best UX patterns for highlighting filler words and speaking pace variations in speech transcripts? Looking for examples of inline text highlighting from speech coaching, language learning, or transcript review tools. How do apps visually distinguish filler words vs pace issues in the same transcript?"

### Pace highlighting style
- **Needs research** — same Perplexity prompt covers this
- Toggle between filler highlights and pace highlights (only one visible at a time per requirements)

### Claude's Discretion
- Evaluation page layout (transcript placement, sidebar vs main content)
- Toggle UI for switching between highlight modes
- Transcript segment granularity (sentence-level, phrase-level)
- Hybrid filler detection reconciliation algorithm

</decisions>

<specifics>
## Specific Ideas

- The evaluation page is the "deep dive" — user goes here when they want to really study their session
- Toggle ensures visual clarity (one highlight type at a time, not overlapping colors)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 05-transcript-highlights*
*Context gathered: 2026-02-04*
