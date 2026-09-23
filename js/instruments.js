// Instruments for the Music mode. Each has a name (en/fr/de) and a short
// synthesized tone (Web Audio oscillator settings) — no audio files, so
// there is nothing to license or download.

export const INSTRUMENTS = [
  {
    id: 'drum', emoji: '🥁',
    names: { en: 'the drum', fr: 'le tambour', de: 'die Trommel' },
    tone: { wave: 'triangle', freq: 110, duration: 0.22, attack: 0.005, gain: 0.9 },
  },
  {
    id: 'bell', emoji: '🔔',
    names: { en: 'the bell', fr: 'la cloche', de: 'die Glocke' },
    tone: { wave: 'sine', freq: 880, duration: 0.9, attack: 0.002, gain: 0.55, harmonic: 2 },
  },
  {
    id: 'piano', emoji: '🎹',
    names: { en: 'the piano', fr: 'le piano', de: 'das Klavier' },
    tone: { wave: 'triangle', freq: 329.63, duration: 0.6, attack: 0.005, gain: 0.7, harmonic: 1.5 },
  },
  {
    id: 'trumpet', emoji: '🎺',
    names: { en: 'the trumpet', fr: 'la trompette', de: 'die Trompete' },
    tone: { wave: 'sawtooth', freq: 392, duration: 0.45, attack: 0.02, gain: 0.5 },
  },
  {
    id: 'guitar', emoji: '🎸',
    names: { en: 'the guitar', fr: 'la guitare', de: 'die Gitarre' },
    tone: { wave: 'triangle', freq: 293.66, duration: 0.5, attack: 0.005, gain: 0.7 },
  },
];

// A cheerful original pentatonic pattern for the Freeze Dance loop (not from any
// existing song — a plain ascending/descending run has no author to credit).
export const DANCE_NOTES = [261.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63];
