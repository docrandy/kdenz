# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `PracticeSession.tsx`, `FillerGauge.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useWebSpeech.ts`, `useAudioCapture.ts`)
- Services/utilities: camelCase (e.g., `sessionStorage.ts`, `browserDetection.ts`, `fillerReconciler.ts`)
- Feature modules: kebab-case directories with barrel exports (e.g., `accusation-audit/`, `labeling/`)

**Functions:**
- React components: PascalCase (exported as default)
- Utility functions: camelCase (e.g., `saveSession`, `getAllSessions`, `isChrome`, `countFillerWords`)
- Helper functions inside files: camelCase, often prefixed with context (e.g., `getGaugeColor`, `getStatusLabel`, `generateId`)
- Private class methods: camelCase with underscore prefix in classes (e.g., `private processAudio()`, `private calculateRMS()`)

**Variables:**
- State variables: camelCase (e.g., `selectedDuration`, `browserWarningDismissed`, `isStarting`)
- Constants (file-level): SCREAMING_SNAKE_CASE (e.g., `WELCOME_SEEN_KEY`, `FILLER_WORDS`, `MATCH_WINDOW_MS`, `STORAGE_KEY`)
- Constants (within modules): camelCase for re-exported config (e.g., `DEFAULT_CONFIG` in FillerDetector)
- DOM element IDs/data attributes: kebab-case (Tailwind classes used instead)

**Types:**
- Interfaces: PascalCase, prefixed with context (e.g., `FillerDetection`, `FillerMetrics`, `FillerConfig`, `SessionSummary`, `UseWebSpeechResult`, `UseAudioCaptureResult`)
- Type unions: PascalCase (e.g., `FillerType`, `HighlightMode`, `ScenarioCategory`)
- Generic type params: T, U, etc. (no examples in codebase currently)

## Code Style

**Formatting:**
- ESLint enabled with JavaScript/TypeScript support via `@eslint/js` and `typescript-eslint`
- Prettier integration not detected in config, but code follows standard formatting
- 2-space indentation (inferred from codebase)
- Single quotes for strings (not enforced in config, mixed in codebase)
- Semicolons required (TypeScript strict mode enforces this implicitly)

**Linting:**
- ESLint 9.39.1 configured with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- React Hooks Rules of Hooks enabled (enforces proper hook usage)
- No configuration file found in root (likely using default ESLint flat config)
- Run with: `npm run lint`

**Strict TypeScript:**
- `strict: true` enabled in `tsconfig.json`
- `noUnusedLocals: true` - all variables must be used
- `noUnusedParameters: true` - all function parameters must be used
- `noFallthroughCasesInSwitch: true` - switch statements must be exhaustive

## Import Organization

**Order:**
1. React and core React libraries (e.g., `import { useState, useRef } from 'react'`)
2. React Router and navigation (e.g., `import { useNavigate } from 'react-router-dom'`)
3. Custom hooks (e.g., `import { useWebSpeech } from '../core/audio'`)
4. Components (e.g., `import PracticeSession from './components/PracticeSession'`)
5. Types and interfaces (e.g., `import type { UserProfile } from '../features/profile'`)
6. Services and utilities (e.g., `import { saveSession } from '../services/sessionStorage'`)
7. Data and constants (e.g., `import { SpeakingPrompt } from '../data/speakingPrompts'`)
8. CSS/styling (e.g., `import './App.css'`)

**Path Aliases:**
- No path aliases configured in `tsconfig.json`
- All imports use relative paths (e.g., `../services/sessionStorage`, `./components/ErrorBoundary`)
- Barrel exports used at feature level (e.g., `accusation-audit/index.ts` exports main component)

**Barrel Files:**
- Used in feature modules: `features/accusation-audit/index.ts`, `features/labeling/index.ts`, `features/profile/index.ts`
- Export pattern: named exports of main components and types, e.g., `export { AccusationAuditPractice } from './AccusationAuditPractice'`
- Reduces import path length: `import { AccusationAuditPractice } from './features/accusation-audit'`

## Error Handling

**Patterns:**
- Try-catch blocks for localStorage operations (graceful fallback to default values)
  ```typescript
  try {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  } catch {
    return [];  // Fallback default
  }
  ```

- Error states in React hooks: `error: string | null` property returned
  - Error details logged to console for development debugging
  - User-facing error components display simplified messages (e.g., `MicPermissionError.tsx`)

- ErrorBoundary class component (`src/components/ErrorBoundary.tsx`) wraps entire app
  - Catches React rendering errors
  - Displays fallback UI with refresh and retry options
  - Logs full error stack to console in development

