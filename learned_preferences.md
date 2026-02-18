# Learned Preferences

## User Preferences & Complaints (Competitive Intelligence)

Captured 2026-02-16. Reference this when designing any practice feature UI.

| Feature | Why Users Love It | Common Complaints/Missing | Examples |
|---|---|---|---|
| Real-time filler/pause gauges | Instant "holy shit" awareness; visual trends motivate practice. | Inaccurate in noise; wants custom filler lists. | Orai, Ummo, Yoodli, VirtualSpeech |
| Playback with highlights | Review exact moments; boosts retention 3.5x per studies. | Clunky timelines; no speed control. | Yoodli, KDENZ-like |
| AI summaries & scores | Personalized coaching tips post-session. | Generic advice; paywall blocks access. | Orai, VirtualSpeech |
| Prompts/scenarios | Structured practice (e.g., pitches); gamification. | Limited variety; no user uploads. | VirtualSpeech, Hyperbound |
| Progress streaks/charts | Weekly trends, badges for return visits. | No export/share; resets on inactivity. | Ummo, LikeSo |

### Design Implications
- IF designing real-time feedback THEN ensure it works in noisy environments and allow custom filler word lists
- IF building playback THEN include speed control and clean timeline (not clunky)
- IF generating AI summaries THEN make advice specific to the user's actual performance, not generic tips
- IF creating scenarios THEN provide enough variety and consider user-uploaded scenarios
- IF tracking progress THEN never reset on inactivity; consider export/share options

---

## Emotion Labeling Research (Captured 2026-02-16)

Reference this when designing labeling practice, feedback systems, or any emotion-related UI.

### Core Insight
Emotion labels work best when they are context-rich, multi-dimensional, and anchored in clear annotation guidelines. "Superficial" labels tend to be sparse, decontextualized tags that hide disagreement and nuance.

### Superficial vs Effective Labeling

**Superficial labeling looks like:**
- Single categorical tag only (e.g., "happy", "angry") without intensity or polarity
- No access to conversational or situational context — only the isolated clip
- Few annotators, raw majority vote as ground truth, no attention to inter-rater reliability
- Large, flat label sets with minimal definitions, leading to fatigue and inconsistent use

**Effective labeling tends to:**
- Combine discrete categories with dimensional ratings (valence, arousal, sometimes dominance) — improves models and captures nuance
- Include intensity/strength ratings for each emotion, not just presence/absence
- Use multiple annotators and explicitly measure agreement (Cohen's kappa, Krippendorff's alpha, ICC), adjusting protocol when reliability is low
- Provide controlled context and clear rubrics so labels align with speakers' self-reports, while being mindful that too much context can bias judgments

**Trade-off:** Superficial labels are cheap and easy, but underrepresent mixed states, fail under ambiguous/low-intensity affect, and mask serious rater disagreement.

### Best Practices for Label Space Design

1. **Combine categorical + dimensional models** — Small, well-defined category set (joy, anger, sadness, fear, disgust, surprise, neutral) plus continuous valence/arousal ratings. Both categorical and dimensional supervision improves prediction and gives richer descriptions than either alone.

2. **Add intensity and complexity** — Include intensity scale (low/medium/high) per emotion. Expect co-occurring emotions; allow multi-label or probability distributions rather than forcing a single winner.

3. **Keep label set compact and operationalized** — Larger sets describe better but decrease agreement and increase fatigue. For each label, write a short operational definition and examples tailored to voice (prosody, tempo, loudness), not just generic emotion words.

4. **Align labels with application needs** — For real-time coaching/user-facing feedback, favor interpretable constructs (valence, arousal, layperson-friendly categories) over high-dimensional or obscure states. For clinical/research use, include dimensional ratings and probability distributions to reflect uncertainty and mixed affect.

### Best Practices for Annotation Procedure

1. **Multiple annotators + quantify agreement** — Crowdsourcing can be reliable for valence/arousal with 3-8 ratings per item (weaker for dominance). Measure IRR and tune rater count. Even expert reliability for complex constructs (empathy subcomponents) can be only moderate — treat labels as noisy, not absolute truth.

