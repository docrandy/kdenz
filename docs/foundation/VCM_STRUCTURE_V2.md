# VCM Structure V2

**Version:** 2.0
**Date:** 2026-02-14
**Status:** Active

## Volitional Chain Sequence

The VCM organizes volitional failure into **9 sequential gates** (C1 → C2 → C3 → C4 → C5 → C6 → C7 → C8A → C8B). Each gate represents a constraint that must be satisfied for action to occur. If any gate reaches complete failure (zero activation), the chain breaks and no downstream gate can activate.

---

### Gate 1: C1 — Believability (7 causes)
**Neural System:** vmPFC expectancy (causal isolation)
**Core Question:** Do they believe it's achievable?

**Root Causes:**
- C1-1: Cognitive biases
- C1-2: Perceived fixed limitations
- C1-3: Lack of relatable success models
- C1-4: Recursive invalidation
- C1-5: Information scarcity
- UC: External discouragement
- UC: Fragile self-efficacy

---

### Gate 2: C2 — Desire (8 causes)
**Neural System:** VS/DA valuation (causal)
**Core Question:** Do they genuinely want it?

**Root Causes:**
- C2-1: Value misalignment
- C2-2: Suppression due to fear of change
- C2-4: Anti-desire reflex
- UC: External motivation
- UC: Competing comforts
- UC: Identity conflict
- UC: Nihilism/absence of meaning
- UC: Lack of future relevance

---

### Gate 3: C3 — Awareness (3 causes)
**Neural System:** Hippocampus retrieval (causal)
**Core Question:** Is the goal/need retrieved into conscious awareness right now?

**Root Causes:**
- AA-2: Emotional avoidance
- AA-5: Lack of clarity on next step
- AA-1: Rationalization loops (borderline, causal vmPFC)

---

### Gate 4: C4 — Attention (7 causes)
**Neural System:** dlPFC selection (causal)
**Core Question:** Are cognitive resources allocated toward this goal?

**Root Causes:**
- AA-3: Pre-action distraction
- AA-6: Distraction vulnerability
- AA-7: Low baseline energy
- AA-8: Value conflict
- AA-10: Environmental interference
- AA-4: Reverse inertia (gradient)
- AA-9: Plan selection freeze (gradient)

---

### Gate 5: C5 — Will (4 causes)
**Neural System:** ACC EVC (causal)
**Core Question:** Are they willing to bear the cost?

**Root Causes:**
- C3-1: Low baseline energy (overlap with AA-7)
- C3-2: Delayed gratification intolerance
- C3-3: Overwhelm by effort
- C3-4: Insufficient perceived reward

---

### Gate 6: C6 — Intention (2 causes)
**Neural System:** pre-SMA encoding (causal)
**Core Question:** Have they formed a concrete plan?

**Root Causes:**
- C4-1: Conflicting plans
- C4-2: Analysis paralysis (overlap with C8A)

---

### Gate 7: C7 — Commitment (3 causes)
**Neural System:** lPFC shielding (causal)
**Core Question:** Is their commitment robust against interference?

**Root Causes:**
- C5-1: Commitment contamination
- C5-3: Lack of accountability
- C5-4: Lack of meaningful consequence

---

### Gate 8A: C8A — Initiation (5 causes)
**Neural System:** SMA threshold (causal)
**Core Question:** Can they cross the motor threshold to start?

**Root Causes:**
- C6A-1: High activation cost
- C4-2: Analysis paralysis (overlap with C6)
- UC: Timing perfectionism
- UC: Situational blockage
- C6A-3: Pre-action distraction (overlap with AA-3)

---

### Gate 8B: C8B — Maintenance (3 causes)
**Neural System:** Dorsal striatum (causal)
**Core Question:** Can they sustain action through completion?

**Root Causes:**
- C6B-1: Task boredom
- C6B-3: Mood-dependent activation
- C6B-4: Micro-failure hypersensitivity

---

## Overlap Explanation

**Why multiple root causes can point to the same gate failure:**

Three root causes can trigger the same gate failure because they cause the same brain problem through different mechanisms.

### Example: "I got distracted and forgot my goal" → Gate C4 Attention

This phrase flags **3 different root causes** (all zero Attention via frontoparietal fail):

**AA-3: Pre-action distraction**
Phone popped up right before goal cue → amygdala hijack.

**AA-6: Distraction vulnerability**
Your brain is extra weak to distractions (low dlPFC strength).

**AA-10: Environmental interference**
Room setup/noise forced distraction (salient cues everywhere).

### Why 3 separate root causes?

Same symptom (distraction → Attention = 0), but **3 distinct mechanisms:**
- **Timing**: Pre-action (AA-3)
- **Trait**: Vulnerability (AA-6)
- **Setup**: Environment (AA-10)

### Diagnostic power:

The phrase "I got distracted" triggers a deeper probe:
**"Was it phone timing? Your weakness? Or room chaos?"** → exact cause identified.

### No problem:

The model handles multiple paths to the same zero. **Precision ↑**.

---

## Key Principles

### 1. Sequential Dependency
For behavior to occur, each gate must reach a sufficient activation threshold, and reaching that threshold depends on preceding gates having reached theirs first. The chain runs: C1 → C2 → C3 → C4 → C5 → C6 → C7 → C8A → C8B.

### 2. Zero Breaks the Chain
If any gate is at complete failure (zero activation), no downstream gate can activate to produce behavior. A person with zero belief (C1 = 0) cannot form genuine desire (C2), cannot assess cost-willingness (C5), and so on.

**Known Exception:** C1 (Believability) at zero may still allow action driven by curiosity or hope — this exception is under investigation.

### 3. First Failing Gate is the Bottleneck
The earliest gate that fails to reach threshold is the root cause of behavioral failure. A person may present as "unable to start" (C8A), but the actual block may be upstream — insufficient awareness (C3) or attention (C4). Targeting downstream symptoms without resolving the upstream block produces temporary compliance at best.

---

## Notation Guide

- **UC:** Uncategorized (pending validation or classification)
- **Overlap:** Root cause appears in multiple gates (e.g., "Low baseline energy" in both C4 and C5)
- **Gradient:** Failure mechanism operates on a continuum rather than discrete threshold
- **Causal:** Direct mechanistic link to neural system specified

---

## Changes from V1

**V1 → V2 Major Changes:**
1. Removed **C0 (Environmental Permeability)** from the main volitional chain as a pre-volitional screening gate
2. Inserted **C3 (Awareness)** and **C4 (Attention)** between Desire and Will
3. Renumbered all downstream gates: Will (C3→C5), Intention (C4→C6), Commitment (C5→C7), Initiation (C6A→C8A), Maintenance (C6B→C8B)
4. Introduced **AA-* prefix** for Awareness/Attention root causes
5. Total gates increased from 8 to 9 (or 7 to 9 if excluding C0)
6. Added explicit overlap documentation and diagnostic power explanation

---

## File Archive

- **V1 Archive:** `VCM_STRUCTURE_V1_ARCHIVE.md` (preserved for reference)
- **V2 Active:** This file (`VCM_STRUCTURE_V2.md`)

---

**Last Updated:** 2026-02-14
