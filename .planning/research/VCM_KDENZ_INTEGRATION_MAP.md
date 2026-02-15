# VCM-KDENZ Integration Map

**Purpose:** Merged synthesis of VCM diagnostic feasibility across 3 parallel analysis agents
**Sources:** Agent 2 (Signal Specificity), Agent 3 (Linguistic Markers), Agent 4 (Integration Feasibility)
**Date:** 2026-02-13
**Scope:** 57 active root causes across 9 gates (6 SKIP: C0-P, C0-2, C1-3, C1-7, C8A-8, C8B-9)
**Note:** V2 gate structure with C3 Awareness and C4 Attention inserted; all downstream gates renumbered

---

## 1. Executive Summary

### Key Findings

The VCM diagnostic engine is feasible for KDENZ. Three independent analyses converge on the following conclusions:

**Detection is viable.** 85% of root causes (52/61) produce observable signals through KDENZ's existing and planned detection channels. APP_BEHAVIOR alone covers 85% of root causes, making behavioral event logging the single most critical infrastructure investment. Linguistic markers and Hume prosody provide disambiguation, not primary detection.

**Signal overlap is the core challenge.** 85% of root causes share signals with other root causes. No single-channel observation can achieve root-cause-level diagnosis. The system requires convergent evidence from 3+ sessions and 2+ channels before acting on any hypothesis. Six overlap clusters were identified, each requiring explicit disambiguation rules.

**Rule-based detection covers the majority.** 76% of root causes (44/58) are detectable using RULE_BASED or PATTERN_MATCH methods requiring zero API calls. Gemini is needed only for P2/P3 nuanced language analysis. This validates the "rule-based diagnostics first" approach from R11.

**Launch with 8, scale to 50 by month 3.** Eight root causes produce clean, specific signals detectable from session 1-3 and directly impact retention. By month 3 with Hume and accumulated behavioral data, 86% coverage is achievable.

### Feasibility Assessment

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| Technical feasibility | HIGH | Behavioral telemetry + rules cover 76% of detection |
| Detection accuracy | MEDIUM | 85% signal overlap demands multi-signal confirmation |
| Cost efficiency | HIGH | $0.00/user at P0-P1; $0.10-0.50/user at P2-P3 |
| Implementation risk | LOW-MEDIUM | Biggest risk is false positives from overlap, not technical barriers |
| User impact | HIGH | P0 root causes directly address top churn drivers |

### Recommended Approach

1. Build comprehensive behavioral event logging infrastructure first (Sprint 1)
2. Implement 8 P0 root causes as rule-based detections at launch
3. Add 22 P1 root causes using pattern matching over accumulated data (month 1)
4. Integrate Hume batch API for prosodic disambiguation (month 3)
5. Add Gemini-based language analysis for remaining P2/P3 causes (month 3-6)
6. Graduate to ML-based diagnosis after 3-6 months of behavioral data

---

## 2. Priority Matrix

### P0 -- Launch (8 root causes)

| RC | Name | Gate | One-Line Description |
|----|------|------|---------------------|
| C1-6 | Fragile Confidence | C1 | Confidence collapses after any negative feedback; engagement crashes post-setback |
| C6-5 | Action Ambiguity | C6 | User opens app but does not know what to do; aimless navigation |
| C8A-1 | Motor Initiation Threshold | C8A | User stares at "start" button for extended periods but cannot press it |
| C8A-7 | Momentum Dependency | C8A | Cold starts are impossible but once started, performance is excellent |
| C8B-1 | Task Boredom | C8B | Within-session engagement decays as content becomes repetitive |
| C8B-4 | Single-Error Catastrophizing | C8B | User quits drill/recording immediately after first mistake |
| C8B-5 | Perfectionism | C8B | User retakes drills repeatedly despite passing scores, never advances |
| C8B-6 | Invisible Progress | C8B | Scores improve but user does not notice; engagement declines during plateaus |

### P1 -- Month 1 (22 root causes)

| RC | Name | Gate | One-Line Description |
|----|------|------|---------------------|
| C0-1/C5-8 | Environmental Friction | C0/C3 | Real environmental barriers (mic, quiet room) prevent voice practice |
| C1-1 | Cognitive Biases | C1 | Overconfidence: selects difficulty far above mastery level and fails |
| C1-2 | Fixed Mindset | C1 | Believes ability is fixed; avoids challenge; "I'm just not good at this" |
| C1-5 | Insufficient Evidence | C1 | Consumes educational content extensively without attempting drills |
| C1-8 | Attribution Error | C1 | Dismisses own success: "I got lucky"; scores improve but confidence flat |
| C2-1 | Value Misalignment | C2 | Pursues goal for external reasons; "should" language dominates over "want" |
| C2-6 | External Motivation | C2 | Engages only after push notifications; zero self-initiated sessions |
| C2-7 | Purpose Deficit | C2 | No meaningful connection to goal; flat engagement across all features |
| C5-1 | Energy Depletion | C7 | Time-of-day performance patterns; engagement crashes in evening |
| C5-2 | Delayed Gratification Intolerance | C7 | Demands immediate results; abandons if no visible improvement fast |
| C5-3 | Effort Overestimation | C7 | Views drill description, hesitates extensively, but performs well once started |
| C5-5 | Failure Cost Aversion | C7 | Avoids scored/graded exercises; only uses unscored practice modes |
| C5-6 | Decision Paralysis | C7 | Spends 5+ minutes on selection screens browsing without starting |
| C6-1 | Conflicting Plans | C6 | Starts 5+ technique tracks simultaneously, completes none |
| C6-2 | Chronic Replanning | C6 | Modifies learning path repeatedly without ever starting drills |
| C6-3 | Plan Selection Failure | C6 | Compares technique approaches within one category without choosing |
| C6-4 | Cognitive Overload | C6 | High scores on simple drills; fails on multi-step sequences |
| C6-7 | Weak Cue-Response Binding | C6 | High engagement quality when present but forgets to practice |
| C7-1 | Competing Commitments | C7 | Engagement drops during busy periods; burst-and-fade cycles |
| C7-2 | Environmental Disruption | C7 | Sudden engagement drop after life change; mid-session interruptions |
| C7-5 | Lack of Urgency | C7 | Perpetual postponement; low-frequency but stable engagement |
| C8A-2 | Last-Minute Deliberation | C8A | Starts drill then immediately backs out; re-reads instructions at start |
| C8A-5 | Over-Simulation | C8A | Knows theory (quiz scores high) but never practices |
| C8B-2 | Competing Stimuli | C8B | Mid-drill app backgrounding; fragmented session patterns |
| C8B-7 | High Restart Cost | C8B | Sessions interrupted mid-drill are never resumed same day |
| C8B-8 | Moral Self-Punishment | C8B | Extended absence following streak break; guilt language on return |

### P2 -- Month 3 (17 root causes)

