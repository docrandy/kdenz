# Claim Taxonomy: Safe / Risky / Forbidden

- **Tier:** Foundation
- **Status:** LOCKED
- **Version:** v1
- **Source:** Claim-Safe Copy Library and SaaS Action Plan (original docx)
- **Summary:** Three-tier classification of what the app can say, what requires proof, and what is never allowed.

---

## SAFE (Descriptive / Observable)

These are always allowed. They report measurements, not interpretations.

- "You spoke at {wpm} words/minute in this segment (your typical pace: {baseline_wpm})."
- "You paused {pause_count} times in {minutes} minutes (baseline: {baseline_pause_rate} pauses/min)."
- "You used 'um' {um_count} times ({um_pct}% of words)."
- "Your pitch range was {semitones} semitones in this segment (baseline: {baseline_semitones})."
- "This system transcribed your speech with ~{asr_accuracy}% accuracy on this audio sample."

---

## RISKY (Interpretive -- requires causality proof before use)

These imply cause-effect relationships that are not validated. Do not use without empirical evidence.

- "Longer pauses = less confident."
- "Higher pitch = anxiety/excitement."
- "Faster speech = more confident."
- "More fillers = worse communication."
- "Monotone = disengaged."

---

## FORBIDDEN (Psychological / Diagnostic / Therapeutic)

These must never appear in the app, marketing, or any user-facing content.

- "Your anxiety level is {x}%."
- "Your confidence dropped {x}%."
- "You sound anxious."
- "Your emotional tone is uncertain."
- "You need to reduce filler words to be more professional."
- "Your speech quality improved {x}%." (unless 'speech quality' is explicitly defined and validated)
