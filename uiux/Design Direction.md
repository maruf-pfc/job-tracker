# Job Tracker — UI/UX Design Direction

## Product Vision

This project is not a generic admin dashboard.

It is:

- a personal career operating system
- a job application workflow manager
- a productivity-focused analytics platform
- a personal CRM for job hunting
- a data-driven career dashboard

The interface should help users:

- stay organized
- track opportunities
- analyze progress
- reduce cognitive overload
- make faster decisions
- maintain momentum during job searching

The UI should feel:

```txt
Calm
Focused
Professional
Structured
Analytical
Low-distraction
```

NOT:

```txt
Flashy
Futuristic
Neon
Over-animated
Crypto-style
AI-generated aesthetic
```

## Core Design Philosophy

This application is primarily:

- table-driven
- workflow-driven
- status-driven
- analytics-driven
- productivity-oriented

The UI should prioritize:

- readability
- spacing
- consistency
- scanability
- fast interaction
- long-session comfort

The design should disappear behind the workflow.

A user should feel:

> “I know exactly where my career pipeline stands.”

## Style Keywords

- Human-designed
- Clean
- Functional
- Professional
- Calm
- Focused
- Productive
- Soft contrast
- Data-focused
- Career-oriented
- Structured
- Minimal distraction

## Visual Personality

The interface should visually feel similar to:

```txt
Linear
Notion
Airtable
Attio CRM
Modern productivity software
Internal company systems
```

NOT:

```txt
Dribbble concept UI
Crypto exchange dashboard
Gaming interface
Glassmorphism showcase
AI startup landing page
```

## Color Philosophy

Every color must have meaning.

Avoid decorative or random colors.

Use color for:

- hierarchy
- status
- actions
- feedback
- navigation state
- readability

Most of the interface should remain neutral.

Recommended balance:

```txt
80% neutral colors
15% semantic/status colors
5% accent colors
```

This creates a mature and believable product experience.

## Primary Color Palette

### Core Theme

| Purpose        | Hex       | Tailwind    |
| -------------- | --------- | ----------- |
| Background     | `#F8FAFC` | `slate-50`  |
| Surface/Card   | `#FFFFFF` | `white`     |
| Border         | `#E2E8F0` | `slate-200` |
| Divider        | `#F1F5F9` | `slate-100` |
| Text Primary   | `#0F172A` | `slate-900` |
| Text Secondary | `#475569` | `slate-600` |
| Text Muted     | `#94A3B8` | `slate-400` |
| Primary        | `#2563EB` | `blue-600`  |
| Primary Hover  | `#1D4ED8` | `blue-700`  |

This palette:

- feels human-designed
- avoids visual fatigue
- supports long work sessions
- keeps tables readable
- works well with analytics dashboards
- looks like real productivity software

## Semantic Status Colors

Status colors are extremely important because this application is heavily workflow-based.

### Application Statuses

| Status    | Color  |
| --------- | ------ |
| Saved     | Slate  |
| Applied   | Blue   |
| Screening | Amber  |
| Interview | Violet |
| Offer     | Green  |
| Rejected  | Red    |
| Ghosted   | Zinc   |
| Withdrawn | Orange |

### Tailwind Examples

| Status    | Tailwind                        |
| --------- | ------------------------------- |
| Applied   | `bg-blue-100 text-blue-700`     |
| Screening | `bg-amber-100 text-amber-700`   |
| Interview | `bg-violet-100 text-violet-700` |
| Offer     | `bg-green-100 text-green-700`   |
| Rejected  | `bg-red-100 text-red-700`       |

Status colors should:

- be subtle
- remain readable
- avoid saturation
- support quick scanning

## Layout Direction

### Main Layout

```txt
bg-slate-50
text-slate-900
```

The application should feel spacious and breathable.

Avoid overly dense layouts.

## Sidebar Design

The sidebar should feel:

- stable
- calm
- productivity-focused
- enterprise-inspired

### Sidebar Colors

| Element     | Color     |
| ----------- | --------- |
| Sidebar BG  | `#0F172A` |
| Active Item | `#1E293B` |
| Hover       | `#334155` |
| Text        | `#CBD5E1` |
| Active Text | `#FFFFFF` |

### Tailwind

```txt
bg-slate-900
bg-slate-800
hover:bg-slate-700
text-slate-300
```

This creates:

- strong navigation hierarchy
- professional structure
- focused workspace feeling

## Sidebar Structure

Navigation should be grouped clearly.

```txt
Dashboard

Applications
Companies
Interviews

Templates
Template Categories

Analytics

Settings
```

Avoid overly deep navigation trees.

## Card Design

Cards should feel soft, structured, and functional.

### Card Style

```txt
bg-white
border border-slate-200
rounded-2xl
shadow-sm
```

Avoid:

- heavy shadows
- glass effects
- glowing borders
- dramatic elevation

The UI should rely more on:

- spacing
- borders
- layout consistency

than visual effects.

## Table Design Philosophy

Tables are one of the most important parts of this application.

The product lives inside tables.

Optimize for:

- scanability
- status visibility
- readable density
- quick updates
- filtering
- sorting

## Table Design

### Header

```txt
bg-slate-100
text-slate-700
```

### Rows

```txt
hover:bg-slate-50
border-b border-slate-100
```

### Optional Zebra Rows

```txt
odd:bg-white
even:bg-slate-50/40
```

### Recommended Spacing

```txt
px-4 py-3
```

Never allow tables to feel cramped.

## Filter UX

Filtering is a major workflow component.

Filters should feel:

- lightweight
- fast
- predictable
- productivity-oriented

