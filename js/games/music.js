import { el, card, onPress, replayAnimation } from '../ui.js';
import { speak, whenAudioReady } from '../speech.js';
import { settings, t } from '../i18n.js';
import { INSTRUMENTS, DANCE_NOTES } from '../instruments.js';
import { stats } from '../stats.js';

// Music mode: two small games built on synthesized tones (Web Audio oscillators,
// nothing to download or license). "Instruments" is cause-and-effect: tap, hear,
// learn the name. "Freeze Dance" is the classic toddler activity — dance while the
// music plays, freeze when it stops — for movement and self-regulation practice.

/**
 * A synthesized sound: one note, or with `notes` a short riff (2-3 notes in a
 * row) — each entry is `{ at, ratio, duration, gain }`, `at` a delay in seconds
 * and `ratio` a multiplier on the base `freq`, both optional. `harmonic`
 * (optional) layers a quieter overtone on every note, for a fuller timbre.
 */
function playTone(ctx, { wave = 'sine', freq = 440, duration = 0.3, attack = 0.005, gain = 0.6, harmonic, notes }) {
  const t0 = ctx.currentTime;
  const ring = (start, f, g, dur) => {
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = f;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, start);
    env.gain.linearRampToValueAtTime(g, start + attack);
    env.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(env).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + dur + 0.02);
  };
  const play = (start, f, g, dur) => {
    ring(start, f, g, dur);
    if (harmonic) ring(start, f * harmonic, g * 0.4, dur * 0.8);
  };
  for (const n of notes?.length ? notes : [{}]) {
    play(t0 + (n.at ?? 0), freq * (n.ratio ?? 1), n.gain ?? gain, n.duration ?? duration);
  }
}

const playIfLoud = (opts) => settings.sound && whenAudioReady((ctx) => playTone(ctx, opts));

// --- Instruments: tap to play (like Explore, with a synthesized sound on top)

export function startInstruments(root) {
  const word = el('div', { class: 'word' }, ' ');
  const grid = el('div', { class: 'grid' });
  for (const inst of INSTRUMENTS) {
    const c = card(inst, () => {
      replayAnimation(c, 'bounce');
      word.textContent = inst.names[settings.lang];
      replayAnimation(word, 'pop');
      playIfLoud(inst.tone);
      speak(inst.names[settings.lang], `inst-${inst.id}`);
      stats.seeInstrument(inst.id);
    });
    grid.append(c);
  }
  root.append(word, grid);
}

// --- Freeze Dance: dance while the music plays, freeze when it stops

const BEAT_MS = 450;
const DANCE_MS = [4000, 9000];
const FREEZE_MS = 3000;

export function startFreezeDance(root) {
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let running = true;
  let frozen = false;
  let noteIndex = 0;

  const bear = el('div', { class: 'dance-fig' }, '🐻');
  const caption = el('div', { class: 'word dance-caption' }, ' ');
  const toggle = el('button', { class: 'hold-btn sound-toggle', type: 'button', 'aria-label': t().pause }, '⏸️');
  onPress(toggle, () => {
    running = !running;
    toggle.textContent = running ? '⏸️' : '▶️';
    if (running) resume();
    else { timers.splice(0).forEach(clearTimeout); bear.classList.remove('dancing'); }
  });
  root.append(bear, caption, toggle);

  function beat() {
    if (!running || frozen) return;
    playIfLoud({ wave: 'triangle', freq: DANCE_NOTES[noteIndex % DANCE_NOTES.length], duration: 0.28, attack: 0.004, gain: 0.55 });
    noteIndex++;
    later(beat, BEAT_MS);
  }

  function freeze() {
    frozen = true;
    bear.classList.remove('dancing');
    bear.classList.add('frozen');
    caption.textContent = `❄️ ${t().freeze}`;
    playIfLoud({ wave: 'square', freq: 220, duration: 0.3, attack: 0.005, gain: 0.4 });
    speak(t().freeze);
    later(resume, FREEZE_MS);
  }

  function resume() {
    if (!running) return;
    frozen = false;
    bear.classList.remove('frozen');
    bear.classList.add('dancing');
    caption.textContent = ' ';
    playIfLoud({ wave: 'triangle', freq: 523.25, duration: 0.2, attack: 0.004, gain: 0.5 });
    beat();
    later(freeze, DANCE_MS[0] + Math.random() * (DANCE_MS[1] - DANCE_MS[0]));
  }

  resume();
  return () => { running = false; timers.forEach(clearTimeout); };
}
