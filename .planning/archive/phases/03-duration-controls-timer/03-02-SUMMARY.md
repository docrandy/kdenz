---
phase: 03
plan: 02
title: "Consent Modal & First-Run Gating"
one_liner: "First-time users see consent/disclosure modal with locked foundation copy before any recording can happen"
subsystem: onboarding
tags: [consent, first-run, localStorage, modal, foundation-copy]
requires:
  - phase: 01
    provides: project-setup, design-system
  - phase: 02
    provides: dashboard-routing
provides:
  - consent-modal-component
  - first-run-gating
  - consent-persistence
affects:
  - phase: 03-04
    context: baseline-flow-starts-after-consent
  - phase: 07
    context: copy-compliance-validation
tech_stack:
  added: []
  patterns: [modal-overlay, top-level-routing-gate, localStorage-persistence]
key_files:
  created:
    - src/components/ConsentModal.tsx
  modified:
    - src/App.tsx
decisions:
  - id: consent-copy-locked
    choice: Use verbatim copy from docs/foundation/copy/consent-and-onboarding-copy-v1.md
    context: Foundation doc provides claim-safe copy with clear boundaries
  - id: top-level-gate
    choice: Consent gate blocks ALL routes until acceptance
    context: No route should be accessible without consent (security + UX consistency)
  - id: consent-storage-key
    choice: localStorage key 'voicelab_consent_accepted'
    context: Separate from welcome/diagnostic keys for clear separation of concerns
metrics:
  duration: "~5 minutes"
  tasks_completed: 2
  files_created: 1
  files_modified: 1
  commits: 2
completed: 2026-02-05
---

# Phase 03 Plan 02: Consent Modal & First-Run Gating Summary

## What Was Built

Created a consent/disclosure modal that gates first-time users before any audio recording can happen. The modal displays locked copy from the foundation docs explaining what VoiceLab analyzes (and explicitly what it does NOT analyze). Users must accept consent to proceed, and consent is persisted in localStorage so the modal does not reappear for returning users.

**One-liner:** First-time users see consent/disclosure modal with locked foundation copy before any recording can happen.

## Tasks Completed

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create ConsentModal component with locked foundation copy | 7ad2d66 | src/components/ConsentModal.tsx |
| 2 | Wire consent modal into App.tsx first-run flow | 610903e | src/App.tsx |

## Implementation Details

### ConsentModal Component (Task 1)

Created `src/components/ConsentModal.tsx` — a full-screen modal overlay with centered white card displaying consent/disclosure copy.

**Copy content (verbatim from foundation doc):**
- Title: "Before we begin" (warm, not clinical)
- Section 1: "We analyze your speech to provide feedback on:" (pace, pauses, fillers, pitch/volume)
- Section 2: "What we DON'T analyze:" (emotion, mental health, personality, good/bad judgments)
- Privacy section: "Your audio is processed locally and not stored on any server. You can pause recording or close the app at any time. This tool is for learning purposes only. It is not a medical or diagnostic tool."

