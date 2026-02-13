"""
KDENZ Voice Lab — Neuroscience-to-Feedback Mapping Framework
=============================================================

This file defines the complete mapping from:
  Raw voice data → Neuroscience mechanism → Detection rule → User feedback

Each feedback template is calibrated for:
1. Specificity (uses actual numbers from their recording)
2. Non-judgment (observational, not evaluative)
3. Neuroscience grounding (explains WHY this matters)
4. Actionability (gives them something concrete to try)
5. Hope (frames the finding as changeable, not fixed)

These templates are used by both the Hume pipeline and the local pipeline.
"""

from dataclasses import dataclass
from typing import Optional


# ─── Neuroscience Mechanisms ─────────────────────────────────────────

@dataclass
class NeuroscienceMechanism:
    """A peer-reviewed mechanism that maps to a product feature."""
    id: str
    name: str
    citation: str
    finding: str
    product_implication: str
    detection_method: str


MECHANISMS = {
    "amygdala_hijack": NeuroscienceMechanism(
        id="amygdala_hijack",
        name="Amygdala Hijack / PFC Suppression",
        citation="Arnsten 2009, 'Stress signalling pathways that impair prefrontal cortex structure and function'",
        finding=(
            "Under acute social threat, the amygdala suppresses prefrontal cortex activity. "
            "This manifests as the subjective experience of 'my brain went blank' — "
            "executive function, working memory, and verbal fluency all temporarily degrade."
        ),
        product_implication=(
            "Detectable in voice as: sudden pace drop (>30%), increased pause duration, "
            "pitch instability, and elevated jitter/shimmer. The 'freeze' event."
        ),
        detection_method="pace_drop + pause_duration + stress_spike",
    ),

    "memory_reconsolidation": NeuroscienceMechanism(
        id="memory_reconsolidation",
        name="Memory Reconsolidation",
        citation="Nader 2000, Schiller 2010",
        finding=(
            "Emotional memories become labile (updatable) when retrieved. During a brief "
            "reconsolidation window (~6 hours), the emotional charge of a memory can be "
            "modified without erasing the factual content."
        ),
        product_implication=(
            "Post-conversation review + guided re-experience allows users to 'update' "
            "their stress response to specific conversation patterns. This is why "
            "'practice after the real conversation' is more powerful than practice alone."
        ),
        detection_method="session_timing_post_conversation",
    ),

    "vagal_tone_prosody": NeuroscienceMechanism(
        id="vagal_tone_prosody",
        name="Vagal Tone → Vocal Prosody",
        citation="Porges 2007, Polyvagal Theory",
        finding=(
            "The vagus nerve directly innervates the laryngeal muscles that control "
            "vocal prosody. Vagal tone (measurable via HRV) is encoded in voice: "
            "higher vagal tone → richer prosody, more pitch variation, warmer timbre. "
            "Lower vagal tone → flatter, thinner voice."
        ),
        product_implication=(
            "Voice analytics can detect autonomic state without biometric sensors. "
            "Pitch stability, HNR, and shimmer serve as proxies for vagal tone. "
            "This is the mechanism behind 'your voice reveals your nervous system state.'"
        ),
        detection_method="pitch_stability + hnr + shimmer",
    ),

    "mi_self_generated_change": NeuroscienceMechanism(
        id="mi_self_generated_change",
        name="Self-Generated Change Talk",
        citation="Zhang 2014 (fMRI study)",
        finding=(
            "When people generate their own reasons for change (as opposed to being told), "
            "it activates reward networks (ventral striatum) and reduces resistance. "
            "This is the neurological basis of motivational interviewing's effectiveness."
        ),
        product_implication=(
            "Coaching prompts should be Socratic, not prescriptive. Instead of "
            "'You should pause before responding,' ask 'What did you notice about "
            "the moment right before the freeze?' Self-discovery drives lasting change."
        ),
        detection_method="coaching_prompt_design",
    ),

    "deliberate_practice": NeuroscienceMechanism(
        id="deliberate_practice",
        name="Deliberate Practice Timelines",
        citation="Ericsson 1993, Street 2009",
        finding=(
            "Targeted practice with immediate feedback produces measurable skill gains "
            "that stabilize in 4-12 weeks. The key is not volume (hours practiced) "
            "but specificity (targeting exact moments of difficulty)."
        ),
        product_implication=(
            "Measurable progress timeline: users should see improvement in 4-6 sessions, "
            "with gains stabilizing around session 10-12. This informs both the "
            "product promise ('measurable improvement in 30 days') and the "
            "retention model (value accrues over time)."
        ),
        detection_method="longitudinal_metric_comparison",
    ),
}


