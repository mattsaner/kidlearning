# 🐻 Kid Learning

A tiny, ad-free browser game that helps toddlers learn **colors, animals, fruits & vegetables, numbers and shapes** in **English, French and German**.

Built for a 20‑month‑old: giant tap targets, spoken words, cheerful animations, and no way to "lose".

**Play it:** `https://<your-github-username>.github.io/kidlearning/`

## How it works

| Mode | What happens |
| --- | --- |
| 👆 **Explore** | Tap a picture: it bounces, and the word is spoken and shown in large letters. |
| 🔍 **Find it!** | The game says "Find the dog!" and shows 2–4 pictures. Right answer → confetti. Wrong answer → a gentle wobble and the prompt repeats. |

Categories: 🎨 Colors · 🐶 Animals · 🍎 Fruits & veggies · 🔢 Numbers & shapes

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
| Sound | 🔊 on / 🔇 off |
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
assets/audio/<lang>/<item-id>.mp3     e.g. assets/audio/fr/dog.mp3
```

Item ids are listed in `js/data.js`. Missing files automatically fall back to text-to-speech.

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
js/games/           Explore and Find-it modes
sw.js, manifest…    offline / installable app
```

## Checking a deployment

The home screen shows a tiny, faint label at the bottom-left, like `v1.0.0 · 14eedf5 2026-09-20`: the version, the deployed commit and the build date. Compare it with `git log -1 --short` to confirm the latest push is live (locally it shows `dev`). Bump `VERSION` in `js/version.js` for releases; the commit and date are stamped automatically by the workflow.

## Software Bill of Materials

The project has no runtime dependencies. See [SBOM.md](SBOM.md) (human-readable) and [sbom.cdx.json](sbom.cdx.json) (CycloneDX).

## License

[MIT](LICENSE) © 2026 Matthieu Saner
