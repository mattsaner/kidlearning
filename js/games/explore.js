import { el, card, replayAnimation } from '../ui.js';
import { speak } from '../speech.js';
import { settings } from '../i18n.js';

export function startExplore(root, category) {
  const word = el('div', { class: 'word' }, ' ');
  const grid = el('div', { class: 'grid' });

  for (const item of category.items) {
    const c = card(item, () => {
      const name = item.names[settings.lang];
      word.textContent = name;
      replayAnimation(c, 'bounce');
      replayAnimation(word, 'pop');
      speak(name, item.id);
    });
    grid.append(c);
  }
  root.append(word, grid);
}
