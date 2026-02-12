# Phase 06: Scorecard & AI Summary - Context

**Gathered:** 2026-02-04
**Updated:** 2026-02-05
**Status:** Planning complete - 3 plans ready for execution

<domain>
## Phase Boundary

Post-session scorecard with metrics summary, weekly trend chart, and optional AI-generated coaching insights via Gemini. Includes research-backed reflection prompts: self-assessment before metrics reveal (d=0.4 effect size) and implementation intentions after (d=0.5 effect size).

Scorecard display, metrics summary, weekly trend chart, Gemini integration, graceful degradation, self-assessment, and implementation intentions are in scope. Session history storage and achievement systems are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Scorecard layout
- **Resolved:** Use MetricCard components with foundation copy templates
- Each metric shows: value, confidence interval, baseline delta, context note, reflection prompt
- Copy verbatim from docs/foundation/copy/metric-card-templates-v1.md (LOCKED)

### Weekly trend chart placement
- **Resolved:** PostSessionResults page (visible after completing session)
- Removed judgment colors per Design Principle #2 - all bars use clinical-accent

### AI Summary prominence
- Secondary action — the session data and metrics are the star
- AI coaching insights are a bonus, not the main feature
- Button available but not the primary call-to-action
- Graceful degradation: any Gemini API error = show local stats only (no error state that blocks the user)

### Self-assessment (NEW from research)
- Self-assessment prompt appears BEFORE metrics reveal
- Research: d >= 0.4 effect size for transfer
- "How aware were you of your filler words?" (filler mode)
- "How did your speaking pace feel?" (pace mode)
- 5-point scale with neutral labels, skippable

### Implementation intentions (NEW from research)
- Implementation intention prompt appears AFTER metrics
- Research: d >= 0.5 effect size for transfer
- "When I notice myself about to say a filler word, I will ___"
- Suggestion chips + custom input, skippable

### Results page flow
1. Self-assessment (before any metrics visible)
2. Scorecard with metrics (after self-assessment complete/skipped)
3. Implementation intention prompt
4. Audio playback
5. Weekly trend chart
6. AI Summary (button-triggered)
7. Navigation buttons
8. View transcript link

Baseline sessions skip reflection prompts (go straight to metrics).

</decisions>

<specifics>
## Specific Ideas

- The evaluation page is the hub: scorecard + transcript + playback reference
- AI summary should feel like "bonus insight" not "the point of the app"
- Local stats must always work — AI is nice-to-have
- GAIN framework throughout: Goal, Ally, Impact, Non-judgmental
- No judgment colors (green/yellow/red) - use neutral clinical-accent

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

<plans>
## Plan Summary

| Plan | Wave | Focus | Files |
|------|------|-------|-------|
| 06-01 | 1 | Self-assessment + implementation intentions | SelfAssessment.tsx, ImplementationIntention.tsx, PostSessionResults.tsx |
| 06-02 | 1 | Scorecard with baseline deltas + uncertainty | MetricCard.tsx, Scorecard.tsx, PostSessionResults.tsx |
| 06-03 | 2 | Weekly trend chart + AI summary | PostSessionResults.tsx, WeeklyTrendChart.tsx, AISummary.tsx |

Wave 1: Plans 01 and 02 can execute in parallel (independent components)
Wave 2: Plan 03 depends on 01 and 02 (integrates all components)

</plans>

---

*Phase: 06-scorecard-ai-summary*
*Context gathered: 2026-02-04*
*Planning complete: 2026-02-05*
