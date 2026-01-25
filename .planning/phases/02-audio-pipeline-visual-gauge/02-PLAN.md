# Phase 02: Audio Pipeline & Visual Gauge

**Status:** Planning
**Created:** 2026-01-25
**Goal:** Mic capture to real-time metrics display loop working

---

## Locked Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Black Swan reuse | Selective extraction | Port FillerDetector.ts verbatim, adapt useFillerDetector.ts lightly, extract minimal pipeline from AudioEngine.ts |
| Web Speech API | Interim results only | Real-time WPM estimation; final accuracy deferred to Phase 05 |
| Filler gauge style | Circular arc gauge | 270° arc (open bottom), fill-only, color gradient green→yellow→red |
| Silence detection | Audio/VAD-based | Trigger at 10s continuous silence, not transcript-gap |
| Update frequency | 250ms fixed cadence | Applies to filler gauge, silence timer, WPM display |
| Weekly trend shell | Days × Filler rate | X: Mon–Sun, Y: aggregate filler rate (%), no data in Phase 02 |

---

## Requirements Addressed

| ID | Requirement | Implementation |
|----|-------------|----------------|
| AUDIO-01 | Start/stop voice recording | Single button toggles mic capture + all analysis |
| AUDIO-02 | Audio captured for playback | MediaRecorder runs parallel to analysis stream |
| AUDIO-03 | Real-time audio analysis | VAD + filler detection on 250ms cadence |
| AUDIO-04 | Silence detection (10s nudge) | VAD-based timer, resets on voice activity |
| FILLER-01 | Acoustic filler detection | FillerDetector.ts (ported from Black Swan) |
| VIZ-01 | Filler gauge (visual) | Circular arc gauge component |
| VIZ-02 | WPM indicator | Numeric + visual indicator from interim transcript |

---

## Success Criteria

- [ ] AudioEngine connected to PracticeSession
- [ ] WPM calculation implemented from interim transcript
- [ ] FillerDetector integrated (acoustic real-time)
- [ ] Real-time filler gauge displays live count
- [ ] Weekly trend chart shell exists (no data population)
- [ ] Silence detection triggers nudge after 10s

---

## Execution Plans

### Plan 02-01: Black Swan Port & Audio Foundation

**Scope:** Extract and integrate core audio components

**Tasks:**
1. Port `FillerDetector.ts` verbatim to `src/core/audio/`
2. Adapt `useFillerDetector.ts` (strip toggle logic, simplify interface)
3. Extract minimal VAD from AudioEngine.ts (exclude analytics, persistence)
4. Create `useAudioCapture.ts` hook (mic access, MediaRecorder, stream split)
5. Wire audio capture to PracticeSession start/stop button

**Acceptance:**
- Mic capture starts on button press
- Audio stream available for analysis
- MediaRecorder captures audio blob for future playback
- No errors in Chrome console

**Dependencies:** None (Phase 01 complete)

---

### Plan 02-02: Web Speech API Integration

**Scope:** Interim transcript for WPM calculation

**Tasks:**
1. Create `useWebSpeech.ts` hook wrapping SpeechRecognition API
2. Configure for continuous mode + interim results
3. Implement word count extraction from interim results
4. Calculate WPM: (word_count / elapsed_seconds) * 60
5. Expose WPM value on 250ms update cadence

**Acceptance:**
- Speech recognition starts with audio capture
- Interim results stream during speech
- WPM updates every 250ms
- Handles Chrome-only gracefully (warning already exists)

**Dependencies:** 02-01 (audio capture active)

---

### Plan 02-03: Filler Detection Integration

**Scope:** Real-time acoustic filler detection

**Tasks:**
1. Connect FillerDetector to audio analysis stream
2. Create filler event emitter (type, timestamp, confidence)
3. Accumulate filler count during session
4. Expose count + rate on 250ms cadence
5. Store filler timestamps for Phase 04 playback markers

**Acceptance:**
- Filler events detected during speech
- Count increments in real-time
- Timestamps captured with each detection
- No false positives on silence

**Dependencies:** 02-01 (audio stream available)

