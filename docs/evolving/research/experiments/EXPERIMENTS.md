# Experiments Backlog

**Location:** `docs/evolving/research/experiments/`
**Purpose:** Planned experiments to validate technical assumptions before shipping

---

## Active Experiments

*None currently running*

---

## Backlog

### EXP-001: ASR Accuracy Benchmarks (Chrome Web Speech API)

**Status:** PLANNED
**Priority:** High — blocks confidence in filler detection accuracy claims
**Origin:** Perplexity copy-lint audit Step 3

**Question:** What is our actual Word Error Rate (WER) across accent/noise conditions?

**Why it matters:**
- We claim filler detection works; if ASR misses words, filler counts are wrong
- Industry data shows Chrome Web Speech API: 5-10% WER clean, 15-30% adverse conditions
- Need to set honest thresholds for when to warn users about degraded accuracy

**Test Plan:**
1. **Corpus:** Mozilla Common Voice (free, multi-accent, some noise)
2. **Conditions to test:**
   - Clean audio, native English
   - Clean audio, non-native accents (Indian, Chinese, Spanish, etc.)
   - Background noise (office, cafe, outdoor)
   - Low-quality mic simulation
3. **Metric:** WER (Word Error Rate)
4. **Threshold:** <10% WER for "reliable" badge; warn user if >15%

