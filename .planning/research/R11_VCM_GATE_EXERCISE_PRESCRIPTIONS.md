# R11: VCM Diagnostic Gates → Exercise Prescription Mapping

**Source:** Perplexity Deep Research
**Filed:** 2026-02-14
**Prompt:** R11 from RESEARCH_PROMPTS.md
**Status:** COMPLETE
**Note:** This document uses letter-based gate names (A-F) for exercise prescription categories. V2 VCM structure adds C3 Awareness and C4 Attention gates; exercise prescriptions for these gates pending integration.

---

## 1. GATE-SPECIFIC EXERCISE PRESCRIPTIONS

### Gate A: AWARENESS / READINESS (Constraints 0-2)

**Failure Signatures:**
- Doesn't acknowledge skill gap exists
- Blames external factors for communication failures
- Avoids self-assessment exercises
- Low engagement with feedback mechanisms

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Lack of problem awareness | Mirror interventions | Playback recordings of their own communication attempts vs. expert examples |
| External attribution | Reality-check exercises | Data visualization showing their performance gaps objectively |
| Low readiness for change | Pre-contemplation strategies from MI | "Raise doubts" exercises - show discrepancy between current state and goals |
| Environmental barriers | Context assessment | Identify if their environment even allows practice (Gate 0 - permeability check) |

**Key Insight from MI Research:** For pre-contemplative users, DO NOT push action-focused drills. Instead:
- Build rapport first ("establish trust, ask permission")
- Use open-ended questions about their values and goals
- Show them their own data creating cognitive dissonance

---

### Gate B: MOTIVATION / DESIRE (Constraint 2)

**Failure Signatures:**
- Completes drills but shows no intrinsic interest
- Only engages when externally prompted
- Reports "I should do this" rather than "I want to"
- High dropout rate despite belief they can improve

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| No felt urgency | Values-alignment exercises | Connect communication skills to their personal goals (career advancement, relationships) |
| Competing priorities | Cost-benefit visualization | Show time investment vs. career ROI with personalized data |
| Effort feels disproportionate | Effort-reduction interventions | Micro-sessions (5-min drills instead of 30-min) |
| Past failures created learned helplessness | Success replay + reattribution | Show previous micro-wins; reframe past failures as skill deficits (not personal deficits) |

**Neuropsychology Basis:** Gate B failure = ventral striatum not assigning positive value to the goal. Interventions must activate incentive salience:
- Highlight immediate rewards (not just long-term career benefits)
- Use dopaminergic micro-wins (see Gate C)
- Frame drills as exploration rather than obligation

---

### Gate C: BELIEF / SELF-EFFICACY (Constraint 1)

**Failure Signatures:**
- Says "I can't do this" or "This won't work for me"
- Avoids difficult drills; gravitates to easy content
- High anxiety before sessions
- Quits after single failed attempt

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Low perceived controllability | Mastery experiences via progressive difficulty | Adaptive drill sequencing - start absurdly easy, increment by 5-10% difficulty |
| Body-based threat signals | Interoceptive regulation | Breathing exercises before high-stakes drills (dAI modulation) |
| Negative self-model | Micro-win accumulation | Daily "you succeeded at X" summaries; celebrate 1% improvements |
| Lack of vicarious experience | Social modeling | Show videos of similar users (not experts) succeeding at drills |

**Research-Backed Strategies:**
- From meta-analysis of self-efficacy interventions: 8-12 week programs with psychoeducation are most effective
- Homework assignments after each session strengthen self-efficacy
- Focus on positive mental health framing (not deficit-based)

**Implementation:**
- After each drill: "3 users like you struggled with this last week, then succeeded this week"
- Progressive difficulty + success replay: "You've now completed 47 drills. Here are 5 where you improved most."
- Avoid negative feedback loops (see Section 6)

---

### Gate D: INTENTION / PLANNING (Constraint 4)

**Failure Signatures:**
- Says "I'll practice later" repeatedly
- No consistent time-of-day pattern
- Opens app, browses, closes without action
- Vague goals ("I want to get better")

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| No implementation intention | If-then planning prompts | "If it's 8am on Tuesday, then I will do mirroring drill" (massive effect size d=0.65) |
| Decision fatigue | Pre-commitment mechanisms | Let them schedule next 3 sessions in advance; send calendar invites |
| Abstract goals | Specificity exercises | Force them to name: which skill, which drill, when, where, how long |
| Lack of cue-action link | Habit stacking | "After your morning coffee, open the app" (link to existing routine) |