---

### Plan 02-04: Visual Components

**Scope:** Filler gauge, WPM indicator, silence nudge, trend shell

**Tasks:**
1. Create `FillerGauge.tsx` - 270° arc, fill-only, gradient
2. Create `WPMIndicator.tsx` - numeric + visual bar
3. Create `SilenceNudge.tsx` - appears after 10s silence
4. Create `WeeklyTrendChart.tsx` - shell with placeholder data
5. Integrate all components into PracticeSession layout

**Acceptance:**
- Filler gauge renders with 0-N scale, updates every 250ms
- WPM indicator shows current pace with color coding
- Silence nudge appears at 10s, dismisses on voice
- Weekly trend chart renders with mock Mon-Sun structure
- All styled per High-Performance Clinical theme

**Dependencies:** 02-02, 02-03 (metrics available to display)

---

### Plan 02-05: Silence Detection & Session Loop

**Scope:** VAD-based silence timer + complete session loop

**Tasks:**
1. Implement silence timer using VAD signal
2. Timer resets on any voice activity detection
3. Trigger nudge visibility at 10s threshold
4. Verify complete loop: Start → Capture → Analyze → Display → Stop
5. Ensure clean teardown (stop mic, recognition, timers)

**Acceptance:**
- Silence timer counts accurately
- Nudge appears at exactly 10s of silence
- Nudge dismisses immediately on voice
- Session start/stop is clean (no orphan streams)
- Memory usage stable across multiple sessions

**Dependencies:** 02-01 through 02-04

---

## Plan Execution Order

```
02-01 (Audio Foundation)
   │
   ├──► 02-02 (Web Speech API) ──┐
   │                              │
   └──► 02-03 (Filler Detection) ─┼──► 02-04 (Visual Components)
                                  │           │
                                  └───────────┴──► 02-05 (Session Loop)
```

**Parallelizable:** 02-02 and 02-03 can run in parallel after 02-01
**Sequential:** 02-04 requires 02-02 + 02-03; 02-05 requires all prior

---

## Files to Create/Modify

### New Files (src/core/audio/)
- `FillerDetector.ts` - Ported from Black Swan
- `useFillerDetector.ts` - Adapted hook
- `useAudioCapture.ts` - Mic + MediaRecorder
- `useWebSpeech.ts` - Web Speech API wrapper
- `useSilenceTimer.ts` - VAD-based silence detection

### New Files (src/components/)
- `FillerGauge.tsx` - Circular arc gauge
- `WPMIndicator.tsx` - Words per minute display
- `SilenceNudge.tsx` - 10s silence prompt
- `WeeklyTrendChart.tsx` - Shell with placeholder

### Modified Files
- `src/components/PracticeSession.tsx` - Wire all components
- `src/App.tsx` - Session state management (if needed)

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| FillerDetector port has hidden dependencies | Audit imports before porting; stub any missing deps |
| Web Speech API browser quirks | Test interim result behavior; add error boundary |
| VAD false triggers on background noise | Add configurable silence threshold |
| 250ms cadence causes UI jank | Use requestAnimationFrame for visual updates |
| MediaRecorder + analysis stream conflict | Split stream at capture point, not downstream |

---

## Out of Scope (Phase 02)

- Transcript reconciliation (Phase 05)
- Playback controls (Phase 04)
- Session duration/timer (Phase 03)
- Scorecard population (Phase 06)
- Real data in weekly trend (Phase 06)

---

## Verification Checklist

After Phase 02 execution:

1. [ ] Press Start → mic activates, all analysis begins
2. [ ] Speak → WPM updates, filler count increments
3. [ ] Say "um" → gauge reflects detection within 250ms
4. [ ] Stay silent 10s → nudge appears
5. [ ] Resume speaking → nudge dismisses
6. [ ] Press Stop → all streams stop cleanly
7. [ ] Weekly trend chart renders (with placeholder data)
8. [ ] No console errors in Chrome
9. [ ] Works on deployed Vercel URL

---

*Plan created: 2026-01-25*
*Status: Awaiting approval*
