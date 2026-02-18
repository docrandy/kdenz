# Phase 19 Context: Technique Data Foundation

**Created:** 2026-02-17
**Status:** Ready for Research & Planning
**Phase Goal:** All 8 Tier A techniques and their drill scenarios exist as structured data that the drill engine can consume.

---

## Locked Decisions

### 1. Data Schema & TypeScript Types

**Decision: Flat structure with ID-keyed techniques, include all format fields (activate only prompt-response in v3.0)**

#### Technique Shape
```typescript
type Technique = {
  id: string // human-readable slug: 'mirroring', 'labeling', 'open-ended-question', etc.
  name: string
  description: string
  framework: 'Voss' | 'MI' | 'CBT' | 'NVC'
  tier: 'A' | 'B' | 'C'
  skill_type: 'syntax' | 'judgment' | 'recognition'

  // Drill engine routing
  primary_format: 'prompt-response' // only format in v3.0
  supported_formats: string[] // future: ['prompt-response', 'multiple-choice', 'audio-spoken', 'rewrite', 'spot-the-technique']

  // Syntax validation for form scoring
  syntax_template: string // human-readable e.g. "Back of [emotion/observation]"
  syntax_rules: SyntaxRule[]

  // Mastery & prerequisites (add now, used in Phase 21+)
  prerequisites?: string[] // technique IDs that should be learned first
  difficulty?: number // 1-3 scale
}

type SyntaxRule = {
  id: string // 'stem-match', 'negation-check', 'structure-match'
  type: 'regex' | 'negation' | 'inclusion'
  pattern: string // regex pattern or literal string
  examples?: string[] // 2-3 correct examples (what to do) or negative examples (what NOT to do)
  weight?: number // 0-1, contribution to form score (default: 1.0)
}
```

#### Why This Shape
- **Flat array** — drill engine doesn't care about framework; easier to iterate over all 8
- **Human-readable IDs** — debuggable, referenceable in routes, less verbose in JSON
- **Include all format fields now** — Phase 20+ can activate new formats without schema changes
- **Syntax rules as objects** — enables per-rule weighting, examples, and maintainability vs raw regex strings

#### 8 Tier A Techniques (v3.0 Seed List)
1. Mirroring
2. Labeling
3. Open-Ended Questions
4. I-Statements
5. No-Oriented Questions
6. NVC Observation
7. NVC Feeling
8. Contrasting

---

### 2. Syntax Pattern Representation

**Decision: Hybrid rules + regex system with binary form scoring; negation rules block score**

#### Rules Structure
- **Regex rules** (type: `'regex'`): Direct pattern match. E.g., Mirroring: `^(Back of|Sounds like|Seems like)\s+`
- **Negation rules** (type: `'negation'`): Forbidden patterns. If matched, form score = 0. E.g., Open-Ended Question: `^(will|did|do|can|would|should|is|are|have)`
- **Inclusion rules** (type: `'inclusion'`): Required patterns. If found, contributes to pass. E.g., Open-Ended Question: `(what|how|why|when|where|tell me)`

#### Form Scoring Logic
- **Binary scale:** 0 or 1 (no partial credit in v3.0)
- **Negation** — If any negation rule matches, form = 0 (fail immediately)
- **Positive match** — If 50%+ of weighted regex/inclusion rules match, form = 1
- **Fallback** — If no rules match clearly, form = 0

#### Examples Per Rule
Each syntax rule includes 2-3 examples of correct/incorrect responses so the drill UI can show them when form scores are low.

```typescript
{
  id: 'open-ended-question',
  syntax_rules: [
    {
      id: 'no-yes-no',
      type: 'negation',
      pattern: '^(will|did|do|can|would|should|is|are|have)',
      examples: [
        '❌ Will you help me?',
        '❌ Did you consider the timeline?'
      ]
    },
    {
      id: 'open-stem',
      type: 'inclusion',
      pattern: '(what|how|why|when|where|tell me)',
      examples: [
        '✓ What would make this work?',
        '✓ How do you see that playing out?'
      ]
    }
  ]
}
```

---

### 3. Scenario Data Source

**Decision: Extract from LABELING_LESSON_CURRICULUM.md where possible; single TypeScript file (`src/data/drill-scenarios.ts`); add difficulty_level; defer domain/mood to Phase 23+**

#### Scenario Shape
```typescript
type Scenario = {
  id: string // 'mirror-1', 'mirror-2', 'label-1', etc.
  technique_id: string // references Technique.id
  prompt: string // the user sees this; e.g., "Customer: 'I feel unheard.' Respond using mirroring."
  syntax_template: string // e.g., "Back of [emotion/observation]"
  model_answer: string // exemplar response for evaluation
  difficulty_level: number // 1-3 scale
  evaluation_notes?: string // guidance for LLM evaluator (Phase 20+)
  context_tags?: string[] // future: ['sales', 'support', 'negotiation'] — defer to Phase 23
  counterpart_mood?: string // future: 'cooperative', 'frustrated', 'deceptive' — for simulation, defer
}
```

#### Data Organization
- **File location:** `src/data/drill-scenarios.ts`
- **Structure:** Single exported object `drillScenarios: Record<string, Scenario[]>` keyed by technique_id
- **Completeness:** 5 scenarios per technique = 40 total scenarios in v3.0

```typescript
export const drillScenarios: Record<string, Scenario[]> = {
  mirroring: [
    {
      id: 'mirror-1',
      technique_id: 'mirroring',
      prompt: '...',
      syntax_template: 'Back of [emotion/observation]',
      model_answer: 'Back of feeling like you\'re not being heard.',
      difficulty_level: 1,
      evaluation_notes: 'User should capture the emotional core using the "Back of" stem.'
    },
    // ... 4 more
  ],
  labeling: [
    // ... 5 scenarios
  ],
  // ... 8 techniques total
}
```

