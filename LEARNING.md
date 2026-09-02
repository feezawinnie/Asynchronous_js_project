# DevPulse Learning Notes

**Start here.** This file is the textbook. The app is the laboratory.

| File | Job |
|------|-----|
| **[HOW_TO_LEARN.md](./HOW_TO_LEARN.md)** | Study method — read this before chapter 1 |
| **LEARNING.md** (this file) | Concept notes — one chapter at a time |
| **README.md** | Extra exercises and hidden solutions |

---

## How to use this project (read this first)

Full guidelines (setup, rules, daily plan, “done” checklist): **[HOW_TO_LEARN.md](./HOW_TO_LEARN.md)**.

You are not supposed to memorize the whole app. You study **one concept at a time**.

### Every study session looks like this

1. Open **this file** and read **one chapter** (about 10–15 minutes).
2. Open the matching **sidebar panel** in the app.
3. Open the matching **JavaScript file** in your editor (listed at the top of each chapter).
4. **Predict** what will happen.
5. **Click the button** in the app.
6. Watch **two places at once**:
   - the **Activity Log** at the bottom of the page
   - the **browser console** (F12 → Console)
7. Only then try the **challenge** at the end of the chapter.

If you skip the prediction step, you will click buttons and still not understand.

### Where to start TODAY

Do **not** start at Overview, Combinators, or Event Loop.

Start here:

| Day | Chapter | Sidebar | File |
|-----|---------|---------|------|
| 1 | 0 + 1 + 2 | 1 · XHR Lab | `js/xhr/githubProfile.js` |
| 2 | 3 + 4 | 3 · Promises | `js/promises/promisesLab.js` |
| 3 | 5 + 6 | 2 · Fetch Lab | `js/fetch/fetchLab.js` |
| 4 | 7 | 5 · Async/Await | `js/async/asyncLab.js` |
| 5 | 8 | 4 · Combinators | `js/promises/combinators.js` |
| 6 | 9 | 6 · Event Loop | `js/event-loop/laboratory.js` |
| 7 | 10 + 11 | 7 · Errors and 8 · TLA | `js/errors/` and `js/modules/` |

That order is intentional:

```
XHR (old event model)
  → Promises (the idea)
    → Fetch (Promises in real HTTP)
      → async/await (prettier Promises)
        → combinators (several Promises at once)
          → event loop (WHY the order happens)
            → errors + modules (real-world polish)
```

### How to run the app

ES modules cannot run from `file://`. You need a local server.

- VS Code / Cursor: right-click `index.html` → **Open with Live Server**
- Or in a terminal: `python3 -m http.server 8080` then open `http://localhost:8080`

Leave the GitHub username as `octocat` until you feel comfortable.

---

## Table of contents

