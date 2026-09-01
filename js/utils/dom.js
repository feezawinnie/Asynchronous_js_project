/** Small DOM helpers */

export function $(id) {
  return document.getElementById(id);
}

export function setText(id, text) {
  const el = $(id);
  if (el) el.textContent = text;
}

export function setHTML(id, html) {
  const el = $(id);
  if (el) el.innerHTML = html;
}

export function setStatus(message, type = 'info') {
  const el = $('global-status');
  if (!el) return;
  const badges = { info: 'badge-info', ok: 'badge-ok', error: 'badge-error', warn: 'badge-warn' };
  el.innerHTML = `<span class="${badges[type] || 'badge-info'}">${message}</span>`;
}

export function show(id) {
  $(id)?.classList.remove('hidden');
}

export function hide(id) {
  $(id)?.classList.add('hidden');
}
