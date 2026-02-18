# Research: Voice/Tone Aspiration Framework
*Agent 2 of 5 — Phase 20.1 Research*
*Completed: 2026-02-18*

---

## Summary

Voice identity archetypes are well-established across coaching, voice-over, and clinical speech fields — practitioners consistently converge on 4-8 types organized around two axes: authority-vs-warmth and energy-vs-calm. Each archetype has specific, measurable acoustic markers (speech rate, fundamental frequency range, pause duration, pitch variance, filler density) that can be detected with Web Speech API and Hume's prosody model. The aspiration gap is operationalizable: translate "I want to sound like an FM DJ" into 4-6 concrete behavioral targets, then measure the delta between the user's current averages and the archetype's benchmark ranges on every session.

---

## Voice Identity Archetypes (7 Types)

These 7 archetypes synthesize across: voice coaching practitioner frameworks (Rostlund's 4, Vocal Image's Jungian 12), Voss's 3 negotiation voice types, executive presence coaching literature, broadcast voice research, and clinical communication style frameworks (directive/supportive/analytical/expressive).

---

### Archetype 1: The Grounded Authority
**Also called:** Boardroom Authority, The Executive, The Ruler (Jungian)

**Description:** Projects confidence through stillness. Deliberate pace, strategic silence, minimal filler, falling intonation on key statements. Does not fill space out of anxiety. Voice has weight — each word costs something and means something.

**Behavioral markers:**
- Speech rate: 120-145 WPM (slower than average conversational 150-180 WPM)
- Pitch range: Compressed — uses lower third of personal range; minimal upward pitch breaks
- Pause duration: Long pauses (1.5-3s) before key statements; comfortable with silence
- Filler density: Very low (< 1 filler per 100 words)
- Intonation: Predominantly falling; rarely uses uptalk
- Volume: Consistent, moderate-to-high; does not trail off at end of sentences
- Energy variance: Low-moderate — energy is focused, not excitable

**Hume prosody dimensions (elevated):** Determination, Confidence (inferred via high Calmness + low Anxiety), Concentration
**Hume prosody dimensions (low):** Anxiety, Distress, Excitement, Boredom
**Web Speech detectable:** Filler density, speech rate, pause duration (via transcript + timing metadata)

**Common gap behaviors:** Current user may be using too many fillers, uptalk (rising intonation on statements), inconsistent volume (trailing off), or rushing to fill silence.

**Targeted drills/practices:**
- Silence practice: deliver statements with 2s pause before each key word
- Intonation drill: record same sentence with rising vs. falling end — practice falling
- Filler elimination drill (already built in Voice Practice Lab)
- Pace reduction: aim for 130 WPM target on practice monologues

---

### Archetype 2: The FM DJ / Late-Night Broadcaster
**Also called:** Calm Authority, Magnetic Voice, Late-Night FM DJ Voice (Voss)

**Description:** The archetype Chris Voss named explicitly. Warm + authoritative simultaneously. Low pitch, steady pace, soothing resonance, downward lilt. Creates psychological safety in listeners — "slows their brain down." Not cold like The Analyst; not excitable like The Motivator. Projects control without aggression.

**Behavioral markers:**
- Speech rate: 130-155 WPM (measured, not rushed)
- Pitch: Lower end of personal range; minimal high spikes
- Pitch range: Narrow but warm — movement is downward at phrase ends
- Pause duration: Medium pauses (1-2s) used deliberately; comfortable with silence
- Filler density: Very low
- Volume: Moderate, even — does not spike or drop
- Intonation: Downward lilt on phrase ends (not flat — has warmth in the descent)
- Voice quality: Research on broadcast voices shows desirable qualities are "warm," "resonant," "authoritative" — measurable via speaker's formant (SF) prominence and alpha ratio

**Hume prosody dimensions (elevated):** Calmness, Satisfaction, Contentment, Interest (mild)
**Hume prosody dimensions (low):** Anxiety, Distress, Excitement, Awkwardness, Surprise
**Web Speech detectable:** Speech rate, pause patterns, filler density, sentence-ending pitch trajectory (approximate via intonation patterns in transcript)

