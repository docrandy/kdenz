# Documentation Registry

**Read this file FIRST** to find relevant documents. Every file in the docs system is listed here with a one-line summary so you can quickly decide what to read.

---

## How This System Works

### Tiers

| Tier | Meaning | Mutability |
|------|---------|------------|
| **Foundation** | Locked decisions. Apply everywhere, always. | Immutable once set. |
| **Scoped** | Decisions locked to a specific context (e.g., a particular avatar, feature). Other contexts remain open. | Fixed per scope, open globally. |
| **Evolving** | Active research, options under evaluation. Not yet decided. | Mutable until promoted to Foundation. |

### Folder Structure

```
docs/
├── REGISTRY.md              # This file -- master index
├── _inbox/                  # Drop zone for new files (any format)
│   └── inbox-scanner.ps1    # Scan script -- detects new files
├── log/                     # Processing records
│   ├── intake_log.txt       # Append-only log of all intake activity
│   └── pending.json         # Machine-readable manifest for Claude
├── foundation/              # Tier 1: Locked decisions
│   ├── copy/                # Language, tone, word rules
│   ├── product/             # Core product decisions
│   └── brand/               # Locked brand decisions
├── scoped/                  # Tier 2: Context-specific decisions
│   ├── avatars/
│   ├── features/
│   └── personas/
├── evolving/                # Tier 3: Active research, not yet decided
│   ├── research/
│   ├── branding/
│   ├── competitors/
│   └── product/
├── beta-testing/            # Beta testing materials
└── archive/                 # Superseded versions and originals
```

### How to Add New Files

1. **Drop** any file (.md, .txt, .pdf, .docx) into `_inbox/`
2. **Scan** -- run `_inbox/inbox-scanner.ps1` (or tell Claude "process inbox")
3. **Process** -- Claude reads the file, categorizes it, breaks it into topics if needed, and files each piece into the correct tier folder with proper headers
4. **Log** -- every action is recorded in `log/intake_log.txt`; file status tracked in `log/pending.json`
5. **Archive** -- the original is moved to `archive/` with an INBOX date stamp

### File Conventions

- **Naming:** `descriptive-name-v1.md` (descriptive, lowercase, hyphenated)
- **Versioning:** New version = `descriptive-name-v2.md`. Previous version moves to `archive/`.
- **Header:** Every file starts with a metadata block (Tier, Status, Version, Source, Summary).
- **Promotion:** Evolving files that get decided move to `foundation/` as a fresh v1. Old file goes to `archive/`.

---

## Foundation (Immutable Decisions)

### Product Rules

| File | Summary | Version | Added |
|------|---------|---------|-------|
| [core-principles-v1.md](foundation/product/core-principles-v1.md) | Five non-negotiable principles: descriptive not diagnostic, baseline-anchored, show uncertainty, measure bias, user control. | v1 | 2026-02-04 |
| [marketing-and-sales-guardrails-v1.md](foundation/product/marketing-and-sales-guardrails-v1.md) | Allowed positioning statements and statements to avoid in all external-facing content. | v1 | 2026-02-04 |
| [in-app-tone-and-talk-tracks-v1.md](foundation/product/in-app-tone-and-talk-tracks-v1.md) | How the product communicates: in-app voice, sales pitch framing, support responses. | v1 | 2026-02-04 |
| [language-boundaries-v1.md](foundation/product/language-boundaries-v1.md) | Hard-banned words and phrases: diagnostic terms, psychological attribution, judgment/prescriptive language. | v1 | 2026-02-04 |

### VCM Framework (Volitional Control Model)

| File | Summary | Version | Added |
|------|---------|---------|-------|
| [philosophical-frameworks-autonomy-heteronomy.md](foundation/philosophical-frameworks-autonomy-heteronomy.md) | Comprehensive analysis of 5 philosophical frameworks (Frankfurt, SDT, Fischer & Ravizza, Berlin, Coercion Theory) for distinguishing autonomous vs heteronomous action. | v1 | 2026-02-10 |
| [C0-C3-philosophical-boundary-criteria.md](foundation/C0-C3-philosophical-boundary-criteria.md) | Actionable 5-criterion algorithm for classifying C0 (Environmental Friction) vs C3 (Heteronomous Action): Source, Mechanism, Reasons-responsiveness, Autonomy, Will-overbearing. | v1 | 2026-02-10 |
| [VCM-C0-C3-refinement-recommendations.md](foundation/VCM-C0-C3-refinement-recommendations.md) | Specific VCM framework refinements based on philosophical research: updated definitions, classification protocol, implementation roadmap, special categories (C3-derived). | v1 | 2026-02-10 |
| [philosophical-research-executive-summary.md](foundation/philosophical-research-executive-summary.md) | Executive overview of philosophical validation for VCM C0/C3 boundary: key findings, convergent frameworks, three critical refinements, implementation roadmap. | v1 | 2026-02-10 |
| [C0-C3-quick-reference-guide.md](foundation/C0-C3-quick-reference-guide.md) | Practitioner's rapid classification tool: one-question test, five-question protocol, decision tree, common patterns, examples, printable reference card. | v1 | 2026-02-10 |

