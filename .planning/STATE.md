# Project State: VoiceLab

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-17)

**Core value:** Users practice negotiation and difficult conversation techniques through data-driven drills and real-time feedback
**Current focus:** v3.0 Generic Drill Engine — Phase 20: Drill Engine + Scoring

## Current State

**Status:** Phase 20 in progress — 20-01, 20-02, and 20-03 complete
**Version:** v3.0 Generic Drill Engine
**Previous:** v2.0 Dark Premium Transformation (COMPLETE), v1.0 shipped 2026-02-05
**Deployed:** https://kdenz.vercel.app (v2.0 + 5-pillar navigation active)
**Last Action:** 2026-02-18 - Completed 20.1-03 (Institute content tagging schema + 10 seed items + LearnerProfile + routing algorithm)

**Progress:** [█--------------------] 25% (1/4 phases complete, 3/4 plans in Phase 20)

## Milestone Summary

**v3.0 Generic Drill Engine — IN PROGRESS**

**Scope:** Prompt-Response drill engine for 8 Tier A techniques, rules + LLM evaluation, mastery tracking with spaced repetition intervals, Skills Lab integration. localStorage persistence.

**Phase structure:**
- Phase 19: Technique Data Foundation — COMPLETE
- Phase 20: Drill Engine + Scoring — IN PROGRESS (20-01 COMPLETE, 20-02 COMPLETE, 20-03 COMPLETE)
- Phase 21: Mastery Tracking (MAS-01 to MAS-04)
- Phase 22: Skills Lab Integration (INT-01 to INT-04)

**Previous milestones:**
- v2.0 Dark Premium Transformation — COMPLETE (Phases 11-18, 44 requirements)
- v1.0 Private Beta — SHIPPED (Phases 01-10, 30 requirements)

## Current Position

Phase: 20.1 — AI Practice Sessions & Simulation
Plan: 04 of 04 — CHECKPOINT_PENDING (20.1-01 through 20.1-04 built; 20.1-04 Task 3 is human-verify checkpoint)
Status: In progress — awaiting human verification of full session debrief flow
Last activity: 2026-02-18 — Completed 20.1-04 Tasks 1 + 2 (debriefService + DebriefCardStack + ConversationalDrill wiring)

## Accumulated Context

### Roadmap Evolution
- Phase 20.1 inserted after Phase 20: AI Practice Sessions & Simulation (URGENT — upgrade ConversationalDrill from hardcoded responses to Gemini state-object pattern + AI interpretation and coaching per exchange)

### Platform Identity (architectural north star — 2026-02-18)
KDENZ is a **biofeedback mirror**, not a training app. It makes invisible communication
visible in two directions:

1. **Receiving biofeedback** — What's beneath THEIR words (subtext, implicit meaning,
   meta-communication, high-context signals) that you missed or misread. The subtext
   reveal card. "Carol's real fear was being forgotten. You responded to her anger."

2. **Sending biofeedback** — What YOUR communication is actually signaling that you
   don't realize. Your defaults, your avoidance patterns, your tone vs. your intent.
   "Your label was syntactically correct but your framing was apologetic. You treated
   her identity threat like a polite observation."

3. **Aspiration gap** — Users have an aspirational voice/tone identity (the FM DJ
   voice, the authoritative presence, the warm authority). They can't hear themselves
   the way others hear them. The platform shows the gap between current and aspirational,
   and gives them the tools to close it.

Voice biofeedback (filler gauge, pace) = sending channel for voice.
Skills lab subtext reveal = receiving channel.
Skills lab self-pattern reveal = sending channel for communication.
Session debrief = pattern map across both channels.
VCM diagnostics = the underlying engine that explains WHY the gap persists.

4. **Self-identification** — Before users can practice toward a goal, they need to know
   what they ARE. The platform identifies their communication pattern ("Surface Reader,"
   "Hedger," "Intellectualizer") so they can name it, own it, and build a targeted plan
   around it. You can't navigate without knowing your current location.

This framing drives all UX decisions. Every feature either makes something invisible
visible, gives the user a signal that helps them self-regulate, or helps them identify
where they are so they know where to go.

