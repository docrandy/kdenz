# DENZ Communication Platform --- Condensed Spec

## Core Philosophy

-   Primary action: Practice (Voice / Skills / Simulation)
-   AI runs in background, subtle and contextual
-   User remains in control
-   Insights are discoverable, not forced
-   Personalization happens passively over time

------------------------------------------------------------------------

## Site Architecture

### Pages

-   Dashboard (landing)
-   Vocal Performance Lab
-   Applied Skills Lab
-   Simulation Studio
-   Performance (analytics)
-   Session History
-   Insights
-   Personalization & Feedback
-   Settings

------------------------------------------------------------------------

## Navigation Structure

``` mermaid
flowchart TD
    A[Sidebar] --> B[PERFORMANCE]
    B --> B1[Dashboard]
    B --> B2[Performance]

    A --> C[TRAINING]
    C --> C1[Vocal Performance Lab]
    C --> C2[Applied Skills Lab]
    C --> C3[Simulation Studio]

    A --> D[SYSTEM]
    D --> D1[Session History]
    D --> D2[Insights]
    D --> D3[Personalization & Feedback]
    D --> D4[Settings]
```

------------------------------------------------------------------------

## Dashboard Layout

### Header

-   Left: Communication Index score + mini trends
-   Right: Profile + quick actions
-   Small indicator for new AI insights

### Row 1 --- Primary Actions

-   Vocal Performance → Start Practice → Progress
-   Applied Skills → Launch Drill → Progress
-   Simulation → Enter Simulation → Status

### Row 2 --- Contextual Insights

-   Quick Snapshot (clickable metrics)
    -   Filler rate
    -   Delivery score
    -   Volume percentile
-   Recent sessions (last 3 summaries)

### Row 3 --- AI Suggestions (collapsible)

-   Suggested next drills
-   Progress-based recommendations

------------------------------------------------------------------------

## Metric Interaction Model

Click metric → modal: - Time graph - Toggle: 7d / 30d / All time -
Session breakdown - Close returns to dashboard

------------------------------------------------------------------------

## Empty States

-   New user message: "Start your first session to generate insights"
-   Minimal guidance, non-intrusive

------------------------------------------------------------------------

## Mobile Behavior

-   Tablet responsive
-   Phone:
    -   Simplified dashboard
    -   CTA recommending mobile app
    -   Still functional

------------------------------------------------------------------------

## Tech Stack

### Preferred

-   React
-   Tailwind CSS
-   Chart.js or Recharts
-   Framer Motion

### Reasons

-   API-ready
-   Reusable components
-   Fast iteration
-   Scalable

### Simpler Alternative

-   HTML / CSS / JS
-   Migrate later if needed

------------------------------------------------------------------------

## Design System

### Typography

-   Font: Inter or SF Pro
-   Weights:
    -   Headings: 600
    -   Body: 400

### Sizes

-   H1: 32px
-   H2: 24px
-   H3: 20px
-   Body: 16px
-   Small: 14px
-   Tiny: 12px

### Spacing Scale

4 / 8 / 16 / 24 / 32 / 48 / 64 px

### Components

-   Primary button: strong CTA
-   Secondary button: outlined
-   Cards: rounded, subtle elevation
-   Icons: consistent set

------------------------------------------------------------------------

## Training Areas

### Vocal Performance Lab

-   Modes: Instructor / Intermediate / Advanced
-   Real-time feedback:
    -   Filler usage
    -   Delivery confidence
    -   Volume
-   Recent sessions
-   Start Practice CTA

### Applied Skills Lab

-   Drill types:
    -   Labeling
    -   Accusation Audit
    -   Mirroring
-   Progress tracking
-   Launch drill + scoring

### Simulation Studio

-   Scenario selection
-   Difficulty levels
-   AI dialogue practice
-   Recording + playback
-   Performance scoring

------------------------------------------------------------------------

## Analytics Layer

### Performance

-   Deep metrics dashboard
-   Time comparisons
-   Filters: date, type
-   Export reports

### Session History

-   Table of sessions
-   Filters
-   Drilldown view
-   Export options

### Insights

-   AI trend analysis
-   Strengths / gaps
-   Suggested practice plans

### Personalization & Feedback

-   Preferences
-   Goal setting
-   Feedback controls
-   Notification settings

### Settings

-   Account
-   Privacy
-   Integrations
-   Future theme toggle
