# Handoff: Wave 2 — Core Practice Loop + VCM Foundation

**Created:** 2026-02-11
**Status:** IN PROGRESS — Task 1 of 5 partially complete

---

## What Was Completed (Wave 1)

All Wave 1 screens are built and compiling:
- `src/types/technique.ts` — Types for 51-technique database
- `src/data/techniques.ts` — Data access layer (imports Kdenzphase2.json)
- `src/pages/ScenarioLibrary.tsx` — Card grid with filters, search, sort
- `src/pages/ScenarioDetail.tsx` — Pre-session briefing with Briefing/Learn tabs
- `src/pages/Dashboard.tsx` — Added "Technique Library" card
- `src/App.tsx` — Added `/library` and `/technique/:techniqueId` routes
- Build verified clean (817 KB)

## What Is Being Built (Wave 2)

### Task 1: VCM Types + Analyzer (PARTIALLY DONE)
- **DONE:** `src/types/vcm.ts` — Created with types for CodebookEntry, PhraseMatch, GateScore, VcmAnalysisResult
- **TODO:** `src/services/vcmAnalyzer.ts` — Import `vcm_diagnostic_codebook.json`, provide `analyzeTranscript(text: string): VcmAnalysisResult`

The analyzer should:
1. Import `../../vcm_diagnostic_codebook.json` (56 entries)
2. For each entry, check transcript against `diagnostic_phrases` and `semantic_variants`
3. Use case-insensitive substring matching (phrases are conversational, not regex)
4. Return gate-level scores with match details
5. Runs POST-SESSION on the final transcript — not real-time

### Task 2: Extend PracticeSession for Technique Context
File: `src/components/PracticeSession.tsx`

The component already reads from `location.state`:
- `durationSeconds` (line 70) — already works
- `isBaseline` (line 71) — already works

**Add reads for:**
- `techniqueId` — string
- `practicePrompt` — string (the scenario prompt to display)
- `techniqueName` — string (technique name for header)

**Display changes when technique context exists:**
- Show technique name in header/title area
- Show `practicePrompt` in a scrollable card below the SessionOrb (per Screen 4 spec)
- Keep WPM + filler counters subtle at bottom

**Navigation change:**
- When `techniqueId` exists in state, on session end navigate to `/practice/technique-results` instead of `/practice/results`
- Include technique context in sessionStorage data:
  ```
  sessionStorage.setItem('voicelab_last_session', JSON.stringify({
    ...existing fields,
    techniqueId,
    techniqueName,
    practicePrompt,
  }));
  ```

### Task 3: Route Wiring
In `src/App.tsx`:
- Add new route: `/practice/technique` → `TechniquePracticeRoute` (wrapper around PracticeSession)
- Add new route: `/practice/technique-results` → `TechniqueFeedback`
- The wrapper is similar to `FreePracticeFillerRoute` but with a back link to `/library`

Update `src/pages/ScenarioDetail.tsx`:
- Change `handleStartPractice` to navigate to `/practice/technique` instead of `/practice/filler`

### Task 4: Build TechniqueFeedback Page
New file: `src/pages/TechniqueFeedback.tsx`

Per Screen 5 spec, this is a 3-tab post-session feedback page:

**Header:**
- Technique name + framework badge
- Session duration
- Overall assessment (AI-generated, button-triggered like existing AISummary)

**Tab 1: Coaching (default)**
- Display `success_criteria` array from technique data
- Each criterion shows Hit/Partial/Miss scoring
- For MVP: show criteria as checklist with placeholder scoring (AI evaluation via Gemini comes after basic flow works)
- AI coaching narrative (reuse existing AISummary pattern but with technique context in prompt)

**Tab 2: Voice Analytics**
- Reuse existing Scorecard component pattern
- WPM, filler count, filler rate, duration
- Filler breakdown by word (already computed in PostSessionResults)
- Audio playback (reuse AudioPlayback component)

**Tab 3: Transcript**
- Full transcript with timestamps
- Filler highlight toggle
- Audio playback scrubber

**Bottom CTAs:**
- "Practice Again" → navigate to `/practice/technique` with same technique state
- "Next Technique" → navigate to first `pairs_well_with` technique's ScenarioDetail

**VCM Integration (silent):**
- After loading session data, run `analyzeTranscript()` from vcmAnalyzer
- Store VCM gate scores in localStorage alongside session data
- Never display VCM labels to user

### Task 5: Verify Build
- Run `npx tsc --noEmit` and `npm run build`
- Ensure all imports resolve
- Ensure existing routes still work

---

## Key Architecture Decisions

1. **PracticeSession is extended, not duplicated** — technique context is read from route state, display adapts
2. **VCM analysis is POST-SESSION** — runs on final transcript, not real-time
3. **VCM data stored silently** — in localStorage, never surfaced as VCM labels
4. **Technique feedback is a separate page** from existing PostSessionResults — different UX flow (3 tabs vs phased reveal)
5. **AI scoring is button-triggered** — same pattern as v1.0 AISummary (Gemini API cost management)

---

## Files to Create
- `src/services/vcmAnalyzer.ts`
- `src/pages/TechniqueFeedback.tsx`

## Files to Modify
- `src/components/PracticeSession.tsx` — add technique context reads + display
- `src/pages/ScenarioDetail.tsx` — change navigation target to `/practice/technique`
- `src/App.tsx` — add 2 new routes
- `src/services/sessionStorage.ts` — add optional `techniqueId` field to SessionSummary

## Files Already Created This Session
- `src/types/vcm.ts` ✅

---

## VCM Codebook Reference

File: `vcm_diagnostic_codebook.json` (project root)
- 56 root causes across 8 gates (C0-C6B)
- Each has `diagnostic_phrases` (clinical) and `semantic_variants` (conversational)
- Gate counts: C0 (3), C1 (8), C2 (8), C3 (6), C4 (7), C5 (8), C6A (8), C6B (9) = 57 wait let me recount... it's 56 entries total
- Used for background transcript scanning to detect volitional constraint patterns
- After session 5+, patterns surface as observations (Screen 9 in KDENZ_User_Flow.md)
- VCM labels are NEVER shown to users — only observation language

---

## Existing Patterns to Reuse

| Component | Location | Reuse For |
|-----------|----------|-----------|
| SessionOrb | `src/components/SessionOrb.tsx` | Practice screen visual |
| AudioPlayback | `src/components/AudioPlayback.tsx` | Transcript tab + voice analytics |
| Scorecard | `src/components/Scorecard.tsx` | Voice analytics tab |
| AISummary | `src/components/AISummary.tsx` | Coaching tab AI narrative |
| WeeklyTrendChart | `src/components/WeeklyTrendChart.tsx` | Voice analytics tab |
| BottomControlBar | `src/components/BottomControlBar.tsx` | Practice screen controls |
| SilenceNudge | `src/components/SilenceNudge.tsx` | Practice screen |
| SessionProgressBar | `src/components/SessionProgressBar.tsx` | Practice screen countdown |

---

## Resume Instructions

1. Read this file
2. Read `src/types/vcm.ts` (already created)
3. Build `src/services/vcmAnalyzer.ts` next
4. Then extend PracticeSession (Task 2)
5. Then build TechniqueFeedback (Task 4) — this is the biggest piece
6. Then wire routes (Tasks 3 + 5)
7. Verify build