#### Sourcing Strategy
- **Extract from LABELING_LESSON_CURRICULUM.md** (user's existing curriculum) for labeling + accusation audit where scenarios exist
- **Write new scenarios** for the remaining 6 techniques, tailored to their syntax rules
- **All scenarios at difficulty 1-2 for v3.0** (save advanced scenarios for v3.1+)

#### Future Extension (Not Phase 19)
- Phase 23+ will add `context_tags` and `counterpart_mood` to enable domain-specific and simulation-ready scenarios
- Phase 25+ (Institute) will add learning objectives and instructor notes

---

### 4. localStorage Persistence Structure

**Decision: Single `kdenz:drill-data` key; scenarios keyed by technique ID; include version field; Phase 21 adds userProgress in same object**

#### Structure
```typescript
interface DrillDataStore {
  version: string // '3.0' — enables migrations in Phase 20+
  techniques: Record<string, Technique> // keyed by technique.id
  scenarios: Record<string, Scenario[]> // keyed by technique_id
  // Phase 21 will add:
  // userProgress?: Record<string, UserTechniqueProgress>
}

// Example shape in localStorage:
localStorage['kdenz:drill-data'] = {
  "version": "3.0",
  "techniques": {
    "mirroring": { id: "mirroring", name: "Mirroring", ... },
    "labeling": { id: "labeling", name: "Labeling", ... },
    // ... 8 total
  },
  "scenarios": {
    "mirroring": [
      { id: "mirror-1", prompt: "...", model_answer: "...", ... },
      // ... 4 more
    ],
    "labeling": [
      // ... 5 scenarios
    ],
    // ... 8 techniques total
  }
}
```

#### Why This Structure
- **Single key** — Simpler to initialize, load, and version
- **Technique-keyed scenarios** — O(1) lookup: `scenarios[techniqueId]` vs O(n) filter
- **Version field** — Enables schema migrations: When Phase 20 adds fields, increment to "3.1" and add migration logic
- **Extensible** — Phase 21 adds `userProgress` in same object without restructuring

#### Initialization (Phase 19)
- On app load, check if `kdenz:drill-data` exists
- If not, initialize with seeded techniques + scenarios
- If exists, validate version (add migration logic in Phase 20)

#### Phase 21 Integration (Not Phase 19)
When Phase 21 adds mastery tracking, the userProgress key will live in the same object:

```typescript
interface DrillDataStore {
  version: string
  techniques: Record<string, Technique>
  scenarios: Record<string, Scenario[]>
  userProgress: Record<string, {
    attempts: number
    mastery: 'not-started' | 'attempted' | 'familiar' | 'proficient' | 'mastered'
    streak: number
    nextReview: string // ISO date
    scores: { form: number; accuracy: number; impact: number }[]
  }>
}
```

---

## Success Criteria (Phase 19)

✅ **All 8 Tier A techniques** exist in structured data with:
- Immutable ID, name, description, framework, tier, skill_type
- primary_format = 'prompt-response', supported_formats includes future formats
- syntax_template and syntax_rules (regex, negation, inclusion patterns with examples)
- Optional prerequisites and difficulty fields

✅ **All 40 scenarios** (5 per technique) exist with:
- Unique ID, technique_id reference, prompt, syntax_template, model_answer
- difficulty_level assigned (1-2 for v3.0)
- evaluation_notes for LLM evaluator

✅ **TypeScript types** for Technique, Scenario, SyntaxRule, DrillDataStore defined and exported

✅ **localStorage seeding** works: On first load, DrillDataStore is initialized in localStorage with full data

✅ **No regression:** Existing labeling and accusation audit drills still work (INT-04 constraint)

---

## Implementation Scope (Locked Boundaries)

### IN SCOPE (Phase 19)
- Define TypeScript interfaces/types
- Seed 40 scenarios + extract from LABELING_LESSON_CURRICULUM.md
- Create `src/data/drill-scenarios.ts` with all data
- Implement localStorage initialization logic
- Document syntax rules per technique

### OUT OF SCOPE (Deferred)
- Drill UI/UX (Phase 20)
- Scoring engine (Phase 20)
- Mastery tracking logic (Phase 21)
- Institute content (Phase 25+)
- Simulation-specific fields like counterpart_mood (Phase 23+)
- Supabase integration (deferred beyond v3.0)

---

## Dependencies & Blockers

**Dependencies:**
- None (foundation phase)

**Blockers:**
- None

**Reference Materials:**
- `.planning/research/LABELING_LESSON_CURRICULUM.md` — existing labeling curriculum for scenario extraction
- `.planning/research/R8_COMPLETE_TECHNIQUE_TAXONOMY.md` — technique taxonomy reference
- `.planning/research/R5_CONVERSATION_QUALITY_EVALUATION.md` — 4-dimension rubric reference
- CLAUDE.md D8, D2, STATE.md — locked decisions on generic engine, design, skill types

---

## Ready for Research & Planning

This context file locks implementation decisions. Downstream agents (research and planner) can now:
1. Extract existing scenarios from curriculum documents
2. Write new scenarios for the 6 other techniques
3. Finalize syntax patterns and rules
4. Plan localStorage initialization
5. Execute Phase 19 without asking user for clarification

**Next Step:** Route to `/gsd:plan-phase 19` to create the detailed execution plan.

---

*Phase 19 Context created: 2026-02-17 by discussion*
