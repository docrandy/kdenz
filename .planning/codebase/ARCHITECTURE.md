# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** React SPA with modular feature layers + core audio pipeline

**Key Characteristics:**
- Frontend-only (no backend) — all state in localStorage
- Layered architecture: routes → pages/features → components → services + core audio
- React Router for navigation (7 routes)
- Browser-native APIs: Web Speech API (transcript), MediaRecorder (audio capture)
- Transcript-based filler detection (acoustic detection disabled due to false positives)
- Hybrid practice modules (free practice + skill modules with AI feedback)

## Layers

**Route Layer (App.tsx):**
- Purpose: Client-side routing and onboarding orchestration
- Location: `src/App.tsx`, `src/main.tsx`
- Contains: React Router setup, browser detection, onboarding state machine (welcome → diagnostic → dashboard)
- Depends on: React Router, ErrorBoundary
- Used by: HTML entry point (`index.html`)

**Page Layer:**
- Purpose: Screen-level containers that compose features and components
- Location: `src/pages/`
  - `Dashboard.tsx` — main hub (profile preview, practice cards, session history, heatmap)
  - `SessionDetail.tsx` — replay session with transcript and filler highlights
  - `Settings.tsx` — app preferences (stub)
  - `Privacy.tsx` — privacy policy
- Contains: Layout, navigation, page-level state
- Depends on: Features, components, services
- Used by: App.tsx route handlers

**Feature Layer:**
- Purpose: Self-contained practice modules with their own state and UI
- Location: `src/features/`
  - `profile/` — user profile capture (demographics, goals, focus areas, notes)
  - `labeling/` — Chris Voss labeling technique practice (4 scenarios, affect-based feedback)
  - `accusation-audit/` — preemptive objection handling (scenarios with brainstorm phase)
- Contains: Module-specific types, storage, hooks, components
- Depends on: Core audio, components, services, Gemini API
- Used by: Pages and route handlers

**Component Layer:**
- Purpose: Reusable UI building blocks (input, display, interaction)
- Location: `src/components/`
- Key components:
  - `PracticeSession.tsx` — free practice container (core feature)
  - `AudioPlayback.tsx` — audio replay with timeline scrubbing
  - `TranscriptView.tsx` — transcript display with filler highlighting
  - `FillerGauge.tsx` — visual filler rate indicator
  - `WeeklyTrendChart.tsx` — activity heatmap and trend data
  - `DiagnosticOnboarding.tsx` — Volitional framework questions (4 Qs)
  - `ErrorBoundary.tsx` — React error fallback
- Depends on: Core audio, services, utils
- Used by: Pages, features

**Service Layer:**
- Purpose: Data persistence and external API integration
- Location: `src/services/`
  - `sessionStorage.ts` — session summary persistence (30-day window), daily aggregation
  - `settingsStorage.ts` — app settings (default duration, etc.)
  - `geminiService.ts` — Gemini API for AI coaching summaries
- Contains: localStorage wrappers, API clients
- Depends on: None (minimal dependencies)
- Used by: Components, features, pages

**Core Audio Layer:**
- Purpose: Audio capture, transcription, and analysis
- Location: `src/core/audio/`
- Modules:
  - `useAudioCapture.ts` — mic access, MediaRecorder setup, AudioContext creation
  - `useWebSpeech.ts` — Web Speech API wrapper, transcript generation, word timings
  - `useFillerDetector.ts` — stub hook (acoustic detection disabled, returns empty)
  - `useSessionTimer.ts` — countdown and elapsed time tracking
  - `useAudioPlayback.ts` — audio blob playback with timeline control
  - `FillerDetector.ts` — (legacy) acoustic filler detection class
- Contains: React hooks for audio I/O
- Depends on: Browser Web APIs only
- Used by: PracticeSession and feature modules

