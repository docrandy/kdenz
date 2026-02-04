# Phase 04: Playback with Filler Highlighting - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Audio playback with filler markers on the timeline. User can play back their recorded session, see where filler words occurred, and tap markers to jump to those moments. Playback lives on the post-session results page (same viewport, no scrolling). A separate full evaluation page also exists for deeper review. Playback speed controls included.

Playback UI, filler markers on timeline, tap-to-seek, and speed controls are in scope. Transcript display, scorecard, and AI summary are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Playback location
- Playback controls live on the existing post-session results page (Phase 02's PostSessionResults)
- Everything fits within one viewport — no scrolling required
- User can play back right there for a quick review, or navigate to a separate full evaluation page for deeper analysis
- Playback widget should integrate cleanly into the existing results page layout

### Filler markers on timeline
- **Needs research** — user wants evidence-based design for this
- Perplexity prompt: "What are the best UX patterns for visualizing speech disfluencies (filler words like um, uh, like) on an audio playback timeline? Looking for examples from speech coaching apps, podcast editors, or language learning tools. How do they mark specific moments on a waveform or scrub bar so users can tap to jump to that spot?"

### Speed controls
- Claude's discretion on prominence and available speeds

### Claude's Discretion
- Playback UI component design (play/pause button, scrub bar style)
- Speed control prominence and values
- How to fit playback into the existing results page without scrolling
- Audio blob storage approach (memory vs sessionStorage vs IndexedDB)

</decisions>

<specifics>
## Specific Ideas

- No scrolling on the post-session page — playback must fit within the existing viewport
- The post-session page becomes a quick-review hub: summary + stats + playback
- Separate full evaluation page (Phase 05/06) handles deeper analysis

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-playback-filler-highlighting*
*Context gathered: 2026-02-04*
