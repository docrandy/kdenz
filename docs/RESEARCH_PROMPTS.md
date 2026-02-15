# Research Prompts (Perplexity)

**Created:** 2026-02-13
**Purpose:** Research needed to inform technical and product decisions
**When to run:** After D1-D3 decisions are made (research focus depends on scope decisions)

---

## Priority 1: Needed Regardless of Scope Decisions

### R1. Hume.ai Batch API — Current Integration Guide (2026)

```
What is the current Hume.ai Batch API integration process in 2026?

I need:
1. Current API endpoints and authentication method
2. Supported audio formats and size limits
3. Response format for prosody/expression measurement
4. Pricing tiers and included minutes for batch processing
5. JavaScript/TypeScript SDK availability and examples
6. Any breaking changes since 2025 in their API

I already have a working Python POC using their v0 batch API. I need to port this to a TypeScript frontend that sends recorded audio blobs to Hume batch after a session ends.

Key constraint: I'm using batch (post-session) not streaming. I need the full session analysis, not real-time fragments.
```

### R2. VCM Decision Tree Implementation Patterns

```
What are the best patterns for implementing a multi-gate diagnostic decision tree in a web application?

Context: I'm building a diagnostic system with 4 sequential gates. Each gate has 5-9 possible root causes. The system needs to:
1. Run after each practice session (not real-time)
2. Accept inputs from multiple sources (voice analysis scores, text responses to planted questions, drill performance metrics)
3. Narrow down to a specific root cause
4. Map that root cause to recommended exercises
5. Track diagnosis history per user to detect patterns over time

Questions:
- Should this be a client-side decision tree or a serverless function?
- What data structures work best for a multi-input weighted decision tree?
- Are there existing libraries for adaptive diagnostic trees in TypeScript?
- How do systems like Duolingo or adaptive learning platforms implement similar diagnostic routing?
```

### R3. Adaptive Recommendation Engine — Ratio-Based Systems

```
How do consumer products implement adaptive recommendation engines that balance user preference with system diagnosis?

I'm building a communication training app where:
- Users choose what they want to practice (their stated goal)
- The system diagnoses what they actually need (hidden analysis)
- Recommendations should be 2:1 to 3:1 ratio (user-aligned : system-diagnosed)
- The system tests two recommendation styles per user: subtle vs. light explanation
- Ignored recommendations are never repeated

Questions:
1. What data model captures "recommendation + user response" for learning?
2. How do apps like Duolingo, Headspace, or Calm handle the gap between user desire and system assessment?
3. What's the simplest implementation that still feels adaptive?
4. Multi-armed bandit vs. rule-based for style testing — which is more practical for a small user base?
5. How much data do you need before personalization is meaningful?
```

---

## Priority 2: Needed If Simulation Studio Is In Scope

### R4. Gemini 2.5 Flash — Conversational Roleplay Integration

```
How do I build a real-time conversational AI roleplay opponent using Gemini 2.5 Flash in 2026?

Context: I'm building a simulation studio where users practice difficult conversations (salary negotiation, difficult client, giving feedback). The AI plays the other person.

I need:
1. Gemini 2.5 Flash API for multi-turn conversation — current endpoint and pricing
2. System prompt design for maintaining character consistency across turns
3. How to handle voice input → text → AI response → text display (or TTS?)
4. Latency expectations for conversational pace (target: <2s response time)
5. How to evaluate the quality of the conversation (did the user apply techniques?)
6. Streaming responses vs. full responses for conversational feel
7. Token cost estimate for a 15-minute simulation with 20-30 turns
```

### R5. Conversation Quality Evaluation via LLM

```
How can I use an LLM (Gemini 2.0 Flash) to evaluate conversation quality in real-time?

I need to detect these specific communication techniques in user speech:
1. Labeling: "It sounds like you're feeling..."
2. Mirroring: Repeating the last 1-3 words
3. Accusation audit: Pre-emptively naming concerns
4. Calibrated questions: "How am I supposed to do that?"
5. Tactical empathy: Demonstrating understanding of the other person's position

Questions:
1. What prompt engineering patterns work best for technique detection?
2. Should I evaluate per-turn or at session end?
3. How do I distinguish genuine technique use from accidental pattern matching?
4. Can I use few-shot examples effectively for this?
5. What's the accuracy expectation for LLM-based technique detection vs. rule-based?
```

---

## Priority 3: Needed for Data Layer Decisions

### R6. localStorage vs. Supabase — Data Persistence Strategy

