# R3: VCM Decision Tree Implementation Patterns + Adaptive Recommendation

**Filed:** 2026-02-13
**Source:** Perplexity research
**Status:** Complete — actionable implementation guidance

---

## Architecture Decision: Hybrid (Client + Edge + Database)

**Recommended:**
```
Client: UI state, session recording, data collection
→ Edge Function: Diagnostic logic, scoring computation
→ Database: History tracking, pattern detection
```

**Why hybrid:**
- Diagnostic logic in serverless function (Vercel Edge) allows rule updates without client redeployment
- Keeps scoring algorithms and thresholds proprietary
- Enables A/B testing of diagnostic pathways
- Consistent versioning across all users
- Database layer (Supabase Postgres) stores diagnosis history, constraint score time series, root cause frequency, exercise→outcome tracking

---

## VCM Structure (Corrected)

**Updated from user input:** VCM has 3 gates → 7 constraints → 5-9 root causes per constraint

Note: User later clarified 8 gates with 5-8 root causes each. The research was based on an earlier 3-gate model. Types below need to be expanded to accommodate 8 gates.

### Core TypeScript Types

```typescript
type ConstraintID = 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6A' | 'C6B';
type GateID = 'A' | 'B' | 'C'; // NEEDS EXPANSION to 8 gates

interface DiagnosticInput {
  voice: {
    anxiety: number;        // 0-1, from Hume.ai
    confidence: number;
    determination: number;
  };
  text: {
    controlLocus: number;          // C1 believability
    intrinsicMotivation: number;   // C2 desire
    effortAcceptance: number;      // C3 will
    planSpecificity: number;       // C4 intention
  };
  performance: {
    completionRate: number;        // C6B maintenance
    initiationLatency: number;     // C6A initiation
    distractionEvents: number;     // C5 commitment
  };
  sessionId: string;
  userId: string;
  timestamp: Date;
}

interface ConstraintScore {
  id: ConstraintID;
  score: number;           // 0-1 normalized
  confidence: number;      // How certain is this score?
  contributingFactors: {
    input: keyof DiagnosticInput;
    weight: number;
    rawValue: number;
  }[];
}

interface DiagnosticResult {
  failedGate: GateID | null;
  failedConstraint: ConstraintID | null;
  rootCause: RootCauseID;
  constraintScores: ConstraintScore[];
  recommendedExercises: ExerciseID[];
  confidence: number;
}
```

### Weighted Scoring Pattern

Each constraint scored by combining voice, text, and performance inputs with configurable weights:
```typescript
function scoreConstraint1(input: DiagnosticInput): ConstraintScore {
  const weights = {
    voice_confidence: 0.3,
    text_controlLocus: 0.4,
    performance_initiationLatency: 0.3
  };
  // Weighted sum → normalized score
}
```

### Sequential Gate Logic

Gates run in order. Stop at first failure (per VCM model). Each failed constraint maps to root cause via signature matching.

### Root Cause Mapping

Decision matrix approach — each root cause has a "signature" (pattern fingerprint across voice, text, performance inputs). Candidates scored against input, best match returned.

```typescript
interface RootCausePattern {
  id: RootCauseID;
  gate: GateID;
  primaryConstraint: ConstraintID;
  signature: {
    voicePattern?: { anxiety: [number, number]; determination: [number, number] };
    textPattern?: { field: string; range: [number, number] };
    performancePattern?: { metric: string; threshold: number };
  };
  description: string;
}
```

---

## How Adaptive Learning Platforms Do This

### Duolingo
- Per-skill difficulty estimator (Item Response Theory)
- Diagnostic placement via adaptive testing (10-20 questions)
- Exercise selection via multi-armed bandit (Thompson Sampling)
- **Key insight:** Separate diagnosis (what's weak?) from prescription (what to practice?)

### Khan Academy
- Granular skill graph with dependencies
- Bayesian Knowledge Tracing: P(skill mastered)
- Mastery thresholds (e.g., 5 correct in a row)
- Exercises tied to specific skills in graph

### KDENZ Adaptation
- Track user history: sessions, diagnoses, exercises assigned/completed, improvement deltas
- Pattern detection: chronic constraint failures, exercise effectiveness, gate progression
- Gate movement tracking: is user progressing through gates over time?

---

## Library Recommendations

**Custom TypeScript classes (RECOMMENDED):**
- VCM logic is domain-specific, sequential, evidence-based
- More maintainable, easier to explain to researchers, auditable, testable

**If ML-based adaptive thresholds needed later:**
- ml-cart (Classification and Regression Trees)
- @tensorflow/tfjs (neural decision paths)

**For rule engine approach:**
- json-rules-engine (business rule engine with JSON DSL)
- ts-pattern (exhaustive pattern matching for TypeScript)

---

## Implementation Checklist

- [ ] Serverless diagnostic function (Vercel Edge)
- [ ] Weighted scoring per constraint (weights in config for tuning)
- [ ] Sequential gate evaluation (stop at first failure)
- [ ] Root cause signature matching (decision matrix)
- [ ] Exercise database with constraint→exercise mapping
- [ ] User history schema in Postgres/Supabase
- [ ] Pattern detection queries (chronic failures, exercise effectiveness)
- [ ] Diagnostic versioning (track which algorithm version ran)
- [ ] Confidence intervals (flag low-confidence for review)
- [ ] A/B test harness (compare diagnostic algorithms)
