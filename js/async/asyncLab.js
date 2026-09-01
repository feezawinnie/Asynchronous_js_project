/**
 * Async/Await Lab
 *
 * Key lesson: async functions ALWAYS return a Promise.
 * await pauses the function, not the thread.
 */

import { getUsername, githubUserUrl, githubReposUrl, githubFollowersUrl } from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';

async function fetchUser(username) {
  const res = await fetch(githubUserUrl(username), {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Profile HTTP ${res.status}`);
  return res.json();
}

async function fetchRepoCount(username) {
  const res = await fetch(githubReposUrl(username), {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Repos HTTP ${res.status}`);
  const repos = await res.json();
  return repos.length;
}

async function fetchFollowerCount(username) {
  const res = await fetch(githubFollowersUrl(username), {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Followers HTTP ${res.status}`);
  const followers = await res.json();
  return followers.length;
}

// ─── Sequential await (slower — each waits for previous) ─────────────

export async function loadSequential(username) {
  const start = performance.now();
  log.info('Sequential: await profile, then repos, then followers');

  const user = await fetchUser(username);
  log.event(`Got profile: ${user.login}`);

  const repoCount = await fetchRepoCount(username);
  log.event(`Got repos: ${repoCount}`);

  const followerCount = await fetchFollowerCount(username);
  log.event(`Got followers: ${followerCount}`);

  const elapsed = Math.round(performance.now() - start);
  return { login: user.login, repoCount, followerCount, elapsed, mode: 'sequential' };
}

// ─── Concurrent with Promise.all (faster) ────────────────────────────

export async function loadConcurrent(username) {
  const start = performance.now();
  log.info('Concurrent: start all 3 fetches, await Promise.all');

  const [user, repoCount, followerCount] = await Promise.all([
    fetchUser(username),
    fetchRepoCount(username).then((c) => c),
    fetchFollowerCount(username).then((c) => c),
  ]);

  const elapsed = Math.round(performance.now() - start);
  return { login: user.login, repoCount, followerCount, elapsed, mode: 'concurrent' };
}

// ─── try/catch/finally ───────────────────────────────────────────────

export async function loadWithTryCatch(username) {
  let result;
  try {
    log.info('try/catch: loading profile');
    result = await fetchUser(username);
    log.success(`Loaded ${result.login}`);
  } catch (err) {
    log.error(`Caught: ${err.message}`);
    throw err;
  } finally {
    log.event('finally: cleanup runs whether success or failure');
  }
  return result;
}

// ─── Forgotten await BUG ─────────────────────────────────────────────

/** BUG: missing await — returns Promise instead of user object */
export async function loadProfileBug(username) {
  log.warn('BUG: fetchUser() called WITHOUT await');
  const user = fetchUser(username); // ← Forgotten await!
  log.event(`typeof user = ${typeof user} — it's a Promise!`);
  return user; // Returns Promise, not resolved data
}

/** FIXED: with await */
export async function loadProfileFixed(username) {
  log.info('FIXED: await fetchUser()');
  const user = await fetchUser(username);
  log.event(`typeof user = ${typeof user} — it's an object`);
  return user;
}

// ─── UI ──────────────────────────────────────────────────────────────

export function initAsyncLab() {
  $('btn-async-sequential')?.addEventListener('click', () => runDemo(loadSequential));
  $('btn-async-concurrent')?.addEventListener('click', () => runDemo(loadConcurrent));
  $('btn-async-trycatch')?.addEventListener('click', () => runDemo(loadWithTryCatch));

  $('btn-forgotten-await')?.addEventListener('click', async () => {
    setHTML('async-result', '<span class="badge-info">Running with forgotten await…</span>');
    const result = await loadProfileBug(getUsername());
    const isPromise = result instanceof Promise;
    setHTML('async-result',
      `<span class="badge-error">Bug!</span>\n` +
      `result instanceof Promise: ${isPromise}\n` +
      `result.login: ${result.login ?? 'undefined ← because user is still a Promise!'}\n\n` +
      `Inspect result in console — you'll see a pending Promise.`
    );
    console.log('Forgotten await result:', result);
  });

  $('btn-forgotten-await-fixed')?.addEventListener('click', async () => {
    setHTML('async-result', '<span class="badge-info">Running with await fixed…</span>');
    const user = await loadProfileFixed(getUsername());
    setHTML('async-result',
      `<span class="badge-ok">Fixed!</span>\n` +
      `login: ${user.login}\n` +
      `followers: ${user.followers}\n` +
      `public_repos: ${user.public_repos}`
    );
  });
}

async function runDemo(fn) {
  setHTML('async-result', '<span class="badge-info">Running…</span>');
  try {
    const result = await fn(getUsername());
    setHTML('async-result', `<span class="badge-ok">Done (${result.elapsed ?? '~'}ms)</span>\n${JSON.stringify(result, null, 2)}`);
  } catch (e) {
    setHTML('async-result', `<span class="badge-error">${e.message}</span>`);
  }
}

function $(id) { return document.getElementById(id); }