| RC | Name | Gate | One-Line Description |
|----|------|------|---------------------|
| C1-4 | Meta-Cognitive Doubt | C1 | Doubts own judgment; changes answers repeatedly; high deliberation time |
| C2-2 | Fear-Suppressed Desire | C2 | Wants to improve but fears consequences of change |
| C2-3 | Emotional Avoidance | C2 | Avoids emotionally loaded techniques (accusation audit) while doing neutral ones |
| C2-4 | Autonomy Threat | C2 | Anti-recommendation behavior; engagement decreases after nudges |
| C2-8 | Lack of Future Relevance | C2 | No investment in long-term mastery; treats app as temporary curiosity |
| C5-4 | Insufficient Perceived Reward | C7 | Adequate performance but declining engagement; dismisses reward |
| C7-3 | No External Monitoring | C7 | Slow engagement decay without accountability structure |
| C7-4 | Insufficient Stakes | C7 | Casual abandonment; no distress at missed practice |
| C7-6 | Value Contradiction | C7 | Avoids technique categories that feel manipulative or unethical |
| C7-8 | Identity-Behavior Dissonance | C7 | Engagement cycles of decreasing duration; "I'm a fraud" |
| C8A-3 | Attention Diversion | C8A | App backgrounded within 10 seconds of reaching start screen |
| C8A-4 | Waiting for Readiness | C8A | Extensive content consumption before any practice; "not ready yet" |
| C8B-3 | Mood-Dependent Execution | C8B | Performance variance tracks mood; Hume baseline predicts session quality |

### P3 -- Month 6+ (4 root causes)

| RC | Name | Gate | One-Line Description |
|----|------|------|---------------------|
| C2-5 | Approach-Avoidance Conflict | C2 | Oscillating engagement without external trigger; high false positive risk |
| C6-6 | Recursive Justification | C6 | New excuse each session; requires Gemini to detect shifting justifications |
| C7-7 | Identity Misalignment | C7 | "That's not who I am"; requires sophisticated LLM language analysis |
| C8A-6 | Self-Sabotage | C8A | Creates obstacles before high-stakes drills; hard to distinguish from genuine issues |

### SKIP (6 root causes)

| RC | Name | Reason |
|----|------|--------|
| C0-P | Physical/Biological Limitation | Pre-volitional; requires clinical assessment; no KDENZ data access |
| C0-2 | Situational Blockage | External life constraints invisible to KDENZ; indistinguishable from disinterest |
| C1-3 | No Relatable Models | Social context outside KDENZ; markers unlikely to surface in drills |
| C1-7 | Social Disconfirmation | External social pressure invisible to KDENZ; cannot observe peer/family feedback |
| C8A-8 | Trauma-Related Freeze | SKIP for INTERVENTION; detect for safety only (routes to clinical referral) |
| C8B-9 | Competing Comforts | Consolidated into C8B-2 per foundational document; near-universal tendency |

---

## 3. Per-Root-Cause Integration Cards

### Gate C0 -- Environmental Permeability

**C0-1 / C5-8: Environmental Friction** (reclassified to C5-8)
- Signal: SHARED | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "By the time I set everything up...", "The setup is such a hassle", setup/logistics complaints
- Channels: CH3 + CH6 | P1 | Low complexity (rule-based differential voice vs. text engagement)
- Disambiguation: C5-3 inflates perceived effort; C0-1 cites real environmental costs. If obstacles removed, C0-1 resolves.

**C0-8: Trauma-Related Freeze** (reclassified from C8A-8)
- Signal: UNIQUE | VOICE_PROSODY + APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I shut down completely", "I freeze up", "I go blank" + sudden silences, vocal tremor
- Channels: CH2 + CH3 | P3 | High complexity (requires Hume freeze detection + clinical sensitivity)
- Note: DETECT for safety only; do NOT intervene. Route to clinical referral.

---

### Gate C1 -- Believability

**C1-1: Cognitive Biases (Overconfidence)**
- Signal: SHARED with C1-5 | DRILL_PERFORMANCE + APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I thought this would be easy", "I always underestimate how long things take"
- Channels: CH4 + CH6 | P1 | Low complexity (prediction-performance gap is quantifiable)

**C1-2: Fixed Mindset**
- Signal: SHARED with C1-8, C5-5 | LANGUAGE + APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I'm just not good at this", "Some people can, I can't", "You either have it or you don't"
- Channels: CH3 + CH4 + CH1 | P1 | Medium complexity (trait-language detection + avoidance pattern)
- Disambiguation: C1-2 avoids all challenge; C5-5 avoids only scored/evaluated contexts. C1-2 = "I can't"; C7-7 = "That's not me."

**C1-4: Meta-Cognitive Doubt**
- Signal: SHARED with C1-6, C8A-2 | DRILL_PERFORMANCE + LANGUAGE | NEEDS_PROXY
- Markers: "I can't trust my own decisions", "What if I'm wrong about being able to do this?"
- Channels: CH1 + CH4 + CH3 | P2 | Medium complexity (answer-change rate + deliberation time tracking)

**C1-5: Insufficient Evidence**
- Signal: SHARED with C1-4, C6-5 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "I need more information before I can commit", "I haven't done enough research yet"
- Channels: CH3 + CH6 | P1 | Low complexity (Institute/drill engagement ratio is clean signal)

**C1-6: Fragile Confidence**
- Signal: SHARED with C1-2, C8B-4 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "One bad day and I'm back to square one", "I lose all my confidence after one mistake"
- Channels: CH4 + CH3 | P0 | Low complexity (post-setback gap >72h pattern)
- Disambiguation: C1-6 = belief collapse across sessions; C8B-4 = within-session task abandonment.

**C1-8: Attribution Error**
- Signal: SHARED with C1-2, C1-6 | DRILL_PERFORMANCE + LANGUAGE | NEEDS_PROXY
- Markers: "I just got lucky", "It was easy, it doesn't count", "Anyone could have done that"
- Channels: CH1 + CH4 | P1 | Low complexity (improving scores + flat confidence is clean signal)

---

### Gate C2 -- Desire

**C2-1: Value Misalignment**
- Signal: SHARED with C2-6, C2-7 | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: "I should want this but I don't", "My heart isn't in it", heavy "should/supposed to" language
- Channels: CH6 + CH3 + CH2 | P1 | Medium complexity (engagement trajectory + onboarding language)

**C2-2: Fear-Suppressed Desire**
- Signal: SHARED with C2-3, C5-5 | VOICE_PROSODY + LANGUAGE | NEEDS_PROXY
- Markers: "I want to but what if...", "The idea excites me but terrifies me"
- Channels: CH2 + CH1 + CH3 | P2 | High complexity (requires Hume anxiety markers + approach-retreat pattern)
- Disambiguation: C2-2 fears consequences of change; C5-5 fears cost of failure specifically.

**C2-3: Emotional Avoidance**
- Signal: SHARED with C2-2, C5-5, C8A-6 | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: "I'd rather not think about it", "It makes me uncomfortable to even talk about this"
- Channels: CH3 + CH2 + CH4 | P2 | Medium complexity (differential avoidance by emotional intensity)
- Disambiguation: C2-3 avoids emotional categories regardless of difficulty; C1-2 avoids ALL challenge.

**C2-4: Autonomy Threat (Reactance)**
- Signal: SHARED with C7-7 | APP_BEHAVIOR + LANGUAGE | IMPLEMENTABLE
- Markers: "Don't tell me what to do", "The more they push, the less I want to"
- Channels: CH3 + CH1 + CH4 | P2 | Medium complexity (requires recommendation engine to measure against)