2. **Provide context, but control it** — Conversational/situational context makes labels closer to speakers' self-reports. But context and sample order can bias; randomize order, avoid showing too much prior labeling info.

3. **Train annotators and manage fatigue** — Continuous annotation (tracking valence/arousal over time) is cognitively demanding; train annotators, encourage breaks. Training needed to align rating timecourse with audio (avoid lag/misalignment).

4. **Capture uncertainty instead of forcing consensus** — Use rating distributions or soft labels so disagreement is preserved as signal, not discarded as noise. For ambiguous/low-intensity items, expect broader variance — treat as indicator that categories are less stable in that region.

### What Effective Labeling Enables

- **Finer-grained emotion trajectories** — Time-continuous annotation models how emotion fluctuates across a conversation (crucial for real-world speech work). Enables models that track emotional dynamics, not just clip-level tags.
- **Better generalization and hybrid modeling** — Methods learning arousal/valence guided by categorical labels achieve better performance. Hybrid representations align with how people actually perceive emotion (both categorical and dimensional).
- **More robust evaluation** — Explicit IRR metrics, rater counts, and attention to disagreement avoid over-trusting noisy labels. Superficial pipelines risk tuning models to annotator idiosyncrasies rather than stable phenomena.

### KDENZ Application (Voice Analytics / Coaching)

For KDENZ, strong labeling means:
- A compact set of user-friendly emotion/"tone" categories plus continuous valence/arousal scales and simple intensity ratings
- Multi-annotator labels with explicit reliability checks, especially for subjective tones (empathy, authority, warmth)
- Contextual annotation protocols (short transcript or scenario summary + audio) while randomizing sample order to limit bias
- Representation of uncertainty (probability over tones, confidence scores) instead of single over-confident emotion labels in UI

### Design Implications for Labeling Practice
- IF teaching users to label emotions THEN use context-rich scenarios, not isolated clips
- IF scoring label quality THEN evaluate on multiple dimensions (category + intensity + underlying driver), not just keyword match
- IF showing feedback THEN represent uncertainty/nuance — avoid presenting a single "correct" emotion as absolute truth
- IF building the label taxonomy THEN keep it compact, operationally defined, and voice-specific (prosody cues, not just words)
- IF tracking labeling skill THEN expect co-occurring emotions and reward users who identify mixed/complex states

---

## VAD Dimensional vs Categorical Labeling (Captured 2026-02-16)

Reference this when designing emotion representation, scoring, and feedback in labeling practice.

### VAD Dimensional Labeling

VAD represents emotions as points in a 3D space (typically 1-5 or 0-1 scales), allowing mixed or subtle states:

- **Valence (V):** Pleasantness — positive to negative (1=very negative, 5=very positive)
- **Arousal (A):** Activation/energy — calm to excited (1=calm, 5=excited)
- **Dominance (D):** Control/power — submissive to dominant (1=submissive, 5=dominant)

Enables unlimited combinations, e.g., low-V / high-A / low-D = fear.

### Categorical Labeling

Fixed labels from Ekman's basic set plus extensions:
- Common set: anger, joy/happiness, sadness, fear, disgust, surprise, neutral
- Can include multi-label for blends (e.g., joy + surprise)

### Comparison Table

| Emotion | Categorical | VAD (1-9 scale) | Interpretation |
|---|---|---|---|
| Joy/Happy | Joy | V=6.99, A=7.61, D=6.54 | High positive, high energy, strong control |
| Anger | Anger | V=~2, A=8.10, D=8.00 | Negative but energized and dominant |
| Sadness | Sad | V=0.225, A=~3, D=~4 | Very low pleasantness, subdued, moderate control |
| Fear | Fear | V=~2, A=~6, D=~2 | Negative, activated, but submissive |
| Neutral | Neutral | V=5, A=4, D=5 | Balanced, low energy, neutral control |

### Speech-Specific Notes

