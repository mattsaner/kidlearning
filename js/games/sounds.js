import { el, card, replayAnimation } from '../ui.js';
import { playCry, preloadCries } from '../speech.js';
import { settings } from '../i18n.js';
import { stats } from '../stats.js';

/** Third mode: tap an animal to hear a real recording of its sound. */
export function startSounds(root, category) {
  const word = el('div', { class: 'word' }, '\u00a0');
  const grid = el('div', { class: 'grid' });
  const animals = category.items.filter((i) => i.cry);
  preloadCries(animals.map((i) => i.id)); // decode now so the first tap plays instantly

  for (const item of animals) {
    const c = card(item, () => {
      word.textContent = item.cry[settings.lang];
      replayAnimation(c, 'bounce');
      replayAnimation(word, 'pop');
      playCry(item.id);
      stats.seeSound(item.id);
    });
    grid.append(c);
  }
  root.append(word, grid);
}