**C2-5: Approach-Avoidance Conflict**
- Signal: SHARED with C2-2, C7-6 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "Part of me wants to, part of me doesn't", "I go back and forth on this"
- Channels: CH3 + CH2 | P3 | High complexity (oscillation is common; high false positive risk)

**C2-6: External Motivation**
- Signal: SHARED with C2-1, C7-3 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I'm only doing this because my boss wants me to", "Without the reward, I wouldn't bother"
- Channels: CH6 + CH3 + CH7 | P1 | Low complexity (notification-to-session correlation is clean)

**C2-7: Purpose Deficit**
- Signal: SHARED with C2-1, C2-8, C7-5 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "What's the point?", "This doesn't matter", "Nothing feels meaningful"
- Channels: CH6 + CH1 + CH2 | P1 | Low complexity (onboarding can screen directly)
- Disambiguation: C2-7 = flat across ALL features; C2-1 = selective engagement with value-aligned skills.

**C2-8: Lack of Future Relevance**
- Signal: SHARED with C2-7, C5-2, C7-5 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "I won't care about this in 5 years", "This doesn't matter for my future"
- Channels: CH6 + CH1 + CH3 | P2 | Medium complexity (requires distinguishing from C5-2)
- Disambiguation: C2-8 does not VALUE the future outcome; C5-2 values it but cannot tolerate the delay.

---

### Gate C3 -- Awareness

**AA-1: Rationalization Loops**
- Signal: TBD | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: Borderline causal vmPFC, post-hoc justification patterns
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-2: Emotional Avoidance**
- Signal: TBD | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: Avoidance of emotionally loaded content/techniques
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-5: Lack of Clarity on Next Step**
- Signal: TBD | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: User aware of goal but unclear on concrete next action
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

---

### Gate C4 -- Attention

**AA-3: Pre-Action Distraction**
- Signal: SHARED with C8A-3 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "Phone popped up right before goal cue", amygdala hijack timing
- Channels: TBD | Priority TBD | Complexity TBD
- Disambiguation: AA-3 = distraction immediately before action; C8A-3 = general attention diversion

**AA-4: Reverse Inertia (gradient)**
- Signal: TBD | APP_BEHAVIOR | NEEDS_PROXY
- Markers: Difficulty transitioning from rest to action (gradient effect)
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-6: Distraction Vulnerability**
- Signal: TBD | APP_BEHAVIOR + DRILL_PERFORMANCE | NEEDS_PROXY
- Markers: Low dlPFC strength, extra weak to distractions (trait-level)
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-7: Low Baseline Energy**
- Signal: SHARED with C5-1 | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: "I don't have the energy to focus", general depletion affecting attention
- Channels: TBD | Priority TBD | Complexity TBD
- Disambiguation: AA-7 = attention-specific energy deficit; C5-1 = general effort-bearing capacity

**AA-8: Value Conflict**
- Signal: TBD | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: Goal conflicts with values, attention wanders due to internal conflict
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-9: Plan Selection Freeze (gradient)**
- Signal: TBD | APP_BEHAVIOR | NEEDS_PROXY
- Markers: Unable to allocate attention to single plan (gradient effect on selection)
- Channels: TBD | Priority TBD | Complexity TBD
- Note: V2 addition - detailed signal analysis pending

**AA-10: Environmental Interference**
- Signal: SHARED with C0-1/C5-8 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "Room setup/noise forced distraction", salient external cues everywhere
- Channels: TBD | Priority TBD | Complexity TBD
- Disambiguation: AA-10 = environmental cues hijack attention; C5-8 = environmental barriers to practice setup

---

### Gate C5 -- Will

**C5-1: Energy Depletion**
- Signal: SHARED with C8B-3, C8B-1 | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: "I'm too tired", "I have nothing left", "By the end of the day I have nothing left to give"
- Channels: CH3 + CH2 + CH7 | P1 | Low complexity (time-of-day performance patterns)
- Disambiguation: C5-1 is situational/recoverable; C0-P is chronic/medical. C5-1 is domain-selective.

**C5-2: Delayed Gratification Intolerance**
- Signal: SHARED with C2-8, C8B-6 | APP_BEHAVIOR + DRILL_PERFORMANCE | NEEDS_PROXY
- Markers: "I need to see results now", "I want instant results", "Show me it's working or I'm done"
- Channels: CH3 + CH4 + CH7 | P1 | Low complexity (feature preference ratio: Voice Practice >> Skills Lab)

**C5-3: Effort Overestimation**
- Signal: SHARED with C5-8, C8A-1 | APP_BEHAVIOR + DRILL_PERFORMANCE | NEEDS_PROXY
- Markers: "This will be horrible", "The amount of work is overwhelming"
- Channels: CH3 + CH1 + CH2 | P1 | Low complexity (preview-without-start events)
- Disambiguation: C5-3 overestimates effort but performs well; C8A-1 cannot start regardless of effort perception.

**C5-4: Insufficient Perceived Reward**
- Signal: SHARED with C2-7, C8B-1 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "The payoff isn't worth it", "The juice isn't worth the squeeze"
- Channels: CH3 + CH6 | P2 | Medium complexity (requires distinguishing from boredom and purpose deficit)

**C5-5: Failure Cost Aversion**
- Signal: SHARED with C2-2, C1-2, C8A-6 | APP_BEHAVIOR + LANGUAGE | IMPLEMENTABLE
- Markers: "I'd rather not try than fail", "What if I fail and everyone sees?"
- Channels: CH3 + CH4 + CH1 | P1 | Low complexity (scored vs. unscored preference ratio)

**C5-6: Decision Paralysis**
- Signal: SHARED with C6-3, C6-2 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I can't decide", "What if I choose wrong?", "I keep going back and forth"
- Channels: CH3 + CH4 | P1 | Low complexity (selection screen dwell time > 5min)
- Disambiguation: C5-6 = cost of choosing wrong (Will); C6-3 = unclear evaluation criteria (Intention).

---

### Gate C6 -- Intention

**C6-1: Conflicting Plans**
- Signal: SHARED with C7-1, C6-4 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "I have too many things going on", "Everything feels equally important"
- Channels: CH3 + CH7 | P1 | Low complexity (>5 skills started, none past introductory)

**C6-2: Chronic Replanning**
- Signal: SHARED with C5-6, C8A-5 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I need a better plan first", "I love the planning phase but never get to execution"
- Channels: CH3 + CH4 | P1 | Low complexity (goal_change frequency vs. drill_attempt count)

**C6-3: Plan Selection Failure**
- Signal: SHARED with C5-6, C6-5 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I don't know which approach to take", "They all seem okay but I can't pick"
- Channels: CH3 + CH4 | P1 | Medium complexity (similar to C5-6; differentiated by within-category browsing)

**C6-4: Cognitive Overload**
- Signal: SHARED with C6-1, C5-6 | DRILL_PERFORMANCE + APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "This plan is too complicated", "I can't remember all the steps"
- Channels: CH3 + CH4 | P1 | Low complexity (simple-vs-complex drill performance gap)

