# KDENZ Communication Platform --- Consolidated Plan

**Last Updated:** 2026-02-13
**Status:** Pre-development / Research Complete

---

## What KDENZ Is

KDENZ is an adaptive diagnostic system disguised as communication practice. Users think they're practicing negotiation, vocal delivery, or tactical skills. They are --- but the real product is the invisible layer underneath that's constantly diagnosing, adapting, and routing them toward what they actually need, not just what they asked for.

**The core metaphor is batting practice.** Real conversations are the game. KDENZ is the cage where you can take 1,000 swings without consequences, and the pitching machine adapts to your weaknesses.

### The Two Parallel Tracks

```
USER'S TRACK (visible):
  "I want to get better at negotiation"
  → They pick exercises, practice, see progress
  → They feel in control the whole time
  → They see a recommended "stack" (Voice + Skills + Simulation)
  → They choose what to work on

SYSTEM'S TRACK (invisible):
  "Their voice reveals freeze patterns under pressure,
   their labeling is technically correct but tonally
   interrogative, and they rush when emotionally triggered"
  → VCM diagnosis identifies root cause of volitional failure
  → Neuroscience frameworks determine best intervention
  → System subtly surfaces the right exercise at the right time
  → Recommendation style adapts per user (direct vs. light-touch)
  → User discovers their own gaps through practice, not through being told
```

The gap between what the user thinks they need and what the system knows they need --- managing that gap without triggering resistance is the entire product design challenge.

### Core Philosophy

- Users should feel in control of their learning journey
- AI works subtly in the background to personalize recommendations
- Primary action: Practice (not analytics)
- Insights should be discoverable, not forced
- Personalization happens passively over time
- **The system never tells, it creates conditions for self-discovery (MI principles)**
- **Action language only** --- "We noticed X" not "You failed at X"

### The Real Problem Being Solved

People can't practice high-stakes conversations because of:
- Lack of available practice partners
- Lack of available time
- Intensity of real-life situations making practice impossible

This gap between reading a book and applying it in real time means people fail when it matters most. KDENZ provides repeatable, consequence-free practice with an adaptive system that identifies what they're actually deficient in --- not just what they tell us.

### Target Users

- Professionals who want to improve communication/negotiation skills but don't have the ability to practice
- Sales teams, executives, consultants
- Anyone looking to build confidence in high-stakes conversations
- **First user:** Someone with the drive to get better at speaking (especially at work) but no way to practice

---

## The Diagnostic Engine

### Volitional Chain Model (VCM)

The VCM is a diagnostic tool for Volitional Failure --- why people fail to do what they intend to do. It runs invisibly at intake and after every session.

**The Four Gates (Initial Screening):**

```
Gate 1: AWARENESS  --- Did they fail because they weren't aware?
Gate 2: DESIRE     --- Did they fail because they don't want it?
Gate 3: WILL       --- Did they fail because they lacked intention/commitment?
Gate 4: ACTION     --- Did they pass all gates but fail at execution?
```

Each gate has a subset of 5-9 root causes. The system hones in on the specific root cause through:
- How users respond to intake questions
- Keywords detected during practice sessions
- Planted diagnostic questions embedded within exercises
- Voice analysis data (Hume.ai batch processing)
- Performance data from drills and simulations

**Diagnosis Flow:**
1. Initial screening determines which gate the failure falls under
2. Subset questions narrow to specific root cause (5-9 options per gate)
3. Once root cause is identified, system maps to recommended exercises
4. Recommendations may be a single exercise or a set of exercises

**Implementation:** Decision tree logic, fed by keyword analysis + planted questions + Hume voice data + drill performance. Runs as Python script or API at:
- End of every session
- Key diagnostic moments during sessions (planted questions)
- Intake

### Neuroscience Layer

Invisible to the user. Powers the diagnostic and recommendation engine.

