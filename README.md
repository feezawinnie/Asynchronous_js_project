# DevPulse Async Laboratory

> **Stuck or don't know where to start?**
> 1. **[HOW_TO_LEARN.md](./HOW_TO_LEARN.md)** — how to study with this project
> 2. **[LEARNING.md](./LEARNING.md)** — concept notes, in order
> 3. This file — project map, extra exercises, solutions

> **An async JavaScript learning laboratory disguised as a developer intelligence dashboard.**

---

## A. Project Concept

### Project Name
**DevPulse Async Laboratory**

### Description
DevPulse researches a GitHub developer across multiple public APIs. You enter a username and explore eight lab panels — each one teaches a specific asynchronous JavaScript concept through real, working code you can run, break, and debug.

### Why This Topic Is Ideal

A **multi-source developer intel dashboard** is the best fit because it naturally requires:

| Async need | Real feature in DevPulse |
|---|---|
| First data load (callbacks) | GitHub profile via **XHR** |
| Modern data load (Promises) | Repos via **Fetch** |
| Multiple endpoints | Profile + repos + followers + gists |
| Concurrent loading | `Promise.all()` batch |
| Partial failures | `Promise.allSettled()` with one bad endpoint |
| Timeout pattern | `Promise.race()` API vs timer |
| Fallback sources | `Promise.any()` for redundant data |
| CRUD operations | JSONPlaceholder POST/PUT/PATCH/DELETE |
| Error types | httpbin 404/500 vs network failure |
| Event loop | Dedicated laboratory panel |

Unlike a todo app or weather widget, every feature *requires* async code to function — and gives you a reason to choose XHR vs Fetch vs Promise combinators.

---

## B. Features

1. **XHR Lab** — Load GitHub profile with `XMLHttpRequest` events (progress, abort, 404)
2. **Fetch Lab** — GET repos; POST/PUT/PATCH/DELETE notes; HTTP vs network errors
3. **Promises Lab** — Create Promises, chain `.then()`, `.catch()`, `.finally()`
4. **Combinators Lab** — `all`, `allSettled`, `race`, `any` with realistic scenarios
5. **Async/Await Lab** — Sequential vs concurrent, try/catch, forgotten `await` bug
6. **Event Loop Laboratory** — Sync vs microtask vs macrotask prediction exercises
7. **Errors Lab** — Custom error classes, individual `.catch()`, `Promise.all()` recovery
8. **Top-Level Await** — ES module with `await` at module top level
9. **Activity Log** — Timestamped trace of every async operation
10. **Exercise stubs** — TODOs in code for you to implement yourself

---

## C. APIs

| API | Base URL | Purpose |
|---|---|---|
| **GitHub REST API** | `api.github.com` | Real profile, repos, followers, gists data |
| **JSONPlaceholder** | `jsonplaceholder.typicode.com` | Fake REST API for POST/PUT/PATCH/DELETE |
| **httpbin** | `httpbin.org` | Simulate HTTP 404/500, delays, status codes |

**GitHub rate limit:** 60 requests/hour unauthenticated. If you hit the limit, wait or use a different username.

---

## D. Architecture

```
project_async/
├── index.html                  # Dashboard UI + lab panels
├── style.css                   # Minimal custom styles
├── README.md                   # This file — full curriculum
│
└── js/
    ├── main.js                 # ES module entry — wires all labs
    ├── config.js               # API URLs, username helper
    │
    ├── ui/
    │   └── navigation.js       # Sidebar section switching
    │
    ├── utils/
    │   ├── logger.js           # Activity log + console output
    │   ├── dom.js              # DOM helpers
    │   └── delay.js            # delay() and timeout() utilities
    │
    ├── xhr/
    │   └── githubProfile.js    # XMLHttpRequest profile loader
    │
    ├── fetch/
    │   └── fetchLab.js         # Fetch GET/POST/PUT/PATCH/DELETE
    │
    ├── promises/
    │   ├── promisesLab.js      # Create, chain, catch, finally
    │   └── combinators.js      # all, race, allSettled, any
    │
    ├── async/
    │   └── asyncLab.js         # async/await, forgotten await
    │
    ├── event-loop/
    │   └── laboratory.js       # Event loop experiments
    │
    ├── errors/
    │   ├── customErrors.js     # ApiError, NetworkError, RateLimitError
    │   └── errorLab.js         # Advanced error handling demos
    │
    └── modules/
        ├── configLoader.js     # Top-Level Await module
        └── tlaLab.js           # Dynamic import UI for TLA demo
```

