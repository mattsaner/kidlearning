# Software Bill of Materials (SBOM)

Kid Learning has **no third-party code**: no npm packages, no CDN scripts, no web fonts, no analytics, no ads and no network calls at runtime.
Its only third-party *content* is 12 animal sound recordings (below). This document lists everything the project is built from or relies on, and how each license is respected.

Machine-readable [CycloneDX 1.5](https://cyclonedx.org/) version: [`sbom.cdx.json`](sbom.cdx.json) (includes SHA-256 checksums and license links).
There is no video in the project.

_Last reviewed: 2026-09-20 · Version: 1.4.1_

## 1. Application and first-party content

| Component | License | Notes |
| --- | --- | --- |
| kidlearning code (HTML / CSS / JavaScript ES modules, no build step) | [MIT](LICENSE) | © 2026 Matthieu Saner |
| Word lists, translations (EN / FR / DE), the line drawings and the body-parts bear (`js/data.js`, `js/drawings.js`, `js/bodyparts.js`) | MIT | Written for this project |
| App icons (`assets/icons/icon.svg` and the PNGs rendered from it) | MIT | Own vector artwork (a bear drawn with shapes); no emoji glyphs or third-party images |

## 2. Third-party media: animal sounds (`assets/audio/cries/*.mp3`)

Twelve recordings from Wikimedia Commons, trimmed and converted for this game. Full details, changes made and checksums: [`assets/audio/cries/CREDITS.md`](assets/audio/cries/CREDITS.md) and [`sources.json`](assets/audio/cries/sources.json). The credits are also shown inside the app (parent settings → Credits).

| Animal | File | Author | License | Original | SHA-256 (start) |
| --- | --- | --- | --- | --- | --- |
| dog | `dog.mp3` | Amada44 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Barking of a dog.ogg](https://commons.wikimedia.org/wiki/File:Barking_of_a_dog.ogg) | `7fe904d171d7…` |
| cat | `cat.mp3` | freemaster2 | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Meow of a Siamese cat - freemaster2.wav](https://commons.wikimedia.org/wiki/File:Meow_of_a_Siamese_cat_-_freemaster2.wav) | `69dfdf122bc5…` |
| cow | `cow.mp3` | Secretlondon | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Mudchute cow 1.ogg](https://commons.wikimedia.org/wiki/File:Mudchute_cow_1.ogg) | `09c530052e7d…` |
| horse | `horse.mp3` | Hü. | Public domain | [Wiehern.ogg](https://commons.wikimedia.org/wiki/File:Wiehern.ogg) | `5a12a84d6155…` |
| pig | `pig.mp3` | erdie | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | [Pig grunt - Erdie.ogg](https://commons.wikimedia.org/wiki/File:Pig_grunt_-_Erdie.ogg) | `124b836c53dc…` |
| sheep | `sheep.mp3` | earthcalling | Public domain | [Sheep bleating.ogg](https://commons.wikimedia.org/wiki/File:Sheep_bleating.ogg) | `245e0d432cd5…` |
| duck | `duck.mp3` | Jonathon Jongsma | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Anas platyrhynchos - Mallard - XC62258.ogg](https://commons.wikimedia.org/wiki/File:Anas_platyrhynchos_-_Mallard_-_XC62258.ogg) | `e0215e523346…` |
| chicken | `chicken.mp3` | alys | Public domain | [Hen announcing shes lain an egg.ogg](https://commons.wikimedia.org/wiki/File:Hen_announcing_shes_lain_an_egg.ogg) | `b413c5f2bddb…` |
| frog | `frog.mp3` | WrS.tm.pl | Public domain | [Edible frogs, sounds. May. The Village of Krzemienica, Łódź Voivodeship, Poland.ogg](https://commons.wikimedia.org/wiki/File:Edible_frogs,_sounds._May._The_Village_of_Krzemienica,_%C5%81%C3%B3d%C5%BA_Voivodeship,_Poland.ogg) | `7ab083f91261…` |
| fish | `fish.mp3` | Nevit Dilmen | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Bubble 01 nevit.ogg](https://commons.wikimedia.org/wiki/File:Bubble_01_nevit.ogg) | `b4d596e209d4…` |
| elephant | `elephant.mp3` | தகவலுழவன் (Commons user) | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | [Elephant voice - trumpeting.ogg](https://commons.wikimedia.org/wiki/File:Elephant_voice_-_trumpeting.ogg) | `0369b93ad80c…` |
| lion | `lion.mp3` | த*உழவன் (Commons user) | Public domain | [Lion raring-sound1TamilNadu178.ogg](https://commons.wikimedia.org/wiki/File:Lion_raring-sound1TamilNadu178.ogg) | `c5f2be58a36e…` |

### How each license is respected

| License | Files | Obligations | Done |
| --- | --- | --- | --- |
| CC BY-SA 3.0 | dog, cow, duck, fish | Credit the author, link the license, say what changed, keep adaptations under the same license, add no technical restrictions | Credits in-app and in `CREDITS.md`; changes described; adapted files offered under CC BY-SA 3.0; files are served as plain, downloadable MP3s |
| CC BY 3.0 | pig | Credit the author, link the license, say what changed | Same credits |
| CC0 1.0 | cat, elephant | None | Credited as a courtesy |
| Public domain | horse, sheep, chicken, frog, lion | None | Credited as a courtesy |

The MIT license of the code does **not** cover these recordings; they keep the licenses above. The CC BY-SA "share alike" condition applies to the adapted audio files, not to the game's code.

### Legal review (2026-09-20)
- Every file was re-checked against its Wikimedia Commons page (license template, author, "own work" claim, source). The mallard's license was also confirmed on the original xeno-canto page.
- **Removed:** a cow recording that was cropped from a commercial "Sound Ideas" library track, and a frog recording labelled both "own work" and "recorded in 1934". Their provenance could not be trusted; they were replaced by self-recorded files with consistent licensing.
- This is a good-faith review, not legal advice.

## 3. Content rendered by the user's device (not bundled)

| Item | Notes |
| --- | --- |
| Emoji pictures (animals, fruit, shapes, category icons) | Emoji characters drawn by the visitor's operating system / browser. No emoji font or image is distributed. |
| Fonts | System fonts only (`Trebuchet MS`, `Comic Sans MS`, `system-ui`); nothing is downloaded. |
| Text-to-speech voices | Supplied by the operating system through the Web Speech API. |

## 4. Browser platform APIs used

Web Speech API (`speechSynthesis`), Web Audio API (animal recordings), `localStorage` (settings, play time), Service Worker + Web App Manifest (offline, "Add to Home Screen"), Pointer Events, Canvas 2D, `<dialog>`, CSS Grid, ES modules.

## 5. Build and deploy tooling (not shipped)

| Component | Version | License | Purpose |
| --- | --- | --- | --- |
| [actions/checkout](https://github.com/actions/checkout) | v4 | MIT | Fetch the repository |
| [actions/configure-pages](https://github.com/actions/configure-pages) | v5 | MIT | Configure Pages |
| [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) | v3 | MIT | Package the static site |
| [actions/deploy-pages](https://github.com/actions/deploy-pages) | v4 | MIT | Deploy to GitHub Pages |
| ffmpeg (via imageio-ffmpeg 7.1) | n/a | LGPL/GPL (build dependent) | Used offline, once, to convert the recordings; not shipped |

Actions are pinned to major-version tags; pin to commit SHAs for stricter supply-chain hygiene.

## 6. Privacy

The game collects **no personal data**, has no accounts, no analytics, no ads and makes no network requests to third parties. Settings and play time are stored only in the browser's `localStorage` on the device. Nothing leaves the device.

## 7. Keeping this file current

When you add a third-party file (sound, image, font), also: check its license on the source page, add it to `assets/audio/cries/sources.json` (or an equivalent file), and update `CREDITS.md`, this file and `sbom.cdx.json`. Never use files under NonCommercial licenses or whose origin is unclear. If you introduce a build step or package manager, generate the SBOM from the lockfile (for example `npx @cyclonedx/cyclonedx-npm`). GitHub also exports an SBOM under **Insights → Dependency graph**.

## 8. Vulnerability reporting

Open a GitHub issue or contact the maintainer. With no runtime dependencies, the attack surface is limited to this repository's own code.
