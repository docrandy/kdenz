# Requirements: v2.0 - Dark Premium Transformation

**Defined:** 2026-02-12
**Core Value:** Users practice negotiation and difficult conversation techniques in a premium, professional interface that signals expertise and quality.

## v2.0 Requirements

### Design System Foundation (Wave 1)

- [ ] **DS-01**: Tailwind config updated with dark premium color palette (navy bg, gold accent, cream text)
- [ ] **DS-02**: CSS custom properties defined for all semantic tokens (background, surface, text, accent, status colors)
- [ ] **DS-03**: Typography scale defined (Cormorant Garamond for headings, Outfit for body, 8px baseline grid)
- [ ] **DS-04**: Spacing system established (4px/8px/12px/16px/24px increments)
- [ ] **DS-05**: Component variants for dark mode (buttons, inputs, cards follow new palette)
- [ ] **DS-06**: index.css updated with base styles for dark premium theme

### Color Migration (Wave 2)

- [ ] **CM-01**: All accent colors changed from teal (#00D4FF) to gold (#c9a84c) (~51 files)
- [ ] **CM-02**: Background colors migrated from white to dark navy (#0b0e14)
- [ ] **CM-03**: Surface colors (cards, panels) updated to #131720
- [ ] **CM-04**: Text colors changed to warm cream (#e8e2d6)
- [ ] **CM-05**: Semantic colors established (status: green/rose/blue on dark background)
- [ ] **CM-06**: Build verified with no visual regressions

### SessionOrb Redesign (Wave 3)

- [ ] **ORB-01**: New orb visual with gold radial gradient replacing current green
- [ ] **ORB-02**: Three concentric animated rings (outer: slow rotation, middle: medium pulse, inner: fast flicker)
- [ ] **ORB-03**: Orb responds to microphone input (rings brighten with voice volume)
- [ ] **ORB-04**: Mic icon displayed center of orb in idle state
- [ ] **ORB-05**: Stop square icon overlays orb when recording active
- [ ] **ORB-06**: Smooth transitions between idle/recording/analyzing states
- [ ] **ORB-07**: Mobile responsive at 320px+ screens

### Typography & Layout (Wave 4)

- [ ] **TYP-01**: Cormorant Garamond imported and applied to all headings (h1-h6)
- [ ] **TYP-02**: Outfit sans-serif imported and applied to body text, labels, buttons
- [ ] **TYP-03**: Heading sizes follow typographic scale (h1: 48px, h2: 36px, h3: 28px on desktop)
- [ ] **TYP-04**: Mobile-first layout: 420px minimum width baseline
- [ ] **TYP-05**: Line heights optimized for readability (1.5 for body, 1.2 for headings)
- [ ] **TYP-06**: Letter spacing adjusted for premium feel (headings: +1px, body: normal)
- [ ] **LAY-01**: Full page layout uses dark premium spacing (24px gutters desktop, 16px mobile)
- [ ] **LAY-02**: Card-based sections with subtle borders (#1f2937) on dark backgrounds
- [ ] **LAY-03**: Maximum content width 1200px, centered on desktop

### New Screens — Core Flow (Wave 5)

- [ ] **SCR-01**: Welcome screen redesigned with premium hero section + 3-step intro
- [ ] **SCR-02**: Pre-session screen shows technique briefing, success criteria, ai persona preview
- [ ] **SCR-03**: Recording screen displays new SessionOrb, shows practice prompt, has start/stop controls
- [ ] **SCR-04**: Recording screen shows real-time metrics (minimal: WPM + filler count at bottom)
- [ ] **SCR-05**: Post-session screen (3 tabs): Coaching, Voice Analytics, Transcript
- [ ] **SCR-06**: Navigation between screens smooth with consistent header/footer placement

### New Screens — Advanced Features (Wave 6)

- [ ] **SCR-07**: Analysis Loader screen shows visual loading indicator while VCM analyzes
- [ ] **SCR-08**: Voice Profile screen displays user's vocal signature, patterns, strengths
- [ ] **SCR-09**: Practice Bridge screen recommends next technique based on performance
- [ ] **SCR-10**: Breathing screen shows guided breathing animation before practice (optional)
- [ ] **SCR-11**: Before/After comparison screen shows progress across sessions
- [ ] **SCR-12**: All new screens follow dark premium design system

### Visual Consistency

- [ ] **VIS-01**: Entire app uses gold (#c9a84c) as primary interactive element (buttons, links, accents)
- [ ] **VIS-02**: All backgrounds are dark navy (#0b0e14) or surface gray (#131720)
- [ ] **VIS-03**: All text is cream (#e8e2d6) for readability on dark
- [ ] **VIS-04**: Status indicators use semantic colors (green for good, rose for needs work, blue for info)
- [ ] **VIS-05**: Component spacing and padding consistent across all screens
- [ ] **VIS-06**: Hover states for interactive elements show gold glow or opacity change

## v2.1 Requirements (Deferred)

### Dashboard Redesign (Wave 7)

- **DSH-01**: Dashboard complete redesign with premium aesthetic (deferred — UX specialist required)
- **DSH-02**: Activity heatmap showing practice frequency
- **DSH-03**: Progress tracking across techniques and frameworks
- **DSH-04**: Personalized recommendations based on practice history

## Out of Scope

| Feature | Reason |
|---------|--------|
| Real-time VCM labels | VCM analysis runs post-session only, labels never surfaced to user |
| Session replay with video | No video recording in current phase |
| Multiplayer/team features | Single-user focus for MVP |
| Mobile app (native) | Web app only, mobile-responsive |
| Authentication system | localStorage persistence sufficient for MVP |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DS-01 | Phase 1 | Pending |
| DS-02 | Phase 1 | Pending |
| DS-03 | Phase 1 | Pending |
| DS-04 | Phase 1 | Pending |
| DS-05 | Phase 1 | Pending |
| DS-06 | Phase 1 | Pending |
| CM-01 | Phase 2 | Pending |
| CM-02 | Phase 2 | Pending |
| CM-03 | Phase 2 | Pending |
| CM-04 | Phase 2 | Pending |
| CM-05 | Phase 2 | Pending |
| CM-06 | Phase 2 | Pending |
| ORB-01 | Phase 3 | Pending |
| ORB-02 | Phase 3 | Pending |
| ORB-03 | Phase 3 | Pending |
| ORB-04 | Phase 3 | Pending |
| ORB-05 | Phase 3 | Pending |
| ORB-06 | Phase 3 | Pending |
| ORB-07 | Phase 3 | Pending |
| TYP-01 | Phase 4 | Pending |
| TYP-02 | Phase 4 | Pending |
| TYP-03 | Phase 4 | Pending |
| TYP-04 | Phase 4 | Pending |
| TYP-05 | Phase 4 | Pending |
| TYP-06 | Phase 4 | Pending |
| LAY-01 | Phase 4 | Pending |
| LAY-02 | Phase 4 | Pending |
| LAY-03 | Phase 4 | Pending |
| SCR-01 | Phase 5 | Pending |
| SCR-02 | Phase 5 | Pending |
| SCR-03 | Phase 5 | Pending |
| SCR-04 | Phase 5 | Pending |
| SCR-05 | Phase 5 | Pending |
| SCR-06 | Phase 5 | Pending |
| SCR-07 | Phase 6 | Pending |
| SCR-08 | Phase 6 | Pending |
| SCR-09 | Phase 6 | Pending |
| SCR-10 | Phase 6 | Pending |
| SCR-11 | Phase 6 | Pending |
| SCR-12 | Phase 6 | Pending |
| VIS-01 | Phase 1-6 | Pending |
| VIS-02 | Phase 1-6 | Pending |
| VIS-03 | Phase 1-6 | Pending |
| VIS-04 | Phase 1-6 | Pending |
| VIS-05 | Phase 1-6 | Pending |
| VIS-06 | Phase 1-6 | Pending |

**Coverage:**
- v2.0 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-12*
*Last updated: 2026-02-12 after initial definition*
