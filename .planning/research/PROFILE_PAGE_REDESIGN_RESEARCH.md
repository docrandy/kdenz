# Profile Page Redesign Research

**Date:** 2026-01-27
**Context:** User feedback on Profile page UX, decision to implement decision-tree goal selection

---

## User Feedback Summary (2026-01-27)

### What to Change:

1. **Communication Goals** - Replace with decision tree approach
   - Start with Long-term Goals FIRST (to identify ideal scenario)
   - Categories: Business / Personal / Miscellaneous
   - Create customized programs based on selection

2. **Focus Areas** - Separate section from Goals
   - Same decision tree structure
   - Independent selection

3. **Self-Assessment**
   - Add toggle: Options vs. free-text input
   - **REMOVE**: "Your Strengths" (may bias AI away from areas)
   - "What Makes You Nervous" → questionnaire format (like Loom intake)

4. **Demographics** - Move to TOP
   - General intake form style

5. **Remove**:
   - Family Dynamics
   - "Celebrate wins with me" toggle

6. **Preferences** - Open text box (AI interprets)

7. **Dev Notes** - Make sticky (fixed position on scroll)

---

## Research: Onboarding Decision Tree Best Practices

**Search Query:** "onboarding questionnaire decision tree depth UX best practices coaching apps 2025"

### Key Findings:

| Metric | Finding | Source |
|--------|---------|--------|
| **Max questions** | 5-10 total, under 2 minutes | Appcues, Formbricks |
| **Drop-off risk** | 74% abandon if complex | UXCam |
| **Activation boost** | Guru increased by 71% using decision-tree logic | Formbricks |
| **Progressive profiling** | Collect info over time, not all upfront | Multiple sources |
| **Immediate value** | Show personalized result before full app access | Sleep Reset example |

### Case Study: Guru
> "Guru increased user activation by 71% by leveraging personalized onboarding flows, in-app messaging, and milestone-based engagement. By using decision-tree logic, Guru ensures users receive tailored prompts at critical points."

### Case Study: Sleep Reset (Coaching App)
> "Sleep Reset uses its onboarding flow to collect detailed information about your sleep habits, goals and lifestyle. The calm, minimalistic, almost meditative flow mirrors the product's core value: better rest. At the end, you get a personalised sleep plan straight away, even before you start using the app."

### Key Statistics:
- Over 30% of required onboarding steps are unnecessary
- Complex onboarding = 74% abandonment rate
- Progressive disclosure outperforms info-dump approach

### Sources:
- [User Onboarding Best Practices 2025 - Formbricks](https://formbricks.com/blog/user-onboarding-best-practices)
- [App Onboarding Guide - UXCam](https://uxcam.com/blog/10-apps-with-great-user-onboarding/)
- [Onboarding Surveys - Appcues](https://www.appcues.com/blog/user-onboarding-surveys)
- [UX Onboarding Best Practices - UX Design Institute](https://www.uxdesigninstitute.com/blog/ux-onboarding-best-practices-guide/)

---

## Decision: 2-Level Decision Tree

**Rationale:**
- Keeps onboarding under 2 minutes
- Still specific enough to personalize
- Deeper details collected progressively through practice sessions
- Aligns with industry best practices (Guru, Sleep Reset)

**Structure:**
```
LEVEL 1: Business / Personal / Other
         |
LEVEL 2: 3-4 specific options per category
         |
OPTIONAL: "Tell us more" text box
         |
RESULT: Personalized "Your focus path" summary
```

**Why not 3+ levels:**
- Risk of 74% drop-off with complexity
- Deeper specificity can come from practice sessions
- Progressive profiling is more effective

---

## Implementation Plan

### Long-term Goals Tree:

**Level 1:** Business / Personal / Other

**Level 2 (Business):**
- Career advancement (promotions, raises, leadership roles)
- Better negotiations (deals, contracts, partnerships)
- Team leadership (managing people, feedback, difficult conversations)
- Client relationships (sales, stakeholder management, presentations)

**Level 2 (Personal):**
- Relationship communication (partner, family, friends)
- Confidence building (self-advocacy, speaking up)
- Conflict handling (confrontation without escalation)
- Boundary setting (saying no, protecting time/energy)

### Focus Areas Tree:
Same structure, but framed as "what to work on NOW" vs "long-term destination"

---

## Open Questions

1. ~~How deep should tree go?~~ **DECIDED: 2 levels**
2. ~~Dev Notes position~~ **DECIDED: Middle-right, always open (fixed position)**
3. Should there be a "personalized plan" summary shown after completing the tree?

---

## Implementation Log

### 2026-01-27 - Profile Page Redesign Complete

**Files Created:**
- `src/features/profile/components/DecisionTreeSelect.tsx` - 2-level decision tree component
- `src/features/profile/components/ToggleInput.tsx` - Options/text toggle for self-assessment
- `src/features/profile/components/index.ts` - Component exports

**Files Modified:**
- `src/features/profile/types.ts` - New types: `TreeSelection`, `GoalCategory`, `GOAL_OPTIONS`, `FOCUS_OPTIONS`, migration helpers
- `src/features/profile/profileStorage.ts` - Added migration from old to new profile structure
- `src/features/profile/ProfilePage.tsx` - Complete redesign with new layout
- `src/pages/Dashboard.tsx` - Updated to use new `demographics` and `focusAreas` fields
- `src/components/DevFeedbackBoxes.tsx` - Moved to middle-right, always open by default

**Changes Summary:**
1. Demographics at TOP (intake form style)
2. Long-term Goals with 2-level decision tree (Business/Personal/Other → specific goals)
3. Focus Areas with separate decision tree
4. Self-Assessment with toggle between options and free text
5. Removed: Family Dynamics, "Celebrate wins with me", Strengths section
6. Dev Notes panel: fixed middle-right position, always visible
