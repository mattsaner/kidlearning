// Parent-only statistics: play time, which games get played, and progression
// (discovery — what has been explored at least once — and accuracy on the
// "find it" style games). Never shown to the child; nothing here changes how
// the game plays. Kept in localStorage on the device, like playtime.js.

const KEY = 'kidlearning.stats';
const HISTORY_DAYS = 30; // how many days of daily totals to keep, for "this week"
const RECENT_ROUNDS = 20; // rounds kept for a "recent" accuracy trend

const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const emptyQuiz = () => ({ total: 0, firstTry: 0, recent: [] });
const defaults = () => ({
  totalSeconds: 0,
  days: {}, // { '2026-09-25': seconds, ... }
  modeCounts: {}, // { explore: n, findit: n, sounds: n, bodyExplore: n, bodyFind: n, hide: n, instruments: n, freezeDance: n, drawing: n }
  seenWords: {}, // { colors: [id, ...], animals: [...], food: [...], numbers: [...] }
  seenSounds: [],
  seenInstruments: [],
  seenBodyParts: [],
  drawingsDone: [],
  quiz: { findit: emptyQuiz(), bodyFind: emptyQuiz(), hide: emptyQuiz() },
});

let state = defaults();
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved) state = { ...defaults(), ...saved, quiz: { ...defaults().quiz, ...saved.quiz } };
} catch { /* storage unavailable */ }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

function trimDays() {
  const keys = Object.keys(state.days).sort();
  for (const k of keys.slice(0, Math.max(0, keys.length - HISTORY_DAYS))) delete state.days[k];
}

function addUnique(arr, id) {
  if (arr.includes(id)) return;
  arr.push(id);
  save();
}

export const stats = {
  /** Called once per second of *active* play (see playtime.js's `active` flag). */
  tickSecond() {
    state.totalSeconds++;
    const k = dayKey();
    state.days[k] = (state.days[k] || 0) + 1;
    trimDays();
    if (state.totalSeconds % 5 === 0) save();
  },

  /** A screen was opened from a menu (not counted on auto-advance, e.g. between drawings). */
  playMode(key) {
    state.modeCounts[key] = (state.modeCounts[key] || 0) + 1;
    save();
  },

  seeWord(categoryId, itemId) {
    const arr = (state.seenWords[categoryId] ||= []);
    addUnique(arr, itemId);
  },
  seeSound: (id) => addUnique(state.seenSounds, id),
  seeInstrument: (id) => addUnique(state.seenInstruments, id),
  seeBodyPart: (id) => addUnique(state.seenBodyParts, id),
  finishDrawing: (id) => addUnique(state.drawingsDone, id),

  /** `kind`: 'findit' | 'bodyFind' | 'hide'. `firstTryCorrect`: no wrong tap before the right one. */
  recordQuiz(kind, firstTryCorrect) {
    const q = state.quiz[kind];
    if (!q) return;
    q.total++;
    if (firstTryCorrect) q.firstTry++;
    q.recent.push(firstTryCorrect);
    if (q.recent.length > RECENT_ROUNDS) q.recent.shift();
    save();
  },

  today: () => state.days[dayKey()] || 0,
  /** Today plus the 6 days before it. */
  thisWeek: () => {
    let sum = 0;
    const d = new Date();
    for (let i = 0; i < 7; i++) {
      sum += state.days[dayKey(d)] || 0;
      d.setDate(d.getDate() - 1);
    }
    return sum;
  },
  allTime: () => state.totalSeconds,

  data: () => state,
  reset() { state = defaults(); save(); },
};
