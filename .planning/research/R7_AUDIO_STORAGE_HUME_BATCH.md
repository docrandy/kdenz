# R7: Audio Storage Strategy for Hume.ai Batch Processing

**Source:** Perplexity Deep Research, 2026-02-13
**Prompt:** R7 from `docs/RESEARCH_PROMPTS.md`

---

## TL;DR

Convert to WAV client-side, upload to Supabase Storage as temporary buffer, send to Hume via Edge Function, delete after processing.

---

## 1. WebM to WAV/PCM Conversion: Client-Side vs Server-Side

### Can Hume.ai handle WebM directly?

Check Hume's current docs, but historically batch APIs prefer:
- **WAV (PCM 16-bit, 16kHz, mono)** — universally supported
- **MP3** — common fallback
- **WebM/Opus** — less common for speech analysis APIs

### Recommendation: Convert to WAV client-side because:
- **Format certainty** — You control the exact format Hume receives
- **No server processing** — Serverless functions have limited audio codec support
- **Smaller payload** — 16kHz mono is smaller than stereo 48kHz WebM
- **Privacy** — Audio never leaves browser in original format

### Client-Side Conversion: MediaRecorder to WAV

```typescript
// 1. Record as WAV directly (best option)
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    channelCount: 1,        // Mono
    sampleRate: 16000,      // 16kHz (Hume's preferred rate)
    echoCancellation: true,
    noiseSuppression: true
  }
});

const mediaRecorder = new MediaRecorder(stream, {
  mimeType: 'audio/webm;codecs=opus',  // Browser support varies
  audioBitsPerSecond: 128000
});

// 2. Collect chunks
const audioChunks: Blob[] = [];
mediaRecorder.ondataavailable = (event) => {
  audioChunks.push(event.data);
};

mediaRecorder.onstop = async () => {
  const webmBlob = new Blob(audioChunks, { type: 'audio/webm' });

  // Convert to WAV
  const wavBlob = await convertToWAV(webmBlob);

  // Upload to storage
  await uploadAudio(wavBlob);
};
```

### WAV Conversion Library: `audiobuffer-to-wav`

```bash
npm install audiobuffer-to-wav
```

```typescript
import audioBufferToWav from 'audiobuffer-to-wav';

async function convertToWAV(webmBlob: Blob): Promise<Blob> {
  // 1. Create AudioContext
  const audioContext = new AudioContext({ sampleRate: 16000 });

  // 2. Decode WebM to AudioBuffer
  const arrayBuffer = await webmBlob.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  // 3. Convert to mono if stereo
  let monoBuffer: AudioBuffer;
  if (audioBuffer.numberOfChannels > 1) {
    monoBuffer = convertToMono(audioBuffer);
  } else {
    monoBuffer = audioBuffer;
  }

  // 4. Resample to 16kHz if needed
  const resampledBuffer = audioContext.sampleRate !== 16000
    ? await resampleAudioBuffer(monoBuffer, 16000)
    : monoBuffer;

  // 5. Convert to WAV
  const wavArrayBuffer = audioBufferToWav(resampledBuffer);

  return new Blob([wavArrayBuffer], { type: 'audio/wav' });
}

function convertToMono(audioBuffer: AudioBuffer): AudioBuffer {
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;

  const monoBuffer = new AudioContext().createBuffer(1, length, sampleRate);
  const monoData = monoBuffer.getChannelData(0);

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let channel = 0; channel < numberOfChannels; channel++) {
      sum += audioBuffer.getChannelData(channel)[i];
    }
    monoData[i] = sum / numberOfChannels;
  }

  return monoBuffer;
}

async function resampleAudioBuffer(
  audioBuffer: AudioBuffer,
  targetSampleRate: number
): Promise<AudioBuffer> {
  const offlineContext = new OfflineAudioContext(
    1,  // mono
    audioBuffer.duration * targetSampleRate,
    targetSampleRate
  );

  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start(0);

  return await offlineContext.startRendering();
}
```

### Alternative: Use lamejs for MP3

```bash
npm install lamejs
```

