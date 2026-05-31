import { VocabWord } from '../types';

export const VOCABULARY: VocabWord[] = [
  // ── Animals ──────────────────────────────────────────────────────────────
  {
    id: 'dog', en: 'Dog', sv: 'Hund', emoji: '🐶',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['dog', 'canine', 'puppy', 'pet', 'labrador', 'poodle', 'bulldog', 'golden retriever'],
  },
  {
    id: 'cat', en: 'Cat', sv: 'Katt', emoji: '🐱',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['cat', 'kitten', 'feline', 'kitty', 'tabby', 'persian cat', 'domestic cat'],
  },
  {
    id: 'bird', en: 'Bird', sv: 'Fågel', emoji: '🐦',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['bird', 'sparrow', 'robin', 'parrot', 'pigeon', 'seagull', 'chicken', 'feather', 'beak', 'wings'],
  },
  {
    id: 'fish', en: 'Fish', sv: 'Fisk', emoji: '🐠',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['fish', 'goldfish', 'aquarium', 'salmon', 'tuna', 'aquatic animal', 'marine life'],
  },
  {
    id: 'rabbit', en: 'Rabbit', sv: 'Kanin', emoji: '🐰',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['rabbit', 'bunny', 'hare', 'cottontail'],
  },
  {
    id: 'horse', en: 'Horse', sv: 'Häst', emoji: '🐴',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['horse', 'pony', 'stallion', 'mare', 'equine', 'foal'],
  },
  {
    id: 'cow', en: 'Cow', sv: 'Ko', emoji: '🐮',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['cow', 'cattle', 'calf', 'bull', 'dairy', 'bovine'],
  },
  {
    id: 'butterfly', en: 'Butterfly', sv: 'Fjäril', emoji: '🦋',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['butterfly', 'moth', 'insect', 'monarch butterfly', 'wings'],
  },
  {
    id: 'bee', en: 'Bee', sv: 'Bi', emoji: '🐝',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['bee', 'honeybee', 'bumblebee', 'wasp', 'insect', 'hive'],
  },
  {
    id: 'frog', en: 'Frog', sv: 'Groda', emoji: '🐸',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['frog', 'toad', 'amphibian', 'bullfrog', 'tadpole'],
  },
  {
    id: 'elephant', en: 'Elephant', sv: 'Elefant', emoji: '🐘',
    category: 'animals', difficulty: 2, xpValue: 15,
    imageLabels: ['elephant', 'pachyderm', 'trunk', 'tusk', 'african elephant', 'asian elephant'],
  },
  {
    id: 'duck', en: 'Duck', sv: 'Anka', emoji: '🦆',
    category: 'animals', difficulty: 1, xpValue: 10,
    imageLabels: ['duck', 'duckling', 'mallard', 'waterfowl', 'drake'],
  },

  // ── Food ────────────────────────────────────────────────────────────────
  {
    id: 'apple', en: 'Apple', sv: 'Äpple', emoji: '🍎',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['apple', 'red apple', 'green apple', 'granny smith', 'fruit'],
  },
  {
    id: 'banana', en: 'Banana', sv: 'Banan', emoji: '🍌',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['banana', 'plantain', 'yellow banana', 'tropical fruit'],
  },
  {
    id: 'orange', en: 'Orange', sv: 'Apelsin', emoji: '🍊',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['orange', 'citrus', 'mandarin', 'clementine', 'tangerine', 'citrus fruit'],
  },
  {
    id: 'strawberry', en: 'Strawberry', sv: 'Jordgubbe', emoji: '🍓',
    category: 'food', difficulty: 2, xpValue: 15,
    imageLabels: ['strawberry', 'berry', 'fruit', 'red fruit'],
  },
  {
    id: 'bread', en: 'Bread', sv: 'Bröd', emoji: '🍞',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['bread', 'loaf', 'toast', 'baguette', 'baked goods', 'whole grain bread'],
  },
  {
    id: 'milk', en: 'Milk', sv: 'Mjölk', emoji: '🥛',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['milk', 'dairy', 'glass of milk', 'carton', 'whole milk'],
  },
  {
    id: 'egg', en: 'Egg', sv: 'Ägg', emoji: '🥚',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['egg', 'chicken egg', 'fried egg', 'boiled egg', 'carton of eggs'],
  },
  {
    id: 'carrot', en: 'Carrot', sv: 'Morot', emoji: '🥕',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['carrot', 'vegetable', 'root vegetable', 'baby carrot'],
  },
  {
    id: 'tomato', en: 'Tomato', sv: 'Tomat', emoji: '🍅',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['tomato', 'cherry tomato', 'roma tomato', 'vegetable', 'nightshade'],
  },
  {
    id: 'potato', en: 'Potato', sv: 'Potatis', emoji: '🥔',
    category: 'food', difficulty: 1, xpValue: 10,
    imageLabels: ['potato', 'sweet potato', 'yam', 'tuber', 'root vegetable'],
  },

  // ── Nature ──────────────────────────────────────────────────────────────
  {
    id: 'tree', en: 'Tree', sv: 'Träd', emoji: '🌲',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['tree', 'pine tree', 'oak', 'birch', 'forest', 'evergreen', 'plant', 'trunk'],
  },
  {
    id: 'flower', en: 'Flower', sv: 'Blomma', emoji: '🌸',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['flower', 'rose', 'tulip', 'daisy', 'petal', 'blossom', 'flora', 'sunflower'],
  },
  {
    id: 'leaf', en: 'Leaf', sv: 'Blad', emoji: '🍃',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['leaf', 'leaves', 'foliage', 'autumn leaf', 'maple leaf', 'plant'],
  },
  {
    id: 'grass', en: 'Grass', sv: 'Gräs', emoji: '🌿',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['grass', 'lawn', 'meadow', 'green grass', 'turf', 'plant'],
  },
  {
    id: 'rock', en: 'Rock', sv: 'Sten', emoji: '🪨',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['rock', 'stone', 'pebble', 'boulder', 'gravel', 'mineral'],
  },
  {
    id: 'water', en: 'Water', sv: 'Vatten', emoji: '💧',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['water', 'river', 'lake', 'ocean', 'sea', 'stream', 'pond', 'waterfall'],
  },
  {
    id: 'sun', en: 'Sun', sv: 'Sol', emoji: '☀️',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['sun', 'sunshine', 'sunlight', 'sky', 'sunrise', 'sunset', 'solar'],
  },
  {
    id: 'cloud', en: 'Cloud', sv: 'Moln', emoji: '☁️',
    category: 'nature', difficulty: 1, xpValue: 10,
    imageLabels: ['cloud', 'clouds', 'cumulus', 'sky', 'overcast', 'weather', 'storm cloud'],
  },
  {
    id: 'snow', en: 'Snow', sv: 'Snö', emoji: '❄️',
    category: 'nature', difficulty: 2, xpValue: 15,
    imageLabels: ['snow', 'snowflake', 'winter', 'frost', 'blizzard', 'ice', 'snowfall'],
  },
  {
    id: 'mushroom', en: 'Mushroom', sv: 'Svamp', emoji: '🍄',
    category: 'nature', difficulty: 2, xpValue: 15,
    imageLabels: ['mushroom', 'fungus', 'toadstool', 'fungi', 'chanterelle'],
  },

  // ── Household ────────────────────────────────────────────────────────────
  {
    id: 'book', en: 'Book', sv: 'Bok', emoji: '📚',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['book', 'novel', 'textbook', 'reading', 'paperback', 'hardcover', 'library'],
  },
  {
    id: 'chair', en: 'Chair', sv: 'Stol', emoji: '🪑',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['chair', 'seat', 'furniture', 'stool', 'armchair', 'office chair'],
  },
  {
    id: 'table', en: 'Table', sv: 'Bord', emoji: '🍽️',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['table', 'desk', 'dining table', 'coffee table', 'furniture'],
  },
  {
    id: 'ball', en: 'Ball', sv: 'Boll', emoji: '⚽',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['ball', 'soccer ball', 'basketball', 'tennis ball', 'football', 'toy', 'sport'],
  },
  {
    id: 'cup', en: 'Cup', sv: 'Kopp', emoji: '☕',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['cup', 'mug', 'coffee cup', 'teacup', 'glass', 'drinkware'],
  },
  {
    id: 'spoon', en: 'Spoon', sv: 'Sked', emoji: '🥄',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['spoon', 'ladle', 'tablespoon', 'teaspoon', 'cutlery', 'silverware', 'utensil'],
  },
  {
    id: 'pencil', en: 'Pencil', sv: 'Penna', emoji: '✏️',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['pencil', 'pen', 'crayon', 'marker', 'writing instrument', 'stationery'],
  },
  {
    id: 'clock', en: 'Clock', sv: 'Klocka', emoji: '⏰',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['clock', 'watch', 'alarm clock', 'wall clock', 'timepiece', 'timer'],
  },
  {
    id: 'shoe', en: 'Shoe', sv: 'Sko', emoji: '👟',
    category: 'household', difficulty: 1, xpValue: 10,
    imageLabels: ['shoe', 'sneaker', 'boot', 'sandal', 'footwear', 'slipper', 'runner'],
  },
  {
    id: 'bicycle', en: 'Bicycle', sv: 'Cykel', emoji: '🚲',
    category: 'transport', difficulty: 2, xpValue: 15,
    imageLabels: ['bicycle', 'bike', 'cycle', 'mountain bike', 'road bike', 'cycling'],
  },
  {
    id: 'car', en: 'Car', sv: 'Bil', emoji: '🚗',
    category: 'transport', difficulty: 1, xpValue: 10,
    imageLabels: ['car', 'automobile', 'vehicle', 'sedan', 'suv', 'motor vehicle', 'transport'],
  },
  {
    id: 'bus', en: 'Bus', sv: 'Buss', emoji: '🚌',
    category: 'transport', difficulty: 1, xpValue: 10,
    imageLabels: ['bus', 'school bus', 'public transport', 'double decker', 'minibus'],
  },
  {
    id: 'umbrella', en: 'Umbrella', sv: 'Paraply', emoji: '☂️',
    category: 'household', difficulty: 2, xpValue: 15,
    imageLabels: ['umbrella', 'parasol', 'rain umbrella', 'brolly'],
  },
  {
    id: 'hat', en: 'Hat', sv: 'Hatt', emoji: '🎩',
    category: 'clothing', difficulty: 1, xpValue: 10,
    imageLabels: ['hat', 'cap', 'baseball cap', 'beanie', 'fedora', 'helmet', 'headwear'],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function findWordByLabel(labels: string[]): VocabWord | null {
  const lowerLabels = labels.map((l) => l.toLowerCase());
  let bestMatch: { word: VocabWord; score: number } | null = null;

  for (const word of VOCABULARY) {
    let score = 0;
    for (const imageLabel of word.imageLabels) {
      for (const label of lowerLabels) {
        if (label.includes(imageLabel) || imageLabel.includes(label)) {
          score++;
        }
      }
    }
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { word, score };
    }
  }

  return bestMatch?.word ?? null;
}

export function getWordById(id: string): VocabWord | undefined {
  return VOCABULARY.find((w) => w.id === id);
}

export function getWordsByCategory(category: string): VocabWord[] {
  return VOCABULARY.filter((w) => w.category === category);
}

export const CATEGORIES = [
  { id: 'animals', labelEn: 'Animals', labelSv: 'Djur', emoji: '🐾', color: '#FF9F7F' },
  { id: 'food', labelEn: 'Food', labelSv: 'Mat', emoji: '🍎', color: '#7ED957' },
  { id: 'nature', labelEn: 'Nature', labelSv: 'Natur', emoji: '🌿', color: '#48CAE4' },
  { id: 'household', labelEn: 'Home', labelSv: 'Hem', emoji: '🏠', color: '#9B5DE5' },
  { id: 'transport', labelEn: 'Transport', labelSv: 'Transport', emoji: '🚗', color: '#F77F00' },
  { id: 'clothing', labelEn: 'Clothes', labelSv: 'Kläder', emoji: '👗', color: '#E63946' },
] as const;

export const XP_PER_LEVEL = 100;

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpProgressInLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}
