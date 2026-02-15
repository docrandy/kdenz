# Codebase Concerns

**Analysis Date:** 2026-02-02

## Tech Debt

**Web Speech API Reliability - Chrome Dependency:**
- Issue: Application is entirely dependent on Chrome's `webkitSpeechRecognition` API with no fallback. Per CLAUDE.md research: Safari has 90% accuracy drop and critical bugs.
- Files: `src/core/audio/useWebSpeech.ts`, `src/App.tsx`, `src/components/BrowserWarning.tsx`
- Impact: Any non-Chrome user sees warning but app attempts to run anyway. Silent failures possible if browser detection fails.
- Fix approach: Add strict browser check that blocks all features (not just warning) on non-Chrome. Test chrome detection thoroughly.

**Acoustic Filler Detection Accuracy Gap:**
- Issue: Current acoustic-based filler detection (`src/core/audio/FillerDetector.ts`) relies on heuristics (energy thresholds, duration, spectral features) with estimated 75-85% F1 score vs 95%+ for ASR-based detection.
- Files: `src/core/audio/FillerDetector.ts` (lines 242-298: analyzeSegment logic)
- Impact: Users may not see detected fillers they actually spoke, or see false positives. MVP labels all acoustic detections as "estimate" but this undermines core value prop.
- Fix approach: Post-session transcript reconciliation (`src/lib/fillerReconciler.ts`) helps but full solution requires ONNX keyword spotting model or complete ASR integration.

**LocalStorage Without Error Handling:**
- Issue: Multiple storage operations assume localStorage is always available but don't validate state after write.
- Files: `src/services/sessionStorage.ts` (lines 50-51), `src/services/geminiService.ts` (lines 177-182), `src/App.tsx` (lines 88-92)
- Impact: Private browsing, quota exceeded, or permission denied silently fails. Users think data saved but it isn't. No user feedback on storage failure.
- Fix approach: Wrap all localStorage calls with try-catch that returns success/failure state. Show toast notification on storage failure.

**TypeScript Type Casting Workarounds:**
- Issue: Use of `as Float32Array<ArrayBuffer>` and `as Uint8Array<ArrayBuffer>` in `src/core/audio/FillerDetector.ts` (lines 194, 197) to work around strict TypeScript typing.
- Files: `src/core/audio/FillerDetector.ts` (lines 194, 197)
- Impact: These casts hide potential type mismatches. Comments say "work around strict TypeScript lib.dom.d.ts typing" but actual issue is unclear.
- Fix approach: Verify these casts are necessary with current TypeScript version (5.9.3). If not, remove and let proper typing surface.

## Known Bugs

**Web Speech API Auto-Restart Incomplete:**
- Symptoms: Chrome sometimes stops Web Speech recognition mid-session despite `continuous=true`. Comment in code (line 219-220 in `useWebSpeech.ts`) notes this but no auto-restart implemented.
- Files: `src/core/audio/useWebSpeech.ts` (lines 217-221)
- Trigger: Extended speech sessions (10+ minutes), or browser resource constraints
- Workaround: User must manually restart. No visual indicator of listening state failure.
- Fix: Implement `onend` handler that auto-restarts if session still active.

**Filler Detection Timestamp Accumulation:**
- Symptoms: SessionStartTime is set to `Date.now()` but uses `Date.now() - sessionStartTime` for relative timing. If system time changes or multiple sessions overlap, timestamps become unreliable.
- Files: `src/core/audio/FillerDetector.ts` (lines 125, 304)
- Trigger: System clock adjustment during session, multiple sessions in quick succession
- Workaround: None - timestamps will be incorrect
- Fix: Use `performance.now()` instead of `Date.now()` for relative timing.

**Audio Duration Reporting Inconsistent:**
- Symptoms: `useAudioPlayback.ts` has multiple fallback paths for duration (estimated, loadedmetadata, durationchange, ended). MediaRecorder blobs report `Infinity` or `0` in some browsers.
- Files: `src/core/audio/useAudioPlayback.ts` (lines 63-119)
- Trigger: Certain audio codecs or browser versions
- Workaround: Uses max time reached as fallback (line 116) but this only works if playback happens
- Fix: Request audio duration from MediaRecorder stream instead of relying on blob metadata. Pre-calculate from timer state.

## Security Considerations

**API Key Storage in LocalStorage:**
- Risk: Gemini API key stored in plaintext in localStorage (`src/services/geminiService.ts` lines 168, 179).
- Files: `src/services/geminiService.ts` (lines 166-194)
- Current mitigation: Key only sent to Google's official endpoint. No other backend proxy.
- Recommendations: (1) Document that API key should be treated as sensitive (user must assume compromised if device compromised). (2) Consider server-side proxy for production to avoid storing key client-side. (3) Add warning in Settings about API key exposure.

