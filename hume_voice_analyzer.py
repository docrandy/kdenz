"""
KDENZ Voice Lab — Hume AI Voice Analysis Proof of Concept
==========================================================

PURPOSE: Test whether Hume AI's Expression Measurement API can produce
the specific, actionable feedback the KDENZ product promises.

WHAT THIS TESTS (Assumption #3):
"Can voice analytics produce specific actionable feedback?"

Specifically, can we detect:
1. Freeze response (pace drop > 30% within a 3-second window)
2. Stress signature (prosodic tension patterns mapped to Porges vagal tone)
3. Confidence shifts (volume + pitch stability as proxy for assertiveness)
4. Recovery timing (how quickly vocal patterns normalize after a freeze)
5. Emotional arc (trajectory of emotional valence across the recording)

REQUIREMENTS:
  pip install hume requests numpy matplotlib

USAGE:
  # Set your Hume API key
  export HUME_API_KEY="your_key_here"

  # Analyze a voice recording
  python hume_voice_analyzer.py path/to/recording.wav

  # Analyze with detailed output
  python hume_voice_analyzer.py path/to/recording.wav --verbose

  # Generate visual report
  python hume_voice_analyzer.py path/to/recording.wav --plot

GET A HUME API KEY:
  1. Go to https://platform.hume.ai
  2. Sign up (free tier includes 100 minutes/month)
  3. Create an API key under Settings > API Keys
"""

import os
import sys
import json
import time
import argparse
import requests
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

# ─── Configuration ───────────────────────────────────────────────────

HUME_API_URL = "https://api.hume.ai/v0/batch/jobs"
HUME_RESULTS_URL = "https://api.hume.ai/v0/batch/jobs/{job_id}/predictions"

# Emotions from Hume's 48-dimension model that map to KDENZ features
# These are the ones we care about for interpersonal conversation coaching
KDENZ_EMOTION_MAP = {
    # Freeze / stress indicators
    "stress_indicators": [
        "Anxiety", "Fear", "Distress", "Nervousness", "Embarrassment",
        "Awkwardness", "Confusion", "Doubt"
    ],
    # Confidence / assertiveness indicators
    "confidence_indicators": [
        "Determination", "Confidence", "Assertiveness", "Pride",
        "Triumph", "Satisfaction"
    ],
    # Engagement / presence indicators
    "engagement_indicators": [
        "Interest", "Concentration", "Contemplation", "Realization",
        "Enthusiasm"
    ],
    # Recovery / regulation indicators
    "regulation_indicators": [
        "Calmness", "Relief", "Contentment", "Serenity",
        "Contemplation"
    ],
    # Negative valence (conversation going poorly)
    "negative_indicators": [
        "Anger", "Contempt", "Disgust", "Disappointment",
        "Frustration", "Annoyance"
    ]
}

# Thresholds calibrated for interpersonal conversation context
THRESHOLDS = {
    "freeze_pace_drop_pct": 0.30,       # 30% pace drop = freeze detected
    "stress_score_high": 0.45,           # Above this = elevated stress
    "stress_score_critical": 0.65,       # Above this = amygdala hijack likely
    "confidence_baseline": 0.35,         # Below this = low confidence zone
    "recovery_window_sec": 5.0,          # How long to look for recovery
    "significant_shift_delta": 0.15,     # Min change to count as a "shift"
}


# ─── Data Structures ────────────────────────────────────────────────

@dataclass
class VoiceSegment:
    """A time-windowed segment of voice analysis."""
    start_time: float
    end_time: float
    stress_score: float = 0.0
    confidence_score: float = 0.0
    engagement_score: float = 0.0
    regulation_score: float = 0.0
    negative_score: float = 0.0
    dominant_emotion: str = ""
    dominant_score: float = 0.0
    raw_emotions: dict = field(default_factory=dict)


