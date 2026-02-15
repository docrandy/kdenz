# Bias Risks & Mitigation Strategies

- **Tier:** Evolving
- **Status:** OPEN
- **Version:** v1
- **Source:** Validation Methodologies, Bias Risks & Claim-Safe Practices for Non-Clinical Voice Analysis - Google Docs.pdf (Section 2)
- **Summary:** Documented accuracy degradation across demographics (non-native speakers, gender, age, neurodivergent). Bias risk table with severity ratings and mitigation strategies. Personal baselining as the gold standard for bias mitigation.

---

## 1. Non-Native English Speakers

Accuracy drop: ~15-40 percentage points across speech recognition, prosody perception, and emotion classification.

| System | Native English | Non-Native | Gap |
|--------|--------------|------------|-----|
| Modern ASR (Deepgram, AssemblyAI) | 90-95% WER | 75-85% WER | 10-20pp |
| Older ASR systems | 85% | 50-70% | 15-35pp |
| Filler word detection | 71-78% F1 | ~55-65% F1 | 10-15pp |
| Emotion/tone classification | 70-85% accuracy | 45-60% accuracy | 20-30pp |
| Prosody interpretation | Baseline | Significantly worse (accent confound) | Unknown |

**Why:** Non-native speakers have different prosody, rhythm, vowel formants, and accent markers. Models trained on native English data overfit to native patterns.

**Critical insight:** Non-native speakers learning professional communication have the LEAST tolerance for inaccuracy yet receive the MOST error.

## 2. Gender Bias in Pitch & Confidence Scoring

Pitch-based confidence scoring shows dramatic gender bias:

| Metric | Male Baseline | Female Baseline | Bias Direction |
|--------|--------------|----------------|----------------|
| Absolute pitch (Hz) | ~120 Hz | ~210 Hz | Females naturally higher -> misclassified as "anxious" |
| Pitch range (semitones) | ~6-8 | ~8-10 | Female variability > male -> "emotionally volatile" |
| Speech rate as confidence | Slower = thoughtful | Slower = uncertain/hesitant | Gender-specific interpretation of identical behavior |

**Risk:** If you build "confidence scoring" on pitch + rate, female coaches will systematically score lower than males despite identical communication skill. This is a discrimination risk.

## 3. Age-Related Accuracy Degradation

Older non-native speakers show 3x faster age-related decline:

| Age Group | Native Speakers | Non-Native Speakers | Gap |
|-----------|----------------|--------------------|----|
| 20-30 | 92% accuracy | 78% accuracy | -14pp |
| 40-50 | 90% accuracy | 72% accuracy | -18pp (worsening) |
| 55-65 | 87% accuracy | 62% accuracy | -25pp (widening) |

**Implication:** An ASR-dependent coaching tool will become less useful for older non-native coachees over time -- not because they're not improving, but because the system is failing them more.

## 4. Neurodivergent Speech Patterns

Published evidence (limited but critical):

- **Autistic speakers:** Different prosody, atypical pause patterns, variable speech rate -- all flagged as "abnormal" by models trained on neurotypical speech
- **ADHD speakers:** Rapid rate, frequent self-corrections, tangential structure -- may be mislabeled as low-confidence
- **Stuttering:** High pause and filler rates by definition; systems flag this as "needs improvement"

No published benchmarks for neurodivergent speech in coaching contexts.

## 5. Bias Risk Table with Mitigations

| Risk | Affected Groups | Evidence | Severity | Mitigation Strategy | Implementation |
|------|----------------|----------|----------|--------------------|----|
| Non-native accent misrecognition | Non-native English speakers | 10-40pp WER gap | HIGH | Use accent-robust ASR; test on non-native subset | Deepgram custom models; AssemblyAI with non-native training data |
| Pitch-based confidence scoring | Women, high-pitch speakers | Females naturally 90 Hz higher | HIGH | Avoid absolute pitch thresholds; use personal baseline only | Speaker-specific pitch floor/ceiling (first 5 min = baseline) |
| Prosody interpretation bias | Diverse speakers, women, non-native speakers | 20-30pp accuracy drop on emotion/tone | CRITICAL | DO NOT use absolute prosody for behavioral attribution | "Your pitch range was 6 semitones" (OK) vs "You sounded uncertain" (NOT OK) |
| Age-related accuracy decline | Older non-native speakers | 3x faster decline | MEDIUM | Adaptive thresholds; acknowledge confidence inversely correlates with age | Show confidence bands: "Accuracy +-5% for your age/accent profile" |
| Neurodivergent speech patterns | Autistic, ADHD, stuttering speakers | Limited evidence; no benchmarks | HIGH | Do NOT deploy neurodivergence-sensitive metrics without co-design | Require explicit opt-out for neurodiversity-aware analysis; co-design with neurodiverse users |
| VAD failure in noise | Noisy environments (home, office) | 70-80% accuracy drops to <50% in moderate noise | MEDIUM | Use noise-robust VAD (Silero); inform users of audio quality | Warn: "Background noise detected; pause metrics may be inaccurate" |
| Cascading errors: ASR -> downstream | All groups; worst for vulnerable groups | Errors in transcription -> errors in filler/prosody | CRITICAL | Validate each step independently; track error propagation | Always show transcript confidence FIRST before analyzing fillers/prosody |

## 6. Personal Baselining: The Gold Standard

**Concept:** Compare each user's metrics to their own baseline, not population averages.

**Why it works:** Eliminates bias from comparing users to training data demographics.

**Implementation:**
```
Session 1: Establish baseline
- Speech rate: 145 WPM (user's natural pace)
- Pitch range: 5 semitones (user's comfort zone)
- Filler rate: 4% (user's baseline rate)
- Pause frequency: 8 pauses/minute

Session 2+: Report change FROM BASELINE
- "Your speech rate was 5 WPM faster than usual" (descriptive, individual)
- NOT: "You were speaking at 150 WPM (confident) vs 120 WPM (anxious)" (prescriptive)
```

**Critical requirement:** Baseline must be established in low-stakes context (first 10 minutes, neutral topic) before coaching begins.

**Key limitation:** No speaker-independent normative data exists. ALL prosody metrics require personal baseline for interpretation.

## Related Files

- [validation-standards-and-study-design-v1.md](validation-standards-and-study-design-v1.md) -- accuracy benchmarks and validation protocol
- `foundation/product/core-principles-v1.md` -- "measure bias" and "baseline-anchored" principles
- `foundation/copy/claim-taxonomy-safe-risky-forbidden-v1.md` -- what you can and cannot claim