**Mechanisms used:**
- Arnsten 2009: Amygdala hijack / PFC suppression (freeze detection)
- Porges 2007: Polyvagal theory (vagal tone via vocal prosody)
- Schiller 2010: Memory reconsolidation (post-session practice windows)
- Ericsson 1993: Deliberate practice (targeted improvement timelines)
- Zhang 2014: Self-generated change talk (MI-based coaching)
- Nader 2000: Memory reconsolidation (guided re-exposure)
- Klofstad 2012: Vocal prosody and perceived competence

**Role:** Neuroscience determines WHY a user is struggling (mechanism) and WHAT intervention is most likely to work (evidence-based exercise). The user sees recommendations and action language; they don't see the science unless they seek it out.

### Adaptive Recommendation Engine

**Inputs:**
- VCM diagnosis (root cause of volitional failure)
- User's stated goals (from intake)
- Session performance data (Hume scores, drill results, simulation transcripts)
- Recommendation style preference (learned per user)
- History of accepted/ignored recommendations

**Recommendation Ratio:** 2:1 to 3:1 (user-aligned : system-diagnosed)
- 2-3 recommendations aligned with what they asked for
- 1 recommendation based on system diagnosis
- If user engages with system recommendations, increase system recommendations by 1
- Never repeat a recommendation that was ignored (that's being pushy)
- Never overwhelm

**Recommendation Style (Adaptive per user):**
- **Approach A:** Subtle, no explanation ("You might enjoy trying the Vocal Lab")
- **Approach B:** Light explanation ("We noticed your pace changes during tense moments --- here's an exercise that might help")
- System tests which approach works for each user and adapts
- Framed as advancement: "Because you're advancing, this would be a great skill for your new level"

**MI Principle:** The entire recommendation system is designed around motivational interviewing. The system never tells the user what's wrong. It says "here are some next-level skills you may want to consider --- these tend to help with X." It creates conditions for the user to discover their own gaps.

---

## The User Journey

### Intake (Minimal, Dual-Purpose)

3-4 questions that serve two purposes simultaneously:
1. **Stated purpose:** Understand user's goals and struggles
2. **Hidden purpose:** Capture voice data for Hume.ai baseline analysis

**Questions (goal-oriented, voice-capturing):**
- What are you signing up for? What's your goal?
- What are you having difficulties with?
- What situations do you find most challenging?
- (Possible) Subtle voice baseline prompt --- designed to feel natural, not clinical

**Critical design constraint:** User must NOT feel like a lab rat. Questions feel like onboarding, not testing. Voice baseline capture is invisible.

If a dedicated voice analysis section is needed for baseline, it's framed as part of the experience, not as assessment.

### The Stack (Day 1 Framing)

From the beginning, users understand the platform includes three practice areas:
1. **Voice** (Vocal Performance Lab) --- work on how you sound
2. **Skills** (Applied Skills Lab) --- work on what you say
3. **Simulation** (Simulation Studio) --- put it all together

This framing resolves the tension between user goals and system diagnosis. The user expects to work across all three areas as part of their journey. If they only want to use one, that's fine, but the expectation is set.

### Ongoing Loop

```
Practice session (user chooses)
  → System plants diagnostic questions during session
  → Session ends
  → Hume.ai batch analysis runs on recorded audio
  → VCM diagnosis updates
  → Recommendations generated (2:1 to 3:1 ratio)
  → User sees options, chooses next session
  → Repeat (system gets smarter with each cycle)
```

### Progression

- Skill levels tracked in the background (may or may not be visible as badges --- TBD based on beta user feedback)
- New challenges unlock as users advance
- System adapts difficulty and recommendations based on level
- No forced gating --- users can explore freely, system recommends the path

---

## Site Architecture

### Pages

- Dashboard (landing)
- Vocal Performance Lab
- Applied Skills Lab
- Simulation Studio
- KDENZ Institute
- Performance (analytics)
- Session History
- Insights
- Personalization & Feedback
- Settings

### Navigation Structure

```
Sidebar
  PERFORMANCE
    Dashboard
    Performance

  TRAINING
    Vocal Performance Lab
    Applied Skills Lab
    Simulation Studio
    KDENZ Institute

  SYSTEM
    Session History
    Insights
    Personalization & Feedback
    Settings
```

---

## Feature Breakdown

### Vocal Performance Lab

- **Purpose:** Voice practice with post-session deep analysis
- **During session:** User practices speaking (reads prompts, freeform, or exercises)
- **Post-session:** Hume.ai batch analysis produces emotional arc, freeze detection, confidence/stress scores
- **Stored:** Results feed user profile, Communication Index, and VCM diagnosis
- **Recommendations:** If filler words detected, recommend specific exercises. If freeze patterns detected, recommend targeted practice
- **POC Status:** Fully tested (6 samples, freeze detection working, feedback templates complete)

### Applied Skills Lab

- **Purpose:** Tactical communication drill practice
- **Drill types:** Labeling, Accusation Audit, Mirroring
- **How it works:**
  1. System presents a text prompt (conversational snippet, < 1 paragraph)
     Example: "I had a rough day at work today. I don't know how I'm going to handle the kids when I get home."
  2. User responds (text or voice transcribed to text)
     Example: "Seems like you're having a tough day."
  3. System evaluates: Did they identify the area of concern? Did they use proper technique?
  4. System provides suggestions and assessment in action language
  5. Repeat with next prompt for that specific skill
- **Tech:** Gemini 2.0 Flash (evaluate responses, generate suggestions)
- **No Hume.ai needed:** This is text-based assessment, no voice analysis required during drills
- **Planted questions:** VCM diagnostic questions embedded within drill sequences

### Simulation Studio

- **Purpose:** Full AI-powered conversation practice (closest to real interaction)
- **This is where the most diagnostic data comes from**
- **During session:** Gemini 2.5 Flash powers the AI opponent in real-time dialogue
- **Post-session:** Hume.ai batch analysis of user's recorded audio
- **Data feeds:** VCM diagnosis, Communication Index, skill-specific scores, recommendation engine
- **Features:** Scenario selection (salary negotiation, difficult conversation, sales pitch), difficulty levels, recording + playback
- **System analyzes:** Determines next best course of action based on simulation performance

### KDENZ Institute

- **Purpose:** Educational content --- video tutorials, framework learning
- **Tech:** YouTube unlisted embeds via iframe (simple, no backend needed)
- **Role in journey:** If system notices user is missing educational foundation for a skill, it recommends a specific video
- **Always accessible:** Not gated behind progression
- **Status:** Content creation TBD

### Performance Tracking

- **Communication Index:** Composite score (0-100), experimental
- **Components:** Stress, Confidence, Steadiness, Engagement (formula TBD, derived from KDENZ scores)
- **Visualization:** Time comparisons, filters by date/type, trend lines
- **Role:** Tracks the user's arc over time. Shows improvement. Visible on dashboard as single headline metric with trend arrow

---

## Action Language & Feedback System

### Principles

All feedback uses action language (MI-based):
- "We noticed X" not "You failed at X"
- "Here's a recommended session" not "You need to work on this"
- Observations, not evaluations
- Always lead with what went well, then growth areas
- Frame setbacks as discovery

### Examples

```
GOOD: "We noticed that you spoke 100 words per minute. Here's a
       recommended Voice Lab session that may help with pacing."

GOOD: "We noticed that when you label emotions at the end, your
       tone pitch increases, which may cause some people to feel
       like they're being questioned. You may want to try [specific
       Voice Lab exercise] to work on tone and pitch."

BAD:  "Your speaking pace is too slow."
BAD:  "You failed the labeling exercise."
BAD:  "You need to improve your confidence."
```

### Implementation Strategy (Data Flywheel)

1. **Phase 1 (Launch):** LLM generates action language in real-time, constrained by MI principles and feedback templates
2. **Phase 2 (Growth):** Track all generated feedback, build template library from best-performing responses
3. **Phase 3 (Scale):** Massive template library reduces LLM dependency; create custom scripts
4. **Phase 4 (Long-term):** Potentially train own language model on accumulated data

---

## Tech Stack (Final)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React + TypeScript | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Animation | Framer Motion | UI animations/transitions |
| Charts | Recharts | Data visualization, trends |
| Voice Analysis | Hume.ai Batch API | Post-session prosody, emotion, confidence analysis |
| LLM (fast/cheap) | Gemini 2.0 Flash | Transcript analysis, tactic detection, Applied Skills evaluation |
| LLM (roleplay) | Gemini 2.5 Flash | Simulation opponent dialogue (upgrade path to Claude Sonnet) |
| LLM (feedback) | Gemini 2.0 Flash | Action language generation (MI-constrained) |
| Diagnostic Engine | VCM (Python script or API) | Volitional failure diagnosis, decision tree |
| Video Hosting | YouTube (unlisted embeds) | KDENZ Institute tutorial videos |
| Deployment | Vercel | Hosting |
| Local Fallback | Python (Whisper + librosa + Praat) | Dev/offline voice analysis |

### Architecture: Two-Layer Analysis System

```
Layer 1: Hume.ai (Batch API --- post-session)
  - Prosody, emotion, confidence, stress, freeze detection
  - Runs AFTER session on recorded audio
  - Results stored to user profile for analytics and VCM input
  - Used in: Vocal Lab (primary), Simulation Studio (user voice scoring)

Layer 2: LLM (Real-time during sessions)
  - Tactic evaluation (Applied Skills drills)
  - Simulation opponent dialogue (Simulation Studio)
  - Action language feedback generation
  - VCM diagnostic question generation

Layer 3: VCM Diagnostic Engine (Post-session)
  - Decision tree: 4 gates (Awareness → Desire → Will → Action)
  - 5-9 root causes per gate
  - Fed by: Hume data + drill results + planted question responses + keywords
  - Outputs: Root cause diagnosis → mapped to recommended exercises
```

### Key Architecture Decision

Hume.ai is used for **batch/post-session analysis**, NOT real-time streaming. This is because:
- Batch API is already proven in the POC
- No streaming WebSocket latency concerns
- Significantly cheaper than streaming
- Richer analytics (full session analysis vs. real-time fragments)
- Gemini handles all real-time interaction needs

### Constraints Removed

- ~~Chrome-only~~ (support all modern browsers)
- ~~Light mode only~~ (dark mode now in scope)

---

## Cost Model (Revised --- Batch Hume.ai)

### Per-Session Estimates

| Session Type | Duration | Hume Batch | LLM Cost | Total |
|-------------|----------|------------|----------|-------|
| Vocal Performance Lab | 10 min | ~$0.10-0.20 | minimal | ~$0.10-0.20 |
| Applied Skills Lab | 10 min | --- | ~$0.01-0.03 | ~$0.01-0.03 |
| Simulation Studio | 15 min | ~$0.15-0.30 | ~$0.05-0.15 | ~$0.20-0.45 |

### Monthly Cost Per Active User (12 sessions/month)

```
~4 Vocal Lab sessions:      $0.40-0.80
~4 Applied Skills sessions:  $0.04-0.12
~4 Simulation sessions:      $0.80-1.80
─────────────────────────────────────────
Total:                       $1.24-2.72/user/month
```

**At $49/mo subscription: 3-6% COGS on API costs. Very healthy margin.**

---

## Hume.ai Research Findings

### Pricing (2026)

| Plan | Included Minutes | Overage/min | Concurrent Connections | RPM |
|------|-----------------|-------------|----------------------|-----|
| Free | 5 min/month | $0.06 | 1 | 15 |
| Starter ($29/mo) | 40 min/month | $0.05 | 5 | 15 |
| Pro | Higher allotment | $0.04 | 10 | 75 |
| Scale | Higher allotment | $0.04 | 20 | 150 |
| Business | Highest allotment | Custom | 30 | 225 |

### Technical Details

- **Browser SDK:** Direct JS/TypeScript SDK available (if streaming needed later)
- **Batch API:** Already proven in POC, primary integration path
- **Audio format:** PCM 16kHz mono
- **Emotion model:** 48+ dimensions mapped to 5 KDENZ categories
- **Latency:** N/A for batch (runs post-session)

### Limitations Confirmed

- Expression Measurement is **prosody/acoustic only**
- Cannot detect conversational tactics (mirroring, labeling, tactical empathy)
- Provides transcripts but no tactic classifier
- Separate NLP/LLM layer required for content analysis

---

## LLM Research Findings

### Pricing (2026, per 1M tokens)

| Model | Input | Output | Latency (TTFT) | Best For |
|-------|-------|--------|----------------|----------|
| Gemini 2.0 Flash | $0.10 | $0.40 | <0.5s | Transcript analysis, tactic detection, feedback |
| Gemini 2.5 Flash | $1.25 | $10.00 | 0.5-1.5s | Roleplay opponent (budget) |
| GPT-4o-mini | ~$0.25 | ~$2.00 | <0.3s | Transcript analysis (alternative) |
| GPT-4o | ~$3.00 | ~$12.00 | 0.3-1.0s | Roleplay (premium) |
| Claude Haiku | $0.80 | $2.40 | <0.3s | Transcript analysis (alternative) |
| Claude Sonnet | $3.00 | $15.00 | 0.5-1.0s | Roleplay (premium quality) |

### Recommended Split

- **Transcript/tactic analysis + feedback generation:** Gemini 2.0 Flash
- **Simulation opponent:** Gemini 2.5 Flash
- **Upgrade path:** Claude Sonnet if roleplay quality needs improvement

---

## Design System: "High-Performance Clinical"

### Colors

```
Background:   #FFFFFF (white)
Buttons:      #000000 (black)
Accent:       #00D4FF (electric teal/cyan)
Vibe:         Peloton energy + Apple Health precision
```

### Extended Palette

```css
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F5;
--button-primary: #000000;
--button-secondary: transparent;
--accent: #00D4FF;
--text-primary: #111827;
--text-secondary: #6B7280;
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### Typography

- Font: Inter or SF Pro
- Weights: 600 (headings), 400 (body)
- Sizes: H1: 32px, H2: 24px, H3: 20px, Body: 16px, Small: 14px, Tiny: 12px

### Spacing

- 8pt grid: 4 / 8 / 16 / 24 / 32 / 48 / 64 px

### Components

- Primary button: strong CTA (black)
- Secondary button: outlined
- Cards: rounded, subtle elevation
- Icons: consistent set
- Touch targets: min 44x44px

### Contrast Validation

- Black text (#111827) on white (#FFFFFF): 8:1 ratio (passes WCAG AA)
- Teal accent (#00D4FF) on white: ~4.8:1 ratio (just meets 4.5:1 --- verify in design tools)

---

## UX & Behavioral Design Principles

### 1. Performance Data vs. Practice (80/20 Rule)

- 80% practice surface, 20% data
- Dashboard default: clear "Start Practice" CTA above the fold
- One headline metric (Communication Index) with trend arrow
- Metrics are pull, not push --- users tap in when curious
- Post-session is the right time for data
- Never gate practice behind analytics (1-2 clicks from login to practicing)

### 2. AI Recommendations: Helpful, Not Intrusive

- Passive placement: under a "Recommendations" section
- Contextual timing: after sessions, not mid-practice
- Adaptive style: tests approach A (subtle) vs B (light explanation) per user
- User override: "Not now" --- never repeat ignored recommendations
- Gradual personalization: start generic, get smarter over time
- Framed as advancement, not remediation

### 3. Psychological Principles for Dashboard

1. **Self-Determination Theory (SDT):** Autonomy, Competence, Relatedness
2. **Zeigarnik Effect:** Show incomplete progress ("3/5 drills this week")
3. **Peak-End Rule:** End sessions on a positive note
4. **Variable Ratio Reinforcement:** Occasional surprise insights
5. **Cognitive Load Theory:** Max 3-5 data points at a glance, progressive disclosure

### 4. Habit Formation (Fogg Behavior Model)

- Lower ability barriers: quick 3-5 min drills, one-tap practice, resume where left off
- Internal prompts > external prompts: streak counters (not shaming), user-set practice windows
- Avoid: guilt notifications, mandatory daily goals, losing progress for inactivity
- Do: "Welcome back" warmth, cumulative progress display, graceful streak breaks

### 5. Gamification

**Use:** Communication Index, skill badges (milestones), progress bars, soft streaks
**Avoid:** Points/coins, leaderboards, loot boxes, forced challenges
**TBD (test with beta users):** Unlock system, weekly challenges

### 6. Progression

- New challenges unlock based on level
- Skill levels tracked in background (badge visibility TBD based on beta feedback)
- No forced sequence --- users can explore, system recommends
- The stack framing (Voice + Skills + Simulation) sets expectations from day 1

### 7. Handling Setbacks

- Action language only --- observations, not evaluations
- Lead with what went well
- Compare to self, never others
- Frame setbacks as discovery
- Normalize struggle
- Never: red/negative colors, "failed" language, mandatory remediation

---

## POC Summary (Hume.ai --- Tested & Working)

### What Was Tested

- Hume Batch API for prosody analysis (48-emotion model)
- Local fallback pipeline (Whisper + librosa + Praat)
- Freeze detection (stress spikes + confidence drops)
- Emotional arc visualization
- Recovery time computation
- 6 neuroscience-grounded detection rules
- Neuroscience-to-feedback mapping framework
- 6 audio samples analyzed with real results

### Key POC Files

- `kdenz-poc/hume_voice_analyzer.py` --- Hume AI integration
- `kdenz-poc/local_voice_analyzer.py` --- Local fallback pipeline
- `kdenz-poc/feedback_mapping.py` --- Neuroscience-to-feedback templates
- `kdenz-poc/results/` --- 6 sample analysis results

### Detection Rules (from feedback_mapping.py)

1. Freeze Response (Arnsten 2009, amygdala hijack)
2. Sustained Vocal Tension (Porges 2007, polyvagal theory)
3. Low Vocal Confidence (Klofstad 2012, vocal prosody perception)
4. Strong Recovery Capacity (vagal brake efficiency)
5. Emotional Regulation (vagal tone stability)
6. Speaking Pace Pattern (Ericsson 1993, deliberate practice)

---

## Open Items

### Design Decisions (No Research Needed)

1. **Communication Index formula** --- derive composite from 4 KDENZ scores once more sample data exists
2. **Intake question design** --- 3-4 questions that capture goals AND voice baseline subtly
3. **VCM decision tree implementation** --- codify the 4 gates and root causes into executable logic
4. **Applied Skills prompt library** --- create conversational scenarios for each drill type
5. **Simulation scenario library** --- define initial scenarios and difficulty levels
6. **KDENZ Institute content** --- video curriculum planning
7. **Badge/level visibility** --- TBD based on beta user feedback
8. **Mobile layout specifics** --- define responsive breakpoints
9. **Dark mode design** --- design system tokens needed

### Technical Decisions

1. **VCM runtime:** Python script vs API endpoint
2. **User profile schema:** What data structures store the diagnosis, skill levels, recommendation history
3. **Hume.ai plan selection:** Starter ($29/mo) for private beta, scale as users grow
4. **Audio recording/storage:** How session audio is captured, stored, and sent to Hume batch

---

## Source Documents

- `docs/archive/DENZ_Communication_Platform_Spec.md` --- Original platform spec
- `kdenz-poc/` --- Proof of concept code and results
- `kdenz-poc/KDENZ_Voice_POC_Explanation.docx` --- POC documentation
- `kdenz-poc/feedback_mapping.py` --- Neuroscience-to-feedback mapping framework