**C6-5: Action Ambiguity**
- Signal: SHARED with C1-5, C6-3 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I know I should do something but what?", "I don't know where to start"
- Channels: CH3 + CH4 | P0 | Low complexity (>5 screen transitions with 0 meaningful actions)

**C6-6: Recursive Justification**
- Signal: SHARED with C6-2, C8A-4 | APP_BEHAVIOR (weak) + LANGUAGE | NEEDS_PROXY
- Markers: "I have a good reason to wait", "Now isn't the right time because..."
- Channels: CH1 + CH3 + CH5 | P3 | High complexity (requires Gemini analysis of shifting justifications)

**C6-7: Weak Cue-Response Binding**
- Signal: UNIQUE | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I keep forgetting to do it", "The time comes and I just don't think about it"
- Channels: CH7 + CH3 | P1 | Low complexity (notification response >50% but self-initiated <20%)

---

### Gate C7 -- Commitment

**C7-1: Competing Commitments**
- Signal: SHARED with C6-1, C5-1 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "Something always comes up", "I keep getting pulled away"
- Channels: CH3 + CH7 | P1 | Medium complexity (temporal engagement pattern analysis)

**C7-2: Environmental Disruption**
- Signal: SHARED with C7-1, C0-2 | APP_BEHAVIOR + VOICE_PROSODY | NEEDS_PROXY
- Markers: "My environment keeps pulling me away", "Every time I sit down, something interrupts me"
- Channels: CH3 + CH6 | P1 | Low complexity (step-change detection in engagement)

**C7-3: No External Monitoring**
- Signal: SHARED with C2-6, C7-4 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "Nobody knows if I do it or not", "I need someone to hold me accountable"
- Channels: CH3 + CH7 | P2 | Medium complexity (requires accountability features to measure against)

**C7-4: Insufficient Stakes**
- Signal: SHARED with C7-3, C7-5 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "Nothing bad happens if I stop", "There are no consequences for quitting"
- Channels: CH3 + CH7 | P2 | Medium complexity (requires streak/gamification data)

**C7-5: Lack of Urgency**
- Signal: SHARED with C7-4, C2-8, C5-2 | APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I have plenty of time", "No rush", "I'll get to it eventually"
- Channels: CH3 + CH7 | P1 | Low complexity (perpetual postponement pattern)
- Disambiguation: C7-5 consciously deprioritizes; C6-7 genuinely forgets. "It can wait" vs "It didn't cross my mind."

**C7-6: Value Contradiction**
- Signal: SHARED with C2-5, C7-7 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "This goes against what I believe", "I feel like a hypocrite pursuing this"
- Channels: CH1 + CH5 + CH3 | P2 | High complexity (requires Gemini for value-conflict detection)

**C7-7: Identity Misalignment**
- Signal: SHARED with C7-6, C2-4 | LANGUAGE + APP_BEHAVIOR | NEEDS_PROXY
- Markers: "That's not who I am", "I'd feel fake doing that", "It feels inauthentic"
- Channels: CH6 + CH1 + CH5 | P3 | High complexity (requires sophisticated LLM language analysis)
- Disambiguation: C7-7 = "I won't" (identity choice); C1-2 = "I can't" (ability belief).

**C7-8: Identity-Behavior Dissonance**
- Signal: SHARED with C8B-8, C1-6 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I keep saying I'll change but I never do", "I'm a fraud", "My actions don't match my words"
- Channels: CH3 + CH7 | P2 | Medium complexity (requires longitudinal goal-vs-behavior comparison)

---

### Gate C8A -- Action Initiation

**C8A-1: Motor Initiation Threshold**
- Signal: SHARED with C5-3, C8A-7 | APP_BEHAVIOR + VOICE_PROSODY | IMPLEMENTABLE
- Markers: "I just can't start", "I sit there wanting to begin but can't"
- Channels: CH3 + CH2 | P0 | Low complexity (start-screen dwell time > 60s)
- Disambiguation: C8A-1 knows what to do but cannot start; C6-5 does not know what to do.

**C8A-2: Last-Minute Deliberation**
- Signal: SHARED with C8A-1, C1-4 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "Wait, let me think about this one more time", "Am I sure about this?"
- Channels: CH3 + CH2 | P1 | Low complexity (back-button from start screen >30% of visits)

**C8A-3: Attention Diversion**
- Signal: SHARED with C8B-2 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "I was about to start but then...", "My phone buzzed right as I was about to start"
- Channels: CH3 + CH4 | P2 | Medium complexity (requires app lifecycle event tracking)
- Disambiguation: C8A-3 = distraction at initiation moment; C8B-2 = distraction during task.

**C8A-4: Waiting for Readiness**
- Signal: SHARED with C8A-1, C5-3, C6-6 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "I'll start when I feel ready", "The timing isn't right"
- Channels: CH3 + CH1 | P2 | Medium complexity (conditional engagement pattern)
- Disambiguation: C8A-4 has one consistent readiness condition; C6-6 generates new reasons each time.

**C8A-5: Over-Simulation**
- Signal: SHARED with C6-2, C8A-4 | APP_BEHAVIOR (weak) | NEEDS_PROXY
- Markers: "I've thought about it a million times", "I know exactly what to do but haven't done it"
- Channels: CH3 + CH4 | P1 | Low complexity (quiz scores >80% + drill attempts <5)

**C8A-6: Self-Sabotage**
- Signal: SHARED with C5-5, C1-2 | DRILL_PERFORMANCE + VOICE_PROSODY | NEEDS_PROXY
- Markers: "Something always goes wrong right before I start", "I keep accidentally creating problems"
- Channels: CH3 + CH4 + CH5 | P3 | High complexity (hard to distinguish from genuine obstacles)

**C8A-7: Momentum Dependency**
- Signal: UNIQUE | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "Once I start, I'm fine -- it's just starting", "I need a push to get going"
- Channels: CH3 + CH4 | P0 | Low complexity (first-drill latency 3x+ subsequent-drill latency)

---

### Gate C8B -- Action Persistence

**C8B-1: Task Boredom**
- Signal: SHARED with C5-4, C8B-6 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "This is boring", "The novelty wore off", "I need something new to keep me engaged"
- Channels: CH3 + CH4 + CH2 | P0 | Low complexity (intra-session completion decay)
- Disambiguation: C8B-1 engagement recovers with novel content; C5-1 does not.

**C8B-2: Competing Stimuli (Distraction)**
- Signal: SHARED with C8A-3 | APP_BEHAVIOR + VOICE_PROSODY | IMPLEMENTABLE
- Markers: "I keep checking my phone", "I can't focus", "I hear a notification and I'm gone"
- Channels: CH3 + CH4 | P1 | Low complexity (>2 app-background events per session during drills)

**C8B-3: Mood-Dependent Execution**
- Signal: SHARED with C5-1, C8A-4 | VOICE_PROSODY + APP_BEHAVIOR | NEEDS_PROXY
- Markers: "I can only do it when I feel good", "My performance depends on my mood"
- Channels: CH3 + CH2 + CH7 | P2 | High complexity (requires Hume mood-performance correlation)

