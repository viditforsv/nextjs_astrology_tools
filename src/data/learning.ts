export type PlanetId =
  | "sun"
  | "moon"
  | "mars"
  | "mercury"
  | "jupiter"
  | "venus"
  | "saturn"
  | "rahu"
  | "ketu";

export type RashiId =
  | "mesha"
  | "vrishabha"
  | "mithuna"
  | "karka"
  | "simha"
  | "kanya"
  | "tula"
  | "vrischika"
  | "dhanu"
  | "makara"
  | "kumbha"
  | "meena";

export type Element = "fire" | "earth" | "air" | "water";
export type Modality = "cardinal" | "fixed" | "mutable";
export type Dignity =
  | "exalted"
  | "moolatrikona"
  | "own"
  | "friend"
  | "neutral"
  | "enemy"
  | "debilitated";

export interface House {
  num: number;
  sanskrit: string;
  english: string;
  category: "kendra" | "trikona" | "dusthana" | "upachaya" | "neutral";
  theme: string;
  description: string;
  keywords: string[];
}

export interface Rashi {
  id: RashiId;
  num: number;
  symbol: string;
  devanagari: string;
  sanskrit: string;
  english: string;
  element: Element;
  modality: Modality;
  ruler: PlanetId;
  description: string;
  keywords: string[];
}

export interface Planet {
  id: PlanetId;
  symbol: string;
  sanskrit: string;
  english: string;
  karaka: string;
  guna: "sattva" | "rajas" | "tamas";
  description: string;
  keywords: string[];
}

export const HOUSES: House[] = [
  {
    num: 1,
    sanskrit: "Lagna / Tanu",
    english: "Self",
    category: "kendra",
    theme: "the body, identity, and the self",
    description:
      "Self, identity, body, personality, first impressions. The house of beginnings, vitality, and how the world sees you.",
    keywords: ["Self", "Body", "Personality", "Beginnings", "Vitality"],
  },
  {
    num: 2,
    sanskrit: "Dhana",
    english: "Wealth",
    category: "neutral",
    theme: "accumulated wealth, family, and speech",
    description:
      "Wealth, family, food, speech, values. What you accumulate and what flows out of your mouth.",
    keywords: ["Wealth", "Family", "Speech", "Values", "Food"],
  },
  {
    num: 3,
    sanskrit: "Sahaja",
    english: "Courage",
    category: "upachaya",
    theme: "courage, effort, and siblings",
    description:
      "Courage, siblings, communication, short journeys, hands-on skills. The house of effort and self-made gain.",
    keywords: ["Courage", "Siblings", "Effort", "Communication", "Skills"],
  },
  {
    num: 4,
    sanskrit: "Sukha",
    english: "Home",
    category: "kendra",
    theme: "home, mother, and inner peace",
    description:
      "Home, mother, comforts, vehicles, emotional foundation. The seat of inner peace and what nourishes you.",
    keywords: ["Home", "Mother", "Comfort", "Roots", "Emotion"],
  },
  {
    num: 5,
    sanskrit: "Putra",
    english: "Creation",
    category: "trikona",
    theme: "creativity, intelligence, and children",
    description:
      "Children, creativity, intelligence, romance, mantra. Past-life merit (purva-punya) flowering as talent and play.",
    keywords: ["Creativity", "Children", "Intelligence", "Romance", "Mantra"],
  },
  {
    num: 6,
    sanskrit: "Ari / Ripu",
    english: "Conflict",
    category: "dusthana",
    theme: "enemies, debts, and disease",
    description:
      "Enemies, debts, disease, daily service, obstacles you must overcome. Where you fight and grow stronger.",
    keywords: ["Enemies", "Disease", "Debts", "Service", "Obstacles"],
  },
  {
    num: 7,
    sanskrit: "Yuvati / Kalatra",
    english: "Partnership",
    category: "kendra",
    theme: "partnership, marriage, and the other",
    description:
      "Partner, marriage, business deals, the public. The mirror — whatever you see in others lives here.",
    keywords: ["Partner", "Marriage", "Business", "Public", "Other"],
  },
  {
    num: 8,
    sanskrit: "Randhra / Ayur",
    english: "Transformation",
    category: "dusthana",
    theme: "death, transformation, and the occult",
    description:
      "Death, sudden change, occult, longevity, inheritances. Hidden wells of power and shadow.",
    keywords: ["Death", "Occult", "Sudden", "Longevity", "Mystery"],
  },
  {
    num: 9,
    sanskrit: "Dharma / Bhagya",
    english: "Dharma",
    category: "trikona",
    theme: "dharma, fortune, and the father",
    description:
      "Dharma, father, guru, long journeys, higher learning, fortune. The most auspicious house — your luck and faith.",
    keywords: ["Dharma", "Father", "Guru", "Fortune", "Faith"],
  },
  {
    num: 10,
    sanskrit: "Karma",
    english: "Career",
    category: "kendra",
    theme: "career, status, and visible action",
    description:
      "Career, public reputation, status, action in the world. The peak of the chart — what you are known for.",
    keywords: ["Career", "Status", "Action", "Reputation", "Authority"],
  },
  {
    num: 11,
    sanskrit: "Labha",
    english: "Gains",
    category: "upachaya",
    theme: "gains, friends, and aspiration",
    description:
      "Gains, income, elder siblings, friends, network, fulfillment of desires. What flows in from the world.",
    keywords: ["Gains", "Friends", "Network", "Income", "Desires"],
  },
  {
    num: 12,
    sanskrit: "Vyaya / Moksha",
    english: "Liberation",
    category: "dusthana",
    theme: "loss, liberation, and the unseen",
    description:
      "Loss, expenditure, foreign lands, the bedroom, monasteries, moksha. What you release — by choice or by force.",
    keywords: ["Loss", "Foreign", "Moksha", "Solitude", "Dreams"],
  },
];

