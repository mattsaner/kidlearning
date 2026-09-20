// All learnable content. To add a word, add an item with en/fr/de names.
// Visual is one of: { emoji }, { color }, { dots } (number of dots + digit).

// `cry` (optional): [en, fr, de] onomatopoeia played on a second tap (animals).
const item = (id, visual, en, fr, de, cry) => ({
  id, ...visual, names: { en, fr, de },
  ...(cry && { cry: { en: cry[0], fr: cry[1], de: cry[2] } }),
});

export const CATEGORIES = [
  {
    id: 'colors',
    icon: '🎨',
    names: { en: 'Colors', fr: 'Couleurs', de: 'Farben' },
    items: [
      item('red', { color: '#e63946' }, 'red', 'rouge', 'rot'),
      item('blue', { color: '#3a86ff' }, 'blue', 'bleu', 'blau'),
      item('yellow', { color: '#ffd60a' }, 'yellow', 'jaune', 'gelb'),
      item('green', { color: '#38b000' }, 'green', 'vert', 'grün'),
      item('orange', { color: '#fb8500' }, 'orange', 'orange', 'orange'),
      item('purple', { color: '#8338ec' }, 'purple', 'violet', 'lila'),
      item('pink', { color: '#ff70a6' }, 'pink', 'rose', 'rosa'),
      item('brown', { color: '#8d5524' }, 'brown', 'marron', 'braun'),
      item('black', { color: '#222222' }, 'black', 'noir', 'schwarz'),
      item('white', { color: '#ffffff' }, 'white', 'blanc', 'weiß'),
    ],
  },
  {
    id: 'animals',
    icon: '🐶',
    names: { en: 'Animals', fr: 'Animaux', de: 'Tiere' },
    items: [
      item('dog', { emoji: '🐶' }, 'dog', 'le chien', 'der Hund', ['Woof woof!', 'Ouaf ouaf !', 'Wau wau!']),
      item('cat', { emoji: '🐱' }, 'cat', 'le chat', 'die Katze', ['Meow!', 'Miaou !', 'Miau!']),
      item('cow', { emoji: '🐮' }, 'cow', 'la vache', 'die Kuh', ['Moo!', 'Meuh !', 'Muh!']),
      item('horse', { emoji: '🐴' }, 'horse', 'le cheval', 'das Pferd', ['Neigh!', 'Hiiii hiii !', 'Iiih iiih!']),
      item('pig', { emoji: '🐷' }, 'pig', 'le cochon', 'das Schwein', ['Oink oink!', 'Grouin grouin !', 'Grunz grunz!']),
      item('sheep', { emoji: '🐑' }, 'sheep', 'le mouton', 'das Schaf', ['Baa baa!', 'Bêê bêê !', 'Mäh mäh!']),
      item('duck', { emoji: '🦆' }, 'duck', 'le canard', 'die Ente', ['Quack quack!', 'Coin coin !', 'Quak quak!']),
      item('chicken', { emoji: '🐔' }, 'chicken', 'la poule', 'das Huhn', ['Cluck cluck!', 'Cot cot cot !', 'Gack gack!']),
      item('frog', { emoji: '🐸' }, 'frog', 'la grenouille', 'der Frosch', ['Ribbit!', 'Coa coa !', 'Quak quak!']),
      item('fish', { emoji: '🐟' }, 'fish', 'le poisson', 'der Fisch', ['Blub blub!', 'Blub blub !', 'Blubb blubb!']),
      item('elephant', { emoji: '🐘' }, 'elephant', "l'éléphant", 'der Elefant', ['Toot toot!', 'Prrrout !', 'Töröö!']),
      item('lion', { emoji: '🦁' }, 'lion', 'le lion', 'der Löwe', ['Roar!', 'Grrrr !', 'Roaar!']),
    ],
  },
  {
    id: 'food',
    icon: '🍎',
    names: { en: 'Fruits & veggies', fr: 'Fruits et légumes', de: 'Obst & Gemüse' },
    items: [
      item('apple', { emoji: '🍎' }, 'apple', 'la pomme', 'der Apfel'),
      item('banana', { emoji: '🍌' }, 'banana', 'la banane', 'die Banane'),
      item('orange-fruit', { emoji: '🍊' }, 'orange', "l'orange", 'die Orange'),
      item('strawberry', { emoji: '🍓' }, 'strawberry', 'la fraise', 'die Erdbeere'),
      item('grapes', { emoji: '🍇' }, 'grapes', 'le raisin', 'die Trauben'),
      item('pear', { emoji: '🍐' }, 'pear', 'la poire', 'die Birne'),
      item('carrot', { emoji: '🥕' }, 'carrot', 'la carotte', 'die Karotte'),
      item('tomato', { emoji: '🍅' }, 'tomato', 'la tomate', 'die Tomate'),
      item('potato', { emoji: '🥔' }, 'potato', 'la pomme de terre', 'die Kartoffel'),
      item('cucumber', { emoji: '🥒' }, 'cucumber', 'le concombre', 'die Gurke'),
    ],
  },
  {
    id: 'numbers',
    icon: '🔢',
    names: { en: 'Numbers & shapes', fr: 'Chiffres et formes', de: 'Zahlen & Formen' },
    items: [
      item('n1', { dots: 1 }, 'one', 'un', 'eins'),
      item('n2', { dots: 2 }, 'two', 'deux', 'zwei'),
      item('n3', { dots: 3 }, 'three', 'trois', 'drei'),
      item('n4', { dots: 4 }, 'four', 'quatre', 'vier'),
      item('n5', { dots: 5 }, 'five', 'cinq', 'fünf'),
      item('n6', { dots: 6 }, 'six', 'six', 'sechs'),
      item('n7', { dots: 7 }, 'seven', 'sept', 'sieben'),
      item('n8', { dots: 8 }, 'eight', 'huit', 'acht'),
      item('n9', { dots: 9 }, 'nine', 'neuf', 'neun'),
      item('n10', { dots: 10 }, 'ten', 'dix', 'zehn'),
      item('circle', { emoji: '🔴' }, 'circle', 'le cercle', 'der Kreis'),
      item('square', { emoji: '🟦' }, 'square', 'le carré', 'das Quadrat'),
      item('triangle', { emoji: '🔺' }, 'triangle', 'le triangle', 'das Dreieck'),
      item('star', { emoji: '⭐' }, 'star', "l'étoile", 'der Stern'),
      item('heart', { emoji: '❤️' }, 'heart', 'le cœur', 'das Herz'),
    ],
  },
];

export const LANGUAGES = [
  { id: 'en', flag: '🇬🇧', label: 'English', speech: 'en-GB' },
  { id: 'fr', flag: '🇫🇷', label: 'Français', speech: 'fr-FR' },
  { id: 'de', flag: '🇩🇪', label: 'Deutsch', speech: 'de-DE' },
];
