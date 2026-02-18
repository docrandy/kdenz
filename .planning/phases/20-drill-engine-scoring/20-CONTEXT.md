# Phase 20 Context: Drill Engine + Scoring

**Phase:** 20 — Drill Engine + Scoring
**Milestone:** v3.0 Generic Drill Engine
**Date Locked:** 2026-02-17
**Dependencies:** Phase 19 (technique + scenario data)

---

## Phase Goal

Users can complete a full Prompt-Response drill cycle:
1. Read a scenario prompt
2. Record a spoken response
3. Submit and receive immediate scored feedback with per-dimension breakdown
4. Advance to the next scenario or exit

---

## Key Decisions

### 1. Response Format: VOICE INPUT (Not Text)

**Decision:** Drills accept **spoken responses**, not typed text.

**Rationale:**
- KDENZ is fundamentally a voice coaching platform (Voice Practice is the proven foundation)
- Techniques like Mirroring, Labeling, Open-Ended Questions are *speaking* skills, not writing skills
- Authentic practice requires voice-to-voice feedback
- Transcription-to-form-scoring pipeline already validated in Phase 19 research (Web Speech API + Deepgram path established in R6)

**Implementation:**
- User reads scenario, taps **Record button** to capture their voice
- System records and transcribes audio (Web Speech API for Chrome beta; Deepgram path for cross-browser later)
- Form scoring runs on transcript (regex patterns from drill-techniques.ts)
- Accuracy + Impact scoring runs via Gemini on transcript + audio metadata (prosody, filler detection for future)
- Feedback references *what they said*, not what they typed

**Constraints:**
- Chrome-only for beta (Web Speech API accuracy; R6 validated)
- No duration limit enforced (speak naturally; expect 30-120 sec responses typical)

---

### 2. Recording UI: Reuse Voice Practice Pattern

**Decision:** Use the **same recording controls** as Voice Practice module (proven, tested).

**Pattern:**
- Stop-only button (no pause; mirrors real conversation)
- Real-time waveform visualization while recording
- Recording level meter (optional but helpful for user confidence)
- Auto-submit immediately after user taps stop (no separate "Submit" button)

**Rationale:**
- Consistency across the app (users see the same UI pattern twice → faster familiarity)
- Proven to work (Voice Practice ships with this UI; v2.0 verified)
- Reduces cognitive load during practice (one predictable interaction)

**File Reference:**
- Voice Practice recording controls: `src/features/voice-practice/` (existing, reusable pattern)
- Adapt for drill context: remove filler gauge (not needed for isolated drills yet), keep meter + waveform

---

### 3. Feedback Card: Scored Breakdown + Coaching

**Decision:** Show all 3 dimensions (Form, Accuracy, Impact) as **percentage scores + qualitative labels + coaching narrative**.

**Card Structure:**
```
[Feedback Card]
━━━━━━━━━━━━━━━━━━━━━
Form: 85% — Well-formed     [Badge/icon]
Accuracy: 72% — Close       [Badge/icon]
Impact: 78% — Effective     [Badge/icon]
━━━━━━━━━━━━━━━━━━━━━
Coaching (3-4 lines):
"You mirrored the client's concern well, using their exact
phrasing. Consider softening 'but' with 'and' to maintain
rapport. Your pacing was steady — very good."
━━━━━━━━━━━━━━━━━━━━━
[Next Scenario Button]
```

**Scoring Weights (from STATE.md):**
- Form: 0.25 (syntax correctness)
- Accuracy: 0.35 (content match to scenario)
- Impact: 0.30 (effect on counterpart simulation)
- Timing: 0.10 (recorded but not displayed; weight ~0 in isolated drills)

**Label Mappings:**
- 90-100%: Mastered
- 75-89%: Strong / Well-formed / Effective
- 60-74%: Close / Adequate / Moderate
- <60%: Needs work / Off-target / Weak

**Rationale:**
- All 3 dimensions visible because drills teach *all three* aspects simultaneously
- Qualitative labels make scores interpretable to non-experts
- 3-4 lines of coaching is research-backed (Duolingo: visual feedback 3.5x retention; coaching text reinforces)
- Timing hidden because it has no meaning in isolated drills (no live counterpart to time against)

---

