---
phase: 07-polish-error-handling
plan: 02
subsystem: session-metrics
tags: [transcript, confidence, uncertainty-communication, web-speech-api, typescript]
requires:
  - phase-05 (transcript capture via Web Speech API)
  - phase-06 (Scorecard display)
provides:
  - Transcript confidence tracking in useWebSpeech hook
  - TranscriptConfidenceIndicator component
  - Confidence display on PostSessionResults and EvaluationPage
affects:
  - phase-07-01 (audio quality warnings use same uncertainty pattern)
  - phase-07-03 (copy-lint validation for language boundaries)
tech-stack:
  added: []
  patterns:
    - "Uncertainty communication via neutral tiers (High/Medium/Low)"
    - "Conditional display based on threshold (< 0.85)"
    - "Foundation copy as locked verbatim strings"
key-files:
  created:
    - src/components/TranscriptConfidenceIndicator.tsx
  modified:
    - src/core/audio/useWebSpeech.ts
    - src/pages/PostSessionResults.tsx
    - src/pages/EvaluationPage.tsx
    - src/components/PracticeSession.tsx
decisions:
  - id: confidence-threshold
    choice: "0.7 for low confidence warning"
    rationale: "Chrome Web Speech API confidence below 0.7 indicates significant uncertainty"
    alternatives: ["0.5 (too permissive)", "0.8 (too strict)"]
  - id: hide-high-confidence
    choice: "Only show indicator when < 0.85"
    rationale: "Don't clutter UI with non-issues; high confidence needs no attention"
    alternatives: ["Always show (creates noise)", "Only show on low (misses medium tier)"]
  - id: neutral-language-only
    choice: "High/Medium/Low tiers with clinical-accent icon"
    rationale: "Per Core Principle #3 and language boundaries - no judgment colors (red/green/yellow)"
    alternatives: ["Color-coded (violates principle #2)", "Numeric scores (too technical)"]
metrics:
  duration: "9 minutes"
  completed: "2026-02-05"
---

# Phase 07 Plan 02: Transcript Confidence Indicator Summary

**One-liner:** Web Speech API confidence tracking with neutral-language tier display (High/Medium/Low) on results pages, using foundation copy for low-confidence warnings.

## What Was Built

### Confidence Tracking in useWebSpeech Hook

Added transcript confidence monitoring to the Web Speech API hook:

1. **Confidence score tracking:**
   - Captures `result[0].confidence` from final results (Chrome returns 0 for interim)
   - Stores all confidence scores in `confidenceScoresRef`
   - Calculates rolling `averageConfidence` (0-1 scale)

2. **Low confidence segment counting:**
   - Increments `lowConfidenceSegments` counter for segments below 0.7 threshold
   - Provides context for users on how many segments were uncertain

3. **Exposed metrics:**
   - `averageConfidence: number` - mean confidence across all final results
   - `lowConfidenceSegments: number` - count of segments below threshold

4. **Reset behavior:**
   - All confidence tracking resets on `start()` for new sessions
   - Prevents carry-over between sessions

### TranscriptConfidenceIndicator Component

Created a neutral-language confidence display component:

1. **Tier classification:**
   - **High (>= 0.85):** Hidden - no display needed
   - **Medium (0.7-0.85):** Shows with variation message
   - **Low (< 0.7):** Shows with full warning from foundation docs

2. **Visual design:**
   - Clinical-accent info icon (teal, not judgment red/yellow)
   - Gray text for neutral tone
   - Expandable message for medium/low tiers
   - Segment count context for low tier only

3. **Foundation copy (verbatim):**
   - Low: "Low transcription confidence in this segment; filler counts may be under- or over-estimated."
   - Medium: "Transcription confidence is medium; some variation in filler counts may occur."

