# Feature Scope and Engineering Plan

- **Tier:** Evolving
- **Status:** OPEN
- **Version:** v1
- **Source:** Claim-Safe Copy Library and SaaS Action Plan (original docx)
- **Summary:** Product scope decisions, engineering architecture, validation workflow, and immediate next steps. Subject to change as development progresses.

---

## Product Scope Decisions

- **Ship first:** Pace, pauses (descriptive), filler counts, transcript confidence, baseline trends.
- **Defer / caution:** Pitch/prosody interpretation (only baseline-relative).
- **Do not ship:** Emotion/confidence inference for non-clinical coaching (unless experimental + opt-in + heavy caveats).

---

## Baseline-First UX

- Session 1: Baseline capture in low-stakes context (neutral topic, quiet environment).
- Session 2+: Default view shows "difference vs. baseline" + uncertainty band.
- Always include a reflection prompt ("What do you think was happening?") to prevent over-interpretation.

---

## Engineering Architecture

- **Metric Engine:** Produces raw measurements (WPM, counts, seconds, semitones).
- **Confidence Engine:** Outputs per-metric reliability estimates based on audio quality + ASR confidence.
- **Baseline Store:** Stores user baseline distributions (not just single values) and computes deltas + trend lines.
- **Copy Layer:** Renders templates using {tokens} and enforces claim rules (no forbidden language).
- **Audit/Telemetry:** Logs metric outputs + confidence + demographic slices (where consented) to monitor bias gaps.

---

## Validation Workflow (Gates Before Release)

1. Write ground-truth definitions for each metric (what exactly is measured).
2. Collect labeled data; run inter-rater reliability (Kappa) checks; do not launch metrics with Kappa < 0.60.
3. Test on real coaching audio (not just clean read speech).
4. Report per-demographic accuracy (native vs non-native, gender, age bands, etc.) and ensure gaps are within fairness threshold.
5. Compute and display confidence intervals / margins of error for user-facing metrics.
6. Document failure modes (noise, overlap, accents) and surface them in-product via warnings.
7. Run user research to check that feedback is understandable and not anxiety-inducing; add a harm-reporting pathway.

---

## Concrete Next Steps

1. Pick v1 feature set (recommended: pace + pauses + fillers + transcript confidence + baseline trends).
2. Implement baseline onboarding and default to "delta vs. baseline."
3. Wire in confidence/uncertainty and audio-quality warnings.
4. Create a copy-lint rule set (block words like 'anxious,' 'confidence score,' 'diagnose' in user-facing copy).
5. Stand up a validation pipeline with IRR + per-group reporting and a go/no-go release gate.
