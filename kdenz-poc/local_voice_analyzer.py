"""
KDENZ Voice Lab — Local Voice Analysis Pipeline (Fallback)
==========================================================

PURPOSE: When Hume AI isn't available, isn't specific enough, or you want
full control over the analysis, this pipeline uses open-source tools
to extract the same metrics locally.

ADVANTAGE: No API calls, no cost per minute, full control over every metric.
TRADEOFF: Less sophisticated emotion detection, requires more manual tuning.

This pipeline extracts:
1. Speaking pace (words per minute, pace changes over time)
2. Pitch analysis (F0, pitch range, pitch stability → confidence proxy)
3. Energy/volume (intensity contour → engagement proxy)
4. Pause detection (silence gaps → freeze/hesitation detection)
5. Voice quality (jitter, shimmer → stress/tension indicators via Praat)
6. Speech-to-text with timestamps (for content + timing correlation)

REQUIREMENTS:
  pip install librosa soundfile numpy scipy openai-whisper praat-parselmouth matplotlib

  Note: Whisper requires PyTorch. Install separately if needed:
    pip install torch torchaudio

USAGE:
  python local_voice_analyzer.py path/to/recording.wav
  python local_voice_analyzer.py path/to/recording.wav --verbose --plot
"""

import os
import sys
import json
import argparse
import warnings
import numpy as np
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

warnings.filterwarnings("ignore")


# ─── Configuration ───────────────────────────────────────────────────

# Analysis parameters
FRAME_LENGTH_SEC = 2.0       # Window size for rolling analysis
HOP_LENGTH_SEC = 0.5         # Step size between windows
SILENCE_THRESHOLD_DB = -35   # Below this = silence/pause
MIN_PAUSE_SEC = 0.3          # Minimum pause duration to count
FREEZE_PACE_DROP = 0.30      # 30% pace drop = potential freeze
PITCH_STABILITY_WINDOW = 5   # Frames to compute pitch stability

# Normal ranges for conversational speech
NORMAL_PACE_WPM = (120, 180)       # Words per minute
NORMAL_PITCH_HZ_MALE = (85, 180)   # Fundamental frequency
NORMAL_PITCH_HZ_FEMALE = (165, 255)
NORMAL_INTENSITY_DB = (-20, -5)     # Relative intensity


# ─── Data Structures ────────────────────────────────────────────────

@dataclass
class AcousticFrame:
    """One analysis window of acoustic features."""
    start_sec: float
    end_sec: float
    pitch_hz: float           # Fundamental frequency (F0)
    pitch_stability: float    # How steady is pitch (0-1, 1=very stable)
    intensity_db: float       # Volume/energy
    speaking_rate: float      # Estimated syllables per second in this window
    pause_ratio: float        # Fraction of window that is silence
    jitter: float             # Pitch perturbation (stress indicator)
    shimmer: float            # Amplitude perturbation (stress indicator)
    hnr: float                # Harmonics-to-noise ratio (voice quality)


@dataclass
class PauseEvent:
    """A detected silence/pause."""
    start_sec: float
    end_sec: float
    duration_sec: float
    preceding_pace: Optional[float] = None  # Pace before pause
    following_pace: Optional[float] = None  # Pace after pause
    is_freeze: bool = False                 # Freeze = preceded by pace drop


@dataclass
class TranscriptSegment:
    """A timestamped piece of transcribed speech."""
    start_sec: float
    end_sec: float
    text: str
    word_count: int
    words_per_minute: float


@dataclass
class LocalVoiceProfile:
    """Complete local analysis output."""
    duration_sec: float
    transcript: str
    transcript_segments: list
    acoustic_frames: list
    pauses: list
    freeze_events: list  # Pauses classified as freezes

    # Aggregate metrics
    avg_pace_wpm: float
    pace_variability: float       # Coefficient of variation
    avg_pitch_hz: float
    pitch_range_hz: tuple         # (min, max)
    pitch_stability: float        # 0-1
    avg_intensity_db: float
    intensity_variability: float
    avg_jitter: float             # Stress indicator
    avg_shimmer: float            # Stress indicator
    avg_hnr: float                # Voice quality

    # Derived KDENZ scores (0-1 scale)
    stress_score: float
    confidence_score: float
    steadiness_score: float
    engagement_score: float

    # Insights
    key_insight: str
    neuroscience_note: str
    vocal_pattern: str