**Common gap behaviors:** User may be speaking too fast, voice too high/excitable, filling pauses, or using uptalk. The gap from this archetype is almost always: too much anxiety energy in the voice.

**Targeted drills/practices:**
- Pace-with-resonance drill: read aloud at 140 WPM, focus on downward phrase endings
- Record a 60-second monologue; compare energy/pace to baseline FM DJ archetype
- Pause-to-statement drill: practice starting sentences after a 1.5s pause

---

### Archetype 3: The Warm Connector
**Also called:** The Friend (Rostlund), The Caregiver (Jungian), The Supporter

**Description:** Brene Brown style. Creates intimacy and safety. Voice is softer, pace is moderate, more upward pitch movement that signals "I'm with you." Uses empathic prosody — small pitch lifts, gentle volume, more natural hesitation. Does not assert; invites. Warmth comes from pace and softness, not just word choice.

**Behavioral markers:**
- Speech rate: 140-165 WPM (moderate — not rushed, not slow)
- Pitch: Mid-range of personal range; more upward movement (inviting, not commanding)
- Pitch range: Broader expressive range than Authority types
- Pause duration: Short-medium pauses (0.5-1.5s); uses pauses to signal listening
- Volume: Softer, with occasional dips for intimacy
- Filler density: Low-moderate (some natural disfluency is acceptable — signals authenticity)
- Intonation: Mix of upward and neutral — rarely strongly downward except for emphasis
- Voice quality: Warmth and breathiness score higher than for authority archetypes