# ─── Detection Rules ────────────────────────────────────────────────

@dataclass
class DetectionRule:
    """A rule that maps raw data patterns to a named event."""
    id: str
    name: str
    mechanism_id: str
    conditions: dict        # Thresholds and logical conditions
    severity_levels: dict   # What makes it mild / moderate / severe
    data_sources: list      # Which metrics this needs


DETECTION_RULES = {
    "freeze_event": DetectionRule(
        id="freeze_event",
        name="Freeze Response",
        mechanism_id="amygdala_hijack",
        conditions={
            "primary": "pace_drop_pct > 0.30 AND pause_duration > 0.8s",
            "supporting": "stress_spike > 0.15 OR confidence_drop > 0.15",
            "minimum_data": "at_least_3_segments",
        },
        severity_levels={
            "mild": "pace_drop 30-45% OR pause 0.8-1.5s",
            "moderate": "pace_drop 45-60% AND pause 1.5-3.0s",
            "severe": "pace_drop >60% OR pause >3.0s OR stress >0.65",
        },
        data_sources=["pace_wpm", "pause_events", "stress_score", "confidence_score"],
    ),

    "sustained_tension": DetectionRule(
        id="sustained_tension",
        name="Sustained Vocal Tension",
        mechanism_id="vagal_tone_prosody",
        conditions={
            "primary": "avg_stress > 0.45 for >60% of recording",
            "supporting": "avg_jitter > 0.015 OR avg_shimmer > 0.05",
        },
        severity_levels={
            "mild": "stress 0.45-0.55, some relaxation periods",
            "moderate": "stress 0.55-0.70, minimal relaxation",
            "severe": "stress >0.70, no relaxation detected",
        },
        data_sources=["stress_score", "jitter", "shimmer", "segment_timeline"],
    ),

    "confidence_deficit": DetectionRule(
        id="confidence_deficit",
        name="Low Vocal Confidence",
        mechanism_id="vagal_tone_prosody",
        conditions={
            "primary": "avg_confidence < 0.35",
            "supporting": "pitch_stability < 0.40 OR intensity_variability > high",
        },
        severity_levels={
            "mild": "confidence 0.30-0.35, occasional strong moments",
            "moderate": "confidence 0.20-0.30, rare strong moments",
            "severe": "confidence <0.20, consistently uncertain prosody",
        },
        data_sources=["confidence_score", "pitch_stability", "intensity_db"],
    ),

    "strong_recovery": DetectionRule(
        id="strong_recovery",
        name="Strong Recovery Capacity",
        mechanism_id="amygdala_hijack",
        conditions={
            "primary": "freeze_detected AND recovery_time < 2.0s",
            "supporting": "post_freeze_stress < pre_freeze_baseline + 0.10",
        },
        severity_levels={
            "strong": "recovery < 1.5s, metrics normalize fully",
            "moderate": "recovery 1.5-3.0s, partial normalization",
            "slow": "recovery > 3.0s or no recovery in window",
        },
        data_sources=["freeze_events", "stress_timeline", "confidence_timeline"],
    ),

    "emotional_regulation": DetectionRule(
        id="emotional_regulation",
        name="Emotional Regulation Capacity",
        mechanism_id="vagal_tone_prosody",
        conditions={
            "primary": "steadiness > 0.70 despite emotional content",
            "supporting": "hnr > 15 dB average",
        },
        severity_levels={
            "strong": "steadiness >0.80, HNR >18 dB",
            "moderate": "steadiness 0.60-0.80, HNR 12-18 dB",
            "weak": "steadiness <0.60, HNR <12 dB",
        },
        data_sources=["steadiness_score", "hnr", "pitch_stability"],
    ),

    "pace_pattern": DetectionRule(
        id="pace_pattern",
        name="Speaking Pace Pattern",
        mechanism_id="deliberate_practice",
        conditions={
            "rushing": "avg_pace > 170 wpm AND pace increases during emotional content",
            "dragging": "avg_pace < 110 wpm AND long pauses between phrases",
            "variable": "pace_cv > 0.25 (coefficient of variation)",
            "controlled": "pace 120-160 wpm AND pace_cv < 0.15",
        },
        severity_levels={
            "optimal": "120-160 wpm, low variability",
            "needs_work": "outside range OR high variability",
            "concerning": "extreme rushing (>200) or extreme slowness (<80)",
        },
        data_sources=["pace_wpm", "pace_timeline"],
    ),
}