**Library Layer:**
- Purpose: Business logic utilities
- Location: `src/lib/`
  - `fillerReconciler.ts` — hybrid filler detection (transcript text analysis + acoustic matching)
  - `diagnosticQuestions.ts` — Volitional framework questions, storage, helpers
  - `localStatsFormatter.ts` — session stats formatting for Gemini prompt
- Contains: Algorithms and domain logic
- Depends on: Core audio types
- Used by: Components and features

**Data Layer:**
- Purpose: Static reference data
- Location: `src/data/`
  - `speakingPrompts.ts` — optional prompts for free practice
- Depends on: None
- Used by: Components

**Utility Layer:**
- Purpose: Cross-cutting helpers
- Location: `src/utils/`
  - `browserDetection.ts` — detect Chrome vs other browsers
- Depends on: None
- Used by: App.tsx, components

## Data Flow

**Session Recording Flow:**

1. User starts practice session on `/practice` (PracticeSession component)
2. `useAudioCapture.start()` → requests mic permission, starts MediaRecorder
3. `useWebSpeech.start()` → begins continuous speech recognition
4. Real-time feedback:
   - `useSessionTimer` → countdown timer display
   - `fillerReconciler.findTranscriptFillers()` → detects fillers from interim transcript
   - `FillerGauge` → visualizes current filler rate
5. User stops session
6. `fillerReconciler.reconcileFillers()` → final filler detection from final transcript + audio blob
7. `saveSession()` → stores SessionSummary to localStorage (id, timestamp, metrics)
8. Optional: `geminiService.generateSummary()` → AI coaching feedback (graceful fallback to local stats)
9. Post-session display:
   - `AudioPlayback` → play recording with timeline scrubbing
   - `TranscriptView` → show transcript with filler highlighting
   - `Scorecard` → display metrics (WPM, filler count, duration)

**Dashboard Aggregation Flow:**

1. `Dashboard.tsx` loads on mount
2. `getProfile()` → fetch user profile from localStorage
3. `getAllSessions()` → fetch all SessionSummary objects (last 30 days)
4. `getWeeklyAggregates()` → compute daily rollups for past 7 days
5. Display:
   - Profile preview card
   - Recent sessions list (last 5)
   - Weekly trend chart (ContributionHeatmap)
   - Quick stats (session count, total minutes, streak)

**Feature Session Flow (Labeling Example):**

1. User navigates to `/practice/labeling`
2. `LabelingPractice.tsx` → scenario selector
3. `useLabelingSession.selectScenario()` → load scenario
4. `ScenarioPresenter.tsx` → show AI statement
5. User records label via `useWebSpeech`
6. `labelAnalyzer.analyzeLabel()` → syntax + depth scoring
7. `LabelFeedback.tsx` → show affect-based feedback
8. `geminiService` → generate AI response (graceful fallback to template)
9. Optional: `continueConversation()` → multi-turn loop

**State Management:**

- All state persisted to browser localStorage
- No backend or state server
- Session components use React hooks (useState, useRef)
- Feature modules use localStorage-backed hooks (useLabelingSession, etc.)
- localStorage entries:
  - `voicelab_sessions` — SessionSummary[] (JSON)
  - `voicelab_profile` — UserProfile (JSON)
  - `voicelab_diagnostic` — DiagnosticResult[] (JSON)
  - `voicelab_settings` — AppSettings (JSON)
  - Feature-specific: `voicelab_labeling_sessions`, etc.

## Key Abstractions

**SessionSummary:**
- Purpose: Immutable record of one practice session
- Examples: `src/services/sessionStorage.ts` (interface + storage functions)
- Pattern: Value object — id, timestamp, metrics (WPM, filler count, duration, word count)
- Generated on session end, never modified

**UserProfile:**
- Purpose: User demographics, goals, notes, and AI context
- Examples: `src/features/profile/types.ts`
- Pattern: Hierarchical value object with migration support (legacy fields marked deprecated)
- Sections: demographics, goals, focus areas, self-assessment, preferences, history, notes

