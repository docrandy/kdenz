# R15: Spaced Repetition & Mastery Decay for Communication Skills Training

**Source:** Perplexity Research
**Filed:** 2026-02-14
**Prompt:** R15 from RESEARCH_PROMPTS.md
**Status:** COMPLETE

---

## 1. Decay Curves by Skill Type

### Research-Based Decay Rates

Communication skills decay at **0.08 SD units per month for accuracy-based performance** and **0.06 SD units per month for speed/mixed performance**. Unlike Duolingo's word-level decay (1-2 days for new words), behavioral skills have much longer half-lives due to procedural memory consolidation.

Key finding: Half of skill gains lost after **6.5 months for accuracy-based tasks** and **13 months for speed-based tasks**.

### Skill-Specific Decay Implementation

| Skill Type | Examples | Half-Life at Proficient | Drop to Familiar After | Decay Rate |
|------------|----------|------------------------|----------------------|------------|
| **Syntax-Driven** (Accuracy) | Mirroring, "I" statements, labeling | 4-5 months | 10-12 weeks | 0.08/month |
| **Judgment-Based** (Mixed) | Tactical empathy, calibrated questions, NVC | 6-8 months | 14-16 weeks | 0.06/month |
| **Recognition-Only** (Multiple Choice) | Identifying techniques in scenarios | 8-10 months | 18-20 weeks | Slowest — recognition easier than production |

**Critical:** Duolingo's 1-2 day decay for vocabulary is NOT applicable to procedural behavioral skills. A Proficient user should drop to Familiar after 3-4 months of non-use for syntax skills and 4-5 months for judgment skills.

---

## 2. Spaced Repetition Adaptation for Behavioral Skills

### Core Differences from Factual SRS

Traditional Anki/SuperMemo systems test **declarative recall** (retrieving facts). Communication skills require **procedural execution** (performing actions).

### Progressive Format Escalation

1. **Initial Drill** (Level 2-3): Same format review with new scenarios
2. **First Retention** (7-14 days): Same format, increased difficulty
3. **Second Retention** (30-45 days): Escalate to simulation format
4. **Third Retention** (90+ days): Mixed-skill assessment

Research: Distributed practice with 12-hour intervals improves motor sequential learning more than massed practice. For communication skills: space initial reviews within 1-2 weeks, then expand intervals.

### Interval Schedule by Mastery Level

| Current Level | Next Review | Interval Logic | Correct Response | Wrong Response |
|--------------|-------------|----------------|-----------------|----------------|
| **Level 2: Familiar** | 3 days | Consolidation period | Increase to 7 days | Reset to 1 day |
| **Level 3: Proficient** (first time) | 7 days | Verify consolidation | Increase to 14 days | Drop to 3 days |
| **Level 3: Proficient** (2nd success) | 14 days | Moving toward mastery | Increase to 30 days | Reset to 7 days |
| **Level 4: Mastered** | 30 -> 60 -> 90 days | Maintenance phase | Double interval (cap 90d) | Drop to 14 days |

**Do NOT use 1-day intervals** like vocabulary SRS — behavioral skills need consolidation time.

### Half-Life Regression (HLR) Model

Adapted from Duolingo's model: `p = 2^(-delta/h)` where delta is lag time and h is half-life.

For behavioral skills: set initial h=14 days (Familiar) and scale up based on success.

---

## 3. Retention Check Formats

### Format Matching Strategy

| Original Drill Type | First Check (7-14d) | Second Check (30-45d) | Third Check (90d) |
|--------------------|--------------------|---------------------|------------------|
| **Prompt->Response** | New scenario, same structure | New scenario + distractor options | Short 3-turn simulation applying skill |
| **Audio Drills** | Different script, same technique | Script with multiple techniques needed | Full conversation requiring technique |
| **Roleplay Simulation** | 3-5 turn "spot check" focused on target skill | 5-7 turn scenario requiring technique | Mixed-skill assessment (multiple techniques) |
| **Multiple Choice Recognition** | New questions, same technique | New questions with harder distractors | Application-based scenario questions |

**Critical:** Retention checks should match difficulty to mastery level. Retrieval practice (active recall) strengthens memory more than passive review. Always require production, not just recognition.

---

## 4. Notification Strategy

### Timing

| Trigger | When | Mandatory? |
|---------|------|-----------|
| First retention check | 7 days post-Proficient | YES (blocks Level 4 candidacy) |
| Second check | 14 days (if first successful) | YES |
| Moving toward maintenance | 30 days | Optional but incentivized |
| Individual decay-based | Based on HLR model, when retention drops to 75% | Recommended |
| Maintenance cycles | 30/60/90-day cycles for Mastered skills | Optional |

### Messaging Framework (Non-Punitive)

| Avoid | Use Instead |
|-------|------------|
| "Your labeling skill is fading" (implies failure) | "Quick refresher to lock in your labeling skill" (opportunity framing) |
| "You're losing progress" | "Ready to strengthen your mirroring technique?" (growth mindset) |
| "You haven't practiced in X days" | "5-minute practice to maintain your progress" (time-bounded, positive) |

