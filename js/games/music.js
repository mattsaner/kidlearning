import { el, card, onPress, replayAnimation } from '../ui.js';
import { speak, whenAudioReady } from '../speech.js';
import { settings, t } from '../i18n.js';
import { INSTRUMENTS, DANCE_NOTES } from '../instruments.js';

// Music mode: two small games built on synthesized tones (Web Audio oscillators,
// nothing to download or license). "Instruments" is cause-and-effect: tap, hear,
// learn the name. "Freeze Dance" is the classic toddler activity — dance while the
// music plays, freeze when it stops — for movement and self-regulation practice.

/** A short synthesized note. `harmonic` (optional) layers a quieter overtone on top. */
function playTone(ctx, { wave = 'sine', freq = 440, duration = 0.3, attack = 0.005, gain = 0.6, harmonic }) {
  const t0 = ctx.currentTime;
  const ring = (f, g, dur) => {
    const osc = ctx.createOscillator();
    osc.type = wave;
    osc.frequency.value = f;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(g, t0 + attack);
    env.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(env).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  };
  ring(freq, gain, duration);
  if (harmonic) ring(freq * harmonic, gain * 0.4, duration * 0.8);
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