### Copy Rules

| File | Summary | Version | Added |
|------|---------|---------|-------|
| [claim-taxonomy-safe-risky-forbidden-v1.md](foundation/copy/claim-taxonomy-safe-risky-forbidden-v1.md) | Three-tier classification: SAFE (descriptive), RISKY (needs proof), FORBIDDEN (never use). | v1 | 2026-02-04 |
| [rewrite-recipes-risky-to-safe-copy-v1.md](foundation/copy/rewrite-recipes-risky-to-safe-copy-v1.md) | Four patterns for rewriting risky/forbidden claims into safe, descriptive language. | v1 | 2026-02-04 |
| [metric-card-templates-v1.md](foundation/copy/metric-card-templates-v1.md) | Ready-to-paste UI templates for speech rate, fillers, pauses, pitch, and transcript confidence cards. | v1 | 2026-02-04 |
| [consent-and-onboarding-copy-v1.md](foundation/copy/consent-and-onboarding-copy-v1.md) | Consent/disclosure modal copy and baseline session instructions. | v1 | 2026-02-04 |
| [user-controls-and-opt-out-copy-v1.md](foundation/copy/user-controls-and-opt-out-copy-v1.md) | Toggle, deletion, and opt-out language. Includes experimental feature disclosure template. | v1 | 2026-02-04 |
| [audio-quality-warning-messages-v1.md](foundation/copy/audio-quality-warning-messages-v1.md) | Standard warnings for noise, low confidence, overlap, and clipping. | v1 | 2026-02-04 |

### Brand

| File | Summary | Version | Added |
|------|---------|---------|-------|
| [design-system-v1.md](foundation/brand/design-system-v1.md) | "The Executive Presence" -- color palette (Deep Navy, Electric Blue, Signal Green, Warm Amber), Inter + SF Mono typography, design principles. | v1 | 2026-02-04 |

---

## Scoped (Context-Specific Decisions)

*(No files yet. Context-specific decisions (avatars, features, personas) will be added here.)*

---

## Evolving (Under Evaluation)

### Product

| File | Summary | Status | Version | Added |
|------|---------|--------|---------|-------|
| [feature-scope-and-engineering-plan-v1.md](evolving/product/feature-scope-and-engineering-plan-v1.md) | v1 feature set, baseline-first UX, engineering architecture, validation workflow, next steps. | OPEN | v1 | 2026-02-04 |
| [policy-and-governance-plan-v1.md](evolving/product/policy-and-governance-plan-v1.md) | FTC substantiation, EU compliance, bias testing, user dispute process requirements. | OPEN | v1 | 2026-02-04 |
| [master-product-brief-v1.md](evolving/product/master-product-brief-v1.md) | Product vision, ICP (job seekers vs managers), product flow, technical constraints, open questions, success criteria. | OPEN | v1 | 2026-02-04 |
| [strategic-recommendations-v1.md](evolving/product/strategic-recommendations-v1.md) | 3-phase MVP roadmap, UX best practices, monetization tiers (free/premium/coaching/B2B), GTM strategy, success metrics. | OPEN | v1 | 2026-02-04 |
| [validation-study-design (in validation-standards)](evolving/research/validation-standards-and-study-design-v1.md) | 4-phase validation protocol (internal -> user research -> extended -> independent audit). | OPEN | v1 | 2026-02-04 |

### Research

