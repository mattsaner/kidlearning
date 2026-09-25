import { el, onPress, replayAnimation, confetti } from '../ui.js';
import { speak } from '../speech.js';
import { settings, t, pick } from '../i18n.js';
import { BODY_REGIONS, BODY_DECOR, BODY_PARTS, FIND_POOL } from '../bodyparts.js';
import { stats } from '../stats.js';

// Body mode: a big bear whose parts can be touched.
//  - "explore": touch a part, hear and read its name.
//  - "find": "Where is the nose?" Touch it. Wrong touches never count against him:
//    the bear says what was touched, and after two misses the right part pulses.

const NS = 'http://www.w3.org/2000/svg';
const INK = '#3d2c1e';

const svgEl = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};

const name = (part) => BODY_PARTS[part][settings.lang];

export function startBody(root, mode) {
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const word = el('div', { class: 'word' }, ' ');
  const figure = svgEl('svg', { class: 'body-fig', viewBox: '0 0 100 100', role: 'img', 'aria-label': 'bear' });
  const nodes = new Map(); // part -> its SVG paths

  const parts = [];
  for (const r of BODY_REGIONS) {
    const path = svgEl('path', { class: 'part', d: r.d, fill: r.fill, stroke: INK, 'stroke-width': '1.2', 'stroke-linejoin': 'round', 'aria-label': name(r.part) });
    path.dataset.part = r.part;
    figure.append(path);
    parts.push(path);
    nodes.set(r.part, [...(nodes.get(r.part) || []), path]);
  }
  for (const d of BODY_DECOR) {
    figure.append(svgEl('path', { d: d.d, fill: d.fill, stroke: d.stroke || 'none', 'stroke-width': '1.4', 'stroke-linecap': 'round', 'pointer-events': 'none' }));
  }

  const pop = (node, cls = 'pop') => {
    node.classList.remove(cls);
    void node.getBoundingClientRect();
    node.classList.add(cls);
  };

  if (mode === 'explore') {
    for (const path of parts) {
      onPress(path, () => {
        const part = path.dataset.part;
        word.textContent = name(part);
        pop(path);
        replayAnimation(word, 'pop');
        speak(name(part), `body-${part}`);
        stats.seeBodyPart(part);
      });
    }
    root.append(word, figure);
    return () => timers.forEach(clearTimeout);
  }

  // --- "find" mode
  let last = null;
  let target = null;
  let misses = 0;
  let locked = false;
  let firstTry = true;
  const replay = el('button', { class: 'replay', type: 'button', 'aria-label': 'Replay' }, '🔊');
  const promptSpeech = () => speak(t().whereIs(name(target)));
  onPress(replay, () => target && promptSpeech());

  function round() {
    for (const p of parts) p.classList.remove('hint');
    locked = false;
    misses = 0;
    firstTry = true;
    target = pick(FIND_POOL.filter((p) => p !== last));
    last = target;
    // sound off: show the question as text so the game stays playable
    word.textContent = settings.sound ? ' ' : t().whereIs(name(target));
    later(promptSpeech, 400);
  }

  for (const path of parts) {
    onPress(path, () => {
      if (locked) return;
      const part = path.dataset.part;
      if (part === target) {
        locked = true;
        for (const p of nodes.get(part)) { p.classList.remove('hint'); pop(p); }
        confetti(path, 14);
        speak(`${pick(t().yes)} ${name(part)}`);
        stats.recordQuiz('bodyFind', firstTry);
        later(round, 2400);
      } else {
        pop(path, 'wobble');
        firstTry = false;
        misses++;
        speak(name(part)); // "that's the hand": a free lesson, then the question again
        if (misses >= 2) for (const p of nodes.get(target)) p.classList.add('hint');
        later(promptSpeech, 1400);
      }
    });
  }

  figure.classList.add('compact'); // leave room for the replay button and the question
  root.append(replay, word, figure);
  round();
  return () => timers.forEach(clearTimeout);
}