### 4. Form Scoring: Rules-Based (Instant)

**Decision:** Form score appears **immediately after submission**; rules-based pattern matching on transcript.

**Implementation:**
- Apply all SyntaxRule patterns from drill-techniques.ts to transcript
- Calculate form score: (patterns_matched / total_patterns) or (patterns_matched × weight_sum)
- Display instantly with confidence
- No LLM needed; pure regex/rule-based

**Example (Mirroring Technique):**
- Pattern: `inclusion: ["their", "your", "exact"]` → must include at least one
- Pattern: `negation: ["but", "however"]` → should not include negation
- Score reflects how many patterns matched

**Error Handling:**
- Transcription fails: show "Could not process your response. Please try again." + allow re-record
- Empty transcript: "Inaudible response. Please speak clearly and try again."
- Graceful: session not blocked; user can retry immediately

---

### 5. Accuracy + Impact Scoring: Gemini LLM (Async)

**Decision:** Accuracy and Impact scores calculated by **Gemini 2.5 Flash** in a single API call; scores appear after short delay (~2-5 sec).

**Gemini Prompt Structure:**
- System: "You are evaluating a communication technique. Rate accuracy and impact."
- Input: Technique name + scenario + user's transcript + rubric (from R5)
- Output: JSON `{ accuracy: 0-100, impact: 0-100, explanation: "..." }`

**UI During Scoring:**
- Form score visible immediately
- Spinner or loading state: "Scoring accuracy and impact..."
- After response: feedback card updates with Accuracy + Impact scores
- Total composite score updates automatically

**Graceful Degradation (R4 validated):**
- If Gemini times out or 503s: show form score only, message "Accuracy and Impact scoring pending. Check back later." (cached for session)
- User can advance to next scenario; scores not blocking
- On app reload, pending scores may be filled in (future refinement)

**Cost & Latency:**
- ~$0.01-0.02 per attempt (R4 validated; negligible at scale)
- Expect 2-5 second response time for LLM

---

### 6. Post-Feedback Navigation

**Decision:** User advances via **explicit "Next Scenario" button**; session persists.

**Navigation Pattern:**
```
[Feedback Card]
  ↓
User taps "Next Scenario"
  ↓
New scenario loads (random from technique's scenario pool)
  ↓
Attempt count updates (e.g., "Attempt 3 of 5")
  ↓
Streak badge visible (e.g., "2 in a row ✓")
```

**Session Persistence:**
- Attempt history stored in localStorage under `kdenz:drill-data` key (Phase 21 refines this)
- Back button available at any time (exit without losing session)
- If user navigates away and returns, drill session resumes (same technique, new scenario)

**Attempt Limit:**
- No hard limit in Phase 20 (user can practice until satisfied)
- Phase 21 will introduce mastery thresholds (stop when Proficient)

---

### 7. Drill Screen Layout

**Decision:** Single-column responsive layout; mobile and desktop both stack vertically.

**Screen Flow:**
```
[Technique Name / Title]
━━━━━━━━━━━━━━━━━━━━━━
[Scenario Prompt] — Read this (user reads for 10-30 sec)
━━━━━━━━━━━━━━━━━━━━━━
[Record Button] + [Stop Button]
[Waveform Visualization]
[Recording Meter]
━━━━━━━━━━━━━━━━━━━━━━
After Submit:
[Feedback Card] (as described above)
```

**Responsive Behavior:**
- Desktop (>640px): full width, comfortable padding
- Mobile (<640px): edge-to-edge, stacked same way
- Prompt remains readable; input/recording controls fill available space

**Visual Hierarchy:**
- Scenario prompt: secondary (user reads once)
- Record button: primary (user focuses here)
- Feedback card: prominent (scores + coaching)

**Color & Design:**
- Use dark premium palette (CSS variables from v2.0 design system)
- Record button: gold/accent color (matches app theme)
- Waveform: semi-transparent gold gradient (matches Voice Practice)

---

### 8. Attempt Context & Streaks

**Decision:** Show **attempt count** and **consecutive-correct streak** during the session.

**Badges to Display:**
```
Attempt 3 of 5
Streak: 2 ✓  (appears only if consecutive Form + Accuracy passes)
```

