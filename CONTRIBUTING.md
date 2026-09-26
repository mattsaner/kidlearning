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

## Body parts
The bear is defined in `js/bodyparts.js`: `BODY_PARTS` holds the names (en/fr/de, with the article), `BODY_REGIONS` the tappable shapes in painter's order, and `FIND_POOL` the parts asked in *Find it*. Keep shapes large: small hands.

## Hide & seek
`js/games/hide.js` hides a random animal from the *Animals* category (`js/data.js`) under 2–4 cups; add animals there and they join the game. The number of cups comes from the "choices per round" setting.

## Music mode
`js/instruments.js` holds `INSTRUMENTS` (id, emoji, names in en/fr/de, and a `tone` describing the synthesized sound: waveform, base frequency, attack, gain, an optional `harmonic` overtone) and `DANCE_NOTES` (the Freeze Dance melody). All sounds are generated with Web Audio oscillators in `js/games/music.js` — there are no audio files to license here. Most instruments play a short `notes` riff (2-3 entries, each `{ at, ratio, duration, gain }`: a delay in seconds, a multiplier on the base frequency, and per-note overrides) instead of one beep, so a tap feels like a little musical phrase; omit `notes` for a single tone (used by Freeze Dance's beats). Add an instrument by adding an entry to `INSTRUMENTS`; it appears automatically in the Instruments screen.

## Statistics
`js/stats.js` is a parent-only, self-contained module (like `js/playtime.js`): `stats.playMode(key)` counts a navigation into a mode (called from `js/main.js`, at the menu tap, not on auto-advance), `stats.seeWord/seeSound/seeInstrument/seeBodyPart/finishDrawing(id)` record a discovery (deduplicated automatically), and `stats.recordQuiz(kind, firstTryCorrect)` records one round of a "find it" style game — call it once, when the round resolves correctly, with whether any wrong tap happened first. Add a new discovery/quiz hook the same way: call the relevant `stats.*` function at the point in the game module where the event actually happens, and add a matching row in `statsView()` in `js/main.js` (a `discoveryRow(...)` or `quizRow(...)` call) so it shows up in Settings → 📊 Statistics.