- High Arousal often links to faster tempo / louder speech
- Low Dominance often links to hesitant pitch contours
- VAD better handles gradients (mildly annoyed vs furious) and mixed emotions via vectors, unlike rigid categories
- Datasets like EmoTale use both: categorical (happy/sad/etc.) + VAD (1-5 scale per clip)

### Design Implications for KDENZ
- IF evaluating user's emotion label THEN score on VAD dimensions (did they capture valence? arousal? dominance?) not just category match
- IF teaching labeling THEN help users notice the difference between high-arousal anger vs low-arousal resentment (same category, different VAD)
- IF giving feedback on label quality THEN reward users who capture intensity/energy/control, not just the emotion name
- IF building advanced labeling practice THEN consider letting users rate VAD dimensions as a training exercise alongside verbal labels
- IF connecting to Hume prosody data THEN map Hume's arousal/valence outputs to VAD space for ground-truth comparison

---

## Emotion Labeling Training App Blueprint (Captured 2026-02-16)

Research-backed design for training users to label emotions reliably through interactive audio, guided rubrics, and agreement feedback. Sources: arxiv vocal biomarker research, EmoNet-Voice, annotation science literature.

### Core Features

- **Audio clips:** Short (3-30s), diverse speakers/languages/scenarios. Public datasets or synthetic generation for privacy.
- **Dual labeling modes:** Categorical (anger, joy, etc.) + VAD scales (1-5 per dimension) with intensity sliders.
- **Real-time vocal cue hints:** "Note rising pitch? Suggests arousal." Guide attention to prosodic markers.
- **LLM-assisted quality checks:** Pre-labels or consistency flags without replacing user judgment.

### Training Flow (Progressive Skill Building)

1. **Tutorial** — Definitions, examples, vocal cue videos (e.g., "High arousal: faster WPM, louder dB")
2. **Label 5-10 clips per session** — Immediate expert consensus score (e.g., "Your V=3.2 matches gold V=3.1")
3. **Calibration rounds** — Relabel clips where user disagreed with consensus; show why (e.g., "You rated low dominance — audio has steady tempo")
4. **Multi-rater simulation** — See 3-6 "peer" labels (aggregated from experts/LLM); practice spotting agreement patterns
5. **Advanced: Time-continuous labeling** — Track VAD over clip for dynamic speech

### Gamification & Feedback

- Streaks, badges for high agreement (e.g., "IRR Expert: kappa > 0.6")
- Track personal IRR improvement over time
- Leaderboards for anonymized accuracy on benchmarks
- Post-session debrief: "Your valence bias: +0.5 shift — try neutral baselines"
- Export: Certificates or portfolios for annotation credentials

### Recommended Label Schema (Hybrid)

| Component | Details | Why |
|---|---|---|
| Categorical | 6-8 basics (joy, anger, sadness, fear, neutral, etc.) + multi-select | Familiar; quick for beginners |
| VAD | 1-5 scales per dimension | Captures blends/gradients |
| Intensity | Low/Med/High per category | Handles subtlety |
| Confidence | User self-rate (1-5) | Builds metacognition |

Compact sets reduce fatigue; test with pilot users.

### Tech Stack Alignment (KDENZ)