### Mandatory vs. Optional

- **Mandatory**: First retention check for Level 4 (Mastered) candidacy — blocks progression to next tier
- **Optional but incentivized**: Maintenance checks at 30/60/90 days — offer "streak" bonuses, but don't block
- **Recommended**: Checks for skills 1-2 tiers below current work — surfaced as "boost your foundation" prompts

Training effectiveness: Check-ins at 6-8 week intervals maintain skill sharpness. For digital platforms, compress to 2-4 weeks for active users.

---

## 5. Data Model

### Schema Design

```sql
CREATE TABLE user_skills (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    skill_id UUID NOT NULL,
    mastery_level INT CHECK (mastery_level BETWEEN 0 AND 4),

    -- Spaced repetition fields
    last_practiced TIMESTAMP,
    next_review_date TIMESTAMP,
    review_interval_days INT DEFAULT 7,
    half_life_days DECIMAL DEFAULT 14.0,

    -- Performance tracking
    consecutive_correct INT DEFAULT 0,
    total_attempts INT DEFAULT 0,
    total_correct INT DEFAULT 0,

    -- Streak and engagement
    current_streak INT DEFAULT 0,
    longest_streak INT DEFAULT 0,
    last_review_result VARCHAR(20), -- 'correct', 'incorrect', 'partial'

    -- Decay tracking
    skill_decay_rate DECIMAL DEFAULT 0.08, -- default for accuracy-based
    estimated_retention_probability DECIMAL,

    -- Metadata
    first_attempted_at TIMESTAMP,
    proficient_achieved_at TIMESTAMP,
    mastered_achieved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE skill_reviews (
    id UUID PRIMARY KEY,
    user_skill_id UUID REFERENCES user_skills(id),
    reviewed_at TIMESTAMP DEFAULT NOW(),
    review_type VARCHAR(50), -- 'drill', 'simulation', 'retention_check', 'mixed_assessment'
    result VARCHAR(20), -- 'correct', 'incorrect', 'partial'
    response_time_seconds INT,
    context JSONB -- store scenario details, errors, etc.
);

CREATE TABLE skills (
    id UUID PRIMARY KEY,
    name VARCHAR(100),
    skill_type VARCHAR(50), -- 'syntax_driven', 'judgment_based', 'recognition'
    tier INT CHECK (tier BETWEEN 1 AND 5),
    default_decay_rate DECIMAL, -- 0.08 for syntax, 0.06 for judgment
    default_half_life_days INT, -- starting point for HLR
    prerequisite_skill_ids UUID[] -- array of required skill IDs
);
```

### Calculating Next Review Date — HLR Model

```python
def calculate_next_review(user_skill):
    # Current retention probability: p = 2^(-delta/h)
    lag_days = (now() - user_skill.last_practiced).days
    retention_prob = 2 ** (-lag_days / user_skill.half_life_days)

    # Update half-life based on result
    if last_result == 'correct':
        # Increase half-life (slower decay)
        user_skill.half_life_days *= 1.5
        user_skill.consecutive_correct += 1
    else:
        # Decrease half-life (faster decay needed)
        user_skill.half_life_days *= 0.7
        user_skill.consecutive_correct = 0

    # Cap half-life based on mastery level
    max_half_life = {
        1: 7,    # Attempted: max 1 week
        2: 21,   # Familiar: max 3 weeks
        3: 60,   # Proficient: max 2 months
        4: 120   # Mastered: max 4 months
    }
    user_skill.half_life_days = min(user_skill.half_life_days,
                                    max_half_life[user_skill.mastery_level])

    # Schedule next review when retention drops to 75%
    # Solving: 0.75 = 2^(-delta/h) -> delta = h * log2(1/0.75)
    target_retention = 0.75
    days_until_review = user_skill.half_life_days * math.log2(1/target_retention)

    user_skill.next_review_date = now() + timedelta(days=days_until_review)
    user_skill.estimated_retention_probability = retention_prob
```

### Simple Interval Fallback

```python
INTERVAL_SCHEDULES = {
    'syntax_driven': [3, 7, 14, 30, 60, 90],  # days
    'judgment_based': [3, 7, 21, 45, 75, 90],
    'recognition': [7, 14, 30, 60, 90, 90]
}

def simple_next_review(user_skill):
    schedule = INTERVAL_SCHEDULES[user_skill.skill_type]
    current_index = min(user_skill.consecutive_correct, len(schedule) - 1)

    if last_result == 'correct':
        next_interval = schedule[current_index]
    else:
        # Drop back 2 steps on failure
        next_interval = schedule[max(0, current_index - 2)]

    return now() + timedelta(days=next_interval)
```

---

## 6. Prerequisite Decay with Implicit Practice

### Implicit Maintenance Model