export const RASHIS: Rashi[] = [
  {
    id: "mesha",
    num: 1,
    symbol: "♈",
    devanagari: "मेष",
    sanskrit: "Mesha",
    english: "Aries",
    element: "fire",
    modality: "cardinal",
    ruler: "mars",
    description:
      "Fire sign. Mars-ruled. Cardinal. Pioneer energy — impulse, courage, the spark that initiates.",
    keywords: ["Fire", "Pioneer", "Courage", "Mars-ruled", "Cardinal"],
  },
  {
    id: "vrishabha",
    num: 2,
    symbol: "♉",
    devanagari: "वृषभ",
    sanskrit: "Vrishabha",
    english: "Taurus",
    element: "earth",
    modality: "fixed",
    ruler: "venus",
    description:
      "Earth sign. Venus-ruled. Fixed. Stable, sensual, possessive of beauty, slow to change.",
    keywords: ["Earth", "Stable", "Sensual", "Venus-ruled", "Fixed"],
  },
  {
    id: "mithuna",
    num: 3,
    symbol: "♊",
    devanagari: "मिथुन",
    sanskrit: "Mithuna",
    english: "Gemini",
    element: "air",
    modality: "mutable",
    ruler: "mercury",
    description:
      "Air sign. Mercury-ruled. Mutable. Quick mind, dual nature, communication and curiosity.",
    keywords: ["Air", "Curious", "Dual", "Mercury-ruled", "Mutable"],
  },
  {
    id: "karka",
    num: 4,
    symbol: "♋",
    devanagari: "कर्क",
    sanskrit: "Karka",
    english: "Cancer",
    element: "water",
    modality: "cardinal",
    ruler: "moon",
    description:
      "Water sign. Moon-ruled. Cardinal. Nurturing, emotional, protective, deeply remembering.",
    keywords: ["Water", "Nurturing", "Emotional", "Moon-ruled", "Cardinal"],
  },
  {
    id: "simha",
    num: 5,
    symbol: "♌",
    devanagari: "सिंह",
    sanskrit: "Simha",
    english: "Leo",
    element: "fire",
    modality: "fixed",
    ruler: "sun",
    description:
      "Fire sign. Sun-ruled. Fixed. Royal, generous, dramatic, demands respect and gives it.",
    keywords: ["Fire", "Royal", "Generous", "Sun-ruled", "Fixed"],
  },
  {
    id: "kanya",
    num: 6,
    symbol: "♍",
    devanagari: "कन्या",
    sanskrit: "Kanya",
    english: "Virgo",
    element: "earth",
    modality: "mutable",
    ruler: "mercury",
    description:
      "Earth sign. Mercury-ruled. Mutable. Discriminating, analytical, service-oriented, perfecting.",
    keywords: ["Earth", "Analytical", "Service", "Mercury-ruled", "Mutable"],
  },
  {
    id: "tula",
    num: 7,
    symbol: "♎",
    devanagari: "तुला",
    sanskrit: "Tula",
    english: "Libra",
    element: "air",
    modality: "cardinal",
    ruler: "venus",
    description:
      "Air sign. Venus-ruled. Cardinal. Diplomatic, partnership-driven, weighing, fair-minded.",
    keywords: ["Air", "Diplomatic", "Balance", "Venus-ruled", "Cardinal"],
  },
  {
    id: "vrischika",
    num: 8,
    symbol: "♏",
    devanagari: "वृश्चिक",
    sanskrit: "Vrischika",
    english: "Scorpio",
    element: "water",
    modality: "fixed",
    ruler: "mars",
    description:
      "Water sign. Mars-ruled. Fixed. Intense, secretive, regenerative, comfortable with shadow.",
    keywords: ["Water", "Intense", "Occult", "Mars-ruled", "Fixed"],
  },
  {
    id: "dhanu",
    num: 9,
    symbol: "♐",
    devanagari: "धनु",
    sanskrit: "Dhanu",
    english: "Sagittarius",
    element: "fire",
    modality: "mutable",
    ruler: "jupiter",
    description:
      "Fire sign. Jupiter-ruled. Mutable. Philosophical, expansive, dharmic, the wise teacher.",
    keywords: ["Fire", "Wisdom", "Expansion", "Jupiter-ruled", "Mutable"],
  },
  {
    id: "makara",
    num: 10,
    symbol: "♑",
    devanagari: "मकर",
    sanskrit: "Makara",
    english: "Capricorn",
    element: "earth",
    modality: "cardinal",
    ruler: "saturn",
    description:
      "Earth sign. Saturn-ruled. Cardinal. Disciplined, ambitious, slow-and-steady, building structure.",
    keywords: ["Earth", "Discipline", "Ambition", "Saturn-ruled", "Cardinal"],
  },
  {
    id: "kumbha",
    num: 11,
    symbol: "♒",
    devanagari: "कुम्भ",
    sanskrit: "Kumbha",
    english: "Aquarius",
    element: "air",
    modality: "fixed",
    ruler: "saturn",
    description:
      "Air sign. Saturn-ruled. Fixed. Humanitarian, eccentric, networked, principled outsider.",
    keywords: ["Air", "Humanitarian", "Eccentric", "Saturn-ruled", "Fixed"],
  },
  {
    id: "meena",
    num: 12,
    symbol: "♓",
    devanagari: "मीन",
    sanskrit: "Meena",
    english: "Pisces",
    element: "water",
    modality: "mutable",
    ruler: "jupiter",
    description:
      "Water sign. Jupiter-ruled. Mutable. Compassionate, dreamy, mystical, dissolving boundaries.",
    keywords: ["Water", "Compassion", "Mystical", "Jupiter-ruled", "Mutable"],
  },
];

