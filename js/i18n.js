import { LANGUAGES } from './data.js';

const STRINGS = {
  en: {
    playTime: 'Play time', off: 'Off', minutes: 'min', today: 'Today', session: 'Session', resetToday: 'Reset today', showTimer: 'Show timer',
    timesUp: 'All done for today! See you tomorrow.', unlockHint: 'Hold to add 5 minutes (parents)',
    explore: 'Explore', findit: 'Find it!', sounds: 'Sounds', draw: 'Drawing', settings: 'Settings', language: 'Language',
    sound: 'Sound', drawSound: 'Drawing sound', back: 'Back', holdHint: 'Hold to open (parents)', category: 'Category',
    find: (w) => `Find ${w}!`, yes: ['Yes!', 'Well done!', 'Bravo!', 'Great!'],
    close: 'Close', mode: 'Game', choices: 'Choices per round',
  },
  fr: {
    playTime: 'Temps de jeu', off: 'Désactivé', minutes: 'min', today: "Aujourd'hui", session: 'Session', resetToday: 'Remettre à zéro', showTimer: 'Afficher le minuteur',
    timesUp: "C'est fini pour aujourd'hui ! À demain.", unlockHint: 'Maintenir pour ajouter 5 minutes (parents)',
    explore: 'Explorer', findit: 'Trouve !', sounds: 'Sons', draw: 'Dessin', settings: 'Réglages', language: 'Langue',
    sound: 'Son', drawSound: 'Son du dessin', back: 'Retour', holdHint: 'Maintenir pour ouvrir (parents)', category: 'Catégorie',
    find: (w) => `Trouve ${w} !`, yes: ['Oui !', 'Bravo !', 'Super !', 'Bien joué !'],
    close: 'Fermer', mode: 'Jeu', choices: 'Choix par tour',
  },
  de: {
    playTime: 'Spielzeit', off: 'Aus', minutes: 'Min.', today: 'Heute', session: 'Sitzung', resetToday: 'Zurücksetzen', showTimer: 'Timer anzeigen',
    timesUp: 'Für heute ist Schluss! Bis morgen.', unlockHint: 'Gedrückt halten, um 5 Minuten zu geben (Eltern)',
    explore: 'Entdecken', findit: 'Finde es!', sounds: 'Geräusche', draw: 'Malen', settings: 'Einstellungen', language: 'Sprache',
    sound: 'Ton', drawSound: 'Ton beim Malen', back: 'Zurück', holdHint: 'Gedrückt halten (Eltern)', category: 'Kategorie',
    find: (w) => `Finde ${w}!`, yes: ['Ja!', 'Bravo!', 'Super!', 'Toll gemacht!'],
    close: 'Schließen', mode: 'Spiel', choices: 'Auswahl pro Runde',
  },
};

const KEY = 'kidlearning.settings';
const DEFAULT_LANG = 'fr';
const defaults = { lang: DEFAULT_LANG, sound: true, drawSound: true, choices: 2, limitMin: 0, showTimer: true };

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