### Trace path
```
Button click → lab handler → fetch/XHR/Promise
  → Web API (browser) → callback/microtask
  → event loop → .then() / await resume → UI update + Activity Log
```

---

## E. UI

- **Sidebar** — 8 lab sections + overview
- **Header** — GitHub username input (shared across labs)
- **Lab panels** — One per async topic with buttons, result panels, exercise boxes
- **Activity Log** — Fixed bottom panel showing timestamped async events
- **Badges** — Color-coded success/error/warning/info states

Design: dark slate theme, minimal chrome, JavaScript is the star.

---

## F. Running the Project

ES modules require a local server (not `file://`).

```bash
# Option 1: npx
npx serve .

# Option 2: Python
python -m http.server 8080

# Option 3: VS Code Live Server extension
```

Open `http://localhost:8080` (or the port shown). Open **DevTools Console** alongside the UI.

---

## G. Learning Roadmap

| Stage | Topic | Lab Panel | File |
|---|---|---|---|
| 1 | XMLHttpRequest basics | XHR Lab | `xhr/githubProfile.js` |
| 2 | XHR events & progress | XHR Lab | `xhr/githubProfile.js` |
| 3 | XHR limitations | XHR Lab | Compare with Fetch |
| 4 | Creating Promises | Promises | `promises/promisesLab.js` |
| 5 | Consuming & chaining | Promises | `promises/promisesLab.js` |
| 6 | `.catch()` & `.finally()` | Promises | `promises/promisesLab.js` |
| 7 | Fetch API basics | Fetch Lab | `fetch/fetchLab.js` |
| 8 | HTTP methods & headers | Fetch Lab | `fetch/fetchLab.js` |
| 9 | HTTP error ≠ network error | Fetch Lab | `fetch/fetchLab.js` |
| 10 | `response.ok` & `.json()` | Fetch Lab | `fetch/fetchLab.js` |
| 11 | async/await basics | Async/Await | `async/asyncLab.js` |
| 12 | try/catch/finally | Async/Await | `async/asyncLab.js` |
| 13 | Sequential vs concurrent | Async/Await | `async/asyncLab.js` |
| 14 | `Promise.all()` | Combinators | `promises/combinators.js` |
| 15 | `Promise.race()` | Combinators | `promises/combinators.js` |
| 16 | `Promise.allSettled()` | Combinators | `promises/combinators.js` |
| 17 | `Promise.any()` | Combinators | `promises/combinators.js` |
| 18 | Event loop & queues | Event Loop | `event-loop/laboratory.js` |
| 19 | Custom errors | Errors | `errors/customErrors.js` |
| 20 | Advanced error recovery | Errors | `errors/errorLab.js` |
| 21 | Forgotten `await` | Async/Await | `async/asyncLab.js` |
| 22 | Top-Level Await & ES modules | TLA | `modules/configLoader.js` |

---

## H. Topic Mapping