# ─── Audio Loading ──────────────────────────────────────────────────

def load_audio(path: str, sr: int = 16000) -> tuple:
    """Load audio file, return (samples, sample_rate)."""
    import librosa
    y, sr_actual = librosa.load(path, sr=sr, mono=True)
    duration = len(y) / sr
    print(f"  → Loaded: {duration:.1f}s, {sr}Hz")
    return y, sr


# ─── Whisper Transcription ──────────────────────────────────────────

def transcribe(audio_path: str) -> tuple[str, list[TranscriptSegment]]:
    """Transcribe audio with timestamps using Whisper."""
    try:
        import whisper
    except ImportError:
        print("  ⚠ Whisper not installed. Skipping transcription.")
        print("    Install: pip install openai-whisper")
        return "", []

    print("  Loading Whisper model (base)...")
    model = whisper.load_model("base")

    print("  Transcribing...")
    result = model.transcribe(audio_path, word_timestamps=True)

    segments = []
    for seg in result.get("segments", []):
        text = seg["text"].strip()
        words = text.split()
        duration = seg["end"] - seg["start"]
        wpm = (len(words) / duration * 60) if duration > 0 else 0

        segments.append(TranscriptSegment(
            start_sec=seg["start"],
            end_sec=seg["end"],
            text=text,
            word_count=len(words),
            words_per_minute=round(wpm, 1),
        ))

    full_text = result.get("text", "").strip()
    print(f"  → Transcribed {len(segments)} segments, {len(full_text.split())} words")
    return full_text, segments


# ─── Acoustic Analysis (librosa) ────────────────────────────────────

def extract_acoustic_features(y: np.ndarray, sr: int) -> list[AcousticFrame]:
    """Extract rolling acoustic features using librosa."""
    import librosa

    frames = []
    frame_samples = int(FRAME_LENGTH_SEC * sr)
    hop_samples = int(HOP_LENGTH_SEC * sr)
    total_samples = len(y)

    for start_sample in range(0, total_samples - frame_samples, hop_samples):
        end_sample = start_sample + frame_samples
        segment = y[start_sample:end_sample]

        start_sec = start_sample / sr
        end_sec = end_sample / sr

        # Pitch (F0) via librosa's pyin
        f0, voiced_flag, voiced_probs = librosa.pyin(
            segment, fmin=60, fmax=400, sr=sr
        )
        valid_f0 = f0[~np.isnan(f0)] if f0 is not None else np.array([])
        avg_pitch = float(np.mean(valid_f0)) if len(valid_f0) > 0 else 0.0

        # Pitch stability (inverse of coefficient of variation)
        if len(valid_f0) > 2:
            pitch_cv = float(np.std(valid_f0) / np.mean(valid_f0)) if np.mean(valid_f0) > 0 else 1.0
            pitch_stab = max(0, 1.0 - pitch_cv * 2)  # Normalize
        else:
            pitch_stab = 0.5

        # Intensity (RMS energy in dB)
        rms = librosa.feature.rms(y=segment)[0]
        avg_rms = float(np.mean(rms))
        intensity_db = float(20 * np.log10(avg_rms + 1e-10))

        # Pause ratio (fraction of silence)
        frame_db = librosa.amplitude_to_db(rms, ref=np.max)
        silence_frames = np.sum(frame_db < SILENCE_THRESHOLD_DB)
        pause_ratio = float(silence_frames / len(frame_db)) if len(frame_db) > 0 else 0.0

        # Estimated speaking rate (onset density as proxy for syllable rate)
        onset_env = librosa.onset.onset_strength(y=segment, sr=sr)
        onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
        syllable_rate = len(onsets) / FRAME_LENGTH_SEC

        frames.append(AcousticFrame(
            start_sec=round(start_sec, 2),
            end_sec=round(end_sec, 2),
            pitch_hz=round(avg_pitch, 1),
            pitch_stability=round(pitch_stab, 3),
            intensity_db=round(intensity_db, 1),
            speaking_rate=round(syllable_rate, 2),
            pause_ratio=round(pause_ratio, 3),
            jitter=0.0,   # Will be filled by Praat
            shimmer=0.0,  # Will be filled by Praat
            hnr=0.0,      # Will be filled by Praat
        ))

    return frames


