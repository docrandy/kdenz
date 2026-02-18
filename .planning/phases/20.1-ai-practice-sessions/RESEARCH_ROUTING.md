# Research: Personalized Curriculum Routing
*Agent 4 of 5 — Phase 20.1 Research*

---

## Summary

Adaptive learning platforms personalize curriculum paths through tagged content
libraries and learner profile matching — content-based filtering is the right
approach for KDENZ at beta scale because collaborative filtering requires large
user datasets that don't exist yet. The session debrief is a validated "teachable
moment" — the window of highest receptivity — and research consistently shows that
brief, contextually framed content surfacing (1-2 items, personally explained) at
this moment is far more effective than menus or dashboards. The minimum viable
tagging schema for a 50-100 item Institute is smaller than expected: six tag fields
are enough to route accurately, and the routing algorithm itself should be rule-based
(not ML) for the first 3-6 months.

---

## Content Tagging Schema

### Design Principles from Research

Learning object metadata standards (IEEE 1484.12.1, 1EdTech) define comprehensive
schemas with 50+ fields, but the research consistently shows that "bigger isn't
always better" — a small catalog with 50-100 items needs 6-8 well-chosen fields,
not 50. Key guidance from ATD research on skills tagging for training content:
a single topical taxonomy is insufficient because there is ambiguity between skill
level and training format. Multiple orthogonal tag dimensions are needed.

The taxonomy needs to answer four routing questions:

1. Does this item address the user's diagnosed pattern?
2. Does it build toward the user's stated aspiration?
3. Is the user ready for it (skill prerequisites met)?
4. Is this the right format for this moment (post-debrief vs. Institute browse)?

### Recommended Schema

```typescript
interface InstituteContentItem {
  // Identity
  id: string
  title: string
  slug: string

  // Format (drives UX rendering + routing logic)
  content_type: 'video_explainer' | 'video_demo' | 'before_after' | 'article' |
                'annotated_example' | 'exercise' | 'quiz'

  // Primary routing dimensions (arrays allow multi-tagging)
  technique_ids: string[]           // e.g., ['labeling', 'accusation-audit', 'mirroring']
  addresses_patterns: string[]      // e.g., ['hedger', 'surface-reader', 'fix-it']
  supports_aspirations: string[]    // e.g., ['boardroom-authority', 'warm-connector']
  vcm_gates: string[]               // internal: ['awareness', 'belief', 'initiation']

  // Sequencing
  prerequisite_ids: string[]        // what must be consumed/practiced first
  tier: 1 | 2 | 3                   // 1 = foundational, 2 = applied, 3 = integrative
  practice_before_exposure: boolean // true = user must attempt drill first

  // Metadata for surfacing quality
  duration_minutes: number
  difficulty: 'intro' | 'standard' | 'advanced'
  debrief_eligible: boolean         // true = safe to surface in post-session debrief
  debrief_hook: string              // 1-2 sentence personal explanation for debrief card
                                    // e.g., "You've been hedging your labels. This shows why."
}
```

### Tag Value Vocabularies

**content_type** (exhaustive, no custom values):
- `video_explainer` — concept explanation (what is this technique, why it works)
- `video_demo` — technique demonstrated in a real or role-play context
- `before_after` — same scenario done badly vs. well
- `article` — text explainer with examples
- `annotated_example` — transcript or dialogue with technique callouts
- `exercise` — active practice (not drill-engine; guided reflection or writing)
- `quiz` — knowledge check

**technique_ids** (draw from the existing 57+ technique taxonomy in R8/R13):
Use the canonical technique slugs already defined. No new IDs created here.

**addresses_patterns** (draw from Pattern Taxonomy — see RESEARCH_PATTERNS.md):
These must match the finalized pattern slugs exactly.
Expected values once patterns are locked: `hedger`, `surface-reader`, `fix-it`,
`rationalizer`, `deflector`, `over-validator`, `bulldozer`, `avoidant-silence`
(exact list TBD from RESEARCH_PATTERNS.md output).

**supports_aspirations** (draw from Aspiration Framework — see RESEARCH_ASPIRATION.md):
Expected values: `boardroom-authority`, `warm-connector`, `trusted-advisor`,
`calm-presence`, `fm-dj-voice`, `clear-communicator` (TBD from RESEARCH_ASPIRATION.md).

**vcm_gates** (internal, never shown to user):
`awareness`, `desire`, `belief`, `intention`, `initiation`, `persistence`,
`recovery`, `integration`

