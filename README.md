# 🐻 Kid Learning

A tiny, ad-free browser game that helps toddlers learn **colors, animals, fruits & vegetables, numbers and shapes** in **English, French and German**.

Built for a 20‑month‑old: giant tap targets, spoken words, cheerful animations, and no way to "lose".

**Play it:** `https://<your-github-username>.github.io/kidlearning/`

## How it works

| Mode | What happens |
| --- | --- |
| 👆 **Explore** | Tap a picture: it bounces, and the word is spoken and shown in large letters. For **animals**, the first tap shows a pulsing 🔊 badge meaning "tap again to hear the cry"; the second tap has the voice say the animal's cry ("Ouaf ouaf !", "Meuh !") and resets. |
| 🔊 **Sounds** (animals only) | Tap an animal to hear a **real recording** of its sound, with the written cry as caption. The fish makes a bubbly "blub blub" (fish are silent). |
| 🧸 **Body** | A big bear whose parts (head, ear, eye, nose, mouth, tummy, arm, hand, foot) can be touched. *Explore*: touch a part to hear and read its name. *Find it*: "Where is the nose?" — a wrong touch says what was touched (never a failure), and after two misses the right part pulses to help. Based on the milestone "points to body parts when asked" (CDC, 24 months). |
| 🙈 **Hide & seek** | An animal peeks out from under a colored cup and is named; the cup drops back over it and the game asks "Where is the dog?". He lifts cups to find it. A wrong cup opens to show nothing and stays open, so there is always a next try. No shuffling (too hard at this age): it plays with *object permanence*, like peekaboo. Uses the "choices per round" setting for 2–4 cups. |
| 🖍️ **Drawing** | Pick a line drawing (18: sun, house, flower, fish, apple, rainbow, tree, cat, duck, car, butterfly, balloons, boat, ice cream, bird, snail, umbrella, turtle) and scribble with a finger or Apple Pencil. The **color is automatic**: it depends on the region under the pen and changes by itself when crossing into another region, and the color's name is spoken. Paint stays inside the lines, and a region that is about half scribbled fills in completely. Colour everything and the picture wiggles, cheers and flies away — the **next drawing arrives by itself** (its name is spoken), so he can keep going without help. Hold 🗑️ during the celebration to keep the picture instead. Backgrounds can be colored too. Hold the 🗑️ button (bottom right) for a moment to start over (the hold avoids accidents). **Silent mode:** tap the 🔊 button (top right) to mute the drawing mode only: the color name then appears as a colored label on the canvas instead of being spoken. |
| 🔍 **Find it!** | The game says "Find the dog!" and shows 2–4 pictures. Right answer → confetti. Wrong answer → a gentle wobble and the prompt repeats. |
| 🎵 **Music** | Two games. *Instruments*: tap a drum, bell, piano, trumpet or guitar to hear its name and a synthesized note — every sound is generated in the browser (no audio files, so nothing to license). *Freeze Dance*: a bear dances to a little tune; the music stops at random and it freezes with a "Freeze!" cue, then dances again — the classic toddler activity for movement and self-regulation. A ⏸️ button pauses it. |

Categories: 🙈 Hide & seek · 🧸 Body · 🎵 Music · 🖍️ Drawing (own tile on the home screen) · 🎨 Colors · 🐶 Animals · 🍎 Fruits & veggies · 🔢 Numbers & shapes