Prerequisite skills receive **partial maintenance credit** when dependent skills are actively practiced. Prerequisite skills don't decay at full rate when embedded in higher-order tasks.

### Implementation

```python
def check_implicit_practice(prerequisite_skill, dependent_skill):
    if dependent_skill.last_practiced > prerequisite_skill.last_practiced:
        # Dependent skill was practiced more recently

        # Calculate implicit practice credit (50% of full practice)
        implicit_interval = (now() - dependent_skill.last_practiced).days

        # Extend prerequisite's next_review_date by implicit credit
        implicit_extension_days = implicit_interval * 0.5

        prerequisite_skill.next_review_date += timedelta(days=implicit_extension_days)
        prerequisite_skill.implicit_practice_count += 1

        # Update retention probability more conservatively
        # Full practice gives 100% bump, implicit gives 30%
        retention_boost = 0.3
        prerequisite_skill.estimated_retention_probability = min(
            1.0,
            prerequisite_skill.estimated_retention_probability + retention_boost
        )
```

### Rules

1. **Direct application**: If Calibrated Questions explicitly requires Tactical Empathy in scenario, give 50% maintenance credit
2. **Indirect embedding**: If dependent skill "could use" prerequisite but doesn't require it, give 25% credit
3. **Full decay**: If dependent skill can be executed without prerequisite (learned alternative path), no implicit credit

### Visual Indicator for Users

- **"Maintained through [Dependent Skill]"** — prerequisite stays green due to active use in advanced work
- **"Direct practice recommended"** — if retention drops below 60% even with implicit credit
- **"Foundations strong"** — all prerequisites above 80% retention

---

## Summary Tables

### Decay Timeline (Proficient -> Familiar)

| Skill Type | Weeks Without Practice |
|------------|----------------------|
| Syntax skills | 10-12 weeks |
| Judgment skills | 14-16 weeks |
| Recognition | 18-20 weeks |

### Review Intervals by Level

| Level | Interval Progression |
|-------|---------------------|
| Familiar (Level 2) | 3d -> 7d -> 14d |
| Proficient (Level 3) | 7d -> 14d -> 30d |
| Mastered (Level 4) | 30d -> 60d -> 90d (maintenance cap) |

### Notification Timing

| Trigger | Days | Mandatory |
|---------|------|-----------|
| First check | 7 days post-Proficient | Yes |
| Ongoing | HLR model targeting 75% retention | Recommended |
| Maintenance | 30/60/90-day cycles | Optional |

---

## KEY IMPLEMENTATION TAKEAWAYS FOR KDENZ

### Architecture Decisions

1. **Two SRS implementations**: Start with simple interval fallback (3 tables, no ML). Graduate to HLR model when you have 3+ months of review data.
2. **Three skill types with different decay rates**: syntax_driven (0.08/mo), judgment_based (0.06/mo), recognition (slowest). Tag every technique in skills table.
3. **Progressive format escalation**: Retention checks should escalate format over time (drill -> simulation -> mixed assessment), not just repeat the same format.
4. **75% retention threshold** triggers next review — this is the sweet spot between forgetting and wasting user time.
5. **Implicit practice credit**: Prerequisite skills get partial maintenance when dependent skills are actively practiced. Reduces review burden without ignoring decay.

### What NOT to Do

- Don't use Duolingo's 1-2 day intervals — behavioral skills need consolidation time
- Don't use the same format for all retention checks — escalate difficulty
- Don't punish decay with negative messaging — opportunity framing only
- Don't make all maintenance reviews mandatory — only first retention check for Level 4 candidacy

### Data Model Decision

- Start with simple interval tables (user_skills, skill_reviews, skills)
- The schema in Section 5 is compatible with R16 (full platform schema) — can be merged directly
- HLR algorithm lives in an Edge Function, not client-side — needs server-side timestamp reliability

### Post-Launch: Real-World Usage Tracking (Transfer Measurement)

R15 covers in-app spaced repetition but not whether skills transfer to real life. Add post-launch:

1. **Transfer rate metric** — ratio of real-world logged uses to app drill sessions per skill. Skills at Level 2+ with zero real-world usage are "stuck skills" needing intervention.
2. **Real-world usage credits SRS** — successful real-world application extends review interval by 1.3-1.5x (stronger signal than drill performance). Failed application shortens by 0.8x.
3. **Post-event reflection prompts** — lightweight "Did you use [skill] in your meeting?" prompt ~20 min after calendar events. Manual logging button on home screen as baseline.
4. **Skill usage events table** — `skill_usage_events(user_id, skill_id, context_type, self_rating, confidence_level, logging_method, interval_adjustment_days)`. Feeds back into SRS scheduling.
5. **Dashboard metric** — show users their transfer rate per skill. "Labeling: 12 drills, 6 real uses (50% transfer)" validates the platform is working.

**Priority:** Phase 2-3 feature. Requires the base SRS to be running first. Calendar integration is Phase 4 at earliest. Start with manual logging + end-of-day reflection prompt.