**C8B-4: Single-Error Catastrophizing**
- Signal: SHARED with C1-6, C8B-5 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "I messed up so why bother", "One mistake ruins everything", "I already blew it"
- Channels: CH4 + CH3 | P0 | Low complexity (drill abandoned within 10s of first error)
- Disambiguation: C8B-4 = task abandonment; C1-6 = belief collapse across sessions.

**C8B-5: Perfectionism**
- Signal: SHARED with C8B-4, C8A-4 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "It's not good enough", "I need to redo this", "If I can't do it perfectly, why do it at all?"
- Channels: CH4 + CH3 | P0 | Low complexity (retake rate >3x with passing scores)

**C8B-6: Invisible Progress**
- Signal: SHARED with C5-2, C8B-1, C5-4 | APP_BEHAVIOR + DRILL_PERFORMANCE | IMPLEMENTABLE
- Markers: "I'm not getting anywhere", "Nothing is changing", "All this effort and nothing to show"
- Channels: CH3 + CH7 | P0 | Low complexity (improving scores + declining engagement)
- Disambiguation: C8B-6 = not seeing results; C5-2 = can't tolerate delay; C2-7 = no meaning.

**C8B-7: High Restart Cost**
- Signal: SHARED with C8A-7, C8A-1 | APP_BEHAVIOR | IMPLEMENTABLE
- Markers: "Once I stop, I can't get back to it", "Breaks ruin my flow"
- Channels: CH3 + CH4 | P1 | Low complexity (post-interruption return rate <20%)

**C8B-8: Moral Self-Punishment**
- Signal: SHARED with C7-8, C8B-4, C1-6 | APP_BEHAVIOR + LANGUAGE | NEEDS_PROXY
- Markers: "I feel terrible about missing a day", "I don't deserve to try again", "The guilt makes me want to hide"
- Channels: CH3 + CH7 + CH1 | P1 | Medium complexity (streak-break to absence correlation)
- Disambiguation: C8B-8 = moral judgment ("I don't deserve"); C8B-4 = cognitive assessment ("it's ruined").

---

## 4. Cross-Gate Disambiguation Guide

Six overlap clusters require explicit resolution strategies when multiple root causes produce overlapping signals.

### Cluster 1: Avoidance

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C2-2 (Fear-Suppressed Desire) | Avoidance behavior | WHAT is feared: consequences of change, success or failure |
| C2-3 (Emotional Avoidance) | Avoidance behavior | WHAT is avoided: specific emotional content categories |
| C5-5 (Failure Cost Aversion) | Avoidance behavior | WHAT is avoided: scored/evaluated contexts specifically |
| C8A-6 (Self-Sabotage) | Avoidance behavior | HOW: creates barriers unconsciously vs. conscious avoidance |

**Resolution strategy:** Check avoidance target.
- Emotional categories (labeling, empathy) avoided while neutral techniques completed -> C2-3
- All scored/evaluated drills avoided while unscored modes used -> C5-5
- All challenge avoided regardless of type -> C1-2 (fixed mindset, upstream)
- "Accidents" before high-stakes drills; performance inconsistency -> C8A-6
- Approach-retreat oscillation with fear language about outcomes -> C2-2

**Linguistic differentiators:**
- "It makes me uncomfortable" -> C2-3
- "What if I fail?" -> C5-5
- "Something always goes wrong" -> C8A-6
- "What if everything changes?" -> C2-2

### Cluster 2: Paralysis (Browse-Without-Action)

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C5-6 (Decision Paralysis) | Browse without selecting | WHERE: overwhelmed by option volume at any level |
| C6-3 (Plan Selection Failure) | Browse without selecting | WHERE: comparing approaches within a single goal area |
| C6-6 (Recursive Justification) | Browse without acting | HOW: new excuse each session; shifting barriers |

**Resolution strategy:** Check where and why the user stalls.
- Browsing across many categories, overwhelmed by volume -> C5-6
- Browsing within one category, comparing approaches -> C6-3
- Brief browsing followed by departure with new reason each time -> C6-6

**Linguistic differentiators:**
- "I can't decide" / "What if I choose wrong?" -> C5-6
- "I can't pick between three approaches" -> C6-3
- "Now isn't the right time because..." (different reason each session) -> C6-6

### Cluster 3: Can't-Start

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C8A-1 (Motor Initiation) | Long time-to-start | WHAT HAPPENS AFTER: variable; motor inertia |
| C8A-4 (Waiting for Readiness) | Long time-to-start | WHY: waiting for self-imposed conditions |
| C8A-7 (Momentum Dependency) | Long time-to-start | WHAT HAPPENS AFTER: excellent performance once started |
| C5-3 (Effort Overestimation) | Long time-to-start | WHAT HAPPENS AFTER: adequate performance; effort was overestimated |

**Resolution strategy:** Check post-start performance and stated reason.
- Starts eventually, excellent performance, consistent cold-start pattern -> C8A-7
- Starts eventually, adequate performance, "it wasn't that bad" -> C5-3
- Cannot start; no consistent improvement after start; frustrated -> C8A-1
- Does not start until conditions met; "not ready" language -> C8A-4

**Linguistic differentiators:**
- "Once I start I'm fine, it's just starting" -> C8A-7
- "This will be horrible" (but then does fine) -> C5-3
- "I just can't start" (even when ready) -> C8A-1
- "I'll start when I feel ready" -> C8A-4

### Cluster 4: Low Engagement

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C2-7 (Purpose Deficit) | Flat/low usage | PATTERN: uniformly flat across all features; nihilistic language |
| C2-8 (Lack of Future Relevance) | Flat/low usage | PATTERN: shallow breadth; no investment in long-term mastery |
| C7-5 (Lack of Urgency) | Flat/low usage | PATTERN: stable low frequency; no deadline pressure |
| C5-4 (Insufficient Reward) | Flat/low usage | PATTERN: adequate performance but declining; cost-benefit dismissal |

**Resolution strategy:** Check engagement shape and language.
- Uniformly flat from start, no favorites, "What's the point?" -> C2-7
- Shallow exploration without depth, "Won't matter in 5 years" -> C2-8
- Stable low frequency, not declining, "No rush" -> C7-5
- Adequate scores, declining engagement, "Not worth the effort" -> C5-4

### Cluster 5: Post-Failure Dropout

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C1-6 (Fragile Confidence) | Dropout after failure | TIMING: between sessions; 72+ hour gap; confidence collapse |
| C8B-4 (Catastrophizing) | Dropout after failure | TIMING: mid-drill; immediate quit after first error |
| C8B-8 (Moral Self-Punishment) | Dropout after failure | TIMING: multi-day absence after streak break; guilt language |
| C7-8 (Identity-Behavior Dissonance) | Dropout after failure | TIMING: decreasing engagement cycles over months |

**Resolution strategy:** Check temporal scope and mechanism.
- Drill abandoned within seconds of first error -> C8B-4
- 72+ hour session gap following low score -> C1-6
- 5+ day absence after streak break, guilt language on return -> C8B-8
- Engagement cycles of decreasing duration over months, "I'm a fraud" -> C7-8

