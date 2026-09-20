# Contributing

## Add a word
In `js/data.js`, add a line to a category's `items`:

```js
item('rabbit', { emoji: '🐰' }, 'rabbit', 'le lapin', 'das Kaninchen'),
```

Arguments: `id`, visual (`{ emoji }`, `{ color }` or `{ dots }`), then the English, French and German names, and optionally `['en cry', 'fr cry', 'de cry']` for animals (spoken on a second tap in Explore, shown in Sounds; write it so a voice pronounces it as a word) plus a recording in `assets/audio/cries/<id>.mp3` (mind its license, and add it to `assets/audio/cries/CREDITS.md`).
Use the article in French/German for nouns ("le chien", "der Hund"); colors and numbers have none.

## Add a category
Add an object to `CATEGORIES` with `id`, `icon`, `names` (en/fr/de) and `items`.

## Add a language
1. Add an entry to `LANGUAGES` in `js/data.js` (`id`, `flag`, `label`, BCP‑47 `speech` code).
2. Add the UI strings in `js/i18n.js` (`STRINGS`).
3. Add a name for every category and item.

## Guidelines
- Keep it dependency-free (vanilla JS, no build step).
- Keep touch targets big and never add failure states, timers or ads: the audience is toddlers.
