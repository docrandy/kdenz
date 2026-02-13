# CSS Refactoring Roadmap

**Status:** Phase 1 Complete (2026-02-12)
**Owner:** @randy
**Last Updated:** 2026-02-12

---

## Overview

This document tracks the CSS architecture improvements for VoiceLab. The goal is to prevent orphaned stylesheets and establish a clear, scalable design system.

### The Problem (Solved in Phase 1)
Individual CSS imports in `main.tsx` created cascade unpredictability:
- Easy to forget importing a new stylesheet
- Hard to trace styling bugs (which file defines a rule?)
- Tailwind directives were scattered in `index.css`

### The Solution
**Phase 1** introduced `src/styles/design-system.css` as a **single entry point** that orchestrates the entire cascade. This is the contract file—one place that shows the complete import strategy.

---

## Phase 1: Foundation ✅ COMPLETE

**Completed:** 2026-02-12

### Changes
- Created `src/styles/design-system.css` with documented import order
- Updated `src/main.tsx` to import only `design-system.css`
- All CSS files remain unchanged; only imports reorganized

### Files Changed
```
src/main.tsx
src/styles/design-system.css (new)
```

### Cascade Order (Now Explicit)
1. `@tailwind base` — Tailwind reset
2. `variables.css` — Design tokens (colors, typography, spacing, shadows, motion)
3. `globals.css` — Global element styles (body, headings, links, forms)
4. `layout.css` — Layout primitives (shells, grids, containers)
5. `components.css` — Component overrides (cards, buttons, tables, sidebars)
6. `utilities.css` — Utility extensions (spacing, display, typography helpers)
7. `@tailwind components; @tailwind utilities;` — Tailwind's own utilities

### Benefits
✅ Single file shows entire style architecture
✅ New CSS always added to `design-system.css`, not scattered
✅ Cascade order is now explicit and auditable
✅ Tailwind directives in one place (no `index.css` orphaned)

---

## Phase 2: Guardrails (Post-MVP)

**Target:** After beta launch (post-PMF validation)
**Effort:** 5–15 min (pick ONE option)

### Goal
Add automation to catch orphaned CSS at edit time.

### Option A: ESLint Rule (Lightweight) ⭐ RECOMMENDED

Add to `.eslintrc.json`:
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["./styles/*.css", "!./styles/design-system.css"]
      }
    ]
  }
}
```

**Why this one:**
- 5-minute setup
- Catches mistakes at edit time (IDE warnings)
- No pre-commit overhead
- Solo developer workflow (discipline > automation)

**How it works:**
- Blocks imports like `import './styles/variables.css'` in any file
- Allows only `import './styles/design-system.css'`
- Red underline in VSCode if you try to import a banned file

### Option B: Pre-commit Hook (Bulletproof)

Create `.husky/pre-commit`:
```bash
#!/bin/sh
npm run lint:css
```

Add script to `package.json`:
```json
{
  "scripts": {
    "lint:css": "node scripts/lint-css-imports.js"
  }
}
```

Create `scripts/lint-css-imports.js`:
```javascript
const fs = require('fs');
const path = require('path');

const designSystemPath = path.join(__dirname, '../src/styles/design-system.css');
const designSystemContent = fs.readFileSync(designSystemPath, 'utf-8');

