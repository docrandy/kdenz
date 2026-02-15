# KDENZ DESIGN SYSTEM v1.0

> **READ THIS FILE BEFORE WRITING ANY UI CODE.**
> Every component, page, and layout in the Kdenz app MUST conform to this system.
> Do not improvise colors, fonts, spacing, or effects. Use only what is defined here.

---

## 1. BRAND IDENTITY

**Product:** Kdenz — Real-time voice analytics & communication coaching platform
**Aesthetic:** Cinematic HUD / Cockpit — inspired by Peloton's performance interface, F1 telemetry dashboards, and aviation instrumentation
**Feeling:** "I'm in a high-performance control room analyzing my own voice"
**Anti-patterns:** Do NOT produce generic SaaS dashboards, bland shadcn defaults, or "startup template" aesthetics

---

## 2. COLOR SYSTEM (STRICT — NO IMPROVISATION)

### Backgrounds (Layered Depth)
```
--bg-base:        #0A0A0B    /* Deepest layer — page background */
--bg-surface:     #101113    /* Woodsmoke — card/panel background */
--bg-elevated:    #1A1B1D    /* Shark — elevated panels, modals */
--bg-hover:       #222326    /* Hover states on surfaces */
--bg-active:      #2A2B2F    /* Active/pressed states */
```

