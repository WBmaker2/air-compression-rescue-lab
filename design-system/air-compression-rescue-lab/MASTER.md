# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Air Compression Rescue Lab
**Generated:** 2026-08-30 13:37:39
**Category:** Interactive Education / Science Lab

---

## Project Adaptation (takes precedence)

The database result supplied an immersive interaction pattern, but its default HUD/Sci-Fi visual language, neon palette, dark mode, and external Google Fonts are not appropriate for this light-only elementary classroom app. The implementation uses the following project-specific translation while keeping the useful interaction guidance:

- **Visual direction:** bright observation notebook and virtual lab bench; the syringe model and evidence stay central.
- **Interaction pattern:** guided, one-action-at-a-time flow with visible progress, keyboard focus, a back path, reduced-motion fallback, and a mobile reading order of task → model → evidence → action.
- **Theme:** light mode only. Do not add dark-mode or `prefers-color-scheme` overrides.
- **Typography:** existing local/system Korean stack; do not add remote font requests.
- **Color translation:** navy ink `#17233C`, action blue `#2457C5`, warm paper `#F7F5EF`, white surface `#FFFFFF`, amber attention `#B96916`, teal success `#147D75`, red caution `#B4473F`, and ink border `#D7D9D4`.
- **Effects:** restrained paper grid, thin borders, small shadows, and the existing `gi-pulse` only on required next actions. No neon glow, scanning ticker, blur-heavy glass, 3D, or full-screen takeover.
- **Content integrity:** preserve the approved six finite-state missions and factual inline SVG; decorative imagery may support atmosphere but cannot encode a scientific result.

These overrides are the source of truth for this repository.

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#00FFFF` | `--color-primary` |
| On Primary | `#0F172A` | `--color-on-primary` |
| Secondary | `#7B61FF` | `--color-secondary` |
| On Secondary | `#000000` | `--color-on-secondary` |
| Accent/CTA | `#FF00FF` | `--color-accent` |
| On Accent/CTA | `#000000` | `--color-on-accent` |
| Background | `#050510` | `--color-background` |
| Foreground | `#E0E0FF` | `--color-foreground` |
| Card | `#101823` | `--color-card` |
| Card Foreground | `#E0E0FF` | `--color-card-foreground` |
| Muted | `#1D1D28` | `--color-muted` |
| Muted Foreground | `#94A3B8` | `--color-muted-foreground` |
| Border | `#333344` | `--color-border` |
| Destructive | `#EF4444` | `--color-destructive` |
| On Destructive | `#000000` | `--color-on-destructive` |
| Ring | `#00FFFF` | `--color-ring` |

**Color Notes:** Quantum cyan + interference purple

### Typography

- **Heading Font:** Exo
- **Body Font:** Roboto Mono
- **Mood:** science, technology, research, data, futuristic, precise
- **Google Fonts:** [Exo + Roboto Mono](https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Exo:wght@300;400;500;600;700&family=Roboto+Mono:wght@300;400;500;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #FF00FF;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #00FFFF;
  border: 2px solid #00FFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #050510;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #00FFFF;
  outline: none;
  box-shadow: 0 0 0 3px #00FFFF20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** HUD / Sci-Fi FUI

**Keywords:** Futuristic, technical, wireframe, neon, data, transparency, iron man, sci-fi, interface

**Best For:** Sci-fi games, space tech, cybersecurity, movie props, immersive dashboards

**Key Effects:** Glow effects, scanning animations, ticker text, blinking markers, fine line drawing

### Page Pattern

**Pattern Name:** Immersive/Interactive Experience

- **Conversion Strategy:** Measure engagement for the specific audience and device mix. Performance trade-off. Provide skip option. Mobile fallback essential. Provide skip, keyboard, reduced-motion, and non-3D fallback paths. Pause animation when offscreen/hidden and preserve the completed final state when reduced motion is enabled.
- **CTA Placement:** After interaction complete + Skip option for impatient users
- **Section Order:** Full-screen interactive element > Guided product tour > Key benefits revealed > CTA after completion

---

## Anti-Patterns (Do NOT Use)

- ❌ Generic tech design
- ❌ No viz

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
