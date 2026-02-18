# CLAUDE.md - Kdenz Project

**Project:** KDENZ Communication Training Platform
**Type:** Adaptive Diagnostic Communication Coaching Application
**Status:** Pre-development (research complete, source-of-truth updated)
**Core Identity:** A biofeedback mirror that makes invisible communication visible — in both directions.

---

## Platform North Star (2026-02-18)

KDENZ is not a training app. It is a **biofeedback mirror** for communication. It makes two invisible things visible:

1. **What others are actually signaling** beneath the surface of their words — the subtext, the implicit meaning, the high-context communication most people miss and respond to the wrong thing.
2. **What the user is actually signaling** without realizing it — their defaults, their avoidance patterns, their tone vs. their intent. The gap between who they want to be as a communicator and who they currently are.

Every feature either makes something invisible visible, gives the user a signal that helps them self-regulate, or helps them identify where they are so they know where to go.

The "holy shit moment" — where users see what was really happening in an exchange that they completely missed — is the core product experience. Everything else is infrastructure for that moment.

**The biofeedback architecture:**
- Receiving biofeedback (Skills Lab): What was beneath THEIR words? Subtext reveal. "Carol's real fear was being forgotten. You responded to her anger."
- Sending biofeedback (Voice Lab + Skills Lab): What is YOUR communication actually signaling? Real-time gauge + two-panel session reveal.
- Aspiration gap: The FM DJ voice problem — users have an identity they want to project, can't hear themselves the way others do. Platform shows the gap, gives tools to close it.
- Self-identification: Before targeted practice is possible, users must know their pattern. The platform names it ("Surface Reader," "Hedger") so they can own it and plan around it.

**The Institute (University) is personalized in sequence, not content:**
The content library is shared. Every user has access to the same videos, articles, exercises, and lessons. But the curriculum path is personalized based on:
- Diagnosed communicator pattern (from session debrief)
- Stated aspiration (voice identity target, set in onboarding/profile)
- Current skill gaps (from Skills Lab mastery tracking)
- VCM gate status (internal — surfaces as exercise type, not gate label)

Every Institute content item must be tagged: `addresses_patterns[]`, `supports_aspirations[]`, `technique_ids[]`, `vcm_gates[]`. This tagging is what makes routing possible. Design the schema before building Institute content.

---

## Project Context

KDENZ is a full communication training platform built around the insight that awareness training alone reduces filler usage 80%+, and that immediate feedback reduces (not increases) anxiety. The platform combines isolated skill drills, AI-powered conversation simulations, educational content, and an invisible behavioral diagnostic engine to build real communication competence across 57+ techniques from Voss, MI, CBT, NVC, and corporate frameworks.

The core value proposition is the "holy shit moment" — making the invisible visible in both directions — combined with a structured path from pattern identification to targeted practice to mastery.

### Working Title
"KDENZ" (platform name finalized)

### Design System
"High-Performance Clinical" (Dark Premium variant)
- Mode: Dark (dark navy + gold, current working design)
- Design tokens: CSS variables, easy to swap when Framer exploration completes
- Final palette: Pending Framer exploration (do not over-invest in design polish)
- Light mode: Deferred to post-Framer finalization

---

## Five Product Pillars

### 1. Voice Practice (Vocal Performance Lab)
Real-time voice coaching for filler words, pace, and prosody. Users record themselves speaking, get immediate visual feedback, and review playback with highlighted markers. This is the proven foundation -- built and deployed.

### 2. Skills Lab (Applied Skills Lab)
Generic drill engine for isolated technique practice. 5 drill formats (Prompt-Response, Audio-Spoken, Multiple-Choice, Rewrite, Spot-the-Technique) across 57+ techniques. Techniques are classified as Tier A (drill-first), Tier B (simulation-preferred), or Tier C (both). Build the engine once, configure per technique.

### 3. Simulation Studio
Gemini 2.5 Flash-powered multi-turn AI conversations. 5 difficulty levels (Cooperative through Deceptive), 4 scenario dimensions (domain, difficulty, technique focus, goal), 3 simulation modes (Guided, Scaffolded, Free-form). State object pattern: `{ mood, trust_level, concessions, revelation_stage }` passed each turn for opponent consistency.

### 4. Institute (KDENZ Institute)
Educational content branch: video explainers, video demonstrations, before/after comparisons, articles, annotated examples, and quizzes. Follows "practice before exposure" pattern -- users attempt techniques blind, THEN see expert demos. Interleaved learning across frameworks.