| Topic | Feature | Stage | Exercise | Expected Observation |
|---|---|---|---|---|
| XMLHttpRequest | Load profile | 1 | Exercise 1 | `readyState` changes 0→4 in log |
| XHR events | progress, loadend | 2 | Exercise 1 | Progress bar updates during download |
| XHR limitations | No native Promise | 3 | Compare XHR vs Fetch files | XHR needs manual Promise wrapper |
| Promise lifecycle | Create Promise button | 4 | Exercise 4 | Executor runs synchronously, resolve after 1s |
| Creating Promises | `createManualPromise` | 4 | — | Log shows executor before setTimeout |
| Consuming Promises | await in handler | 4 | — | UI updates after Promise resolves |
| Promise chaining | Chain button | 5 | Exercise 5 | 4 `.then()` steps in log |
| Promise error handling | Reject button | 6 | — | `.catch()` recovers, next `.then()` skipped |
| `.finally()` | Finally button | 6 | — | Runs regardless of resolve/reject |
| `Promise.all()` | Combinators panel | 14 | — | Fail-fast when C fails |
| `Promise.race()` | Race button | 15 | — | Timeout wins over delayed API |
| `Promise.allSettled()` | AllSettled button | 16 | — | 3 successes + 1 failure extracted |
| `Promise.any()` | Any button | 17 | — | Gists succeed despite 3 failures |
| Microtask queue | Event Loop Exp A | 18 | Prediction | Order: 1, 4, 2, 3 |
| Macrotask queue | Event Loop Exp A | 18 | Prediction | setTimeout runs after microtasks |
| Fetch API | Fetch repos | 7 | — | Returns Promise, cleaner than XHR |
| GET/POST/PUT/PATCH/DELETE | Fetch Lab buttons | 8 | — | Each method logged with body/headers |
| HTTP vs network error | 404 vs bad URL | 9 | — | 404: `response.ok=false`; bad URL: catch block |
| `response.ok` | Fetch 404 button | 10 | — | fetch does NOT reject on 404 |
| `response.json()` | All fetch handlers | 10 | — | Second await for body parsing |
| async/await | Sequential button | 11 | — | Slower than concurrent |
| try/catch/finally | TryCatch button | 12 | — | finally logs even on error |
| Forgotten await | Bug button | 21 | — | `result.login` is undefined |
| Top-Level Await | TLA panel | 22 | — | Config ready on module import |
| Custom Error classes | Errors panel | 19 | — | `instanceof ApiError` works |
| Individual `.catch()` | Errors panel | 20 | — | One failure doesn't kill batch |
| `Promise.all()` recovery | Recovery button | 20 | — | All 4 resolve with error objects |

---

## I. Exercises

> **Instructions:** Read Concept → Why → Connection → Challenge → Prediction. Implement the challenge BEFORE reading the Solution.

---

### Exercise 1: XHR Progress Bar

**Concept:** `XMLHttpRequest` fires `progress` events during download.

**Why it exists:** Large responses need progress feedback; XHR provides this natively via events.

**Project connection:** `js/xhr/githubProfile.js` → `onProgress()` function.

**Challenge:** The progress bar stub exists but may need your enhancement. Add logging for `event.loaded` and `event.total`. Handle the case when `lengthComputable` is false.

**Prediction:** When you load a profile, will `progress` events fire for GitHub's small JSON response? Why or why not?

**Experiment:** Add `xhr.onreadystatechange` logging for every `readyState` value. Load a profile and count how many times it fires.

**Observation:** Check Activity Log for `XHR readyState=` entries and progress percentages.

**Reasoning questions:**
1. What is `readyState === 4`?
2. Why does XHR need `onreadystatechange` instead of a single callback?
3. What happens if you call `xhr.abort()` mid-request?

<details>
<summary>Solution (open after attempting)</summary>

```javascript
function onProgress(event) {
  if (event.lengthComputable) {
    const percent = Math.round((event.loaded / event.total) * 100);
    document.getElementById('xhr-progress-bar').style.width = `${percent}%`;
    setText('xhr-progress-text', `Downloading… ${percent}%`);
    log.event(`XHR progress ${percent}%`);
  } else {
    setText('xhr-progress-text', `Downloading… ${event.loaded} bytes`);
  }
}
```

`readyState` values: 0=UNSENT, 1=OPENED, 2=HEADERS_RECEIVED, 3=LOADING, 4=DONE. GitHub JSON is small so progress may jump 0→100 instantly.
</details>

---

### Exercise 2: XHR vs Fetch Comparison

**Concept:** Two ways to make HTTP requests with different async models.

