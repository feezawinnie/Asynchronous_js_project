/**
 * Advanced Error Handling Lab
 */

import { getUsername, githubUserUrl, githubReposUrl, githubFollowersUrl, HTTPBIN } from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';
import { ApiError, NetworkError, RateLimitError, fetchWithTypedErrors } from './customErrors.js';

// ─── Custom error demo ───────────────────────────────────────────────

export async function demoCustomErrors() {
  const username = getUsername();
  const results = [];

  try {
    const user = await fetchWithTypedErrors(githubUserUrl(username), 'profile');
    results.push(`✓ Profile: ${user.login}`);
  } catch (err) {
    if (err instanceof RateLimitError) {
      results.push(`⚠ Rate limited: ${err.message}`);
    } else if (err instanceof ApiError) {
      results.push(`✗ API error [${err.status}]: ${err.message}`);
    } else if (err instanceof NetworkError) {
      results.push(`✗ Network: ${err.message}`);
    } else {
      results.push(`✗ Unknown: ${err.message}`);
    }
  }

  try {
    await fetchWithTypedErrors(`${HTTPBIN}/status/404`, 'httpbin');
  } catch (err) {
    results.push(`✗ Caught ${err.name}: ${err.message} (status=${err.status})`);
  }

  return results.join('\n');
}

// ─── Individual .catch() on each promise ───────────────────────────

export async function demoIndividualCatch(username) {
  log.info('Each promise has its own .catch() — failures isolated');

  const profile = fetchWithTypedErrors(githubUserUrl(username), 'profile')
    .catch((err) => ({ error: err.message, source: 'profile' }));

  const repos = fetchWithTypedErrors(githubReposUrl(username), 'repos')
    .catch((err) => ({ error: err.message, source: 'repos' }));

  const bad = fetchWithTypedErrors(`${HTTPBIN}/status/500`, 'httpbin')
    .catch((err) => ({ error: err.message, source: 'httpbin' }));

  const results = await Promise.all([profile, repos, bad]);
  return results;
}

// ─── Promise.all() with recovery strategy ────────────────────────────

export async function demoAllRecovery(username) {
  log.info('Promise.all() with pre-caught promises — batch always resolves');

  const safe = (url, source) =>
    fetchWithTypedErrors(url, source).catch((err) => ({
      failed: true,
      source,
      reason: err.message,
    }));

  const results = await Promise.all([
    safe(githubUserUrl(username), 'profile'),
    safe(githubReposUrl(username), 'repos'),
    safe(githubFollowersUrl(username), 'followers'),
    safe(`${HTTPBIN}/status/500`, 'httpbin'),
  ]);

  const ok = results.filter((r) => !r.failed);
  const failed = results.filter((r) => r.failed);

  return { ok, failed, summary: `${ok.length} succeeded, ${failed.length} failed` };
}

// ─── UI ──────────────────────────────────────────────────────────────

export function initErrorsLab() {
  $('btn-error-custom')?.addEventListener('click', async () => {
    setHTML('error-result', '<span class="badge-info">Running…</span>');
    const text = await demoCustomErrors();
    setHTML('error-result', text);
  });

  $('btn-error-individual-catch')?.addEventListener('click', async () => {
    setHTML('error-result', '<span class="badge-info">Running…</span>');
    const results = await demoIndividualCatch(getUsername());
    setHTML('error-result', JSON.stringify(results, null, 2));
  });

  $('btn-error-all-recovery')?.addEventListener('click', async () => {
    setHTML('error-result', '<span class="badge-info">Running…</span>');
    const result = await demoAllRecovery(getUsername());
    setHTML('error-result',
      `<span class="badge-ok">${result.summary}</span>\n` +
      `Succeeded:\n${JSON.stringify(result.ok, null, 2)}\n\n` +
      `Failed:\n${JSON.stringify(result.failed, null, 2)}`
    );
  });
}

function $(id) { return document.getElementById(id); }
