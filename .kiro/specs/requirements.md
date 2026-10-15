# Requirements — Life Dashboard

## Project Overview

Life Dashboard is a single-page, browser-only personal productivity tool built
with plain HTML, CSS, and Vanilla JavaScript. It has no build step, no backend,
and no external runtime dependencies beyond two Google Fonts. All persistent
state is stored in the browser's `localStorage`.

The design follows an editorial / typographic aesthetic using
**Playfair Display** (display/headings) and **Inter** (body/UI) with a
minimalist black-and-white palette that adapts to a dark theme.

---

## Functional Requirements

### FR-01 — Real-Time Clock & Date Display
- The dashboard shall display a live clock updating every second in `HH:MM:SS`
  (24-hour) format using `toLocaleTimeString('en-US', { hour12: false })`.
- The current date shall be displayed below the clock in the format
  `Weekday, Month Day, Year` using `toLocaleDateString`.
- Both values shall update via `setInterval` at a 1 000 ms interval.

### FR-02 — Contextual Greeting
- A greeting header shall read: *"Good [Period], [Name]."*
- The period token (`Morning` / `Afternoon` / `Evening`) shall be determined
  from the current hour:
  - 05:00–11:59 → `Morning`
  - 12:00–17:59 → `Afternoon`
  - 18:00–04:59 → `Evening`
- The greeting period shall update in sync with the clock interval.

### FR-03 — Editable User Name
- The name displayed in the greeting (`<span id="user-name">`) shall be
  rendered as a `contenteditable` element so the user can click and type
  directly.
- On `blur`, the new value shall be written to `localStorage` under the key
  `username`.
- On page load, the stored name shall be restored; if absent the default
  `"User"` is shown.
- Pressing **Enter** shall confirm the edit (call `.blur()`).

### FR-04 — Focus Timer (Pomodoro)
- The timer shall count down from **25:00** (1 500 seconds).
- Three controls shall be provided:
  - **Start** — begins the countdown; pressing again while running has no
    effect (guard: `if (!timerInterval)`).
  - **Stop** — pauses the countdown without resetting.
  - **Reset** — stops and restores `25:00`.
- When the countdown reaches zero, the timer shall stop and display a
  browser `alert('Focus time is up!')`.
- Timer state is **not** persisted to `localStorage` (intentional — resets
  on page reload).

### FR-05 — To-Do List with Duplicate Prevention
- The user shall be able to add text tasks via a text input and an **Add**
  button.
- Before inserting, the app shall check whether a task with the same text
  (case-insensitive) already exists in the `tasks` array. If found, a
  browser `alert('This task already exists!')` is shown and no item is added.
- Each task item shall display:
  - A checkbox — toggling it marks the task `done` (strike-through + muted
    italic style) or undone.
  - The task text.
  - A **Delete** button that removes the item from the list.
- The full `tasks` array (objects `{ text, done }`) shall be serialised to
  `localStorage` under key `tasks` after every add, toggle, and delete.
- On page load the persisted tasks shall be restored and rendered.

### FR-06 — Quick Links (Directory)
- The user shall be able to save a named hyperlink by entering a **Title**
  and a **URL**, then clicking **Save**.
- If the URL does not start with `http`, the prefix `https://` shall be
  prepended automatically.
- Each saved link shall be rendered as a badge (`<a class="link-badge">`)
  that opens in a new tab (`target="_blank"`).
- Each badge shall include a remove button (`×`) that deletes the link from
  the list and from `localStorage`.
- The full `links` array (objects `{ name, url }`) shall be persisted under
  key `links`.
- On page load the persisted links shall be restored and rendered.

### FR-07 — Light / Dark Mode Toggle (Challenge)
- A **"Dark Mode"** button in the top-right corner shall toggle between the
  light and dark theme.
- Toggling shall set `data-theme="dark"` on `<html>` (or remove it for
  light) and persist the preference to `localStorage` under key `theme`.
- On page load, the stored theme shall be applied immediately before render
  to avoid a flash.
- CSS custom properties (`--bg-color`, `--card-bg`, `--text-primary`, etc.)
  shall drive all colour values so a single attribute change cascades to the
  entire UI.

---

## Non-Functional Requirements

| ID    | Category       | Requirement |
|-------|----------------|-------------|
| NF-01 | Compatibility  | Must run in any modern browser (Chrome, Firefox, Safari, Edge) without a build step or server. |
| NF-02 | Performance    | No framework or bundler. Page weight is determined only by two Google Font families and the project's own assets. |
| NF-03 | Persistence    | All user data (name, theme, tasks, links) must survive a full page reload via `localStorage`. |
| NF-04 | Accessibility  | Interactive elements must be keyboard-operable. `contenteditable` name field must be clearly indicated (underline hint). |
| NF-05 | Responsiveness | Layout must reflow to a single column on screens narrower than 768 px. |
| NF-06 | Aesthetics     | Editorial typographic style: Playfair Display for headings/clock, Inter for UI; minimalist border-only card design. |
