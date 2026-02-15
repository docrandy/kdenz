# Phase 11: Design System Foundation - Research

**Researched:** 2026-02-11
**Domain:** Design Tokens, Tailwind CSS Configuration, CSS Custom Properties
**Confidence:** HIGH

## Summary

Phase 11 establishes the "Dark Premium" design system foundation by migrating from the current "High-Performance Clinical" (white bg, black text, cyan accent) to the new dark navy + gold aesthetic defined in the prototype HTML file. This involves extracting exact design tokens from the prototype, establishing CSS custom properties for semantic token layers, updating Tailwind configuration, and migrating 50+ component files that currently use hardcoded colors.

The current codebase uses Tailwind v3.4.18 with standard JavaScript configuration. Migration to the dark premium theme can proceed within v3 without requiring a v4 upgrade (though v4 offers better CSS-first token management if needed later). The primary challenge is systematic replacement of 768 instances of hardcoded Tailwind utility classes (304 bg-* occurrences, 464 text-* occurrences) plus 4 files with inline hex colors.

**Primary recommendation:** Implement a three-layer token system (primitive → semantic → component) using CSS custom properties, update Tailwind config to reference these tokens, then systematically migrate components starting with the most-used base components.

## User Constraints

**No CONTEXT.md exists for this phase. No locked decisions from /gsd:discuss-phase.**

