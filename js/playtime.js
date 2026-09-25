import { settings } from './i18n.js';

// Play-time tracking. Counts only *active* play: the page must be visible and
// the child must have touched the screen in the last minute. The daily total is
// kept in localStorage (per device), so a reload does not reset it.

const KEY = 'kidlearning.playtime';
const IDLE_MS = 60_000;
const SNOOZE_SECONDS = 5 * 60; // what a parent gets by unlocking the "time's up" screen

const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

let state = { day: dayKey(), seconds: 0, extra: 0 }; // extra: bonus seconds granted today
let session = 0;
let lastActivity = 0; // nothing counts until the first touch
let blocked = false; // true while the "time's up" screen is shown

try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved?.day === state.day) state = { ...state, ...saved };
} catch { /* storage unavailable */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const fmt = (sec) => {
  const h = Math.floor(sec / 3600);
  const m = String(Math.floor((sec % 3600) / 60)).padStart(h ? 2 : 1, '0');
  const s = String(sec % 60).padStart(2, '0');
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
};

export const playtime = {
  today: () => state.seconds,
  session: () => session,
  /** Daily limit in seconds including bonus time, 0 when there is no limit. */
  limit: () => (settings.limitMin > 0 ? settings.limitMin * 60 + state.extra : 0),
  setBlocked(b) { blocked = b; },
  snooze() { state.extra += SNOOZE_SECONDS; save(); },
  reset() { state = { day: dayKey(), seconds: 0, extra: 0 }; session = 0; save(); },
};

/** Start counting. `onTick(active)` runs every second (update the display, check the limit). */
export function startPlaytime(onTick) {
  const touch = () => { lastActivity = Date.now(); };
  for (const ev of ['pointerdown', 'pointermove', 'keydown', 'touchstart']) {
    document.addEventListener(ev, touch, { capture: true, passive: true });
  }
  setInterval(() => {
    if (state.day !== dayKey()) state = { day: dayKey(), seconds: 0, extra: 0 }; // new day
    const active = !blocked && document.visibilityState === 'visible' && Date.now() - lastActivity < IDLE_MS;
    if (active) {
      state.seconds++;
      session++;
      if (state.seconds % 5 === 0) save();
    }
    onTick(active);
  }, 1000);
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
}
