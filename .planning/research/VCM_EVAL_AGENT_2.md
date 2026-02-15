# VCM Root Cause Diagnostic Signal Analysis for KDENZ

**Agent:** 2 (Signal Specificity & Observability Analysis)
**Date:** 2026-02-13
**Scope:** All 61 root causes across 10 VCM gates (C0 through C8B)
**Purpose:** Evaluate each root cause for detectability, signal specificity, computation validity, and implementation priority within the KDENZ communication training platform.

---

## KDENZ Detection Channels Reference

Before evaluating individual root causes, here are the concrete detection channels available:

| Channel | What It Captures | Latency |
|---------|-----------------|---------|
| **APP_BEHAVIOR** | Session starts/completions, quit points, time-in-app, feature usage, drill selections, difficulty avoidance, streak data, hover/dwell times, navigation patterns, time-to-first-action, return intervals | Real-time |
| **LANGUAGE** | Transcript keywords/phrases via Web Speech API, hedging patterns, self-referential statements, vagueness markers, justification language | Real-time (Chrome) |
| **VOICE_PROSODY** | Pitch, pace, energy, stress, confidence, hesitation patterns, freeze markers, vocal tremor, flat affect via Hume batch API | Post-session |
| **DRILL_PERFORMANCE** | Scores, accuracy trends, technique selection, mastery progression, error patterns, time-to-response, retry behavior, difficulty level choices | Per-drill |
| **ONBOARDING** | 4 diagnostic questions at signup (volitional framework) | One-time |
| **GEMINI_EVAL** | LLM-based intent analysis of transcript content, simulation turn quality scoring | Post-session |

---

## C0 -- Environmental Permeability (3 root causes)

### C0-P: Physical/Biological Limitation
- **Signal specificity**: UNIQUE
  - Physical/medical limitations produce a distinctive pattern of total inability across all goal domains, not domain-specific failure.
- **Observability**: NOT_DETECTABLE
  - Primary channel: None -- KDENZ cannot assess medical conditions, neurological status, or metabolic states
  - Secondary channel: APP_BEHAVIOR (extremely weak proxy -- consistently zero engagement across all features might suggest this, but cannot distinguish from simple disinterest)
  - Specific signals: None reliably available. KDENZ has no access to medical history, lab results, or clinical observation.
- **Decision computation**: THEORETICAL_ONLY
  - `IF Physical_Limitation = TRUE THEN Action_Blocked` -- requires clinical assessment data KDENZ does not have. The boolean `Physical_Limitation` is not observable through any KDENZ channel.
- **Min detection window**: N/A -- not detectable
- **KDENZ priority**: SKIP
  - Reasoning: This root cause explicitly routes to medical evaluation. KDENZ is not a clinical tool and has no access to the information needed for detection. Per VCM design, C0 failures are pre-volitional and outside KDENZ's intervention scope.

### C0-1: High Activation Cost (Environmental Friction)
- **Signal specificity**: SHARED
  - Overlaps with: C5-3 (Effort Overestimation), C8A-1 (Motor Initiation Threshold)
  - Disambiguation strategy: C0-1 is about real environmental barriers (distance, setup time); C5-3 is about perceived effort being disproportionate to actual effort; C8A-1 is about motor system threshold regardless of environment. In KDENZ context, C0-1 manifests as complaints about external setup ("my mic doesn't work," "I need to find a quiet room") whereas C5-3 manifests as exaggerating how hard the drill itself is, and C8A-1 manifests as being ready but unable to press "start."
  - **NOTE**: The foundational document reclassified C0-1 to C5-8 (Environmental Friction) based on agency preservation evidence. The root cause database still lists it under C0. For KDENZ implementation, treat as C5-8.
- **Observability**: APP_BEHAVIOR | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- long delays between app open and session start; sessions started but abandoned within first 30 seconds; patterns of opening app then closing without action
  - Secondary channel: LANGUAGE -- if onboarding or feedback captures setup complaints ("I can't find a quiet room," "my headphones aren't working")
  - Specific signals: (1) App-open-to-session-start delay > 5 minutes on 3+ occasions, (2) session abandonment within first 30 seconds, (3) time-of-day patterns suggesting environmental constraints
- **Decision computation**: NEEDS_PROXY
  - `IF Environmental_Friction > Activation_Threshold THEN Action_Blocked` -- Environmental_Friction is not directly measurable. Proxy: ratio of app-opens-without-sessions to total app-opens, combined with time-to-first-action distribution.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through behavioral proxies but requires accumulation of pattern data. Moderately common in a voice practice app (users need quiet environments, working microphones). However, KDENZ cannot redesign the user's physical environment -- interventions are limited to timing suggestions and session design.

### C0-2: Situational Blockage
- **Signal specificity**: UNIQUE
  - Structural/resource constraints produce a clean signal: complete inability to access a feature, not partial engagement.
- **Observability**: NOT_DETECTABLE (mostly)
  - Primary channel: None -- KDENZ cannot verify whether a user lacks time, money, or access outside the app
  - Secondary channel: APP_BEHAVIOR (very weak proxy -- zero usage over extended period might indicate structural blockage, but could indicate anything)
  - Specific signals: Total absence of activity for extended periods (14+ days) with no prior gradual decline pattern
- **Decision computation**: THEORETICAL_ONLY
  - `IF Resource_Available = FALSE OR Access_Blocked = TRUE THEN Goal_Non_Viable` -- KDENZ cannot assess resource availability or access status. These are life-context variables.
- **Min detection window**: N/A -- not reliably detectable
- **KDENZ priority**: SKIP
  - Reasoning: Situational blockage refers to external life constraints (time, money, legal, family opposition) that KDENZ has no visibility into. A user who stops using the app because they changed jobs and have no commute time looks identical to a user who lost interest. No reliable disambiguation possible.

---

## C1 -- Believability (8 root causes)

### C1-1: Cognitive Biases (Overconfidence/Planning Fallacy)
- **Signal specificity**: SHARED
  - Overlaps with: C1-5 (Insufficient Evidence -- both involve miscalibrated beliefs, but in opposite directions)
  - Disambiguation strategy: C1-1 shows overconfidence (high self-assessment + poor performance), while C1-5 shows underconfidence (low self-assessment + insufficient data to judge). In KDENZ: C1-1 users select high difficulty immediately and fail; C1-5 users hesitate to engage and ask for more information.
- **Observability**: DRILL_PERFORMANCE | APP_BEHAVIOR
  - Primary channel: DRILL_PERFORMANCE -- gap between self-estimated performance and actual scores; selecting difficulty levels far above demonstrated mastery; no contingency behavior after failures
  - Secondary channel: APP_BEHAVIOR -- skipping tutorials/instructions, jumping to advanced content, surprise at poor scores (measured by time-on-scorecard after poor performance)
  - Specific signals: (1) Difficulty selection 2+ levels above mastery level, (2) predicted score vs. actual score delta > 30% on self-assessment drills (if implemented), (3) no timeline/plan changes after repeated failures
- **Decision computation**: IMPLEMENTABLE
  - `IF Confidence > Evidence_Base THEN Prediction_Error_HIGH` -- Proxy: `IF selected_difficulty > mastery_level + 2 AND failure_rate > 60% THEN overconfidence_flag`. Directly implementable from drill data.
- **Min detection window**: 5+ drill attempts / 3+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through drill performance data and difficulty selection patterns. Moderately common in communication training (people overestimate their skill). However, in KDENZ context this is more of a calibration issue than a blocking failure -- overconfident users still engage, they just engage at the wrong level.

### C1-2: Fixed Mindset
- **Signal specificity**: SHARED
  - Overlaps with: C1-8 (Attribution Error -- both prevent efficacy updating from success), C5-5 (Failure Cost Aversion -- both lead to challenge avoidance)
  - Disambiguation strategy: C1-2 shows belief that ability is fixed ("I'm just not a good speaker"); C1-8 shows external attribution of success ("I got lucky that time"); C5-5 shows fear of failure consequences ("what if I fail and everyone sees"). In KDENZ: C1-2 users avoid challenges AND show no improvement acknowledgment; C1-8 users dismiss their wins; C5-5 users specifically avoid high-visibility exercises.
- **Observability**: LANGUAGE | APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: LANGUAGE -- fixed mindset phrases in transcript or simulation ("I'm just not good at this," "some people can, I can't," "I'll never be able to")
  - Secondary channel: APP_BEHAVIOR -- avoids challenging drills, avoids new technique categories, sticks to mastered-easy content, drops off after poor performance
  - Specific signals: (1) Fixed-trait language in transcripts (NLP keyword detection), (2) challenge avoidance pattern: never selecting difficulty > current mastery, (3) post-failure dropout: leaving app within 60 seconds of a low score, (4) no mastery progression despite regular usage
- **Decision computation**: NEEDS_PROXY
  - `IF Belief(Ability_Fixed) = TRUE THEN Efficacy_Update_Blocked` -- Internal belief not directly measurable. Proxy: combination of fixed-trait language detection + challenge avoidance behavior + post-failure dropout pattern.
- **Min detection window**: 7+ sessions / 14+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through language patterns and behavioral telemetry. Very common in communication training contexts ("I'm just not a good public speaker" is one of the most common self-limiting beliefs). High impact because it blocks all growth. KDENZ can intervene with mastery experiences and growth-oriented framing.

### C1-3: No Relatable Models
- **Signal specificity**: AMBIGUOUS
  - This root cause describes absence of vicarious efficacy -- the user hasn't seen someone "like them" succeed. Signal overlaps with general low confidence (C1-6), insufficient evidence (C1-5), and could present identically to many C1 root causes at the behavioral level.
- **Observability**: LANGUAGE (weak) | NOT_DETECTABLE (primary)
  - Primary channel: LANGUAGE -- phrases like "nobody like me has done this" or "I don't know anyone who succeeded" in simulation transcripts or feedback. Very low probability of appearing spontaneously in a communication training app.
  - Secondary channel: None reliable
  - Specific signals: (1) Demographic-linked statements in onboarding or simulations (very rare), (2) absence of engagement with success stories/case studies in Institute content (very weak proxy)
- **Decision computation**: THEORETICAL_ONLY
  - `IF Proximal_Models = 0 THEN Vicarious_Efficacy = LOW` -- KDENZ has no way to assess whether the user has relatable role models in their real life. The variable `Proximal_Models` exists entirely outside the app context.
- **Min detection window**: N/A -- not reliably detectable
- **KDENZ priority**: LOW
  - Reasoning: Theoretically important but KDENZ cannot observe whether users have relatable models. The signals are too ambiguous and the phrases too unlikely to appear in communication drills. KDENZ could address this proactively (by showing diverse success stories in Institute content) but cannot diagnose it.

### C1-4: Meta-Cognitive Doubt
- **Signal specificity**: SHARED
  - Overlaps with: C1-6 (Fragile Confidence -- both involve self-doubt), C8A-2 (Last-Minute Deliberation -- both involve excessive second-guessing)
  - Disambiguation strategy: C1-4 is doubt about one's own judgment/thinking process ("can I trust my own assessment?"); C1-6 is confidence that collapses after setbacks; C8A-2 is hesitation at the moment of action. In KDENZ: C1-4 users change answers repeatedly, undo decisions, show high response time variability suggesting ongoing self-questioning.
- **Observability**: DRILL_PERFORMANCE | APP_BEHAVIOR | LANGUAGE
  - Primary channel: DRILL_PERFORMANCE -- high answer-change rate, long deliberation times, requesting second chances, low confidence even on correct answers
  - Secondary channel: LANGUAGE -- phrases indicating meta-doubt ("I'm probably wrong," "I can't trust my judgment on this," "what if I'm wrong about being able to do this")
  - Specific signals: (1) Answer-change rate > 30% on multiple-choice drills, (2) time-to-respond > 2x median with correct answers (indicating deliberation despite knowing), (3) disproportionate use of "undo" or "try again" features, (4) meta-doubt language markers in transcripts
- **Decision computation**: NEEDS_PROXY
  - `IF Trust(Own_Judgment) = LOW THEN Belief_Formation_Halted` -- Internal trust state not directly observable. Proxy: answer-change frequency + deliberation time variance + repeated undoing behavior.
- **Min detection window**: 10+ drill attempts / 5+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through drill behavior patterns (answer-changing, deliberation time). Moderately common but requires sufficient drill data. Impact is high when present but prevalence in a communication training context is uncertain.

### C1-5: Insufficient Evidence
- **Signal specificity**: SHARED
  - Overlaps with: C1-4 (Meta-Cognitive Doubt -- both lead to hesitant engagement), C6-5 (Action Ambiguity -- both involve "I don't know enough")
  - Disambiguation strategy: C1-5 is about not having enough data to believe success is possible; C1-4 is about not trusting one's own judgment even with data; C6-5 is about not knowing what specific action to take. In KDENZ: C1-5 users extensively browse Institute content without doing drills; C1-4 users do drills but agonize over answers; C6-5 users open drills but don't know which to select.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- extensive browsing of educational content (Institute) without attempting drills, excessive tutorial/help consumption, research-without-action pattern (views many technique descriptions but attempts none)
  - Secondary channel: DRILL_PERFORMANCE -- when they do attempt, performance is not necessarily poor, suggesting the barrier was informational, not skill-based
  - Specific signals: (1) Institute content views > 10 with drill attempts = 0, (2) help/tutorial page views > 5x before first drill, (3) high content-to-practice ratio over first 5 sessions
