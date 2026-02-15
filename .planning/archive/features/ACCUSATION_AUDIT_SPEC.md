# Accusation Audit Practice Module - Feature Specification

**Status:** Implementation Ready
**Priority:** P1 - Second skill module
**Created:** 2026-01-26

---

## Overview

Interactive practice module where users practice pre-emptively naming negative assumptions their counterpart may hold about them. This technique neutralizes defensiveness before it starts.

**Key Difference from Labeling:**
- Labeling = validates *their* emotion (mid-conversation)
- Accusation Audit = names *their thoughts about you* (conversation start)

---

## User Flow

```
1. User selects "Accusation Audit" from skill modules
2. System presents scenario context (who, what's at stake, relationship)
3. Phase 1: PREPARATION
   → User brainstorms criticisms (text input or voice)
   → "What might they be thinking about me?"
   → System shows common criticisms for this scenario
4. Phase 2: DELIVERY
   → User speaks their accusation audit (recorded + transcribed)
   → Must verbalize multiple concerns in their voice
5. Phase 3: ANALYSIS
   → System scores: completeness, tone, structure
   → Feedback on what was covered vs missed
6. Phase 4: AI RESPONSE
   → AI responds based on audit quality
   → Good audit → "Actually, it's more that..." (reveals true concern)
   → Weak audit → stays defensive or silent
7. User can retry or move to next scenario
8. Session summary shows patterns across attempts
```

---

## Technical Components

### Data Structures

```typescript
// Scenario definition
interface AuditScenario {
  id: string;
  context: string;              // Setup text
  relationship: string;         // Your relationship to counterpart
  stakes: string;               // What's at risk
  counterpartRole: string;      // "Your manager", "Your colleague", etc.

  // What they might think
  commonCriticisms: Criticism[];
  hiddenConcern: string;        // The real issue (revealed if audit is good)

  category: 'salary' | 'saying-no' | 'difficult-conversation' | 'workplace';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Criticism {
  id: string;
  text: string;                 // "You're ungrateful"
  inTheirVoice: string;         // "I'm being ungrateful"
  importance: 'critical' | 'common' | 'minor';
}

// User's audit attempt
interface AuditAttempt {
  id: string;
  scenarioId: string;
  timestamp: number;

  // Preparation phase
  brainstormedCriticisms: string[];

  // Delivery phase
  transcript: string;
  audioBlob?: Blob;

  analysis: AuditAnalysis;
}

// Analysis result
interface AuditAnalysis {
  // Coverage scoring
  coverageScore: {
    criticismsCovered: string[];      // Which ones they addressed
    criticismsMissed: string[];       // Which ones they missed
    coveragePercent: number;          // % of important criticisms covered
    coveredCritical: boolean;         // Did they hit the critical ones?
  };

  // Delivery scoring
  deliveryScore: {
    usesFirstPerson: boolean;         // "I might seem ungrateful" not "You think I'm ungrateful"
    avoidsDefense: boolean;           // No justifications or explanations
    acknowledgesImpact: boolean;      // "I get why that would be concerning"
    multiplePoints: boolean;          // Listed several criticisms
    appropriateTone: 'defensive' | 'neutral' | 'empathetic';
  };

  // Structure scoring
  structureScore: {
    hasOpener: boolean;               // "I know this might look like..."
    listsMultiple: boolean;           // Multiple criticisms listed
    hasAcknowledgment: boolean;       // "I understand why that's concerning"
    followedBySilence: boolean;       // Didn't immediately defend
  };

  // Overall
  overallScore: number;               // 0-100
  feedback: string[];                 // Specific feedback messages
  expertExample: string;              // What an expert would say
  missedOpportunities: string[];      // Critical points not addressed
}

// Pattern tracking (across sessions)
interface AuditPatterns {
  totalAttempts: number;
  avgCoverage: number;                // Average % of criticisms covered
  commonMisses: string[];             // Criticisms frequently missed
  defenseTriggers: string[];          // Phrases that signal defensiveness
  improvementTrend: number[];         // Scores over time
  completenessOverTime: number[];     // Coverage % over time
}
```

