# VCM-to-KDENZ Evaluation Framework

**Purpose:** Structured criteria for parallel agent analysis of the VCM foundational document.
**Trigger:** Apply when the beta volitional system document is received.
**Structural change:** C1 is being redefined from Believability/Perception → Awareness/Attention. All other gates (C0, C2-C6B) are confirmed.

---

## Agent 1: Gate Architecture Validation

**Goal:** Verify that the 8-gate sequential structure holds, with the C1 redefinition applied.

### Criteria

1. **Sequential dependency test**: For each gate, confirm that failure at gate N logically prevents downstream gates N+1...N+k from producing behavior. Flag any gate where the dependency argument is weak.

2. **C1 redefinition assessment**:
   - Does "Awareness/Attention" work as the first volitional gate (after C0 pre-volitional screen)?
   - Which of the 8 existing C1 root causes (Cognitive Biases, Fixed Mindset, No Relatable Models, Meta-Cognitive Doubt, Insufficient Evidence, Fragile Confidence, Social Disconfirmation, Impostor Attribution) fit under Awareness/Attention?
   - Which must be redistributed to other gates? Propose destination.
   - What NEW root causes are needed for Awareness/Attention that don't exist yet?

3. **Gate boundary clarity**: For each adjacent gate pair (C0/C1, C1/C2, C2/C3, C3/C4, C4/C5, C5/C6A, C6A/C6B), state the distinguishing criterion. Flag any boundary that is ambiguous or where root causes could plausibly live in either gate.

4. **Exhaustiveness check**: Can every volitional failure described in the document be mapped to exactly one gate? Flag any failure mode that falls between gates or outside the framework.

### Output format
```
Gate [X]: [Name]
- Sequential dependency: HOLDS / WEAK / FAILS — [reasoning]
- Boundary with [X-1]: CLEAR / AMBIGUOUS — [what's unclear]
- Boundary with [X+1]: CLEAR / AMBIGUOUS — [what's unclear]
- Root causes that fit: [list IDs]
- Root causes that DON'T fit: [list IDs + proposed destination]
- Missing root causes: [proposed additions]
```

---

## Agent 2: Root Cause Diagnostic Signal Analysis

**Goal:** For each root cause, evaluate whether its diagnostic signals are precise enough to detect and whether they map to KDENZ-detectable variables.

### Criteria

1. **Signal specificity**: Does the diagnostic signal uniquely identify THIS root cause, or could it indicate multiple root causes? Rate:
   - UNIQUE: Signal maps to one root cause only
   - SHARED: Signal appears across 2-3 root causes (needs disambiguation)
   - AMBIGUOUS: Signal could indicate many root causes (low diagnostic value)

2. **Signal observability in KDENZ**: Can this signal be detected through KDENZ's available channels?
   - APP_BEHAVIOR: Detectable from user actions (session starts, completions, quit points, drill selections, difficulty avoidance, time-to-action, feature usage patterns, streak data)
   - LANGUAGE: Detectable from user speech/text (transcript keywords, phrase patterns, hedging, self-referential statements)
   - VOICE_PROSODY: Detectable from vocal analysis via Hume API (pitch, pace, stress, confidence, energy, hesitation patterns)
   - DRILL_PERFORMANCE: Detectable from skill practice data (scores, accuracy trends, technique selection, mastery progression)
   - NOT_DETECTABLE: Requires clinical observation, self-report, or information KDENZ doesn't have access to

3. **Decision computation validity**: Does the IF/THEN formula accurately describe the failure pattern? Is it implementable as code?
   - IMPLEMENTABLE: Can be directly translated to a rule-based check
   - NEEDS_PROXY: The described variables aren't directly measurable; proxy signals needed
   - THEORETICAL_ONLY: Describes internal cognitive state that can't be externally measured

4. **Minimum detection confidence**: How many data points (sessions, days, events) before this root cause can be reliably diagnosed?

### Output format per root cause
```
[RC-ID]: [Name]
- Signal specificity: UNIQUE / SHARED / AMBIGUOUS
  - If SHARED: overlaps with [list RC-IDs]
  - Disambiguation strategy: [how to tell them apart]
- Observability: [APP_BEHAVIOR | LANGUAGE | VOICE_PROSODY | DRILL_PERFORMANCE | NOT_DETECTABLE]
  - Primary channel: [which is strongest]
  - Secondary channel: [backup detection]
  - Specific signals: [concrete KDENZ-observable events]
- Decision computation: IMPLEMENTABLE / NEEDS_PROXY / THEORETICAL_ONLY
  - If NEEDS_PROXY: [what proxy to use]
- Min detection window: [N sessions / N days / N events]
- KDENZ priority: HIGH / MEDIUM / LOW / SKIP
  - HIGH = detectable + high-impact + common
  - LOW = detectable but rare or low-impact
  - SKIP = not detectable in KDENZ context
```

