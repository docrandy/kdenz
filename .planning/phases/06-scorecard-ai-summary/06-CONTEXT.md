# Phase 06: Scorecard & AI Summary - Context

**Gathered:** 2026-02-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Post-session scorecard with metrics summary, weekly trend chart, and optional AI-generated coaching insights via Gemini. Scorecard lives on the evaluation page alongside transcript (Phase 05). AI summary is a secondary action — the data itself is the primary value.

Scorecard display, metrics summary, weekly trend chart, Gemini integration, and graceful degradation are in scope. Session history storage and achievement systems are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Scorecard layout
- **Needs research** — user wants evidence-based design on what to show and how
- Perplexity prompt: "What metrics and layout patterns do speech coaching and language learning apps use for post-session results pages? What data has been shown to be most valuable for users improving their speaking skills? Looking for evidence on what to display prominently vs secondary, and effective dashboard layouts for practice session summaries."

### Weekly trend chart placement
- Claude's discretion on whether dashboard or evaluation page

### AI Summary prominence
- Secondary action — the session data and metrics are the star
- AI coaching insights are a bonus, not the main feature
- Button available but not the primary call-to-action
- Graceful degradation: any Gemini API error = show local stats only (no error state that blocks the user)

### Claude's Discretion
- Scorecard component design and metrics layout
- Trend chart library choice and visual style
- Gemini prompt engineering for coaching insights
- Where trend chart lives (dashboard vs evaluation page)
- How to surface AI summary without making it feel required

</decisions>

<specifics>
## Specific Ideas

- The evaluation page is the hub: scorecard + transcript + playback reference
- AI summary should feel like "bonus insight" not "the point of the app"
- Local stats must always work — AI is nice-to-have

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-scorecard-ai-summary*
*Context gathered: 2026-02-04*
