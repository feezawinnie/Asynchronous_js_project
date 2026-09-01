/**
 * Top-Level Await Lab UI
 *
 * Dynamically imports configLoader.js to demonstrate
 * that TLA runs when the module is first evaluated.
 */

import { log } from '../utils/logger.js';
import { setHTML } from '../utils/dom.js';

export function initTopLevelAwaitLab() {
  document.getElementById('btn-tla-load')?.addEventListener('click', async () => {
    setHTML('tla-result', '<span class="badge-info">Importing module (TLA runs now)…</span>');
    log.info('Dynamic import: js/modules/configLoader.js');

    const start = performance.now();
    const mod = await import('./configLoader.js');
    const elapsed = Math.round(performance.now() - start);

    log.success(`Module loaded in ${elapsed}ms via dynamic import`);
    log.event(`Top-Level Await already resolved config before export`);

    setHTML('tla-result',
      `<span class="badge-ok">Module loaded (${elapsed}ms)</span>\n` +
      `${mod.getConfigSummary()}\n\n` +
      `Full config:\n${JSON.stringify(mod.appConfig, null, 2)}`
    );
  });
}
