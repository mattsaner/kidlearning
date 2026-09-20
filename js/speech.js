import { LANGUAGES } from './data.js';
import { settings } from './i18n.js';

let audio = null;

const speechLang = () => LANGUAGES.find((l) => l.id === settings.lang).speech;

function pickVoice(lang) {
  const voices = window.speechSynthesis?.getVoices?.() || [];
  const prefix = lang.slice(0, 2);
  return voices.find((v) => v.lang === lang) || voices.find((v) => v.lang.startsWith(prefix));
}

function speakTts(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = speechLang();
  u.rate = 0.8;
  u.pitch = 1.15;
  const voice = pickVoice(u.lang);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

/**
 * Speak a word. If assets/audio/<lang>/<id>.mp3 exists it is used (parents can
 * record their own voice); otherwise the browser's text-to-speech is used.
 */
export function speak(text, id) {
  if (!settings.sound) return;
  window.speechSynthesis?.cancel();
  audio?.pause();
  if (!id) return speakTts(text);
  const a = new Audio(`assets/audio/${settings.lang}/${id}.mp3`);
  a.addEventListener('error', () => speakTts(text), { once: true });
  audio = a;
  a.play().catch(() => {});
}
