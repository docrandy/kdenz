---
created: 2026-02-04T23:55
title: Kdenz Gamification System
area: feature
files:
  - src/pages/Dashboard.tsx
  - src/services/baselineService.ts
  - src/pages/PostSessionResults.tsx
---

## Problem

Need to add gamification layers to increase user engagement and retention. Current PRD ships real-time filler gauge, weekly trend chart, and playback timeline with filler markers — gamification builds ON TOP of existing visual feedback without architectural changes.

Goal: discover Kdenz-specific engagement best practices through instrumented beta testing.

## Solution

### 1. STREAK SYSTEM (weekly cadence, NOT daily)
- Track "sessions this week" (target: 3+)
- Weekly streak counter: "3 sessions/week — 4 weeks running"
- Do NOT use daily streaks — users won't practice daily, broken streaks cause churn
- Streak reset logic: missed full week = reset, not missed single day
- Visual: streak flame/counter on dashboard

### 2. BADGE/ACHIEVEMENT TRIGGERS (5-8, tied to existing metrics)
- "First Filler-Free Minute" — 60 seconds continuous, zero filler words detected
- "3 Sessions This Week" — weekly practice consistency
- "Pace Zone Master" — pace stayed in target zone for 2+ minutes straight
- "Clean Close" — zero filler words in final 30 seconds of session
- "Week-Over-Week Improvement" — filler count dropped vs previous week
- "5-Session Streak" — completed 5 sessions within any rolling 14-day window
- "Half-Time Hero" — filler count in second half of session lower than first half
- Badge visual: icon + title + date earned + metric snapshot at time of earn

### 3. PROGRESS CHART ENHANCEMENT (extend existing weekly trend)
- Add cumulative "total practice time" counter
- Add "personal best" markers on the trend chart (lowest filler count, best pace session)
- Show improvement percentage: "42% fewer fillers than your first session"

### 4. ANALYTICS INSTRUMENTATION (critical for learning what works)
- Track: badge_earned → next_session_started (time between)
- Track: streak_displayed → session_initiated (did seeing streak prompt practice?)
- Track: progress_chart_viewed → return_visit_within_48hrs
- Track: which badges correlate with 7-day and 30-day retention
- Log every gamification element interaction as discrete events

### SKIP FOR BETA (Phase 2-3):
- Leaderboards
- Social sharing
- Celebration animations
- LinkedIn integration
- Multiplayer/team challenges

## Dependencies
- Existing filler detection metrics (shipped)
- Existing real-time gauge + weekly trend chart (shipped)
- Session timestamp logging (verify exists)
- User session count tracking (verify exists)

## Success Criteria
- Users who engage with gamification elements retain at 1.5-2x rate of those who don't
- At least 1 badge trigger correlates with return visits at p<0.05
- Weekly streak users show higher 30-day retention than non-streak users