Example:

```txt
[Search Applications...]

[Status ▼]
[Platform ▼]
[Priority ▼]
[Applied This Week ▼]

[Clear Filters]
```

Avoid oversized filter sections.

Compact controls improve usability.

## Form Design Direction

Forms should feel:

- organized
- fast
- lightweight
- low-friction

Avoid giant overwhelming forms.

## Sectioned Forms

Large forms should be divided into logical sections.

Example:

### Job Information

- role
- company
- location

### Application Details

- status
- applied date
- CV version

### Notes & Insights

- follow-up notes
- company culture notes
- interview feedback

This reduces cognitive load significantly.

## Input Design

### Input Style

```txt
border border-slate-300
bg-white
rounded-xl
px-3 py-2.5
focus:ring-2 focus:ring-blue-500
focus:border-blue-500
```

Inputs should feel:

- calm
- clean
- readable
- easy to scan

## Button Philosophy

Avoid:

- giant rounded buttons
- gradients
- glowing effects
- aggressive shadows

Use:

```txt
rounded-lg
px-4 py-2
font-medium
transition-colors
```

### Primary Button

```txt
bg-blue-600
hover:bg-blue-700
text-white
```

Buttons should communicate confidence without demanding attention.

## Typography

## Primary Font

Use Inter.

Why:

- excellent readability
- dashboard friendly
- strong numeric rendering
- industry standard for productivity software
- works extremely well for tables and analytics

## Typography Scale

### Page Titles

```txt
text-2xl font-semibold tracking-tight
```

### Section Titles

```txt
text-lg font-semibold
```

### Body Text

```txt
text-sm text-slate-600
```

### Table Text

```txt
text-sm leading-5
```

Good typography contributes more to professional appearance than decorative visuals.

## Dashboard Feel

The dashboard should feel like:

```txt
A career operations center
A personal analytics workspace
A focused productivity dashboard
```

NOT:

```txt
A finance trading dashboard
A social media analytics page
A startup landing page
```

## Dashboard Widgets

Widgets should prioritize information clarity.

## Widget Style

```txt
rounded-2xl
bg-white
border border-slate-200
p-5
```

Spacing is more important than decoration.

## Suggested Dashboard Metrics

### KPI Cards

- Applications Sent
- Interview Rate
- Offer Rate
- Rejection Rate
- Response Rate

### Charts

- Applications per Month
- Status Distribution
- Source Platform Success
- Salary Distribution
- Interview Pipeline

Charts should feel subtle and readable.

Avoid:

- rainbow charts
- neon gradients
- exaggerated visuals

## Analytics Philosophy

Analytics should help users answer questions.

Examples:

- Which platforms generate interviews?
- Which roles get callbacks?
- Which templates work best?
- How long does response time usually take?
- Which companies appear most often?

Analytics should support decision-making.

## Template System UX

The template system should feel:

- reusable
- organized
- productivity-focused
- fast to access

The workflow should optimize:

```txt
Open → Copy → Paste → Done
```

## Template Card Design

Each template card should include:

```txt
Title
Category Badge
Preview Text
Copy Button
Last Used
```

Avoid overly decorative layouts.

Templates are utility-focused.

## Empty States

Empty states should feel:

- calm
- encouraging
- professional

Example:

```txt
No applications tracked yet.

Start by saving your first opportunity.
```

Avoid:

- memes
- mascots
- overly playful messaging

## Motion & Animation

Animation should remain minimal.

Use motion only for:

- dropdowns
- modals
- page transitions
- loading states

Avoid:

- bouncing elements
- floating cards
- dramatic motion
- excessive animation

The interface should feel stable.

## Skeleton Loading

Prefer subtle skeleton loaders over large spinners.

Example:

```txt
bg-slate-200 animate-pulse
```

This feels smoother and more professional.

## Mobile Philosophy

This application is desktop-first.

That is acceptable because:

- job tracking is data-heavy
- analytics require space
- forms are complex
- tables are core to the experience

Mobile should:

- work properly
- support quick updates
- support reviewing data

But desktop UX should remain the priority.

## Dark Mode Strategy

Prioritize light mode first.

The design system should support future dark mode expansion.

Light mode is preferable initially because:

- tables remain easier to scan
- forms remain more readable
- operational software performs better visually in light themes

## Human-Centered Design Principles

The application should feel intentionally designed by humans.

Avoid common AI-generated UI patterns:

```txt
Purple/cyan gradients
Glassmorphism everywhere
Random neon highlights
Oversaturated color palettes
Massive shadows
Decorative blur effects
```

Instead prioritize:

```txt
Consistency
Hierarchy
Readability
Spacing
Workflow clarity
Long-session usability
```

A mature interface is usually:

- quiet
- predictable
- spacious
- restrained
- highly usable

## Overall UX Goal

The final product should feel:

```txt
Organized
Focused
Professional
Actionable
Reliable
```

The UI should support thinking and workflow.

Not visual entertainment.

## Recommended Shared UI Components

### Layout

```txt
AppShell
Sidebar
Topbar
PageContainer
SectionHeader
```

### Data Display

```txt
DataTable
StatusBadge
MetricCard
AnalyticsCard
EmptyState
```

### Forms

```txt
FormInput
FormSelect
FormTextarea
FormDatePicker
FormSection
```

### Feedback

```txt
Skeleton
ConfirmDialog
Toast
LoadingOverlay
```

## Final Design Principle

Optimize for:

```txt
clarity over creativity
```

This is operational productivity software.

The most impressive dashboards are usually:

- readable
- structured
- calm
- consistent
- workflow-focused

not flashy.
