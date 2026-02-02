# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
kdenz/
├── src/
│   ├── App.tsx                           # Root component, routing, onboarding orchestration
│   ├── App.css                           # Minimal app-level styles (Tailwind only)
│   ├── main.tsx                          # React entry point (createRoot, BrowserRouter)
│   ├── index.css                         # Global styles
│   │
│   ├── components/                       # Reusable UI components
│   │   ├── PracticeSession.tsx           # Free practice container (audio, transcript, playback)
│   │   ├── AudioPlayback.tsx             # Audio player with timeline scrubbing
│   │   ├── TranscriptView.tsx            # Transcript display with optional filler highlighting
│   │   ├── FillerGauge.tsx               # Visual gauge showing current filler rate
│   │   ├── FillerMarkers.tsx             # Timestamps for fillers in transcript
│   │   ├── WeeklyTrendChart.tsx          # Activity heatmap and weekly trend chart
│   │   ├── Scorecard.tsx                 # Session metrics display (WPM, filler count, duration)
│   │   ├── AISummary.tsx                 # AI coaching feedback display (Gemini or local stats)
│   │   ├── DiagnosticOnboarding.tsx      # Volitional framework onboarding (4 questions)
│   │   ├── WelcomeScreen.tsx             # First-time user welcome
│   │   ├── BrowserWarning.tsx            # Chrome/Safari compatibility warning
│   │   ├── MicPermissionError.tsx        # Mic access failure message
│   │   ├── ErrorBoundary.tsx             # React error fallback
│   │   ├── SettingsPanel.tsx             # Session-level settings (duration, etc.)
│   │   ├── CountdownTimer.tsx            # Countdown display during recording
│   │   ├── DurationSelector.tsx          # Practice duration picker
│   │   ├── PromptSelector.tsx            # Optional speaking prompt selector
│   │   ├── HighlightToggle.tsx           # Filler highlight mode selector (none/fillers/all)
│   │   ├── QuickNoteBox.tsx              # Quick note capture
│   │   ├── FeedbackButton.tsx            # Feedback submission button (stub)
│   │   ├── DevFeedbackBoxes.tsx          # Dev-only debug info display
│   │   ├── ContributionHeatmap.tsx       # GitHub-style activity heatmap
│   │   └── PlaybackTimeline.tsx          # Playback timeline with filler markers
│   │
│   ├── pages/                            # Page-level containers
│   │   ├── Dashboard.tsx                 # Main hub (profile, practice cards, sessions, heatmap)
│   │   ├── SessionDetail.tsx             # Session replay page
│   │   ├── Settings.tsx                  # Settings page (stub)
│   │   └── Privacy.tsx                   # Privacy policy page
│   │
│   ├── features/                         # Feature modules (self-contained)
│   │   ├── profile/
│   │   │   ├── ProfilePage.tsx           # Profile editor (demographics, goals, notes)
│   │   │   ├── profileStorage.ts         # Profile localStorage persistence
│   │   │   ├── types.ts                  # UserProfile interface + migration helpers
│   │   │   ├── index.ts                  # Module exports (getProfile, setProfile)
│   │   │   └── components/
│   │   │       ├── MultiSelectDecisionTree.tsx  # Goal selection UI (2-level tree)
│   │   │       ├── DecisionTreeSelect.tsx       # Single selection tree
│   │   │       ├── ToggleInput.tsx              # Toggle between options/text input
│   │   │       └── index.ts
│   │   │
│   │   ├── labeling/
│   │   │   ├── LabelingPractice.tsx      # Main labeling practice container
│   │   │   ├── useLabelingSession.ts     # Session state hook
│   │   │   ├── labelAnalyzer.ts          # Syntax + depth scoring algorithm
│   │   │   ├── labelingStorage.ts        # localStorage for labeling attempts
│   │   │   ├── scenarioBank.ts           # Scenario definitions (4 scenarios × 3 levels)
│   │   │   ├── types.ts                  # LabelingScenario, AffectLevel, SyntaxScore, etc.
│   │   │   ├── ScenarioPresenter.tsx     # Display AI statement
│   │   │   ├── LabelFeedback.tsx         # Affect-based feedback display
│   │   │   ├── PatternSummary.tsx        # Session pattern summary
│   │   │   └── index.ts
│   │   │
│   │   └── accusation-audit/
│   │       ├── AccusationAuditPractice.tsx     # Main audit practice container
│   │       ├── useAuditSession.ts              # Session state hook
│   │       ├── auditAnalyzer.ts               # Objection analysis algorithm
│   │       ├── auditStorage.ts                # localStorage for audit attempts
│   │       ├── scenarios.ts                   # Audit scenarios
│   │       ├── types.ts                       # Audit types (AuditScenario, AuditResult, etc.)
│   │       ├── AuditScenarioPresenter.tsx     # Scenario presentation
│   │       ├── CriticismBrainstorm.tsx        # Brainstorm phase (comes before scenario)
│   │       ├── AuditFeedback.tsx              # Feedback display
│   │       ├── AuditPatternSummary.tsx        # Pattern summary
│   │       └── index.ts
│   │
│   ├── core/                             # Core functionality (audio pipeline)
│   │   └── audio/
│   │       ├── useAudioCapture.ts        # Mic + MediaRecorder hook
│   │       ├── useWebSpeech.ts           # Web Speech API wrapper hook
│   │       ├── useFillerDetector.ts      # Stub hook (acoustic disabled)
│   │       ├── useSessionTimer.ts        # Countdown/elapsed timer hook
│   │       ├── useAudioPlayback.ts       # Audio playback hook with timeline control
│   │       ├── FillerDetector.ts         # Legacy acoustic filler detection class
│   │       └── index.ts                  # Module exports
│   │
│   ├── services/                         # Business logic services (data + API)
│   │   ├── sessionStorage.ts             # Session persistence (30-day window, daily aggregation)
│   │   ├── settingsStorage.ts            # App settings persistence
│   │   ├── geminiService.ts              # Gemini API integration for AI summaries
│   │   └── (no index.ts — direct imports)
│   │
│   ├── lib/                              # Utilities and algorithms
│   │   ├── fillerReconciler.ts           # Hybrid filler detection (transcript + acoustic)
│   │   ├── diagnosticQuestions.ts        # Volitional framework questions + storage
│   │   └── localStatsFormatter.ts        # Session stats formatting for Gemini prompt
│   │
│   ├── data/                             # Static reference data
│   │   └── speakingPrompts.ts            # Optional prompts for free practice
│   │
│   └── utils/                            # Cross-cutting utilities
│       └── browserDetection.ts           # Chrome detection utility
│
├── public/
│   └── (static assets — none configured yet)
│
├── index.html                            # HTML entry point
├── package.json                          # Dependencies (React, React Router, Tailwind, Vite)
├── tsconfig.json                         # TypeScript config
├── tailwind.config.js                    # Tailwind color theme (High-Performance Clinical)
├── vite.config.ts                        # Vite config (React plugin)
├── .eslintrc.js                          # ESLint rules
├── .prettierrc                            # Prettier formatting
└── (vite build artifacts: dist/, node_modules/)
```

## Directory Purposes

**src/components/:**
- Purpose: Reusable UI building blocks
- Contains: React components focused on rendering + local UI state
- Key files:
  - `PracticeSession.tsx` — orchestrates audio pipeline and displays real-time feedback
  - `AudioPlayback.tsx` — controls playback, timeline scrubbing, filler markers
  - `TranscriptView.tsx` — displays transcript with optional filler highlighting
- Exports: Named exports (component functions), type exports for props
- No business logic — state management via hooks from parent or services

**src/pages/:**
- Purpose: Top-level screen containers
- Contains: Page-level layout, navigation, component composition
- Key files:
  - `Dashboard.tsx` — aggregates profile, sessions, heatmap, practice cards
  - `SessionDetail.tsx` — replays single session with full transcript and audio
- Exports: Default export per page
- Responsibilities: Data loading (localStorage), layout, routing helpers

**src/features/:**
- Purpose: Self-contained feature modules
- Contains: Feature-specific types, storage, hooks, components, logic
- Examples: `profile/`, `labeling/`, `accusation-audit/`
- Each feature has:
  - `types.ts` — domain types
  - `{module}Storage.ts` — localStorage persistence
  - `use{Feature}Session.ts` — session state hook
  - `index.ts` — module exports (public API)
  - Components for UI
- Pattern: Feature encapsulation (no cross-feature imports)

**src/core/audio/:**
- Purpose: Audio capture and transcription pipeline
- Contains: React hooks for browser Web APIs
- Responsibilities: Mic access, audio recording, speech recognition, analytics
- Not: Audio analysis algorithms (see `lib/fillerReconciler.ts`)
- Exports: Hooks and type definitions only

**src/services/:**
- Purpose: Business logic services (data persistence, API integration)
- Contains: Storage functions, API clients
- Pattern: Functions exported directly (no classes)
- Examples:
  - `sessionStorage.ts` — `saveSession()`, `getAllSessions()`, `getWeeklyAggregates()`
  - `geminiService.ts` — `generateSummary()` with fallback
- Dependencies: External APIs (Gemini), browser APIs (localStorage)

**src/lib/:**
- Purpose: Algorithms and utilities
- Contains: Pure functions and business logic
- Examples:
  - `fillerReconciler.ts` — hybrid filler detection algorithm
  - `diagnosticQuestions.ts` — question library + storage helpers
- No React dependencies (importable from Node scripts if needed)

**src/data/:**
- Purpose: Static reference data (prompts, constants)
- Contains: Read-only objects
- Used by: Components and features

**src/utils/:**
- Purpose: Cross-cutting helper functions
- Contains: Utility functions (browser detection, formatting)
- Pattern: Small, focused functions

## Key File Locations

**Entry Points:**
- `index.html` — HTML shell (React root div, CSS/script tags)
- `src/main.tsx` — React initialization (createRoot, BrowserRouter)
- `src/App.tsx` — Main component (routes, onboarding logic)

**Configuration:**
- `tailwind.config.js` — Clinical design system colors and fonts
- `tsconfig.json` — TypeScript settings
- `vite.config.ts` — Vite build config (React plugin)
- `package.json` — Dependencies and scripts

**Core Logic:**
- `src/components/PracticeSession.tsx` — Audio pipeline orchestration
- `src/core/audio/useWebSpeech.ts` — Transcript generation
- `src/lib/fillerReconciler.ts` — Filler word detection
- `src/services/sessionStorage.ts` — Session persistence
- `src/services/geminiService.ts` — AI summaries

**Testing:**
- `vitest.config.ts` — Vitest runner config
- Test files: Co-located (e.g., `Component.test.tsx` next to `Component.tsx`) — none currently present
- Run: `npm test` (vitest run), `npm run test:watch` (watch mode)

## Naming Conventions

**Files:**
- Components: PascalCase.tsx (e.g., `PracticeSession.tsx`, `FillerGauge.tsx`)
- Hooks: camelCase starting with "use" (e.g., `useAudioCapture.ts`, `useLabelingSession.ts`)
- Services: camelCase + "Service" or "{domain}Storage.ts" (e.g., `geminiService.ts`, `sessionStorage.ts`)
- Types: types.ts (e.g., `src/features/profile/types.ts`)
- Utilities: camelCase (e.g., `fillerReconciler.ts`, `diagnosticQuestions.ts`)
- Tests: {file}.test.ts or {file}.spec.ts (co-located)

**Exports:**
- Components: Named exports (e.g., `export function PracticeSession() { ... }`)
- Hooks: Named exports (e.g., `export function useAudioCapture() { ... }`)
- Types: Named exports (e.g., `export interface SessionSummary { ... }`)
- Constants: ALL_CAPS for module-level constants (e.g., `STORAGE_KEY`, `FILLER_WORDS`)
- Barrel files: `index.ts` re-exports public API (e.g., `export { useFillerDetector }` from `./useFillerDetector`)

**Directories:**
- Feature folders: lowercase with dashes (e.g., `accusation-audit`, `labeling`, `profile`)
- Component folders: lowercase (e.g., `components`, `core`, `services`)
- Plural for collections: `components`, `features`, `pages`, `services`, `utils`
- Singular for modules: `core/audio`, `src/data`

**Functions and Variables:**
- camelCase for functions, variables, object keys
- PascalCase for React components and TypeScript types
- `_prefix` for unused parameters (e.g., `_unused?: string`)

## Where to Add New Code

**New Practice Module (Skill Feature):**
1. Create folder: `src/features/{skill-name}/`
2. Add files:
   - `{Skill}Practice.tsx` — main container
   - `use{Skill}Session.ts` — session state hook
   - `{skill}Analyzer.ts` — analysis logic
   - `{skill}Storage.ts` — localStorage persistence
   - `types.ts` — domain types
   - `Scenario{Presenter,Feedback,Summary}.tsx` — UI components
   - `index.ts` — module exports
3. Import in `src/App.tsx` route (e.g., `<Route path="/practice/{skill}" element={...} />`)
4. Add navigation card in `Dashboard.tsx` (Practice section)

**New UI Component:**
1. Create: `src/components/{ComponentName}.tsx`
2. Export as named export: `export function {ComponentName}(props) { ... }`
3. If used across features, place in `components/`
4. If feature-specific, place in `src/features/{feature}/components/`

**New Service or Utility:**
- Data persistence: `src/services/{domain}Storage.ts` (export functions directly)
- API integration: `src/services/{api}Service.ts`
- Algorithm: `src/lib/{algorithm}.ts` (pure functions, no React)
- Browser API wrapper: `src/core/{domain}/{hook}.ts`

**New Static Data:**
- Reference data: `src/data/{domain}.ts` (read-only objects)
- Config constants: `tailwind.config.js` (theme), `src/constants.ts` (if needed)

**Tests:**
- Co-locate: `src/components/Component.test.tsx` (next to component)
- Import from `@testing-library/react` and `vitest`
- Run via `npm test`

## Special Directories

**src/core/audio/:**
- Purpose: Browser Web API wrappers (not analysis)
- Generated: No
- Committed: Yes
- Access pattern: Import hooks directly into components that need audio
- Example: `const { isCapturing, start, stop } = useAudioCapture()`

**src/features/{feature}:**
- Purpose: Self-contained feature module
- Generated: No
- Committed: Yes
- Access pattern: Import top-level component and types from `index.ts`
- Example: `import { LabelingPractice } from '../features/labeling'`

**localStorage keys (virtual, not filesystem):**
- Purpose: Application state persistence
- Generated: At runtime (keys created on first write)
- Committed: No (data only, not code)
- Keys managed in:
  - `src/services/sessionStorage.ts` — `voicelab_sessions`
  - `src/features/profile/profileStorage.ts` — `voicelab_profile`
  - `src/lib/diagnosticQuestions.ts` — `voicelab_diagnostic`

**node_modules/:**
- Purpose: Installed dependencies (Vite, React, Tailwind, TypeScript, ESLint, Vitest)
- Generated: By `npm install`
- Committed: No
- Size: ~450MB (typical for Node.js project)

**dist/ (build output):**
- Purpose: Production bundle generated by Vite
- Generated: By `npm run build`
- Committed: No (in .gitignore)
- Deployed to: Vercel

---

*Structure analysis: 2026-02-02*