---

## Agent 3: Linguistic Marker Extraction

**Goal:** Extract every language pattern, phrase, keyword, and speech pattern that indicates a specific root cause. Organize into a detection codebook.

### Criteria

1. **Explicit markers**: Direct phrases the user might say that indicate a root cause.
   - Example: "I'm just not good at this" → C1-2 (Fixed Mindset)
   - Example: "Nobody like me has done this" → C1-3 (No Relatable Models)
   - Extract ALL such phrases from the document, per root cause.

2. **Implicit markers**: Language patterns (not exact phrases) that suggest a root cause.
   - Hedging language (might, maybe, I guess) → possible C1 cluster
   - Future-dismissive language (it won't matter, what's the point) → possible C2 cluster
   - Cost-focused language (it's too hard, too much effort, not worth it) → C3 cluster
   - Vague planning language (I'll try, someday, when I get around to it) → C4 cluster
   - Excuse patterns (I would but..., if only...) → C5 cluster
   - Freeze language (I just can't start, I don't know why I don't) → C6A cluster
   - Abandonment language (I started but gave up, I lost interest) → C6B cluster

3. **Sentiment/tone markers**: Emotional quality of speech that maps to gates.
   - Resignation vs. frustration vs. avoidance vs. confusion vs. shame
   - Map each emotional tone to the gate(s) it most commonly indicates.

4. **Disambiguation phrases**: Language that distinguishes between similar root causes.
   - "I can't do it" (C1: belief) vs. "I don't want to" (C2: desire) vs. "It's not worth it" (C3: will)
   - "I don't know how" (C4: intention/plan) vs. "I know how but can't start" (C6A: initiation)

5. **Frequency and recency weighting**: Some phrases are diagnostic only when repeated. Flag:
   - ONE-TIME: A single instance is diagnostic
   - PATTERN: Needs 3+ instances across sessions to be meaningful
   - TREND: Needs to appear with increasing frequency to indicate a root cause

### Output format
```
Gate [X]: [Name]
  RC-[ID]: [Root Cause Name]
    Explicit markers:
      - "[exact phrase]" — confidence: HIGH/MEDIUM
      - "[exact phrase]" — confidence: HIGH/MEDIUM
    Implicit patterns:
      - [pattern description] — confidence: HIGH/MEDIUM/LOW
    Emotional tone: [tone] — maps to this RC when combined with [context]
    Disambiguation: vs [RC-ID] — key differentiator: [what to look for]
    Detection type: ONE-TIME / PATTERN / TREND
```

---

## Agent 4: KDENZ Integration Feasibility Map

**Goal:** For each root cause, determine how KDENZ can detect it, what data sources are needed, and what the implementation priority is.

### Criteria

1. **Detection channel mapping**: Which KDENZ systems can detect this root cause?
   - Web Speech API transcript → keyword/pattern matching
   - Hume batch API → prosody/emotion scores (stress, confidence, energy, hesitation)
   - App behavioral telemetry → session events, engagement patterns
   - Drill/simulation performance → scores, accuracy, technique usage
   - Gemini evaluation → LLM-based intent analysis of user speech
   - User onboarding responses → diagnostic questions (existing light diagnostics)

2. **Data availability timeline**: When can KDENZ detect this root cause?
   - IMMEDIATE: Detectable from first session (onboarding + first drill)
   - EARLY: Detectable after 3-5 sessions (behavioral pattern emerges)
   - ESTABLISHED: Detectable after 2+ weeks (requires longitudinal data)
   - NEVER: Not detectable through KDENZ's channels (requires clinical context)

3. **Implementation complexity**:
   - RULE_BASED: Simple IF/THEN on existing data (ship in v1)
   - PATTERN_MATCH: Requires aggregating events over time (moderate complexity)
   - LLM_REQUIRED: Needs Gemini analysis of transcripts/behavior (higher cost)
   - ML_REQUIRED: Needs trained model on behavioral data (post-launch)

4. **False positive risk**: How likely is a misdiagnosis?
   - LOW: Signal is strong and specific
   - MEDIUM: Signal is moderately specific, needs corroboration
   - HIGH: Signal is ambiguous, multiple interpretations possible
   - Mitigation strategy for MEDIUM/HIGH

5. **Integration with existing KDENZ features**:
   - Voice Practice: Which root causes surface during filler/pace sessions?
   - Skills Lab: Which root causes surface during drill attempts?
   - Simulation Studio: Which root causes surface during AI conversations?
   - Institute: Which root causes surface during educational content engagement?
   - Cross-pillar: Which root causes require data from multiple pillars?

### Output format per root cause
```
[RC-ID]: [Name]
- Detection channels: [list with primary/secondary]
- Data availability: IMMEDIATE / EARLY / ESTABLISHED / NEVER
- Implementation: RULE_BASED / PATTERN_MATCH / LLM_REQUIRED / ML_REQUIRED
- False positive risk: LOW / MEDIUM / HIGH — mitigation: [strategy]
- KDENZ pillar coverage: [which pillars can detect this]
- Build priority: P0 (launch) / P1 (month 1) / P2 (month 3) / P3 (post-data)
- Dependencies: [what must exist first]
```

---

## Agent 5: C1 Redefinition — Awareness/Attention Gate Design

**Goal:** Specifically handle the C1 gate change. Evaluate the document's content through the lens of the new Awareness/Attention gate.

### Criteria

1. **Define the new gate precisely**:
   - Core question: "Is the person aware of the problem/goal AND can they attend to it?"
   - What does failure at this gate look like? (Person is unaware of unconscious patterns, cannot sustain attention on the goal, information hasn't entered conscious processing)
   - How does this differ from C0 (pre-volitional physical/environmental blocks)?
   - How does this differ from C2 (they're aware but don't desire it)?

2. **Root cause migration from old C1**:
   For each of the 8 current Believability root causes:
   - C1-1 Cognitive Biases: STAYS / MOVES / DROPS — [reasoning]
   - C1-2 Fixed Mindset: STAYS / MOVES / DROPS — [reasoning]
   - C1-3 No Relatable Models: STAYS / MOVES / DROPS — [reasoning]
   - C1-4 Meta-Cognitive Doubt: STAYS / MOVES / DROPS — [reasoning]
   - C1-5 Insufficient Evidence: STAYS / MOVES / DROPS — [reasoning]
   - C1-6 Fragile Confidence: STAYS / MOVES / DROPS — [reasoning]
   - C1-7 Social Disconfirmation: STAYS / MOVES / DROPS — [reasoning]
   - C1-8 Impostor Attribution: STAYS / MOVES / DROPS — [reasoning]

3. **Proposed new Awareness/Attention root causes**:
   - Unconscious incompetence (doesn't know they have a problem)
   - Attention fragmentation (aware but can't sustain focus on it)
   - Selective inattention (avoids noticing the problem)
   - Information overload (awareness buried under competing stimuli)
   - Normalization bias (knows the pattern but doesn't see it as a problem)
   - [Others identified from document]

4. **KDENZ-specific Awareness/Attention signals**:
   - The "holy shit moment" (user becomes aware of filler pattern for first time) — this IS C1 gate activation
   - Playback engagement (does the user listen to their recordings? Awareness requires self-observation)
   - Transcript review time (does the user read highlighted fillers? Attention to evidence)
   - Diagnostic question responses (onboarding self-assessment accuracy vs. actual performance)

5. **Where does Believability go?**:
   - If Believability is no longer a gate, its root causes need a home
   - Proposal: Believability root causes merge into C2 (Desire) or C3 (Will), or become a sub-dimension of the new C1 (awareness of capability, not just awareness of problem)

### Output format
```
NEW C1: Awareness/Attention
- Core question: [refined]
- Boundary with C0: [clear distinction]
- Boundary with C2: [clear distinction]
- Root causes KEPT from old C1: [list with reframing]
- Root causes MOVED from old C1: [list with destination + reasoning]
- Root causes ADDED: [list with definitions]
- Believability disposition: [where it went]
- KDENZ detection strategy: [primary signals]
```

---

## Parallelization Plan

When document arrives, spawn these 5 agents simultaneously:

| Agent | Type | Focus | Inputs |
|-------|------|-------|--------|
| 1 | analysis-agent | Gate architecture validation | Full document + framework primer + gate definitions |
| 2 | analysis-agent | Root cause signal analysis | Full document + knowledge base root causes + KDENZ capabilities |
| 3 | analysis-agent | Linguistic marker extraction | Full document + existing diagnostic signals + vocal signatures |
| 4 | analysis-agent | KDENZ integration feasibility | Full document + KDENZ tech stack + R1-R16 research |
| 5 | analysis-agent | C1 Awareness/Attention redesign | Full document + current C1 root causes + KDENZ "holy shit moment" concept |

All agents write results to `.planning/research/VCM_EVAL_AGENT_[N].md`.
Lead (me) synthesizes into final `VCM_KDENZ_INTEGRATION_MAP.md`.
