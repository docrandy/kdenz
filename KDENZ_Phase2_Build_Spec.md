# KDENZ Phase 2 — Build Spec

**Status:** Ready to build
**Stack:** React 19, Vite, Tailwind CSS, Supabase, Vercel
**Deployed v1.0:** https://kdenz.vercel.app
**Design System:** Light mode, #FFFFFF bg, #000000 buttons, #00D4FF accent

---

## What Exists (v1.0 — shipped 2026-02-05)

A filler-word voice practice app with:
- Real-time filler detection (hybrid acoustic + transcript)
- SessionOrb visual feedback (volume-reactive)
- Audio playback with filler markers
- Personal baseline capture
- AI coaching summary (Gemini, button-triggered)
- 1min/2min/3min/Unlimited sessions
- Mobile-responsive, Chrome-only

**Codebase:** 15,049 lines TypeScript/TSX, 126 commits
**Source:** `C:\Users\randy\.claude\projects\kdenz\src\`

---

## What Phase 2 Adds

Transform from single-purpose filler detector into a **$49/mo AI voice coaching SaaS** with 51 structured practice techniques across 5 negotiation frameworks.

### Source Files

| File | What It Is |
|------|-----------|
| `KDENZ_User_Flow.md` | Complete screen-by-screen UX spec (10 screens, all data mappings, differentiators) |
| `KDENZ_UX_Flow_Handoff.md` | Competitive research, content architecture, VCM integration spec |
| `Kdenzphase2.json` | 51-technique scenario database (all fields populated, valid JSON) |

**The UX flow doc is the source of truth.** Every screen, field mapping, and user journey is specified there. Read it first.

---

## Priority Build Order

### Wave 1: The Storefront

**1. Scenario Library Screen**
- Card grid (2-col mobile, 3-col tablet+)
- Filter pills: Framework, Difficulty, Category, Status
- Search across technique_name, description, framework
- Sort: Recommended, Difficulty, Framework, Recently Practiced
- Cards show: framework badge, difficulty, technique_name, description (truncated), category, duration, practice button
- Progress overlay on practiced techniques
- Data source: `Kdenzphase2.json` techniques array
- See: KDENZ_User_Flow.md → Screen 2

**2. Scenario Detail / Pre-Session Briefing**
- Header: framework + author, technique name, difficulty, category, duration
- Briefing tab (default): description, success_criteria as checklist, common_mistakes as warning list, structure as timing guide, pairs_well_with as tappable linked cards
- Learn tab: educational content (placeholder state initially)
- Sticky bottom CTA: "Start Practice [60s]"
- Data source: individual technique object from `Kdenzphase2.json`
- See: KDENZ_User_Flow.md → Screen 3

### Wave 2: Core Practice Loop

**3. Practice Screen (extend existing)**
- Reuse SessionOrb from v1.0
- Display full practice_prompt (scrollable)
- Countdown timer from duration_seconds (default 60s)
- WPM + filler counters (ambient, non-intrusive)
- Silence nudge at 10s
- End session → feedback screen
- See: KDENZ_User_Flow.md → Screen 4

**4. Feedback Screen (strategic feedback — key differentiator)**
- 3 tabs: Coaching, Voice Analytics, Transcript
- Coaching tab: evaluate transcript against success_criteria array → Hit/Partial/Miss per criterion with timestamps. AI-generated coaching narrative (Gemini).
- Voice Analytics tab: WPM chart, filler breakdown, pitch/energy metrics
- Transcript tab: timestamped, toggle highlights (fillers / technique moments), audio playback with scrub
- Session comparison (vs. last attempt) when available
- Bottom CTAs: Practice Again, Next Technique (first pairs_well_with)
- See: KDENZ_User_Flow.md → Screen 5

### Wave 3: Retention & Discovery

**5. Home Screen (returning user)**
- Continue card (last technique if not mastered)
- Recommended next (from pairs_well_with of practiced techniques)
- New framework suggestions (beginner techniques from untried frameworks)
- Weekly stats summary
- See: KDENZ_User_Flow.md → Screen 8

**6. Progress Dashboard**
- Framework mastery rings (practiced/total per framework)
- Category skill map (bar chart by category)
- Recent sessions list
- Weekly trend chart
- See: KDENZ_User_Flow.md → Screen 6

**7. Learn Section**
- Framework overviews with core_philosophy quotes
- Technique breakdowns (description + coaching_notes as content)
- Quick reference cards
- See: KDENZ_User_Flow.md → Screen 7

### Wave 4: Intelligence Layer

**8. VCM Watchdog Integration (Session 5+)**
- Silent gate scoring sessions 1-3
- Pattern detection sessions 4-5
- Pattern insight cards on Home and Feedback screens (observation language only, no VCM labels)
- Recommendation engine weighting shift
- Full gate → observation → technique mapping in KDENZ_User_Flow.md → Screen 9

**9. Onboarding Flow**
- 4-screen flow: Welcome, Focus, Experience, Voice Setup
- Stores primary_focus and experience_level for initial personalization
- See: KDENZ_User_Flow.md → Screen 1

---

## kadenzphase2.json Schema Reference

Each of the 51 techniques has these fields:

```
{
  "id": "voss-05",                    // unique ID, framework-prefixed
  "technique_name": "Calibrated Questions",
  "framework": "voss",               // voss|camp|belfort|bustamante|ury
  "difficulty": "intermediate",      // beginner|intermediate|advanced
  "category": "questioning",         // 17 categories total
  "description": "...",              // full technique explanation
  "practice_prompt": "...",          // what user speaks to in practice
  "success_criteria": ["...", ...],  // 5 items — AI scores against these
  "common_mistakes": ["...", ...],   // 5 items — shown in briefing
  "duration_seconds": 60,            // session length
  "structure": "...",                // timing breakdown for the session
  "pairs_well_with": ["voss-01", ...], // cross-references for recommendations
  "coaching_notes": "..."            // educational narrative for Learn section
}
```

**Counts:** voss: 12, camp: 10, belfort: 10, bustamante: 10, ury: 9
**Difficulties:** beginner: 18, intermediate: 19, advanced: 14
**Categories:** rapport, empathy, tonality, pacing, questioning, strategy, framing, intelligence, closing, mindset, preparation, opening, engagement, objection_handling, language, assertiveness, self_management

---

## Key Architecture Decisions

- **Voice-only** — no video required (lower barrier than Yoodli)
- **Feedback is post-session** — research-validated to reduce self-consciousness
- **AI scoring uses success_criteria** — Gemini evaluates transcript against the 5 criteria per technique, returns Hit/Partial/Miss
- **VCM is never visible** — all gate-level data stays internal; users see observations and recommendations
- **Supabase backend** — user accounts, session history, progress tracking (v1.0 was localStorage only)
- **pairs_well_with drives recommendations** — natural technique progression without manual curation

---

## What Justifies $49/mo (vs. Yoodli at $8-20)

1. **Strategic feedback** — "You mirrored but didn't pause" vs. "You spoke at 117 WPM"
2. **Named framework content** — 51 techniques from 5 published authors, not generic templates
3. **Pre-session briefing** — success criteria + common mistakes before practice
4. **Technique progression** — pairs_well_with enables structured skill building
5. **VCM pattern detection** — product gets smarter after session 5
6. **Educational content** — learn the technique, then practice it, in one flow
