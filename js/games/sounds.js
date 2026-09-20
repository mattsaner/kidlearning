import { el, card, replayAnimation } from '../ui.js';
import { playCry } from '../speech.js';
import { settings } from '../i18n.js';

/** Third mode: tap an animal to hear a real recording of its sound. */
export function startSounds(root, category) {
  const word = el('div', { class: 'word' }, '\u00a0');
  const grid = el('div', { class: 'grid' });

  for (const item of category.items.filter((i) => i.cry)) {
    const c = card(item, () => {
      word.textContent = item.cry[settings.lang];
      replayAnimation(c, 'bounce');
      replayAnimation(word, 'pop');
      playCry(item.id);
    });
    grid.append(c);
  }
  root.append(word, grid);
}