**tier** (sequencing):
- 1 = foundational — someone new to the technique can access this
- 2 = applied — requires some technique exposure (via drill or prior content)
- 3 = integrative — requires cross-technique competence (simulation-ready)

### Minimum Viable Tagging for Beta

For a 50-100 item Institute at beta launch, the REQUIRED fields are:

```
technique_ids, addresses_patterns, content_type, practice_before_exposure,
duration_minutes, tier, debrief_eligible, debrief_hook
```

`supports_aspirations`, `vcm_gates`, and `prerequisite_ids` are important for
long-term routing quality but can default to empty arrays at beta — the system
degrades gracefully to pattern + technique routing when aspiration and VCM data
are absent.

---

## Routing Algorithm Design

### Why Rule-Based, Not ML

Research on educational recommender systems is consistent: collaborative filtering
(what users similar to you engaged with) requires large datasets and fails on cold
start. Content-based filtering (match item tags to user profile) works from session
one. For KDENZ at beta scale (dozens to hundreds of users), content-based + rule-
based is the right architecture. Graduate to ML after 3-6 months of behavioral data,
consistent with the VCM diagnostic architecture decision.

### Learner Profile Object

The routing algorithm consumes this profile object, assembled from multiple sources:

```typescript
interface LearnerProfile {
  // From session debrief (latest session wins, rolling history preserved)
  current_pattern: string | null        // e.g., 'hedger' (null until first session)
  pattern_history: string[]             // last 10 session patterns (for evolution tracking)
  pattern_confidence: 'low' | 'medium' | 'high'  // how many sessions confirm pattern

  // From onboarding / profile settings (user-stated)
  stated_aspiration: string | null      // e.g., 'boardroom-authority'
  aspiration_set_at: string             // ISO date

  // From Skills Lab mastery tracking
  mastered_technique_ids: string[]      // techniques at Proficient or above
  attempted_technique_ids: string[]     // techniques at any level
  skill_gaps: string[]                  // techniques flagged below threshold

  // From Institute progress tracking
  consumed_content_ids: string[]        // items read/watched/completed
  prescribed_content_ids: string[]      // items surfaced in debrief (clicked or not)
  dismissed_content_ids: string[]       // user explicitly dismissed

  // From VCM diagnostics (internal only)
  vcm_gate_failures: string[]           // which gates are flagged (never shown to user)
}
```

### Routing Function (Pattern + Aspiration → Content Sequence)

```
function routeContentForUser(profile: LearnerProfile, context: 'debrief' | 'institute_browse'):
  InstituteContentItem[]

STEP 1 — Build candidate pool
  candidates = all Institute items where:
    - id NOT IN profile.consumed_content_ids
    - id NOT IN profile.dismissed_content_ids
    - tier <= current_tier_ceiling (see tier ceiling calculation below)
    - prerequisites met (all prerequisite_ids in consumed OR mastered_technique_ids)

STEP 2 — Score each candidate (0-100)
  pattern_score = 50 if current_pattern in item.addresses_patterns else 0
  aspiration_score = 30 if stated_aspiration in item.supports_aspirations else 0
  skill_gap_score = 20 if any(skill_gaps) intersects item.technique_ids else 0
  vcm_score = 10 if any(vcm_gate_failures) intersects item.vcm_gates else 0
  total_score = pattern_score + aspiration_score + skill_gap_score + vcm_score

STEP 3 — Apply context filter
  if context == 'debrief':
    candidates = candidates where debrief_eligible == true
    max_results = 2
  if context == 'institute_browse':
    max_results = 10 (paginated)

STEP 4 — Sort and return
  sort by: total_score DESC, then tier ASC (prefer foundational over advanced when equal)
  return top max_results items
```

**Tier Ceiling Calculation:**
```
if mastered_technique_ids.length == 0:
  tier_ceiling = 1
elif mastered_technique_ids.length < 5:
  tier_ceiling = 2
else:
  tier_ceiling = 3
```

This prevents tier-3 integrative content from being surfaced to new users regardless
of pattern match, which would be premature and likely confusing.

### Cold Start (No Pattern Yet)

On the first 1-2 sessions, `current_pattern` is null. Routing falls back to:

1. `stated_aspiration` alone (if set in onboarding)
2. `skill_gaps` from Skills Lab (if any drills have been attempted)
3. `content_type = 'video_explainer'` AND `tier = 1` (always safe defaults)

This is the cold-start solution used in educational recommender research: curated
defaults based on whatever profile data exists, with quality improving as data
accumulates.

### Balancing Prescription vs. User Agency

