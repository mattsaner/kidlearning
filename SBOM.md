# Software Bill of Materials (SBOM)

Kid Learning is intentionally **dependency-free**: no npm packages, no CDN scripts, no web fonts, no analytics, no ads, no network calls at runtime. This document lists everything the project is built from or relies on.

A machine-readable [CycloneDX 1.5](https://cyclonedx.org/) version is in [`sbom.cdx.json`](sbom.cdx.json).

_Last reviewed: 2026-09-20 · Version: 1.1.0_

## 1. Application

| Component | Type | License | Notes |
| --- | --- | --- | --- |
| kidlearning (this repo) | application | [MIT](LICENSE) | Vanilla HTML / CSS / JavaScript (ES modules), no build step |

## 2. Runtime dependencies (shipped to the browser)

**None.** No third-party code is bundled or loaded.

Content that is not code:

| Item | Source | License / terms |
| --- | --- | --- |
| Emoji pictures (animals, fruit, shapes) | Rendered by the user's operating system / browser emoji font | Governed by the OS font vendor; not redistributed by this repo |
| Word lists and translations (EN / FR / DE) | Written for this project (`js/data.js`) | MIT |
| App icon (`assets/icons/icon.svg`) | Written for this project; uses a 🐻 emoji glyph rendered by the OS | MIT |
| Animal cries (`assets/audio/cries/*.mp3`) | Recordings from Wikimedia Commons, adapted (trimmed, converted); see [credits](assets/audio/cries/CREDITS.md) | CC0, public domain, CC BY 3.0, CC BY-SA 3.0 / 4.0 (per file). BY / BY-SA files require the attribution in the credits file |
| Fonts | System fonts only (`Trebuchet MS`, `Comic Sans MS`, `system-ui`) | Nothing is downloaded |

## 3. Browser platform APIs used

These are built into the browser, not dependencies, but the app needs them:

- Web Speech API (`speechSynthesis`), for spoken words. Voices are supplied by the OS or browser.
- `localStorage`, to save settings on the device.
- Service Worker + Web App Manifest, for offline use and "Add to Home Screen".
- `<dialog>`, CSS Grid and ES modules.

## 4. Build and deploy tooling (CI only, not shipped)

Used by `.github/workflows/pages.yml` to publish to GitHub Pages:

| Component | Version | License | Purpose |
| --- | --- | --- | --- |
| [actions/checkout](https://github.com/actions/checkout) | v4 | MIT | Fetch the repository |
| [actions/configure-pages](https://github.com/actions/configure-pages) | v5 | MIT | Configure Pages |
| [actions/upload-pages-artifact](https://github.com/actions/upload-pages-artifact) | v3 | MIT | Package the static site |
| [actions/deploy-pages](https://github.com/actions/deploy-pages) | v4 | MIT | Deploy to GitHub Pages |
| ubuntu-latest runner | GitHub-hosted | n/a | Runs the workflow |

Actions are pinned to major-version tags. For stricter supply-chain hygiene, pin them to full commit SHAs.

## 5. Development tooling

None required. To run locally you only need a static file server (for example `python3 -m http.server`) and a modern browser.

## 6. Keeping this file current

Update `SBOM.md` and `sbom.cdx.json` whenever you:
- add a library, font, image, or audio file from a third party,
- add or change a GitHub Action in the workflow, or
- introduce a build step or package manager (then also generate the SBOM from the lockfile, for example with `npx @cyclonedx/cyclonedx-npm`).

GitHub also tracks Actions versions automatically under **Insights → Dependency graph**, where an SBOM can be exported.

## 7. Vulnerability reporting

Open a GitHub issue or contact the maintainer. Because there are no runtime dependencies, the attack surface is limited to this repository's own code.
