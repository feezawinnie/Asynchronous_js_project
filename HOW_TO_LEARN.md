# How to learn with DevPulse

This is the **study method**. Follow it every time you sit down.

The files have different jobs:

| File | Job |
|------|-----|
| **HOW_TO_LEARN.md** (this file) | How to study |
| **LEARNING.md** | What each concept means |
| **The running app** | Where you observe and break things |
| **The `.js` files** | Where you read and change code |
| **README.md** | Extra exercises and hidden solutions |

If you only click buttons and never read `LEARNING.md`, you will not learn.  
If you only read notes and never run the app, you will not learn.  
You need **both**.

---

## 1. Set up your desk (do this once)

Open **three things** side by side:

```
┌─────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐
│ LEARNING.md         │  │ Browser: DevPulse    │  │ The .js file    │
│ (today's chapter)   │  │ + DevTools Console   │  │ for this lab    │
│                     │  │ + Activity Log       │  │                 │
└─────────────────────┘  └──────────────────────┘  └─────────────────┘
```

1. **Notes** — `LEARNING.md`, scrolled to today's chapter.
2. **App** — DevPulse in the browser. Press `F12` and keep the **Console** tab open. Keep the **Activity Log** visible at the bottom of the page.
3. **Code** — the file named at the top of the chapter (for day 1: `js/xhr/githubProfile.js`).

Also keep a **paper notebook or a blank text file**. You will write predictions *before* you click. Typing in your head does not count.

You need a local server (not `file://`):

- Live Server on `index.html`, or
- `python3 -m http.server 8080`

Leave the username as **`octocat`** until a chapter asks you to change it.

---

## 2. The learning loop (use this for every button)

Never “just click around.” For every button, run this loop:

```
LEARN → IMPLEMENT? → PREDICT → RUN → OBSERVE → BREAK → DEBUG → EXPLAIN
```

### LEARN

Read **one chapter** in `LEARNING.md` (10–15 minutes).  
Do not read the next chapter yet.

Goal: you can say in one sentence what the concept *is* and why it exists.

### IMPLEMENT? (only when the chapter has a challenge)

Some chapters ask you to change code. Do that **after** you have run the working version once.  
Do not rewrite a function you have never seen run.

### PREDICT (the step people skip)

Before you click, write down:

- What will appear in the **Activity Log**?
- What order will the lines appear?
- Will the result panel show success, error, or loading-then-error?
- If it fails, is it an **HTTP** error or a **network** error?

Bad prediction: “It will load.”  
Good prediction: “readyState will go 1 then 2 then 4, then the profile name will show.”

### RUN

Click **one** button. Wait until the Activity Log stops.  
Do not click three buttons at once.

### OBSERVE

Look at, in this order:

1. Result panel (success / error badge + text)
2. Activity Log (time order)
3. Browser Console (same events, plus any errors)
4. Optional: DevTools **Network** tab (was the request sent? status code?)

Compare with your prediction. Circle what you got wrong. That mismatch is the lesson.

### BREAK

Change **one** thing. Examples:

- remove `await`
- remove `if (!response.ok)`
- use a fake username
- click Abort while loading
- swap `Promise.all` for `Promise.allSettled`

Run again. Observe again.

Then **undo** the change so the lab still works for tomorrow.

### DEBUG

When something surprises you:

1. Find the function the button calls (search the `.js` file for the button id, e.g. `btn-xhr-load`).
2. Put `console.log('here', value)` on the next line after an `await` or inside a `.then()`.
3. Ask: is this line running now, or later?

### EXPLAIN

Close the notes. Say out loud (or write):

> This button starts ____. The browser waits for ____. When it finishes, JavaScript continues in ____. I saw ____ in the log because ____.

If you cannot do that, you are not done with the chapter. Read it again. Do not move on.

---

## 3. Rules (follow these)

1. **One concept per sitting.** A sitting is 30–45 minutes. Stop after one chapter even if you have time left.
2. **Do not skip the order.** XHR → Promises → Fetch → async/await → combinators → event loop → errors → modules.
3. **Do not open solutions first.** `README.md` section I hides solutions in `<details>`. Open them only after you have tried.
4. **Do not binge-click.** Ten clicks with no prediction teaches almost nothing.
5. **Read the function, not the whole folder.** The chapter tells you the file. Stay in that file.
6. **The Activity Log is the teacher.** If you ignore it, you are only using a UI.
7. **Wrong predictions are success.** Write them down. That is how the event loop becomes real.
8. **Undo experiments.** Leave the project working so tomorrow’s you is not debugging your leftover break.

---

## 4. What “done” means for a chapter

You may go to the next chapter only when you can do **all** of these:

- [ ] Explain the concept in your own words (no jargon salad).
- [ ] Point at the exact function in the `.js` file.
- [ ] Predict the log for the main button and get it mostly right.
- [ ] Break one thing and explain the new result.
- [ ] Answer the chapter’s “ask yourself / reasoning” questions out loud.