**Why it exists:** XHR predates Promises; Fetch was designed for the Promise era.

**Project connection:** Compare `xhr/githubProfile.js` with `fetch/fetchLab.js` → `fetchRepos()`.

**Challenge:** Rewrite `fetchRepos()` using XHR. Then rewrite `loadProfileXHR()` using Fetch. List 3 differences you notice.

**Prediction:** Which version has fewer lines? Which gives you progress events?

**Experiment:** Break the GitHub username to trigger 404 in both implementations. Compare error handling code.

**Observation:** XHR uses `onreadystatechange`; Fetch uses `await` + `response.ok` check.

**Reasoning questions:**
1. Why did we wrap XHR in `new Promise()`?
2. Can Fetch report upload/download progress? (research `ReadableStream`)
3. What XHR feature has no Fetch equivalent without extra work?

<details>
<summary>Solution</summary>

Key differences:
- XHR: event callbacks, manual Promise wrapper, built-in progress
- Fetch: returns Promise natively, no progress without streams, doesn't reject on HTTP errors
- XHR: `xhr.abort()` is simple; Fetch uses `AbortController`
</details>

---

### Exercise 3: HTTP Error vs Network Error

**Concept:** `fetch()` only rejects on network failure, NOT on HTTP 4xx/5xx.

**Why it exists:** A 404 is a successful HTTP *response* — the server answered. Only connection failures reject.

**Project connection:** Fetch Lab → "HTTP 404" vs "Network Error" buttons.

**Challenge:** Remove the `if (!response.ok)` check from `fetchHttpStatus()`. Run HTTP 404 again. What happens?

**Prediction:** Will the catch block run for HTTP 404 without `response.ok` check?

**Experiment:** Click HTTP 404, then Network Error. Compare which reaches `.catch()`.

**Observation:** 404 shows in result panel as handled error; network error shows `TypeError: Failed to fetch`.

**Reasoning questions:**
1. Why doesn't fetch reject on 404?
2. When would you WANT fetch to reject vs checking status manually?

<details>
<summary>Solution</summary>

Without `response.ok` check, HTTP 404 "succeeds" — you get a Response object with `ok: false`. Only network errors (DNS failure, CORS block, offline) reject the Promise.
</details>

---

### Exercise 4: Creating a Promise

**Concept:** `new Promise((resolve, reject) => { ... })` — executor runs synchronously.

**Why it exists:** Wrap any async operation (timers, XHR, user input) in a uniform interface.

**Project connection:** `promises/promisesLab.js` → `createManualPromise()`.

**Challenge:** Create `createDelayedGreeting(name, ms)` that resolves with `"Hello, {name}!"` after `ms` milliseconds.

**Prediction:** When you call `createDelayedGreeting('Ada', 2000)`, does the executor run immediately or after 2 seconds?

**Experiment:** Change `shouldResolve` to `false`. Observe `.catch()` behavior.

**Observation:** Log shows "Executor function runs SYNCHRONOUSLY" before the 1s delay.

**Reasoning questions:**
1. What runs first: the executor or the code after `new Promise()`?
2. Can you call `resolve()` multiple times? What happens?

<details>
<summary>Solution</summary>

```javascript
function createDelayedGreeting(name, ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`Hello, ${name}!`), ms);
  });
}
```

Executor runs immediately; `setTimeout` schedules resolve for later. Calling `resolve()` twice — second call is ignored.
</details>

---

### Exercise 5: Promise Chaining

**Concept:** Each `.then()` returns a new Promise, enabling chains.

**Why it exists:** Sequential async steps without callback hell.

**Project connection:** `promises/promisesLab.js` → `exerciseChainRepos()`.

**Challenge:** Implement a chain: fetch profile → get `login` → fetch repos → return `{ login, repoCount }`. Do NOT use async/await.

**Prediction:** If step 2 fails, will step 3's `.then()` run?

**Experiment:** Use a nonexistent username. See where the chain breaks.

**Observation:** Log shows each chain step number in order.

