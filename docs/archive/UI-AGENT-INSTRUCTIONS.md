# UI AGENT INSTRUCTIONS — Kdenz Redesign

> **Give this entire file to the UI agent before any work begins.**

---

## MISSION

Redesign the Kdenz VoiceLab app from the current light "Clinical" theme to the new dark "Cockpit/HUD" theme. This is a complete visual overhaul — every component, page, and layout must conform to the new design system.

---

## CONTEXT

### What Kdenz Is
- Real-time voice analytics & communication coaching platform
- Users record practice sessions and get feedback on filler words, pace, volume
- Target: "holy shit moment" when users discover speaking habits they didn't know they had

### Current State (BEFORE)
- Light mode, white backgrounds
- Teal accent (#00D4FF)
- Signal Green (#00C851) for the SessionOrb
- Inter font family
- Generic "clinical" aesthetic

### Target State (AFTER)
- Dark mode, layered backgrounds (#0A0A0B base)
- Semantic accent colors (success mint, danger red, info blue, warning amber, premium violet)
- Montserrat (display), JetBrains Mono (metrics), Plus Jakarta Sans (body)
- "Cockpit/HUD" aesthetic — F1 telemetry, Peloton ride screen, aviation instrumentation

---

## FILES TO READ FIRST

1. **Design System:** `docs/DESIGN-SYSTEM.md` — ALL design tokens, component patterns, anti-patterns
2. **Tailwind Preset:** `kdenz-tailwind-preset.js` — All CSS values as Tailwind tokens

---

## SCOPE OF WORK

### Pages to Redesign

| Page | File | Priority | Notes |
|------|------|----------|-------|
| Dashboard | `src/pages/Dashboard.tsx` | HIGH | Main entry, focus mode selection |
| Home | `src/pages/Home.tsx` | HIGH | Landing/welcome page |
| Practice Session | `src/components/PracticeSession.tsx` | HIGH | In-session experience with orb |
| Post-Session Results | `src/pages/PostSessionResults.tsx` | MEDIUM | Results display (Phase 05 will add transcript) |

### Components to Update

| Component | File | Notes |
|-----------|------|-------|
| SessionOrb | `src/components/SessionOrb.tsx` | Update to kdenz-success (#1DB954) with glow effects |
| AudioPlayback | `src/components/AudioPlayback.tsx` | Dark theme, accent colors |
| BottomControlBar | `src/components/BottomControlBar.tsx` | Dark surface, ghost buttons |
| ConsentModal | `src/components/ConsentModal.tsx` | Glassmorphism style |
| DurationPicker | `src/components/DurationPicker.tsx` | Dark cards, accent highlights |
| CountdownBar | `src/components/CountdownBar.tsx` | Progress bar with zone coloring |
| BaselineInstructions | `src/components/BaselineInstructions.tsx` | Dark elevated panel |

### Global Updates

1. **index.css / App.css** — Base styles, page backgrounds
2. **tailwind.config.js** — Already updated to use preset
3. **index.html** — Add font imports (Montserrat, JetBrains Mono, Plus Jakarta Sans)

---

## DESIGN TOKENS QUICK REFERENCE

### Backgrounds (use these, nothing else)
```
bg-kdenz-base       #0A0A0B   Page background
bg-kdenz-surface    #101113   Card background
bg-kdenz-elevated   #1A1B1D   Modal/elevated panel
bg-kdenz-hover      #222326   Hover state
bg-kdenz-active     #2A2B2F   Active/pressed
```

### Accent Colors (semantic — don't mix purposes)
```
bg-kdenz-success    #1DB954   Sweet spot, positive, "good job"
bg-kdenz-danger     #C41F2F   Alerts, aggression, Zone 5
bg-kdenz-info       #0052CC   Progress, links, neutral data
bg-kdenz-warning    #F59E0B   Caution, approaching limits
bg-kdenz-premium    #8B5CF6   Scores, achievements
```

### Text Colors
```
text-kdenz-text-primary     #F0F0F0   Main content
text-kdenz-text-secondary   #8A8F98   Labels, descriptions
text-kdenz-text-muted       #555960   Disabled, timestamps
```

### Shadows & Glows
```
shadow-card           Subtle card shadow
shadow-elevated       Modal/elevated shadow
shadow-glow-success   Green glow for sweet spot
shadow-glow-danger    Red glow for danger zone
```

### Animations
```
animate-glow-pulse    Pulsing green glow (2s cycle)
animate-danger-pulse  Pulsing opacity (0.8s cycle)
animate-fade-in       Fade in (300ms)
animate-slide-up      Slide up + fade (300ms)
```

---

## KEY COMPONENT TRANSFORMATIONS

### SessionOrb (BEFORE → AFTER)

**BEFORE:** Signal Green (#00C851) circle, simple glow
**AFTER:** Kdenz Success (#1DB954) with:
- `shadow-glow-success` base glow
- `animate-glow-pulse` when in sweet spot
- Volume-reactive brightness (0.7-1.3 range)
- Zone coloring: success → warning → danger based on intensity

### Metric Cards (NEW PATTERN)

```jsx
<div className="bg-kdenz-surface border border-kdenz-border-subtle rounded-card shadow-card p-5">
  <div className="flex justify-between items-center mb-2">
    <span className="font-display text-xs uppercase tracking-wider text-kdenz-text-secondary">
      LABEL
    </span>
    <span className="w-2 h-2 rounded-full bg-kdenz-success animate-pulse" />
  </div>
  <div className="font-mono text-metric text-kdenz-text-primary">
    147
  </div>
  <div className="text-xs text-kdenz-text-secondary mt-1">
    WPM
  </div>
</div>
```

### Buttons

```jsx
// Primary
<button className="bg-kdenz-info text-kdenz-text-on-accent px-5 py-2.5 rounded-btn font-body font-semibold hover:brightness-110 transition-all duration-150">
  Start Session
</button>

// Ghost
<button className="bg-transparent border border-kdenz-border-subtle text-kdenz-text-secondary px-5 py-2.5 rounded-btn font-body font-semibold hover:bg-kdenz-hover transition-all duration-150">
  Cancel
</button>

// Danger
<button className="bg-kdenz-danger text-kdenz-text-on-accent px-5 py-2.5 rounded-btn font-body font-semibold hover:brightness-110 transition-all duration-150">
  Stop Recording
</button>
```

### Page Layout Base

```jsx
<div className="min-h-screen bg-kdenz-base bg-page-glow-blue">
  <div className="max-w-7xl mx-auto px-6 py-10">
    {/* Content */}
  </div>
</div>
```

---

## FONTS — ADD TO index.html

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Montserrat:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## LAYOUT INSPIRATION

Reference: Clean fitness app layouts (NOT the blue color or photos — just the structure)

**ADOPT these layout principles:**
- Clean card-based organization with clear visual hierarchy
- Calendar/date strip components for session history
- Chip/pill selectors for category filtering (focus modes, duration options)
- Big headline → supporting subtext typography pattern
- Generous rounded corners on cards (12px)
- Minimal, uncluttered feel — white space is intentional
- Bottom navigation pattern for mobile

**ADAPT for Kdenz:**
- Use Kdenz dark colors (#0A0A0B base), not blue
- Use semantic accents (success mint #1DB954, info blue #0052CC, etc.)

---

## IMAGERY RULES

**NEVER use:**
- Photos of real people
- Stock photography
- Generic illustrations of humans

**USE instead:**
- Abstract waveform visualizations
- Data-driven graphics (charts, meters, gauges)
- Geometric patterns
- Icon-based illustrations (lucide-react)
- The SessionOrb as the visual centerpiece
- Subtle animated elements (pulses, glows)

The app should feel like a **cockpit instrument panel**, not a fitness influencer's Instagram.

---

## ANTI-PATTERNS — NEVER DO THESE

1. ❌ White backgrounds or light mode anything
2. ❌ Pure black (#000000) — always use #0A0A0B
3. ❌ Inter, Roboto, Arial fonts
4. ❌ Rounded-full/pill buttons — use rounded-btn (8px)
5. ❌ Default shadcn styling without customization
6. ❌ Flat, lifeless surfaces — always add depth (shadows, borders, glows)
7. ❌ More than 2 accent colors on a single screen
8. ❌ Generic "SaaS dashboard" layouts
9. ❌ Photos of real people — use abstract visuals instead
10. ❌ Blue color schemes — use Kdenz dark palette

---

## VERIFICATION CHECKLIST

After redesign, verify:

- [ ] All pages have `bg-kdenz-base` page background
- [ ] All cards use `bg-kdenz-surface` with `border-kdenz-border-subtle`
- [ ] All text uses `text-kdenz-text-*` colors (no white, no gray-*)
- [ ] SessionOrb uses `bg-kdenz-success` (#1DB954)
- [ ] Buttons use `rounded-btn` (8px), never `rounded-full`
- [ ] Fonts loaded: Montserrat, JetBrains Mono, Plus Jakarta Sans
- [ ] Headers use `font-display` (Montserrat)
- [ ] Metrics use `font-mono` (JetBrains Mono)
- [ ] Body text uses `font-body` (Plus Jakarta Sans)
- [ ] Interactive elements have 150ms transitions
- [ ] No pure white (#FFFFFF) or pure black (#000000) anywhere

---

## PARALLEL WORK SAFETY

**DO NOT touch these files** (Phase 05 will modify them):
- `src/components/PracticeSession.tsx` — Phase 05 adds Web Speech API

**SAFE to modify:**
- `src/pages/Dashboard.tsx`
- `src/pages/Home.tsx`
- `src/components/SessionOrb.tsx`
- `src/components/BottomControlBar.tsx`
- All other components listed above

---

*Created: 2026-02-05*
*For: UI Agent redesign task*