### Toddler-proof touch handling
Little hands press hard, hold, slide and rest a palm on the screen, so the game reacts the moment a finger **touches** a picture (no clean "tap" needed) and blocks pinch-zoom, double-tap zoom, text selection and long-press menus (also on iPad, where Safari ignores \`user-scalable=no\`). Scrolling with one finger still works.

### Keeping your child in the game (iPad / iPhone)
A web page cannot lock the device, so combine these:

1. **Install it as an app.** In Safari: Share → **Add to Home Screen**, then always open the game from that icon. It runs full screen, with no address bar, tabs or links to tap. (If you added it before, remove the old icon and add it again to get the new one.)
2. **Turn on Guided Access**, the iPad's built-in kiosk mode: *Settings → Accessibility → Guided Access* → on, set a passcode. Then open the game and **triple-click the top button** (or the Home button) → *Start*. Home, app switching and system swipes are disabled until you triple-click again and enter the passcode. In *Options* you can also set a time limit.
3. Full step-by-step guide (English, français, Deutsch): [docs/GUIDED-ACCESS.md](docs/GUIDED-ACCESS.md).
4. The game itself blocks the edge-swipe "back" gesture, pinch-zoom, text selection and long-press menus, and has no links except in the parent-only credits screen.

### Play-time tracking
A faint counter (⏱ 12:30) at the bottom of every screen shows how long your child has played **today**. It only counts *active* play: it starts at the first touch, pauses when the app is in the background and stops after a minute without touches. The daily total is stored on the device and resets each day.

If you set a **daily limit** in the settings, the counter shows `12:30 / 20:00` and turns red for the last two minutes. When the time is up, a friendly "See you tomorrow 🌙" screen covers the game (and says it out loud). A parent can press and hold the 🔓 button for 2 seconds to grant 5 more minutes.

### Statistics (parent-only)

Settings → **📊 Statistics** shows how the game is being used. Nothing here is ever shown to the child, and none of it changes how the game plays — it's purely informational for you.

- **Play time:** today, this week and all-time totals.
- **Games played:** how many times each mode was opened (Explore, Find it!, Sounds, Body, Hide & seek, Music, Drawing).
- **Discovery:** what's been explored at least once — words per category, drawings finished, animal sounds heard, instruments played, body parts touched — each shown as a `12/47`-style count with a bar. Nothing here is "right or wrong": tapping something once is enough.
- **Accuracy:** for *Find it!*, *Body → Find it* and *Hide & seek*, the share of rounds solved without a wrong tap first, plus a "last 20 rounds" rate once there's enough data to show a trend. A wrong tap during play never has a consequence for the child (see the modes above) — this is purely a private, parent-facing read of how it's going.

A **↺ Reset statistics** button clears all of this (separate from the play-time counter's own reset). Everything is stored only in the browser's local storage on that device.

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
js/speech.js        text-to-speech / recordings / synthesized tones (Web Audio)
js/ui.js            DOM helpers, confetti, hold-to-open button
js/playtime.js      play-time counter and daily limit
js/stats.js         parent-only stats: time, games played, discovery, accuracy
js/games/           Explore, Find-it, Sounds, Body, Hide & seek, Music, Drawing
js/drawings.js      the line drawings to colour
js/bodyparts.js     the bear and its body parts (names in en/fr/de)
js/instruments.js   instrument names + synthesized-tone settings
sw.js, manifest…    offline / installable app
```

## Releases

Each version is published in the repository's **Releases** section (tag `vX.Y.Z`) with generated notes, a zip of the game and the SBOM. See [CONTRIBUTING.md](CONTRIBUTING.md#releasing).

## Checking a deployment

The home screen shows a tiny, faint label at the bottom-left, like `v1.0.0 · 14eedf5 2026-09-20`: the version, the deployed commit and the build date. Compare it with `git log -1 --short` to confirm the latest push is live (locally it shows `dev`). Bump `VERSION` in `js/version.js` for releases; the commit and date are stamped automatically by the workflow.

## Software Bill of Materials

The project has no runtime dependencies. See [SBOM.md](SBOM.md) (human-readable) and [sbom.cdx.json](sbom.cdx.json) (CycloneDX).

## License

The **code and original content** are under the [MIT license](LICENSE) © 2026 Matthieu Saner.

The **animal sound recordings** (`assets/audio/cries/`) are third-party works from Wikimedia Commons under their own licenses (CC BY-SA 3.0, CC BY 3.0, CC0, public domain). Author, license and changes for each are in [assets/audio/cries/CREDITS.md](assets/audio/cries/CREDITS.md) and in the app (parent settings → Credits).

## Privacy

The game collects **no personal data**: no accounts, analytics, ads or third-party requests. Settings and play time stay in the browser's local storage on the device.
