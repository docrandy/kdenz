# VCM Integration Feasibility Map (Agent 4)

**Purpose:** Map how each of the 61 VCM root causes integrates into the KDENZ communication training platform -- detection channels, data availability, implementation complexity, false positive risk, pillar coverage, and build priority.

**Source documents:** VCM Foundational Document, VCM Root Cause Database, VCM Claims Document
**Platform reference:** KDENZ CLAUDE.md, R11, R16 schema, VCM Evaluation Framework

---

## Detection Channel Legend

| Channel ID | Channel | Source |
|---|---|---|
| CH1 | Web Speech API transcript | Keyword/pattern matching on user speech |
| CH2 | Hume batch API | Prosody/emotion scores (stress, confidence, energy, hesitation) |
| CH3 | App behavioral telemetry | Session events, engagement patterns, quit points, feature usage |
| CH4 | Drill/simulation performance | Scores, accuracy, technique usage, mastery progression |
| CH5 | Gemini evaluation | LLM-based intent analysis of user speech |
| CH6 | User onboarding responses | Diagnostic questions (existing light diagnostics) |
| CH7 | Spaced repetition data | Review compliance, decay patterns, streak data |

---

## C0 -- Environmental Permeability (3 root causes)

### C0-P: Physical/Biological Limitation

- **Detection channels**: CH6 (primary -- onboarding self-report), CH3 (secondary -- universal low engagement across all features)
- **Data availability**: IMMEDIATE (onboarding questions can screen), but confirmation requires ESTABLISHED (2+ weeks pattern)
- **Implementation**: RULE_BASED -- IF onboarding reports chronic fatigue/medical condition AND engagement is uniformly low across all domains THEN flag C0-P
- **False positive risk**: HIGH -- Low engagement could be C2 (desire deficit), C5 (cost aversion), or many other causes. Mitigation: C0-P only flagged when BOTH self-report AND cross-domain uniform failure are present. Never diagnose without self-report corroboration.
- **KDENZ pillar coverage**: Cross-pillar (uniformly low engagement across Voice Practice, Skills Lab, Simulation Studio, Institute)
- **Build priority**: P2 (month 3) -- Routes to medical referral, not KDENZ intervention. Important for safety but rare in communication training context.
- **Dependencies**: Onboarding questions must include health/energy screening; behavioral event logging across all pillars must exist
- **Specific KDENZ signals**: session_duration consistently <2min across ALL features; zero improvement trajectory despite engagement; onboarding response indicating chronic fatigue, disability, or medical condition; uniform abandonment pattern (not feature-specific)
- **Intervention channel**: NOT a KDENZ intervention. Display compassionate acknowledgment; suggest consulting healthcare provider. Reduce goal scope to micro-sessions. Do NOT prescribe communication drills.

### C0-1: High Activation Cost (Environmental Friction)

**NOTE:** The foundational document reclassified C0-1 to C5-8 (Environmental Friction). The Root Cause Database retains C0-1. For KDENZ purposes, environmental friction is evaluated here AND at C5-8 since both documents reference it.

- **Detection channels**: CH6 (primary -- onboarding/survey), CH3 (secondary -- session timing patterns suggesting environmental friction)
- **Data availability**: EARLY (3-5 sessions to see pattern of when/where user engages)
- **Implementation**: RULE_BASED -- IF user consistently engages only in specific contexts (time-of-day, after specific triggers) AND abandons when setup is required THEN flag
- **False positive risk**: MEDIUM -- User might just have a preferred practice time. Mitigation: Combine with self-report data; look for pattern of abandoning sessions that require more setup (e.g., voice practice requiring quiet room vs. reading exercises).
- **KDENZ pillar coverage**: Cross-pillar (Voice Practice most affected since it requires mic/quiet; Skills Lab text drills less affected; Institute content least affected)
- **Build priority**: P1 (month 1) -- Detectable via differential engagement across feature types
- **Dependencies**: Behavioral event logging with feature-type granularity
- **Specific KDENZ signals**: Voice Practice sessions abandoned within first 30 seconds (mic permission or environment issues); text-based drills completed but voice drills skipped; sessions concentrated at specific times suggesting environmental constraint; differential completion rates: text drills >> voice drills
- **Intervention channel**: Skills Lab (text-based drills as alternative), Institute (reading content). Recommend optimal practice environments. Suggest noise-canceling strategies.

### C0-2: Situational Blockage

- **Detection channels**: CH6 (primary -- onboarding self-report), CH3 (secondary -- total absence of engagement for extended periods)
- **Data availability**: IMMEDIATE (onboarding can screen for resource constraints)
- **Implementation**: RULE_BASED -- IF user reports time/resource/access constraints AND engagement is zero or near-zero for >7 days THEN flag
- **False positive risk**: MEDIUM -- Extended absence could be C5-5 (lack of urgency) or C8B-6 (invisible progress). Mitigation: Differentiate by checking whether user returns sporadically (suggests C7) vs. total absence (suggests C0-2).
- **KDENZ pillar coverage**: Cross-pillar (affects all pillars equally -- total non-engagement)
- **Build priority**: P2 (month 3) -- Primarily detected via absence, which is inherently ambiguous
- **Dependencies**: Push notification/reminder system to detect non-response patterns
- **Specific KDENZ signals**: Zero app_open events for >7 consecutive days; onboarding responses citing time constraints, work demands, or access issues; user enrolled but never completed first session
- **Intervention channel**: Adjust goal scope (micro-sessions: 2-minute drills). Send re-engagement prompts acknowledging constraints. Offer Institute content (passive learning) as lowest-friction entry.

---

## C1 -- Believability (8 root causes)

### C1-1: Cognitive Biases (Overconfidence/Planning Fallacy)

- **Detection channels**: CH4 (primary -- drill performance vs. self-assessed confidence), CH6 (secondary -- onboarding self-assessment), CH1 (tertiary -- language analysis for overconfident markers)
- **Data availability**: EARLY (3-5 sessions to establish prediction-reality gap)
- **Implementation**: PATTERN_MATCH -- Compare user's self-rated confidence (pre-drill) against actual drill scores. IF confidence rating >> actual performance consistently THEN flag
- **False positive risk**: LOW -- The signal (prediction-performance gap) is specific and quantifiable. Mitigation: Require N>=3 instances of significant gap.
- **KDENZ pillar coverage**: Skills Lab (drill scores vs. self-assessment), Simulation Studio (predicted vs. actual technique detection scores), Voice Practice (self-rated vs. measured filler rate)
- **Build priority**: P1 (month 1) -- Requires pre-drill confidence rating UI element
- **Dependencies**: Pre-drill confidence rating input; drill scoring system; comparison logic
- **Specific KDENZ signals**: Self-rated confidence 4-5/5 but drill accuracy <50%; no contingency plans in simulation sessions; surprise reactions to low scores (detected via Hume if available); history of underestimating time-to-mastery on skill tree
- **Intervention channel**: Skills Lab (progressive difficulty revealing actual skill level), Voice Practice (objective data display -- "Your filler rate is X, which is Y% above average")

### C1-2: Fixed Mindset

- **Detection channels**: CH3 (primary -- avoidance of challenging content), CH4 (secondary -- difficulty selection patterns), CH1 (tertiary -- "I'm just not good at this" language), CH5 (quaternary -- Gemini analysis of self-referential statements)
- **Data availability**: EARLY (3-5 sessions to see difficulty avoidance pattern)
- **Implementation**: PATTERN_MATCH -- IF user consistently selects lowest difficulty AND avoids new/challenging techniques AND mastery plateau matches avoidance pattern THEN flag
- **False positive risk**: MEDIUM -- Could be C5-3 (effort overestimation) or C5-5 (failure cost aversion). Mitigation: Fixed mindset shows AVOIDANCE of challenge; C5 shows WILLINGNESS to engage but quitting due to cost. Check whether user avoids even starting hard content (C1-2) vs. starts but quits (C5).
- **KDENZ pillar coverage**: Skills Lab (difficulty selection, technique avoidance), Simulation Studio (always selects easiest difficulty), Voice Practice (avoids new modes)
- **Build priority**: P1 (month 1) -- Difficulty selection data is naturally captured
- **Dependencies**: Difficulty levels in drills; behavioral event logging for difficulty_selected
- **Specific KDENZ signals**: Always selects difficulty 1/5 even after mastering it; never attempts techniques beyond Tier 1; transcript contains "I can't," "I'm not good at," "I'll never"; avoids Simulation Studio entirely (perceived as too challenging); drill_attempts only on previously mastered skills
- **Intervention channel**: Skills Lab (micro-difficulty increments -- 5-10% harder each session), Institute (growth mindset content, "similar users who improved" case studies), Voice Practice (celebrating 1% improvements explicitly)

### C1-3: No Relatable Models

- **Detection channels**: CH6 (primary -- onboarding demographics + self-report), CH3 (secondary -- low engagement with Institute content showing expert demos), CH1 (tertiary -- "nobody like me" language)
- **Data availability**: IMMEDIATE (onboarding can surface this) to EARLY (engagement patterns with model-showing content)
- **Implementation**: RULE_BASED -- IF onboarding responses indicate isolation/uniqueness AND low engagement with demonstration content AND transcript contains no-relatable-model markers THEN flag
- **False positive risk**: MEDIUM -- Low Institute engagement could be C2-7 (purpose deficit) or C8B-1 (boredom). Mitigation: C1-3 shows engagement WITH educational content but disengagement WITH demonstration/modeling content specifically.
- **KDENZ pillar coverage**: Institute (video engagement patterns -- expert demos vs. educational content), Skills Lab (engagement with "example responses" feature)
- **Build priority**: P2 (month 3) -- Requires Institute content to be built with tagging for "demonstration" vs. "educational" content types
- **Dependencies**: Institute content taxonomy distinguishing demo vs. educational content; user demographic data
- **Specific KDENZ signals**: Skips "watch example" sections in drills; low completion rate on Institute demo videos; onboarding self-report of feeling different/isolated; engages with theoretical content but not practical demonstrations
- **Intervention channel**: Institute (curated content showing diverse users at various skill levels, not just experts), Skills Lab (show aggregated "users like you" performance data)

### C1-4: Meta-Cognitive Doubt

