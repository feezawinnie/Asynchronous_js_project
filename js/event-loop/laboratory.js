/**
 * Event Loop Laboratory
 *
 * Trace: Call Stack → Web APIs → Microtask Queue → Macrotask Queue → Event Loop
 */

import { log } from '../utils/logger.js';
import { GITHUB_API } from '../config.js';

function logOrder(label) {
  log.event(`[EventLoop] ${label}`);
  console.log(`%c${label}`, 'color: #a78bfa; font-weight: bold');
}

// ─── Experiment A: sync vs microtask vs macrotask ─────────────────────

export function experimentA() {
  log.info('Experiment A starting — predict order first!');
  logOrder('1 sync');
  Promise.resolve().then(() => logOrder('2 microtask'));
  setTimeout(() => logOrder('3 macrotask'), 0);
  logOrder('4 sync');
}

// ─── Experiment B: nested promises + setTimeout ──────────────────────

export function experimentB() {
  log.info('Experiment B starting');
  logOrder('B-start');

  setTimeout(() => {
    logOrder('B-macrotask-outer');
    Promise.resolve().then(() => logOrder('B-microtask-inside-macrotask'));
  }, 0);

  Promise.resolve().then(() => {
    logOrder('B-microtask-outer');
    setTimeout(() => logOrder('B-macrotask-inside-microtask'), 0);
  });

  logOrder('B-end');
}

// ─── Experiment C: queueMicrotask ────────────────────────────────────

export function experimentC() {
  log.info('Experiment C — queueMicrotask vs Promise vs setTimeout');
  logOrder('C-sync');

  queueMicrotask(() => logOrder('C-queueMicrotask'));

  Promise.resolve().then(() => logOrder('C-promise-then'));

  setTimeout(() => logOrder('C-setTimeout'), 0);

  logOrder('C-sync-end');
}

// ─── Experiment D: Fetch callback timing ─────────────────────────────

export function experimentD() {
  log.info('Experiment D — fetch is async via Web APIs');
  logOrder('D-before-fetch');

  fetch(`${GITHUB_API}/zen`)
    .then(() => logOrder('D-fetch-then (microtask after response)'));

  logOrder('D-after-fetch-call');

  Promise.resolve().then(() => logOrder('D-microtask-queued-before-fetch-completes'));

  setTimeout(() => logOrder('D-setTimeout'), 0);
}

// ─── UI ──────────────────────────────────────────────────────────────

export function initEventLoopLab() {
  $('btn-el-a')?.addEventListener('click', experimentA);
  $('btn-el-b')?.addEventListener('click', experimentB);
  $('btn-el-c')?.addEventListener('click', experimentC);
  $('btn-el-d')?.addEventListener('click', experimentD);
}

function $(id) { return document.getElementById(id); }
