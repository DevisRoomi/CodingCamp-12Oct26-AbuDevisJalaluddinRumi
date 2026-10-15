# Structure — Life Dashboard

## File Tree

```
codingcamp_revou/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── .kiro/
    └── specs/
        ├── requirements.md
        ├── design.md
        └── structure.md        ← this file
```

No build tool, package manager, or configuration file is required. Open
`index.html` directly in any modern browser.

---

## index.html

**Purpose:** Single page shell. Declares all DOM elements consumed by
`script.js` and links the stylesheet and script.

### Key IDs & Elements

| Element | ID / Class | Purpose |
|---------|-----------|---------|
| `<html>` | `data-theme="light"` | Theme attribute toggled by JS |
| `<div>` | `.bg-typography` | Fixed watermark text |
| `<button>` | `#theme-toggle` | Light/Dark toggle |
| `<div>` | `.container` | Centred page wrapper |
| `<h1>` | `#time-display` | Live clock |
| `<p>` | `#date-display` | Live date |
| `<h2>` | `#greeting-text` | Greeting sentence |
| `<span>` | `#greeting-time` | Dynamic period (Morning/Afternoon/Evening) |
| `<span>` | `#user-name` | `contenteditable` name |
| `<div>` | `.grid` | 2-column CSS Grid container |
| `<div>` | `#timer-display` | Pomodoro countdown |
| `<button>` | `#start-btn` | Timer start |
| `<button>` | `#stop-btn` | Timer stop/pause |
| `<button>` | `#reset-btn` | Timer reset |
| `<input>` | `#task-input` | New task text field |
| `<button>` | `#add-task-btn` | Add task |
| `<ul>` | `#task-list` | Rendered task items |
| `<input>` | `#link-name` | Link label field |
| `<input>` | `#link-url` | Link URL field |
| `<button>` | `#add-link-btn` | Save link |
| `<div>` | `#links-container` | Rendered link badges |

### External Resources
- `https://fonts.googleapis.com` — Playfair Display + Inter (preconnect + stylesheet)
- `css/style.css` — local stylesheet
- `js/script.js` — local script (deferred by placement at bottom of `<body>`)

---

## css/style.css

**Purpose:** All visual styling. No preprocessor. Single flat file.

### Section Order

| Section | Selectors | Description |
|---------|-----------|-------------|
| CSS Variables | `:root`, `[data-theme="dark"]` | Colour and font tokens |
| Reset | `*`, `body` | Box-sizing, margin/padding reset, base body styles |
| Watermark | `.bg-typography` | Fixed full-viewport decorative text |
| Layout | `.theme-switch-wrapper`, `.container`, `.card`, `.grid` | Page scaffolding |
| Greeting Card | `.greeting-card`, `#time-display`, `#date-display`, `#greeting-text`, `#user-name`, `.hint` | Clock/greeting section styles |
| Inputs | `input` | Base input styles |
| Buttons | `.btn`, `.primary`, `.secondary`, `.btn-minimal` | Button variants |
| Timer | `.timer-card`, `#timer-display`, `.controls` | Pomodoro styles |
| To-Do List | `ul`, `li`, `li.done`, `.task-content`, `.delete-btn` | Task list styles |
| Quick Links | `#links-container`, `.link-badge`, `.remove-link` | Link badge styles |
| Responsive | `@media (max-width: 768px)` | Single-column reflow |

---

## js/script.js

**Purpose:** All interactivity and business logic. No frameworks. No modules.
Single flat script, executed after DOM is ready (script tag at bottom of body).

### Logical Sections

#### 1. Light / Dark Mode & Name Edit (Challenge)

```
localStorage key: 'theme'   → 'light' | 'dark'
localStorage key: 'username' → string
```

- Reads `localStorage.getItem('theme')` on startup; applies
  `data-theme="dark"` to `<html>` if stored.
- `#theme-toggle` click handler flips `isDark` boolean, updates attribute,
  and persists to `localStorage`.
- `#user-name` (`contenteditable`): on `blur` → saves to `localStorage`;
  on `keypress Enter` → calls `.blur()` to confirm.

#### 2. Greeting & Clock

```
setInterval(updateClock, 1000)
```

`updateClock()` reads `new Date()` and:
- Sets `#time-display` via `toLocaleTimeString('en-US', { hour12: false })`.
- Sets `#date-display` via `toLocaleDateString('en-US', { weekday, year, month, day })`.
- Derives greeting period from `now.getHours()` and sets `#greeting-time`.

#### 3. Focus Timer

```
State variables: timerInterval (setInterval ref), timeLeft (number, seconds)
```

| Button | Behaviour |
|--------|-----------|
| `#start-btn` | Guards with `if (!timerInterval)`, starts `setInterval` that decrements `timeLeft` each second and calls `updateTimerDisplay()`. At zero: clears interval, fires `alert`. |
| `#stop-btn` | Clears `timerInterval`, sets it to `null`. |
| `#reset-btn` | Clears interval, resets `timeLeft = 25 * 60`, calls `updateTimerDisplay()`. |

`updateTimerDisplay()` pads minutes and seconds to 2 digits and writes to
`#timer-display`.

#### 4. To-Do List

```
localStorage key: 'tasks' → JSON array of { text: string, done: boolean }
```

| Function | Description |
|----------|-------------|
| `renderTasks()` | Clears `#task-list`, iterates `tasks`, creates `<li>` with checkbox, text, delete button. Attaches `toggleTask(index)` and `deleteTask(index)` via `onclick` and global `window` assignment. |
| Add button click | Trims input, checks for case-insensitive duplicate (`tasks.some`), alerts if found, otherwise pushes `{ text, done: false }` and persists. |
| `toggleTask(index)` | Flips `tasks[index].done`, persists, re-renders. |
| `deleteTask(index)` | Splices `tasks` array, persists, re-renders. |

Both `toggleTask` and `deleteTask` are assigned to `window` so they can be
called from inline `onclick` attributes in dynamically created HTML.

#### 5. Quick Links

```
localStorage key: 'links' → JSON array of { name: string, url: string }
```

| Function | Description |
|----------|-------------|
| `renderLinks()` | Clears `#links-container`, iterates `links`, creates `<a class="link-badge">` elements with an inline `×` remove button. |
| Add button click | Trims name and url inputs; if url lacks `http` prefix, prepends `https://`; pushes `{ name, url }`, persists, re-renders. |
| `deleteLink(index)` | Splices `links`, persists, re-renders. Attached to `window` for use in inline `onclick`. Uses `event.preventDefault()` to stop the parent anchor from navigating. |

---

## localStorage Keys Reference

| Key | Type | Default | Owner |
|-----|------|---------|-------|
| `theme` | `string` (`'light'`\|`'dark'`) | absent | Theme module |
| `username` | `string` | `'User'` | Name module |
| `tasks` | `JSON string` (array) | `'[]'` | To-Do module |
| `links` | `JSON string` (array) | `'[]'` | Quick Links module |

---

## Data Flow Diagram

```
User Action
    │
    ▼
DOM Event Listener (script.js)
    │
    ├─► Update in-memory array / variable
    │
    ├─► localStorage.setItem(key, JSON.stringify(value))
    │
    └─► render*() → innerHTML rebuild → DOM updated

Page Load
    │
    ├─► localStorage.getItem('theme')  → applyTheme()
    ├─► localStorage.getItem('username') → #user-name.textContent
    ├─► localStorage.getItem('tasks')  → tasks[] → renderTasks()
    └─► localStorage.getItem('links')  → links[] → renderLinks()
```
