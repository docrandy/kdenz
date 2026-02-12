---
phase: 12-color-migration
plan: 05
subsystem: ui-pages
tags: [tailwind, design-system, dark-premium, pages, semantic-tokens]

requires:
  - 12-01  # App shell with semantic tokens
  - 12-02  # Practice session components
  - 12-03  # Feedback & metrics components
  - 12-04  # Form components
provides:
  - dark-premium-pages  # All 12 page components migrated
  - semantic-page-tokens  # Consistent token usage across pages
affects:
  - 12-06  # Audit components (next in migration)
  - 12-07  # Old palette cleanup

tech-stack:
  added: []
  patterns:
    - Semantic color tokens in page-level components
    - btn-primary/input/badge-* component classes
    - Background hierarchy (background → surface → elevated)

key-files:
  created: []
  modified:
    - src/pages/Dashboard.tsx
    - src/pages/Settings.tsx
    - src/pages/Privacy.tsx
    - src/pages/PostSessionResults.tsx
    - src/pages/BaselineResults.tsx
    - src/pages/BaselineSession.tsx
    - src/pages/PreSessionScreen.tsx
    - src/pages/EvaluationPage.tsx
    - src/pages/ScenarioLibrary.tsx
    - src/pages/ScenarioDetail.tsx
    - src/pages/SessionDetail.tsx
    - src/pages/TechniqueFeedback.tsx

decisions:
  - decision: Used batch sed replacements for consistent pattern replacement across 5 large files
    rationale: EvaluationPage, ScenarioLibrary, ScenarioDetail, SessionDetail, TechniqueFeedback had 1556 total lines with consistent color patterns
    alternatives: [Manual edits would be time-consuming and error-prone]
  - decision: Dashboard accent gradient uses accent/80 → accent instead of cyan gradients
    rationale: Maintains visual hierarchy while using semantic token
    alternatives: [Could use solid accent, but gradient provides premium feel]

metrics:
  duration: 16m  # 948 seconds
  completed: 2026-02-12
---

# Phase 12 Plan 05: Pages Color Migration Summary

Migrated all 12 page components from clinical light palette to dark premium semantic tokens.

## What Was Done

### Task 1: Dashboard and Settings Pages

**Dashboard.tsx** (~40 color refs):
- Page background: `bg-gray-50` → `bg-background` (dark navy)
- Header: `bg-white border-b` → `bg-background-surface border-b border-background-elevated`
- Profile card: `bg-white` → `bg-background-surface border border-background-elevated`, avatar gradient uses `accent/80` → `accent`
- Practice cards: `bg-white border border-l-4 border-l-cyan-500 hover:bg-cyan-50` → `bg-background-surface border-background-elevated border-l-accent hover:bg-accent/5`
- Session cards: `bg-white hover:bg-gray-50` → `bg-background-surface hover:bg-background-elevated`
- Progress stats: `text-cyan-600` → `text-accent`
- Hamburger menu: `bg-white` dropdown → `bg-background-surface border-background-elevated`
- All text: `text-gray-900/700/600/500/400` → `text-text/text-muted/text-subtle`