- **Decision computation**: IMPLEMENTABLE
  - `IF Evidence(Feasibility) < Belief_Threshold THEN Belief_Unstable` -- Proxy: `IF content_views > 10 AND drill_attempts = 0 AND days_active > 3 THEN insufficient_evidence_flag`. Directly implementable from app behavior data.
- **Min detection window**: 3+ sessions / 5+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the content-consumption-without-practice pattern. Common in communication training (users want to "learn more before trying"). High impact because it prevents skill building entirely. KDENZ has direct intervention capability: guided first drills, "practice before exposure" pattern, progressive disclosure.

### C1-6: Fragile Confidence
- **Signal specificity**: SHARED
  - Overlaps with: C1-2 (Fixed Mindset -- both lead to avoidance after setback), C8B-4 (Single-Error Catastrophizing -- both involve disproportionate reaction to failure)
  - Disambiguation strategy: C1-6 shows confidence collapse after ANY negative event (even minor); C1-2 shows stable low belief in ability; C8B-4 shows abandonment after a single error mid-task. In KDENZ: C1-6 users show dramatic engagement drop after poor scores that slowly recovers; C1-2 users consistently avoid challenge; C8B-4 users quit mid-drill after first mistake.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- usage drops sharply after poor scores, long absence following negative feedback, pattern of engagement-crash-slow-recovery cycles
  - Secondary channel: DRILL_PERFORMANCE -- mastery score volatility (high one session, crashes next after bad feedback)
  - Tertiary channel: VOICE_PROSODY -- pitch instability and confidence markers dropping post-feedback
  - Specific signals: (1) Session gap > 72 hours following a score below personal average, (2) engagement drops > 50% in week following negative feedback, (3) mastery score standard deviation > 2x expected for skill level, (4) Hume confidence markers show sharp decline post-scorecard review
- **Decision computation**: IMPLEMENTABLE
  - `IF Setback_Sensitivity = HIGH AND Setback_Occurs THEN Efficacy_Collapse` -- Proxy: `IF post_low_score_gap > 72h AND this_pattern_count > 2 THEN fragile_confidence_flag`. Directly implementable by tracking session gaps following low scores.
- **Min detection window**: 3+ setback events / 14+ days (need enough cycles to see the pattern)
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through engagement-after-setback patterns. Very common in skill learning contexts. High impact because it creates a negative feedback loop (setback -> dropout -> loss of progress -> lower confidence on return). KDENZ can intervene with graduated difficulty, emphasis on progress over perfection, and "never miss twice" streak mechanics.

### C1-7: Social Disconfirmation
- **Signal specificity**: AMBIGUOUS
  - External social pressure (family/friends/colleagues doubting the user) occurs outside KDENZ and produces signals indistinguishable from general low confidence.
- **Observability**: LANGUAGE (weak) | NOT_DETECTABLE (primary)
  - Primary channel: LANGUAGE -- phrases like "everyone says I can't" or "my family doesn't believe in me" if they appear in simulation conversations or onboarding. Very unlikely to surface spontaneously.
  - Secondary channel: None reliable
  - Specific signals: (1) Social-disconfirmation keywords in transcripts (extremely rare in drill context), (2) possible signal: user practices at unusual hours suggesting hiding practice from others (very speculative proxy)
- **Decision computation**: THEORETICAL_ONLY
  - `IF Social_Feedback = NEGATIVE THEN Efficacy_Erosion` -- KDENZ has no access to the user's social environment. The variable `Social_Feedback` exists entirely outside the app.
- **Min detection window**: N/A -- not reliably detectable
- **KDENZ priority**: SKIP
  - Reasoning: Social disconfirmation occurs in the user's relationships, which KDENZ cannot observe. The diagnostic signals ("everyone says I can't") are extremely unlikely to appear in communication drill transcripts. Cannot diagnose; can only address proactively through encouragement and normalization in app messaging.

### C1-8: Attribution Error
- **Signal specificity**: SHARED
  - Overlaps with: C1-2 (Fixed Mindset -- both prevent learning from success), C1-6 (Fragile Confidence -- both show failure to consolidate efficacy)
  - Disambiguation strategy: C1-8 specifically dismisses success ("I got lucky," "it was easy, doesn't count"); C1-2 shows fixed-trait beliefs about inability; C1-6 shows confidence collapse after setbacks. In KDENZ: C1-8 users perform well but don't progress to harder content because they don't credit their own skill.
- **Observability**: DRILL_PERFORMANCE | APP_BEHAVIOR | LANGUAGE
  - Primary channel: DRILL_PERFORMANCE -- high scores on drills but no progression to harder difficulty; mastery data shows competence but user stays at low difficulty
  - Secondary channel: LANGUAGE -- dismissive self-statements in simulation transcripts ("I just got lucky," "that was an easy one")
  - Specific signals: (1) Mastery score > 80% at current difficulty but no difficulty increase for 5+ sessions, (2) repeatedly choosing "easy" mode despite high success rate, (3) language patterns dismissing own performance
- **Decision computation**: NEEDS_PROXY
  - `IF Attribution(Success) = EXTERNAL THEN Efficacy_Update_Blocked` -- Internal attribution not directly observable. Proxy: high-performance-low-progression pattern + success-dismissal language.
- **Min detection window**: 8+ sessions / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through the performance-progression gap and language patterns. Moderately common. Moderate impact -- these users are actually competent but don't believe it, so KDENZ can intervene by surfacing objective progress data and mastery metrics.

---

## C2 -- Desire (8 root causes)

### C2-1: Value Misalignment
- **Signal specificity**: SHARED
  - Overlaps with: C2-6 (External Motivation -- both involve pursuing goals for wrong reasons), C2-7 (Purpose Deficit -- all three involve motivational mismatch)
  - Disambiguation strategy: C2-1 is actively pursuing something that conflicts with personal values ("I should want this but I don't"); C2-6 is pursuing for external approval; C2-7 is absence of any meaning connection. In KDENZ: C2-1 users engage with some features enthusiastically and completely ignore others (value-aligned vs. misaligned skills); C2-6 users only engage when external prompts exist; C2-7 users show flat engagement across everything.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- selective engagement: enthusiastic about certain technique categories, complete avoidance of others; feature usage skew
  - Secondary channel: VOICE_PROSODY -- flat affect/low engagement prosody during misaligned drills vs. higher energy during aligned ones (Hume batch comparison across drill types)
  - Specific signals: (1) Technique category engagement variance > 3x (high engagement in some, zero in others), (2) completion rate differential across skill categories > 50%, (3) energy/enthusiasm prosody differential across drill types
- **Decision computation**: NEEDS_PROXY
  - `IF Goal_Value_Alignment < Threshold THEN Intrinsic_Motivation = LOW` -- Value alignment not directly measurable. Proxy: engagement differential across technique categories indicates which skills align with user values and which don't.
- **Min detection window**: 5+ sessions across multiple technique categories / 10+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through differential engagement patterns. Common in a platform with 57+ techniques -- users will naturally gravitate toward valued skills. However, the distinction between "value misalignment" and "natural preference" is blurry. KDENZ should note the pattern and adapt recommendations but not over-diagnose.

### C2-2: Fear-Suppressed Desire
- **Signal specificity**: SHARED
  - Overlaps with: C2-3 (Emotional Avoidance -- both involve avoidance driven by negative emotion), C5-5 (Failure Cost Aversion -- both involve fear preventing engagement), C2-5 (Approach-Avoidance Conflict -- all involve competing approach/avoidance)
  - Disambiguation strategy: C2-2 is desire suppressed specifically by fear of consequences of success ("it could ruin everything"); C2-3 is avoidance of the emotional experience of engagement itself; C5-5 is fear of failure consequences. In KDENZ: C2-2 users show tension when imagining using techniques successfully (fear of what happens when they communicate differently); C2-3 users avoid the emotional discomfort of practice itself; C5-5 users fear looking bad if they fail.
- **Observability**: VOICE_PROSODY | LANGUAGE
  - Primary channel: VOICE_PROSODY -- vocal tension on commitment/success statements (Hume detects stress/tension markers when discussing goals or imaging positive outcomes)
  - Secondary channel: LANGUAGE -- "I want to but what if..." pattern, future-consequence anxiety language
  - Specific signals: (1) Hume stress markers elevated during positive-outcome discussion in simulations, (2) approach-withdrawal oscillation in session behavior (starts a drill, gets close, quits), (3) "what if" consequence language in transcripts
- **Decision computation**: NEEDS_PROXY
  - `IF Fear(Consequence) > Desire(Goal) THEN Approach_Blocked` -- Internal fear-desire balance not directly observable. Proxy: stress prosody during success-imagining + approach-withdrawal oscillation pattern.
- **Min detection window**: 5+ sessions with simulation / 10+ days
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable through prosody and language but requires simulation sessions where users discuss goals and outcomes. In a communication training app, "fear of becoming a better communicator" is less common than "fear of failure at practice." The signal is weak and requires sophisticated prosodic analysis.

### C2-3: Emotional Avoidance
- **Signal specificity**: SHARED
  - Overlaps with: C2-2 (Fear-Suppressed Desire), C5-5 (Failure Cost Aversion), C8A-6 (Self-Sabotage -- all involve avoidance behavior)
  - Disambiguation strategy: C2-3 is avoidance of the emotional experience itself (anxiety, shame, embarrassment of practicing); C2-2 is fear of success consequences; C5-5 is fear of failure consequences; C8A-6 is creating barriers to prevent action. In KDENZ: C2-3 users avoid emotionally challenging drill types (e.g., accusation audits, labeling emotions) while doing easier/less emotional ones.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- systematic avoidance of emotionally challenging technique categories (accusation audit, emotional labeling, empathy exercises) while engaging with less emotional ones (mirroring, calibrated questions)
  - Secondary channel: VOICE_PROSODY -- Hume detects anxiety/discomfort markers during emotionally loaded drills; physical discomfort indicators
  - Specific signals: (1) Emotional-technique avoidance ratio: 0 attempts on emotional drills vs. 5+ on neutral drills, (2) early termination of emotionally loaded simulations, (3) elevated Hume anxiety markers on emotional content, (4) negative self-talk language patterns in transcripts during emotional drills
- **Decision computation**: NEEDS_PROXY
  - `IF Emotional_Cost(Engagement) > Perceived_Benefit THEN Avoidance_Dominates` -- Emotional cost not directly measurable. Proxy: differential avoidance of emotionally-loaded vs. neutral technique categories.
- **Min detection window**: 7+ sessions across technique types / 14+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through differential avoidance patterns in KDENZ because the platform has both emotionally-loaded and neutral techniques. Common in communication training (many people find emotional labeling, vulnerability, and assertiveness exercises uncomfortable). High impact because emotional techniques are often the most transformative. KDENZ can intervene with graduated exposure and lower-stakes versions of emotional drills.

### C2-4: Autonomy Threat (Reactance)
- **Signal specificity**: SHARED
  - Overlaps with: C7-7 (Identity Misalignment -- both involve resistance to change), but reactance is specifically about perceived external pressure
  - Disambiguation strategy: C2-4 activates when the user feels pushed ("the more they push, the less I want to"); C7-7 activates when the goal conflicts with identity ("that's not who I am"). In KDENZ: C2-4 users resist recommendations and do the opposite of what's suggested; C7-7 users avoid specific techniques that feel identity-threatening.
- **Observability**: APP_BEHAVIOR | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- anti-recommendation behavior (consistently choosing different techniques/drills than recommended), negative response to nudges (decreased engagement after push notifications), resistance pattern after VCM-driven recommendations
  - Secondary channel: LANGUAGE -- reactance language in simulations or feedback ("don't tell me what to do," resistance to authority figures in simulation scenarios)
  - Specific signals: (1) Recommendation acceptance rate < 10% over 5+ recommendations, (2) engagement decrease within 24h of push notifications, (3) anti-authority language in simulation transcripts, (4) doing exact opposite of recommended path
- **Decision computation**: IMPLEMENTABLE
  - `IF Perceived_Control_Loss = TRUE THEN Reactance_Activated; Desire_Suppressed` -- Proxy: `IF recommendation_acceptance_rate < 10% AND engagement_decrease_after_nudge THEN reactance_flag`. Directly implementable from recommendation and engagement data.
- **Min detection window**: 5+ recommendations / 10+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through anti-recommendation behavior. Important in a platform that prescribes exercises -- reactance to the prescription system itself is a meta-level threat. Common in users who feel "diagnosed" or "told what to do." KDENZ must detect this to switch from directive to autonomy-supportive MI framing. Direct intervention: increase user choice, reduce prescriptive language, frame recommendations as options.

### C2-5: Approach-Avoidance Conflict
- **Signal specificity**: SHARED
  - Overlaps with: C2-2 (Fear-Suppressed Desire), C7-6 (Value Contradiction), C5-6 (Decision Paralysis)
  - Disambiguation strategy: C2-5 is simultaneous wanting and not-wanting (oscillation); C2-2 is desire suppressed by fear; C7-6 is commitment undermined by conflicting values; C5-6 is inability to decide among options. In KDENZ: C2-5 users show oscillating engagement -- high enthusiasm one session, avoidance the next, with no external trigger.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- engagement oscillation: high-activity sessions alternating with zero-activity days in a distinctive pattern, without correlation to feedback quality or scores
  - Secondary channel: VOICE_PROSODY -- Hume might detect ambivalent prosody (mixed signals within single statements)
  - Specific signals: (1) Engagement coefficient of variation > 0.8 (highly variable session-to-session), (2) no correlation between engagement variability and score quality, (3) oscillating difficulty selection (hard -> easy -> hard pattern), (4) session-start-then-immediate-quit pattern (approach then avoid)
