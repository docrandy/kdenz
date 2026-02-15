# External Integrations

**Analysis Date:** 2026-02-02

## APIs & External Services

**Generative AI:**
- Google Generative AI (Gemini 1.5 Flash) - AI coaching summaries
  - SDK/Client: `@google/genai` 1.31.0
  - Auth: `VITE_GEMINI_API_KEY` (environment variable)
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
  - Implementation: `src/services/geminiService.ts`
  - Usage:
    - Function: `generateCoachingSummary(request, apiKey)`
    - Input: transcript, session stats, filler breakdown
    - Output: personalized coaching feedback (delivery, clarity, structure, engagement)
    - Format: Markdown with "What worked well", "Area to improve", "Quick tip"
    - Fallback: Local stats formatting if API fails or no key provided
  - Graceful degradation: All failures return local summary via `formatLocalSummary()` from `src/lib/localStatsFormatter.ts`

## Data Storage

**Databases:**
- None - fully client-side application

**File Storage:**
- None - no file upload/storage service integrated

**Local Storage:**
- Browser localStorage API (only local persistence)
  - Session data: `src/services/sessionStorage.ts`
  - Settings: `src/services/settingsStorage.ts`
  - Gemini API key: `src/services/geminiService.ts`
  - Diagnostic results: `src/lib/diagnosticQuestions.ts`
  - Onboarding state: Welcome and diagnostic flags in `src/App.tsx`

**Caching:**
- None - no caching service

**Audio Storage:**
- Local blob creation only (in-memory during session)
  - Recording: `src/core/audio/useAudioCapture.ts` creates WebM blob
  - Playback: `src/core/audio/useAudioPlayback.ts` consumes blob
  - No persistence beyond session

## Authentication & Identity

**Auth Provider:**
- None - no authentication required

**Implementation:**
- Public app, no user accounts or login
- Session-specific data stored locally in browser
- Gemini API key provided by user manually (optional, stored in localStorage)

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging only:
  - `src/core/audio/useAudioCapture.ts` - Audio capture debug logs
  - `src/core/audio/useWebSpeech.ts` - Web Speech API debug logs
  - `src/services/geminiService.ts` - API error warnings
  - No centralized logging service

**Analytics:**
- None detected

## CI/CD & Deployment

**Hosting:**
- Vercel (production deployment)
  - Configuration: `vercel.json`
  - Build command: `npm run build`
  - Install command: `npm install`
  - Output directory: `dist/`
  - Framework: Vite
  - Routing: SPA routes redirect to `/index.html`

**CI Pipeline:**
- None detected (Vercel auto-builds on git push)

**Version Control:**
- Git (inferred from project structure)
- GitHub (inferred from workspace context, not explicitly configured)

## Environment Configuration

**Required env vars:**
- `VITE_GEMINI_API_KEY` - Google Gemini API key (optional; graceful fallback if missing)

**Secrets location:**
- `.env.local` - Development (not committed)
- `.env.example` - Template showing format
- Vercel environment settings (production)

**API Key Validation:**
- Function: `isValidApiKeyFormat(key)` in `src/services/geminiService.ts`
  - Requirement: >= 30 chars, alphanumeric + underscore/hyphen
  - Note: Basic format check only, not actual API validation

**API Key Retrieval Flow:**
1. Stored in localStorage: `voicelab_gemini_key`
2. User can provide/change in Settings page
3. Passed to `generateCoachingSummary()` at session end
4. If missing or invalid, local fallback used

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## API Error Handling

**Gemini API (generateCoachingSummary):**
- Request failures → log warning, return local summary
- HTTP errors (non-200 status) → log status, return local summary
- Malformed response (missing `candidates[0].content.parts[0].text`) → log warning, return local summary
- Network errors (fetch exception) → catch and return local summary

**Web Speech API:**
- `no-speech` error → ignored (expected during silence)
- Other errors → logged, optional user notification

**Audio Capture (getUserMedia):**
- Permission denied → caught, error message shown to user
- Device not available → caught, error message shown to user

## Browser Compatibility

**Explicitly Required:**
- Chrome (enforced via `isChrome()` check in `src/App.tsx`)
- Web Audio API
- Web Speech API (`webkitSpeechRecognition`)
- MediaDevices API

**Explicitly Not Supported:**
- Safari - Web Speech API accuracy 90% lower + critical bugs (per CLAUDE.md)
- Firefox - No Web Speech API support
- Edge - Not tested
- Mobile/iOS - No Web Speech API

**Detection:**
- Function: `isChrome()` and `getBrowserName()` in `src/utils/browserDetection.ts`
- User warning: `BrowserWarning` component shown if non-Chrome detected

---

*Integration audit: 2026-02-02*