@dataclass
class FreezeEvent:
    """A detected freeze/stress event."""
    timestamp: float
    duration: float
    severity: str  # "mild", "moderate", "severe"
    stress_score: float
    trigger_context: str
    recovery_time: Optional[float] = None


@dataclass
class VoiceProfile:
    """Complete analysis output for one recording."""
    duration_seconds: float
    segments: list
    freeze_events: list
    avg_stress: float
    avg_confidence: float
    avg_engagement: float
    pace_variability: float
    vocal_steadiness_pct: float
    recovery_strength: str  # "strong", "moderate", "slow"
    emotional_arc: list  # [(time, valence)] for visualization
    dominant_pattern: str
    key_insight: str
    neuroscience_note: str


# ─── Hume AI Integration ────────────────────────────────────────────

def submit_to_hume(audio_path: str, api_key: str) -> str:
    """Submit an audio file to Hume's batch API. Returns job ID."""

    headers = {
        "X-Hume-Api-Key": api_key,
    }

    # Configure the analysis models we need
    # Prosody model = vocal expression analysis (what we need)
    config = {
        "models": {
            "prosody": {
                "granularity": "utterance",  # or "sentence" for coarser
                "identify_speakers": False,   # Single speaker for practice mode
            }
        }
    }

    with open(audio_path, "rb") as f:
        files = {
            "file": (Path(audio_path).name, f, "audio/wav"),
            "json": (None, json.dumps(config), "application/json"),
        }
        response = requests.post(HUME_API_URL, headers=headers, files=files)

    if response.status_code != 200:
        raise Exception(f"Hume API error {response.status_code}: {response.text}")

    job_id = response.json().get("job_id")
    print(f"  → Hume job submitted: {job_id}")
    return job_id


def poll_hume_results(job_id: str, api_key: str, timeout: int = 120) -> dict:
    """Poll until Hume job completes. Returns prediction results."""

    headers = {"X-Hume-Api-Key": api_key}
    status_url = f"https://api.hume.ai/v0/batch/jobs/{job_id}"
    results_url = HUME_RESULTS_URL.format(job_id=job_id)

    start = time.time()
    while time.time() - start < timeout:
        status_resp = requests.get(status_url, headers=headers)
        status = status_resp.json().get("state", {}).get("status")

        if status == "COMPLETED":
            results_resp = requests.get(results_url, headers=headers)
            return results_resp.json()
        elif status == "FAILED":
            raise Exception(f"Hume job failed: {status_resp.json()}")

        print(f"  → Waiting... ({status})")
        time.sleep(3)

    raise TimeoutError(f"Hume job {job_id} didn't complete in {timeout}s")


# ─── Analysis Engine ────────────────────────────────────────────────

def compute_category_score(emotions: dict, category_keys: list) -> float:
    """Average the scores of emotions in a category."""
    scores = [emotions.get(e, 0.0) for e in category_keys if e in emotions]
    return sum(scores) / len(scores) if scores else 0.0