| File | Summary | Status | Version | Added |
|------|---------|--------|---------|-------|
| [research-synthesis-overview-v1.md](evolving/research/research-synthesis-overview-v1.md) | Meta-index of 16,000+ word research across 8 domains. Maps to topic-specific files. 7 key strategic insights. | OPEN | v1 | 2026-02-04 |
| [icp-validation-and-positioning-v1.md](evolving/research/icp-validation-and-positioning-v1.md) | ICP comparison: early-career managers vs job seekers. Positioning strategy, validated decisions. | OPEN | v1 | 2026-02-04 |
| [gtm-derisking-exec-summary-v1.md](evolving/research/gtm-derisking-exec-summary-v1.md) | 6 unvalidated assumptions, 14-day plan for 5 critical decisions, $999 budget, kill criteria. | OPEN | v1 | 2026-02-04 |
| [gtm-derisking-plan-v1.md](evolving/research/gtm-derisking-plan-v1.md) | Full 2-week GTM de-risk: 8 assumptions to stop using, 30-min interview script, B2B discovery, pricing hypothesis, traps. | OPEN | v1 | 2026-02-04 |
| [research-gaps-tracker-v1.md](evolving/research/research-gaps-tracker-v1.md) | 15 prioritized research gaps (CRITICAL/HIGH/MEDIUM/LOW) with methods, success metrics, kill criteria. | OPEN | v1 | 2026-02-04 |
| [speech-signal-processing-browser-v1.md](evolving/research/speech-signal-processing-browser-v1.md) | Filler detection (KWS vs ASR hybrid), pause classification, prosody analysis, real-time vs post-session framework, browser tech stack. | OPEN | v1 | 2026-02-04 |
| [transfer-of-practice-evidence-v1.md](evolving/research/transfer-of-practice-evidence-v1.md) | 5 transfer failure modes, 7 enabling conditions ranked by effect size (d=0.25-0.6), behavioral markers. | OPEN | v1 | 2026-02-04 |
| [validation-standards-and-study-design-v1.md](evolving/research/validation-standards-and-study-design-v1.md) | Accuracy benchmarks per metric (ASR, filler, pause, pitch), pre-deployment checklists, 4-phase validation protocol. | OPEN | v1 | 2026-02-04 |
| [bias-risks-and-mitigation-v1.md](evolving/research/bias-risks-and-mitigation-v1.md) | Demographic accuracy gaps (non-native 15-40pp, gender, age, neurodivergent), bias risk table with severity/mitigation, personal baselining. | OPEN | v1 | 2026-02-04 |
| [behavior-change-and-feedback-psychology-v1.md](evolving/research/behavior-change-and-feedback-psychology-v1.md) | GAIN framework, growth mindset, psychological safety, volitional diagnostics (3 gaps), dropout prevention. | OPEN | v1 | 2026-02-04 |

### Branding

*(No files yet. Branding options under evaluation will be added here.)*

### Competitors

| File | Summary | Status | Version | Added |
|------|---------|--------|---------|-------|
| [competitor-analysis-v1.md](evolving/competitors/competitor-analysis-v1.md) | Yoodli, Orai, Poised, Speeko: strengths, weaknesses, market gaps, UX mistakes to avoid, positioning options. | OPEN | v1 | 2026-02-04 |

---

## Beta Testing

| File | Summary | Version | Added |
|------|---------|---------|-------|
| [beta-tester-interview-script-v1.md](beta-testing/beta-tester-interview-script-v1.md) | 4-question interview script for validating WTP, messaging, pattern recognition, and retention blockers. | v1 | 2026-02-04 |

---

## Archive

| File | Reason | Archived |
|------|--------|----------|
| Claim-Safe_Copy_Library_and_SaaS_Action_Plan-ORIGINAL.docx | Original source document, broken down into 11 topic-specific files. | 2026-02-04 |
| Beta-Tester-Interview-Script-ORIGINAL.md | Original file before standardization to new naming/header format. | 2026-02-04 |
| ICP-Validation-Positioning-Strategy-INBOX-20260204.pdf | Processed into evolving/research/icp-validation-and-positioning-v1.md | 2026-02-04 |
| Kdenz Master project brief-INBOX-20260204.pdf | Split into 3 files: foundation/brand/design-system, foundation/product/language-boundaries, evolving/product/master-product-brief | 2026-02-04 |
| kdenz-complete-plan-INBOX-20260204.pdf | Processed into evolving/research/gtm-derisking-plan-v1.md | 2026-02-04 |
| kdenz-exec-summary-INBOX-20260204.pdf | Processed into evolving/research/gtm-derisking-exec-summary-v1.md | 2026-02-04 |
| kdenz-research-gaps-INBOX-20260204.pdf | Processed into evolving/research/research-gaps-tracker-v1.md | 2026-02-04 |
| Real-Time Speech & Voice Signal Processing-INBOX-20260204.pdf | Processed into evolving/research/speech-signal-processing-browser-v1.md | 2026-02-04 |
| Real-Time Speech & Voice Signal Processing 1-INBOX-20260204.pdf | DUPLICATE of above. Archived only. | 2026-02-04 |
| Transfer of Practice-INBOX-20260204.pdf | Processed into evolving/research/transfer-of-practice-evidence-v1.md | 2026-02-04 |
| Validation Methodologies-INBOX-20260204.pdf | Split into 2 files: validation-standards-and-study-design, bias-risks-and-mitigation (claim sections already in foundation/copy) | 2026-02-04 |
| Speak app RESEARCH SYNTHESIS-INBOX-20260204.pdf | Split into 4 files: research-synthesis-overview, competitor-analysis, strategic-recommendations, behavior-change-and-feedback-psychology | 2026-02-04 |
