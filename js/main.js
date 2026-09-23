import { CATEGORIES, LANGUAGES } from './data.js';
import { settings, loadSettings, saveSettings, t } from './i18n.js';
import { el, holdButton } from './ui.js';
import { speak } from './speech.js';
import { VERSION, BUILD } from './version.js';
import { startExplore } from './games/explore.js';
import { startFindIt } from './games/findit.js';
import { startSounds } from './games/sounds.js';
import { startPaint, thumbnail } from './games/paint.js';
import { DRAWINGS } from './drawings.js';
import { startBody } from './games/body.js';
import { startHide } from './games/hide.js';
import { startInstruments, startFreezeDance } from './games/music.js';
import { playtime, startPlaytime, fmt } from './playtime.js';

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
    grid.append(
      el('button', { class: 'tile', type: 'button', onpress: () => { speak(t().body); bodyScreen(); } },
        el('span', { class: 'tile-icon' }, '🧸'), el('span', { class: 'tile-label' }, t().body)),
      el('button', { class: 'tile', type: 'button', onpress: () => { speak(t().hide); show((s2) => startHide(s2), { back: home }); } },
        el('span', { class: 'tile-icon' }, '🙈'), el('span', { class: 'tile-label' }, t().hide)),
      el('button', { class: 'tile', type: 'button', onpress: () => { speak(t().music); musicScreen(); } },
        el('span', { class: 'tile-icon' }, '🎵'), el('span', { class: 'tile-label' }, t().music)),
      el('button', { class: 'tile', type: 'button', onpress: () => { speak(t().draw); drawingChooser(); } },
        el('span', { class: 'tile-icon' }, '🖍️'), el('span', { class: 'tile-label' }, t().draw))
    );
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

function bodyScreen() {
  show((s) => {
    const grid = el('div', { class: 'menu' });
    for (const m of [{ icon: '👆', label: t().explore, mode: 'explore' }, { icon: '🔍', label: t().findit, mode: 'find' }]) {
      grid.append(el('button', { class: 'tile', type: 'button', onpress: () => bodyGame(m.mode) },
        el('span', { class: 'tile-icon' }, m.icon), el('span', { class: 'tile-label' }, m.label)));
    }
    s.append(grid);
  }, { back: home });
}

function bodyGame(mode) {
  show((s) => startBody(s, mode), { back: bodyScreen });
}

function musicScreen() {
  show((s) => {
    const grid = el('div', { class: 'menu' });
    for (const m of [{ icon: '🥁', label: t().instruments, run: startInstruments }, { icon: '💃', label: t().freezeDance, run: startFreezeDance }]) {
      grid.append(el('button', { class: 'tile', type: 'button', onpress: () => show((s2) => m.run(s2), { back: musicScreen }) },
        el('span', { class: 'tile-icon' }, m.icon), el('span', { class: 'tile-label' }, m.label)));
    }
    s.append(grid);
  }, { back: home });
}

function drawingChooser() {
  show((s) => {
    const grid = el('div', { class: 'grid drawings' });
    for (const d of DRAWINGS) {
      grid.append(el('button', {
        class: 'card', type: 'button', 'aria-label': d.names.en,
        onpress: () => { speak(d.names[settings.lang]); paintScreen(d); },
      }, thumbnail(d)));
    }
    s.append(grid);
  }, { back: home });
}

// Next drawing after a finished one: a shuffled bag, so every drawing comes up
// before any of them repeats (and never the same one twice in a row).
let drawingBag = [];
function nextDrawing(current) {
  drawingBag = drawingBag.filter((d) => d.id !== current.id);
  if (!drawingBag.length) {
    drawingBag = DRAWINGS.filter((d) => d.id !== current.id).sort(() => Math.random() - 0.5);
  }
  return drawingBag.pop();
}

function paintScreen(drawing, entering = false) {
  show((s) => startPaint(s, drawing, {
    entering,
    onFinish: () => paintScreen(nextDrawing(drawing), true),
  }), { back: drawingChooser });
}

function gameScreen(cat, run) {
  show((s) => run(s, cat), { back: () => categoryScreen(cat) });
}

// Attribution for the third-party sound recordings (CC BY / CC BY-SA require it).
let soundCredits = null;
const animalEmoji = Object.fromEntries(CATEGORIES.flatMap((c) => c.items).filter((i) => i.emoji).map((i) => [i.id, i.emoji]));

