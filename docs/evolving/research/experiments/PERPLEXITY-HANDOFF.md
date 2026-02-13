# Perplexity Handoff: Copy-Lint Audit Step 3

**Context:** You were doing a copy-lint audit with Perplexity. Steps 1-2 completed (design system review, competitor analysis). Step 3 requires running tests on audio code/datasets.

---

## What Perplexity Was Doing

A multi-step audit to validate:
1. **Step 1:** Design system compliance (colors, tokens) — DONE
2. **Step 2:** Competitor analysis (Yoodli, Orai, etc.) — DONE
3. **Step 3:** Technical accuracy benchmarks — BLOCKED (needs your audio/code)

---

## What to Ask Perplexity Next

When you resume, provide:

### 1. FillerDetector Code

The acoustic filler detection logic lives at:
- `src/core/audio/FillerDetector.ts` (from Black Swan, path may vary)

Ask Perplexity:
> "Here's our FillerDetector code. Can you help design a Python simulation to estimate F1 scores against labeled filler datasets like Switchboard? What's the expected F1 range for acoustic-only vs hybrid detection?"

### 2. Audio Corpus Options

Ask:
> "What free audio corpora have filler word annotations? I need ground truth for um/uh/like to test our detector. Options I've heard: Switchboard, Santa Barbara Corpus, CORAAL. Which is easiest to access and has the best filler coverage?"

### 3. WER Testing Approach

Ask:
> "How do I benchmark Chrome Web Speech API's WER? I want to test with Mozilla Common Voice clips. Is there a standard script or tool that compares ASR output to ground truth and calculates WER?"

### 4. Error Propagation Model

Ask:
> "If my ASR has 10% WER, how does that propagate to filler count errors? Is there research on ASR error → downstream metric error? I want to show users honest confidence intervals."

---

## Files to Share with Perplexity

| What | Where | Why |
|------|-------|-----|
| FillerDetector.ts | Black Swan codebase | Core detection logic |
| Sample audio clips | Record yourself 60s | Real-world test case |
| Current thresholds | Check FillerDetector config | What we're tuning |

---

## Expected Outputs from Perplexity

1. **Python test harness** for F1 scoring (or pseudocode)
2. **Corpus recommendations** with access links
3. **WER calculation script** or tool recommendation
4. **Error propagation estimates** (e.g., "10% WER ≈ 15% filler error")
5. **SNR threshold recommendation** for audio quality warnings

---

## Where Results Go

After running experiments, update:
- `docs/evolving/research/experiments/EXPERIMENTS.md` — move from Backlog to Completed
- Create `EXP-XXX-results.md` for detailed findings
- Update any affected foundation docs if thresholds change

---

## Quick Summary for Perplexity

> "I'm building a voice practice app that detects filler words (um, uh, like). I use Chrome Web Speech API for transcription + acoustic analysis for real-time detection. I need to validate accuracy before making claims. Can you help me design tests for: (1) ASR WER across accents/noise, (2) Filler detection F1 vs labeled corpus, (3) Minimum session length for stable metrics, (4) Error propagation from ASR to filler counts, (5) SNR thresholds for audio quality warnings?"