export const PLANETS: Planet[] = [
  {
    id: "sun",
    symbol: "☉",
    sanskrit: "Surya",
    english: "Sun",
    karaka: "Soul (atma), father, authority, government, vitality",
    guna: "sattva",
    description:
      "The soul. Father, king, authority, ego. Bright, fiery, royal — what you must shine as.",
    keywords: ["Soul", "Authority", "Father", "Ego", "Vitality"],
  },
  {
    id: "moon",
    symbol: "☽",
    sanskrit: "Chandra",
    english: "Moon",
    karaka: "Mind (manas), mother, emotions, the public",
    guna: "sattva",
    description:
      "The mind. Mother, emotions, memory, the public. Cool, receptive, ever-changing — your inner weather.",
    keywords: ["Mind", "Mother", "Emotion", "Memory", "Comfort"],
  },
  {
    id: "mars",
    symbol: "♂",
    sanskrit: "Mangala",
    english: "Mars",
    karaka: "Energy, courage, brothers, land, conflict",
    guna: "tamas",
    description:
      "The warrior. Energy, courage, anger, action. Hot, fiery, decisive — your drive and aggression.",
    keywords: ["Energy", "Courage", "Action", "Brothers", "Conflict"],
  },
  {
    id: "mercury",
    symbol: "☿",
    sanskrit: "Budha",
    english: "Mercury",
    karaka: "Intellect, speech, commerce, learning",
    guna: "rajas",
    description:
      "The prince. Intellect, communication, commerce, skill. Quick, clever, neutral — adapts to its company.",
    keywords: ["Intellect", "Speech", "Commerce", "Skill", "Youth"],
  },
  {
    id: "jupiter",
    symbol: "♃",
    sanskrit: "Guru",
    english: "Jupiter",
    karaka: "Wisdom, dharma, children, husband (for women), expansion",
    guna: "sattva",
    description:
      "The teacher. Wisdom, dharma, expansion, blessings. The greatest benefic — what grows under his gaze grows wisely.",
    keywords: ["Wisdom", "Dharma", "Expansion", "Children", "Faith"],
  },
  {
    id: "venus",
    symbol: "♀",
    sanskrit: "Shukra",
    english: "Venus",
    karaka: "Love, beauty, art, vehicles, wife (for men)",
    guna: "rajas",
    description:
      "The artist. Love, beauty, comfort, art, the feminine. Sweet benefic — pleasure, refinement, relationship.",
    keywords: ["Love", "Beauty", "Art", "Comfort", "Refinement"],
  },
  {
    id: "saturn",
    symbol: "♄",
    sanskrit: "Shani",
    english: "Saturn",
    karaka: "Discipline, sorrow, longevity, servants, karma",
    guna: "tamas",
    description:
      "The judge. Discipline, restriction, time, karma, old age. Slow, cold, fair — rewards patience, punishes shortcut.",
    keywords: ["Discipline", "Karma", "Time", "Sorrow", "Endurance"],
  },
  {
    id: "rahu",
    symbol: "☊",
    sanskrit: "Rahu",
    english: "North Node",
    karaka: "Obsession, ambition, foreign things, illusion",
    guna: "tamas",
    description:
      "The shadow. Obsession, ambition, foreign things, taboo, hunger. Amplifies whatever it touches into desire.",
    keywords: ["Obsession", "Foreign", "Ambition", "Taboo", "Illusion"],
  },
  {
    id: "ketu",
    symbol: "☋",
    sanskrit: "Ketu",
    english: "South Node",
    karaka: "Detachment, moksha, past lives, occult, isolation",
    guna: "tamas",
    description:
      "The headless. Detachment, moksha, past-life mastery, isolation, mysticism. Strips away what it touches.",
    keywords: ["Detachment", "Moksha", "Past lives", "Occult", "Isolation"],
  },
];