4. **Compliance:**
   - No judgment words (good/bad/poor/excellent)
   - No color-coded severity (violates design principle #2)
   - Neutral clinical language only

### Integration into Results Pages

Wired confidence indicator into post-session flow:

1. **PracticeSession updates:**
   - Destructures `averageConfidence` and `lowConfidenceSegments` from `useWebSpeech`
   - Saves to `sessionStorage` alongside other session data
   - Data flows to results pages for display

2. **PostSessionResults display:**
   - Renders `TranscriptConfidenceIndicator` in metrics phase
   - Positioned between summary paragraph and Scorecard
   - Only shows if `averageConfidence < 0.85`

3. **EvaluationPage display:**
   - Renders `TranscriptConfidenceIndicator` above transcript
   - Positioned before HighlightToggle
   - Only shows if `averageConfidence < 0.85`

4. **Conditional visibility:**
   - High confidence (>= 0.85) = no indicator (reduces UI clutter)
   - Medium/low confidence = indicator shows with appropriate message

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed lucide-react import breaking build**

- **Found during:** Task 3 build verification
- **Issue:** `AudioQualityWarning.tsx` imported `lucide-react` which isn't in package.json, blocking TypeScript build
- **Fix:** Replaced `AlertTriangle` and `X` imports with inline SVG icons
- **Files modified:** `src/components/AudioQualityWarning.tsx`
- **Commit:** Included in Task 3 commit (25001c4)
- **Rationale:** Can't complete plan with broken build; inline SVG maintains visual design without adding dependency

## Key Implementation Details

### Web Speech API Confidence Notes

1. **Chrome behavior:**
   - Returns `confidence: number` (0-1) for final results
   - Returns 0 or undefined for interim results
   - Only track from `isFinal: true` results

2. **Confidence interpretation:**
   - 0.85+ = High quality transcription
   - 0.7-0.85 = Medium quality, some uncertainty
   - < 0.7 = Low quality, significant uncertainty

3. **Why it matters:**
   - Low confidence affects downstream filler counts
   - Users need to know when metrics may be unreliable
   - Transparency builds trust (Core Principle #3)

### Design System Compliance

1. **No judgment colors:**
   - Clinical-accent (teal) for info icon
   - Gray text for labels
   - No red/yellow/green severity coding

2. **Neutral language:**
   - Tier names: High/Medium/Low only
   - Banned words avoided: good/bad/poor/excellent/accurate
   - Describes measurement quality, not user performance

3. **Foundation copy:**
   - Low confidence warning is verbatim from `audio-quality-warning-messages-v1.md`
   - Locked copy ensures consistent uncertainty communication

## Testing Notes

### Manual Verification Needed

1. **Confidence tracking:**
   - Record a session and check browser console for confidence scores
   - Verify `averageConfidence` matches Web Speech API output

2. **Indicator display:**
   - Session with high confidence (>= 0.85): indicator should NOT appear
   - Session with medium confidence (0.7-0.85): indicator shows with medium message
   - Session with low confidence (< 0.7): indicator shows with full warning

3. **Copy validation:**
   - Low confidence message matches foundation docs verbatim
   - No judgment language appears in UI

4. **Mobile responsiveness:**
   - Indicator renders correctly on mobile (320px width)
   - Text wraps properly, icon doesn't overlap

### Build Verification

- ✅ `npm run build` succeeds (TypeScript compiles, Vite bundles)
- ⚠️ `npm run lint` fails due to missing ESLint v9 config (not blocking for this plan)

## Files Changed

### Created
- `src/components/TranscriptConfidenceIndicator.tsx` (96 lines)

### Modified
- `src/core/audio/useWebSpeech.ts` (+22 lines)
- `src/pages/PostSessionResults.tsx` (+15 lines)
- `src/pages/EvaluationPage.tsx` (+14 lines)
- `src/components/PracticeSession.tsx` (+4 lines)
- `src/components/AudioQualityWarning.tsx` (+30 lines, -2 lines) [deviation fix]

### Total Impact
- **5 files modified, 1 file created**
- **+85 net lines (excluding AudioQualityWarning deviation fix)**

## Next Phase Readiness

### Blockers
None.

### Concerns
1. **Lint configuration:** ESLint v9 migration not complete, but doesn't block development
2. **Real-world confidence scores:** Need to validate Chrome Web Speech API confidence values in production
3. **Mobile layout:** Indicator needs mobile testing (not done in this plan)

### Dependencies for Phase 07-03 (Copy Lint)
- Foundation copy files exist and are referenced
- Language boundaries documented
- Copy-lint script can validate against locked strings

## Learnings

### What Worked
1. **Neutral tier system:** High/Medium/Low is clearer than numeric scores (0.7) for users
2. **Conditional display:** Hiding high confidence reduces UI noise
3. **Foundation copy verbatim:** Ensures consistency and compliance with language boundaries

### What to Watch
1. **Chrome confidence reliability:** Web Speech API confidence may vary by audio quality, accent, background noise
2. **Threshold tuning:** 0.7 and 0.85 thresholds chosen based on assumption; may need adjustment after user testing
3. **Medium tier messaging:** "some variation may occur" might be too vague; monitor user feedback

### Pattern Established
**Uncertainty communication pattern:**
- Track quality metric from source (confidence score)
- Classify into neutral tiers (High/Medium/Low)
- Conditional display (only show when < threshold)
- Use foundation copy verbatim for warnings
- Clinical-accent icon, gray text (no judgment colors)

This pattern applies to:
- Phase 07-01 (audio quality warnings)
- Future metrics with uncertainty (WPM accuracy, filler detection confidence)

---

**Plan completed:** 2026-02-05 21:37 UTC
**Duration:** ~9 minutes
**Commits:** 3 (c754a76, 63936f3, 25001c4)
