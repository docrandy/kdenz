# Requirements

**Project:** VoiceLab (Kdenz)

## v3.0 — Generic Drill Engine

**Defined:** 2026-02-17
**Core Value:** Users practice negotiation and communication techniques through data-driven drills with immediate, structured feedback and mastery progression.
**Scope:** Prompt-Response format, 8 Tier A techniques, Rules + LLM evaluation, localStorage persistence.

### Drill Engine Core

- [ ] **ENG-01**: User can practice any seeded technique via Prompt-Response drill (see scenario, type response, submit)
- [ ] **ENG-02**: Engine renders drills from technique/scenario data — no hardcoded UI per technique
- [ ] **ENG-03**: User receives a random scenario from the technique's scenario pool each drill round
- [ ] **ENG-04**: User sees immediate feedback after each attempt with per-dimension score breakdown and text explanation
- [ ] **ENG-05**: User can do multiple drill rounds in a session (next scenario after feedback review)

### Technique Data

- [ ] **TDM-01**: 8 Tier A techniques seeded with full metadata (name, framework, skill_type, syntax_template, drill_tier, evaluation_method)
- [ ] **TDM-02**: Each technique has 5+ drill scenarios with prompt text, correct syntax pattern, and model answer
- [ ] **TDM-03**: Technique records include supported_formats and primary_format fields (extensible for future formats)

### Scoring & Evaluation

- [ ] **SCR-01**: Form dimension scored via rules-based evaluation (regex/pattern matching against syntax template)
- [ ] **SCR-02**: Accuracy and Impact dimensions scored via Gemini LLM with structured rubric per technique
- [ ] **SCR-03**: Each attempt records 4-dimension scores (Form 0.25, Accuracy 0.35, Impact 0.30, Timing 0.10) plus weighted composite
- [ ] **SCR-04**: Evaluation gracefully degrades if LLM unavailable (Form score shown, Accuracy/Impact marked as pending)

### Mastery Tracking

- [ ] **MAS-01**: User sees mastery level (0-4: Not Started, Attempted, Familiar, Proficient, Mastered) per technique
- [ ] **MAS-02**: System tracks consecutive correct attempts and total attempts per technique
- [ ] **MAS-03**: Simple interval scheduling shows when each technique is due for review (3 interval tables by skill_type)
- [ ] **MAS-04**: Skills Lab shows review queue — techniques due for practice highlighted

### Skills Lab Integration

- [ ] **INT-01**: Skills Lab page lists all 8 seeded techniques with mastery level indicators and practice count
- [ ] **INT-02**: User taps technique to see detail view (description, syntax template, mastery stats, attempt history)
- [ ] **INT-03**: User launches Prompt-Response drill from technique detail view
- [ ] **INT-04**: Existing labeling and accusation audit drills remain accessible alongside engine-driven drills

## Future Requirements (v3.1+)

### Additional Formats
- Multiple-Choice recognition drills (Format 3)
- Rewrite exercises (Format 4)
- Spot-the-Technique transcript analysis (Format 5)
- Audio-Spoken response drills (Format 2, requires Hume integration)

### Expanded Technique Pool
- Remaining Tier A techniques (Vocal Tonality, FM DJ Voice — require Hume)
- Tier C techniques (Calibrated Questions, Tactical Empathy, etc.)
- Tier B recognition-only drills

### Advanced Mastery
- HLR algorithm upgrade (replace simple intervals when sufficient data)
- Progressive format escalation for retention checks
- Implicit practice credit for prerequisite skills
- Simulation unlock thresholds (rep count gates)

### Migration
- Migrate labeling drill to engine format
- Migrate accusation audit drill to engine format

## Out of Scope

| Feature | Reason |
|---------|--------|
| Supabase persistence | Separate Phase A item — localStorage for now |
| Simulation Studio integration | Phase C — build after drill engine is proven |
| Hume audio analysis | Phase D — Format 2 drills blocked on backend proxy |
| VCM diagnostic integration | Phase D — behavioral event logging deferred |
| Skill prerequisites / DAG | v3.1 — only 8 techniques, no prerequisite complexity needed yet |
| Tier gating / progression | v3.1 — all 8 are same tier (A), gating not meaningful yet |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| TDM-01 | Phase 19 | Complete |
| TDM-02 | Phase 19 | Complete |
| TDM-03 | Phase 19 | Complete |
| ENG-01 | Phase 20 | Pending |
| ENG-02 | Phase 20 | Pending |
| ENG-03 | Phase 20 | Pending |
| ENG-04 | Phase 20 | Pending |
| ENG-05 | Phase 20 | Pending |
| SCR-01 | Phase 20 | Pending |
| SCR-02 | Phase 20 | Pending |
| SCR-03 | Phase 20 | Pending |
| SCR-04 | Phase 20 | Pending |
| MAS-01 | Phase 21 | Pending |
| MAS-02 | Phase 21 | Pending |
| MAS-03 | Phase 21 | Pending |
| MAS-04 | Phase 21 | Pending |
| INT-01 | Phase 22 | Pending |
| INT-02 | Phase 22 | Pending |
| INT-03 | Phase 22 | Pending |
| INT-04 | Phase 22 | Pending |

**Coverage:**
- v3.0 requirements: 20 total
- Mapped to phases: 20/20
- Unmapped: 0

---

## v2.0 — Dark Premium Transformation (COMPLETE)

<details>
<summary>44 requirements — all complete</summary>

### Design System Foundation (Wave 1)
- [x] **DS-01**: Tailwind config updated with dark premium color palette
- [x] **DS-02**: CSS custom properties defined for all semantic tokens
- [x] **DS-03**: Typography scale defined (Cormorant Garamond + Outfit)
- [x] **DS-04**: Spacing system established (4px/8px/12px/16px/24px)
- [x] **DS-05**: Component variants for dark mode
- [x] **DS-06**: index.css updated with base styles

### Color Migration (Wave 2)
- [x] **CM-01** through **CM-06**: All colors migrated, build verified

### SessionOrb Redesign (Wave 3)
- [x] **ORB-01** through **ORB-07**: Gold gradient, animated rings, volume-responsive, mobile-ready

### Typography & Layout (Wave 4)
- [x] **TYP-01** through **TYP-06**, **LAY-01** through **LAY-03**: Fonts, scale, spacing, layout complete

### New Screens (Waves 5-6)
- [x] **SCR-01** through **SCR-06**: Core flow screens complete
- [x] **SCR-07** through **SCR-12**: Advanced screens complete

### Visual Consistency
- [x] **VIS-01** through **VIS-06**: Gold accent, dark backgrounds, cream text, status colors, consistent spacing

</details>

---
*Requirements defined: 2026-02-12 (v2.0), 2026-02-17 (v3.0)*
*Last updated: 2026-02-17 — v3.0 traceability updated (20/20 requirements mapped to phases 19-22)*
