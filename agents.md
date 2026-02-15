# agents.md - Kdenz Communication Training Platform

## Platform Invariants (Research-Proven)

1. **Generic drill engine.** 16 of 23 score-5 techniques reuse labeling infrastructure (prompt -> response -> AI evaluation). Build one parameterized engine; configure per technique via scoring rubric and feedback template. [R8, R10, R13]
2. **Diagnose internally, intervene externally.** System tracks gate failures and root causes. User never sees gate labels, constraint numbers, or failure diagnoses. User sees contextually appropriate nudges, exercises, and encouragement. [R11]
3. **Three skill types with different decay rates.** Syntax-driven: 0.08/month (half-life 4-5 months). Judgment-based: 0.06/month (half-life 6-8 months). Recognition: slowest (half-life 8-10 months). Tag every technique in the skills table. [R15]
4. **Practice before exposure.** User attempts technique blind first, THEN sees expert demo. Institute content unlocks after first drill attempt, not before. [R12]
5. **Adjacency list for skill DAG.** 57 techniques, max depth 5, stored in `skill_prerequisites` table. Edge function checks prerequisites on-demand before allowing drill/simulation start. Adjacency list is optimal for <100 nodes. [R9, R16]
6. **State object pattern for simulations.** `{ mood, trust_level, concessions, revelation_stage }` passed as JSON each turn. System instruction is static per session; state object is dynamic. AI opponent reads state before every response. [R4, R14]
7. **4-dimension quality scoring.** Every technique instance scored on form (0-3) + accuracy (0-3) + impact (0-3) + timing (0-2). Composite: `0.25*form + 0.35*accuracy + 0.3*impact + 0.1*timing`. "Clumsy but attuned" outranks "polished but mis-attuned." [R5]
8. **Rule-based diagnostics first.** 9-gate VCM engine uses IF/THEN rules, not ML. Graduate to ML after 3-6 months of behavioral data. Start with Gates C, F, G (clearest behavioral signatures). [R11]
9. **Behavioral event logging.** Track all interactions (app_open, drill_start, drill_quit, hover_duration, exit_point), not just completions. This is the prerequisite for VCM gate detection. [R11, R16]
10. **Never miss twice.** Users who resume within 24 hours maintain habits 37% longer. Implement explicitly in streak mechanics and recovery messaging. [R11, R15]

## Architectural Invariants

1. **Five product pillars.** Voice Practice + Skills Lab + Simulation Studio + Institute + VCM Diagnostics. Each pillar has distinct UI, data model, and evaluation logic.
2. **Light mode only.** No dark mode toggle or theming for beta.
3. **Local-first voice metrics.** WPM, filler detection, pitch analysis remain client-side. Hume batch API for prosody via backend proxy.
4. **Gemini for evaluation and simulation.** Gemini 2.5 Flash as deterministic rater (temperature 0.1, JSON-only output) for technique scoring. Gemini as AI opponent in Simulation Studio.
5. **Supabase for persistence.** 22-table schema with RLS. Replaces localStorage. Migration path: deploy schema -> seed reference data -> migrate existing localStorage -> remove localStorage code paths.
6. **Skill detection is in scope.** 57 techniques across Voss, MI, CBT, NVC, Crucial/Difficult Conversations, and corporate frameworks. 5-level mastery system (0=Not Started through 4=Mastered).
7. **VCM diagnostics is in scope.** 9-gate behavioral model (V2) (Awareness through Integration). Rule-based prescription engine. Diagnose internally, intervene externally.

## Technical Constraints

1. **Chrome-only for beta voice features.** Safari Web Speech API has 90% accuracy drop + critical bugs. Show warning for non-Chrome users. Deepgram path planned for cross-browser.
2. **Web Speech API for transcripts.** Browser-native (Chrome) for beta. Deepgram for production cross-browser support.
3. **Hybrid filler detection.** Acoustic real-time + transcript reconciliation at session end.
4. **Graceful degradation.** Any Gemini API error = show local stats only. Any Supabase error = fall back to localStorage.
5. **Vercel for deployment.** Supabase Edge Functions for server-side logic (SRS calculation, VCM diagnostics, prerequisite checks).
6. **Audio storage: temporary blobs.** Upload to Supabase Storage, process via Hume batch, auto-delete after 24 hours.
7. **Simulation cost control.** System prompt ~500-800 tokens per turn. State object ~100-200 tokens. Total per 20-turn session: ~$0.01-0.02.

## UI Rules

1. **Visual gauges required.** Real-time filler count as gauge (Peloton-style), not plain numbers. 3.5x retention vs plain numbers.
2. **Weekly trend chart.** Show progress across sessions even with minimal data.
3. **Playback with markers.** Audio playback timeline shows filler markers. Tap to seek.
4. **Guided -> scaffolded -> free-form progression.** Tier 1-2A simulations are guided (technique prompted). Tier 2B-3 are scaffolded (suggested, not required). Tier 3-4 are free-form (post-detection only).
5. **5 drill formats.** Prompt-response, audio-spoken, multiple-choice, rewrite, spot-the-technique. Drill engine must support format selection per technique.
6. **Positive framing always.** No deficit language in user-facing copy. "Quick refresher to lock in your skill" not "Your skill is fading."
7. **Silence nudge at 10s.** If no speech detected for 10 seconds in voice practice, show gentle prompt.

## Reuse Rules

1. **From Black Swan.** Audio pipeline, FillerDetector, geminiService base.
2. **Do not port.** Scenarios, old skill detectors, personas, community features.
3. **Strip.** All conversation/, scenarios/, training/, community/ components from Black Swan source.

## Scope: Platform Build Phases

**Phase 1 (Voice Practice + Skills Lab foundation):**
- Voice practice (filler detection, playback, real-time feedback)
- Generic drill engine (prompt-response format)
- 10 Tier A drill-first techniques
- Supabase schema deployment + auth
- Behavioral event logging

**Phase 2 (Simulation Studio + Institute):**
- AI opponent system (Levels 1-3)
- 45 base simulation scenarios
- Institute content architecture
- Hume batch integration for audio drills
- VCM diagnostic engine (Gates C, F, G)

**Phase 3 (Advanced + Retention):**
- AI opponent Levels 4-5
- Spaced repetition system (simple interval, then HLR)
- Full VCM diagnostic engine (all 9 gates)
- Advanced drill formats (rewrite, spot-the-technique)
- Real-world transfer challenges
