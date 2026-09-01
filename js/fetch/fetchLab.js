/**
 * Fetch Lab — repositories, HTTP methods, error types
 *
 * Compare this file with js/xhr/githubProfile.js:
 *   XHR  → events + manual Promise wrapper
 *   Fetch → returns Promise natively
 */

import { getUsername, githubReposUrl, JSONPLACEHOLDER, HTTPBIN } from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';

// ─── GET: GitHub repos ───────────────────────────────────────────────

export async function fetchRepos(username) {
  const url = githubReposUrl(username);
  log.info(`Fetch GET ${url}`);

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/vnd.github+json' },
  });

  // KEY LESSON: fetch() does NOT reject on HTTP 404/500!
  log.event(`Fetch response: status=${response.status}, ok=${response.ok}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const repos = await response.json();
  return repos;
}

// ─── HTTP error demos (httpbin) ──────────────────────────────────────

export async function fetchHttpStatus(code) {
  const url = `${HTTPBIN}/status/${code}`;
  log.info(`Fetch GET ${url} (expect HTTP ${code})`);

  const response = await fetch(url);
  log.event(`response.ok = ${response.ok}  (fetch did NOT reject!)`);

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} — you must check response.ok manually`);
  }
  return response;
}

export async function fetchNetworkError() {
  const url = 'https://this-domain-does-not-exist-xyz.invalid/api';
  log.info(`Fetch GET ${url} (expect network error)`);

  try {
    await fetch(url);
  } catch (err) {
    log.error(`Network error caught: ${err.message}`);
    throw err; // TypeError: Failed to fetch
  }
}

// ─── POST / PUT / PATCH / DELETE (JSONPlaceholder) ───────────────────

export async function postNote(username) {
  const url = `${JSONPLACEHOLDER}/posts`;
  const body = {
    title: `DevPulse note for ${username}`,
    body: 'Created via Fetch POST',
    userId: 1,
  };

  log.info(`Fetch POST ${url}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(`POST failed: ${response.status}`);
  return response.json();
}

export async function putNote(id = 1) {
  const url = `${JSONPLACEHOLDER}/posts/${id}`;
  log.info(`Fetch PUT ${url}`);
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, title: 'Updated via PUT', body: 'Full replacement', userId: 1 }),
  });
  if (!response.ok) throw new Error(`PUT failed: ${response.status}`);
  return response.json();
}

export async function patchNote(id = 1) {
  const url = `${JSONPLACEHOLDER}/posts/${id}`;
  log.info(`Fetch PATCH ${url}`);
  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Patched title only' }),
  });
  if (!response.ok) throw new Error(`PATCH failed: ${response.status}`);
  return response.json();
}

export async function deleteNote(id = 1) {
  const url = `${JSONPLACEHOLDER}/posts/${id}`;
  log.info(`Fetch DELETE ${url}`);
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) throw new Error(`DELETE failed: ${response.status}`);
  return { deleted: true, status: response.status };
}

// ─── UI wiring ───────────────────────────────────────────────────────

function formatRepos(repos) {
  if (!repos.length) return 'No repos found.';
  return repos.map((r) => `• ${r.name} (★ ${r.stargazers_count})`).join('\n');
}

export function initFetchLab() {
  $('btn-fetch-repos')?.addEventListener('click', async () => {
    setHTML('fetch-repos-result', '<span class="badge-info">Loading…</span>');
    try {
      const repos = await fetchRepos(getUsername());
      setHTML('fetch-repos-result', `<span class="badge-ok">OK</span>\n${formatRepos(repos)}`);
      log.success(`Fetched ${repos.length} repos`);
    } catch (e) {
      setHTML('fetch-repos-result', `<span class="badge-error">Error</span>\n${e.message}`);
    }
  });

  $('btn-fetch-404')?.addEventListener('click', () => demoError('fetch-error-result', () => fetchHttpStatus(404)));
  $('btn-fetch-500')?.addEventListener('click', () => demoError('fetch-error-result', () => fetchHttpStatus(500)));
  $('btn-fetch-bad-url')?.addEventListener('click', () => demoError('fetch-error-result', fetchNetworkError));

  $('btn-fetch-post')?.addEventListener('click', async () => {
    setHTML('fetch-post-result', '<span class="badge-info">Posting…</span>');
    try {
      const result = await postNote(getUsername());
      setHTML('fetch-post-result', `<span class="badge-ok">Created id=${result.id}</span>\n${JSON.stringify(result, null, 2)}`);
    } catch (e) {
      setHTML('fetch-post-result', `<span class="badge-error">${e.message}</span>`);
    }
  });

  $('btn-fetch-put')?.addEventListener('click', () => demoMutate(putNote));
  $('btn-fetch-patch')?.addEventListener('click', () => demoMutate(patchNote));
  $('btn-fetch-delete')?.addEventListener('click', () => demoMutate(deleteNote));
}

function $(id) { return document.getElementById(id); }

async function demoError(panelId, fn) {
  setHTML(panelId, '<span class="badge-info">Running…</span>');
  try {
    await fn();
    setHTML(panelId, '<span class="badge-ok">Unexpected success</span>');
  } catch (e) {
    const type = e.message.includes('Network') || e.name === 'TypeError' ? 'Network Error' : 'HTTP Error';
    setHTML(panelId, `<span class="badge-error">${type}</span>\n${e.message}`);
  }
}

async function demoMutate(fn) {
  setHTML('fetch-mutate-result', '<span class="badge-info">Running…</span>');
  try {
    const result = await fn();
    setHTML('fetch-mutate-result', `<span class="badge-ok">OK</span>\n${JSON.stringify(result, null, 2)}`);
  } catch (e) {
    setHTML('fetch-mutate-result', `<span class="badge-error">${e.message}</span>`);
  }
}
