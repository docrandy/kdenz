# VCM Linguistic Marker Detection Codebook

**Purpose:** System-internal detection codebook for KDENZ's VCM diagnostic engine
**Scope:** 61 root causes across 10 constraint gates (C0 through C8B)
**Classification:** INTERNAL -- users never see gate labels, root cause codes, or diagnostic terminology
**Generated:** 2026-02-13
**Source:** VCM Foundational Document, Root Cause Database, Claims Document

---

## Usage Context

This codebook is consumed by the KDENZ background hypothesis engine. Markers are matched against:
- Real-time speech transcripts (Voice Practice via Web Speech API)
- User text responses (Simulation Studio multi-turn conversations)
- Drill attempt answers (Skills Lab technique practice)
- Onboarding diagnostic self-assessment responses
- Behavioral event metadata (quit points, hesitation patterns, retry behavior)

Detection operates at two levels:
1. **Gate-level classification** -- fast initial triage using gate-level keyword clusters (see Appendix A)
2. **Root-cause-level analysis** -- deeper pattern matching using per-RC markers below, triggered after gate hypothesis forms

Confidence accumulates across sessions. No single marker is diagnostic alone. The watchdog requires convergent evidence from 3+ sessions before acting on a hypothesis.

---

## Gate C0: Environmental Permeability

**Core question:** Can the person physically act?
**Vocal signature:** Flat affect, resignation tone, low energy baseline, absence of vocal effort markers; autonomic freeze markers (sudden silence, breath-holding, speech onset delays, vocal tremor during threat/trauma cues)
**Gate-level markers:** Language expressing inability rooted in external/physical constraints rather than psychological states. Tone of resignation rather than frustration. Statements framed as facts about the world rather than feelings about the self.

### RC C0-P: Physical/Biological Limitation

**Explicit markers** (high confidence):
- "I'm too tired to even think about it"
- "My body won't cooperate"
- "I physically can't do this"
- "I've been exhausted for months"
- "I have nothing left in the tank"
- "My health won't let me"
- "I can barely get through the day"
- "I'm running on empty all the time"
- "Everything takes so much energy I don't have"
- "Even small tasks feel physically impossible"

**Implicit patterns** (medium confidence):
- References to chronic fatigue, pain, or medical conditions as reason for non-action across ALL goal domains (not just one)
- Flat, low-energy speech throughout session regardless of topic
- Consistent inability framing that does not shift with motivational probing
- Medical vocabulary interspersed with goal discussion
- Reports of sleep issues, medication effects, or chronic conditions

**Emotional tone:** Resignation without frustration -- maps to C0-P when combined with cross-domain inability and medical history references. Distinguished from C5-1 (Energy Depletion) by persistence across ALL domains vs. selective exhaustion.

**Disambiguation:**
- vs C5-1 (Energy Depletion): C0-P is cross-domain and chronic ("I can't do anything"); C5-1 is selective and situational ("I'm too tired for THIS after a long day"). C0-P persists regardless of rest; C5-1 recovers after rest.
- vs C8A-1 (Motor Initiation Threshold): C0-P is about physical capacity; C8A-1 is about psychological starting ("I want to but my body won't move" vs "I sit there wanting to begin but can't"). C0-P has medical correlates; C8A-1 does not.

**Detection type:** PATTERN -- needs consistent reports across 3+ sessions; single mention could be transient fatigue (C5-1)

---

### RC C0-1: High Activation Cost (Environmental Friction)

*Note: The Foundational Document reclassified this to C5-8 (Environmental Friction) based on agency preservation evidence. Both IDs are tracked here for codebook completeness. Detection logic should route to C5-8.*

**Explicit markers** (high confidence):
- "It's too far away"
- "By the time I set everything up, I've lost motivation"
- "The gym is a 30-minute drive"
- "My workspace is such a mess I can't even start"
- "I'd have to clean up first before I could even begin"
- "It takes too long to get ready"
- "The setup is such a hassle"
- "Everything I need is scattered all over the place"
- "I have to go all the way across town"
- "There are too many steps before I can even start the actual thing"

**Implicit patterns** (medium confidence):
- Repeated references to physical distance, setup time, or environmental disorder as barriers
- Complaints about logistics and preparation rather than the task itself
- Detailed descriptions of friction points preceding the actual goal activity
- Language suggesting the person WOULD act if the environment were different

**Emotional tone:** Mild frustration with a resigned quality -- "it's just too much hassle." Preserves sense of agency ("I choose not to" / "Too much effort") unlike C0 proper.

**Disambiguation:**
- vs C8A-1 (Motor Initiation Threshold): Environmental friction is about external obstacles ("the gym is far"); motor threshold is about internal inability to initiate ("I'm sitting right there and still can't start"). If obstacles were removed, C0-1/C5-8 resolves; C8A-1 persists.
- vs C5-3 (Effort Overestimation): C0-1/C5-8 cites real environmental costs; C5-3 inflates perceived effort beyond reality.

**Detection type:** PATTERN -- needs 3+ mentions of environmental barriers as primary excuse

---

### RC C0-2: Situational Blockage

**Explicit markers** (high confidence):
- "I literally don't have the money for that"
- "My schedule is completely full"
- "I don't have access to what I need"
- "It's not legally possible right now"
- "My family won't let me"
- "There's no childcare available"
- "I can't afford the equipment"
- "My job won't give me the time"
- "There's literally no time in my day"
- "The waiting list is six months long"

**Implicit patterns** (medium confidence):
- Verifiable resource constraints cited (time, money, access, legal, social)
- Language of impossibility rather than difficulty ("can't" vs "hard to")
- Constraints described as external facts, not personal feelings
- Person demonstrates desire and belief but is blocked by objective circumstances
- Multiple concrete barriers named with specificity

**Emotional tone:** Frustration directed outward at circumstances, not inward at self. May include helplessness but not self-blame.

**Disambiguation:**
- vs C5-1 (Competing Commitments): C0-2 is about objective resource unavailability; C5-1 is about choosing to allocate resources elsewhere. "I have no free time" (C0-2) vs "Something always comes up" (C5-1 -- implying choices are being made).
- vs C6-6 (Recursive Justification): C0-2 cites verifiable barriers; C6-6 generates new justifications each time. If the stated barrier is resolved and a new one appears, suspect C6-6.

**Detection type:** ONE-TIME -- a single verified situational blockage is diagnostic. However, pattern of shifting blockages suggests C6-6 instead.

---

### RC C0-8: Trauma-Related Freeze (C0b subcategory)

**Explicit markers** (high confidence):
- "I shut down completely"
- "I can't move or think when that happens"
- "I go blank"
- "I freeze up"
- "My mind goes empty"
- "It's like my body takes over and I can't do anything"
- "I just... stop. I can't explain it"
- "I feel paralyzed"
- "Everything goes numb"
- "I dissociate when it gets intense"

**Implicit patterns** (medium confidence):
- Descriptions of involuntary physical immobility at specific triggers
- Reports of losing time or awareness during stressful moments
- Speech patterns that include sudden silences, breath-holding, or vocal tremor when discussing specific topics
- References to past trauma connected to current freeze responses
- Language indicating the response feels automatic and uncontrollable
- Difficulty describing the experience (pre-verbal quality)

**Emotional tone:** Detachment, numbness, or terror -- distinct from C8A-1 frustration. The person may sound flat or dissociated when describing these episodes, or conversely highly activated with vocal tremor.

**Disambiguation:**
- vs C8A-1 (Motor Initiation Threshold): C0-8 is autonomic and involuntary (amygdala-PAG circuit, <150ms); C8A-1 is volitional hesitation. C0-8 involves physical symptoms (numbness, dissociation); C8A-1 is "I sit there wanting to start." C0-8 is triggered by specific threat cues; C8A-1 is generalized across tasks.
- vs C2-3 (Emotional Avoidance): C0-8 is involuntary shutdown; C2-3 is deliberate avoidance of uncomfortable emotions. C0-8: "I can't stop it from happening." C2-3: "I'd rather not think about it."

**Detection type:** ONE-TIME with high confidence if physical freeze symptoms described. Routes to clinical referral, not behavioral intervention.

---

## Gate C1: Believability

**Core question:** Does the person believe the goal is achievable?
**Vocal signature:** Low confidence markers, pitch instability on self-referential statements, hedging language, rising intonation on declaratives, hesitation clusters
**Gate-level markers:** Self-doubt language, qualification of ability statements, comparisons to others framed negatively, references to past failures as evidence of inability, language suggesting fixed limitations. Key signal: hedging and uncertainty when making claims about their OWN capabilities (vs. uncertainty about the task itself, which is C4).

### RC C1-1: Cognitive Biases (Overconfidence/Planning Fallacy)

**Explicit markers** (high confidence):
- "I thought this would be easy"
- "I always underestimate how long things take"
- "I was sure I could do it by now"
- "I don't understand why I'm not further along"
- "I had no idea it would be this hard"
- "I figured a week would be enough"
- "I keep getting surprised by how complicated it is"
- "Every time I think I'm almost done, there's more"
- "I didn't plan for things to go wrong"
- "I assumed everything would go smoothly"

**Implicit patterns** (medium confidence):
- History of starting projects with high confidence that fades
- Surprise or confusion at failures rather than acceptance
- Absence of contingency thinking or backup planning
- Timelines that consistently prove unrealistic
- Confident tone at project start that shifts to bewilderment later

**Emotional tone:** Bewilderment, genuine surprise at difficulties. Not resignation (C0) or self-doubt (C1-2) but "I really thought this would work."

**Disambiguation:**
- vs C1-5 (Insufficient Evidence): C1-1 has TOO MUCH confidence with insufficient basis; C1-5 has TOO LITTLE confidence due to information gaps. "I was sure I could do it" (C1-1) vs "I don't know enough to know if I can" (C1-5).
- vs C6-2 (Chronic Replanning): C1-1 fails from unrealistic initial plans; C6-2 keeps revising plans regardless of realism. C1-1 is surprised by failure; C6-2 never commits to any plan.

**Detection type:** PATTERN -- needs 3+ instances of unrealistic prediction followed by surprise at failure

---

### RC C1-2: Fixed Mindset

**Explicit markers** (high confidence):
- "I'm just not good at this"
- "Some people can, I can't"
- "I'm not a natural at this"
- "I don't have the talent for it"
- "You either have it or you don't"
- "This isn't my thing"
- "I've never been able to do stuff like this"
- "I'm just not wired that way"
- "I'm not the type of person who can do this"
- "Smart people can do this, I can't"
- "It's not in my DNA"
- "I was never good at this kind of thing, even as a kid"

**Implicit patterns** (medium confidence):
- Trait-based self-descriptions ("I AM bad at X" vs "I HAVEN'T LEARNED X yet")
- Avoidance of challenges that might reveal limitations
- Interpreting struggle as evidence of inability rather than learning
- Comparing self unfavorably to others with natural talent framing
- Language suggesting abilities are innate and permanent
- Rapid give-up behavior after initial difficulty

**Emotional tone:** Resigned certainty -- not anxious uncertainty (C1-4) but settled conviction of limitation. May sound matter-of-fact rather than distressed.

**Disambiguation:**
- vs C1-3 (No Relatable Models): C1-2 is "I can't because of who I am" (internal attribution); C1-3 is "Nobody like me has done this" (social reference frame). C1-2 focuses on personal traits; C1-3 focuses on absence of similar-other evidence.
- vs C5-7 (Identity Misalignment): C1-2 is "I can't do it" (ability belief); C5-7 is "That's not who I am" (identity protection). C1-2 doubts capability; C5-7 rejects the goal as inconsistent with self-concept.
- vs C2-1 (Value Misalignment): C1-2 says "I can't"; C2-1 says "I don't really want to." C1-2 has desire but no belief; C2-1 has neither desire nor belief.

**Detection type:** PATTERN -- trait-based language needs to appear across 3+ contexts to distinguish from situational self-doubt

---

### RC C1-3: No Relatable Models

**Explicit markers** (high confidence):
- "Nobody like me has done this"
- "I don't know anyone who's succeeded at this"
- "I've never seen someone from my background do this"
- "Everyone who does this is different from me"
- "There are no examples of people like me doing this"
- "I don't have a role model for this"
- "The people who succeed at this don't look like me"
- "I'm the first person in my family to try something like this"
- "I don't know who to look up to"
- "Nobody in my circle does this kind of thing"

**Implicit patterns** (medium confidence):
- References to demographic, cultural, or social group when explaining doubt
- Framing success stories as belonging to "other kinds of people"
- Seeking validation from similar others rather than experts
- Language emphasizing isolation or being "the only one"
- Questions about whether "someone like me" can succeed

**Emotional tone:** Loneliness and isolation mixed with uncertainty. Not self-blame (C1-2) but social disconnection from the possibility of success.

**Disambiguation:**
- vs C1-2 (Fixed Mindset): C1-3 is about social evidence ("nobody like me"); C1-2 is about personal capacity ("I can't"). C1-3 would be resolved by seeing a relatable model succeed; C1-2 would not.
- vs C1-7 (Social Disconfirmation): C1-3 is absence of positive models; C1-7 is presence of active discouragement. "I don't know anyone who did this" (C1-3) vs "Everyone tells me I can't" (C1-7).

**Detection type:** ONE-TIME -- a clear statement about absence of relatable models is immediately diagnostic

---

### RC C1-4: Meta-Cognitive Doubt