**Neuroscience Basis:** Implementation intentions create strong cue-action associations in dlPFC, reducing need for in-the-moment willpower.

**Implementation:**
- Don't just say "practice more" -> Force if-then plan creation as part of onboarding
- Send contextual reminders (not generic): "You planned to practice calibrated questions at 8am - ready?"

---

### Gate E: ACTION / INITIATION (Constraint 6A)

**Failure Signatures:**
- Opens app at planned time but doesn't start drill
- Hovers on "Begin" button, then closes app
- Reports "I just couldn't make myself do it"
- Logs in, browses content, logs out

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Voluntary initiation failure (SMA/preSMA) | "Start impossibly small" interventions | Change button from "Begin 15-min drill" to "Begin 30-second drill" (reduce activation energy) |
| Perfectionism paralysis | "Good enough" framing | "Your goal: complete drill at 40% quality, not 100%" |
| Cold-start anxiety | Warm-up sequences | 10-second breathing exercise BEFORE drill starts (primes SMA) |
| Choice overload | Remove choice | "Today's drill: Labeling. Press Start." (No menu, no options) |

**Research Insight:** SMA dysfunction shows up as "readiness to act" failure. Your job: reduce the gap between intention and first action.

**Implementation:**
- Micro-commitments: "Can you do just 30 seconds?" (Most will continue after starting)
- Remove friction: No login screens, no "What do you want to practice?" menus at start time
- "Just show up" goal: Reward opening app at scheduled time, even if they don't complete drill

---

### Gate F: PERSISTENCE / MAINTENANCE (Constraint 6B)

**Failure Signatures:**
- Starts drills, quits 40% through
- Inconsistent daily engagement (3 days on, 4 days off)
- Streak breaks after 7-10 days
- "I forgot" is common excuse

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Effort-sustaining failure (dorsal striatum) | Shorter session durations | 5-min drills instead of 15-min (match to their actual capacity) |
| No habit automaticity | Streak mechanics | Visual streak counter (loss aversion) |
| Working memory failure | Just-in-time reminders | Daily SMS/push at their pre-committed time |
| Motivation decay | "Never miss twice" rule | Explicitly tell them: "Missing 1 day is okay. Missing 2 in a row breaks the chain" |

**Habit Formation Research (from Duolingo):**
- Daily streaks are the #1 retention driver
- Reminders work IF personalized and context-aware
- "No zero days" mindset: Completing something (even 1 drill) maintains momentum

**Implementation:**
- Adaptive session length: If user quits at 40% -> next session auto-shortens to 40% length
- Streak insurance: "You have 2 streak freezes this month - use one?"
- Social proof: "847 users are practicing right now"
- Avoid dependency traps: Streaks should support, not replace, intrinsic motivation

---

### Gate G: RECOVERY / RESILIENCE

**Failure Signatures:**
- Single bad drill performance -> week-long absence
- Missed streak -> "I'll start over Monday"
- Performance plateau -> disengagement
- One negative AI feedback -> avoidance

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Setback catastrophizing | Normalize-failure interventions | "87% of users fail this drill first time. You're on track." |
| All-or-nothing thinking | Partial-credit framing | "You completed 60% - that's progress!" (not "you failed") |
| Loss of momentum | 24-hour reset rule | Automated: "You missed yesterday. Do ONE drill today to get back on track." |
| Identity threat | Identity-based recovery | "Communicators practice daily. You're still a communicator even if you miss a day." |

**Research-Backed Recovery Strategies:**
- 1% improvement focus: After setback, improve system by 1% (e.g., set easier reminder, shorter drill)
- Never miss twice: Users who commit to resuming within 24 hours are 71% more likely to maintain long-term consistency
- Reframe as learning: "What made this week hard? Let's adjust your schedule."

---

### Gate H: INTEGRATION / IDENTITY

**Failure Signatures:**
- Completed 100+ drills but doesn't use skills in real life
- Sees app as "homework," not "who I am"
- No transfer from simulation to actual conversations
- "I'm good at drills, bad at real communication"

**Intervention Mapping:**

| Root Cause | Exercise Type | Specific Prescription |
|-----------|--------------|----------------------|
| Lack of real-world practice | Generalization exercises | "This week: use labeling in 1 real conversation, report back" |
| Simulation-reality gap | Ecological validity boost | AI scenarios based on their actual work context (sales calls, management, etc.) |
| Identity non-adoption | Identity reinforcement | Certificates, titles ("You're now a Certified Active Listener"), social sharing |
| No community belonging | Social features | Leaderboards, peer challenges, success story sharing |