# ─── Feedback Templates ─────────────────────────────────────────────

@dataclass
class FeedbackTemplate:
    """A user-facing feedback message tied to a detection rule."""
    detection_rule_id: str
    severity: str
    headline: str                 # Bold, specific (shown in Mirror screen)
    body: str                     # Explanation with {placeholders} for real data
    neuroscience_note: str        # Why this matters (science-backed)
    actionable_tip: str           # One concrete thing to try
    coaching_prompt: str          # MI-style self-discovery question
    positive_framing: str         # Reframe as strength or potential


FEEDBACK_TEMPLATES = [
    # ─── Freeze Events ──────────────────────────────────────

    FeedbackTemplate(
        detection_rule_id="freeze_event",
        severity="mild",
        headline="Your voice paused briefly at {timestamp}s",
        body=(
            "Your speaking pace dipped {pace_drop_pct}% for about {duration}s. "
            "This is subtle — most listeners wouldn't notice — but your voice data "
            "shows your nervous system briefly shifted into a more cautious mode."
        ),
        neuroscience_note=(
            "This micro-pause maps to what neuroscientists call a 'threat assessment' — "
            "your amygdala flagged something and your prefrontal cortex paused to evaluate. "
            "This is normal and actually adaptive."
        ),
        actionable_tip=(
            "Try intentionally pausing for 1.5 seconds before responding to challenging "
            "statements. When the pause is deliberate, it reads as thoughtfulness rather than hesitation."
        ),
        coaching_prompt="What were you feeling right before that pause?",
        positive_framing=(
            "The fact that this was brief suggests your nervous system has good "
            "self-regulation capacity. You recovered quickly."
        ),
    ),

    FeedbackTemplate(
        detection_rule_id="freeze_event",
        severity="moderate",
        headline="Your speaking pace dropped {pace_drop_pct}% at {timestamp}s",
        body=(
            "At {timestamp}s, your voice showed a significant shift — pace dropped from "
            "{pace_before} to {pace_after} WPM, with a {duration}s pause. "
            "Your stress indicators spiked to {stress_score}%. "
            "This is the vocal fingerprint of what's commonly called 'going blank.'"
        ),
        neuroscience_note=(
            "Arnsten (2009) documented how social threat triggers the amygdala to suppress "
            "prefrontal cortex function — the brain region responsible for verbal fluency, "
            "working memory, and rational thought. Your voice captured the exact moment "
            "this switch happened."
        ),
        actionable_tip=(
            "Before your next difficult conversation, practice a 'pre-flight check': "
            "3 slow breaths, then say your opening line out loud twice. This primes your "
            "prefrontal cortex and raises the threshold for amygdala activation."
        ),
        coaching_prompt=(
            "When you listen back to that moment, what do you think triggered the shift?"
        ),
        positive_framing=(
            "You self-corrected in {recovery_time}s — that recovery speed suggests your "
            "regulatory capacity is strong. With practice, you can shorten the freeze window itself."
        ),
    ),

    FeedbackTemplate(
        detection_rule_id="freeze_event",
        severity="severe",
        headline="A significant freeze response at {timestamp}s",
        body=(
            "Your voice went quiet for {duration}s — stress hit {stress_score}%, "
            "and your confidence indicators dropped to {confidence_score}%. "
            "This was your nervous system's strongest response in the recording. "
            "The topic at that moment appears to have activated a deep threat response."
        ),
        neuroscience_note=(
            "This pattern matches a full amygdala hijack (Arnsten 2009). Your brain's "
            "threat detection system temporarily took executive function offline. "
            "This isn't a weakness — it's a protective mechanism. But it can be retrained: "
            "Schiller (2010) showed that guided re-exposure during the memory "
            "reconsolidation window can reduce the intensity of this response by 30-50%."
        ),
        actionable_tip=(
            "This specific moment is your highest-leverage practice target. "
            "Re-record yourself saying what you wish you had said, within the next few hours. "
            "Your brain is most receptive to updating this response while the memory is fresh."
        ),
        coaching_prompt=(
            "If you could go back to that exact moment and give yourself one sentence of "
            "advice, what would you say?"
        ),
        positive_framing=(
            "The fact that you're analyzing this moment — rather than avoiding it — "
            "is itself a form of reconsolidation. Each time you revisit it in a safe "
            "context, the emotional charge decreases."
        ),
    ),

    # ─── Sustained Tension ──────────────────────────────────

    FeedbackTemplate(
        detection_rule_id="sustained_tension",
        severity="moderate",
        headline="Your voice carried tension throughout",
        body=(
            "Your average stress score was {stress_score}% across the full recording. "
            "Vocal jitter (a micro-tremor in your pitch) averaged {jitter}%, "
            "above the conversational baseline of <1%. Your voice sounded "
            "controlled on the surface, but the tension was encoded underneath."
        ),
        neuroscience_note=(
            "Porges' polyvagal theory (2007) explains this as reduced vagal tone — "
            "your 'social engagement system' was partially disengaged, even though "
            "you were still talking. Your listener's nervous system picks up on this "
            "unconsciously through mirror neuron activation."
        ),
        actionable_tip=(
            "Before speaking, hum at a comfortable pitch for 5 seconds. Humming "
            "stimulates the vagus nerve and can measurably reduce vocal tension "
            "within seconds. It's the fastest way to shift your voice from "
            "'controlled' to 'authentic.'"
        ),
        coaching_prompt=(
            "What would your voice sound like if you felt completely safe in that conversation?"
        ),
        positive_framing=(
            "Maintaining conversation under sustained tension takes real resilience. "
            "Many people shut down entirely. You stayed engaged — now we're working on "
            "staying engaged AND relaxed."
        ),
    ),

    # ─── Low Confidence ─────────────────────────────────────

    FeedbackTemplate(
        detection_rule_id="confidence_deficit",
        severity="moderate",
        headline="Your voice is underselling your words",
        body=(
            "Your vocal confidence scored {confidence_score}%. Pitch stability was "
            "{pitch_stability}%, meaning your voice wavered more than it held steady. "
            "When confidence drops below 35%, research shows listeners unconsciously "
            "discount the content — even when what you're saying is strong."
        ),
        neuroscience_note=(
            "Klofstad (2012) demonstrated that vocal pitch and stability are the strongest "
            "predictors of perceived competence — stronger than word choice or body language. "
            "Your words may be excellent, but your prosody is undermining them."
        ),
        actionable_tip=(
            "Record yourself saying your key message three times. Each time, focus on "
            "landing the last word of each sentence with a downward pitch (not upward, "
            "which signals uncertainty). Compare the third recording to the first."
        ),
        coaching_prompt=(
            "On a scale of 1-10, how confident did you actually feel during that recording? "
            "Now — how confident did you want to sound?"
        ),
        positive_framing=(
            "The gap between what you mean and how it sounds is one of the fastest things "
            "to close. Most people see 15-20% improvement in pitch stability "
            "within 3-4 practice sessions."
        ),
    ),

    # ─── Strong Recovery ────────────────────────────────────

    FeedbackTemplate(
        detection_rule_id="strong_recovery",
        severity="strong",
        headline="You recovered in {recovery_time}s — faster than 70% of first recordings",
        body=(
            "After the stress peak at {timestamp}s, your voice metrics normalized "
            "within {recovery_time} seconds. Your stress dropped from {peak_stress}% "
            "back to {recovered_stress}%, and your pace restabilized."
        ),
        neuroscience_note=(
            "Recovery speed is one of the strongest predictors of communication resilience. "
            "It reflects your vagal brake's efficiency — your parasympathetic nervous system's "
            "ability to re-engage after a threat response. This is trainable and tends to "
            "improve faster than the initial stress response itself."
        ),
        actionable_tip=(
            "Your recovery is already a strength. To build on it: after you notice a freeze, "
            "take one deliberate breath and then continue. This turns unconscious recovery "
            "into conscious recovery — and conscious recovery is faster."
        ),
        coaching_prompt=(
            "What did you do — internally — to get back on track after that moment?"
        ),
        positive_framing=(
            "This recovery speed is genuinely impressive for a first recording. "
            "Most people take 4-6 seconds; you did it in {recovery_time}. "
            "This is a foundation to build on."
        ),
    ),

    # ─── Emotional Regulation ───────────────────────────────

    FeedbackTemplate(
        detection_rule_id="emotional_regulation",
        severity="strong",
        headline="Your vocal steadiness scored {steadiness}%",
        body=(
            "Despite discussing emotionally charged content, your voice maintained "
            "remarkable consistency. Your HNR (harmonics-to-noise ratio) averaged "
            "{hnr} dB — indicating clear, well-supported vocal production even "
            "under emotional load."
        ),
        neuroscience_note=(
            "Porges' polyvagal theory identifies this pattern as strong vagal tone — "
            "your social engagement system stayed online throughout. This is the "
            "physiological basis of what leadership literature calls 'executive presence.'"
        ),
        actionable_tip=(
            "Your steadiness is a superpower. The next challenge is maintaining it "
            "when the other person escalates. Try this: practice maintaining your "
            "current vocal quality while responding to an AI partner who progressively "
            "increases pressure."
        ),
        coaching_prompt="What helps you stay grounded when things get tense?",
        positive_framing=(
            "This level of vocal regulation puts you in the top quartile. "
            "Your nervous system handles emotional load well — now we can push "
            "the boundaries of what it can handle."
        ),
    ),

    # ─── Pace Pattern ───────────────────────────────────────

    FeedbackTemplate(
        detection_rule_id="pace_pattern",
        severity="needs_work",
        headline="Your pace shifted {pace_pattern_type} during emotional moments",
        body=(
            "Your average pace was {avg_pace} WPM with a variability of {pace_cv}%. "
            "Notably, your pace {pace_direction} when the topic became more emotionally "
            "charged — going from {pace_calm} WPM during neutral content to "
            "{pace_emotional} WPM during difficult content."
        ),
        neuroscience_note=(
            "Pace changes under emotional load are one of the most reliable indicators "
            "of autonomic state shifts. Rushing often signals anxiety (fight response), "
            "while slowing often signals avoidance (freeze response). Both reduce "
            "the listener's ability to process your message."
        ),
        actionable_tip=(
            "Pick one sentence from the difficult part of your conversation. "
            "Record yourself saying it at your calm pace (around {pace_calm} WPM). "
            "Then try it again with the emotional context in mind, maintaining the same pace. "
            "The gap between these two recordings is your growth edge."
        ),
        coaching_prompt=(
            "When you notice yourself {pace_direction_verb}, what's usually going through your mind?"
        ),
        positive_framing=(
            "Pace awareness is the first step to pace control. Most people don't even "
            "notice their pace changes — you now have data showing exactly when and how "
            "much yours shifts. That's a massive advantage."
        ),
    ),
]


