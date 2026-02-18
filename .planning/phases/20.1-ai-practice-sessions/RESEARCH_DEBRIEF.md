# Research: Session Debrief Design
*Agent 5 of 5 — Phase 20.1 Research*

---

## Summary

The research across fitness apps (Peloton, WHOOP, Apple Fitness), therapy apps (Woebot, Noom), language apps (Duolingo), and simulation training (military AAR) converges on a single principle: the optimal debrief surfaces one dominant insight at emotional peak, not a wall of data. The "peak-end rule" (Kahneman 1993) governs how users remember the session — they judge the whole by the most intense moment and the final impression — making the debrief the single highest-leverage surface in the product. Growth-mindset framing research (Dweck) confirms that pattern labels must be framed as present-tense behavioral tendencies ("you tend to hedge") never fixed-identity ("you are a hedger"), and the one-next-step CTA model outperforms menu-of-options by eliminating the paradox of choice.

---

## Debrief Structure Recommendation

The research supports a five-section debrief rendered as a **sequential reveal** (not all visible at once), ordered to follow the emotional arc of a session and respect cognitive load limits.

### Recommended Section Order

**1. The Reveal (What You Missed)**

*Receiving biofeedback first — the "holy shit moment"*

- Show: The character's real subtext, briefly named ("Carol's real fear was being forgotten, not being overruled.")
- Show: The gap between what was said and what was meant — one sentence, not a breakdown
- Why first: This is the highest-intensity moment. Peak-end rule says the user will remember the session primarily by this moment. Lead with it. Do not bury it behind scores.
- Platform precedent: Noom uses CBT "behavior chain" reveals as the emotional anchor before prescriptions. Woebot names the cognitive distortion before offering reframing. Both lead with insight, not performance data.
- Design constraint: Do not show numeric scores in this section. The insight is not a grade. It is a mirror.

**2. What You Signaled (Sending Biofeedback)**

*One-paragraph synthesis of the user's communication pattern this session*

- Show: 2-3 specific behavioral observations from the session ("Your label in exchange 3 was syntactically correct but you ended with 'right?' — turning it into a question. This closed the space you just opened.")
- Show: Pattern name (see Growth-Mindset Framing section below)
- Hide: Individual turn-level scores, technique-by-technique breakdown, composite numbers
- Why here: This section follows the receiving reveal because users are now emotionally activated and curious about their own role. The receiving reveal creates the receptivity; the sending channel delivers into it.
- Research basis: Self-determination theory (Deci and Ryan) shows feedback must support competence perception — showing too much deficit data simultaneously undermines it. One coherent narrative > five separate scores.

**3. Your Growth Edge**

*One specific behavior to focus on in the next session*