**Settings.tsx** (~36 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `bg-white border-b border-gray-200` → `bg-background-surface border-b border-background-elevated`
- All inputs: Long className strings → `input` component class
- Labels: `text-gray-600` → `text-text-muted`
- Save button success state: `bg-green-100 text-green-700` → `bg-status-success/10 text-status-success`
- Diagnostic sections: `bg-gray-50` → `bg-background-elevated`
- Privacy link: `hover:bg-gray-100` → `hover:bg-background-surface`

**Commit:** 9c91730

### Task 2: Privacy and Results Pages

**Privacy.tsx** (~32 color refs):
- Page background: `bg-clinical-bg` → `bg-background`
- Content card: `bg-white border border-clinical-border` → `bg-background-surface border border-background-elevated`
- Status checkmarks: `bg-green-100 text-green-600` → `bg-status-success/10 text-status-success`
- Info icons: `bg-blue-100 text-blue-600` → `bg-accent/10 text-accent`
- All text: `text-clinical-text/muted` → `text-text/text-muted`
- Links: `text-clinical-accent` → `text-accent`

**PostSessionResults.tsx** (~24 color refs):
- All 4 phases migrated: `bg-white` → `bg-background`
- Checkmark icon: `bg-clinical-accent` → `bg-accent`, `text-white` → `text-text-inverse`
- Summary cards: `bg-gray-50` → `bg-background-surface border border-background-elevated`
- Audio playback section: Added `border border-background-elevated`
- Transcript link: `text-clinical-accent` → `text-accent`
- Continue button: `bg-black text-white` → `btn-primary`
- Navigation buttons: `bg-white border-2 border-gray-300` → `bg-background-surface border-2 border-background-elevated`
- Try Again: `bg-clinical-accent` → `btn-primary`

**BaselineResults.tsx** (~16 color refs):
- Page background: `bg-white` → `bg-background`
- Metric cards: `bg-gray-50` → `bg-background-surface border border-background-elevated`
- Checkmark icon: `bg-clinical-accent` → `bg-accent`
- Start button: `bg-black text-white hover:bg-gray-800` → `btn-primary w-full text-lg`
- All text: Migrated to semantic tokens

**BaselineSession.tsx** (~8 color refs):
- Page background: `bg-white` → `bg-background`
- Instructional card: `bg-gray-50` → `bg-background-surface border border-background-elevated`
- Callout box: `bg-clinical-accent bg-opacity-10 border-clinical-accent border-opacity-20` → `bg-accent/10 border-accent/20`
- Begin button: `bg-black text-white` → `btn-primary w-full text-lg`

**Commit:** 9ba2fbe

### Task 3: Remaining 6 Pages

**PreSessionScreen.tsx** (~6 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `border-b bg-white` → `border-b border-background-elevated bg-background-surface`
- Back button: `text-gray-600 hover:text-gray-900` → `text-text-muted hover:text-text`
- Start button: `bg-black text-white` → `btn-primary w-full`

**EvaluationPage.tsx** (~7 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `bg-white border-b` → `bg-background border-b`
- Transcript sections: `bg-gray-50` → `bg-background-surface`
- Container: `bg-white border` → `bg-background border`

**ScenarioLibrary.tsx** (~24 color refs):
- Page background: `bg-gray-50` → `bg-background`
- Header: `bg-white border-b` → `bg-background border-b`
- Search input: `bg-gray-100 focus:bg-white` → `bg-background-elevated focus:bg-background`
- Filter dropdowns: `bg-white` → `bg-background-surface`
- Active filters: `text-cyan-700` → `text-accent`, `font-semibold`
- Scenario cards: `bg-white hover:shadow-md active:bg-gray-50` → `bg-background hover:shadow-md active:bg-background-elevated`
- Badges: `bg-cyan-100 text-cyan-800` → `bg-accent/10 text-accent`

**ScenarioDetail.tsx** (~33 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `bg-white` → `bg-background`
- Difficulty badges: `bg-cyan-100 text-cyan-800` → `bg-accent/10 text-accent`
- Success checkmarks: `text-green-600` → `text-status-success`
- Error X marks: `text-red-500` → `text-status-error`
- Example cards: `bg-gray-50 hover:bg-gray-100` → `bg-background-surface hover:bg-background-elevated`
- Start button: `bg-black text-white` → `btn-primary`
- Tab navigation: `border-black text-gray-900` (active) → `border-text text-text`

**SessionDetail.tsx** (~29 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `bg-white border-b border-gray-200` → `bg-background border-b border-background-elevated`
- Main metric card: `bg-gray-50` → `bg-background-surface`
- Small metric cards: `bg-white border border-gray-200` → `bg-background border border-background-elevated`
- Status colors: `text-green-600` → `text-status-success`, `text-yellow-600` → `text-status-warning`, `text-red-600` → `text-status-error`

**TechniqueFeedback.tsx** (~35 color refs):
- Page background: `bg-white` → `bg-background`
- Header: `bg-white` → `bg-background`
- Checkmark icon: `bg-clinical-accent` → `bg-accent`
- Tab navigation: Active state → `border-text text-text`
- Try Again button: `bg-black text-white` → `btn-primary`
- Dashboard button: `bg-white border-2 border-gray-300` → `bg-background-surface border-2 border-background-elevated`
- Error highlights in transcript: `bg-red-100 text-red-700` → `bg-status-error/10 text-status-error`

**Commit:** be40113

## Key Patterns Applied

### Background Hierarchy
- Page level: `bg-background` (dark navy #0A1628)
- Card/panel level: `bg-background-surface` (#111D30)
- Elevated elements: `bg-background-elevated` (#1A2942)
- Always with borders: `border border-background-elevated`

### Text Hierarchy
- Primary text: `text-text` (light gray #E5E9F0)
- Secondary text: `text-text-muted` (medium gray #A8B2C1)
- Tertiary text: `text-text-subtle` (dim gray #6B7A90)
- Inverse (on dark): `text-text-inverse` (white)

### Interactive States
- Links: `text-accent hover:text-accent/80` or `hover:underline`
- Buttons: Use `btn-primary` class (handles all states)
- Hover backgrounds: `hover:bg-background-elevated`
- Active backgrounds: `active:bg-background-elevated`

### Status Colors
- Success: `text-status-success` or `bg-status-success/10`
- Warning: `text-status-warning` or `bg-status-warning/10`
- Error: `text-status-error` or `bg-status-error/10`

### Badges
- Default: `bg-background-elevated text-text-muted`
- Active: `bg-accent/10 text-accent`

## Technical Approach

### Batch Processing
For files with consistent patterns (EvaluationPage, ScenarioLibrary, ScenarioDetail, SessionDetail, TechniqueFeedback), used sed batch replacements:
```bash
sed -i 's/bg-white/bg-background/g; s/text-gray-900/text-text/g; ...' files
```

This ensured:
- Consistent replacements across ~1556 lines
- No missed patterns
- Faster execution than manual edits

### Manual Migration
For files with unique structures (Dashboard, Settings, Privacy, PostSessionResults, BaselineResults, BaselineSession, PreSessionScreen), used targeted Edit/Write operations to preserve component logic.

## Verification

All 12 files verified with:
```bash
grep -n "clinical-|bg-white|text-gray|border-gray|bg-gray|text-black|text-red|text-green|text-yellow" src/pages/*.tsx
```

Result: Zero old palette references found.

TypeScript compilation: Pre-existing import errors unrelated to color migration (WelcomeScreen, TranscriptView, Scorecard module resolution issues).

## Impact

### Before
- 12 pages using clinical light palette (white, gray-50, gray-900, cyan-500)
- ~290 total color class references across pages
- Inconsistent hover states (`hover:bg-gray-50` vs `hover:bg-gray-100`)
- Direct color values (`text-cyan-600`) instead of semantic tokens

### After
- 12 pages using dark premium semantic tokens
- Consistent 3-layer background hierarchy
- Unified status colors (success/warning/error)
- Component classes (`btn-primary`, `input`, `badge-*`) reduce duplication

## Next Steps

1. **Plan 12-06**: Migrate remaining audit components (AccusationAuditPractice, CriticismBrainstorm, AuditFeedback, AuditPatternSummary, AuditScenarioPresenter)
2. **Plan 12-07**: Remove old clinical palette from tailwind.config.js
3. **Validation**: Visual regression testing on all 12 pages
4. **Performance**: Verify no bundle size increase from semantic token usage

## Deviations from Plan

None - plan executed exactly as written. All 12 pages migrated successfully in 3 atomic task commits.

## Self-Check: PASSED

All 12 key files verified to exist.
All 3 task commits verified in git history.
