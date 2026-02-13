# KDENZ Voice Lab — Complete Screen-by-Screen User Flow

**Version:** 1.0 Draft
**Date:** 2026-02-11
**Source:** KDENZ_UX_Flow_Handoff.md + kadenzphase2.json (51 techniques)
**Design System:** High-Performance Clinical (Light mode, #000 buttons, #00D4FF accent)

---

## Navigation Structure (Global)

### Bottom Nav (Mobile-First, Always Visible)

| Icon | Label | Destination | Notes |
|------|-------|-------------|-------|
| Home | Home | Home / Dashboard | Returning user landing |
| Grid | Practice | Scenario Library | Browse & filter all 51 techniques |
| Book | Learn | Educational Content | Framework overviews + technique breakdowns |
| Chart | Progress | Progress Dashboard | Trends, streaks, mastery tracking |
| User | Profile | Settings & Account | Preferences, subscription, voice settings |

### Top Bar (Persistent)

- **Left:** KDENZ wordmark (taps to Home)
- **Right:** Notification bell (session reminders, new content, pattern insights after session 4+), Settings gear

### Differentiator vs. Yoodli
> Yoodli has a left-rail desktop nav with "Practice" button but no Learn section, no filtering, and a stale home page. KDENZ is mobile-first with educational content as a first-class nav item.

---

## Screen 1: First-Time User Experience (Onboarding)

### 1A. Welcome / Value Prop (Screen 1 of 4)

**Purpose:** Establish what KDENZ is and set expectations.

**What's Visible:**
- Full-bleed dark gradient background with subtle waveform animation
- Headline: **"Master the voice behind the words"**
- Subhead: "Practice negotiation and influence techniques with AI-powered voice coaching. 51 techniques from 5 world-class frameworks."
- 5 small framework author avatars/icons in a row (Voss, Camp, Belfort, Bustamante, Ury)
- CTA button: **"Get Started"** (black, full-width)
- Below CTA: "Already have an account? Sign in"

**User Actions:**
- Tap "Get Started" → Screen 1B
- Tap "Sign in" → Sign In screen

---

### 1B. What Brings You Here? (Screen 2 of 4)

**Purpose:** Lightweight intent capture. Not diagnostic — just enough to personalize the first session recommendation.

**What's Visible:**
- Headline: **"What are you working on?"**
- Subhead: "Pick your primary focus. You can change this anytime."
- 4 selection cards (single-select, tap to select):

| Card | Maps To |
|------|---------|
| "Salary & job negotiations" | categories: closing, strategy, objection_handling |
| "Difficult conversations at work" | categories: empathy, self_management, assertiveness |
| "Sales & client conversations" | categories: tonality, opening, engagement, closing |
| "Leadership & influence" | categories: rapport, intelligence, framing, questioning |

- CTA: **"Continue"** (activates after selection)
- Skip link: "Skip for now"

**User Actions:**
- Select one card → "Continue" activates → Screen 1C
- "Skip for now" → Screen 1C with no focus stored

**Data Stored:** `user.primary_focus` — used for initial Home recommendations and library sort order.

---

### 1C. Experience Level (Screen 3 of 4)

**Purpose:** Calibrate difficulty for first recommendation.

**What's Visible:**
- Headline: **"Have you studied negotiation techniques before?"**
- 3 selection cards:

| Card | Maps To |
|------|---------|
| "I'm new to this" | Default filter: `difficulty: beginner` |
| "I've read a book or two" | Default filter: `difficulty: intermediate` |
| "I practice regularly" | Default filter: `difficulty: advanced` |

- CTA: **"Continue"**

**User Actions:**
- Select one → "Continue" → Screen 1D

**Data Stored:** `user.experience_level` — sets initial difficulty filter in library and first recommendation.

---

### 1D. Voice Setup & Permissions (Screen 4 of 4)

**Purpose:** Grant microphone access and set voice baseline expectations.

**What's Visible:**
- Headline: **"Let's set up your voice"**
- Subhead: "KDENZ needs microphone access to analyze your practice sessions. All audio is processed in real-time and never stored on our servers."
- Microphone icon with animated pulse ring
- CTA: **"Enable Microphone"** → triggers browser permission dialog
- Privacy note: "Read our privacy commitment" (links to /privacy)
- After permission granted:
  - Checkmark animation
  - Text changes to: "You're all set. Let's find your first technique to practice."
  - CTA: **"Start Practicing"** → Home Screen (Screen 8) with first-session state

**User Actions:**
- "Enable Microphone" → browser permission → success state → "Start Practicing" → Home
- If denied: explain why mic is required, offer "Try Again" + "Learn More"

### Differentiator vs. Yoodli
> Yoodli requires camera. KDENZ is voice-only — lower barrier to entry, practice anywhere (commute, car, walking). This screen makes that advantage explicit.

---

## Screen 2: Scenario Library

**Purpose:** Browse, filter, and select from 51 techniques across 5 frameworks. This is the primary discovery surface.

### What's Visible

**Top Section:**
- Screen title: **"Practice"**
- Search bar: "Search techniques..." (searches `technique_name`, `description`, `framework`)
- Filter pills (horizontally scrollable):

| Filter Type | Options | Source Field |
|-------------|---------|-------------|
| Framework | All, Voss, Camp, Belfort, Bustamante, Ury | `framework` |
| Difficulty | All, Beginner, Intermediate, Advanced | `difficulty` |
| Category | All, + 17 categories | `category` |
| Status | All, New, Practiced, Mastered | user progress data |

- Active filters shown as dismissible chips below the pill row
- Sort dropdown (right-aligned): Recommended (default), Difficulty, Framework, Recently Practiced

**Card Grid (2-column on mobile, 3-column on tablet+):**

Each technique card shows:

```
┌─────────────────────────────┐
│ [Framework Badge]  [Diff.]  │  ← e.g., "VOSS" in teal + "Beginner"
│                             │
│ Mirroring                   │  ← technique_name
│                             │
│ Repeating the last 1-3      │  ← description (truncated to 2 lines)
│ critical words...           │
│                             │
│ [Rapport]        [60s]      │  ← category badge + duration
│                             │
│ ┌─────────────────────────┐ │
│ │    Practice             │ │  ← CTA button
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Card Data Mapping:**

| Card Element | Source Field |
|-------------|-------------|
| Framework badge | `framework` → display name (e.g., "VOSS", "CAMP") |
| Difficulty indicator | `difficulty` → color-coded dot or label |
| Title | `technique_name` |
| Description preview | `description` (first ~80 chars) |
| Category badge | `category` (humanized: "rapport" → "Rapport") |
| Duration | `duration_seconds` → "60s" / "90s" |
| Practice button | Links to Screen 3 (Scenario Detail) |
| Progress indicator | Overlay checkmark or mastery ring if previously practiced |

**Empty/Filtered States:**
- No results: "No techniques match your filters. Try broadening your search."
- First visit: Cards sorted by `user.primary_focus` mapping + `user.experience_level` difficulty match, with "Recommended for you" section at top

**User Actions:**
- Tap filter pill → toggles filter, cards update instantly
- Tap search → keyboard opens, results filter as-you-type
- Tap card anywhere → Screen 3 (Scenario Detail)
- Tap "Practice" button on card → Screen 3 (Scenario Detail), scrolled to practice CTA
- Pull to refresh → re-sorts by recommendation engine

### Differentiator vs. Yoodli
> Yoodli has 30+ scenarios with NO filtering, NO difficulty levels, NO time estimates, and category badges that look clickable but aren't. KDENZ has full filtering across 4 dimensions, clear difficulty indicators, duration on every card, and progress tracking overlays.

---

## Screen 3: Scenario Detail / Pre-Session Briefing

**Purpose:** Prepare the user BEFORE they practice. This is the highest-value differentiator — no competitor does pre-session briefing.

### What's Visible

**Header Section:**
- Back arrow → Library
- Framework badge + Author name (e.g., "Chris Voss — Never Split the Difference")
- Technique name (large): e.g., **"Calibrated Questions"**
- Difficulty badge + Category badge + Duration
- Mastery indicator if previously practiced (e.g., "Practiced 3x" or mastery ring)

**Tabbed Content Area (2 tabs):**

#### Tab 1: "Briefing" (Default)

```
┌─────────────────────────────────────┐
│ WHAT THIS IS                         │
│                                      │
│ [description field — full text]      │
│                                      │
│ Open-ended 'how' and 'what'          │
│ questions that give the other side   │
│ the illusion of control while        │
│ guiding them toward your solution.   │
│ Never use 'why' (triggers            │
│ defensiveness).                      │
├─────────────────────────────────────┤
│ WHAT SUCCESS LOOKS LIKE              │
│                                      │
│ ✓ Questions start with 'how' or     │
│   'what' (never 'why')              │
│ ✓ Questions are genuinely open-     │
│   ended, not disguised statements   │
│ ✓ Tone is collaborative, not       │
│   confrontational                   │
│ ✓ Questions put the problem on the  │
│   other side to solve               │
│ ✓ Avoids 'can,' 'is,' 'do'         │
│   questions (yes/no closers)        │
├─────────────────────────────────────┤
│ COMMON MISTAKES                      │
│                                      │
│ ✗ Using 'why' ('Why is it so       │
│   expensive?' — triggers            │
│   defensiveness)                    │
│ ✗ Asking leading questions that     │
│   are really statements             │
│ ✗ Tone that sounds accusatory       │
│   rather than genuinely curious     │
│ ✗ Asking too many questions in      │
│   rapid succession (interrogation)  │
│ ✗ Not pausing after the question    │
├─────────────────────────────────────┤
│ SESSION STRUCTURE                    │
│                                      │
│ [structure field — timing breakdown] │
│                                      │
│ "State the scenario briefly →       │
│  ask first calibrated question →    │
│  pause → ask second → pause →       │
│  optionally a third"                │
├─────────────────────────────────────┤
│ PAIRS WELL WITH                      │
│                                      │
│ [Horizontal scroll of linked cards] │
│ → Mirroring (voss-01)               │
│ → Labeling (voss-02)                │
│ → "That's Right" Trigger (voss-07)  │
└─────────────────────────────────────┘
```

**Data Mapping:**

| Section | Source Field |
|---------|-------------|
| What This Is | `description` |
| What Success Looks Like | `success_criteria` array → rendered as checklist |
| Common Mistakes | `common_mistakes` array → rendered as warning list |
| Session Structure | `structure` |
| Pairs Well With | `pairs_well_with` → resolve IDs to names, render as tappable cards |

#### Tab 2: "Learn"

- Short educational breakdown of the technique (content from Learn section — see Screen 7)
- Framework context: which book/author, core philosophy
- "Watch Explainer" button if video exists (links to Learn section video)
- Before/after dialogue example showing the technique in action
- Placeholder state if content not yet produced: "Written breakdown coming soon. Practice first — the feedback will teach you."

**Bottom Sticky CTA:**

```
┌─────────────────────────────────────┐
│                                      │
│  ▶  Start Practice          [60s]   │
│                                      │
└─────────────────────────────────────┘
```

- Black button, full-width, fixed to bottom
- Shows duration from `duration_seconds`
- Tapping → Screen 4 (Practice)

**User Actions:**
- Tap "Briefing" / "Learn" tabs → switch content
- Tap paired technique card → navigates to that technique's detail screen
- Tap "Start Practice" → Screen 4 (Practice Screen)
- Tap "Watch Explainer" → Learn section video player
- Swipe back or tap back arrow → Library

### Differentiator vs. Yoodli
> Yoodli has a 1-sentence description and jumps straight to practice. No success criteria, no common mistakes, no session structure, no educational content, no paired technique recommendations. KDENZ gives users a complete briefing so they know what "good" looks like before they speak.

---

## Screen 4: Practice Screen (During Session)

**Purpose:** The core practice experience. Voice-only (no video). User speaks through the scenario prompt with real-time visual feedback.

### Pre-Practice Countdown (3 seconds)

**What's Visible:**
- Full-screen dark overlay
- Large countdown: **3... 2... 1...**
- Technique name centered below countdown
- Prompt preview below technique name (first line of `practice_prompt`)
- "Cancel" link in top-left

### Active Practice State

**What's Visible:**

```
┌─────────────────────────────────────┐
│ [X Close]          Calibrated       │
│                    Questions        │
│                              01:00  │  ← countdown timer
│                                      │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │         [SessionOrb]            │ │  ← Reuse from v1.0
│ │      Volume-reactive glow       │ │     Accent color (#00D4FF)
│ │      Brightness = loudness      │ │     Pulses with speech
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │ YOUR PROMPT                     │ │
│ │                                 │ │
│ │ Your vendor just quoted a price │ │  ← practice_prompt (scrollable)
│ │ 40% over budget. Instead of     │ │
│ │ saying 'That's too expensive,'  │ │
│ │ use calibrated questions...     │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                      │
│ ┌─────────────────────────────────┐ │
│ │        ⏹ End Session            │ │  ← Ends early if desired
│ └─────────────────────────────────┘ │
│                                      │
│ WPM: 132      Fillers: 2            │  ← Real-time metrics (subtle)
└─────────────────────────────────────┘
```

**Real-Time Feedback Elements (Non-Intrusive):**
- **SessionOrb:** Volume-reactive, accent color (#00D4FF). Visual heartbeat of the session. Reused from v1.0 codebase.
- **Timer:** Counts down from `duration_seconds` (60s default). Visual change at 10s remaining (pulse or color shift).
- **WPM counter:** Small, bottom-left. Updates every 5 seconds.
- **Filler counter:** Small, bottom-right. Increments on detection.
- **Silence nudge:** If 10+ seconds of silence, gentle prompt appears: "Take your time. When you're ready, continue."

**Research Note:** Feedback during practice is post-session (per competitive research validation). The WPM/filler counters are minimal ambient metrics, not evaluative feedback. The SessionOrb provides visual confirmation the mic is working without judgment.

**Session End Behavior:**
- Timer hits 0:00 → brief "Session Complete" animation → auto-advance to Screen 5
- User taps "End Session" → confirmation: "End session early?" → Yes → Screen 5 / No → continue
- Tap [X] → "Discard this session?" → Yes → Library / No → continue

**User Actions:**
- Speak through the prompt
- Tap "End Session" → ends early → Screen 5
- Tap [X] → discard and return to Library
- Scroll prompt area if practice_prompt is long

### Differentiator vs. Yoodli
> Yoodli requires video and has AI that responds in real-time (auto-respond toggle). KDENZ is voice-only (lower barrier), single-player (no AI persona responding), and provides the full scenario prompt up front so users can focus entirely on technique execution. Feedback is post-session only — validated by research to reduce self-consciousness.

---

## Screen 5: Feedback / Analysis Screen (Post-Session)

**Purpose:** Show what happened and how to improve. Split into strategic feedback (technique execution) and voice analytics (delivery mechanics). This is where KDENZ fundamentally differentiates.

### Top Section

- Technique name + framework badge
- Session date/time + duration
- Overall assessment badge (see below)

### Overall Assessment

A single summary line that synthesizes strategic + voice performance:

```
┌─────────────────────────────────────┐
│                                      │
│  "Strong technique execution.        │
│   Your calibrated questions were     │
│   well-formed. Work on pausing       │
│   after each question to let it      │
│   land."                             │
│                                      │
│  — AI Coaching Summary               │
│                                      │
└─────────────────────────────────────┘
```

Generated by Gemini API using: `success_criteria` + `common_mistakes` + transcript + voice metrics. Button-triggered on first load to manage API costs (same pattern as v1.0).

### Tabbed Content (3 Tabs)

#### Tab 1: "Coaching" (Default)

**Strategic Feedback — What you SAID (KDENZ exclusive)**

```
TECHNIQUE EXECUTION

✓ Used 'how' and 'what' openers          — Hit
✓ Questions were genuinely open-ended     — Hit
△ Could pause longer after questions      — Partial
✗ Asked a 'why' question at 0:34         — Miss
✗ Questions came too rapidly (3 in 12s)  — Miss

Score: 3/5 criteria met
```

**How it works:** AI evaluates the transcript against `success_criteria` and `common_mistakes` arrays. Each criterion is scored as Hit / Partial / Miss with timestamp references where applicable.

**Coaching Insight (AI-generated):**
- 1-2 paragraph narrative explaining what worked, what to focus on next
- References specific moments in the session
- Suggests paired technique if relevant: "Now that you're getting comfortable with calibrated questions, try pairing them with Tactical Silence (voss-08) — the pause after the question is where the magic happens."

#### Tab 2: "Voice Analytics"

**Delivery Feedback — How you SOUNDED**

```
DELIVERY METRICS

Pace
├─ Average WPM: 142 (Target: 130-150)    ✓ In range
├─ Variation: ±18 WPM                     ✓ Natural variation
└─ [Pacing line chart over session duration]

Fillers
├─ Total: 4 (um ×2, like ×1, you know ×1)
├─ Rate: 3.2 per minute
└─ [Filler timeline markers on session scrubber]

Tone & Energy
├─ Confidence: Steady                     ✓
├─ Pitch stability: Good                  ✓
├─ Energy level: Moderate
└─ [Pitch contour visualization]

Silence
├─ Strategic pauses: 2
├─ Avg pause duration: 2.1s
└─ Longest pause: 4.3s at 0:41
```

**Pacing Variation Chart:** Line chart showing WPM over time with target band (shaded zone). Same pattern Yoodli uses — validated as genuinely useful.

#### Tab 3: "Transcript"

- Full transcript with timestamps
- Toggle highlights:
  - **Fillers** — highlighted in accent color with tap-to-seek
  - **Technique moments** — highlighted where success_criteria were detected
- Audio playback bar at top with scrub, speed control (0.75x, 1x, 1.25x, 1.5x)
- Tap any timestamp → audio jumps to that moment

### Bottom Actions

```
┌──────────────┐  ┌──────────────┐
│  Practice     │  │  Next         │
│  Again        │  │  Technique    │
└──────────────┘  └──────────────┘
```

- **Practice Again** → Screen 4 with same technique
- **Next Technique** → Screen 3 for the first `pairs_well_with` technique, or AI-recommended next based on performance

**Session-to-Session Comparison (if practiced before):**
- "vs. Last Attempt" toggle appears at top
- Shows delta metrics: "WPM: 142 (↓8 from last)", "Fillers: 4 (↓2 from last)", "Criteria met: 3/5 (↑1)"
- Trend sparkline for criteria-met score across attempts

### Differentiator vs. Yoodli
> Yoodli has coaching (qualitative) + analytics (quantitative) tabs but ALL feedback is delivery mechanics. Zero strategic feedback. No evaluation of whether what you said was effective for the technique. No success criteria scoring. No session comparison. No "what to practice next" recommendation. KDENZ scores technique execution against the actual success criteria from the scenario database — this is the core product differentiation.

---

## Screen 6: Progress / Dashboard

**Purpose:** Show improvement over time across sessions, techniques, and frameworks. Motivate continued practice through visible progress.

### What's Visible

**Hero Metric:**
```
┌─────────────────────────────────────┐
│                                      │
│    Sessions This Week: 4             │
│    ████████░░░░░░ 4 of 7 goal        │
│                                      │
│    Current Streak: 3 days            │
│                                      │
└─────────────────────────────────────┘
```

**Section 1: Framework Mastery**

Visual progress rings for each framework:

```
  [Voss]    [Camp]   [Belfort] [Bustamante] [Ury]
   4/12      2/10     1/10       0/10       1/9
   ████░     ██░░     █░░░       ░░░░       █░░░
```

- Ring fills as techniques are practiced
- Inner number: practiced / total
- Tap a ring → filters to that framework's techniques (→ Library filtered)
- Color: framework-specific accent or neutral until started

**Section 2: Skill Map**

Horizontal bar chart showing category strength:

```
Category Performance (across all sessions)

Rapport        ████████████░░░   Strong
Empathy        ██████████░░░░░   Developing
Tonality       ████████░░░░░░░   Developing
Questioning    ██████░░░░░░░░░   Building
Strategy       ████░░░░░░░░░░░   New
Closing        ██░░░░░░░░░░░░░   New
...
```

- Based on average criteria-met scores across sessions in each category
- Tap a bar → shows techniques in that category with individual scores

**Section 3: Recent Sessions**

Scrollable list of last 10 sessions:

```
Today, 2:34 PM
Calibrated Questions (Voss)
Score: 3/5 criteria  •  WPM: 142  •  Fillers: 4
[View Feedback →]

Yesterday, 9:15 AM
Mirroring (Voss)
Score: 5/5 criteria  •  WPM: 128  •  Fillers: 1  ★ Mastered
[View Feedback →]
```

- Tap any session → Screen 5 (Feedback for that session)

**Section 4: Weekly Trend Chart**

Line chart showing key metrics over the last 4 weeks:
- Average criteria-met percentage
- Average filler rate
- Sessions per week
- Toggleable lines (tap legend to show/hide)

**Section 5: Achievements (Future — v1.1+)**
- Placeholder: "Achievements coming soon"
- Maps to pending todo: gamification system (streaks, badges)

### Differentiator vs. Yoodli
> Yoodli has no session-to-session comparison, no framework mastery tracking, no skill category breakdown, no trend charts. Their dashboard is mostly empty state for low-frequency users. KDENZ shows meaningful progress from session 1 and gets richer as users practice more.

---

## Screen 7: Learn Section

**Purpose:** Educational content tied directly to practice. Learn the technique, then practice it. Education and practice are not separate — they're one flow.

### What's Visible

**Top Section:**
- Screen title: **"Learn"**
- Tab bar: **Frameworks** | **Techniques** | **Quick Reference**

#### Frameworks Tab (Default)

5 framework cards, each expandable:

```
┌─────────────────────────────────────┐
│ [Author Photo]                       │
│                                      │
│ Chris Voss                           │
│ Never Split the Difference           │
│                                      │
│ "Negotiation is not about being      │
│  nice or being tough — it's about    │
│  understanding and leveraging        │
│  emotions to reach better outcomes." │
│                                      │
│ 12 techniques  •  5 beginner         │
│                                      │
│ [▶ Watch Overview]  [Browse →]       │
└─────────────────────────────────────┘
```

**Data Mapping:**

| Element | Source |
|---------|--------|
| Author name | `frameworks[id].name` (split on " — ") |
| Book title | `frameworks[id].name` (split on " — ") |
| Philosophy quote | `frameworks[id].core_philosophy` |
| Technique count | `frameworks[id].technique_count` |
| Beginner count | Computed from techniques where `framework` matches and `difficulty === "beginner"` |

- **"Watch Overview"** → Video player (5 framework overview videos — launch priority content)
- **"Browse"** → Library filtered to that framework

#### Techniques Tab

Alphabetical/framework-grouped list of all 51 techniques with educational content:

```
┌─────────────────────────────────────┐
│ Mirroring                    VOSS   │
│ Beginner  •  Rapport  •  60s       │
│                                      │
│ [Read Breakdown]  [Practice →]      │
└─────────────────────────────────────┘
```

- **"Read Breakdown"** → Expands inline or opens detail view with:
  - Full `description`
  - `coaching_notes` (written as educational narrative)
  - Before/after dialogue example (editorial content, not from JSON)
  - Link to framework overview
- **"Practice"** → Screen 3 (Scenario Detail) for this technique

#### Quick Reference Tab

Cheat sheets / summary cards:
- "5 Calibrated Questions You Should Memorize" (Voss)
- "The RICE Framework at a Glance" (Bustamante)
- "Yes-No-Yes: The Positive No Structure" (Ury)
- "Straight Line Certainty Scale" (Belfort)
- "Camp's Pre-Negotiation Checklist" (Camp)

Downloadable / saveable for offline reference.

**User Actions:**
- Switch tabs
- Tap framework card → expand or navigate
- Tap "Watch Overview" → video player
- Tap "Read Breakdown" → technique educational content
- Tap "Practice" → Scenario Detail (Screen 3)

### Differentiator vs. Yoodli
> Yoodli has zero educational content. No framework explanations, no technique breakdowns, no "what good looks like" examples. Users are expected to already know what they're practicing. KDENZ integrates learning and practice: understand the technique, see an example, then practice it with AI feedback scored against the criteria you just learned.

---

## Screen 8: Home Screen (Returning User)

**Purpose:** Personalized landing page that answers "What should I practice next?" within 3 seconds.

### First-Time Home (Sessions 0)

```
┌─────────────────────────────────────┐
│                                      │
│  Welcome to KDENZ                    │
│                                      │
│  Start with a technique that         │
│  matches your focus.                 │
│                                      │
│  RECOMMENDED FOR YOU                 │
│                                      │
│  [Technique Card]                    │  ← Based on onboarding answers
│  [Technique Card]                    │     Filtered by focus + difficulty
│  [Technique Card]                    │
│                                      │
│  or [Browse All 51 Techniques →]    │
│                                      │
└─────────────────────────────────────┘
```

### Returning Home (Sessions 1-3)

```
┌─────────────────────────────────────┐
│                                      │
│  Good morning, Randy                 │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ CONTINUE WHERE YOU LEFT OFF     │ │
│  │                                 │ │
│  │ Labeling (Voss)                 │ │
│  │ Practiced 2x  •  Best: 4/5     │ │
│  │                                 │ │
│  │ [Practice Again]  [View Tips]   │ │
│  └─────────────────────────────────┘ │
│                                      │
│  RECOMMENDED NEXT                    │
│                                      │
│  Based on your progress with         │
│  Mirroring and Labeling:             │
│                                      │
│  [Accusation Audit — Voss]           │  ← pairs_well_with from
│  [Late-Night FM DJ Voice — Voss]     │     last practiced techniques
│  ["That's Right" Trigger — Voss]     │
│                                      │
│  TRY A NEW FRAMEWORK                 │
│                                      │
│  [Nurturing "No" — Camp]             │  ← Beginner technique from
│  [RICE: Reward — Bustamante]         │     unpracticed frameworks
│                                      │
│  YOUR WEEK                           │
│                                      │
│  Sessions: 3  •  Streak: 2 days     │
│  [View Progress →]                   │
│                                      │
└─────────────────────────────────────┘
```

**Recommendation Engine Logic:**
1. **Continue:** Last practiced technique if not yet mastered (< 5/5 criteria)
2. **Recommended Next:** `pairs_well_with` from techniques with highest mastery → filter to unpracticed ones
3. **New Framework:** Beginner techniques from frameworks the user hasn't tried yet
4. **Weekly summary:** Session count, streak, link to Progress

### Returning Home (Sessions 4-5+, VCM Active)

Same as above but with an additional section (see Screen 9).

**User Actions:**
- Tap any technique card → Screen 3 (Scenario Detail)
- Tap "Practice Again" → Screen 4 (Practice) directly
- Tap "View Tips" → Screen 3 Learn tab
- Tap "View Progress" → Screen 6 (Progress)
- Pull to refresh → updates recommendations

### Differentiator vs. Yoodli
> Yoodli's home page has a stale "What's New" section and a generic carousel. No personalized recommendations, no continuation of last session, no cross-framework suggestions. KDENZ home is a personalized coach that knows what you practiced, what you're ready for, and what to try next.

---

## Screen 9: Session 4-5+ Experience (VCM Watchdog Active)

**Purpose:** When the VCM watchdog has enough data to detect patterns, the product subtly shifts to provide deeper, pattern-based insights. The user experiences this as "the app getting smarter" — never as diagnostic output.

### What Changes (Invisible to User — No VCM Labels Ever Shown)

**Behind the scenes:**
- Sessions 1-3: VCM scores gates silently. Voice data stored. No pattern output.
- Sessions 4-5: Watchdog checks for consistent gate patterns. Hypothesis forms if a gate fails at 60%+ activation frequency with sufficient confidence.
- Sessions 5+: Verified patterns begin influencing recommendations and feedback.

### Home Screen Addition (Session 5+)

A new card appears in the Home feed between "Recommended Next" and "Try a New Framework":

```
┌─────────────────────────────────────┐
│ 🎯 PATTERN INSIGHT                  │
│                                      │
│ Across your last 5 sessions,         │
│ we've noticed you tend to speed up   │
│ when making your key ask — your      │
│ pace jumps 40% in the final 15       │
│ seconds. Techniques that train       │
│ deliberate pacing could help:        │
│                                      │
│ [Tactical Silence — Voss]            │
│ [Strategic Pause — Bustamante]       │
│ [Late-Night FM DJ Voice — Voss]      │
│                                      │
│ "These are selected based on your    │
│  voice patterns, not just your       │
│  practice history."                  │
│                                      │
└─────────────────────────────────────┘
```

**How VCM Maps to Surface Language:**

| VCM Gate | What User Sees (Observation Language) | Recommended Techniques |
|----------|--------------------------------------|----------------------|
| C0 (Environmental) | "Your energy tends to drop in the second half of sessions" | belfort-05 (State Management), ury-01 (Going to the Balcony) |
| C1 (Belief) | "You hedge more when making confident statements about yourself" | belfort-03 (Three Tens / certainty), camp-02 (No Neediness) |
| C2 (Desire) | "Your engagement drops when discussing long-term commitments" | camp-03 (Mission and Purpose), camp-09 (Fueling Their Vision) |
| C3 (Will/Cost) | "Your stress markers increase when the scenario involves sacrifice or trade-offs" | camp-05 (Budgeting), camp-06 (Stripping Expectations) |
| C4 (Intention) | "You tend to be vague about next steps and timelines" | voss-12 (Rule of Three), belfort-10 (Straight Line Close) |
| C5 (Commitment) | "You show more energy exploring alternatives than committing to one path" | ury-07 (Positive No), ury-06 (BATNA Development) |
| C6A (Action Onset) | "You tend to pause longest right before the key moment in the technique" | bustamante-09 (Strategic Pause), voss-08 (Tactical Silence) |
| C6B (Sustained Action) | "Your vocal energy fades toward the end of sessions" | belfort-05 (State Management), belfort-07 (Pattern Interrupts) |

### Feedback Screen Addition (Session 5+)

On Screen 5 (Feedback), a new section appears below the Coaching tab content:

```
PATTERN CONTEXT

This session fits a pattern we've seen across
your practice: [observation]. This is common —
[normalization]. The techniques below are
specifically chosen to help:

[Paired technique recommendations]
```

### Recommendation Engine Shift

Starting session 5+, the recommendation engine on Home (Screen 8) weights VCM-detected patterns:

- **Before VCM:** Recommendations based on `pairs_well_with` + category diversity + difficulty progression
- **After VCM:** Recommendations weighted toward techniques that address the detected gate pattern, drawn from the mapping table above

The user experiences this as recommendations getting "more relevant" and "more personal" — they never see gates, scores, or diagnostic labels.

### Differentiator vs. All Competitors
> No competitor has anything like this. Yoodli and Second Nature provide the same generic feedback regardless of how many sessions you complete. KDENZ gets smarter over time because the VCM watchdog detects patterns in your voice that you don't notice yourself — then surfaces exercises specifically chosen to address those patterns. This is the "holy shit moment" at the product level: "How did it know I needed to work on that?"

---

## Screen 10: Profile / Settings

**Purpose:** Account management, preferences, subscription.

### What's Visible

```
┌─────────────────────────────────────┐
│ Profile                              │
│                                      │
│ [Avatar]  Randy                      │
│ randy@email.com                      │
│ Member since Feb 2026                │
│                                      │
│ ─────────────────────────────────── │
│                                      │
│ PRACTICE PREFERENCES                 │
│                                      │
│ Primary Focus        [Negotiations▾] │
│ Experience Level     [Intermediate▾] │
│ Session Length Pref   [60 seconds ▾] │
│ Voice Speed (AI)     [Normal     ▾] │
│                                      │
│ ─────────────────────────────────── │
│                                      │
│ SUBSCRIPTION                         │
│                                      │
│ Plan: KDENZ Pro — $49/mo             │
│ Next billing: March 11, 2026         │
│ [Manage Subscription]                │
│                                      │
│ ─────────────────────────────────── │
│                                      │
│ ABOUT                                │
│                                      │
│ [Privacy Policy]                     │
│ [Terms of Service]                   │
│ [Send Feedback]                      │
│ [Sign Out]                           │
│                                      │
│ KDENZ Voice Lab v2.0                 │
└─────────────────────────────────────┘
```

---

## Flow Summary: Key User Journeys

### Journey 1: First Session (New User)
```
Welcome → What Brings You Here → Experience Level → Voice Setup
→ Home (first-time) → Tap recommended technique
→ Scenario Detail (read briefing) → Start Practice
→ Practice (60s) → Feedback (coaching + analytics + transcript)
→ Home (Practice Again or Next Technique)
```

### Journey 2: Returning Practice (Sessions 2-4)
```
Home → Continue card or Recommended Next
→ Scenario Detail → Start Practice → Practice → Feedback
→ Practice Again (if criteria missed) or Next Technique
```

### Journey 3: Learning Path (Browse → Learn → Practice)
```
Learn → Frameworks tab → Voss overview video
→ Browse Voss techniques → Mirroring detail
→ Briefing tab (read criteria) → Learn tab (watch explainer)
→ Start Practice → Practice → Feedback
→ Pairs Well With → Labeling → repeat
```

### Journey 4: Pattern Discovery (Session 5+)
```
Home → Pattern Insight card appears
→ "Across your last 5 sessions..." → Recommended techniques
→ Scenario Detail → Practice → Feedback (now includes pattern context)
→ Progress dashboard shows improvement in detected area
```

### Journey 5: Progress Review
```
Progress → Framework mastery rings → tap Voss ring
→ Library filtered to Voss → see practiced/unpracticed
→ Back → Skill Map → tap "Questioning" bar
→ See all questioning techniques with scores
→ Back → Weekly Trend → see improvement over time
```

---

## Data Architecture: What Gets Stored Per User

| Data | Source | Used For |
|------|--------|----------|
| `user.primary_focus` | Onboarding | Home recommendations, library sort |
| `user.experience_level` | Onboarding | Difficulty filtering |
| `user.sessions[]` | Each practice session | Progress, trends, feedback history |
| `session.technique_id` | Selected technique | Links to kadenzphase2.json |
| `session.transcript` | Speech-to-text | Strategic feedback scoring |
| `session.voice_metrics` | Audio analysis | Delivery analytics, VCM input |
| `session.criteria_scores` | AI evaluation | Technique execution scoring |
| `session.vcm_gate_scores` | VCM engine (internal) | Pattern detection — never shown to user |
| `user.vcm_pattern` | Watchdog (after session 4-5) | Recommendation weighting — never shown to user |
| `user.technique_mastery{}` | Computed from sessions | Progress rings, mastery status |

---

## Content Production Priority

### Must-Have for Launch
1. **kadenzphase2.json** — 51 techniques (DONE)
2. **Practice prompts** — one per technique (DONE — `practice_prompt` field)
3. **Success criteria** — per technique (DONE — `success_criteria` field)
4. **Common mistakes** — per technique (DONE — `common_mistakes` field)
5. **Session structure** — per technique (DONE — `structure` field)
6. **AI feedback prompt engineering** — system prompts that evaluate transcripts against criteria

### High Priority (First Month)
7. **5 framework overview videos** (2-3 min each)
8. **51 written technique breakdowns** (can use `description` + `coaching_notes` as starting point)
9. **Before/after dialogue examples** per technique

### Rolling Production
10. **Individual technique explainer videos** (51 total, roll out over time)
11. **Quick reference cheat sheets** (5 total, one per framework)
12. **Achievement/badge system** (v1.1 — gamification)

---

*Document generated 2026-02-11. Reference: KDENZ_UX_Flow_Handoff.md + kadenzphase2.json (51 techniques, 5 frameworks).*
