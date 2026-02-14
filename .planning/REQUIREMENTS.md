# Requirements: v2.0 - Dark Premium Transformation

**Defined:** 2026-02-12
**Core Value:** Users practice negotiation and difficult conversation techniques in a premium, professional interface that signals expertise and quality.

## v2.0 Requirements

### Design System Foundation (Wave 1)

- [x] **DS-01**: Tailwind config updated with dark premium color palette (navy bg, gold accent, cream text)
- [x] **DS-02**: CSS custom properties defined for all semantic tokens (background, surface, text, accent, status colors)
- [x] **DS-03**: Typography scale defined (Cormorant Garamond for headings, Outfit for body, 8px baseline grid)
- [x] **DS-04**: Spacing system established (4px/8px/12px/16px/24px increments)
- [x] **DS-05**: Component variants for dark mode (buttons, inputs, cards follow new palette)
- [x] **DS-06**: index.css updated with base styles for dark premium theme

### Color Migration (Wave 2)

- [x] **CM-01**: All accent colors changed from teal (#00D4FF) to gold (#c9a84c) (~51 files)
- [x] **CM-02**: Background colors migrated from white to dark navy (#0b0e14)
- [x] **CM-03**: Surface colors (cards, panels) updated to #131720
- [x] **CM-04**: Text colors changed to warm cream (#e8e2d6)
- [x] **CM-05**: Semantic colors established (status: green/rose/blue on dark background)
- [x] **CM-06**: Build verified with no visual regressions

### SessionOrb Redesign (Wave 3)

- [x] **ORB-01**: New orb visual with gold radial gradient replacing current green
- [x] **ORB-02**: Three concentric animated rings (outer: slow rotation, middle: medium pulse, inner: fast flicker)
- [x] **ORB-03**: Orb responds to microphone input (rings brighten with voice volume)
- [x] **ORB-04**: Mic icon displayed center of orb in idle state
- [x] **ORB-05**: Stop square icon overlays orb when recording active
- [x] **ORB-06**: Smooth transitions between idle/recording/analyzing states
- [x] **ORB-07**: Mobile responsive at 320px+ screens

### Typography & Layout (Wave 4)

- [x] **TYP-01**: Cormorant Garamond imported and applied to all headings (h1-h6)
- [x] **TYP-02**: Outfit sans-serif imported and applied to body text, labels, buttons
- [x] **TYP-03**: Heading sizes follow typographic scale (h1: 48px, h2: 36px, h3: 28px on desktop)
- [x] **TYP-04**: Mobile-first layout: 420px minimum width baseline
- [x] **TYP-05**: Line heights optimized for readability (1.5 for body, 1.2 for headings)
- [x] **TYP-06**: Letter spacing adjusted for premium feel (headings: +1px, body: normal)
- [x] **LAY-01**: Full page layout uses dark premium spacing (24px gutters desktop, 16px mobile)
- [x] **LAY-02**: Card-based sections with subtle borders (#1f2937) on dark backgrounds
- [x] **LAY-03**: Maximum content width 1200px, centered on desktop

### New Screens — Core Flow (Wave 5)

- [x] **SCR-01**: Welcome screen redesigned with premium hero section + 3-step intro
- [x] **SCR-02**: Pre-session screen shows technique briefing, success criteria, ai persona preview
- [x] **SCR-03**: Recording screen displays new SessionOrb, shows practice prompt, has start/stop controls
- [x] **SCR-04**: Recording screen shows real-time metrics (minimal: WPM + filler count at bottom)
- [x] **SCR-05**: Post-session screen (3 tabs): Coaching, Voice Analytics, Transcript
- [x] **SCR-06**: Navigation between screens smooth with consistent header/footer placement

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
| DS-01 | Phase 11 | Complete |
| DS-02 | Phase 11 | Complete |
| DS-03 | Phase 11 | Complete |
| DS-04 | Phase 11 | Complete |
| DS-05 | Phase 11 | Complete |
| DS-06 | Phase 11 | Complete |
| CM-01 | Phase 12 | Complete |
| CM-02 | Phase 12 | Complete |
| CM-03 | Phase 12 | Complete |
| CM-04 | Phase 12 | Complete |
| CM-05 | Phase 12 | Complete |
| CM-06 | Phase 12 | Complete |
| ORB-01 | Phase 13 | Complete |
| ORB-02 | Phase 13 | Complete |
| ORB-03 | Phase 13 | Complete |
| ORB-04 | Phase 13 | Complete |
| ORB-05 | Phase 13 | Complete |
| ORB-06 | Phase 13 | Complete |
| ORB-07 | Phase 13 | Complete |
| TYP-01 | Phase 14 | Complete |
| TYP-02 | Phase 14 | Complete |
| TYP-03 | Phase 14 | Complete |
| TYP-04 | Phase 14 | Complete |
| TYP-05 | Phase 14 | Complete |
| TYP-06 | Phase 14 | Complete |
| LAY-01 | Phase 14 | Complete |
| LAY-02 | Phase 14 | Complete |
| LAY-03 | Phase 14 | Complete |
| SCR-01 | Phase 15 | Complete |
| SCR-02 | Phase 15 | Complete |
| SCR-03 | Phase 15 | Complete |
| SCR-04 | Phase 15 | Complete |
| SCR-05 | Phase 15 | Complete |
| SCR-06 | Phase 15 | Complete |
| SCR-07 | Phase 16 | Pending |
| SCR-08 | Phase 16 | Pending |
| SCR-09 | Phase 16 | Pending |
| SCR-10 | Phase 16 | Pending |
| SCR-11 | Phase 16 | Pending |
| SCR-12 | Phase 16 | Pending |
| VIS-01 | Phase 11-16 | Pending |
| VIS-02 | Phase 11-16 | Pending |
| VIS-03 | Phase 11-16 | Pending |
| VIS-04 | Phase 11-16 | Pending |
| VIS-05 | Phase 11-16 | Pending |
| VIS-06 | Phase 11-16 | Pending |

**Coverage:**
- v2.0 requirements: 44 total
- Mapped to phases: 44
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-12*
*Last updated: 2026-02-14 - Phase 15 requirements (SCR-01 to SCR-06) marked Complete*
