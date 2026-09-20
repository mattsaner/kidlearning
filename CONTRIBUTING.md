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

## Add a drawing to colour
Drawings live in `js/drawings.js` as a list of regions in a 100 x 100 box. Each region is `{ c: '<color id>', d: '<SVG path>' }`, where `c` is a color id from `js/data.js` (the brush color and the spoken name come from it). Start each drawing with a full-canvas background region (`bg('blue')`) so the background can be colored too. Regions are in painter's order: later regions are drawn on top of earlier ones and may overlap them. Use the helpers (`rect`, `circle`, `ellipse`, `poly`) and keep regions large (toddler hands!). Then add the drawing to `DRAWINGS` with names in en/fr/de.

## Adding third-party media (sounds, images, fonts)
Only use files you may legally redistribute: CC0, public domain, CC BY or CC BY-SA, with a clear origin. Never use NonCommercial ("NC") or "NoDerivatives" files, files whose origin is unclear, or files copied from commercial libraries. Check the license on the source page (not only the uploader's claim). Then add the file to `assets/audio/cries/sources.json` (author, license, changes, SHA-256), and update `assets/audio/cries/CREDITS.md`, `SBOM.md` and `sbom.cdx.json`. The in-app credits screen reads `sources.json`.

## Releasing
Bump `VERSION` in `js/version.js` (and `Version` in `SBOM.md`, `version` in `sbom.cdx.json`), commit and push to `main`. The *Release* workflow then creates the GitHub release `vX.Y.Z` with generated notes, a zip of the game and the SBOM. The *Deploy to GitHub Pages* workflow publishes the site.