**Hume prosody dimensions (elevated):** Adoration, Love, Contentment, Empathic Pain (in response to others), Interest, Nostalgia
**Hume prosody dimensions (low):** Contempt, Anger, Determination (not the archetype's mode), Boredom
**Web Speech detectable:** Speech rate, filler density, pause patterns

**Common gap behaviors:** Users aspiring to this archetype often sound either too clinical (authority patterns bleeding in) or too eager (high energy misread as anxiety). The gap is typically: pace is right but pitch is too controlled, or too many fillers signal nervousness rather than authenticity.

**Targeted drills/practices:**
- Active listening vocal response drill (labeling with soft tone)
- Record self in actual conversation; review for warmth vs. anxiety energy
- Empathic statement delivery drill: same content, three tone profiles (cold/neutral/warm)

---

### Archetype 4: The Motivator / Energizer
**Also called:** The Coach (Rostlund), The Hero (Jungian), The Inspirational Speaker

**Description:** Tony Robbins end of the spectrum. High energy, dynamic range, big pitch variation, faster pace (or dramatically slowed for emphasis). Enthusiastic. Charismatic. Research on charismatic speech (Kleisner et al. 2019) found charismatic speakers use significantly wider F0 range, higher SPL variation, and faster speech rate than non-charismatic controls — with dramatic slowing for key emphasis points.

**Behavioral markers:**
- Speech rate: Highly variable — 160-200 WPM during energy peaks, dramatic slowing to 100-120 WPM at emphasis moments
- Pitch: Elevated mean F0, widest range of all archetypes (research: charismatic speakers use 17+ semitone range)
- Pitch range: Very wide — large excursions upward for excitement, sharp drops for gravity
- Pause duration: Short in high-energy passages; dramatically long (2-3s+) before key statements
- Volume: High and highly variable — loudness contrasts are a key charisma marker
- Filler density: Low (pauses used strategically rather than filled)
- Intonation: Wide variety — ascending for questions and excitement, descending for declarative emphasis

**Hume prosody dimensions (elevated):** Excitement, Joy, Pride, Triumph, Determination, Amusement
**Hume prosody dimensions (low):** Boredom, Calmness (relatively), Tiredness, Sadness
**Web Speech detectable:** Speech rate variation, pace peaks and valleys, filler density, pause duration

**Common gap behaviors:** Users who want this archetype often produce uniform energy instead of dynamic range. The gap is: consistent mid-energy (no highs, no dramatic lows) and missing the strategic pause before emphasis.

**Targeted drills/practices:**
- Dynamic range drill: read passage with explicit energy peaks and emphasis pauses marked
- Charisma research finding: practice widening F0 range using vocal warm-ups
- Video self-review: identify where energy flattens (the most revealing feedback)

---

### Archetype 5: The Analytical Clarifier
**Also called:** The Educator (Rostlund), The Sage (Jungian), The Expert

**Description:** Sir Ken Robinson style. Clear, precise, measured. Voice signals intelligence and care through deliberate pacing, structured thought, and moderate-to-low pitch variation. Not warm like The Connector; not assertive like The Authority. Voice signals: "I have thought this through and I will take you through it carefully." Downward lilt of The Analyst (Voss) — informative and trustworthy, but lacks the DJ voice's warmth.

**Behavioral markers:**
- Speech rate: 130-155 WPM (precise and controlled)
- Pitch: Mid-to-lower range; moderate variation
- Pitch range: Moderate — structured rises at list items, falls at sentence ends
- Pause duration: Regular, structured (0.8-1.5s at transition points)
- Volume: Consistent, moderate
- Filler density: Low — but may use strategic hesitations ("let me think about that...")
- Intonation: Organized and predictable — signals structure

**Hume prosody dimensions (elevated):** Concentration, Interest, Contemplation, Realization, Calmness
**Hume prosody dimensions (low):** Excitement, Anger, Distress, Tiredness
**Web Speech detectable:** Speech rate, pause regularity, filler density, sentence structure (transcript)

**Common gap behaviors:** Users who want this archetype often rush (anxiety overriding the deliberate pace) or use too many fillers that signal uncertainty rather than thought. The gap is typically: pace and filler density.

**Targeted drills/practices:**
- Structured explanation drill: practice explaining a concept with 3 explicit pause points
- Filler replacement drill: replace "um/uh" with deliberate 0.8s silence
- Speed reduction practice: target 140 WPM on explanatory passages

---

### Archetype 6: The Calm Negotiator
**Also called:** The Mediator, The Counselor, The Therapist Voice

**Description:** The voice for high-stakes, emotionally charged situations. Slower than average, lower energy than conversational, deliberately non-threatening. Research on therapist vocal features: lower pitch + lower energy = higher perceived empathy. Uses pacing that signals "I am not in a hurry." Strategic pausing signals respect. The opposite of urgency.

**Behavioral markers:**
- Speech rate: 110-140 WPM (noticeably deliberate)
- Pitch: Lower portion of personal range, narrow variation — does not spike
- Pitch range: Narrow — stability signals control
- Pause duration: Long (1.5-3s) — especially after the other person speaks (not rushing to fill)
- Volume: Soft-to-moderate; never spikes
- Filler density: Very low — silence preferred over filler
- Intonation: Gently descending; avoids uptalk completely
- Voice quality: Smooth, even, breathy is acceptable (signals safety)

**Hume prosody dimensions (elevated):** Calmness, Empathic Pain, Contemplation, Satisfaction
**Hume prosody dimensions (low):** Excitement, Anger, Distress, Anxiety, Determination (not pushy)
**Web Speech detectable:** Speech rate, pause duration, filler density

**Common gap behaviors:** Users who want this archetype are often too excited in their vocal energy, too fast, or fill silences too quickly. The Voss gap: they use an assertive/analytical voice when the situation calls for the FM DJ/negotiator voice.

**Targeted drills/practices:**
- Silence tolerance drill: practice waiting 3 full seconds after a statement before speaking
- Pace-down drill: read at 130 WPM target while recording and reviewing
- Labeling practice with calm delivery: "It seems like you're..." at deliberate pace

---

### Archetype 7: The Playful Persuader
**Also called:** The Jester (Jungian), The Connector (5 Voices), The Conversationalist

**Description:** Voss's "playful voice" — the default for most effective communication, used 80% of the time. Light, engaging, collaborative. Not performance energy (that's The Motivator). Natural warmth without the depth of The Connector. Voice signals: "I'm enjoying this conversation and I want to work together." Easy pace, natural prosodic variety, genuine-sounding (not rehearsed).

**Behavioral markers:**
- Speech rate: 150-175 WPM (natural conversational)
- Pitch: Mid-range, natural variation — not controlled, not extreme
- Pitch range: Moderate and natural — follows content
- Pause duration: Natural conversational pauses (0.3-1s)
- Volume: Moderate, naturally variable
- Filler density: Low-moderate — some natural disfluency is fine (signals authenticity vs. performance)
- Intonation: Mix — upward for curiosity and engagement, downward for statements

