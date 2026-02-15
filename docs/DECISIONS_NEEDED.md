# Decisions Needed Before Moving Forward

**Created:** 2026-02-13
**Updated:** 2026-02-13 (D1-D7 answered, D6/D7 assessed)
**Context:** Gap analysis between Platform Plan, local codebase (v2.0), and Lovable prototype
**Purpose:** Unblock the path from current state to full KDENZ platform

---

## Critical Context

There are THREE artifacts in play, each telling a different story:

| Artifact | What It Is | Design System | Scope |
|----------|-----------|---------------|-------|
| **Local codebase** (v2.0) | Real product, shipped v1.0, v2.0 redesign in progress | Dark navy + gold (#0b0e14 + #c9a84c) | Voice practice only (fillers + pace) |
| **Lovable prototype** | Separate UI shell with mock data | 3 themes, gold/bronze (#c9a961) | Dashboard + 7 pages, no real logic |
| **Platform Plan** | Full vision document | "High-Performance Clinical" (white + black + teal) | Full adaptive diagnostic system (Voice + Skills + Simulation + VCM) |

The local codebase has real functionality. The Lovable prototype has breadth but no depth. The Platform Plan has the full vision but contradicts both builds on design direction.

---

## SECTION 1: Blocking Decisions — ANSWERED 2026-02-13

### D1. Which codebase is the product?

**ANSWER: Local codebase is the product. Lovable is reference only.**

Lovable was created as a visual template to see what things would look like. The Vercel-deployed UI keeps breaking. Lovable is a shell — the local codebase (126 commits, 15K+ lines, real audio pipeline) is the actual product.

**Implication:** Continue building on local codebase. Lovable can be referenced for layout ideas but is not a build target.

### D2. Design direction — which visual identity?

**ANSWER: Keep current dark navy + gold for now. Design direction will evolve.**

User wants to explore in Framer to hone in on final colors and fonts. Can't iterate on design effectively in Vercel or Claude Code — needs visual tooling. Current v2.0 dark premium continues as working design; expect a design refresh later.

**Implication:** Don't over-invest in design system polish. Build for function, not final aesthetics. Design tokens should be easy to swap when Framer exploration completes.

### D3. What is the MVP scope NOW?

**ANSWER: Jump to Platform Plan scope. Build the diagnostic engine.**

Core identity (user's words): *"A diagnostic engine that prescribes communication plans through motivational interviewing."*

Take what's proven (voice practice, filler detection, playback) and build the platform structure around it: Voice + Skills + Simulation + VCM. The scope is evolving as decisions and research continue, but direction is the full platform, not incremental v1.1/v1.2 steps.

**Implication:** PRD.json roadmap (v1.1 → v1.2 → v1.3) is obsolete. Need new roadmap aligned to Platform Plan. Existing voice practice features are the foundation, not the ceiling.

### D4. Hume.ai integration — when?

**ANSWER: Hume.ai for batch analytics and diagnostics. Gemini for real-time simulation speech.**

Confirmed: Hume real-time is unreliable. Batch post-session analysis for prosody, emotion, stress, freeze detection feeds the diagnostic engine. Gemini handles real-time speech in Simulation Studio.

**Implication:** Need backend proxy for Hume API calls (API key can't be in browser). Audio recording pipeline already exists. Integration is a defined task once platform architecture is in place.

### D5. VCM (Diagnostic Engine) — when and how?

**ANSWER: Design for it, but don't implement logic yet. Model is not finalized.**

Key revelation: **VCM has 8 gates (not 4 as documented in Platform Plan), each with 5-8 root causes.** User has a template but it's extensive and not finalized. Implementation approach is uncertain — could be Python script, custom AI trained in MI + VCM + neuroscience, or rule-based decision tree.

**Implication:** Design the data model and interfaces now (types, schemas, extension points). Actual diagnostic logic is deferred until the VCM model is finalized. Architecture must accommodate both rule-based and AI-driven approaches.

### D6. Browser support — Chrome-only or all browsers?

**ANSWER: Want to explore options. Chrome-only may hinder growth.**

**Assessment (researched 2026-02-13):**

Web Speech API browser compatibility score: ~50/100. Chrome and Edge work. Firefox disabled it in v102 (2022). Safari never properly enabled it.

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| Stay Chrome-only (Web Speech API) | Free, proven, working | Excludes ~35% of users (Safari, Firefox) | $0 |
| Deepgram / AssemblyAI / Gladia | Cross-browser, higher accuracy | Paid service, ~$0.01-0.05/min, requires backend | $1-5/user/month |
| Vosk (offline/WASM) | Free, runs in browser, no API calls | Lower accuracy, large WASM download (~40MB), limited languages | $0 but UX tradeoff |
| Whisper via backend | High accuracy, cross-browser | Requires backend, latency for real-time, compute cost | Variable |

**Recommendation:** Stay Chrome-only for now. When you're ready to expand browser support, Deepgram is the most practical paid alternative (WebSocket API, cross-browser, ~$0.015/min). This is a v2.1+ decision, not a blocker.

Full research filed: `.planning/research/R6_BROWSER_SUPPORT_ALTERNATIVES.md`

### D7. Dark mode — in scope or not?

**ANSWER: If not a big deal, do both. If big deal, dark only, defer light.**

**Assessment (codebase audit 2026-02-13):**

It's **moderate effort** — estimated 2-3 days (8-16 hours):
- CSS variables and semantic tokens exist (good hygiene from Phase 11)
- No ThemeContext/provider exists — needs to be built from scratch
- 2 contradictory color systems in codebase (index.css dark vs variables.css light)
- Canvas/SVG components (WaveformVisualizer, SessionOrb) have hardcoded hex values that can't use CSS variables directly
- Total: ~6-8 files, ~400-500 LOC changes

**Recommendation:** Dark only for now. Since you're going to Framer to finalize the design direction anyway, building a light theme now means building it twice. Once Framer exploration produces the final palette, build both themes from that single source of truth.

**Implication:** Update CLAUDE.md and agents.md to say "Dark mode default, light mode deferred to post-Framer design finalization."

---

## SECTION 2: Design Decisions — ANSWERED 2026-02-13

### D8. Applied Skills Lab — drill design

**ANSWER: Need a course/platform architect to map out all branches first.**

User wants to map out all the different branches from Skills Lab and Simulation Studio before deciding on UX for individual drills. Needs an architect who specializes in educational platforms.

Existing code in `src/features/labeling/` and `src/features/accusation-audit/` can be reused, but the overall skill tree / learning path structure needs to be designed first.

**Action needed:** Create a learning architect agent or run a structured mapping session. See D8 ASSESSMENT below.

### D9. Simulation Studio — scope

**ANSWER: User wants to know what it entails before committing.**

See D9 ASSESSMENT below for full complexity breakdown.

### D10. KDENZ Institute — what is it?

**ANSWER: Full educational branch — videos, quizzes, reading material, educational content.**

Not just YouTube embeds. This is a proper learning section with:
- Video tutorials
- Quizzes
- Written educational material
- Reading content

**Implication:** More complex than Platform Plan described. Needs content management, progress tracking, quiz engine. Scope closer to the Lovable version (Framework Library + Tutorials + Quizzes) than the Platform Plan's "YouTube iframe."

### D11. Communication Index formula

**ANSWER: Not defined yet.**

**Implication:** Can't build the Performance page or Communication Index display until this is designed. Should be derived from available data (Hume.ai scores + local metrics + drill performance) once enough sessions exist. Defer to when Hume.ai is integrated and producing real data.

### D12. Recommendation engine behavior

**ANSWER: Defer to later versions. Keep straightforward for now.**

**Implication:** No adaptive ratio logic, no style testing, no recommendation tracking for now. Recommendations can be simple and rule-based initially (e.g., "you did a lot of fillers, try the filler reduction drill"). Evolve to the full MI-based adaptive engine in a future version.

---

## D8 ASSESSMENT: Course / Learning Architecture

**Your question:** Is there a course architect or agent that can help map out all branches?

**Short answer:** Not as an off-the-shelf tool, but we can create one.

**Options:**

1. **Create a custom KDENZ Learning Architect agent** (`.claude/agents/learning-architect.md`)
   - Specialized in: skill tree design, learning path dependencies, drill/scenario mapping
   - Can reference educational platform patterns (Duolingo skill trees, Khan Academy mastery graphs)
   - Would help you create a structured skill map document
   - I can build this agent for you

2. **Run a structured mapping session**
   - I create a template document with the known skill categories
   - We fill it in together: skill → drills → scenarios → difficulty levels → dependencies
   - Output: a skill tree map that drives both Skills Lab and Simulation Studio content

3. **Use the existing braingrid-cli skill** to break this into a specification
   - `/specify` or `/breakdown` could structure this into a formal requirement

**Recommendation:** Option 1 + 2 combined. I create the learning architect agent (it knows educational platform patterns, skill tree design, and the KDENZ domain), then we run a mapping session with it. This gives you a reusable tool for ongoing curriculum design.

**What the agent would need from you:**
- The complete list of communication techniques KDENZ teaches (labeling, mirroring, accusation audit, calibrated questions, tactical empathy, etc.)
- How they relate to each other (prerequisites, difficulty levels)
- Which belong in Skills Lab (isolated drills) vs. Simulation Studio (integrated practice)
- Any sequencing or progression logic you already have in mind

---

## D9 ASSESSMENT: Simulation Studio Complexity

### What It Requires

| Component | Difficulty | Time Estimate | Dependencies |
|-----------|-----------|---------------|-------------|
| Scenario library (data structure + initial content) | Easy | 1-2 days | None — same pattern as labeling scenarios |
| Gemini multi-turn conversation API | Medium | 3-5 days | Gemini API key, system prompt design |
| Voice input → transcript → Gemini | Easy | 1 day | Already built (Web Speech API + MediaRecorder) |
| Conversation UI (chat interface, recording, AI response) | Medium | 3-4 days | Multi-turn pattern exists in labeling/audit modules |
| Post-session Hume.ai analysis | Medium | 2-3 days | Backend proxy (needed anyway) |
| Technique detection (did user apply labeling, mirroring, etc.) | Hard | 3-5 days | Prompt engineering, evaluation criteria |
| AI opponent quality tuning | Hard | Ongoing | Character consistency, difficulty levels |

### Total Estimate: 3-4 weeks

But it can be built incrementally:

**Week 1 — MVP Simulation (Text only):**
- Scenario selection → Gemini multi-turn chat → text input/output
- No voice, no technique detection
- Proves the conversation loop works

**Week 2 — Voice Integration:**
- Wire Web Speech API transcript as user input
- Record audio for later Hume analysis
- Streaming Gemini responses for natural pacing

**Week 3 — Post-Session Analysis:**
- Send recorded audio to Hume batch
- Gemini 2.0 Flash evaluates technique usage at session end
- Feedback display with technique scores

**Week 4 — Polish + Difficulty:**
- AI opponent difficulty levels
- Character consistency tuning
- Scenario library expansion

### What's Already Built That We Can Reuse

- `geminiService.ts` — Gemini API integration (needs expansion for multi-turn)
- Multi-turn conversation pattern — `useLabelingSession.ts` and `useAuditSession.ts` already have `continueConversation` / `submitContinuation`
- Scenario data structure — `scenarioBank.ts` and `scenarios.ts` patterns
- Audio recording — `useAudioCapture.ts`, `MediaRecorder` pipeline
- Web Speech API — `useWebSpeech.ts`

### Biggest Risk

The quality of the AI opponent. A bad simulation is worse than no simulation — if the AI doesn't respond realistically, users won't take it seriously. System prompt engineering and character consistency are the hardest parts to get right and require iteration.

### Recommendation

Build it, but in phases. Start with the text-only MVP (Week 1) as a proof of concept. If the conversation quality is good, continue to Weeks 2-4. If it's not, invest in prompt engineering before adding voice/analysis.

This is a v2.0 feature, not v3.0 — it's critical to the platform identity ("batting practice for conversations").

---

## SECTION 3: Document Contradictions — RESOLVED

All contradictions are now resolved by D1-D12 decisions:

| Contradiction | Resolution |
|--------------|-----------|
| Browser support | Chrome-only for now, Deepgram later (D6) |
| Dark mode | Dark only, light deferred to post-Framer (D7) |
| Design system | Dark navy + gold, will evolve via Framer (D2) |
| Skill modules | In scope now, full platform (D3) |
| Hume integration | Batch only, for analytics/diagnostics (D4) |
| Quizzes | In scope as part of KDENZ Institute (D10) |
| Benchmarking | Compare to self only (Platform Plan philosophy stands) |

**Next step:** Update PRD.json, CLAUDE.md, and agents.md to reflect all decisions.
