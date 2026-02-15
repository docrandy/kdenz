# R8 Platform-Fit Analysis: Technique Selection for KDENZ

**Date:** 2026-02-13
**Input:** 83 techniques across 9 frameworks (Voss, Camp, MI, NVC, Crucial Conversations, Difficult Conversations, PREP, Harvard/MBA, Corporate)

---

## Summary

| Category | Count |
|----------|-------|
| Total techniques in taxonomy | 83 |
| After overlap removal | ~35 distinct skills |
| INCLUDE (build for beta) | 22 techniques |
| DEFER (valuable, post-beta) | 20 techniques |
| INSTITUTE ONLY (teach, don't drill) | 7 techniques |
| EXCLUDE (doesn't fit app) | 4 techniques |
| Already built | 2 (Labeling, Accusation Audit) |

---

## Overlap Detection

These techniques are the same skill with different framework names. Consolidate to avoid confusion.

| Keep As | Overlaps With | Resolution |
|---------|--------------|------------|
| **Labeling** (Voss) | Reflective Listening, OARS Reflections, NVC Empathy Guesses, Cold Reads | "Labeling" is primary. Cold Reads = advanced variant. Reference MI/NVC in Institute. |
| **Open & Calibrated Questions** | Open-ended Questions, OARS Open Questions, Calibrated Questions | One module. Beginner = open questions, Intermediate = calibrated "how/what" |
| **Summarizing** | Paraphrasing (Voss), OARS Summaries, Clarifying | One "Summarizing & Paraphrasing" module |
| **Validation & Affirmation** | Basic Validation, OARS Affirmations, Supporting Self-efficacy | One module. Self-efficacy = advanced variant |
| **Reframing** | Blame-to-Contribution, Re-labeling | One module. Different scenario types |
| **Vocal Control** | FM DJ Voice, Upward Inflection, Vocal Tonality, Tactical Pause | One module with sub-drills |
| **"No"-Oriented Questions** | Start with "No" Posture (Camp) | Voss framing for drill. Camp philosophy in Institute. |

---

## 7 Curriculum Clusters

### Cluster 1: VOCAL FOUNDATION
*How you sound matters before what you say*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| Tactical Pause / Strategic Silence | Foundational | Silence duration detection |
| FM DJ Voice (Calm Authority) | Foundational | Hume prosody: pitch, pace |
| Upward Inflection (Curious Invitation) | Foundational | Hume pitch contour |
| One-Breath Point (conciseness) | Foundational | Word count + clarity |

### Cluster 2: EMOTIONAL INTELLIGENCE
*Reading and reflecting what others feel*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| Labeling (EXISTING) | Foundational | Syntax + depth scoring |
| Cold Reads (hypothesis labels) | Intermediate | Same as labeling |
| Validation & Affirmation | Foundational | AI evaluation |
| NVC Observation (judgment-free) | Foundational | Judgment word detection |
| NVC Feeling (naming emotions) | Foundational | Feeling vs evaluation detection |
| NVC Need (underlying drivers) | Intermediate | Need vocabulary matching |

### Cluster 3: TACTICAL QUESTIONING
*Asking questions that move conversations forward*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| Open & Calibrated Questions | Foundational | Question type detection |
| "No"-Oriented Questions | Foundational | No-orientation framing |
| "How Am I Supposed to Do That?" | Foundational-Int | Calm "how" pattern |
| Discouraging "I Understand" | Foundational | Anti-pattern detection |

### Cluster 4: DEFUSING & DE-ESCALATION
*Handling conflict, resistance, and heat*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| Accusation Audit (EXISTING) | Foundational-Int | Coverage + delivery scoring |
| De-escalation Basics | Foundational | Calm tone, validation |
| Rolling with Resistance | Intermediate | Arguing vs reflecting |
| Reframing (blame to contribution) | Intermediate | "we" vs "you" language |
| Contrasting ("I don't mean X, I do mean Y") | Intermediate | Pattern detection |
| Repair Attempts & Micro-apologies | Foundational-Int | Specificity + tone |

### Cluster 5: ASSERTIVE COMMUNICATION
*Saying what you need without damaging relationships*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| "I" Statements | Foundational | "I feel...when...because" |
| NVC Request (clear, doable, present) | Intermediate | Specificity + actionability |
| Boundary Setting & Saying No | Intermediate | Clarity + relationship preservation |
| Feedback Delivery (SBI) | Intermediate | 3-component structure |
| Politeness / Face-saving Language | Foundational | Softener presence |

### Cluster 6: STRUCTURED SPEAKING
*Organizing thoughts under pressure*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| PREP (Point-Reason-Example-Point) | Foundational | 4-component detection |
| Rule of 3 | Foundational | 3 parallel points |
| BLUF (Executive Summary First) | Intermediate | First-sentence analysis |
| Pros-Cons-Recommendation | Intermediate | 3-part balance |
| SCR (Situation-Complication-Resolution) | Intermediate | 3-component detection |
| PREP Under Pressure (impromptu) | Intermediate | Timed + structure |
| STATE Method | Intermediate-Adv | 5-component detection |
| ABC (Agree-Build-Compare) | Intermediate | 3-phase detection |

### Cluster 7: INTEGRATION & SYNTHESIS
*Pulling it all together*

| Technique | Tier | Scoring Method |
|-----------|------|---------------|
| Summarizing & Paraphrasing | Foundational | Semantic similarity |
| "That's Right" (eliciting confirmation) | Intermediate | Outcome detection |
| Agenda Setting & Framing | Intermediate | Clarity + scope |
| What? So What? Now What? (debrief) | All levels | Debrief depth |
| Active Listening (simulation eval) | Foundational | Multi-turn behavior |

---

## Beta Build: 22 Techniques

### Skills Lab (18 drillable)

| # | Technique | Status | Infrastructure |
|---|-----------|--------|---------------|
| 1 | Labeling | DONE | 16 scenarios |
| 2 | Accusation Audit | DONE | 10 scenarios |
| 3 | FM DJ Voice | NEW (voice) | Hume prosody |
| 4 | Tactical Pause | NEW (voice) | Silence detection |
| 5 | Open & Calibrated Questions | NEW (text) | Same as labeling |
| 6 | "No"-Oriented Questions | NEW (text) | Same as labeling |
| 7 | "How Am I Supposed to Do That?" | NEW (text) | Same as labeling |
| 8 | Discouraging "I Understand" | NEW (text) | Anti-pattern detection |
| 9 | "I" Statements | NEW (text) | Same as labeling |
| 10 | NVC Observation | NEW (text) | Judgment word detection |
| 11 | Reframing | NEW (text) | Same as labeling |
| 12 | Contrasting | NEW (text) | Pattern detection |
| 13 | Boundary Setting & Saying No | NEW (text) | Same as labeling |
| 14 | PREP | NEW (text) | Structure detection |
| 15 | One-Breath Point | NEW (voice) | Word count + clarity |
| 16 | BLUF | NEW (text) | First-sentence analysis |
| 17 | Summarizing & Paraphrasing | NEW (text) | Semantic similarity |
| 18 | De-escalation Basics | NEW (text) | Same as labeling |

### Simulation Studio (5 scenario types)

| # | Scenario | Techniques Tested |
|---|----------|-------------------|
| S1 | Salary Negotiation | Labeling, Calibrated Questions, "No"-Oriented, Accusation Audit |
| S2 | Difficult Feedback | "I" Statements, SBI, Reframing, De-escalation, Contrasting |
| S3 | Saying No to a Request | Boundary Setting, "I" Statements, Politeness, Contrasting |
| S4 | Team Conflict Mediation | Summarizing, Active Listening, Rolling with Resistance, NVC |
| S5 | Impromptu Briefing | PREP, BLUF, One-Breath Point, Rule of 3 |

### Institute (7 content modules)

| # | Topic | Covers |
|---|-------|--------|
| I1 | Tactical Empathy | Labeling, Accusation Audit, Mirroring, "That's Right" |
| I2 | Better Questions | Open, Calibrated, "No"-oriented, "How am I supposed to..." |
| I3 | NVC Framework | Observation, Feeling, Need, Request |
| I4 | Structured Speaking | PREP, BLUF, Rule of 3, SCR |
| I5 | De-escalation & Conflict | Accusation Audit, Rolling with Resistance, Contrasting, Repair |
| I6 | Volitional Chain | VCM gates, self-assessment, why you don't do what you know |
| I7 | Voice as a Tool | FM DJ, upward inflection, tactical pause |

### Reflection Layer

| Feature | Description |
|---------|-------------|
| What? So What? Now What? | 3-step guided debrief after every Simulation session |

---

## Build Order

1. **Phase 1: Expand Skills Lab** (8 new text drills using labeling infrastructure)
2. **Phase 2: Voice Drills** (FM DJ, Tactical Pause, One-Breath Point — requires Hume)
3. **Phase 3: Simulation Studio MVP** (Gemini opponent + 3 scenario types)
4. **Phase 4: Institute Content** (4-5 initial modules + debrief framework)

---

## Deferred Techniques (v2 Roadmap)

These unlock naturally once Simulation Studio exists:

- Bending reality / loss-aversion framing
- Anchoring with extreme offers
- Ackerman bargaining model
- Black Swan discovery
- Eliciting change talk (MI)
- Responding to sustain talk (MI)
- Exploring ambivalence (MI)
- Vision-building questions (Camp)
- Three conversations model
- Map the contribution system
- Mutual purpose creation
- Interest-based problem solving
- Minto Pyramid / SCQA
- And 7 more...

---

## Key Insights

1. **Labeling infrastructure is the template.** 16 of 18 Skills Lab drills reuse the same prompt-response-analyze-feedback pattern. Build a generic drill engine.
2. **Voice drills are the differentiator.** FM DJ Voice + Tactical Pause leverage Hume prosody. No competitor offers this.
3. **NVC is the most structured teachable framework.** 4-step structure maps perfectly to progressive difficulty.
4. **Camp techniques are mostly mindset, not behavior.** Only "Start with No" is drillable (overlaps with Voss). Rest = Institute.
5. **The 20 deferred techniques are almost entirely Simulation-native.** They become the v2 roadmap once Simulation Studio ships.
