# Asynchronous JavaScript Projects

This repository is a collection of **hands-on asynchronous JavaScript projects**.

Each project lives on its **own branch**. Together, those branches cover the main asynchronous JavaScript concepts through practice, not theory alone.

## Purpose

Use this repo to:

- learn asynchronous JavaScript by building and running real projects
- practice the full set of async concepts in the browser
- keep `main` as the index of the repo, while each branch holds a complete project

## What the projects cover

Across the branches you will work with:

- XMLHttpRequest
- Promises (create, consume, chain, error handling, `.finally()`)
- Fetch API (methods, headers, bodies, `response.ok`, HTTP vs network errors)
- async/await (`try/catch/finally`, sequential vs concurrent, forgotten `await`)
- Promise combinators (`Promise.all`, `Promise.race`, `Promise.allSettled`, `Promise.any`)
- the event loop (microtasks and macrotasks)
- custom errors and partial-failure handling
- ES modules and Top-Level Await

## Branches

`main` only describes this repository.

Checkout a branch to open a project:

| Branch | Project |
|--------|---------|
| [`ft/project_async`](https://github.com/feezawinnie/Asynchronous_js_project/tree/ft/project_async) | DevPulse — async JavaScript laboratory (XHR, Fetch, Promises, async/await, combinators, event loop, errors) |

```bash
git checkout ft/project_async
```

Add more async practice projects on new branches. Keep `main` as this purpose README.