- **Detection channels**: CH1 (primary -- "I can't trust my judgment" language), CH4 (secondary -- excessive self-correction in drills), CH3 (tertiary -- high rate of answer changes/retakes), CH5 (quaternary -- Gemini analysis of second-guessing patterns)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user frequently changes answers in drills AND shows long deliberation times before submitting AND language contains meta-doubt markers THEN flag
- **False positive risk**: MEDIUM -- Could be C5-6 (decision paralysis) or C6-3 (plan selection failure). Mitigation: C1-4 doubts their OWN judgment capacity; C5-6 can't choose among options; C6-3 can't select a plan. Look for self-referential doubt vs. option-focused indecision.
- **KDENZ pillar coverage**: Skills Lab (answer revision frequency, deliberation time), Simulation Studio (long pauses, self-interruptions), Voice Practice (frequent restarts of recordings)
- **Build priority**: P2 (month 3) -- Requires tracking answer-change events and deliberation timing
- **Dependencies**: Drill attempt event logging with timestamp granularity; answer revision tracking
- **Specific KDENZ signals**: Average time-to-submit on drills 3x+ above median; answer changes per drill >2; restarts voice recordings >3 times per session; transcript: "I don't know if I'm doing this right," "Am I sure about this?"; long pauses in simulation turns (>10s)
- **Intervention channel**: Skills Lab (mastery experiences with immediate validation -- "Correct! Your judgment was right"), Voice Practice (objective data confirming user's self-assessment accuracy)

### C1-5: Insufficient Evidence

- **Detection channels**: CH3 (primary -- high Institute browsing without practice), CH6 (secondary -- onboarding expressing uncertainty about feasibility), CH1 (tertiary -- "I don't know enough" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF high Institute content consumption AND low drill/practice engagement AND language contains evidence-seeking markers THEN flag
- **False positive risk**: MEDIUM -- Could be C6-2 (chronic replanning -- research as procrastination) or C8A-4 (waiting for readiness). Mitigation: C1-5 genuinely lacks information and engages deeply with educational content; C6-2 plans but never executes; C8A-4 feels unprepared despite having information.
- **KDENZ pillar coverage**: Institute (high engagement), Skills Lab (low engagement -- knowledge consumption without practice), Cross-pillar (ratio of passive vs. active learning)
- **Build priority**: P1 (month 1) -- Ratio of Institute content viewed to drills attempted is a clean signal
- **Dependencies**: Content engagement tracking across pillars
- **Specific KDENZ signals**: Institute pages_viewed / drill_attempts ratio > 5:1; watches full Institute videos but never starts related drill; onboarding: "I need to learn more before I try"; quiz performance high (knows theory) but drill performance low (hasn't practiced)
- **Intervention channel**: Institute (structured "learn then do" pathways -- enforce practice after every 2-3 content items), Skills Lab (guided first drill with scaffolding), "Practice before exposure" principle applied in reverse for this RC

### C1-6: Fragile Confidence

- **Detection channels**: CH4 (primary -- performance volatility after setbacks), CH3 (secondary -- session abandonment after negative feedback), CH2 (tertiary -- Hume stress spikes after errors)
- **Data availability**: EARLY (3-5 sessions, but needs at least one setback event)
- **Implementation**: PATTERN_MATCH -- IF drill score drop of >20% follows single negative result AND session abandonment rate spikes after any negative feedback AND recovery takes >2 sessions THEN flag
- **False positive risk**: MEDIUM -- Could be C8B-4 (single-error catastrophizing). Mitigation: C1-6 is a BELIEF collapse (confidence drops persistently across sessions); C8B-4 is within-session abandonment. Check temporal scope: C1-6 affects multiple subsequent sessions; C8B-4 affects only the current task.
- **KDENZ pillar coverage**: Skills Lab (score trajectory after errors), Voice Practice (session frequency drop after bad session), Simulation Studio (difficulty downselection after failed conversation)
- **Build priority**: P0 (launch) -- High impact, directly observable in drill score trajectories
- **Dependencies**: Drill scoring with per-attempt tracking; session-to-session performance comparison
- **Specific KDENZ signals**: Mastery level drops from 2 to 0 after single failed drill; 3+ day gap after receiving negative feedback; selects easier difficulty after any error; current_streak resets trigger multi-day absence; Hume: confidence score drops >30% from session average after single error event
- **Intervention channel**: Voice Practice (celebrate small wins: "Your pace improved 5% today"), Skills Lab (error-tolerant scoring: partial credit, "you got 3/5 correct -- that's progress"), Cross-pillar ("Never miss twice" rule implementation)

### C1-7: Social Disconfirmation

- **Detection channels**: CH6 (primary -- onboarding questions about social support), CH1 (secondary -- "everyone says I can't" language), CH5 (tertiary -- Gemini analysis of social pressure themes in simulation responses)
- **Data availability**: IMMEDIATE (onboarding) to EARLY (language patterns)
- **Implementation**: RULE_BASED -- IF onboarding reports social skepticism about their goals AND transcript language contains social-doubt markers THEN flag
- **False positive risk**: HIGH -- Language about social pressure could be C2-4 (autonomy threat/reactance) or C2-6 (external motivation). Mitigation: C1-7 internalizes others' doubt (becomes self-doubt); C2-4 reacts against it (becomes defiance); C2-6 depends on it (seeks approval). Check emotional valence: sadness/deflation (C1-7) vs. anger/resistance (C2-4) vs. approval-seeking (C2-6).
- **KDENZ pillar coverage**: Voice Practice (Hume prosody on self-referential statements), Simulation Studio (Gemini detecting social pressure themes), Institute (engagement with content about handling criticism)
- **Build priority**: P2 (month 3) -- Requires nuanced language analysis and Hume emotional valence
- **Dependencies**: Gemini transcript analysis; Hume emotional dimension data; onboarding social context questions
- **Specific KDENZ signals**: Onboarding: reports family/friends skeptical of communication training; transcript: "people think this is silly," "my team would laugh"; Hume: sadness/deflation markers when discussing goals; high engagement with Institute content about "dealing with skeptics"
- **Intervention channel**: Institute (content showing social validation of communication training -- research evidence, success stories), Skills Lab (mastery experiences creating internal evidence that overrides social doubt)

### C1-8: Attribution Error

- **Detection channels**: CH1 (primary -- "I got lucky" language after success), CH4 (secondary -- no confidence increase despite improving scores), CH5 (tertiary -- Gemini detecting external attribution in reflections)
- **Data availability**: EARLY (3-5 sessions -- need success events to observe attribution pattern)
- **Implementation**: PATTERN_MATCH -- IF drill scores improve over time BUT self-rated confidence stays flat AND post-success language attributes outcomes to luck/easiness/help THEN flag
- **False positive risk**: LOW -- The combination of improving scores + flat confidence + external attribution language is quite specific. Mitigation: Require N>=3 improvement episodes where attribution is externalized.
- **KDENZ pillar coverage**: Skills Lab (score improvement trajectory vs. confidence self-report), Voice Practice (filler rate improving but user doesn't acknowledge it), Simulation Studio (technique detection improving but user dismisses success)
- **Build priority**: P1 (month 1) -- Score improvement + flat confidence is a clean signal
- **Dependencies**: Pre/post self-assessment per session; drill score tracking; optional Gemini analysis of post-session reflections
- **Specific KDENZ signals**: Filler rate dropped 40% over 10 sessions but user still rates self as "beginner"; drill accuracy went from 30% to 70% but user says "the questions were easy"; after successful simulation, user says "the AI was being nice"; confidence rating unchanged despite measurable improvement; never views own progress dashboard
- **Intervention channel**: Voice Practice (explicit before/after comparison: "10 sessions ago: 15 fillers/min. Today: 5 fillers/min -- that's YOUR improvement"), Skills Lab (mastery achievement notifications tied to objective data)

---

## C2 -- Desire (8 root causes)

### C2-1: Value Misalignment

- **Detection channels**: CH6 (primary -- onboarding goal exploration), CH3 (secondary -- feature usage patterns revealing true interests), CH2 (tertiary -- Hume flat affect when discussing communication goals), CH1 (quaternary -- "I should want this" language)
- **Data availability**: IMMEDIATE (onboarding) to EARLY (engagement pattern divergence)
- **Implementation**: PATTERN_MATCH -- IF onboarding goals use "should" language AND engagement is sporadic/declining AND user gravitates toward features unrelated to stated goals THEN flag
- **False positive risk**: MEDIUM -- Could be C2-6 (external motivation) or C7-7 (identity misalignment). Mitigation: C2-1 has NO authentic desire (flat engagement overall); C2-6 has desire but only when externally prompted; C7-7 has desire but it conflicts with identity. Check: does anything about the platform genuinely excite them?
- **KDENZ pillar coverage**: Cross-pillar (declining engagement across all pillars), Institute (low engagement with goal-relevant content)
- **Build priority**: P1 (month 1) -- Engagement trajectory is primary signal
- **Dependencies**: Onboarding goal questions with nuanced response capture; engagement tracking per feature
- **Specific KDENZ signals**: Onboarding uses "should" 3+ times vs. "want" 0 times; declining session frequency over first 2 weeks; Hume: flat affect/low energy discussing communication goals (if Voice Practice includes goal-discussion prompts); drills completed but with minimal effort (fast, random answers); never voluntarily explores features beyond what's prompted
- **Intervention channel**: Onboarding (values exploration exercises connecting communication skills to personal values -- career, relationships, confidence), Institute (content showing real-world impact of communication skills on outcomes user cares about)

### C2-2: Fear-Suppressed Desire

- **Detection channels**: CH2 (primary -- Hume stress/anxiety markers when discussing goals), CH1 (secondary -- "I want to but what if..." language), CH3 (tertiary -- approach-retreat engagement pattern), CH5 (quaternary -- Gemini detecting fear/consequence themes)
- **Data availability**: EARLY (3-5 sessions to see approach-retreat pattern)
- **Implementation**: PATTERN_MATCH -- IF user opens app frequently but doesn't start sessions AND Hume shows anxiety markers on goal-related content AND language contains conditional fear markers THEN flag
- **False positive risk**: MEDIUM -- Could be C2-5 (approach-avoidance conflict) or C5-5 (failure cost aversion). Mitigation: C2-2 has desire that is SUPPRESSED by fear of external consequences (what happens if I succeed/fail); C2-5 has ambivalence about the goal itself; C5-5 fears the cost of failure, not the consequences of change. Check: fear about the outcome of CHANGING vs. fear about TRYING.
- **KDENZ pillar coverage**: Voice Practice (Hume anxiety markers), Simulation Studio (avoids higher-stakes scenarios), Cross-pillar (approach-retreat engagement cycles)
- **Build priority**: P2 (month 3) -- Requires Hume integration + nuanced behavioral pattern analysis
- **Dependencies**: Hume batch API integration; behavioral event logging with temporal granularity
- **Specific KDENZ signals**: App opens without session starts (browsing only); starts Simulation Studio then quits within first turn; Hume: anxiety spike when discussing goal outcomes; transcript: "what if I sound stupid," "what if people notice I'm trying"; session frequency fluctuates (3 days on, 5 days off pattern)
- **Intervention channel**: Skills Lab (low-stakes practice environment -- "this is private, only you see results"), Simulation Studio (start with Cooperative difficulty to build safety), Institute (content normalizing the fear of change)

### C2-3: Emotional Avoidance

- **Detection channels**: CH3 (primary -- avoidance of emotionally challenging content), CH2 (secondary -- Hume negative valence on specific topics), CH4 (tertiary -- selective technique avoidance), CH1 (quaternary -- avoidance language patterns)
- **Data availability**: EARLY (3-5 sessions to see selective avoidance pattern)
- **Implementation**: PATTERN_MATCH -- IF user avoids specific technique categories (e.g., confrontation, assertiveness, emotional labeling) while engaging with others AND Hume shows discomfort markers on avoided topics THEN flag
- **False positive risk**: MEDIUM -- Could be C1-2 (fixed mindset -- avoids what's hard) or C5-3 (effort overestimation). Mitigation: C2-3 avoids specific EMOTIONAL categories regardless of difficulty; C1-2 avoids ALL challenging content; C5-3 avoids effortful content but not emotionally charged content. Check: is avoidance content-type-specific or difficulty-specific?
- **KDENZ pillar coverage**: Skills Lab (selective technique avoidance), Simulation Studio (avoids emotionally intense scenarios), Institute (skips content about difficult conversations, conflict)
- **Build priority**: P2 (month 3) -- Requires technique-level engagement tracking and content categorization by emotional intensity
- **Dependencies**: Skill/technique tagging by emotional intensity; per-technique engagement tracking
- **Specific KDENZ signals**: Completes mirroring drills (low emotional intensity) but never attempts accusation audit (high intensity); never selects Simulation Studio scenarios involving conflict; skips Institute videos about confrontation; Hume: anxiety/discomfort when scenario touches on rejection, conflict, or vulnerability
- **Intervention channel**: Skills Lab (graduated emotional exposure -- start with low-intensity techniques, build up), Simulation Studio (Guided mode with coaching through emotionally challenging moments), Institute (psychoeducation about emotional avoidance)

### C2-4: Autonomy Threat (Reactance)

- **Detection channels**: CH3 (primary -- resistance to suggested/required activities), CH1 (secondary -- "don't tell me what to do" language), CH4 (tertiary -- deliberate opposite behavior to recommendations), CH5 (quaternary -- Gemini detecting reactance in simulation responses)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user consistently ignores recommendations AND selects activities opposite to system suggestions AND language shows resistance markers THEN flag
- **False positive risk**: MEDIUM -- Could be just an independent learner with strong preferences. Mitigation: True reactance shows OPPOSITIONAL pattern (doing the opposite of what's recommended); independence shows ALTERNATIVE choices (doing something different but reasonable). Check: does behavior correlate negatively with recommendations?
- **KDENZ pillar coverage**: Cross-pillar (ignores "recommended for you" across all pillars), Skills Lab (skips recommended drills, does others instead)
- **Build priority**: P2 (month 3) -- Requires recommendation engine to be built first so reactance against it can be measured
- **Dependencies**: Recommendation engine; tracking of recommendation-to-action correspondence
- **Specific KDENZ signals**: Recommendation acceptance rate <10% (below baseline); selects opposite difficulty from suggested; language: "I'll do it my way," "stop telling me what to practice"; ignores "review due" notifications; engages more when given free choice vs. structured path
- **Intervention channel**: Cross-pillar (switch to autonomy-supportive design: "Choose your own path" mode; offer options rather than prescriptions; MI-constrained language: "What would you like to work on?")

### C2-5: Approach-Avoidance Conflict

- **Detection channels**: CH3 (primary -- oscillating engagement pattern), CH2 (secondary -- Hume mixed emotional signals), CH1 (tertiary -- ambivalent language), CH5 (quaternary -- Gemini detecting conflicted motivation)
- **Data availability**: EARLY (3-5 sessions to see oscillation)
- **Implementation**: PATTERN_MATCH -- IF engagement oscillates (high one day, zero the next, high again) AND session duration varies wildly AND language shows both positive and negative goal valence THEN flag
- **False positive risk**: HIGH -- Oscillating engagement is very common and could indicate many causes (scheduling constraints, mood dependency, etc.). Mitigation: C2-5 oscillation is specifically about the GOAL -- user expresses wanting and not-wanting the same thing. Require language corroboration.
- **KDENZ pillar coverage**: Cross-pillar (oscillating engagement), Voice Practice (Hume mixed signals), Simulation Studio (inconsistent engagement)
- **Build priority**: P3 (post-data) -- High false positive risk; requires sophisticated behavioral pattern + language analysis
- **Dependencies**: Longitudinal engagement data; Hume emotional analysis; Gemini language analysis
- **Specific KDENZ signals**: Session frequency: 3 sessions in one day, then 4 days absent, then 2 sessions; within-session Hume data shows conflicting emotional markers; transcript: "I want to get better but also... do I really need this?"; starts ambitious practice plan, then reduces to minimal engagement, then restarts
- **Intervention channel**: Institute (values clarification exercises), Skills Lab (micro-commitments -- "just try one 2-minute drill"), Cross-pillar (reduce decision load by offering a single recommended action)

### C2-6: External Motivation

- **Detection channels**: CH6 (primary -- onboarding motivation source), CH3 (secondary -- engagement only after external prompts/reminders), CH1 (tertiary -- approval-seeking language), CH7 (quaternary -- review compliance only with reminders)
- **Data availability**: EARLY (3-5 sessions to see reminder-dependency pattern)
- **Implementation**: PATTERN_MATCH -- IF engagement occurs only after push notifications/reminders AND onboarding motivation is "boss told me to" / "partner wants me to" AND no self-initiated sessions THEN flag
- **False positive risk**: LOW -- The combination of external motivation + reminder-dependent engagement is quite specific. Mitigation: Confirm with N>=5 sessions where all activity follows external triggers.
- **KDENZ pillar coverage**: Cross-pillar (engagement correlated with external prompts across all pillars)
- **Build priority**: P1 (month 1) -- Clean signal from engagement-trigger correlation
- **Dependencies**: Push notification system; tracking of notification-to-session correlation
- **Specific KDENZ signals**: 90%+ sessions occur within 30 minutes of push notification; onboarding: "my manager/partner/coach suggested this"; zero self-initiated sessions (all triggered by reminders); engagement drops to zero when reminders are paused; language: "I'm doing this because..." (external referent)
- **Intervention channel**: Institute (values exploration connecting communication to personally meaningful outcomes), Skills Lab (intrinsic reward design -- highlight personal growth, not external approval), Cross-pillar (gradually reduce external prompts as intrinsic motivation builds)

### C2-7: Purpose Deficit

- **Detection channels**: CH6 (primary -- onboarding goal clarity), CH1 (secondary -- "what's the point" language), CH2 (tertiary -- Hume low energy/flat affect discussing goals), CH3 (quaternary -- minimal engagement, no feature exploration)
- **Data availability**: IMMEDIATE (onboarding) to EARLY (engagement patterns)
- **Implementation**: RULE_BASED -- IF onboarding cannot articulate why they want to improve AND engagement is uniformly low AND language contains meaninglessness markers THEN flag
- **False positive risk**: MEDIUM -- Could be C2-1 (value misalignment) or depression/C0-P. Mitigation: C2-7 is specifically about lack of PURPOSE (no "why"); C2-1 has a "why" but it's someone else's "why." Check: can user articulate ANY reason for being here?
- **KDENZ pillar coverage**: Cross-pillar (uniformly low engagement), Institute (low engagement with purpose/motivation content)
- **Build priority**: P1 (month 1) -- Onboarding can screen directly
- **Dependencies**: Onboarding purpose/motivation questions
- **Specific KDENZ signals**: Onboarding goal field blank or "I don't know"; session frequency <1/week from the start; never explores features beyond what tutorial shows; Hume: consistently flat affect across all sessions; never views progress dashboard
- **Intervention channel**: Onboarding (MI-style purpose exploration: "Imagine you were a confident communicator -- what would be different?"), Institute (impact stories linking communication skills to career/relationship outcomes), Voice Practice (the "holy shit moment" -- awareness of filler rate is itself a purpose-creating event)

### C2-8: Lack of Future Relevance

- **Detection channels**: CH6 (primary -- onboarding time horizon), CH1 (secondary -- future-dismissive language), CH3 (tertiary -- preference for immediate-reward features)
- **Data availability**: IMMEDIATE (onboarding) to EARLY (feature preference patterns)
- **Implementation**: RULE_BASED -- IF onboarding expresses skepticism about long-term value AND user gravitates to instant-gratification features AND language dismisses future benefits THEN flag
- **False positive risk**: MEDIUM -- Could be C5-2 (delayed gratification intolerance -- similar mechanism, different gate). Mitigation: C2-8 fundamentally doesn't see RELEVANCE ("this won't matter in 5 years"); C5-2 sees relevance but can't tolerate the DELAY ("I need results now"). Check: does user acknowledge value but want faster payoff (C5-2) or deny value entirely (C2-8)?
- **KDENZ pillar coverage**: Voice Practice (engages with real-time filler detection -- immediate feedback), Skills Lab (avoids long-term mastery paths), Institute (ignores future-oriented content)
- **Build priority**: P2 (month 3) -- Requires distinguishing from C5-2
- **Dependencies**: Content tagging by time horizon (immediate vs. long-term value); onboarding temporal orientation questions
- **Specific KDENZ signals**: Engages only with Voice Practice (immediate feedback) not Skills Lab (mastery over time); onboarding: "I don't see how this matters long-term"; never sets long-term goals in profile; skill_tree_progression stagnant (not invested in skill development); language: "this won't help me," "in a year nobody will care"
- **Intervention channel**: Voice Practice (leverage the immediate "holy shit moment" to build bridge to longer-term value), Institute (content showing career impact data -- "professionals who improved communication skills earned X% more"), Skills Lab (short-term achievement milestones)

---

## C3 -- Awareness (3 root causes)

**V2 ADDITION -- Detailed analysis pending**

This gate covers failures to perceive or register relevant information despite it being present.

### C3-AA-1: Perceptual Filtering (Inattentional Blindness)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-1 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C3-AA-2: Lack of Interception (No Monitoring System)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-2 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C3-AA-5: Conceptual Mismatch (Wrong Schema)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-5 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

---

## C4 -- Attention (7 root causes)

**V2 ADDITION -- Detailed analysis pending**

This gate covers failures to allocate, sustain, or direct cognitive resources to relevant information.

### C4-AA-3: Capacity Overload
- **V2 addition** -- Integration details pending
- **Root cause**: AA-3 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-4: Resource Competition (Divided Attention)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-4 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-6: Habituation (Desensitization)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-6 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-7: Goal Misalignment (Attention to Wrong Target)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-7 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-8: Overfocus (Tunnel Vision)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-8 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-9: Premature Pattern Match (Jumping to Conclusion)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-9 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

### C4-AA-10: Affective Narrowing (Emotional Hijack)
- **V2 addition** -- Integration details pending
- **Root cause**: AA-10 from VCM V2 structure
- **Placeholder**: Full detection channels, data availability, and KDENZ integration to be mapped

---

## C5 -- Will (6 root causes + C5-8 from reclassification)

### C5-1: Energy Depletion

- **Detection channels**: CH3 (primary -- session timing and duration patterns), CH2 (secondary -- Hume fatigue markers across session), CH7 (tertiary -- review compliance dropping over time)
- **Data availability**: EARLY (3-5 sessions to see time-of-day and energy patterns)
- **Implementation**: PATTERN_MATCH -- IF sessions attempted late in day consistently abandoned AND session quality degrades over time within session AND engagement drops after high-effort periods THEN flag
- **False positive risk**: MEDIUM -- Late-day fatigue is normal. Mitigation: C5-1 shows CROSS-DOMAIN energy depletion (not just communication training fatigue). Check: does user report general tiredness, or is fatigue specific to KDENZ activities?
- **KDENZ pillar coverage**: Cross-pillar (performance degrades within sessions across all pillars), Voice Practice (Hume energy decay within session), Skills Lab (accuracy drops in later drills of a session)
- **Build priority**: P1 (month 1) -- Time-of-day and within-session performance decay are clean signals
- **Dependencies**: Timestamped session data; within-session performance tracking
- **Specific KDENZ signals**: Sessions started after 8pm have 60%+ abandonment rate; drill accuracy drops >30% from first drill to last drill in a session; Hume: vocal energy declines steadily across session; session duration shortens over course of a week; review compliance drops to zero on high-workload days
- **Intervention channel**: Cross-pillar (recommend optimal practice times based on performance data; suggest micro-sessions: "5 minutes is enough today"; energy-aware scheduling)

### C5-2: Delayed Gratification Intolerance

- **Detection channels**: CH3 (primary -- preference for immediate-feedback features), CH4 (secondary -- abandonment of long-term mastery paths), CH1 (tertiary -- "I need results now" language), CH7 (quaternary -- spaced repetition non-compliance)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user exclusively uses Voice Practice (immediate feedback) AND never engages with Skills Lab mastery path AND spaced repetition reviews are skipped AND language demands immediate results THEN flag
- **False positive risk**: MEDIUM -- Could be C2-8 (lack of future relevance) or new user exploring. Mitigation: C5-2 ACKNOWLEDGES future value but can't tolerate the delay; C2-8 doesn't see the point at all. Check: does user express frustration about SPEED of progress (C5-2) or RELEVANCE of progress (C2-8)?
- **KDENZ pillar coverage**: Voice Practice (high engagement -- immediate feedback), Skills Lab (low engagement -- delayed mastery), Simulation Studio (moderate -- immediate conversation experience), Institute (low engagement -- educational value is delayed)
- **Build priority**: P1 (month 1) -- Feature preference ratio is a clean signal
- **Dependencies**: Feature usage tracking per pillar; spaced repetition compliance data
- **Specific KDENZ signals**: Voice Practice sessions / Skills Lab sessions ratio > 5:1; spaced repetition review_overdue count growing; abandons drills before completion if no score shown mid-drill; language: "When will I see results?," "This is taking too long"; checks progress dashboard obsessively (wants to see numbers change)
- **Intervention channel**: Cross-pillar (add intermediate milestones: daily streaks, weekly progress reports, micro-achievements), Skills Lab (show progress after EVERY drill, not just at mastery threshold), Voice Practice (trend charts with visible improvement trajectory)

### C5-3: Effort Overestimation

- **Detection channels**: CH3 (primary -- session avoidance after viewing session requirements), CH1 (secondary -- "this will be horrible" language), CH2 (tertiary -- Hume stress/anxiety before session start)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user views drill/session details but doesn't start AND pre-session stress markers are high AND actual session duration (when completed) is significantly shorter than user predicted THEN flag
- **False positive risk**: MEDIUM -- Could be C8A-1 (motor initiation threshold -- can't start, not won't start). Mitigation: C5-3 is about PERCEIVED EFFORT being too high (cost evaluation); C8A-1 is about inability to initiate despite acceptable cost evaluation. Check: does user express that it's "too much work" (C5-3) or "I just can't make myself start" (C8A-1)?
- **KDENZ pillar coverage**: Cross-pillar (preview-without-action pattern), Skills Lab (views drill descriptions but doesn't attempt), Simulation Studio (high avoidance of longer scenarios)
- **Build priority**: P1 (month 1) -- Preview-without-start is a clean telemetry event
- **Dependencies**: Behavioral event logging for feature_preview events without subsequent feature_start
- **Specific KDENZ signals**: drill_preview events without drill_start at >50% rate; session length predictions (if captured) exceed actual session length by 2x+; avoids drills with high question counts; transcript: "This looks like a lot," "I don't have time for this"; Hume: stress spike when viewing session requirements
- **Intervention channel**: Skills Lab (micro-starts: "Just try the first question"), Cross-pillar (reframe effort: "This drill takes 2 minutes" -- show actual average completion times)

### C5-4: Insufficient Perceived Reward

- **Detection channels**: CH3 (primary -- declining engagement despite competent performance), CH6 (secondary -- onboarding reward expectations), CH1 (tertiary -- "the payoff isn't worth it" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user performs adequately in drills but engagement declines AND language expresses reward-cost imbalance AND no signs of other barriers (belief, desire, energy) THEN flag
- **False positive risk**: MEDIUM -- Could be C8B-1 (task boredom) or C2-7 (purpose deficit). Mitigation: C5-4 sees the effort as too high relative to reward (cost-benefit); C8B-1 is bored by repetition; C2-7 sees no meaning. Check: is user frustrated by poor ROI (C5-4), bored (C8B-1), or nihilistic (C2-7)?
- **KDENZ pillar coverage**: Cross-pillar (engagement decline despite competent performance), Voice Practice (adequate filler rate but doesn't continue), Skills Lab (passes drills but doesn't advance)
- **Build priority**: P2 (month 3) -- Requires distinguishing from C8B-1 and C2-7, which needs more data
- **Dependencies**: Performance-engagement correlation tracking; longitudinal engagement data
- **Specific KDENZ signals**: Drill accuracy >70% but session frequency declining; language: "So what if I can mirror? It won't change anything"; adequate mastery scores but doesn't advance to next tier; spaced repetition compliance dropping despite passing reviews; never sets new goals after achieving current ones
- **Intervention channel**: Institute (connect technique mastery to real-world outcomes with case studies), Simulation Studio (show impact of techniques in realistic conversations -- the "so what" answer), Cross-pillar (gamification: achievement system, leaderboards, streaks)

### C5-5: Failure Cost Aversion

- **Detection channels**: CH3 (primary -- avoidance of scored/evaluated activities), CH4 (secondary -- preference for unscored practice), CH1 (tertiary -- "what if I fail" language), CH2 (quaternary -- Hume anxiety on evaluation-related content)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user avoids scored drills but engages with unscored practice AND Hume shows anxiety markers before evaluations AND language contains failure-fear markers THEN flag
- **False positive risk**: MEDIUM -- Could be C1-6 (fragile confidence) or C2-3 (emotional avoidance). Mitigation: C5-5 is about the COST of failure (identity damage, embarrassment); C1-6 is about confidence collapsing; C2-3 is about avoiding the emotional experience itself. Check: is user afraid of what failure MEANS (C5-5), afraid their confidence will break (C1-6), or afraid of the emotional pain (C2-3)?
- **KDENZ pillar coverage**: Skills Lab (avoids scored drills, uses practice mode), Simulation Studio (never attempts evaluated conversations), Voice Practice (records but doesn't submit for analysis)
- **Build priority**: P1 (month 1) -- Scored vs. unscored engagement ratio is a clean signal
- **Dependencies**: Practice mode vs. scored mode tracking; evaluation avoidance event logging
- **Specific KDENZ signals**: Practice mode sessions / scored sessions ratio > 3:1; never views scorecard after session; avoids Simulation Studio (highest evaluation risk); starts drill but quits before score is calculated; language: "I'd rather not be judged," "what if I fail this?"
- **Intervention channel**: Skills Lab (reframe evaluation: "This is practice, not a test"; show that errors are normal; anonymize performance), Voice Practice (private mode emphasis -- "only you see this"), Cross-pillar (growth-oriented scoring: show improvement trajectory, not absolute scores)

### C5-6: Decision Paralysis

- **Detection channels**: CH3 (primary -- long browse times without selection), CH4 (secondary -- drill selection pattern -- hovering without choosing), CH1 (tertiary -- "I can't decide" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: RULE_BASED -- IF time-on-selection-screen / time-on-drill ratio > 2:1 AND user views multiple options without selecting AND language contains indecision markers THEN flag
- **False positive risk**: MEDIUM -- Could be C6-3 (plan selection failure). Mitigation: C5-6 is paralyzed by the COST of choosing wrong (Will gate); C6-3 can't determine HOW to select (Intention gate). Check: is user afraid of choosing wrong (C5-6) or unable to evaluate options (C6-3)?
- **KDENZ pillar coverage**: Skills Lab (time on drill selection screen), Cross-pillar (feature switching without engaging -- Voice Practice > Skills Lab > Institute without starting anything)
- **Build priority**: P1 (month 1) -- Selection screen dwell time is a clean telemetry event
- **Dependencies**: Screen-level dwell time tracking; feature navigation event logging
- **Specific KDENZ signals**: Average time on selection screens >3x median; navigates between 3+ features without starting any; views drill descriptions for multiple techniques without selecting; language: "Which one should I do?," "I can't pick"; high screen_transition_count without drill_start
- **Intervention channel**: Cross-pillar (reduce choice architecture: "Here's today's recommended drill" -- single recommendation reduces paralysis), Skills Lab (curated "Daily Challenge" that removes selection burden)

### C5-8: Environmental Friction (reclassified from C0-1)

See C0-1 analysis above. Same detection channels and signals apply. The reclassification to C3 changes the intervention approach: instead of environmental redesign (C0 approach), KDENZ should help the user adjust their cost-benefit calculation and willingness threshold.

- **Detection channels**: Same as C0-1
- **Data availability**: EARLY
- **Implementation**: RULE_BASED
- **False positive risk**: MEDIUM
- **KDENZ pillar coverage**: Cross-pillar
- **Build priority**: P1 (month 1)
- **Dependencies**: Same as C0-1
- **Specific KDENZ signals**: Same as C0-1
- **Intervention channel**: Cross-pillar (reduce friction: suggest quieter times for voice practice; offer text-only alternatives; pre-load resources to reduce setup time)

---

## C6 -- Intention (7 root causes)

### C6-1: Conflicting Plans

- **Detection channels**: CH3 (primary -- fragmented engagement across many features without depth), CH7 (secondary -- multiple skills started but none progressed), CH1 (tertiary -- "too many things going on" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user has >5 skills at "Attempted" but 0 at "Familiar" or higher AND session activities span 3+ different skill areas AND language indicates overwhelm THEN flag
- **False positive risk**: MEDIUM -- Could be exploration (healthy in first 2-3 sessions). Mitigation: Allow exploration window (first 3 sessions); flag only if fragmentation persists beyond session 5.
- **KDENZ pillar coverage**: Skills Lab (multiple skills started, none progressed), Cross-pillar (switching between Voice Practice, Skills Lab, Simulation, Institute without depth)
- **Build priority**: P1 (month 1) -- Skill progression breadth-vs-depth ratio is clean signal
- **Dependencies**: user_skills table tracking mastery_level per skill; session activity logging
- **Specific KDENZ signals**: >5 skills at mastery_level=1, 0 skills at mastery_level>=2 after 5+ sessions; per-session activity spans 3+ different skill areas; session jumps: drill_start(mirroring) > drill_start(labeling) > drill_start(accusation_audit) in same session without completing any; language: "I want to work on everything"
- **Intervention channel**: Skills Lab (structured path: "Focus on ONE skill this week -- recommended: labeling"), Cross-pillar (daily focus recommendation reducing scope to single skill)

### C6-2: Chronic Replanning

- **Detection channels**: CH3 (primary -- goal/settings changes without practice), CH4 (secondary -- resets practice plan repeatedly), CH1 (tertiary -- "I need a better plan" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user modifies goals/focus_areas >3 times AND practice sessions < goal_modification_count AND language contains replanning markers THEN flag
- **False positive risk**: LOW -- Frequent goal changes without practice is a specific signal. Mitigation: Differentiate from legitimate goal refinement (which includes practice between changes).
- **KDENZ pillar coverage**: Cross-pillar (settings changes, goal modifications across all features)
- **Build priority**: P1 (month 1) -- Goal modification frequency is naturally tracked
- **Dependencies**: Goal/settings change event logging; comparison of setting_change events vs. drill_attempt events
- **Specific KDENZ signals**: focus_areas changed >3 times in first week; profile.long_term_goals modified repeatedly; views skill tree extensively but never starts drills; creates multiple practice "plans" (if feature exists) without executing; language: "I'm going to take a different approach this time"
- **Intervention channel**: Skills Lab (implementation intentions: "After I open the app, I will immediately start [specific drill]"), Cross-pillar (lock in plan for minimum 1 week before allowing changes)

### C6-3: Plan Selection Failure

- **Detection channels**: CH3 (primary -- browsing without selecting), CH4 (secondary -- skill tree exploration without starting), CH1 (tertiary -- "I don't know which approach" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: RULE_BASED -- IF time_on_skill_tree > time_on_drills AND browse_without_select events > 3 per session AND language contains option-comparison markers THEN flag
- **False positive risk**: MEDIUM -- Could be C5-6 (decision paralysis). Mitigation: C6-3 is about EVALUATION criteria being unclear (can't determine which option is best); C5-6 is about COST of choosing wrong. Check: "I don't know which is best" (C6-3) vs. "What if I pick wrong?" (C5-6).
- **KDENZ pillar coverage**: Skills Lab (skill tree browsing without practicing), Institute (comparing content without engaging)
- **Build priority**: P1 (month 1) -- Browse-to-practice ratio is clean signal
- **Dependencies**: Navigation event logging; skill tree interaction tracking
- **Specific KDENZ signals**: skill_tree_view count > drill_start count by 3:1; hovers over multiple skills for >5s each without clicking; opens technique descriptions for 5+ techniques in one session without attempting any; language: "Should I start with mirroring or labeling?"
- **Intervention channel**: Skills Lab (diagnostic placement: "Based on your profile, start with labeling -- here's why"), Cross-pillar (recommend ONE specific starting point with clear rationale)

### C6-4: Cognitive Overload

- **Detection channels**: CH3 (primary -- session abandonment during complex multi-step activities), CH4 (secondary -- failure on drills with >3 steps), CH1 (tertiary -- "too complicated" language), CH2 (quaternary -- Hume stress on complex content)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF completion rate on complex drills << simple drills AND session abandonment correlates with activity complexity AND language indicates overwhelm THEN flag
- **False positive risk**: LOW -- Complexity-dependent failure is a specific signal. Mitigation: Ensure drill complexity is properly calibrated so this isn't just bad UX.
- **KDENZ pillar coverage**: Skills Lab (failure on multi-step drills), Simulation Studio (overwhelmed in multi-turn conversations), Institute (abandons long-form content)
- **Build priority**: P1 (month 1) -- Complexity-to-completion correlation is clean
- **Dependencies**: Drill complexity tagging; step count per drill; completion rate per complexity level
- **Specific KDENZ signals**: Completion rate on 1-step drills >80% but <30% on 4+ step drills; abandons Simulation Studio conversations after turn 3; doesn't finish Institute articles >500 words; language: "This is too much," "I can't keep track"; Hume: stress escalation with each added step
- **Intervention channel**: Skills Lab (break complex techniques into micro-steps; scaffold with hints), Simulation Studio (Guided mode with step-by-step coaching), Cross-pillar (simplify UI during detected overload)

### C6-5: Action Ambiguity

- **Detection channels**: CH3 (primary -- opens app but doesn't know what to do), CH4 (secondary -- no clear practice pattern), CH1 (tertiary -- "I don't know what to do" language)
- **Data availability**: IMMEDIATE (detectable from first session)
- **Implementation**: RULE_BASED -- IF user opens app and navigates without starting activity AND session has >5 screen transitions without any drill/practice event AND language contains action-uncertainty markers THEN flag
- **False positive risk**: LOW -- Navigation-without-action is specific when combined with language data. Mitigation: Allow first 2 sessions as exploration; flag only if pattern persists.
- **KDENZ pillar coverage**: Cross-pillar (aimless navigation across all features)
- **Build priority**: P0 (launch) -- Directly impacts first-session retention; detectable immediately
- **Dependencies**: Navigation event logging; screen transition tracking
- **Specific KDENZ signals**: >5 screen transitions without drill_start or content_view in first session; session duration >5 min with 0 completed activities; returns to home screen repeatedly; language: "What should I do?," "Where do I start?"; never uses skill tree or follows recommended path
- **Intervention channel**: Cross-pillar (strong onboarding flow: "Here's your first exercise" -- direct to specific activity), Skills Lab (auto-start first drill after onboarding), Voice Practice (guided first session with clear step-by-step instructions)

### C6-6: Recursive Justification

- **Detection channels**: CH1 (primary -- "I have a good reason to wait" language), CH3 (secondary -- app opens with no activity, combined with new excuse each time), CH5 (tertiary -- Gemini detecting justification patterns in simulation reflections)
- **Data availability**: EARLY (3-5 sessions to see excuse pattern)
- **Implementation**: LLM_REQUIRED -- IF Gemini analysis of session notes/reflections (if captured) detects recurring novel justifications for delay AND engagement is declining AND each justification is different from previous THEN flag
- **False positive risk**: HIGH -- Users legitimately have reasons to delay sometimes. Mitigation: Require N>=3 distinct justifications across sessions with no actual practice increase. The KEY signal is novel justifications each time (not the same recurring issue).
- **KDENZ pillar coverage**: Cross-pillar (declining engagement with changing justifications)
- **Build priority**: P3 (post-data) -- Requires Gemini analysis of user language/reflections; high false positive risk
- **Dependencies**: User reflection/notes feature; Gemini analysis pipeline; longitudinal justification tracking
- **Specific KDENZ signals**: Session frequency declining week-over-week; if post-session reflection exists: different reason given each time for reduced practice ("busy this week," "not feeling it," "need to reorganize my schedule," "waiting for the right moment"); language: "I'll start properly next week"
- **Intervention channel**: Cross-pillar (pre-commitment devices: "Schedule your next session now"), Skills Lab (implementation intentions: "IF it's 8am THEN I do one labeling drill")

### C6-7: Weak Cue-Response Binding

- **Detection channels**: CH7 (primary -- spaced repetition non-compliance despite reminders), CH3 (secondary -- no consistent practice time pattern), CH4 (tertiary -- forgets to practice despite stated intent)
- **Data availability**: ESTABLISHED (2+ weeks to see if habit forms)
- **Implementation**: PATTERN_MATCH -- IF user acknowledges reminders but doesn't act AND no consistent practice time-of-day emerges after 2 weeks AND spaced repetition reviews systematically overdue THEN flag
- **False positive risk**: MEDIUM -- Could be C7-5 (lack of urgency) or C5-1 (energy depletion). Mitigation: C6-7 INTENDS to practice and FORGETS; C7-5 doesn't feel urgency to practice; C5-1 is too tired. Check: does user express frustration at forgetting (C6-7) or indifference about missing practice (C7-5)?
- **KDENZ pillar coverage**: Cross-pillar (no habit formation visible), Skills Lab (spaced repetition non-compliance)
- **Build priority**: P1 (month 1) -- Spaced repetition compliance rate is a clean signal
- **Dependencies**: Spaced repetition system with review tracking; practice time-of-day tracking; reminder delivery tracking
- **Specific KDENZ signals**: review_overdue count growing steadily; no consistent practice hour (uniform distribution across day); user sets reminder but doesn't respond to it; session starts within 2 minutes of reminder <20% of the time; language: "I keep forgetting to practice"
- **Intervention channel**: Cross-pillar (habit stacking: "After your morning coffee, do one drill"), Skills Lab (environmental cue design: smart reminders tied to context), Institute (content about habit formation)

---

## C7 -- Commitment (8 root causes)

### C7-1: Competing Commitments

- **Detection channels**: CH3 (primary -- irregular, declining engagement pattern), CH7 (secondary -- spaced repetition compliance dropping), CH6 (tertiary -- onboarding reporting multiple competing priorities)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF session frequency declines progressively AND decline correlates with specific time periods (work deadlines, etc.) AND user expresses competing obligation markers THEN flag
- **False positive risk**: MEDIUM -- Declining engagement is common for many reasons. Mitigation: C7-1 specifically shows engagement REDUCTION during identifiable high-demand periods, with partial recovery after. Distinguish from global decline (C2-1, C2-7) by checking for recovery periods.
- **KDENZ pillar coverage**: Cross-pillar (engagement decline across all features)
- **Build priority**: P1 (month 1) -- Engagement trajectory with temporal analysis
- **Dependencies**: Longitudinal engagement tracking; optional calendar integration or self-report
- **Specific KDENZ signals**: Session frequency drops from 5/week to 1/week over 3 weeks; then partially recovers; sessions get shorter over time; language: "Work has been crazy," "Something always comes up"; reviews overdue cluster around specific dates; engagement pattern shows "burst and fade" cycles
- **Intervention channel**: Cross-pillar (micro-sessions: "Even 2 minutes counts"; goal scope reduction during high-demand periods; "Never miss twice" rule), Skills Lab (quick drills: 60-second challenges for busy periods)

### C7-2: Environmental Disruption

- **Detection channels**: CH3 (primary -- sudden engagement drops after environmental changes), CH6 (secondary -- self-report of life changes)
- **Data availability**: EARLY (detectable when disruption occurs)
- **Implementation**: RULE_BASED -- IF engagement drops >70% in a single week without gradual decline AND no other indicators of progressive disengagement THEN flag
- **False positive risk**: LOW -- Sudden engagement drop is specific and easy to detect. Mitigation: Distinguish from C0-2 (total blockage -- extended absence) by checking if user still opens app occasionally.
- **KDENZ pillar coverage**: Cross-pillar (sudden engagement drop across all features)
- **Build priority**: P1 (month 1) -- Step-change detection is straightforward
- **Dependencies**: Engagement change-point detection algorithm
- **Specific KDENZ signals**: Session count drops from 5+ to 0-1 in a single week; app_open events continue but drill_start events stop; practice routine completely disrupted (different times, different features); user may report "everything changed" in reflections
- **Intervention channel**: Cross-pillar (acknowledge disruption; offer "restart kit" with simplified re-entry; micro-sessions during transition period; "Never miss twice" with extended grace period)

### C7-3: No External Monitoring

- **Detection channels**: CH3 (primary -- engagement decay in absence of external accountability), CH7 (secondary -- spaced repetition compliance declining over time)
- **Data availability**: ESTABLISHED (2+ weeks to see commitment decay without external pressure)
- **Implementation**: PATTERN_MATCH -- IF engagement steadily declines over 2+ weeks AND user is not part of any accountability structure AND engagement peaks only around self-set goals/deadlines THEN flag
- **False positive risk**: MEDIUM -- Gradual engagement decline is common. Mitigation: C7-3 specifically responds to MONITORING -- if engagement increases when accountability features are introduced (e.g., streak tracking, progress sharing), this confirms the diagnosis.
- **KDENZ pillar coverage**: Cross-pillar (engagement decay over time)
- **Build priority**: P2 (month 3) -- Requires accountability features to exist so their effect can be measured
- **Dependencies**: Streak system; optional social/sharing features; engagement trend tracking
- **Specific KDENZ signals**: Engagement declines 10-15% per week over first month; streak_notifications_ignored rate increasing; never shares progress; no external accountability partner linked; engagement spikes briefly after "you're falling behind" notifications but doesn't sustain
- **Intervention channel**: Cross-pillar (streak system with visible consequences; optional accountability partner feature; public commitment devices), Voice Practice (progress sharing: "Share your filler rate improvement")

### C7-4: Insufficient Stakes

- **Detection channels**: CH3 (primary -- easy abandonment pattern), CH7 (secondary -- zero streak investment), CH6 (tertiary -- onboarding showing no consequences for failure)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user abandons sessions without apparent distress AND streak breaks don't trigger re-engagement AND engagement pattern shows no urgency markers THEN flag
- **False positive risk**: MEDIUM -- Could be C7-5 (lack of urgency) or C2-7 (purpose deficit). Mitigation: C7-4 doesn't care about CONSEQUENCES of quitting (no stakes); C7-5 doesn't feel TIME PRESSURE; C2-7 doesn't see MEANING. Check: does user shrug off missed practice (C7-4), postpone it (C7-5), or question its value (C2-7)?
- **KDENZ pillar coverage**: Cross-pillar (casual, non-invested engagement)
- **Build priority**: P2 (month 3) -- Requires sufficient engagement data to distinguish from similar causes
- **Dependencies**: Streak system with break detection; re-engagement pattern analysis
- **Specific KDENZ signals**: Streak breaks don't trigger return; session abandonment mid-drill with no return to complete; never views progress or scorecard; zero investment in mastery system (doesn't care about mastery_level); language: "It doesn't matter if I practice or not"
- **Intervention channel**: Cross-pillar (raise stakes: streak freeze tokens, achievement system with sunk-cost investment, pre-commitment contracts), Skills Lab (mastery challenges with meaningful rewards)

### C7-5: Lack of Urgency

- **Detection channels**: CH3 (primary -- perpetual postponement pattern), CH7 (secondary -- all reviews overdue but user eventually does them), CH1 (tertiary -- "no rush" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF sessions are consistently postponed (opened but not acted on) AND engagement is low-frequency but NOT declining AND language contains urgency-deficit markers THEN flag
- **False positive risk**: MEDIUM -- Could be C6-7 (weak cue-response -- forgets) or C7-4 (no stakes). Mitigation: C7-5 KNOWS they should practice but doesn't feel urgency; C6-7 literally forgets; C7-4 doesn't care about consequences. Check: when reminded, does user acknowledge but postpone (C7-5), express surprise at forgetting (C6-7), or shrug (C7-4)?
- **KDENZ pillar coverage**: Cross-pillar (low-frequency but stable engagement)
- **Build priority**: P1 (month 1) -- Postponement pattern is detectable via engagement frequency analysis
- **Dependencies**: Engagement frequency tracking; reminder response analysis
- **Specific KDENZ signals**: Consistent 2-3 sessions/week despite capacity for daily; all reviews completed but 2-3 days late on average; app_open without drill_start at >40% rate; language: "I'll get to it," "No rush"; engagement flat-lined at low level (not declining, not growing)
- **Intervention channel**: Cross-pillar (mini-deadlines: "Complete this drill by tonight"; urgency injection: "Your labeling skill decayed 5% this week"; time-limited challenges)

### C7-6: Value Contradiction

- **Detection channels**: CH1 (primary -- "this goes against what I believe" language), CH5 (secondary -- Gemini detecting value conflicts in simulation responses), CH3 (tertiary -- selective avoidance of specific technique categories)
- **Data availability**: EARLY (3-5 sessions) to ESTABLISHED (may take time to surface)
- **Implementation**: LLM_REQUIRED -- IF Gemini analysis of user language detects value-based resistance to specific techniques AND user avoids those technique categories AND engagement with contradicting content drops THEN flag
- **False positive risk**: HIGH -- Selective technique avoidance could be C2-3 (emotional avoidance), C1-2 (fixed mindset), or legitimate preference. Mitigation: C7-6 specifically involves VALUE-BASED objection ("this is manipulative," "I shouldn't have to do this"). Look for moral/ethical language, not fear or effort language.
- **KDENZ pillar coverage**: Skills Lab (avoids specific technique categories), Simulation Studio (refuses to use certain techniques in conversation), Institute (engages selectively based on value alignment)
- **Build priority**: P2 (month 3) -- Requires Gemini analysis; high ambiguity
- **Dependencies**: Gemini transcript analysis; technique-level engagement tracking; value-conflict detection in language
- **Specific KDENZ signals**: Completes Voss techniques but refuses NVC exercises (or vice versa); language in simulations: "I wouldn't actually do this," "This feels manipulative"; avoids specific technique categories consistently (not random avoidance); drill_attempt for avoided techniques shows deliberate non-engagement (fast random answers)
- **Intervention channel**: Institute (reframe techniques: show ethical applications; present multiple frameworks so user can choose value-aligned approaches), Skills Lab (offer alternative technique paths that align with user's values)

### C7-7: Identity Misalignment

- **Detection channels**: CH6 (primary -- onboarding self-concept), CH1 (secondary -- "that's not who I am" language), CH5 (tertiary -- Gemini detecting identity-based resistance), CH3 (quaternary -- avoidance of identity-challenging content)
- **Data availability**: IMMEDIATE (onboarding) to EARLY (engagement patterns)
- **Implementation**: LLM_REQUIRED -- IF Gemini detects identity-based resistance in user language AND user avoids activities inconsistent with stated self-concept AND engagement pattern shows identity-protective avoidance THEN flag
- **False positive risk**: HIGH -- Identity language is subtle and context-dependent. Mitigation: Require multiple instances (N>=3) of identity-based resistance language before flagging. Corroborate with behavioral avoidance of identity-inconsistent content.
- **KDENZ pillar coverage**: Skills Lab (avoids techniques inconsistent with self-concept), Simulation Studio (refuses to role-play identities inconsistent with self), Institute (selective engagement based on identity fit)
- **Build priority**: P3 (post-data) -- Requires sophisticated language analysis; high false positive risk
- **Dependencies**: Gemini analysis pipeline; longitudinal language analysis
- **Specific KDENZ signals**: Engineer user avoids all "soft skill" techniques; introvert user refuses assertiveness drills; language: "I'm not the type of person who...," "People like me don't..."; consistent avoidance of one framework (e.g., Voss "too aggressive" or NVC "too soft"); profile self-description inconsistent with technique practice selection
- **Intervention channel**: Institute (identity expansion content: "Communication skills complement ALL identities"), Skills Lab (frame techniques within user's existing identity: "As an engineer, precision in communication is about...")

### C7-8: Identity-Behavior Dissonance

- **Detection channels**: CH3 (primary -- chronic gap between stated goals and actual behavior), CH7 (secondary -- long-term review non-compliance despite stated commitment), CH1 (tertiary -- "I keep saying I'll change but never do" language)
- **Data availability**: ESTABLISHED (2+ weeks -- need longitudinal data on stated goals vs. actual behavior)
- **Implementation**: PATTERN_MATCH -- IF stated_goals in profile include ambitious targets AND actual_behavior shows chronic underperformance relative to targets AND this gap persists for >2 weeks AND language contains dissonance markers THEN flag
- **False positive risk**: MEDIUM -- Could be C6-1 (conflicting plans reducing capacity) or C7-1 (competing commitments). Mitigation: C7-8 is specifically about the ACCUMULATED gap creating self-concept conflict (feels like a fraud). Check: does user express guilt/shame about the gap (C7-8), overwhelm about capacity (C6-1/C7-1)?
- **KDENZ pillar coverage**: Cross-pillar (gap between goals and engagement visible across all features)
- **Build priority**: P2 (month 3) -- Requires longitudinal data comparing goals to actual behavior
- **Dependencies**: Goal tracking; longitudinal engagement data; goal-vs-behavior comparison logic
- **Specific KDENZ signals**: Profile goal: "Practice daily" but actual sessions <2/week for >2 weeks; mastery targets set but not pursued; language: "I'm such a fraud," "I never follow through"; spaced repetition reviews overdue by weeks; occasional burst of activity followed by longer absence (guilt cycle)
- **Intervention channel**: Cross-pillar (reduce goal-behavior gap by RIGHT-SIZING goals: "Let's set a goal you can actually hit this week"), Skills Lab (micro-commitments: "Just one drill today"), Voice Practice ("Never miss twice" -- break the shame cycle)

---

## C8A -- Initiation (8 root causes)

### C8A-1: Motor Initiation Threshold (High Activation Cost)

- **Detection channels**: CH3 (primary -- long dwell on pre-activity screens), CH2 (secondary -- Hume freeze-like markers before action), CH1 (tertiary -- "I just can't start" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF time between app_open and first_action > 5 minutes consistently AND user views content/descriptions but doesn't initiate AND post-session performance is good (proving capability exists) THEN flag
- **False positive risk**: MEDIUM -- Could be C5-3 (effort overestimation) or C5-6 (decision paralysis). Mitigation: C8A-1 is a MOTOR gate failure -- user knows what to do, wants to do it, but can't initiate the first action. Post-initiation performance is good. Check: once started, is performance adequate? (Yes = C8A-1; No = upstream gate issue)
- **KDENZ pillar coverage**: Cross-pillar (app_open to first_action latency), Voice Practice (time to start recording), Skills Lab (time to start first drill), Simulation Studio (time to send first message)
- **Build priority**: P0 (launch) -- High impact; app_open-to-first_action latency is a clean signal
- **Dependencies**: Event logging with timestamps for app_open and first meaningful action
- **Specific KDENZ signals**: Average time from app_open to drill_start > 5 minutes; multiple page_view events before first drill_start; views recording button for >30 seconds before pressing; once started, drill_accuracy is adequate; language: "I sit there wanting to start but I just... don't"; Hume: speech onset delays, breath-holding before first words
- **Intervention channel**: Cross-pillar (auto-start: immediately present first activity with "Press one button to begin"), Skills Lab (micro-starts: "Just answer this ONE question"), Voice Practice (3-second countdown forcing initiation)

### C8A-2: Last-Minute Deliberation

- **Detection channels**: CH3 (primary -- starts activity then immediately pauses/backs out), CH2 (secondary -- Hume deliberation markers at action moment), CH1 (tertiary -- "wait, let me think" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user navigates to drill/session start AND then backs out or pauses >3 times per session AND restart-after-backing-out rate is high (they do eventually start) THEN flag
- **False positive risk**: MEDIUM -- Could be C5-5 (failure cost aversion -- afraid to start). Mitigation: C8A-2 starts and STOPS (deliberation at the moment of action); C5-5 doesn't start at all (avoids the evaluation entirely). Check: does user approach and retreat (C8A-2) or avoid entirely (C5-5)?
- **KDENZ pillar coverage**: Skills Lab (drill_start followed immediately by drill_pause or drill_exit), Voice Practice (recording started and stopped within 5 seconds), Simulation Studio (conversation started but first turn abandoned)
- **Build priority**: P1 (month 1) -- Start-then-stop pattern is clean telemetry
- **Dependencies**: Start/stop/restart event logging with timestamps
- **Specific KDENZ signals**: drill_start > drill_exit > drill_start pattern >2 times per session; recording_start > recording_stop within 5 seconds, then restart; language: "Wait, am I ready?," "Let me reconsider"; average 2-3 false starts before actual engagement; Hume: deliberation markers (rising then falling confidence) at action onset
- **Intervention channel**: Skills Lab (pre-commitment: "Once you press start, the drill runs for 60 seconds -- no backing out"), Cross-pillar (reduce deliberation window: immediate action triggers, countdown timers)

### C8A-3: Attention Diversion

- **Detection channels**: CH3 (primary -- app_switch events at critical moments), CH4 (secondary -- incomplete drills with external interruption pattern)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: RULE_BASED -- IF app_background events occur within 30 seconds of drill_start AND drill abandonment correlates with external notification/switching events THEN flag
- **False positive risk**: MEDIUM -- External interruptions are normal. Mitigation: C8A-3 is about SYSTEMATIC attention diversion at the MOMENT of starting (not random interruptions). Check: do interruptions cluster specifically at initiation moments?
- **KDENZ pillar coverage**: Cross-pillar (app_switch events at initiation moments)
- **Build priority**: P2 (month 3) -- Requires app lifecycle event tracking (app_background, app_foreground)
- **Dependencies**: App lifecycle event logging; correlation analysis between start events and background events
- **Specific KDENZ signals**: app_background within 30 seconds of drill_start at >50% rate; session_interrupted events cluster at session beginning (not middle or end); drills abandoned with "I got distracted" markers; phone notification events (if trackable) coincide with drill initiation
- **Intervention channel**: Cross-pillar (focus mode: "Do Not Disturb" suggestion before starting; full-screen mode during drills), Voice Practice (audio cue that anchors attention at start)

### C8A-4: Waiting for Readiness

- **Detection channels**: CH3 (primary -- conditional engagement pattern), CH1 (secondary -- "I'll start when..." language), CH6 (tertiary -- onboarding perfectionism markers)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user engagement is conditional on specific circumstances (time of day, mood, environment) AND never practices outside "ideal" conditions AND language contains readiness-condition markers THEN flag
- **False positive risk**: MEDIUM -- Some preference for optimal conditions is normal. Mitigation: C8A-4 is about RIGID conditions (never starts unless everything is perfect). Check: does user practice in suboptimal conditions at all? Zero suboptimal-condition sessions = C8A-4 signal.
- **KDENZ pillar coverage**: Cross-pillar (sessions only at specific times/conditions)
- **Build priority**: P2 (month 3) -- Requires sufficient session data to see time-of-day/context rigidity
- **Dependencies**: Session metadata (time, device, session_type); longitudinal engagement data
- **Specific KDENZ signals**: All sessions occur within same 1-hour window; zero sessions on weekends (or vice versa); language: "I need to be in the right mood," "The timing isn't right"; skips practice when any condition is suboptimal; high app_open-without-drill_start rate outside "ideal" window
- **Intervention channel**: Skills Lab (micro-drills designed for ANY condition: "This 60-second drill works anywhere"), Cross-pillar ("Imperfect practice > no practice" messaging)

### C8A-5: Over-Simulation

- **Detection channels**: CH3 (primary -- extensive content consumption without practice), CH4 (secondary -- Institute engagement >> drill engagement), CH1 (tertiary -- "I've thought about it a million times" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF Institute/content engagement is very high AND drill/practice engagement is very low AND user can articulate technique knowledge verbally but doesn't practice THEN flag
- **False positive risk**: MEDIUM -- Could be C1-5 (insufficient evidence -- seeking more information). Mitigation: C8A-5 KNOWS what to do (high quiz scores, can describe techniques) but doesn't PRACTICE; C1-5 genuinely needs more information. Check quiz/knowledge scores: high knowledge + low practice = C8A-5.
- **KDENZ pillar coverage**: Institute (very high engagement), Skills Lab (very low engagement -- knows theory but doesn't practice), Cross-pillar (knowledge-practice gap)
- **Build priority**: P1 (month 1) -- Knowledge-practice gap is clean signal when Institute + Skills Lab both exist
- **Dependencies**: Institute quiz system; knowledge-vs-practice tracking
- **Specific KDENZ signals**: Quiz scores >80% but drill_attempts <5 total; watches Institute content 5x per week but does 0 drills; skill tree browsed extensively but mastery_level = 0 for all skills; language: "I know exactly what to do"; simulation_sessions = 0 despite knowing all techniques
- **Intervention channel**: Skills Lab (forced "practice before exposure" -- must attempt drill before accessing next content), Cross-pillar (reframe: "Knowing isn't the same as doing -- let's practice"), Voice Practice (immediate action prompt: "Let's test your knowledge right now")

### C8A-6: Self-Sabotage

- **Detection channels**: CH3 (primary -- pattern of "accidental" obstacles before action), CH4 (secondary -- performance inconsistency suggesting deliberate undermining), CH5 (tertiary -- Gemini detecting self-handicapping language)
- **Data availability**: ESTABLISHED (2+ weeks -- pattern of repeated "accidents")
- **Implementation**: LLM_REQUIRED -- IF user shows pattern of creating obstacles before high-stakes activities (e.g., "forgot headphones" before voice practice, "ran out of time" repeatedly before drills) AND obstacles are user-controllable AND performance on attempted drills is inconsistent THEN flag
- **False positive risk**: HIGH -- Genuine obstacles vs. self-created obstacles are hard to distinguish. Mitigation: Require N>=4 instances of preventable obstacles before high-evaluation activities. Pattern must be specific to EVALUATION contexts (not general).
- **KDENZ pillar coverage**: Cross-pillar (obstacle creation before evaluated activities), Skills Lab (performance inconsistency), Simulation Studio (drops connection before evaluation)
- **Build priority**: P3 (post-data) -- Requires sophisticated pattern detection; high false positive risk
- **Dependencies**: Longitudinal obstacle logging; correlation between obstacles and evaluation contexts
- **Specific KDENZ signals**: "Device issues" reported only before scored drills, never during unscored practice; performance swings (90% one session, 20% next) without skill regression; session_abandoned specifically before scorecard display; language: "Something always goes wrong when I try"
- **Intervention channel**: Skills Lab (low-stakes entry: "This doesn't count, just practice"), Voice Practice (remove evaluation framing), Cross-pillar (address underlying fear of success/failure through Institute content)

### C8A-7: Momentum Dependency

- **Detection channels**: CH3 (primary -- cold-start failure but high continuation once started), CH4 (secondary -- first drill of session takes much longer to start than subsequent drills)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF time-to-start-first-drill >> time-to-start-subsequent-drills AND within-session performance improves dramatically after first activity AND user explicitly reports "once I start I'm fine" THEN flag
- **False positive risk**: LOW -- First-drill-latency vs. subsequent-drill-latency gap is a very specific signal. Mitigation: Require consistent gap across N>=3 sessions.
- **KDENZ pillar coverage**: Cross-pillar (first-action latency), Skills Lab (first drill time vs. subsequent drill times), Voice Practice (first recording time vs. subsequent)
- **Build priority**: P0 (launch) -- Clean signal; high impact; directly addresses first-session retention
- **Dependencies**: Per-drill timing within sessions; first-action vs. subsequent-action latency comparison
- **Specific KDENZ signals**: Time to start first drill: 8 minutes. Time to start second drill: 30 seconds. Consistent across sessions; within-session drill count increases (momentum builds); language: "Once I start I'm fine, it's just starting"; if momentum interrupted (phone call mid-session), same long restart latency
- **Intervention channel**: Cross-pillar (warm-up micro-drill: "Start with this 30-second warm-up to build momentum"), Skills Lab (auto-start easiest drill to build momentum before harder content), Voice Practice (quick win: "Say any sentence and see your baseline filler rate")

### C8A-8: Trauma-Related Freeze

- **Detection channels**: CH2 (primary -- Hume freeze markers: sudden silence, vocal tremor, breath-holding), CH3 (secondary -- session abandonment at specific trigger points), CH1 (tertiary -- "I shut down" language)
- **Data availability**: EARLY (may be detectable from first session if trigger is encountered)
- **Implementation**: PATTERN_MATCH -- IF Hume detects autonomic freeze markers (sudden pitch drop, silence >5s during active speech, breath irregularity) AND freeze occurs in response to specific scenario content AND user shows sudden disengagement after freeze event THEN flag
- **False positive risk**: HIGH -- Technical issues (mic problems, user distracted) can mimic freeze signals. Mitigation: NEVER diagnose autonomically; only flag for attention if pattern repeats across 3+ sessions with similar trigger content. This is a C0 (pre-volitional) issue -- KDENZ cannot treat it.
- **KDENZ pillar coverage**: Voice Practice (Hume freeze detection), Simulation Studio (freeze during specific scenario types), Cross-pillar (avoidance of specific content types)
- **Build priority**: P3 (post-data) -- Requires Hume integration; clinical sensitivity; high false positive risk; requires EXTREME caution
- **Dependencies**: Hume batch API with freeze detection; content trigger mapping; clinical advisory on response protocols
- **Specific KDENZ signals**: Hume: sudden vocal energy drop to near-zero mid-speech; silence >5 seconds during active conversation; speech onset delay >3 seconds after prompt; pattern specific to certain scenario types (e.g., confrontation, authority, rejection scenarios); session_abandoned immediately after freeze event; Hume: breath-holding pattern detected
- **Intervention channel**: NOT a KDENZ intervention. If detected: remove triggering content from recommendations; display compassionate message; suggest professional support (trauma-informed therapy). NEVER expose user to identified trigger content again without explicit consent.

---

## C8B -- Maintenance (9 root causes)

### C8B-1: Task Boredom

- **Detection channels**: CH3 (primary -- within-session engagement decay), CH4 (secondary -- declining drill variety engagement), CH2 (tertiary -- Hume disengagement markers: falling pitch, shortened responses)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF drill completion rate declines within each session AND user repeats same drill types AND session duration shortens over time AND Hume shows disengagement markers in later session segments THEN flag
- **False positive risk**: LOW -- Within-session engagement decay on repeated content is a specific signal. Mitigation: Differentiate from C5-1 (energy depletion -- decays regardless of content type) by checking whether engagement recovers with novel content (C8B-1 = yes; C5-1 = no).
- **KDENZ pillar coverage**: Skills Lab (declining drill engagement), Voice Practice (shorter sessions), Simulation Studio (repetitive scenario engagement), Institute (content skimming)
- **Build priority**: P0 (launch) -- Directly impacts retention; detectable from first sessions
- **Dependencies**: Within-session engagement tracking; content variety tracking
- **Specific KDENZ signals**: Session 1 drill count: 8. Session 3 drill count: 4. Session 5 drill count: 2. Same skill practiced repeatedly without advancing; Hume: vocal energy lower in second half of sessions; response length shortening within session; engagement spikes when new content type introduced; language: "I've done this before," "This is getting old"
- **Intervention channel**: Skills Lab (introduce variety: alternate drill formats, surprise challenges, new techniques), Cross-pillar (interleaved learning: mix Voice Practice, Skills Lab, Institute content), Simulation Studio (novel scenarios to break monotony)

### C8B-2: Competing Stimuli (Distraction)

- **Detection channels**: CH3 (primary -- mid-session app switches and tab changes), CH4 (secondary -- declining focus metrics within drills)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: RULE_BASED -- IF app_background events during active drills AND drill response times increase mid-session AND session has >2 interruption events THEN flag
- **False positive risk**: MEDIUM -- Some distraction is normal in mobile context. Mitigation: C8B-2 is about PATTERN of distraction during sustained activity (not one-off interruption). Require >2 app_switch events per session as baseline.
- **KDENZ pillar coverage**: Cross-pillar (mid-session interruptions), Skills Lab (response time elongation within drills), Simulation Studio (turn response time increasing)
- **Build priority**: P1 (month 1) -- App lifecycle events + drill timing data
- **Dependencies**: App lifecycle event logging; per-question response time within drills
- **Specific KDENZ signals**: >2 app_background events per session during active drills; drill response_time increases >50% from first half to second half of drill; simulation turn response time increases mid-conversation; language (if captured post-session): "I kept getting distracted"
- **Intervention channel**: Cross-pillar (focus mode: minimize UI, full-screen drills), Skills Lab (shorter drill sets to fit attention span), Voice Practice (uninterruptible recording mode)

### C8B-3: Mood-Dependent Execution

- **Detection channels**: CH3 (primary -- engagement variance correlated with time/day patterns suggesting mood cycles), CH2 (secondary -- Hume emotional state varies across sessions with performance correlation), CH7 (tertiary -- spaced repetition compliance varies unpredictably)
- **Data availability**: ESTABLISHED (2+ weeks to see mood-engagement correlation)
- **Implementation**: PATTERN_MATCH -- IF performance variance is high across sessions (>40% score swings) AND variance does NOT correlate with difficulty changes AND Hume emotional state predicts session performance THEN flag
- **False positive risk**: HIGH -- Performance variance is common for many reasons. Mitigation: Require Hume emotional data showing mood-performance correlation. Without Hume, this is very difficult to diagnose reliably.
- **KDENZ pillar coverage**: Voice Practice (Hume mood-to-performance correlation), Skills Lab (score variance across sessions), Cross-pillar (engagement unpredictability)
- **Build priority**: P2 (month 3) -- Requires Hume integration for reliable detection
- **Dependencies**: Hume batch API; session-level emotional state data; mood-performance correlation analysis
- **Specific KDENZ signals**: Drill accuracy swings: 85% one session, 40% next, 75% next; Hume: sessions with high-energy/positive-valence show 2x better performance; engagement drops entirely on "bad mood" days; no consistent weekly pattern (not a scheduling issue); language: "I can't do it today, I'm in a bad mood"
- **Intervention channel**: Cross-pillar (mood-independent practice design: "Even a bad day is better with 2 minutes of practice"), Skills Lab (mood-matched difficulty: easier drills on detected low-energy days), Voice Practice (mood tracking over time to show that practice helps mood)

### C8B-4: Single-Error Catastrophizing

- **Detection channels**: CH4 (primary -- drill abandonment after first error), CH3 (secondary -- session termination after negative feedback), CH2 (tertiary -- Hume frustration/distress spike after errors)
- **Data availability**: IMMEDIATE (detectable from first session with an error)
- **Implementation**: RULE_BASED -- IF drill_abandoned within 1 question of first incorrect answer AND session_terminated within 2 minutes of negative feedback AND pattern repeats across N>=2 sessions THEN flag
- **False positive risk**: LOW -- Post-error abandonment is a very specific signal. Mitigation: Differentiate from legitimate frustration with buggy content by checking if abandonment is systematic (always after first error) vs. sporadic.
- **KDENZ pillar coverage**: Skills Lab (drill abandonment after error), Voice Practice (session ended after first filler detection), Simulation Studio (conversation abandoned after first "incorrect" technique)
- **Build priority**: P0 (launch) -- High impact; clean signal; directly addresses retention
- **Dependencies**: Per-question drill event logging; error-to-abandonment timing
- **Specific KDENZ signals**: Drill abandoned within 30 seconds of first incorrect answer; session_end events within 2 minutes of scorecard showing <80%; never completes a drill with >0 errors; Hume: sharp frustration spike at first error; language: "I messed up, forget it"; streak break triggers multi-day absence
- **Intervention channel**: Skills Lab (error-tolerant design: "Errors are expected -- they're how you learn"; show that even experts make mistakes; partial credit scoring), Cross-pillar ("Never miss twice" implementation), Voice Practice (normalize filler usage: "Average speakers use X fillers per minute")

### C8B-5: Perfectionism

- **Detection channels**: CH4 (primary -- excessive retakes/revisions), CH3 (secondary -- long session times without moving forward), CH1 (tertiary -- "it's not good enough" language)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF user retakes drills >3 times per technique AND session time on single drill exceeds 3x average AND user doesn't advance despite passing scores AND language contains perfectionistic markers THEN flag
- **False positive risk**: LOW -- Excessive retakes despite passing scores is a specific signal. Mitigation: Differentiate from genuine skill building (which advances to next level) by checking whether user advances after achieving passing score.
- **KDENZ pillar coverage**: Skills Lab (excessive retakes), Voice Practice (recording multiple takes trying to achieve zero fillers), Simulation Studio (restarting conversations to get "perfect" exchange)
- **Build priority**: P0 (launch) -- Retake frequency despite passing scores is clean signal
- **Dependencies**: Per-drill attempt count; passing threshold tracking; advancement tracking
- **Specific KDENZ signals**: Retakes on passed drills: >3 per technique; score of 85% on drill but retakes 4 times trying for 100%; never advances to next technique despite passing current one; Voice Practice: restarts recording 5+ times per session; language: "It's not perfect yet," "I need to redo this"; total_attempts >> total_correct ratio
- **Intervention channel**: Skills Lab (time-limited drills: "You have 60 seconds -- submit whatever you have"), Cross-pillar (progress-focused scoring: "80% is Proficient -- move to the next skill"), Voice Practice ("Good enough is good enough" messaging with research backing)

### C8B-6: Invisible Progress

- **Detection channels**: CH3 (primary -- declining engagement despite improving scores), CH7 (secondary -- review compliance dropping despite retention improving), CH1 (tertiary -- "I'm not getting anywhere" language)
- **Data availability**: EARLY (3-5 sessions -- user needs visible improvement period to compare against)
- **Implementation**: PATTERN_MATCH -- IF user_skills show objective improvement AND engagement is declining AND user doesn't view progress dashboard AND language contains frustration-at-lack-of-progress markers THEN flag
- **False positive risk**: MEDIUM -- Could be C5-4 (insufficient perceived reward) or C8B-1 (boredom). Mitigation: C8B-6 specifically IMPROVES but doesn't SEE the improvement. Check: is the user objectively improving? (Yes + declining engagement = C8B-6; No = different issue)
- **KDENZ pillar coverage**: Skills Lab (mastery improvement not noticed), Voice Practice (filler rate improving but user doesn't check), Cross-pillar (progress dashboard non-engagement)
- **Build priority**: P0 (launch) -- Critical for retention; KDENZ already has trend charts and scorecards
- **Dependencies**: Progress visualization features; progress_dashboard_view tracking
- **Specific KDENZ signals**: Mastery scores improving (30% -> 60%) but session frequency declining; progress_dashboard_view = 0 in last 7 days; never checks weekly trend chart; language: "I'm not getting better," "Nothing is changing"; Hume: frustration markers despite objective improvement
- **Intervention channel**: Voice Practice (proactive progress notification: "Your filler rate dropped 40% -- watch this replay"), Skills Lab (milestone celebrations: "You've now mastered 3 techniques!"), Cross-pillar (push progress summaries -- don't wait for user to check dashboard)

### C8B-7: High Restart Cost

- **Detection channels**: CH3 (primary -- sessions abandoned after interruption never resumed), CH4 (secondary -- post-interruption performance drops significantly)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: RULE_BASED -- IF sessions interrupted mid-drill are NOT resumed within 30 minutes AND post-interruption drill performance drops >30% AND user reports difficulty getting back on track THEN flag
- **False positive risk**: MEDIUM -- Some users just end sessions at interruption, which is normal. Mitigation: C8B-7 specifically shows high restart cost (performs well before interruption, poorly after, or doesn't resume at all). Check post-interruption performance gap.
- **KDENZ pillar coverage**: Skills Lab (interrupted drills not resumed), Voice Practice (interrupted sessions not restarted), Simulation Studio (abandoned conversations not re-entered)
- **Build priority**: P1 (month 1) -- Interruption-to-resumption tracking
- **Dependencies**: Session interruption detection; post-interruption resumption tracking; performance comparison pre/post interruption
- **Specific KDENZ signals**: 80%+ of interrupted sessions not resumed within 30 minutes; if resumed, drill_accuracy drops >30% vs. pre-interruption; language: "Once I stop I can't get back to it"; simulation conversations abandoned after interruption even if they were going well; Hume: frustration markers at restart points
- **Intervention channel**: Cross-pillar (save session state for seamless resume; "Welcome back -- you were working on X" quick re-entry), Skills Lab (bookmark interrupted drills for easy restart), Simulation Studio (conversation pause/resume feature)

### C8B-8: Moral Self-Punishment

- **Detection channels**: CH3 (primary -- extended absence following missed practice commitments), CH7 (secondary -- streak break triggering prolonged disengagement), CH1 (tertiary -- "I feel terrible" language)
- **Data availability**: EARLY (3-5 sessions -- detectable after first streak break)
- **Implementation**: PATTERN_MATCH -- IF streak_break triggers absence >3 days AND absence length grows with each streak break AND language contains self-punishment/guilt markers AND engagement eventually resumes with fresh commitment (guilt cycle) THEN flag
- **False positive risk**: MEDIUM -- Extended absence could be C7-2 (environmental disruption) or C7-4 (insufficient stakes). Mitigation: C8B-8 specifically shows GUILT as the mechanism -- user returns with expressions of self-blame. Check: does user express guilt about missing practice (C8B-8), describe external circumstances (C7-2), or shrug (C7-4)?
- **KDENZ pillar coverage**: Cross-pillar (guilt-driven engagement cycles)
- **Build priority**: P1 (month 1) -- Streak break to absence correlation is clean signal
- **Dependencies**: Streak system; post-break engagement tracking; post-break language analysis
- **Specific KDENZ signals**: Streak break -> 5 day absence -> burst of 3 sessions -> streak break -> 7 day absence (escalating); language post-return: "I'm terrible at this," "I can't believe I missed so many days"; Hume: shame/guilt markers in first session after return; over-commits after return (10 drills in one session) then burns out again
- **Intervention channel**: Cross-pillar ("Never miss twice" with compassionate framing: "You missed a day -- that's okay. Everyone does. Just do one drill today."), Skills Lab (micro-restart: lowest possible commitment after break), Voice Practice (welcome-back session that celebrates return, not shames absence)

### C8B-9: Competing Comforts

- **Detection channels**: CH3 (primary -- sessions abandoned for comfort-seeking alternatives), CH4 (secondary -- performance drops when alternatives are available)
- **Data availability**: EARLY (3-5 sessions)
- **Implementation**: PATTERN_MATCH -- IF sessions are shorter when user has free time (evenings, weekends) vs. structured time AND app_background events lead to non-return AND language suggests preference for easier activities THEN flag
- **False positive risk**: HIGH -- This is essentially "I'd rather do something else," which is near-universal. Mitigation: C8B-9 is specifically about COMFORT-SEEKING alternatives (not just distraction). Distinguish from C8B-2 (distraction) by checking whether alternatives are specifically low-effort/high-comfort (leisure activities, not work interruptions).
- **KDENZ pillar coverage**: Cross-pillar (evening/weekend engagement lower than work-hour engagement)
- **Build priority**: P3 (post-data) -- High false positive risk; near-universal human tendency; hard to distinguish from C8B-2
- **Dependencies**: Time-of-day engagement analysis; context inference from usage patterns
- **Specific KDENZ signals**: Weekend session duration 50% shorter than weekday; evening sessions have 3x the app_background rate; sessions abandoned specifically during leisure times; language: "I'd rather just watch Netflix"; higher engagement during work breaks (structure provides friction to alternatives)
- **Intervention channel**: Cross-pillar (add friction to leaving: "You're 80% through this drill -- just 2 more questions"), Skills Lab (gamification: make practice itself pleasurable), Voice Practice (make the experience entertaining, not just educational)

---

## Summary Analysis

### 1. Priority Matrix

#### P0 -- Must-Have for Beta (8 root causes)

These are the highest-impact, most feasible root causes to detect at launch. They use clean signals from existing data channels and directly impact user retention.

| RC | Name | Gate | Primary Signal | Why P0 |
|---|---|---|---|---|
| C1-6 | Fragile Confidence | C1 | Score trajectory after errors | Directly impacts retention; clean signal |
| C6-5 | Action Ambiguity | C6 | Navigation without action | First-session retention; immediate detection |
| C8A-1 | Motor Initiation Threshold | C8A | App-to-first-action latency | Impacts every session; clean timing signal |
| C8A-7 | Momentum Dependency | C8A | First-vs-subsequent drill latency | Clean signal; immediate intervention possible |
| C8B-1 | Task Boredom | C8B | Within-session engagement decay | Direct retention impact; content variety is the fix |
| C8B-4 | Single-Error Catastrophizing | C8B | Post-error abandonment | Very specific signal; high impact on retention |
| C8B-5 | Perfectionism | C8B | Retakes despite passing scores | Clean signal; blocks progression |
| C8B-6 | Invisible Progress | C8B | Improving scores + declining engagement | Critical for retention; KDENZ already has progress UI |

#### P1 -- Important, Month 1 (22 root causes)

| RC | Name | Gate | Primary Signal |
|---|---|---|---|
| C0-1/C5-8 | Environmental Friction | C0/C5 | Differential voice vs. text engagement |
| C1-1 | Cognitive Biases | C1 | Prediction-performance gap |
| C1-2 | Fixed Mindset | C1 | Difficulty avoidance pattern |
| C1-5 | Insufficient Evidence | C1 | Institute/drill engagement ratio |
| C1-8 | Attribution Error | C1 | Improving scores + flat confidence |
| C2-1 | Value Misalignment | C2 | "Should" language + declining engagement |
| C2-6 | External Motivation | C2 | Reminder-dependent engagement |
| C2-7 | Purpose Deficit | C2 | Onboarding purpose clarity |
| C5-1 | Energy Depletion | C5 | Time-of-day performance patterns |
| C5-2 | Delayed Gratification Intolerance | C5 | Feature preference ratios |
| C5-3 | Effort Overestimation | C5 | Preview-without-start events |
| C5-5 | Failure Cost Aversion | C5 | Scored vs. unscored preference |
| C5-6 | Decision Paralysis | C5 | Selection screen dwell time |
| C6-1 | Conflicting Plans | C6 | Breadth-vs-depth skill engagement |
| C6-2 | Chronic Replanning | C6 | Goal changes without practice |
| C6-3 | Plan Selection Failure | C6 | Browse-to-practice ratio |
| C6-4 | Cognitive Overload | C6 | Complexity-to-completion correlation |
| C6-7 | Weak Cue-Response Binding | C6 | Spaced repetition compliance |
| C7-1 | Competing Commitments | C7 | Burst-and-fade engagement cycles |
| C7-2 | Environmental Disruption | C7 | Sudden engagement step-change |
| C7-5 | Lack of Urgency | C7 | Perpetual postponement pattern |
| C8A-5 | Over-Simulation | C8A | Knowledge-practice gap |
| C8B-2 | Competing Stimuli | C8B | Mid-session app switches |
| C8B-7 | High Restart Cost | C8B | Interrupted session non-resumption |
| C8B-8 | Moral Self-Punishment | C8B | Streak-break to absence escalation |
| C8A-2 | Last-Minute Deliberation | C8A | Start-then-stop pattern |

#### P2 -- Detectable with Enough Data, Month 3 (15 root causes)

| RC | Name | Gate | Why P2 |
|---|---|---|---|
| C0-P | Physical/Biological Limitation | C0 | Routes to medical; rare in context |
| C0-2 | Situational Blockage | C0 | Absence-based detection is ambiguous |
| C1-3 | No Relatable Models | C1 | Requires Institute content taxonomy |
| C1-4 | Meta-Cognitive Doubt | C1 | Requires answer-change tracking |
| C1-7 | Social Disconfirmation | C1 | Requires nuanced language analysis |
| C2-3 | Emotional Avoidance | C2 | Requires technique-level emotional tagging |
| C2-4 | Autonomy Threat | C2 | Requires recommendation engine first |
| C2-8 | Lack of Future Relevance | C2 | Requires distinguishing from C5-2 |
| C5-4 | Insufficient Perceived Reward | C5 | Requires distinguishing from C8B-1/C2-7 |
| C7-3 | No External Monitoring | C7 | Requires accountability features |
| C7-4 | Insufficient Stakes | C7 | Requires streak/gamification system |
| C7-6 | Value Contradiction | C7 | Requires Gemini analysis |
| C7-8 | Identity-Behavior Dissonance | C7 | Requires longitudinal goal-vs-behavior data |
| C8A-3 | Attention Diversion | C8A | Requires app lifecycle tracking |
| C8A-4 | Waiting for Readiness | C8A | Requires sufficient session metadata |
| C8B-3 | Mood-Dependent Execution | C8B | Requires Hume integration |
| C2-2 | Fear-Suppressed Desire | C2 | Requires Hume + behavioral pattern analysis |

#### P3 -- Requires ML or 6+ Months Data (7 root causes)

| RC | Name | Gate | Why P3 |
|---|---|---|---|
| C2-5 | Approach-Avoidance Conflict | C2 | High false positive risk; oscillation common |
| C6-6 | Recursive Justification | C6 | Requires Gemini analysis of reflections; high FP |
| C7-7 | Identity Misalignment | C7 | Requires sophisticated language analysis; high FP |
| C8A-6 | Self-Sabotage | C8A | Requires longitudinal pattern detection; high FP |
| C8A-8 | Trauma-Related Freeze | C8A | Clinical sensitivity; requires Hume + extreme caution |
| C8B-9 | Competing Comforts | C8B | Near-universal; hard to distinguish from C8B-2 |

### 2. Data Dependency Map

| Session Count | Newly Detectable Root Causes | Cumulative Coverage |
|---|---|---|
| 1 (first session) | C6-5 (action ambiguity), C8A-1 (motor initiation), C8A-7 (momentum dependency), C8B-4 (single-error catastrophizing), C2-7 (purpose deficit -- onboarding), C1-7 (social disconfirmation -- onboarding), C0-P (onboarding screening) | 7/61 (11%) |
| 3 sessions | C1-2 (fixed mindset), C1-6 (fragile confidence), C5-3 (effort overestimation), C5-6 (decision paralysis), C8B-1 (boredom), C8B-5 (perfectionism), C8A-2 (last-minute deliberation), C6-1 (conflicting plans), C6-2 (chronic replanning), C6-3 (plan selection failure), C6-4 (cognitive overload), C2-6 (external motivation), C8B-8 (moral self-punishment) | 20/61 (33%) |
| 5 sessions | C1-1 (cognitive biases), C1-5 (insufficient evidence), C1-8 (attribution error), C2-1 (value misalignment), C2-3 (emotional avoidance), C5-1 (energy depletion), C5-2 (delayed gratification), C5-5 (failure cost aversion), C7-1 (competing commitments), C7-2 (environmental disruption), C7-5 (lack of urgency), C8A-5 (over-simulation), C8B-2 (competing stimuli), C8B-6 (invisible progress), C8B-7 (high restart cost), C0-1/C5-8 (environmental friction) | 36/61 (59%) |
| 10 sessions (~2 weeks) | C1-3 (no relatable models), C1-4 (meta-cognitive doubt), C2-2 (fear-suppressed desire), C2-4 (autonomy threat), C2-8 (lack of future relevance), C5-4 (insufficient reward), C7-3 (no external monitoring), C7-4 (insufficient stakes), C7-6 (value contradiction), C7-8 (identity-behavior dissonance), C8A-3 (attention diversion), C8A-4 (waiting for readiness), C8B-3 (mood-dependent execution) | 49/61 (80%) |
| 20+ sessions (~1 month) | C0-2 (situational blockage -- via absence pattern), C2-5 (approach-avoidance), C6-6 (recursive justification), C7-7 (identity misalignment), C8A-6 (self-sabotage) | 54/61 (89%) |
| 3+ months / ML required | C8A-8 (trauma-related freeze), C8B-9 (competing comforts) | 56/61 (92%) |
| NEVER fully detectable | C0-P subtypes (psychomotor retardation, motor readiness failure, metabolic insufficiency, HPA axis exhaustion) -- require clinical diagnosis. Can be SCREENED but not DIAGNOSED. | ~5 require clinical referral |

### 3. Cross-Pillar Detection Opportunities

These root causes can ONLY be reliably detected by combining data from 2+ pillars.

| Root Cause | Required Pillar Combination | Why Cross-Pillar Required |
|---|---|---|
| C0-1/C5-8 Environmental Friction | Voice Practice + Skills Lab | Differential engagement (voice drills require mic/quiet; text drills don't). Voice avoidance + text engagement = friction signal. |
| C1-5 Insufficient Evidence | Institute + Skills Lab | High knowledge (quiz scores) + low practice (drill scores) can only be seen by comparing across pillars. |
| C2-3 Emotional Avoidance | Skills Lab + Simulation Studio | Selective technique avoidance by emotional intensity visible only when comparing technique categories across drill types. |
| C5-4 Insufficient Perceived Reward | Skills Lab + Voice Practice | Adequate performance across pillars but declining engagement in all = not bored with one feature, but sees insufficient payoff for all effort. |
| C6-1 Conflicting Plans | Skills Lab + Simulation Studio + Voice Practice | Fragmented engagement across ALL pillars without depth in any. Single-pillar fragmentation could be exploration. |
| C7-8 Identity-Behavior Dissonance | Cross-pillar (goals vs. all engagement) | Gap between stated goals (profile) and actual behavior visible only when ALL pillar engagement is compared to goal targets. |
| C8A-5 Over-Simulation | Institute + Skills Lab | High Institute engagement + low Skills Lab practice = knowledge-practice gap. One pillar alone doesn't show this. |
| C8B-3 Mood-Dependent Execution | Voice Practice (Hume) + Skills Lab | Hume emotional state predicting drill performance requires combining voice prosody data with drill score data. |

### 4. Implementation Roadmap

#### Sprint 1: Core Telemetry (Week 1-2)
**Goal:** Instrument behavioral events needed for P0 detection.

Required events:
- `app_open` with timestamp
- `first_action` with timestamp (enables C8A-1, C8A-7)
- `drill_start`, `drill_complete`, `drill_abandon` with per-question timing
- `drill_error` with timing (enables C8B-4)
- `drill_retake` count per skill (enables C8B-5)
- `feature_preview` without `feature_start` (enables C7-3)
- `screen_transition` without activity (enables C6-5)
- `session_duration` and per-drill engagement time (enables C8B-1, C8B-6)

Root causes enabled: C6-5, C8A-1, C8A-7, C8B-1, C8B-4, C8B-5, C8B-6, C1-6

#### Sprint 2: Engagement Patterns (Week 3-4)
**Goal:** Pattern detection over accumulated session data.

Required analysis:
- Session frequency trends (enables C7-1, C7-2, C7-5)
- Feature preference ratios (enables C5-2, C1-5, C8A-5)
- Difficulty selection tracking (enables C1-2, C5-5)
- Goal change frequency (enables C6-2)
- Skill breadth-vs-depth ratio (enables C6-1)
- Selection screen dwell time (enables C5-6, C6-3)

Root causes enabled: C1-2, C1-5, C5-2, C5-5, C5-6, C6-1, C6-2, C6-3, C7-1, C7-2, C7-5, C8A-5

#### Sprint 3: Spaced Repetition + Streak Integration (Week 5-6)
**Goal:** Leverage review compliance and streak data.

Required data:
- Review compliance rate (enables C6-7)
- Streak break patterns (enables C8B-8)
- Notification-to-action correlation (enables C2-6)
- Time-of-day engagement patterns (enables C5-1)

Root causes enabled: C2-6, C5-1, C6-7, C8B-8

#### Sprint 4: Hume Integration (Week 7-8)
**Goal:** Add prosody/emotion detection channel.

Required data:
- Within-session energy decay (enhances C8B-1, C5-1)
- Error-response emotional markers (enhances C8B-4, C1-6)
- Mood-performance correlation (enables C8B-3)
- Freeze detection (enables C8A-8 screening)
- Stress markers on effort/evaluation topics (enhances C5-3, C5-5)

Root causes enhanced/enabled: C8B-3, C8A-8 (screening only), enhanced confidence for 10+ existing detections

#### Sprint 5: Gemini Language Analysis (Week 9-10)
**Goal:** Add LLM-based language pattern detection.

Required analysis:
- Self-referential language (fixed mindset, attribution error)
- Value/identity language (value contradiction, identity misalignment)
- Justification patterns (recursive justification)
- Social pressure language (social disconfirmation)
- Fear/avoidance language (fear-suppressed desire, emotional avoidance)

Root causes enabled: C7-6, C7-7, C6-6, remaining P2/P3 causes

#### Sprint 6: Recommendation Engine Feedback Loop (Week 11-12)
**Goal:** Use recommendation acceptance/rejection to detect additional causes.

Required data:
- Recommendation acceptance rate (enables C2-4)
- Goal-vs-behavior comparison (enables C7-8)
- Accountability feature response (enables C7-3)

Root causes enabled: C2-4, C7-3, C7-8

### 5. Gate-Level Detection Confidence

For each gate, what percentage of its root causes can KDENZ detect at each timeline.

| Gate | Total RCs | P0 (launch) | P1 (month 1) | P2 (month 3) | P3 (post-data) | Never |
|---|---|---|---|---|---|---|
| **C0** (Env. Permeability) | 3 | 0% (0/3) | 33% (1/3) | 100% (3/3) | 100% | 0% (subtypes need clinical) |
| **C1** (Believability) | 8 | 13% (1/8) | 50% (4/8) | 100% (8/8) | 100% | 0% |
| **C2** (Desire) | 8 | 0% (0/8) | 38% (3/8) | 75% (6/8) | 100% | 0% |
| **C3** (Will) | 7 | 0% (0/7) | 86% (6/7) | 100% (7/7) | 100% | 0% |
| **C4** (Intention) | 7 | 14% (1/7) | 86% (6/7) | 86% (6/7) | 100% | 0% |
| **C5** (Commitment) | 8 | 0% (0/8) | 38% (3/8) | 75% (6/8) | 100% | 0% |
| **C6A** (Action Initiation) | 8 | 25% (2/8) | 50% (4/8) | 75% (6/8) | 100% | 0% |
| **C6B** (Action Persistence) | 9 | 44% (4/9) | 78% (7/9) | 89% (8/9) | 100% | 0% |
| **TOTAL** | 58* | 14% (8/58) | 55% (32/58) | 86% (50/58) | 100% (58/58) | 0% |

*Note: Count is 58 unique root causes for analysis purposes. C0-1 and C5-8 overlap (same root cause reclassified). C0-P subtypes (C0-3, C0-4, C0-5, C0-6) are screened but not diagnosed -- they require clinical evaluation. Including the 3 C0-P subtypes as "screenable" brings the count closer to 61.

### 6. Cost Estimate: Gemini API Calls for Detection

Root causes requiring Gemini API calls for detection (not just evaluation).

| Root Cause | When Gemini Called | Estimated Cost per Check | Frequency |
|---|---|---|---|
| C6-6: Recursive Justification | Analyze session reflections for justification patterns | ~$0.005 per analysis | Per session with reflection |
| C7-6: Value Contradiction | Analyze transcript for value-based objections | ~$0.005 per transcript | Per drill/simulation with transcript |
| C7-7: Identity Misalignment | Analyze language for identity-based resistance | ~$0.005 per transcript | Per drill/simulation with transcript |
| C8A-6: Self-Sabotage | Analyze obstacle reports for self-handicapping | ~$0.005 per analysis | Weekly aggregate |
| C1-8: Attribution Error | Analyze post-success language for external attribution | ~$0.003 per analysis | Per high-score event |
| C2-2: Fear-Suppressed Desire | Analyze language for fear/consequence themes | ~$0.005 per analysis | Per simulation session |

**Total estimated Gemini cost for VCM diagnostics:**
- At P0/P1 (no Gemini required): $0.00 per user per month
- At P2 (selective Gemini): ~$0.10-0.25 per active user per month (assuming 15 sessions/month, 3-5 Gemini calls per session)
- At P3 (full Gemini analysis): ~$0.30-0.50 per active user per month

**Note:** These costs are IN ADDITION to Simulation Studio Gemini costs (~$0.01-0.02/session for conversations). VCM diagnostic Gemini calls analyze EXISTING transcripts, not generate new conversations, so they use shorter prompts and cost less per call.

The vast majority of root causes (44/58 at P0+P1) are detectable using RULE_BASED or PATTERN_MATCH methods that require zero API calls. Gemini is only needed for nuanced language analysis at P2/P3 priority levels.

---

## Key Findings

1. **C6B (Persistence) is the most detectable gate at launch.** 4 of 9 root causes are P0. This makes sense -- persistence failures produce the clearest behavioral signals (abandonment, retakes, engagement decay).

2. **C6A (Initiation) has 2 P0 root causes that directly impact first-session retention.** Motor initiation threshold and momentum dependency are high-impact, clean-signal detections that should be in the first sprint.

3. **C3 (Will) is the most detectable gate at P1.** 6 of 7 root causes detectable by month 1. Cost-benefit evaluation failures produce clear behavioral signals (avoidance, preference patterns, preview-without-start).

4. **C2 (Desire) and C5 (Commitment) are the hardest gates to detect.** Both have 0 P0 root causes and require more sophisticated analysis. Desire is particularly challenging because its signals overlap with many other gates.

5. **No root cause is completely undetectable.** Every root cause can be at least screened through KDENZ's channels, though some (C0-P subtypes) require clinical referral for diagnosis. The C8A-8 (trauma freeze) is the most sensitive -- detectable but must be handled with extreme clinical caution.

6. **Cross-pillar detection is essential for 8 root causes.** These cannot be reliably detected from any single pillar alone. The recommendation engine that synthesizes data across pillars is a key architectural requirement.

7. **The "Never Miss Twice" rule addresses 3 root causes directly:** C1-6 (fragile confidence), C8B-4 (single-error catastrophizing), and C8B-8 (moral self-punishment). This is one of the highest-leverage interventions across the entire VCM.

8. **44 of 58 root causes (76%) are detectable without any API calls** using only behavioral telemetry, engagement patterns, and spaced repetition data. This validates the "rule-based diagnostics first" approach.
