# R4: Gemini 2.5 Flash — Simulation Implementation Notes

**Date filed:** 2026-02-13
**Source:** User-provided distilled research (Perplexity + Gemini docs + academic papers)
**Status:** COMPLETE

---

## Model Selection

- **Model:** `gemini-2.5-flash`
- **Endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Context:** ~1M tokens
- **Output cap:** ~65k tokens

## Pricing (per 1M tokens)

| Type | Cost |
|------|------|
| Input text/image/video | $0.30 |
| Input audio | $1.00 |
| Output | $2.50 |

### Cost per 15-minute simulation session

Assumptions: 25 turns, 50 tokens/user turn, 100 tokens/AI turn, ~650 input tokens/turn (system + history + user)

| Component | Tokens | Cost |
|-----------|--------|------|
| Input | ~16,250 | ~$0.005 |
| Output | ~2,500 | ~$0.006 |
| **Session total** | ~18,750 | **~$0.01-0.02** |

TTS adds small additional cost. This is extremely cheap — supports freemium model easily.

---

## Stable Character Simulation

### System prompt strategy

Send one persistent system message every turn containing:
- Role identity
- Personality traits
- Behavioral constraints
- Scenario goals
- Difficulty escalation rules
- Consistency rules

### State object (pass each turn)

```json
{
  "mood": "...",
  "concessions": "...",
  "constraints": "...",
  "last_tactic": "..."
}
```

### Multiple character types

- Use a prompt library (one system prompt template per character archetype)
- Inject control dials (assertiveness, reactivity 1-5)

---

## Voice Pipeline

### Standard flow (recommended for KDENZ)

1. Voice input → ASR (Web Speech API, Chrome) → text
2. Text → Gemini → response text
3. Response text → TTS → audio playback

### Latency targets

| Component | Target |
|-----------|--------|
| ASR | 200-600 ms |
| Model response | 300-800 ms median |
| TTS | 200-500 ms |
| **End-to-end** | **~1.2-1.8s typical, ~3s tail** |

### Latency controls

- Cap outputs to 80-120 tokens
- Stream ASR + LLM + TTS in parallel
- Regional deployment

---

## Conversation Technique Evaluation

### Techniques to detect in user speech

- Labeling
- Mirroring
- Accusation audit
- Calibrated questions
- Tactical empathy

### Prompt structure

Define each technique with:
- Positive criteria
- Negative criteria
- Required evidence span

### Structured JSON output

```json
{
  "turn_id": 17,
  "techniques": [
    {
      "name": "labeling",
      "confidence": 0.88,
      "evidence_span": "...",
      "reason": "..."
    }
  ]
}
```

Settings:
- Temperature: 0.0-0.2
- JSON-only output mode

Guardrails:
- Only label if explicit evidence exists
- Return empty list if none detected

---

## Per-Turn vs Session-End Evaluation

| Approach | Context | Purpose | When |
|----------|---------|---------|------|
| Per-turn | Small window | Precision-focused, real-time feedback | During simulation |
| Session-end | Full transcript | Aggregated scoring, pattern analysis | Post-session |

**KDENZ implication:** Use per-turn during simulation (lightweight, ≥0.7 confidence threshold for UI display), full session-end for scorecard and technique breakdown.

---

## Reducing False Positives

### Rule-based post-filters

| Technique | Filter Rule |
|-----------|------------|
| Mirroring | Drop if >4 words |
| Labeling | Drop if no "you seem/feel/sounds like" pattern |
| All | Ignore <0.7 confidence in real-time UI |

### Hybrid approach (rules + LLM)

**Rules handle:**
- Literal mirroring
- Template labeling stems
- Question type classification

**LLM handles:**
- Tactical empathy (intent/paraphrase)
- Accusation audits (coverage assessment)
- Non-template phrasing

Rules = very high precision, low recall. LLM = captures intent but risks over-labeling. Hybrid gives best balance.

---

## Few-Shot Usage

- Include 3-5 contrast pairs (clear positive + near-miss negative)
- Keep same format as real turns
- Short examples only

---

## Streaming vs Full Responses

| Mode | Use For |
|------|---------|
| Streaming | Simulation conversation (faster perceived response, interruptible, conversational feel) |
| Full | Post-session analysis, written feedback |

### TTS with streaming

- Sentence-buffer playback (play each sentence as it completes)
- Or wait for full short reply (<150 tokens)

---

## Sources

- Gemini model docs: https://ai.google.dev/gemini-api/docs/models/gemini
- Text generation + JSON: https://ai.google.dev/gemini-api/docs/text-generation
- Harvard PON (tactical empathy): https://www.pon.harvard.edu/daily/negotiation-skills-daily/tactical-empathy/
- HBR (listening + negotiation): https://hbr.org/2019/11/4-ways-to-improve-your-listening-in-negotiations
- LLM-as-judge: https://arxiv.org/abs/2408.02666, https://arxiv.org/abs/2306.05685

---

## KDENZ Platform Implications

1. **Cost is negligible.** $0.01-0.02/session means even 100 sessions/day = ~$1-2/day. Freemium viable with no API cost concern.
2. **Hybrid eval is the right architecture.** Rules for mirroring/labeling stems (already partially built in `labelAnalyzer.ts`), LLM for tactical empathy/accusation audit quality. Matches existing codebase approach.
3. **Per-turn + session-end dual evaluation.** Per-turn gives real-time feedback during simulation, session-end gives comprehensive scorecard. Both feed VCM diagnostic engine.
4. **State object pattern.** The `mood/concessions/constraints/last_tactic` object is how we make AI opponents consistent. This maps to the `AffectLevel` system already in labeling/audit modules.
5. **Latency is manageable.** 1.2-1.8s end-to-end is conversational. Text-only simulation (Phase C Week 1) avoids TTS latency entirely.
6. **Prompt library = scenario library.** Each simulation scenario needs a system prompt template + control dials. Maps to existing `scenarios.ts` pattern.