If you fail the prediction, stay on the chapter. Run the button again tomorrow. Repeating a chapter is normal.

---

## 5. Day-by-day plan

Same order as `LEARNING.md`. Do not rearrange it.

| Day | Read in LEARNING.md | Open in the app | Open in the editor | Buttons to run |
|-----|---------------------|-----------------|--------------------|----------------|
| 1 | Ch 0, 1, 2 | 1 · XHR Lab | `js/xhr/githubProfile.js` | Load Profile, Abort, Trigger 404 |
| 2 | Ch 3, 4 | 3 · Promises | `js/promises/promisesLab.js` | Create, Chain, Reject, finally |
| 3 | Ch 5, 6 | 2 · Fetch Lab | `js/fetch/fetchLab.js` | Repos, 404, 500, Network Error, POST, PUT, PATCH, DELETE |
| 4 | Ch 7 | 5 · Async/Await | `js/async/asyncLab.js` | Sequential, Concurrent, try/catch, Forgotten await, Fixed |
| 5 | Ch 8 | 4 · Combinators | `js/promises/combinators.js` | all, allSettled, race, any |
| 6 | Ch 9 | 6 · Event Loop | `js/event-loop/laboratory.js` | A, B, C, D (predict A on paper first) |
| 7 | Ch 10, 11 | 7 · Errors, then 8 · TLA | `js/errors/`, `js/modules/` | Custom errors, individual catch, recovery, Load Module Config |

After day 7, use `README.md` **Final Challenges**. Those are for when the notes already make sense.

---

## 6. How to use each kind of lab

### XHR / Fetch / Promises / Async buttons

These **talk to the network**. Watch:

- loading badge → success or error
- log timestamps (what happened first)
- Network tab status codes (`200`, `404`, `500`, failed)

### Combinators

These start **several** requests. Watch which sources succeed and which fail. Ask: *did the whole batch die, or did some results survive?*

### Event Loop

These barely use the network (except experiment D). The only thing that matters is **order of log lines**. Write the order on paper before every click.

### Errors / Top-Level Await

Read the `class` or the `await` at the **top of the module**, not only the button handler.

---

## 7. How to read the JavaScript

When you open a lab file, do this in order:

1. Read the comment at the top of the file (it says *why* this file exists).
2. Find `init...Lab()` at the bottom — that is where buttons are wired.
3. Click a button in your mind: `btn-xhr-load` → which function runs?
4. Follow that function until you see `XMLHttpRequest`, `fetch`, `new Promise`, or `await`.
5. That line is where JavaScript **stops waiting on the stack** and the browser takes over.

You are tracing:

```
click → handler → async start → browser (network / timer)
      → event loop → callback / .then / resumed await → UI + log
```

If you cannot find that path, you are not ready to change the code.

---

## 8. How to take notes (keep them short)

For each chapter, write only this template:

```
Concept:
Why it exists:
Button I clicked:
I predicted:
I observed:
What I broke:
What that taught me:
Still confused:
```

One page per day is enough. Long notes you never reread are useless.

---

## 9. What to do when you are stuck

| Problem | Fix |
|---------|-----|
| Blank page / import errors | You opened `file://`. Use a local server. |
| GitHub errors after many clicks | Rate limit (60/hour). Wait, or pause clicking. |
| Log is too fast | Clear the log, click one button, read from the top. |
| I don’t understand a function | Add `console.log` on the first line of that function. Confirm it runs. |
| Prediction always wrong | You are guessing the *data*. Guess the *order of logs* instead. |
| Overwhelmed by files | Close all tabs except today’s one `.js` file and `LEARNING.md`. |
| Want to skip to async/await | Don’t. async/await is Promises with makeup. Learn Promises first. |

If you are stuck for more than 20 minutes on one button, write your prediction, your observation, and the function name. Then reread that chapter from the first paragraph. Do not jump to a later lab.

---

## 10. After a chapter: extra practice

Only if the chapter already feels clear:

1. Do the **Challenge** at the bottom of the `LEARNING.md` chapter.
2. Then do the matching exercise in `README.md` section **I**.
3. Try one row from `README.md` section **J** (things to break).
4. Put the code back.

Do not start the Final Challenges until days 1–7 are done.

---

## 11. First session (if you are starting now)

Do exactly this, nothing else:

1. Start the app with a local server.
2. Open `LEARNING.md` chapter **0**, then chapter **1**.
3. Open `js/xhr/githubProfile.js`.
4. Write: “After Load Profile I will see …”
5. Click **Load Profile (XHR)** once.
6. Compare log vs prediction.
7. Click **Trigger 404** once. Compare again.
8. Stop.

Tomorrow: chapter 2 (same file) and Abort.

That is how you learn with this project: **small loops, written predictions, one file, one button.**