**Explicit markers** (high confidence):
- "I can't trust my own decisions"
- "What if I'm wrong about being able to do this?"
- "I second-guess everything"
- "How do I know my judgment is any good?"
- "I think I can do it but then I doubt the thought itself"
- "I don't trust my own instincts anymore"
- "Every time I decide, I immediately question it"
- "Maybe I'm just fooling myself"
- "I can't tell if I'm being realistic or delusional"
- "What if my confidence is just wishful thinking?"

**Implicit patterns** (medium confidence):
- Layered uncertainty (doubt about doubt, thinking about thinking)
- Qualifying confidence statements immediately after making them
- Seeking external validation before trusting any self-assessment
- Verbal loops where the person argues with themselves
- Meta-commentary on their own reasoning process

**Emotional tone:** Anxious, recursive quality. Not simple uncertainty (C1-5) but uncertainty ABOUT their own capacity to evaluate uncertainty.

**Disambiguation:**
- vs C1-5 (Insufficient Evidence): C1-4 doubts their OWN judgment; C1-5 lacks EXTERNAL information. "I can't trust my own assessment" (C1-4) vs "I don't have enough information" (C1-5).
- vs C1-6 (Fragile Confidence): C1-4 never forms stable confidence; C1-6 forms it but it collapses under pressure. C1-4 is chronic; C1-6 is triggered by setbacks.

**Detection type:** PATTERN -- recursive self-doubt language across 3+ sessions

---

### RC C1-5: Insufficient Evidence

**Explicit markers** (high confidence):
- "I don't know enough to know if I can do this"
- "I need more information before I can commit"
- "I haven't done enough research yet"
- "I'm not sure what this actually involves"
- "I don't have a clear picture of what's needed"
- "I need to learn more before I can try"
- "I'm not sure if it's even feasible"
- "I'd need to see proof that this works first"
- "I don't understand the process well enough"
- "How do I know this approach even works?"

**Implicit patterns** (medium confidence):
- Extended research or information-gathering without action
- Asking many questions about feasibility and process
- Conditional language tied to information gaps ("if I knew X, I could Y")
- Seeking evidence, data, testimonials before commitment
- Intellectual engagement without emotional commitment

**Emotional tone:** Cautious and analytical rather than fearful or resigned. Genuine curiosity paired with hesitation.

**Disambiguation:**
- vs C1-4 (Meta-Cognitive Doubt): C1-5 lacks external data; C1-4 distrusts internal processing. "I don't have enough info" (C1-5) vs "I can't trust my own judgment about the info" (C1-4).
- vs C6-2 (Chronic Replanning): C1-5 is gathering information BEFORE forming a plan; C6-2 is revising plans AFTER forming them. C1-5 hasn't committed; C6-2 keeps recommitting differently.

**Detection type:** TREND -- escalating research behavior without progression to action

---

### RC C1-6: Fragile Confidence

**Explicit markers** (high confidence):
- "One bad day and I'm back to square one"
- "I was doing great until someone criticized me"
- "I lose all my confidence after one mistake"
- "It only takes one setback to make me want to quit"
- "I was feeling good about it but then..."
- "My confidence is so fragile"
- "The slightest thing throws me off completely"
- "I was on track and then one comment derailed everything"
- "I can't handle any negative feedback"
- "When things go wrong I feel like I was stupid to even try"

**Implicit patterns** (medium confidence):
- Confidence that fluctuates dramatically between sessions
- Disproportionate emotional reactions to minor setbacks
- Language revealing extreme sensitivity to criticism or failure
- Pattern of progress followed by collapse after small negative events
- Seeking reassurance after any difficulty

**Emotional tone:** Volatility -- oscillating between confidence and despair. Distinct from steady low confidence (C1-2) by the FLUCTUATION pattern.

**Disambiguation:**
- vs C1-2 (Fixed Mindset): C1-6 HAS confidence that is unstable; C1-2 NEVER has confidence. C1-6 says "I was doing great until..."; C1-2 says "I was never good at this."
- vs C8B-4 (Single-Error Catastrophizing): C1-6 is about BELIEF collapse; C8B-4 is about TASK abandonment. C1-6: "I lost confidence in myself." C8B-4: "I messed up so why finish this specific task."

**Detection type:** PATTERN -- requires observing the fluctuation cycle across 2+ sessions

---

### RC C1-7: Social Disconfirmation

**Explicit markers** (high confidence):
- "Everyone says I can't do this"
- "My family doesn't believe in me"
- "People keep telling me it won't work"
- "Nobody thinks I can pull this off"
- "My friends laugh when I talk about this"
- "My partner thinks it's a waste of time"
- "I keep getting told to be realistic"
- "People I respect don't think this is possible for me"
- "Everyone around me is skeptical"
- "I feel like I'm the only one who thinks I can do this"

**Implicit patterns** (medium confidence):
- Quoting others' negative opinions about the goal
- Reporting social pressure to abandon or modify the goal
- Seeking approval from specific people before proceeding
- Language indicating erosion of belief through accumulated social feedback
- Defensive posture when discussing the goal (as if anticipating criticism)

**Emotional tone:** Hurt, defensiveness, or deflation. The person may sound combative (fighting against social pressure) or defeated (giving in to it).

**Disambiguation:**
- vs C1-3 (No Relatable Models): C1-7 has active discouragement; C1-3 has absence of encouragement. "They say I can't" (C1-7) vs "I don't know anyone who has" (C1-3).
- vs C2-4 (Autonomy Threat/Reactance): C1-7 internalizes others' doubt (belief erosion); C2-4 rebels against it (counter-motivation). C1-7 leads to decreased confidence; C2-4 leads to resistance and "don't tell me what to do."

**Detection type:** PATTERN -- sustained social discouragement across multiple reports

---

### RC C1-8: Attribution Error

**Explicit markers** (high confidence):
- "I just got lucky that time"
- "Someone helped me, it wasn't really me"
- "It was easy, it doesn't count"
- "That doesn't prove anything about my ability"
- "Anyone could have done that"
- "The circumstances were in my favor"
- "I only succeeded because the bar was low"
- "It was a fluke"
- "That was a one-time thing, I couldn't do it again"
- "I had a lot of help, so it's not really my accomplishment"

**Implicit patterns** (medium confidence):
- Consistent discounting of personal achievements
- Attributing success to external factors (luck, help, easy conditions)
- Failure to update self-assessment after positive experiences
- Minimizing language around accomplishments
- Inability to internalize positive feedback

**Emotional tone:** Dismissiveness toward own success, sometimes with discomfort when praised. Not false modesty but genuine inability to accept credit.