interface DignityRules {
  exalted: RashiId;
  debilitated: RashiId;
  own: RashiId[];
  moolatrikona: RashiId;
  friends: PlanetId[];
  enemies: PlanetId[];
  neutral: PlanetId[];
}

export const DIGNITY: Record<PlanetId, DignityRules> = {
  sun: {
    exalted: "mesha",
    debilitated: "tula",
    own: ["simha"],
    moolatrikona: "simha",
    friends: ["moon", "mars", "jupiter"],
    enemies: ["venus", "saturn"],
    neutral: ["mercury"],
  },
  moon: {
    exalted: "vrishabha",
    debilitated: "vrischika",
    own: ["karka"],
    moolatrikona: "vrishabha",
    friends: ["sun", "mercury"],
    enemies: [],
    neutral: ["mars", "jupiter", "venus", "saturn"],
  },
  mars: {
    exalted: "makara",
    debilitated: "karka",
    own: ["mesha", "vrischika"],
    moolatrikona: "mesha",
    friends: ["sun", "moon", "jupiter"],
    enemies: ["mercury"],
    neutral: ["venus", "saturn"],
  },
  mercury: {
    exalted: "kanya",
    debilitated: "meena",
    own: ["mithuna", "kanya"],
    moolatrikona: "kanya",
    friends: ["sun", "venus"],
    enemies: ["moon"],
    neutral: ["mars", "jupiter", "saturn"],
  },
  jupiter: {
    exalted: "karka",
    debilitated: "makara",
    own: ["dhanu", "meena"],
    moolatrikona: "dhanu",
    friends: ["sun", "moon", "mars"],
    enemies: ["mercury", "venus"],
    neutral: ["saturn"],
  },
  venus: {
    exalted: "meena",
    debilitated: "kanya",
    own: ["vrishabha", "tula"],
    moolatrikona: "tula",
    friends: ["mercury", "saturn"],
    enemies: ["sun", "moon"],
    neutral: ["mars", "jupiter"],
  },
  saturn: {
    exalted: "tula",
    debilitated: "mesha",
    own: ["makara", "kumbha"],
    moolatrikona: "kumbha",
    friends: ["mercury", "venus"],
    enemies: ["sun", "moon", "mars"],
    neutral: ["jupiter"],
  },
  rahu: {
    exalted: "vrishabha",
    debilitated: "vrischika",
    own: ["kumbha"],
    moolatrikona: "kumbha",
    friends: ["venus", "saturn", "mercury"],
    enemies: ["sun", "moon", "mars"],
    neutral: ["jupiter"],
  },
  ketu: {
    exalted: "vrischika",
    debilitated: "vrishabha",
    own: ["dhanu"],
    moolatrikona: "dhanu",
    friends: ["mars", "venus", "saturn"],
    enemies: ["sun", "moon"],
    neutral: ["jupiter", "mercury"],
  },
};

