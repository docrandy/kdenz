"""
KDENZ Voice Lab -- Recording Script
=====================================
Records audio from the microphone and saves as WAV.

USAGE:
  python record_sample.py                    # Record 60 seconds
  python record_sample.py --duration 30      # Record 30 seconds
  python record_sample.py --list-devices     # List available audio devices
  python record_sample.py --device 1         # Use specific device
"""

import os
import sys
import time
import argparse
import numpy as np
from pathlib import Path

try:
    import sounddevice as sd
except ImportError:
    print("Error: sounddevice not installed. Run: pip install sounddevice")
    sys.exit(1)

try:
    import soundfile as sf
except ImportError:
    print("Error: soundfile not installed. Run: pip install soundfile")
    sys.exit(1)


SAMPLE_RATE = 16000  # 16kHz mono -- format both pipelines expect
CHANNELS = 1
SAMPLES_DIR = Path(__file__).parent / "samples"


def get_next_sample_path() -> Path:
    """Auto-increment sample filename: sample_01.wav, sample_02.wav, etc."""
    SAMPLES_DIR.mkdir(exist_ok=True)
    existing = sorted(SAMPLES_DIR.glob("sample_*.wav"))
    if existing:
        last_num = int(existing[-1].stem.split("_")[1])
        next_num = last_num + 1
    else:
        next_num = 1
    return SAMPLES_DIR / f"sample_{next_num:02d}.wav"


def list_devices():
    """Print available audio input devices."""
    print("\nAvailable audio devices:")
    print("=" * 60)
    devices = sd.query_devices()
    for i, dev in enumerate(devices):
        if dev["max_input_channels"] > 0:
            marker = " <-- DEFAULT" if i == sd.default.device[0] else ""
            print(f"  [{i}] {dev['name']} (inputs: {dev['max_input_channels']}){marker}")
    print()


def countdown(seconds: int = 3):
    """Show a countdown before recording starts."""
    print()
    for i in range(seconds, 0, -1):
        sys.stdout.write(f"\r  Starting in {i}...")
        sys.stdout.flush()
        time.sleep(1)
    sys.stdout.write("\r  RECORDING NOW!    \n\n")
    sys.stdout.flush()


def record(duration: int, device=None) -> tuple:
    """Record audio from microphone. Returns (audio_data, sample_rate)."""
    print(f"  Duration: {duration} seconds")
    print(f"  Format: {SAMPLE_RATE}Hz, mono, 16-bit")
    if device is not None:
        print(f"  Device: {device}")

    countdown(3)

    # Record with a live timer
    audio_data = sd.rec(
        int(duration * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype="float32",
        device=device,
    )

    start_time = time.time()
    try:
        while time.time() - start_time < duration:
            elapsed = time.time() - start_time
            remaining = duration - elapsed
            bar_len = 40
            filled = int(bar_len * elapsed / duration)
            bar = "#" * filled + "-" * (bar_len - filled)
            sys.stdout.write(f"\r  [{bar}] {elapsed:.0f}s / {duration}s  (remaining: {remaining:.0f}s)")
            sys.stdout.flush()
            time.sleep(0.5)
    except KeyboardInterrupt:
        sd.stop()
        elapsed = time.time() - start_time
        print(f"\n\n  Recording stopped early at {elapsed:.1f}s")
        # Trim to actual recorded length
        samples_recorded = int(elapsed * SAMPLE_RATE)
        audio_data = audio_data[:samples_recorded]
        return audio_data, SAMPLE_RATE

    sd.wait()  # Wait for recording to finish
    print(f"\r  [{'#' * bar_len}] {duration}s / {duration}s  DONE!              ")
    print()

    return audio_data, SAMPLE_RATE


def save_wav(audio_data: np.ndarray, sample_rate: int, path: Path):
    """Save audio data as WAV file."""
    sf.write(str(path), audio_data, sample_rate, subtype="PCM_16")
    size_kb = path.stat().st_size / 1024
    print(f"  Saved: {path}")
    print(f"  Size: {size_kb:.0f} KB")


def main():
    parser = argparse.ArgumentParser(description="KDENZ Voice Lab -- Record Audio Sample")
    parser.add_argument("--duration", "-d", type=int, default=60, help="Recording duration in seconds (default: 60)")
    parser.add_argument("--device", type=int, default=None, help="Audio input device index")
    parser.add_argument("--list-devices", "-l", action="store_true", help="List available audio devices")
    parser.add_argument("--output", "-o", type=str, default=None, help="Custom output path (overrides auto-increment)")
    args = parser.parse_args()

    if args.list_devices:
        list_devices()
        return

    print()
    print("=" * 60)
    print("  KDENZ Voice Lab -- Audio Recording")
    print("=" * 60)
    print()

    # Determine output path
    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
    else:
        out_path = get_next_sample_path()

    print(f"  Output: {out_path}")

    # Quick device check
    try:
        dev_info = sd.query_devices(args.device or sd.default.device[0], "input")
        print(f"  Microphone: {dev_info['name']}")
    except Exception as e:
        print(f"  Warning: Could not query device: {e}")
        print("  Run with --list-devices to see available inputs")

    print()
    input("  Press ENTER when ready to record...")

    # Record
    audio_data, sr = record(args.duration, device=args.device)

    # Check audio level
    peak = np.max(np.abs(audio_data))
    rms = np.sqrt(np.mean(audio_data ** 2))
    print(f"  Peak level: {peak:.3f}")
    print(f"  RMS level: {rms:.4f}")
    if peak < 0.01:
        print("  WARNING: Audio level very low. Check microphone connection.")
    elif peak > 0.95:
        print("  WARNING: Audio may be clipping. Move further from microphone.")
    else:
        print("  Audio levels look good.")

    print()

    # Save
    save_wav(audio_data, sr, out_path)

    print()
    print(f"  Ready for analysis:")
    print(f"    python hume_voice_analyzer.py {out_path} --verbose --plot")
    print(f"    python local_voice_analyzer.py {out_path} --verbose --plot")
    print()


if __name__ == "__main__":
    main()
