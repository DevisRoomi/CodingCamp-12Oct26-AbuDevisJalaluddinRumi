# Design — Life Dashboard

## Visual Identity

The dashboard adopts an **editorial / typographic** aesthetic — clean white
space, serif headlines, and a strict monochromatic palette. The look is
intentionally magazine-like: borders replace shadows, transparency replaces
fills, and typography does the heavy lifting.

---

## Typography

| Role | Family | Weight / Style |
|------|--------|---------------|
| Clock, section titles, greeting, timer | Playfair Display | 400 (regular), 700 (bold), 400 italic |
| Body text, inputs, buttons, metadata | Inter | 300, 400, 500 |

Both families are loaded from Google Fonts via `<link>` preconnect + stylesheet
tags in `<head>`. No local font files are used.

---

## Colour System

All colours are declared as CSS custom properties on `:root` and overridden by
the `[data-theme="dark"]` attribute selector on `<html>`.

### Light Theme (default)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-color` | `#fafafa` | Page background |
| `--card-bg` | `#ffffff` | Card backgrounds |
| `--text-primary` | `#111111` | Headings, body text |
| `--text-secondary` | `#666666` | Hints, labels, muted text |
| `--accent-color` | `#000000` | Borders, primary button fill, interactive highlights |
| `--accent-hover` | `#333333` | Hover states on accent elements |
| `--border-color` | `#e0e0e0` | Card borders, list dividers, input borders |
| `--font-ui` | `'Inter', sans-serif` | — |
| `--font-display` | `'Playfair Display', serif` | — |

### Dark Theme (`[data-theme="dark"]`)
| Token | Value |
|-------|-------|
| `--bg-color` | `#121212` |
| `--card-bg` | `#1a1a1a` |
| `--text-primary` | `#f0f0f0` |
| `--text-secondary` | `#a0a0a0` |
| `--accent-color` | `#ffffff` |
| `--accent-hover` | `#cccccc` |
| `--border-color` | `#333333` |

Theme transitions are smoothed by `transition: background-color 0.4s ease, color 0.4s ease` on `body`.

---

## Layout

### Page Structure

```
body (padding: 2rem)
├── .bg-typography          ← fixed watermark behind all content
├── .theme-switch-wrapper   ← top-right Dark Mode button
└── .container (max-width: 1000px, centred)
    ├── .card.greeting-card ← full-width, top border accent
    └── .grid               ← 2-column CSS Grid
        ├── .card.timer-card
        ├── .card.todo-card
        └── .card.links-card
```

### Grid

The `.grid` uses `display: grid; grid-template-columns: 1fr 1fr; gap: 2rem`.
At ≤ 768 px the grid collapses to `1fr` (single column).

The Quick Links card (`links-card`) spans the full width implicitly because it
is the third child in a 2-column grid — it naturally occupies the next row
alone.

### Cards

Cards use `background: transparent` with a `1px solid var(--border-color)`
border and `backdrop-filter: blur(10px)`. The greeting card adds a 4 px solid
top border using `--accent-color` to give it editorial prominence.

---

## Background Watermark

A `<div class="bg-typography">` containing the owner's initials (`DEVIS`) is
`position: fixed`, centred with `translate(-50%, -50%)`, and sized at `28vw`
font-size. It uses `font-family: var(--font-display)` and an opacity of
`rgba(0,0,0,0.03)` (light) / `rgba(255,255,255,0.02)` (dark). It is purely
decorative (`pointer-events: none; z-index: -1; user-select: none`).

---

## Component Design

### Greeting Section
- **Clock** — `4.5rem` Playfair Display, weight 400, with a `–0.02em`
  letter-spacing for tighter elegance.
- **Date** — `0.85rem` Inter, uppercase, `0.1em` letter-spacing,
  `--text-secondary` colour.
- **Greeting line** — `2rem` Playfair Display italic. The name is a
  `contenteditable` `<span>` with a subtle bottom border underline. A
  `.hint` label in small uppercase tells the user it is editable.

### Focus Timer
- Timer display: `5rem` Playfair Display, weight 400.
- Three buttons in a row (`display: flex; gap: 1rem`):
  - **Start** → `.btn.primary` (filled accent)
  - **Stop** → `.btn.secondary` (ghost/outline)
  - **Reset** → `.btn.secondary`

### To-Do List
- Text input + **Add** button in a flush `.input-group` (no gap between
  input and button border edges).
- Each task is an `<li>` with a `1px` bottom border divider:
  - Left: checkbox + text (`.task-content`, `gap: 1rem`)
  - Right: **Delete** button (text-only, uppercase, `0.7rem`)
- Done tasks get `li.done span` → `text-decoration: line-through; font-style: italic; color: var(--text-secondary)`.

### Quick Links
- Same flush `.input-group` with two inputs (Title, URL) and **Save**.
- Links render as `.link-badge` elements inside a flex-wrap container
  (`display: flex; flex-wrap: wrap; gap: 0.75rem`).
- Each badge is a transparent bordered `<a>` tag with an inline `×`
  remove button.

### Buttons
| Class | Appearance |
|-------|-----------|
| `.btn.primary` | Filled `--accent-color`, text `--bg-color`; on hover: inverted (transparent bg, accent text) |
| `.btn.secondary` | Transparent bg, `--border-color` border; on hover: border becomes `--accent-color` |
| `.btn-minimal` | No border, no bg, `--text-secondary` text; used for the theme toggle |

All `.btn` elements share `text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s ease`.

---

## Responsive Breakpoints

| Breakpoint | Change |
|------------|--------|
| > 768 px | 2-column grid |
| ≤ 768 px | 1-column grid; watermark font-size scales to `40vw` |

---

## Theme Toggle UX

The toggle button is labelled **"Dark Mode"** in light theme. It lives in
`.theme-switch-wrapper` (flex, `justify-content: flex-end`) above the main
container. The button uses `.btn-minimal` — no border, understated, in keeping
with the editorial style. No icon is used; the text label communicates intent.
