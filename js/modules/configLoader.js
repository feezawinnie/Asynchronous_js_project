/**
 * Top-Level Await Demo Module
 *
 * This file uses `await` at the TOP LEVEL (not inside a function).
 * This ONLY works because the file is loaded as an ES module.
 *
 * Realistic use case: load remote configuration before the app uses it.
 */

const CONFIG_URL = 'https://jsonplaceholder.typicode.com/users/1';

// Top-Level Await — pauses module evaluation until fetch completes
let config;

try {
  const response = await fetch(CONFIG_URL);
  if (!response.ok) throw new Error(`Config fetch failed: ${response.status}`);
  config = await response.json();
} catch (err) {
  config = { error: err.message, fallback: true };
}

export const appConfig = {
  loadedAt: new Date().toISOString(),
  apiUser: config,
  moduleNote: 'This object was built using Top-Level Await in an ES module',
};

export function getConfigSummary() {
  if (config.error) {
    return `Config load failed: ${config.error} (using fallback)`;
  }
  return `Config loaded for: ${config.name} (${config.email})`;
}