### Components

| Component | Purpose |
|-----------|---------|
| `AccusationAuditPractice.tsx` | Main module container |
| `AuditScenarioPresenter.tsx` | Displays scenario + context |
| `CriticismBrainstorm.tsx` | Phase 1: User brainstorms criticisms |
| `AuditRecorder.tsx` | Phase 2: Records spoken audit |
| `AuditFeedback.tsx` | Shows analysis + coverage + suggestions |
| `AuditAIResponse.tsx` | Dynamic AI response based on audit quality |
| `AuditPatternSummary.tsx` | Cross-session pattern analysis |

### Hooks

| Hook | Purpose |
|------|---------|
| `useAuditAnalyzer.ts` | Analyzes transcript for coverage/delivery |
| `useAuditSession.ts` | Manages scenario flow + phases |
| `useAuditPatterns.ts` | Tracks patterns across attempts |

### Services

| Service | Purpose |
|---------|---------|
| `auditAnalyzer.ts` | Core analysis logic |
| `auditScenarioBank.ts` | Scenario definitions |
| `auditStorage.ts` | Persist attempts + patterns |

---

## Analysis Logic

### Coverage Detection

```typescript
const CRITICISM_PATTERNS: Record<string, string[]> = {
  'ungrateful': ['ungrateful', 'not appreciating', 'taking for granted', 'entitled'],
  'disloyal': ['disloyal', 'job shopping', 'looking elsewhere', 'not committed'],
  'selfish': ['selfish', 'only thinking about myself', 'not a team player'],
  'unrealistic': ['unrealistic', 'asking too much', 'out of touch', 'naive'],
  'greedy': ['greedy', 'only about money', 'motivated by money'],
  'difficult': ['difficult', 'hard to work with', 'demanding', 'pushy'],
  'lazy': ['lazy', 'not pulling weight', 'underperforming'],
  'incompetent': ['incompetent', 'not capable', 'out of my depth'],
};

function checkCoverage(transcript: string, scenario: AuditScenario): CoverageScore {
  const lower = transcript.toLowerCase();
  const covered: string[] = [];
  const missed: string[] = [];

  for (const criticism of scenario.commonCriticisms) {
    const patterns = CRITICISM_PATTERNS[criticism.id] || [criticism.text.toLowerCase()];
    const found = patterns.some(p => lower.includes(p));

    if (found) {
      covered.push(criticism.id);
    } else {
      missed.push(criticism.id);
    }
  }

  const criticalOnes = scenario.commonCriticisms.filter(c => c.importance === 'critical');
  const coveredCritical = criticalOnes.every(c => covered.includes(c.id));

  return {
    criticismsCovered: covered,
    criticismsMissed: missed,
    coveragePercent: (covered.length / scenario.commonCriticisms.length) * 100,
    coveredCritical
  };
}
```

### Delivery Detection