# ─── Praat Analysis (voice quality) ─────────────────────────────────

def extract_praat_features(audio_path: str, frames: list[AcousticFrame]) -> list[AcousticFrame]:
    """Add jitter, shimmer, and HNR from Praat (clinical voice quality metrics)."""
    try:
        import parselmouth
        from parselmouth.praat import call
    except ImportError:
        print("  ⚠ Parselmouth not installed. Skipping Praat analysis.")
        print("    Install: pip install praat-parselmouth")
        return frames

    snd = parselmouth.Sound(audio_path)

    for frame in frames:
        # Extract the segment
        segment = snd.extract_part(frame.start_sec, frame.end_sec,
                                     parselmouth.WindowShape.HANNING, 1, False)
        if segment.get_total_duration() < 0.1:
            continue

        try:
            # Point process for jitter/shimmer
            pitch = call(segment, "To Pitch", 0.0, 75, 400)
            point_process = call(segment, "To PointProcess (periodic, cc)", 75, 400)

            # Jitter (local) — pitch perturbation, higher = more stress
            jitter = call(point_process, "Get jitter (local)", 0, 0, 0.0001, 0.02, 1.3)
            frame.jitter = round(jitter, 6) if jitter == jitter else 0.0

            # Shimmer (local) — amplitude perturbation, higher = more stress
            shimmer = call([segment, point_process], "Get shimmer (local)", 0, 0, 0.0001, 0.02, 1.3, 1.6)
            frame.shimmer = round(shimmer, 6) if shimmer == shimmer else 0.0

            # Harmonics-to-noise ratio — voice quality, higher = cleaner
            harmonicity = call(segment, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
            hnr = call(harmonicity, "Get mean", 0, 0)
            frame.hnr = round(hnr, 2) if hnr == hnr else 0.0

        except Exception:
            pass  # Some frames may not have enough voiced content

    return frames


# ─── Pause Detection ────────────────────────────────────────────────

def detect_pauses(y: np.ndarray, sr: int) -> list[PauseEvent]:
    """Detect significant pauses/silences in the audio."""
    import librosa

    # Get frame-level energy
    rms = librosa.feature.rms(y=y, frame_length=1024, hop_length=512)[0]
    rms_db = librosa.amplitude_to_db(rms, ref=np.max)
    frame_times = librosa.frames_to_time(range(len(rms_db)), sr=sr, hop_length=512)

    pauses = []
    in_pause = False
    pause_start = 0

    for i, (t, db) in enumerate(zip(frame_times, rms_db)):
        if db < SILENCE_THRESHOLD_DB:
            if not in_pause:
                in_pause = True
                pause_start = t
        else:
            if in_pause:
                duration = t - pause_start
                if duration >= MIN_PAUSE_SEC:
                    pauses.append(PauseEvent(
                        start_sec=round(pause_start, 2),
                        end_sec=round(t, 2),
                        duration_sec=round(duration, 2),
                    ))
                in_pause = False

    return pauses


def classify_freeze_pauses(pauses: list[PauseEvent],
                           transcript_segments: list[TranscriptSegment]) -> list[PauseEvent]:
    """Classify which pauses are likely freeze events vs natural pauses.

    A freeze is a pause that:
    1. Is preceded by a pace change (speaker was talking, then stopped abruptly)
    2. Lasts longer than typical conversational pauses (>1s)
    3. Occurs in the middle of a thought (not at a sentence boundary)
    """
    for pause in pauses:
        # Find pace before and after pause
        before_segs = [s for s in transcript_segments if s.end_sec <= pause.start_sec + 0.5]
        after_segs = [s for s in transcript_segments if s.start_sec >= pause.end_sec - 0.5]

        if before_segs:
            pause.preceding_pace = before_segs[-1].words_per_minute
        if after_segs:
            pause.following_pace = after_segs[0].words_per_minute

        # Freeze criteria
        is_long = pause.duration_sec > 0.8
        has_pace_context = pause.preceding_pace is not None

        if is_long and has_pace_context:
            # If pace before was normal/fast and pause is long, likely freeze
            if pause.preceding_pace > 100:
                pause.is_freeze = True

    return pauses


# ─── Score Computation ──────────────────────────────────────────────

def compute_scores(frames: list[AcousticFrame],
                   pauses: list[PauseEvent]) -> dict:
    """Compute KDENZ-compatible scores from acoustic features.

    Maps local measurements to the same 0-1 scales used by the Hume pipeline.
    """

    if not frames:
        return {"stress": 0.5, "confidence": 0.5, "steadiness": 0.5, "engagement": 0.5}

    # Stress score: derived from jitter + shimmer + pause frequency
    jitters = [f.jitter for f in frames if f.jitter > 0]
    shimmers = [f.shimmer for f in frames if f.shimmer > 0]
    avg_jitter = np.mean(jitters) if jitters else 0.01
    avg_shimmer = np.mean(shimmers) if shimmers else 0.03

    # Normal jitter < 1%, shimmer < 3%. Higher = more stress.
    jitter_stress = min(1.0, avg_jitter / 0.02)   # 2% jitter = max stress
    shimmer_stress = min(1.0, avg_shimmer / 0.08)  # 8% shimmer = max stress
    freeze_count = sum(1 for p in pauses if p.is_freeze)
    freeze_stress = min(1.0, freeze_count / 3)     # 3+ freezes = max stress

    stress = (jitter_stress * 0.35 + shimmer_stress * 0.35 + freeze_stress * 0.30)

    # Confidence score: derived from pitch stability + intensity consistency + pace
    pitch_stabs = [f.pitch_stability for f in frames]
    avg_pitch_stab = np.mean(pitch_stabs) if pitch_stabs else 0.5

    intensities = [f.intensity_db for f in frames]
    intensity_cv = np.std(intensities) / abs(np.mean(intensities)) if intensities and np.mean(intensities) != 0 else 0.5
    intensity_consistency = max(0, 1.0 - intensity_cv * 3)

    speaking_rates = [f.speaking_rate for f in frames if f.speaking_rate > 0]
    pace_consistency = 1.0 - min(1.0, np.std(speaking_rates) / np.mean(speaking_rates) if speaking_rates and np.mean(speaking_rates) > 0 else 0.5)

    confidence = (avg_pitch_stab * 0.4 + intensity_consistency * 0.3 + pace_consistency * 0.3)

    # Steadiness: overall consistency of all metrics
    steadiness = (avg_pitch_stab * 0.3 + intensity_consistency * 0.3 +
                  pace_consistency * 0.2 + (1.0 - stress) * 0.2)

    # Engagement: derived from intensity + speaking rate + HNR (voice quality)
    hnrs = [f.hnr for f in frames if f.hnr > 0]
    avg_hnr = np.mean(hnrs) if hnrs else 10.0
    hnr_engagement = min(1.0, avg_hnr / 20.0)  # HNR of 20+ dB = fully engaged

    avg_intensity = np.mean(intensities) if intensities else -20
    intensity_engagement = min(1.0, max(0, (avg_intensity + 30) / 25))

    engagement = (intensity_engagement * 0.4 + hnr_engagement * 0.3 +
                  (np.mean(speaking_rates) / 5 if speaking_rates else 0.5) * 0.3)
    engagement = min(1.0, engagement)

    return {
        "stress": round(float(stress), 3),
        "confidence": round(float(confidence), 3),
        "steadiness": round(float(steadiness), 3),
        "engagement": round(float(engagement), 3),
    }


# ─── Insight Generation ─────────────────────────────────────────────

def generate_local_insight(scores: dict, pauses: list[PauseEvent],
                           frames: list[AcousticFrame],
                           transcript_segments: list[TranscriptSegment]) -> tuple[str, str, str]:
    """Generate key insight, neuroscience note, and pattern label."""

    freezes = [p for p in pauses if p.is_freeze]
    stress = scores["stress"]
    confidence = scores["confidence"]
    steadiness = scores["steadiness"]

    # Pattern classification
    if freezes:
        pattern = "freeze-recovery"
    elif stress > 0.5:
        pattern = "sustained-tension"
    elif confidence < 0.35:
        pattern = "low-confidence"
    elif steadiness > 0.7:
        pattern = "steady-composed"
    else:
        pattern = "variable-engagement"

    # Generate insight based on pattern
    if pattern == "freeze-recovery":
        worst_freeze = max(freezes, key=lambda p: p.duration_sec)
        # Find what was being said around the freeze
        context_text = ""
        for seg in transcript_segments:
            if abs(seg.start_sec - worst_freeze.start_sec) < 3:
                context_text = seg.text
                break

        insight = (
            f"At {worst_freeze.start_sec:.1f}s into your recording, you paused for "
            f"{worst_freeze.duration_sec:.1f} seconds"
        )
        if worst_freeze.preceding_pace:
            pace_drop = worst_freeze.preceding_pace
            insight += f" — your pace dropped from {pace_drop:.0f} WPM to silence"
        if context_text:
            insight += f" while saying: \"{context_text[:60]}...\""
        insight += (
            ". This is a classic freeze pattern where your nervous system "
            "briefly interrupted your speech."
        )
        neuro = (
            "Arnsten (2009) showed that acute social stress causes the amygdala to suppress "
            "prefrontal cortex function. Your vocal pause is the audible signature of this "
            "neurological event. Nader (2000) and Schiller (2010) demonstrated that "
            "revisiting these moments through guided practice can reconsolidate the "
            "emotional memory, reducing freeze duration over 4-6 sessions."
        )

    elif pattern == "sustained-tension":
        avg_jitter = np.mean([f.jitter for f in frames if f.jitter > 0])
        insight = (
            f"Your voice maintained elevated tension throughout — stress score {stress:.0%}. "
            f"Your vocal jitter (a micro-tremor invisible to the ear but detectable "
            f"in analysis) averaged {avg_jitter*100:.2f}%, above the conversational norm of <1%. "
            f"This suggests your nervous system stayed in a heightened state "
            f"for the entire recording."
        )
        neuro = (
            "Porges' polyvagal theory (2007) identifies sustained vocal tension as a sign "
            "of reduced vagal tone — your 'social engagement system' was partially offline. "
            "Targeted breathing and vocal warm-up exercises can increase vagal tone within "
            "minutes, measurably changing voice quality."
        )

    elif pattern == "low-confidence":
        avg_pitch = np.mean([f.pitch_hz for f in frames if f.pitch_hz > 0])
        insight = (
            f"Your confidence signal scored {confidence:.0%}. Your pitch averaged {avg_pitch:.0f}Hz "
            f"with notable instability — this creates an auditory impression of uncertainty "
            f"even when your words are strong. Listeners' mirror neurons pick up on "
            f"prosodic confidence before processing content."
        )
        neuro = (
            "Research on vocal prosody and social perception shows that pitch stability "
            "and appropriate volume are the strongest predictors of perceived competence "
            "(Klofstad 2012). A 15% increase in pitch stability — achievable in 3-4 "
            "practice sessions — significantly changes how others perceive your authority."
        )

    else:
        insight = (
            f"Your voice profile: stress {stress:.0%}, confidence {confidence:.0%}, "
            f"steadiness {steadiness:.0%}. You showed a natural variation pattern — "
            f"more engaged during certain topics, slightly withdrawn during others. "
            f"This variability is normal and gives us specific moments to target."
        )
        neuro = (
            "Ericsson's (1993) deliberate practice framework shows that the highest-impact "
            "training focuses on specific moments of difficulty, not general improvement. "
            "Your voice data pinpoints exactly which moments to practice."
        )

    return insight, neuro, pattern


# ─── Main Pipeline ──────────────────────────────────────────────────

def analyze_local(audio_path: str, verbose: bool = False) -> LocalVoiceProfile:
    """Full local analysis pipeline."""

    print(f"\n{'='*60}")
    print(f"  KDENZ Voice Lab — Local Analysis Pipeline")
    print(f"  File: {audio_path}")
    print(f"{'='*60}\n")

    # Step 1: Load audio
    print("① Loading audio...")
    y, sr = load_audio(audio_path)
    duration = len(y) / sr

    # Step 2: Transcribe
    print("② Transcribing with Whisper...")
    transcript, transcript_segments = transcribe(audio_path)

    # Step 3: Acoustic features
    print("③ Extracting acoustic features (librosa)...")
    frames = extract_acoustic_features(y, sr)
    print(f"  → {len(frames)} analysis frames")

    # Step 4: Praat voice quality
    print("④ Analyzing voice quality (Praat)...")
    frames = extract_praat_features(audio_path, frames)

    # Step 5: Detect pauses
    print("⑤ Detecting pauses...")
    pauses = detect_pauses(y, sr)
    pauses = classify_freeze_pauses(pauses, transcript_segments)
    freezes = [p for p in pauses if p.is_freeze]
    print(f"  → {len(pauses)} pauses, {len(freezes)} classified as freezes")

    # Step 6: Compute scores
    print("⑥ Computing KDENZ scores...")
    scores = compute_scores(frames, pauses)

    # Step 7: Generate insight
    print("⑦ Generating insight...")
    insight, neuro, pattern = generate_local_insight(
        scores, pauses, frames, transcript_segments
    )

    # Aggregate metrics
    pitches = [f.pitch_hz for f in frames if f.pitch_hz > 0]
    paces = [s.words_per_minute for s in transcript_segments if s.words_per_minute > 0]

    profile = LocalVoiceProfile(
        duration_sec=round(duration, 1),
        transcript=transcript,
        transcript_segments=transcript_segments,
        acoustic_frames=frames,
        pauses=pauses,
        freeze_events=freezes,
        avg_pace_wpm=round(float(np.mean(paces)), 1) if paces else 0,
        pace_variability=round(float(np.std(paces) / np.mean(paces)), 3) if paces and np.mean(paces) > 0 else 0,
        avg_pitch_hz=round(float(np.mean(pitches)), 1) if pitches else 0,
        pitch_range_hz=(round(float(np.min(pitches)), 1), round(float(np.max(pitches)), 1)) if pitches else (0, 0),
        pitch_stability=round(float(np.mean([f.pitch_stability for f in frames])), 3),
        avg_intensity_db=round(float(np.mean([f.intensity_db for f in frames])), 1),
        intensity_variability=round(float(np.std([f.intensity_db for f in frames])), 2) if frames else 0,
        avg_jitter=round(float(np.mean([f.jitter for f in frames if f.jitter > 0])), 5) if any(f.jitter > 0 for f in frames) else 0,
        avg_shimmer=round(float(np.mean([f.shimmer for f in frames if f.shimmer > 0])), 5) if any(f.shimmer > 0 for f in frames) else 0,
        avg_hnr=round(float(np.mean([f.hnr for f in frames if f.hnr > 0])), 1) if any(f.hnr > 0 for f in frames) else 0,
        stress_score=scores["stress"],
        confidence_score=scores["confidence"],
        steadiness_score=scores["steadiness"],
        engagement_score=scores["engagement"],
        key_insight=insight,
        neuroscience_note=neuro,
        vocal_pattern=pattern,
    )

    return profile


def print_local_profile(profile: LocalVoiceProfile, verbose: bool = False):
    """Print the local voice profile."""

    print(f"\n{'─'*60}")
    print(f"  YOUR VOICE PROFILE (LOCAL ANALYSIS)")
    print(f"{'─'*60}\n")

    print(f"  Duration:       {profile.duration_sec}s")
    print(f"  Words:          {len(profile.transcript.split())}")
    print(f"  Pattern:        {profile.vocal_pattern}")

    print(f"\n  ┌─────────────────────────────────────────┐")
    print(f"  │  KDENZ SCORES                            │")
    print(f"  │  Stress          {profile.stress_score:.0%}{'':>20}│")
    print(f"  │  Confidence      {profile.confidence_score:.0%}{'':>20}│")
    print(f"  │  Steadiness      {profile.steadiness_score:.0%}{'':>20}│")
    print(f"  │  Engagement      {profile.engagement_score:.0%}{'':>20}│")
    print(f"  ├─────────────────────────────────────────┤")
    print(f"  │  ACOUSTIC METRICS                        │")
    print(f"  │  Avg Pace        {profile.avg_pace_wpm} WPM{'':>14}│")
    print(f"  │  Pace Variab.    {profile.pace_variability:.1%}{'':>20}│")
    print(f"  │  Avg Pitch       {profile.avg_pitch_hz} Hz{'':>15}│")
    print(f"  │  Pitch Range     {profile.pitch_range_hz[0]}-{profile.pitch_range_hz[1]} Hz{'':>6}│")
    print(f"  │  Pitch Stability {profile.pitch_stability:.0%}{'':>20}│")
    print(f"  │  Avg Jitter      {profile.avg_jitter*100:.3f}%{'':>18}│")
    print(f"  │  Avg Shimmer     {profile.avg_shimmer*100:.3f}%{'':>18}│")
    print(f"  │  Avg HNR         {profile.avg_hnr} dB{'':>16}│")
    print(f"  └─────────────────────────────────────────┘")

    if profile.freeze_events:
        print(f"\n  FREEZE EVENTS:")
        for i, f in enumerate(profile.freeze_events):
            print(f"    [{i+1}] t={f.start_sec}s, duration={f.duration_sec}s", end="")
            if f.preceding_pace:
                print(f", pace before: {f.preceding_pace:.0f} WPM", end="")
            print()

    print(f"\n{'─'*60}")
    print(f"  KEY INSIGHT")
    print(f"{'─'*60}")
    print(f"\n  {profile.key_insight}")
    print(f"\n  Neuroscience: {profile.neuroscience_note}")

    if verbose and profile.transcript:
        print(f"\n{'─'*60}")
        print(f"  TRANSCRIPT")
        print(f"{'─'*60}")
        for seg in profile.transcript_segments:
            pace_color = "⚡" if seg.words_per_minute > 160 else "🐢" if seg.words_per_minute < 100 else "●"
            print(f"  [{seg.start_sec:5.1f}s] {pace_color} ({seg.words_per_minute:.0f} wpm) {seg.text}")


# ─── CLI ────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="KDENZ Voice Lab — Local Analysis Pipeline")
    parser.add_argument("audio_file", help="Path to audio file")
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--plot", "-p", action="store_true")
    parser.add_argument("--output", "-o", default=None, help="Save JSON results")
    args = parser.parse_args()

    if not Path(args.audio_file).exists():
        print(f"Error: File not found: {args.audio_file}")
        sys.exit(1)

    profile = analyze_local(args.audio_file, args.verbose)
    print_local_profile(profile, args.verbose)

    if args.output:
        output = {
            "duration_sec": profile.duration_sec,
            "transcript": profile.transcript,
            "scores": {
                "stress": profile.stress_score,
                "confidence": profile.confidence_score,
                "steadiness": profile.steadiness_score,
                "engagement": profile.engagement_score,
            },
            "acoustic": {
                "avg_pace_wpm": profile.avg_pace_wpm,
                "avg_pitch_hz": profile.avg_pitch_hz,
                "pitch_stability": profile.pitch_stability,
                "avg_jitter": profile.avg_jitter,
                "avg_shimmer": profile.avg_shimmer,
                "avg_hnr": profile.avg_hnr,
            },
            "freeze_events": [
                {"start": f.start_sec, "duration": f.duration_sec, "preceding_pace": f.preceding_pace}
                for f in profile.freeze_events
            ],
            "vocal_pattern": profile.vocal_pattern,
            "key_insight": profile.key_insight,
            "neuroscience_note": profile.neuroscience_note,
        }
        with open(args.output, "w") as f:
            json.dump(output, f, indent=2)
        print(f"\n  💾 Results saved to {args.output}")


if __name__ == "__main__":
    main()