0. [The big picture: why async exists](#0-the-big-picture-why-async-exists)
1. [XMLHttpRequest](#1-xmlhttprequest)
2. [XHR events, readyState, and limitations](#2-xhr-events-readystate-and-limitations)
3. [Promises — lifecycle, create, consume](#3-promises--lifecycle-create-consume)
4. [Promise chaining, catch, and finally](#4-promise-chaining-catch-and-finally)
5. [The Fetch API](#5-the-fetch-api)
6. [HTTP methods, headers, bodies, and errors](#6-http-methods-headers-bodies-and-errors)
7. [Async / await](#7-async--await)
8. [Promise combinators: all, race, allSettled, any](#8-promise-combinators-all-race-allsettled-any)
9. [The event loop](#9-the-event-loop)
10. [Custom errors and advanced error handling](#10-custom-errors-and-advanced-error-handling)
11. [ES modules and Top-Level Await](#11-es-modules-and-top-level-await)

---

## 0. The big picture: why async exists

JavaScript in the browser has **one call stack**. It can only run one piece of code at a time.

If you fetch GitHub data **synchronously** (wait on the spot), the whole page freezes until the network answers. Buttons would not click. The UI would freeze. That is why async exists.

**Synchronous** means: this line finishes before the next line starts.

```js
const a = 1;
const b = a + 1; // waits for the line above
```

**Asynchronous** means: you *start* work now, and you *continue later* when the result is ready.

```js
fetch(url);          // starts the request, does NOT wait
console.log('hi');   // this runs immediately
// later, when GitHub answers, a callback / .then / await continues
```

The browser does the waiting for you (network, timers). JavaScript keeps running other code. When the answer arrives, the **event loop** puts your continuation back on the stack.

You will see this path over and over in DevPulse:

```
You click a button
  → JavaScript starts a request (XHR or Fetch)
    → Browser talks to the network (Web API)
      → Your function has already finished
        → Response arrives
          → Event loop runs your callback / Promise / await
            → UI + Activity Log update
```

If you remember only one sentence: **async does not mean multi-threaded. It means “do this later, when the result is ready.”**

---

## 1. XMLHttpRequest

**Sidebar:** `1 · XHR Lab`  
**File:** `js/xhr/githubProfile.js`  
**Buttons:** Load Profile (XHR), Abort Request, Trigger 404

### Concept

`XMLHttpRequest` (XHR) is the **old** browser tool for talking to a server without reloading the page. You create an object, tell it the URL, attach event handlers, then call `send()`.

```js
const xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.send(); // request starts; function continues
```

The response is **not** available on the next line. It arrives later through **events**.

### Why it exists

Before Promises and Fetch (2015-era), this was how AJAX worked. You still need to understand it because:

- lots of old code uses it
- it shows the **event / callback** model clearly
- it has features (progress, abort) that Fetch handles differently

### What happens in DevPulse

`loadProfileXHR(username)` loads `https://api.github.com/users/octocat` using XHR, then wraps the result in a Promise so the rest of the app can `await` it.

That wrapper is important: **XHR itself is not a Promise.** We convert events into `resolve()` / `reject()`.

### readyState (the XHR lifecycle)

| Value | Name | Meaning |
|------:|------|---------|
| 0 | UNSENT | object created, `open()` not called |
| 1 | OPENED | `open()` called |
| 2 | HEADERS_RECEIVED | server headers arrived |
| 3 | LOADING | downloading body |
| 4 | DONE | finished (success **or** HTTP error) |

`onreadystatechange` fires on **every** jump. We only parse JSON when `readyState === 4` (`XMLHttpRequest.DONE`).

### HTTP status vs network error (already true for XHR)

- Status `200` → success, parse `xhr.responseText`
- Status `404` → the server **did** answer (“user not found”). That is an HTTP error.
- `xhr.onerror` → the request never got a real HTTP response (offline, DNS, CORS)

Click **Trigger 404** with a fake username. You should see `HTTP 404` in the log, **not** `onerror`.

### Challenge for this chapter

1. Click **Load Profile (XHR)**.
2. In the Activity Log, count how many `readyState=` lines appear.
3. Click **Trigger 404**. Compare the log with a successful load.
4. Click **Load Profile**, then quickly click **Abort Request**.

### Predict before you click

Will `xhr.send()` wait until GitHub answers before the next line of JavaScript runs? (Answer: no.)

### After you run it, ask yourself

- Which event means “download started”?
- Which event means “finished, success or fail”?
- Why do we still `reject()` on HTTP 404 even though the network worked?

---

## 2. XHR events, readyState, and limitations

**Same panel and file as chapter 1.**

### The events this lab uses

| Event | When it fires | What we do |
|-------|---------------|------------|
| `loadstart` | request begins | show the progress bar |
| `progress` | bytes arriving | update the bar (`onProgress`) |
| `readystatechange` | readyState changes | parse JSON when DONE |
| `error` | network failure | `reject()` |
| `abort` | `xhr.abort()` | `reject('Request aborted')` |
| `loadend` | always at the end | clear `currentXhr` |

`loadend` is like `.finally()`: it runs after success, HTTP error, network error, or abort.

### Progress

```js
if (event.lengthComputable) {
  const percent = (event.loaded / event.total) * 100;
}
```

GitHub profile JSON is tiny. The bar may jump 0% → 100% in one frame. That is OK. The point is: **XHR can report progress through events.** Fetch cannot do this as easily.

### XHR limitations (this is the point of comparing later with Fetch)

1. **No native Promise.** You write `new Promise((resolve, reject) => { ... })` yourself.
2. **Verbose.** `open`, headers, events, `send`, `JSON.parse`.
3. **Easy to forget** to handle `onerror` vs HTTP status.
4. **Callback soup** if you chain several XHR requests (profile, then repos, then followers).

Fetch was invented to fix most of this. You will feel the difference in chapter 5.

### Challenge

Open `onProgress` in `githubProfile.js`. Add a log when `lengthComputable` is **false**. Load a profile. Did GitHub send a computable length?

---

## 3. Promises — lifecycle, create, consume

**Sidebar:** `3 · Promises`  
**File:** `js/promises/promisesLab.js`  
**Buttons:** Create Promise, Promise Chain, Reject + .catch(), .finally() Demo

Read this **before** Fetch. Fetch *returns* a Promise. If you do not understand Promises, Fetch will look like magic.

### Concept

A **Promise** is an object that represents a value that is not ready yet.

It has three states. It moves **once**, and never goes backwards:

```
pending  →  fulfilled (resolved)   // success, has a value
pending  →  rejected               // failure, has a reason
```

After that it is **settled**. Calling `resolve()` twice does nothing useful — the second call is ignored.

### Why it exists

Callbacks (XHR events) work, but stacking them is painful:

```js
loadA((a) => {
  loadB(a, (b) => {
    loadC(b, (c) => { /* callback hell */ });
  });
});
```

A Promise gives you a standard object you can:

- return from a function
- attach `.then()` / `.catch()` later
- combine with other Promises (`Promise.all`, etc.)

### Creating a Promise

```js
const p = new Promise((resolve, reject) => {
  // this function is the EXECUTOR
  // it runs SYNCHRONOUSLY, immediately
  setTimeout(() => resolve({ message: 'done' }), 1000);
});
```

Two different times:

1. **Executor** — runs *now* (you will see `"Executor function runs SYNCHRONOUSLY"` in the log).
2. **resolve / reject** — may happen *later* (after the timer).

`setTimeout` is a **macrotask**. The executor is **not** async. Only the timer callback is.

### Consuming a Promise

```js
p.then((value) => {
  // ran as a microtask after p fulfills
});

p.catch((err) => {
  // ran if p rejects
});
```

`await p` (chapter 7) is the same idea with nicer syntax. Internally it is still a Promise.

### In DevPulse

**Create Promise** calls `createManualPromise(true)`:

- log: executor runs now
- wait 1 second
- log: resolving
- UI shows the resolved object

### Predict

When you click **Create Promise**, which appears first in the log: “Executor function runs SYNCHRONOUSLY” or “Promise resolving with data”?

### Challenge

Write this in the console after you understand the button:

```js
const p = new Promise((resolve) => {
  console.log('A');
  resolve('B');
  console.log('C');
});
p.then((v) => console.log(v));
console.log('D');
```

Predict the order (`A C D B` is the usual answer: executor sync, then sync `D`, then microtask `B`).

---

## 4. Promise chaining, catch, and finally

**Same panel:** `3 · Promises`

### Chaining

Each `.then()` **returns a new Promise**.

```js
fetch(profileUrl)
  .then((res) => res.json())       // wait for body
  .then((user) => fetch(reposUrl)) // use user, start next request
  .then((res) => res.json())
  .then((repos) => repos.length);
```

This is **sequential async**: step 2 starts only after step 1 finishes. That is correct when step 2 **needs** step 1’s data.

If a `.then()` returns a value, the next `.then()` receives that value.  
If it returns a Promise, the chain waits for that Promise.  
If it throws (or returns a rejected Promise), the chain **skips** later `.then()` callbacks and jumps to `.catch()`.

### `.catch()`

```js
createManualPromise(false)
  .then((data) => {
    // SKIPPED on reject
  })
  .catch((err) => {
    return { recovered: true, error: err.message };
  });
```

If `.catch()` **returns a value**, the chain **recovers**. Later `.then()` would see that value. Errors are not “fatal” unless you rethrow.

Click **Reject + .catch()** — the UI should show **recovered**, not a crash.

### `.finally()`

```js
promise
  .then(...)
  .catch(...)
  .finally(() => {
    // hide spinner — success OR failure
  });
```

`.finally()` does not receive the result. It is for **cleanup** (stop loading spinner, close a connection). It still runs if you reject.

Click **.finally() Demo** and look for `loading=false` in the log.

### In DevPulse

**Promise Chain** does:

1. fetch profile  
2. check `ok`  
3. parse JSON  
4. fetch that user’s repos  
5. return `{ repoCount, topRepo }`

This is the same story as XHR, but the async model is Promises instead of events.

### Predict

If the username is fake, which step fails? Do later `.then()` functions run?

### Challenge

In `exerciseChainRepos`, rewrite the chain yourself without looking at `demoPromiseChain`. Goal object: `{ login, repoCount }`.

---

## 5. The Fetch API

**Sidebar:** `2 · Fetch Lab`  
**File:** `js/fetch/fetchLab.js`  
**Button first:** Fetch Repos (GET)

### Concept

`fetch(url, options)` is the **modern** replacement for XHR.

- It **returns a Promise** immediately.
- That Promise fulfills with a **Response** object (not JSON yet).
- Reading the body is a **second** async step: `response.json()`.

```js
const response = await fetch(url);     // Promise 1: headers + status
const data = await response.json();    // Promise 2: parse body
```

### Why it exists

XHR is event-based and verbose. Fetch is Promise-based, works with `await`, and matches how we think: “get a response, then read it.”

### Compare with XHR in this project

| | XHR profile | Fetch repos |
|--|-------------|-------------|
| File | `js/xhr/githubProfile.js` | `js/fetch/fetchLab.js` |
| Start | `xhr.open` + `xhr.send` | `fetch(url)` |
| Async model | events | Promise |
| JSON | `JSON.parse(xhr.responseText)` | `await response.json()` |
| Progress | `onprogress` | not built-in |
| Abort | `xhr.abort()` | `AbortController` (not in this lab yet) |

Same kind of data (GitHub). Different async style. That comparison is the whole point of having both labs.

### `response.ok` and `response.json()`

- `response.ok` is `true` when status is 200–299.
- `response.status` is the number (`404`, `500`, …).
- `response.json()` returns a **Promise** that parses the body as JSON.

You almost always write:

```js
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return response.json();
```

If you forget `response.ok`, a 404 looks like “success” and then `.json()` may parse an error payload.

### Predict

Does `fetch()` reject when GitHub returns 404? (Answer: **no**. See next chapter.)

---

## 6. HTTP methods, headers, bodies, and errors

**Same file:** `js/fetch/fetchLab.js`

### HTTP methods in this lab

GitHub is mostly **read-only** without an auth token, so writes use **JSONPlaceholder** (a fake REST API).

| Button | Method | Meaning |
|--------|--------|---------|
| Fetch Repos | GET | read data |
| POST Note | POST | create (body required) |
| PUT | PUT | replace the whole resource |
| PATCH | PATCH | update some fields |
| DELETE | DELETE | remove |

### Headers and body

```js
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: '...', body: '...' }),
});
```

- **Headers** are metadata (content type, accept).
- **Body** is the payload. GET usually has no body.
- `JSON.stringify` turns a JS object into a string the server can read.

### The most important Fetch lesson

**HTTP error ≠ network error.**

`fetch()` **rejects** only when the browser cannot get a response:

- no internet
- DNS failure (`this-domain-does-not-exist-xyz.invalid`)
- CORS block
- request aborted

Those become `TypeError: Failed to fetch`.

`fetch()` **does not reject** for:

- 404 Not Found
- 500 Internal Server Error

The Promise **fulfills**. You get a Response with `ok === false`. You must check `response.ok` yourself.

### In DevPulse — click these in order

1. **HTTP 404** — log should say `response.ok = false` and `fetch did NOT reject`.
2. **HTTP 500** — same pattern, status 500.
3. **Network Error** — catch block, `TypeError`, no `response.ok` because there is no response.

### Predict

If you delete the `if (!response.ok)` line in `fetchHttpStatus` and click HTTP 404, will `.catch()` run?

### Challenge

Explain in one sentence: “A 404 is a successful HTTP conversation and a failed application result.”

---

## 7. Async / await

**Sidebar:** `5 · Async/Await`  
**File:** `js/async/asyncLab.js`

### Concept

`async` / `await` is **syntax on top of Promises**. It does not replace Promises. The engine still uses Promises.

```js
async function fetchUser(username) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fail');
  return res.json();
}
```

Rules that never change:

1. An `async` function **always returns a Promise**.
2. `await` pauses **that function**, not the whole page / not the thread.
3. `await x` waits until `x` settles, then gives you the value (or throws if rejected).
4. A thrown error inside `async` **rejects** the returned Promise.

This:

```js
fetchUser(name).then((user) => console.log(user.login));
```

and this:

```js
const user = await fetchUser(name);
console.log(user.login);
```

are the same idea.

### Why it exists

`.then()` chains are hard to read when you mix conditions, loops, and errors. `try` / `catch` looks like normal synchronous code.

### try / catch / finally

```js
try {
  const user = await fetchUser(username);
} catch (err) {
  // rejection becomes a thrown error
} finally {
  // hide spinner either way
}
```

This matches Promise `.then` / `.catch` / `.finally`.

Click **try/catch/finally** and confirm `finally` logs even when things work.

### Sequential vs concurrent (very important)

**Sequential** (slow when requests are independent):

```js
const user = await fetchUser(name);       // wait
const repos = await fetchRepoCount(name); // starts AFTER user
const fol = await fetchFollowerCount(name);
```

Elapsed time ≈ time1 + time2 + time3.

**Concurrent** (start all, then wait together):

```js
const [user, repos, fol] = await Promise.all([
  fetchUser(name),
  fetchRepoCount(name),
  fetchFollowerCount(name),
]);
```

Elapsed time ≈ the **slowest** one.

Click **Sequential await**, note the `elapsed` ms. Then **Concurrent**. Concurrent should be faster. Both are valid; sequential is required only when the second call needs the first result.

### Forgotten await

```js
const user = fetchUser(username); // missing await
console.log(user.login);          // undefined — user is a Promise
```

This often does **not throw**. That is why it is a nasty bug.

- Click **Forgotten await (bug)** — `result.login` is undefined / Promise.
- Click **Fixed await** — you see `login`, `followers`, `public_repos`.

### Predict

Inside `loadProfileBug`, what is `typeof user` right after `fetchUser(username)` with no `await`? (`object`, because a Promise is an object — and `user instanceof Promise` is true.)

### Challenge

Add `console.log(user)` in the bug function. Explain why it prints `Promise { <pending> }` instead of `{ login: 'octocat', ... }`.

---

## 8. Promise combinators: all, race, allSettled, any

**Sidebar:** `4 · Combinators`  
**File:** `js/promises/combinators.js`

You now know one Promise. Combinators coordinate **many** Promises.

The lab uses a batch of four:

| Label | What | Expected |
|-------|------|----------|
| A | GitHub profile | success |
| B | GitHub repos | success |
| C | httpbin `/status/500` | **failure** |
| D | GitHub followers | success |

That mix is on purpose.

### `Promise.all(promises)` — fail-fast

- Waits until **every** Promise fulfills.
- If **any** rejects, `all` **rejects immediately** with that error.
- You get an **array of values** in the same order as the input.

**When to use:** you need the complete set. Missing one piece makes the rest useless (example: three config files that must all load).

**In the lab:** C fails → the whole `Promise.all` fails. A, B, D may still finish in the network tab, but your code does not receive them.

Click **Run Promise.all()**. Expect a red fail-fast message.

### `Promise.allSettled(promises)` — everyone finishes

- Never rejects because of a child failure.
- Each result is `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.

**When to use:** independent widgets. One broken source should not blank the whole dashboard.

Click **Run Promise.allSettled()**. You should see 3 successes and 1 failure, listed separately.

This is **partial failure handling**.

### `Promise.race(promises)` — first to settle

- The first Promise that **fulfills OR rejects** wins.
- The others keep running, but you ignore them.

**When to use:** timeout.

```js
Promise.race([
  slowApi,           // delayed 5 seconds in this lab
  timeout(3000),     // rejects after 3s
]);
```

Timeout wins. That is realistic: “don’t wait forever for GitHub.”

**Race vs any:** race can “win” with a **rejection**. If the timeout rejects first, you lose even if the API would succeed 2 seconds later.

### `Promise.any(promises)` — first to succeed

- Ignores rejections until one fulfills.
- Returns that success value.
- If **all** reject, throws `AggregateError`.

**When to use:** fallbacks / mirrors. “Try 3 CDNs, I only need one good response.”

The lab: 404 + 500 + immediate reject + GitHub gists. Gists should win.

### Compare on one line

| Method | Waits for | Success when | Fails when |
|--------|-----------|--------------|------------|
| `all` | all settled or first reject | every Promise fulfills | any rejects |
| `allSettled` | all settled | always (array of outcomes) | almost never |
| `race` | first settled | first fulfill | first reject (whichever is first) |
| `any` | first fulfill | first success | all reject (`AggregateError`) |

### Predict

Run **race** then **any**. Why does race look like an error and any look like success?

### Challenge

In your own words (write it down):

- Why is `all` correct for “load these 4 files or show a fatal error”?
- Why is `allSettled` correct for “show whatever dashboard cards we can”?

---

## 9. The event loop

**Sidebar:** `6 · Event Loop`  
**File:** `js/event-loop/laboratory.js`

Do this chapter **after** Promises. The event loop is why log order looks “wrong.”

### The pieces

```
Call stack          — what is running NOW (one thing)
Web APIs            — browser: timers, fetch, XHR, DOM events
Microtask queue     — Promise .then, queueMicrotask, mutation observers
Macrotask queue     — setTimeout, setInterval, some I/O, many DOM events
Event loop          — “if stack is empty, run microtasks, then one macrotask, repeat”
```

### Rule (memorize this)

1. Run all **synchronous** code on the stack.
2. When the stack is empty, run **all microtasks**.
3. Then run **one macrotask** (for example one `setTimeout` callback).
4. After that macrotask, run **all microtasks again**.
5. Repeat.

Promises are microtasks. `setTimeout(..., 0)` is still a macrotask. **0 ms does not mean “run now.”** It means “run after sync + microtasks.”

### Experiment A — do this on paper first

```js
console.log('1 sync');
Promise.resolve().then(() => console.log('2 microtask'));
setTimeout(() => console.log('3 macrotask'), 0);
console.log('4 sync');
```

**Write your guess:** _______  
**Then click Run Experiment A.**

Correct order:

```
1 sync
4 sync
2 microtask
3 macrotask
```

Why: 1 and 4 are sync. The `.then` is queued as a microtask. The timeout is a macrotask. Microtasks drain before timers.

### Experiment B

Nested: a timeout that queues a Promise, and a Promise that queues a timeout.

Expected idea:

- `B-start`, `B-end` first (sync)
- then `B-microtask-outer` (microtask)
- then `B-macrotask-outer` (timer)
- then `B-microtask-inside-macrotask` (microtasks after that timer)
- then `B-macrotask-inside-microtask` (the timer scheduled from the first microtask)

If your prediction was different, that is the lesson. Trace it with the rule above.

### Experiment C — `queueMicrotask`

`queueMicrotask(fn)` puts `fn` on the **same** queue as `Promise.then`.

Order you should see:

```
C-sync
C-sync-end
C-queueMicrotask
C-promise-then
C-setTimeout
```

(`queueMicrotask` was registered first, so it usually runs before the Promise `.then` that was registered after it.)

### Experiment D — Fetch

`fetch()` is a Web API. The `.then` on fetch cannot run until the **network** answers. That is much later than a `Promise.resolve().then()`.

So:

- `D-before-fetch` and `D-after-fetch-call` are sync
- `D-microtask-queued-before-fetch-completes` runs almost immediately
- `D-setTimeout` soon after
- `D-fetch-then` last (after GitHub responds)

Fetch is not “slower JavaScript.” It is waiting on the network.

### Challenge

Without clicking, write Experiment A’s order from memory. Then click. If you got it right, you understand the event loop well enough to continue.

---

## 10. Custom errors and advanced error handling

**Sidebar:** `7 · Errors`  
**Files:** `js/errors/customErrors.js`, `js/errors/errorLab.js`

### Why custom error classes

`throw new Error('HTTP 404')` loses type information. You cannot easily write:

```js
if (err instanceof RateLimitError) { show('wait a minute'); }
```

So the lab defines:

| Class | Meaning |
|-------|---------|
| `ApiError` | server answered with a bad status |
| `NetworkError` | `fetch` threw (no response) |
| `RateLimitError` | GitHub 403 (extends `ApiError`) |

`fetchWithTypedErrors` maps real outcomes onto these classes.

Click **Custom Error Classes**. You should see `Caught ApiError` for httpbin 404, with a `status` field.

### Individual `.catch()` on each Promise

```js
const profile = fetch(...).catch((err) => ({ error: err.message, source: 'profile' }));
const repos   = fetch(...).catch((err) => ({ error: err.message, source: 'repos' }));
const bad     = fetch(failUrl).catch((err) => ({ error: err.message, source: 'httpbin' }));

await Promise.all([profile, repos, bad]);
```

Each failure becomes a **normal value**. `Promise.all` no longer fail-fasts, because none of the Promises reject — they recovered.

This is how you use `all` when you still want isolation.

### `Promise.all` recovery (same idea, helper function)

`demoAllRecovery` wraps every call in `.catch()` and then splits `ok` vs `failed`. Compare with `allSettled`:

- `allSettled` → inspect `status` / `value` / `reason`
- individual `.catch()` → you decide the fallback object yourself

Both are valid partial-failure strategies.

### Predict

If you remove `.catch()` from only the httpbin Promise in `demoIndividualCatch`, will `Promise.all` still succeed?

---

## 11. ES modules and Top-Level Await

**Sidebar:** `8 · Top-Level Await`  
**Files:** `js/modules/configLoader.js`, `js/modules/tlaLab.js`  
**Also look at:** `js/main.js` and the bottom of `index.html`

### ES modules

```html
<script type="module" src="js/main.js"></script>
```

```js
import { log } from './utils/logger.js';
export function initXhrLab() { ... }
```

What that gives you:

- each file is a **module** with its own scope (no accidental globals)
- `import` / `export` make dependencies visible
- files load **deferred** and in dependency order
- you must serve over HTTP (`file://` often fails)

DevPulse is entirely modules. That is why `js/main.js` can import every lab.

### Top-Level Await (TLA)

Normally `await` is only legal **inside** `async function`.

In an ES module you may write:

```js
const response = await fetch(CONFIG_URL);
const config = await response.json();

export const appConfig = { apiUser: config };
```

The module **pauses evaluation** until that fetch finishes. Anything that imports this module waits too.

**Why it exists:** load config/data before the rest of the module runs, without wrapping everything in `async function init()`.

**When it is useful:** small config, feature flags, locale files.

**Problems:**

- a slow TLA module **blocks** every importer
- errors during TLA can fail module load
- does **not** work in classic non-module scripts

### In DevPulse

The config module is **not** imported at startup. The TLA button uses **dynamic import**:

```js
const mod = await import('./configLoader.js');
```

TLA runs when that import happens (on click), not when the page first loads. That is a realistic pattern: load extra config only when needed.

Click **Load Module Config**. You should see a name/email from JSONPlaceholder user 1, and a duration in ms.

### Predict

Does `configLoader.js` fetch on page load, or when you click the button? (When you click, because of dynamic `import()`.)

---

## One-page cheat sheet

```
XHR          events + readyState; wrap in new Promise yourself
Fetch        returns Promise; check response.ok; then response.json()
HTTP 404     fetch FULFILLS (ok = false)
Network fail fetch REJECTS (TypeError)
Promise      pending → fulfilled | rejected
.then/.catch microtasks
.finally     cleanup always
async/await  syntax over Promises; async always returns a Promise
forgotten    await missing → you hold a Promise, not the data
all          fail-fast, need every result
allSettled   wait for all, inspect successes and failures
race         first settled (timeout vs request)
any          first success (fallbacks)
event loop   sync → all microtasks → one macrotask → repeat
TLA          await at module top; only in ES modules
```

---

## If you get stuck

| Feeling | Do this |
|---------|---------|
| “Too many files” | Ignore everything except the **one file** listed in the chapter. |
| “I click and nothing makes sense” | Read the Activity Log line by line. Each line is one async event. |
| “I don’t know what to predict” | Write the **order of console logs**, not the GitHub data. |
| “Fetch vs XHR is confusing” | They solve the **same job**. Only the **waiting model** differs. |
| “Combinators look the same” | One question: do I need all, any, first-done, or a scoreboard? |
| “Event loop is chaos” | Only Experiment A until you can recite `1 4 2 3`. |

When a chapter’s challenge is done, open `README.md` section **I. Exercises** for extra drills and hidden solutions.

You do not need to finish the whole lab in one sitting. **Chapter 1, one button, one log** is a successful start.
