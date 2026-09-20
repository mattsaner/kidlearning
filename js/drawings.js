// Line drawings to colour. Everything lives in a 100 x 100 box.
// A drawing is a list of regions in painter's order (later regions sit on top).
// Each region has `c` (the id of a color from js/data.js, so the brush color
// and the spoken name are automatic) and `d` (an SVG path).

const r2 = (n) => Math.round(n * 100) / 100;
export const poly = (...pts) => `M${pts.map((p) => p.join(' ')).join('L')}Z`;
export const rect = (x, y, w, h) => poly([x, y], [x + w, y], [x + w, y + h], [x, y + h]);
export const ellipse = (cx, cy, rx, ry) =>
  `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
export const circle = (cx, cy, r) => ellipse(cx, cy, r, r);
const polar = (cx, cy, r, a) => [r2(cx + r * Math.cos(a)), r2(cy + r * Math.sin(a))];
const band = (cx, cy, ro, ri) =>
  `M${cx - ro} ${cy}A${ro} ${ro} 0 0 1 ${cx + ro} ${cy}L${cx + ri} ${cy}A${ri} ${ri} 0 0 0 ${cx - ri} ${cy}Z`;

const bg = (c) => ({ c, d: rect(0, 0, 100, 100) }); // the background can be colored too

const sun = [
  bg('blue'),
  ...Array.from({ length: 8 }, (_, k) => {
    const a = (k * Math.PI) / 4;
    const w = Math.PI / 13;
    return { c: 'orange', d: poly(polar(50, 50, 47, a), polar(50, 50, 24, a - w), polar(50, 50, 24, a + w)) };
  }),
  { c: 'yellow', d: circle(50, 50, 26) },
];

const house = [
  bg('blue'),
  { c: 'green', d: rect(0, 80, 100, 20) },
  { c: 'orange', d: rect(66, 20, 10, 20) },
  { c: 'yellow', d: rect(20, 46, 60, 36) },
  { c: 'red', d: poly([10, 48], [50, 14], [90, 48]) },
  { c: 'brown', d: rect(43, 58, 16, 24) },
  { c: 'blue', d: rect(26, 54, 12, 12) },
  { c: 'blue', d: rect(62, 54, 12, 12) },
];

const flower = [
  bg('blue'),
  { c: 'green', d: rect(47, 50, 6, 42) },
  { c: 'green', d: ellipse(35, 76, 12, 5.5) },
  { c: 'green', d: ellipse(65, 68, 12, 5.5) },
  ...Array.from({ length: 6 }, (_, k) => {
    const [x, y] = polar(50, 32, 17, (k * Math.PI) / 3);
    return { c: 'pink', d: circle(x, y, 13) };
  }),
  { c: 'yellow', d: circle(50, 32, 10) },
];

const fish = [
  bg('blue'),
  { c: 'red', d: poly([70, 50], [94, 30], [94, 70]) },
  { c: 'red', d: poly([32, 36], [44, 16], [58, 34]) },
  { c: 'orange', d: ellipse(46, 52, 30, 21) },
  { c: 'black', d: circle(32, 46, 4) },
  { c: 'white', d: circle(8, 38, 4) },
  { c: 'white', d: circle(14, 24, 5) },
  { c: 'white', d: circle(9, 11, 3.5) },
];

const apple = [
  bg('yellow'),
  { c: 'green', d: ellipse(64, 24, 13, 6.5) },
  { c: 'brown', d: rect(46, 16, 8, 20) },
  { c: 'red', d: circle(50, 58, 28) },
];

const rainbow = [bg('blue'), ...['red', 'orange', 'yellow', 'green', 'blue', 'purple'].map((c, i) => ({
  c, d: band(50, 68, 46 - i * 7, 39 - i * 7),
}))];

const tree = [
  bg('blue'),
  { c: 'green', d: rect(0, 82, 100, 18) },
  { c: 'brown', d: poly([42, 84], [45, 44], [55, 44], [58, 84]) },
  { c: 'green', d: circle(32, 44, 16) },
  { c: 'green', d: circle(68, 44, 16) },
  { c: 'green', d: circle(50, 28, 21) },
  { c: 'red', d: circle(44, 26, 5) },
  { c: 'red', d: circle(60, 34, 5) },
  { c: 'red', d: circle(30, 46, 5) },
];

const cat = [
  bg('blue'),
  { c: 'orange', d: poly([20, 40], [22, 8], [46, 26]) },
  { c: 'orange', d: poly([80, 40], [78, 8], [54, 26]) },
  { c: 'pink', d: poly([26, 32], [27, 17], [39, 27]) },
  { c: 'pink', d: poly([74, 32], [73, 17], [61, 27]) },
  { c: 'orange', d: circle(50, 56, 33) },
  { c: 'white', d: ellipse(50, 70, 16, 11) },
  { c: 'green', d: circle(37, 50, 6) },
  { c: 'green', d: circle(63, 50, 6) },
  { c: 'pink', d: poly([44, 62], [56, 62], [50, 69]) },
];

const duck = [
  bg('blue'),
  { c: 'green', d: rect(0, 86, 100, 14) },
  { c: 'yellow', d: ellipse(44, 64, 31, 22) },
  { c: 'yellow', d: circle(70, 36, 16) },
  { c: 'orange', d: poly([83, 32], [98, 39], [83, 46]) },
  { c: 'orange', d: ellipse(40, 64, 16, 10) },
  { c: 'black', d: circle(75, 31, 3.5) },
];

const car = [
  bg('blue'),
  { c: 'green', d: rect(0, 78, 100, 22) },
  { c: 'orange', d: poly([24, 52], [35, 30], [66, 30], [77, 52]) },
  { c: 'red', d: rect(8, 50, 84, 26) },
  { c: 'white', d: poly([30, 49], [38, 34], [48, 34], [48, 49]) },
  { c: 'white', d: poly([53, 34], [63, 34], [71, 49], [53, 49]) },
  { c: 'black', d: circle(27, 78, 12) },
  { c: 'black', d: circle(73, 78, 12) },
  { c: 'white', d: circle(27, 78, 5) },
  { c: 'white', d: circle(73, 78, 5) },
];

const butterfly = [
  bg('green'),
  { c: 'orange', d: ellipse(30, 36, 20, 16) },
  { c: 'orange', d: ellipse(70, 36, 20, 16) },
  { c: 'purple', d: ellipse(35, 65, 15, 14) },
  { c: 'purple', d: ellipse(65, 65, 15, 14) },
  { c: 'yellow', d: circle(27, 34, 6) },
  { c: 'yellow', d: circle(73, 34, 6) },
  { c: 'pink', d: circle(35, 66, 5) },
  { c: 'pink', d: circle(65, 66, 5) },
  { c: 'brown', d: ellipse(50, 50, 5, 26) },
];

const balloons = [
  bg('blue'),
  { c: 'red', d: ellipse(28, 32, 14, 18) },
  { c: 'yellow', d: ellipse(50, 26, 14, 18) },
  { c: 'green', d: ellipse(72, 32, 14, 18) },
  { c: 'orange', d: ellipse(38, 68, 14, 18) },
  { c: 'purple', d: ellipse(62, 70, 14, 18) },
];

export const DRAWINGS = [
  { id: 'sun', names: { en: 'the sun', fr: 'le soleil', de: 'die Sonne' }, regions: sun },
  { id: 'house', names: { en: 'the house', fr: 'la maison', de: 'das Haus' }, regions: house },
  { id: 'flower', names: { en: 'the flower', fr: 'la fleur', de: 'die Blume' }, regions: flower },
  { id: 'fish', names: { en: 'the fish', fr: 'le poisson', de: 'der Fisch' }, regions: fish },
  { id: 'apple', names: { en: 'the apple', fr: 'la pomme', de: 'der Apfel' }, regions: apple },
  { id: 'rainbow', names: { en: 'the rainbow', fr: "l'arc-en-ciel", de: 'der Regenbogen' }, regions: rainbow },
  { id: 'tree', names: { en: 'the tree', fr: "l'arbre", de: 'der Baum' }, regions: tree },
  { id: 'cat', names: { en: 'the cat', fr: 'le chat', de: 'die Katze' }, regions: cat },
  { id: 'duck', names: { en: 'the duck', fr: 'le canard', de: 'die Ente' }, regions: duck },
  { id: 'car', names: { en: 'the car', fr: 'la voiture', de: 'das Auto' }, regions: car },
  { id: 'butterfly', names: { en: 'the butterfly', fr: 'le papillon', de: 'der Schmetterling' }, regions: butterfly },
  { id: 'balloons', names: { en: 'the balloons', fr: 'les ballons', de: 'die Luftballons' }, regions: balloons },
];