### Key Decisions
- Generic drill engine over technique-specific UIs (CLAUDE.md D8)
- Prompt-Response is the only format for v3.0 (5 formats total planned, 1 implemented now)
- 8 Tier A techniques: Mirroring, Labeling, Open-Ended Questions, I-Statements, No-Oriented Questions, NVC Observation, NVC Feeling, Accusation Audit (id: 'accusation-audit', maps to Contrasting framework)
- 4-dimension quality scoring: form 0.25, accuracy 0.35, impact 0.30, timing 0.10 (R5)
- Timing weight effectively 0 in isolated drills — timing field recorded but not prominently displayed
- HLR spaced repetition simplified to interval tables for v3.0 (3 tables by skill_type): syntax [3,7,14,30,60,90], judgment [3,7,21,45,75,90], recognition [7,14,30,60,90,90]
- Form scoring = regex/pattern match via SyntaxRule types (regex/negation/inclusion)
- Accuracy + Impact = single Gemini LLM call per attempt with structured rubric
- Graceful degradation: LLM failure shows Form score only, session not blocked
- localStorage persistence (no Supabase yet for this milestone)
- All 8 Tier A techniques use skill_type='syntax' in v3.0
- No type-check npm script — use npx tsc --noEmit for TypeScript verification
- Chunk size warning (~1.17 MB JS) is pre-existing, not a Phase 20 concern
- gemini-2.5-flash used for drill evaluation (upgrade from gemini-1.5-flash in voice coaching service)
- compositeScore = formScore when Gemini unavailable (never null — always has a value)
- Streak: formScore>=80 AND accuracyScore>=75 when Gemini available; formScore>=80 alone when unavailable
- Gemini JSON extraction handles both raw JSON and ```json code block wrapping
- appendTranscript replaces (not appends) transcript — Web Speech API fires cumulative final results
- Scenario pool auto-resets after full cycle (no session 'complete' state trigger yet)
- Hook-as-state-machine pattern: all drill business logic in useDrillSession, zero in DrillScreen
- FeedbackCard is a pure display component — no hooks/state/logic; scoreLabel/scoreColor are module-level functions
- ScoreRow sub-component: handles loaded/geminiLoading/failed rendering for one dimension
- compositeReady vs showComposite distinction: showComposite controls section visibility; compositeReady controls full vs form-only fallback text
- handleStop uses 500ms setTimeout before submitTranscript (matches LabelingPractice Web Speech API drain pattern)
- Browser warning is inline dismissable banner in DrillScreen (not modal, not blocking)
- CSS-only waveform: 5 bars with @keyframes drillWave inline, no external animation library

### Data Layer Ready (Phase 19 + 20-01)
- `src/types/drill.ts` — Technique, Scenario, SyntaxRule, DrillDataStore types
- `src/data/drill-techniques.ts` — 8 techniques with syntax rules; drillTechniques Record + drillTechniquesArray
- `src/data/drill-scenarios.ts` — 40 scenarios (5 per technique), difficulty 1-2
- `src/utils/drill-storage.ts` — initDrillData(), getDrillData(), getTechnique(), getScenariosForTechnique(), getScenarioById()
- `src/services/drillEvaluationService.ts` — DrillEvaluationResult, scoreForm(), scoreWithGemini(), evaluateDrillResponse()
- `src/utils/drillAttemptStorage.ts` — DrillAttempt, DrillSession, saveDrillAttempt(), getDrillAttempts(), getSessionStreak(), generateAttemptId(), clearDrillAttempts()
- `src/features/drill-engine/useDrillSession.ts` — DrillState, useDrillSession() hook (state machine, scenario pool, scoring pipeline, streak tracking)
- `src/features/drill-engine/FeedbackCard.tsx` — Pure display component for evaluation results (3-state per dimension)
- `src/features/drill-engine/DrillScreen.tsx` — Main drill container (Web Speech API + 6-state render tree)
- `src/features/drill-engine/index.ts` — Barrel export: DrillScreen
- `src/main.tsx` — initDrillData() called before ReactDOM.createRoot().render()
- localStorage keys: 'kdenz:drill-data' (seed data), 'kdenz:drill-attempts' (user attempt records)

### Research Available
- R8: Complete technique taxonomy (83 techniques, 22 scored 5/5 for beta)
- R10: Skills Lab vs Simulation Studio classification (tier A/B/C, 5 drill formats)
- R13: CBT/MI technique inventory (89 techniques, 54 app-suitable)
- R15: Spaced repetition mastery decay (HLR model, 3 decay rates)
- R5: Conversation quality evaluation (4-dimension rubric)

### Existing Code
- src/features/labeling/ — existing labeling drill (working, untouched by Phase 19/20-01)
- src/features/accusation-audit/ — existing accusation audit drill (working, untouched by Phase 19/20-01)

## Blockers

None.

## Pending Todos

1 pending todo in .planning/todos/pending/:
- Gamification system (streaks, badges, progress enhancements) — future candidate

## Session Continuity

Last session: 2026-02-18T20:31Z
Stopped at: Completed 20.1-04 Tasks 1 + 2 — CHECKPOINT: awaiting human verification of full debrief session flow
Resume file: .planning/phases/20.1-ai-practice-sessions/20.1-04-SUMMARY.md (CHECKPOINT_PENDING)

---
### Session Debrief Layer (Plan 20.1-04) — CHECKPOINT_PENDING
- SessionDebrief interface: 5 card sections (RevealCard, SendingFeedbackCard, GrowthEdgeCard, NextStepCard, ProgressSignalCard)
- SubtextLayer inline interface maps LabelingScenario fields (underlyingDriver→underlyingFear, surfaceEmotion, characterName, expertLabel)
- generateSessionDebrief(): Gemini Call 3, temperature 0.4, maxOutputTokens 500, gemini-2.5-flash
- System prompt enforces: "NEVER 'you are a [pattern]', ALWAYS 'you tend to X when Y'"
- Trajectory computation: < 2 sessions = 'holding', same pattern + confidence < 0.8 = 'toward_target', same + stable = 'holding', shifting = 'away_from_target'
- Fallback debrief from local data: always complete, never empty
- addPatternToHistory() called on BOTH Gemini success and failure paths
- DebriefCardStack: card indicator (1 of 5), back navigation, fade transition via key, "Done" on final card
- ConversationalDrill: patternDataRef mirrors patternData state (stale closure prevention), handleSessionEnd replaces both exit paths, debriefLoading + showDebrief gates prevent premature onComplete

### Institute Routing Layer (Plan 20.1-03)
- InstituteContentItem type with 4-axis routing tags: addresses_patterns, supports_aspirations, technique_ids, vcm_gates
- LearnerProfile assembled from: pattern history (kdenz:pattern-history) + aspiration (kdenz:user-aspiration) + Institute progress (kdenz:institute-progress)
- Pattern history: rolling 10-session window, confidence calc (high >= 70% + 5 sessions; medium >= 40% or 3+ sessions)
- 10 seed items covering all 8 patterns: surface-reader, hedger, fixer, diplomat, intellectualizer, presumptuous, rusher, explainer
- Routing: scoreContentItem() = pattern(50)+aspiration(30)+gap(20 stub)+VCM(10 stub) - consumed(-100) - dismissed(-100) - unmet prereqs(-50)
- getTopContent(profile, count=2, debriefOnly=false): score>0 filter, score desc + tier asc sort
- formatDebriefHook(hook, sessionData): {count} and {avgWordCount} placeholder replacement
- Importable: getLearnerProfile() from utils/learnerProfileStorage, getTopContent() from services/contentRoutingService

### Aspiration Layer (Plan 20.1-02)
- 7 voice archetypes: grounded_authority, fm_dj (Calm Broadcaster), warm_connector, motivator, analytical_clarifier, calm_negotiator, playful_persuader
- Each archetype has measurable markers: speech_rate_wpm, filler_density_per_100, avg_pause_duration_s — ready for gap calculation in session debrief
- Aspiration stored at localStorage key 'kdenz:user-aspiration'
- "Calm & safe" feeling pill disambiguates inline to fm_dj (radio host) or calm_negotiator (therapist)
- Q3 gap_awareness stored for coaching context only — does not affect archetype selection
- getAspiration() importable from utils/aspirationStorage; getArchetypeById() from data/voiceArchetypes
- /aspiration/setup is an immersive route (no tab bar), accessible from ProfilePage Step 4

### Pattern Detection Layer (Plan 20.1-01)
- src/types/simulation.ts: ExtendedStateObject, 8 CommunicatorPattern types (surface-reader, hedger, fixer, diplomat, intellectualizer, presumptuous, rusher, explainer), PatternSignal, SessionPatternData, COMMUNICATOR_PATTERNS constant
- src/services/patternDetectionService.ts: detectRegexSignals() (6 patterns, instant), detectPatternSignals() (Gemini Call 2, temperature 0.1, 3 few-shot examples), updateSessionPatterns() (60% dominance + 0.75 confidence gate)
- ConversationalDrill Panel B: "What you signaled" blue-900/10 bg, border-l-4 border-blue-400 — shows patternNote + signal bullets per exchange
- ExtendedStateObject tracked via useRef (not useState) — consumed by future Gemini Call 1, not rendered
- SessionPatternData accumulates across session, passed to onComplete for debrief

*State initialized: 2026-01-25*
*Last updated: 2026-02-18 - Phase 20.1, Plans 01-04 built; Plan 04 checkpoint pending human verification*