- Frontend: React/Vercel (existing stack) + Chrome mic for labeling own speech
- Backend: Supabase for user progress; Gemini for synthetic peers/consensus simulation
- Dataset: Start with EmoNet-Voice Bench (40 emotions, intensities, expert-labeled); augment with synthetic via tonal prompts (authority, warmth, etc.)
- Metrics: Track user IRR (Cohen's kappa), bias (valence shift), labeling speed

### Validation Strategy

- Pilot with 10-20 users; measure pre/post IRR on held-out clips (aim +20% gain)
- A/B test label sets (small vs large); integrate user feedback loops
- Avoid bias: Diverse speakers/demographics; randomize clip order/context reveal

### Design Implications for KDENZ Labeling Practice
- IF building labeling training THEN use progressive flow (tutorial -> guided clips -> calibration -> peer simulation -> advanced continuous)
- IF measuring user skill THEN track IRR (kappa) against expert consensus, not just categorical accuracy
- IF providing feedback THEN show specific vocal cue explanations ("steady tempo = dominance"), not just "wrong"
- IF gamifying THEN tie rewards to agreement quality (IRR score), not speed or volume
- IF sourcing training clips THEN start with expert-labeled datasets, augment with Gemini-generated synthetic scenarios
- IF adding confidence self-rating THEN use it to build metacognition — users who know when they're uncertain improve faster
- IF users label their own speech THEN compare their self-label against Hume prosody + peer ratings for calibration

---

## Mirroring (Prosodic Entrainment) Research (Captured 2026-02-16)

Reference this when designing mirroring practice, dyadic analysis, or rapport-building features.

### Core Concept

Vocal mirroring (prosodic entrainment) = subconscious alignment of pitch, tempo, loudness, and pauses between speakers to build rapport. Labeling it requires segmenting dialogues, extracting acoustic features, and quantifying similarity over time.

### Superficial vs Effective Mirroring Labeling

**Superficial mirroring labeling:**
- Binary yes/no per dialogue pair, ignoring which feature or timing
- Single global score without baseline or normalization
- No context (e.g., turn-taking structure)

**Effective mirroring labeling:**
- Multi-feature (pitch F0, tempo WPM, energy dB, pause ratio) with continuous similarity metrics (correlation, DTW distance)
- Time-resolved: Track entrainment per turn or phrase
- Normalized against self (intra-speaker variability) to flag true convergence

### Mirroring Label Schema (Hierarchical)

| Level | Labels/Details | Metrics |
|---|---|---|
| Occurrence | Present / Absent / None | Threshold on r > 0.5 correlation |
| Feature | Pitch, Tempo, Loudness, Pauses (multi-select) | Pearson r or cosine sim per feature |
| Strength | Low / Med / High (or 1-5 scale) | Effect size (delta from baseline) |
| Timing | Leader-follower lag (0-5s), Mutual | Granger causality or cross-correlation lag |
| Context | Rapport-positive, Neutral, Discordant | Co-annotate with sentiment |

Compact 4-6 features reduce fatigue. Define via examples (e.g., "pitch rise mirroring within 2s").

### Best Practices for Mirroring Annotation

1. **Segment dialogues** into turns/phrases via diarization/ASR
2. **Auto-extract features** (praat-parselmouth, openSMILE); manual verify outliers
3. **3-5 annotators** rate similarity (scale + confidence); compute IRR (ICC for continuous)
4. **Provide transcript + waveform + prosody viz** (pitch/tempo tracks)
5. **Train on baselines:** Show non-mirroring vs entrainment examples
6. **Preserve uncertainty:** Soft scores or distributions over strengths
7. **Focus pitch/tempo** as strongest rapport signals for voice apps

### Emotions vs Mirroring: Comparison

| Aspect | Emotions (Hybrid VAD/Categorical) | Mirroring (Prosodic Entrainment) |
|---|---|---|
| Superficial | Single tag ("happy") | Binary (yes/no sync) |
| Effective | VAD scales + intensity + multi-label | Multi-feature correlation + lag + strength |
| Key Challenge | Subjectivity / mixed states | Needs pairs/sequences; auto-feature extraction |
| Metrics | kappa for categories, ICC for dimensions | r, DTW; normalize intra-speaker |
| Vocal Cues | Global prosody/emotion | Dynamic alignment over interaction |
| Datasets | EmoNet, IEMOCAP | Switchboard (prosody), custom dyads |

---

## Mirroring Training App Blueprint (Captured 2026-02-16)

Research-backed design for training users to detect and practice vocal mirroring (prosodic entrainment) in dyadic conversations.

### Core Features

- **Dialogue clips:** 2 speakers, 30-120s, from negotiations/podcasts
- **Visualization:** Overlaid pitch/tempo tracks; highlight potential sync points
- **Auto-prelabels:** Feature correlations computed automatically for calibration
- **Own-speech mode:** Record conversation, label self-partner sync

### Training Flow (Progressive Skill Building)

1. **Tutorial** — "Mirroring = convergence post-lead; e.g., Speaker A rises pitch, B matches in 1-3s"
2. **Label 5-10 dyads** — Select features, rate strength/lag per turn
3. **Feedback** — "Your r=0.62 on tempo matches expert 0.65; lag spot-on"
4. **Peer simulation** — Compare to 3 "raters"; practice consensus
5. **Own-speech** — Record conversation, label self-partner sync patterns

### Gamification & Feedback

- Badges: "Entrainment Pro (ICC > 0.7)"; track feature mastery per prosodic dimension
- Leaderboards on dyad benchmarks
- Post-session debrief: Feature-specific accuracy breakdown

### Tech Stack Alignment (KDENZ)

- Frontend: React/Vercel (existing stack) + Chrome mic
- Backend: Supabase for progress; Gemini for synthetic peers/consensus simulation
- Audio analysis: pyannote for diarization, librosa for feature extraction
- Data: VoxCeleb pairs or synthetic dyads via TTS prompts ("match pitch")
- Validation: Pre/post IRR on held-out dialogues

### Design Implications for KDENZ Mirroring Practice
- IF building mirroring training THEN use dyadic clips (not monologues) — mirroring requires two speakers
- IF visualizing mirroring THEN show overlaid pitch/tempo tracks so users can SEE convergence, not just hear it
- IF scoring mirroring skill THEN measure per-feature correlation (pitch, tempo, energy) not just global "did they mirror"
- IF teaching mirroring THEN emphasize timing (leader-follower lag 0-5s) as distinct from matching (same pitch level)
- IF providing feedback THEN normalize against intra-speaker baseline — true convergence vs coincidental similarity
- IF connecting to Voss technique (verbal mirroring) THEN distinguish: prosodic mirroring (unconscious vocal alignment) vs verbal mirroring (repeating last 1-3 words) — both build rapport but are different skills
- IF gamifying THEN reward feature-specific mastery (pitch accuracy, tempo accuracy) not just overall score
- IF using own-speech mode THEN auto-extract features from recorded conversation and compare against partner's prosody track

---

## Voss Verbal Mirroring — Auto-Detection & Practice (Captured 2026-02-16)

Reference this when building the verbal mirroring drill (Voss "last 2-3 words" technique). This is DISTINCT from prosodic mirroring above — verbal mirroring is a conscious technique, prosodic is unconscious alignment.

### What Voss Mirroring Looks Like

Partner says something. User repeats the last 2-3 words with a rising, curious tone. No question words (what/why/how). Silence after. Gets the other person to elaborate.

**Example:**
- Partner: "The deal is too slow."
- Good mirror: "Too slow?" (rising tone, soft volume)
- Bad: "Why is it too slow?" (question word) or "Too slow." (flat/falling tone)

### Auto-Detection Pipeline (No Extra User Steps)

1. **Record partner prompt** (play audio or TTS)
2. **Record user response** (mic, Web Speech API)
3. **ASR both** transcripts
4. **Check words:** User starts with last 2-3 words of partner (80% fuzzy match, ignore case/punct). Optional "they usually" / "usually" prefix.
5. **Check tone:** Last 1s of user audio — pitch rises 5-15% (curious, not demanding). Sharp rise >20% or falling = fail.
6. **Check volume:** Soft, matching partner energy (±10% dB)
7. **Check length:** 2-4 words total. Long sentence = not a mirror.

### Scoring Table

| Check | Good Mirror | Bad |
|---|---|---|
| Words | Last 2-3 words match (±fuzzy) | Wrong words or too many |
| Pitch End | Slight rise 5-15% | Flat/fall or sharp rise >20% |
| Volume | Matches/soft | Yells or whispers |
| Length | 2-4 words total | Long sentence |

Pass all = Perfect Mirror. Shows agreement, invites more talk.

### Technical Implementation Notes

**Pitch rise detection (pure JS, no libs):**
- Autocorrelation on AudioBuffer (last 1s) for pitch Hz at start/end
- Rise = (endHz - startHz) / startHz * 100
- Good: 5-15%. Handle noise/silence edge cases.

**Word match (fuzzy, no libs):**
- Lowercase, strip punctuation
- Check if user's first 4 words contain partner's last 2-3 words
- Set intersection: 2/3 overlap = match
- Optional: Levenshtein for close-but-not-exact matches

**Integration with existing KDENZ stack:**
- Chrome Web Speech API + MediaRecorder (existing)
- FillerGauge-style visual feedback during recording
- Gemini summary post-attempt: "Good word match, soften rise next time"
- Weekly mirror accuracy tracking (like filler trends)

### Design Implications
- IF building verbal mirroring drill THEN auto-detect word match + tone + volume — no manual annotation needed
- IF checking tone THEN measure pitch slope in last 1s only (the "question rise"), not overall pitch
- IF scoring THEN weight: words (40%) + tone (35%) + volume (15%) + length (10%)
- IF providing feedback THEN highlight the specific failure: "words were right but tone was flat" or "too many words — just use the last 2-3"
- IF showing playback THEN green highlight on matching words, pitch waveform overlay showing the rise

---

## Pace Mirroring — Speed Matching Practice (Captured 2026-02-16)

Reference this when building pace/tempo matching drills. User hears a reference recording and tries to repeat it at the same speed. Builds on existing WPM gauge infrastructure.

### What Pace Mirroring Looks Like

1. Play reference audio (3-10s prompt at a target WPM)
2. User records themselves saying the same thing
3. Compare WPM: |diff| < 10% = Perfect Match

### Auto-Detection Pipeline

1. **Play reference** — TTS or pre-recorded at target WPM (e.g., 145 WPM)
2. **Record user repeat** — same content, mic capture
3. **ASR both** — Web Speech API interim results for live WPM gauge
4. **Compute WPM:** words / (speechDuration / 60). Detect speech segments via energy threshold.
5. **Score:** |WPM_ref - WPM_user| / WPM_ref * 100 = match percentage
6. **Bonus:** Pause ratio match (±20%), ignore fillers in count

### Scoring

| Match % | Rating |
|---|---|
| < 10% diff | Perfect Match |
| 10-20% diff | Good |
| 20-30% diff | Practice |
| > 30% diff | Try Again |

### Live WPM Matching Gauge

During recording, show real-time WPM gauge (like FillerGauge):
- Web Speech interim transcript -> words / elapsedSec * 60
- Circular gauge: green if within 10% of reference WPM
- Update every 500ms
- Target line shows reference WPM

### Technical Implementation Notes

**Precise WPM from audio (post-record):**
- Detect speech segments via RMS energy threshold (Web Audio AnalyzerNode)
- WPM = wordCount / (speechDuration / 60)
- Exclude silence gaps from duration calculation

**Side-by-side playback:**
- Dual waveforms with WPM labels
- Visual alignment showing where user was faster/slower

**Prompt data:**
- 20+ prompts at varied target WPMs (120-160 range)
- Voss/Black Swan style content
- TTS via Web Speech API with SSML rate control for reference audio

### Design Implications
- IF building pace mirroring THEN show real-time WPM gauge during recording with target line from reference
- IF scoring THEN use percentage diff, not absolute WPM — matching 145 at 152 is better than matching 120 at 145
- IF providing feedback THEN show specific: "You were 12% faster — try pausing between phrases"
- IF integrating with existing app THEN reuse FillerGauge component, WPM calculation from useWebSpeech hook, and weekly trend chart
- IF creating prompts THEN vary target WPM (some slow/deliberate, some fast/energetic) to train range, not just one speed
- IF adding advanced mode THEN vary pace WITHIN a single prompt (slow start, fast middle, slow end) — tests dynamic matching, not just average speed
