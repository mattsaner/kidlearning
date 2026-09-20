import { el, card, replayAnimation } from '../ui.js';
import { speak } from '../speech.js';
import { settings } from '../i18n.js';

/**
 * Tap a picture to hear its name. For items with a `cry` (animals) the first
 * tap "arms" the card (a pulsing 🔊 badge shows that the next tap plays the
 * animal's cry); tapping it again plays the cry and resets. Tapping another
 * card also resets.
 */
export function startExplore(root, category) {
  const word = el('div', { class: 'word' }, ' ');
  const grid = el('div', { class: 'grid' });
  let armed = null;

  const disarm = () => {
    armed?.classList.remove('armed');
    armed?.querySelector('.cry-badge')?.remove();
    armed = null;
  };

  for (const item of category.items) {
    const c = card(item, () => {
      replayAnimation(c, 'bounce');
      replayAnimation(word, 'pop');

      if (item.cry && armed === c) {
        const cry = item.cry[settings.lang];
        disarm();
        word.textContent = cry;
        speak(cry, `${item.id}-cry`, { rate: 0.95, pitch: 1.4 });
        return;
      }

      disarm();
      const name = item.names[settings.lang];
      word.textContent = name;
      speak(name, item.id);
      if (item.cry) {
        armed = c;
        c.classList.add('armed');
        c.append(el('span', { class: 'cry-badge', 'aria-hidden': 'true' }, '🔊'));
      }
    });
    grid.append(c);
  }
  root.append(word, grid);
}
