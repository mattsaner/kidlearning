import { LANGUAGES } from './data.js';
import { settings } from './i18n.js';

// Sound on iOS/iPadOS is picky: speech and audio only start after a "real" user
// gesture, and which event counts (pointerup, touchend, click) varies by version.
// The game reacts on pointerdown (so hard presses work), which Safari does not count.
//
// So: recordings play through the Web Audio API (decoded once, kept in memory, no
// <audio> element to juggle), and every sound request stays "pending" until it has
// really started. On each touch gesture we unlock audio/speech and retry whatever is
// still pending, so the first tap is not lost whichever event iOS accepts.

const synth = window.speechSynthesis;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
try { navigator.audioSession.type = 'playback'; } catch { /* Safari 16.4+: play even if the ringer is muted */ }

let ctx = null;
const buffers = new Map(); // url -> Promise<AudioBuffer>
let source = null; // the recording playing now
let utterance = null; // keep the utterance referenced (some browsers drop it otherwise)
let token = 0;
let pending = null; // latest request: { kind, run, time, served, sample }
let ttsUnlocked = !synth;
let readyQueue = []; // fn(ctx) callbacks waiting for the AudioContext to unlock (see whenAudioReady)

let custom = {}; // { fr: ['dog', ...] }: recorded voice files, see assets/audio/manifest.json
fetch('assets/audio/manifest.json').then((r) => (r.ok ? r.json() : {})).then((m) => { custom = m; }).catch(() => {});

const audioCtx = () => { if (!ctx && AudioCtx) ctx = new AudioCtx(); return ctx; };
const speechLang = () => LANGUAGES.find((l) => l.id === settings.lang).speech;

function pickVoice(lang) {
  const voices = synth?.getVoices?.() || [];
  const prefix = lang.slice(0, 2);
  return voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(prefix));
}

// --- recordings (Web Audio)

function load(url) {
  if (!buffers.has(url)) {
    const c = audioCtx();
    const p = fetch(url)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      // callback form: older Safari has no promise-based decodeAudioData
      .then((data) => new Promise((resolve, reject) => c.decodeAudioData(data, resolve, reject)));
    p.catch(() => buffers.delete(url));
    buffers.set(url, p);
  }
  return buffers.get(url);
}

/** Download and decode recordings ahead of time so they play instantly. */
export function preload(urls) {
  if (audioCtx()) urls.forEach((u) => load(u).catch(() => {}));
}

function stopSample() {
  try { source?.stop(); } catch { /* already stopped */ }
  source = null;
}

function playSample(url, req, onFail) {
  if (!audioCtx()) return onFail?.();
  load(url).then((buffer) => {
    if (pending !== req) return; // a newer sound was requested meanwhile
    const go = () => {
      stopSample();
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      req.served = true;
    };
    if (ctx.state === 'running') go();
    else req.sample = go; // not unlocked yet: started as soon as a gesture unlocks audio
  }).catch(() => onFail?.());
}

// --- speech

function speakTts(text, req, { rate = 0.72, pitch = 1.15 } = {}) {
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang();
  u.rate = rate;
  u.pitch = pitch;
  const voice = pickVoice(u.lang);
  if (voice) u.voice = voice;
  u.onstart = () => { ttsUnlocked = true; req.served = true; };
  utterance = u;
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

function stopAll() {
  stopSample();
  if (synth && (synth.speaking || synth.pending)) { token++; synth.cancel(); }
}

const request = (kind, run) => (pending = { kind, run, time: performance.now(), served: false, sample: null });

/**
 * Speak a word. If assets/audio/<lang>/<id>.mp3 exists and is listed in
 * assets/audio/manifest.json it is played (parents can record their own voice);
 * otherwise the browser's text-to-speech is used.
 */
export function speak(text, id, opts) {
  if (!settings.sound) return;
  const withVoice = id && custom[settings.lang]?.includes(id);
  const req = request(withVoice ? 'sample' : 'speech', () => speak(text, id, opts));
  stopAll();
  if (withVoice) {
    return playSample(`assets/audio/${settings.lang}/${id}.mp3`, req, () => speakTts(text, req, opts));
  }
  speakTts(text, req, opts);
}

/** Play the real recording of an animal's cry (assets/audio/cries/<id>.mp3). */
export function playCry(id) {
  if (!settings.sound) return;
  const req = request('sample', () => playCry(id));
  stopAll();
  playSample(`assets/audio/cries/${id}.mp3`, req);
}

export const preloadCries = (ids) => preload(ids.map((id) => `assets/audio/cries/${id}.mp3`));

/**
 * Run `fn(ctx)` on the shared AudioContext: now if it is already unlocked (e.g. a
 * later screen, after the first tap of the session), otherwise as soon as a touch
 * gesture unlocks it. Used for synthesized sound (see js/games/music.js) so it
 * doesn't need to solve the iOS "first tap" problem a second time.
 */
export function whenAudioReady(fn) {
  const c = audioCtx();
  if (!c) return;
  if (c.state === 'running') fn(c);
  else readyQueue.push(fn);
}

// --- unlock on touch gestures

const GESTURES = ['pointerup', 'touchend', 'click', 'keydown'];

function unlock() {
  const c = audioCtx();
  const p = pending;
  const fresh = p && !p.served && performance.now() - p.time < 2500;
  const finish = () => {
    if (c?.state === 'running' && ttsUnlocked) GESTURES.forEach((g) => document.removeEventListener(g, unlock, true));
  };

  // Audio: resume inside the gesture; a recording waiting for it starts right after.
  if (c && c.state !== 'running') {
    const go = () => {
      if (pending?.sample && !pending.served && c.state === 'running') pending.sample();
      if (c.state === 'running') readyQueue.splice(0).forEach((fn) => fn(c));
      finish();
    };
    c.resume().then(go, go);
  }

  // Speech: must start synchronously inside the gesture.
  if (!ttsUnlocked && synth) {
    if (fresh && p.kind === 'speech') {
      p.run(); // blocked a moment ago (pointerdown): say it now
    } else {
      const u = new SpeechSynthesisUtterance('.');
      u.volume = 0;
      u.onstart = () => { ttsUnlocked = true; };
      synth.speak(u);
    }
  }
  finish();
}
GESTURES.forEach((g) => document.addEventListener(g, unlock, { capture: true, passive: true }));
