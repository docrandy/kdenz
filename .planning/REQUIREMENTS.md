# Requirements: VoiceLab (Kdenz MVP)

**Defined:** 2026-01-25
**Core Value:** Users discover unconscious speaking habits they didn't know they had

## v1 Requirements

Requirements for private beta release.

### Audio Pipeline

- [ ] **AUDIO-01**: User can start/stop voice recording via single button
- [ ] **AUDIO-02**: Audio captured via MediaRecorder for playback
- [ ] **AUDIO-03**: Real-time audio analysis runs during recording (pitch, volume, tempo)
- [ ] **AUDIO-04**: Silence detected after 10 seconds triggers nudge prompt

### Filler Detection

- [ ] **FILLER-01**: Acoustic filler detection runs in real-time during speech
- [ ] **FILLER-02**: Transcript-based filler reconciliation runs at session end
- [ ] **FILLER-03**: Filler timestamps captured for playback markers
- [ ] **FILLER-04**: Filler types distinguished (um, uh, like, you know)

### Visual Feedback

- [ ] **VIZ-01**: Real-time filler count displayed as visual gauge (not plain number)
- [ ] **VIZ-02**: WPM displayed with visual indicator during session
- [ ] **VIZ-03**: Weekly trend chart shows filler rate across sessions
- [ ] **VIZ-04**: Post-session scorecard displays all metrics summary

### Playback

- [ ] **PLAY-01**: User can play back recorded audio after session
- [ ] **PLAY-02**: Playback timeline shows filler markers at timestamps
- [ ] **PLAY-03**: User can tap filler marker to seek to that moment
- [ ] **PLAY-04**: Playback speed controls available (0.75x, 1x, 1.25x)

### Transcript

- [ ] **TRANS-01**: Transcript captured via Web Speech API (Chrome)
- [ ] **TRANS-02**: Transcript displays after session with segments
- [ ] **TRANS-03**: Toggle switches between pace highlights and filler highlights
- [ ] **TRANS-04**: Only one highlight type visible at a time

### Session Flow

- [ ] **SESS-01**: Duration selection UI (30s/60s/90s+)
- [ ] **SESS-02**: Countdown timer displays during session
- [ ] **SESS-03**: Session auto-stops at duration end
- [ ] **SESS-04**: Manual stop button available at any time

### AI Summary

- [ ] **AI-01**: Generate Summary button triggers Gemini API call
- [ ] **AI-02**: AI summary displays coaching insights post-session
- [ ] **AI-03**: Any API error falls back to local stats only (graceful degradation)

### Diagnostics

- [ ] **DIAG-01**: 3-5 question onboarding from Volitional framework
- [ ] **DIAG-02**: Diagnostic results stored locally
- [ ] **DIAG-03**: Diagnostic context passed to AI summary generation

### Browser & Platform

- [x] **PLAT-01**: Chrome browser detection on page load ✓
- [x] **PLAT-02**: Non-Chrome users see warning with explanation ✓
- [x] **PLAT-03**: App deployed to Vercel with public URL ✓

### Content Pages

- [ ] **PAGE-01**: Privacy transparency page at /privacy
- [ ] **PAGE-02**: In-app feedback button (opens email/form)
- [ ] **PAGE-03**: 1-2 optional speaking prompts available before session

### UI/Design

- [x] **UI-01**: High-Performance Clinical theme applied (white/black/teal) ✓
- [x] **UI-02**: Light mode only (no dark mode toggle) ✓
- [ ] **UI-03**: Mobile layout usable on Chrome mobile

## v2 Requirements

Deferred to future releases.

### v1.1

- **HIST-01**: Session history stored and viewable
- **HIST-02**: Streak counter tracks consecutive practice days
- **HIST-03**: Badges/achievements for milestones

### v1.2

- **SKILL-01**: Mirroring detection in transcript
- **SKILL-02**: Labeling detection in transcript
- **SKILL-03**: Calibrated questions detection
- **SKILL-04**: Real-time AI coaching during session

### v1.3

- **PSYCH-01**: Full NegotiateAI diagnostic integration
- **PSYCH-02**: Scenario simulations with AI opponent

## Out of Scope

| Feature | Reason |
|---------|--------|
| Safari/Firefox support | Safari Web Speech API has 90% accuracy drop + critical bugs |
| User accounts/auth | Not needed for private beta with known testers |
| Dark mode | Single theme reduces complexity for beta |
| PDF/export | Not needed for awareness validation |
| Backend server | Vercel static + localStorage sufficient for MVP |
| Emotion detection | Privacy concerns, bias issues (see research.txt) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | 01 | Complete |
| UI-02 | 01 | Complete |
| PLAT-01 | 01 | Complete |
| PLAT-02 | 01 | Complete |
| PLAT-03 | 01 | Complete |

**Coverage:**
- v1 requirements: 30 total
- Complete: 5
- Remaining: 25

---
*Requirements defined: 2026-01-25*
*Last updated: 2026-01-25 - Phase 01 requirements complete*