function creditsView(dlg, back) {
  const link = (href, text) => el('a', { href, target: '_blank', rel: 'noopener noreferrer' }, text);
  const list = el('ul', { class: 'credits-list' }, el('li', {}, '…'));
  const fill = (recordings) => list.replaceChildren(...recordings.map((r) => el('li', {},
    `${animalEmoji[r.animal] || ''} “`, link(r.original.url, r.original.title), `” — ${r.original.author} · `,
    r.license.url ? link(r.license.url, r.license.name) : r.license.name, ` · ${r.changes}`)));
  if (soundCredits) fill(soundCredits);
  else fetch('assets/audio/cries/sources.json').then((r) => r.json()).then((d) => { soundCredits = d.recordings; fill(soundCredits); })
    .catch(() => { list.textContent = 'assets/audio/cries/CREDITS.md'; });
  dlg.replaceChildren(
    el('h2', {}, t().credits), el('p', { class: 'stats' }, t().creditsIntro), list,
    el('button', { type: 'button', class: 'chip close', onclick: back }, t().back));
}

function openSettings() {
  const dlg = el('dialog', { class: 'settings' });
  let view = 'main';
  const render = () => {
    if (view === 'credits') return creditsView(dlg, () => { view = 'main'; render(); });
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
      el('h3', {}, t().drawSound),
      el('div', { class: 'row' },
        el('button', {
          type: 'button', class: `chip${settings.drawSound ? ' on' : ''}`,
          onclick: () => { settings.drawSound = !settings.drawSound; saveSettings(); render(); },
        }, settings.drawSound ? '🔊 ON' : '🔇 OFF')),
      el('h3', {}, t().playTime),
      el('div', { class: 'row' }, ...[0, 5, 10, 15, 20, 30].map((n) =>
        el('button', {
          type: 'button', class: `chip${settings.limitMin === n ? ' on' : ''}`,
          onclick: () => { settings.limitMin = n; saveSettings(); render(); },
        }, n ? `${n} ${t().minutes}` : t().off))),
      el('p', { class: 'stats' }, `${t().today}: ${fmt(playtime.today())} · ${t().session}: ${fmt(playtime.session())}`),
      el('div', { class: 'row' },
        el('button', {
          type: 'button', class: `chip${settings.showTimer ? ' on' : ''}`,
          onclick: () => { settings.showTimer = !settings.showTimer; saveSettings(); render(); updateTimer(); },
        }, `⏱ ${t().showTimer}`),
        el('button', { type: 'button', class: 'chip', onclick: () => { playtime.reset(); render(); updateTimer(); } }, `↺ ${t().resetToday}`)),
      el('h3', {}, t().choices),
      el('div', { class: 'row' }, ...[2, 3, 4].map((n) =>
        el('button', {
          type: 'button', class: `chip${settings.choices === n ? ' on' : ''}`,
          onclick: () => { settings.choices = n; saveSettings(); render(); },
        }, String(n)))),
      // Tip for parents when the game runs inside the normal browser (with address bar, tabs...)
      ...(navigator.standalone || matchMedia('(display-mode: standalone)').matches ? [] : [el('p', { class: 'stats' }, t().kidLockTip)]),
      el('button', { type: 'button', class: 'chip', style: { marginTop: '16px' }, onclick: () => { view = 'credits'; render(); } }, `ℹ️ ${t().credits}`),
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

// --- play time: a faint counter on every screen and an optional daily limit
const timerEl = el('div', { class: 'timer' });
document.body.append(timerEl);

function updateTimer() {
  const limit = playtime.limit();
  timerEl.hidden = !settings.showTimer;
  timerEl.textContent = `⏱ ${fmt(playtime.today())}${limit ? ` / ${fmt(limit)}` : ''}`;
  timerEl.classList.toggle('warn', limit > 0 && limit - playtime.today() <= 120);
}

function timesUp() {
  if (document.querySelector('.timesup')) return;
  playtime.setBlocked(true);
  window.speechSynthesis?.cancel();
  const overlay = el('div', { class: 'timesup' },
    el('div', { class: 'moon' }, '🌙'),
    el('div', { class: 'msg' }, t().timesUp),
    holdButton('🔓', 2000, () => { overlay.remove(); playtime.snooze(); playtime.setBlocked(false); updateTimer(); }, t().unlockHint));
  document.body.append(overlay);
  speak(t().timesUp);
}

// Edge-swipe "back" must not leave the game: keep one extra history entry and re-add it.
history.pushState({ kidlearning: true }, '', location.href);
window.addEventListener('popstate', () => history.pushState({ kidlearning: true }, '', location.href));

loadSettings();
startPlaytime(() => {
  updateTimer();
  const limit = playtime.limit();
  if (limit && playtime.today() >= limit) timesUp();
});
updateTimer();
home();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