**Streak Logic (Phase 21 refines; Phase 20 records only):**
- Increment streak if Form ≥80% AND Accuracy ≥75%
- Reset to 0 if either drops below threshold
- Display prominently (encourages continued practice)

**Rationale:**
- Visible progress hooks motivation (research: gamification 30% better retention, CLAUDE.md principles)
- Aligns with "never miss twice" principle (R11): visible streak makes breaks obvious

---

### 9. Error Recovery & Edge Cases

**Transcription Error:**
- "Could not process your response. Please try again." + allow re-record
- No penalty; attempt not logged if transcript is empty

**Gemini Timeout:**
- Show form score + "Accuracy/Impact pending..."
- User can advance or wait for scores
- Session not blocked

**User Closes Browser Mid-Drill:**
- Attempt history saved to localStorage at each submit
- On return, session resumes (same technique, resume count)

**No Scenarios Available:**
- Should not happen (8 techniques × 5 scenarios = 40 total, all seeded in Phase 19)
- Fallback: "No more scenarios. Excellent practice!"

---

## Scope Guardrails

**In Scope (Phase 20):**
- Prompt-Response voice drills for 8 Tier A techniques
- Form scoring (rules-based, instant)
- Accuracy + Impact scoring (Gemini, async)
- Feedback card display
- Next scenario button
- localStorage persistence of attempts

**Out of Scope (Future Phases):**
- Mastery tracking UI (Phase 21)
- Spaced repetition scheduling (Phase 21)
- Voice playback with highlights (Simulation Studio feature, Phase C)
- Skills Lab integration (Phase 22)
- Audio analysis (Hume batch API, Phase D)
- VCM diagnostics (Phase E)

**Deferred Capabilities:**
- Audio playback with technique highlighting (belongs in Simulation Studio, not drill engine)
- Cross-browser support (Chrome beta only; Deepgram path in R6)
- Difficulty tuning (v3.1 expansion)
- Multiple drill formats beyond Prompt-Response (v3.1 expansion)

---

## Technical Notes for Researchers & Planners

### Transcription Path
- Phase 20: Web Speech API (Chrome), streaming to transcript in real-time
- Fallback for non-Chrome: show "Requires Chrome for voice input" (warning in Phase 20 UI)
- Post-Phase-22: Deepgram integration for cross-browser (R6 path)

### Gemini Prompt Design
- Prompt must include technique name, scenario summary, and rubric dimensions
- Output: structured JSON (no free-form text in scoring field)
- Temperature: 0.3 (consistent, low hallucination)
- Max tokens: 200 (brief explanation only)

### localStorage Structure
- Key: `kdenz:drill-data`
- Append attempt records: `{ timestamp, techniqueId, scenarioId, transcript, formScore, accuracyScore, impactScore, compositeScore }`
- Session object tracks: `{ currentTechnique, attemptCount, streak, sessionStartTime }`

### Design System Integration
- Record button: use `btn-primary` (gold background)
- Waveform: gold gradient `var(--color-gold-500)` to `var(--color-gold-300)` with transparency
- Feedback card: dark card background `var(--color-surface-secondary)`, gold accents
- Typography: body text uses Outfit (v2.0 standard), technique name uses Cormorant (heading tier)

---

## Success Criteria (From Roadmap)

1. ✓ User can open any of 8 techniques and start a drill
2. ✓ UI is identical for all 8 techniques (data-driven, no hardcoding)
3. ✓ Each round loads a random scenario (no repeats in one session)
4. ✓ Feedback card shows Form, Accuracy, Impact scores + explanation
5. ✓ LLM failure shows form score only; session not blocked
6. ✓ User can advance to next scenario without leaving drill context

---

## Next Steps

**Researcher (gsd:research-phase):**
- Validate Gemini prompt structure for accuracy/impact scoring
- Confirm Web Speech API transcription quality on Chrome
- Finalize rubric wording for user-facing explanations

**Planner (gsd:plan-phase):**
- Break Phase 20 into concrete implementation tasks
- Component breakdown: RecordButton, Waveform, FeedbackCard, DrillScreen
- API integration: Gemini orchestration, error handling, localStorage sync
- Routes: drill launch from technique detail (Phase 22 concern, but understand integration point)

---

*Context locked: 2026-02-17*
*Ready for: Research → Planning → Execution*