```typescript
import lamejs from 'lamejs';

function convertToMP3(audioBuffer: AudioBuffer): Blob {
  const mp3encoder = new lamejs.Mp3Encoder(1, 16000, 128);

  const samples = audioBuffer.getChannelData(0);
  const sampleBlockSize = 1152;
  const mp3Data: Int8Array[] = [];

  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = samples.subarray(i, i + sampleBlockSize);
    const mp3buf = mp3encoder.encodeBuffer(convertFloat32ToInt16(sampleChunk));
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }
  }

  const mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }

  return new Blob(mp3Data, { type: 'audio/mp3' });
}

function convertFloat32ToInt16(buffer: Float32Array): Int16Array {
  const int16 = new Int16Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16;
}
```

**Recommendation:** Use WAV (simpler, lossless, universally supported for speech APIs)

---

## 2. Storage Strategy: Direct Upload vs Temporary Storage

### Option A: Direct to Hume (No Storage)

```typescript
async function processAudioDirectly(wavBlob: Blob) {
  const formData = new FormData();
  formData.append('file', wavBlob, 'recording.wav');
  formData.append('models', JSON.stringify({ prosody: {} }));

  const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': HUME_API_KEY  // Never in client!
    },
    body: formData
  });

  const { job_id } = await response.json();
  const results = await pollHumeJob(job_id);
  return results;
}
```

**Problem:** API key exposed in client code — not secure.

### Option B: Upload to Supabase Storage, Process Server-Side (Recommended)

```typescript
// Client: Upload to Supabase Storage
async function uploadAudioForProcessing(
  wavBlob: Blob,
  sessionId: string,
  userId: string
): Promise<string> {

  const supabase = createClient(/* public URL, anon key */);

  const fileName = `${userId}/${sessionId}.wav`;

  const { data, error } = await supabase.storage
    .from('session-audio')
    .upload(fileName, wavBlob, {
      contentType: 'audio/wav',
      upsert: false
    });

  if (error) throw error;

  return data.path;
}

// Server: Edge Function processes audio
// File: supabase/functions/process-audio/index.ts
import { createClient } from '@supabase/supabase-js';

Deno.serve(async (req) => {
  const { sessionId, userId, audioPath } = await req.json();

  // 1. Download audio from Supabase Storage
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data: audioBlob } = await supabase.storage
    .from('session-audio')
    .download(audioPath);

  // 2. Send to Hume.ai
  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.wav');
  formData.append('models', JSON.stringify({
    prosody: {},
    language: {}
  }));

  const humeResponse = await fetch('https://api.hume.ai/v0/batch/jobs', {
    method: 'POST',
    headers: {
      'X-Hume-Api-Key': Deno.env.get('HUME_API_KEY')!
    },
    body: formData
  });

  const { job_id } = await humeResponse.json();

  // 3. Poll for results (or set up webhook)
  const results = await pollHumeJob(job_id);

  // 4. Save results to database
  await supabase.from('session_analyses').insert({
    session_id: sessionId,
    user_id: userId,
    hume_results: results,
    avg_stress: extractMetric(results, 'Stress'),
    avg_confidence: extractMetric(results, 'Confidence'),
    avg_engagement: extractMetric(results, 'Engagement')
  });

  // 5. Delete audio file (privacy)
  await supabase.storage
    .from('session-audio')
    .remove([audioPath]);

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

### Supabase Storage Bucket Setup

```sql
-- Create bucket (via Supabase dashboard or SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('session-audio', 'session-audio', false);  -- Private bucket

-- RLS policy: Users can only upload their own audio
CREATE POLICY "Users can upload own audio"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'session-audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS policy: Users can read their own audio (for playback)
CREATE POLICY "Users can download own audio"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'session-audio' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- RLS policy: Service role can delete (cleanup)
CREATE POLICY "Service can delete audio"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'session-audio');
```

---

## 3. Privacy Implications & User Communication

### What to Disclose

**Required (GDPR/CCPA baseline):**

```text
## How We Handle Your Voice Recordings

**What we collect:**
- Voice recordings of your practice sessions (30 seconds to 5 minutes)
- Analyzed speech patterns (pace, filler words, confidence levels)

**How we use it:**
- Voice recordings are sent to Hume.ai (our speech analysis partner) to measure stress, confidence, and engagement
- Analysis results are stored to track your progress
- **Original audio files are automatically deleted after analysis** (within 24 hours)

**Your rights:**
- You can delete any session (and its analysis) at any time
- You can request deletion of all your data
- You can export your session data