```typescript
const DEFENSIVE_MARKERS = [
  'but', 'however', 'actually', 'the thing is', 'let me explain',
  'because', 'the reason', "it's just that", 'to be fair'
];

const FIRST_PERSON_AUDIT = [
  "i might seem", "i might look like", "i might come across",
  "this might look like i'm", "this might seem like i'm",
  "i know this might make me look", "i know this might seem"
];

const ACKNOWLEDGMENT_PHRASES = [
  "i understand", "i get why", "i can see why",
  "that would be concerning", "that's a fair concern",
  "makes sense you'd think"
];

function checkDelivery(transcript: string): DeliveryScore {
  const lower = transcript.toLowerCase();

  // Check for first person framing (good)
  const usesFirstPerson = FIRST_PERSON_AUDIT.some(p => lower.includes(p));

  // Check for defensive markers (bad)
  const avoidsDefense = !DEFENSIVE_MARKERS.some(m => {
    // Only flag if appears after main statement (as justification)
    const idx = lower.indexOf(m);
    return idx > 30 && idx < lower.length - 20; // Not at very start or end
  });

  // Check for acknowledgment
  const acknowledgesImpact = ACKNOWLEDGMENT_PHRASES.some(p => lower.includes(p));

  // Check for multiple points (commas, "and", line breaks)
  const multiplePoints = (lower.match(/,/g) || []).length >= 2 ||
                         lower.includes(' and ') ||
                         lower.split(/[,.]/).length >= 3;

  // Tone detection
  let appropriateTone: 'defensive' | 'neutral' | 'empathetic' = 'neutral';
  if (!avoidsDefense) appropriateTone = 'defensive';
  else if (acknowledgesImpact && usesFirstPerson) appropriateTone = 'empathetic';

  return {
    usesFirstPerson,
    avoidsDefense,
    acknowledgesImpact,
    multiplePoints,
    appropriateTone
  };
}
```

### Structure Detection

```typescript
const OPENER_PHRASES = [
  "i know this might", "i realize this might", "this might look like",
  "this might seem like", "i'm sure it seems like", "you might be thinking"
];

function checkStructure(transcript: string): StructureScore {
  const lower = transcript.toLowerCase();

  const hasOpener = OPENER_PHRASES.some(p => lower.startsWith(p) || lower.indexOf(p) < 20);

  // Multiple criticisms = commas or "and" connectors
  const segments = lower.split(/,|and/).filter(s => s.trim().length > 5);
  const listsMultiple = segments.length >= 2;

  const hasAcknowledgment = ACKNOWLEDGMENT_PHRASES.some(p => lower.includes(p));

  // Can't detect actual silence, but can check if they kept talking
  // (very long transcript = didn't pause)
  const wordCount = lower.split(/\s+/).length;
  const followedBySilence = wordCount < 60; // Short enough to have paused

  return {
    hasOpener,
    listsMultiple,
    hasAcknowledgment,
    followedBySilence
  };
}
```

### Scoring Formula

```typescript
function calculateScore(
  coverage: CoverageScore,
  delivery: DeliveryScore,
  structure: StructureScore
): number {
  let score = 0;

  // Coverage (40 points max)
  score += Math.round(coverage.coveragePercent * 0.3); // Up to 30
  if (coverage.coveredCritical) score += 10;

  // Delivery (35 points max)
  if (delivery.usesFirstPerson) score += 10;
  if (delivery.avoidsDefense) score += 10;
  if (delivery.acknowledgesImpact) score += 10;
  if (delivery.multiplePoints) score += 5;

  // Structure (25 points max)
  if (structure.hasOpener) score += 10;
  if (structure.listsMultiple) score += 5;
  if (structure.hasAcknowledgment) score += 5;
  if (structure.followedBySilence) score += 5;

  return Math.min(100, score);
}
```

---

## Scenario Bank (Initial)

### Salary Negotiation

**1. Asking for a Raise (Beginner)**
- Context: Annual review, you're asking for 15% raise
- Counterpart: Your direct manager
- Common criticisms:
  - (critical) "I'm ungrateful for what I already have"
  - (critical) "I'm only motivated by money"
  - (common) "I'm not thinking about the team/company"
  - (common) "I might be job shopping"
  - (minor) "I don't understand budget constraints"
- Hidden concern: Manager worried about justifying to their boss

**2. Counter-Offering After Job Offer (Intermediate)**
- Context: Got offer, want to negotiate higher
- Counterpart: HR/Hiring manager
- Common criticisms:
  - (critical) "I'm being greedy"
  - (critical) "I'm not that excited about the role"
  - (common) "I'm just using this as leverage"
  - (common) "I'll leave for more money later"
- Hidden concern: Worried about setting precedent for other hires

