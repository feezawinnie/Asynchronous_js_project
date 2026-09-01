/** Promise-based delay utility */

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a Promise that rejects after `ms` milliseconds.
 * Used with Promise.race() for timeout patterns.
 */
export function timeout(ms, message = `Timeout after ${ms}ms`) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}
