---
phase: 20
plan: "01"
name: "Scoring Engine + Attempt Persistence"
subsystem: "drill-engine"
status: COMPLETE
tags: ["scoring", "gemini", "localStorage", "evaluation", "form-scoring"]

dependency_graph:
  requires:
    - "19-01 (drill types, technique data, drill-storage.ts)"
  provides:
    - "drillEvaluationService.ts — form scoring + Gemini LLM evaluation"
    - "drillAttemptStorage.ts — attempt persistence schema + read/write helpers"
  affects:
    - "20-03 (DrillScreen will call evaluateDrillResponse + saveDrillAttempt)"
    - "21-xx (mastery tracking will read getDrillAttempts for spaced repetition)"

tech_stack:
  added: []
  patterns:
    - "Graceful degradation: Gemini failure → form score only, session not blocked"
    - "Weighted composite scoring: form*0.25 + accuracy*0.35 + impact*0.30 + timing*0.10"
    - "Form scoring via regex pattern matching (3 rule types: regex, negation, inclusion)"
    - "All localStorage operations wrapped in try/catch with empty-array fallbacks"

key_files:
  created:
    - src/services/drillEvaluationService.ts
    - src/utils/drillAttemptStorage.ts
  modified: []

decisions:
  - "gemini-2.5-flash used (upgrade from gemini-1.5-flash used by voice coaching service)"
  - "compositeScore = formScore when Gemini unavailable (not null, not 0 — always has a value)"
  - "Streak requires formScore>=80 AND accuracyScore>=75 when Gemini available; formScore>=80 alone when Gemini unavailable"
  - "JSON extraction handles both raw JSON and ```json code block wrapping from Gemini"

metrics:
  tasks_completed: 2
  tasks_total: 2
  duration: "5m 3s"
  completed: "2026-02-18"
---

# Phase 20 Plan 01: Scoring Engine + Attempt Persistence Summary

**One-liner:** Gemini 2.5 Flash drill evaluator with regex form scoring and localStorage attempt persistence — form-only fallback when LLM unavailable.

## What Was Built

### Task 1: src/services/drillEvaluationService.ts

Scoring engine for the v3.0 Generic Drill Engine. Completely decoupled from UI.

**Exports:**

```typescript
// Type
export type DrillEvaluationResult = {
  formScore: number;           // 0-100, instant regex scoring
  accuracyScore: number | null; // 0-100 from Gemini, null if failed
  impactScore: number | null;  // 0-100 from Gemini, null if failed
  timingScore: number;         // always 0 for Phase 20
  compositeScore: number;      // weighted composite
  explanation: string;         // coaching narrative or fallback
  geminiSucceeded: boolean;
}

// Functions
export function scoreForm(transcript: string, technique: Technique): number
export async function scoreWithGemini(transcript, technique, scenario, apiKey): Promise<...>
export async function evaluateDrillResponse(transcript, technique, scenario, apiKey): Promise<DrillEvaluationResult>
```

**Form scoring logic:**
- `regex` rules: pass if `RegExp(pattern, 'i').test(transcript)` — pattern must be present
- `negation` rules: pass if pattern NOT present — catches "you-framing" and other anti-patterns
- `inclusion` rules: same as regex (case-insensitive substring check)
- Score = `Math.round(passedWeight / totalWeight * 100)`
- Edge: empty transcript → 0; no rules → 100

**Gemini call:**
- Model: `gemini-2.5-flash` (upgraded from `gemini-1.5-flash` used in voice service)
- Endpoint: `generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- Temperature: 0.3, maxOutputTokens: 300
- Prompt requests: `{"accuracy": number, "impact": number, "explanation": "..."}`
- JSON extraction handles both raw JSON and ` ```json ` code block wrapping
- On any failure: returns null scores with fallback explanation string

**Composite score:**
- With Gemini: `form*0.25 + accuracy*0.35 + impact*0.30 + timing*0.10`
- Without Gemini: `compositeScore = formScore` (always has a value, never null)

### Task 2: src/utils/drillAttemptStorage.ts

Attempt persistence layer using localStorage key `kdenz:drill-attempts`.

**Exports:**

```typescript
// Types
export type DrillAttempt = { id, timestamp, techniqueId, scenarioId, transcript,
  formScore, accuracyScore, impactScore, timingScore, compositeScore,
  explanation, geminiSucceeded }

export type DrillSession = { id, startTime, techniqueId, attemptCount, streak }

// Functions
export function saveDrillAttempt(attempt: DrillAttempt): void
export function getDrillAttempts(techniqueId?: string): DrillAttempt[]
export function getSessionStreak(techniqueId: string, sessionStartTime: string): number
export function generateAttemptId(): string
export function clearDrillAttempts(): void
```

**Key behaviors:**
- `saveDrillAttempt`: read → push → write; try/catch with console.warn on failure
- `getDrillAttempts`: optional filter by techniqueId; returns [] on error
- `getSessionStreak`: counts consecutive qualifying attempts backwards from most recent; streak breaks on first non-qualifying attempt
- `generateAttemptId`: `Date.now().toString(36) + Math.random().toString(36).slice(2,7)`
- `clearDrillAttempts`: `localStorage.removeItem(ATTEMPTS_KEY)` — dev reset helper

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create drillEvaluationService.ts | `327e27a` | src/services/drillEvaluationService.ts |
| 2 | Create drillAttemptStorage.ts | `ab80576` | src/utils/drillAttemptStorage.ts |

## Verification Results

- `npx tsc --noEmit` — PASSED (0 errors)
- `npm run build` — PASSED (0 errors; pre-existing ~1.17 MB chunk warning, not new)
- Both files at exact paths specified in plan
- `scoreForm` exports handle all 3 rule types
- `evaluateDrillResponse` form-only fallback: `compositeScore = formScore`, `geminiSucceeded = false`
- localStorage key `kdenz:drill-attempts` confirmed distinct from `kdenz:drill-data`

## Deviations from Plan

None — plan executed exactly as written.

## Next

Plan 20-02 will build the drill state machine (scenario selection, session management). Plan 20-03 builds DrillScreen UI which calls `evaluateDrillResponse` and `saveDrillAttempt` from these two files.

## Self-Check: PASSED
