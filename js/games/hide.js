import { el, onPress, replayAnimation, confetti } from '../ui.js';
import { speak } from '../speech.js';
import { settings, t, pick } from '../i18n.js';
import { CATEGORIES } from '../data.js';

// Hide and find (peekaboo / shell game, no shuffling). An animal peeks out from under
// a cup, the cup drops back over it, and the child lifts cups to find it. A wrong cup
// lifts to show nothing and stays open, so there is always a next try: nothing is ever
// a failure. Object permanence: things still exist when hidden.

const ANIMALS = CATEGORIES.find((c) => c.id === 'animals').items;
const COLORS = Object.fromEntries(CATEGORIES.find((c) => c.id === 'colors').items.map((i) => [i.id, i.color]));
const COVER_COLORS = ['red', 'blue', 'green', 'orange'].map((id) => COLORS[id]);
const NBSP = ' ';

export function startHide(root) {
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const replay = el('button', { class: 'replay', type: 'button', 'aria-label': 'Replay' }, '🔊');
  const word = el('div', { class: 'word' }, NBSP);
  const row = el('div', { class: 'hide-row' });
  root.append(row, word, replay); // name and replay button below the cups: lifted cups must not cover them

  let slots = [];
  let target = 0;
  let animal = null;
  let last = null;
  let locked = true;

  const name = () => animal.names[settings.lang];
  const ask = () => {
    // sound off: show the question as text so the game stays playable
    word.textContent = settings.sound ? name() : t().whereIs(name());
    speak(t().whereIs(name()));
  };
  onPress(replay, () => animal && !locked && ask());

  const lift = (i) => slots[i].cover.classList.add('open');
  const lower = (i) => slots[i].cover.classList.remove('open');

  function build() {
    const n = Math.min(Math.max(settings.choices, 2), 4);
    slots = Array.from({ length: n }, (_, i) => {
      const critter = el('div', { class: 'critter' });
      const cover = el('button', { class: 'cover', type: 'button', 'aria-label': '?', style: { background: COVER_COLORS[i] } }, '?');
      onPress(cover, () => choose(i));
      return { critter, cover, slot: el('div', { class: 'slot' }, critter, cover) };
    });
    row.replaceChildren(...slots.map((s) => s.slot));
  }

  function start() {
    build();
    animal = pick(ANIMALS.filter((a) => a.id !== last));
    last = animal.id;
    target = Math.floor(Math.random() * slots.length);
    slots[target].critter.textContent = animal.emoji;
    locked = true;
    word.textContent = NBSP;

    later(() => { // 1. the animal peeks out and is named
      lift(target);
      replayAnimation(slots[target].critter, 'bounce');
      word.textContent = name();
      replayAnimation(word, 'pop');
      speak(t().look(name()));
    }, 500);
    later(() => lower(target), 2600); // 2. it hides again
    later(() => { locked = false; ask(); }, 3300); // 3. "Where is the dog?"
  }

  function round() {
    if (slots.length) { slots.forEach((_, i) => lower(i)); later(start, 600); } else start();
  }

  function choose(i) {
    if (locked || slots[i].cover.classList.contains('open')) return;
    lift(i);
    if (i === target) {
      locked = true;
      replayAnimation(slots[i].critter, 'bounce');
      word.textContent = name();
      confetti(slots[i].critter, 16);
      speak(`${pick(t().yes)} ${name()}`);
      later(round, 3000);
    } else {
      replayAnimation(slots[i].cover, 'wobble');
      word.textContent = t().notHere;
      speak(t().notHere);
      later(ask, 1500);
    }
  }

  round();
  return () => timers.forEach(clearTimeout);
}
