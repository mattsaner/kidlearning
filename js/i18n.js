import { LANGUAGES } from './data.js';

const STRINGS = {
  en: {
    explore: 'Explore', findit: 'Find it!', sounds: 'Sounds', settings: 'Settings', language: 'Language',
    sound: 'Sound', back: 'Back', holdHint: 'Hold to open (parents)', category: 'Category',
    find: (w) => `Find ${w}!`, yes: ['Yes!', 'Well done!', 'Bravo!', 'Great!'],
    close: 'Close', mode: 'Game', choices: 'Choices per round',
  },
  fr: {
    explore: 'Explorer', findit: 'Trouve !', sounds: 'Sons', settings: 'Réglages', language: 'Langue',
    sound: 'Son', back: 'Retour', holdHint: 'Maintenir pour ouvrir (parents)', category: 'Catégorie',
    find: (w) => `Trouve ${w} !`, yes: ['Oui !', 'Bravo !', 'Super !', 'Bien joué !'],
    close: 'Fermer', mode: 'Jeu', choices: 'Choix par tour',
  },
  de: {
    explore: 'Entdecken', findit: 'Finde es!', sounds: 'Geräusche', settings: 'Einstellungen', language: 'Sprache',
    sound: 'Ton', back: 'Zurück', holdHint: 'Gedrückt halten (Eltern)', category: 'Kategorie',
    find: (w) => `Finde ${w}!`, yes: ['Ja!', 'Bravo!', 'Super!', 'Toll gemacht!'],
    close: 'Schließen', mode: 'Spiel', choices: 'Auswahl pro Runde',
  },
};

const KEY = 'kidlearning.settings';
const DEFAULT_LANG = 'fr';
const defaults = { lang: DEFAULT_LANG, sound: true, choices: 2 };

export const settings = { ...defaults };

export function loadSettings() {
  try {
    Object.assign(settings, JSON.parse(localStorage.getItem(KEY)) || {});
  } catch { /* storage unavailable */ }
  if (!LANGUAGES.some((l) => l.id === settings.lang)) settings.lang = DEFAULT_LANG;
}

export function saveSettings() {
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}

export const t = () => STRINGS[settings.lang];
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