**Reasoning questions:**
1. What does `return res.json()` inside `.then()` do?
2. What happens if a `.then()` doesn't return anything?

<details>
<summary>Solution</summary>

```javascript
export function exerciseChainRepos(username) {
  return fetch(githubUserUrl(username))
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((user) => fetch(githubReposUrl(user.login)))
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((repos) => ({
      login: username,
      repoCount: repos.length,
    }));
}
```
</details>

---

### Exercise 6: Promise.all() Fail-Fast

**Concept:** `Promise.all()` rejects immediately when ANY promise rejects.

**Why it exists:** When you need ALL results and any missing piece makes the data useless.

**Project connection:** Combinators → Promise.all() button. Batch: A✓ B✓ C✗ D✓.

**Challenge:** Modify `buildBatch()` so all 4 succeed. Then break just one. Compare behavior with `allSettled`.

**Prediction:** If C fails at 200ms and D succeeds at 800ms, will you see D's result in `Promise.all()`?

**Experiment:** Open Network tab. Watch which requests complete after `Promise.all()` rejects.

**Observation:** Error panel explains A/B/D may have succeeded but all() still rejected.

**Reasoning questions:**
1. Are the other requests cancelled when all() rejects?
2. When is fail-fast the RIGHT behavior?

<details>
<summary>Solution</summary>

No — requests are NOT cancelled. They continue in the background. Fail-fast is correct when you need a complete dataset (e.g., all config files must load before rendering).
</details>

---

### Exercise 7: Promise.allSettled() Partial Failure

**Concept:** Wait for every promise to finish; get status + value/reason for each.

**Why it exists:** Independent requests where partial data is still useful.

**Project connection:** Combinators → allSettled button.

**Challenge:** Write a function `formatResults(settled)` that returns only successful logins and repo counts, ignoring failures.

**Prediction:** How many successes and failures with the default batch?

**Experiment:** Change C from httpbin/500 to a valid GitHub endpoint. Run again.

**Observation:** Result panel shows separate Successes and Failures sections.

**Reasoning questions:**
1. What is the shape of each `allSettled` result object?
2. When would you choose allSettled over all?

<details>
<summary>Solution</summary>

```javascript
function formatResults(settled) {
  return settled
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);
}
```

Default batch: 3 successes, 1 failure.
</details>

---

### Exercise 8: Promise.race() vs Promise.any()

**Concept:** race = first to settle (win or lose); any = first to succeed (ignore failures).

**Why it exists:** race for timeouts; any for redundant fallback sources.

**Project connection:** Combinators → Race and Any buttons.

**Challenge:** Create a `fetchWithFallback(urls)` using `Promise.any()`. Test with 2 bad URLs + 1 good.

**Prediction:** Race with timeout(3000) + slow API(5000) — who wins? Any with 3 rejects + 1 resolve — what happens?

**Experiment:** Run both buttons back-to-back. Compare results.

**Observation:** Race shows timeout error; Any shows gists data.

**Reasoning questions:**
1. Can `Promise.race()` resolve with a rejection?
2. What error does `Promise.any()` throw when ALL fail?

<details>
<summary>Solution</summary>

Race can "resolve" to a rejection — first settled wins, even if it's a reject. `Promise.any()` throws `AggregateError` when all promises reject.
</details>

---

### Exercise 9: Sequential vs Concurrent Await

**Concept:** Sequential `await` blocks; concurrent starts all then awaits together.

**Why it exists:** Performance — independent requests should run in parallel.

**Project connection:** Async/Await → Sequential vs Concurrent buttons.

**Challenge:** Check the elapsed ms for both. Calculate the time saved.

**Prediction:** Will concurrent be ~3x faster than sequential for 3 requests?

**Experiment:** Add a 4th request to both functions. Compare again.

**Observation:** Result panel shows `elapsed` in milliseconds.

**Reasoning questions:**
1. Does `await` block the main thread?
2. What happens if you write `await Promise.all([...])` vs three sequential awaits?

