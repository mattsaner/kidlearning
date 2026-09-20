// A friendly bear whose body parts can be tapped (Body mode). 100 x 100 box.
// Regions are in painter's order: later ones sit on top of earlier ones.
// `part` links a region to BODY_PARTS, so both ears say "the ear", etc.

import { circle, ellipse } from './drawings.js';

const FUR = '#b07a45';
const DARK = '#8a5a2b';
const LIGHT = '#f3d9b1';
const PINK = '#f4a3b5';
const INK = '#3d2c1e';

export const BODY_PARTS = {
  head: { en: 'the head', fr: 'la tête', de: 'der Kopf' },
  ear: { en: 'the ear', fr: "l'oreille", de: 'das Ohr' },
  eye: { en: 'the eye', fr: "l'œil", de: 'das Auge' },
  nose: { en: 'the nose', fr: 'le nez', de: 'die Nase' },
  mouth: { en: 'the mouth', fr: 'la bouche', de: 'der Mund' },
  body: { en: 'the body', fr: 'le corps', de: 'der Körper' },
  tummy: { en: 'the tummy', fr: 'le ventre', de: 'der Bauch' },
  arm: { en: 'the arm', fr: 'le bras', de: 'der Arm' },
  hand: { en: 'the hand', fr: 'la main', de: 'die Hand' },
  foot: { en: 'the foot', fr: 'le pied', de: 'der Fuß' },
};

// The parts asked in "Find it" (the ones toddlers learn first).
export const FIND_POOL = ['nose', 'eye', 'ear', 'mouth', 'hand', 'foot', 'tummy', 'head'];

export const BODY_REGIONS = [
  { part: 'foot', fill: DARK, d: circle(35, 90, 9.5) },
  { part: 'foot', fill: DARK, d: circle(65, 90, 9.5) },
  { part: 'arm', fill: FUR, d: ellipse(21, 68, 8.5, 17) },
  { part: 'arm', fill: FUR, d: ellipse(79, 68, 8.5, 17) },
  { part: 'body', fill: FUR, d: ellipse(50, 72, 27, 25) },
  { part: 'tummy', fill: LIGHT, d: ellipse(50, 76, 16, 15) },
  { part: 'hand', fill: DARK, d: circle(19, 83, 8) },
  { part: 'hand', fill: DARK, d: circle(81, 83, 8) },
  { part: 'ear', fill: FUR, d: circle(27, 19, 12) },
  { part: 'ear', fill: PINK, d: circle(27, 19, 6) },
  { part: 'ear', fill: FUR, d: circle(73, 19, 12) },
  { part: 'ear', fill: PINK, d: circle(73, 19, 6) },
  { part: 'head', fill: FUR, d: circle(50, 38, 27) },
  { part: 'mouth', fill: LIGHT, d: ellipse(50, 47, 13, 10) },
  { part: 'nose', fill: INK, d: ellipse(50, 42, 5.5, 4) },
  { part: 'eye', fill: INK, d: circle(39, 32, 5.5) },
  { part: 'eye', fill: INK, d: circle(61, 32, 5.5) },
];

// Decoration that is not tappable: eye glints and the smile.
export const BODY_DECOR = [
  { fill: '#fff', d: circle(40.6, 30.4, 1.7) },
  { fill: '#fff', d: circle(62.6, 30.4, 1.7) },
  { fill: 'none', stroke: INK, d: 'M44 50.5 q6 5 12 0' },
];
