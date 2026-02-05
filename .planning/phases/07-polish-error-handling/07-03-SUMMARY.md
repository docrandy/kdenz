---
phase: 07-polish-error-handling
plan: 03
subsystem: tooling
tags: [typescript, linting, copy-validation, language-boundaries, cli-tools]

# Dependency graph
requires:
  - phase: foundation
    provides: Language boundaries documentation (language-boundaries-v1.md)
provides:
  - Copy-lint script for language boundary enforcement
  - Automated scanning for banned words in codebase
  - npm script for easy execution
affects: [08-compliance, ongoing-copy-review]

# Tech tracking
tech-stack:
  added: [tsx]
  patterns: [cli-scripts, copy-validation, foundation-compliance]

key-files:
  created:
    - scripts/copy-lint.ts
  modified:
    - package.json
    - package-lock.json

key-decisions:
  - "Use regex-based scanning (no AST) for MVP simplicity"
  - "Exit code 1 for violations enables CI/CD integration"
  - "Context-aware detection: whole words only, ignore code comments"

patterns-established:
  - "CLI scripts in scripts/ directory with tsx execution"
  - "Foundation doc enforcement via automated tooling"

# Metrics
duration: 8min
completed: 2026-02-05
---

# Phase 07 Plan 03: Copy-Lint Tool Summary

**Automated language boundary enforcement via CLI script detecting 35+ banned words from foundation docs with actionable violation reporting**

## Performance

- **Duration:** 8 minutes
- **Started:** 2026-02-05T21:29:02Z
- **Completed:** 2026-02-05T21:37:07Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Copy-lint script scans all TSX/TS files for language boundary violations
- Detects 35+ banned words across 4 categories (Diagnostic, Psychological, Judgment, Accuracy Overreach)
- Reports violations with file path, line number, and suggested alternatives
- npm run copy-lint provides easy execution for developers
- Initial scan: 0 violations found (codebase clean)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create copy-lint script** - `e35bf35` (feat)
2. **Task 2: Add npm script and run initial scan** - `63936f3` (feat - bundled with prior work)

_Note: Task 2 package.json changes were committed as part of 63936f3 by concurrent process. tsx dependency and npm script verified present and functional._

## Files Created/Modified
- `scripts/copy-lint.ts` - 206 lines, scans for banned words with context-aware detection
- `package.json` - Added copy-lint npm script and tsx dev dependency
- `package-lock.json` - Added tsx and dependencies

## Decisions Made

**1. Regex-based scanning instead of AST parsing**
- Rationale: Simpler, faster, sufficient for banned word detection
- Tradeoff: Less precise context awareness but acceptable for MVP

**2. Exit code 1 for violations**
- Rationale: Enables CI/CD integration and git pre-commit hooks
- Benefit: Enforces language boundaries automatically

**3. Whole word matching with word boundaries**
- Rationale: Prevents false positives (e.g., "good" in "GoodComponent")
- Implementation: Uses `\b` regex boundary markers

**4. Comment filtering**
- Rationale: Allow technical discussion in code comments
- Implementation: Strip single/multi-line comments before scanning

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**1. tsx not installed initially**
- Problem: npm run copy-lint failed - tsx not recognized
- Solution: Installed tsx as dev dependency via npm install --save-dev tsx
- Resolution: Script now executes successfully

**2. Task 2 commit already present**
- Situation: package.json/package-lock.json changes were committed in 63936f3 by concurrent process
- Verification: Confirmed copy-lint script and tsx dependency present in HEAD
- Result: Task 2 work complete, no duplicate commit needed

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

**Ready for:**
- Phase 08 compliance checks (can integrate copy-lint into CI)
- Ongoing copy review (developers can run npm run copy-lint locally)
- Pre-commit hook integration (future enhancement)

**Notes:**
- Current codebase has 0 violations (91 TS/TSX files scanned)
- Script covers all banned words from language-boundaries-v1.md
- Suggested alternatives provided for each violation

---
*Phase: 07-polish-error-handling*
*Completed: 2026-02-05*
