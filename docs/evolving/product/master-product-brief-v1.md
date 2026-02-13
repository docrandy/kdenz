# Master Product Brief

- **Tier:** Evolving
- **Status:** OPEN
- **Version:** v1
- **Source:** Kdenz Master project brief - Google Docs.pdf
- **Summary:** Comprehensive product brief covering product vision, ICP definition, product flow, constraints, open questions, and success criteria. Design system and language boundaries extracted to foundation/ files.

---

## Product Vision

A voice practice application that helps users discover unconscious speaking habits through real-time feedback. The core value proposition is the "holy shit moment" -- when users become aware of patterns they didn't know they had.

**Working Title:** "VoiceLab" for beta (Kdenz positioning deferred to post-PMF validation)

**Core Hypothesis:** Awareness training alone reduces filler word usage by 80%+. The product doesn't need to coach -- it needs to reveal.

## Ideal Customer Profile (ICP)

### Primary: Job Seekers (Interview Prep)
- **Age:** 22-35
- **Context:** Preparing for job interviews, want to make strong first impression
- **Pain:** Don't know how they actually sound; surprised by fillers and pacing when recorded
- **Urgency:** High (interview dates create natural deadlines)
- **WTP:** $10-15/month during active job search

### Secondary: Early-Career Managers
- **Age:** 28-40
- **Context:** Leading meetings, giving feedback, presenting to leadership
- **Pain:** Want to appear more polished and authoritative
- **Urgency:** Medium (ongoing development)
- **WTP:** Moderate; may expense through employer (B2B path)

### Future Expansion (Not MVP)
- Public speakers / presenters
- Content creators (YouTube, podcasts)
- Non-native English speakers
- Dating / social confidence

## Product Flow

### First-Time User Flow
1. **Landing:** Value prop + Chrome requirement notice
2. **Onboarding diagnostic:** 3-5 volitional questions (skill gap vs motivation gap)
3. **Consent:** Disclosure modal (what's analyzed, what's not, data storage)
4. **Baseline session:** 3-5 minutes, neutral topic, no feedback shown
5. **Reveal:** Show baseline metrics -- this IS the holy shit moment
6. **Practice session:** Record again with real-time filler gauge
7. **Post-session review:** Playback with highlights, metric comparison to baseline

### Returning User Flow
1. **Dashboard:** Latest session summary, trend charts, streak
2. **Record:** New practice session (prompted or free-form)
3. **Review:** Post-session breakdown, comparison to baseline and recent sessions
4. **Reflect:** Self-assessment prompt before seeing metrics (transfer-of-practice research)

## Technical Constraints

- **Chrome-only:** Safari Web Speech API has 90% accuracy drop + critical bugs
- **Hybrid filler detection:** Acoustic real-time (KWS) + transcript reconciliation (ASR) at session end
- **Gemini integration:** Gemini Live API for streaming audio; graceful degradation if API errors
- **Client-side processing:** VAD, basic pitch extraction, KWS run in browser
- **Server-side:** Transcript generation, detailed analysis, trend computation

## Open Questions (To Be Resolved)

| Question | Status | How to Resolve |
|----------|--------|---------------|
| Primary ICP (job seekers vs managers)? | OPEN | 10-20 interviews per segment |
| Is $10-15/mo the right price point? | OPEN | Interview + survey with pricing ladder |
| How many metrics to show on first session? | OPEN | Prototype test: 2 vs 4 vs all |
| Should baseline be required or optional? | OPEN | A/B test: required vs skip option |
| Real-time gauge: continuous or event-based? | OPEN | Prototype feedback |
| Playback feature: essential or nice-to-have? | Research says essential | Validate with users |

## Success Criteria (Beta)

| Criteria | Threshold | Source |
|----------|----------|--------|
| Users complete baseline session | >= 60% of signups | Onboarding completion |
| "Holy shit moment" reported | >= 50% of baseline completers | Post-baseline survey |
| Week-1 return rate | >= 40% | Analytics |
| Week-4 return rate | >= 20% | Analytics |
| Would recommend to a friend | >= 50% yes | Survey |
| Would pay $10-15/month | >= 30% yes | Survey |

## Related Files

### Extracted to Foundation (Locked)
- [design-system-v1.md](../../foundation/brand/design-system-v1.md) -- color palette, typography, visual identity
- [language-boundaries-v1.md](../../foundation/product/language-boundaries-v1.md) -- hard-banned words/phrases

### Related Evolving Files
- [strategic-recommendations-v1.md](strategic-recommendations-v1.md) -- MVP roadmap and go-to-market
- [icp-validation-and-positioning-v1.md](../research/icp-validation-and-positioning-v1.md) -- ICP comparison research
- `feature-scope-and-engineering-plan-v1.md` -- technical implementation scope