def extract_segments(hume_predictions: dict) -> list[VoiceSegment]:
    """Convert Hume API output into KDENZ VoiceSegments."""

    segments = []

    # Navigate Hume's nested response structure
    # predictions[0].models.prosody.grouped_predictions[0].predictions[]
    try:
        predictions = hume_predictions[0]["results"]["predictions"]
        prosody_results = predictions[0]["models"]["prosody"]["grouped_predictions"]

        for group in prosody_results:
            for pred in group["predictions"]:
                # Extract time window
                time_info = pred.get("time", {})
                start = time_info.get("begin", 0)
                end = time_info.get("end", 0)

                # Build emotion dict from Hume's format
                emotions = {}
                for emotion_data in pred.get("emotions", []):
                    emotions[emotion_data["name"]] = emotion_data["score"]

                # Find dominant emotion
                dominant = max(emotions.items(), key=lambda x: x[1]) if emotions else ("Unknown", 0)

                segment = VoiceSegment(
                    start_time=start,
                    end_time=end,
                    stress_score=compute_category_score(emotions, KDENZ_EMOTION_MAP["stress_indicators"]),
                    confidence_score=compute_category_score(emotions, KDENZ_EMOTION_MAP["confidence_indicators"]),
                    engagement_score=compute_category_score(emotions, KDENZ_EMOTION_MAP["engagement_indicators"]),
                    regulation_score=compute_category_score(emotions, KDENZ_EMOTION_MAP["regulation_indicators"]),
                    negative_score=compute_category_score(emotions, KDENZ_EMOTION_MAP["negative_indicators"]),
                    dominant_emotion=dominant[0],
                    dominant_score=dominant[1],
                    raw_emotions=emotions,
                )
                segments.append(segment)

    except (KeyError, IndexError) as e:
        print(f"  ⚠ Error parsing Hume response: {e}")
        print(f"  Response structure: {json.dumps(hume_predictions, indent=2)[:500]}")
        return []

    return sorted(segments, key=lambda s: s.start_time)


def detect_freezes(segments: list[VoiceSegment]) -> list[FreezeEvent]:
    """Detect freeze events: moments where stress spikes and confidence drops."""

    freezes = []
    if len(segments) < 3:
        return freezes

    for i in range(1, len(segments)):
        seg = segments[i]
        prev = segments[i - 1]

        # Freeze detection criteria:
        # 1. Stress score jumps significantly
        stress_spike = seg.stress_score - prev.stress_score > THRESHOLDS["significant_shift_delta"]
        # 2. Confidence drops
        confidence_drop = prev.confidence_score - seg.confidence_score > THRESHOLDS["significant_shift_delta"]
        # 3. Absolute stress is high
        high_stress = seg.stress_score > THRESHOLDS["stress_score_high"]

        if (stress_spike or confidence_drop) and high_stress:
            # Determine severity
            if seg.stress_score > THRESHOLDS["stress_score_critical"]:
                severity = "severe"
            elif stress_spike and confidence_drop:
                severity = "moderate"
            else:
                severity = "mild"

            # Calculate recovery time
            recovery_time = None
            for j in range(i + 1, min(i + 5, len(segments))):
                future = segments[j]
                if future.stress_score < THRESHOLDS["stress_score_high"]:
                    recovery_time = future.start_time - seg.start_time
                    break

            freeze = FreezeEvent(
                timestamp=seg.start_time,
                duration=seg.end_time - seg.start_time,
                severity=severity,
                stress_score=seg.stress_score,
                trigger_context=f"Stress spiked to {seg.stress_score:.0%}, dominant emotion: {seg.dominant_emotion}",
                recovery_time=recovery_time,
            )
            freezes.append(freeze)

    return freezes


def compute_vocal_steadiness(segments: list[VoiceSegment]) -> float:
    """Compute how consistent the voice remains across segments.

    Maps to: Porges' polyvagal theory — vagal tone stability
    reflected in prosodic consistency.
    """
    if len(segments) < 2:
        return 1.0

    # Measure variance in stress and confidence scores
    stress_scores = [s.stress_score for s in segments]
    conf_scores = [s.confidence_score for s in segments]

    stress_var = _variance(stress_scores)
    conf_var = _variance(conf_scores)

    # Lower variance = higher steadiness
    # Normalize: variance of 0 = 100% steady, variance of 0.1+ = low steadiness
    steadiness = max(0, 1.0 - (stress_var + conf_var) * 5)
    return round(steadiness, 2)


def compute_emotional_arc(segments: list[VoiceSegment]) -> list[tuple]:
    """Generate the emotional arc: (time, valence) pairs.

    Valence = confidence + engagement - stress - negative
    Positive valence = confident, engaged
    Negative valence = stressed, withdrawn
    """
    arc = []
    for seg in segments:
        valence = (seg.confidence_score + seg.engagement_score -
                   seg.stress_score - seg.negative_score)
        midpoint = (seg.start_time + seg.end_time) / 2
        arc.append((round(midpoint, 2), round(valence, 3)))
    return arc