**Linguistic differentiators:**
- "I messed up so why bother" (mid-task) -> C8B-4
- "I can't do anything" (between sessions) -> C1-6
- "I don't deserve to try again" (after streak break) -> C8B-8
- "I keep saying I'll change but never do" (chronic) -> C7-8

### Cluster 6: Confidence/Efficacy

| Root Cause | Shared Signal | Disambiguation Key |
|-----------|--------------|-------------------|
| C1-2 (Fixed Mindset) | Low efficacy behavior | LANGUAGE: fixed trait attribution; "I'm just not..." |
| C1-4 (Meta-Cognitive Doubt) | Low efficacy behavior | LANGUAGE: doubts own judgment; recursive self-questioning |
| C1-8 (Attribution Error) | Low efficacy behavior | LANGUAGE: dismisses success; "I got lucky" |

**Resolution strategy:** Check the direction and target of doubt.
- Fixed trait language, avoids challenge, no improvement acknowledgment -> C1-2
- Recursive self-doubt, changes answers repeatedly -> C1-4
- Good performance but dismisses it, "doesn't count" -> C1-8

**Linguistic differentiators:**
- "I'm just not good at this" (trait, stable) -> C1-2
- "What if I'm wrong about being able to do this?" (meta, recursive) -> C1-4
- "That doesn't prove anything about my ability" (dismissal, external) -> C1-8

---

## 5. Gate Detection Confidence Table

Percentage of each gate's root causes detectable at each implementation phase.

| Gate | Total RCs | P0 (Launch) | P1 (Month 1) | P2 (Month 3) | P3 (Month 6+) |
|------|-----------|-------------|---------------|---------------|----------------|
| C0 (Env. Permeability) | 3* | 0% (0/3) | 33% (1/3) | 67% (2/3) | 100% (3/3) |
| C1 (Believability) | 6** | 17% (1/6) | 83% (5/6) | 100% (6/6) | 100% |
| C2 (Desire) | 8 | 0% (0/8) | 38% (3/8) | 75% (6/8) | 100% (8/8) |
| C3 (Will) | 7 | 0% (0/7) | 86% (6/7) | 100% (7/7) | 100% |
| C4 (Intention) | 7 | 14% (1/7) | 86% (6/7) | 86% (6/7) | 100% (7/7) |
| C5 (Commitment) | 7*** | 0% (0/7) | 43% (3/7) | 86% (6/7) | 100% (7/7) |
| C6A (Action Initiation) | 7**** | 29% (2/7) | 57% (4/7) | 86% (6/7) | 100% (7/7) |
| C6B (Action Persistence) | 8***** | 50% (4/8) | 88% (7/8) | 100% (8/8) | 100% |
| **TOTAL** | **53 active** | **15% (8/53)** | **64% (34/53)** | **89% (47/53)** | **100% (53/53)** |

\* Excludes C0-P and C0-2 (SKIP); includes C0-8 (detect-only)
\** Excludes C1-3 and C1-7 (SKIP)
\*** Excludes nothing but C7-7 is P3
\**** Excludes C8A-8 (SKIP for intervention; counted as C0-8 above)
\***** Excludes C8B-9 (consolidated into C8B-2)

**Key takeaway:** C6B (Persistence) is the most detectable gate at launch (50%). C2 (Desire) and C5 (Commitment) are the hardest to detect early, requiring more sophisticated analysis.

---

## 6. Implementation Roadmap

### Sprint 1: Core Telemetry (Weeks 1-2) -- Enables P0

**Goal:** Instrument behavioral events for the 8 P0 root causes.

**Required events:**
- `app_open` + `first_action` with timestamps (C8A-1, C8A-7)
- `drill_start`, `drill_complete`, `drill_abandon` with per-question timing (C8B-4)
- `drill_error` with timing relative to abandon (C8B-4)
- `drill_retake` count per skill with score tracking (C8B-5)
- `screen_transition` without meaningful activity (C6-5)
- Per-drill engagement time within session (C8B-1, C8B-6)
- Score trajectory with post-setback session gap tracking (C1-6)

**Detection rules (8 total):**

| RC | Rule | Confidence Threshold |
|----|------|---------------------|
| C1-6 | IF post_low_score_gap > 72h AND pattern_count > 2 THEN flag | 3+ cycles |
| C6-5 | IF screens_visited > 10 AND meaningful_interactions = 0 AND sessions > 3 THEN flag | 3+ sessions |
| C8A-1 | IF start_screen_dwell > 60s AND post_start_performance = ADEQUATE THEN flag | 5+ sessions |
| C8A-7 | IF first_drill_start_delay > 3x subsequent_drill_delay AND session_duration > 15min THEN flag | 3+ sessions |
| C8B-1 | IF intra_session_completion_declining AND technique_engagement_declining THEN flag | 5+ sessions |
| C8B-4 | IF quit_within_10s_of_error > 50% AND error_triggered_restarts > 3 THEN flag | 3+ sessions |
| C8B-5 | IF retry_rate > 50% AND passing_scores AND time_per_drill > 3x_expected THEN flag | 5+ sessions |
| C8B-6 | IF mastery_score_improving AND engagement_declining AND progress_view = 0 THEN flag | 10+ sessions |

**Infrastructure built:** Behavioral event logging table, session timing, drill event pipeline.

---

### Sprint 2: Engagement Patterns (Weeks 3-4) -- Enables P1 Wave 1

**Goal:** Pattern detection over accumulated session data.

**Required analysis:**
- Feature preference ratios across pillars (C5-2, C1-5, C8A-5)
- Difficulty selection tracking (C1-2, C5-5)
- Selection screen dwell time (C5-6, C6-3)
- Skill breadth-vs-depth ratio (C6-1)
- Goal change frequency vs. drill attempts (C6-2)
- Preview-without-start events (C5-3)
- Time-of-day performance patterns (C5-1)

**Root causes enabled (12):** C1-1, C1-2, C1-5, C5-1, C5-2, C5-3, C5-5, C5-6, C6-1, C6-2, C6-3, C8A-5

---

### Sprint 3: Spaced Repetition + Streak Integration (Weeks 5-6) -- Enables P1 Wave 2

**Goal:** Leverage review compliance, streak data, and notification correlation.

**Required data:**
- Review compliance rate and overdue counts (C6-7)
- Streak break patterns and post-break absence duration (C8B-8)
- Notification-to-action correlation (C2-6)
- Engagement trend with temporal patterns (C7-1, C7-2, C7-5)
- Interrupted session resumption tracking (C8B-7)
- Start-then-stop events (C8A-2)
- Score improvement vs. confidence self-rating (C1-8)

**Root causes enabled (10):** C1-8, C2-1, C2-6, C2-7, C6-7, C7-1, C7-2, C7-5, C8A-2, C8B-2, C8B-7, C8B-8

---

### Sprint 4: Hume Integration (Weeks 7-8) -- Enables P2 Wave 1

**Goal:** Add prosody/emotion detection for disambiguation.

**Required Hume data:**
- Within-session energy decay (enhances C8B-1, C5-1)
- Error-response emotional markers (enhances C8B-4, C1-6)
- Mood-performance correlation (enables C8B-3)
- Freeze detection / autonomic markers (enables C0-8 screening)
- Anxiety markers on emotionally loaded content (enables C2-3)
- Stress/fear markers on goal discussion (enables C2-2)