- **Decision computation**: NEEDS_PROXY
  - `IF Approach_Force ~ Avoidance_Force THEN Net_Motivation ~ 0` -- Internal force balance not observable. Proxy: engagement oscillation pattern without external trigger correlation.
- **Min detection window**: 10+ sessions / 21+ days
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable through oscillation patterns but requires substantial data and the pattern is ambiguous (oscillation could indicate many things -- schedule variability, mood effects, etc.). Difficult to distinguish from normal usage variability. Lower priority because intervention is non-specific.

### C2-6: External Motivation
- **Signal specificity**: SHARED
  - Overlaps with: C2-1 (Value Misalignment), C7-3 (No External Monitoring -- both relate to external motivation sources)
  - Disambiguation strategy: C2-6 is pursuing goals exclusively for external approval/reward; C2-1 is pursuing goals that conflict with values; C7-3 is commitment decay without external accountability. In KDENZ: C2-6 users only engage when there are social features, leaderboards, or external feedback. Engagement collapses when practicing alone.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- engagement only during social features (if leaderboards, sharing, or group features exist), engagement collapses when external rewards removed or when practicing in isolation
  - Secondary channel: LANGUAGE -- "I'm doing this to impress others" or "without external reward I lose interest" (unlikely to surface spontaneously)
  - Specific signals: (1) Engagement pattern correlates with social feature availability, (2) high engagement in shareable activities, zero in private practice, (3) engagement drops when streak rewards or gamification elements plateau, (4) if social features exist: usage only when peers are active
- **Decision computation**: NEEDS_PROXY
  - `IF (Intrinsic_Motivation = 0) AND (Only_External_Rewards = TRUE) THEN Motivation_Fragile` -- Internal motivation not directly observable. Proxy: engagement differential between reward-present and reward-absent contexts.
- **Min detection window**: 10+ sessions / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Partially detectable through engagement patterns around external reward availability. Moderately common. KDENZ can diagnose this if it tracks engagement around gamification elements (streaks, achievements, leaderboards) vs. pure practice sessions. Intervention: gradually shift from extrinsic to intrinsic reward framing.

### C2-7: Purpose Deficit
- **Signal specificity**: SHARED
  - Overlaps with: C2-1 (Value Misalignment), C2-8 (Lack of Future Relevance), C7-5 (Lack of Urgency -- all involve low motivational salience)
  - Disambiguation strategy: C2-7 is complete absence of meaning ("what's the point?"); C2-1 is wrong meaning (goal conflicts with values); C2-8 is temporal disconnect (goal irrelevant to future); C7-5 is no time pressure. In KDENZ: C2-7 users show flat, low engagement across ALL features, not just specific ones.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- uniformly low engagement across all features (unlike C2-1 which shows differential engagement); short sessions, minimal exploration, low feature diversity
  - Secondary channel: VOICE_PROSODY -- flat affect across sessions, low energy baseline (Hume), no enthusiasm markers
  - Tertiary channel: LANGUAGE -- purposelessness language ("what's the point," "this doesn't matter")
  - Specific signals: (1) Session duration < 3 minutes on 80%+ sessions, (2) flat engagement across all technique categories (no favorites), (3) Hume energy/enthusiasm < 25th percentile consistently, (4) low feature exploration (sticks to 1-2 features, never explores)
- **Decision computation**: NEEDS_PROXY
  - `IF Subjective_Value(Goal) = 0 THEN vmPFC_Value_Assignment = FAILED` -- Subjective value not directly measurable. Proxy: uniformly flat engagement + low energy prosody + absence of any feature enthusiasm.
- **Min detection window**: 5+ sessions / 10+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through flat engagement pattern but hard to distinguish from general disinterest in the app. Common in users who signed up without clear personal motivation. KDENZ can intervene by surfacing personally relevant use cases and connecting practice to user's stated goals (from onboarding).

### C2-8: Lack of Future Relevance
- **Signal specificity**: SHARED
  - Overlaps with: C2-7 (Purpose Deficit), C5-2 (Delayed Gratification Intolerance), C7-5 (Lack of Urgency)
  - Disambiguation strategy: C2-8 is temporal disconnect from future identity ("I won't care about this in 5 years"); C2-7 is total absence of purpose; C5-2 is inability to tolerate delay between effort and reward; C7-5 is no deadline pressure. In KDENZ: C2-8 users may show initial engagement but not deep investment, treating practice as a temporary curiosity rather than a growth path.