<details>
<summary>Solution</summary>

`await` pauses the async function, not the thread. Concurrent runs all fetches simultaneously; elapsed ≈ slowest single request. Sequential elapsed ≈ sum of all requests.
</details>

---

### Exercise 10: Forgotten Await

**Concept:** Calling an async function without `await` returns a Promise, not the value.

**Why it exists:** Common bug — easy to forget `await` in long async chains.

**Project connection:** Async/Await → "Forgotten await (bug)" button.

**Challenge:** Find the bug in `loadProfileBug()`. Fix it. Explain why `result.login` is undefined.

**Prediction:** What is `typeof user` inside `loadProfileBug` after calling `fetchUser()`?

**Experiment:** Click bug button, inspect console. Click fixed button. Compare.

**Observation:** Bug panel shows `result instanceof Promise: true`.

**Reasoning questions:**
1. Why does the function not throw an error?
2. How would ESLint help catch this?

<details>
<summary>Solution</summary>

```javascript
// Bug:
const user = fetchUser(username); // Returns Promise<User>
// Fix:
const user = await fetchUser(username); // Returns User
```

No error because returning a Promise from an async function is valid — it just resolves to another Promise (nested).
</details>

---

### Exercise 11: Event Loop Order

**Concept:** Sync code runs first, then all microtasks, then one macrotask, repeat.

**Why it exists:** JavaScript is single-threaded; the event loop schedules async work.

**Project connection:** Event Loop Laboratory → Experiments A–D.

**Challenge:** Write the expected order for Experiment A on paper BEFORE clicking.

**Prediction:** Will `3 macrotask` appear before or after `2 microtask`?

**Experiment:** Run A, B, C, D in order. Compare with predictions.

**Observation:** Purple `[EventLoop]` entries in Activity Log.

**Reasoning questions:**
1. Why is `Promise.then` a microtask?
2. What is the difference between `queueMicrotask` and `Promise.resolve().then()`?

<details>
<summary>Solution</summary>

Experiment A order: **1 sync → 4 sync → 2 microtask → 3 macrotask**

Microtasks (Promise callbacks) always drain before the next macrotask (setTimeout).
</details>

---

### Exercise 12: Top-Level Await

**Concept:** `await` at module top level pauses module evaluation.

**Why it exists:** Load config/data before any module code runs — without wrapper async IIFE.

**Project connection:** `modules/configLoader.js`.

**Challenge:** Add a second `await fetch()` in configLoader for a second endpoint. Observe import timing.

**Prediction:** When does the fetch in configLoader run — on page load or on button click?

**Experiment:** Add `console.log('module evaluating')` at top of configLoader. Click TLA button.

**Observation:** Import takes measurable ms; config is ready immediately after.

**Reasoning questions:**
1. Why doesn't Top-Level Await work in regular `<script>` tags?
2. What problem occurs if configLoader is slow and imported by main.js at startup?

<details>
<summary>Solution</summary>

TLA only works in ES modules (`type="module"`). If configLoader is statically imported at startup, it blocks the entire module graph until config resolves — use dynamic `import()` for optional/slow config.
</details>

---

## J. Experiments — Things to Break

| # | What to change | What to learn |
|---|---|---|
| 1 | Remove `await` in `fetchRepos` | Function returns Promise |
| 2 | Remove `if (!response.ok)` check | HTTP errors don't throw |
| 3 | Change `Promise.all` to `allSettled` | Partial results appear |
| 4 | Set race timeout to 100ms | Timeout always wins |
| 5 | Make all `Promise.any` sources fail | AggregateError |
| 6 | Add `throw` in a `.then()` | Skips remaining `.then()`, goes to `.catch()` |
| 7 | Call `xhr.abort()` immediately | Aborted request error |
| 8 | Use invalid GitHub username | HTTP 404 in both XHR and Fetch |
| 9 | Add `setTimeout(0)` before and after `await` | Macrotask vs microtask timing |
| 10 | Remove `.catch()` from one promise in `demoIndividualCatch` | One failure kills `Promise.all` |

