# KDENZ Voice Lab — User Flow Design Handoff

## For: Claude Code
## From: Claude Desktop competitive analysis session (Feb 2026)
## Task: Draft the complete KDENZ screen-by-screen user flow

---

## 1. WHAT THIS IS

Design the complete user journey for KDENZ Voice Lab — a $49/mo AI voice coaching SaaS for mid-career professionals (35-50) practicing negotiations and difficult conversations. This document contains everything needed: proven UX patterns from competitor research, KDENZ's unique differentiators, and the content architecture.

**Output requested:** A comprehensive screen-by-screen user flow document (markdown) covering every screen from first app open through session 5+ when the VCM watchdog activates. Include screen names, what's on each screen, user actions, navigation paths, and where KDENZ differentiates from competitors.

---

## 2. THE PROVEN CORE LOOP (Validated by Yoodli + Second Nature)

Both major competitors converge on this pattern:

```
Browse scenarios → Select one → Practice (speak) → Get feedback (after, not during) → See progress → Repeat
```

This is psychologically validated: feedback during practice triggers self-consciousness and degrades performance. Always post-session.

---

## 3. COMPETITOR UX FINDINGS (Yoodli Walkthrough)

### What Works (Adopt)
- **Card grid for scenario browse** — 2-column layout, each card shows: category badge, title, description, persona name/role, avatar, "Practice" button
- **1 click from library to practice screen** — fast path, minimal setup
- **Post-session feedback split into Coaching (qualitative) + Analytics (quantitative)** — good separation
- **Persistent "Practice" button always in left nav** — always accessible
- **AI response settings** — auto-respond toggle, interruptible toggle, voice speed dropdown. Thoughtful controls.
- **Practice type chooser** — Roleplay, Presentation, Interview, Upload (modal from Practice button)
- **Timestamped transcript with video playback** — scrub bar, speed control, PiP
- **Pacing variation line chart** — WPM over time against target band. Genuinely useful visualization.

### What's Missing (Exploit)
1. **No filtering or sorting in scenario library** — 30+ scenarios, no way to filter by category, difficulty, or type. Just scroll. Category badges on cards look clickable but aren't.
2. **No pre-session briefing** — 1-sentence description only. No learning objectives, no tips, no "what good looks like," no expected AI behavior.
3. **No strategic feedback** — All feedback is delivery mechanics (filler words, pacing, eye contact, conciseness). Zero feedback on whether what you SAID was strategically effective.
4. **No difficulty levels or time estimates** on scenario cards
5. **No session-to-session comparison** in feedback view — metrics for one session only, no overlays or trends
6. **No personalized recommendations** — Home carousel exists but no "based on your last session, try this next"
7. **No overall score or summary grade** on feedback screen — 8 coaching items behind one long scroll
8. **Home page feels stale** — "What's new?" section dated 9 months old
9. **Dashboard mostly empty state** for low-frequency users

### Yoodli Feedback Detail (for reference)
- **Coaching tab:** AI-generated strength card (green), growth area card (red) with bolded actionable items, visual presence tags, conciseness rephrasing, sentence stress with audio playback
- **Analytics tab — Word Choice:** Filler words %, weak words %, repetition %, conciseness (excess %), sentence starters breakdown
- **Analytics tab — Listening:** Monologues count, talk time bar chart (you vs others), questions count
- **Analytics tab — Delivery:** Eye contact score (/5), centering, pauses, pacing (WPM) with variation line chart against target band

### Second Nature Key Patterns (Desk Research)
- Enterprise-focused, manager assigns scenarios
- AI persona "Jenny" pushes back with follow-ups, asks about competition, handles objections
- Scoring: Knowledge (70% weight — content accuracy, topic coverage) + Style (30% — pace, clarity, energy, fillers)
- Manager dashboard with team progress, completion rates, proficiency heatmaps
- Programs: scenario sequences with completion requirements and certifications

---

## 4. KDENZ CONTENT ARCHITECTURE

### Scenario Database
- **51 techniques** across 5 frameworks stored in kadenzphase2.json
- **Frameworks:** Chris Voss (Never Split the Difference), Jim Camp (Start With No), Jordan Belfort (Straight Line), Andrew Bustamante (CIA influence), William Ury (Getting Past No)
- **Each technique has:** name, framework, category, difficulty (1-5), description, objective, success_criteria (array), setup (scenario context), ai_persona, pairs_with (related techniques), vocal_markers

### Key Fields That Drive UX
- `difficulty` (1-5) → enables difficulty filters and progression
- `framework` → enables framework-based filtering and learning paths
- `category` → enables category filtering (rapport, information_gathering, persuasion, objection_handling, closing, etc.)
- `pairs_with` → enables "what to practice next" recommendations
- `success_criteria` → enables STRATEGIC feedback ("Did you use calibrated question?" "Did you mirror before labeling?")
- `ai_persona` → persona card on scenario detail
- `setup` → pre-session briefing content
- `vocal_markers` → maps to VCM vocal signature detection

### Educational Content Layer
KDENZ should include a "Learn" section with short, high-value educational content:

