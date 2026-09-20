import { LANGUAGES } from './data.js';
import { settings } from './i18n.js';

// Sound on iOS/iPadOS is picky: speech and audio only start after a "real" user
// gesture (finger up / click). The game reacts on pointerdown (so hard presses
// work), which Safari does not count. So on the first finger-up we unlock both
// speech and audio, and replay the sound the child just asked for if it was blocked.

const synth = window.speechSynthesis;
const player = new Audio(); // one shared element: once unlocked it can play anything
player.preload = 'auto';
const SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';

let custom = {}; // { fr: ['dog', ...] }: recorded voice files, see assets/audio/manifest.json
fetch('assets/audio/manifest.json').then((r) => (r.ok ? r.json() : {})).then((m) => { custom = m; }).catch(() => {});

let current = null; // keep the utterance referenced (some browsers drop it otherwise)
let token = 0;
let lastCall = null; // { run, time } of the latest sound request
let ttsUnlocked = !synth;
let audioUnlocked = false;

const speechLang = () => LANGUAGES.find((l) => l.id === settings.lang).speech;

function pickVoice(lang) {
  const voices = synth?.getVoices?.() || [];
  const prefix = lang.slice(0, 2);
  return voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(prefix));
}

function speakTts(text, { rate = 0.8, pitch = 1.15 } = {}) {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang();
  u.rate = rate;
  u.pitch = pitch;
  const voice = pickVoice(u.lang);
  if (voice) u.voice = voice;
  current = u;
  const mine = ++token;
  if (synth.speaking || synth.pending) {
    synth.cancel();
    // some browsers swallow a speak() issued right after cancel()
    setTimeout(() => { if (mine === token) synth.speak(u); }, 60);
  } else {
    synth.resume?.();
    synth.speak(u);
  }
}

function playFile(url, onError) {
  player.onerror = onError || null;
  player.src = url;
  player.play().catch(() => {});
}

// Remember the latest request only until sound is unlocked (see unlock()).
function remember(run) {
  lastCall = ttsUnlocked && audioUnlocked ? null : { run, time: performance.now() };
}

function stopAll() {
  player.pause();
  player.onerror = null;
  if (synth && (synth.speaking || synth.pending)) { token++; synth.cancel(); }
}

/**
 * Speak a word. If assets/audio/<lang>/<id>.mp3 exists and is listed in
 * assets/audio/manifest.json it is used (parents can record their own voice);
 * otherwise the browser's text-to-speech is used.
 */
export function speak(text, id, opts) {
  if (!settings.sound) return;
  remember(() => speak(text, id, opts));
  stopAll();
  if (id && custom[settings.lang]?.includes(id)) {
    return playFile(`assets/audio/${settings.lang}/${id}.mp3`, () => speakTts(text, opts));
  }
  speakTts(text, opts);
}

/** Play the real recording of an animal's cry (assets/audio/cries/<id>.mp3). */
export function playCry(id) {
  if (!settings.sound) return;
  remember(() => playCry(id));
  stopAll();
  playFile(`assets/audio/cries/${id}.mp3`);
}

// --- unlock on the first real gesture
const GESTURES = ['pointerup', 'touchend', 'click', 'keydown'];

function unlock() {
  const replay = lastCall && performance.now() - lastCall.time < 2000 ? lastCall.run : null;
  lastCall = null;

  if (!audioUnlocked) {
    player.src = SILENT_WAV;
    player.play().then(() => { audioUnlocked = true; }).catch(() => {});
  }
  if (replay) {
    replay(); // the sound blocked a moment ago: it plays now, inside the gesture
    lastCall = null; // ...and must not be replayed again
  } else if (!ttsUnlocked) {
    const u = new SpeechSynthesisUtterance('.');
    u.volume = 0;
    u.onstart = () => { ttsUnlocked = true; };
    synth.speak(u);
  }
  if (replay && !ttsUnlocked) ttsUnlocked = true; // the replayed speech unlocks it too
  if (ttsUnlocked && audioUnlocked) GESTURES.forEach((g) => document.removeEventListener(g, unlock, true));
}
GESTURES.forEach((g) => document.addEventListener(g, unlock, { capture: true, passive: true }));
