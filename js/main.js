/**
 * DevPulse Async Laboratory — entry point
 * ES Module bootstrap: wires navigation and all lab panels.
 */

import { initNavigation } from './ui/navigation.js';
import { initXhrLab } from './xhr/githubProfile.js';
import { initFetchLab } from './fetch/fetchLab.js';
import { initPromisesLab } from './promises/promisesLab.js';
import { initCombinatorsLab } from './promises/combinators.js';
import { initAsyncLab } from './async/asyncLab.js';
import { initEventLoopLab } from './event-loop/laboratory.js';
import { initErrorsLab } from './errors/errorLab.js';
import { initTopLevelAwaitLab } from './modules/tlaLab.js';
import { log } from './utils/logger.js';

log.info('DevPulse booting — ES module entry point loaded');
log.info('Open each lab panel and watch this log + DevTools console');

initNavigation();
initXhrLab();
initFetchLab();
initPromisesLab();
initCombinatorsLab();
initAsyncLab();
initEventLoopLab();
initErrorsLab();
initTopLevelAwaitLab();