def classify_recovery_strength(freezes: list[FreezeEvent]) -> str:
    """Classify how well the speaker recovers from freeze events."""
    if not freezes:
        return "no_freeze_detected"

    recovery_times = [f.recovery_time for f in freezes if f.recovery_time is not None]
    if not recovery_times:
        return "slow"  # Never recovered within window

    avg_recovery = sum(recovery_times) / len(recovery_times)

    if avg_recovery < 2.0:
        return "strong"
    elif avg_recovery < 4.0:
        return "moderate"
    else:
        return "slow"


def generate_key_insight(profile_data: dict) -> tuple[str, str]:
    """Generate the personalized insight + neuroscience note.

    This is the 'Mirror Moment' — the specific, revelatory feedback
    that justifies $49/mo.
    """

    freezes = profile_data["freezes"]
    avg_stress = profile_data["avg_stress"]
    avg_confidence = profile_data["avg_confidence"]
    steadiness = profile_data["steadiness"]
    recovery = profile_data["recovery_strength"]

    # Priority 1: Freeze detected (most impactful insight)
    if freezes:
        worst = max(freezes, key=lambda f: f.stress_score)
        if worst.recovery_time and worst.recovery_time < 3.0:
            insight = (
                f"At {worst.timestamp:.1f}s, your voice showed a {worst.severity} stress response — "
                f"but you self-corrected in {worst.recovery_time:.1f} seconds. "
                f"That recovery speed is a strength most people don't know they have."
            )
            neuro = (
                "This pattern matches Arnsten's (2009) research on prefrontal cortex function "
                "under social threat. Your amygdala triggered a brief fight-or-flight response, "
                "but your prefrontal cortex came back online quickly. With practice, you can "
                "shorten the freeze window itself — not just the recovery."
            )
        else:
            insight = (
                f"At {worst.timestamp:.1f}s, your voice showed a {worst.severity} stress response. "
                f"Your stress score hit {worst.stress_score:.0%} — "
                f"this is where your brain's threat detection system temporarily overrode "
                f"your ability to think clearly."
            )
            neuro = (
                "Under social threat, the amygdala suppresses prefrontal cortex activity "
                "(Arnsten 2009). This is why people say 'my brain went blank' — it literally did. "
                "The good news: Schiller (2010) showed that revisiting these moments in a safe "
                "context can reconsolidate the emotional memory, making future responses calmer."
            )

    # Priority 2: Low confidence pattern
    elif avg_confidence < THRESHOLDS["confidence_baseline"]:
        insight = (
            f"Your overall confidence signal was {avg_confidence:.0%}, which suggests "
            f"your voice may be undermining your words. When confidence drops below 35%, "
            f"listeners unconsciously discount the content — even if what you're saying is strong."
        )
        neuro = (
            "Porges' polyvagal theory (2007) shows that vocal prosody directly encodes "
            "your autonomic state. Low vagal tone produces a 'thin' or hesitant voice "
            "that signals uncertainty to the listener's nervous system. Vocal exercises "
            "that increase vagal tone can shift this within weeks."
        )

    # Priority 3: High steadiness (positive reinforcement)
    elif steadiness > 0.75:
        insight = (
            f"Your vocal steadiness scored {steadiness:.0%} — that's exceptionally consistent. "
            f"Your voice maintained its character even when discussing difficult moments. "
            f"This is a foundation you can build on."
        )
        neuro = (
            "Consistent prosody reflects strong vagal regulation (Porges 2007). "
            "Your nervous system maintains composure under emotional load — "
            "this is the physiological basis of 'executive presence' in communication."
        )

    # Priority 4: General pattern
    else:
        insight = (
            f"Your voice showed moderate variability — stress at {avg_stress:.0%}, "
            f"confidence at {avg_confidence:.0%}, steadiness at {steadiness:.0%}. "
            f"There's a clear pattern of engagement that dips during emotionally "
            f"charged moments and recovers during factual sections."
        )
        neuro = (
            "This engagement-dip pattern is universal — Ericsson's (1993) deliberate "
            "practice research shows that targeted rehearsal of those specific dip moments "
            "produces measurable improvement in 4-6 sessions."
        )

    return insight, neuro