---

## K. Final Challenges

### Challenge 1: Unified Data Loader
Build `loadDeveloperIntel(username)` that uses `Promise.allSettled()` to fetch profile, repos, followers, and gists. Return a structured report with successes and failures. Use async/await.

### Challenge 2: Timeout Wrapper
Create `fetchWithTimeout(url, ms)` using `Promise.race()`. Use it in the Fetch Lab for repos. Handle both timeout and HTTP errors with custom error classes.

### Challenge 3: Retry with Backoff
Create `fetchWithRetry(url, maxRetries)` that retries on network error with 1s, 2s, 4s delays. Use manual Promises or async/await.

### Challenge 4: XHR → Fetch Migration
Fully migrate `loadProfileXHR` to Fetch while keeping the Activity Log events equivalent. Add `AbortController` to replicate `xhr.abort()`.

### Challenge 5: Event Loop Quiz Builder
Add a 5th experiment to the Event Loop Lab with random ordering of sync/microtask/macrotask. Show user their prediction vs actual.

### Challenge 6: Dashboard Summary
On the Overview panel, add a "Load All" button that concurrently fetches all data, handles partial failures, and renders a summary card per data source.

---

## L. Final Checklist

| Topic | Covered? | Where |
|---|---|---|
| XMLHttpRequest | ✅ | `xhr/githubProfile.js` |
| HTTP requests with XHR | ✅ | Profile load |
| XHR events | ✅ | progress, loadend, onerror, abort |
| XHR limitations | ✅ | Exercise 2, README |
| Promise lifecycle | ✅ | `createManualPromise` |
| Creating Promises | ✅ | Promises Lab |
| Consuming Promises | ✅ | await / .then() throughout |
| Promise chaining | ✅ | `demoPromiseChain` |
| Promise error handling | ✅ | `.catch()` demos |
| `.finally()` | ✅ | `demoFinally` |
| `Promise.all()` | ✅ | Combinators + async concurrent |
| `Promise.race()` | ✅ | API vs timeout |
| `Promise.allSettled()` | ✅ | Partial failure batch |
| `Promise.any()` | ✅ | Fallback sources |
| Microtask queue | ✅ | Event Loop Exp A, C |
| Macrotask queue | ✅ | Event Loop Exp A, B |
| Event loop order | ✅ | Event Loop Laboratory |
| Fetch API | ✅ | `fetch/fetchLab.js` |
| HTTP methods with Fetch | ✅ | GET/POST/PUT/PATCH/DELETE |
| Fetch headers | ✅ | Accept, Content-Type |
| Fetch request bodies | ✅ | POST/PUT/PATCH JSON bodies |
| HTTP vs network errors | ✅ | 404/500 vs bad URL |
| `response.ok` | ✅ | All fetch handlers |
| `response.json()` | ✅ | All fetch handlers |
| Async functions | ✅ | `async/asyncLab.js` |
| `await` | ✅ | Throughout async lab |
| Async/await vs Promises | ✅ | Side-by-side in README |
| try/catch with async | ✅ | `loadWithTryCatch` |
| Async error best practices | ✅ | Errors lab |
| Forgotten await | ✅ | `loadProfileBug` |
| Top-Level Await | ✅ | `modules/configLoader.js` |
| ES modules | ✅ | All `import`/`export` |
| Custom Error classes | ✅ | `errors/customErrors.js` |
| Advanced Promise.all() errors | ✅ | `demoAllRecovery` |
| Partial failure (allSettled) | ✅ | Combinators |
| Individual `.catch()` | ✅ | `demoIndividualCatch` |

**All 40+ required topics: ✅ COVERED**

---

## Learning Cycle

```
LEARN → IMPLEMENT → PREDICT → RUN → OBSERVE → BREAK → DEBUG → EXPLAIN → REFACTOR
```

Work through stages 1–22 in order. Use the Activity Log and DevTools Console together. Break things on purpose. Explain what happened before reading solutions.

Happy experimenting! 🧪