Research on learner autonomy (Pearson Learning Design Principles, 2024) consistently
identifies the failure mode: systems that prescribe too rigidly feel like surveillance,
not guidance. Users disengage when they feel the path is chosen for them rather than
with them.

The KDENZ architecture resolves this with a two-surface model:

**Prescribed surface (debrief):** 1-2 items surfaced with personal explanation.
User sees: "Here's one thing for you right now." High confidence, high context, no choice
paralysis. The system has chosen on their behalf and explained why.

**Browse surface (Institute):** Full library accessible at any time. User can
ignore the prescription entirely and explore freely. The personalized path is
visible as a "Recommended for you" section, not a locked gate.

This matches the "guided autonomy" design pattern: choices exist within structured
boundaries, but the boundaries are suggestions, not walls. The user who ignores the
prescription and explores freely is still learning — the system does not punish this.

**What NOT to do:**
- Do NOT lock content behind pattern gates ("You haven't completed your 'Hedger' path")
- Do NOT show the routing logic ("Based on your VCM Awareness gate failure, we recommend...")
- Do NOT surface more than 2 items in the debrief — this becomes a menu, not a recommendation

---

## Session Debrief UX Pattern

### The Teachable Moment

Research on teachable moments is clear: the window of highest receptivity occurs
when the learner has just experienced a problem or insight and is emotionally open
to new information. For KDENZ, this is the moment immediately after the "holy shit
moment" — the subtext reveal of what was really happening in the simulated conversation.

At this moment:
- The learner has evidence (they just saw it)
- They have motivation (they want to not do that again)
- They have low defensiveness (the simulation is safe — no real stakes)
- They have cognitive activation (the simulation just ran, concepts are primed)

This is the most valuable real estate in the product. Use it wisely: one item,
personally explained, with a clear action.

### Debrief Card Pattern

```
[Pattern reveal section comes first — see RESEARCH_DEBRIEF.md]

--- "Your Next Step" section ---

┌─────────────────────────────────────────────────────────────┐
│  LEARN WHY THIS HAPPENED                                     │
│                                                              │
│  [Content type pill: ARTICLE · 4 MIN]                        │
│                                                              │
│  The Cost of "Right?"                                        │
│  Why the hedge closes the space you just opened              │
│                                                              │
│  [Personal hook — 1-2 sentences, pulled from debrief_hook]  │
│  "You asked 'does that make sense, right?' twice in a row.  │
│   That turn-check collapses the vulnerability you created."  │
│                                                              │
│  [Read this article →]          [Maybe later]               │
└─────────────────────────────────────────────────────────────┘
```

### Key UX Principles for Non-Intrusive Surfacing

**1. Make it feel like insight, not advertising.**
The debrief hook must reference something specific from THIS session, not generic
benefit copy. Pull from `debrief_hook` template and interpolate with session-specific
observations (the Gemini debrief synthesis call provides the observation string).

**2. One item, not a list.**
Research on microlearning delivery and just-in-time learning: surfacing a single
focused item at the right moment drives higher completion than a menu. The second
item (if surfaced) should be a drill recommendation, not another article — format
variety signals "this is action, not homework."

**3. The action is optional, visible, and not guilt-laden.**
"Maybe later" is a real option, not a diminished CTA. The system tracks dismissals
to improve routing (a dismissed item is a weak negative signal). Missing the item
does not break the user's path.

