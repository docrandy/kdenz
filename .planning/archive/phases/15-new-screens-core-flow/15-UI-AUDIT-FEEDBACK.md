# UI Audit Feedback - Phase 15 Post-Completion

**Date:** 2026-02-14
**Source:** Comprehensive UI review via agent-browser
**Scope:** All redesigned screens (Welcome, Profile, Pre-Session, Recording, Post-Session) + Dashboard

---

## Issue Classification

### 🔴 Critical - Phase 15 Gaps (Fix Now)

**Issue 8: "Start Session" button has no styling**
- **Page:** Pre-Session setup (Filler Words, Speech Pace)
- **Problem:** Primary CTA appears as plain text with no visual affordance
- **Expected:** Gold filled button matching design system
- **Impact:** Major usability issue - users may not recognize it's clickable
- **Phase:** 15 (PreSessionScreen redesign - Plan 15-03)
- **Fix:** Apply primary button styling (gold bg, proper padding, hover states)

**Issue 2: Navigation inconsistency across screens**
- **Pages:** All screens
- **Problem:** Different nav patterns: centered "VoiceLab", back chevron + logo, "< Library", "< Back to practice"
- **Expected:** Consistent AppHeader (hamburger/back arrow + VoiceLab + profile avatar)
- **Impact:** Confusing navigation, breaks premium feel
- **Phase:** 15 (AppHeader implementation - Plan 15-01)
- **Fix:** Apply AppHeader component consistently across ALL screens

**Issue 10: Footer nav buttons lack visual hierarchy**
- **Page:** Profile onboarding (Steps 1-4)
- **Problem:** "Previous" and "Next" are plain text with equal weight
- **Expected:** "Next" = primary (gold), "Previous" = secondary (ghost/text)
- **Impact:** No clear primary action in onboarding flow
- **Phase:** 15 (InlineProfileSetup - Plan 15-02)
- **Fix:** Apply button hierarchy (primary Next, secondary Previous)

---

### 🟡 Medium - Phase 15 Polish (Should Fix)

**Issue 3: Progress bar barely visible in profile onboarding**
- **Page:** Profile setup steps (1-4)
- **Problem:** Thin gold line, unclear progress indication
- **Expected:** Segmented progress indicator or numbered stepper
- **Impact:** Users don't know how far through onboarding they are
- **Phase:** 15 (InlineProfileSetup - Plan 15-02)
- **Enhancement:** Replace with 4-step segmented progress indicator

**Issue 7: Practice setup pages feel empty**
- **Pages:** Filler Words setup, Speech Pace setup
- **Problem:** Sparse layout - title, subtitle, controls floating in empty space
- **Expected:** Encouraging copy, tips, or context about what to expect
- **Impact:** Missed opportunity for engagement and guidance
- **Phase:** 15 (PreSessionScreen redesign - Plan 15-03)
- **Enhancement:** Add helpful context, tips, or technique preview

---

### 🟢 Low - Phase 16 / Dashboard Redesign (Defer)

**Issue 1: Dev Notes panel in production**
- **Problem:** Yellow debug panel visible, overlaps content
- **Fix:** Hide behind dev flag or remove entirely
- **Phase:** 16 or cleanup pass
- **Priority:** Low (if it's a dev build, not urgent)

**Issue 4: "R" Avatar / User greeting sparse**
- **Problem:** Dashboard header has dead space, just initial + name
- **Fix:** Add greeting, progress summary, or suggested action
- **Phase:** 17 (Dashboard redesign - deferred to v2.1)

**Issue 5: Activity heatmap unreadable**
- **Problem:** GitHub-style heatmap too small, low contrast, wastes space
- **Fix:** Larger chart, better color contrast, full width
- **Phase:** 17 (Dashboard redesign)

**Issue 6: Session cards need more info**
- **Problem:** "39s — 0 fillers — 16m ago" is bare, no type/success indicator
- **Fix:** Add session type badge, success indicator, better affordance
- **Phase:** 17 (Dashboard redesign)

**Issue 12: "Technique Libr..." title truncation**
- **Problem:** Third dashboard card title gets cut off
- **Fix:** Smaller font, wrapping, or wider card
- **Phase:** 17 (Dashboard redesign)

---

### 🔵 Feature Enhancements (Future)

**Issue 9: Technique detail typography hierarchy**
- **Problem:** Long wall of text with small uppercase headers, lacks rhythm
- **Enhancement:** Add section dividers or cards to break up content
- **Phase:** Future enhancement (technique library polish)

**Issue 11: Color coding not explained**
- **Problem:** Framework labels (gold/green/red) have no legend
- **Enhancement:** Add framework color legend or tooltip
- **Phase:** Future enhancement (technique library polish)

---

## Recommended Action Plan

### Option A: Phase 15 Final Polish (Recommended)
Create **Plan 15-08** to address critical + medium issues from Phase 15 work:
- Issue 8: Style "Start Session" button
- Issue 2: Apply AppHeader consistently
- Issue 10: Button hierarchy in profile footer
- Issue 3: Segmented progress indicator
- Issue 7: Add context to practice setup pages

**Scope:** 5 issues, 3-4 files (PreSessionScreen, InlineProfileSetup, AppHeader, App.tsx)
**Duration:** ~1 hour
**Impact:** Completes Phase 15 polish before moving to Phase 16

### Option B: Split Between Phases
- **15-08 (Critical only):** Issues 8, 2, 10 (button styling, nav consistency, footer hierarchy)
- **Phase 16:** Include medium polish items (Issues 3, 7) in advanced screens phase
- **Phase 17:** Defer dashboard issues (1, 4, 5, 6, 12) to dashboard redesign

### Option C: Quick Fixes Now, Rest in Phase 16
- **Immediate:** Fix Issue 8 (button styling) as critical UX bug
- **Phase 16:** Bundle everything else into Phase 16 planning

---

## My Recommendation

**Go with Option A** - Create Plan 15-08 to polish all Phase 15 screens before moving to Phase 16. This ensures the core flow (Welcome → Profile → Pre-Session → Recording → Post-Session) is completely polished before tackling advanced screens.

Issues 1, 4, 5, 6, 12 (all dashboard-related) should wait for Phase 17 (Dashboard Redesign) which is already deferred to v2.1 with UX specialist input.

---

*Audit completed: 2026-02-14*
*Total issues identified: 12*
*Phase 15 scope: 5 issues (3 critical, 2 medium)*
*Deferred to later phases: 7 issues*
