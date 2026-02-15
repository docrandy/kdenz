# R5: Conversation Quality Evaluation — Multi-Dimensional Scoring via Gemini 2.5 Flash

**Date filed:** 2026-02-13
**Source:** User-provided Perplexity research
**Status:** COMPLETE

---

## Core Principle

Treat Gemini 2.5 Flash as a **deterministic rater** that ingests detection JSON + transcript and returns structured scores. Temperature 0.1, JSON-only output, evidence-based scoring.

---

## Layer 1: Technique Quality (Per-Instance)

### Rubric Structure

Keep the 4-level affect ladder but **separate it from form and accuracy**:

| Dimension | Range | What It Measures |
|-----------|-------|------------------|
| `form_score` | 0-3 | Syntax and structural correctness |
| `accuracy_score` | 0-3 | How well it captured the counterpart's true state/concern |
| `impact_level` | 0-3 | GUARDED→ACKNOWLEDGED→UNDERSTOOD→DEEPLY_CONNECTED (effect on counterpart's next turn) |
| `timing_score` | 0-2 | Whether it was early/late/on-time relative to the conversation moment |

#### Scoring Table

| Dimension | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| form_score | No recognizable form | Partially formed, awkward | Mostly correct syntax | Clean, textbook form |
| accuracy_score | Wrong target/emotion | Surface but plausible | Correct main emotion/concern | Names underlying driver or nuanced mix |
| impact_level | No shift / negative | Slight de-escalation | Clear softening / more openness | Strong shift toward collaboration/disclosure |
| timing_score | Actively mistimed (hurts) | Suboptimal but ok | Well-timed for the moment | — |

#### Composite Quality Score (0-10)

```
quality = 0.25 * form + 0.35 * accuracy + 0.3 * impact + 0.1 * timing
```

This lets you:
- Keep the affect ladder as `impact_level` (what happened to the other person)
- Differentiate "beautiful form, wrong emotion" vs "rough form, nailed driver"

### Per-Instance Evaluator Prompt (Labeling Example)

**System instruction:**

```text
You are an expert communication coach.

Task: Given (1) several turns of dialogue, (2) a user technique instance, and (3) a definition + rubric, score the QUALITY of that technique.

You MUST:
- Read the counterpart's turns BEFORE and AFTER the technique.
- Decide whether the technique FORM is correct, whether it ACCURATELY captures the counterpart's real state, and what IMPACT it had on the counterpart.
- Output ONLY the requested JSON.
- If you cannot find clear evidence, use a lower score instead of guessing.
```

**User content:**

```json
{
  "technique_type": "labeling",
  "definition": "Labeling means explicitly naming the other person's emotion or underlying concern, usually with stems like 'It seems like...', 'It sounds like...', 'It looks like...'. It must refer to the other person's internal state, not events.",
  "rubric": {
    "form_score": "0=No recognizable form, 1=Partially formed, 2=Mostly correct syntax, 3=Clean textbook form",
    "accuracy_score": "0=Wrong target/emotion, 1=Surface but plausible, 2=Correct main emotion, 3=Names underlying driver",
    "impact_level": {
      "0": "No change or more guarded.",
      "1": "Slightly more open or less hostile.",
      "2": "Noticeably more open, shares more information.",
      "3": "Strong connection, trust, or relief expressed."
    },
    "timing_score": "0=Actively mistimed, 1=Suboptimal but ok, 2=Well-timed"
  },
  "dialogue_window": [
    {"turn_id": 8, "speaker": "AI", "text": "Honestly, I'm not sure promoting you is realistic this cycle. Leadership is already nervous about headcount."},
    {"turn_id": 9, "speaker": "user", "text": "It sounds like you're under a lot of pressure from leadership not to over-commit."},
    {"turn_id": 10, "speaker": "AI", "text": "Yeah, exactly. If I push for this and miss my targets, it's on me."}
  ],
  "target_turn_id": 9
}
```

**Generation config:**

```json
{
  "temperature": 0.1,
  "responseMimeType": "application/json"
}
```

**Expected output:**

```json
{
  "technique_type": "labeling",
  "turn_id": 9,
  "form_score": 3,
  "accuracy_score": 3,
  "impact_level": 2,
  "timing_score": 2,
  "evidence": {
    "form": "It sounds like you're under a lot of pressure...",
    "accuracy": "AI previously mentioned 'leadership is already nervous', user names pressure from leadership.",
    "impact": "AI responds with 'Yeah, exactly' and elaborates, showing more openness."
  },
  "short_feedback": "Great label: natural syntax, correctly captures leadership pressure, and the manager opened up more."
}
```

### Calibrated Question Variant

Same outer structure. Add to definition:

> "Calibrated questions are open-ended questions (often starting with 'How' or 'What') that invite the counterpart to explain constraints or collaborate on solutions. Yes/no or why-questions do not count."

Add rubric dimension `problem_solving_depth` (0-3):

> "Did the question move the conversation toward concrete problem solving (e.g., exploring options, constraints, trade-offs)?"

### Handling Context-Dependent Quality (Accuracy vs Form)

Weight accuracy > form for techniques like labeling and tactical empathy (e.g., 60% accuracy, 20% form, 20% impact). Reverse for structured speaking techniques.

Add to system prompt:

```text
If form is perfect but the emotion/concern is clearly wrong, give:
- form_score: 3
- accuracy_score: 0 or 1
- impact_level: 0 or 1 if the counterpart resists or corrects it.

If form is imperfect but the underlying emotion/concern is accurate and the counterpart becomes more open, prioritize higher accuracy_score and impact_level.
```

**Principle: "clumsy but attuned" outranks "polished but mis-attuned."**

---

## Layer 2: Conversation Flow (Session-Level)

### 6 Flow Dimensions (each 0-5)

| Dimension | What It Measures |
|-----------|------------------|
| `sequencing_effectiveness` | Empathy/defusing before asks, accusation audits early, etc. |
| `adaptability` | How much user adjusted after mood shifts or new information |
| `missed_opportunities` | Count + severity of moments where a technique would have helped |
| `over_reliance` | Extent to which they spam one technique |
| `trajectory` | Overall movement toward resolution (0=deteriorated, 5=strong collaborative outcome) |
| `naturalness` | Does it feel like a human conversation vs script |

### Avoiding "Combo System" Feel

Keep "combo logic" **inside the evaluator, not in the UI**. Have Gemini reason in natural language, return numeric dimensions. UI translates into coach language:

> "You stayed in empathy too long before making a clear ask"

...without talking about "combos."

### Session-Level Scoring Prompt (15-Turn Salary Negotiation)

**System:**

```text
You are an expert negotiation coach and communication researcher.

Task:
Given a full transcript of a 15-turn salary negotiation between a USER and an AI MANAGER, evaluate the USER's conversation FLOW and JUDGMENT.

You MUST:
- Read the entire transcript before scoring.
- Focus on the USER's behavior only.
- Score each dimension from 0 to 5 using the provided rubric.
- Identify 3-5 key moments with turn_ids where the user's choices strongly helped or hurt the negotiation.
- Output ONLY valid JSON.
```

**User content:**

```json
{
  "scenario": "salary_negotiation",
  "goal": "User is negotiating for a promotion and compensation increase while preserving relationship.",
  "rubrics": {
    "sequencing_effectiveness": {
      "0": "No apparent structure; asks or pushes come at random, often before empathy.",
      "3": "Often follows a good pattern (empathy -> questions -> proposals) but with some mis-ordered moves.",
      "5": "Consistently sequences empathy/understanding before asks, accusation audit early, calibrated questions before specific proposals."
    },
    "adaptability": {
      "0": "Repeats the same approach regardless of manager reactions.",
      "3": "Sometimes adjusts tone or tactics after strong negative reactions.",
      "5": "Clearly adapts approach when mood or constraints shift (e.g., softens, re-frames, changes ask)."
    },
    "missed_opportunities": {
      "0": "Frequent obvious missed chances to use empathy or questions.",
      "3": "Some missed chances; overall conversation still moves forward.",
      "5": "Rare misses; user usually responds with an appropriate technique when needed."
    },
    "over_reliance": {
      "0": "Spams one technique (e.g., only mirroring or only questions).",
      "3": "Some repetition but still uses 2-3 different approaches.",
      "5": "Good variety across empathy, questioning, summarizing, and clear asks."
    },
    "trajectory": {
      "0": "Conversation deteriorates or deadlocks with no clear next step.",
      "3": "Mixed; some progress but unresolved or tense ending.",
      "5": "Clear movement toward resolution: specific next steps, mutual understanding, or a principled 'no'."
    },
    "naturalness": {
      "0": "Feels scripted, unnatural, or like they are reading from a playbook.",
      "3": "Some scripted moments but overall conversational.",
      "5": "Techniques are integrated so well that the conversation feels natural."
    }
  },
  "transcript": [
    {"turn_id": 1, "speaker": "AI", "text": "..."},
    {"turn_id": 2, "speaker": "user", "text": "..."}
  ]
}
```

**Config:**

```json
{
  "temperature": 0.1,
  "responseMimeType": "application/json",
  "thinkingConfig": { "thinkingLevel": "low" }
}
```

**Expected output:**

```json
{
  "flow_scores": {
    "sequencing_effectiveness": 4,
    "adaptability": 3,
    "missed_opportunities": 2,
    "over_reliance": 3,
    "trajectory": 4,
    "naturalness": 3
  },
  "key_moments": [
    {
      "turn_ids": [4, 5],
      "description": "User makes a direct salary ask before acknowledging manager's budget concern, causing defensiveness."
    },
    {
      "turn_ids": [9, 10],
      "description": "User uses a calibrated question after pushback, which re-opens problem solving."
    }
  ],
  "summary_feedback": "3-4 sentences of coach-style feedback",
  "recommended_focus_for_next_session": [
    "Practice acknowledging constraints before presenting your ask.",
    "Increase variety by using more summarizing and labeling instead of relying mainly on questions."
  ]
}
```

### Scaling Strategy

- Start with full transcript + single evaluation call for simplicity and coherence.
- If you later hit context or cost limits, consider two-pass: one call for "trajectory + outcome", one for "sequencing + adaptability", then aggregate.

### Natural Communicators (No Named Techniques)

Add `non_framework_skill_score` (0-5) and a flag. Tell Gemini:

```text
If the user communicates clearly, collaboratively, and moves the negotiation toward a good outcome WITHOUT using the named techniques, you should still score trajectory and naturalness HIGH.

Set "non_framework_skill_flag": true if their effectiveness seems high but technique usage is low. They may be a natural communicator or using unmodeled skills.
```

Then your engine can:
- Score the conversation well
- Recommend minimal technique training or advanced nuance modules instead of basic drills

---

## Layer 3: Feeding the Volitional Chain Diagnostic

### Data to Output Beyond Scores

For each session, emit:

**`per_technique_instances`** — list of all detected techniques with quality_score, impact_level, confidence, turn_id

**`cluster_scores`** — aggregated scores for each of 7 clusters (0-100)

**`trend_features`:**

| Feature | Description |
|---------|-------------|
| `technique_confidence_trajectory` | Average quality in first third vs last third of session |
| `emotional_sophistication_trajectory` | Proxy via average accuracy_score on labeling/tactical empathy over time |
| `technique_diversity_index` | Shannon entropy over technique frequencies, or count of unique techniques per 10 turns |
| `pressure_response_pattern` | Change in quality and diversity after clearly negative AI turns (label those via rule/LLM as "high pressure") |
| `recovery_events` | Moments where user recovers from a rough exchange (trajectory dips then improves) |

**`meta_flags`:**

| Flag | Meaning |
|------|---------|
| `scripted_behavior_flag` | User appears to be reading from a playbook |
| `avoidance_flag` | Abandoning asks, changing topic after pushback |
| `shutdown_flag` | Very short, compliant answers after pressure |

These are the hooks the 8-gate VCM engine uses as input features.

### Distinguishing "Doesn't Know" (Gate A) vs "Can't Execute Under Pressure" (Gate E)

**Gate A — Doesn't know / low awareness:**
- Across multiple sessions AND low-pressure drills, the technique:
  - Is almost never attempted (usage frequency near zero)
  - When attempted, quality is low even with gentle counterparts and ample time
- In Skills Lab (single-turn, low-stakes prompts) they still either don't attempt or show low form+accuracy

**Gate E — Knows but can't execute under pressure:**
- In Skills Lab:
  - Average quality score for that technique is decent (≥2/3)
  - Form is often correct when there's no pushback
- In Simulation Studio:
  - Quality and frequency drop sharply following pressure markers (AI expressing anger, unfairness, urgency)
  - Technique diversity collapses: they revert to one or two safe behaviors (compliance, silence, defensive arguing)
  - Timing worsens under pressure (they jump to asks, skip empathy they showed in low-pressure settings)

**Diagnostic rules:**

```
IF skills_lab_avg_quality(labeling) >= 2.5
   AND sim_pressure_quality_delta(labeling) <= -1.0
THEN → "execution-under-pressure" issue (Gate E)

IF skills_lab_usage(labeling) AND sim_usage(labeling) are both near zero
   WITH no evidence of attempts
THEN → "awareness" issue (Gate A)
```

### Minimum Sessions for Meaningful Diagnosis

**Per-technique judgment:**
- 2-3 Skills Lab drills per technique (controlled prompts)
- 2-3 Simulation sessions per scenario type

**Total: ~3-5 evaluated sessions before trusting gate-level prescriptions.**

Before that threshold, label diagnoses as "provisional" and recommend broad fundamentals.

### Cold Start Pattern

1. Short self-report (confidence per cluster)
2. 1 diagnostic Simulation with aggressive evaluation
3. Micro Skills Lab battery: 1-2 fast prompts for 4-5 core techniques

Use this to:
- Identify obvious zeros (techniques never used or badly misapplied)
- Pick 1-2 focus clusters for the first learning path
- Mark all other gate conclusions as "pending more data"

**Rule: Don't lock in any gate diagnosis until at least N=2 sessions show the same pattern for that gate.**

---

## KDENZ Platform Implications

1. **The 4-dimension rubric replaces the current AffectLevel system.** Current `calculateAffect()` in `labelAnalyzer.ts` and `auditAnalyzer.ts` should evolve to separate form/accuracy/impact/timing. The affect ladder becomes `impact_level` only.

2. **Two evaluation calls per simulation session.** Per-turn lightweight detection (R4 hybrid approach) + session-end comprehensive flow scoring (this document). Cost: ~$0.01-0.03 total per session.

3. **Diagnostic rules are simple.** Gate A vs Gate E distinction uses Skills Lab vs Simulation comparison — no ML needed. Rule-based engine works.

4. **Cold start = onboarding redesign.** Current 4-question diagnostic is insufficient. Need: self-report + 1 diagnostic sim + micro Skills Lab battery. This replaces the light diagnostics.

5. **`meta_flags` are VCM gold.** `avoidance_flag` maps to Gate B (motivation), `shutdown_flag` maps to Gate E (action under pressure), `scripted_behavior_flag` maps to Gate H (not yet integrated into identity).

6. **Non-framework skill flag prevents over-prescription.** Natural communicators who score well on trajectory/naturalness but low on technique detection should get advanced/nuance content, not beginner drills.
