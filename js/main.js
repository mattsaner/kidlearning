import { CATEGORIES, LANGUAGES } from './data.js';
import { settings, loadSettings, saveSettings, t } from './i18n.js';
import { el, holdButton } from './ui.js';
import { speak } from './speech.js';
import { VERSION, BUILD } from './version.js';
import { startExplore } from './games/explore.js';
import { startFindIt } from './games/findit.js';
import { startSounds } from './games/sounds.js';

const app = document.getElementById('app');
let cleanup = null;

function show(build, { back } = {}) {
  cleanup?.();
  cleanup = null;
  window.speechSynthesis?.cancel();
  const screen = el('main', { class: 'screen' });
  if (back) {
    screen.append(el('button', { class: 'back', type: 'button', 'aria-label': t().back, onpress: back }, '⬅️'));
  }
  app.replaceChildren(screen);
  cleanup = build(screen) || null;
}

function home() {
  show((s) => {
    const grid = el('div', { class: 'menu' });
    for (const cat of CATEGORIES) {
      grid.append(
        el('button', {
          class: 'tile', type: 'button',
          onpress: () => { speak(cat.names[settings.lang]); categoryScreen(cat); },
        }, el('span', { class: 'tile-icon' }, cat.icon), el('span', { class: 'tile-label' }, cat.names[settings.lang]))
      );
    }
    s.append(grid, holdButton('⚙️', 1500, openSettings, t().holdHint),
      el('div', { class: 'version' }, `v${VERSION} · ${BUILD}`));
  });
}

function categoryScreen(cat) {
  show((s) => {
    const modes = [
      { icon: '👆', label: t().explore, run: startExplore },
      { icon: '🔍', label: t().findit, run: startFindIt },
      // Real animal recordings: only for categories that have them
      ...(cat.items.some((i) => i.cry) ? [{ icon: '🔊', label: t().sounds, run: startSounds }] : []),
    ];
    const grid = el('div', { class: 'menu' });
    for (const m of modes) {
      grid.append(
        el('button', { class: 'tile', type: 'button', onpress: () => gameScreen(cat, m.run) },
          el('span', { class: 'tile-icon' }, m.icon), el('span', { class: 'tile-label' }, m.label))
      );
    }
    s.append(grid);
  }, { back: home });
}

function gameScreen(cat, run) {
  show((s) => run(s, cat), { back: () => categoryScreen(cat) });
}

function openSettings() {
  const dlg = el('dialog', { class: 'settings' });
  const render = () => {
    dlg.replaceChildren(
      el('h2', {}, t().settings),
      el('h3', {}, t().language),
      el('div', { class: 'row' }, ...LANGUAGES.map((l) =>
        el('button', {
          type: 'button', class: `chip${settings.lang === l.id ? ' on' : ''}`,
          onclick: () => { settings.lang = l.id; saveSettings(); render(); },
        }, `${l.flag} ${l.label}`))),
      el('h3', {}, t().sound),
      el('div', { class: 'row' },
        el('button', {
          type: 'button', class: `chip${settings.sound ? ' on' : ''}`,
          onclick: () => { settings.sound = !settings.sound; saveSettings(); render(); },
        }, settings.sound ? '🔊 ON' : '🔇 OFF')),
      el('h3', {}, t().choices),
      el('div', { class: 'row' }, ...[2, 3, 4].map((n) =>
        el('button', {
          type: 'button', class: `chip${settings.choices === n ? ' on' : ''}`,
          onclick: () => { settings.choices = n; saveSettings(); render(); },
        }, String(n)))),
      el('button', {
        type: 'button', class: 'chip close',
        onclick: () => { dlg.close(); dlg.remove(); home(); },
      }, t().close)
    );
  };
  render();
  dlg.addEventListener('cancel', () => { dlg.remove(); home(); });
  document.body.append(dlg);
  dlg.showModal();
}

// A toddler pressing hard or with a whole hand must not zoom, select or open menus.
// (iOS Safari ignores user-scalable=no, so block its gesture events explicitly.)
for (const ev of ['gesturestart', 'gesturechange', 'gestureend', 'dblclick', 'contextmenu']) {
  document.addEventListener(ev, (e) => e.preventDefault());
}
document.addEventListener('touchmove', (e) => { if (e.touches.length > 1) e.preventDefault(); }, { passive: false });

loadSettings();
home();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