### 5. VCM Diagnostics (Volitional Chain Model)
8-gate behavioral diagnostic model (Awareness, Desire, Belief, Intention, Initiation, Persistence, Recovery, Integration). Rule-based prescriptions map gate failures to interventions. Critical constraint: **diagnose internally, intervene externally** -- users never see gate labels, only contextually appropriate nudges and exercises.

---

## Technical Architecture

### Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Persistence:** Supabase (22 tables, RLS policies, Edge Functions)
- **AI Simulation:** Gemini 2.5 Flash (~$0.01-0.02/session, streaming)
- **Technique Evaluation:** Hybrid rules + Gemini (rules for syntax, LLM for intent)
- **Emotion/Prosody:** Hume batch API via backend proxy (post-session analytics)
- **Voice Recognition:** Web Speech API (Chrome), Deepgram path for cross-browser later
- **Spaced Repetition:** HLR model with skill-type-specific decay rates
- **Deployment:** Vercel (frontend + serverless functions for API proxies)

### Key Architectural Patterns

**Generic Drill Engine** -- The #1 build priority. 16 of 23 top-scored techniques reuse the same Prompt-Response-Score pattern. Build the engine once with format selection per technique, configure via data.

**State Object Pattern** -- For simulation opponent consistency. Pass `{ mood, trust_level, concessions, active_constraints, last_tactic_detected, revelation_stage }` each turn alongside the system prompt.

**4-Dimension Quality Scoring** -- Form (syntax correctness) + Accuracy (content match) + Impact (effect on counterpart) + Timing (contextual appropriateness). Weighted composite: 0.25 form + 0.35 accuracy + 0.30 impact + 0.10 timing.

**Adjacency List Skill DAG** -- 57 techniques, 5 tiers, max depth 5. `skill_prerequisites` table with hard/soft requirement types. Tier gating: 75%+ of current tier at Proficient before advancing.

**Behavioral Event Logging** -- Track ALL interactions (app opens, drill starts, quit points, hover times, difficulty avoidance), not just completions. This data feeds VCM gate detection.

**Rule-Based Diagnostics First** -- Start with IF/THEN prescription rules per gate. Graduate to ML-based diagnosis after 3-6 months of behavioral data.

### Data Architecture (Supabase)
- 2 user tables (profiles, user_settings)
- 4 skill tree tables (skills, skill_prerequisites, user_skills, skill_reviews)
- 2 drill tables (drill_scenarios, drill_attempts)
- 3 simulation tables (simulation_scenarios, simulation_sessions, simulation_turns)
- 1 technique detection table (normalized for cross-session queries)
- 2 VCM tables (vcm_diagnostic_state, vcm_diagnostic_history)
- 1 recommendation table
- 2 audio tables (audio_recordings, hume_analyses)
- 1 voice session table
- 4 content tables (content_items, quiz_questions, quiz_attempts, content_progress)
- 1 behavioral events table

Full schema: `.planning/research/R16_FULL_PLATFORM_SUPABASE_SCHEMA.md`

---

## Development Rules

1. **Platform Scope**: Build toward the full 5-pillar platform. Voice Practice is the foundation, not the ceiling.
2. **Chrome-Only for Beta Voice Features**: Web Speech API has 90% accuracy drop on Safari. Show browser warning for non-Chrome users. Deepgram is the cross-browser path when ready.
3. **Generic Drill Engine First**: Do not build technique-specific drill UIs. Build the configurable engine, then add techniques as data.
4. **Diagnose Internally, Intervene Externally**: Users never see VCM gate labels, constraint numbers, or failure diagnoses. They see contextually appropriate nudges and exercises. Pattern names ("Surface Reader," "Hedger") are user-facing — they're useful self-identification labels, not clinical diagnoses.
5. **Practice Before Exposure**: Users attempt techniques blind first, THEN see expert demonstrations. This is the learning sequence, not optional.
5a. **Institute Curriculum is Personalized in Sequence, Not Content**: Every user has the same content library. The prescribed path through it is unique — driven by diagnosed pattern, stated aspiration, skill gaps, and VCM gate status. Every Institute content item must carry tags: `addresses_patterns[]`, `supports_aspirations[]`, `technique_ids[]`, `vcm_gates[]`. Design the tagging schema BEFORE building Institute content. The session debrief is the primary content routing surface — surface 1-2 items at the moment of highest receptivity (post "holy shit moment").
5b. **Self-Identification Precedes Prescription**: Users cannot build a targeted practice plan without knowing their current location. The platform identifies their communicator pattern across sessions and names it for them. This pattern name + stated aspiration = the basis for all curriculum routing.
5c. **Research Before Building**: For phases involving pattern taxonomy, aspiration framework, signal detection, or curriculum routing — dispatch research agents to investigate before planning. See `.planning/phases/20.1-ai-practice-sessions/20.1-CONTEXT.md` for the research agent structure.
6. **Three Skill Types, Three Decay Rates**: Syntax-driven (0.08/month), judgment-based (0.06/month), recognition (slowest). Do not use Duolingo-style 1-2 day intervals for behavioral skills.
7. **Never Miss Twice**: Implement this rule explicitly in streak/persistence systems. Research shows 37% longer habit retention.
8. **Hybrid Technique Detection**: Rules for syntax patterns (mirroring, labeling stems, question classification). LLM for intent-based techniques (tactical empathy, accusation audit quality). Rules = high precision, LLM = captures intent.
9. **Graceful Degradation**: Any API error (Gemini, Hume, Supabase) = show local stats and cached data. Never block the user.
10. **Visual Feedback Required**: Real-time gauges + trend charts are mandatory (3.5x retention vs plain numbers, Duolingo research).
11. **Playback Required**: Audio playback with technique/filler highlighting is core (research-validated for behavior change).
12. **Dark Mode Default**: Light mode deferred to post-Framer design finalization.
13. **Design Tokens Must Be Swappable**: Final palette pending Framer exploration. Do not hardcode colors outside CSS variables.