**4. The hook must do three things:**
- Reference what just happened (session-specific)
- Name the cost (why it matters)
- Preview the content without spoiling it (entice, don't summarize)

**5. Timing: show after the pattern reveal, not before.**
The debrief sequence is:
1. Session stats (brief)
2. "What was really happening" reveal (holy shit moment)
3. Pattern name + observation (1-2 sentences)
4. Growth edge (what to focus on)
5. Next step card (Institute item) ← this is where the recommendation lands
6. Drill recommendation (what to practice next)

The Institute item appears AFTER the insight, not before. This is the post-insight
micro-window.

### Debrief Micro-Delivery Format

The recommended format is a single card with:
- Content type + duration (pill badge, e.g., "ARTICLE · 4 MIN")
- Title (bolded)
- Subtitle/description (1 sentence)
- Personal hook (1-2 sentences, italicized, session-specific)
- Primary CTA (e.g., "Read this article")
- Secondary CTA (e.g., "Save for later" / "Maybe later")

This matches microlearning research guidance: sessions of 3-5 focused minutes
on a single topic show significantly improved retention vs. longer undifferentiated
content. The card format primes the user to expect a small, specific commitment,
not a course.

---

## Curriculum Path Evolution

### How the Path Updates Over Time

The learner profile is not static. Three things change it:

**1. Pattern evolution (session by session)**

`pattern_history` stores the last 10 session pattern identifications. The routing
algorithm uses `current_pattern` (most recent), but the path recalibrates when
patterns shift:

- If the last 3 sessions all return the same pattern: `pattern_confidence = 'high'`
- If patterns vary: `pattern_confidence = 'low'` → fall back to aspiration routing
- If a new pattern appears and holds for 2 consecutive sessions: treat as new
  current_pattern, surface a transition item ("Your pattern seems to be shifting...")

This prevents the system from being stuck on a stale diagnosis. Research on adaptive
learning path recalibration shows that static profiles (no update mechanism) degrade
in accuracy after 4-6 sessions as users improve.

**2. Consumption tracking**

Every consumed item is removed from the candidate pool. The algorithm automatically
advances the user through the content library without needing an explicit "next lesson"
button. The path evolves by elimination of consumed items + tier ceiling advancing as
skills are mastered.

**3. Skills Lab mastery changes**

When the user masters a technique in the Skills Lab (reaches Proficient threshold),
that technique moves from `skill_gaps` to `mastered_technique_ids`. This:
- Unlocks tier-2 and tier-3 Institute content that had those techniques as prerequisites
- Removes items that addressed that skill gap from high-priority routing
- Shifts routing weight toward aspiration and pattern

### Evolution Timeline Model

| Sessions | Profile State | Routing Basis |
|----------|---------------|---------------|
| 1-2 | Pattern: null; aspiration: set (onboarding) | Aspiration only + tier-1 defaults |
| 3-4 | Pattern: low-confidence single signal | Pattern (low weight) + aspiration |
| 5-7 | Pattern: medium-confidence | Pattern (primary) + aspiration |
| 8+ | Pattern: high-confidence; skills accumulating | Full routing (all 4 dimensions) |

This mirrors the cold-start → warm-start transition documented in recommender system
research (IEEE 2014): curated defaults while data is sparse, behavioral data progressively
takes over as interactions accumulate.

### When the Pattern Shifts

If `pattern_history` shows a meaningful change (e.g., the last 3 sessions are
'warm-connector' but the prior 5 were 'hedger'), this is a signal the user has
improved and their growth edge has shifted.

The system handles this by:
1. Updating `current_pattern` to the new value
2. Moving old pattern content to lower priority (not dismissed — the user may revisit)
3. Surfacing a "Your pattern is shifting" observation in the next debrief:
   "You've been hedging less. Your new edge is [new pattern observation]."
4. Refreshing the prescribed Institute path toward the new pattern's content

This is the curriculum path evolution without showing the user "your path has changed."
It appears as: the content being surfaced feels more relevant than before.

### Long-Term Path Architecture (Dashboard View)

For the Institute browse surface (not the debrief card), the recommended view is:

```
My Path (4 items prescribed)
  ├── [Completed] The Cost of "Right?" — ARTICLE
  ├── [Current]   Why Hedgers Hear Anger First — VIDEO · 7 MIN
  ├── [Up Next]   The Acknowledgment Before the Label — EXERCISE
  └── [Locked]    Integration: Labeling Under Pressure — QUIZ
      (Unlock: Complete 5 labeling drills at Proficient level)

Explore the Library
  [All 87 items, searchable, filterable by technique and type]
```

The prescribed path (4-6 items) is the personalized sequence. The full library
browse is always available. The user can drag items into their path, which
the system treats as a mild signal (preference) without hard-overriding the
routing algorithm.

---

## Implementation Notes for Planning

### What to Build in Phase 20.1

**1. Institute content data schema**
Define the TypeScript interface (given above). Create a `src/data/instituteContent.ts`
seed file with 8-12 real content items (stubs acceptable — title, hook, tags filled in;
actual content can be placeholder). This is enough to validate the routing logic.

**2. LearnerProfile object**
Assemble from existing data sources. At Phase 20.1 launch:
- `current_pattern` from session debrief Gemini call (new)
- `stated_aspiration` from onboarding or new aspiration-setting UX (new)
- `mastered_technique_ids` from localStorage Skills Lab data (existing)
- `consumed_content_ids` from new `kdenz:institute-progress` localStorage key
- `vcm_gate_failures` from stub (empty array until VCM logic is built in Phase D)

**3. Routing function**
Pure function, no API calls. Input: LearnerProfile + context. Output: ranked
InstituteContentItem[]. Unit testable. Should be in `src/utils/instituteRouting.ts`.

**4. Debrief card component**
New component: `InstituteRecommendationCard`. Props: `item: InstituteContentItem`,
`sessionHook: string` (from Gemini debrief call output), `onAccept`, `onDismiss`.
Placed in session debrief screen after pattern reveal.

**5. Institute browse surface**
This is Phase E (full Institute build). Phase 20.1 only needs to surface the
prescribed path on a stub Institute page or as a section on the dashboard.
Do NOT build the full content library browser in this phase.

**6. Gemini debrief call output extension**
The Call 3 (session synthesis) output in 20.1-CONTEXT.md already includes
`instituteItem: InstituteContentItem`. The routing algorithm selects the item;
the Gemini call generates the `sessionHook` string (personalized explanation).
Keep these separate — the router picks the item, Gemini writes the hook copy.

### What to Defer

- Aspiration × pattern intersection content (requires aspiration framework from Agent 2)
- VCM gate routing (requires VCM gate failure detection, deferred to Phase D)
- Multi-session pattern trend visualization (after 5+ sessions of data)
- Full Institute browse with search and filter (Phase E)
- Collaborative filtering (requires substantial user base — post-beta)
- Content rating / feedback signal collection (nice to have, not blocking)

### One Architectural Decision to Lock Before Building

**Should `debrief_hook` be a static template or Gemini-generated?**

Recommendation: static template with session-specific variable interpolation.
The template lives on the content item (`debrief_hook: string`). The Gemini debrief
call generates the session-specific observation. The debrief card combines them:

```
Template: "You've been hedging your labels. {{gemini_observation}}"
Gemini:   "You said 'does that make sense?' twice right after strong reflections."
Result:   "You've been hedging your labels. You said 'does that make sense?' twice
           right after strong reflections."
```

This keeps Gemini responsible for the session-specific content and keeps the
Institute item self-describing for future authoring. Both fields are required when
creating Institute content.

---

## Sources Consulted

- [Artificial intelligence-enabled adaptive learning platforms — ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2666920X25000694)
- [Crafting personalized learning paths with AI — Frontiers in Education](https://www.frontiersin.org/journals/education/articles/10.3389/feduc.2024.1424386/full)
- [Putting Taxonomies to Work: Skills Tagging — ATD Blog](https://www.td.org/content/atd-blog/putting-taxonomies-to-work-skills-tagging-for-deep-capability-building-and-experiential-learning)
- [Taxonomies for Learning and Training Content — Hedden Information Management](https://www.hedden-information.com/taxonomies-for-learning-and-training-content/)
- [Khan Academy Learning Path](https://khankids.zendesk.com/hc/en-us/articles/360048828572-Learn-more-about-the-Learning-Path)
- [Duolingo Method Whitepaper](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_duolingo_method_2023.pdf)
- [Recommender systems to support learner agency — Springer Open](https://educationaltechnologyjournal.springeropen.com/articles/10.1186/s41239-020-00219-w)
- [Interleaved practice enhances memory and problem-solving — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC8589969/)
- [Recognizing and Seizing the Teachable Moment — Academic Pediatrics Journal](https://www.academicpedsjnl.net/article/S1876-2859(20)30485-X/pdf)
- [Delivering Knowledge at the Teachable Moment — APQC](https://www.apqc.org/resource-library/resource-listing/delivering-knowledge-teachable-moment)
- [Microlearning: Just-in-Time Information for Faster Learning — eLearning Industry](https://elearningindustry.com/microlearning-case-study-just-in-time-information-for-faster-learning)
- [An improved adaptive learning path recommendation model — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC9748379/)
- [From Cold to Warm Start in Recommender Systems — IEEE](https://ieeexplore.ieee.org/document/6927067/)
- [Hybrid attribute-based recommender for e-learning — Frontiers](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2024.1404391/full)
- [Personalized Learning Design Principles — Pearson](https://www.pearson.com/content/dam/global-store/global/resources/efficacy/evidence-about-learning/Pearson-Learning-Design-Principles-Personalized-Learning-and-Adaptive-Systems-summary.pdf)
- [How Notifications Affect Engagement With a Behavior Change App — JMIR mHealth](https://mhealth.jmir.org/2023/1/e38342)
- [Learning Object Metadata — Wikipedia](https://en.wikipedia.org/wiki/Learning_object_metadata)

---

*Research completed: 2026-02-18*
*Agent: 4 of 5 — Personalized Curriculum Routing*
*Next: Synthesizer consolidates all 5 agents after RESEARCH_DEBRIEF.md is complete*
