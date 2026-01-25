# Requirements: kdenz

**Defined:** 2025-01-25
**Core Value:** Users can see exactly when and how often they say "um/uh" so they can consciously reduce filler words while speaking.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Recording

- [ ] **REC-01**: User can start recording from microphone
- [ ] **REC-02**: User can stop recording and end session
- [ ] **REC-03**: System detects voice activity using vendored VAD
- [ ] **REC-04**: System detects filled pauses (um/uh) using vendored FillerDetector

### Real-time Feedback

- [ ] **RT-01**: Filler heat gauge shows fillers/min over rolling 15-30s window
- [ ] **RT-02**: Gauge pulses briefly on each detected filler
- [ ] **RT-03**: Running filler count displayed alongside gauge
- [ ] **RT-04**: WPM display shows current speaking pace (words / VAD-active time, not wall-clock)
- [ ] **RT-05**: WPM includes banding indicator (slow/normal/fast)
- [ ] **RT-06**: Silence nudge appears after >2.0s continuous VAD silence
- [ ] **RT-07**: Silence threshold is configurable

### Playback

- [ ] **PB-01**: User can play back recorded audio
- [ ] **PB-02**: Timeline displays filler markers at detection points
- [ ] **PB-03**: User can seek by clicking anywhere on timeline
- [ ] **PB-04**: User can click filler marker to jump to that moment

### Session Summary

- [ ] **SUM-01**: Display total filler count
- [ ] **SUM-02**: Display fillers per minute rate
- [ ] **SUM-03**: Display average WPM with banding label (words / VAD-active time)
- [ ] **SUM-04**: Display longest pause duration (continuous VAD silence)
- [ ] **SUM-05**: Display count of pauses >2.0s (continuous VAD silence)
- [ ] **SUM-06**: Display speaking vs silence ratio
- [ ] **SUM-07**: Show visual timeline with filler markers

### Browser Gate

- [ ] **BG-01**: Detect if browser is Chrome
- [ ] **BG-02**: Show global warning banner on non-Chrome browsers
- [ ] **BG-03**: Block core recording functionality on non-Chrome

### Deployment

- [ ] **DEP-01**: Project hosted on GitHub repository
- [ ] **DEP-02**: Deployed to Vercel with automatic deploys from main branch

### UI/UX

- [ ] **UI-01**: Minimal clinical theme (white/black/teal)
- [ ] **UI-02**: All real-time gauges are glanceable while speaking
- [ ] **UI-03**: Functional clarity prioritized over polish

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Enhanced Detection

- **ED-01**: Detect lexical fillers (like, you know, so, basically) via ASR transcript
- **ED-02**: User-configurable filler word list
- **ED-03**: Detection of "er/ah" if not already supported

### Session Management

- **SM-01**: Pause and resume recording mid-session
- **SM-02**: Clean streak timer (time since last filler)
- **SM-03**: Save sessions to localStorage
- **SM-04**: View history of past sessions

### Advanced Analytics

- **AA-01**: Progress tracking across sessions
- **AA-02**: Trend charts for filler rate over time
- **AA-03**: Export session data

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Negotiation scenarios | Not relevant to speech practice focus |
| Persona switcher | Negotiation-specific feature |
| Skill detectors | Negotiation-specific feature |
| User accounts/auth | MVP is local-only, no backend needed |
| Firebase/database | Keep it client-side with localStorage |
| Non-Chrome support | Chrome-only beta simplifies audio APIs |
| Mobile optimization | Desktop Chrome first |
| Pixel-perfect polish | Functional clarity is priority for beta |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| REC-01 | — | Pending |
| REC-02 | — | Pending |
| REC-03 | — | Pending |
| REC-04 | — | Pending |
| RT-01 | — | Pending |
| RT-02 | — | Pending |
| RT-03 | — | Pending |
| RT-04 | — | Pending |
| RT-05 | — | Pending |
| RT-06 | — | Pending |
| RT-07 | — | Pending |
| PB-01 | — | Pending |
| PB-02 | — | Pending |
| PB-03 | — | Pending |
| PB-04 | — | Pending |
| SUM-01 | — | Pending |
| SUM-02 | — | Pending |
| SUM-03 | — | Pending |
| SUM-04 | — | Pending |
| SUM-05 | — | Pending |
| SUM-06 | — | Pending |
| SUM-07 | — | Pending |
| BG-01 | — | Pending |
| BG-02 | — | Pending |
| BG-03 | — | Pending |
| DEP-01 | — | Pending |
| DEP-02 | — | Pending |
| UI-01 | — | Pending |
| UI-02 | — | Pending |
| UI-03 | — | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 0
- Unmapped: 30

---
*Requirements defined: 2025-01-25*
*Last updated: 2025-01-25 after initial definition*
