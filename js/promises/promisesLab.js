/**
 * Promises Lab — creating, chaining, error handling, .finally()
 */

import { getUsername, githubUserUrl, githubReposUrl } from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';
import { delay } from '../utils/delay.js';

// ─── Creating a Promise manually ─────────────────────────────────────

export function createManualPromise(shouldResolve = true) {
  return new Promise((resolve, reject) => {
    log.event('Executor function runs SYNCHRONOUSLY');
    setTimeout(() => {
      if (shouldResolve) {
        log.event('Promise resolving with data');
        resolve({ message: 'Promise resolved!', timestamp: Date.now() });
      } else {
        log.event('Promise rejecting with error');
        reject(new Error('Promise deliberately rejected'));
      }
    }, 1000);
  });
}

// ─── Promise chaining ────────────────────────────────────────────────

export function demoPromiseChain(username) {
  log.info('Chain step 1: fetch profile');
  return fetch(githubUserUrl(username))
    .then((res) => {
      log.event('Chain step 2: check response.ok');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((user) => {
      log.event(`Chain step 3: got user ${user.login}, fetch repos`);
      return fetch(githubReposUrl(user.login));
    })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((repos) => {
      log.event(`Chain step 4: got ${repos.length} repos`);
      return { repoCount: repos.length, topRepo: repos[0]?.name ?? 'none' };
    });
}

/**
 * EXERCISE 5 — Student implements this chain.
 * Currently works as reference; student can rewrite from scratch.
 */
export function exerciseChainRepos(username) {
  // TODO (student): rewrite this chain yourself without looking at demoPromiseChain
  return demoPromiseChain(username);
}

// ─── .catch() and .finally() ─────────────────────────────────────────

export function demoRejectWithCatch() {
  return createManualPromise(false)
    .then((data) => {
      log.info('This .then() will NOT run');
      return data;
    })
    .catch((err) => {
      log.warn(`.catch() handled: ${err.message}`);
      return { recovered: true, error: err.message };
    });
}

export function demoFinally() {
  let loading = true;
  return createManualPromise(true)
    .then((data) => {
      log.success('Promise resolved in finally demo');
      return data;
    })
    .catch((err) => {
      log.error(err.message);
      throw err;
    })
    .finally(() => {
      loading = false;
      log.event(`.finally() always runs — loading=${loading}`);
    });
}

// ─── UI ──────────────────────────────────────────────────────────────

export function initPromisesLab() {
  $('btn-promise-create')?.addEventListener('click', async () => {
    setHTML('promise-result', '<span class="badge-info">Creating Promise (1s delay)…</span>');
    log.info('Creating manual Promise');
    try {
      const data = await createManualPromise(true);
      setHTML('promise-result', `<span class="badge-ok">Resolved</span>\n${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      setHTML('promise-result', `<span class="badge-error">${e.message}</span>`);
    }
  });

  $('btn-promise-chain')?.addEventListener('click', async () => {
    setHTML('promise-result', '<span class="badge-info">Chaining…</span>');
    try {
      const result = await demoPromiseChain(getUsername());
      setHTML('promise-result', `<span class="badge-ok">Chain complete</span>\n${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      setHTML('promise-result', `<span class="badge-error">${e.message}</span>`);
    }
  });

  $('btn-promise-reject')?.addEventListener('click', async () => {
    setHTML('promise-result', '<span class="badge-info">Rejecting…</span>');
    const result = await demoRejectWithCatch();
    setHTML('promise-result', `<span class="badge-warn">Recovered via .catch()</span>\n${JSON.stringify(result, null, 2)}`);
  });

  $('btn-promise-finally')?.addEventListener('click', async () => {
    setHTML('promise-result', '<span class="badge-info">Running .finally() demo…</span>');
    await demoFinally();
    setHTML('promise-result', '<span class="badge-ok">Check log — .finally() ran regardless of outcome</span>');
  });
}

function $(id) { return document.getElementById(id); }