**3. Asking for Promotion (Advanced)**
- Context: Ready for next level, but wasn't offered
- Counterpart: Skip-level manager
- Common criticisms:
  - (critical) "I'm entitled"
  - (critical) "I'm not ready and don't see it"
  - (common) "I'm impatient"
  - (common) "I don't understand the bigger picture"
  - (minor) "I'm undermining my direct manager"
- Hidden concern: Worry about team dynamics if promoted

### Saying No

**4. Declining Extra Work (Beginner)**
- Context: Boss asks you to take on a project, you're at capacity
- Counterpart: Your manager
- Common criticisms:
  - (critical) "I'm not a team player"
  - (critical) "I'm not committed enough"
  - (common) "I'm being difficult"
  - (minor) "I'm lazy"
- Hidden concern: Manager is stressed about their own deadlines

**5. Saying No to a Friend's Business Favor (Intermediate)**
- Context: Friend wants free work from you
- Counterpart: Close friend
- Common criticisms:
  - (critical) "I don't value our friendship"
  - (critical) "I'm selfish"
  - (common) "I think I'm too good for this"
  - (common) "I'm not supportive"
- Hidden concern: Friend feels vulnerable about their business

**6. Declining a Promotion (Advanced)**
- Context: Offered management role, want to stay IC
- Counterpart: Your manager
- Common criticisms:
  - (critical) "I'm not ambitious"
  - (critical) "I'm not leadership material"
  - (common) "I'm a flight risk"
  - (common) "I'm not committed to growing here"
- Hidden concern: Manager planned team structure around your promotion

### Difficult Conversations

**7. Giving Critical Feedback (Beginner)**
- Context: Need to tell direct report their work isn't meeting expectations
- Counterpart: Your direct report
- Common criticisms:
  - (critical) "I don't see their effort"
  - (critical) "I'm being unfair"
  - (common) "I have unrealistic standards"
  - (common) "I don't like them personally"
- Hidden concern: They're going through something outside work

**8. Addressing Missed Deadline (Intermediate)**
- Context: Colleague missed deadline that impacted your work
- Counterpart: Peer colleague
- Common criticisms:
  - (critical) "I'm blaming them for my problems"
  - (critical) "I'm not being understanding"
  - (common) "I'm trying to make them look bad"
  - (common) "I don't see the bigger picture"
- Hidden concern: They had a legitimate blocker they're embarrassed about

### Workplace

**9. Asking for Remote Work (Beginner)**
- Context: Want to work remote, company prefers in-office
- Counterpart: Your manager
- Common criticisms:
  - (critical) "I'm not committed to the team"
  - (common) "I want to slack off"
  - (common) "I don't value collaboration"
  - (minor) "I think I'm special"
- Hidden concern: Manager under pressure from leadership on RTO

**10. Raising Concern About Process (Intermediate)**
- Context: Current process is inefficient, want to suggest change
- Counterpart: Process owner (peer or senior)
- Common criticisms:
  - (critical) "I'm criticizing their work"
  - (critical) "I think I know better"
  - (common) "I'm not respecting how we got here"
  - (common) "I'm being difficult"
- Hidden concern: They know it's broken but feel ownership

---

## Feedback Messages

### Coverage Feedback

| Issue | Message |
|-------|---------|
| Missed critical | "You missed a critical concern: [X]. They're definitely thinking this." |
| Low coverage | "You only addressed [N]% of likely concerns. Cast a wider net." |
| Good coverage | "Strong coverage - you anticipated most of what they might think." |
| Overcovered | "Good instinct to be thorough, but some of these might not apply here." |

### Delivery Feedback

| Issue | Message |
|-------|---------|
| Defensive | "You slipped into defense mode with '[phrase]'. Just name it, don't explain it." |
| Wrong person | "Use 'I might seem...' not 'You might think...'. Own it in first person." |
| No acknowledgment | "Add 'I understand why that would be concerning' to show empathy." |
| Single point | "List multiple concerns - an audit should surface everything upfront." |
| Good delivery | "Clean delivery - you named concerns without defending yourself." |

