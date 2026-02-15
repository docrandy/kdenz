# Labeling Practice Module - Feature Specification

**Status:** Implementation Ready
**Priority:** P0 - First skill module
**Created:** 2026-01-26

---

## Overview

Interactive practice module where AI presents emotional statements and user practices labeling the underlying emotion using Chris Voss's technique.

## User Flow

```
1. User selects "Labeling Practice" from skill modules
2. AI presents scenario context + emotional statement
   → "Your manager says: 'I don't know if we can make that work right now.'"
3. User speaks their label attempt (recorded + transcribed)
4. System analyzes and scores the label
5. Feedback displayed:
   - Syntax check (correct formula?)
   - Depth check (surface vs underlying?)
   - Silence check (did they pause or keep talking?)
6. AI responds based on label quality
   - Good label → opens up, reveals more
   - Weak label → stays guarded
7. User can retry or move to next scenario
8. Session summary shows patterns across attempts
```

---

## Technical Components

### Data Structures

```typescript
// Scenario definition
interface LabelingScenario {
  id: string;
  context: string;           // Setup text
  statement: string;         // What the AI "says"
  surfaceEmotion: string;    // What novices label (e.g., "frustrated")
  underlyingDriver: string;  // What experts label (e.g., "worried about precedent")
  category: 'salary' | 'saying-no' | 'difficult-conversation' | 'workplace';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// User's label attempt
interface LabelAttempt {
  id: string;
  scenarioId: string;
  timestamp: number;
  transcript: string;
  audioBlob?: Blob;
  analysis: LabelAnalysis;
}

// Analysis result
interface LabelAnalysis {
  // Syntax scoring
  syntaxScore: {
    hasCorrectOpener: boolean;        // "It seems/sounds/looks like..."
    openerUsed: string | null;
    avoidsIFraming: boolean;          // No "I'm hearing", "I think"
    avoidsYouFraming: boolean;        // No "You seem", "You're"
    isStatement: boolean;             // Not a question
    endsWithSilence: boolean;         // Pause after label
  };

  // Depth scoring
  depthScore: {
    targetsSurfaceEmotion: boolean;   // Generic (weak)
    targetsUnderlyingDriver: boolean; // Specific (strong)
    emotionLabeled: string;           // What they labeled
    specificity: 'generic' | 'specific' | 'highly-specific';
  };

  // Overall
  overallScore: number;               // 0-100
  feedback: string[];                 // Specific feedback messages
  expertExample: string;              // What an expert would say
}

// Pattern tracking (across sessions)
interface LabelingPatterns {
  totalAttempts: number;
  syntaxErrorRate: number;
  commonMistakes: string[];
  emotionVocabulary: string[];        // Unique emotions labeled
  vocabularyTTR: number;              // Type-token ratio
  repetitiveTemplates: string[];      // Detected repeated phrases
  improvementTrend: number[];         // Scores over time
}
```

### Components

| Component | Purpose |
|-----------|---------|
| `LabelingPractice.tsx` | Main module container |
| `ScenarioPresenter.tsx` | Displays AI statement + context |
| `LabelRecorder.tsx` | Records user's spoken label |
| `LabelFeedback.tsx` | Shows analysis + score + suggestions |
| `AIResponse.tsx` | Dynamic AI response based on label quality |
| `PatternSummary.tsx` | Cross-session pattern analysis |

### Hooks

| Hook | Purpose |
|------|---------|
| `useLabelAnalyzer.ts` | Analyzes transcript for syntax/depth |
| `useLabelingSession.ts` | Manages scenario flow + state |
| `useLabelingPatterns.ts` | Tracks patterns across attempts |

### Services

| Service | Purpose |
|---------|---------|
| `labelAnalyzer.ts` | Core analysis logic |
| `scenarioBank.ts` | Scenario definitions |
| `labelingStorage.ts` | Persist attempts + patterns |

---

## Analysis Logic

### Syntax Detection

```typescript
const VALID_OPENERS = [
  'it seems like',
  'it sounds like',
  'it looks like',
  'seems like',
  'sounds like',
  'looks like'
];

const INVALID_I_FRAMES = [
  "i'm hearing",
  "i hear",
  "i think",
  "i feel like",
  "i sense",
  "i understand"
];

const INVALID_YOU_FRAMES = [
  "you seem",
  "you sound",
  "you look",
  "you're",
  "you are"
];

function checkSyntax(transcript: string): SyntaxScore {
  const lower = transcript.toLowerCase().trim();

  // Check for valid opener
  const hasCorrectOpener = VALID_OPENERS.some(o => lower.startsWith(o));
  const openerUsed = VALID_OPENERS.find(o => lower.startsWith(o)) || null;

  // Check for invalid framing
  const avoidsIFraming = !INVALID_I_FRAMES.some(f => lower.includes(f));
  const avoidsYouFraming = !INVALID_YOU_FRAMES.some(f => lower.startsWith(f));

  // Check if ends with question
  const isStatement = !lower.endsWith('?') && !lower.includes('right?');

  return { hasCorrectOpener, openerUsed, avoidsIFraming, avoidsYouFraming, isStatement };
}
```

### Depth Detection