### NEVER use:
- Pure black (#000000) — too harsh
- Pure white (#FFFFFF) — use --text-primary instead
- Any gray not defined here

### Accent Colors (Semantic — Each Has ONE Purpose)
```
--accent-danger:    #C41F2F    /* Cardinal Red — Zone 5, alerts, aggression warnings */
--accent-success:   #1DB954    /* Neon Mint — Sweet spot, positive feedback, in-zone */
--accent-info:      #0052CC    /* Electric Blue — Progress, neutral data, links */
--accent-warning:   #F59E0B    /* Amber — Caution states, approaching limits */
--accent-premium:   #8B5CF6    /* Violet — Premium features, Strive Score highlights */
```

### Accent Usage Rules:
- **Red (#C41F2F):** ONLY for danger/high-intensity states. Never decorative.
- **Mint (#1DB954):** ONLY for success/sweet-spot/positive. The "you're doing great" color.
- **Blue (#0052CC):** Neutral progress indicators, links, informational badges.
- **Amber (#F59E0B):** "Getting close to a limit" — pacing too fast, approaching threshold.
- **Violet (#8B5CF6):** Scores, achievements, premium indicators.

### Text Colors
```
--text-primary:     #F0F0F0    /* Main content text */
--text-secondary:   #8A8F98    /* Labels, descriptions, secondary info */
--text-muted:       #555960    /* Disabled, placeholder, timestamps */
--text-on-accent:   #FFFFFF    /* Text on accent-colored backgrounds */
```

### Borders & Dividers
```
--border-subtle:    #1E1F23    /* Card borders, dividers */
--border-focus:     #0052CC    /* Focus rings */
--border-glow:      rgba(29, 185, 84, 0.3)  /* Mint glow for sweet-spot states */
```

---

## 3. TYPOGRAPHY (STRICT)

### Font Stack
```css
/* Headers — Bold, uppercase, commanding */
--font-display: 'Montserrat', sans-serif;

/* UI Data — Tabular numbers, metric readouts */
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* Body — Clean, readable */
--font-body: 'Plus Jakarta Sans', sans-serif;
```

### WHY these fonts:
- **Montserrat:** Geometric, authoritative — reads like cockpit instrumentation labels
- **JetBrains Mono:** Monospaced with tabular figures — metrics align perfectly
- **Plus Jakarta Sans:** Modern, warm — humanizes the technical interface

### DO NOT USE: Inter, Roboto, Arial, system-ui, or any generic sans-serif

### Type Scale
```
--text-xs:     0.75rem / 1rem      /* Micro labels, timestamps */
--text-sm:     0.875rem / 1.25rem  /* Secondary labels */
--text-base:   1rem / 1.5rem       /* Body text */
--text-lg:     1.125rem / 1.75rem  /* Card titles */
--text-xl:     1.25rem / 1.75rem   /* Section headers */
--text-2xl:    1.5rem / 2rem       /* Page titles */
--text-3xl:    1.875rem / 2.25rem  /* Hero metrics */
--text-metric: 2.5rem / 1          /* Big number readouts (WPM, Score) */
```

### Header Rules:
- H1: Montserrat, UPPERCASE, font-weight 800, letter-spacing 0.05em
- H2: Montserrat, UPPERCASE, font-weight 700, letter-spacing 0.03em
- Metrics: JetBrains Mono, font-weight 600, tabular-nums
- Body: Plus Jakarta Sans, font-weight 400

---

## 4. SPACING SYSTEM

Use a 4px base grid. All spacing must be multiples of 4.

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
--space-20:  80px
```

### Component Spacing Rules:
- Card internal padding: `--space-5` (20px)
- Gap between cards: `--space-4` (16px)
- Section spacing: `--space-10` (40px)
- Metric value to label: `--space-1` (4px)
- Dashboard outer padding: `--space-6` (24px)

---

## 5. COMPONENT PATTERNS

### Metric Card (Most Common Component)
```
┌─────────────────────────┐
│  LABEL          ● LIVE  │  ← --text-secondary, Montserrat uppercase, --text-xs
│                         │
│  147                    │  ← --font-mono, --text-metric, --text-primary
│  WPM                    │  ← --text-secondary, --text-xs
│                         │
│  ██████████░░░░░░░░░░░  │  ← Progress bar with zone coloring
│  Target: 120-130        │  ← --text-muted, --text-xs
└─────────────────────────┘

Background: --bg-surface
Border: 1px solid --border-subtle
Border-radius: 12px
Box-shadow: 0 1px 3px rgba(0,0,0,0.3)
```

### Zone Bar (Speech Power Meter)
```
Zone 1 (Silence):     --text-muted / #555960
Zone 2 (Quiet):       --accent-info / #0052CC (dim)
Zone 3 (Sweet Spot):  --accent-success / #1DB954 + GLOW EFFECT
Zone 4 (Loud):        --accent-warning / #F59E0B
Zone 5 (Aggression):  --accent-danger / #C41F2F + PULSE EFFECT
```

### Glow Effect (Sweet Spot):
```css
.zone-sweet-spot {
  box-shadow: 0 0 20px rgba(29, 185, 84, 0.4),
              0 0 40px rgba(29, 185, 84, 0.2);
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(29, 185, 84, 0.4); }
  50% { box-shadow: 0 0 30px rgba(29, 185, 84, 0.6); }
}
```

### Pulse Effect (Danger Zone):
```css
.zone-danger {
  animation: danger-pulse 0.8s ease-in-out infinite;
}

@keyframes danger-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

### Scorecard / Post-Session Summary
```
Background: --bg-elevated
Border: 1px solid --border-subtle
Large centered score: --accent-premium, --font-mono, --text-metric
Radar chart or segmented ring for multi-axis scoring
Individual metric rows beneath with spark lines
```

### Buttons
```
Primary:   bg --accent-info, text --text-on-accent, hover brightness(1.1)
Danger:    bg --accent-danger, text --text-on-accent
Success:   bg --accent-success, text #000000 (dark text on bright green)
Ghost:     bg transparent, border --border-subtle, text --text-secondary
```
- Border-radius: 8px
- Padding: 10px 20px
- Font: Plus Jakarta Sans, font-weight 600
- Transition: all 150ms ease

---

## 6. EFFECTS & ATMOSPHERE

### Background Texture
Every page should have a subtle noise texture overlay:
```css
.page-background {
  background-color: var(--bg-base);
  background-image: url("data:image/svg+xml,..."); /* subtle grain */
  position: relative;
}

.page-background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(0, 82, 204, 0.06) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

### Glassmorphism (Use Sparingly — Modals and Overlays Only)
```css
.glass-panel {
  background: rgba(16, 17, 19, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

### Transitions
- All interactive elements: `transition: all 150ms ease`
- Page transitions: 300ms fade
- Metric updates: 200ms with slight spring (use framer-motion)
- Never instant. Never longer than 400ms.

### Shadows
```
--shadow-sm:   0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md:   0 4px 12px rgba(0, 0, 0, 0.4);
--shadow-lg:   0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(29, 185, 84, 0.3);  /* success glow */
```

---

## 7. LAYOUT RULES

### Dashboard Grid
- Use CSS Grid, not flexbox, for dashboard layouts
- 12-column grid at desktop
- Metric cards: span 3 columns (4 per row)
- Zone bar: span full width (12 columns)
- Session transcript/feed: span 8 columns
- Sidebar stats: span 4 columns

### Responsive Breakpoints
```
--bp-sm:   640px
--bp-md:   768px
--bp-lg:   1024px
--bp-xl:   1280px
--bp-2xl:  1536px
```

### Mobile: Stack all cards vertically, full width. Zone bar remains full width.

---

## 8. ICONOGRAPHY

- Use `lucide-react` as the icon library
- Icon size in metric cards: 16px
- Icon size in navigation: 20px
- Icon color: --text-secondary (default), accent color when active
- Stroke width: 1.5px (not 2 — feels lighter and more premium)

---

## 9. DATA VISUALIZATION

### Charts
- Use Recharts or D3 for all charts
- Chart background: transparent (inherits card background)
- Grid lines: --border-subtle, dashed, 0.5 opacity
- Data line stroke: 2px
- Use accent colors for data series (green for good, red for bad, blue for neutral)
- Animate on mount: 800ms ease-out

### Radar Chart (Scorecard)
- Fill: accent color at 0.15 opacity
- Stroke: accent color at full opacity, 2px
- Dots: 4px radius, filled
- Labels: --font-mono, --text-xs, --text-secondary

---

## 10. ANTI-PATTERNS (NEVER DO THESE)

1. ❌ White backgrounds or light mode anything
2. ❌ Generic card grids with no hierarchy
3. ❌ Default shadcn styling without customization
4. ❌ Inter, Roboto, or Arial fonts
5. ❌ Pure black (#000) backgrounds
6. ❌ Rainbow gradients or "startup" color schemes
7. ❌ Stock illustrations or generic SVG art
8. ❌ Rounded-full buttons (pill buttons) — use 8px radius
9. ❌ More than 2 accent colors on a single screen
10. ❌ Flat, lifeless metric displays — every number should feel alive

---

## 11. REFERENCE MENTAL MODELS

When building any Kdenz UI, think:
- **Peloton ride screen** — live metrics, zone indicators, real-time feedback
- **F1 telemetry dashboard** — data-dense but scannable, dark, precise
- **Aviation HUD** — critical info at a glance, nothing decorative without purpose
- **Spotify's "Wrapped"** — data storytelling with personality and motion

---

## 12. TAILWIND CONFIG ALIGNMENT

The design system is implemented via `kdenz-tailwind-preset.js` in the project root.

Usage in `tailwind.config.js`:
```js
module.exports = {
  presets: [require('./kdenz-tailwind-preset')],
  // ... rest of config
}
```

All design tokens are available under the `kdenz-` prefix:
- `bg-kdenz-base`, `bg-kdenz-surface`, `bg-kdenz-elevated`
- `text-kdenz-text-primary`, `text-kdenz-text-secondary`
- `border-kdenz-border-subtle`
- `shadow-glow-success`, `shadow-glow-danger`
- `animate-glow-pulse`, `animate-danger-pulse`

---

## 13. AGENT INSTRUCTION

**When Claude Code or any AI agent reads this file, it must:**

1. Use ONLY the colors defined in Section 2
2. Use ONLY the fonts defined in Section 3
3. Follow the spacing grid in Section 4
4. Match the component patterns in Section 5
5. Apply effects from Section 6 — no flat/lifeless surfaces
6. Never produce any anti-pattern from Section 10
7. Reference the mental models in Section 11 when making layout decisions
8. Use the Tailwind config in Section 12 for all class names

**If in doubt about a design decision, choose the option that feels more like an F1 telemetry screen and less like a generic SaaS dashboard.**

---

*Last updated: 2026-02-05*
*Version: 1.0 — Cockpit/HUD dark theme*