---

## Existing Codebase (What Is Built)

The local codebase (126+ commits, 15K+ lines) is the product. Lovable prototype is reference only.

### Working Features
- Audio pipeline: mic capture, Web Speech API transcript, FillerDetector (acoustic real-time), hybrid filler reconciliation, audio playback with markers
- Voice Practice: filler words mode, speech pace mode, real-time filler gauge, weekly trend chart
- Post-session: scorecard, AI summary (Gemini), transcript with highlight toggle, audio playback with timeline scrubber
- Onboarding: welcome screen, light diagnostics (4 questions, Volitional framework), profile page
- Infrastructure: design system (CSS variables, semantic tokens, Tailwind), SessionOrb (animated), settings, privacy, error handling
- Skills Lab code: labeling drills and accusation audit drills exist in `src/features/` (removed from routes in v2.0 cleanup, need re-integration)

### Deployment
- Platform: Vercel (https://kdenz.vercel.app)
- Target: Private beta for friend/family testers (Chrome users)

---

## Research Validation (R1-R16, completed 2026-02-14)

All 16 research prompts filed at `.planning/research/`. Key findings that drive architecture:

| Finding | Source | Impact on Build |
|---------|--------|-----------------|
| Awareness training alone reduces fillers 80%+ | General research | Core hypothesis validated -- playback + real-time feedback is proven |
| Immediate feedback REDUCES anxiety | Research validation | Feedback helps, don't worry about "judgment stress" |
| Safari Web Speech API: 90% accuracy drop | R6 | Chrome-only for beta, Deepgram for cross-browser later |
| Visual feedback = 3.5x retention | Duolingo research | Gauges and charts are mandatory, not nice-to-have |
| Gemini 2.5 Flash: ~$0.01-0.02/session | R4 | Simulation Studio is economically viable at scale |
| State object pattern for AI opponents | R4, R14 | Pass mood/trust/concessions each turn for consistency |
| 83 techniques identified, 22 scored 5/5 for beta | R8, R13 | 57+ app-suitable techniques, generic drill engine confirmed |
| 16 of 23 top techniques share labeling infrastructure | R8, R10, R13 | Generic drill engine is #1 build priority |
| 5-tier skill DAG, max depth 5 | R9 | Adjacency list in Supabase, not closure table |
| 3 simulation modes: guided, scaffolded, free-form | R10 | Different UX flows per user tier level |
| Drill mastery predicts 60-70% of simulation performance | R10 | 10-20 simulation reps needed for the remaining 30-40% |
| 8 VCM gates with 5-8 root causes each | R11 | Rule-based first, ML after 3-6 months data |
| Diagnose internally, intervene externally | R11 | Users never see diagnostic labels |
| Never miss twice: 37% longer retention | R11, R15 | Implement explicitly in streak system |
| 3 decay rates by skill type | R15 | Syntax 0.08/mo, judgment 0.06/mo, recognition slowest |
| HLR model for spaced repetition | R15 | Initial half-life 14 days, scale on success |
| 22-table Supabase schema with RLS | R16 | Full schema designed, migration path from localStorage |
| Hume batch via backend proxy, 24h audio retention | R1, R7 | Temporary blob storage, auto-cleanup |
| Interleaved learning for Institute content | R12 | Practice before exposure, mix frameworks |
| 4-dimension quality scoring (form/accuracy/impact/timing) | R5 | Weighted composite feeds mastery calculation |

---

## Key Decisions (D1-D12, answered 2026-02-13)

| # | Decision | Answer |
|---|----------|--------|
| D1 | Which codebase? | Local codebase is the product. Lovable is reference only. |
| D2 | Design direction? | Dark navy + gold (temporary). Framer exploration coming. |
| D3 | MVP scope? | Full platform (5 pillars). Not incremental v1.1/v1.2. |
| D4 | Hume integration? | Batch for diagnostics. Gemini for real-time simulation. |
| D5 | VCM implementation? | Design data model now. Logic deferred to model finalization. |
| D6 | Browser support? | Chrome-only for beta. Deepgram path for later. |
| D7 | Dark mode? | Dark only. Light deferred to post-Framer. |
| D8 | Skills Lab design? | Generic drill engine. Map all branches before building UX. |
| D9 | Simulation scope? | Build incrementally (text-only first, then voice, then analysis). |
| D10 | Institute scope? | Full educational branch (videos, quizzes, articles). Not just YouTube. |
| D11 | Communication Index? | Formula TBD. Defer to post-Hume integration. |
| D12 | Recommendation engine? | Simple rule-based first. Adaptive engine later. |

Full decision document: `docs/DECISIONS_NEEDED.md`

---

## Research Reference Index

All filed at `.planning/research/`:

| # | File | Key Finding |
|---|------|-------------|
| R1 | `R1_HUME_BATCH_API_2026.md` | Hume batch via backend proxy, prosody + freeze detection |
| R3 | `R3_VCM_DECISION_TREE_PATTERNS.md` | Hybrid VCM architecture patterns |
| R4 | `R4_GEMINI_SIMULATION_IMPLEMENTATION.md` | Gemini 2.5 Flash, state object, ~$0.01/session |
| R5 | `R5_CONVERSATION_QUALITY_EVALUATION.md` | 4-dimension quality rubric |
| R6 | `R6_BROWSER_SUPPORT_ALTERNATIVES.md` | Deepgram for cross-browser, Chrome-only for now |
| R7 | `R7_AUDIO_STORAGE_HUME_BATCH.md` | Temporary blob, 24h auto-delete |
| R8 | `R8_COMPLETE_TECHNIQUE_TAXONOMY.md` | 83 techniques across all frameworks |
| R9 | `R9_SKILL_TREE_PREREQUISITES.md` | 5-tier DAG, hard/soft prerequisites |
| R10 | `R10_SKILLS_LAB_VS_SIMULATION_STUDIO.md` | Tier A/B/C classification, 5 drill formats |
| R11 | `R11_VCM_GATE_EXERCISE_PRESCRIPTIONS.md` | 8 gates, diagnose internally, rule-based first |
| R12 | `R12_INSTITUTE_CONTENT_ARCHITECTURE.md` | Interleaved learning, practice before exposure |
| R13 | `R13_CBT_MI_TECHNIQUE_INVENTORY.md` | 89 techniques, 54 app-suitable |
| R14 | `R14_AI_OPPONENT_PROMPT_ENGINEERING.md` | 4 prompt templates, 3 control dials |
| R15 | `R15_SPACED_REPETITION_MASTERY_DECAY.md` | HLR model, 3 decay rates by skill type |
| R16 | `R16_FULL_PLATFORM_SUPABASE_SCHEMA.md` | 22 tables, RLS, migration path |

---

## Build Sequence (Recommended)

### Phase A: Platform Foundation
1. Re-integrate Skills Lab modules (labeling, accusation audit -- code exists in `src/features/`)
2. Platform navigation (sidebar/tab structure for all 5 pillars)
3. Supabase setup (auth, initial schema, localStorage migration)

### Phase B: Generic Drill Engine + Skills Lab
1. Build configurable drill engine (5 formats)
2. Seed skill data (57+ techniques, prerequisites, drill scenarios)
3. Mastery tracking + spaced repetition scheduling

### Phase C: Simulation Studio
1. Week 1: Text-only simulation (Gemini multi-turn, scenario library)
2. Week 2: Voice integration (Web Speech API input, audio recording)
3. Week 3: Post-session analysis (Hume batch, technique detection)
4. Week 4: Difficulty tuning + scenario expansion

### Phase D: Hume Integration + VCM Data Model
1. Backend proxy for Hume batch API
2. Audio pipeline (record, upload, analyze, auto-cleanup)
3. VCM data model + stub implementation
4. Behavioral event logging infrastructure

### Phase E: Institute + Recommendation Engine
1. Content management + progress tracking
2. Quiz engine
3. Rule-based recommendation system
4. MI-constrained feedback generation

---

## Inherits From

This project follows workspace-level rules defined in:
`C:\Users\randy\CLAUDE.md`