```typescript
const SURFACE_EMOTIONS = [
  'frustrated', 'angry', 'upset', 'annoyed', 'stressed',
  'worried', 'nervous', 'anxious', 'sad', 'disappointed'
];

const UNDERLYING_DRIVERS = [
  'control', 'precedent', 'authority', 'recognition', 'fairness',
  'respect', 'autonomy', 'security', 'pressure', 'position'
];

function checkDepth(transcript: string, scenario: LabelingScenario): DepthScore {
  const lower = transcript.toLowerCase();

  // Check for surface vs underlying
  const hasSurface = SURFACE_EMOTIONS.some(e => lower.includes(e));
  const hasDriver = UNDERLYING_DRIVERS.some(d => lower.includes(d));

  // Specificity scoring
  let specificity: 'generic' | 'specific' | 'highly-specific' = 'generic';
  if (hasDriver && !hasSurface) specificity = 'highly-specific';
  else if (hasDriver && hasSurface) specificity = 'specific';
  else if (hasSurface) specificity = 'generic';

  return {
    targetsSurfaceEmotion: hasSurface && !hasDriver,
    targetsUnderlyingDriver: hasDriver,
    specificity
  };
}
```

### Scoring Formula

```typescript
function calculateScore(syntax: SyntaxScore, depth: DepthScore): number {
  let score = 0;

  // Syntax (40 points max)
  if (syntax.hasCorrectOpener) score += 15;
  if (syntax.avoidsIFraming) score += 10;
  if (syntax.avoidsYouFraming) score += 5;
  if (syntax.isStatement) score += 10;

  // Depth (60 points max)
  if (depth.specificity === 'highly-specific') score += 60;
  else if (depth.specificity === 'specific') score += 40;
  else if (depth.specificity === 'generic') score += 20;

  return score;
}
```

---

## Scenario Bank (Initial)

### Salary Negotiation
1. "I don't know if we can make that work right now."
   - Surface: frustrated, hesitant
   - Driver: worried about setting precedent, leadership pressure

2. "That's quite a bit more than we budgeted."
   - Surface: surprised, concerned
   - Driver: worried about justifying to leadership

3. "Let me think about it and get back to you."
   - Surface: uncertain, stalling
   - Driver: needs to maintain control, doesn't want to commit

### Saying No
4. "I really need you on this project."
   - Surface: desperate, pressuring
   - Driver: worried about their own deadline/reputation

5. "But you've always helped before."
   - Surface: disappointed, manipulative
   - Driver: fears losing reliable support

### Difficult Conversations
6. "I had a rough day today."
   - Surface: tired, venting
   - Driver: needs acknowledgment, feels unheard

7. "Whatever you think is best."
   - Surface: agreeable, passive
   - Driver: feels input doesn't matter, checked out

---

## Feedback Messages

### Syntax Feedback
| Issue | Message |
|-------|---------|
| Missing opener | "Start with 'It seems like...' or 'It sounds like...' to create distance" |
| Used "I" framing | "Remove 'I' from your label — 'I'm hearing' makes it about you, not them" |
| Used "You" framing | "Avoid 'You seem...' — use 'It seems like...' to lower defensiveness" |
| Question inflection | "Make it a statement, not a question. Questions trigger defense." |
| No pause | "Pause after your label. Silence invites them to confirm or correct." |

### Depth Feedback
| Issue | Message |
|-------|---------|
| Surface only | "You labeled the surface emotion. Dig deeper — what's driving it?" |
| Generic | "Good start. Can you be more specific about what's at stake for them?" |
| Strong driver | "Excellent — you identified the underlying driver, not just the emotion." |

---

## AI Response Logic

```typescript
function generateAIResponse(score: number, scenario: LabelingScenario): string {
  if (score >= 80) {
    // Opens up, reveals more
    return getOpenResponse(scenario);
  } else if (score >= 50) {
    // Partial opening
    return getPartialResponse(scenario);
  } else {
    // Stays guarded
    return getGuardedResponse(scenario);
  }
}
```

---

## Success Criteria

1. [ ] User can select labeling practice from main menu
2. [ ] Scenario presents with context + AI statement
3. [ ] User can record spoken label
4. [ ] Transcript analyzed for syntax + depth
5. [ ] Score calculated and displayed (0-100)
6. [ ] Specific feedback shown for mistakes
7. [ ] AI responds dynamically based on label quality
8. [ ] Patterns tracked across attempts (vocabulary, templates)
9. [ ] Session summary shows improvement trend

---

## Files to Create

```
src/
├── features/
│   └── labeling/
│       ├── LabelingPractice.tsx      # Main container
│       ├── ScenarioPresenter.tsx     # AI statement display
│       ├── LabelRecorder.tsx         # Recording UI
│       ├── LabelFeedback.tsx         # Analysis display
│       ├── AIResponse.tsx            # Dynamic response
│       ├── PatternSummary.tsx        # Cross-session patterns
│       ├── useLabelAnalyzer.ts       # Analysis hook
│       ├── useLabelingSession.ts     # Session state
│       ├── useLabelingPatterns.ts    # Pattern tracking
│       ├── labelAnalyzer.ts          # Core analysis
│       ├── scenarioBank.ts           # Scenario data
│       ├── labelingStorage.ts        # Persistence
│       └── types.ts                  # TypeScript interfaces
```

---

## Implementation Order

1. **Types + Data** - interfaces, scenario bank
2. **Analysis Logic** - syntax checker, depth checker, scoring
3. **UI Components** - scenario presenter, recorder, feedback
4. **Session Flow** - hook to manage state machine
5. **AI Response** - dynamic responses based on score
6. **Pattern Tracking** - cross-session analysis
7. **Integration** - add to main app navigation
