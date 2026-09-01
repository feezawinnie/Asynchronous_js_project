/**
 * Activity Log — visualizes async flow in the UI.
 * Every major async operation logs here so you can trace timing.
 */

const logOutput = () => document.getElementById('log-output');

function timestamp() {
  return new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 });
}

function append(type, message, cssClass) {
  const el = logOutput();
  if (!el) return;
  const line = document.createElement('div');
  line.className = cssClass;
  line.textContent = `[${timestamp()}] ${type}: ${message}`;
  el.appendChild(line);
  el.scrollTop = el.scrollHeight;
}

export const log = {
  info:    (msg) => { console.log(msg);    append('INFO', msg, 'log-info'); },
  success: (msg) => { console.log('✓', msg); append('OK', msg, 'log-success'); },
  error:   (msg) => { console.error(msg);  append('ERR', msg, 'log-error'); },
  warn:    (msg) => { console.warn(msg);   append('WARN', msg, 'log-warn'); },
  event:   (msg) => { console.log('⚡', msg); append('EVENT', msg, 'log-event'); },
};

export function clearLog() {
  const el = logOutput();
  if (el) el.innerHTML = '';
}

document.getElementById('btn-clear-log')?.addEventListener('click', clearLog);
