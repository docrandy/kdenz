# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- TypeScript 5.9.3 - All source code in `src/`
- JSX/TSX - React component files

**Secondary:**
- JavaScript - Build config files (`tailwind.config.js`, `postcss.config.js`)
- HTML - Single page shell at `index.html`

## Runtime

**Environment:**
- Node.js (version constraint from `.nvmrc` not specified, inferred as 18+)
- Browser runtime: Chrome (explicitly required per CLAUDE.md)

**Package Manager:**
- npm (latest)
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.2.0 - UI framework, all components in `src/components/` and `src/features/`
- React Router 7.10.1 - Routing and navigation
- React DOM 19.2.0 - DOM rendering

**Build/Dev:**
- Vite 5.4.11 - Build tool and dev server (config: `vite.config.ts`)
- @vitejs/plugin-react 4.3.4 - React JSX transformation

**Styling:**
- Tailwind CSS 3.4.18 - Utility-first CSS framework (config: `tailwind.config.js`)
- PostCSS 8.5.6 - CSS processing (config: `postcss.config.js`)
- Autoprefixer 10.4.22 - CSS vendor prefixing

**Testing:**
- Vitest 4.0.18 - Test runner (config: `vitest.config.*` if exists)
- @testing-library/react 16.3.2 - React component testing
- @testing-library/jest-dom 6.9.1 - DOM assertions
- jsdom 24.1.3 - DOM implementation for tests

**Linting:**
- ESLint 9.39.1 - Code linting (config: `.eslintrc` if exists)
- @eslint/js 9.39.1 - ESLint core rules
- typescript-eslint 8.46.4 - TypeScript linting
- eslint-plugin-react-hooks 7.0.1 - React Hooks rules
- eslint-plugin-react-refresh 0.4.24 - Fast Refresh rules

## Key Dependencies

**Critical:**
- @google/genai 1.31.0 - Google Generative AI (Gemini API client) for coaching summaries
  - Integration: `src/services/geminiService.ts`
  - Purpose: AI-generated post-session coaching feedback

**Infrastructure:**
- None detected (no database drivers, no state management library)

## Browser APIs Used

**Native APIs (no polyfills):**
- Web Audio API (`AudioContext`, `AnalyserNode`, `MediaRecorder`)
  - Filler detection: `src/core/audio/FillerDetector.ts`
  - Recording: `src/core/audio/useAudioCapture.ts`
  - Playback: `src/core/audio/useAudioPlayback.ts`

- Web Speech API (`SpeechRecognition`, `webkitSpeechRecognition`)
  - Transcript capture: `src/core/audio/useWebSpeech.ts`
  - Chrome-only implementation (Safari explicitly unsupported)

- MediaDevices API (`getUserMedia`)
  - Microphone access in `src/core/audio/useAudioCapture.ts`
  - Echo cancellation, noise suppression, auto gain control enabled

- localStorage API
  - Session storage: `src/services/sessionStorage.ts`
  - Settings storage: `src/services/settingsStorage.ts`
  - Gemini API key storage: `src/services/geminiService.ts`
  - Diagnostic results: `src/lib/diagnosticQuestions.ts`
  - Onboarding state: `src/App.tsx`

## Configuration

**Environment:**
- Framework: Vite (fast dev server, optimized production builds)
- Configuration: `.env.example` defines `VITE_GEMINI_API_KEY`
- API Key Loading: Via Vite's `import.meta.env` (automatically injected)

**Build:**
- Output: `dist/` (configured in `vercel.json`)
- Target: ES2020
- Module format: ESNext (Vite handles transpilation)
- JSX: Automatic (via @vitejs/plugin-react)
- Source maps: Enabled for debugging

**TypeScript:**
- Strict mode enabled
- No unused locals/parameters
- No fallthrough switch cases
- Module resolution: Bundler mode
- Target: ES2020, DOM libraries included

## Platform Requirements

**Development:**
- Node.js 18+ (inferred)
- npm package manager
- Modern IDE with TypeScript support

**Production:**
- Deployment: Vercel (configured in `vercel.json`)
- Build command: `npm run build`
- Install command: `npm install`
- Build framework: Vite
- Output directory: `dist/`
- Routing: Single-page app (SPA routes handled via `/(.*) → /index.html`)

**Browser:**
- Chrome (required per CLAUDE.md)
- Web Audio API support (required)
- Web Speech API support (Chrome's `webkitSpeechRecognition`)
- localStorage support
- MediaDevices API support (microphone access)

## Scripts

- `npm run dev` - Vite dev server
- `npm run build` - TypeScript + Vite production build
- `npm run lint` - ESLint code linting
- `npm run preview` - Preview production build locally
- `npm run test` - Vitest test runner

---

*Stack analysis: 2026-02-02*
