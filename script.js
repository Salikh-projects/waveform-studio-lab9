'use strict';
document.documentElement.classList.add('js');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
menu.hidden = false;
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
const themeButton = document.querySelector('.theme-toggle');
themeButton.hidden = false;
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? 'Light mode ◐' : 'Dark mode ◑';
  themeButton.setAttribute('aria-pressed', String(theme === 'light'));
}
try { applyTheme(localStorage.getItem('waveform-theme') === 'light' ? 'light' : 'dark'); } catch { applyTheme('dark'); }
themeButton.addEventListener('click', () => { const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(next); try { localStorage.setItem('waveform-theme', next); } catch { /* Theme still works without persistence. */ } });
const form = document.querySelector('#booking-form');
const service = form.elements.service;
const duration = form.elements.duration;
const engineer = form.elements.engineer;
const date = form.elements.date;
const status = document.querySelector('#form-status');
const total = document.querySelector('#total');
const download = document.querySelector('#download-request');
const clear = document.querySelector('#clear-request');
const rates = Object.freeze({vocal: 8000, mixing: 12000, podcast: 15000});
const names = Object.freeze({vocal: 'Vocal recording', mixing: 'Track mixing', podcast: 'Turnkey podcast'});
let lastRequest = null;
function today() { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`; }
function setMinDate() { date.min = today(); }
setMinDate(); date.addEventListener('focus', setMinDate);
function estimate() { return (rates[service.value] + (service.value === 'vocal' && engineer.checked ? 5000 : 0)) * Number(duration.value); }
function updateEstimate() {
  const included = service.value !== 'vocal';
  engineer.disabled = included;
  document.querySelector('#engineer-label').textContent = included ? 'Engineer included in this session' : 'Add a recording engineer (+5,000 ₸ / h)';
  total.value = `${estimate().toLocaleString('en-US')} ₸`;
}
form.addEventListener('change', updateEstimate);
updateEstimate();
document.querySelectorAll('[data-service]').forEach(link => link.addEventListener('click', () => { service.value = link.dataset.service; updateEstimate(); }));
function exposeRequest() { download.hidden = false; clear.hidden = false; }
try { const saved = JSON.parse(localStorage.getItem('waveform-request')); if (saved && saved.id && saved.totalKZT) { lastRequest = saved; exposeRequest(); status.textContent = 'A previous demo request is saved on this device. Download or delete it below.'; } } catch { /* Missing or blocked storage is handled on submit. */ }
form.addEventListener('submit', e => {
  e.preventDefault(); setMinDate();
  if (!form.reportValidity()) return;
  if (date.value < today()) { status.textContent = 'Please select today or a future date.'; date.focus(); return; }
  lastRequest = { id: `WF-${Date.now().toString(36).toUpperCase()}`, session: names[service.value], date: date.value, durationHours: Number(duration.value), engineer: service.value !== 'vocal' || engineer.checked, name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim(), totalKZT: estimate(), status: 'Demo request only — no studio time reserved' };
  let persisted = false;
  try { localStorage.setItem('waveform-request', JSON.stringify(lastRequest)); persisted = true; } catch { /* The request can still be downloaded from memory. */ }
  status.textContent = `${persisted ? 'Saved on this device' : 'Prepared in memory; browser storage is unavailable'}. ${lastRequest.id} · ${lastRequest.session} · ${lastRequest.date} · ${total.value}. No reservation was sent. You can download the request below.`;
  exposeRequest();
});
download.addEventListener('click', () => {
  if (!lastRequest) return;
  const blob = new Blob([JSON.stringify(lastRequest, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = `${lastRequest.id}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
clear.addEventListener('click', () => {
  try { localStorage.removeItem('waveform-request'); } catch { status.textContent = 'Browser storage is unavailable. Clear site data in your browser to remove any previous saved request.'; return; }
  lastRequest = null; form.reset(); setMinDate(); updateEstimate(); download.hidden = true; clear.hidden = true; status.textContent = 'Saved request deleted from this device.';
});
// The preview page uses the same source and can select an initial theme.
const requestedTheme = new URLSearchParams(location.search).get('theme');
if (requestedTheme === 'dark' || requestedTheme === 'light') applyTheme(requestedTheme);
