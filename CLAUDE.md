# Project: To-Do App

## About this project
- What it does: A to-do list web app that remembers your tasks after you refresh or close the browser, using the browser's built-in `localStorage`.
- Who it's for: Anyone who wants a simple, no-account task list that works offline in their own browser.
- Tech: HTML/CSS/JS (no build step, no framework), with `localStorage` for persistence.

## How to work with me
- Explain your plan in plain English before making big changes.
- Keep changes small and focused. One feature or fix at a time.
- Prefer the simplest solution that meets the requirement. No speculative abstractions.
- When you finish, tell me how to test it myself.
- Keep `session-notes.md` up to date as you go: after each feature or decision, add a short dated note of what changed, what was decided, and what's next. Also log any plan pushback, every `/rewind` (and why), and every `/clear` or `/compact` (and why).

## Quality rules
### Edge cases
- Handle empty input: trim whitespace and don't add a task that is blank.
- Handle very long task text without breaking the layout.
- Handle an empty list: show a friendly "no tasks yet" message, not a blank area.
- Handle duplicate task text: tasks are identified by a unique id, never by their text.
- Render task text as plain text (e.g. `textContent`), never as HTML, so pasted markup can't run.
- Handle rapid repeated actions (double-clicking add/delete) without duplicating or losing tasks.
- For every new feature, name its edge cases before writing code and say how each is handled.

### Storage safety
- Wrap every `localStorage` read and write in `try/catch`; it can be blocked, full, or unavailable (e.g. private mode).
- When loading, treat missing, corrupt, or wrongly shaped saved data as an empty list. Never crash on load.
- If saving fails, keep the app working in memory and tell the user their tasks may not be saved.
- Save after every change (add, edit, complete, delete) so a refresh or closed tab never loses work.
- Keep the storage key and saved data format in one place, so changing them later is a single edit.

### Accessibility
- Pressing Enter in the input adds the task; everything must be usable with the keyboard alone.
- Every input and button has a visible label or an accessible name (`<label>` or `aria-label`).
- Keep a visible focus outline; never remove it without a replacement.
- Keep text and controls at a readable contrast level (WCAG AA), and don't use color as the only signal (e.g. completed tasks also get a strikethrough).

### Input validation
- Enforce a maximum task length (e.g. 200 characters) and tell the user when input is rejected or trimmed.
- Validate in one place, so add and edit follow the same rules.

### Testing and done-checks
- After each change, verify that tasks survive a page refresh and a fully closed and reopened browser.
- The browser console must show no errors or warnings.
- Test with empty, corrupt (e.g. `localStorage.setItem(key, "{bad")`), and cleared storage.
- End every task by giving me manual test steps I can follow myself.

### Code style
- Small functions with clear names; each does one thing.
- No libraries or frameworks unless I approve them first.
- Match the existing code's naming and comment style; comment the "why", not the "what".

## Git
- Never commit `.env` or any secret. Keep `.env.example` updated with placeholder values.
- Write commit messages as `type: short summary` (feat, fix, docs, style, refactor, chore).
- One logical change per commit.
