# agents.md - Kdenz Project Constraints

## Architectural Invariants

1. **Single Mode Only**: No mode selection UI. One practice flow.
2. **Light Mode Only**: No dark mode toggle or theming.
3. **Local-First Metrics**: WPM, filler detection, pitch all client-side.
4. **AI for Summary Only**: Gemini used for post-session summary, not real-time coaching.
5. **No Skill Detection in MVP**: Mirroring, labeling, calibrated questions are v1.2.
6. **No Psychological Profiling**: NegotiateAI integration is v1.3.

## Technical Constraints

1. **Chrome-Only for Beta**: Safari Web Speech API has 90% accuracy drop + critical bugs. Show warning for non-Chrome.
2. **Web Speech API for Transcripts**: Browser-native (Chrome), no external STT service for MVP.
3. **Hybrid Filler Detection**: Acoustic real-time + transcript reconciliation at session end.
4. **FillerDetector is Post-Turn**: Never display filler detection during active speech (acoustic).
5. **Graceful Degradation**: Any Gemini API error = show local stats only.
6. **No Firebase for MVP**: localStorage for any persistence needed.
7. **Vercel for Deployment**: No backend required for MVP.

## UI Rules

1. **Visual Gauges Required**: Real-time filler count as gauge (Peloton-style), not plain numbers. Research shows 3.5x retention.
2. **Weekly Trend Chart**: Show progress across sessions even with minimal data.
3. **One Highlight Type at a Time**: Transcript shows pace OR fillers via toggle, not both simultaneously.
4. **Playback with Markers**: Audio playback timeline shows filler markers. Tap to seek.
5. **Button for AI Summary**: User triggers AI generation, not automatic.
6. **Practice Again Flow**: After scorecard, return to duration select, not landing.
7. **Silence Nudge at 10s**: If no speech detected for 10 seconds, show gentle prompt.

## Reuse Rules

1. **From Black Swan**: Audio pipeline, FillerDetector, geminiService base
2. **Do Not Port**: Scenarios, skill detectors, personas, community features
3. **Strip**: All conversation/, scenarios/, training/, community/ components

## Scope Protection

**IN MVP** (research-validated):
- Audio playback with filler highlighting (behavior change driver)
- Light diagnostics (3-5 questions onboarding, periodic refresh)
- Privacy transparency page
- 1-2 optional speaking prompts

**Do NOT add to MVP**:
- Session history (v1.1)
- User accounts/auth
- Leaderboards
- Multiple voice presets
- PDF/export features
- Streak counter (v1.1)
- Badges/achievements (v1.1)
- Real-time AI coaching during session (v2)
- Full psychological profiling (v1.3)
