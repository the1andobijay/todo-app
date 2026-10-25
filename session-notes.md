# Session Notes

## 2026-10-24
- Goal: to-do list web app that remembers tasks after refresh or closing the browser, using `localStorage`.
- Stack decided: plain HTML/CSS/JS, no build step.
- `reference/coding-standard-template.md` did not exist; user pasted the Module 2 sections instead.
- Created `CLAUDE.md` with *About this project*, *How to work with me*, and *Quality rules*.
- Quality rules: Edge cases, Storage safety, Accessibility, Input validation, Testing and done-checks, Code style.
- Decision: max task length is 200 characters (placeholder, user is fine with it).
- Next: build the app (index.html, style, script).
- Planned the app in G.C.C.D format (Goal, Context, Constraints, Done means) and saved the approved plan to `plan.md`.
- Plan change requested by user: the empty/whitespace "friendly message" must not show on first load; it appears only after a failed add attempt and clears on typing.
- Open decision: filter resets to All after refresh (not persisted) unless user says otherwise.
- Next: build step 2, HTML + CSS skeleton.
- Decision: keep it simple. The filter is not remembered; it resets to All after a refresh.

## Plan pushback
- 2026-10-24: User rejected the first version of the plan (in plan mode, before approving it). The user's exact words:
  > "Lets no approve this yet and make some changes. Lets make sure that the reject with a friendly message is not the default when empty or whitespace-only input is avaiable. What I mean by this, if I first start the app of course no datta will be there, so that friendly message would not be needed until actual inputs are used. If you need clarity let me know."
  - Reason: the friendly "empty or whitespace" message must not show by default on first load, only after a real failed add.
  - What changed in the plan: the message area is empty on every load; the message appears only after a failed add and is cleared when the user starts typing or adds a valid task; `render()` never sets it. The plan was updated, then approved, and saved as `plan.md` (see "Done means" step 0).
- 2026-10-24: Second, smaller pushback: when asked about the open filter decision, the user said "Lets keep is simple", so the filter resets to All after a refresh and is not saved.

## /rewind log
- 2026-10-24: User used `/rewind` right after starting the design work (reported by the user; Claude has no record of it in the session history, so the details below are in the user's words).
  - Sequence: (1) the first design change was a modern look; (2) the user then tried a paywall, changing the site from a free app to one that costs a dollar; (3) the user rewound all the way back to before the modern look.
  - Why: to test the design aspect of the app, trying a paywall as an experiment and then returning to the free version.
  - Result: the app stays free and no paywall code exists in the project files. The modern (Apple-style) look was then rebuilt step by step and is in the final commit.
- When another one is used, record the date, what was rewound, and why.

## /clear and /compact log
- 2026-10-24: `/clear` run by user (reported by the user; not visible in this session's history) to move on to the design steps. Why: the skeleton and functionality of the app were finished, and design is an unrelated task, so the user wanted a fresh context for it.
- 2026-10-24: `/compact` run by user after the app was finished and verified, before starting design work. Why: free up context for the design phase; all progress is saved in `session-notes.md`, `plan.md` and `CLAUDE.md`.

## Build log
- Step 2 done: created `index.html` and `style.css` (skeleton only, no `script.js` yet). Message area is empty on load; "No tasks yet" and "0 tasks left" are static placeholders.
- Next: step 3, `script.js` with add, render and validation messages.
- Step 3 done: created `script.js` (in-memory tasks, `validateTask`, `showMessage`/`clearMessage`, `addTask`, `render`) and linked it from `index.html`. Message shows only after a failed add and clears on typing. No saving yet, so a refresh empties the list.
- Next: step 4, complete (crossed out) and delete.
- Step 4 done: tasks now have a checkbox (completed shows crossed out) and a Delete button. Added `toggleTask`, `deleteTask`, `createTaskItem` in `script.js`, and task styles with text wrapping in `style.css`.
- Next: step 5, filters (All / Active / Completed).
- Step 5 done: filters work (All / Active / Completed) via `currentFilter`, `getVisibleTasks`, `setFilter` in `script.js`. Counter always shows total active tasks. Empty hint says "No active tasks" / "No completed tasks" when a filter hides everything. Filter is not remembered after refresh (reset to All, as decided).
- Next: step 6, persistence with `loadTasks` / `saveTasks`.
- Step 6 done: persistence added in `script.js`. `loadTasks` / `saveTasks` are the only code touching `localStorage` (key `todo-app-tasks`), wrapped in try/catch; corrupt or wrongly shaped data loads as an empty list; a failed save shows a message and the app keeps working in memory. Add, check/uncheck and delete all save.
- Next: step 7, edge-case and accessibility pass, then the full "Done means" check in the browser.
- Corrupt-data test passed by user in Chrome (set `todo-app-tasks` to `{bad`, refreshed: empty list, no console errors). Note: user's DevTools was in device-emulation mode, which made the app look small; not an app issue.
- Step 7 (in progress): reviewed `script.js` against the edge-case and accessibility rules. Fixed keyboard focus being lost after check/uncheck/delete (`focusTaskCheckbox`; delete returns focus to the input) and added `aria-live="polite"` to the counter.
- Known minor behavior: double-clicking Add adds the task, then the second click shows the "Please type a task" message because the input was cleared. Left as is.
- Next: user runs the full "Done means" scenario and checks the console is clean.
- Step 7 done. User ran the full "Done means" scenario (add 3 tasks, check one off, filters, counter reads 2, refresh restores everything) plus the keyboard and quality checks, with no errors or bugs.

## Design phase
- 2026-10-24: Direction chosen by user: modern look similar to Apple's layouts (light theme, blue accent). Plan: 7 small steps, mostly in `style.css`, no behavior changes.
- Design steps 1-3 done: design tokens as CSS variables (Apple-style grey background, SF system font stack, #0071e3 accent), rounded card with soft shadow, larger title, softer input, solid accent Add button with hover/pressed states, full-width card on phones. Focus outline kept, contrast checked against AA.
- User checked steps 1-3 in the browser and approved. The `/rewind` details were also supplied and logged above.
- Design steps 4-5 done (`style.css` only): filters are now an iOS-style segmented control (grey track, white pill for the active one, still `aria-pressed`). Task rows have more padding and a hover highlight, a round custom checkbox (still a real checkbox, so keyboard and screen readers are unchanged), and a quiet red text Delete button.
- User checked steps 4-5 and approved.
- Design steps 6-7 done (`style.css` only): the "No tasks yet" hint is centered with more space, and the counter is a small footer line. Added dark mode that follows the system setting (new `--fill` and `--pill` tokens so inputs, the filter track and the selected pill work in both themes) and `prefers-reduced-motion` support.
- Decision: skipped the fade-in animation for new tasks. `render()` rebuilds the whole list, so every check or filter click would replay it; avoiding that would need JS changes, and the app should stay simple.
- User checked steps 6-7 (light and dark mode) and approved. Design phase complete; committed to git.

## Status: COMPLETE (2026-10-24)
- All 7 steps of `plan.md` finished and verified by the user.
- Final files: `index.html`, `style.css`, `script.js`, plus `CLAUDE.md`, `plan.md`, `session-notes.md`.
- Context tools used: one `/compact` before the design phase, one `/clear` to start the design steps, and one `/rewind` during the design phase (paywall experiment). See the logs above for when and why.
- The design phase was completed afterwards and is described in "Design phase".

Learned the git loop: edit, status, add, status, commit, log.