export function dignityOf(planet: PlanetId, rashi: RashiId): Dignity {
  const rules = DIGNITY[planet];
  if (rules.exalted === rashi) return "exalted";
  if (rules.debilitated === rashi) return "debilitated";
  if (rules.moolatrikona === rashi) return "moolatrikona";
  if (rules.own.includes(rashi)) return "own";
  const ruler = RASHIS.find((r) => r.id === rashi)!.ruler;
  if (ruler === planet) return "own";
  if (rules.friends.includes(ruler)) return "friend";
  if (rules.enemies.includes(ruler)) return "enemy";
  return "neutral";
}

export const PLANET_COLORS: Record<PlanetId, { bg: string; ring: string; glyph: string }> = {
  sun: { bg: "#F0A020", ring: "#7A4500", glyph: "#FFFDF0" },
  moon: { bg: "#D8DCE3", ring: "#6E7588", glyph: "#1B1F2A" },
  mars: { bg: "#D34A30", ring: "#5A1810", glyph: "#FFEAE6" },
  mercury: { bg: "#3DA17E", ring: "#0D4836", glyph: "#E7FFF6" },
  jupiter: { bg: "#E5A93C", ring: "#5C3F0C", glyph: "#FFF6D9" },
  venus: { bg: "#E294C2", ring: "#65244A", glyph: "#FFEAF5" },
  saturn: { bg: "#3F4A66", ring: "#15192A", glyph: "#D6DDF0" },
  rahu: { bg: "#4A2C5C", ring: "#1C0F2A", glyph: "#E0CFEC" },
  ketu: { bg: "#7A6750", ring: "#2E2415", glyph: "#F0E2C8" },
};