**Hume prosody dimensions (elevated):** Amusement, Joy, Interest, Contentment, Romance (interpersonal warmth)
**Hume prosody dimensions (low):** Anxiety, Distress, Boredom, Tiredness, Anger
**Web Speech detectable:** Speech rate, filler density, pace naturalness

**Common gap behaviors:** Users aspiring to this archetype often sound either too formal (Authority bleeding in) or too anxious (filler density, pace too fast). The gap is typically: authentic naturalness is hard to fake — requires dropping performance anxiety first.

**Targeted drills/practices:**
- Unscripted practice: casual 2-minute monologue on a topic they know well — measure naturalness
- Review self-recordings for "performance voice vs. natural voice" (users can often feel the difference)
- Voss playful inflection drill: ask questions with genuine upward curiosity (not uptalk)

---

## Measurable Dimensions

### What Web Speech API Can Measure Directly

| Dimension | What It Measures | Archetype Relevance |
|-----------|-----------------|---------------------|
| **Speech rate (WPM)** | Words per minute from transcript timing | All archetypes — primary differentiator |
| **Pause duration** | Silence gaps between speech segments | Authority, FM DJ, Negotiator (long pauses); Motivator (strategic extremes) |
| **Filler density** | "um/uh/like/you know" per 100 words | All archetypes — confidence proxy |
| **Filler frequency** | How often fillers cluster | Anxiety signal; affects all archetypes |
| **Sentence endings** | Trailing off vs. completing sentences | Authority gap — common failure mode |
| **Hedging language** | "I think/maybe/kind of/sort of" from transcript | Confidence signal, detectable from text |
| **Tag questions** | "right?" "you know?" as validation-seeking | Submission signal, detectable from text |
| **Uptalk markers** | Rising intonation on statements (approximate) | Authority gap — hard to detect reliably without prosody |

### What Hume Batch API Can Measure Post-Session

| Hume Dimension | What It Signals | Archetype Relevance |
|----------------|----------------|---------------------|
| **Calmness** | Vocal stillness, reduced anxiety energy | FM DJ, Negotiator — target high |
| **Determination** | Vocal assertiveness, forward momentum | Authority, Motivator — target high |
| **Concentration** | Focused, deliberate vocal quality | Analyst/Educator — target high |
| **Excitement** | High arousal, vocal energy spikes | Motivator — target high; Authority — target low |
| **Anxiety** | Vocal anxiety markers | All archetypes — target low |
| **Interest** | Engagement signals in prosody | Playful, Connector — target moderate-high |
| **Contentment** | Warm, settled quality | FM DJ, Warm Connector — target moderate |
| **Amusement** | Lightness and playful quality | Playful Persuader — target moderate |
| **Distress** | Stress and strain markers | All archetypes — target low |
| **Joy** | Vocal brightness | Motivator, Connector — context-appropriate |
| **Empathic Pain** | Reflective, attuned quality | Warm Connector, Negotiator — target moderate |
| **Tiredness** | Low energy, disengaged quality | All archetypes — target low |
| **Boredom** | Flat, monotone quality | All archetypes except Analyst — target low |
| **Sadness** | Downward energy, lower pitch | Negotiator may have mild; others target low |
| **Pride** | Confident, elevated quality | Authority, Motivator — moderate acceptable |

### Hume Dimensions NOT Directly Measured But Derivable

Hume does not output "confidence" or "authority" as named dimensions. These are inferred from Hume dimension combinations:

- **Perceived Confidence** ≈ High Determination + High Calmness + Low Anxiety + Low Distress
- **Perceived Authority** ≈ High Determination + Low Excitement + Low Anxiety + Low Boredom
- **Perceived Warmth** ≈ High Contentment + High Interest + High Empathic Pain + Low Contempt
- **Perceived Energy** ≈ High Excitement + High Joy + High Pride + Low Boredom + Low Tiredness
- **Perceived Calm** ≈ High Calmness + High Satisfaction + Low Excitement + Low Distress

These composite scores are the basis for the aspiration gap visualization.