**Design implementation:**
- Full-screen overlay (`fixed inset-0`) with semi-transparent black background
- Centered white card (`max-w-md`) with rounded corners and shadow
- VoiceLab title at top
- "What we analyze" section with teal checkmarks (✓)
- "What we DON'T analyze" section with gray X marks (✗) to differentiate
- Privacy disclosure in smaller gray text
- Single "I Understand" button — black background (#000000), white text, full width, rounded (per design system)
- No dismiss/close button — user MUST accept to proceed
- Overlay blocks interaction with content behind it

**Props interface:**
```typescript
interface ConsentModalProps {
  onAccept: () => void;
}
```

The component is purely presentational with an accept callback. It does NOT handle localStorage itself — the parent (App.tsx) handles persistence.

### First-Run Flow Integration (Task 2)

Modified `src/App.tsx` to insert consent modal as a top-level gate before all routes.

**localStorage key:** `voicelab_consent_accepted` (value: `'true'`)

**New first-run flow:**
1. Consent modal (NEW — blocks ALL routes until accepted)
2. Browser warning (non-Chrome) — unchanged
3. WelcomeScreen — unchanged
4. DiagnosticOnboarding — unchanged
5. Dashboard — unchanged

**Implementation details:**
1. Imported `ConsentModal` component
2. Added `CONSENT_ACCEPTED_KEY = 'voicelab_consent_accepted'` constant
3. Added `consentAccepted` state variable (boolean)
4. Modified `useEffect` to check consent FIRST before checking welcome/diagnostic state
5. Added `handleConsentAccept` function:
   - Sets `localStorage.setItem(CONSENT_ACCEPTED_KEY, 'true')`
   - Sets `consentAccepted(true)`
   - Checks if welcome should be shown and sets state accordingly
6. Top-level consent gate in return statement:
   ```typescript
   if (!consentAccepted) {
     return (
       <ErrorBoundary>
         <div className="min-h-screen bg-clinical-bg text-clinical-text">
           <ConsentModal onAccept={handleConsentAccept} />
         </div>
       </ErrorBoundary>
     )
   }
   ```

**Why top-level gate:** A first-time user should not be able to navigate directly to any route (`/practice/filler`, `/practice/pace`, `/settings`, etc.) without consent. The top-level gate is cleaner than per-route guards and ensures consent before ANY interaction.

## Verification Results

All verification criteria passed:

- ✓ `npx tsc --noEmit` — zero TypeScript errors
- ✓ `npm run build` — successful production build
- ✓ ConsentModal.tsx exists with locked foundation copy
- ✓ Component exports default function with onAccept prop
- ✓ Contains the locked copy text (verified via grep for "Emotion or confidence")
- ✓ Contains "I Understand" button
- ✓ No localStorage calls inside ConsentModal component (parent handles persistence)
- ✓ App.tsx imports and renders ConsentModal
- ✓ `voicelab_consent_accepted` key is checked in localStorage
- ✓ Consent modal blocks ALL routes until accepted
- ✓ After acceptance, normal flow resumes (welcome → diagnostic → dashboard)

## Success Criteria Met

1. ✓ First-time users see consent modal with verbatim foundation copy before anything else
2. ✓ "I Understand" button persists consent and proceeds to existing onboarding flow
3. ✓ Returning users (consent already given) see no modal
4. ✓ No route accessible without consent (top-level gate)
5. ✓ Build passes with zero errors

## Deviations from Plan

None — plan executed exactly as written.

## Decisions Made

### consent-copy-locked
**Decision:** Use verbatim copy from `docs/foundation/copy/consent-and-onboarding-copy-v1.md`

**Context:** Foundation doc provides claim-safe copy with clear boundaries for what VoiceLab analyzes and explicitly what it does NOT analyze. This copy is locked to ensure legal/compliance safety.

**Outcome:** Consent modal copy matches foundation doc exactly. Template placeholders resolved: `{stored_securely}` → "processed locally and not stored on any server".

### top-level-gate
**Decision:** Consent gate blocks ALL routes until acceptance

**Context:** Security and UX consistency require that no route should be accessible without consent. Top-level gate is cleaner than per-route guards.

**Outcome:** Single `if (!consentAccepted)` check in App.tsx return statement. All routes (`/`, `/practice/*`, `/settings`, etc.) are blocked until consent is given.

### consent-storage-key
**Decision:** localStorage key `voicelab_consent_accepted`

**Context:** Separate from `voicelab_welcome_seen` and `voicelab_diagnostic_skipped` keys for clear separation of concerns.

**Outcome:** Consent state is independently managed. Consent check happens FIRST in the useEffect, before welcome/diagnostic checks.

## Next Phase Readiness

**Ready for Phase 03-03 (Duration picker + countdown timer):**
- ✓ Consent modal in place — first-run flow complete up to welcome screen
- ✓ Top-level routing gate working — can add baseline flow next
- ✓ localStorage pattern established — can extend for baseline storage

**Blockers:** None

**Notes for next plan:**
- Plan 03-04 will add baseline session flow, which starts AFTER consent acceptance
- The consent copy includes privacy disclosure that will be referenced in Phase 07 (copy-lint compliance)
- Consent state is checked on every app load — returning users skip the modal automatically

## Commits

- `7ad2d66` — feat(03-02): create ConsentModal with locked foundation copy
- `610903e` — feat(03-02): wire consent modal into first-run flow as top-level gate

---

*Plan: 03-02*
*Completed: 2026-02-05*
*Duration: ~5 minutes*
