// Instruments for the Music mode. Each has a name (en/fr/de) and a short
// synthesized tone (Web Audio oscillator settings) — no audio files, so
// there is nothing to license or download. Most play a little 2-3 note riff
// (see `notes` in js/games/music.js) rather than a single short beep, so a
// tap feels like a small musical phrase, not just a click.

export const INSTRUMENTS = [
  {
    id: 'drum', emoji: '🥁',
    names: { en: 'the drum', fr: 'le tambour', de: 'die Trommel' },
    tone: {
      wave: 'triangle', freq: 100, attack: 0.004, gain: 0.85,
      notes: [
        { at: 0, duration: 0.14, gain: 0.65 },
        { at: 0.16, duration: 0.14, gain: 0.7, ratio: 1.05 },
        { at: 0.34, duration: 0.34, gain: 1, ratio: 0.95 },
      ],
    },
  },
  {
    id: 'bell', emoji: '🔔',
    names: { en: 'the bell', fr: 'la cloche', de: 'die Glocke' },
    tone: {
      wave: 'sine', freq: 660, attack: 0.002, gain: 0.5, harmonic: 2,
      notes: [
        { at: 0, duration: 0.7 },
        { at: 0.22, duration: 0.8, ratio: 1.25 },
        { at: 0.46, duration: 1.1, ratio: 1.5 },
      ],
    },
  },
  {
    id: 'piano', emoji: '🎹',
    names: { en: 'the piano', fr: 'le piano', de: 'das Klavier' },
    tone: {
      wave: 'triangle', freq: 261.63, attack: 0.005, gain: 0.65, harmonic: 1.5,
      notes: [
        { at: 0, duration: 0.5 },
        { at: 0.14, duration: 0.5, ratio: 1.25 },
        { at: 0.28, duration: 0.8, ratio: 1.5 },
      ],
    },
  },
  {
    id: 'trumpet', emoji: '🎺',
    names: { en: 'the trumpet', fr: 'la trompette', de: 'die Trompete' },
    tone: {
      wave: 'sawtooth', freq: 392, attack: 0.015, gain: 0.42,
      notes: [
        { at: 0, duration: 0.16 },
        { at: 0.19, duration: 0.16 },
        { at: 0.38, duration: 0.6, ratio: 1.33 },
      ],
    },
  },
  {
    id: 'guitar', emoji: '🎸',
    names: { en: 'the guitar', fr: 'la guitare', de: 'die Gitarre' },
    tone: {
      wave: 'triangle', freq: 293.66, attack: 0.004, gain: 0.65,
      notes: [
        { at: 0, duration: 0.35, ratio: 1.5 },
        { at: 0.07, duration: 0.4, ratio: 1.25 },
        { at: 0.14, duration: 0.7 },
      ],
    },
  },
];

// A cheerful original pentatonic pattern for the Freeze Dance loop (not from any
// existing song — a plain ascending/descending run has no author to credit).
export const DANCE_NOTES = [261.63, 329.63, 392.0, 440.0, 523.25, 440.0, 392.0, 329.63];