**User Data in LocalStorage:**
- Risk: Session summaries, profile data, and diagnostic results stored unencrypted in localStorage.
- Files: `src/services/sessionStorage.ts`, `src/features/profile/profileStorage.ts`
- Current mitigation: Only runs locally in user's browser. No server sync.
- Recommendations: (1) Document privacy model clearly (/privacy page exists, good). (2) Add "clear all data" button in Settings (already exists per Settings page). (3) If server sync added in future, must encrypt before transmission.

**No Input Validation on Profile/Form Fields:**
- Risk: Free text fields in profile (demographics, history, notes) not validated or sanitized before storage.
- Files: `src/features/profile/types.ts`, `src/features/profile/ProfilePage.tsx`
- Current mitigation: React prevents direct XSS, data never displayed as raw HTML
- Recommendations: (1) Validate string length limits (very long text could bloat storage). (2) If data ever sent to server or AI, sanitize first. (3) Consider markdown parsing if profile fields support formatting later.

**Transcript Sent to Gemini API:**
- Risk: User transcripts sent to Google's Gemini API for coaching summary.
- Files: `src/services/geminiService.ts` (lines 85-101)
- Current mitigation: User opts in to AI summary. Can use app without API key (local fallback). Only sends 2000 char transcript snippet.
- Recommendations: (1) Document in /privacy that Gemini receives transcript if user generates AI summary. (2) Add clear notice before first AI summary. (3) Add option to exclude sensitive phrases from transcript before sending.

## Performance Bottlenecks

**Real-Time Filler Detection Thread Blocked:**
- Problem: Filler detector runs on main thread using `requestAnimationFrame` with full spectral analysis (FFT, centroid, flatness calculations).
- Files: `src/core/audio/FillerDetector.ts` (lines 187-207: processAudio loop)
- Cause: Every frame (16ms) calculates spectral centroid (line 327-338) and flatness (line 344-356). Heavy math in React render loop.
- Improvement path: (1) Move to Web Worker if analysis needs to be faster. (2) Reduce FFT size from 1024 to 512. (3) Skip analysis every other frame (16ms→32ms). (4) Profile with DevTools to measure actual impact (may not be bottleneck in practice).

**Weekly Trend Aggregation Recalculates Entire History:**
- Problem: `getWeeklyAggregates()` in `sessionStorage.ts` loops over all sessions every time it's called, even if history unchanged.
- Files: `src/services/sessionStorage.ts` (lines 66-115)
- Cause: No caching. Called on every Dashboard render.
- Improvement path: Add memoization with invalidation when new session saved. Or compute aggregates once on save and cache.

**Dashboard Re-renders on Every Session Addition:**
- Problem: No React memo on trend chart or session list. Adding new session causes full chart redraw.
- Files: `src/pages/Dashboard.tsx`, `src/components/WeeklyTrendChart.tsx`
- Cause: Chart data computed from sessionStorage on every render
- Improvement path: Wrap chart components in `React.memo()`. Memoize trend calculation with `useMemo`.

**Large Scenario Data in Memory:**
- Problem: All scenarios (462 lines of scenario data) loaded into memory for random selection.
- Files: `src/features/accusation-audit/scenarios.ts`
- Cause: Every scenario object with full text kept in bundle and memory
- Improvement path: For MVP probably fine (Kdenz is single-user practice app), but if scaling: lazy load scenarios, or paginate.

## Fragile Areas

**Accusation Audit Analyzer Score Calculation:**
- Files: `src/features/accusation-audit/auditAnalyzer.ts` (entire file)
- Why fragile: Scoring is deterministic text pattern matching. Any change to keywords, thresholds, or feedback logic cascades. No tests to prevent regressions.
- Safe modification: (1) Create test fixtures with known scenarios and expected scores. (2) Document scoring rubric as comments. (3) Add "explain score" debug mode that shows keyword matches.
- Test coverage: No unit tests for analyzer. Audit accuracy is core to product, but no validation framework.

**Web Speech Transcript Segment Timing:**
- Files: `src/core/audio/useWebSpeech.ts` (lines 162-187: segment timing calculation)
- Why fragile: Word timings are approximated by dividing segment duration by word count. If speaker speed varies, timing is wrong. Impacts playback highlighting.
- Safe modification: Test with various speech speeds (slow, fast, varied). Add tolerance to highlighter for timing drift.
- Test coverage: No tests. Highlighting may drift out of sync during playback.

**Audio Blob Duration Inference:**
- Files: `src/core/audio/useAudioPlayback.ts` (lines 78-119)
- Why fragile: Multiple fallback paths for duration. Order and timing of event firing varies by browser/codec. Fragile state machine.
- Safe modification: Refactor to explicit state machine (awaiting loadedmetadata → using that duration, or fallback to estimation). Add logs to track which path taken.
- Test coverage: No unit tests. Manual testing required across browsers.