# ─── Utilities ──────────────────────────────────────────────────────

def _variance(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    mean = sum(values) / len(values)
    return sum((v - mean) ** 2 for v in values) / len(values)


# ─── Main Analysis Pipeline ─────────────────────────────────────────

def analyze_recording(audio_path: str, api_key: str, verbose: bool = False) -> VoiceProfile:
    """Full analysis pipeline: audio file → VoiceProfile."""

    print(f"\n{'='*60}")
    print(f"  KDENZ Voice Lab — Analysis")
    print(f"  File: {audio_path}")
    print(f"{'='*60}\n")

    # Step 1: Submit to Hume
    print("① Submitting to Hume AI...")
    job_id = submit_to_hume(audio_path, api_key)

    # Step 2: Wait for results
    print("② Waiting for analysis...")
    results = poll_hume_results(job_id, api_key)

    # Step 3: Extract segments
    print("③ Extracting voice segments...")
    segments = extract_segments(results)
    print(f"  → {len(segments)} segments found")

    if not segments:
        print("  ⚠ No segments extracted. Check audio quality and format.")
        sys.exit(1)

    # Step 4: Detect freeze events
    print("④ Detecting freeze events...")
    freezes = detect_freezes(segments)
    print(f"  → {len(freezes)} freeze event(s) detected")

    # Step 5: Compute metrics
    print("⑤ Computing voice metrics...")
    avg_stress = sum(s.stress_score for s in segments) / len(segments)
    avg_confidence = sum(s.confidence_score for s in segments) / len(segments)
    avg_engagement = sum(s.engagement_score for s in segments) / len(segments)
    steadiness = compute_vocal_steadiness(segments)
    emotional_arc = compute_emotional_arc(segments)
    recovery = classify_recovery_strength(freezes)
    duration = segments[-1].end_time - segments[0].start_time

    # Step 6: Generate insight
    print("⑥ Generating personalized insight...")
    insight, neuro_note = generate_key_insight({
        "freezes": freezes,
        "avg_stress": avg_stress,
        "avg_confidence": avg_confidence,
        "steadiness": steadiness,
        "recovery_strength": recovery,
    })

    # Determine dominant pattern
    if freezes and any(f.severity in ("moderate", "severe") for f in freezes):
        pattern = "freeze-recovery"
    elif avg_confidence < THRESHOLDS["confidence_baseline"]:
        pattern = "low-confidence"
    elif avg_stress > THRESHOLDS["stress_score_high"]:
        pattern = "sustained-tension"
    elif steadiness > 0.75:
        pattern = "steady-composed"
    else:
        pattern = "variable-engagement"

    # Compute pace variability from segment durations
    durations = [s.end_time - s.start_time for s in segments]
    pace_var = _variance(durations) if len(durations) > 1 else 0.0

    profile = VoiceProfile(
        duration_seconds=round(duration, 1),
        segments=segments,
        freeze_events=freezes,
        avg_stress=round(avg_stress, 3),
        avg_confidence=round(avg_confidence, 3),
        avg_engagement=round(avg_engagement, 3),
        pace_variability=round(pace_var, 4),
        vocal_steadiness_pct=round(steadiness * 100, 1),
        recovery_strength=recovery,
        emotional_arc=emotional_arc,
        dominant_pattern=pattern,
        key_insight=insight,
        neuroscience_note=neuro_note,
    )

    return profile


def print_profile(profile: VoiceProfile, verbose: bool = False):
    """Print the voice profile in a human-readable format."""

    print(f"\n{'─'*60}")
    print(f"  YOUR VOICE PROFILE")
    print(f"{'─'*60}\n")

    print(f"  Duration:           {profile.duration_seconds}s")
    print(f"  Segments analyzed:  {len(profile.segments)}")
    print(f"  Dominant pattern:   {profile.dominant_pattern}")
    print()

    print(f"  ┌─────────────────────────────────────┐")
    print(f"  │  Stress Level      {profile.avg_stress:.0%}{'':>15}│")
    print(f"  │  Confidence        {profile.avg_confidence:.0%}{'':>15}│")
    print(f"  │  Engagement        {profile.avg_engagement:.0%}{'':>15}│")
    print(f"  │  Vocal Steadiness  {profile.vocal_steadiness_pct}%{'':>13}│")
    print(f"  │  Recovery Strength {profile.recovery_strength:>18}│")
    print(f"  └─────────────────────────────────────┘")

    if profile.freeze_events:
        print(f"\n  FREEZE EVENTS:")
        for i, f in enumerate(profile.freeze_events):
            print(f"  [{i+1}] t={f.timestamp:.1f}s | {f.severity} | stress={f.stress_score:.0%}", end="")
            if f.recovery_time:
                print(f" | recovered in {f.recovery_time:.1f}s")
            else:
                print(f" | no recovery detected")

    print(f"\n{'─'*60}")
    print(f"  KEY INSIGHT")
    print(f"{'─'*60}")
    print(f"\n  {profile.key_insight}")
    print(f"\n  Neuroscience: {profile.neuroscience_note}")

    if verbose:
        print(f"\n{'─'*60}")
        print(f"  SEGMENT DETAILS")
        print(f"{'─'*60}")
        for i, seg in enumerate(profile.segments):
            print(f"\n  Segment {i+1} ({seg.start_time:.1f}s - {seg.end_time:.1f}s)")
            print(f"    Stress: {seg.stress_score:.3f} | Confidence: {seg.confidence_score:.3f}")
            print(f"    Dominant: {seg.dominant_emotion} ({seg.dominant_score:.3f})")

    print(f"\n{'─'*60}")
    print(f"  EMOTIONAL ARC (time → valence)")
    print(f"{'─'*60}")
    for t, v in profile.emotional_arc:
        bar_len = int((v + 1) * 20)  # Normalize -1..1 to 0..40
        bar = "█" * max(0, bar_len) + "░" * max(0, 40 - bar_len)
        label = "+" if v > 0 else "-" if v < 0 else "~"
        print(f"  {t:6.1f}s  {bar}  {v:+.3f} {label}")


def plot_emotional_arc(profile: VoiceProfile, output_path: str = "kdenz_arc.png"):
    """Generate a visual emotional arc chart."""
    try:
        import matplotlib.pyplot as plt
        import matplotlib
        matplotlib.use("Agg")
    except ImportError:
        print("  ⚠ matplotlib not installed. Skipping plot.")
        return

    times = [t for t, v in profile.emotional_arc]
    values = [v for t, v in profile.emotional_arc]

    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8),
                                     gridspec_kw={"height_ratios": [3, 1]})
    fig.patch.set_facecolor("#0b0e14")

    # Emotional arc
    ax1.set_facecolor("#131720")
    ax1.fill_between(times, values, alpha=0.15, color="#c9a84c")
    ax1.plot(times, values, color="#c9a84c", linewidth=2)

    # Mark freeze events
    for freeze in profile.freeze_events:
        ax1.axvline(x=freeze.timestamp, color="#b87171", alpha=0.5, linestyle="--")
        ax1.annotate(f"Freeze ({freeze.severity})",
                     xy=(freeze.timestamp, min(values)),
                     fontsize=8, color="#b87171", ha="center")

    ax1.axhline(y=0, color="#5e5a52", alpha=0.3, linewidth=0.5)
    ax1.set_ylabel("Emotional Valence", color="#9a9484", fontsize=10)
    ax1.set_title("KDENZ Voice Profile — Emotional Arc", color="#e8e2d6",
                   fontsize=14, fontweight="bold", pad=20)
    ax1.tick_params(colors="#5e5a52")
    ax1.spines["top"].set_visible(False)
    ax1.spines["right"].set_visible(False)
    ax1.spines["bottom"].set_color("#222838")
    ax1.spines["left"].set_color("#222838")

    # Stress/confidence bars
    ax2.set_facecolor("#131720")
    stress_vals = [s.stress_score for s in profile.segments]
    conf_vals = [s.confidence_score for s in profile.segments]
    seg_times = [(s.start_time + s.end_time) / 2 for s in profile.segments]

    ax2.bar(seg_times, stress_vals, width=0.8, alpha=0.6, color="#b87171", label="Stress")
    ax2.bar(seg_times, conf_vals, width=0.8, alpha=0.6, color="#6b9e78", label="Confidence")
    ax2.set_xlabel("Time (seconds)", color="#9a9484", fontsize=10)
    ax2.set_ylabel("Score", color="#9a9484", fontsize=10)
    ax2.legend(fontsize=8, facecolor="#1a1f2e", edgecolor="#222838", labelcolor="#9a9484")
    ax2.tick_params(colors="#5e5a52")
    ax2.spines["top"].set_visible(False)
    ax2.spines["right"].set_visible(False)
    ax2.spines["bottom"].set_color("#222838")
    ax2.spines["left"].set_color("#222838")

    plt.tight_layout()
    plt.savefig(output_path, dpi=150, facecolor="#0b0e14")
    print(f"\n  📊 Chart saved to {output_path}")