**Third-party sharing:**
- Hume.ai (speech analysis) — see their privacy policy: [link]
- No other third parties have access to your voice recordings
```

### Privacy-Enhancing Implementation

```typescript
// 1. Consent before first recording
const [hasRecordingConsent, setHasRecordingConsent] = useState(false);

function RecordingConsentModal() {
  return (
    <Modal open={!hasRecordingConsent}>
      <h2>Voice Recording Consent</h2>
      <p>
        To analyze your speaking patterns, we need to record your voice.
        Recordings are processed by our speech analysis partner (Hume.ai)
        and automatically deleted within 24 hours.
      </p>
      <p>
        <strong>You can delete any recording at any time.</strong>
      </p>
      <Checkbox onChange={(checked) => {
        if (checked) {
          localStorage.setItem('recording_consent', 'true');
          setHasRecordingConsent(true);
        }
      }}>
        I consent to voice recording for speech analysis
      </Checkbox>
    </Modal>
  );
}

// 2. Auto-delete after processing
async function processAudio(sessionId: string) {
  try {
    await callEdgeFunction('process-audio', { sessionId });
  } catch (error) {
    // If processing fails, still delete after 24h
    await supabase.storage
      .from('session-audio')
      .remove([`${userId}/${sessionId}.wav`]);
  }
}

// 3. User-triggered deletion
async function deleteSession(sessionId: string) {
  await supabase
    .from('practice_sessions')
    .delete()
    .eq('id', sessionId);

  // Cascading delete removes session_analyses via FK

  await supabase.storage
    .from('session-audio')
    .remove([`${userId}/${sessionId}.wav`]);
}
```

### Automated Cleanup (Scheduled Supabase Function)

```typescript
// File: supabase/functions/cleanup-old-audio/index.ts
// Run daily via cron: 0 0 * * * (midnight UTC)

Deno.serve(async () => {
  const supabase = createClient(/* service role */);

  const { data: files } = await supabase.storage
    .from('session-audio')
    .list();

  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);

  const filesToDelete = files.filter(file => {
    const createdAt = new Date(file.created_at).getTime();
    return createdAt < oneDayAgo;
  });

  if (filesToDelete.length > 0) {
    await supabase.storage
      .from('session-audio')
      .remove(filesToDelete.map(f => f.name));

    console.log(`Deleted ${filesToDelete.length} old audio files`);
  }

  return new Response('Cleanup complete');
});
```

---

## 4. Browser Audio Format Conversion Libraries

### Recommended Stack

| Library | Purpose | Size | Notes |
|---------|---------|------|-------|
| `audiobuffer-to-wav` | AudioBuffer to WAV | 2KB | Simple, no dependencies |
| `lamejs` | AudioBuffer to MP3 | 150KB | If MP3 preferred over WAV |
| `@ffmpeg/ffmpeg` | Universal conversion | 25MB+ | Overkill for simple use case |
| Built-in `AudioContext` | Resampling, mono conversion | 0KB | Native browser API |

**Recommendation:** `audiobuffer-to-wav` + native `AudioContext` for resampling/mono

### Full Example: Record, Convert, Upload

```typescript
import audioBufferToWav from 'audiobuffer-to-wav';
import { createClient } from '@supabase/supabase-js';

class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true
      }
    });

    this.mediaRecorder = new MediaRecorder(this.stream, {
      mimeType: 'audio/webm;codecs=opus'
    });

    this.audioChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.start();
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      this.mediaRecorder!.onstop = async () => {
        const webmBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const wavBlob = await this.convertToWAV(webmBlob);

        this.stream?.getTracks().forEach(track => track.stop());

        resolve(wavBlob);
      };

      this.mediaRecorder!.stop();
    });
  }

  private async convertToWAV(webmBlob: Blob): Promise<Blob> {
    const audioContext = new AudioContext({ sampleRate: 16000 });
    const arrayBuffer = await webmBlob.arrayBuffer();
    let audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    if (audioBuffer.numberOfChannels > 1) {
      audioBuffer = this.convertToMono(audioBuffer);
    }

    const wavArrayBuffer = audioBufferToWav(audioBuffer);
    return new Blob([wavArrayBuffer], { type: 'audio/wav' });
  }

  private convertToMono(audioBuffer: AudioBuffer): AudioBuffer {
    const context = new AudioContext();
    const monoBuffer = context.createBuffer(
      1,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    const monoData = monoBuffer.getChannelData(0);
    const numChannels = audioBuffer.numberOfChannels;

    for (let i = 0; i < audioBuffer.length; i++) {
      let sum = 0;
      for (let channel = 0; channel < numChannels; channel++) {
        sum += audioBuffer.getChannelData(channel)[i];
      }
      monoData[i] = sum / numChannels;
    }

    return monoBuffer;
  }

  async uploadToSupabase(
    wavBlob: Blob,
    sessionId: string,
    userId: string
  ): Promise<string> {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fileName = `${userId}/${sessionId}.wav`;

    const { data, error } = await supabase.storage
      .from('session-audio')
      .upload(fileName, wavBlob, {
        contentType: 'audio/wav',
        upsert: false
      });

    if (error) throw error;

    return data.path;
  }
}

