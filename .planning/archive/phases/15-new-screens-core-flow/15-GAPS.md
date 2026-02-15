# Phase 15 Gap Closure Items

**Created:** 2026-02-14 (post-verification user testing)
**Source:** Additional user testing feedback after Plan 06 verification

---

## Critical Gaps (Phase 15 regressions)

### Gap 1: Orb color not gold during free practice session
**Severity:** High (design system violation)
**Page:** Practice filler session (free practice mode)
**Issue:** SessionOrb is not using the gold (#c9a84c) accent color during practice
**Expected:** Gold gradient orb matching Phase 13 SessionOrb redesign
**Root cause:** Likely using old color values or not applying the redesigned SessionOrb component
**Files affected:**
- `src/components/PracticeSession.tsx` (free practice mode)
- Possibly `src/components/SessionOrb.tsx` if old version is still referenced

**User quote:** "the orbs color is not the gold and neither is the text"

---

### Gap 2: Practice prompt positioning wrong in free practice
**Severity:** High (UX regression)
**Page:** Practice filler session (free practice mode)
**Issue:** Practice prompt appears on top right instead of directly under the SessionOrb
**Expected:** Prompt positioned directly below SessionOrb (matching baseline session fix from Plan 06)
**Root cause:** Plan 06 fixes only applied to `BaselineSession.tsx`, not to `PracticeSession.tsx` free practice mode
**Files affected:**
- `src/components/PracticeSession.tsx` (free practice mode rendering)

**User quote:** "now i see the text it is on the top right it needs to be right under the orb"

**Related fix:** Plan 06 (commit ae0c006) fixed this for baseline sessions but missed free practice mode

---

### Gap 3: No practice prompt showing during session
**Severity:** High (missing feature)
**Page:** Practice filler setup → practice session
**Issue:** User reports not seeing the practice prompt during the session at all
**Expected:** Practice prompt should be visible during recording (dimmed, under orb)
**Root cause:** May be related to Gap 2 (mispositioned = invisible), or prompt not being passed/rendered in free practice mode
**Files affected:**
- `src/components/PracticeSession.tsx`
- Check prompt state/props passing from setup screen

**User quote:** "i am not getting the promtt during the practice sessino"

---

## Medium Priority Issues (existing features, not Phase 15 scope)

### Issue 4: Library category dropdown not working
**Severity:** Medium
**Page:** Library/Scenarios page
**Issue:** Category dropdown control is broken/non-functional
**Enhancement request:** Add framework filtering (by scenario) and author as clickable filters (like difficulty badges)
**Files affected:**
- Library/scenarios page component
- Filter controls

**Recommendation:** Defer to Phase 16 or separate bug fix session (not Phase 15 gap closure)

---

### Issue 5: Judgmental language in results
**Severity:** Low (content/tone)
**Page:** Practice results/coaching feedback
**Issue:** Using judgment words like 'good', 'bad', 'excellent'
**Better approach:**
- Use behavior-focused terms: 'action', 'effort', 'decisions'
- Use comparative statistics: "Top 5% of CEOs do this", "Top 1% of communication experts do this"
**Files affected:**
- AI coaching generation (AISummary component)
- Scorecard/results display
- Any feedback text generation

**Recommendation:** Defer to content/copy refinement pass (not blocking for v2.0)

---

## Gap Closure Plan Scope

**Include in gap closure (Phase 15 regressions):**
- Gap 1: Fix orb color in free practice mode
- Gap 2: Fix prompt positioning in free practice mode
- Gap 3: Ensure prompt renders during free practice session

**Exclude from gap closure (separate work):**
- Issue 4: Library filters (not Phase 15 scope, existing feature bug)
- Issue 5: Language/tone (content refinement, not blocking)

**Target:** Single gap closure plan to address all 3 critical gaps in `PracticeSession.tsx` (free practice mode)

---

*Gaps identified: 2026-02-14*
*User testing: Post-verification additional testing*
*Priority: High - affects core recording screen UX*