### Research-Backed Acoustic Benchmarks

From peer-reviewed research on acoustic correlates of perceived qualities:

| Quality | Key Acoustic Feature | Direction | Research Source |
|---------|---------------------|-----------|-----------------|
| Confidence | Speech rate | Faster = more confident | Zander et al. (PMC8553728) |
| Confidence | Pitch | Lower = more confident (within gender) | Zander et al. |
| Confidence | Intonation | Falling = more confident | Zander et al. |
| Confidence | Loudness | Louder = more confident | Zander et al. |
| Charisma | F0 range | Wider = more charismatic (17+ semitones) | Kleisner et al. (PMC6904528) |
| Charisma | SPL variation | More dynamic = more charismatic | Kleisner et al. |
| Charisma | Speech rate | Faster base rate + strategic slowing | Kleisner et al. |
| Empathy (therapist) | Pitch | Lower = more empathic | Xiao et al. (via PMC9979575) |
| Empathy (therapist) | Energy/volume | Lower = more empathic | Xiao et al. |
| Authority | Pitch | Lower = more authoritative | Multiple |
| Authority | Intonation end | Falling = more authoritative | Multiple |
| Trustworthiness | Speech rate | Context-dependent (higher in general, slower in healthcare) | PMC11931160 |
| Warmth | Volume | Softer, with variation | General coaching literature |

---

## Aspiration Gap Operationalization

### The Core Translation Problem

"I want to sound like an FM DJ" → unmeasurable aspiration.
"I want to sound like an FM DJ" → **specific behavioral targets** → measurable.

### Translation Schema: Aspiration to Targets

For each archetype, define 4-6 behavioral targets in measurable terms. At session end, compute the gap between user's session averages and the archetype's benchmark range.

**Example: FM DJ / Grounded Calm**

| Dimension | User Current (session avg) | Target Range | Gap |
|-----------|---------------------------|--------------|-----|
| Speech rate | 175 WPM | 130-155 WPM | -25 WPM |
| Filler density | 4.2 per 100 words | < 1.0 per 100 words | -3.2 |
| Pause duration (avg) | 0.4s | 1.0-2.0s | +0.8s |
| Hume: Calmness | 0.31 | > 0.55 | +0.24 |
| Hume: Anxiety | 0.48 | < 0.20 | -0.28 |
| Hume: Determination | 0.22 | > 0.45 | +0.23 |

**The aspiration gap = weighted distance across these 4-6 dimensions.**

Each session moves the user's baseline. The gap closes over time.

### Minimum Viable Marker Set

For an MVP aspiration gap implementation (pre-Hume, Web Speech only):

1. **Speech rate (WPM)** — easy to compute, high signal
2. **Filler density (fillers per 100 words)** — already built in Voice Practice Lab
3. **Average pause duration** — derivable from transcript timing metadata
4. **Hedging language rate** — detectable from transcript (text analysis)
5. **Sentence completion rate** — are sentences trailing off? (detectable from transcript structure)

These 5 metrics alone can define a meaningful aspiration gap for 6 of 7 archetypes. Add Hume dimensions as Phase D deliverable for richer signal.

### Post-Hume Marker Set (Phase D)

Add Hume composite scores:
- Perceived Confidence composite (Determination + Calmness - Anxiety)
- Perceived Warmth composite (Contentment + Interest + Empathic Pain)
- Perceived Energy composite (Excitement + Joy + Pride - Boredom - Tiredness)
- Perceived Calm composite (Calmness + Satisfaction - Excitement - Distress)

These four composite dimensions, combined with the 5 Web Speech markers, give a 9-dimension aspiration gap profile.

---

## Aspiration-Setting UX Design

### Design Principles

1. **Never ask "what archetype are you?" directly** — users don't know. They know their aspiration as a feeling or a reference person.
2. **Reference people and metaphors are better than labels** — "FM DJ voice," "Brene Brown style," "boardroom authority" land faster than "Calm Authoritative Analytical."
3. **The archetype selection should feel like self-discovery, not a quiz** — show examples, let them choose.
4. **The aspiration should be revisable** — identity evolves; the setting should be easy to update.
5. **Connect aspiration to the gap immediately** — after selection, show 2-3 key gaps the platform will help close ("Here's where you are vs. where you want to be").