- Service layer errors: Gemini API errors gracefully degrade
  - If API call fails, local stats displayed instead
  - No hard failure (per PRD: "Graceful Degradation")

- Audio/permission errors: Specific error components (e.g., `MicPermissionError.tsx`) for user guidance

## Logging

**Framework:** `console` (no external logging library)

**Patterns:**
- `console.error()` used in error handlers and ErrorBoundary
- Development-only debug info in comments (e.g., "Cast required due to TypeScript lib.dom.d.ts strict ArrayBuffer typing")
- No structured logging format observed
- Log statements sparse—only critical errors logged

**Recommendation for new code:**
- Log API errors with context: `console.error('API Error:', error, context)`
- Log state changes during debugging only, remove before commit
- Use console groups for complex multi-step operations: `console.group()`, `console.log()`, `console.groupEnd()`

## Comments

**When to Comment:**
- Complex algorithms with multiple steps (e.g., `FillerDetector.ts` has detailed comments for spectral analysis)
- Business logic that isn't immediately obvious (e.g., filler reconciliation strategy in `fillerReconciler.ts`)
- Workarounds and known limitations (e.g., "Acoustic filler detection was too unreliable" in `useFillerDetector.ts`)
- Epic/phase references for tracking implementation (e.g., "EPIC 3.1: Filler Detection" in `FillerDetector.ts`)

**JSDoc/TSDoc:**
- Minimal JSDoc usage observed
- When used, follows standard format with `/** comment */` blocks
- Documented in class/function comments: return types, parameters, side effects
- Example from `FillerDetector.ts`:
  ```typescript
  /**
   * Start detecting fillers (during speech turn)
   */
  start(): void { ... }
  ```

- Used for interface documentation, e.g., in `FillerMetrics`, `UseWebSpeechResult`

**Inline comments:**
- Sparse and purposeful
- "Note:", "DISABLED:", "TODO:" prefixes used for quick scanning
- Code is generally self-explanatory (good naming compensates)

## Function Design

**Size:** Functions are typically 5-30 lines
- Component render methods can be longer due to JSX
- Pure utility functions are 3-10 lines
- Avoid deeply nested logic (use early returns, helper functions)

**Parameters:**
- Destructuring used for props (standard React pattern)
- Optional parameters with default values (e.g., `FillerGaugeProps` defaults for thresholds)
- Avoid long parameter lists (group related params into objects)

**Return Values:**
- Explicit return types on all functions (TypeScript strict mode)
- No implicit any
- Component return type: JSX.Element or ReactNode
- Utility functions return typed values (number, string, boolean, custom interfaces)

## Module Design

**Exports:**
- Named exports preferred over default exports (except React components)
- Example: `export function saveSession()` in `sessionStorage.ts`
- React components typically exported as default: `export default function App()`
- Feature modules use barrel exports for convenience

**Feature Module Pattern:**
- Directory structure: `features/[feature-name]/`
- Contains: component, types, hooks, utilities, storage
- Barrel file (`index.ts`) exports public API
- Example structure from `accusation-audit/`:
  ```
  accusations-audit/
  ├── index.ts (exports AccusationAuditPractice)
  ├── AccusationAuditPractice.tsx (main component)
  ├── types.ts (feature types)
  ├── useAuditSession.ts (custom hook)
  ├── auditAnalyzer.ts (utility)
  └── auditStorage.ts (persistence)
  ```

**Re-exports in index.ts:**
```typescript
export { AccusationAuditPractice } from './AccusationAuditPractice'
export type { AuditResult } from './types'
```

## Styling Conventions

**Framework:** Tailwind CSS 3.4.18

**Color tokens:** Use custom clinical palette from `tailwind.config.js`
- `bg-clinical-bg` for backgrounds (#FFFFFF)
- `text-clinical-text` for text (#000000)
- `bg-clinical-accent` for primary buttons (#00D4FF)
- `hover:bg-clinical-accent-hover` for hover states
- `text-clinical-muted` for secondary text (#6B7280)
- `border-clinical-border` for borders (#E5E7EB)

**Class organization:**
- Container classes first (flex, grid, gap, padding)
- Then sizing (w-, h-, max-w-, max-h-)
- Then colors (bg-, text-, border-)
- Then responsive/state classes (hover:, focus:, dark:)

**Component example from `FillerGauge.tsx`:**
```tsx
<div className="flex flex-col items-center p-3 bg-white rounded-lg">
  <div className="relative w-28 h-28">
    {/* SVG content */}
  </div>
</div>
```

---

*Convention analysis: 2026-02-02*