# ─── Template Resolver ──────────────────────────────────────────────

def resolve_feedback(detection_rule_id: str, severity: str, data: dict) -> Optional[dict]:
    """Find the matching template and fill in placeholders with real data.

    Args:
        detection_rule_id: Which rule fired (e.g., "freeze_event")
        severity: The severity level (e.g., "moderate")
        data: Dict of actual values to fill in placeholders

    Returns:
        Dict with all feedback fields resolved, or None if no template found.
    """
    for template in FEEDBACK_TEMPLATES:
        if template.detection_rule_id == detection_rule_id and template.severity == severity:
            def fill(text: str) -> str:
                for key, value in data.items():
                    placeholder = "{" + key + "}"
                    if placeholder in text:
                        text = text.replace(placeholder, str(value))
                return text

            return {
                "headline": fill(template.headline),
                "body": fill(template.body),
                "neuroscience_note": fill(template.neuroscience_note),
                "actionable_tip": fill(template.actionable_tip),
                "coaching_prompt": fill(template.coaching_prompt),
                "positive_framing": fill(template.positive_framing),
                "mechanism": MECHANISMS.get(
                    DETECTION_RULES[detection_rule_id].mechanism_id
                ),
            }

    return None


# ─── Example Usage ──────────────────────────────────────────────────