// Extract all imported filenames
const importedFiles = [...designSystemContent.matchAll(/@import ['"]\.\/(.+?)\.css['"]/g)].map(m => m[1]);

// Check all .css files in /styles/ are imported
const stylesDir = path.join(__dirname, '../src/styles');
const allCssFiles = fs.readdirSync(stylesDir)
  .filter(f => f.endsWith('.css') && f !== 'design-system.css')
  .map(f => f.replace('.css', ''));

const orphaned = allCssFiles.filter(f => !importedFiles.includes(f));

if (orphaned.length > 0) {
  console.error(`❌ Orphaned CSS files found: ${orphaned.join(', ')}`);
  console.error('   All .css files in src/styles/ must be imported in design-system.css');
  process.exit(1);
}

console.log('✅ All CSS files are properly imported');
```

**Why use this:**
- Prevents commits with orphaned CSS
- Runs every commit automatically
- Belt-and-suspenders for teams

**Why defer for solo dev:**
- Adds process overhead (commit hangs, need to fix and retry)
- ESLint rule is sufficient for one person
- Reserve for when you add collaborators

---

## Phase 3: Tailwind Consolidation (Post-MVP)

**Target:** Design System v1 (post-beta, post-PMF)
**Effort:** 2–3 weeks (ongoing refactoring)
**Complexity:** Medium (low risk, medium effort)

### Goal
Replace custom CSS with Tailwind utilities where possible. This is a gradual migration—**no rip-and-replace**.

### Current State
- `variables.css` — ✅ Essential, keep and expand
- `globals.css` — ✅ Keep, low utility class density
- `layout.css` — 🟡 Candidate for reduction (grids, spacing = Tailwind's sweet spot)
- `components.css` — 🟡 Keep, but shrink (move multi-state animations to Tailwind)
- `utilities.css` — 🟡 Audit slowly (`.u-m-md`, `.u-flex` can move to Tailwind `@apply`)

### Strategy

#### 3a. Expand `variables.css` → Tailwind Config
First, push design tokens into `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'surface-1': '#ffffff',
        'surface-2': '#f5f7fe',
        // ... rest of tokens
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        // ...
      },
      // Continue for shadows, radii, transitions
    }
  }
}
```

**Result:** Tailwind knows all design tokens; easy to use in JSX with `className="bg-surface-1 p-md shadow-sm"`.

#### 3b. Reduce `layout.css`
Replace grid/spacing helpers with Tailwind:

**Before** (layout.css):
```css
.layout-grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-lg);
}
```

**After** (Tailwind in JSX):
```jsx
<div className="grid grid-cols-3 gap-lg">
```

**Migration Path:**
1. Add tokens to Tailwind config (3b step above)
2. In each component, replace `.layout-grid--3` with `grid grid-cols-3 gap-lg`
3. Remove CSS utility once all usages are gone
4. Delete the class from `layout.css`

**Do this gradually—one page at a time.** No rush.

#### 3c. Shrink `components.css`
Keep only:
- Multi-state animations (e.g., sidebar collapse, modal slide-in)
- Third-party component overrides (if needed)

**Delete:**
- `.btn` variants (use Tailwind `btn-primary`, `btn-secondary` in config)
- `.card` variants (use Tailwind with `@layer components`)
- Simple hover states (Tailwind's `hover:` handles this)

#### 3d. Audit `utilities.css`
Replace one-off helpers with Tailwind:

**Before**:
```css
.u-flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

**After**:
```jsx
className="flex items-center justify-center"
```

Or add to Tailwind config as `@layer utilities`:
```css
@layer utilities {
  .flex-center {
    @apply flex items-center justify-center;
  }
}
```

### Priority Order (Do This Post-Beta)

| File | Action | Why | Effort |
|------|--------|-----|--------|
| variables.css | 🟢 Expand | More tokens = cleaner JSX | Low |
| layout.css | 🔴 Delete 70% | Tailwind grids are better | Medium (1 week) |
| utilities.css | 🟡 Reduce 50% | Most helpers = one-liners in JSX | Medium (1 week) |
| components.css | 🟡 Keep 30% | Only animations + 3P overrides | Low (audit slowly) |
| globals.css | 🟢 Keep | Element resets, typography | Low (keep as-is) |

### Why This Order?

1. **variables.css first:** Unblocks Tailwind tokens; makes later steps easier
2. **layout.css second:** Grids are Tailwind's biggest win; easiest to migrate
3. **utilities.css third:** One-off helpers are easy to replace with inline classes
4. **components.css last:** Animations need care; only refactor if there's a clear win

### Success Metrics

✅ `design-system.css` still imports all files in same order
✅ No orphaned CSS (Phase 2 ESLint rule catches any)
✅ Fewer custom CSS lines (~300 → ~150)
✅ Easier to add new components (more Tailwind, less CSS)
✅ Tailwind config is the single source of truth for design tokens

---

## Why This Approach Works for You

### Now (Phase 1) ✅
- Single import contract file = auditable, predictable
- No breaking changes; just reorganized imports
- One atomic commit: "refactor: centralize CSS imports via design-system.css"

### Post-MVP (Phase 2)
- Add ESLint rule to catch mistakes
- Takes 5 minutes; prevents all future orphaned CSS
- Discipline > automation for solo dev

### Post-Beta (Phase 3)
- Consolidate into Tailwind gradually
- Reserve energy for product discovery; refactor CSS when things stabilize
- No point consolidating if you're still changing dashboard layouts

---

## Next Steps

### If continuing today:
- [x] Phase 1 complete
- [ ] Run tests to confirm no style regressions
- [ ] Make one atomic commit

### Before next sprint:
- [ ] Consider Phase 2 ESLint rule (light)
- [ ] Document in README: "CSS cascade is orchestrated in `src/styles/design-system.css`"

### Before beta launch:
- [ ] Review Phase 3 to plan post-PMF consolidation
- [ ] Track which pages use heavy CSS vs. light CSS (informs refactoring priority)

---

## Commands for Future Work

```bash
# Check for orphaned CSS (when Phase 2 is implemented)
npm run lint:css

# Run pre-commit checks (when Phase 2 hook is added)
npm run prepare

# Monitor CSS file sizes (useful for Phase 3 planning)
du -sh src/styles/*.css | sort -h
```

---

## Related Files

- `src/styles/design-system.css` — Main contract file
- `src/main.tsx` — Only place that imports CSS
- `src/index.css` — Deprecated; Tailwind directives now in design-system.css
- `src/tailwind.config.ts` — Where tokens will live (Phase 3)