Constraints from phase description and requirements:
- Design palette is locked: dark navy (#0b0e14) + gold accent (#c9a84c)
- Typography is locked: Cormorant Garamond (headings) + Outfit (body)
- Source of truth: kdenz-session-flow-prototype.html (277KB, 10-screen flow)
- Must implement 8px baseline grid for spacing
- Must support status indicators: green (good), rose (needs work), blue (info)
- Light mode only for beta (no dark mode toggle needed)

## Design Token Extraction (from Prototype)

### Complete Color Palette

Extracted from `kdenz-session-flow-prototype.html`:

**Primary Palette (Core Brand):**
- `#0b0e14` - Dark navy (main background)
- `#131720` - Surface gray (cards, elevated surfaces)
- `#c9a84c` - Gold accent (primary interactive elements)
- `#e8e2d6` - Cream text (body text on dark backgrounds)
- `#ffffff` - White (high-contrast elements, icons on gold)

**Extended Navy Scale:**
- `#1a1f2e` - Navy variant (headers, borders)
- `#222838` - Navy lighter (hover states)

**Muted Neutrals:**
- `#5e5a52` - Muted brown (subtle text)
- `#9a9484` - Muted tan (secondary text)
- `#d4b35a` - Gold lighter (hover/focus states)

**Status Colors:**
- `#6b9e78` - Green (positive feedback, improvement)
- `#5e8fa8` - Blue (info, neutral status)
- `#b87171` - Rose (needs work, negative feedback)
- `#dc2626` - Red (error, critical alerts)
- `#3b82f6` - Blue (links, actions)

**Grays (Utility):**
- `#9ca3af` - Medium gray (disabled states)
- `#e5e7eb` - Light gray (borders, dividers)
- `#000000` - Black (for maximum contrast)

### Typography

**Fonts (from prototype):**
- Cormorant Garamond (serif) - headings, display text
- Outfit (sans-serif) - body text, UI elements

**Current codebase uses:**
- Inter (sans-serif) - needs replacement with Outfit

### Spacing System

**Required (from DS-04):**
- 8px baseline grid
- Increments: 4px, 8px, 12px, 16px, 24px, 32px, 40px, 48px, 64px, 80px, 96px

**Current Tailwind defaults are compatible** (Tailwind uses 0.25rem = 4px increments)

### Shadows & Elevation

Prototype uses subtle shadows for dark premium aesthetic:
- Small cards: `0 1px 3px rgba(0,0,0,0.2)`
- Elevated: `0 4px 12px rgba(0,0,0,0.3)`
- Modal/drawer: `0 8px 24px rgba(0,0,0,0.4)`

### Typography Scale

**Prototype examples:**
- Display: 48px / 3rem (Cormorant Garamond)
- H1: 36px / 2.25rem (Cormorant Garamond)
- H2: 28px / 1.75rem (Cormorant Garamond)
- H3: 24px / 1.5rem (Cormorant Garamond)
- Body Large: 18px / 1.125rem (Outfit)
- Body: 16px / 1rem (Outfit)
- Small: 14px / 0.875rem (Outfit)
- Caption: 12px / 0.75rem (Outfit)

## Current Codebase Audit

### Tailwind Setup

**Version:** 3.4.18 (from package.json)
**Config:** JavaScript-based (tailwind.config.js)
**PostCSS:** Standard setup (postcss.config.js)

**Current theme extends:**
```javascript
colors: {
  clinical: {
    bg: '#FFFFFF',
    text: '#000000',
    accent: '#00D4FF',
    'accent-hover': '#00B8E6',
    muted: '#6B7280',
    border: '#E5E7EB',
    'deep-navy': '#1A1A2E',
    'electric-blue': '#0066FF',
    'signal-green': '#00C851',
    'warm-amber': '#FFB300',
    'soft-gray': '#F5F5F7',
  }
}
```

### Migration Scope

**Files with inline hex colors (4 files):**
1. `src/components/FillerGauge.tsx` - Status colors (#22c55e, #eab308, #ef4444, #e5e7eb)
2. `src/components/WaveformVisualizer.tsx` - Canvas colors (#F9FAFB, #E5E7EB, #4B5563)
3. `src/components/BottomControlBar.tsx` - Button colors (#00C851, #00A843)
4. `src/components/SessionOrb.tsx` - Orb colors (#00C851, #000000, #EF4444)

**Files using Tailwind utility classes:**
- 54 files use `bg-white`, `bg-gray-*`, `bg-blue-*`, `bg-green-*`, `bg-red-*` (304 occurrences)
- 47 files use `text-white`, `text-gray-*`, `text-blue-*` (464 occurrences)
- Most common pattern: `bg-white`, `text-gray-900`, `border-gray-200`

**High-impact components (most referenced):**
- Dashboard.tsx, App.tsx - Main layout, uses gray-50 background
- PracticeSession.tsx - Core UI, extensive color usage
- All feature components use clinical accent colors

### Current index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-black antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}
```

Simple setup, ready for token injection.

## Standard Stack

### Core (Already Installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 3.4.18 | Utility-first CSS framework | Industry standard for design systems, excellent custom token support |
| postcss | 8.5.6 | CSS processor | Required for Tailwind, handles autoprefixer |
| autoprefixer | 10.4.22 | Browser prefix automation | Standard pairing with PostCSS |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @fontsource/outfit | Latest | Self-host Outfit font | Better performance than Google Fonts CDN |
| @fontsource/cormorant-garamond | Latest | Self-host Cormorant Garamond | Better performance than Google Fonts CDN |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS custom properties | Style Dictionary | Overkill for single-platform (web-only) project |
| Tailwind v3 | Tailwind v4 | v4 has better CSS-first tokens but requires migration effort, not needed now |
| Manual token files | Theo/Style Dictionary | Automation useful for multi-platform but adds complexity here |

**Installation (fonts only, Tailwind already installed):**
```bash
npm install @fontsource/outfit @fontsource/cormorant-garamond
```

## Architecture Patterns

### Recommended Token Structure

```
Design System Structure:
├── CSS Custom Properties (primitive tokens)
│   ├── Colors: --color-navy-900, --color-gold-500
│   ├── Spacing: --space-1 through --space-24
│   ├── Typography: --font-display, --font-body
│   └── Elevation: --shadow-sm, --shadow-md
├── Tailwind Config (semantic tokens)
│   ├── Maps primitives to Tailwind scales
│   └── Extends default theme
└── Component Styles (component tokens)
    └── Use Tailwind utilities that reference semantic tokens
```

### Pattern 1: Three-Layer Token System

**What:** Separate primitive, semantic, and component token layers for maintainability

**When to use:** Always - this is the standard design system pattern

**Example:**

```css
/* src/index.css - Primitive tokens */
@layer base {
  :root {
    /* Color primitives */
    --color-navy-950: #0b0e14;
    --color-navy-900: #131720;
    --color-navy-800: #1a1f2e;
    --color-navy-700: #222838;

    --color-gold-500: #c9a84c;
    --color-gold-400: #d4b35a;

    --color-cream-100: #e8e2d6;

    --color-status-success: #6b9e78;
    --color-status-info: #5e8fa8;
    --color-status-warning: #b87171;
    --color-status-error: #dc2626;

    /* Spacing primitives (8px baseline) */
    --space-0: 0;
    --space-1: 0.25rem; /* 4px */
    --space-2: 0.5rem;  /* 8px */
    --space-3: 0.75rem; /* 12px */
    --space-4: 1rem;    /* 16px */
    --space-6: 1.5rem;  /* 24px */
    --space-8: 2rem;    /* 32px */

    /* Typography primitives */
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Outfit', sans-serif;
  }
}
```

**Source:** Design tokens best practices - [Penpot Developer's Guide](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/), [Contentful Design Token System](https://www.contentful.com/blog/design-token-system/)

### Pattern 2: Semantic Token Mapping in Tailwind Config

**What:** Map primitive tokens to semantic names in Tailwind theme

**When to use:** Always - provides semantic meaning to raw values

**Example:**

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Semantic mappings
        background: {
          DEFAULT: 'var(--color-navy-950)',
          surface: 'var(--color-navy-900)',
          elevated: 'var(--color-navy-800)',
        },
        text: {
          DEFAULT: 'var(--color-cream-100)',
          muted: 'var(--color-navy-700)',
          inverse: 'var(--color-navy-950)',
        },
        accent: {
          DEFAULT: 'var(--color-gold-500)',
          hover: 'var(--color-gold-400)',
        },
        status: {
          success: 'var(--color-status-success)',
          info: 'var(--color-status-info)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
        },
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        sans: 'var(--font-body)', // Alias for body
      },
      spacing: {
        // Tailwind defaults already match 8px grid
        // Just document the baseline in comments
      }
    }
  }
}
```

**Source:** [Tailwind v3 Theme Configuration](https://v3.tailwindcss.com/docs/configuration)

### Pattern 3: Component Migration Strategy

**What:** Systematic component update pattern

**When to use:** During migration phase

**Example workflow:**

```typescript
// BEFORE (old clinical theme)
<div className="bg-white text-black border-gray-200">
  <h2 className="text-gray-900">Title</h2>
  <p className="text-gray-600">Body</p>
  <button className="bg-[#00D4FF] text-black">Action</button>
</div>

// AFTER (dark premium theme)
<div className="bg-background-surface text-text border-background-elevated">
  <h2 className="text-text font-display">Title</h2>
  <p className="text-text/80 font-body">Body</p>
  <button className="bg-accent text-text-inverse hover:bg-accent-hover">Action</button>
</div>
```

**Migration order:**
1. Base layout components (App.tsx, Dashboard.tsx)
2. Shared UI components (buttons, cards, inputs)
3. Feature-specific components
4. Canvas-based components (inline colors last)

### Anti-Patterns to Avoid

- **Mixing token layers:** Don't use `bg-[var(--color-navy-950)]` in components - use semantic token `bg-background`
- **Hardcoding primitives:** Don't add `bg-[#0b0e14]` - always use semantic tokens
- **Skipping semantic layer:** Don't map primitives directly to components - semantic tokens enable theme flexibility
- **Inconsistent naming:** Don't mix `primary` and `accent` - pick one semantic term

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Design token management | Custom JSON + build scripts | CSS custom properties + Tailwind config | Native browser support, simpler, no build complexity |
| Font loading | Custom @font-face | @fontsource packages | Pre-optimized font files, automatic subsetting |
| Color contrast calculations | Manual WCAG checker | Browser DevTools + axe DevTools | Automated, real-time feedback |
| Token documentation | Custom docs site | Inline CSS comments + README | Simpler, always in sync |

**Key insight:** For a single-platform web app, CSS custom properties + Tailwind is simpler than multi-platform token systems (Style Dictionary, Theo). Those tools shine when generating tokens for iOS, Android, web, etc. — overkill here.

## Common Pitfalls

### Pitfall 1: Breaking Existing Visual Regression

**What goes wrong:** Global theme changes break 50+ components at once, causing visual bugs

**Why it happens:** Changing base colors without systematic component testing

**How to avoid:**
1. Keep old `clinical` tokens alongside new `premium` tokens during migration
2. Migrate one component at a time
3. Test each component visually before committing
4. Use feature flag if deploying incrementally (not needed for pre-launch)

**Warning signs:**
- Components become invisible (white text on white background)
- Buttons lose contrast (gold on gold)
- Status colors don't make sense (green for error)

### Pitfall 2: Forgetting Canvas-Based Components

**What goes wrong:** Components using canvas/SVG with inline hex colors don't update

**Why it happens:** CSS custom properties don't work in canvas contexts (JS only)

**How to avoid:**
1. Identify all components with `<canvas>` or inline `fill="#..."` (4 files identified)
2. Replace hex colors with semantic constants
3. Source constants from CSS custom properties via `getComputedStyle()`

**Example fix:**

```typescript
// BEFORE
const baseColor = '#00C851';

// AFTER
const computedStyle = getComputedStyle(document.documentElement);
const baseColor = computedStyle.getPropertyValue('--color-status-success').trim();
```

**Warning signs:**
- FillerGauge stays green when it should be themed
- WaveformVisualizer uses old gray colors
- SessionOrb keeps cyan glow

### Pitfall 3: Typography Hierarchy Break

**What goes wrong:** Swapping Inter for Outfit breaks component layouts

**Why it happens:** Different fonts have different x-heights and character widths

**How to avoid:**
1. Load both Outfit and Cormorant Garamond before testing
2. Check all text-heavy components (Dashboard, Privacy, Settings)
3. Adjust line-height if needed (Cormorant is taller than Inter)
4. Test at all viewport sizes (mobile especially)

**Warning signs:**
- Text overflow on mobile
- Buttons too tall/short
- Headings feel cramped or too loose

### Pitfall 4: Accessibility Regression

**What goes wrong:** Dark premium theme creates insufficient contrast ratios

**Why it happens:** Cream text (#e8e2d6) on navy (#0b0e14) might not meet WCAG AA

**How to avoid:**
1. Test all text/background combinations with contrast checker
2. Verify gold accent (#c9a84c) has sufficient contrast on navy
3. Check status colors (green, rose, blue) are distinguishable for colorblind users
4. Run axe DevTools on all major screens

**Warning signs:**
- Body text hard to read in dim lighting
- Gold buttons don't stand out enough
- Status indicators look too similar

**Mitigation:** Adjust cream to lighter (#f0ebe0) or navy to darker (#080a0f) if needed

### Pitfall 5: Incomplete Token Coverage

**What goes wrong:** Some components still reference old `clinical.*` tokens

**Why it happens:** Grep misses dynamic class generation or conditional logic

**How to avoid:**
1. Global search for `clinical-` and `text-clinical` after migration
2. Search for old color hex codes (#00D4FF, #00C851, etc.)
3. Test all routes and conditional UI states
4. Check error states, loading states, disabled states

**Warning signs:**
- Teal accent appears anywhere
- White backgrounds on main screens
- Black text on light backgrounds

## Code Examples

Verified patterns from official sources and best practices:

### Font Loading (Self-Hosted)

```typescript
// src/main.tsx or src/App.tsx
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
```

**Source:** @fontsource documentation

### Complete Token System

```css
/* src/index.css */
@import '@fontsource/outfit';
@import '@fontsource/cormorant-garamond';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ===== COLOR PRIMITIVES ===== */

    /* Navy Scale (background spectrum) */
    --color-navy-950: #0b0e14;
    --color-navy-900: #131720;
    --color-navy-800: #1a1f2e;
    --color-navy-700: #222838;

    /* Gold Scale (accent spectrum) */
    --color-gold-500: #c9a84c;
    --color-gold-400: #d4b35a;

    /* Neutrals */
    --color-cream-100: #e8e2d6;
    --color-muted-brown: #5e5a52;
    --color-muted-tan: #9a9484;

    /* Status */
    --color-status-success: #6b9e78;
    --color-status-info: #5e8fa8;
    --color-status-warning: #b87171;
    --color-status-error: #dc2626;

    /* Utility */
    --color-white: #ffffff;
    --color-black: #000000;
    --color-gray-400: #9ca3af;
    --color-gray-200: #e5e7eb;

    /* ===== TYPOGRAPHY PRIMITIVES ===== */
    --font-display: 'Cormorant Garamond', serif;
    --font-body: 'Outfit', sans-serif;

    /* ===== SPACING PRIMITIVES (8px baseline) ===== */
    --space-0-5: 0.125rem;  /* 2px */
    --space-1: 0.25rem;     /* 4px */
    --space-2: 0.5rem;      /* 8px */
    --space-3: 0.75rem;     /* 12px */
    --space-4: 1rem;        /* 16px */
    --space-6: 1.5rem;      /* 24px */
    --space-8: 2rem;        /* 32px */
    --space-10: 2.5rem;     /* 40px */
    --space-12: 3rem;       /* 48px */
    --space-16: 4rem;       /* 64px */
    --space-20: 5rem;       /* 80px */
    --space-24: 6rem;       /* 96px */

    /* ===== ELEVATION PRIMITIVES ===== */
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  body {
    @apply bg-background text-text antialiased;
    font-family: var(--font-body);
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
  }
}
```

**Source:** Design tokens best practices - [Penpot](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/), [UX Collective](https://uxdesign.cc/design-tokens-with-confidence-862119eb819b)

### Tailwind Config (Semantic Layer)

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color tokens
        background: {
          DEFAULT: 'var(--color-navy-950)',
          surface: 'var(--color-navy-900)',
          elevated: 'var(--color-navy-800)',
          subtle: 'var(--color-navy-700)',
        },
        text: {
          DEFAULT: 'var(--color-cream-100)',
          muted: 'var(--color-muted-tan)',
          subtle: 'var(--color-muted-brown)',
          inverse: 'var(--color-black)',
        },
        accent: {
          DEFAULT: 'var(--color-gold-500)',
          hover: 'var(--color-gold-400)',
        },
        status: {
          success: 'var(--color-status-success)',
          info: 'var(--color-status-info)',
          warning: 'var(--color-status-warning)',
          error: 'var(--color-status-error)',
        },
        // Preserve old clinical tokens temporarily for migration
        clinical: {
          bg: '#FFFFFF',
          text: '#000000',
          accent: '#00D4FF',
          'accent-hover': '#00B8E6',
          muted: '#6B7280',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        sans: 'var(--font-body)', // Alias
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
      },
      spacing: {
        // Tailwind defaults already support 8px baseline grid
        // Document custom values if needed
      }
    }
  },
  plugins: [],
}
```

**Source:** [Tailwind v3 Configuration Docs](https://v3.tailwindcss.com/docs/configuration)

### Component Token Usage

```typescript
// Example: Button component with semantic tokens
export function Button({ variant = 'primary', children }: ButtonProps) {
  const baseClasses = "px-6 py-3 rounded-lg font-body font-medium transition-colors";

  const variants = {
    primary: "bg-accent text-text-inverse hover:bg-accent-hover",
    secondary: "bg-background-surface text-text border border-background-elevated hover:bg-background-elevated",
    success: "bg-status-success text-text-inverse hover:opacity-90",
    error: "bg-status-error text-white hover:opacity-90",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </button>
  );
}
```

**Source:** Component pattern best practices

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JavaScript-only tokens | CSS custom properties | ~2019 (CSS Variables Level 1) | Native browser support, no build step |
| Hardcoded Tailwind values | Theme extending with CSS vars | Tailwind 3.0 (2021) | Dynamic theming, runtime updates |
| Google Fonts CDN | Self-hosted @fontsource | ~2020 | Better privacy, performance, offline support |
| Separate light/dark files | CSS variable theming | ~2020 | Single token system, easier maintenance |
| Style Dictionary for web-only | CSS custom properties | ~2022 | Simpler for single-platform projects |

**Deprecated/outdated:**
- Sass/Less color functions: Use CSS `color-mix()` in modern browsers (Chrome 111+)
- Multiple CSS files for themes: Use CSS custom properties with runtime switching
- JavaScript color constants: Use CSS custom properties read via `getComputedStyle()`

## Open Questions

Things that couldn't be fully resolved:

1. **Contrast Ratio Validation**
   - What we know: Cream (#e8e2d6) on navy (#0b0e14) likely meets WCAG AA for large text
   - What's unclear: Small text contrast ratio needs verification
   - Recommendation: Run contrast checker during implementation, adjust cream to #f0ebe0 if needed

2. **Tailwind v4 Migration Timing**
   - What we know: Current v3.4.18 is stable, v4 offers CSS-first config
   - What's unclear: Whether to migrate to v4 now or defer to post-launch
   - Recommendation: Stay on v3 for Phase 11, defer v4 to post-launch (v4 migration is non-trivial)

3. **Component-Specific Token Overrides**
   - What we know: Some components may need unique colors (FillerGauge status)
   - What's unclear: Whether to add component-specific tokens or keep semantic-only
   - Recommendation: Start semantic-only, add component tokens if clear need emerges

4. **Animation/Transition Tokens**
   - What we know: Prototype uses subtle transitions
   - What's unclear: Whether to define --duration-* and --easing-* tokens
   - Recommendation: Use Tailwind defaults (duration-300, ease-out) unless inconsistencies appear

## Sources

### Primary (HIGH confidence)
- Context7: `/websites/v3_tailwindcss` - Theme configuration, custom colors, CSS variables
- Tailwind CSS v3 Docs: https://v3.tailwindcss.com/docs/configuration
- Tailwind CSS v4 Upgrade Guide: https://tailwindcss.com/docs/upgrade-guide
- Prototype HTML: `kdenz-session-flow-prototype.html` (design token extraction)
- Current codebase: package.json, tailwind.config.js, src/index.css

### Secondary (MEDIUM confidence)
- [Penpot: Developer's Guide to Design Tokens](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/)
- [Contentful: Design Token System](https://www.contentful.com/blog/design-token-system/)
- [UX Collective: Design Tokens with Confidence](https://uxdesign.cc/design-tokens-with-confidence-862119eb819b)
- [FrontendTools: Tailwind Best Practices 2025-2026](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [Medium: Tailwind v3 to v4 Migration](https://medium.com/@mridudixit15/real-world-migration-steps-from-tailwind-css-v3-to-v4-c35f4a97ebe1)

### Tertiary (LOW confidence)
- None - all research verified with primary sources

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Tailwind v3 is well-documented, @fontsource is standard
- Architecture: HIGH - Three-layer token pattern is industry standard, verified with multiple sources
- Pitfalls: HIGH - Based on direct codebase audit and migration experience patterns
- Token extraction: HIGH - Direct extraction from prototype HTML
- Migration scope: HIGH - Grep audit completed on entire src/ directory

**Research date:** 2026-02-11
**Valid until:** ~60 days (stable domain, Tailwind v3 mature, token patterns stable)

**Codebase audit summary:**
- 58 total component/page files scanned
- 4 files with inline hex colors requiring special handling
- 768 total Tailwind color utility class occurrences
- 0 existing CSS custom properties (greenfield for token system)
- 1 simple index.css ready for token injection

**Next step:** Planning can now create detailed task breakdown for:
1. Token system implementation
2. Tailwind config update
3. Font installation and loading
4. Systematic component migration
5. Visual regression testing approach
