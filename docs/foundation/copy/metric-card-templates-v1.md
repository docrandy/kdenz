# Metric Card Copy Templates

- **Tier:** Foundation
- **Status:** LOCKED
- **Version:** v1
- **Source:** Claim-Safe Copy Library and SaaS Action Plan (original docx)
- **Summary:** Ready-to-paste copy templates for each metric card in the app UI. Each includes measurement, baseline comparison, uncertainty note, and reflection prompt.

---

## Speech Rate

Your rate: {wpm} WPM (+/-{wpm_ci} WPM)
Baseline: {baseline_wpm} WPM
Difference: {delta_wpm} WPM

> Note: Accuracy is highest in quiet environments. Background noise can widen the margin of error.

> Reflection: What do you think drove the pace in this section?

---

## Filler Words

You used: 'um' {um_count}x, 'uh' {uh_count}x, 'like' {like_count}x
Filler rate: {filler_pct}% of words (+/-{filler_ci}%)
Baseline: {baseline_filler_pct}%

> Context note: Fillers are common in conversational speech. In more formal settings, they may be more noticeable.

> Reflection: Did you feel more time-pressure or uncertainty in this part?

---

## Pauses

Pauses: {pause_count} total
Average pause: {avg_pause_s}s
Pauses >2s: {pause_over_2s}
Baseline: {baseline_pause_rate} pauses/min

> System note: If background noise is detected, pause metrics may be less reliable.

> Reflection: Were these pauses for thinking, emphasis, or turn-taking?

---

## Pitch Range

Pitch range: {semitones} semitones (baseline: {baseline_semitones})

> Important: Pitch varies naturally by physiology, age, and gender. We focus on your personal baseline rather than population norms.

> Reflection: Did you intentionally emphasize or vary tone here?

---

## Transcript Accuracy / Confidence

Transcript quality: {asr_confidence_label}
Estimated transcription accuracy on this sample: ~{asr_accuracy}%

> We show transcription confidence first because errors can affect downstream metrics (fillers, pauses).
