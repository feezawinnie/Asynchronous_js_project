/**
 * XHR Lab — Load GitHub profile with XMLHttpRequest
 *
 * WHY XHR HERE: This is the FIRST data-loading feature in the app.
 * You will later compare it with the Fetch-based repo loader.
 *
 * XHR uses events (load, progress, error, abort) — callback/event model.
 * Fetch uses Promises — cleaner but different mental model.
 */

import { getUsername, githubUserUrl } from '../config.js';
import { log } from '../utils/logger.js';
import { setHTML, setText, show, hide } from '../utils/dom.js';

let currentXhr = null;

/**
 * Load GitHub user profile via XMLHttpRequest.
 * Returns a Promise wrapper so callers can still use .then() if needed.
 */
export function loadProfileXHR(username) {
  return new Promise((resolve, reject) => {
    const url = githubUserUrl(username);
    const xhr = new XMLHttpRequest();
    currentXhr = xhr;

    log.event(`XHR open GET ${url}`);
    xhr.open('GET', url);
    xhr.setRequestHeader('Accept', 'application/vnd.github+json');

    // --- XHR EVENT: readyState changes (0→1→2→3→4) ---
    xhr.onreadystatechange = () => {
      log.event(`XHR readyState=${xhr.readyState} status=${xhr.status || 'pending'}`);
      if (xhr.readyState !== XMLHttpRequest.DONE) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      } else {
        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
      }
    };

    // --- XHR EVENT: download progress ---
    xhr.onprogress = (event) => {
      onProgress(event);
    };

    xhr.onerror = () => {
      log.error('XHR network error (onerror fired)');
      reject(new Error('Network error — XHR onerror'));
    };

    xhr.onabort = () => {
      log.warn('XHR aborted');
      reject(new Error('Request aborted'));
    };

    xhr.onloadstart = () => {
      log.event('XHR loadstart');
      show('xhr-progress');
      setText('xhr-progress-text', 'Downloading…');
    };

    xhr.onloadend = () => {
      log.event('XHR loadend');
      currentXhr = null;
    };

    xhr.send();
  });
}

/**
 * EXERCISE 1 — TODO: Update progress bar during download.
 *
 * Challenge: When event.lengthComputable is true, calculate percent
 * and set xhr-progress-bar width + xhr-progress-text.
 */
function onProgress(event) {
  // STUDENT TODO: implement progress bar update
  // Hint: percent = (event.loaded / event.total) * 100
  if (event.lengthComputable) {
    const percent = Math.round((event.loaded / event.total) * 100);
    const bar = document.getElementById('xhr-progress-bar');
    if (bar) bar.style.width = `${percent}%`;
    setText('xhr-progress-text', `Downloading… ${percent}%`);
    log.event(`XHR progress ${percent}%`);
  }
}

function renderProfile(user) {
  return `<span class="badge-ok">Success</span>
<strong>${user.login}</strong> — ${user.public_repos} repos, ${user.followers} followers
${user.bio ? `\nBio: ${user.bio}` : ''}
Avatar: ${user.avatar_url}`;
}

export function initXhrLab() {
  document.getElementById('btn-xhr-load')?.addEventListener('click', async () => {
    const username = getUsername();
    setHTML('xhr-result', '<span class="badge-info">Loading…</span>');
    log.info(`XHR: loading profile for "${username}"`);

    try {
      const user = await loadProfileXHR(username);
      setHTML('xhr-result', renderProfile(user));
      log.success(`XHR: loaded ${user.login}`);
    } catch (err) {
      setHTML('xhr-result', `<span class="badge-error">Error</span>\n${err.message}`);
      log.error(`XHR failed: ${err.message}`);
    } finally {
      hide('xhr-progress');
    }
  });

  document.getElementById('btn-xhr-abort')?.addEventListener('click', () => {
    if (currentXhr) {
      currentXhr.abort();
      log.warn('User aborted XHR');
    } else {
      log.warn('No active XHR to abort');
    }
  });

  document.getElementById('btn-xhr-404')?.addEventListener('click', async () => {
    setHTML('xhr-result', '<span class="badge-info">Loading nonexistent user…</span>');
    log.info('XHR: requesting nonexistent user "this-user-definitely-does-not-exist-xyz"');

    try {
      await loadProfileXHR('this-user-definitely-does-not-exist-xyz');
    } catch (err) {
      setHTML('xhr-result', `<span class="badge-error">HTTP Error</span>\n${err.message}`);
      log.error(`XHR 404: ${err.message}`);
    }
  });
}