**Root causes enabled/enhanced (6 new + 10 enhanced):** C2-2, C2-3, C8B-3, C0-8, + enhanced confidence for C1-4, C2-4, C2-8, C5-4, C7-3, C7-4, C7-8, C8A-3, C8A-4

---

### Sprint 5: Gemini Language Analysis (Weeks 9-10) -- Enables P2 Wave 2 + P3

**Goal:** LLM-based language pattern detection for remaining causes.

**Required analysis:**
- Value/identity conflict language (C7-6, C7-7)
- Shifting justification detection (C6-6)
- Self-sabotage pattern analysis (C8A-6)
- Self-referential language classification (enhances C1-2, C1-8, C7-8)

**Root causes enabled (4):** C2-5, C6-6, C7-7, C8A-6

---

### Sprint 6: Recommendation Feedback Loop (Weeks 11-12) -- Full Coverage

**Goal:** Use recommendation acceptance/rejection data for remaining causes.

**Required data:**
- Recommendation acceptance rate (enables C2-4 measurement)
- Goal-vs-behavior longitudinal comparison (enhances C7-8)
- Accountability feature response (enhances C7-3)

---

## 7. Architecture Requirements

### 7.1 Behavioral Event Schema

The `behavioral_events` table must capture ALL user interactions. This is the foundation for 85% of detection.

**Required event types:**

| Event | Fields | Enables |
|-------|--------|---------|
| `app_open` | timestamp, source (notification/organic) | C8A-1, C8A-7, C2-6 |
| `first_action` | timestamp, action_type | C8A-1, C8A-7, C6-5 |
| `screen_transition` | from_screen, to_screen, dwell_time_ms | C6-5, C5-6, C6-3 |
| `drill_start` | skill_id, difficulty, timestamp | C1-2, C5-5, C6-1 |
| `drill_error` | question_index, error_type, timestamp | C8B-4 |
| `drill_abandon` | questions_completed, total_questions, last_error_gap_ms | C8B-4, C8B-1 |
| `drill_complete` | score, time_taken, retake_number | C8B-5, C1-1, C6-4 |
| `drill_retake` | skill_id, attempt_number, previous_score | C8B-5 |
| `feature_preview` | feature_type, dwell_time_ms, did_start | C5-3 |
| `app_background` | during_drill, screen_at_switch | C8B-2, C8A-3 |
| `session_end` | trigger (user/timeout/error), last_activity | C8B-7, C7-2 |
| `notification_sent` | type, timestamp | C2-6, C6-7 |
| `notification_response` | action (opened/dismissed), lag_ms | C2-6, C6-7 |
| `streak_break` | previous_streak_length, days_until_return | C8B-8 |
| `settings_change` | field_changed, old_value, new_value | C6-2 |
| `content_view` | content_id, content_type, duration_ms | C1-5, C8A-5 |
| `progress_dashboard_view` | timestamp, features_viewed | C8B-6 |

### 7.2 Detection Rules Format

Rules follow an IF-THEN structure with confidence accumulation:

```
{
  "rule_id": "VCM_C6B4_001",
  "root_cause": "C8B-4",
  "gate": "C6B",
  "name": "Single-Error Catastrophizing",
  "condition": {
    "events": ["drill_error", "drill_abandon"],
    "pattern": "drill_abandon WITHIN 10s OF drill_error",
    "threshold": {"count": 3, "sessions": 2},
    "confidence_weight": 0.8
  },
  "exclusions": ["first_session"],
  "action": "flag_hypothesis",
  "intervention_id": "INT_C6B4_error_tolerance"
}
```

**Rule types:**
- THRESHOLD: single metric exceeds value (e.g., start_screen_dwell > 60s)
- RATIO: two metrics compared (e.g., scored/unscored preference > 3:1)
- PATTERN: temporal sequence (e.g., error -> abandon within 10s)
- TREND: metric direction over time (e.g., engagement declining 10%/week)
- CORRELATION: two metrics co-vary (e.g., score plateau + engagement drop)

**Confidence accumulation:**
- First occurrence: 1x weight
- Second in different session: 1.5x weight
- Third: 2x weight
- Require total confidence > threshold before flagging
- Require 2+ channels confirming before any intervention

### 7.3 Linguistic Matching Approach

**When to use:** Secondary disambiguation when behavioral signals are ambiguous. Applied to:
- Web Speech API transcripts (Voice Practice, real-time)
- Simulation Studio conversation turns (post-turn analysis)
- Drill text responses (Skills Lab, per-answer)
- Onboarding self-assessment text fields

**Architecture:**
1. **Gate-level keyword clusters** (Appendix A of Agent 3): Fast initial triage using 8 keyword cluster groups. Low cost, high recall.
2. **Root-cause explicit markers** (per-RC from Agent 3): Triggered AFTER gate hypothesis forms. Match against top 2-3 explicit phrases per root cause.
3. **Gemini analysis** (P2/P3 only): For nuanced patterns requiring intent understanding -- value conflicts, identity language, justification shifting.

**Weighting:**
- Explicit markers in goal-pursuit context: 0.8-1.0 per match
- Implicit patterns (multiple co-occurring): 0.3-0.5, cumulative
- Sentiment/tone (gate-level only): 0.2-0.3

**Anti-patterns to avoid:**
- Single-instance markers outside ONE-TIME classification do not trigger hypotheses
- Casual/humorous usage must be discounted
- High-stress simulation markers may reflect scenario, not trait
- Self-aware language ("I know I tend to...") may indicate partial resolution, not active RC

### 7.4 Hume Integration Points

Root causes requiring prosody data for detection or disambiguation:

| RC | Hume Data Needed | Purpose |
|----|-----------------|---------|
| C0-8 | Freeze markers (sudden silence, breath-holding, vocal tremor) | Safety detection -- routes to clinical |
| C2-2 | Anxiety/stress markers during positive-outcome discussion | Detects fear-suppressed desire |
| C2-3 | Discomfort/anxiety on emotionally loaded content | Confirms emotional avoidance |
| C5-1 | Energy baseline at session start; fatigue markers | Confirms energy depletion |
| C8B-1 | Energy decay within session; falling pitch contour | Confirms within-session boredom |
| C8B-3 | Mood baseline predicting session performance | Enables mood-dependent execution detection |
| C8B-4 | Frustration spike after errors | Enhances catastrophizing detection |
| C1-6 | Confidence markers dropping post-feedback | Enhances fragile confidence detection |

**Integration pattern:** Hume batch API (post-session). Audio recorded during Voice Practice and Simulation Studio. Uploaded via backend proxy. Results returned within minutes. Auto-cleanup after 24 hours per R7.

### 7.5 Gemini Integration Points

Root causes requiring LLM analysis for detection:

