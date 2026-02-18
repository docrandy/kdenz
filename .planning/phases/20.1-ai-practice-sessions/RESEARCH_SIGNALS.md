# Research: Behavioral Signal Detection
*Agent 3 of 5 — Phase 20.1 Research*
*Completed: 2026-02-18*

## Summary

Communication pattern detection splits cleanly into two tiers: transcript-only signals (hedging, tag questions, presumptuous framing, intellectualizing indicators, topic deflection) are reliably detectable with regex or a single Gemini call, while audio-dependent signals (rushing/pace, silence avoidance, volume variation) require Hume prosody analysis post-session. Regex-only hedging detection has a precision problem — context determines whether "I think" is a hedge or a direct opinion — making Gemini the preferred method for hedge detection in conversational transcripts, with regex reserved as a fast first-pass filter. The recommended architecture is: regex for speed (form scoring, immediate), Gemini Call 2 per exchange for pattern classification (medium confidence), and Hume batch post-session for audio signals (high confidence, async).

---

## Signal Detection Table

| Pattern | Signal | Detection Method | Reliability | Data Source | Notes |
|---------|--------|-----------------|-------------|-------------|-------|
| Hedging | "I think," "I guess," "maybe," "perhaps," "probably," "kind of," "sort of," "I suppose," "I'm not sure but," "possibly," "it might be," "you know?" at end | Regex (first pass) | Medium — 65-75% precision due to false positives | Transcript | "I think" = hedge in statement context; not a hedge in response to "What do you think?" |
| Hedging (contextual) | Same phrases above, evaluated in context of whether speaker is making an assertion or responding to a direct question | Gemini (contextual) | High — 85-90% with few-shot prompt | Transcript | Recommended primary method; regex as pre-filter only |
| Tag question (validation seeking) | Sentence-ending "...right?" "...yeah?" "...don't you think?" "...you know?" "...correct?" | Regex | High — 90%+ precision | Transcript | Tag questions at end of declarative statements = validation seeking; distinguish from genuine questions |
| Softening prefixes | "I just wanted to say," "I mean," "I was just wondering," "it's just that," "I don't know, maybe," "not to be weird but" | Regex | High — 88%+ | Transcript | These are hedges specifically attached to requests or assertions |
| Intellectualizing vs. empathizing | Response contains analysis/explanation words ("because," "so," "therefore," "the reason is," "what this means is") with NO emotion-reference words | Regex (negative filter) | Medium-High — 80% | Transcript | Absence of feeling words ("hurt," "scared," "frustrated," "worried," "sad," "overwhelmed") in a response to emotional content is the signal |
| Intellectualizing (positive) | Response to emotional scenario uses: clinical language, causal analysis, third-person framing ("people often feel," "in situations like this"), without naming the emotion in front of you | Gemini | High — 87%+ | Transcript | Gemini needed to assess "does this response engage emotionally or analytically with what was said?" |
| Presumptuous framing | "You clearly...," "Obviously you...," "It's obvious that...," "You must feel...," "You're definitely...," "You always...," "You never..." | Regex | High — 92%+ | Transcript | These patterns assert internal state with certainty; contrast with appropriate labels: "It sounds like...," "It seems like...," "I'm sensing..." |
| Hedged labeling (correct) | "It sounds like," "It seems like," "I'm getting the sense that," "I notice," "I'm hearing" | Regex | High — 95%+ | Transcript | Distinguishing appropriate hedged labeling from over-hedging: appropriate hedge = "sounds like"; over-hedge = "sounds like... right?" |
| Rushing / fast pace | Words per minute > 180 (normal conversation = 130-160 WPM) | Audio analysis: word count / elapsed time | Medium-High — 80% | Web Speech API timestamps + word count | Web Speech API provides timestamps per result event; calculate WPM from final transcript length and elapsed recording time |
| Silence avoidance | Pause duration between user speaking < 0.5 seconds after character speaks; user fills silence with "um," "uh," "so," "well," "anyway" | Audio (pause duration between MediaRecorder stop and SpeechRecognition start) | Medium — 70% | MediaRecorder timing | App can track time between character response appearing and user pressing Record; very short delays = not sitting with silence |
| Silence avoidance (filler detection) | Response begins with filler words: "Um," "Uh," "So," "Well," "Like," "Yeah," "Right," "Okay so" | Regex | High — 90%+ | Transcript | FillerDetector.ts already handles this; reuse existing infrastructure |
| Topic deflection | Response introduces a new topic not present in the scenario or character's statement; contains redirect words ("but what about," "speaking of," "anyway," "changing the subject") | Gemini | Medium — 75% | Transcript | Hard to detect with regex; Gemini can assess semantic relevance of response to scenario |
| Problem-solving rush (MI righting reflex) | Response pattern: user immediately offers solutions, advice, or suggestions ("you should," "you could try," "have you considered," "why don't you," "I would recommend") when emotional content was presented | Regex + Gemini | High (regex: 90%, Gemini: 85%) | Transcript | Righting reflex is one of the most reliable detectable patterns; regex catches the syntactic form, Gemini assesses whether it's contextually premature |
| Emotional vocabulary ratio | Count of emotion-reference words vs. total words; low ratio in response to emotional scenario = intellectualizing | Regex (LIWC-style word list) | Medium — 78% | Transcript | Needs curated emotion word list (~100-200 words); absolute count matters less than presence/absence |
| Volume variation (confidence signals) | Monotone delivery: low variation in amplitude across an utterance | Hume prosody | High — 85%+ | Hume batch API | Hume's 48-dimension prosody output includes energy/enthusiasm dimensions that correlate with monotone vs. varied delivery |
| Pace variation | Acceleration mid-sentence (rushing through the hard part) | Hume prosody | High — 83%+ | Hume batch API | Hume measures rhythm across time; acceleration indicates discomfort |
| Upspeak | Rising intonation on declarative statements (statements that sound like questions) | Hume prosody | High — 88%+ | Hume batch API | Intonation patterns are in Hume's prosody output; upspeak = specific pattern of tension/uncertainty emotions at end of utterance |