### Recommended Question Set (3-Question Onboarding Flow)

**Question 1: The Reference Question**
"Think of a communicator — someone you've heard in real life, a podcast, a film, a leader you've watched — whose voice or presence made you think: 'I want that.' Who comes to mind?"

Purpose: Opens the user's aspirational frame. Answer stored as free text, not used for routing directly — instead, moves to Q2.

**Question 2: The Feeling Question**
"When you imagine yourself communicating at your best, what do people feel when they hear you speak?"

Present as a select-multiple:
- Grounded and safe — like nothing can shake them
- Energized and inspired — like they want to take action
- Heard and understood — like you really get them
- Engaged and curious — like this is going to be interesting
- Clear and trustworthy — like they can take this to the bank
- Warm and welcomed — like they can open up

Purpose: Maps to archetype (Authority/FM DJ, Motivator, Connector/Negotiator, Playful, Analyst, Connector). Multiple selections allowed — reveals blended aspirations.

**Question 3: The Gap Awareness Question**
"What do you think gets in the way of sounding that way right now?"

Present as select-one or select-multiple:
- I talk too fast and fill space
- My voice sounds unsure — I trail off or ask too many questions
- I sound either flat/boring or try-hard/performative
- I lose people when I'm explaining things
- I come across as cold when I'm trying to be direct
- I don't sound calm under pressure — stress bleeds into my voice
- I'm not sure — I can't hear myself the way others do

Purpose: Primes for gap awareness. Maps to current pattern signals for the debrief system. Also extremely useful for session 1 framing.

### Archetype Selection UI (Alternative Path)

For users who want to select rather than answer questions, show 7 cards with:
- Archetype name (user-facing version)
- 2-line description
- "Sounds like" reference (Brene Brown, Chris Voss, etc.)
- Audio sample (future feature — text description for now)

User selects 1 primary, optionally 1 secondary. The secondary is their "stretch" aspiration (e.g., primary: Warm Connector, stretch: FM DJ/Calm Authority).

### Profile Update Path

The aspiration setting should be editable from profile at any time, with a brief contextual note: "Your target voice shapes how we show you your gaps. Update it as your goals evolve."

---

## Implementation Notes for Planning

### Archetype Data Model

```typescript
interface VoiceArchetype {
  id: string                    // 'grounded_authority' | 'fm_dj' | 'warm_connector' | etc.
  name: string                  // User-facing name
  description: string           // 2-3 sentences
  reference_communicators: string[]  // "Chris Voss, James Earl Jones"
  markers: {
    speech_rate_wpm: { min: number; max: number }
    filler_density_per_100: { target: number; max: number }
    avg_pause_duration_s: { min: number; max: number }
    hume_targets?: {            // Phase D — optional initially
      [dimension: string]: { min: number; max: number }
    }
  }
  gap_dimensions: string[]      // Which 4-6 dimensions to track for this archetype
  hume_composite?: {
    confidence: number          // Weight for confidence composite
    warmth: number              // Weight for warmth composite
    energy: number              // Weight for energy composite
    calm: number                // Weight for calm composite
  }
}
```

### Aspiration Gap Score Calculation

```typescript
interface AspirationGap {
  archetype_id: string
  session_averages: {
    speech_rate_wpm: number
    filler_density: number
    avg_pause_s: number
    hedging_rate: number
    // Hume composites when available:
    confidence_score?: number
    warmth_score?: number
    energy_score?: number
    calm_score?: number
  }
  gap_scores: {
    [dimension: string]: number  // 0 = at target, 1 = far from target
  }
  overall_gap: number            // Weighted average, 0-1
  trend: 'closing' | 'stable' | 'widening'
}
```

### What the Planner Needs to Decide

1. **How many archetypes in MVP?** — Recommend 5 for MVP (FM DJ, Grounded Authority, Warm Connector, Motivator, Calm Negotiator). Add Analyst and Playful in v2.

2. **Primary vs. secondary aspiration** — Does MVP support blended archetypes (1 primary + 1 stretch)? Recommend yes — the "stretch" model is motivating without overcomplicating routing.