```
For a communication training app with 5-50 beta users, what's the right data persistence strategy?

Current state: Everything in localStorage (sessions, settings, profile, diagnostics)
Platform Plan mentions Supabase but doesn't specify schema.

Data I need to persist per user:
- Practice session results (filler counts, WPM, duration, transcript)
- Diagnostic profile (VCM gate/root cause, history)
- Recommendation history (shown, accepted, ignored)
- Hume.ai analysis results (stress, confidence, engagement scores per session)
- User profile (goals, focus areas, preferences)

Questions:
1. At what user count does localStorage become problematic?
2. If I add Supabase, what's the minimal schema for a beta?
3. Should I design the schema for the full platform now or just for voice practice?
4. Row-level security considerations for practice session data?
5. Is there a migration path from localStorage to Supabase that doesn't lose data?
```

### R7. Audio Storage — Recording Sessions for Hume.ai Batch Processing

```
What's the best approach for storing audio recordings from a web app to send to a batch processing API?

Context:
- Users record 30s to 5-minute voice practice sessions in Chrome
- Audio is captured via MediaRecorder API as WebM/Opus
- I need to send the recording to Hume.ai batch API after the session
- Hume.ai requires specific audio formats (PCM 16kHz mono preferred)

Questions:
1. Should I convert WebM to WAV/PCM client-side before upload, or can Hume handle WebM?
2. Best approach for temporary audio storage: upload to Supabase Storage, S3, or send directly to Hume?
3. Privacy implications of storing voice recordings — what needs to be communicated to users?
4. Client-side audio format conversion libraries for the browser
5. File size expectations: how large is 5 minutes of 16kHz mono PCM?
```

---

## How to Use These Prompts