**ReconciledFiller:**
- Purpose: Filler word with source tracking (transcript vs acoustic)
- Examples: `src/lib/fillerReconciler.ts`
- Pattern: Data enrichment object — word, timestamp, source, confidence
- Enables dual-channel detection (transcript primary, acoustic for reconciliation)

**LabelingScenario & LabelAnalysis:**
- Purpose: Practice scenario definition + analysis result
- Examples: `src/features/labeling/types.ts`, `src/features/labeling/labelAnalyzer.ts`
- Pattern: Domain object with nested results (syntax score, depth score, affect level)
- Enables scoring and affect-based feedback

**WordTiming:**
- Purpose: Word position in transcript with approximate timestamp
- Examples: `src/core/audio/useWebSpeech.ts`
- Pattern: Alignment bridge between transcript (text) and audio blob (timing)
- Enables filler highlighting in playback timeline

## Entry Points

**Browser Entry:**
- Location: `index.html`
- Triggers: Page load
- Responsibilities: Load React root, CSS, Tailwind config

**App Root:**
- Location: `src/main.tsx`
- Triggers: React initialization
- Responsibilities: Render App component inside BrowserRouter

**Main App Component:**
- Location: `src/App.tsx`
- Triggers: Route change
- Responsibilities: Render page based on current route, orchestrate onboarding (welcome → diagnostic → dashboard)

**Practice Session:**
- Location: `src/components/PracticeSession.tsx`
- Triggers: User clicks "Free Practice" on dashboard
- Responsibilities: Manage audio capture, transcription, filler detection, session save, playback

**Feature Modules:**
- Location: `src/features/{feature}/index.ts`
- Examples: `LabelingPractice.tsx`, `AccusationAuditPractice.tsx`, `ProfilePage.tsx`
- Triggers: Route navigation to `/practice/labeling`, `/practice/accusation-audit`, `/profile`
- Responsibilities: Self-contained feature UI and state

## Error Handling

**Strategy:** Graceful degradation with user-facing fallbacks

**Patterns:**

1. **Mic Access Failure:**
   - `useAudioCapture` catches `getUserMedia` errors
   - Returns error string in component state
   - Display: `MicPermissionError.tsx` shows browser-specific instructions

2. **Web Speech API Failure:**
   - `useWebSpeech` catches recognition errors
   - Falls back to manual transcript entry (not implemented yet)
   - Component shows error message

3. **Gemini API Failure:**
   - `geminiService.generateSummary()` catches network/API errors
   - Falls back to `localStatsFormatter.formatLocalSummary()` (rule-based feedback)
   - Gracefully displays local stats instead of AI summary

4. **Browser Incompatibility:**
   - `isChrome()` utility detects Chrome vs Safari/Firefox
   - `BrowserWarning.tsx` shown for non-Chrome users
   - App remains functional but with accuracy warning

5. **Storage Failure:**
   - All localStorage operations wrapped in try/catch
   - Returns empty defaults if storage unavailable
   - User can still use app, data just not persisted

6. **React Errors:**
   - `ErrorBoundary.tsx` catches component errors
   - Displays fallback UI with reload option
   - Logs to console

## Cross-Cutting Concerns

**Logging:** Console.error() for errors, console.log() for debug info. No external logging service.

**Validation:**
- Input validation in form components (e.g., profile input length)
- Transcript validation in `fillerReconciler` (trim, normalize)
- No centralized validation layer

**Authentication:** Not implemented (deferred to v1.1). Currently localStorage-based single user.

**Diagnostics:** Volitional framework questions (4 Qs) to understand user challenges. Stored in localStorage under `voicelab_diagnostic`.

**Browser Detection:** `utils/browserDetection.ts` checks for Chrome (Web Speech API support). Shows warning for Safari/Firefox but allows use.

---

*Architecture analysis: 2026-02-02*
