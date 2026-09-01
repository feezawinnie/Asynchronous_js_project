/**
 * Custom Error Classes
 *
 * Use when you need to distinguish error TYPES programmatically.
 */

export class ApiError extends Error {
  constructor(message, { status, url, source } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.source = source;
  }
}

export class NetworkError extends Error {
  constructor(message, { url } = {}) {
    super(message);
    this.name = 'NetworkError';
    this.url = url;
  }
}

export class RateLimitError extends ApiError {
  constructor(message, meta) {
    super(message, meta);
    this.name = 'RateLimitError';
  }
}

/**
 * Wrap a fetch response — throw typed errors instead of generic Error.
 */
export async function fetchWithTypedErrors(url, source) {
  let response;
  try {
    response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  } catch (err) {
    throw new NetworkError(`Network failure: ${err.message}`, { url });
  }

  if (response.status === 403) {
    throw new RateLimitError('GitHub rate limit exceeded', { status: 403, url, source });
  }

  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status}`, { status: response.status, url, source });
  }

  return response.json();
}