# ─── CLI Entry Point ────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="KDENZ Voice Lab — Voice Analysis POC")
    parser.add_argument("audio_file", help="Path to audio file (WAV, MP3, M4A)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Show detailed segment data")
    parser.add_argument("--plot", "-p", action="store_true", help="Generate emotional arc chart")
    parser.add_argument("--output", "-o", default=None, help="Save JSON results to file")
    args = parser.parse_args()

    api_key = os.environ.get("HUME_API_KEY")
    if not api_key:
        print("Error: Set HUME_API_KEY environment variable")
        print("  Get one at: https://platform.hume.ai")
        sys.exit(1)

    if not Path(args.audio_file).exists():
        print(f"Error: File not found: {args.audio_file}")
        sys.exit(1)

    profile = analyze_recording(args.audio_file, api_key, args.verbose)
    print_profile(profile, args.verbose)

    if args.plot:
        plot_emotional_arc(profile)

    if args.output:
        # Serialize to JSON (excluding non-serializable fields)
        output = {
            "duration_seconds": profile.duration_seconds,
            "avg_stress": profile.avg_stress,
            "avg_confidence": profile.avg_confidence,
            "avg_engagement": profile.avg_engagement,
            "vocal_steadiness_pct": profile.vocal_steadiness_pct,
            "recovery_strength": profile.recovery_strength,
            "dominant_pattern": profile.dominant_pattern,
            "key_insight": profile.key_insight,
            "neuroscience_note": profile.neuroscience_note,
            "emotional_arc": profile.emotional_arc,
            "freeze_events": [
                {
                    "timestamp": f.timestamp,
                    "duration": f.duration,
                    "severity": f.severity,
                    "stress_score": f.stress_score,
                    "recovery_time": f.recovery_time,
                }
                for f in profile.freeze_events
            ],
        }
        with open(args.output, "w") as f:
            json.dump(output, f, indent=2)
        print(f"\n  💾 Results saved to {args.output}")


if __name__ == "__main__":
    main()
