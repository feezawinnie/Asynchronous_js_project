/** Shared API endpoints and constants */

export const GITHUB_API = 'https://api.github.com';
export const JSONPLACEHOLDER = 'https://jsonplaceholder.typicode.com';
export const HTTPBIN = 'https://httpbin.org';

/** Default username — overridden by UI input */
export function getUsername() {
  const input = document.getElementById('username-input');
  return (input?.value || 'octocat').trim() || 'octocat';
}

export function githubUserUrl(username) {
  return `${GITHUB_API}/users/${encodeURIComponent(username)}`;
}

export function githubReposUrl(username) {
  return `${GITHUB_API}/users/${encodeURIComponent(username)}/repos?per_page=5&sort=updated`;
}

export function githubFollowersUrl(username) {
  return `${GITHUB_API}/users/${encodeURIComponent(username)}/followers?per_page=3`;
}

export function githubGistsUrl(username) {
  return `${GITHUB_API}/users/${encodeURIComponent(username)}/gists?per_page=3`;
}