- Show: A single, concrete behavioral target ("In your next session, try completing the label without adding a question at the end. Hold the silence.")
- Show: Why this edge matters (one sentence connecting it to the user's aspiration or pattern)
- Hide: Multi-step practice plan, prioritized list of weaknesses, anything that reads as a diagnosis
- Why here: Coming after the two-channel reveal, users are at peak receptivity for a prescription. The research on coaching apps (BetterUp, Rocky.ai) shows that growth edge framing — "your next move is X" — outperforms deficit framing — "you need to fix Y." One specific behavior, not a list.
- Research basis: Military AAR methodology (US Army Foundations of AAR, DTIC) identifies "formalize learning by reviewing what to do differently in a similar situation" as the final and most retained step. One actionable takeaway, not five.

**4. Your Next Step**

*One recommended action — drill or Institute item — with personal context*

- Show: One drill OR one Institute item (not both) — whichever closes the identified growth edge
- Show: "Why this for you" — one sentence connecting the item to the user's pattern and aspiration ("You've identified as a Hedger. This drill specifically targets the moment of commitment — the pause after the label. Three minutes.")
- Hide: Skill tree, full curriculum sequence, menu of options
- Why here: Single CTA at the moment of highest receptivity. Research on CTA design (GetUplift, CrazyEgg) shows single-CTA experiences increase completion 45%+ vs. multiple options. Emails with one CTA receive 371% more clicks than multi-CTA emails. The same principle applies to post-session routing.
- Design constraint: The "one next step" is not a dashboard link. It is a direct launch button. "Start this drill" goes immediately into the drill, not into the Skills Lab overview.

**5. Progress Signal**

*A minimal, forward-looking indicator of aspiration gap movement*

- Show: One visual indicator of trend — not a score, but a direction signal ("Your labels are getting cleaner. Session 4 → Session 5: less hedging detected.")
- Show: Pattern evolution across sessions (only after 3+ sessions of data — first session shows aspirational target only)
- Hide: Full analytics, session-by-session breakdown, numeric mastery percentages
- Why last: Progress data belongs at the end, not the beginning. Users who see scores first read the debrief as a report card. Users who see insight first read it as a mirror. The progress signal validates the session without defining it.
- Research basis: Duolingo streak research shows that progress continuity motivates return sessions more than absolute score. WHOOP recovery score design — a single color-coded percentage with a one-line interpretation — demonstrates that synthesized single-metric presentation is more actionable than multi-metric breakdowns.

---

## Growth-Mindset Framing Principles

The pattern name ("Hedger," "Surface Reader") is the single most psychologically sensitive element in the debrief. Research on label effects (Dweck; Label-Feedback Hypothesis, PMC) is unambiguous: fixed-identity labels reduce engagement and persistence. Behavioral tendency labels increase them.

### The Core Distinction

**Fixed-identity (avoid):** "You are a Hedger."
**Behavioral tendency (use):** "You tend to hedge when the stakes feel high."

The difference is permanent vs. current. The pattern name must read as a snapshot of current behavior, not a diagnosis of character.

### Language Patterns to Use

- "In your sessions so far, you tend to..." — temporal framing, pattern observed across sessions
- "Your default when uncertainty is present is..." — describes a behavior in a specific context
- "Right now, your communication style shows..." — "right now" implies it is changeable
- "This is a common pattern for communicators who..." — normalizes without pathologizing
- "Communicators at this stage often..." — locates the user in a developmental arc, not a fixed category

### Language Patterns to Avoid

- "You are [pattern name]" — identity fusion
- "Your problem is..." — deficit framing
- "You always..." / "You never..." — universal quantifiers create fixed mindset
- "You need to work on..." — passive deficit frame
- Clinical or diagnostic vocabulary ("avoidant," "resistant," "disengaged")

### Introducing the Pattern Name for the First Time

When the pattern name appears for the first time (session 3+ per 20.1 CONTEXT requirements for 3+ consistent signals), the reveal should follow a three-part structure:

1. **Observation:** "Across your sessions, we've noticed a consistent pattern..." (neutral, observed)
2. **Name:** "Communicators who do this tend to fall into what we call the 'Hedger' pattern." (name delivered after context, not before)
3. **Reframe:** "This pattern often emerges from expertise — people who know the nuance hedge because they want to be accurate. The skill is learning to commit to the label anyway." (connects pattern to a strength, not a flaw)

This three-part sequence mirrors Noom's "behavior chain" reveal structure and Woebot's cognitive-distortion naming protocol. Both surface the label as a consequence of observation, not as a verdict.

### Pattern Name as Identity Aspiration Tool

Research on Atomic Habits (Clear) and identity-based habit formation shows that users adopt new behaviors most reliably when they can see themselves becoming a different type of communicator, not just fixing a bad habit. The platform should:

- Pair the current pattern name with an aspiration pattern ("You're currently a Hedger. The path to [stated aspiration] goes through Commitment Communicator. Here's what that shift looks like.")
- Show the pattern name as a stage, not a destination
- Use the aspiration gap visualization to make the journey concrete (see next section)

---

## Data Volume Guidance

The fundamental failure mode in session debrief design is information overload at the moment of highest emotional activation. Cognitive load theory (Miller's Law; Smashing Magazine, NN/G) establishes that working memory handles ~7 items simultaneously. After an emotionally intense simulation session, effective working memory is further reduced.

### What to Show

| Data Point | Rationale |
|---|---|
| The character's real subtext (1 sentence) | Core insight — the "holy shit moment" — must be explicit |
| 2-3 specific behavioral observations from the session | Concrete enough to act on; abstract enough to not overwhelm |
| Pattern name + one-line framing | Self-identification is the product's core value prop |
| Growth edge (1 behavior, 1 session) | Single actionable target |
| One next step with direct launch | Eliminates paradox of choice; drives completion |
| Trend direction signal (not score) | Progress continuity without report-card framing |

### What to Hide

| Data Point | Rationale |
|---|---|
| Composite numeric session score | Creates report-card framing; undermines insight framing |
| Per-technique scores (form/accuracy/impact) | Belongs in Skills Lab per-drill feedback, not session debrief |
| Full skill tree / mastery percentages | Cognitive overload; belongs on dashboard, not debrief |
| VCM gate status | Internal only (CLAUDE.md constraint: diagnose internally, intervene externally) |
| All Institute items for this pattern | Menu of options kills completion; surface only the one most relevant item |
| Session-by-session numeric trend charts | Too early (first few sessions have no baseline); defer to dashboard |

### Progressive Disclosure Architecture

The debrief screen should reveal sections sequentially, not all at once. Research on progressive disclosure (NN/G, IxDF) shows that showing users only the most essential information first — and revealing more only on interaction — reduces cognitive load and increases engagement per section.

**First state (on debrief load):** Section 1 only — the Reveal. Full screen. No scrolling needed.
**After user reads and taps "Next":** Section 2 (Sending Biofeedback) + Pattern Name appear.
**After user reads and taps "Next":** Growth Edge + Next Step appear together.
**After tapping "I'm ready":** Progress Signal + CTA to launch next step.

This is consistent with how Woebot structures its CBT modules: one insight per card, explicit user control of pacing, no information forced on screen simultaneously.

---

## Aspiration Gap Visualization

### The Core Design Problem

The aspiration gap is the distance between "who you are as a communicator right now" and "who you want to become." This is abstract. The visualization must make it concrete without overwhelming the user or making the gap feel discouraging.

### Recommended Visualization: The Trajectory Signal

Not a static gap chart. Not a radar chart (too abstract for a session debrief context, though useful for a dedicated dashboard). Instead, a **trajectory signal** — a minimal visual that shows direction and momentum.

**Visual form:** A single horizontal track with:
- Left anchor: Current pattern name ("Hedger")
- Right anchor: Target aspiration ("The FM DJ — calm authority under pressure")
- A marker showing current position that moves session over session
- A trend arrow showing recent movement direction (toward target or away)

**Data requirements:** The marker position is calculated from behavioral signal density across sessions (hedging frequency, label commitment rate, pause holding). It does not require Hume (transcript signals alone are sufficient in Phase 20.1; Hume data refines it in Phase D).

**When to show:** Only after 2+ sessions. First session: show aspirational target only ("Here's where we're headed") without a current-state marker. Adding a marker on session 1 before baseline is established is misleading.

**Design constraint:** This visualization is 1/5 of the debrief screen. It should not be the first thing seen. It belongs in Section 5 (Progress Signal). Making it prominent turns the debrief into a performance dashboard and undermines the insight-first architecture.

### Radar Chart: For Dashboard, Not Debrief

Radar charts (skill dimension overlay — current vs. target across 5-6 dimensions) are appropriate for the dedicated Communication Identity Dashboard (out of scope for Phase 20.1). They require multi-session baseline data to be meaningful and are cognitively demanding for a post-session context. Reserve for dashboard; do not use in debrief screen.

### The WHOOP Model Applied

WHOOP's single recovery percentage synthesizes 6+ physiological variables into one actionable number with a color-coded interpretation. This is the right model for the debrief's progress signal: synthesize multiple behavioral signals into one direction indicator ("Moving toward target / Holding / Moving away") with a one-line interpretation. Numeric precision is false precision at this stage; directional signal is more honest and more motivating.

---

## CTA Design

### The One Next Step Model

Every data point reviewed confirms the one-next-step model outperforms the menu model for post-session action:

- Single CTA emails: 371% more clicks than multi-CTA (Campaign Monitor)
- Reduced onboarding steps by 30%: 50% increase in completion (UserGuiding)
- 35% fewer users start a single-CTA form — but 45% more complete it (GetUplift)
- Choice overload (Paradox of Choice): more options = less action, less satisfaction with the choice made

The implication for KDENZ debrief is decisive: **surface exactly one action**, not a menu. The system chooses the best next step (drill or Institute item) based on the diagnosed growth edge. The user does not choose from a list.

### What "One Next Step" Looks Like

```
[Section 4 card]
Your Next Step

"Your label technique is clean, but you're hedging at the end.
This drill targets exactly that moment — the pause after the label,
before you undercut it with a question."

[Button: Start "Labeling — Commitment Hold" Drill →]
[Small link: "See all practice options" — secondary, text-only]
```

The primary CTA is a direct drill launch. The secondary "see all options" link (text-only, not a button) preserves user agency without presenting it as a choice. Research on coaching app onboarding (UserGuiding) confirms that 65% higher completion rates come from personalized, not generic, flows. The "why this for you" sentence is what makes it feel personalized, not algorithmic.

### Timing: Immediate Launch vs. Scheduled Next Session

The debrief CTA should offer **immediate launch** as the primary option. Research on behavior change (Noom's 4-Cs framework, BetterUp coaching data) shows that follow-through drops dramatically when an action is deferred to the next session. The moment of highest receptivity is right now, not tomorrow.

Optional secondary: "Schedule for tomorrow" (text-only link). This activates implementation intention (research: people who schedule a specific time for a behavior are 2-3x more likely to complete it than those who intend to "do it later").

---

## Implementation Notes for Planning

### Screen Structure

The debrief renders as a **5-section sequential card stack**, not a single scrollable page. Each section is a full-width card. User advances manually with a "Next" tap (or swipe). This is a deliberate choice — auto-scroll or full-page reveals undermine the pacing and emotional arc.

```
Screen flow:
[Card 1: The Reveal] → tap "Next" →
[Card 2: What You Signaled] → tap "Next" →
[Card 3: Growth Edge] → tap "Continue" →
[Card 4: Your Next Step] → tap "Start Drill →" (primary) or "See all options" (secondary) →
[Card 5: Progress Signal] → tap "Done" → return to home
```

Cards 3 and 4 may be combined into one card if both are short (combined word count under 120 words). Cards 1 and 2 must always be separate — the reveal and the self-reflection need different emotional space.

### Gemini Output Schema (Call 3 — Debrief Synthesis)

The debrief is generated by a single Gemini call at end of session (per 20.1-CONTEXT.md, Call 3). The output schema must map directly to the 5-section card structure:

```typescript
interface SessionDebrief {
  // Card 1: The Reveal
  characterSubtext: string          // 1 sentence: what the character was really feeling/needing
  missedSignal: string             // 1 sentence: what the user responded to vs what was actually signaled

  // Card 2: Sending Biofeedback
  behavioralObservations: string[] // 2-3 specific observations from the session (turn-referenced)
  patternName: string              // e.g., "Hedger" — delivered with framing sentence
  patternFraming: string           // the "you tend to X when Y" sentence

  // Card 3: Growth Edge
  growthEdge: string               // single behavior, one session, concrete
  growthEdgeContext: string        // why this edge matters (aspiration connection)

  // Card 4: Next Step
  nextStepType: 'drill' | 'institute'
  nextStepId: string               // drill technique ID or Institute content ID
  nextStepTitle: string            // display name
  nextStepPersonalization: string  // "why this for you" — 1 sentence

  // Card 5: Progress Signal
  trajectoryDirection: 'toward_target' | 'holding' | 'away_from_target'
  trajectoryNote: string           // 1 sentence interpretation ("Your labels are getting cleaner...")
  sessionNumber: number            // for "first session" suppression of marker
}
```

### Gemini Prompt Requirements

The debrief prompt (Call 3) must receive:
- Full session conversation history (all exchanges)
- All pattern notes accumulated during session (from Call 2 outputs)
- User's aspiration profile (`kdenz:user-aspiration` — their stated voice/comm identity target)
- Pattern history from prior sessions (`kdenz:pattern-history` — rolling 10 sessions)
- Institute content catalog excerpt (top 5 candidates filtered by pattern + aspiration, for Gemini to select best one)

Temperature: 0.4 (slightly more expressive than scoring calls; the coaching text should feel human)
Max tokens: 600 (enough for all 5 card contents; enforce structured JSON output)

### UI Components Needed

| Component | Notes |
|---|---|
| `DebriefCardStack` | Container managing card progression, swipe/tap navigation |
| `RevealCard` | Card 1 — full-bleed, high contrast, cinematic reveal aesthetic |
| `SendingFeedbackCard` | Card 2 — includes pattern name badge with appropriate framing |
| `GrowthEdgeCard` | Card 3 — focused single-behavior framing |
| `NextStepCard` | Card 4 — primary CTA button + secondary text link |
| `ProgressSignalCard` | Card 5 — trajectory visualization + trend note |
| `PatternNameBadge` | Reusable: pattern name with "tendency" framing, non-pill/non-diagnostic styling |
| `TrajectoryIndicator` | Simple track with current position + direction arrow |

### Framing Guidance for Gemini Prompts

The system prompt for Call 3 must include explicit framing rules to prevent fixed-identity language:

```
Framing rules for debrief output:
- NEVER use "you are [pattern]" — always use "you tend to X when Y"
- Pattern name must appear AFTER a behavioral observation, never first
- Growth edge must be framed as "in your next session, try..." not "you need to work on..."
- Trajectory note must be forward-looking ("your labels are getting cleaner") not backward-looking ("you hedged less")
- Do not use clinical, diagnostic, or deficit language
- The tone is a skilled coach who sees what the user cannot yet see about themselves — not a judge
```

### First-Session Handling

Session 1 debrief is different:
- No pattern name yet (not enough data — per 20.1-CONTEXT, pattern only set after 3+ consistent signals)
- Card 2 shows behavioral observations only, no pattern name
- Card 5 (Progress Signal) shows aspirational target only, no current-state marker ("Here's where we're headed. Your sessions will map your progress toward it.")
- This sets up the aspiration gap visualization without producing false data on first session

### Edge Cases

**If Gemini times out on debrief call:**
- Show a simplified debrief: character subtext only (from session state object) + one recommended drill (rule-based: the primary technique used in this scenario)
- Message: "Full session analysis is being prepared. Come back in a few minutes to see the complete debrief."
- Do not block the user from the Next Step CTA

**If pattern history has no consistent signals (3+ sessions but no dominant pattern):**
- Do not force a pattern name
- Card 2 shows: "Your communication style is still calibrating. We're seeing a range of approaches — which is actually a good sign. Here's what stood out this session: [observations]"
- Growth edge still generated from session behavior
- Pattern name deferred to session 4 or 5

**If user is at aspiration target (high trajectory score):**
- Reframe Card 5 away from gap language: "You're expressing [aspiration pattern] consistently. The next frontier is [more advanced skill]."
- This prevents the progress indicator from feeling like a ceiling

---

*Research complete: 2026-02-18*
*Sources: Peak-end rule (Kahneman 1993), SDT (Deci & Ryan), AAR meta-analysis (PubMed), Dweck growth mindset, Noom behavior chain design, Woebot CBT sequencing, WHOOP single-metric synthesis, Duolingo streak psychology, CTA research (GetUplift, Campaign Monitor), progressive disclosure (NN/G), cognitive load theory (Smashing Magazine, IxDF), Bloom LLM behavior change platform research (arXiv 2025)*