### Structure Feedback

| Issue | Message |
|-------|---------|
| No opener | "Start with 'I know this might...' to signal you're aware of perceptions." |
| Too short | "Your audit was brief. Surface more of their potential concerns." |
| Too long | "Shorter is better. List concerns, acknowledge, then silence." |
| Good structure | "Good structure - opener, multiple concerns, acknowledgment." |

---

## AI Response Logic

```typescript
function generateAIResponse(score: number, scenario: AuditScenario): AIResponse {
  if (score >= 80) {
    // Reveals true concern (the win)
    return {
      type: 'opens',
      text: `"Actually, it's not that at all. ${scenario.hiddenConcern}"`,
      interpretation: "Your audit worked - they revealed what's really on their mind."
    };
  } else if (score >= 50) {
    // Partial opening
    return {
      type: 'partial',
      text: `"Well... I wouldn't say all that, but [partial admission]"`,
      interpretation: "They softened but didn't fully open. Try hitting more concerns."
    };
  } else {
    // Stays guarded
    return {
      type: 'guarded',
      text: `"Look, let's just focus on the issue at hand."`,
      interpretation: "They're still defensive. Your audit didn't surface enough concerns."
    };
  }
}
```

---

## Success Criteria

1. [ ] User can select accusation audit from main menu
2. [ ] Scenario presents with context + relationship + stakes
3. [ ] Brainstorm phase works (optional, can skip)
4. [ ] User can record spoken audit
5. [ ] Transcript analyzed for coverage + delivery + structure
6. [ ] Score calculated and displayed (0-100)
7. [ ] Specific feedback shown for gaps
8. [ ] AI responds dynamically based on audit quality
9. [ ] Patterns tracked across attempts
10. [ ] Session summary shows improvement trend

---

## Files to Create

```
src/
├── features/
│   └── accusation-audit/
│       ├── types.ts                    # TypeScript interfaces
│       ├── scenarios.ts                # Scenario bank data
│       ├── auditAnalyzer.ts            # Core analysis logic
│       ├── auditStorage.ts             # Persistence
│       ├── useAuditSession.ts          # Session state hook
│       ├── useAuditPatterns.ts         # Pattern tracking hook
│       ├── AccusationAuditPractice.tsx # Main container
│       ├── AuditScenarioPresenter.tsx  # Scenario display
│       ├── CriticismBrainstorm.tsx     # Phase 1: Brainstorm UI
│       ├── AuditRecorder.tsx           # Phase 2: Recording UI
│       ├── AuditFeedback.tsx           # Analysis display
│       ├── AuditAIResponse.tsx         # Dynamic response
│       └── AuditPatternSummary.tsx     # Cross-session patterns
```

---

## Implementation Order

1. **Types + Data** - interfaces, scenario bank
2. **Analysis Logic** - coverage, delivery, structure checkers, scoring
3. **Storage** - persist attempts + patterns
4. **UI Components** - scenario presenter, brainstorm, recorder, feedback
5. **Session Flow** - hook to manage phase state machine
6. **AI Response** - dynamic responses based on score
7. **Pattern Tracking** - cross-session analysis
8. **Integration** - add to main app navigation (replace placeholder)

---

## Comparison to Labeling Module

| Aspect | Labeling | Accusation Audit |
|--------|----------|------------------|
| Input | Single statement | Multiple criticisms |
| Timing | Mid-conversation | Start of conversation |
| Focus | Their emotion | Their thoughts about you |
| Success | "That's right" | "Actually..." (correction) |
| Analysis | Syntax + Depth | Coverage + Delivery + Structure |
| Phases | 1 (speak) | 2 (brainstorm + speak) |
| Scoring | 40/60 split | 40/35/25 split |