**How to run:**
1. Get Common Voice clips (https://commonvoice.mozilla.org/)
2. Run through Chrome Web Speech API (use our existing AudioEngine)
3. Compare transcript to ground truth
4. Calculate WER per condition

**Output:** Table of WER by condition; recommendation for audio quality warnings

---

### EXP-002: Filler Detection F1 Score

**Status:** PLANNED
**Priority:** High — core product accuracy claim
**Origin:** Perplexity copy-lint audit Step 3

**Question:** What is our filler detection precision/recall across detection methods?

**Why it matters:**
- Acoustic detection (um/uh sounds): typically 75-85% F1
- ASR-based detection (transcript words): typically 90-95% F1
- Our hybrid approach should get best of both; need to verify

**Test Plan:**
1. **Corpus:** Switchboard corpus (has filler annotations) OR manually label 50+ clips
2. **Methods to compare:**
   - Acoustic only (FillerDetector pitch/energy patterns)
   - ASR only (transcript word matching)
   - Hybrid (acoustic + end-of-session reconciliation)
3. **Metrics:** Precision, Recall, F1 per filler type (um, uh, like, you know)
4. **Threshold:** F1 >= 0.65 minimum; target 0.85+

**How to run:**
1. Collect/label audio clips with ground-truth filler timestamps
2. Run through each detection method
3. Score true positives, false positives, false negatives
4. Calculate P/R/F1

**Output:** F1 scores by method and filler type; recommendation for which method to trust

---

### EXP-003: Session Duration Stability

**Status:** PLANNED
**Priority:** Medium — informs minimum session length UX
**Origin:** Perplexity copy-lint audit Step 3

**Question:** At what session length do WPM and filler rates stabilize?

**Why it matters:**
- Current minimum is 30 seconds
- Perplexity suggests 60+ seconds needed for <5% variance
- Affects UX: do we force longer sessions or show "low confidence" warnings?

**Test Plan:**
1. **Corpus:** Synthetic or real recordings of 90+ seconds
2. **Method:** Calculate rolling WPM and fillers/min at 30s, 45s, 60s, 75s, 90s
3. **Metric:** Coefficient of variation (CV) — want <5%
4. **Test:** Does adding more time reduce variance?

**How to run:**
1. Take 10+ recordings of 90+ seconds each
2. Slice each at 30s, 45s, 60s, 75s, 90s
3. Calculate WPM and fillers/min for each slice
4. Compare variance across slice lengths

**Output:** Recommended minimum session length; variance chart

---

### EXP-004: ASR Error Propagation

**Status:** PLANNED
**Priority:** High — critical for honest accuracy claims
**Origin:** Perplexity copy-lint audit Step 3

**Question:** How do ASR errors cascade into filler/pace measurement errors?

**Why it matters:**
- If ASR drops a word, WPM is wrong
- If ASR hallucinates "um" or misses it, filler count is wrong
- Need to quantify: "10% WER = X% filler error"

**Test Plan:**
1. **Method:** Take ground-truth transcripts, artificially inject WER
2. **Injection types:**
   - Random word deletion (simulates missed words)
   - Random word insertion (simulates hallucination)
   - Filler-specific errors (um→on, like→lack)
3. **Measure:** Delta in WPM and filler count vs ground truth

**How to run:**
1. Script to corrupt transcripts at 5%, 10%, 15%, 20% WER
2. Run filler detection on corrupted vs clean
3. Plot error propagation curve

**Output:** Error propagation chart; threshold for "unreliable" warning

---

### EXP-005: Noise Degradation Curves

**Status:** PLANNED
**Priority:** Medium — informs audio quality warnings
**Origin:** Perplexity copy-lint audit Step 3

**Question:** At what SNR (signal-to-noise ratio) does detection break down?

**Why it matters:**
- VAD (voice activity detection) fails in noise
- Filler detection degrades
- Need to warn users: "Your environment is too noisy"

**Test Plan:**
1. **Corpus:** Clean recordings + synthetic noise injection
2. **Noise types:** White noise, office ambience, cafe, outdoor
3. **SNR levels:** 30dB, 20dB, 15dB, 10dB, 5dB
4. **Metrics:** VAD accuracy, filler F1, WER

**How to run:**
1. Mix clean audio with noise at various SNR levels
2. Run full pipeline (VAD → ASR → filler detection)
3. Plot accuracy vs SNR

**Output:** SNR threshold for warning (likely ~15dB); degradation curves

---

## Completed Experiments

*None yet*

---

## How to Add an Experiment

1. Create entry in Backlog section above
2. Assign EXP-XXX number
3. When running, move to Active section
4. When done, move to Completed with results summary
5. Optionally create detailed results file: `experiments/EXP-XXX-results.md`

---

## Reference Data (Industry Benchmarks)

| Metric | Industry Range | Our Target | Source |
|--------|----------------|------------|--------|
| WER (clean) | 5-15% | <10% | Google/Mozilla benchmarks |
| WER (accented) | 15-30% | <20% | Common Voice studies |
| Filler F1 (acoustic) | 75-85% | >=0.75 | Speech disfluency research |
| Filler F1 (ASR) | 90-95% | >=0.90 | Transcript-based detection |
| Filler F1 (hybrid) | 85-95% | >=0.85 | Our target |
| Session stability | 60s+ | <5% CV | Perplexity analysis |
| SNR warning | <15dB | Warn user | Audio quality research |

---

## Perplexity Audit Summary (2026-02-04)

**Source:** Copy-lint audit conversation with Perplexity

### Audit Status: COMPLETE

| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 1 | Design system compliance | DONE | Colors aligned; #39FF14→#00C851 fixed; minor Privacy.tsx copy flag |
| 2 | Competitor analysis | DONE | Yoodli/Orai use psych terms we ban; our "measures, doesn't judge" positioning is differentiated |
| 3 | Technical benchmarks | PLANNED | Chrome WER viable clean; experiments designed above |

### Perplexity Conclusion

> "All prior steps complete: Audits clean (minor Privacy copy fix), competitors gapped, benchmarks planned (Chrome WER viable clean)."

### High-Leverage Changes Recommended

These changes align with research findings and foundation principles:

| Change | Description | Status | Phase |
|--------|-------------|--------|-------|
| **Baseline/Delta Display** | Store baseline metrics; show deltas (e.g., "Your pace: 140wpm vs baseline 120wpm") | COMPLETE | Phase 03-04 |
| **Self-Assessment Prompt** | Pre-reveal prompt ("What % fillers did you guess?") → reveal gap for "holy shit moment" | NOT STARTED | Consider for Phase 04+ |
| **Design Tokens** | Add extended palette to tailwind.config.js (`clinical-signal-green: #00C851`) | COMPLETE | Quick fix |

### Perplexity's Final Assessment

> "Research gaps filled—product ready for beta per PRD."

### Open Questions for Future Perplexity Sessions

1. How to design the self-assessment prompt UX without adding friction?
2. What's the optimal reveal timing for maximum "holy shit" impact?
3. Should we show confidence intervals on metrics given ASR uncertainty?

---

## Perplexity Handoff Context

If resuming this conversation with Perplexity, share:

1. **FillerDetector code** — for F1 testing approach
2. **Sample audio clips** — for real-world testing
3. **Threshold configs** — current detection settings

See `PERPLEXITY-HANDOFF.md` for full resumption instructions.
