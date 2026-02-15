# Validation Standards & Study Design

- **Tier:** Evolving
- **Status:** OPEN
- **Version:** v1
- **Source:** Validation Methodologies, Bias Risks & Claim-Safe Practices for Non-Clinical Voice Analysis - Google Docs.pdf (Sections 1, 5, 7)
- **Summary:** Accuracy benchmarks per metric, pre-deployment validation checklists, and a 4-phase validation study protocol. Note: Claim-framing content from the same source is in foundation/copy/ files.

---

## 1. Acceptable Validation Requirements

For behavioral feedback tools (non-diagnostic), validation requires:

1. **Ground truth definition:** Explicit, objective labeling of what you're measuring
2. **Inter-rater reliability (IRR):** Cohen's Kappa >= 0.60 minimum; >= 0.81 excellent
3. **Dataset size:** Minimum 10,000 words (~1 hour) per demographic group/condition
4. **Metric selection:** F1 score preferred; report accuracy per demographic group
5. **Confidence intervals:** Report uncertainty bounds (e.g., "+-3 WPM"), never point estimates
6. **Multiple metrics:** Use WER + WIL + semantic precision, not WER alone

## 2. Metric-Specific Validation Standards

### Speech-to-Text (ASR) Transcription

| Metric | Standard | Deployment Threshold |
|--------|----------|---------------------|
| Word Error Rate (WER) | <5% benchmark; 5-15% real-world | <10% WER for coaching |
| Character Error Rate (CER) | 60-80% of WER | Secondary metric for names/terms |
| Per-demographic WER | No >5pp gap between groups | All groups within 3pp of aggregate |

### Filler Word Detection

| Metric | Benchmark | Standard |
|--------|-----------|----------|
| F1 Score | 71-78% on podcast corpora | F1 >= 0.65 acceptable for behavioral feedback |
| Precision | 70-85% | >= 70% required (false positives damage UX) |
| Recall | 65-75% | >= 60% acceptable for post-session |
| Per-filler accuracy | Varies by type | Report separately for each filler type |

### Pause Detection & Speech Rate

| Metric | Standard | Deployment Ready? |
|--------|----------|------------------|
| VAD precision/recall | 92% clean; 70-80% noise | Yes -- simple frame counting |
| Speech rate accuracy | High (syllables/sec counting) | Yes -- robust and simple |
| Pause classification | 70-80% research-grade | No -- post-session only; clinical validation lacking |

### Pitch & Prosody