**Profile Migration Logic:**
- Files: `src/features/profile/types.ts` (lines 216-269: migrateProfile function)
- Why fragile: Assumes old profile structure matches exactly. If user has partially-migrated data, migration may lose fields.
- Safe modification: (1) Add validation that old profile has expected shape before migrating. (2) Log migration steps for debugging. (3) Create backup of raw data before migration.
- Test coverage: No tests for migration. Users with old profiles may have data loss on first load.

## Scaling Limits

**LocalStorage Quota (5-10MB typical):**
- Current capacity: Codebase keeps last 30 days of sessions (see `sessionStorage.ts` line 48). Depends on session count.
- Limit: ~200 sessions at ~50KB per session hits 10MB quota on typical browser.
- Scaling path: (1) For MVP, 200 sessions (27 days at 7/day) is probably fine. (2) If users practice more, implement server sync to offload old data. (3) Add quota warning when approaching limit.

**Spectral Analysis FFT Size:**
- Current capacity: FFT size 1024 (line 106 in FillerDetector.ts) gives ~22Hz frequency resolution at 16kHz.
- Limit: Larger FFT improves accuracy but increases CPU. Smaller FFT loses accuracy.
- Scaling path: Current size is standard. If accuracy insufficient, upgrade to ONNX model instead.

## Dependencies at Risk

**Google Generative AI SDK (@google/genai ^1.31.0):**
- Risk: Pre-1.0 package (1.31.0) may have breaking changes. Pin is loose (^1.31.0 allows up to <2.0).
- Impact: `npm install` on future date may pull breaking version.
- Migration plan: (1) Use Gemini API directly (already done in `geminiService.ts`, not using SDK). (2) If SDK used elsewhere, pin to exact version (1.31.0 not ^1.31.0).

**React 19 Stability:**
- Risk: React 19.2.0 is latest major. May have unfixed bugs in edge cases (e.g., Suspense, concurrent rendering).
- Impact: Web Speech API integration uses refs and callbacks heavily. May expose React bugs.
- Migration plan: Monitor React issues. If blocker found, rollback to React 18 (which is stable LTS).

## Missing Critical Features

**No Session Playback Persistence:**
- Problem: Audio blobs stored in state, not in indexedDB or server. Blob URLs expire when tab closed.
- Blocks: Can't listen to old sessions later (deferred to v1.1 per CLAUDE.md, but users will expect it).
- Fix: Store blob or audio data via indexedDB for 30-day retention.

**No Transcript Save/Export:**
- Problem: Transcripts shown during session but not saved (only summary stats saved).
- Blocks: Users can't review what they said later. No record for coach review.
- Fix: Save full transcript with session data in sessionStorage.

**No Error Recovery for Audio Recording:**
- Problem: If MediaRecorder fails mid-session, no recovery path. User loses entire session.
- Blocks: Users can't trust app for important practice.
- Fix: (1) Validate audio capture on start. (2) Check blob size before considering it valid. (3) If blob empty/too small, show error and allow retry.

**No Offline Indication:**
- Problem: If network drops during Gemini API call, user sees "loading" forever. No timeout or explicit offline message.
- Blocks: User experience unclear when waiting for AI summary.
- Fix: Add 10-second timeout on Gemini fetch. Show "network error, using local summary" message.

## Test Coverage Gaps

**No Unit Tests for Core Detection Logic:**
- What's not tested:
  - FillerDetector spectral analysis (accuracy verification)
  - Audio analyzer scoring and thresholds
  - Web Speech transcript segment timing
  - Profile migration edge cases
- Files: `src/core/audio/FillerDetector.ts`, `src/features/accusation-audit/auditAnalyzer.ts`, `src/core/audio/useWebSpeech.ts`
- Risk: Core product features (filler detection, audit scoring) have no regression protection. Changes to thresholds or keywords ship with no validation.
- Priority: HIGH - These are user-facing features that determine product quality.

**No Integration Tests for Audio Pipeline:**
- What's not tested:
  - Audio capture → filler detection → playback highlighting flow
  - Web Speech transcript synchronization with filler timestamps
  - Duration reporting across browsers
- Risk: Pipeline may work in isolation but fail when integrated (timing mismatches, lost events).
- Priority: HIGH - This is core workflow.

**No Browser Compatibility Tests:**
- What's not tested:
  - Web Speech API behavior on Chrome versions (89, 90, 91, etc.)
  - Audio codec handling (WAV vs MP3 vs MP4)
  - Duration reporting on different hardware
- Risk: Users on slightly older Chrome or unusual hardware may experience silent failures.
- Priority: MEDIUM - Can be addressed after MVP launch with telemetry.

**No E2E Tests for User Flows:**
- What's not tested:
  - Welcome → practice session → AI summary complete flow
  - Audit brainstorm → presentation → recording → feedback flow
  - Profile save → practice session using profile → result different?
- Risk: Regressions in routes, component lifecycle, or state management undetected.
- Priority: MEDIUM - Manual testing by user during beta covers this.

---

*Concerns audit: 2026-02-02*