// Usage
const recorder = new AudioRecorder();

await recorder.startRecording();
// ... user practices ...
const wavBlob = await recorder.stopRecording();
const audioPath = await recorder.uploadToSupabase(wavBlob, sessionId, userId);

// Trigger server-side Hume processing
await fetch('/api/process-audio', {
  method: 'POST',
  body: JSON.stringify({ sessionId, audioPath })
});
```

---

## 5. File Size Expectations

### WAV PCM 16-bit, 16kHz, Mono

**Formula:**
```
Size (bytes) = sample_rate x bit_depth/8 x channels x duration_seconds
```

**Example (5 minutes):**
```
= 16,000 Hz x 2 bytes x 1 channel x 300 seconds
= 9,600,000 bytes = 9.6 MB
```

| Duration | 16kHz Mono PCM | 16kHz Mono MP3 (128kbps) |
|----------|---------------|-------------------------|
| 30 sec | 960 KB | ~480 KB |
| 1 min | 1.9 MB | ~960 KB |
| 3 min | 5.8 MB | ~2.9 MB |
| 5 min | 9.6 MB | ~4.8 MB |

### Network Implications
- Typical upload speed (home WiFi): 10-50 Mbps = 1.25-6.25 MB/s
- 5-minute WAV (9.6 MB) upload time: 1.5-8 seconds
- Acceptable UX: Add progress bar, "Analyzing your session..." message

**Recommendation:** Start with WAV (lossless), switch to MP3 only if file sizes become problematic

---

## 6. Complete Workflow Diagram

```
+-------------------------------------------------------------+
| 1. User Records (Browser)                                   |
|    MediaRecorder API -> WebM/Opus blob                      |
+---------------------------+---------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| 2. Client-Side Conversion                                   |
|    WebM -> AudioBuffer -> Resample 16kHz -> Mono -> WAV     |
|    Library: audiobuffer-to-wav                               |
+---------------------------+---------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| 3. Upload to Supabase Storage                               |
|    Bucket: session-audio (private)                          |
|    Path: {userId}/{sessionId}.wav                           |
|    RLS: User can only upload own audio                      |
+---------------------------+---------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| 4. Trigger Edge Function                                    |
|    POST /functions/v1/process-audio                         |
|    Body: { sessionId, audioPath }                           |
+---------------------------+---------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| 5. Edge Function Processing                                 |
|    - Download audio from Supabase Storage                   |
|    - Send to Hume.ai Batch API (with API key)               |
|    - Poll for results (or wait for webhook)                 |
|    - Save results to session_analyses table                 |
|    - Delete audio file from storage (privacy)               |
+---------------------------+---------------------------------+
                            |
                            v
+-------------------------------------------------------------+
| 6. Client Receives Results                                  |
|    Display prosody scores, run VCM diagnosis                |
+-------------------------------------------------------------+
```

---

## Final Recommendations

| Decision | Recommendation |
|----------|---------------|
| **Format** | Convert to WAV (PCM 16kHz mono) client-side using `audiobuffer-to-wav` |
| **Storage** | Upload to Supabase Storage as temporary buffer (delete after processing) |
| **Processing** | Use Supabase Edge Function to call Hume.ai (keeps API key secure) |
| **Privacy** | Auto-delete audio after 24 hours, disclose to users, allow manual deletion |
| **File sizes** | 5 min = ~9.6 MB (acceptable for modern web, add progress indicator) |