| Metric | Standard | Deployment Ready? |
|--------|----------|------------------|
| Pitch detection (Hz) | +-5% sustained; +-10-15% speech | Relative metrics OK (trends); absolute risky |
| Pitch range (semitones) | No normative benchmark | Personal baselining required; avoid cross-speaker |
| Pitch jitter | No coaching-specific standard | Research-only; insufficient validation |
| Rhythm/dysrhythmia | Clinical only (dementia/Parkinson's) | Do not deploy |

### Emotion/Tone/Confidence

| Metric | Standard | Deployment Ready? |
|--------|----------|------------------|
| Emotion classification | 45-65% accuracy | Do NOT deploy -- severe bias, bidirectional confound |

## 3. Summary: What to Validate Before Deployment

| Metric | Ground Truth | Min IRR | Min Accuracy | Per-Group Gap | Confidence Interval | Real-World Testing | User Study |
|--------|-------------|---------|-------------|--------------|--------------------|--------------------|-----------|
| Speech rate | Syllables/sec from VAD+transcript | 0.85 | 95 (+-5 WPM) | <= 3pp | +-3 WPM | Required | Required |
| Pause detection | Silence >200ms (VAD) | 0.80 | 92 clean; 70 noise | <= 3pp | +-5% | Required | Required |
| Filler detection | Manual annotation in transcript | 0.65+ | 65 (conservative) | <= 5pp | +-8% | Required | Required |
| Pitch range | F0 autocorrelation; semitones | 0.70 | +-10% Hz | <= 5pp | +-1 semitone | Required | Required + baseline |
| Prosody features | N/A | N/A | Not ready | N/A | Research | Do not deploy | Research-only |
| Emotion/confidence | Manual annotation (subjective) | 0.40-0.50 (poor) | 45-65% | >= 10pp (high!) | +-20% | Do not deploy | Do not deploy |

## 4. Pre-Deployment Validation Checklist

### Data & Validation
- [ ] Ground truth defined explicitly for each metric
- [ ] IRR tested: >= 2 raters, >= 500-word subset, Kappa >= 0.60
- [ ] Dataset: >= 10,000 words training; >= 2,000 words test per demographic
- [ ] Per-group accuracy calculated: native/non-native, men/women, age 18-35/35+
- [ ] Accuracy gaps <= 3 percentage points (document and disclose if larger)
- [ ] Real-world audio tested (coaching/training audio, not just clean read speech)
- [ ] Confidence intervals calculated for each metric
- [ ] Failure modes documented (conditions where system fails)

### Bias & Fairness
- [ ] Non-native speaker testing: >= 20% of test set; accuracy gap reported
- [ ] Gender testing: >= 40% women, >= 40% men; separate accuracies
- [ ] Age testing: 18-30, 30-50, 50+ age bands
- [ ] Neurodiversity consideration: disclose not tested; offer opt-out
- [ ] Pitch/prosody bias: verify no gender bias in interpretation
- [ ] Cascading error assessment: ASR -> downstream analysis

### Claims & Marketing
- [ ] All claims substantiated by validation data
- [ ] No psychological attribution ("detects anxiety", "measures confidence")
- [ ] Hedging language reviewed ("may", "suggests" not "proves", "demonstrates")
- [ ] Limitations disclosed (accuracy ranges, CIs, per-group, failure modes)
- [ ] Therapeutic claims avoided ("treat", "cure", "diagnose", "manage")

### Regulatory & Ethical
- [ ] Consent form drafted (what's analyzed, what's not, data storage, opt-out)
- [ ] Privacy policy updated (retention, deletion, third-party sharing, encryption)
- [ ] Opt-out feature built (disable analysis without losing other features)
- [ ] Human review process for disputed feedback
- [ ] User feedback mechanism for reporting harm
- [ ] EU AI Act compliance reviewed (if EU customers)
- [ ] FTC substantiation file prepared

## 5. Recommended Validation Study Protocol

### Phase 1: Internal Validation (Before Beta)
- 50-100 coaching sessions across >= 10 speakers
- Human raters independently annotate 20% (double-blind)
- Calculate IRR (Kappa) per metric
- Segment by demographics; threshold: Kappa >= 0.60, <= 3pp accuracy gap

### Phase 2: User Research (Concurrent with Beta)
- 10-20 moderated sessions: users interact with product, researchers observe + interview
- Measure: (1) Usability, (2) Helpfulness, (3) Unintended consequences
- Ask explicitly: "Did any of these metrics make you more or less anxious?"

### Phase 3: Extended Validation (Post-Beta)
- Minimum 500 users across >= 6 months
- Track per-demographic accuracy on real data
- Monitor equity: are women/non-native speakers getting lower accuracy without knowing?

### Phase 4: Independent Auditing (Ideal)
- Commission external audit (university or independent lab)
- Publish results (even unfavorable)
- Invite peer review on methodology

## Related Files

- [bias-risks-and-mitigation-v1.md](bias-risks-and-mitigation-v1.md) -- demographic bias evidence and mitigation strategies
- `foundation/product/core-principles-v1.md` -- show uncertainty, measure bias principles
- `foundation/copy/claim-taxonomy-safe-risky-forbidden-v1.md` -- claim classification system
- `evolving/product/policy-and-governance-plan-v1.md` -- regulatory compliance plan