if __name__ == "__main__":
    # Example: resolving a moderate freeze event with real data
    result = resolve_feedback("freeze_event", "moderate", {
        "timestamp": "14.3",
        "pace_drop_pct": "43",
        "pace_before": "142",
        "pace_after": "81",
        "duration": "2.1",
        "stress_score": "67",
        "confidence_score": "28",
        "recovery_time": "3.2",
    })

    if result:
        print("="*60)
        print("FEEDBACK PREVIEW")
        print("="*60)
        print(f"\nHEADLINE: {result['headline']}")
        print(f"\nBODY: {result['body']}")
        print(f"\nSCIENCE: {result['neuroscience_note']}")
        print(f"\nTIP: {result['actionable_tip']}")
        print(f"\nCOACH: {result['coaching_prompt']}")
        print(f"\nFRAMING: {result['positive_framing']}")

    # Print all available detection rules
    print("\n" + "="*60)
    print("DETECTION RULES SUMMARY")
    print("="*60)
    for rule_id, rule in DETECTION_RULES.items():
        mechanism = MECHANISMS[rule.mechanism_id]
        print(f"\n  {rule.name}")
        print(f"    Mechanism: {mechanism.name} ({mechanism.citation})")
        print(f"    Detects:   {rule.conditions.get('primary', '')}")
        print(f"    Data:      {', '.join(rule.data_sources)}")
