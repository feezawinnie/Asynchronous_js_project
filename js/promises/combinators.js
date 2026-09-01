/**
 * Promise Combinators Lab
 *
 * Promise.all()       — all must succeed (fail-fast)
 * Promise.allSettled() — wait for all, partial failures OK
 * Promise.race()      — first to settle (success OR failure)
 * Promise.any()       — first to SUCCEED (ignores failures until all fail)
 */

import {
  getUsername,
  githubUserUrl,
  githubReposUrl,
  githubFollowersUrl,
  githubGistsUrl,
  HTTPBIN,
} from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';
import { timeout } from '../utils/delay.js';

// ─── Helper: fetch JSON or throw ─────────────────────────────────────

async function fetchJSON(url, label) {
  log.info(`[${label}] GET ${url}`);
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`[${label}] HTTP ${res.status}`);
  return res.json();
}

async function fetchHTTPError(label) {
  log.info(`[${label}] GET httpbin/status/500 (will fail)`);
  const res = await fetch(`${HTTPBIN}/status/500`);
  if (!res.ok) throw new Error(`[${label}] HTTP ${res.status}`);
  return res.json();
}

// ─── Build the 4-request batch: A✓ B✓ C✗ D✓ ───────────────────────

function buildBatch(username) {
  return [
    fetchJSON(githubUserUrl(username), 'A-profile').then((d) => ({ source: 'A', login: d.login })),
    fetchJSON(githubReposUrl(username), 'B-repos').then((d) => ({ source: 'B', count: d.length })),
    fetchHTTPError('C-httpbin'),  // intentional failure
    fetchJSON(githubFollowersUrl(username), 'D-followers').then((d) => ({ source: 'D', count: d.length })),
  ];
}

// ─── Promise.all() — fail-fast ───────────────────────────────────────

export async function runPromiseAll(username) {
  log.info('Promise.all() — one failure kills the batch');
  const results = await Promise.all(buildBatch(username));
  return results;
}

// ─── Promise.allSettled() — partial failure ──────────────────────────

export async function runPromiseAllSettled(username) {
  log.info('Promise.allSettled() — all requests finish');
  const results = await Promise.allSettled(buildBatch(username));

  const successes = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value);

  const failures = results
    .filter((r) => r.status === 'rejected')
    .map((r) => r.reason?.message ?? String(r.reason));

  return { successes, failures, raw: results };
}

// ─── Promise.race() — API vs timeout ─────────────────────────────────

export async function runPromiseRace(username) {
  log.info('Promise.race() — API vs 3s timeout');

  const apiRequest = fetch(githubUserUrl(username)).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json().then((user) => ({ winner: 'API', login: user.login }));
  });

  const timeoutPromise = timeout(3000, 'Timeout won the race!').then((msg) => {
    throw new Error(msg);
  });

  // Slow down API artificially to demonstrate timeout winning
  const slowApi = apiRequest.then(async (result) => {
    await new Promise((r) => setTimeout(r, 5000)); // 5s delay — timeout wins
    return result;
  });

  return Promise.race([slowApi, timeoutPromise]);
}

// ─── Promise.any() — first success among fallbacks ───────────────────

export async function runPromiseAny(username) {
  log.info('Promise.any() — 3 failures + 1 success');

  const fail1 = fetch(`${HTTPBIN}/status/404`).then((r) => {
    if (!r.ok) throw new Error('Source 1: 404');
    return r.json();
  });

  const fail2 = fetch(`${HTTPBIN}/status/500`).then((r) => {
    if (!r.ok) throw new Error('Source 2: 500');
    return r.json();
  });

  const fail3 = Promise.reject(new Error('Source 3: immediate reject'));

  const success = fetchJSON(githubGistsUrl(username), 'Source 4-gists').then((gists) => ({
    source: 'GitHub gists',
    count: gists.length,
  }));

  return Promise.any([fail1, fail2, fail3, success]);
}

// ─── UI ──────────────────────────────────────────────────────────────

function formatAllSettled(result) {
  let out = `Successes (${result.successes.length}):\n`;
  result.successes.forEach((s) => { out += `  ✓ ${JSON.stringify(s)}\n`; });
  out += `\nFailures (${result.failures.length}):\n`;
  result.failures.forEach((f) => { out += `  ✗ ${f}\n`; });
  return out;
}

export function initCombinatorsLab() {
  $('btn-all')?.addEventListener('click', async () => {
    setHTML('all-result', '<span class="badge-info">Running Promise.all()…</span>');
    try {
      const results = await runPromiseAll(getUsername());
      setHTML('all-result', `<span class="badge-ok">All succeeded</span>\n${JSON.stringify(results, null, 2)}`);
    } catch (e) {
      setHTML('all-result', `<span class="badge-error">Fail-fast!</span>\n${e.message}\n\nRequests A, B, D may have succeeded but Promise.all() rejected immediately when C failed.`);
      log.error(`Promise.all rejected: ${e.message}`);
    }
  });

  $('btn-allsettled')?.addEventListener('click', async () => {
    setHTML('allsettled-result', '<span class="badge-info">Running Promise.allSettled()…</span>');
    const result = await runPromiseAllSettled(getUsername());
    setHTML('allsettled-result', formatAllSettled(result));
    log.success(`allSettled: ${result.successes.length} ok, ${result.failures.length} failed`);
  });

  $('btn-race')?.addEventListener('click', async () => {
    setHTML('race-result', '<span class="badge-info">Racing API (5s delay) vs 3s timeout…</span>');
    try {
      const winner = await runPromiseRace(getUsername());
      setHTML('race-result', `<span class="badge-ok">Winner</span>\n${JSON.stringify(winner, null, 2)}`);
    } catch (e) {
      setHTML('race-result', `<span class="badge-warn">Race settled with rejection</span>\n${e.message}\n\nTimeout won because API was artificially delayed 5s.`);
    }
  });

  $('btn-any')?.addEventListener('click', async () => {
    setHTML('any-result', '<span class="badge-info">Running Promise.any()…</span>');
    try {
      const result = await runPromiseAny(getUsername());
      setHTML('any-result', `<span class="badge-ok">First success</span>\n${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      setHTML('any-result', `<span class="badge-error">AggregateError — all sources failed</span>\n${e.message}`);
    }
  });
}

function $(id) { return document.getElementById(id); }
