import { LANGUAGES } from './data.js';

const STRINGS = {
  en: {
    kidLockTip: 'Tip: to keep your child in the game, add it to the Home Screen (Share → Add to Home Screen), then turn on Guided Access (Settings → Accessibility).',
    credits: 'Credits', creditsIntro: 'Animal sounds from Wikimedia Commons, adapted (trimmed and converted). Each keeps its own license. Game code: MIT license, © 2026 Matthieu Saner.',
    playTime: 'Play time', off: 'Off', minutes: 'min', today: 'Today', session: 'Session', resetToday: 'Reset today', showTimer: 'Show timer',
    timesUp: 'All done for today! See you tomorrow.', unlockHint: 'Hold to add 5 minutes (parents)',
    explore: 'Explore', findit: 'Find it!', sounds: 'Sounds', draw: 'Drawing', body: 'Body', whereIs: (w) => `Where is ${w}?`, hide: 'Hide & seek', look: (w) => `Look: ${w}!`, notHere: 'Not here!', music: 'Music', instruments: 'Instruments', freezeDance: 'Freeze dance', freeze: 'Freeze!', pause: 'Pause', settings: 'Settings', language: 'Language',
    sound: 'Sound', drawSound: 'Drawing sound', back: 'Back', holdHint: 'Hold to open (parents)', category: 'Category',
    find: (w) => `Find ${w}!`, yes: ['Yes!', 'Well done!', 'Bravo!', 'Great!'],
    close: 'Close', mode: 'Game', choices: 'Choices per round',
    statsTitle: 'Statistics', thisWeek: 'This week', allTime: 'All time', gamesPlayed: 'Games played',
    discovery: 'Discovery', words: 'Words', drawingsLabel: 'Drawings', soundsLabel: 'Animal sounds',
    accuracy: 'Accuracy', firstTry: 'first try', rounds: 'rounds', last: (n) => `last ${n}`,
    resetStats: 'Reset statistics', noRounds: 'No rounds played yet',
  },
  fr: {
    kidLockTip: "Astuce : pour garder votre enfant dans le jeu, ajoutez-le à l'écran d'accueil (Partager → Sur l'écran d'accueil), puis activez l'Accès guidé (Réglages → Accessibilité).",
    credits: 'Crédits', creditsIntro: "Sons d'animaux issus de Wikimedia Commons, adaptés (découpés et convertis). Chacun garde sa licence. Code du jeu : licence MIT, © 2026 Matthieu Saner.",
    playTime: 'Temps de jeu', off: 'Désactivé', minutes: 'min', today: "Aujourd'hui", session: 'Session', resetToday: 'Remettre à zéro', showTimer: 'Afficher le minuteur',
    timesUp: "C'est fini pour aujourd'hui ! À demain.", unlockHint: 'Maintenir pour ajouter 5 minutes (parents)',
    explore: 'Explorer', findit: 'Trouve !', sounds: 'Sons', draw: 'Dessin', body: 'Corps', whereIs: (w) => `Où est ${w} ?`, hide: 'Cache-cache', look: (w) => `Regarde : ${w} !`, notHere: 'Pas là !', music: 'Musique', instruments: 'Instruments', freezeDance: 'Danse musicale', freeze: 'Fige-toi\u00a0!', pause: 'Pause', settings: 'Réglages', language: 'Langue',
    sound: 'Son', drawSound: 'Son du dessin', back: 'Retour', holdHint: 'Maintenir pour ouvrir (parents)', category: 'Catégorie',
    find: (w) => `Trouve ${w} !`, yes: ['Oui !', 'Bravo !', 'Super !', 'Bien joué !'],
    close: 'Fermer', mode: 'Jeu', choices: 'Choix par tour',
    statsTitle: 'Statistiques', thisWeek: 'Cette semaine', allTime: 'Depuis toujours', gamesPlayed: 'Parties jouées',
    discovery: 'Découverte', words: 'Mots', drawingsLabel: 'Dessins', soundsLabel: "Cris d'animaux",
    accuracy: 'Précision', firstTry: 'du premier coup', rounds: 'tours', last: (n) => `${n} derniers`,
    resetStats: 'Réinitialiser les statistiques', noRounds: 'Pas encore de tour joué',
  },
  de: {
    kidLockTip: 'Tipp: Damit Ihr Kind im Spiel bleibt, zum Home-Bildschirm hinzufügen (Teilen → Zum Home-Bildschirm) und dann den Geführten Zugriff aktivieren (Einstellungen → Bedienungshilfen).',
    credits: 'Danksagung', creditsIntro: 'Tiergeräusche von Wikimedia Commons, bearbeitet (gekürzt und konvertiert). Jedes behält seine eigene Lizenz. Spielcode: MIT-Lizenz, © 2026 Matthieu Saner.',
    playTime: 'Spielzeit', off: 'Aus', minutes: 'Min.', today: 'Heute', session: 'Sitzung', resetToday: 'Zurücksetzen', showTimer: 'Timer anzeigen',
    timesUp: 'Für heute ist Schluss! Bis morgen.', unlockHint: 'Gedrückt halten, um 5 Minuten zu geben (Eltern)',
    explore: 'Entdecken', findit: 'Finde es!', sounds: 'Geräusche', draw: 'Malen', body: 'Körper', whereIs: (w) => `Wo ist ${w}?`, hide: 'Verstecken', look: (w) => `Schau: ${w}!`, notHere: 'Nicht da!', music: 'Musik', instruments: 'Instrumente', freezeDance: 'Tanzstopp', freeze: 'Stopp!', pause: 'Pause', settings: 'Einstellungen', language: 'Sprache',
    sound: 'Ton', drawSound: 'Ton beim Malen', back: 'Zurück', holdHint: 'Gedrückt halten (Eltern)', category: 'Kategorie',
    find: (w) => `Finde ${w}!`, yes: ['Ja!', 'Bravo!', 'Super!', 'Toll gemacht!'],
    close: 'Schließen', mode: 'Spiel', choices: 'Auswahl pro Runde',
    statsTitle: 'Statistik', thisWeek: 'Diese Woche', allTime: 'Insgesamt', gamesPlayed: 'Gespielte Spiele',
    discovery: 'Entdeckung', words: 'Wörter', drawingsLabel: 'Zeichnungen', soundsLabel: 'Tiergeräusche',
    accuracy: 'Genauigkeit', firstTry: 'beim ersten Versuch', rounds: 'Runden', last: (n) => `letzte ${n}`,
    resetStats: 'Statistik zurücksetzen', noRounds: 'Noch keine Runde gespielt',
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