**Content types:**
- 2-3 minute video explainers per technique ("What is a calibrated question and why does it work?")
- Written breakdowns with real-world examples (before/after dialogue pairs)
- Framework overviews (5 total — one per framework author, explaining the philosophy)
- "Watch it in action" clips showing the technique applied well
- Cheat sheets / quick-reference cards per technique

**Organization:**
- Tied directly to scenarios: "Learn" tab on scenario detail screen loads the explainer + written breakdown. Education flows into practice, not separate from it.
- Also browsable independently via a "Learn" section in nav, organized by framework
- Progress tracked: "Learned" vs "Practiced" vs "Mastered"

**Launch priority:**
- Framework overviews (5 videos) — produce first
- Written breakdowns for each technique (text, fast to produce) — produce first
- Individual technique videos — roll out over time

---

## 5. VCM INTEGRATION (Background Engine)

The VCM is NEVER visible to users. No gate IDs, no root cause codes, no diagnostic labels.

### How It Works in the Product
- **Sessions 1-3:** Silent observation. Voice analyzed, gates scored, data stored. User sees only voice-level feedback (stress patterns, pace, confidence indicators).
- **Sessions 4-5+:** Watchdog detects consistent gate patterns. Hypothesis forms (e.g., "C3 is earliest failing gate"). Verified against activation frequency (60%+), confidence threshold, consistency across session types.
- **Post-verification:** System recommends exercises targeting the identified gate's root causes. User experiences these as exercises that feel increasingly relevant — not diagnostic output.

### Vocal Signatures by Gate (Detection Layer)
| Gate | What Voice Shows |
|------|-----------------|
| C0 | Flat affect, resignation, low energy baseline |
| C1 | Low confidence, pitch instability on self-referential statements, hedging |
| C2 | Flat engagement discussing goals, tension on commitment, energy drops |
| C3 | Stress spikes on effort/sacrifice topics, pitch elevation, breath disruption |
| C4 | Vague language, low specificity, hesitation on "when/how" |
| C5 | Engagement increases for alternatives, hedging on timeline, inconsistency |
| C6A | Speech onset delays, vocal tremor at commitment points, sudden pauses |
| C6B | Energy decay across session, fatigue markers, rising frustration, shortened responses |

### What This Means for UX
- Feedback screen shows voice metrics (surface level) in sessions 1-3
- Starting session 4-5, feedback begins including pattern insights: "Across your last 4 sessions, we've noticed [insight]" — phrased as observations, never diagnostic labels
- Scenario recommendations start shifting based on detected patterns
- The user feels the product getting smarter without seeing the machinery

---

## 6. KDENZ DIFFERENTIATORS TO BUILD INTO FLOW

### vs. Competitors
1. **Strategic feedback, not just delivery feedback** — "You mirrored but didn't pause long enough for it to land" vs. "You spoke at 117 WPM"
2. **Framework-grounded scenarios** — 51 techniques from 5 named authors, not generic templates
3. **Pre-session briefing** — Before practice: what the technique is, what success looks like, what the AI will do
4. **Technique progression** — pairs_with enables "you mastered mirroring, now try labeling, then combine them"
5. **Difficulty levels + time estimates** on every scenario card
6. **Filtering** — by framework, category, difficulty
7. **Session-to-session comparison** — trend lines, improvement tracking
8. **Personalized recommendations** — based on performance + pairs_with + VCM patterns (after session 4-5)
9. **Educational content tied to practice** — learn the technique, then practice it, in one flow

### Pricing Justification ($49/mo vs Yoodli $8-20/mo)
The premium is justified by:
- Named framework content (not generic)
- Strategic feedback on technique execution (not just delivery mechanics)
- Progressive skill building with learning paths
- VCM-powered pattern detection that gets smarter over time
- Educational content library
- Curated, expert-designed scenarios vs. open-ended practice

---

## 7. DESIGN CONSTRAINTS

- **Mobile-first** — mid-career professionals practice on the go
- **No video required** — voice-only practice (lower barrier than Yoodli which requires camera)
- **Session length** — target 3-5 minutes per practice session (not 30-second demos)
- **Voice analysis pipeline** — Hume AI API (primary) + librosa/Whisper/Praat (fallback)
- **Tech stack** — React/Vite, deployed on Vercel (kdenz.vercel.app), Supabase backend
- **No VCM terminology ever visible to users**

---

## 8. REQUESTED OUTPUT

Draft a complete screen-by-screen user flow document covering:

1. **First-time user experience** (onboarding → first session)
2. **Scenario browse/library screen**
3. **Scenario detail / pre-session briefing screen**
4. **Practice screen** (during session)
5. **Feedback/analysis screen** (post-session)
6. **Progress/dashboard screen**
7. **Learn section** (educational content)
8. **Home screen** (returning user)
9. **Session 4-5+ experience** (when VCM watchdog activates)
10. **Navigation structure** (what's always accessible)

For each screen: name, purpose, what's visible, user actions, where it links to, and where KDENZ differentiates from competitors.

---

## 9. FILES TO REFERENCE

- `C:\Users\randy\.claude\projects\kdenz\kadenzphase2.json` — 51-technique scenario database with all fields
- VCM project files in `/mnt/project/` — VCM_Foundational_Document.md, VCM_Claims_Document.md, VCM_Root_Cause_Database.md (background reference for vocal signatures and gate structure)
