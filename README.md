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

### For parents
Press and hold the ⚙️ button (bottom right of the home screen) for 1.5 s to open settings: language (🇬🇧 🇫🇷 🇩🇪), sound on/off, and how many pictures appear in *Find it!*. Settings are saved in the browser.

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

## License

[MIT](LICENSE) © 2026 Matthieu Saner