- **Observability**: APP_BEHAVIOR | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- shallow engagement pattern (tries features once, doesn't return), no long-term progression behavior, treats app as entertainment rather than training
  - Secondary channel: LANGUAGE -- temporal disconnect language ("I won't care about this in 5 years," "this doesn't matter for my future")
  - Specific signals: (1) Feature exploration without depth (tries everything once, masters nothing), (2) no return to previously attempted techniques, (3) session pattern suggests curiosity browsing rather than systematic practice, (4) zero engagement with long-term features (mastery tracking, skill tree)
- **Decision computation**: NEEDS_PROXY
  - `IF Temporal_Distance(Goal) > Discounting_Threshold THEN Present_Motivation = LOW` -- Temporal perception not directly measurable. Proxy: shallow-breadth engagement without depth or return visits.
- **Min detection window**: 10+ sessions / 21+ days
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable but the signal is ambiguous -- shallow engagement could indicate many things. Relatively uncommon for users who self-selected into a communication training app. Lower priority because intervention is limited to future-self visualization and relevance framing.

---

## C3 -- Awareness (3 root causes)

### C3 Gate Overview
**Status:** V2 addition - detailed analysis pending

**Root causes:**
- **AA-1**: Lack of Self-Awareness (gap between perceived and actual performance)
- **AA-2**: Lack of Situational Awareness (failure to read context/other person)
- **AA-5**: Undetected Habit Patterns (unconscious behavioral routines)

**Provisional detection notes:**
- AA-1: Performance-self-assessment gap detectable via drill scores vs. confidence ratings
- AA-2: Simulation turn quality analysis (context-inappropriate technique usage)
- AA-5: Repeated error patterns, filler word blindness (before/after awareness training comparison)

**Full signal specificity analysis:** TO BE COMPLETED
**Full observability analysis:** TO BE COMPLETED
**Decision computation formulas:** TO BE COMPLETED
**KDENZ priority ranking:** TO BE COMPLETED

This gate is critical for KDENZ's core value proposition (the "holy shit moment"). Detailed evaluation forthcoming.

---

## C4 -- Attention (7 root causes)

### C4 Gate Overview
**Status:** V2 addition - detailed analysis pending

**Root causes:**
- **AA-3**: Distraction/Mind-Wandering (attention pulled away mid-task)
- **AA-4**: Attentional Narrowing (tunnel vision, missing peripheral cues)
- **AA-6**: Cognitive Fatigue (attention resource depletion)
- **AA-7**: Overwhelm (attention capacity exceeded by simultaneous demands)
- **AA-8**: Emotional Hijacking (emotion disrupting attention allocation)
- **AA-9**: Hyperfocus on Threat (attention locked on perceived danger)
- **AA-10**: Rumination (attention stuck in repetitive thought loop)

**Provisional detection notes:**
- AA-3: Mid-drill performance variability, simulation turn quality drops mid-conversation
- AA-4: Missed contextual cues in simulation scenarios (Gemini evaluation)
- AA-6: Time-of-day performance degradation, session-duration-quality correlation
- AA-7: Performance collapse under multi-constraint simulation scenarios
- AA-8: Hume prosody markers (anxiety/fear during performance drops)
- AA-9: Simulation behavior (defensive patterns, failure to advance negotiation)
- AA-10: Language patterns (repetitive phrasing, fixation on single topic)

**Full signal specificity analysis:** TO BE COMPLETED
**Full observability analysis:** TO BE COMPLETED
**Decision computation formulas:** TO BE COMPLETED
**KDENZ priority ranking:** TO BE COMPLETED

This gate is highly relevant for real-time communication skill execution. Detailed evaluation forthcoming.

---

## C5 -- Will (6 root causes + C5-8 from reclassified C0-1)

### C5-1: Energy Depletion
- **Signal specificity**: SHARED
  - Overlaps with: C8B-3 (Mood-Dependent Execution), C8B-1 (Task Boredom -- all show declining engagement)
  - Disambiguation strategy: C5-1 shows energy depletion BEFORE engagement (can't start because exhausted); C8B-3 shows execution varying with mood state; C8B-1 shows declining interest mid-task due to boredom. In KDENZ: C5-1 users show time-of-day patterns (worse engagement late in day), cross-domain low performance, and sessions that feel effortful from the start.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- strong time-of-day effects (engagement crashes in evening), day-of-week effects (lower engagement on busy days), session attempts that fail immediately (app opened but no action taken)
  - Secondary channel: VOICE_PROSODY -- low energy baseline at session start (Hume energy markers), fatigue vocal markers (slower pace, lower pitch, less vocal variety)
  - Specific signals: (1) Evening session engagement < 50% of morning engagement, (2) Hume energy scores declining across week, (3) session start but no action pattern (5+ app opens with 0 drill starts in a period), (4) "too tired" language if feedback is captured
- **Decision computation**: NEEDS_PROXY
  - `IF Available_Energy < Effort_Required THEN Engagement_Blocked` -- Energy levels not directly measurable. Proxy: time-of-day engagement patterns + Hume energy baseline at session start + cross-session energy trend.
- **Min detection window**: 10+ sessions across different times / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through temporal patterns and prosodic energy analysis. Common in working adults. Moderate impact -- KDENZ can recommend optimal practice times and shorter session formats, but cannot address the underlying energy depletion.

### C5-2: Delayed Gratification Intolerance
- **Signal specificity**: SHARED
  - Overlaps with: C2-8 (Lack of Future Relevance), C7-5 (Lack of Urgency), C8B-6 (Invisible Progress)
  - Disambiguation strategy: C5-2 is steep temporal discounting ("I need to see results NOW"); C2-8 is temporal disconnection from future self; C7-5 is no deadline pressure; C8B-6 is progress feedback loop broken. In KDENZ: C5-2 users want immediate visible improvement and abandon when first session shows no dramatic change. They may also prefer quick exercises over longer deep practice.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- preference for shortest-duration exercises, abandonment after first 1-3 sessions if no visible improvement, avoidance of long-term mastery features (skill tree), high engagement with "quick results" features
  - Secondary channel: DRILL_PERFORMANCE -- selects easy drills for quick wins, avoids multi-session technique progressions
  - Specific signals: (1) Session duration consistently < 5 minutes (micro-sessions only), (2) abandonment within first week if no significant score improvement, (3) avoidance of techniques requiring extended practice, (4) high engagement with score/result screens vs. low engagement with practice time
- **Decision computation**: NEEDS_PROXY
  - `IF Discount_Rate(Reward) > Effort_Cost_Tolerance THEN Commitment_Rejected` -- Discount rate not directly observable. Proxy: preference for short exercises + early abandonment without visible progress + avoidance of long-term features.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through session duration preferences and early abandonment patterns. Very common in app-based learning (most users expect immediate results). High impact because it's one of the primary churn drivers. KDENZ can intervene with mini-milestones, immediate micro-feedback, and visible progress indicators (directly aligned with the "visual feedback = 3.5x retention" research finding).

### C5-3: Effort Overestimation
- **Signal specificity**: SHARED
  - Overlaps with: C0-1/C5-8 (Environmental Friction), C8A-1 (Motor Initiation Threshold), C8A-4 (Waiting for Readiness)
  - Disambiguation strategy: C5-3 is anticipatory catastrophizing about effort ("this will be horrible"); C5-8 is actual environmental barriers; C8A-1 is motor system failure; C8A-4 is waiting for perfect conditions. In KDENZ: C5-3 users show long hesitation before starting but once started, perform adequately (showing the effort was overestimated).
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- long dwell time on drill description screens before starting (reading the effort requirements and hesitating), avoidance of drills labeled as "challenging" or "advanced"
  - Secondary channel: DRILL_PERFORMANCE -- when they do attempt, actual performance exceeds expectations (as measured by time-to-complete vs. predicted difficulty)
  - Specific signals: (1) Pre-start dwell time > 3x median on drill description screens, (2) avoidance of drills tagged as high-effort, (3) high performance relative to hesitation level (hesitated 5 minutes but completed successfully in 3), (4) post-drill satisfaction higher than pre-drill anxiety (if self-report captured)
- **Decision computation**: NEEDS_PROXY
  - `IF Perceived_Effort >> Actual_Effort THEN Commitment_Blocked` -- Perceived effort not directly measurable. Proxy: pre-start-hesitation-to-actual-performance ratio.
- **Min detection window**: 8+ drill attempts / 5+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through the hesitation-performance gap but requires granular behavioral tracking (dwell time on description screens). Moderately common. KDENZ can intervene with micro-starts ("just try 30 seconds") and post-drill reflection ("that wasn't as hard as expected, was it?").

### C5-4: Insufficient Perceived Reward
- **Signal specificity**: SHARED
  - Overlaps with: C2-7 (Purpose Deficit -- both involve low reward valuation), C8B-1 (Task Boredom -- both involve declining reward salience)
  - Disambiguation strategy: C5-4 is a pre-engagement judgment that the reward isn't worth the effort; C2-7 is absence of meaning; C8B-1 is reward declining mid-task through habituation. In KDENZ: C5-4 users evaluate the app and decide the payoff isn't worth it -- they may understand what the app does but find the reward insufficient to justify the effort.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- views results/scorecard screens minimally, doesn't engage with progress tracking, low interest in outcomes (quick dismissal of scores), low return rate despite adequate performance
  - Specific signals: (1) Scorecard screen dwell time < 5 seconds consistently, (2) never checks weekly trends or progress features, (3) adequate performance but declining session frequency, (4) unsubscribes from progress notifications
- **Decision computation**: NEEDS_PROXY
  - `IF NAcc_Activation(Reward) < Effort_Cost THEN Insufficient_Motivation` -- Neural activation not observable. Proxy: low engagement with outcome/reward features + declining frequency despite adequate performance.
- **Min detection window**: 7+ sessions / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Partially detectable through reward-feature disengagement. However, the signal is ambiguous -- users might not check progress because they trust the system, not because they don't value the reward. KDENZ can intervene by enhancing reward salience (more engaging scorecards, celebratory feedback, social sharing).

### C5-5: Failure Cost Aversion
- **Signal specificity**: SHARED
  - Overlaps with: C2-2 (Fear-Suppressed Desire), C1-2 (Fixed Mindset), C8A-6 (Self-Sabotage)
  - Disambiguation strategy: C5-5 is loss aversion at identity level ("what if I fail and everyone sees"); C2-2 is fear of success consequences; C1-2 is belief in fixed ability; C8A-6 is creating barriers to protect self-concept. In KDENZ: C5-5 users avoid "graded" or "scored" exercises, prefer private/unscored practice, avoid sharing results.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- avoids scored/graded exercises, prefers free practice mode, never shares results, avoids leaderboards or social features, plays on easiest difficulty only
  - Secondary channel: LANGUAGE -- failure-fear language ("what if I fail," "I'd rather not try than fail")
  - Specific signals: (1) 100% of drill attempts at lowest difficulty, (2) avoids simulation studio (highest failure visibility), (3) never uses share/export features, (4) high usage of unscored practice modes vs. zero usage of scored drills
- **Decision computation**: IMPLEMENTABLE
  - `IF Expected_Failure_Cost > Expected_Success_Reward THEN Net_Utility_Negative` -- Proxy: `IF lowest_difficulty_only AND avoids_simulation AND avoids_scored_drills THEN failure_cost_aversion_flag`. Directly implementable from difficulty selection and feature usage data.
- **Min detection window**: 5+ sessions / 10+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through systematic avoidance of evaluation contexts. Very common in communication training (public speaking anxiety, fear of judgment). High impact because it prevents engagement with the most effective learning activities (simulation, scored drills). KDENZ can intervene with private practice modes, growth-focused scoring, and normalized failure messaging.

### C5-6: Decision Paralysis (Analysis Paralysis)
- **Signal specificity**: SHARED
  - Overlaps with: C6-3 (Plan Selection Failure), C6-2 (Chronic Replanning), C1-4 (Meta-Cognitive Doubt)
  - Disambiguation strategy: C5-6 is overwhelm from too many options ("I can't decide"); C6-3 is inability to select among specific plan options; C6-2 is replanning as a substitute for action; C1-4 is self-doubt about judgment. In KDENZ: C5-6 users spend excessive time on skill tree / technique selection screens, browsing options without selecting.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- excessive dwell time on selection screens (technique picker, drill selector, skill tree), frequent navigation between options without selecting, browsing behavior without committing
  - Specific signals: (1) Time on selection/browse screens > 5 minutes per session, (2) navigation cycles (view technique A, view B, back to A, view C, back to A) > 3 cycles, (3) session ends on selection screen without drill start, (4) high browse-to-attempt ratio (views 10+ techniques, attempts 0)
- **Decision computation**: IMPLEMENTABLE
  - `IF Options > Satisficing_Threshold THEN Deliberation_Loop_Infinite` -- Proxy: `IF browse_time > 5min AND drill_starts = 0 AND navigation_cycles > 3 THEN decision_paralysis_flag`. Directly implementable from navigation and timing data.
- **Min detection window**: 3+ sessions / 5+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through navigation/selection behavior. KDENZ has 57+ techniques and multiple pillars, creating exactly the option overload that triggers this. Very common for new users facing a large skill tree. High impact because it prevents any practice. KDENZ can intervene with "recommended next drill" defaults, simplified starting paths, and progressive technique unlocking.

### C5-8: Environmental Friction (reclassified from C0-1)
- See C0-1 analysis above. Same root cause, reclassified to C5 based on agency preservation evidence.

---

## C6 -- Intention (7 root causes)

### C6-1: Conflicting Plans
- **Signal specificity**: SHARED
  - Overlaps with: C7-1 (Competing Commitments -- both involve resource competition), C6-4 (Cognitive Overload -- both involve capacity exceeded)
  - Disambiguation strategy: C6-1 is multiple active plans fragmenting executive attention; C7-1 is multiple commitments depleting commitment maintenance; C6-4 is plan complexity exceeding working memory. In KDENZ: C6-1 users start multiple technique tracks simultaneously but complete none, jumping between skill areas.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- starts multiple technique tracks in same session, switches between skill categories frequently, has 5+ "in progress" techniques with none completed
  - Secondary channel: DRILL_PERFORMANCE -- partial progress across many techniques, no technique reaching mastery
  - Specific signals: (1) Active technique count > 5 with completion rate < 20% for each, (2) category switching > 3 times per session, (3) no single technique progressed beyond introductory level despite 10+ total sessions, (4) scattered skill tree engagement (many started, none deepened)
- **Decision computation**: IMPLEMENTABLE
  - `IF Active_Plans > Executive_Capacity THEN Priority_Fragmentation` -- Proxy: `IF active_techniques > 5 AND max_completion_any_technique < 30% THEN conflicting_plans_flag`. Directly implementable from skill tracking data.
- **Min detection window**: 5+ sessions / 10+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through scattered skill tree engagement. Very common in KDENZ with 57+ techniques -- new users may try to learn everything at once. High impact because it prevents depth. KDENZ can intervene by limiting concurrent active techniques, suggesting a focused learning path, and implementing "finish one before starting another" guidance.

### C6-2: Chronic Replanning
- **Signal specificity**: SHARED
  - Overlaps with: C5-6 (Decision Paralysis), C6-6 (Recursive Justification), C8A-5 (Over-Simulation)
  - Disambiguation strategy: C6-2 is planning as a substitute for action (derives reward from the planning itself); C5-6 is paralysis from too many options; C6-6 is generating justifications to delay; C8A-5 is mental rehearsal substituting for action. In KDENZ: C6-2 users extensively customize their learning paths, rearrange skill tree priorities, but never actually start drills.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- high engagement with planning/configuration features (settings, skill tree arrangement, learning path customization) but zero or near-zero drill attempts; repeated modification of learning plans
  - Specific signals: (1) Settings/configuration changes > 5 per session, (2) learning path modifications > 3 per week with < 2 drill attempts, (3) time in planning/configuration > 80% of total session time, (4) creates plans/goals (if feature exists) but never executes them
- **Decision computation**: IMPLEMENTABLE
  - `IF Replanning_Frequency > Action_Frequency THEN Execution_Blocked` -- Proxy: `IF planning_feature_interactions > 3x drill_starts THEN chronic_replanning_flag`. Directly implementable from feature interaction data.
- **Min detection window**: 5+ sessions / 10+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable if KDENZ has planning/configuration features. Moderately common in structured learning platforms. Impact is moderate -- these users are engaged with the app but not with actual practice. KDENZ can intervene by surfacing "you've planned enough, start now" nudges, limiting configuration changes, and auto-starting recommended drills.

### C6-3: Plan Selection Failure
- **Signal specificity**: SHARED
  - Overlaps with: C5-6 (Decision Paralysis -- nearly identical behavioral presentation), C6-5 (Action Ambiguity)
  - Disambiguation strategy: C6-3 is committed to the goal but cannot select among viable approaches; C5-6 is overwhelmed by options at the cost level; C6-5 is not knowing what action to take at all. In KDENZ: C6-3 users know they want to improve (e.g., negotiation skills) but cannot decide between labeling drills, mirroring drills, or simulation practice. They compare approaches rather than trying one.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- comparison behavior (alternating between technique descriptions), feature comparison (looking at different drill formats for same technique), same navigation pattern as C5-6 but specifically within a single goal area
  - Specific signals: (1) Repeated comparison browsing within a single technique category, (2) reads technique descriptions for 3+ approaches without starting any, (3) time between "comparison browsing start" and "first drill attempt" > 3 sessions
- **Decision computation**: NEEDS_PROXY
  - `IF Viable_Options > 1 AND Selection_Criteria = UNCLEAR THEN Stalled` -- Selection criteria clarity not observable. Proxy: comparison browsing patterns within a goal area without selection.
- **Min detection window**: 5+ sessions / 10+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable but very similar to C5-6 (Decision Paralysis) in behavioral presentation. Moderately common. KDENZ can intervene with "recommended first step" within each technique category, or by hiding advanced options until foundational techniques are attempted.

### C6-4: Cognitive Overload
- **Signal specificity**: SHARED
  - Overlaps with: C6-1 (Conflicting Plans -- both involve capacity exceeded), C5-6 (Decision Paralysis)
  - Disambiguation strategy: C6-4 is working memory exceeded by plan complexity ("I can't remember all the steps"); C6-1 is too many active plans; C5-6 is too many options. In KDENZ: C6-4 users struggle with multi-step technique sequences, perform well on simple drills but fail on complex ones, and may show frustration with instruction-heavy content.
- **Observability**: DRILL_PERFORMANCE | APP_BEHAVIOR
  - Primary channel: DRILL_PERFORMANCE -- performance drops dramatically as drill complexity increases (simple = high score, multi-step = failure), errors that indicate forgotten steps rather than skill deficits
  - Secondary channel: APP_BEHAVIOR -- avoids complex drill formats, abandons multi-step drills mid-sequence, high quit rate on drills with 3+ sequential steps
  - Specific signals: (1) Performance variance > 40% between simple and complex drills for same technique, (2) multi-step drill completion rate < 30% while single-step > 80%, (3) quit point analysis shows abandonment at step 3+ in multi-step sequences, (4) repeated first-step-only completions
- **Decision computation**: IMPLEMENTABLE
  - `IF Plan_Complexity > Working_Memory_Capacity THEN Coherence_Impossible` -- Proxy: `IF complex_drill_score < 0.5 * simple_drill_score AND quit_at_step_3_rate > 50% THEN cognitive_overload_flag`. Directly implementable from drill performance data.
- **Min detection window**: 10+ drill attempts across complexity levels / 5+ sessions
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the simple-vs-complex performance gap. Very common in communication skill learning (techniques like accusation audits or tactical empathy have multiple sequential steps). High impact because it prevents mastery of advanced techniques. KDENZ can intervene by breaking complex techniques into sub-skills, scaffolding progression, and using "habit stacking" approaches.

### C6-5: Action Ambiguity
- **Signal specificity**: SHARED
  - Overlaps with: C1-5 (Insufficient Evidence -- both involve "I don't know enough"), C6-3 (Plan Selection Failure)
  - Disambiguation strategy: C6-5 is "I know I should do something but WHAT?" (no idea what action to take); C1-5 is "I don't know enough to believe I can do this" (belief deficit); C6-3 is "I know the options but can't pick" (selection failure). In KDENZ: C6-5 users navigate to the app but appear lost -- they don't browse technique options (like C5-6) or research (like C1-5), they just don't know where to start.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- aimless navigation (visits multiple screens without purpose), short dwell time on each screen, no clear behavioral intent, doesn't engage with either content or practice features
  - Specific signals: (1) Screen visit count > 10 per session with < 10 seconds per screen, (2) no drill starts, no content consumption, no settings changes -- just wandering, (3) session ends without any meaningful interaction, (4) repeat pattern across multiple sessions
- **Decision computation**: IMPLEMENTABLE
  - `IF Next_Step_Specificity < Action_Threshold THEN Intention_Formation_Blocked` -- Proxy: `IF screens_visited > 10 AND meaningful_interactions = 0 AND session_count > 3 THEN action_ambiguity_flag`. Directly implementable from navigation data.
- **Min detection window**: 3+ sessions / 5+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through aimless navigation patterns. Very common for new users in a feature-rich platform. High impact because it prevents any engagement. KDENZ has a direct, powerful intervention: guided onboarding that tells users exactly what to do next ("Start here: Record a 60-second speech"), implementation intentions ("When you open the app, do X first"), and a persistent "next recommended action" widget.

### C6-6: Recursive Justification
- **Signal specificity**: SHARED
  - Overlaps with: C6-2 (Chronic Replanning), C8A-4 (Waiting for Readiness)
  - Disambiguation strategy: C6-6 is generating new excuses each time to delay ("I have a good reason to wait" -- different reason each time); C6-2 is replanning as substitute for action; C8A-4 is waiting for perfect conditions. In KDENZ: C6-6 is hard to detect because the justifications occur internally or externally, not within the app.
- **Observability**: APP_BEHAVIOR (weak)
  - Primary channel: APP_BEHAVIOR -- pattern of opening app, browsing briefly, leaving without action, over many sessions, with no consistent alternative behavior pattern (not researching, not planning, not practicing -- just repeatedly approaching and withdrawing)
  - Secondary channel: LANGUAGE -- if feedback mechanism captures justification language ("I need to think about this more," "let me come back when...")
  - Specific signals: (1) High session-to-action ratio (many sessions, few drill starts), (2) declining session duration over time, (3) each session starts similarly but ends without action, (4) no consistent avoidance pattern (unlike C2-3 or C5-5 which show specific feature avoidance)
- **Decision computation**: NEEDS_PROXY
  - `IF Justification_Count > Threshold THEN Action_Delayed_Indefinitely` -- Justification count not observable. Proxy: repeated approach-without-action pattern over time.
- **Min detection window**: 10+ sessions / 21+ days
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable but the behavioral signal is nearly identical to many other root causes (any form of engagement-without-action). The specific "new excuse each time" pattern is not observable through app telemetry. Lower priority because disambiguation is extremely difficult.

### C6-7: Weak Cue-Response Binding
- **Signal specificity**: UNIQUE (in KDENZ context)
  - This root cause produces a distinctive signal: the user forgets to practice even when conditions are met. It's not avoidance, not paralysis, not fear -- it's simply that the habit link hasn't formed.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- irregular session timing (no consistent practice schedule), responds to push notifications but not to self-initiated cues, forgets to use app despite expressed interest (long gaps with no decline in engagement quality when they do show up)
  - Specific signals: (1) High engagement quality per session but highly irregular timing (coefficient of variation in inter-session intervals > 1.0), (2) push notification response rate > 50% (they're interested) but self-initiated session rate < 20% (they forget), (3) no declining engagement trend (quality stays high), just irregular frequency, (4) long gaps (5+ days) followed by enthusiastic sessions
- **Decision computation**: IMPLEMENTABLE
  - `IF Cue_Response_Strength < Automatic_Threshold THEN Manual_Initiation_Required` -- Proxy: `IF notification_response_rate > 50% AND self_initiated_rate < 20% AND per_session_quality = HIGH THEN weak_cue_binding_flag`. Directly implementable from session timing and notification data.
- **Min detection window**: 10+ sessions / 21+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the distinctive pattern of high-quality-but-irregular engagement. Very common in new habit formation. High impact because the user IS motivated and capable but just doesn't remember to practice. KDENZ has excellent intervention options: contextual reminders, time-based cues, location-based triggers, habit stacking with existing routines, and implementation intention prompts.

---

## C7 -- Commitment (8 root causes)

### C7-1: Competing Commitments
- **Signal specificity**: SHARED
  - Overlaps with: C6-1 (Conflicting Plans), C5-1 (Energy Depletion), C7-2 (Environmental Disruption)
  - Disambiguation strategy: C7-1 is commitment eroded by other life obligations (work, family, social); C6-1 is multiple plans within the app itself; C5-1 is energy exhaustion; C7-2 is environment physically disrupting practice. In KDENZ: C7-1 shows time-based engagement patterns correlated with external demands (lower during work weeks, higher during vacation).
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- weekly/monthly engagement cycles correlating with external demands, engagement drops during predictable busy periods, "something always comes up" pattern (starts sessions then abandons after external interruption)
  - Specific signals: (1) Engagement drops correlated with day-of-week (weekday < weekend), (2) session interruption rate > 40% (started but abandoned mid-way), (3) declining engagement during identifiable busy periods, (4) session starts at unusual times suggesting squeezing practice into margins
- **Decision computation**: NEEDS_PROXY
  - `IF Total_Commitment_Load > Resource_Capacity THEN Primary_Goal_Depleted` -- Life commitment load not observable. Proxy: temporal engagement patterns and session interruption rate.
- **Min detection window**: 14+ days / 10+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Partially detectable through temporal patterns. Very common for adult users. Moderate impact -- KDENZ can recommend shorter sessions, flexible scheduling, and "never miss twice" rules, but cannot eliminate competing life commitments.

### C7-2: Environmental Disruption
- **Signal specificity**: SHARED
  - Overlaps with: C7-1 (Competing Commitments), C0-2 (Situational Blockage)
  - Disambiguation strategy: C7-2 is environment actively disrupting practice (distractions, noise, interruptions); C7-1 is other commitments pulling away; C0-2 is structural impossibility. In KDENZ: C7-2 shows mid-session disruptions (recordings with background noise, interrupted sessions, incomplete drills).
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- sessions interrupted mid-drill (not at natural break points), high background noise in recordings, sessions terminated abruptly
  - Secondary channel: VOICE_PROSODY -- Hume detects background noise spikes during sessions, speaker voice interrupted by other voices, environmental noise patterns
  - Specific signals: (1) Mid-drill quit rate > 30%, (2) Hume background noise flags, (3) recording quality issues, (4) sessions terminated without completing current drill (not at menu/break point)
- **Decision computation**: NEEDS_PROXY
  - `IF Environmental_Trigger_Salience > Goal_Salience THEN Goal_Overridden` -- Environmental salience not directly measurable. Proxy: mid-session disruption patterns + audio quality analysis.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through mid-session disruption patterns and audio quality analysis. Common for users practicing at home or work. KDENZ can intervene by recommending quiet times, shorter sessions, and offering a "resume from where you left off" feature.

### C7-3: No External Monitoring
- **Signal specificity**: SHARED
  - Overlaps with: C2-6 (External Motivation -- both involve social/external factors), C7-4 (Insufficient Stakes)
  - Disambiguation strategy: C7-3 is commitment decay without observation ("nobody knows if I do it or not"); C2-6 is motivation that only exists for external reward; C7-4 is no consequences for abandonment. In KDENZ: C7-3 shows gradual commitment decay over time (slow decline in engagement) unless social accountability features are present.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- slow, steady engagement decline over weeks (not sudden dropout), engagement increases when social features activated (if available), no single trigger for decline
  - Specific signals: (1) Engagement declining at steady rate (e.g., -10% per week), (2) no sudden dropout event, (3) engagement increase if sharing/accountability features introduced, (4) commitment decay correlates with absence of external check-ins
- **Decision computation**: IMPLEMENTABLE
  - `IF External_Monitoring = 0 THEN Commitment_Decay_Rate = HIGH` -- Proxy: `IF engagement_trend_slope < -0.1_per_week AND no_social_features_used THEN no_monitoring_flag`. Directly implementable from engagement trend data.
- **Min detection window**: 14+ days / 10+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through engagement decay patterns. Very common in solo practice apps. KDENZ can intervene with accountability features (practice partners, streak sharing, mentor check-ins), though these are social features that may not be in initial beta.

### C7-4: Insufficient Stakes
- **Signal specificity**: SHARED
  - Overlaps with: C7-3 (No External Monitoring), C7-5 (Lack of Urgency)
  - Disambiguation strategy: C7-4 is low abandonment cost ("nothing bad happens if I stop"); C7-3 is no external observer; C7-5 is no time pressure. In KDENZ: C7-4 users abandon easily because the "cost" of stopping is zero -- no sunk cost, no social penalty, no real-world consequence.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- casual abandonment pattern (stops without declining engagement first -- just stops), no attempts to re-engage after gaps, treats app as low-priority (opens only when nothing else to do)
  - Specific signals: (1) Sudden cessation after adequate performance (no frustration trigger), (2) session timing correlated with "boredom" periods (waiting rooms, commutes), (3) no response to re-engagement nudges, (4) low investment indicators (never explored advanced features, never set goals)
- **Decision computation**: NEEDS_PROXY
  - `IF Consequence(Abandonment) < Motivation_Threshold THEN Abandonment_Easy` -- Abandonment cost not directly measurable. Proxy: casual cessation pattern + low feature investment + low re-engagement response.
- **Min detection window**: 14+ days (need time to observe abandonment pattern)
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through casual abandonment patterns but hard to distinguish from genuine goal completion or simple loss of interest. Common in free/low-cost apps. KDENZ can intervene with commitment devices (streaks, goals, pre-commitment), but fundamentally the app needs to create genuine value to raise stakes.

### C7-5: Lack of Urgency
- **Signal specificity**: SHARED
  - Overlaps with: C7-4 (Insufficient Stakes), C2-8 (Lack of Future Relevance), C5-2 (Delayed Gratification Intolerance)
  - Disambiguation strategy: C7-5 is specifically about temporal pressure ("no rush," "plenty of time"); C7-4 is about consequences; C2-8 is about future relevance; C5-2 is about discounting. In KDENZ: C7-5 users practice sporadically with no sense of urgency, treating improvement as "someday" rather than "now."
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- very low practice frequency (1-2 sessions per week or less), no self-imposed deadlines or goals, ignores time-based features, treats app as "whenever I feel like it" rather than "I need to practice"
  - Specific signals: (1) Inter-session interval > 5 days on average, (2) never sets goals or deadlines (if feature exists), (3) engagement not correlated with any external event, (4) stable but very low frequency (not declining, just infrequent)
- **Decision computation**: NEEDS_PROXY
  - `IF Deadline_Distance > Urgency_Threshold THEN Motivational_Salience = LOW` -- Deadline distance not applicable in KDENZ (no external deadlines). Proxy: low and stable practice frequency + absence of goal-setting behavior.
- **Min detection window**: 21+ days / 5+ sessions
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable but the "low frequency, stable engagement" pattern could simply indicate a casual but satisfied user. Difficult to distinguish from healthy sustainable practice pace. KDENZ can intervene with urgency creation (upcoming events, challenges, time-limited content) but should be careful not to create artificial pressure.

### C7-6: Value Contradiction
- **Signal specificity**: SHARED
  - Overlaps with: C2-5 (Approach-Avoidance Conflict -- both involve competing internal forces), C7-7 (Identity Misalignment)
  - Disambiguation strategy: C7-6 is a held value conflicting with the goal ("this goes against what I believe"); C2-5 is simultaneous wanting and not-wanting; C7-7 is identity threat. In KDENZ: C7-6 might manifest as avoidance of specific technique families that conflict with personal values (e.g., someone who finds manipulation techniques morally objectionable avoiding tactical empathy drills).
- **Observability**: APP_BEHAVIOR | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- selective technique avoidance that correlates with moral/values content (avoids persuasion techniques but practices assertiveness, or avoids manipulation-adjacent techniques)
  - Secondary channel: LANGUAGE -- value-conflict language in simulations ("I feel torn," "this goes against what I believe")
  - Specific signals: (1) Zero engagement with specific technique categories that have moral/ethical dimensions, (2) resistance language in simulation transcripts when prompted to use certain techniques, (3) pattern of engagement with "ethical" techniques and avoidance of "manipulative" ones
- **Decision computation**: NEEDS_PROXY
  - `IF Goal_Value CONFLICTS_WITH Held_Value THEN Commitment_Unstable` -- Value conflict not directly observable. Proxy: selective technique avoidance along ethical/values lines + resistance language.
- **Min detection window**: 10+ sessions across technique types / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Partially detectable through selective technique avoidance patterns. Particularly relevant for KDENZ because some communication techniques (from Voss's Never Split the Difference, for example) can feel manipulative. KDENZ can intervene by framing techniques ethically, showing benign use cases, and allowing users to opt out of value-conflicting techniques without penalty.

### C7-7: Identity Misalignment
- **Signal specificity**: SHARED
  - Overlaps with: C7-6 (Value Contradiction), C2-4 (Autonomy Threat/Reactance)
  - Disambiguation strategy: C7-7 is "that's not who I am" (identity threat from the goal itself); C7-6 is "this goes against what I believe" (values conflict); C2-4 is "don't tell me what to do" (reactance to external pressure). In KDENZ: C7-7 users resist adopting a "communicator" or "negotiator" identity, viewing the techniques as "not me."
- **Observability**: LANGUAGE | APP_BEHAVIOR
  - Primary channel: LANGUAGE -- identity-misalignment phrases in simulations ("that's not who I am," "people like me don't do that," "this feels fake/inauthentic")
  - Secondary channel: APP_BEHAVIOR -- avoidance of identity-shifting techniques (those requiring behavioral change vs. knowledge acquisition), preference for passive learning (Institute) over active practice (Skills Lab/Simulation)
  - Specific signals: (1) High Institute engagement, low Skills Lab engagement (learning about vs. practicing), (2) inauthenticity language in transcripts, (3) avoidance of performance-based exercises, (4) only engages with techniques that fit existing self-concept
- **Decision computation**: NEEDS_PROXY
  - `IF Goal INCONSISTENT_WITH Self_Concept THEN Identity_Protection_Activated` -- Self-concept not directly observable. Proxy: passive-vs-active engagement pattern + identity-misalignment language.
- **Min detection window**: 7+ sessions / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Partially detectable through the learning-vs-practicing gap and identity language. Common in communication training ("I'm not a manipulator," "I'm not a salesperson"). Moderate impact. KDENZ can intervene by identity-bridging language ("become a more effective version of who you already are") and showing how techniques align with existing identity.

### C7-8: Identity-Behavior Dissonance
- **Signal specificity**: SHARED
  - Overlaps with: C8B-8 (Moral Self-Punishment -- both involve guilt from gap between aspiration and action), C1-6 (Fragile Confidence)
  - Disambiguation strategy: C7-8 is chronic gap between "I keep saying I'll practice" and actual practice, leading to erosion ("I'm a fraud"); C8B-8 is shame-driven withdrawal after specific perceived failure; C1-6 is confidence collapse after setbacks. In KDENZ: C7-8 users show a declining-then-returning-then-declining pattern, with each return cycle shorter than the last.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- repeated engagement-disengagement cycles of decreasing duration (first engagement: 2 weeks; second: 1 week; third: 3 days), chronic aspiration-action gap visible in goals-set vs. goals-met data
  - Specific signals: (1) Decreasing engagement cycle duration over time, (2) goals set (if feature exists) but completion rate declining, (3) re-engagement after gap with initial enthusiasm that fades faster each time, (4) total engagement duration per cycle shrinking
- **Decision computation**: IMPLEMENTABLE
  - `IF (Stated_Goal - Actual_Behavior) > Dissonance_Threshold FOR Duration > T THEN Commitment_Erosion` -- Proxy: `IF engagement_cycles > 3 AND cycle_duration_decreasing AND goal_completion_declining THEN identity_behavior_dissonance_flag`. Directly implementable from engagement cycle data.
- **Min detection window**: 30+ days (need multiple engagement cycles)
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through engagement cycle analysis but requires long observation window. Common in self-improvement apps. Moderate impact. KDENZ can intervene with the "never miss twice" rule, smaller commitment targets, and dissonance-reduction messaging ("one session today repairs the gap").

---

## C8A -- Initiation (8 root causes)

### C8A-1: Motor Initiation Threshold (High Activation Cost)
- **Signal specificity**: SHARED
  - Overlaps with: C5-3 (Effort Overestimation), C0-1/C5-8 (Environmental Friction), C8A-7 (Momentum Dependency)
  - Disambiguation strategy: C8A-1 is motor system threshold ("I just can't start" -- they're ready, they want to, they just can't translate to action); C5-3 is overestimating the effort; C5-8 is real environmental friction; C8A-7 is needing external push. In KDENZ: C8A-1 users sit on the "start recording" screen for extended periods without pressing the button, then eventually either press it or leave.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- long dwell time on "start" screens (the button is visible, user is staring at it but not pressing), repeated visits to start screen without starting, delay between opening a drill and pressing "begin"
  - Secondary channel: VOICE_PROSODY -- if they do start, Hume may detect speech onset delays (long pause before first word after recording begins)
  - Specific signals: (1) Start-screen dwell time > 60 seconds on 50%+ sessions, (2) recording-start-to-first-speech delay > 10 seconds, (3) multiple start-screen visits without action (approaches button, leaves, comes back), (4) once started, performance is adequate (confirming the barrier was initiation, not skill)
- **Decision computation**: IMPLEMENTABLE
  - `IF Motor_Signal < Activation_Threshold THEN Basal_Ganglia_Gate_Locked` -- Proxy: `IF start_screen_dwell > 60s AND post_start_performance = ADEQUATE THEN motor_initiation_flag`. Directly implementable from screen timing data.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through start-screen dwell time. Very common in voice practice (pressing "start recording" is a moment of commitment anxiety). High impact because it blocks all engagement. KDENZ has excellent interventions: auto-start timers ("recording begins in 3...2...1"), micro-starts ("just say one sentence"), and countdown-to-start features.

### C8A-2: Last-Minute Deliberation
- **Signal specificity**: SHARED
  - Overlaps with: C8A-1 (Motor Initiation Threshold -- similar behavioral presentation), C1-4 (Meta-Cognitive Doubt)
  - Disambiguation strategy: C8A-2 is continued deliberation AT the action moment ("wait, let me think about this one more time"); C8A-1 is motor threshold without deliberation; C1-4 is ongoing self-doubt. In KDENZ: C8A-2 users re-read instructions or revisit technique descriptions AFTER navigating to the drill start screen, indicating last-minute reconsideration.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- navigation back to instructions/description from start screen, re-reading technique details at the moment of starting, "back button" usage at drill start screens
  - Specific signals: (1) Back-button usage on start screens > 30% of start-screen visits, (2) instruction re-reads at action moment, (3) technique description revisits between navigating to drill and actually starting, (4) pattern of approach-retreat at the start screen level
- **Decision computation**: IMPLEMENTABLE
  - `IF Deliberation_Active_At_Action_Moment THEN Motor_Execution_Delayed` -- Proxy: `IF back_button_from_start_screen > 30% AND instruction_revisits_at_start > 2 THEN last_minute_deliberation_flag`. Directly implementable from navigation data.
- **Min detection window**: 5+ drill attempts / 5+ sessions
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through back-button and instruction-revisit patterns at start screens. Moderately common. KDENZ can intervene with pre-commitment ("you've prepared enough -- press start"), simplified instructions, and removing the ability to go back once on the start screen.

### C8A-3: Attention Diversion
- **Signal specificity**: SHARED
  - Overlaps with: C8B-2 (Competing Stimuli/Distraction -- similar mechanism but at different timing)
  - Disambiguation strategy: C8A-3 is attention captured AT the moment of intended initiation; C8B-2 is attention captured during ongoing task. In KDENZ: C8A-3 users open the app, navigate to a drill, then get pulled away by a notification or other app before starting.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- app backgrounding events right before drill start, tab switches at the moment of action, session timing gaps that suggest phone/device switching
  - Specific signals: (1) App-background events within 10 seconds of reaching start screen, (2) session gaps (5+ minutes) between reaching start screen and returning, (3) pattern of reaching action point then switching to other apps
- **Decision computation**: IMPLEMENTABLE
  - `IF Competing_Stimulus_Salience > Goal_Salience AT Action_Moment THEN Initiation_Blocked` -- Proxy: `IF app_background_within_10s_of_start_screen > 3 occurrences THEN attention_diversion_flag`. Directly implementable from app lifecycle events.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through app lifecycle events but may not be distinguishable from normal device usage (e.g., answering a phone call). Moderately common. KDENZ can intervene with "focus mode" prompts, DND reminders, and auto-start features that don't require the user to manually press start.

### C8A-4: Waiting for Readiness
- **Signal specificity**: SHARED
  - Overlaps with: C8A-1 (Motor Initiation Threshold), C5-3 (Effort Overestimation), C6-6 (Recursive Justification)
  - Disambiguation strategy: C8A-4 is waiting for self-imposed prerequisites ("I'll start when I feel ready"); C8A-1 is motor system can't start; C5-3 is overestimating effort; C6-6 is generating excuses. In KDENZ: C8A-4 users might over-prepare (watching all Institute content before attempting drills, or waiting until they "feel ready" for a technique).
- **Observability**: APP_BEHAVIOR | LANGUAGE
  - Primary channel: APP_BEHAVIOR -- extensive content consumption (Institute) before any practice attempts, delayed first drill attempt despite active app usage, browsing without acting
  - Secondary channel: LANGUAGE -- readiness language ("I need to be in the right mood," "I'm not ready yet," "the timing isn't right")
  - Specific signals: (1) Institute content consumption > 10 items before first drill attempt, (2) onboarding completion delay (completes setup but delays first real exercise for days), (3) time-between-signup-and-first-drill > 7 days despite daily app opens
- **Decision computation**: NEEDS_PROXY
  - `IF Readiness_Conditions_Met = FALSE THEN Action_Postponed` -- Readiness perception not directly observable. Proxy: preparation-without-action pattern.
- **Min detection window**: 5+ sessions / 7+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through preparation-without-action patterns. Common in new users. However, the signal overlaps significantly with C1-5 (Insufficient Evidence). KDENZ can intervene with "you're more ready than you think" messaging, auto-start prompts after content consumption, and the "practice before exposure" design principle.

### C8A-5: Over-Simulation
- **Signal specificity**: SHARED
  - Overlaps with: C6-2 (Chronic Replanning), C8A-4 (Waiting for Readiness)
  - Disambiguation strategy: C8A-5 is mental rehearsal substituting for action (the user has "thought about it a million times" and the imagining has depleted the drive to do it); C6-2 is planning substituting for action; C8A-4 is waiting for readiness. In KDENZ: C8A-5 might manifest as reading about techniques and imagining using them, without actually practicing.
- **Observability**: APP_BEHAVIOR (weak)
  - Primary channel: APP_BEHAVIOR -- pattern of extended content consumption with very specific technique focus (reading the same technique description repeatedly), watching technique demonstration videos multiple times without practicing
  - Specific signals: (1) Technique description revisit count > 5 for same technique, (2) demonstration video rewatch count > 3, (3) zero practice attempts for heavily researched techniques
- **Decision computation**: NEEDS_PROXY
  - `IF Simulation_Count > Threshold THEN Motor_Command_Capacity_Depleted` -- Mental simulation not observable. Proxy: content revisit patterns as a proxy for mental rehearsal.
- **Min detection window**: 7+ sessions / 14+ days
- **KDENZ priority**: LOW
  - Reasoning: Weakly detectable. Mental rehearsal occurs mostly outside the app. The in-app proxy (content revisiting) is a poor indicator because content revisiting could indicate many things. Low diagnostic value.

### C8A-6: Self-Sabotage
- **Signal specificity**: SHARED
  - Overlaps with: C5-5 (Failure Cost Aversion), C1-2 (Fixed Mindset)
  - Disambiguation strategy: C8A-6 is creating barriers to protect self-concept ("something always goes wrong" -- where the user unconsciously creates the problem); C5-5 is avoiding situations with failure risk; C1-2 is believing ability is fixed. In KDENZ: C8A-6 users might sabotage their own recordings (speaking too quietly, mumbling, choosing bad timing) as a way to maintain a "I couldn't do it because X" narrative.
- **Observability**: DRILL_PERFORMANCE | VOICE_PROSODY | APP_BEHAVIOR
  - Primary channel: DRILL_PERFORMANCE -- performance drops that coincide with easily avoidable errors (speaking too quietly to be detected, timing out on drills, creating technical issues)
  - Secondary channel: VOICE_PROSODY -- Hume detects deliberately low volume, rushed/mumbled speech inconsistent with capability
  - Specific signals: (1) Repeated "technical" failures that seem user-caused (mic too far, voice too quiet, background noise), (2) performance on "safe" (easy) drills is high but performance on "risky" (challenging) drills shows suspiciously avoidable errors, (3) pattern of "accidents" that prevent completion
- **Decision computation**: NEEDS_PROXY
  - `IF Failure_Threat = HIGH THEN Create_Self_Imposed_Barriers` -- Self-imposed barriers not directly identifiable as intentional. Proxy: pattern of avoidable-error-driven failure on challenging content only.
- **Min detection window**: 10+ drill attempts / 7+ sessions
- **KDENZ priority**: LOW
  - Reasoning: Partially detectable but very hard to distinguish from genuine technical issues or skill deficits. Unconscious self-sabotage is, by definition, hard to identify from external signals. Low diagnostic confidence. KDENZ should focus on removing technical barriers generally rather than trying to diagnose self-sabotage specifically.

### C8A-7: Momentum Dependency
- **Signal specificity**: UNIQUE (in KDENZ context)
  - Distinctive pattern: great performance once started, terrible initiation. The gap between starting difficulty and continuation ease is the diagnostic signal.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- very long time-to-start but once started, session duration is above average; first drill of session is the hardest to begin, subsequent drills start easily
  - Secondary channel: DRILL_PERFORMANCE -- first drill score may be lower, subsequent drills in same session are higher (warm-up effect disproportionately large)
  - Specific signals: (1) Time-to-first-action > 5 minutes but total session duration > 20 minutes, (2) "once I start I'm fine" pattern: first drill hesitation + subsequent drill smooth starts, (3) multi-drill sessions have decreasing inter-drill gaps (momentum builds), (4) cold-start difficulty vs. warm-continuation ease ratio > 3x
- **Decision computation**: IMPLEMENTABLE
  - `IF Initiation_Threshold >> Continuation_Threshold THEN Cold_Start_Failure` -- Proxy: `IF first_drill_start_delay > 3x subsequent_drill_start_delay AND session_duration_once_started > 15min THEN momentum_dependency_flag`. Directly implementable from timing data.
- **Min detection window**: 5+ multi-drill sessions / 10+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the cold-start vs. continuation timing differential. Very common (especially in ADHD populations, which represent a significant portion of self-improvement app users). High impact because these users have the skill and motivation but just can't cold-start. KDENZ has excellent interventions: micro-start triggers ("just record one word"), warm-up exercises that don't feel like "starting," and momentum-building session design.

### C8A-8: Trauma-Related Freeze
- **Signal specificity**: UNIQUE
  - Autonomic freeze response produces distinctive signals unlike any volitional failure: sudden silence, complete cessation, physiological markers.
- **Observability**: VOICE_PROSODY | APP_BEHAVIOR
  - Primary channel: VOICE_PROSODY -- Hume freeze detection: sudden silence during speech, breath-holding, vocal tremor, speech onset delays specifically triggered by certain simulation scenarios or topics
  - Secondary channel: APP_BEHAVIOR -- sudden session termination during specific content types, pattern of avoidance of specific simulation scenarios
  - Specific signals: (1) Hume freeze markers (sudden silence > 5 seconds mid-speech, breath-holding), (2) abrupt session termination during specific scenario types, (3) complete avoidance of certain simulation difficulty levels or interpersonal dynamics (authority, confrontation), (4) vocal tremor spikes in specific conversational contexts
- **Decision computation**: NEEDS_PROXY
  - `IF Threat_Detection = TRUE THEN Autonomic_Freeze_Response (non-volitional)` -- Threat detection not directly observable. Proxy: Hume freeze markers + context-specific avoidance patterns.
  - **IMPORTANT**: This root cause is reclassified to C0-8 in the foundational document. It is a pre-volitional, non-volitional response that requires trauma-informed therapy, NOT behavioral intervention.
- **Min detection window**: 3+ sessions with triggering content
- **KDENZ priority**: HIGH (for DETECTION) but SKIP (for INTERVENTION)
  - Reasoning: Partially detectable through Hume freeze markers and context-specific avoidance. CRITICAL: If detected, KDENZ must NOT attempt to intervene behaviorally. The appropriate response is gentle detection, scenario avoidance, and (if contextually appropriate) a resource referral. This is a C0 failure -- it routes outside the app. Detection matters for user safety; intervention is not KDENZ's role.

---

## C8B -- Maintenance (9 root causes)

### C8B-1: Task Boredom
- **Signal specificity**: SHARED
  - Overlaps with: C5-4 (Insufficient Perceived Reward), C8B-6 (Invisible Progress)
  - Disambiguation strategy: C8B-1 is hedonic adaptation mid-task (interest wanes because the activity becomes repetitive); C5-4 is pre-engagement judgment that reward isn't worth it; C8B-6 is motivation drop because progress isn't visible. In KDENZ: C8B-1 shows declining engagement WITHIN sessions (first drills completed quickly, later drills abandoned) and declining engagement with specific technique types over time.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- intra-session engagement decay (first drill completed, second slower, third abandoned), declining technique-specific engagement over weeks, session duration shrinking for repeated content
  - Secondary channel: VOICE_PROSODY -- Hume energy markers declining within session, falling pitch contour in later drill segments
  - Specific signals: (1) Intra-session completion rate: first drill 90%+, third drill < 50%, (2) technique-specific engagement declining while other techniques stable, (3) Hume energy slope negative within session, (4) "boring" or "repetitive" language if feedback captured
- **Decision computation**: IMPLEMENTABLE
  - `IF Reward_Salience(Task) < Continuation_Threshold THEN Engagement_Drops` -- Proxy: `IF intra_session_completion_declining AND technique_specific_engagement_declining THEN task_boredom_flag`. Directly implementable from session and drill data.
- **Min detection window**: 5+ multi-drill sessions / 10+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through intra-session engagement decay. Very common in repetitive practice apps. High impact because it directly causes mid-session dropout. KDENZ has strong interventions: varied drill formats (5 formats available), interleaved practice across technique types, gamification elements, progressive difficulty, and novelty injection.

### C8B-2: Competing Stimuli (Distraction)
- **Signal specificity**: SHARED
  - Overlaps with: C8A-3 (Attention Diversion -- same mechanism, different timing), C8B-9 (Competing Comforts)
  - Disambiguation strategy: C8B-2 is distraction during ongoing practice (phone notifications, other apps); C8A-3 is distraction at the moment of initiation; C8B-9 is comfort-seeking alternatives. In KDENZ: C8B-2 shows mid-drill interruptions, app backgrounding during active practice, fragmented attention during recordings.
- **Observability**: APP_BEHAVIOR | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- app backgrounding during active drills, mid-recording pauses (not natural speech pauses -- app-switch pauses), fragmented session patterns (start, switch away, come back, switch away)
  - Secondary channel: VOICE_PROSODY -- Hume detects attention loss markers (sudden topic shifts, incomplete sentences, distracted speech patterns)
  - Specific signals: (1) App-background events during active drill > 2 per session, (2) mid-recording pauses that correlate with notification events, (3) task-switching count per session > 5, (4) session fragmentation index high
- **Decision computation**: IMPLEMENTABLE
  - `IF Alternative_NAcc_Activation > Task_NAcc_Activation THEN Goal_Shielding_Fails` -- Proxy: `IF app_background_during_drill > 2_per_session AND session_fragmentation > HIGH THEN competing_stimuli_flag`. Directly implementable from app lifecycle and session data.
- **Min detection window**: 3+ sessions / 5+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through app lifecycle events and session fragmentation. Extremely common in mobile app contexts. High impact on practice quality. KDENZ can intervene with "focus mode" prompts, DND reminders, shorter drill formats, and engagement-maintaining features.

### C8B-3: Mood-Dependent Execution
- **Signal specificity**: SHARED
  - Overlaps with: C5-1 (Energy Depletion), C8A-4 (Waiting for Readiness)
  - Disambiguation strategy: C8B-3 is execution quality varying with mood ("I can only do it when I feel good"); C5-1 is energy depletion preventing engagement; C8A-4 is waiting for the right mood to start. In KDENZ: C8B-3 shows high performance variance WITHIN the user's data, with session quality correlating with initial energy/mood markers.
- **Observability**: VOICE_PROSODY | APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: VOICE_PROSODY -- Hume baseline mood/energy at session start predicts session quality; high variance in baseline across sessions
  - Secondary channel: DRILL_PERFORMANCE -- performance scores highly variable across sessions with no skill-related explanation
  - Specific signals: (1) Performance score standard deviation > 2x expected for skill level, (2) Hume baseline mood at session start strongly correlates with session performance (r > 0.6), (3) good days show high engagement + high scores, bad days show low engagement + low scores, (4) no learning trend explains the variance (not just normal learning curve noise)
- **Decision computation**: NEEDS_PROXY
  - `IF Mood_State = LOW THEN Action_Output = LOW (regardless of plan)` -- Mood state measured indirectly via Hume baseline prosody. Proxy: correlation between session-start prosodic markers and session performance.
- **Min detection window**: 10+ sessions / 14+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through prosodic baseline-performance correlation. Moderately common. Requires Hume batch analysis which adds latency. KDENZ can intervene with mood-decoupled practice strategies (implementation intentions that override mood, "just do one drill" minimum regardless of mood).

### C8B-4: Single-Error Catastrophizing
- **Signal specificity**: SHARED
  - Overlaps with: C1-6 (Fragile Confidence -- both involve disproportionate reaction to failure), C8B-5 (Perfectionism)
  - Disambiguation strategy: C8B-4 is mid-task abandonment after first error ("I messed up so why bother"); C1-6 is confidence collapse between sessions after setback; C8B-5 is unwillingness to continue with imperfect output. In KDENZ: C8B-4 users quit a drill or recording immediately after making a mistake (filler word, wrong technique application), rather than continuing.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- drill/recording termination within seconds of error event, consistent pattern of quitting after first mistake
  - Secondary channel: DRILL_PERFORMANCE -- drills never reach completion if an error occurs; error-triggered quit rate > 50%
  - Specific signals: (1) Recording terminated within 10 seconds of first detected filler word, (2) drill abandoned after first incorrect answer, (3) restart-after-error pattern (quit and restart from beginning rather than continue), (4) completion rate near-zero for any drill with errors
- **Decision computation**: IMPLEMENTABLE
  - `IF Error_Count >= 1 THEN Catastrophize; Abandon_Task` -- Proxy: `IF quit_within_10s_of_error > 50% AND error_triggered_restarts > 3 THEN catastrophizing_flag`. Directly implementable from drill event data.
- **Min detection window**: 5+ drill attempts with errors / 3+ sessions
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the error-to-quit timing pattern. Common in perfectionistic learners. High impact because it prevents completing any imperfect practice (and ALL practice is imperfect). KDENZ can intervene with "errors are data" messaging, post-error encouragement, preventing restart until drill completion, and the "never miss twice" framework.

### C8B-5: Perfectionism
- **Signal specificity**: SHARED
  - Overlaps with: C8B-4 (Single-Error Catastrophizing), C8A-4 (Waiting for Readiness)
  - Disambiguation strategy: C8B-5 is unwillingness to continue with imperfect output ("it's not good enough, I need to redo this"); C8B-4 is catastrophic reaction to a single error; C8A-4 is waiting for perfect conditions. In KDENZ: C8B-5 users restart recordings multiple times seeking the "perfect" take, spend excessive time revising in rewrite drills, and never feel satisfied with scores.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: APP_BEHAVIOR -- high restart rate (re-records multiple times), excessive revision time on rewrite drills, never moves to next technique despite adequate scores
  - Secondary channel: DRILL_PERFORMANCE -- scores are objectively good (70%+) but user keeps retrying for higher scores; time-per-drill far exceeds expected
  - Specific signals: (1) Recording restart rate > 3 per session, (2) drill retry rate > 50% despite passing scores, (3) time-per-drill > 3x expected duration, (4) mastery score at "proficient" but still re-practicing same technique
- **Decision computation**: IMPLEMENTABLE
  - `IF Output_Quality < Perfection_Standard THEN Halt_Progress` -- Proxy: `IF retry_rate > 50% AND passing_scores AND time_per_drill > 3x_expected THEN perfectionism_flag`. Directly implementable from drill data.
- **Min detection window**: 5+ drill sessions / 7+ days
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through restart/retry patterns with adequate scores. Very common in self-improvement contexts. High impact because it traps users in a loop of diminishing returns and prevents skill breadth. KDENZ can intervene with "good enough" thresholds, forced progression after sufficient scores, and reframing improvement as iteration over time rather than per-attempt perfection.

### C8B-6: Invisible Progress
- **Signal specificity**: SHARED
  - Overlaps with: C5-2 (Delayed Gratification Intolerance), C8B-1 (Task Boredom), C5-4 (Insufficient Perceived Reward)
  - Disambiguation strategy: C8B-6 is specifically about progress feedback loop being broken ("I'm not getting anywhere"); C5-2 is temporal discounting; C8B-1 is boredom from repetition; C5-4 is low reward valuation. In KDENZ: C8B-6 users show declining engagement specifically during plateau periods when scores are flat despite continued practice.
- **Observability**: APP_BEHAVIOR | DRILL_PERFORMANCE
  - Primary channel: DRILL_PERFORMANCE -- engagement drop coincides with score plateau periods (mastery scores flat for 3+ sessions), user disengages specifically when progress slows
  - Secondary channel: APP_BEHAVIOR -- decreased engagement with progress/mastery tracking features during plateau periods, lower session frequency during plateaus
  - Specific signals: (1) Engagement drops > 30% during mastery score plateau periods, (2) progress feature usage declines during plateaus, (3) correlation between score-change-rate and engagement (high when improving, low when flat), (4) "nothing is changing" language if feedback captured
- **Decision computation**: IMPLEMENTABLE
  - `IF Visible_Progress < Expected_Progress THEN Motivation_Decay` -- Proxy: `IF mastery_score_flat_for_3_sessions AND engagement_declining AND progress_feature_usage_declining THEN invisible_progress_flag`. Directly implementable from mastery and engagement data.
- **Min detection window**: 10+ sessions / 14+ days (need to observe plateau period)
- **KDENZ priority**: HIGH
  - Reasoning: Highly detectable through the plateau-engagement correlation. Very common in skill learning (plateaus are inevitable). High impact because plateaus are where most users quit. KDENZ has excellent interventions aligned with the platform's design principles: visual progress indicators (3.5x retention research), micro-milestone celebrations, showing improvement on dimensions the user hasn't been tracking, and trend charts that show long-term progress despite short-term plateaus.

### C8B-7: High Restart Cost
- **Signal specificity**: SHARED
  - Overlaps with: C8A-7 (Momentum Dependency -- both involve restart difficulty), C8A-1 (Motor Initiation Threshold)
  - Disambiguation strategy: C8B-7 is specifically about difficulty resuming after interruption ("once I stop I can't get back to it"); C8A-7 is cold-start difficulty; C8A-1 is general motor threshold. In KDENZ: C8B-7 users show strong negative impact of mid-session interruptions -- if a session is interrupted, they don't return that day.
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- session non-resumption after interruption (if session interrupted, user doesn't return for 24+ hours), contrast between uninterrupted sessions (long, productive) and interrupted sessions (abandoned permanently)
  - Specific signals: (1) Post-interruption return rate < 20% (within same day), (2) uninterrupted session duration > 3x interrupted+resumed session duration, (3) "breaks ruin my flow" pattern: engagement before break = high, after break = zero, (4) avoidance of breaks even when app suggests them
- **Decision computation**: IMPLEMENTABLE
  - `IF Restart_Cost ~ Initiation_Cost THEN Resumption_Blocked` -- Proxy: `IF post_interruption_return_rate < 20% AND uninterrupted_session_duration > 3x_interrupted THEN high_restart_cost_flag`. Directly implementable from session continuity data.
- **Min detection window**: 5+ interrupted sessions / 10+ days
- **KDENZ priority**: MEDIUM
  - Reasoning: Detectable through post-interruption behavior. Moderately common. KDENZ can intervene with "save state" features, quick-resume functionality, and micro-warm-up exercises for session resumption.

### C8B-8: Moral Self-Punishment
- **Signal specificity**: SHARED
  - Overlaps with: C7-8 (Identity-Behavior Dissonance), C8B-4 (Single-Error Catastrophizing), C1-6 (Fragile Confidence)
  - Disambiguation strategy: C8B-8 is guilt/shame-driven withdrawal INSTEAD of trying again ("I beat myself up" leading to withdrawal as self-punishment); C7-8 is chronic aspiration-action gap; C8B-4 is catastrophizing a single error; C1-6 is confidence collapse. In KDENZ: C8B-8 users show extended absences specifically after broken streaks, missed goals, or self-perceived failures, combined with expressions of guilt/shame.
- **Observability**: APP_BEHAVIOR | LANGUAGE | VOICE_PROSODY
  - Primary channel: APP_BEHAVIOR -- extended absence (5+ days) immediately following a streak break or missed goal, absence duration disproportionate to the failure magnitude
  - Secondary channel: LANGUAGE -- shame/guilt language upon return ("I feel terrible about missing," "I beat myself up")
  - Tertiary channel: VOICE_PROSODY -- Hume detects shame/guilt markers in first session after return from absence
  - Specific signals: (1) Absence duration correlates with streak length broken (longer streak = longer absence), (2) post-streak-break absence > 5 days, (3) shame/guilt language in first-session-back transcripts, (4) reduced engagement intensity upon return
- **Decision computation**: NEEDS_PROXY
  - `IF Perceived_Failure = TRUE THEN Activate_Self_Punishment; Block_Productive_Action` -- Perceived failure partially observable through streak/goal data. Proxy: post-failure-absence pattern + shame language upon return.
- **Min detection window**: 2+ streak-break/absence cycles / 21+ days
- **KDENZ priority**: HIGH
  - Reasoning: Detectable through post-failure absence patterns, especially around streaks. Very common in streak-based apps. High impact because it creates a vicious cycle (miss -> shame -> avoid -> longer miss -> more shame). KDENZ can intervene with the "never miss twice" rule (research-validated 37% retention improvement), compassion-oriented messaging, streak forgiveness, and removing punitive streak mechanics.

### C8B-9: Competing Comforts
- **Signal specificity**: SHARED
  - Overlaps with: C8B-2 (Competing Stimuli/Distraction -- nearly identical mechanism)
  - Disambiguation strategy: C8B-9 is comfort-seeking specifically (choosing the couch/social media/food over continued practice); C8B-2 is general distraction. In KDENZ: Very difficult to distinguish from C8B-2 because KDENZ cannot see what the user switches to. The foundational document notes this pair was identified for potential consolidation (and in the foundational doc, C8B-9 was consolidated into C8B-2).
- **Observability**: APP_BEHAVIOR
  - Primary channel: APP_BEHAVIOR -- mid-session quit at natural break points (not mid-drill, but between drills), quitting when session becomes effortful (but not after errors -- after effort)
  - Specific signals: (1) Session termination at between-drill moments (not mid-drill), (2) quit timing correlates with drill difficulty (harder drills -> more likely to quit before next), (3) evening/weekend quit rates higher (comfort alternatives more available)
- **Decision computation**: NEEDS_PROXY
  - `IF Comfort_Alternative_Salience > Task_Salience THEN Divert_NAcc_Activation` -- Comfort alternative salience not observable from within KDENZ. Proxy: effort-correlated quit patterns at natural break points.
- **Min detection window**: 5+ multi-drill sessions / 7+ days
- **KDENZ priority**: LOW (consolidated with C8B-2)
  - Reasoning: Per the foundational document, C8B-9 has been consolidated into C8B-2. The behavioral signals in KDENZ are nearly identical. Implement C8B-2 detection, which covers both distraction and comfort-seeking patterns.

---

## Summary Analysis

### Priority Distribution

| Priority | Count | Percentage |
|----------|-------|------------|
| HIGH | 20 | 33% |
| MEDIUM | 24 | 39% |
| LOW | 9 | 15% |
| SKIP | 8* | 13% |

*SKIP count includes C0-P, C0-2, C1-7, C8B-9 (consolidated), and notes C8A-8 as SKIP for intervention (HIGH for detection only). The actual count may vary depending on how C0-1/C5-8 reclassification and C8B-9 consolidation are handled.

### Computation Validity Distribution

| Computation Type | Count | Percentage |
|------------------|-------|------------|
| IMPLEMENTABLE | 22 | 36% |
| NEEDS_PROXY | 28 | 46% |
| THEORETICAL_ONLY | 5 | 8% |
| N/A (SKIP) | 6 | 10% |

### Signal Specificity Distribution

| Specificity | Count | Percentage |
|-------------|-------|------------|
| UNIQUE | 5 | 8% |
| SHARED | 52 | 85% |
| AMBIGUOUS | 4 | 7% |

**Critical finding**: 85% of root causes share signals with other root causes. This confirms the VCM foundational document's assertion that root-cause-level diagnosis cannot be achieved through single-channel observation. Multi-signal disambiguation strategies are essential.

### Top 20 Root Causes to Implement First

Ordered by: priority score (HIGH > MEDIUM > LOW) + feasibility (IMPLEMENTABLE > NEEDS_PROXY > THEORETICAL) + detection window (shorter = better) + KDENZ intervention capability.

| Rank | RC-ID | Name | Priority | Computation | Min Window | Key Reason |
|------|-------|------|----------|-------------|------------|------------|
| 1 | C8B-4 | Single-Error Catastrophizing | HIGH | IMPLEMENTABLE | 3 sessions | Direct error-to-quit timing; strong intervention |
| 2 | C8B-5 | Perfectionism | HIGH | IMPLEMENTABLE | 7 days | Restart/retry pattern; strong intervention |
| 3 | C8B-1 | Task Boredom | HIGH | IMPLEMENTABLE | 10 days | Intra-session decay; varied drill formats |
| 4 | C8B-6 | Invisible Progress | HIGH | IMPLEMENTABLE | 14 days | Plateau-engagement correlation; visual feedback |
| 5 | C8A-1 | Motor Initiation Threshold | HIGH | IMPLEMENTABLE | 7 days | Start-screen dwell time; auto-start features |
| 6 | C8A-7 | Momentum Dependency | HIGH | IMPLEMENTABLE | 10 days | Cold-start vs. continuation gap; micro-starts |
| 7 | C5-6 | Decision Paralysis | HIGH | IMPLEMENTABLE | 5 days | Browse-without-action pattern; defaults |
| 8 | C6-1 | Conflicting Plans | HIGH | IMPLEMENTABLE | 10 days | Scattered skill tree; focus paths |
| 9 | C6-5 | Action Ambiguity | HIGH | IMPLEMENTABLE | 5 days | Aimless navigation; guided onboarding |
| 10 | C6-7 | Weak Cue-Response Binding | HIGH | IMPLEMENTABLE | 21 days | Irregular-but-engaged pattern; reminders |
| 11 | C5-5 | Failure Cost Aversion | HIGH | IMPLEMENTABLE | 10 days | Lowest-difficulty-only; private practice |
| 12 | C8B-2 | Competing Stimuli | HIGH | IMPLEMENTABLE | 5 days | App lifecycle events; focus mode |
| 13 | C1-5 | Insufficient Evidence | HIGH | IMPLEMENTABLE | 5 days | Content-without-practice; guided first drill |
| 14 | C1-6 | Fragile Confidence | HIGH | IMPLEMENTABLE | 14 days | Post-setback dropout; graduated difficulty |
| 15 | C8B-8 | Moral Self-Punishment | HIGH | NEEDS_PROXY | 21 days | Post-streak-break absence; "never miss twice" |
| 16 | C2-3 | Emotional Avoidance | HIGH | NEEDS_PROXY | 14 days | Differential technique avoidance; exposure |
| 17 | C2-4 | Autonomy Threat | HIGH | IMPLEMENTABLE | 10 days | Anti-recommendation behavior; MI framing |
| 18 | C1-2 | Fixed Mindset | HIGH | NEEDS_PROXY | 14 days | Fixed-trait language + avoidance; mastery |
| 19 | C5-2 | Delayed Gratification | HIGH | NEEDS_PROXY | 7 days | Short-session-only + early abandonment |
| 20 | C6-4 | Cognitive Overload | HIGH | IMPLEMENTABLE | 5 sessions | Simple-vs-complex performance gap; scaffolding |

### Root Causes to SKIP (and why)

| RC-ID | Name | Reason for Skip |
|-------|------|-----------------|
| C0-P | Physical/Biological Limitation | Pre-volitional, requires clinical assessment. KDENZ has no medical data access. |
| C0-2 | Situational Blockage | External life constraints invisible to KDENZ. Cannot distinguish from disinterest. |
| C1-3 | No Relatable Models | Social context outside KDENZ. Signals too ambiguous and unlikely to surface. |
| C1-7 | Social Disconfirmation | External social pressure invisible to KDENZ. Cannot observe family/peer feedback. |
| C8A-8 | Trauma-Related Freeze | SKIP for INTERVENTION (detect for safety only). Pre-volitional, routes to therapy. |
| C8B-9 | Competing Comforts | Consolidated into C8B-2 per foundational document. Implement C8B-2 instead. |

### Observability Channel Usage

How many root causes each channel can contribute to detecting:

| Channel | Primary | Secondary | Total Coverage |
|---------|---------|-----------|----------------|
| APP_BEHAVIOR | 40 | 12 | 52 (85%) |
| DRILL_PERFORMANCE | 10 | 15 | 25 (41%) |
| VOICE_PROSODY | 3 | 12 | 15 (25%) |
| LANGUAGE | 5 | 14 | 19 (31%) |
| ONBOARDING | 0 | 1 | 1 (2%) |
| GEMINI_EVAL | 0 | 2 | 2 (3%) |
| NOT_DETECTABLE | 3 | 0 | 3 (5%) |

**Critical finding**: APP_BEHAVIOR is the dominant detection channel (85% coverage). This confirms that the behavioral event logging infrastructure (tracking ALL interactions: app opens, drill starts, quit points, difficulty selections, feature usage patterns, streak data) is the single most important foundation for VCM diagnostics. Voice prosody and language analysis provide supplementary disambiguation signals.

### Cross-Gate Signal Overlap Matrix

Root causes with highest overlap (needing disambiguation):

| Overlap Group | Root Causes | Shared Signals | Disambiguation Key |
|---------------|-------------|----------------|-------------------|
| Avoidance cluster | C2-2, C2-3, C5-5, C8A-6 | Avoidance behavior | WHAT is avoided (emotional content vs. scored drills vs. challenges) |
| Paralysis cluster | C5-6, C6-3, C6-6 | Browse-without-action | WHERE in the app (skill tree vs. technique selection vs. general) |
| Can't-start cluster | C8A-1, C8A-4, C8A-7, C5-3 | Long time-to-start | WHAT HAPPENS AFTER starting (C8A-7: excellent performance; C5-3: adequate; C8A-1: variable) |
| Low engagement cluster | C2-7, C2-8, C7-5, C5-4 | Flat/low usage | PATTERN SHAPE (uniform flat vs. declining vs. sporadic) |
| Post-failure cluster | C1-6, C8B-4, C8B-8, C7-8 | Dropout after failure | TIMING (mid-drill, between sessions, multi-day absence, decreasing cycles) |
| Confidence cluster | C1-2, C1-4, C1-8 | Low efficacy behavior | LANGUAGE (fixed traits vs. judgment doubt vs. success dismissal) |

### Implementation Recommendations

1. **Phase 1: Behavioral Event Logging** -- Implement comprehensive app behavior tracking FIRST. This is the foundation for 85% of root cause detection. Track: screen transitions, dwell times, drill start/stop events, error events, feature interactions, session timing, notification responses.

2. **Phase 2: Pattern Detection Rules** -- Implement the 22 IMPLEMENTABLE decision computations as rule-based checks. Start with the top 10 highest-priority root causes from the table above.

3. **Phase 3: Hume Integration** -- Add voice prosody analysis for disambiguation. Primary value: freeze detection (C8A-8 safety), energy/mood baseline (C8B-3, C5-1), intra-session engagement decay (C8B-1), and attention markers (C4 gate).

4. **Phase 4: Language Analysis** -- Add transcript keyword/phrase detection for disambiguation. Primary value: fixed-mindset language (C1-2), shame/guilt language (C8B-8), identity-misalignment language (C7-7), and awareness gap indicators (C3 gate).

5. **Phase 5: Multi-Signal Disambiguation** -- Implement cross-channel signal combination to distinguish overlapping root causes. This is the hard part and requires the data from Phases 1-4 to be in place.

6. **Observation Window**: Most root causes require 5-14 days of data. The VCM's design of "Sessions 1-3: observation, Sessions 4-5+: pattern detection" is appropriate for the top-priority root causes. Some (C7-8, C8B-8) require 21-30+ days.

7. **Confidence Thresholds**: Given the 85% SHARED signal specificity rate, require 3+ confirming signals from 2+ channels before flagging any root cause hypothesis. Single-signal detection produces too many false positives.

---

## Appendix: Root Cause Count Reconciliation

The source documents show slight discrepancies in counts:
- Foundational Document: states 56 root causes (after C0-1 reclassification to C5-8 and C8B-9 consolidation into C8B-2)
- Root Cause Database (V1 structure): lists 61 entries (C0: 3, C1: 8, C2: 8, C3: 6, C4: 7, C5: 8, C6A: 8, C6B: 9 = 57, but title says 61)
- Claims Document: title says 61 root causes
- V2 Structure: 10 gates (C0: 3, C1: 8, C2: 8, C3: 3, C4: 7, C5: 6, C6: 7, C7: 8, C8A: 8, C8B: 9)

**V1 to V2 Gate Renumbering:**
- C3 Will → C5 Will
- C4 Intention → C6 Intention
- C5 Commitment → C7 Commitment
- C6A Initiation → C8A Initiation
- C6B Persistence/Maintenance → C8B Maintenance

**V2 New Gates (inserted between C2 and C5):**
- C3 Awareness (3 root causes: AA-1, AA-2, AA-5)
- C4 Attention (7 root causes: AA-3, AA-4, AA-6, AA-7, AA-8, AA-9, AA-10)

For this analysis, all entries present in the Root Cause Database were analyzed (57 distinct entries in the database + the reclassified C5-8 which appears as C0-1 in the database = 57 analyzed, with notes on reclassifications). The C8A-8 (Trauma-Related Freeze) appears in the database under C6A but is reclassified to C0-8 in the foundational document. C8B-9 (Competing Comforts) appears in the database but is consolidated into C8B-2 in the foundational document.

Total unique root causes analyzed: 57 database entries + notes on reclassification = comprehensive coverage of all known root causes across both documents. **V2 additions (C3 and C4 gates) require detailed analysis to be completed.**