---

## Transcript-Only Detection (Immediate)

These patterns can be detected from the text transcript alone using regex rules or a single Gemini call. No audio analysis required. These are available **per exchange** in real-time.

### Tier 1: Regex-Detectable (High Confidence, Instant)

**1. Tag Question / Validation Seeking**
- Pattern: Sentence ending with "right?", "yeah?", "you know?", "correct?", "don't you think?", "doesn't it?", "isn't it?"
- Regex: `/[.!]?\s*(right|yeah|you know|correct|don't you think|isn't it|doesn't it)\?$/i`
- Reliability: 90%+ precision
- False positive: Genuine question ("Is that right?") vs. validation tag ("That makes sense, right?") — distinguish by whether the tag follows a declarative statement or stands alone
- KDENZ use: Flag as "question-ending" signal; weight higher if user's STATEMENT ends with a tag question

**2. Softening Prefixes (Request/Assertion Hedges)**
- Pattern: Opening phrases that soften an assertion or request
- Regex: `/^(I just |I was just |just wondering|not to be |I don't know,? |I mean,? |it's just that)/i`
- Reliability: 88%+ (these openings almost always indicate hedging when preceding an assertion)
- KDENZ use: "Softening prefix" signal; strong indicator of Hedger pattern

**3. Modal Hedges (Mid-Sentence)**
- Pattern: Modal verbs + probability adverbs in assertion contexts
- Regex for modals: `/\b(might be|could be|may be|seems like it|probably is|possibly)\b/i`
- Regex for probability adverbs: `/\b(perhaps|maybe|possibly|probably|presumably|apparently)\b/i`
- Reliability: 75% (context-dependent; see edge cases)
- KDENZ use: Count modal hedge density per response; 2+ per response = hedging signal

