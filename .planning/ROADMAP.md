# Roadmap: kdenz

## Overview

This roadmap delivers a Chrome-only speech practice MVP that helps users reduce filler words through real-time feedback and post-session playback. The journey moves from project foundation (vendoring Black Swan modules, browser gating) through audio capture and detection, then builds up real-time feedback gauges, playback with timeline markers, and session statistics. Final phase deploys to Vercel for beta testers.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Project scaffold, vendor audio modules, browser gate
- [ ] **Phase 2: Audio Pipeline** - Mic recording with VAD and filler detection
- [ ] **Phase 3: Filler Feedback** - Real-time heat gauge with pulse and running count
- [ ] **Phase 4: Pace Feedback** - WPM display, banding, silence nudge
- [ ] **Phase 5: Playback Core** - Audio playback with seekable timeline
- [ ] **Phase 6: Playback Markers** - Filler markers and click-to-jump
- [ ] **Phase 7: Session Summary** - Statistics display with all metrics
- [ ] **Phase 8: Polish & Deploy** - Dark performance theme, glanceability, Vercel deployment

## Phase Details

### Phase 1: Foundation
**Goal**: Project is set up with vendored audio modules from Black Swan, time authority established, silence semantics defined, and non-Chrome users are blocked from core functionality
**Depends on**: Nothing (first phase)
**Requirements**: BG-01, BG-02, BG-03, DEP-01, TF-01, TF-02
**Success Criteria** (what must be TRUE):
  1. User visiting on Chrome sees no browser warning
  2. User visiting on Safari/Firefox sees global warning banner
  3. User on non-Chrome cannot access recording features
  4. Project is initialized on GitHub repository
  5. Vendored AudioEngine, VAD, FillerDetector exist in project
  6. Single monotonic clock established as time authority for all session timestamps
  7. Silence semantics documented and enforced: unfilled pause vs filled pause clearly distinguished
**Plans**: TBD

Plans:
- [ ] 01-01: Project scaffold and GitHub setup
- [ ] 01-02: Vendor Black Swan audio modules
- [ ] 01-03: Implement browser detection and gate
- [ ] 01-04: Establish time authority and silence semantics

### Phase 2: Audio Pipeline
**Goal**: User can record audio from microphone with voice activity detection and filler detection running, with detection stabilization and timeline contracts established
**Depends on**: Phase 1
**Requirements**: REC-01, REC-02, REC-03, REC-04, TF-03, TF-04
**Success Criteria** (what must be TRUE):
  1. User can click Start and grant microphone permission
  2. User can click Stop and recording ends cleanly
  3. System detects when user is speaking vs silent (VAD)
  4. System detects "um" and "uh" sounds during recording
  5. Late filler events cannot corrupt real-time readings (timestamping + grace period)
  6. Real-time display and playback timeline use separate event contracts
**Plans**: TBD

Plans:
- [ ] 02-01: Recording controls UI (start/stop)
- [ ] 02-02: Integrate VAD for voice activity detection
- [ ] 02-03: Integrate FillerDetector for um/uh detection
- [ ] 02-04: Detection stabilization and timeline contracts

### Phase 3: Filler Feedback
**Goal**: User can see a real-time filler heat gauge that shows their filler rate and pulses on detection
**Depends on**: Phase 2
**Requirements**: RT-01, RT-02, RT-03
**Success Criteria** (what must be TRUE):
  1. User sees filler heat gauge showing fillers/min over rolling window
  2. Gauge visibly pulses when filler is detected
  3. Running filler count is displayed alongside the gauge
**Plans**: TBD

Plans:
- [ ] 03-01: Filler heat gauge component with rolling window
- [ ] 03-02: Pulse animation on filler detection
- [ ] 03-03: Running count display

### Phase 4: Pace Feedback
**Goal**: User can see their speaking pace and receives nudge when silent too long
**Depends on**: Phase 3
**Requirements**: RT-04, RT-05, RT-06, RT-07
**Success Criteria** (what must be TRUE):
  1. User sees current WPM based on VAD-active speaking time
  2. WPM display shows banding indicator (slow/normal/fast)
  3. After >2.0s of continuous silence, user sees a nudge
  4. Silence threshold can be configured
**Plans**: TBD

Plans:
- [ ] 04-01: WPM calculation and display
- [ ] 04-02: Banding indicator (slow/normal/fast)
- [ ] 04-03: Silence nudge with configurable threshold

### Phase 5: Playback Core
**Goal**: User can play back their recorded audio and seek to any position
**Depends on**: Phase 2
**Requirements**: PB-01, PB-03
**Success Criteria** (what must be TRUE):
  1. User can click play to hear their recorded audio
  2. Timeline shows playback position
  3. User can click anywhere on timeline to seek
**Plans**: TBD

Plans:
- [ ] 05-01: Audio playback controls
- [ ] 05-02: Seekable timeline component

### Phase 6: Playback Markers
**Goal**: User can see and interact with filler markers on the playback timeline
**Depends on**: Phase 5
**Requirements**: PB-02, PB-04
**Success Criteria** (what must be TRUE):
  1. Timeline displays markers at each filler detection point
  2. User can click a filler marker to jump directly to that moment
**Plans**: TBD

Plans:
- [ ] 06-01: Render filler markers on timeline
- [ ] 06-02: Click-to-jump marker interaction

### Phase 7: Session Summary
**Goal**: User sees comprehensive statistics about their speaking session after recording
**Depends on**: Phase 4, Phase 6
**Requirements**: SUM-01, SUM-02, SUM-03, SUM-04, SUM-05, SUM-06, SUM-07
**Success Criteria** (what must be TRUE):
  1. User sees total filler count for the session
  2. User sees fillers per minute rate
  3. User sees average WPM with banding label
  4. User sees longest pause duration and count of pauses >2.0s
  5. User sees speaking vs silence ratio
  6. User sees visual timeline with filler markers
**Plans**: TBD

Plans:
- [ ] 07-01: Session statistics calculation
- [ ] 07-02: Summary display layout
- [ ] 07-03: Summary timeline visualization

### Phase 8: Polish & Deploy
**Goal**: Application has cohesive Peloton-style dark performance UI and is deployed to Vercel for beta testers
**Depends on**: Phase 7
**Requirements**: DEP-02, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Application uses Peloton-style dark performance UI (dark canvas, high-contrast text, bold accents)
  2. All real-time gauges are glanceable while speaking
  3. Functional clarity is evident (no confusing UI)
  4. Application is deployed to Vercel with automatic deploys from main
**Plans**: TBD

Plans:
- [ ] 08-01: Apply dark performance theme with design tokens
- [ ] 08-02: Glanceability audit and refinements
- [ ] 08-03: Vercel deployment configuration

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/4 | Not started | - |
| 2. Audio Pipeline | 0/4 | Not started | - |
| 3. Filler Feedback | 0/3 | Not started | - |
| 4. Pace Feedback | 0/3 | Not started | - |
| 5. Playback Core | 0/2 | Not started | - |
| 6. Playback Markers | 0/2 | Not started | - |
| 7. Session Summary | 0/3 | Not started | - |
| 8. Polish & Deploy | 0/3 | Not started | - |

---
*Roadmap created: 2025-01-25*
*Total phases: 8 | Total plans: 24 | v1 requirements: 34/34 mapped*