| RC | Gemini Analysis | Frequency | Est. Cost |
|----|----------------|-----------|-----------|
| C6-6 | Detect shifting justifications across session reflections | Per session with reflection | ~$0.005 |
| C7-6 | Detect value-based objections in drill/simulation transcripts | Per transcript | ~$0.005 |
| C7-7 | Detect identity-based resistance language | Per transcript | ~$0.005 |
| C8A-6 | Detect self-handicapping patterns in obstacle reports | Weekly aggregate | ~$0.005 |
| C1-8 | Detect external attribution in post-success language | Per high-score event | ~$0.003 |
| C2-2 | Detect fear/consequence themes in simulation | Per simulation session | ~$0.005 |

**Integration pattern:** Gemini analysis runs on EXISTING transcripts (does not generate new conversations). Uses shorter prompts than simulation conversations. Runs as background job after session ends.

---

## 8. Cost Model

### API Costs per Active User per Month

| Phase | Behavioral Telemetry | Hume Batch | Gemini VCM Analysis | Total per User |
|-------|---------------------|------------|---------------------|----------------|
| P0 (Launch) | $0.00 | $0.00 | $0.00 | **$0.00** |
| P1 (Month 1) | $0.00 | $0.00 | $0.00 | **$0.00** |
| P2 (Month 3) | $0.00 | ~$0.10-0.15* | ~$0.10-0.25 | **$0.20-0.40** |
| P3 (Month 6+) | $0.00 | ~$0.10-0.15 | ~$0.30-0.50 | **$0.40-0.65** |

\* Hume costs are shared with Voice Practice prosody analysis (not VCM-specific incremental cost). These are the VCM-attributable portion.

**Key cost insight:** 76% of root causes (44/58) require zero API calls. The rule-based diagnostics first approach keeps VCM diagnostic costs at $0 through P1, when the majority of high-impact detection is already active.

**Gemini VCM costs are additive to Simulation Studio costs.** Simulation conversations cost ~$0.01-0.02/session. VCM analysis costs ~$0.003-0.005 per existing transcript analyzed. At 15 sessions/month with 3-5 VCM calls per session, Gemini VCM adds ~$0.10-0.25/month.

### Cost Scaling

| Active Users | Monthly P0 Cost | Monthly P2 Cost | Monthly P3 Cost |
|-------------|----------------|----------------|----------------|
| 100 | $0 | $20-40 | $40-65 |
| 1,000 | $0 | $200-400 | $400-650 |
| 10,000 | $0 | $2,000-4,000 | $4,000-6,500 |

---

## Appendix: Root Cause ID Quick Reference

All 61 root causes with status. Active root causes appear in Priority Matrix (Section 2) and Integration Cards (Section 3).

| Gate | RC ID | Name | Status | Priority |
|------|-------|------|--------|----------|
| C0 | C0-P | Physical/Biological Limitation | SKIP | -- |
| C0 | C0-1/C5-8 | Environmental Friction | Active | P1 |
| C0 | C0-2 | Situational Blockage | SKIP | -- |
| C0 | C0-8 | Trauma-Related Freeze | Detect-only | P3 |
| C1 | C1-1 | Cognitive Biases | Active | P1 |
| C1 | C1-2 | Fixed Mindset | Active | P1 |
| C1 | C1-3 | No Relatable Models | SKIP | -- |
| C1 | C1-4 | Meta-Cognitive Doubt | Active | P2 |
| C1 | C1-5 | Insufficient Evidence | Active | P1 |
| C1 | C1-6 | Fragile Confidence | Active | P0 |
| C1 | C1-7 | Social Disconfirmation | SKIP | -- |
| C1 | C1-8 | Attribution Error | Active | P1 |
| C2 | C2-1 | Value Misalignment | Active | P1 |
| C2 | C2-2 | Fear-Suppressed Desire | Active | P2 |
| C2 | C2-3 | Emotional Avoidance | Active | P2 |
| C2 | C2-4 | Autonomy Threat | Active | P2 |
| C2 | C2-5 | Approach-Avoidance Conflict | Active | P3 |
| C2 | C2-6 | External Motivation | Active | P1 |
| C2 | C2-7 | Purpose Deficit | Active | P1 |
| C2 | C2-8 | Lack of Future Relevance | Active | P2 |
| C7 | C5-1 | Energy Depletion | Active | P1 |
| C7 | C5-2 | Delayed Gratification Intolerance | Active | P1 |
| C7 | C5-3 | Effort Overestimation | Active | P1 |
| C7 | C5-4 | Insufficient Perceived Reward | Active | P2 |
| C7 | C5-5 | Failure Cost Aversion | Active | P1 |
| C7 | C5-6 | Decision Paralysis | Active | P1 |
| C7 | C5-8 | Environmental Friction | (see C0-1) | P1 |
| C6 | C6-1 | Conflicting Plans | Active | P1 |
| C6 | C6-2 | Chronic Replanning | Active | P1 |
| C6 | C6-3 | Plan Selection Failure | Active | P1 |
| C6 | C6-4 | Cognitive Overload | Active | P1 |
| C6 | C6-5 | Action Ambiguity | Active | P0 |
| C6 | C6-6 | Recursive Justification | Active | P3 |
| C6 | C6-7 | Weak Cue-Response Binding | Active | P1 |
| C7 | C7-1 | Competing Commitments | Active | P1 |
| C7 | C7-2 | Environmental Disruption | Active | P1 |
| C7 | C7-3 | No External Monitoring | Active | P2 |
| C7 | C7-4 | Insufficient Stakes | Active | P2 |
| C7 | C7-5 | Lack of Urgency | Active | P1 |
| C7 | C7-6 | Value Contradiction | Active | P2 |
| C7 | C7-7 | Identity Misalignment | Active | P3 |
| C7 | C7-8 | Identity-Behavior Dissonance | Active | P2 |
| C8A | C8A-1 | Motor Initiation Threshold | Active | P0 |
| C8A | C8A-2 | Last-Minute Deliberation | Active | P1 |
| C8A | C8A-3 | Attention Diversion | Active | P2 |
| C8A | C8A-4 | Waiting for Readiness | Active | P2 |
| C8A | C8A-5 | Over-Simulation | Active | P1 |
| C8A | C8A-6 | Self-Sabotage | Active | P3 |
| C8A | C8A-7 | Momentum Dependency | Active | P0 |
| C8A | C8A-8 | Trauma-Related Freeze | SKIP (intervention) | -- |
| C8B | C8B-1 | Task Boredom | Active | P0 |
| C8B | C8B-2 | Competing Stimuli | Active | P1 |
| C8B | C8B-3 | Mood-Dependent Execution | Active | P2 |
| C8B | C8B-4 | Single-Error Catastrophizing | Active | P0 |
| C8B | C8B-5 | Perfectionism | Active | P0 |
| C8B | C8B-6 | Invisible Progress | Active | P0 |
| C8B | C8B-7 | High Restart Cost | Active | P1 |
| C8B | C8B-8 | Moral Self-Punishment | Active | P1 |
| C8B | C8B-9 | Competing Comforts | SKIP (consolidated) | -- |

---

*End of integration map. This document synthesizes Agent 2 (Signal Specificity), Agent 3 (Linguistic Markers), and Agent 4 (Integration Feasibility). Source files at `.planning/research/VCM_EVAL_AGENT_2.md`, `VCM_EVAL_AGENT_3.md`, `VCM_EVAL_AGENT_4.md`.*