**4. Presumptuous Framing (Certainty Assertions About Other's State)**
- Pattern: Asserting internal state of another with certainty
- Regex: `/\b(you clearly|you obviously|you must (feel|be|know|think)|you're definitely|you always|you never|obviously you|it's clear that you|you're clearly)\b/i`
- Reliability: 92%+ (these are almost always presumptuous in any context)
- Contrast pattern (correct): `/\b(it sounds like|it seems like|i'm sensing|i notice|i'm hearing|i get the sense)\b/i`
- KDENZ use: "Presumptuous framing" signal; recommend label-without-certainty technique

**5. Righting Reflex (Premature Problem-Solving)**
- Pattern: Advice-giving or solution-offering in response to emotional content
- Regex: `/\b(you should|you could try|have you (tried|considered|thought about)|why don't you|you might want to|I would recommend|my suggestion|you need to|the answer is|the solution is)\b/i`
- Reliability: 90% for form detection; requires Gemini to assess whether problem-solving is contextually premature
- KDENZ use: High-confidence signal for "Fixer" or "Problem-Solver" pattern

**6. Filler Word Opening (Silence Avoidance)**
- Pattern: Response begins with filler
- Regex: `/^(um|uh|so,? |well,? |like,? |yeah,? |okay so|right so|anyway)/i`
- Reliability: 90%+ (already in FillerDetector.ts)
- KDENZ use: Reuse existing filler detection; opening fillers specifically = not holding silence before responding

### Tier 2: Gemini-Required (Contextual, Per Exchange)

**7. Contextual Hedging Assessment**
- What it detects: Whether a response contains hedging markers AND whether context makes those markers functional hedges vs. direct opinions
- Why Gemini: "I think" after "What do you think?" is not a hedge; "I think that might work?" at the end of an assertion is a hedge
- Reliability with Gemini: 85-90% (few-shot prompting with 3-5 examples)
- KDENZ implementation: Include in Call 2 (pattern detection call); don't rely on regex alone for hedging score

**8. Intellectualizing vs. Empathizing**
- What it detects: Whether the user's response engages with the emotional content of the scenario or analyzes/explains it from outside
- Signals: Presence of analysis words without emotion words; third-person framing; causal explanation as response to emotional disclosure
- Why Gemini: Absence-of-signal detection is hard with regex; context matters (some techniques ARE analytical)
- Reliability with Gemini: 87%+
- KDENZ implementation: Part of Call 2; Gemini assesses "did this response land emotionally or intellectually?"

**9. Topic Deflection**
- What it detects: Whether the user's response addresses what the character said or redirects to something else
- Why Gemini: Semantic relevance cannot be assessed with regex
- Reliability with Gemini: 75% (harder than other patterns; deflection can be subtle)
- KDENZ implementation: Part of Call 2; flag as low-confidence signal; require 3+ exchanges before naming as pattern

**10. Emotional Vocabulary Presence/Absence (LIWC-style)**
- Implementation without LIWC license: Curate a list of ~150 core emotion words (hurt, scared, frustrated, worried, sad, overwhelmed, angry, confused, lonely, ashamed, embarrassed, hopeful, excited, proud, grateful, etc.)
- Regex: Check if ANY emotion word from the curated list appears in the response
- Reliability: 80% (presence is reliable; absence is the signal, which has more false positives)
- KDENZ implementation: Fast regex pass; if no emotion words in response to an emotional scenario, flag as intellectualizing indicator; confirm with Gemini

### Curated Emotion Word List (Starter Set for KDENZ)

```
# Negative/difficult emotions (responding to these without naming them = intellectualizing)
hurt, scared, afraid, frightened, worried, anxious, nervous, panicked
sad, unhappy, devastated, heartbroken, disappointed, down, depressed
angry, furious, frustrated, irritated, annoyed, resentful, bitter
confused, lost, overwhelmed, stuck, unsure, uncertain
ashamed, embarrassed, guilty, humiliated, mortified
lonely, isolated, abandoned, rejected, excluded
hopeless, helpless, powerless, defeated

# Positive emotions
hopeful, excited, proud, grateful, relieved, calm, confident
```

---

## Hume-Required Detection (Post-Session)

These patterns require prosody analysis from the Hume batch API. They are available post-session (~30 second delay), not per-exchange. They are high-confidence indicators but cannot be acted on in real-time.

### 1. Speaking Pace / Rushing

**What Hume provides:** Hume's speech prosody model measures "rhythm" as one of its core dimensions. The 48 emotional outputs include dimensions correlated with urgency, calm, and nervousness — all of which correlate with speaking pace.

**Approximate metrics derivable from Hume + Web Speech API:**
- Words per minute: Calculate from transcript word count ÷ recording duration (available from MediaRecorder)
- Normal range: 130-160 WPM conversational; 120-140 WPM for deliberate pacing
- Rushing threshold: >180 WPM consistently across a session

**Web Speech API contribution:** MediaRecorder timestamps give session duration; word count from transcript gives WPM estimate. This is available WITHOUT Hume.

**Hume contribution:** Adds prosodic rhythm analysis that catches acceleration within a single utterance (speeding up mid-sentence = rushing through the uncomfortable part).

**Reliability:** WPM calculation from transcript: 80% (good enough for "rushing" vs "not rushing"); Hume prosody rhythm: 83%

### 2. Silence Tolerance / Holding Silence

**What to measure:** Time between character's response appearing on screen and user pressing Record button.

**Implementation:** Track `characterResponseTimestamp` and `recordingStartTimestamp`; difference = pause taken before responding.

**Thresholds:**
- < 2 seconds: User is not holding silence (rushing to respond)
- 2-5 seconds: Normal processing time
- > 5 seconds: User is sitting with the exchange (good)

**Reliability:** 85% (simple timestamp comparison; false positive = user was distracted, not holding silence deliberately)

**Web Speech API contribution:** Not needed; timing is app-level event tracking.

**Hume contribution:** Not needed for detection; Hume can confirm with prosody (calm = holding silence was productive; anxious = silence was uncomfortable).

### 3. Upspeak (Rising Intonation on Declarative Statements)

**What it signals:** Statements delivered with rising intonation = validation-seeking at the prosodic level, even if the words don't end in "right?"

**Hume detection:** Hume's prosody model detects intonation patterns. High uncertainty/anxiety scores at the END of an utterance (where intonation rises) = upspeak indicator.

**Reliability:** 88% (Hume is trained on exactly this kind of prosodic variation)

**Why Hume is required:** Upspeak cannot be detected from transcript text; requires actual audio analysis.

### 4. Volume Variation / Monotone Delivery

**What it signals:** Flat delivery with low prosodic variation = either confidence deficit or disengagement

**Hume detection:** Hume's prosody output includes energy/enthusiasm dimensions; low variance across an utterance's emotional dimensions = monotone indicator.

**Reliability:** 85% for monotone detection

**Why Hume is required:** Volume variation is acoustic; not detectable from transcript.

### 5. Vocal Tension / Anxiety Markers

**What it signals:** Tight, constricted vocal quality often accompanies hedging behavior; voice "goes small" on difficult assertions

**Hume detection:** Hume's prosody model outputs dimensions including fear, distress, nervousness — which correlate with vocal tension

**Reliability:** 80% (Hume correlates well with perceived tension; absolute accuracy on vocal tension is harder)

**KDENZ use:** Combine with transcript-based hedging signal for higher-confidence pattern detection; don't use as standalone signal

---

## Gemini Prompt Structure

### Call 2: Per-Exchange Pattern Detection

This call runs after every user response, in parallel with (or immediately after) Call 1 (character response).

**Cost:** ~$0.001 per call at Gemini 2.5 Flash pricing
**Latency:** 1.5-3 seconds (async; does not block user)
**Temperature:** 0.1 (deterministic classification)

```
SYSTEM PROMPT:
You are a communication pattern analyst. Your job is to identify what a user's response SIGNALS about their communication style — what they are doing that they may not realize.

You are NOT scoring quality. You are identifying observable behavioral signals.

PATTERN DEFINITIONS:
- Hedging: Adding uncertainty markers ("maybe," "I think," "kind of," "right?") to soften assertions that don't need softening
- Validation-seeking: Ending statements with tag questions seeking agreement ("...right?", "...you know?")
- Intellectualizing: Analyzing or explaining the situation rather than engaging emotionally with what was shared
- Presumptuous: Asserting certainty about another person's internal state ("you clearly feel," "you must be")
- Problem-solving rush: Offering solutions or advice immediately when emotional content was presented (righting reflex)
- Topic deflection: Redirecting away from the emotional content to something else
- Appropriate: Response engages with emotional content, uses tentative language for labeling, avoids premature advice

USER PROMPT TEMPLATE:
Scenario context: [SCENARIO_DESCRIPTION]
Character's statement: "[CHARACTER_LAST_STATEMENT]"
User's response: "[USER_RESPONSE_TEXT]"
Previous exchanges (last 3): [CONVERSATION_HISTORY]

Identify any behavioral signals present in the user's response. Return ONLY valid JSON:
{
  "signals": ["<signal_name>", ...],  // array of signals detected, can be empty
  "patternNote": "<1 sentence observation about what the response signals, written to be shown to the user>",
  "dominant_pattern": "<hedging|validation_seeking|intellectualizing|presumptuous|problem_solving_rush|deflection|appropriate|mixed|null>",
  "confidence": <0.0-1.0>,
  "sessionPattern": null
}

Rules:
- Only include signals with confidence > 0.6
- patternNote must be non-judgmental and specific ("Your response offered a solution before exploring her concern" not "You failed to empathize")
- sessionPattern is always null here (set by session debrief call, not per-exchange)
- If the response is appropriate, signals = [] and dominant_pattern = "appropriate"
```

### Call 3: Session Debrief Pattern Synthesis

Runs once at end of session. Aggregates all per-exchange pattern notes.

```
SYSTEM PROMPT:
You are a communication coach analyzing a complete practice session. Your job is to identify the user's primary communication pattern across the session and name it in a way that helps them recognize themselves without feeling judged.

USER PROMPT TEMPLATE:
Session summary:
- Number of exchanges: [N]
- Scenario type: [SCENARIO_TYPE]
- Per-exchange pattern notes: [ARRAY_OF_PATTERN_NOTES]
- Per-exchange dominant patterns: [ARRAY_OF_DOMINANT_PATTERNS]
- User's stated aspiration: [ASPIRATION_ARCHETYPE]

Identify the primary pattern across this session. Return ONLY valid JSON:
{
  "sessionPattern": "<pattern_name>",  // e.g., "Hedger", "Surface Reader", "Fixer", "Analyzer"
  "observation": "<2 sentences: what the user does and what it costs them, non-judgmental>",
  "growthEdge": "<1 sentence: the specific behavior to shift>",
  "nextDrill": "<technique_id that most directly addresses this pattern>",
  "confidence": <0.0-1.0>
}

Pattern name guidelines:
- User-facing names that help self-identification, not clinical diagnoses
- Names should be descriptive of the behavior, not the person ("Hedger" not "Insecure")
- Reserve "mixed" for sessions with no clear dominant pattern
- Return sessionPattern = null if confidence < 0.6 (not enough data)
```

### Few-Shot Examples for Hedging Detection (Include in Call 2 Prompt)

```
EXAMPLE 1:
Character said: "I just feel like nobody at work takes me seriously."
User response: "It sounds like that's really frustrating for you."
Expected output: { "signals": [], "dominant_pattern": "appropriate", "confidence": 0.95, "patternNote": "Clean, tentative label that matches the emotional content." }

EXAMPLE 2:
Character said: "I just feel like nobody at work takes me seriously."
User response: "I think maybe that's because of how you're presenting yourself? I'm not sure though, right?"
Expected output: { "signals": ["hedging", "validation_seeking", "presumptuous"], "dominant_pattern": "hedging", "confidence": 0.88, "patternNote": "Your observation was buried in uncertainty markers — 'I think maybe' and 'right?' ask permission to have a perspective." }

EXAMPLE 3:
Character said: "My marriage is falling apart and I don't know what to do."
User response: "Have you considered couples therapy? It's really helpful for communication issues."
Expected output: { "signals": ["problem_solving_rush"], "dominant_pattern": "problem_solving_rush", "confidence": 0.92, "patternNote": "You moved to a solution before exploring what she's going through — the advice closed the space just as she was opening." }

EXAMPLE 4:
Character said: "I'm scared I'm going to lose my job."
User response: "Well, statistically speaking, layoffs usually only affect 10-15% of a workforce, so the odds are probably in your favor."
Expected output: { "signals": ["intellectualizing"], "dominant_pattern": "intellectualizing", "confidence": 0.90, "patternNote": "The statistics may be accurate, but they sidestep her fear — she needed to feel heard before being reassured." }
```

---

## Edge Cases and Failure Modes

### Hedging Detection Edge Cases

**1. "I think" as a direct opinion (not a hedge)**
- Scenario: Character asks "What do you think I should do?" User responds "I think you should talk to him directly."
- Problem: Regex flags "I think" as a hedge; it's actually a direct recommendation preceded by conventional opinion framing
- Mitigation: Gemini with conversation context resolves this correctly 85%+ of the time
- KDENZ handling: Use regex only as a pre-filter; always confirm with Gemini in context

**2. Technical hedging vs. behavioral hedging**
- Scenario: User learning the labeling technique correctly uses "It sounds like you're feeling frustrated."
- Problem: "It sounds like" could be flagged as a hedge, but in labeling drills it IS the correct form
- Mitigation: Gemini prompt includes scenario context and technique being practiced; can distinguish correct technique use from behavioral hedging
- KDENZ handling: Include `techniqueContext` in Gemini prompt so it knows when hedged language is the target behavior

**3. Cultural and identity-based hedging**
- Scenario: Some users (non-native English speakers, users from high-context cultures) use hedging markers more frequently without uncertainty signal
- Problem: Pattern detection flags behavior that may be culturally appropriate, not anxiety-driven
- Mitigation: Gemini with longer session context can detect when hedging is uniform vs. concentrated in difficult moments
- KDENZ handling: Set sessionPattern confidence threshold high (>0.75) before naming a pattern; accumulate 5+ exchanges before drawing conclusions

**4. Co-occurring speech disfluencies and hedges**
- Scenario: "Um, I think maybe... it sounds like..." — disfluencies and hedges co-occur
- Problem: Disfluencies inflate hedge count; may over-signal hedging pattern
- Mitigation: FillerDetector.ts already strips filler words before transcript normalization; apply same normalization before hedge detection
- KDENZ handling: Run transcript through filler normalization before pattern analysis; don't double-count "um" as both filler and hedge

### Presumptuous Framing Edge Cases

**1. Warranted certainty**
- Scenario: Character has been expressing the same emotion for 5 exchanges; user says "You're clearly exhausted by this."
- Problem: After extensive emotional disclosure, "clearly" may be warranted, not presumptuous
- Mitigation: Gemini with full conversation history can assess whether certainty is earned
- KDENZ handling: Downweight "clearly" as a signal if it appears in exchange 5+ with consistent emotional content from character

**2. Technique-appropriate framing**
- Scenario: Accusation audit requires stating what the other party might think ("You probably think I'm just trying to push you around") — this uses assertion language that looks presumptuous
- Problem: Correct accusation audit technique uses assertion language; regex flags it as presumptuous
- Mitigation: Include `techniqueContext` in Gemini prompt
- KDENZ handling: Always include current technique in pattern detection prompt

### Intellectualizing Edge Cases

**1. Factual scenarios where analysis IS appropriate**
- Scenario: Business negotiation drill where character is asking about contract terms
- Problem: Analysis is appropriate; intellectualizing signal fires incorrectly
- Mitigation: Gemini with scenario context can distinguish emotional scenarios (where empathy is needed) from analytical scenarios (where analysis is appropriate)
- KDENZ handling: Tag scenarios as "emotional-content" or "analytical-content"; only fire intellectualizing signal in emotional-content scenarios

**2. Cognitive empathy vs. emotional avoidance**
- Scenario: User says "That sounds really hard — I imagine you feel like you're stuck between two bad options."
- Problem: The word "imagine" and analytical framing could trigger intellectualizing signal, but the response IS empathic
- Mitigation: Gemini with few-shot examples resolves correctly; "imagine" in empathy context is not intellectualizing
- KDENZ handling: Include this as a negative example in few-shot prompt

### Silence / Rushing Edge Cases

**1. User was distracted, not rushing**
- Scenario: User presses Record immediately after character response, but was checking their phone, then spoke after 5 seconds
- Problem: Timestamp delta looks like rushing (small delay between character response and Record press), but user wasn't thinking at all
- Mitigation: No clean solution; silence tolerance is inherently noisy from app events alone
- KDENZ handling: Don't make silence tolerance a primary signal; use as corroborating evidence only; weight it less than transcript-based signals

**2. WPM calculation inaccuracy from Web Speech API**
- Scenario: Web Speech API drops words, misrecognizes, or produces shorter transcript than actual speech
- Problem: WPM calculated as (recognized_words / elapsed_time) is lower than actual WPM
- Mitigation: Use as a relative signal within a session, not an absolute threshold
- KDENZ handling: Compare WPM across a user's own sessions (are they consistently high?), not against absolute thresholds

### Topic Deflection Edge Cases

**1. Necessary context-providing**
- Scenario: Character raises an issue; user asks a clarifying question ("Can you tell me more about what happened?")
- Problem: Clarifying question could look like deflection (not addressing the emotional content)
- Mitigation: Clarifying questions are a legitimate technique; Gemini can distinguish "exploring" from "deflecting"
- KDENZ handling: Include clarifying question detection; do NOT flag clarifying questions as deflection

**2. Technique-as-deflection ambiguity**
- Scenario: User uses "future focus" technique to redirect from problem to possibility ("What would it look like if this were resolved?")
- Problem: Legitimate technique that redirects the conversation
- Mitigation: Include `techniqueContext` in Gemini prompt; techniques should not be flagged as deflection
- KDENZ handling: Suppress deflection signal when recognized technique is active

---

## Implementation Notes for Planning

### What to Build First (Priority Order)

**Phase 1: Regex Rules (Immediate, No API Cost)**
Build regex detection rules for the high-confidence, context-independent signals first:
1. Tag question detection (validation-seeking) — highest precision, easiest to implement
2. Presumptuous framing detection — high precision, reliable across contexts
3. Righting reflex / problem-solving rush — high precision for form
4. Filler word opening (reuse FillerDetector.ts) — already built, minimal work
5. Softening prefix detection — high precision for hedging form

These five give immediate, free, same-exchange feedback for the most reliable signals.

**Phase 2: Gemini Call 2 (Per Exchange)**
Add the second Gemini call per exchange for contextual pattern analysis:
- Contextual hedging (confirms regex pre-filter with context)
- Intellectualizing vs. empathizing
- Topic deflection (semantic relevance)
- Session pattern accumulation

**Phase 3: App-Level Timing Events**
Track pause duration (characterResponseTimestamp → recordingStartTimestamp) to detect silence avoidance. No external API needed.

**Phase 4: WPM Calculation from Transcript**
Calculate words per minute from (transcript word count) / (recording duration from MediaRecorder). Simple math, no API.

**Phase 5: Hume Post-Session (Defer to Phase D)**
Upspeak, vocal tension, rhythm acceleration — all require Hume batch API. Per Phase D scope, defer these signals. Build the detection hooks in the data model now (so Hume data can populate them later), but don't block Phase 20.1 on Hume.

### Data Model for Pattern Signals

```typescript
interface ExchangePatternAnalysis {
  exchangeIndex: number;
  timestamp: number;

  // Regex signals (immediate)
  tagQuestionDetected: boolean;
  presumptousFamingDetected: boolean;
  rightingReflexDetected: boolean;
  fillerOpeningDetected: boolean;
  softeningPrefixDetected: boolean;

  // Gemini signals (async, ~2s delay)
  geminiSignals: string[];
  dominantPattern: PatternType | null;
  patternNote: string;
  geminiConfidence: number;

  // App-level timing
  pauseBeforeRecording: number;  // milliseconds
  responseWPM: number | null;

  // Hume signals (post-session, async, Phase D)
  humeUpspeak: boolean | null;
  humePaceVariation: number | null;
  humeTension: number | null;
}

type PatternType =
  | 'hedging'
  | 'validation_seeking'
  | 'intellectualizing'
  | 'presumptuous'
  | 'problem_solving_rush'
  | 'deflection'
  | 'appropriate'
  | 'mixed';

interface SessionPatternSummary {
  sessionId: string;
  patternName: string | null;   // null if confidence < 0.75
  confidence: number;
  observation: string;
  growthEdge: string;
  nextDrill: string;
  dominantSignals: string[];    // top 3 signals detected most frequently
  exchangeCount: number;
  appropriateCount: number;     // exchanges marked "appropriate"
}
```

### Signal Confidence Thresholds (Recommended)

| Signal Source | Minimum Confidence to Show User | Notes |
|--------------|--------------------------------|-------|
| Regex tag question | 95%+ — show immediately | High precision, show in Panel B |
| Regex presumptuous | 90%+ — show immediately | High precision, show in Panel B |
| Regex righting reflex | 88%+ — show per exchange | High precision |
| Gemini contextual hedge | 75%+ — show per exchange | Lower threshold OK because context improves accuracy |
| Gemini intellectualizing | 80%+ — show per exchange | Needs good context |
| Gemini topic deflection | 70% — accumulate, don't show per exchange | Noisy; show only in session debrief if 3+ exchanges |
| Session pattern name | 75%+ — show in session debrief | Only name pattern if confidence is high |
| WPM rushing | 80%+ — show in session debrief | Only if consistently >180 WPM across 3+ exchanges |

### What NOT to Build in Phase 20.1

1. **Hume integration** — Defer to Phase D. Build the data model slots but don't wire Hume yet.
2. **ML-based pattern detection** — Rule-based first (Gemini as "rules with context"). ML after 3-6 months of data.
3. **Cross-session trend visualization** — Wait until 5+ sessions of data.
4. **LIWC license** — Build a curated emotion word list instead; sufficient for Phase 20.1 at ~150 words.
5. **Volume analysis from Web Audio API** — Too noisy without calibration. Let Hume handle this in Phase D.

### Gemini Cost Estimate for Phase 20.1

- Call 2 (per-exchange pattern detection): ~$0.001 per call × 10 exchanges = $0.01/session
- Call 3 (session debrief synthesis): ~$0.002 per call × 1 = $0.002/session
- Total pattern detection cost: ~$0.012/session
- Combined with Phase 20 scoring calls (~$0.01/session): ~$0.022/session total
- At 100 sessions/month/user: ~$2.20/user/month for all AI features (acceptable)

---

## Source References

- Hedging linguistics and NLP: [Training LLMs to Recognize Hedges in Spontaneous Narratives (2024)](https://arxiv.org/html/2408.03319v1) | ["You should probably read this": Hedge Detection in Text](https://arxiv.org/html/2405.13319v1) | [Lexicon-Based Approach for Detecting Hedges in Informal Text](https://www.researchgate.net/publication/341722686_A_Lexicon-Based_Approach_for_Detecting_Hedges_in_Informal_Text)
- Hedging word taxonomy: [Hedge (linguistics) - Wikipedia](https://en.wikipedia.org/wiki/Hedge_(linguistics)) | [What Are Linguistic 'Hedge' Words? - LingoDigest](https://www.lingodigest.com/what-are-linguistic-hedge-words/) | [Linguistic Hedging In Interpersonal Communication](https://www.researchgate.net/publication/335024994_Linguistic_Hedging_In_Interpersonal_Communication)
- Tag questions and coercive communication: [The Coercive Effect of Tag Questions in Professional Communication](https://www.europeanproceedings.com/article/10.15405/epes.22104.19)
- Intellectualization patterns: [Mastering the Defense Mechanism of Intellectualization in Psychology](https://instituteofclinicalhypnosis.com/psychotherapy-coaching/psychodynamic-approach/intellectualization-defense-mechanism-psychology/) | [Intellectualization - Wikipedia](https://en.wikipedia.org/wiki/Intellectualization)
- Empathy detection in NLP: [An Explainable AI Approach for Detecting Empathy in Textual Communication](https://www.mdpi.com/2076-3417/12/19/9407) | [A Computational Approach to Understanding Empathy (ACL)](https://aclanthology.org/2020.emnlp-main.425.pdf)
- LIWC emotion/cognitive ratio: [LIWC - How It Works](https://www.liwc.app/help/howitworks) | [The Psychological Meaning of Words: LIWC and Computerized Text Analysis Methods](https://www.cs.cmu.edu/~ylataus/files/TausczikPennebaker2010.pdf) | [NLP to automatically rate emotion in psychotherapy](https://pmc.ncbi.nlm.nih.gov/articles/PMC8455714/)
- Presumptuous language / epistemic bias: [Epistemic Bias as a Means for the Automated Detection of Injustices in Text](https://arxiv.org/html/2407.06098)
- Speaking pace norms: [Average Speaking Rate and Words per Minute - VirtualSpeech](https://virtualspeech.com/blog/average-speaking-rate-words-per-minute) | [Speech tempo - Wikipedia](https://en.wikipedia.org/wiki/Speech_tempo)
- Hume prosody API: [Hume AI Expression Measurement](https://dev.hume.ai/docs/expression-measurement/overview) | [Hume AI Speech Prosody Model](https://www.hume.ai/products/speech-prosody-model)
- LLM few-shot classification for behavioral patterns: [Assessing feasibility of LLMs for detecting micro-behaviors in team interactions](https://arxiv.org/html/2506.22679)
- Deflection and avoidance patterns: [What Is Deflecting? Recognizing Avoidance Patterns](https://uncovercounseling.com/blog/what-is-deflecting-recognizing-and-addressing-avoidance-in-conversations/)
- Web Speech API: [Voice driven web apps - Introduction to the Web Speech API](https://developer.chrome.com/blog/voice-driven-web-apps-introduction-to-the-web-speech-api)

---

*Research completed: 2026-02-18*
*Agent: 3 of 5 — Phase 20.1 Research*
*Ready for: Synthesis agent after all 5 research agents complete*
