# 🐻 Kid Learning

A tiny, ad-free browser game that helps toddlers learn **colors, animals, fruits & vegetables, numbers and shapes** in **English, French and German**.

Built for a 20‑month‑old: giant tap targets, spoken words, cheerful animations, and no way to "lose".

**Play it:** `https://<your-github-username>.github.io/kidlearning/`

## How it works

| Mode | What happens |
| --- | --- |
| 👆 **Explore** | Tap a picture: it bounces, and the word is spoken and shown in large letters. For **animals**, the first tap shows a pulsing 🔊 badge meaning "tap again to hear the cry"; the second tap has the voice say the animal's cry ("Ouaf ouaf !", "Meuh !") and resets. |
| 🔊 **Sounds** (animals only) | Tap an animal to hear a **real recording** of its sound, with the written cry as caption. The fish makes a bubbly "blub blub" (fish are silent). |
| 🖍️ **Drawing** | Pick a line drawing (sun, house, flower, fish, apple, rainbow, tree, cat, duck, car, butterfly, balloons) and scribble with a finger or Apple Pencil. The **color is automatic**: it depends on the region under the pen and changes by itself when crossing into another region, and the color's name is spoken. Paint stays inside the lines, and a region that is about half scribbled fills in completely. Colour everything for a celebration. Backgrounds can be colored too. Hold the 🗑️ button (bottom right) for a moment to start over (the hold avoids accidents). **Silent mode:** tap the 🔊 button (top right) to mute the drawing mode only: the color name then appears as a colored label on the canvas instead of being spoken. |
| 🔍 **Find it!** | The game says "Find the dog!" and shows 2–4 pictures. Right answer → confetti. Wrong answer → a gentle wobble and the prompt repeats. |

Categories: 🖍️ Drawing (own tile on the home screen) · 🎨 Colors · 🐶 Animals · 🍎 Fruits & veggies · 🔢 Numbers & shapes

### Toddler-proof touch handling
Little hands press hard, hold, slide and rest a palm on the screen, so the game reacts the moment a finger **touches** a picture (no clean "tap" needed) and blocks pinch-zoom, double-tap zoom, text selection and long-press menus (also on iPad, where Safari ignores \`user-scalable=no\`). Scrolling with one finger still works.

### Play-time tracking
A faint counter (⏱ 12:30) at the bottom of every screen shows how long your child has played **today**. It only counts *active* play: it starts at the first touch, pauses when the app is in the background and stops after a minute without touches. The daily total is stored on the device and resets each day.

If you set a **daily limit** in the settings, the counter shows `12:30 / 20:00` and turns red for the last two minutes. When the time is up, a friendly "See you tomorrow 🌙" screen covers the game (and says it out loud). A parent can press and hold the 🔓 button for 2 seconds to grant 5 more minutes.

### For parents: the settings page

The settings are hidden behind a **press-and-hold** button so a toddler can't open them by accident.

**How to open them**
1. Go to the **home screen** (the one with the four big category tiles). Tap the ⬅️ button to get back there from a game.
2. Find the small, semi-transparent ⚙️ button in the **bottom-right corner**.
3. **Press and hold** it for about **1.5 seconds** (a quick tap does nothing). It grows and turns yellow while you hold; release early and nothing happens.
4. The settings window opens. On a keyboard, focus the button and press <kbd>Enter</kbd>.

**What you can change**

| Setting | Options |
| --- | --- |
| Language | 🇬🇧 English · 🇫🇷 Français · 🇩🇪 Deutsch (changes the spoken words and the on-screen text; default: Français) |
| Sound | 🔊 on / 🔇 off (everything; with sound off, *Find it!* shows its prompt as text) |
| Drawing sound | 🔊 on / 🔇 off (only the drawing mode, also togglable in-game) |
| Play time | Daily limit: off, 5, 10, 15, 20 or 30 minutes, plus today's / this session's time, a reset, and a show/hide switch for the timer |
| Choices per round | 2, 3 or 4 pictures in *Find it!* (start with 2 for young toddlers) |

Press **Close** (or <kbd>Esc</kbd>) to go back to the home screen. Settings are saved in the browser on that device, so they need to be set once per device. The default language is **French**.

The game can be added to a phone/tablet home screen (it's a PWA and works offline once loaded).

## Run locally

No build step, just static files:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The workflow in `.github/workflows/pages.yml` publishes the site on every push to `main`.

## Voices

Words are spoken with the browser's built-in text-to-speech (Web Speech API). Voice quality depends on your device; install a good French/German voice in your OS settings if the default sounds robotic.

To use **your own voice** (toddlers love that), record short clips and drop them in:

```
assets/audio/<lang>/<item-id>.mp3         e.g. assets/audio/fr/dog.mp3        (the word)
```

Item ids are listed in `js/data.js`. Then **list each id** in `assets/audio/manifest.json` (e.g. `{ "fr": ["dog", "cat"] }`) so the game knows the file exists; anything not listed uses text-to-speech.

Animal cries are real recordings in `assets/audio/cries/<item-id>.mp3` (same for every language). Replace a file to use your own recording. Credits and licenses for the bundled recordings are in [assets/audio/cries/CREDITS.md](assets/audio/cries/CREDITS.md).

## Adding words or languages

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Project layout

```
index.html          entry point
css/style.css       styles
js/data.js          all words (en / fr / de) and languages
js/i18n.js          UI strings + saved settings
js/speech.js        text-to-speech / custom audio
js/ui.js            DOM helpers, confetti, hold-to-open button
js/games/           Explore, Find-it, Sounds and Drawing (paint.js) modes
js/drawings.js      the line drawings to colour
sw.js, manifest…    offline / installable app
```

## Checking a deployment

The home screen shows a tiny, faint label at the bottom-left, like `v1.0.0 · 14eedf5 2026-09-20`: the version, the deployed commit and the build date. Compare it with `git log -1 --short` to confirm the latest push is live (locally it shows `dev`). Bump `VERSION` in `js/version.js` for releases; the commit and date are stamped automatically by the workflow.

## Software Bill of Materials

The project has no runtime dependencies. See [SBOM.md](SBOM.md) (human-readable) and [sbom.cdx.json](sbom.cdx.json) (CycloneDX).

## License

[MIT](LICENSE) © 2026 Matthieu Saner