**Disambiguation:**
- vs C1-2 (Fixed Mindset): C1-8 has evidence of success but discounts it; C1-2 has no evidence or ignores it. "I got lucky" (C1-8) vs "I can't do this" (C1-2). C1-8 succeeded and explains it away; C1-2 hasn't tried or failed.
- vs C5-8 (Identity-Behavior Dissonance): C1-8 discounts past success; C5-8 notes gap between stated goals and actual behavior. C1-8 is backward-looking (past success doesn't count); C5-8 is forward-looking (I keep failing to do what I say).

**Detection type:** PATTERN -- needs repeated discounting across multiple success instances

---

## Gate C2: Desire

**Core question:** Does the person genuinely want the goal?
**Vocal signature:** Flat engagement when discussing goal, vocal tension on commitment statements, energy drops during future-casting, mismatch between verbal enthusiasm and prosodic markers
**Gate-level markers:** Disconnection between stated goal and emotional engagement. Flat or forced enthusiasm. Energy shifts downward when discussing the specific goal vs. other topics. "Should" language dominating over "want" language. Passive voice when describing goal pursuit. Key signal: content-prosody mismatch -- saying the right words without the right energy.

### RC C2-1: Value Misalignment

**Explicit markers** (high confidence):
- "I should want this but I don't"
- "Everyone says this is important"
- "I know I'm supposed to care about this"
- "It sounds good on paper but..."
- "This isn't really what I'd choose for myself"
- "I'm doing this because I'm supposed to"
- "My heart isn't in it"
- "I can see why it matters but it doesn't feel important to me"
- "I'm going through the motions"
- "If I'm being honest, I don't really care about this"
- "It feels like someone else's dream"
- "I'm pursuing this for the wrong reasons"

**Implicit patterns** (medium confidence):
- Heavy use of "should" and "supposed to" language
- Describing the goal in others' words rather than own
- Flat prosody when discussing the goal vs. animated on other topics
- Difficulty articulating personal reasons for the goal
- Stated motivation tied to external approval, not internal value
- Passive voice about goal pursuit ("it needs to be done" vs "I want to do it")

**Emotional tone:** Flatness, dutiful compliance without enthusiasm. Sometimes guilt about not wanting what they "should" want.

**Disambiguation:**
- vs C2-6 (External Motivation): C2-1 has no intrinsic desire; C2-6 has desire but it's fueled by external rewards. "I don't really want this" (C2-1) vs "I want the reward, not the thing itself" (C2-6). C2-1 is misalignment; C2-6 is misdirected motivation source.
- vs C2-7 (Purpose Deficit): C2-1 has a value conflict (goal contradicts values); C2-7 has a value vacuum (no meaningful connection at all). "This isn't what I value" (C2-1) vs "What's the point?" (C2-7).

**Detection type:** PATTERN -- value misalignment typically emerges across 2-3 sessions as the user becomes more candid

---

### RC C2-2: Fear-Suppressed Desire

**Explicit markers** (high confidence):
- "I want to but what if..."
- "It could ruin everything"
- "What if I succeed and my life changes too much?"
- "I'm scared of what might happen if I actually do this"
- "The idea excites me but terrifies me"
- "I want it but I'm afraid of the consequences"
- "Success would mean giving up other things"
- "What if people treat me differently?"
- "I want to try but I can't handle what might go wrong"
- "Part of me wants this but another part is terrified"

**Implicit patterns** (medium confidence):
- Visible tension or vocal strain when imagining success, not just failure
- Approach behaviors immediately followed by withdrawal
- Discussion of desire that abruptly shifts to catastrophic scenarios
- Fear language specifically tied to CONSEQUENCES of success, not just failure
- Oscillating enthusiasm (excited then scared, back and forth)

**Emotional tone:** Tension, anxiety overlaid on genuine desire. The desire IS there but suppressed. Differs from C2-5 (Approach-Avoidance) by the dominance of fear as the suppressing force.

**Disambiguation:**
- vs C2-5 (Approach-Avoidance Conflict): C2-2 has desire suppressed by fear; C2-5 has roughly equal approach and avoidance forces. C2-2: "I want it but I'm scared." C2-5: "Part of me wants to, part of me doesn't" (ambivalence, not fear).
- vs C5-5 (Failure Cost Aversion): C2-2 fears consequences of BOTH success and failure; C5-5 specifically fears the cost of FAILURE. "What if I succeed and everything changes?" (C2-2) vs "What if I fail and everyone sees?" (C5-5).
- vs C2-3 (Emotional Avoidance): C2-2 fears specific consequences; C2-3 avoids the emotional experience of engagement itself. C2-2 can name the fear; C2-3 just doesn't want to feel bad.

**Detection type:** PATTERN -- fear-desire oscillation needs to be observed across multiple instances

---

### RC C2-3: Emotional Avoidance

**Explicit markers** (high confidence):
- "I'd rather not think about it"
- "It makes me uncomfortable to even talk about this"
- "I get anxious just thinking about doing it"
- "I avoid anything that brings up those feelings"
- "It's too stressful to deal with"
- "I shut down when it gets emotional"
- "I don't want to feel that way again"
- "Just thinking about it gives me anxiety"
- "I keep putting it off because it makes me feel bad"
- "I'd rather ignore it than face how it makes me feel"

**Implicit patterns** (medium confidence):
- Topic avoidance in conversation (changing subject when goal discussed)
- Physical discomfort indicators when discussing goal
- Generalized avoidance language without specific fears named
- Engagement with the goal only at intellectual, never emotional level
- Procrastination driven by emotional discomfort rather than practical barriers
- "I don't know why I avoid it" (lack of conscious access to the emotional barrier)

**Emotional tone:** Discomfort, anxiety, withdrawal. May present as flat affect (suppression) or visible agitation when pressed on the goal.

**Disambiguation:**
- vs C2-2 (Fear-Suppressed Desire): C2-3 avoids emotional experience broadly; C2-2 fears specific consequences. C2-3: "It feels bad." C2-2: "I'm afraid of what will happen."
- vs C0-8 (Trauma-Related Freeze): C2-3 is deliberate avoidance with agency; C0-8 is involuntary shutdown. C2-3 chooses not to engage; C0-8 cannot engage.
- vs C8A-4 (Waiting for Readiness): C2-3 avoids because of emotional cost; C8A-4 waits for ideal conditions. "I don't want to feel that" (C2-3) vs "I'll start when I'm ready" (C8A-4).

**Detection type:** PATTERN -- avoidance behavior needs to be consistent across 3+ sessions

---

### RC C2-4: Autonomy Threat (Reactance)

**Explicit markers** (high confidence):
- "Don't tell me what to do"
- "The more they push, the less I want to"
- "I don't like being forced into things"
- "I'd probably want to do this if nobody was making me"
- "Stop pressuring me and maybe I'll do it"
- "I rebel when people try to control me"
- "It feels like I have no choice, which makes me not want to"
- "I hate being told I have to do something"
- "The minute someone says I should, I lose interest"
- "I'll do it on my own terms or not at all"

**Implicit patterns** (medium confidence):
- Oppositional language when discussing the goal source (boss, spouse, doctor)
- Motivation that DECREASES with increased external pressure
- Freedom language ("my choice," "my terms," "when I decide")
- Resistance correlated with perceived authority or obligation
- Desire that emerges when pressure is removed

**Emotional tone:** Defiance, irritation, or passive resistance. Energy is present (unlike C2-1 flatness) but directed against the perceived controller.

**Disambiguation:**
- vs C2-1 (Value Misalignment): C2-4 might want it if free from pressure; C2-1 genuinely doesn't want it. "I'd want this if nobody was forcing me" (C2-4) vs "I don't want this at all" (C2-1).
- vs C2-6 (External Motivation): C2-4 resists external control; C2-6 depends on it. Opposite relationship to external pressure.
- vs C1-7 (Social Disconfirmation): C1-7 internalizes others' doubt; C2-4 pushes back against others' pressure. C1-7 leads to belief erosion; C2-4 leads to motivated defiance.

**Detection type:** PATTERN -- reactance needs to be observed in response to pressure across multiple contexts

---

### RC C2-5: Approach-Avoidance Conflict

**Explicit markers** (high confidence):
- "Part of me wants to, part of me doesn't"
- "I'm torn"
- "I go back and forth on this"
- "I can see the benefits and the downsides equally"
- "One day I want it, the next day I don't"
- "I'm stuck in the middle"
- "I can't decide if I want this or not"
- "The pros and cons feel exactly equal"
- "I keep changing my mind"
- "I'm pulled in both directions at once"

**Implicit patterns** (medium confidence):
- Oscillating statements within a single conversation
- Inability to commit in either direction
- Equal energy given to reasons for and against
- Decision paralysis specifically about WANTING (not about HOW)
- Pattern of approaching and then withdrawing from the goal

**Emotional tone:** Ambivalence, stuckness, frustration at own indecision. Neither enthusiastic nor defeated but oscillating.

**Disambiguation:**
- vs C2-2 (Fear-Suppressed Desire): C2-5 has genuine ambivalence (both forces real); C2-2 has desire suppressed by fear (desire is clear, fear blocks it). C2-5 is uncertain about wanting; C2-2 wants but is afraid.
- vs C5-6 (Decision Paralysis): C2-5 is about whether to WANT the goal; C5-6 is about which APPROACH to take. C2-5: "I don't know if I want this." C5-6: "I want it but can't decide how."
- vs C5-6 (Value Contradiction): C2-5 is desire-level ambivalence; C5-6 is commitment-level value conflict. C2-5: "I go back and forth on wanting it." C5-6: "This goal conflicts with my other values."

**Detection type:** PATTERN -- oscillation needs to be observed across 2+ sessions (single-session ambivalence may be normal processing)

---

### RC C2-6: External Motivation

**Explicit markers** (high confidence):
- "I'm only doing this because my boss/spouse/parent wants me to"
- "I lose interest when nobody's watching"
- "Without the reward, I wouldn't bother"
- "I'm doing this to impress people"
- "If nobody noticed, I'd stop"
- "I need external validation to keep going"
- "I'm motivated by the paycheck, not the work"
- "Take away the prize and I have no reason to do this"
- "I do it for the likes, the praise, the recognition"
- "I'm performing for an audience, not for myself"

**Implicit patterns** (medium confidence):
- Motivation that fluctuates with external reinforcement schedules
- Engagement only when being observed or evaluated
- Discussion of goals in terms of others' expectations
- Drop in effort when external monitoring disappears
- Difficulty naming personal reasons for pursuing the goal

**Emotional tone:** Performative enthusiasm when being observed; flat or disengaged in private. Energy spikes around external validation events.

**Disambiguation:**
- vs C2-1 (Value Misalignment): C2-6 has SOME motivation but it's externally sourced; C2-1 has NO genuine motivation. C2-6 will work for the reward; C2-1 won't work even with rewards.
- vs C5-3 (No External Monitoring): C2-6 depends on external motivation as the SOURCE; C5-3 needs monitoring to maintain already-existing commitment. C2-6 has no intrinsic drive; C5-3 has drive that decays without accountability.

**Detection type:** PATTERN -- needs observation of motivation fluctuation tied to external reinforcement

---

### RC C2-7: Purpose Deficit

**Explicit markers** (high confidence):
- "What's the point?"
- "This doesn't matter"
- "I don't see why I should care"
- "So what if I do it?"
- "Nothing feels meaningful right now"
- "I can't connect this to anything I care about"
- "It all feels pointless"
- "Why does any of this matter?"
- "I have no reason to do this"
- "Even if I succeed, so what?"

**Implicit patterns** (medium confidence):
- Nihilistic or existential language around the goal
- Inability to articulate why the goal matters to them personally
- Flat affect across ALL topics, not just the specific goal
- Questions about meaning that extend beyond the immediate goal
- Indifference rather than opposition or fear

**Emotional tone:** Emptiness, apathy, existential flatness. Not angry (C2-4), not afraid (C2-2), not torn (C2-5) -- just empty.

**Disambiguation:**
- vs C2-1 (Value Misalignment): C2-7 has no meaningful connection to ANY purpose; C2-1 has a specific conflict between goal and values. "What's the point of anything?" (C2-7) vs "This isn't what I value" (C2-1).
- vs C2-8 (Lack of Future Relevance): C2-7 is present-tense emptiness; C2-8 is temporal disconnection. "This doesn't matter" (C2-7, now) vs "This won't matter in 5 years" (C2-8, future).
- vs C8B-6 (Invisible Progress): C2-7 has no sense of WHY to persist; C8B-6 has the why but can't see RESULTS. "What's the point?" (C2-7) vs "I'm not getting anywhere" (C8B-6).

**Detection type:** PATTERN -- pervasive purposelessness needs to appear across sessions and topics; single-instance may be transient mood

---

### RC C2-8: Lack of Future Relevance

**Explicit markers** (high confidence):
- "I won't care about this in 5 years"
- "This doesn't matter for my future"
- "Future me doesn't need this"
- "Why invest now when it won't pay off for years?"
- "I can't see how this connects to where I'm going"
- "It feels like I'm working toward someone else's future"
- "The payoff is too far away to feel real"
- "I'll worry about it when it actually matters"
- "This is a problem for future me"
- "By then everything will be different anyway"

**Implicit patterns** (medium confidence):
- Temporal language that discounts future states
- Difficulty connecting present actions to future outcomes
- Present-focused language with little future-oriented planning
- Dismissal of long-term consequences
- "Future self" treated as a different person

**Emotional tone:** Disconnection from future self, present-orientation. Not anxious but disengaged from temporally distant outcomes.

**Disambiguation:**
- vs C2-7 (Purpose Deficit): C2-8 is temporal discounting; C2-7 is meaning vacuum. "This won't matter later" (C2-8) vs "This doesn't matter now or ever" (C2-7).
- vs C5-2 (Delayed Gratification Intolerance): C2-8 is about desire for the distant outcome (not valued); C5-2 is about tolerance for the delay (valued but impatient). "I don't care about the future reward" (C2-8) vs "I need results NOW" (C5-2).

**Detection type:** PATTERN -- future-discounting language across multiple contexts

---

## Gate C3: Awareness

**Core question:** Is the person aware of their patterns and triggers?
**Vocal signature:** [V2 addition - detailed analysis pending]
**Gate-level markers:** [V2 addition - detailed analysis pending]

### RC AA-1: [V2 addition - detailed analysis pending]

### RC AA-2: [V2 addition - detailed analysis pending]

### RC AA-5: [V2 addition - detailed analysis pending]

---

## Gate C4: Attention

**Core question:** Can the person direct and sustain attention on relevant cues?
**Vocal signature:** [V2 addition - detailed analysis pending]
**Gate-level markers:** [V2 addition - detailed analysis pending]

### RC AA-3: [V2 addition - detailed analysis pending]

### RC AA-4: [V2 addition - detailed analysis pending]

### RC AA-6: [V2 addition - detailed analysis pending]

### RC AA-7: [V2 addition - detailed analysis pending]

### RC AA-8: [V2 addition - detailed analysis pending]

### RC AA-9: [V2 addition - detailed analysis pending]

### RC AA-10: [V2 addition - detailed analysis pending]

---

## Gate C5: Will

**Core question:** Is the person willing to bear the cost?
**Vocal signature:** Stress spikes when discussing effort/sacrifice, vocal strain on cost descriptions, pitch elevation during effort estimation, breath pattern disruption
**Gate-level markers:** Cost-focused language, effort complaints, weighing language, "but" constructions that introduce cost after desire. References to sacrifice, hardship, price, burden. Key signal: the person WANTS the goal and BELIEVES they can do it, but protests the cost. Desire is present; willingness to pay the price is not.

### RC C5-1: Energy Depletion

**Explicit markers** (high confidence):
- "I'm too tired"
- "I have nothing left"
- "I'm completely drained"
- "I'm exhausted by everything else"
- "I just don't have the energy"
- "By the end of the day I have nothing left to give"
- "I'm running on fumes"
- "I used up all my willpower on other stuff"
- "I'm burned out"
- "My tank is empty"

**Implicit patterns** (medium confidence):
- Fatigue language that is domain-selective (too tired for THIS but not for leisure)
- Energy complaints correlated with demanding days/weeks
- Performance that varies with energy state (good on rested days)
- Depletion language tied to specific life demands
- Recovery-contingent willingness ("I could do it if I rested first")

**Emotional tone:** Weary, depleted, sometimes irritable about being asked to do more.

**Disambiguation:**
- vs C0-P (Physical/Biological Limitation): C5-1 is situational/recoverable; C0-P is chronic/medical. C5-1 recovers with rest; C0-P persists. C5-1 is domain-selective; C0-P is cross-domain.
- vs C8B-3 (Mood-Dependent Execution): C5-1 is about energy level; C8B-3 is about emotional state. "I'm too tired" (C5-1) vs "I'm not in the mood" (C8B-3).

**Detection type:** PATTERN -- needs recurrence across sessions; single mention is normal transient fatigue

---

### RC C5-2: Delayed Gratification Intolerance

**Explicit markers** (high confidence):
- "I need to see results now"
- "Why bother if the payoff is years away?"
- "I want instant results"
- "I can't wait that long"
- "If I can't see progress immediately, I lose interest"
- "The reward is too far away to motivate me"
- "I want the quick fix"
- "I'm not patient enough for this"
- "Show me it's working or I'm done"
- "Life is short, I can't wait around for results"

**Implicit patterns** (medium confidence):
- Preference for short-term rewards over long-term benefits
- Quick abandonment of processes that don't show immediate results
- Comparison of effort NOW to reward LATER with emphasis on the gap
- Interest in shortcuts, hacks, and accelerated timelines
- Engagement that drops when told the timeline is long

**Emotional tone:** Impatience, frustration with slow progress, urgency.

**Disambiguation:**
- vs C2-8 (Lack of Future Relevance): C5-2 WANTS the future reward but can't tolerate the wait; C2-8 doesn't VALUE the future reward. "I want it but I can't wait" (C5-2) vs "I don't care about the long-term outcome" (C2-8).
- vs C8B-6 (Invisible Progress): C5-2 is intolerance of ANY delay; C8B-6 is frustration with lack of VISIBLE progress. C5-2 knows progress takes time but can't wait; C8B-6 doesn't see progress happening at all.

**Detection type:** PATTERN -- impatience needs to appear across multiple goal contexts

---

### RC C5-3: Effort Overestimation

**Explicit markers** (high confidence):
- "This will be horrible"
- "I can't handle that much work"
- "It's going to be way too hard"
- "Just thinking about how much effort it takes makes me not want to"
- "It's going to take forever"
- "The amount of work is overwhelming"
- "I'd have to completely change my life"
- "It's such a massive undertaking"
- "The effort required is insane"
- "I'll never be able to keep up with that workload"

**Implicit patterns** (medium confidence):
- Catastrophic effort language ("impossible," "forever," "massive")
- Disproportionate distress about effort relative to actual task size
- Retrospective acknowledgment that things were easier than expected
- Effort estimates that consistently exceed actual experience
- Avoidance of starting because of anticipated (not actual) difficulty
- Magnification of individual steps without seeing them as manageable

**Emotional tone:** Overwhelm, dread, anticipatory exhaustion. The person is tired from THINKING about the effort, not from doing it.

**Disambiguation:**
- vs C5-1 (Energy Depletion): C5-3 overestimates effort; C5-1 lacks energy. "This will be horrible" (C5-3, prediction) vs "I'm too tired" (C5-1, current state). C5-3 may have energy but believes the task requires too much; C5-1 has insufficient energy for any level of effort.
- vs C0-1/C5-8 (Environmental Friction): C5-3 inflates perceived effort; C0-1/C5-8 cites real environmental barriers. "It'll be SO hard" (C5-3) vs "The gym is 30 minutes away" (C0-1/C5-8 -- objective fact).

**Detection type:** PATTERN -- consistent effort overestimation followed by "it wasn't that bad" revelations

---

### RC C5-4: Insufficient Perceived Reward

**Explicit markers** (high confidence):
- "The payoff isn't worth it"
- "I don't care enough about the result"
- "What do I even get out of this?"
- "The juice isn't worth the squeeze"
- "It's not a big enough deal to work that hard for"
- "So what if I improve a little?"
- "The benefit is marginal at best"
- "I'd need a much bigger reward to motivate me"
- "It's not like this will change my life"
- "For all that work, I get... what?"

**Implicit patterns** (medium confidence):
- Cost-benefit language consistently tilted toward cost
- Minimization of potential benefits
- Comparison to alternative uses of time/effort
- Reward described in abstract, non-compelling terms
- Difficulty getting excited about the outcome

**Emotional tone:** Dismissive, unimpressed, calculating. Not angry or sad but fundamentally unmoved by the reward.

**Disambiguation:**
- vs C2-7 (Purpose Deficit): C5-4 evaluates the reward and finds it insufficient; C2-7 cannot find ANY meaning. C5-4: "The reward isn't worth it" (cost-benefit calculation); C2-7: "What's the point?" (existential emptiness).
- vs C2-1 (Value Misalignment): C5-4 is about reward magnitude; C2-1 is about value fit. C5-4: "The reward is too small"; C2-1: "The reward is the wrong kind."

**Detection type:** PATTERN -- consistent reward-minimization across sessions

---

### RC C5-5: Failure Cost Aversion

**Explicit markers** (high confidence):
- "What if I fail and everyone sees?"
- "I'd rather not try than fail"
- "Failing would be humiliating"
- "I can't afford to fail at this"
- "If I don't try, at least I haven't failed"
- "The embarrassment of failing isn't worth the chance"
- "What would people think if I failed?"
- "I have too much to lose"
- "Failure would confirm that I'm not good enough"
- "The stakes are too high to risk failing"

**Implicit patterns** (medium confidence):
- Loss-framing of outcomes (what could go WRONG dominates discussion)
- Preoccupation with worst-case scenarios
- Risk aversion that extends to low-stakes situations
- Identity-level language about failure ("it would mean I'm a failure")
- Preference for safe inaction over risky action

**Emotional tone:** Dread, protective anxiety, self-preservation. Distinct from general anxiety by its specificity to failure consequences.

**Disambiguation:**
- vs C2-2 (Fear-Suppressed Desire): C5-5 fears failure specifically; C2-2 fears consequences of success AND failure. "What if I fail?" (C5-5) vs "What if I succeed and everything changes?" (C2-2).
- vs C1-2 (Fixed Mindset): C5-5 believes they COULD succeed but fears the cost of failure; C1-2 doesn't believe they CAN succeed. "I could do it but what if I fail?" (C5-5) vs "I can't do it" (C1-2).
- vs C8A-6 (Self-Sabotage): C5-5 is conscious fear of failure cost; C8A-6 is unconscious barrier creation. C5-5 articulates the fear; C8A-6 creates obstacles without awareness.

**Detection type:** PATTERN -- failure-focused language needs to persist across 3+ sessions

---

### RC C5-6: Decision Paralysis (Analysis Paralysis)

**Explicit markers** (high confidence):
- "I can't decide"
- "What if I choose wrong?"
- "I keep going back and forth"
- "I've been researching this for months and still haven't committed"
- "Every option has drawbacks"
- "I'm stuck comparing alternatives"
- "I need to find the perfect option first"
- "What if there's a better way I haven't considered?"
- "I keep finding more options to evaluate"
- "I'll commit once I'm sure this is the right choice"

**Implicit patterns** (medium confidence):
- Extensive comparison language without resolution
- Research behavior that never converts to action
- Equal weighting of all options (no satisficing)
- Fear of regret or opportunity cost
- Optimization language ("the best," "the perfect," "the right one")

**Emotional tone:** Anxious indecision, fear of making the wrong choice. Engaged but stuck.

**Disambiguation:**
- vs C2-5 (Approach-Avoidance Conflict): C5-6 is about WHICH option; C2-5 is about WHETHER to want it at all. C5-6 has decided to pursue the goal but can't pick the approach; C2-5 hasn't decided if they want the goal.
- vs C6-3 (Plan Selection Failure): C5-6 is about overall commitment decision; C6-3 is about specific plan selection. C5-6 is pre-commitment; C6-3 is post-commitment, pre-execution. "I can't decide if this is worth doing this way" (C5-6) vs "I'm committed but don't know which plan to use" (C6-3).
- vs C6-2 (Chronic Replanning): C5-6 never picks; C6-2 picks but keeps revising. C5-6 is stuck at choice; C6-2 is stuck in revision loops.

**Detection type:** PATTERN -- decision avoidance across 3+ sessions

---

### RC C5-8: Environmental Friction

*Note: Reclassified from C0-1. See C0-1 entry above for markers. Agency is preserved in this root cause -- the person processes costs through deliberative prefrontal-striatal circuits and CHOOSES not to act based on environmental costs. Phenomenology: "I choose not to" / "Too much effort."*

**Detection type:** PATTERN -- see C0-1 entry

---

## Gate C6: Intention

**Core question:** Has the person formed a concrete plan?
**Vocal signature:** Vague language, generic planning phrases, low specificity markers, hesitation on "when" and "how" questions, confident tone on "what" but uncertain on execution details
**Gate-level markers:** Aspirational language without concrete specifics. Confidence about goals that evaporates when asked about implementation. Generic plans ("I'll try harder," "I need to start doing X"). Inability to name specific times, places, or first steps. Key signal: the gap between WHAT they want and HOW they will get it.

### RC C6-1: Conflicting Plans

**Explicit markers** (high confidence):
- "I have too many things going on"
- "I can't focus on just one thing"
- "Everything feels equally important"
- "I'm stretched in too many directions"
- "I have five different priorities right now"
- "I can't prioritize because they all matter"
- "My to-do list is impossible"
- "I keep getting pulled between different goals"
- "I don't know which thing to work on first"
- "There aren't enough hours for everything I need to do"

**Implicit patterns** (medium confidence):
- Listing multiple active goals without priority ordering
- Switching between topics/goals rapidly in conversation
- Inability to identify the SINGLE most important next action
- Time allocation described as fractured across many commitments
- Guilt about neglecting one goal when working on another

**Emotional tone:** Overwhelm, scattered energy, guilt about what's not getting done.

**Disambiguation:**
- vs C5-1 (Competing Commitments): C6-1 is about PLANNING capacity; C5-1 is about COMMITMENT maintenance. C6-1 can't form a coherent plan because too many things; C5-1 has a plan but can't maintain commitment because other things take priority.
- vs C6-4 (Cognitive Overload): C6-1 has too many PLANS; C6-4 has one plan that's too COMPLEX. "I have too many goals" (C6-1) vs "This one plan has too many steps" (C6-4).

**Detection type:** PATTERN -- fragmented attention across 3+ sessions

---

### RC C6-2: Chronic Replanning

**Explicit markers** (high confidence):
- "I need a better plan first"
- "Let me rethink my approach"
- "I've changed my strategy again"
- "I'm going to try a different method"
- "I keep adjusting my plan"
- "I want to plan it perfectly before starting"
- "I've made 10 different plans for this"
- "I spent all weekend planning instead of doing"
- "I love the planning phase but never get to execution"
- "I need to optimize my approach before I begin"

**Implicit patterns** (medium confidence):
- Multiple plan iterations mentioned without any execution history
- Planning described with more enthusiasm than doing
- New plan replaces old plan without the old plan being attempted
- Planning as a form of procrastination
- Detailed, elaborate plans that are never implemented
- Dopaminergic satisfaction from the planning activity itself

**Emotional tone:** Enthusiasm during planning, deflation when asked about execution. The planning feels productive and rewarding.

**Disambiguation:**
- vs C1-5 (Insufficient Evidence): C6-2 has enough information but keeps revising plans; C1-5 is still gathering information. C6-2 has formed plans (plural); C1-5 hasn't formed any.
- vs C5-6 (Decision Paralysis): C6-2 MAKES decisions but keeps changing them; C5-6 NEVER makes a decision. C6-2 commits and uncommits; C5-6 never commits.
- vs C8A-5 (Over-Simulation): C6-2 plans repeatedly; C8A-5 mentally rehearses the action repeatedly. C6-2 revises the strategy; C8A-5 imagines the execution.

**Detection type:** PATTERN -- multiple plan revisions without execution across sessions

---

### RC C6-3: Plan Selection Failure

**Explicit markers** (high confidence):
- "I don't know which approach to take"
- "They all seem okay but I can't pick"
- "There are too many ways to do this"
- "I'm committed to the goal but can't choose a method"
- "Every approach has trade-offs"
- "I've been comparing options but can't decide"
- "Should I do it this way or that way?"
- "I want to make sure I pick the right approach"
- "I'm paralyzed by the number of options"
- "I wish someone would just tell me which way to go"

**Implicit patterns** (medium confidence):
- Clear goal commitment combined with execution uncertainty
- Comparison language focused on methods, not goals
- Requests for advice specifically about HOW, not WHETHER
- Stalling at the implementation-specific stage
- Analysis of pros and cons of different approaches without resolution

**Emotional tone:** Frustrated determination -- they WANT to do it but are stuck on the HOW.

**Disambiguation:**
- vs C5-6 (Decision Paralysis): C6-3 has committed to the goal and is stuck on method; C5-6 is stuck on whether to commit at all. C6-3 is post-commitment; C5-6 is pre-commitment.
- vs C6-5 (Action Ambiguity): C6-3 has multiple options and can't choose; C6-5 has NO clear options. "I have three ways to do this" (C6-3) vs "I don't know what to do at all" (C6-5).

**Detection type:** PATTERN -- persistent method indecision across 2+ sessions

---

### RC C6-4: Cognitive Overload

**Explicit markers** (high confidence):
- "This plan is too complicated"
- "I can't remember all the steps"
- "There are too many moving parts"
- "I get overwhelmed just looking at my plan"
- "I can't hold it all in my head"
- "It's too much to keep track of"
- "I forget half the things I need to do"
- "My brain feels full"
- "The complexity is paralyzing"
- "I need to simplify but don't know how"

**Implicit patterns** (medium confidence):
- Plans described in excessively complex terms
- Inability to articulate the plan clearly in conversation
- Contradictory or confused plan descriptions
- Losing track of steps mid-description
- Requests for external organization tools or systems
- Working memory strain visible in conversation (losing thread, repeating self)

**Emotional tone:** Overwhelm, mental fatigue, frustration at own cognitive limits.

**Disambiguation:**
- vs C6-1 (Conflicting Plans): C6-4 has ONE complex plan; C6-1 has MANY simple plans. "This plan has too many steps" (C6-4) vs "I have too many different goals" (C6-1).
- vs C5-3 (Effort Overestimation): C6-4 is about cognitive complexity; C5-3 is about perceived physical/temporal effort. "I can't hold it all in my head" (C6-4) vs "It's going to take forever" (C5-3).

**Detection type:** ONE-TIME -- clear expressions of cognitive overload are immediately diagnostic; the fix is simplification

---

### RC C6-5: Action Ambiguity

**Explicit markers** (high confidence):
- "I know I should do something but what?"
- "I don't know what the first step is"
- "I want to start but I don't know where"
- "What am I supposed to do exactly?"
- "I have the goal but no idea how to get there"
- "I don't know what to do next"
- "The goal is clear but the path is fuzzy"
- "I wouldn't know where to begin"
- "I need someone to tell me what to do"
- "What does 'working on this' even look like?"

**Implicit patterns** (medium confidence):
- Vague action descriptions ("work on it," "try harder," "do better")
- Inability to name the NEXT SPECIFIC action
- Confident about the destination, confused about the route
- Asking for step-by-step instructions
- Generic intention language without specifics ("I'll do it this week" -- do what, when?)

**Emotional tone:** Confused, lost, sometimes helpless. Desire and belief are intact but they don't know the path.

**Disambiguation:**
- vs C6-3 (Plan Selection Failure): C6-5 has NO clear options; C6-3 has TOO MANY. "I don't know what to do" (C6-5) vs "I can't pick between three approaches" (C6-3).
- vs C8A-1 (Motor Initiation Threshold): C6-5 doesn't know what to do; C8A-1 knows but can't start. "What should I do?" (C6-5) vs "I know what to do but can't make myself begin" (C8A-1).

**Detection type:** ONE-TIME -- clear action ambiguity is immediately diagnostic

---

### RC C6-6: Recursive Justification

**Explicit markers** (high confidence):
- "I have a good reason to wait"
- "Let me think about this more"
- "Now isn't the right time because..."
- "I'll start after [shifting condition]"
- "There's actually another thing I need to figure out first"
- "I just realized I need to [new prerequisite]"
- "Before I can start, I need to..."
- "I keep finding reasons to delay"
- "Actually, there's one more thing I should consider"
- "I know I keep putting it off but this time there's a real reason"

**Implicit patterns** (medium confidence):
- New justifications appearing each session (the barrier keeps shifting)
- Elaborate reasoning for delay that sounds plausible each time
- Justification sophistication increases over time (more refined excuses)
- Resolution of one stated barrier immediately produces another
- Self-aware language about the pattern sometimes ("I know I keep doing this")

**Emotional tone:** Reasonable, logical, self-justifying. May sound convincing each time but the pattern reveals the loop.

**Disambiguation:**
- vs C0-2 (Situational Blockage): C6-6 generates NEW barriers each time; C0-2 has a PERSISTENT objective barrier. If the barrier changes every session, suspect C6-6.
- vs C8A-4 (Waiting for Readiness): C6-6 invents new reasons; C8A-4 has one consistent readiness condition. C6-6: "Actually, I also need to..." (shifting goalpost); C8A-4: "I'll start when I feel ready" (stable condition).

**Detection type:** TREND -- increasing justification frequency or shifting barriers across sessions

---

### RC C6-7: Weak Cue-Response Binding

**Explicit markers** (high confidence):
- "I keep forgetting to do it"
- "The time comes and I just don't think about it"
- "I need someone to remind me"
- "I had the perfect opportunity but it didn't even cross my mind"
- "I forget to start even when everything is set up"
- "My alarm goes off and I dismiss it without thinking"
- "I don't have a trigger that makes me start"
- "I walk right past my equipment without thinking about it"
- "I'm only reminded when I see it on my to-do list"
- "The habit never kicks in automatically"

**Implicit patterns** (medium confidence):
- Reports of forgetting despite adequate planning
- Missed cues or triggers that should prompt action
- Reliance on external reminders (alarms, apps, other people)
- Absence of if-then language in plan descriptions
- Situational cues that fail to activate intended behavior

**Emotional tone:** Bewilderment, sometimes guilt about forgetting. "I planned it and then... just didn't."

**Disambiguation:**
- vs C8A-1 (Motor Initiation Threshold): C6-7 doesn't think of the action at the cue moment; C8A-1 thinks of it but can't start. "I forgot" (C6-7) vs "I remembered but couldn't begin" (C8A-1).
- vs C5-5 (Lack of Urgency): C6-7 genuinely forgets; C5-5 deprioritizes. "It didn't cross my mind" (C6-7) vs "I'll get to it eventually" (C5-5).

**Detection type:** PATTERN -- repeated failures to respond to cues across 3+ sessions

---

## Gate C7: Commitment

**Core question:** Is their commitment robust?
**Vocal signature:** Engagement drops when alternatives mentioned, hedging on timeline questions, vocal energy decline across commitment statements, confidence pattern inconsistency
**Gate-level markers:** Conditional commitment language, hedging on timelines, enthusiasm that fluctuates with context. References to competing priorities, shifting circumstances, or escape clauses. Key signal: commitment that sounds solid in isolation but dissolves under pressure from alternatives, time, or social context.

### RC C7-1: Competing Commitments

**Explicit markers** (high confidence):
- "Something always comes up"
- "I have too many obligations"
- "I keep getting pulled away"
- "Other things take priority"
- "I intended to do it but then work/family/friends needed me"
- "I can't say no to people"
- "My schedule keeps filling up with other things"
- "This keeps getting bumped down my priority list"
- "I run out of time because of everything else"
- "Life keeps getting in the way"

**Implicit patterns** (medium confidence):
- Pattern of the goal being displaced by other activities
- Difficulty establishing boundaries around goal-pursuit time
- People-pleasing or obligation-driven priority shifts
- The goal is always "important but not urgent"
- Consistent deprioritization in favor of others' needs

**Emotional tone:** Guilty, stretched thin, apologetic. They WANT to keep the commitment but keep choosing other things.

**Disambiguation:**
- vs C6-1 (Conflicting Plans): C7-1 has a plan but can't PROTECT it from other commitments; C6-1 can't form a coherent plan because of too many goals. C7-1 is an execution problem; C6-1 is a planning problem.
- vs C0-2 (Situational Blockage): C7-1 involves CHOICES between competing demands; C0-2 involves objective IMPOSSIBILITY. "Something came up" (C7-1, choice was made) vs "I literally had no time" (C0-2, no choice available).
- vs C7-2 (Environmental Disruption): C7-1 is about commitments (internal priorities); C7-2 is about environment (external disruptions). "I chose to help a friend instead" (C7-1) vs "My house was too noisy" (C7-2).

**Detection type:** PATTERN -- goal displacement by other commitments across 3+ sessions

---

### RC C7-2: Environmental Disruption

**Explicit markers** (high confidence):
- "My environment keeps pulling me away"
- "Too many distractions at home"
- "I can't focus in this space"
- "Every time I sit down to work, something interrupts me"
- "My surroundings sabotage my efforts"
- "I need a completely different environment to get this done"
- "The noise, the mess, the chaos -- I can't concentrate"
- "My living situation makes this impossible"
- "I start and then something in my environment pulls me out"
- "I need to go somewhere else to do this"

**Implicit patterns** (medium confidence):
- Environment consistently cited as disruption source
- Commitment strongest when discussing hypothetical ideal environments
- Performance variation correlated with location/setting changes
- Environmental triggers described as more salient than goal cues
- Requests for environment-change solutions

**Emotional tone:** Frustration directed at surroundings, not at self.

**Disambiguation:**
- vs C7-1 (Competing Commitments): C7-2 is about physical environment; C7-1 is about other people's demands. "The house is too noisy" (C7-2) vs "My family needs me" (C7-1).
- vs C8B-2 (Competing Stimuli/Distraction): C7-2 disrupts COMMITMENT before action starts; C8B-2 disrupts PERSISTENCE during action. C7-2 prevents getting to the task; C8B-2 pulls away during the task.

**Detection type:** PATTERN -- environmental disruption across 3+ sessions

---

### RC C7-3: No External Monitoring

**Explicit markers** (high confidence):
- "Nobody knows if I do it or not"
- "It's just me, no one is checking"
- "There's no accountability"
- "I only follow through when someone is watching"
- "Without a deadline from someone else, I slack off"
- "I need someone to hold me accountable"
- "I work better when someone else is expecting something from me"
- "Left to myself, I just don't do it"
- "Nobody will notice if I skip it"
- "I'm only accountable to myself and that's not enough"

**Implicit patterns** (medium confidence):
- Performance that improves dramatically with external structure
- History of success in structured environments (school, work) but failure in self-directed contexts
- Seeking accountability partners, coaches, or groups
- Commitment decay when monitoring is removed
- Language about needing external structure

**Emotional tone:** Self-aware frustration about lack of self-discipline. Not defiant but honestly acknowledging the need for external structure.

**Disambiguation:**
- vs C2-6 (External Motivation): C7-3 needs monitoring to maintain commitment; C2-6 needs external rewards for motivation. C7-3 has internal desire but needs external accountability; C2-6 has no internal desire at all.
- vs C7-4 (Insufficient Stakes): C7-3 is about monitoring presence; C7-4 is about consequence magnitude. "Nobody is checking" (C7-3) vs "Nothing bad happens if I stop" (C7-4).

**Detection type:** PATTERN -- commitment decay in unmonitored contexts across sessions

---

### RC C7-4: Insufficient Stakes

**Explicit markers** (high confidence):
- "Nothing bad happens if I stop"
- "Who cares if I don't?"
- "There are no consequences for quitting"
- "It's not like anything is at stake"
- "I can always pick it up later"
- "Nobody will be disappointed"
- "There's no penalty for not doing it"
- "It's a nice-to-have, not a must-do"
- "I won't lose anything by quitting"
- "The worst that happens is I stay where I am"

**Implicit patterns** (medium confidence):
- Low urgency language about consequences
- Casual attitude toward abandonment
- Absence of loss language when discussing quitting
- Goal described as optional or supplementary
- Easy come, easy go attitude toward progress

**Emotional tone:** Casual, unbothered, sometimes dismissive. No emotional weight to the prospect of quitting.

**Disambiguation:**
- vs C7-3 (No External Monitoring): C7-4 is about consequence magnitude; C7-3 is about monitoring presence. "Nothing bad happens" (C7-4) vs "Nobody is watching" (C7-3). Stakes can be low even with monitoring; monitoring can be absent even with high stakes.
- vs C7-5 (Lack of Urgency): C7-4 has low consequences; C7-5 has distant timelines. "Nothing is at stake" (C7-4) vs "I have plenty of time" (C7-5).

**Detection type:** PATTERN -- low-stakes language across sessions

---

### RC C7-5: Lack of Urgency

**Explicit markers** (high confidence):
- "I have plenty of time"
- "No rush"
- "There's no deadline"
- "I'll get to it eventually"
- "It can wait"
- "What's the hurry?"
- "I've got all the time in the world"
- "It's not pressing"
- "I'll do it when I feel like it"
- "Tomorrow, next week, whenever"

**Implicit patterns** (medium confidence):
- Absent deadline language
- Indefinite timeline references ("eventually," "someday," "at some point")
- Comfort with perpetual delay
- Low temporal salience of the goal
- Engagement only when artificial urgency is created (competition, deadline)

**Emotional tone:** Relaxed, unhurried, sometimes complacent. No tension about the delay.

**Disambiguation:**
- vs C7-4 (Insufficient Stakes): C7-5 has distant timelines; C7-4 has low consequences. "I have plenty of time" (C7-5) vs "Nothing bad happens if I stop" (C7-4).
- vs C6-7 (Weak Cue-Response Binding): C7-5 consciously deprioritizes; C6-7 genuinely forgets. "It can wait" (C7-5, deliberate choice) vs "It didn't cross my mind" (C6-7, unintentional).
- vs C6-6 (Recursive Justification): C7-5 is consistently "not now" without new reasons; C6-6 generates fresh justifications each time.

**Detection type:** PATTERN -- consistent low-urgency language across sessions

---

### RC C7-6: Value Contradiction

**Explicit markers** (high confidence):
- "This goes against what I believe"
- "I feel torn between my values"
- "Part of me feels like this is wrong"
- "It conflicts with my principles"
- "I can't do this without compromising who I am"
- "This requires me to go against my values"
- "I believe in X but this goal requires Y"
- "I feel like a hypocrite pursuing this"
- "It doesn't sit right with me morally"
- "My conscience is bothering me about this"

**Implicit patterns** (medium confidence):
- Moral or ethical language interspersed with goal discussion
- Discomfort that surfaces specifically around value-related aspects
- Internal conflict framed in values terms (right/wrong, should/shouldn't)
- Selective discomfort with specific parts of the goal that violate values
- References to beliefs, principles, or moral standards

**Emotional tone:** Moral discomfort, inner conflict, guilt. Distinguished from C2-5 (ambivalence) by the specifically ethical/values-based nature of the conflict.

**Disambiguation:**
- vs C2-5 (Approach-Avoidance Conflict): C7-6 involves VALUES conflict; C2-5 involves DESIRE conflict. "This goes against my principles" (C7-6) vs "I'm torn about wanting it" (C2-5).
- vs C7-7 (Identity Misalignment): C7-6 is about VALUES (what I believe is right); C7-7 is about IDENTITY (who I am). "This conflicts with my principles" (C7-6) vs "This isn't who I am" (C7-7).

**Detection type:** ONE-TIME -- clear value conflict statements are immediately diagnostic

---

### RC C7-7: Identity Misalignment

**Explicit markers** (high confidence):
- "That's not who I am"
- "People like me don't do that"
- "I'm not that kind of person"
- "That's just not me"
- "I'd feel fake doing that"
- "It doesn't fit my personality"
- "I'm not the type to do that"
- "I'd be pretending to be someone I'm not"
- "It feels inauthentic"
- "I can't see myself doing that"

**Implicit patterns** (medium confidence):
- Identity-referenced rejection of specific behaviors
- Self-concept language used as barrier ("I'm not a ___")
- Discomfort framed as identity threat rather than difficulty
- Social identity categories used to explain limitations
- Resistance that increases as the goal requires identity-inconsistent behavior

**Emotional tone:** Discomfort, sometimes disgust or revulsion at the idea of being "that kind of person." Protection response.

**Disambiguation:**
- vs C1-2 (Fixed Mindset): C7-7 is "I won't do it because it's not me" (identity protection); C1-2 is "I can't do it because I lack the ability" (capability belief). C7-7 could do it but rejects it on identity grounds; C1-2 doesn't believe they can.
- vs C7-6 (Value Contradiction): C7-7 is about identity (who I am); C7-6 is about values (what I believe). "That's not me" (C7-7) vs "That's not right" (C7-6).
- vs C7-8 (Identity-Behavior Dissonance): C7-7 is prospective ("doing this would violate my identity"); C7-8 is retrospective ("I keep failing to live up to my stated identity"). C7-7 rejects the action; C7-8 has attempted but failed.

**Detection type:** ONE-TIME -- clear identity-rejection statements are immediately diagnostic

---

### RC C7-8: Identity-Behavior Dissonance

**Explicit markers** (high confidence):
- "I keep saying I'll change but I never do"
- "I'm a fraud"
- "I talk the talk but don't walk the walk"
- "I'm all talk and no action"
- "I don't practice what I preach"
- "There's a huge gap between who I say I am and what I actually do"
- "I'm a hypocrite"
- "I promise myself things and never follow through"
- "I've been saying this for years and nothing has changed"
- "My actions don't match my words"

**Implicit patterns** (medium confidence):
- Shame or self-contempt around the gap between aspiration and action
- Chronic pattern of stated intentions without follow-through
- Self-labeling as unreliable or dishonest
- Erosion of self-trust accumulated over time
- Progressive disengagement from goal-setting (learned helplessness about own commitment)

**Emotional tone:** Shame, self-contempt, disillusionment with self. Deeper and more chronic than frustration -- this is identity-level distress.

**Disambiguation:**
- vs C7-7 (Identity Misalignment): C7-8 is retrospective gap; C7-7 is prospective rejection. "I keep failing to be who I say I am" (C7-8) vs "That's not who I am" (C7-7). C7-8 WANTS to be that person but fails; C7-7 doesn't want to be that person.
- vs C1-8 (Attribution Error): C7-8 notes the aspiration-action gap; C1-8 discounts past successes. C7-8 is about failure to act; C1-8 is about failure to internalize success.

**Detection type:** PATTERN -- chronic aspiration-action gap across many sessions

---

## Gate C8A: Action Initiation

**Core question:** Can they start?
**Vocal signature:** Speech onset delays at action moments, vocal tremor at commitment points, sudden pauses before action descriptions (volitional hesitation, not autonomic freeze)
**Gate-level markers:** Language about "getting started" as the primary barrier. All upstream gates (belief, desire, will, plan, commitment) may be intact but the person cannot translate them into the first physical action. Key signal: "I know what to do, I want to do it, I have a plan, but I can't START."

### RC C8A-1: Motor Initiation Threshold (High Activation Cost - Motor Gate)

**Explicit markers** (high confidence):
- "I just can't start"
- "I sit there wanting to begin but can't"
- "I know what to do but my body won't move"
- "I stare at it and nothing happens"
- "I'm glued to the couch"
- "I can't make myself take the first step"
- "I have everything ready but I can't begin"
- "It's like there's an invisible wall between me and starting"
- "I want to start so badly but I just... don't"
- "I'm stuck in neutral"

**Implicit patterns** (medium confidence):
- Procrastination despite clear plans and genuine desire
- Physical inertia described in motor terms (frozen, stuck, glued)
- All prerequisites met but action doesn't happen
- Frustration at own inability to initiate
- History of eventually starting once the barrier breaks, then performing well

**Emotional tone:** Frustrated impotence -- they genuinely want to start and can't understand why they don't. Not lazy (C3), not afraid (C2-2), not confused about what to do (C6-5) -- just stuck.

**Disambiguation:**
- vs C6-5 (Action Ambiguity): C8A-1 knows WHAT to do but can't start; C6-5 doesn't know what to do. "I know what to do but can't begin" (C8A-1) vs "I don't know what to do" (C6-5).
- vs C0-8 (Trauma-Related Freeze): C8A-1 is volitional hesitation; C0-8 is autonomic shutdown. C8A-1 has awareness and frustration; C0-8 has numbness or dissociation. C8A-1 is generalized across tasks; C0-8 is triggered by specific threat cues.
- vs C5-1 (Energy Depletion): C8A-1 has energy but can't direct it; C5-1 lacks energy entirely. "I have the energy, I just can't start" (C8A-1) vs "I'm too exhausted" (C5-1).
- vs C8A-7 (Momentum Dependency): C8A-1 is general initiation failure; C8A-7 specifically needs momentum or external push. "I can't start at all" (C8A-1) vs "Once I start I'm fine, it's just the starting" (C8A-7 -- implies a consistent pattern of difficulty with cold starts specifically).

**Detection type:** PATTERN -- initiation failure across 3+ sessions despite readiness

---

### RC C8A-2: Last-Minute Deliberation

**Explicit markers** (high confidence):
- "Wait, let me think about this one more time"
- "Am I sure about this?"
- "Hold on, maybe I should reconsider"
- "Let me just double-check one thing before I start"
- "Actually, maybe I should wait"
- "I was about to start but then I thought..."
- "One more thing to consider before I begin"
- "I keep second-guessing myself right at the moment of action"
- "I get cold feet at the last second"
- "Right when I'm about to start, I hesitate"

**Implicit patterns** (medium confidence):
- Deliberation that intensifies at the moment of action
- New doubts or questions arising specifically when action is imminent
- Pattern of approaching the starting line and pulling back
- Overthinking that is temporally correlated with action moments
- Post-hoc awareness: "I was right there and then I talked myself out of it"

**Emotional tone:** Anxious hesitation, second-guessing, last-second wavering.

**Disambiguation:**
- vs C5-6 (Decision Paralysis): C8A-2 has DECIDED but re-deliberates at action moment; C5-6 never decided. C8A-2 is temporary reversion to deliberation; C5-6 is chronic indecision.
- vs C8A-1 (Motor Initiation Threshold): C8A-2 is cognitive hesitation; C8A-1 is motor inertia. C8A-2 is "Wait, should I?" (thinking); C8A-1 is "I want to but can't move" (physical).

**Detection type:** PATTERN -- last-minute hesitation across 3+ attempted starts

---

### RC C8A-3: Attention Diversion

**Explicit markers** (high confidence):
- "I was about to start but then..."
- "I got sidetracked right when I was going to begin"
- "Something caught my attention just as I was starting"
- "I was walking to do it and then I noticed..."
- "I got distracted at exactly the wrong moment"
- "My phone buzzed right as I was about to start"
- "I started doing something else without realizing it"
- "I meant to start but ended up doing [other thing] instead"
- "I got pulled into something right at the moment I was going to begin"
- "I sat down to do it and then opened [distracting thing] instead"

**Implicit patterns** (medium confidence):
- Distractions specifically at the moment of initiation (not during)
- Reports of "accidentally" doing other things instead
- Pattern of displacement activities at intended action moments
- Technology (phone, social media, email) as common diversion source
- Retrospective awareness: "I don't know how I ended up doing X instead of Y"

**Emotional tone:** Sheepish, sometimes bewildered. "How did I end up here instead of there?"

**Disambiguation:**
- vs C8B-2 (Competing Stimuli): C8A-3 diverts BEFORE action starts; C8B-2 diverts DURING action. "I was about to start but..." (C8A-3) vs "I was doing it and then got pulled away" (C8B-2).
- vs C6-7 (Weak Cue-Response Binding): C8A-3 remembers the intention but gets diverted; C6-7 doesn't remember at all. "I was about to start but something distracted me" (C8A-3) vs "I completely forgot" (C6-7).

**Detection type:** PATTERN -- initiation-moment diversion across 3+ instances

---

### RC C8A-4: Waiting for Readiness

**Explicit markers** (high confidence):
- "I'll start when I feel ready"
- "The timing isn't right"
- "I need to be in the right mood"
- "I'm waiting for the perfect moment"
- "When conditions are right, I'll begin"
- "I need to feel inspired first"
- "I'm not in the right headspace"
- "Monday feels like a better day to start"
- "I need a fresh start -- new week, new month, new year"
- "I'll start when things calm down"

**Implicit patterns** (medium confidence):
- Readiness conditions that are never fully met
- Perpetual postponement to a "better" time
- Clean-slate thinking (starts tied to temporal boundaries)
- Mood-contingent action intentions
- Self-imposed prerequisites that keep shifting
- "Starting fresh" rhetoric without completion of previous attempts

**Emotional tone:** Patient, sometimes self-deluding optimism about the future start. "The right time is coming."

**Disambiguation:**
- vs C6-6 (Recursive Justification): C8A-4 has one consistent readiness condition; C6-6 generates NEW reasons each time. "I'm waiting to feel ready" (C8A-4, same barrier) vs "Actually, I also need to..." (C6-6, new barrier).
- vs C8B-3 (Mood-Dependent Execution): C8A-4 waits for mood before STARTING; C8B-3 fluctuates during ONGOING action. "I need to be in the mood to begin" (C8A-4) vs "I can only continue when I feel good" (C8B-3).
- vs C8A-1 (Motor Initiation Threshold): C8A-4 has conditions to meet first; C8A-1 has no conditions left but still can't start. "I'll start when ready" (C8A-4) vs "Everything is ready and I still can't start" (C8A-1).

**Detection type:** PATTERN -- perpetual readiness-waiting across 3+ sessions

---

### RC C8A-5: Over-Simulation

**Explicit markers** (high confidence):
- "I've thought about it a million times"
- "I know exactly what to do but haven't done it"
- "I've rehearsed it in my head over and over"
- "I can picture myself doing it perfectly but I never actually do it"
- "I've planned every detail in my mind"
- "I've imagined the whole thing but never actually started"
- "I feel like I've already done it because I've thought about it so much"
- "Thinking about it feels almost as satisfying as doing it"
- "I've mentally prepared a hundred times"
- "I've rehearsed every scenario in my head"

**Implicit patterns** (medium confidence):
- Detailed mental rehearsal described with satisfaction
- Confusion between mental preparation and actual action
- Sense of accomplishment from planning/imagining alone
- Excessive visualization without physical action
- Mental rehearsal providing a dopaminergic substitute for actual performance

**Emotional tone:** Satisfaction from mental rehearsal, sometimes confusion about why they haven't acted when they've "done it" mentally.

**Disambiguation:**
- vs C6-2 (Chronic Replanning): C8A-5 mentally REHEARSES the action; C6-2 REVISES the strategy. C8A-5 imagines doing it; C6-2 changes how they'll do it.
- vs C8A-1 (Motor Initiation Threshold): C8A-5 substitutes mental rehearsal for action; C8A-1 simply can't initiate. C8A-5 gets reward from imagining; C8A-1 gets frustration from inaction.

**Detection type:** PATTERN -- excessive mental rehearsal without action across 3+ sessions

---

### RC C8A-6: Self-Sabotage

**Explicit markers** (high confidence):
- "Something always goes wrong right before I start"
- "I keep accidentally creating problems for myself"
- "I don't know why I keep doing things that prevent me from starting"
- "I sabotage myself every time"
- "I set up obstacles without meaning to"
- "I procrastinate and then it's too late"
- "I pick fights right before I'm supposed to start"
- "I stay up too late the night before so I'm too tired"
- "I always find a way to make it impossible"
- "It's like I'm working against myself"

**Implicit patterns** (medium confidence):
- Repeated "accidents" or "coincidences" that prevent action
- Self-handicapping behaviors (inadequate preparation, staying up late, overcommitting)
- Pattern of creating obstacles that provide ready-made excuses
- Behaviors that systematically undermine readiness
- Partial awareness of the pattern sometimes ("I know I do this to myself")

**Emotional tone:** Confusion, self-frustration, sometimes resignation. May not recognize the pattern as self-sabotage initially.

**Disambiguation:**
- vs C5-5 (Failure Cost Aversion): C8A-6 CREATES barriers unconsciously; C5-5 RECOGNIZES failure risk and avoids. "I keep accidentally ruining my chances" (C8A-6) vs "I'm afraid of failing" (C5-5). C8A-6 is behavioral; C5-5 is psychological.
- vs C0-2 (Situational Blockage): C8A-6 creates self-imposed barriers; C0-2 faces genuine external barriers. Recurring barrier pattern that the person has some control over suggests C8A-6.

**Detection type:** PATTERN -- repeated self-created obstacles across 3+ instances

---

### RC C8A-7: Momentum Dependency

**Explicit markers** (high confidence):
- "Once I start, I'm fine -- it's just starting"
- "I need a push to get going"
- "I can only start if I'm already in motion"
- "Getting started is the hardest part, then it flows"
- "I need someone else to start with me"
- "If I'm already doing something, I can switch to the goal"
- "Cold starts are impossible for me"
- "I need to warm up before I can do the real thing"
- "I can continue for hours but I can't begin from zero"
- "I need to piggyback on existing momentum"

**Implicit patterns** (medium confidence):
- Clear distinction between initiation difficulty and continuation ease
- Success stories that begin with "once I got going..."
- Strategies involving warm-up activities or transition tasks
- ADHD-associated patterns of hyperfocus once started
- Resistance specifically to cold starts (starting from rest)
- Body doubling or co-working as effective workarounds

**Emotional tone:** Frustrated awareness of the pattern, sometimes hopeful because they know they perform well once started.

**Disambiguation:**
- vs C8A-1 (Motor Initiation Threshold): C8A-7 has a specific pattern (cold start failure + continuation success); C8A-1 may include ongoing initiation difficulty. "Once I start I'm fine" (C8A-7 -- defines the pattern) vs "I can't start" (C8A-1 -- broader).
- vs C8B-7 (High Restart Cost): C8A-7 is about initial cold start; C8B-7 is about restarting after interruption. "I can't start from zero" (C8A-7) vs "Once I stop, I can't get back to it" (C8B-7).

**Detection type:** PATTERN -- consistent cold-start failure with continuation success across sessions

---

### RC C8A-8: Trauma-Related Freeze

*Note: The Foundational Document reclassified this to C0-8. See C0-8 entry above for markers. Detection logic should route to C0-8.*

---

## Gate C8B: Action Persistence

**Core question:** Can they sustain action?
**Vocal signature:** Energy decay across session, fatigue markers in later segments, rising frustration prosody, disengagement indicators (shortened responses, falling pitch contour)
**Gate-level markers:** Language about starting but not finishing. Descriptions of initial enthusiasm that fades. References to giving up, losing interest, or quitting partway through. Key signal: the person CAN start but CANNOT sustain. The problem is in the middle and end, not the beginning.

### RC C8B-1: Task Boredom

**Explicit markers** (high confidence):
- "This is boring"
- "I've lost interest"
- "It's not exciting anymore"
- "The novelty wore off"
- "I was into it at first but now it's tedious"
- "I'm bored of doing the same thing"
- "It used to be fun but now it feels like a chore"
- "I need something new to keep me engaged"
- "I can't do the same thing over and over"
- "I lose interest once the challenge is gone"

**Implicit patterns** (medium confidence):
- Engagement that peaks at the start and declines rapidly
- Novelty-seeking behavior (jumping to new goals)
- Difficulty with repetitive practice despite understanding its value
- Faster engagement decay than peers
- Interest in variety over depth

**Emotional tone:** Restlessness, disengagement, sometimes guilt about losing interest.

**Disambiguation:**
- vs C2-7 (Purpose Deficit): C8B-1 was interested and lost it (hedonic adaptation); C2-7 never had meaningful connection. "I was into it but now it's boring" (C8B-1) vs "I never saw the point" (C2-7).
- vs C8B-2 (Competing Stimuli): C8B-1 is bored with the CURRENT task; C8B-2 is pulled by a SPECIFIC alternative. "This is tedious" (C8B-1) vs "I keep checking my phone" (C8B-2 -- specific alternative).

**Detection type:** TREND -- declining engagement over sessions (not single-session boredom)

---

### RC C8B-2: Competing Stimuli (Distraction)

**Explicit markers** (high confidence):
- "I keep checking my phone"
- "I can't focus -- I keep getting distracted"
- "I get pulled away by other things while doing it"
- "Social media keeps calling me"
- "I start scrolling and lose 30 minutes"
- "I hear a notification and I'm gone"
- "I can't resist the temptation to do something else"
- "The TV is on and I can't concentrate"
- "I switch to something easier mid-task"
- "I'd rather be doing something more fun"

**Implicit patterns** (medium confidence):
- Technology/media as primary distraction source
- Difficulty maintaining focus during low-stimulation activities
- Reports of involuntary task switching
- Comfort-seeking behavior during effortful activities
- Short attention spans during practice sessions

**Emotional tone:** Sheepish, sometimes frustrated at own lack of control. Awareness of the problem without ability to solve it.

**Disambiguation:**
- vs C8A-3 (Attention Diversion): C8B-2 occurs DURING action; C8A-3 occurs BEFORE starting. "I was doing it and then got distracted" (C8B-2) vs "I was about to start and then..." (C8A-3).
- vs C8B-1 (Task Boredom): C8B-2 is pulled by specific alternatives; C8B-1 is bored with the task itself. "My phone distracted me" (C8B-2, external pull) vs "This is tedious" (C8B-1, internal push).
- vs C8B-9 (Competing Comforts): C8B-2 is about general distraction/attention capture; C8B-9 is specifically about comfort-seeking alternatives. "I got distracted" (C8B-2) vs "I'd rather be on the couch" (C8B-9).

**Detection type:** PATTERN -- consistent distraction reports during task execution across sessions

---

### RC C8B-3: Mood-Dependent Execution

**Explicit markers** (high confidence):
- "I can only do it when I feel good"
- "Bad days I can't function"
- "My performance depends on my mood"
- "If I'm not feeling it, I can't do it"
- "I need to be in a good headspace to do this"
- "Some days I'm great, other days I can't do anything"
- "My output is totally tied to how I'm feeling"
- "I skip it when I'm down"
- "I can't force myself on bad days"
- "Emotions run my schedule"

**Implicit patterns** (medium confidence):
- Performance variation correlated with self-reported mood
- Good days described as productive, bad days as completely unproductive
- No decoupling between emotional state and behavioral output
- Mood used as a gating condition for action
- Absence of strategies for performing despite mood fluctuations

**Emotional tone:** Sometimes resigned acceptance, sometimes frustrated recognition of the pattern.

**Disambiguation:**
- vs C5-1 (Energy Depletion): C8B-3 is about mood; C5-1 is about energy. "I'm not in the mood" (C8B-3) vs "I'm too tired" (C5-1). Mood is emotional; energy is physical.
- vs C8A-4 (Waiting for Readiness): C8B-3 affects ongoing execution; C8A-4 prevents initial start. "I stop when my mood drops" (C8B-3) vs "I can't start unless I'm in the mood" (C8A-4).

**Detection type:** PATTERN -- mood-performance correlation across 3+ sessions

---

### RC C8B-4: Single-Error Catastrophizing

**Explicit markers** (high confidence):
- "I messed up so why bother"
- "One mistake ruins everything"
- "I already blew it"
- "I might as well quit now"
- "The streak is broken so what's the point?"
- "I missed a day so I failed"
- "I can't recover from this mistake"
- "It's ruined now"
- "All my progress is gone because of one slip"
- "I ate one cookie so I might as well eat the whole box"

**Implicit patterns** (medium confidence):
- All-or-nothing framing of progress (perfect or failed, no middle)
- Disproportionate response to minor setbacks
- Abandonment triggered by single deviations from plan
- Inability to resume after small mistakes
- "What the hell" effect in language
- Binary thinking about success and failure

**Emotional tone:** Despair, self-defeat, fatalistic. Quick shift from "doing well" to "complete failure" with no intermediate state.

**Disambiguation:**
- vs C1-6 (Fragile Confidence): C8B-4 abandons the TASK; C1-6 loses BELIEF in self. "Why bother finishing" (C8B-4) vs "I can't do anything" (C1-6). C8B-4 is task-specific; C1-6 is global.
- vs C8B-8 (Moral Self-Punishment): C8B-4 is cognitive catastrophizing; C8B-8 is emotional self-punishment. "It's ruined" (C8B-4, conclusion) vs "I deserve to fail" (C8B-8, moral judgment).

**Detection type:** PATTERN -- single-error abandonment across 2+ instances

---

### RC C8B-5: Perfectionism

**Explicit markers** (high confidence):
- "It's not good enough"
- "I need to redo this"
- "It has to be perfect or not at all"
- "I can't submit this, it's not ready"
- "I keep polishing and never finish"
- "This isn't up to my standards"
- "I'd rather not do it than do it poorly"
- "I spent hours on one small detail"
- "I keep revising instead of moving forward"
- "If I can't do it perfectly, why do it at all?"

**Implicit patterns** (medium confidence):
- Excessive revision without completion
- Standards described at unreachable levels
- Progress halted by quality concerns
- Time spent on polishing that exceeds time spent on core task
- Completion avoidance disguised as quality pursuit
- Comparing output to ideal rather than sufficient standard

**Emotional tone:** Critical self-evaluation, dissatisfaction, sometimes anxiety about output quality.

**Disambiguation:**
- vs C8B-4 (Single-Error Catastrophizing): C8B-5 prevents COMPLETION due to quality standards; C8B-4 triggers ABANDONMENT after mistakes. "I need to make it better" (C8B-5, still trying) vs "I ruined it, why bother" (C8B-4, giving up).
- vs C5-5 (Failure Cost Aversion): C8B-5 fears imperfect output; C5-5 fears the cost of total failure. "It's not good enough to show anyone" (C8B-5) vs "What if I fail completely?" (C5-5).

**Detection type:** PATTERN -- perfectionism-driven incompletion across 3+ tasks

---

### RC C8B-6: Invisible Progress

**Explicit markers** (high confidence):
- "I'm not getting anywhere"
- "Nothing is changing"
- "I don't see any improvement"
- "I've been working at this and there's no difference"
- "All this effort and nothing to show for it"
- "How much longer until I see results?"
- "I feel like I'm running in place"
- "Where's the progress?"
- "It doesn't seem like anything I do matters"
- "I've been at this for weeks and I'm still at square one"

**Implicit patterns** (medium confidence):
- Frustration specifically about lack of VISIBLE outcomes
- Comparisons between effort invested and results seen
- Requests for progress metrics or milestones
- Motivation contingent on perceiving forward movement
- Engagement that decays when progress feedback is absent

**Emotional tone:** Frustrated, demoralized, sometimes angry at the apparent futility.

**Disambiguation:**
- vs C2-7 (Purpose Deficit): C8B-6 wants progress and can't see it; C2-7 doesn't care about progress because the goal lacks meaning. "Where are the results?" (C8B-6, wants evidence) vs "What's the point?" (C2-7, doesn't care).
- vs C5-2 (Delayed Gratification Intolerance): C8B-6 is about VISIBLE evidence; C5-2 is about TEMPORAL delay. "I can't see progress" (C8B-6) vs "The results take too long" (C5-2). C8B-6 might be patient IF they could see it working.

**Detection type:** PATTERN -- progress-frustration language across 3+ sessions

---

### RC C8B-7: High Restart Cost

**Explicit markers** (high confidence):
- "Once I stop, I can't get back to it"
- "Breaks ruin my flow"
- "If I'm interrupted, I'm done for the day"
- "Getting back into it after stopping is as hard as starting"
- "I lose all my momentum when I take a break"
- "It takes me 30 minutes to get back into the zone"
- "I avoid stopping because I know I won't restart"
- "Interruptions kill my productivity completely"
- "I can't pick up where I left off"
- "Once the flow breaks, it's gone"

**Implicit patterns** (medium confidence):
- Avoidance of breaks or interruptions during task execution
- Reports of lost momentum after any pause
- Context-switching described as extremely costly
- Preference for uninterrupted blocks of time
- Difficulty with stop-start patterns of work

**Emotional tone:** Frustration, sometimes anxiety about potential interruptions.

**Disambiguation:**
- vs C8A-7 (Momentum Dependency): C8B-7 is about RESTARTING after interruption during task; C8A-7 is about INITIAL cold start. "I stop and can't restart" (C8B-7, mid-task) vs "I can't cold start from zero" (C8A-7, from rest).
- vs C8A-1 (Motor Initiation Threshold): C8B-7 is specifically about post-interruption restart; C8A-1 is about any initiation. C8B-7 implies they CAN start initially but can't RE-start.

**Detection type:** PATTERN -- restart difficulty across 3+ interruption instances

---

### RC C8B-8: Moral Self-Punishment

**Explicit markers** (high confidence):
- "I feel terrible about missing a day"
- "I beat myself up over it"
- "I don't deserve to try again after what I did"
- "I should be punished for not following through"
- "I'm so disappointed in myself"
- "I withdraw when I feel guilty"
- "I can't face it after I've failed"
- "The guilt makes me want to hide"
- "I punish myself by not trying anymore"
- "I don't deserve success because I can't even stick with it"

**Implicit patterns** (medium confidence):
- Withdrawal patterns following perceived failures
- Self-punishment framed as deserved consequence
- Guilt that escalates to action paralysis
- Shame that prevents re-engagement
- Moral language about effort and worthiness
- Progressive withdrawal cycle: fail > guilt > punish > withdraw > more guilt

**Emotional tone:** Shame, guilt, self-contempt. Deeper than frustration -- this is moral self-judgment.

**Disambiguation:**
- vs C8B-4 (Single-Error Catastrophizing): C8B-8 is MORAL self-punishment; C8B-4 is COGNITIVE catastrophizing. "I deserve to fail" (C8B-8) vs "Everything is ruined" (C8B-4). C8B-8 is about worthiness; C8B-4 is about assessment.
- vs C5-8 (Identity-Behavior Dissonance): C8B-8 is acute guilt after specific failures; C5-8 is chronic identity-gap awareness. C8B-8 is triggered by recent events; C5-8 is an accumulated state.
- vs C1-6 (Fragile Confidence): C8B-8 punishes self morally; C1-6 loses confidence cognitively. "I don't deserve to try again" (C8B-8) vs "I can't do this" (C1-6).

**Detection type:** PATTERN -- guilt-withdrawal cycles across 2+ instances

---

### RC C8B-9: Competing Comforts

**Explicit markers** (high confidence):
- "I'd rather be on the couch"
- "Watching TV is so much easier"
- "I'd rather do something fun"
- "The task feels hard compared to scrolling"
- "I keep gravitating to comfortable activities"
- "Netflix is calling my name"
- "I choose comfort over effort every time"
- "I just want to relax instead"
- "Why struggle when I could be comfortable?"
- "I default to the easy option"

**Implicit patterns** (medium confidence):
- Consistent choosing comfort alternatives over goal activities
- Goal activity described as "hard" by comparison to leisure
- Comfort-seeking as default behavioral pattern
- Difficulty tolerating the discomfort of effortful activity
- Immediate gratification from comfort alternatives

**Emotional tone:** Hedonistic pull, sometimes guilty pleasure, sometimes unapologetic preference for comfort.

**Disambiguation:**
- vs C8B-2 (Competing Stimuli): C8B-9 is specifically about COMFORT seeking; C8B-2 is about general distraction/attention capture. "I'd rather be comfortable" (C8B-9) vs "I got distracted by something" (C8B-2). C8B-9 is pull toward comfort; C8B-2 is pull toward stimulation.
- vs C5-4 (Insufficient Perceived Reward): C8B-9 has a competing reward (comfort) that wins; C5-4 has no compelling reward at all. C8B-9 is relative comparison; C5-4 is absolute insufficiency.

**Detection type:** PATTERN -- comfort-seeking displacement across 3+ sessions

---

## Appendix A: Gate-Level Keyword Clusters

These keyword groups enable fast initial gate classification before root-cause-level analysis. A transcript matching multiple keywords in a cluster suggests that gate as the primary failure point.

### C0 -- Environmental Permeability
**Keywords:** physically can't, body won't, medical, condition, chronic, fatigue, disability, pain, access blocked, no resources, can't afford, no time (literal), shut down, freeze, paralyzed, numb, go blank, dissociate
**Pattern type:** External/physical constraint language; flat/resigned prosody

### C1 -- Believability
**Keywords:** can't do it, not good at, not talented, no one like me, don't know if I can, not sure I'm capable, everyone says I can't, got lucky, doesn't count, just not me, I doubt, second-guess, what if I'm wrong, not smart enough, never been able to
**Pattern type:** Self-doubt language; hedging; upward intonation on declaratives

### C2 -- Desire
**Keywords:** should want, supposed to, don't really want, not my goal, heart isn't in it, what if it goes wrong, too scary, don't want to feel, don't tell me, back and forth, part of me, only doing it for, what's the point, doesn't matter, won't care later
**Pattern type:** Disconnection between stated goal and emotional engagement; flat prosody on goal topics

### C3 -- Awareness
**Keywords:** [V2 addition - detailed analysis pending]
**Pattern type:** [V2 addition - detailed analysis pending]

### C4 -- Attention
**Keywords:** [V2 addition - detailed analysis pending]
**Pattern type:** [V2 addition - detailed analysis pending]

### C5 -- Will
**Keywords:** too tired, exhausted, not worth it, too hard, too much effort, payoff isn't worth it, can't decide, what if I fail, can't wait, need results now, overwhelming, massive, too far, too much hassle
**Pattern type:** Cost language; stress markers on effort topics; weighing/calculating quality

### C6 -- Intention
**Keywords:** too many things, can't focus, need better plan, keep changing, don't know which way, too complicated, don't know where to start, what should I do, keep waiting, good reason to wait, keep forgetting
**Pattern type:** Vague language; generic plans; confident "what" but uncertain "how/when"

### C7 -- Commitment
**Keywords:** something comes up, too many obligations, distractions, nobody knows, no accountability, nothing happens if I stop, no rush, plenty of time, goes against beliefs, not who I am, keep saying but never do, I'm a fraud
**Pattern type:** Hedging on timelines; engagement drops when alternatives discussed; conditional commitment

### C8A -- Action Initiation
**Keywords:** can't start, want to but can't, know what to do but, let me think one more time, got sidetracked, waiting to feel ready, thought about it a million times, something always goes wrong, once I start I'm fine, need a push
**Pattern type:** Speech onset delays; vocal tremor at commitment; pauses before action descriptions

### C8B -- Action Persistence
**Keywords:** boring, lost interest, keep getting distracted, only when I feel good, messed up so why bother, not good enough, need to redo, not getting anywhere, once I stop can't restart, beat myself up, rather be comfortable, checking phone
**Pattern type:** Energy decay; shortened responses; frustration prosody; falling pitch contour

---

## Appendix B: Cross-Gate Disambiguation Guide

The following table resolves the most commonly confused root cause pairs with specific linguistic differentiators.

| Pair | Confused Because | Linguistic Differentiator |
|------|------------------|--------------------------|
| **C0-P vs C5-1** | Both cite exhaustion/fatigue | C0-P: cross-domain, chronic, medical language, doesn't recover with rest. C5-1: domain-selective, situational, recovers after rest. "I can't do anything" vs "I'm too tired for this after work." |
| **C1-2 vs C7-7** | Both reference identity | C1-2: "I can't" (ability). C7-7: "I won't" (identity choice). C1-2 doubts capability; C7-7 rejects the behavior as identity-inconsistent. |
| **C1-3 vs C1-7** | Both involve social reference | C1-3: absence of positive models ("nobody like me"). C1-7: presence of active negative feedback ("they say I can't"). Absence vs active opposition. |
| **C2-1 vs C2-6** | Both about motivation source | C2-1: no intrinsic value at all ("I don't want this"). C2-6: some motivation but externally sourced ("I want the reward"). C2-1 is misalignment; C2-6 is misdirection. |
| **C2-2 vs C5-5** | Both involve fear | C2-2: fears consequences of success AND failure ("what if everything changes?"). C5-5: fears cost of failure specifically ("what if I fail?"). C2-2 is broader fear; C5-5 is loss-aversion. |
| **C2-5 vs C7-6** | Both involve internal conflict | C2-5: desire-level ambivalence ("do I want this?"). C7-6: values-level conflict ("this violates my principles"). Want-conflict vs should-conflict. |
| **C2-8 vs C5-2** | Both involve temporal discounting | C2-8: doesn't VALUE the future outcome ("won't matter later"). C5-2: WANTS the future outcome but can't tolerate delay ("I need results NOW"). Devalued future vs impatient present. |
| **C5-6 vs C6-3** | Both involve indecision about approach | C5-6: pre-commitment indecision ("should I even do this?"). C6-3: post-commitment plan selection ("which method should I use?"). Whether-to vs how-to. |
| **C6-1 vs C7-1** | Both cite multiple demands | C6-1: planning-level fragmentation ("I can't form a plan with so many goals"). C7-1: commitment-level displacement ("other things keep taking priority"). Can't plan vs can't protect the plan. |
| **C6-5 vs C8A-1** | Both about inability to start | C6-5: doesn't know WHAT to do ("what's the first step?"). C8A-1: knows what to do but CAN'T start ("I'm just sitting there"). Cognitive ambiguity vs motor inertia. |
| **C6-7 vs C7-5** | Both involve not acting despite plan | C6-7: genuinely FORGETS ("it didn't cross my mind"). C7-5: consciously DEPRIORITIZES ("it can wait"). Unintentional vs intentional delay. |
| **C7-7 vs C7-8** | Both about identity-behavior gap | C7-7: prospective rejection ("doing this ISN'T me"). C7-8: retrospective shame ("I KEEP failing to BE who I say"). C7-7 refuses; C7-8 attempts and fails. |
| **C8A-1 vs C0-8** | Both involve immobility/freeze | C8A-1: volitional hesitation with frustration ("I want to but can't make myself"). C0-8: autonomic shutdown with numbness/dissociation ("I go blank, I can't move or think"). C8A-1 has awareness; C0-8 has absence. |
| **C8A-3 vs C8B-2** | Both involve distraction | C8A-3: distraction PREVENTS starting ("I was about to but then..."). C8B-2: distraction INTERRUPTS during action ("I was doing it and got pulled away"). Pre-initiation vs mid-execution. |
| **C8A-7 vs C8B-7** | Both about momentum | C8A-7: can't cold START from rest ("getting going is the problem"). C8B-7: can't RESTART after interruption ("once I stop I can't get back"). Initial launch vs recovery. |
| **C8B-1 vs C2-7** | Both about disengagement | C8B-1: lost interest through repetition (was engaged, hedonic adaptation). C2-7: never had meaningful engagement (no purpose). "It used to be fun" vs "I never saw the point." |
| **C8B-4 vs C8B-8** | Both triggered by perceived failure | C8B-4: cognitive catastrophizing ("it's all ruined"). C8B-8: moral self-punishment ("I deserve to fail"). Assessment vs judgment. One concludes the task is lost; the other concludes they don't deserve to continue. |
| **C8B-2 vs C8B-9** | Both about competing alternatives | C8B-2: general distraction/stimulation seeking ("I got distracted"). C8B-9: specific comfort seeking ("I'd rather be comfortable"). Stimulation vs comfort as the pull. |

---

## Appendix C: Top 20 High-Confidence Markers

These are the 20 most reliable linguistic markers across all gates -- phrases that almost always indicate a specific root cause with minimal ambiguity when spoken in a goal-pursuit context.

| # | Marker | Root Cause | Confidence | Why High Confidence |
|---|--------|-----------|------------|---------------------|
| 1 | "I'm just not good at this" | C1-2 Fixed Mindset | Very High | Trait-based self-assessment with fixed quality |
| 2 | "Nobody like me has done this" | C1-3 No Relatable Models | Very High | Explicitly names social reference gap |
| 3 | "I should want this but I don't" | C2-1 Value Misalignment | Very High | Direct admission of desire-value disconnect |
| 4 | "Don't tell me what to do" | C2-4 Reactance | Very High | Classic reactance verbalization |
| 5 | "What's the point?" | C2-7 Purpose Deficit | Very High | Direct meaning vacuum expression |
| 6 | "I need to see results now" | C5-2 Delayed Gratification Intolerance | Very High | Explicit temporal intolerance |
| 7 | "This will be horrible" | C5-3 Effort Overestimation | Very High | Catastrophic effort prediction |
| 8 | "I'd rather not try than fail" | C5-5 Failure Cost Aversion | Very High | Direct expression of loss aversion preference |
| 9 | "I know I should do something but what?" | C6-5 Action Ambiguity | Very High | Explicit intention without specification |
| 10 | "I keep forgetting to do it" | C6-7 Weak Cue-Response Binding | Very High | Direct cue-failure report |
| 11 | "Something always comes up" | C5-1 Competing Commitments | Very High | Classic commitment displacement phrase |
| 12 | "That's not who I am" | C5-7 Identity Misalignment | Very High | Direct identity-rejection statement |
| 13 | "I keep saying I'll change but never do" | C5-8 Identity-Behavior Dissonance | Very High | Direct gap articulation |
| 14 | "I just can't start" | C8A-1 Motor Initiation Threshold | Very High | Classic motor gate language |
| 15 | "I'll start when I feel ready" | C8A-4 Waiting for Readiness | Very High | Explicit readiness condition |
| 16 | "Once I start I'm fine, it's just starting" | C8A-7 Momentum Dependency | Very High | Directly defines the initiation-continuation gap |
| 17 | "I messed up so why bother" | C8B-4 Single-Error Catastrophizing | Very High | Classic all-or-nothing response |
| 18 | "It's not good enough" | C8B-5 Perfectionism | High | Perfectionism when output quality is objectively adequate |
| 19 | "I'm not getting anywhere" | C8B-6 Invisible Progress | Very High | Direct progress-absence frustration |
| 20 | "I shut down completely" | C0-8 Trauma-Related Freeze | High | Autonomic freeze self-report (requires clinical context confirmation) |

---

## Appendix D: Sentiment-to-Gate Mapping

Emotional qualities of speech mapped to their most likely gate associations.

| Emotional Tone | Primary Gate(s) | Secondary Gate(s) | Distinguishing Context |
|---------------|-----------------|-------------------|----------------------|
| **Resignation** (flat, given up) | C0, C1-2 | C7-8 | C0 if external cause cited; C1-2 if ability-based; C7-8 if chronic failure pattern |
| **Frustration** (active, directed) | C5, C8A | C8B-6 | C5 if about cost/effort; C8A if about inability to start; C8B-6 if about lack of results |
| **Anxiety** (tense, worried) | C2-2, C5-5, C8A-2 | C1-4 | C2-2 if about consequences; C5-5 if about failure; C8A-2 if at action moment; C1-4 if meta-cognitive |
| **Ambivalence** (torn, oscillating) | C2-5, C7-6 | C5-6 | C2-5 if about wanting; C7-6 if about values; C5-6 if about choosing |
| **Flatness** (disengaged, empty) | C2-1, C2-7 | C0-P | C2-1 if goal-specific; C2-7 if pervasive; C0-P if biological correlates |
| **Defiance** (oppositional, resistant) | C2-4 | C7-7 | C2-4 if against external pressure; C7-7 if identity protection |
| **Shame** (self-contempt, hiding) | C8B-8, C7-8 | C1-6 | C8B-8 if triggered by specific failure; C7-8 if chronic gap; C1-6 if confidence collapse |
| **Overwhelm** (scattered, drowning) | C6-1, C6-4, C5-3 | C7-1 | C6-1 if too many goals; C6-4 if plan too complex; C5-3 if effort magnified; C7-1 if too many demands |
| **Bewilderment** (confused, lost) | C6-5, C1-1 | C8A-1 | C6-5 if about what to do; C1-1 if about unexpected failure; C8A-1 if about why they can't start |
| **Impatience** (urgent, restless) | C5-2, C8B-1 | C7-5 | C5-2 if about delayed rewards; C8B-1 if about task monotony; C7-5 inverted (others lack urgency) |
| **Guilt** (apologetic, self-blaming) | C7-1, C8B-8 | C7-8 | C7-1 if about letting others down; C8B-8 if self-directed; C7-8 if about hypocrisy |
| **Detachment** (numb, dissociated) | C0-8 | C2-3 | C0-8 if involuntary/autonomic; C2-3 if deliberate avoidance |
| **Perfectionist distress** (never enough) | C8B-5 | C5-5 | C8B-5 if about output quality; C5-5 if about fear of overall failure |

---

## Appendix E: Detection Architecture Notes

### Weighting Logic

1. **Explicit markers** are high-confidence if they appear in the correct conversational context (discussing goal pursuit, not casual speech). Weight: 0.8-1.0 per match.
2. **Implicit patterns** require multiple co-occurring signals. Weight: 0.3-0.5 per match, cumulative.
3. **Sentiment/tone markers** serve as gate-level filters, not root-cause diagnostics. Weight: 0.2-0.3 for gate selection.
4. **Cross-session consistency** multiplies confidence: 1x for first occurrence, 1.5x for second in different session, 2x for third.
5. **Gate-first, then root-cause**: Use Appendix A keyword clusters for gate hypothesis, then drill into root-cause markers within the identified gate.

### Context Windows

- **Voice Practice**: Markers extracted from real-time transcription. Short utterances (1-3 sentences). Focus on explicit markers and emotional tone.
- **Simulation Studio**: Multi-turn conversation transcripts. Richer context allows implicit pattern detection. Watch for markers ABOUT the skill practice itself ("I don't know why I'm bad at this" -- is it C1 about the communication skill?).
- **Skills Lab**: Drill responses. Primarily behavioral event markers (quit points, retry behavior, time-to-response) rather than linguistic markers.
- **Onboarding**: Self-assessment responses. Highly concentrated diagnostic opportunity. Map directly to explicit markers.

### Anti-Patterns (False Positive Mitigation)

- Single-instance markers outside of ONE-TIME classification should not trigger hypotheses
- Casual/humorous usage of marker phrases ("I'm so boring" in casual conversation) should be discounted
- Cross-domain generalization without evidence (one marker in one context) should be flagged as low-confidence
- Markers that appear only during high-stress simulation scenarios may reflect scenario pressure, not trait patterns
- Self-awareness language ("I know I tend to...") indicates metacognitive engagement, not necessarily active root cause -- may actually indicate partial resolution

---

*End of codebook. This document is SYSTEM-INTERNAL. Users must never see gate labels, root cause codes, or diagnostic terminology. All user-facing interactions reference exercises, tips, and contextually appropriate nudges -- never diagnostic categories.*