1. Copy the prompt text (inside the ``` blocks)
2. Paste into Perplexity Pro
3. Save the response to `.planning/research/` with a descriptive filename
4. Reference the research in planning sessions

The Priority 1 prompts (R1-R3) are useful regardless of scope decisions.
Priority 2 and 3 depend on your answers to D3, D4, and D9 in DECISIONS_NEEDED.md.

---

## Priority 4: Learning Architecture — Needed for Course Architect Agent

These prompts gather the information needed to build the Learning Architect agent and design the full skill tree, curriculum structure, and diagnostic-to-exercise mapping.

### R8. Complete Communication Technique Taxonomy for a Diagnostic Training Platform

```
I'm building a communication training platform that teaches negotiation and interpersonal communication skills through isolated drills and AI-powered roleplay simulations. The platform uses a diagnostic engine (based on the Volitional Chain Model from behavioral psychology) to identify WHY users struggle — not just WHAT they get wrong — and prescribes targeted exercises.

I already have these techniques implemented or specified:
1. Labeling (Chris Voss) — naming emotions: "It sounds like you're feeling frustrated"
2. Accusation Audit (Chris Voss) — pre-emptively naming every negative thing the other side might think about you
3. Mirroring (Chris Voss) — repeating the last 1-3 words with upward inflection
4. Calibrated Questions (Chris Voss) — "How am I supposed to do that?" style questions
5. Tactical Empathy (Chris Voss) — demonstrating understanding of the counterpart's position
6. Strategic Silence — intentional pauses as a negotiation tool

I need the COMPLETE list of communication techniques that a serious training platform should cover. Include:

1. All remaining Chris Voss / Never Split the Difference techniques I'm missing (e.g., late-night FM DJ voice, "That's right" vs "you're right", bending reality / loss aversion framing, "No"-oriented questions, Black Swan discovery, the Ackerman model for offers, anchoring, deadline pressure)

2. Foundational communication skills that aren't Voss-specific but are prerequisites or complements (e.g., active listening, "I" statements, de-escalation, open-ended questioning, emotional regulation, nonverbal awareness, vocal tonality control, assertiveness without aggression)

3. Advanced/situational techniques from other frameworks that would make the platform comprehensive:
   - Motivational Interviewing techniques (OARS: Open questions, Affirmations, Reflections, Summaries; change talk elicitation; rolling with resistance)
   - Difficult Conversations framework (Stone/Patton/Heen) — the "three conversations" model
   - Crucial Conversations techniques (Patterson et al.) — STATE method, contrasting, mutual purpose
   - Nonviolent Communication (Rosenberg) — observation, feeling, need, request
   - Any other evidence-based frameworks used in corporate communication training

For each technique, give me:
- Name and source/framework
- One-sentence description of what the user actually DOES
- Whether it's best practiced as an isolated drill (controlled prompt-response), an integrated roleplay (multi-turn conversation), or both
- Rough difficulty tier: foundational / intermediate / advanced

I don't need deep detail on each — I need the complete MAP of what exists so I can design the curriculum architecture.
```

### R9. Skill Tree Design Patterns — Prerequisites and Progression Logic for Communication Training

```
I'm designing the curriculum architecture for a communication training app. I need to understand how techniques relate to each other — what must be learned first, what builds on what, and how to sequence a learning path.

Here are the techniques my platform will teach (grouped by source):

**Chris Voss / Tactical Negotiation:**
Mirroring, Labeling, Accusation Audit, Calibrated Questions, Tactical Empathy, Strategic Silence, Late-Night FM DJ Voice, "That's Right" technique, "No"-Oriented Questions, Bending Reality / Loss Aversion Framing, Ackerman Model, Black Swan Discovery

**Foundational / Cross-Framework:**
Active Listening, Emotional Regulation, Vocal Tonality Control, Assertiveness, De-escalation, Open-Ended Questioning, "I" Statements

**Motivational Interviewing:**
Open Questions (OARS), Affirmations, Reflections, Summaries, Change Talk Elicitation, Rolling with Resistance

**Other Frameworks (if applicable):**
NVC (Observation → Feeling → Need → Request), Crucial Conversations STATE method, Difficult Conversations "Three Conversations" model

Questions:
1. What is the optimal learning sequence? Which techniques are prerequisites for others? For example: Does active listening need to come before mirroring? Does emotional regulation need to come before tactical empathy? Does labeling need to come before accusation audit?

2. Can you provide a dependency graph — which techniques REQUIRE prior mastery of another technique, vs. which are merely "helpful to know first"? I need hard dependencies vs. soft recommendations.

3. How do educational platforms (Duolingo, Khan Academy, Codecademy) structure skill trees for domains where skills compound? What patterns work for communication skills specifically?

4. Should there be a "fundamentals track" that all users complete before branching into specialized tracks (negotiation, difficult conversations, leadership communication)? If so, what belongs in fundamentals?

5. How many difficulty levels per technique make sense? I currently use 3 (beginner/intermediate/advanced). Is that sufficient, or do communication skills need finer gradations (e.g., 5 levels)?

6. What does "mastery" look like for each tier? How do platforms like Duolingo define when a user can "move on" vs. needs more practice? What metrics indicate readiness to progress?

Give me a concrete skill tree structure I can implement, not just theory. I need something like:
- Tier 1 (Foundations): [list] — unlock criteria: complete onboarding
- Tier 2 (Core Techniques): [list] — unlock criteria: Tier 1 mastery at X%
- Tier 3 (Advanced/Integration): [list] — unlock criteria: specific Tier 2 prerequisites
```

### R10. Skills Lab vs. Simulation Studio — Drill Design Patterns for Communication Training

```
I'm building two practice environments for a communication training platform:

**Skills Lab** = Isolated drills. User practices ONE technique at a time in a controlled format.
- Current example: User reads a scenario prompt, writes a labeling response ("It sounds like you're feeling..."), gets immediate scoring on syntax and emotional depth.
- Format: Prompt → Single response → Immediate feedback → Score
- Good for: Building muscle memory, technique syntax, isolated repetition

**Simulation Studio** = Multi-turn AI roleplay. User has a full conversation with an AI opponent and must apply MULTIPLE techniques naturally.
- Planned: User enters a negotiation scenario, AI plays the counterpart, conversation runs 10-20 turns, post-session analysis evaluates which techniques were used and how effectively.
- Format: Scenario setup → Multi-turn conversation → Post-session analysis
- Good for: Integration, pressure testing, realistic application

My technique list includes: Mirroring, Labeling, Accusation Audit, Calibrated Questions, Tactical Empathy, Strategic Silence, Late-Night FM DJ Voice, "That's Right" technique, "No"-Oriented Questions, Bending Reality, Ackerman Model, Black Swan Discovery, Active Listening, Emotional Regulation, Vocal Tonality Control, OARS (MI), NVC framework, and others.

Questions:
1. Which techniques work well as isolated drills and which REQUIRE multi-turn conversation context to practice meaningfully? For example, mirroring seems drillable (read a statement, mirror it), but Black Swan discovery probably needs a full conversation.

2. For techniques that live in BOTH environments, how should the drill version differ from the simulation version? What's the relationship between "practiced it in isolation" and "can apply it under pressure"?

3. What drill formats work for communication skills beyond prompt-response? I've seen:
   - Prompt → Response (current)
   - Audio prompt → Spoken response (with prosody feedback)
   - Multiple-choice recognition ("which of these is a good calibrated question?")
   - Rewrite exercises ("turn this aggressive question into a calibrated question")
   - Spot-the-technique ("identify what Voss technique this person just used")
   Which formats are most effective for which techniques?

4. For Simulation Studio scenarios, what's the right scenario taxonomy? Should scenarios be organized by:
   - Domain (workplace, personal, sales, customer service)?
   - Difficulty (cooperative counterpart → resistant → hostile)?
   - Technique focus (this scenario is designed to practice labeling)?
   - Or some combination?

5. How many scenarios does a mature training platform need per technique to feel comprehensive without being overwhelming? What's the minimum for beta?

6. Should simulations have a "technique requirement" (you MUST use labeling at least twice) or be free-form with post-session detection? Which approach leads to better learning transfer?
```

### R11. VCM Diagnostic Gates → Exercise Prescription Mapping

```
I'm building a diagnostic engine based on the Volitional Chain Model (VCM) — a behavioral psychology framework that explains WHY people fail to change behavior. The model identifies 8 sequential gates a person must pass through to sustain a new behavior. If any gate fails, the chain breaks.

The gates (simplified):
- Gate A: AWARENESS / READINESS — Do they know they have a problem? Are they ready to address it?
- Gate B: MOTIVATION / DESIRE — Do they actually want to change? Is there intrinsic motivation?
- Gate C: BELIEF / SELF-EFFICACY — Do they believe they CAN change? Do they believe the method works?
- Gate D: INTENTION / PLANNING — Have they formed a specific plan? Do they know what to do next?
- Gate E: ACTION / INITIATION — Can they actually start? Do they overcome inertia?
- Gate F: PERSISTENCE / MAINTENANCE — Can they sustain effort? Do they follow through?
- Gate G: RECOVERY / RESILIENCE — Can they bounce back from setbacks?
- Gate H: INTEGRATION / IDENTITY — Has the new behavior become part of who they are?

Each gate has 5-8 root causes for failure (e.g., Gate B might fail because: no felt urgency, competing priorities, fear of social consequences, effort feels disproportionate to benefit, past failures created learned helplessness).

My platform teaches communication skills (labeling, mirroring, calibrated questions, etc.) through drills and AI simulations. The diagnostic engine runs after each session and identifies which gate is failing and why.

Questions:
1. For each gate (A through H), what types of exercises or interventions are appropriate? For example:
   - Gate A failure → awareness-building exercises (playback of their own speech, comparison to expert examples)?
   - Gate C failure → self-efficacy exercises (micro-wins, success replay, progressive difficulty)?
   - Gate F failure → habit-forming exercises (streaks, reminders, shorter sessions)?

2. How do existing adaptive learning platforms (Duolingo, Khan Academy, BetterUp, Headspace) map diagnostic signals to exercise types? Do they have public research on their adaptive logic?

3. For communication skills specifically, what does each gate failure look like in practice? Help me build a "failure signature" for each gate — what behavioral signals (session data, drill performance, engagement patterns) indicate which gate is failing?

4. Should the prescription be a specific exercise ("do the mirroring drill"), a category of exercise ("do any Skills Lab drill"), or a behavioral nudge ("try a shorter session tomorrow")? What granularity is most effective?

5. How do MI (Motivational Interviewing) practitioners handle each gate in a clinical setting? MI has specific techniques for pre-contemplation (Gate A), contemplation (Gate B), preparation (Gate D), action (Gate E), and maintenance (Gate F). Can these be translated into app-based interventions?

6. What's the risk of over-diagnosing? If the system constantly tells users "you're failing at Gate C," does that undermine the very self-efficacy it's trying to build? How do consumer apps handle this without creating a negative feedback loop?

I need practical mappings I can implement as a rule-based system: IF gate = X AND root_cause = Y THEN prescribe = Z. Not academic theory — actionable rules.
```

### R12. Educational Content Architecture — Video + Quiz + Reading for Communication Skills Training

```
I'm building an educational section ("KDENZ Institute") within a communication training platform. This is the LEARNING side (theory, examples, frameworks) that complements the PRACTICE side (drills and simulations).

The Institute should include:
- Video content (tutorials, expert demonstrations, technique breakdowns)
- Quizzes (knowledge checks, technique recognition, scenario judgment)
- Written content (articles, framework explanations, research summaries)
- Possibly: case studies, annotated real-world examples, before/after comparisons

The techniques covered include: Chris Voss negotiation techniques (labeling, mirroring, accusation audit, calibrated questions, etc.), Motivational Interviewing (OARS), foundational communication skills (active listening, emotional regulation, assertiveness), and potentially NVC and Crucial Conversations frameworks.

Questions:
1. What content architecture do successful educational platforms use? How do Khan Academy, MasterClass, Coursera, and Skillshare organize video + quiz + reading content? What's the relationship between content modules and practice modules?

2. For communication skills specifically, what video content formats work best?
   - Expert lecture (talking head explains technique)?
   - Demonstration (two people role-playing the technique)?
   - Before/after comparison (bad example then good example)?
   - Annotated real-world clips (breakdown of a real negotiation)?
   Which formats lead to the highest technique adoption in practice?

3. What quiz formats work for communication skills beyond multiple choice?
   - "Watch this clip, identify which technique was used"
   - "Read this scenario, rank the best responses"
   - "Rewrite this sentence using [technique]"
   - "Predict what happens next if the person uses X technique"
   Are there proven quiz formats for soft skill training specifically?

4. How should Institute content connect to Skills Lab and Simulation Studio? For example:
   - Should users watch the labeling video BEFORE or AFTER their first labeling drill?
   - Should quiz completion unlock drills, or should drills unlock educational content?
   - What's the optimal learn → practice → reflect loop?

5. What's the minimum viable content per technique for a beta launch? I'm thinking:
   - 1 explainer video (2-5 min)
   - 1 demonstration video (1-3 min)
   - 1 written summary (500-1000 words)
   - 3-5 quiz questions
   Is this sufficient, or do I need more for meaningful learning?

6. Can the educational content be AI-generated initially (e.g., written summaries, quiz questions) and then replaced with professional content later? What's the quality threshold where AI-generated educational content helps vs. hurts credibility?

7. Content management: Should this be hardcoded in the app, stored in a CMS (headless like Sanity or Contentful), or in the database (Supabase)? What scales best for a solo developer going from 10 to 10,000 pieces of content?
```

### R13. CBT and Motivational Interviewing — Complete Technique Inventory for a Practice Platform

```
I'm building a communication training platform that teaches people to communicate more effectively through AI-powered drills and roleplay simulations. The platform already covers negotiation techniques (Chris Voss / Never Split the Difference) and foundational communication skills. I now need to map the COMPLETE set of practicable techniques from two clinical frameworks:

**1. Cognitive Behavioral Therapy (CBT) — communication-relevant techniques only**

I'm NOT building a therapy app. I want the CBT techniques that improve how people COMMUNICATE and handle difficult interpersonal situations. For example:
- Cognitive restructuring / reframing (changing how you interpret what someone says before responding)
- Behavioral experiments (testing assumptions about how a conversation will go)
- Thought records applied to communication (identifying automatic thoughts that derail conversations)
- Socratic questioning (asking questions that help the OTHER person examine their own thinking)
- Decatastrophizing (reducing anxiety about difficult conversations)
- Assertiveness training (the CBT approach to standing your ground without aggression)
- Exposure hierarchies for communication anxiety (progressive difficulty conversations)
- Cognitive defusion (ACT-adjacent — separating yourself from unhelpful thoughts mid-conversation)

For each CBT technique, I need:
- Name and brief description
- How it applies to COMMUNICATION specifically (not general mental health)
- Whether it can be practiced as a drill (prompt → response), a journaling/reflection exercise, or requires roleplay simulation
- Difficulty tier: foundational / intermediate / advanced
- Whether it's a "before the conversation" technique (preparation), "during" technique (real-time), or "after" technique (reflection/learning)

**2. Motivational Interviewing (MI) — full technique taxonomy**

I already have OARS listed (Open questions, Affirmations, Reflections, Summaries) plus "change talk elicitation" and "rolling with resistance." But MI has much more depth. I need the COMPLETE inventory:

- All reflection types (simple, complex, amplified, double-sided, reframing)
- All question types beyond open-ended (evocative questions, scaling questions, looking forward/back, querying extremes)
- The full "change talk" framework (DARN-CAT: Desire, Ability, Reason, Need, Commitment, Activation, Taking Steps) — can each type be practiced as a drill?
- Sustain talk recognition and strategies for handling it
- Discord (formerly "resistance") — types and responses
- The MI Spirit components (partnership, acceptance, compassion, evocation) — can these be operationalized into exercises?
- Decisional balance technique
- Importance/confidence rulers (and the follow-up questions)
- Values card sort / values exploration
- Developing discrepancy
- Supporting self-efficacy techniques
- Elicit-Provide-Elicit (EPE) information exchange
- Permission asking before giving advice

For each MI technique, I need:
- Name and brief description of what the practitioner DOES
- Whether it's best practiced as an isolated drill, a multi-turn conversation, a recognition exercise (identify it in a transcript), or a reflection exercise
- Difficulty tier: foundational / intermediate / advanced
- How it maps to the Stages of Change (pre-contemplation, contemplation, preparation, action, maintenance) — which stages is each technique most useful for?

**3. Overlap and integration points**

- Where do CBT and MI overlap? (e.g., both use Socratic questioning, both address cognitive distortions)
- Where do they complement each other? (CBT is more structured/directive, MI is more evocative/collaborative)
- How do CBT and MI techniques integrate with negotiation skills (Chris Voss)? For example: Labeling (Voss) is structurally similar to Complex Reflection (MI) — are there other parallels?
- Which CBT/MI techniques are prerequisites for advanced negotiation techniques?

**4. Practicability filter**

For each technique across both frameworks, rate how well it can be practiced in a digital app (1-5 scale):
- 5 = Perfect for app-based practice (clear prompt → response format, objective scoring possible)
- 4 = Good for app practice (needs AI evaluation but feasible)
- 3 = Moderate (can be partially practiced, some aspects need human feedback)
- 2 = Difficult (mostly reflection/journaling, hard to score)
- 1 = Not suitable for app practice (requires in-person, therapist-guided, or group setting)

I only want to build techniques rated 3-5. Flag the 1-2s so I know what to exclude.

Give me the complete inventory organized as a flat list I can import into a curriculum design tool — not nested paragraphs of explanation. Format: Name | Framework | Description | Practice Format | Difficulty | Practicability Score
```

---

## Research Status

| Prompt | Status | Filed Location |
|--------|--------|---------------|
| R1 (Hume batch API) | COMPLETE | `.planning/research/R1_HUME_BATCH_API_2026.md` |
| R2 (VCM decision tree) | COVERED BY R3 | — |
| R3 (Recommendation engine) | COMPLETE | `docs/perplexityresearch2_13.txt` |
| R4 (Gemini simulation) | COMPLETE | `.planning/research/R4_GEMINI_SIMULATION_IMPLEMENTATION.md` |
| R5 (Conversation quality eval) | COMPLETE | `.planning/research/R5_CONVERSATION_QUALITY_EVALUATION.md` |
| R6 (localStorage vs Supabase) | COMPLETE | `docs/Perplexity research 3.txt` |
| R7 (Audio storage) | COMPLETE | `.planning/research/R7_AUDIO_STORAGE_HUME_BATCH.md` |
| R8 (Technique taxonomy) | COMPLETE + ANALYZED | `.planning/research/R8_*.md` |
| R9 (Skill tree prerequisites) | COMPLETE | `.planning/research/R9_SKILL_TREE_PREREQUISITES.md` |
| R10 (Skills Lab vs Simulation) | COMPLETE | `.planning/research/R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md` |
| R11 (VCM → exercise mapping) | COMPLETE | `.planning/research/R11_VCM_GATE_EXERCISE_PRESCRIPTIONS.md` |
| R12 (Institute content arch) | COMPLETE | `.planning/research/R12_INSTITUTE_CONTENT_ARCHITECTURE.md` |
| R13 (CBT + MI inventory) | COMPLETE | `.planning/research/R13_CBT_MI_TECHNIQUE_INVENTORY.md` |
| R14 (AI opponent prompt eng.) | COMPLETE | `.planning/research/R14_AI_OPPONENT_PROMPT_ENGINEERING.md` |
| R15 (Spaced repetition for skills) | COMPLETE | `.planning/research/R15_SPACED_REPETITION_MASTERY_DECAY.md` |
| R16 (Full platform Supabase schema) | COMPLETE | `.planning/research/R16_FULL_PLATFORM_SUPABASE_SCHEMA.md` |

---

## Priority 5: Implementation Architecture — Emerged from R4-R10 Analysis

### R14. AI Opponent System Prompt Engineering — Character Consistency Across 5 Difficulty Levels

```
I'm building a Simulation Studio where users practice communication techniques (labeling, mirroring, calibrated questions, accusation audit, etc.) against an AI opponent powered by Gemini 2.5 Flash.

I already have:
- Model selected: Gemini 2.5 Flash ($0.30/1M input, $2.50/1M output)
- State object pattern: { mood, concessions, constraints, last_tactic } passed each turn
- Scenario taxonomy: 6 domains × 5 difficulty levels × 4 goal types
- Technique detection: hybrid rules + LLM, per-turn and session-end
- Cost model: ~$0.01-0.02 per 15-minute session

What I need is the PROMPT ENGINEERING side — how to write system prompts that create believable, consistent AI opponents across 5 counterpart disposition levels:

1. **Cooperative** (willing, responsive, low hostility)
2. **Hesitant** (guarded, noncommittal, needs drawing out)
3. **Resistant** (pushback, objections, sustain talk)
4. **Aggressive** (interrupts, accuses, emotionally escalated)
5. **Deceptive / Strategic** (withholds info, misleads, tests boundaries)

Questions:

1. What system prompt structure creates the most consistent character behavior? How do I prevent the AI from:
   - Breaking character when the user applies a good technique (e.g., immediately capitulating instead of gradually opening up)
   - Being TOO difficult (never responding positively, even to perfect technique application)
   - Repeating the same objections/responses across turns

2. Show me concrete system prompt templates for Level 3 (Resistant) across two different domains:
   - Workplace: Manager resisting a promotion request
   - Personal: Partner resisting a change in household responsibilities
   How do the prompts differ structurally? What stays the same?

3. How do I implement "control dials" (assertiveness 1-5, reactivity 1-5, emotional volatility 1-5) that make the same base character behave differently at each difficulty level? Show me the dial values and corresponding prompt modifications for Levels 1-5.

4. How should the AI opponent respond to GOOD technique application vs BAD? Research says:
   - Good labeling → counterpart opens up slightly
   - Bad labeling → counterpart corrects or gets more guarded
   - Good calibrated question → counterpart shifts to problem-solving
   - Bad question → counterpart deflects or gets annoyed
   What prompt patterns create this graduated response behavior?

5. Character consistency across 15-20 turns: How do I prevent the AI from:
   - Forgetting earlier constraints or concessions
   - Suddenly changing personality mid-conversation
   - Being inconsistent with what information has been "revealed"
   Show me how the state object should evolve turn-by-turn and how the system prompt references it.

6. For scenarios where the AI has a "hidden concern" that the user must discover (e.g., the manager is worried about their own job security), how do I prompt the AI to:
   - NOT reveal it unless the user applies the right technique (labeling the underlying driver, or calibrated questioning)
   - Gradually reveal it in stages (hint → partial reveal → full disclosure)
   - Never reveal it if the user only uses surface-level techniques

7. Conversation ending logic: How should simulations end?
   - After N turns (hard limit)?
   - When the AI determines an agreement/impasse has been reached?
   - When the user achieves the scenario goal?
   Which approach creates the best learning experience?

Give me ready-to-use system prompt templates I can plug into my Gemini API calls, not theoretical guidance. Include the full system instruction text for at least 2 difficulty levels × 2 domains.
```

### R15. Spaced Repetition & Mastery Decay for Communication Skills Training

```
I'm building a communication training platform with a 5-level mastery system:
- Level 0: Not Started
- Level 1: Attempted (tried, scored <70%)
- Level 2: Familiar (scored 70-99% in drill OR used correctly 1-2 times in roleplay)
- Level 3: Proficient (scored 100% in drill OR used correctly 3+ times across multiple roleplays)
- Level 4: Mastered (Proficient + demonstrated in mixed-skill assessment + retention check 7-14 days later)

The platform teaches ~30 communication techniques (labeling, mirroring, calibrated questions, "I" statements, NVC, etc.) across 5 tiers with prerequisite dependencies.

Questions:

1. How should communication skills decay over time compared to factual knowledge?
   - Duolingo uses a "strength bar" that decays. What's their decay curve? Does research support this for behavioral skills vs vocabulary memorization?
   - If a user reaches Proficient in labeling but doesn't practice for 3 weeks, should they drop to Familiar? 4 weeks? 6 weeks?
   - Is the decay curve the same for all technique types (syntax-driven like mirroring vs. judgment-based like tactical empathy)?

2. How do I implement spaced repetition for BEHAVIORAL skills (not just recall)?
   - Traditional SRS (Anki, SuperMemo) tests recall of facts. Communication skills are procedural, not declarative. What adaptations are needed?
   - Should the review format match the original learning format (drill → drill review) or escalate (drill → simulation review)?
   - How do platforms like BetterUp, CoachHub, or Headspace handle behavioral skill reinforcement?

3. What's the right retention check format for each drill type?
   - Prompt→Response drills: Same format but new scenario?
   - Audio drills: Same format but different script?
   - Simulation-trained skills: Short 3-5 turn "spot check" simulation?
   - Multiple-choice recognition: Same questions or new questions?

4. Notification/re-engagement strategy:
   - When should the platform prompt a retention check? (7 days? 14 days? Based on individual decay rate?)
   - How do consumer apps phrase retention prompts without feeling punitive? ("Your labeling skill is fading" vs "Quick refresher to lock in your labeling skill")
   - Should retention checks be mandatory (block progression) or optional (recommended but skippable)?

5. What data model supports this?
   - Need to track: skill_id, mastery_level, last_practiced, next_review_date, consecutive_correct, streak_count
   - Should I use a simple interval doubling (1 day → 3 days → 7 days → 14 days → 30 days) or something more sophisticated?
   - How do I calculate "next_review_date" for behavioral skills vs factual recall?

6. Does mastery in a PREREQUISITE skill decay when the DEPENDENT skill is being actively practiced?
   - Example: If someone is actively practicing Calibrated Questions (which requires Tactical Empathy), does their Tactical Empathy mastery decay or stay maintained because it's being exercised within the dependent skill?
   - How do skill tree platforms handle "implicit practice" of prerequisite skills?

Give me a concrete implementation plan with decay curves, review schedules, and data model — not general SRS theory. Include specific interval tables for behavioral skills.
```

### R16. Full Platform Supabase Schema — Adaptive Learning + Skill Tree + VCM Diagnostics

```
I'm building a communication training platform on Supabase (Postgres + Auth + Storage + Edge Functions). I need the COMPLETE database schema for:

**What I already have working (localStorage, needs migration):**
- User profiles (goals, focus areas, preferences, self-assessment)
- Practice session results (filler counts, WPM, duration, transcript)
- Settings (thresholds, preferences)

**What I need to add:**

1. **Skill Tree & Mastery Tracking**
   - 30+ communication techniques organized in a 5-tier DAG (directed acyclic graph)
   - Hard prerequisites (e.g., must master Labeling before Accusation Audit)
   - 5 mastery levels per skill per user (Not Started → Attempted → Familiar → Proficient → Mastered)
   - Unlock logic: tier gating (≥75% of current tier at Proficient to unlock next)
   - Spaced repetition: next_review_date, decay tracking, retention check results

2. **Drill Attempts (Skills Lab)**
   - 5 drill formats: Prompt→Response, Audio→Spoken, Multiple-Choice, Rewrite, Spot-the-Technique
   - Per-attempt: technique_id, format, scenario_id, user_response, score (form/accuracy/impact/timing), duration
   - Scoring rubric varies by technique (weights differ)
   - Need to track attempt history for mastery progression

3. **Simulation Sessions (Simulation Studio)**
   - Multi-turn conversations with AI opponent (Gemini 2.5 Flash)
   - Per-session: scenario_id, difficulty_level, focus_type (guided/scaffolded/free-form), goal_type
   - Per-turn: turn_id, speaker, text, techniques_detected (JSON), quality_scores (JSON)
   - Session-level: flow_scores (6 dimensions), key_moments, summary_feedback
   - AI state object per turn: { mood, concessions, constraints, last_tactic }

4. **Technique Detections**
   - Per-turn detection results from Gemini evaluator
   - Fields: technique_type, confidence, evidence_span, form_score, accuracy_score, impact_level, timing_score
   - Both per-turn (real-time) and session-end (aggregated) results
   - Need to query: "all labeling instances by this user across all sessions"

5. **VCM Diagnostic State**
   - 8 gates (A-H), each with current diagnosis (gate_status, root_cause, confidence, evidence_sessions)
   - Diagnosis history (when diagnosis changed, why)
   - Provisional vs confirmed diagnoses (need N≥2 sessions showing same pattern)
   - Meta flags from evaluation: avoidance_flag, shutdown_flag, scripted_behavior_flag

6. **Recommendations**
   - What was recommended, when, whether accepted/ignored/completed
   - Recommendation type: specific drill, technique category, behavioral nudge, simulation scenario
   - Ratio tracking: user-aligned vs system-diagnosed
   - Style testing: subtle vs light_explanation (which the user responded to)

7. **Audio Storage (for Hume.ai batch)**
   - Temporary audio blobs (auto-delete within 24h after Hume processing)
   - Hume analysis results per session (prosody, stress, confidence, freeze detection)

8. **Content (KDENZ Institute)**
   - Techniques → educational content mapping
   - Content items: videos, articles, quizzes
   - Quiz attempts and scores
   - Progress tracking per content module

Questions:

1. Give me the complete CREATE TABLE statements with proper types, constraints, and indexes. Use Supabase conventions (uuid primary keys, timestamptz, JSONB for flexible data).

2. What RLS (Row-Level Security) policies are needed? Users should only see their own data. An admin role needs read access to all data for debugging during beta.

3. How should I handle the skill prerequisite DAG? Options:
   - Adjacency list (skill_prerequisites table with parent_id, child_id)
   - Closure table (all ancestor-descendant pairs precomputed)
   - JSONB array of prerequisite IDs on the skill row
   Which is best for "check if user can attempt this skill" queries?

4. JSONB vs normalized tables: For technique detections and quality scores, should I use JSONB columns (flexible, fewer joins) or fully normalized tables (queryable, indexable)? Consider that I need to:
   - Query "average accuracy_score for labeling across all sessions"
   - Query "all technique instances with impact_level ≥ 2"
   - Generate trend charts from historical scores

5. What indexes are critical for the most common queries:
   - "Get all skills and mastery levels for user X"
   - "Get drill attempts for user X, technique Y, last 30 days"
   - "Get all simulation sessions for user X with flow_scores"
   - "Find skills where next_review_date < now()"

6. Migration strategy from localStorage: What's the cleanest one-time migration approach? The app currently stores everything in localStorage keys. I need a migration script that:
   - Reads all localStorage data
   - Creates user account (Supabase Auth)
   - Inserts all historical data into the new schema
   - Verifies migration success before clearing localStorage

Give me production-ready SQL I can run as a Supabase migration, not conceptual ERDs. Include RLS policies, indexes, and any Edge Function stubs needed for the unlock logic.
```

---

## How to Use These Prompts

1. Copy the prompt text (inside the ``` blocks)
2. Paste into Perplexity Pro (Deep Research mode recommended for R14-R16)
3. Save the response to `.planning/research/` with a descriptive filename
4. Reference the research in planning sessions

### Priority Guide

| Priority | Prompts | Status | Purpose |
|----------|---------|--------|---------|
| 1 (Core) | R1-R3 | ALL COMPLETE | Technical foundations |
| 2 (Simulation) | R4-R5 | ALL COMPLETE | Gemini integration + evaluation |
| 3 (Data Layer) | R6-R7 | ALL COMPLETE | Persistence + audio storage |
| 4 (Learning Architecture) | R8-R10 | ALL COMPLETE | Curriculum + skill tree + drill design |
| 4 (Learning Architecture) | R11-R13 | ALL COMPLETE | VCM prescriptions + Institute + CBT/MI |
| 5 (Implementation) | R14-R16 | ALL COMPLETE | AI opponents + retention + full schema |