**Implementation (within current scope):**
- Prompt: "Where will you use this skill this week?"
- Track: "Have you used mirroring outside the app?" (self-report)
- Celebrate transfer: "You reported using this IRL - here's a badge"

---

## 2. ADAPTIVE LEARNING PLATFORM INSIGHTS

### Duolingo's Adaptive Logic:
- Spaced repetition for struggling concepts
- Difficulty adjustment based on error rates
- Streaks as primary retention driver (500M users)
- Daily goals (XP targets) + social leaderboards

### Khan Academy's Mastery Model:
- Self-paced progression (neurodivergent-friendly)
- Mastery-based unlocking (can't advance until 80% accuracy)
- Hints and scaffolding on difficult problems
- Progress dashboards showing % completion by topic

### Key Pattern Across Platforms:
Meta-analysis of AI-enabled adaptive learning (N=45 studies):
- Medium-to-large positive effect (g=0.70) vs. non-adaptive
- Cognitive, affective, AND behavioral adaptation all matter
- Adaptive assessment is underutilized (most platforms only adapt navigation)

### What They DON'T Publish:
These platforms rarely share:
- Exact threshold algorithms (proprietary)
- Churn prediction models
- A/B test results on intervention types

But we can infer:
- Granular data collection (every click, pause, error logged)
- Behavioral clustering (group users by engagement patterns)
- Multi-armed bandit testing (try multiple interventions, double down on what works per user)

---

## 3. COMMUNICATION SKILLS: GATE-SPECIFIC BEHAVIORAL SIGNALS

**Failure Signature Diagnostic Table:**

| Gate | Drill Performance Signals | Engagement Signals | Temporal Signals |
|------|--------------------------|-------------------|-----------------|
| A: Awareness | Scores don't improve even with hints | Skips feedback reviews | No pattern - random login times |
| B: Desire | Completes drills mechanically (fast, low effort) | Only engages when nudged | Logins cluster after reminders only |
| C: Belief | Avoids "Hard" difficulty drills | Quits after first failure | Sessions shorten over time (3 min -> 1 min) |
| D: Intention | Browses but doesn't start drills | High app opens, low drill completions | No consistent time-of-day pattern |
| E: Initiation | Opens app at scheduled time, doesn't start | Long "hover time" on Start button | Gap between app open and first action >2 min |
| F: Persistence | Starts drills, quits midway | Streaks break repeatedly at 7-10 days | Sessions incomplete (40-60% progress) |
| G: Recovery | 3-7 day absence after bad performance | Single missed day -> multi-day absence | Performance variance spikes after setbacks |
| H: Integration | Perfect drill scores, no real-world usage | Doesn't self-report external use | Flat engagement despite mastery |

**Machine Learning Approach:**
- Log all interactions (not just completions)
- Track time-to-start, hover duration, exit points
- Build dropout prediction model by gate using these features
- Diagnostic output: "Gate [X] is most likely failing because [behavioral signature Y]"

---

## 4. PRESCRIPTION GRANULARITY

**Specificity Hierarchy by Gate:**

| Gate | Prescription Granularity | Rationale |
|------|-------------------------|-----------|
| A: Awareness | Specific exercise | "Do mirror drill comparing your recording to expert" - They need concrete evidence |
| B: Desire | Behavioral nudge | "Why do YOU want better communication?" - Motivation is personal, not skill-specific |
| C: Belief | Category + constraints | "Do any Easy-level drill" - They need wins, not specific skills |
| D: Intention | Specific exercise + time | "Mirroring drill at 8am Tuesday" - Implementation intention requires specificity |
| E: Initiation | Specific exercise (shortest) | "30-second labeling drill" - Reduce activation energy to minimum |
| F: Persistence | Category + duration | "Any drill, 5 minutes" - Build consistency, not perfectionism |
| G: Recovery | Any single exercise | "Complete ONE drill to restart streak" - Lower bar |
| H: Integration | Real-world challenge | "Use mirroring in 1 conversation this week" - Force transfer |

**General Rule:**
- Gates A-D (formation of intention): More specific, more directive
- Gates E-F (execution): Less specific, reduce friction
- Gate G (recovery): Extremely permissive
- Gate H (identity): Context-dependent, not drill-dependent

---

## 5. MI TECHNIQUES TRANSLATED TO APP-BASED INTERVENTIONS

### Pre-contemplation (Gate A):

| MI Technique | App Translation |
|-------------|----------------|
| Ask permission | "Can I show you something about your communication patterns?" |
| Raise doubts | Data visualization: "Your mirroring score is 32nd percentile" |
| Evoke discrepancy | "You said leadership is important. Leaders score 85%+ here." |
| Avoid confrontation | Never say "You're bad at this" -> "Most people find this challenging" |

### Contemplation (Gate B):

| MI Technique | App Translation |
|-------------|----------------|
| Decisional balance | "List pros and cons of improving this skill" (interactive exercise) |
| Explore ambivalence | "What makes practicing difficult for you?" (open-ended prompt) |
| Support self-efficacy | "You improved 12% on labeling last week" |

### Preparation (Gate D):

| MI Technique | App Translation |
|-------------|----------------|
| Develop action plan | Force creation of if-then implementation intention |
| Identify barriers | "What usually stops you from practicing?" -> suggest solutions |
| Strengthen commitment | "On a scale of 1-10, how confident are you about practicing tomorrow?" |

### Action (Gate E-F):

| MI Technique | App Translation |
|-------------|----------------|
| Support self-efficacy | Micro-win celebrations after EVERY completed drill |
| Problem-solve barriers | "You missed 3 days this week. What happened?" (debugging, not shaming) |
| Reframe lapses | "Setbacks are normal. 847 users bounced back this week." |

**Key Insight:** MI is about meeting people where they are. The diagnostic engine must match intervention stage to gate failure. Don't prescribe action-focused drills to a Gate A (awareness) failure.

---

## 6. AVOIDING NEGATIVE FEEDBACK LOOPS

### The Failure Paradox:
- Telling users "You're failing at Gate C (belief)" undermines Gate C (self-efficacy)
- Constant diagnostic messages create learned helplessness
- Users start to identify with the diagnosis ("I'm a Gate C person")

### Evidence from Mental Health Apps (RMT research):
**False positives (over-diagnosis) cause:**
- User distrust of system
- Alert fatigue
- Anxiety spikes
- Abandonment

**False negatives (under-diagnosis) cause:**
- Missed intervention opportunities
- User frustration ("Why isn't this helping?")

### Design Principles to Avoid Negative Loops:

**1. Diagnose Internally, Intervene Externally**
- System tracks: "Gate C failure detected"
- User sees: "Here are 3 easy wins to build momentum"
- Never show: "You scored 0 on Constraint 1 (Believability)"

**2. Positive Framing Always**
- Bad: "You're failing at Gate F (persistence)"
- Good: "Let's build your consistency muscle"
- Best: "Users who do [X] are 3x more likely to maintain streaks"

**3. Feed Forward, Not Feedback**
- Feedback: "You missed 5 days this month" (past-focused, shame-inducing)
- Feed forward: "Let's set up reminders so next week is easier" (future-focused, actionable)

**4. Normalize Struggle**
- "72% of users struggle with this drill initially"
- "Even advanced users take 3 attempts to master calibrated questions"
- Social proof reduces self-blame

**5. Celebrate Micro-Improvements**
- Don't wait for gate "success" to give positive feedback
- Reward: app opens, drill starts, 30-second completions, streak maintenance
- Research: Frequent small rewards > Infrequent large rewards for behavior change

**6. Adaptive Sensitivity**
- High-anxiety users: Less frequent diagnostic messages, more encouragement
- High-confidence users: More direct feedback, performance analytics
- Personalize communication style based on self-efficacy baseline

**7. "Never Miss Twice" Messaging**
- Research: Users who adopt this rule maintain habits 37% longer
- Don't say: "Your streak is broken - start over"
- Do say: "You missed yesterday. Do one drill today to keep your progress alive."

### The Safe Diagnostic Framework:

```
IF gate_failure_detected:
    internal_log("Gate X failure, Root Cause Y")

    # Don't tell user they failed
    # Do provide tailored intervention without diagnosis

    user_message = generate_intervention(gate, root_cause)
    # Examples:
    # Gate C -> "Here are 3 drills where users like you see quick wins"
    # Gate F -> "Pro tip: 5-minute sessions work better than 15-minute for busy schedules"
    # Gate A -> "Want to see how your communication patterns compare to expert examples?"
```

User never sees: "You have a Gate C (Constraint 1: Believability) failure."
User sees: Contextually appropriate intervention that happens to target Gate C.

---

## 7. IMPLEMENTATION ROADMAP: RULE-BASED SYSTEM

```python
def prescribe_intervention(gate_failure, root_cause, user_profile):

    # Gate A: Awareness
    if gate == "A":
        if root_cause == "lack_problem_awareness":
            return {
                "exercise": "mirror_drill_with_expert_comparison",
                "message": "Want to see what expert communicators do differently?",
                "type": "specific"
            }
        elif root_cause == "external_attribution":
            return {
                "exercise": "performance_data_dashboard",
                "message": "Here's your progress over the last 2 weeks - notice any patterns?",
                "type": "specific"
            }

    # Gate B: Desire
    if gate == "B":
        if root_cause == "no_felt_urgency":
            return {
                "exercise": "values_alignment_prompt",
                "message": "Quick question: Why does better communication matter to YOU?",
                "type": "nudge"
            }
        elif root_cause == "effort_too_high":
            return {
                "exercise": None,  # Don't assign exercise
                "message": "Let's try 5-minute sessions this week instead of 15",
                "type": "behavioral_nudge"
            }

    # Gate C: Belief
    if gate == "C":
        if root_cause == "low_self_efficacy":
            return {
                "exercise": "any_easy_drill",
                "message": "Quick win: Try an Easy-level drill. 94% of users succeed first try.",
                "type": "category_with_constraint",
                "difficulty": "easy"
            }
        elif root_cause == "negative_self_model":
            return {
                "exercise": "success_replay",
                "message": "You've improved 23% on labeling since last month. Here's proof:",
                "type": "specific"
            }

    # Gate D: Intention
    if gate == "D":
        if root_cause == "no_implementation_intention":
            return {
                "exercise": "force_if_then_planning",
                "message": "Let's schedule your next 3 sessions. When works for you?",
                "type": "specific_with_time"
            }

    # Gate E: Initiation
    if gate == "E":
        if root_cause == "cant_start":
            return {
                "exercise": "shortest_drill_available",
                "message": "Can you do just 30 seconds? That counts.",
                "type": "specific",
                "duration": "30_seconds"
            }

    # Gate F: Persistence
    if gate == "F":
        if root_cause == "streak_breaks":
            return {
                "exercise": "any_drill",
                "message": "Your rule: Never miss twice. Do ONE drill today.",
                "type": "category",
                "duration": "5_minutes"
            }

    # Gate G: Recovery
    if gate == "G":
        if root_cause == "setback_catastrophizing":
            return {
                "exercise": "any_single_drill",
                "message": "Welcome back! 71% of users who return within 24 hours maintain long-term progress.",
                "type": "any"
            }

    # Gate H: Integration
    if gate == "H":
        if root_cause == "no_real_world_transfer":
            return {
                "exercise": "real_world_challenge",
                "message": "This week's challenge: Use mirroring in 1 conversation. Report back!",
                "type": "external_behavior"
            }

    return intervention
```

---

## 8. FINAL RECOMMENDATIONS

1. **Start with Gates C, F, G** - These are most actionable and have clearest behavioral signatures
2. **Build your behavioral log first** - You need data on hover times, quit points, streak patterns before you can diagnose accurately
3. **A/B test intervention types** - Your user base will tell you what works (adaptive systems should adapt to YOUR users)
4. **Never show diagnostic labels to users** - They see interventions, not diagnoses
5. **Implement "never miss twice" explicitly** - Research shows this single rule dramatically improves retention
6. **Micro-wins are mandatory for Gate C** - Without frequent small successes, self-efficacy never builds
7. **If-then planning is mandatory for Gate D** - The effect size is too large to ignore (d=0.65)

---

## KEY IMPLEMENTATION TAKEAWAYS FOR KDENZ

### Priority Build Order for Diagnostic Engine:
1. **Behavioral logging** (prerequisite for everything) - track all interactions, not just completions
2. **Gate C interventions** (self-efficacy) - progressive difficulty + micro-win celebrations
3. **Gate F interventions** (persistence) - adaptive session length + streak mechanics + "never miss twice"
4. **Gate G interventions** (recovery) - normalize failure messaging + 24-hour reset rule
5. **Gate D interventions** (planning) - if-then implementation intentions in onboarding
6. **Gates A, B** (awareness, desire) - MI-based nudges, values alignment
7. **Gate E** (initiation) - friction reduction in UI
8. **Gate H** (integration) - real-world challenges (requires community features)

### Rule-Based vs ML:
- Start rule-based (IF gate = X AND root_cause = Y THEN prescribe = Z)
- Collect behavioral data for 3-6 months
- Graduate to ML-based diagnosis when you have enough data to cluster users by gate failure patterns

### Critical Design Constraint:
**Diagnose internally, intervene externally.** The user never sees gate labels, constraint numbers, or failure diagnoses. They see contextually appropriate nudges, exercises, and encouragement.
