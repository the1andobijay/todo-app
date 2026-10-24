# Plan: To-Do App (G.C.C.D)

## Context
The project folder is empty apart from `CLAUDE.md` and `session-notes.md`, so this is a greenfield build with nothing to reuse. The app must follow the rules in `CLAUDE.md` (plain HTML/CSS/JS, no libraries, small functions, edge cases, storage safety, accessibility).

## Goal
A to-do list web app that remembers your tasks after you refresh or close the browser.

## Context (technical)
- Plain HTML/CSS/JS, no build step, opened directly in a browser (`index.html`).
- Persistence uses the browser's built-in `localStorage`.
- Follows `CLAUDE.md`: try/catch around storage, corrupt data treated as an empty list, tasks identified by unique id, text rendered via `textContent`.

## Constraints
**Features**
- Add a task, mark it complete (shown crossed out), delete a task.
- Filter: All / Active / Completed.
- Shows tasks left ("3 tasks left", "1 task left", "0 tasks left").
- Tasks survive a page refresh.

**Quality**
- Empty or whitespace-only input is rejected with a friendly message, but only after the user tries to add one. On first load (and on every load) the message area is empty; the input starts empty without showing any error. The message is cleared as soon as the user starts typing or adds a valid task.
- Extra spaces are trimmed ("  buy milk  " becomes "buy milk").
- Long tasks (500+ characters) do not break the layout: input capped at 200 characters (per `CLAUDE.md`, with a message) and text wraps (`overflow-wrap: anywhere`) as a safety net for pasted or stored text.
- `<b>hi</b>` displays those exact characters, not bold (use `textContent`, never `innerHTML`).
- Accessible: Enter adds a task, labels on inputs, visible focus, strikethrough plus checkbox state (not color alone).

## Done means
0. Open the app for the first time: no tasks, no error or validation message shown (only the neutral "No tasks yet" hint).
1. Add three tasks: "do the dishes", "fold clothes", "run the laundry".
2. Check off "do the dishes"; it shows crossed out.
3. Counter reads "2 tasks left".
4. Toggle All / Active / Completed: All shows 3, Active shows 2, Completed shows 1.
5. Refresh the page: all tasks, completed states, counter, and the selected filter behave correctly (tasks and completed state restored; filter resets to All unless we choose to persist it).
6. No errors or bugs in the browser console throughout.

## Files to create
- `index.html`: input, Add button, message area (`aria-live`), filter buttons, list, counter.
- `style.css`: layout, strikethrough for completed, wrapping, focus outline.
- `script.js`: all logic, organised into small functions:
  - `loadTasks()` / `saveTasks()`: the only code touching `localStorage`; storage key and format in one constant; try/catch; invalid data returns `[]`.
  - `validateTask(text)`: trim, reject empty, enforce 200-character max; returns text or an error message. One place for rules. Only called when the user submits, never on load; `render()` never sets the message.
  - `showMessage(text)` / `clearMessage()`: the message area is empty by default; cleared on input and after a successful add.
  - `addTask`, `toggleTask(id)`, `deleteTask(id)`: update state, save, re-render. Ids from `crypto.randomUUID()` with a timestamp fallback.
  - `getVisibleTasks()`: applies the current filter.
  - `render()`: builds list with `createElement` and `textContent`; updates the counter and the empty-list message ("No tasks yet").
- `session-notes.md`: updated after each step.
- `plan.md`: copy of this plan, saved to the project root once approved.

## Build order (one small step at a time, explained first, test steps given after each)
1. Save this plan to `plan.md`.
2. HTML + CSS skeleton.
3. Add + render + validation messages.
4. Complete + delete.
5. Counter + filters.
6. Persistence (`loadTasks` / `saveTasks`) and corrupt-storage handling.
7. Edge-case and accessibility pass; update `session-notes.md`.

## Verification
- Run the "Done means" scenario manually in the browser (can be driven with the Chrome tools to confirm no console errors).
- Fresh load (cleared storage): no validation message visible. Click Add with an empty box: friendly message appears. Start typing: it disappears.
- Edge cases: empty and whitespace input, "  buy milk  " trimmed, 500+ character paste, `<b>hi</b>` shown literally, two tasks with identical text, double-clicking Add.
- Storage: `localStorage.setItem(key, "{bad")` then refresh (app loads empty, no crash); clear storage and refresh.
- Check the console shows no errors or warnings.

## Open decision
Filter selection after refresh: default is to reset to All (simpler). Say so if you want it remembered.
