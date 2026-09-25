import { el, card, replayAnimation, confetti, onPress } from '../ui.js';
import { speak } from '../speech.js';
import { settings, t, pick } from '../i18n.js';
import { stats } from '../stats.js';

const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((p) => p[1]);

export function startFindIt(root, category) {
  let last = null;
  let timer;
  let currentPrompt = () => {};
  const promptText = el('div', { class: 'word' }, '\u00a0');
  const board = el('div', { class: 'board' });
  const replay = el('button', { class: 'replay', type: 'button', 'aria-label': 'Replay' }, '🔊');
  onPress(replay, () => currentPrompt());
  root.append(replay, promptText, board);

  function round() {
    const pool = category.items.filter((i) => i.id !== last);
    const target = pick(pool);
    last = target.id;
    const n = Math.min(settings.choices, category.items.length);
    const others = shuffle(category.items.filter((i) => i.id !== target.id)).slice(0, n - 1);
    const prompt = () => speak(t().find(target.names[settings.lang]));
    currentPrompt = prompt;
    // Sound off: show the prompt as text so the game can still be played
    promptText.textContent = settings.sound ? '\u00a0' : t().find(target.names[settings.lang]);

    let locked = false;
    let firstTry = true;
    board.replaceChildren(
      ...shuffle([target, ...others]).map((item) => {
        const c = card(item, () => {
          if (locked) return;
          if (item.id === target.id) {
            locked = true;
            replayAnimation(c, 'bounce');
            confetti(c);
            speak(`${pick(t().yes)} ${target.names[settings.lang]}`);
            stats.recordQuiz('findit', firstTry);
            timer = setTimeout(round, 2200);
          } else {
            firstTry = false;
            replayAnimation(c, 'wobble');
            timer = setTimeout(prompt, 600);
          }
        });
        return c;
      })
    );
    timer = setTimeout(prompt, 400);
  }

  round();
  return () => { clearTimeout(timer); };
}