3. **Aspiration-setting flow placement** — Onboarding only? Or editable from profile at any time? Recommend both: collect in onboarding, editable from profile.

4. **Gap visualization** — Phase 20.1 scope says "simple progress indicator." Recommend: single gap meter per session (0-100% toward target) with 3 most-improved and 3 highest-gap dimensions called out. Full multi-dimensional dashboard is Phase E.

5. **Which 5 Web Speech markers to track for MVP gap** — Recommend: speech rate (WPM), filler density (per 100 words), avg pause duration, hedging language rate (from transcript), sentence completion rate. These 5 are all computable without Hume.

6. **Hume integration timing for aspiration gap** — The gap can be partially computed from Web Speech immediately. Hume adds richer signal but is async. Recommend: show Web Speech-based gap immediately post-session; Hume-enhanced gap populates within 24h (notification).

7. **localStorage keys** — `kdenz:user-aspiration` should store:
   ```typescript
   {
     primary_archetype_id: string,
     secondary_archetype_id?: string,
     aspiration_text?: string,    // free text from Q1
     set_at: string,              // ISO timestamp
     updated_at: string
   }
   ```

---

## Key Sources

- [Paralinguistic Features and Confidence — PMC8553728](https://pmc.ncbi.nlm.nih.gov/articles/PMC8553728/) — Specific acoustic features (rate, pitch, intonation, volume) mapped to perceived confidence
- [Charismatic Speech Acoustics — PMC6904528](https://pmc.ncbi.nlm.nih.gov/articles/PMC6904528/) — F0 range, SPL variation benchmarks for charismatic speakers
- [Therapist Vocal Features — PMC9979575](https://pmc.ncbi.nlm.nih.gov/articles/PMC9979575/) — Lower pitch + lower energy = higher perceived empathy
- [Vocal Persona Model — Frontiers Computer Science 2025](https://www.frontiersin.org/journals/computer-science/articles/10.3389/fcomp.2025.1575296/full) — Context + Production + Perception framework
- [Hume AI Prosody Model](https://dev.hume.ai/docs/expression-measurement/models/prosody) — 48 emotion dimensions; pitch, pace, intensity, timbre detection
- [Hume Valence & Arousal](https://www.hume.ai/products/valence-and-arousal) — Separate dimensional model
- [Voice Archetypes in Communication — Shelley Rostlund](https://shelleyrostlund.com/podcast/046/) — Four practical archetypes: Motivator, Educator, Coach, Friend
- [Chris Voss Three Voice Types — CNBC](https://www.cnbc.com/2020/01/07/ex-fbi-negotiator-chris-voss-how-to-negotiate.html) — Playful, FM DJ, Analyst voice types with behavioral description
- [Chris Voss Voice Types — MasterClass](https://www.masterclass.com/articles/chris-voss-on-mastering-tone-and-inflection-in-negotiations) — Detailed behavioral description of each type
- [Executive Voice Coaching Benchmarks — Speakeasy](https://www.speakeasyinc.com/voice-traning-for-business-executives/) — 140-160 WPM target, strategic pause research
- [Voice Acoustics and Trustworthiness — PMC11931160](https://pmc.ncbi.nlm.nih.gov/articles/PMC11931160/) — Systematic review on acoustic features and perceived trust
- [Vocal Image App](https://www.vocalimage.app/en/) — Jungian archetype matching + measurable dimensions (pitch Hz, tempo WPM, confidence %)
- [Four Communication Styles — Toastmasters](https://www.toastmasters.org/magazine/magazine-issues/2022/june/communication-style) — Directive, Supportive, Analytical, Expressive framework
- [Broadcast Voice Characteristics](https://www.ncmediaarts.com/media-management-blog/finding-your-authentic-broadcast-voice-a-complete-guide-to-vocal-training) — Desirable broadcast voice qualities: warm, resonant, powerful, authoritative
- [Emotional Prosody Research — PMC12231869](https://pmc.ncbi.nlm.nih.gov/articles/PMC12231869/) — 3 decades of prosody research summary

---

*Research by: Agent 2 of 5, Phase 20.1 Research*
*Written: 2026-02-18*
*Status: COMPLETE — ready for synthesis*
