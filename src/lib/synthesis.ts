import {
  Dignity,
  HOUSES,
  PLANETS,
  PlanetId,
  RASHIS,
  RashiId,
  dignityOf,
} from "@/data/learning";

export interface Synthesis {
  headline: string;
  dignity: Dignity;
  dignityNote: string;
  houseLine: string;
  rashiLine: string;
  paragraph: string;
  flavor: "very-positive" | "positive" | "neutral" | "challenging" | "very-challenging";
}

const DIGNITY_NOTES: Record<Dignity, string> = {
  exalted:
    "is exalted here — its highest expression, where it acts with confidence and purity",
  moolatrikona:
    "is in moolatrikona — strong, dignified, and acting from its natural seat",
  own:
    "is in its own sign — comfortable, undistracted, and free to be itself",
  friend:
    "is in a friend's sign — supported and well-disposed",
  neutral:
    "is in a neutral sign — neither helped nor hindered, expression depends on aspects",
  enemy:
    "is in an enemy's sign — uncomfortable, must work harder to express its nature",
  debilitated:
    "is debilitated here — at its weakest, expressing in distorted or muted form",
};

const DIGNITY_FLAVOR: Record<Dignity, Synthesis["flavor"]> = {
  exalted: "very-positive",
  moolatrikona: "positive",
  own: "positive",
  friend: "positive",
  neutral: "neutral",
  enemy: "challenging",
  debilitated: "very-challenging",
};

const HOUSE_VERB: Record<number, string> = {
  1: "shapes the body, identity, and the way you walk into a room",
  2: "colors wealth, family, food, and what you say",
  3: "drives courage, siblings, hands-on skill, and self-effort",
  4: "settles into home, mother, comforts, and inner peace",
  5: "expresses through children, creativity, romance, and intelligence",
  6: "plays out through enemies, debt, disease, and daily service",
  7: "manifests through marriage, partners, and the public",
  8: "moves through transformation, the occult, and sudden change",
  9: "operates through dharma, father, guru, and fortune",
  10: "shows up in career, status, and visible action in the world",
  11: "flows through gains, friends, network, and the fulfillment of desires",
  12: "dissolves into loss, foreign lands, solitude, and moksha",
};

const PLANET_INFLECTION: Record<PlanetId, string> = {
  sun: "the soul shines",
  moon: "the mind feels",
  mars: "energy fights",
  mercury: "the intellect speaks",
  jupiter: "wisdom expands",
  venus: "love beautifies",
  saturn: "discipline restricts and matures",
  rahu: "obsession amplifies",
  ketu: "detachment strips away",
};

const ELEMENT_HOUSE_FIT: Record<string, string> = {
  "fire-1": "the fire here burns bright and visible",
  "fire-5": "fire ignites creativity",
  "fire-9": "fire fuels dharma",
  "water-4": "water finds its natural seat in home and feeling",
  "water-8": "water deepens into the occult",
  "water-12": "water dissolves into the unseen",
  "earth-2": "earth settles into wealth and possessions",
  "earth-10": "earth builds career and reputation",
  "earth-6": "earth grinds through service and routine",
  "air-3": "air moves through communication and effort",
  "air-7": "air weighs partnerships",
  "air-11": "air networks through friends and gains",
};

function dusthanaCaveat(houseNum: number): string {
  if (houseNum === 6) return "but a 6th-house placement always carries struggle, debt, or service";
  if (houseNum === 8) return "but the 8th house brings sudden disruption and shadow themes";
  if (houseNum === 12) return "but the 12th-house placement brings loss, foreign exposure, or surrender";
  return "";
}

function trikonaBoost(houseNum: number, dignity: Dignity): string {
  const trikona = houseNum === 1 || houseNum === 5 || houseNum === 9;
  if (!trikona) return "";
  if (dignity === "exalted" || dignity === "moolatrikona" || dignity === "own") {
    return "Sitting in a trikona house compounds the blessing — this is auspicious and well-placed";
  }
  return "Even in trouble, the trikona house lends some grace";
}

function kendraBoost(houseNum: number): string {
  const kendra = houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10;
  if (!kendra) return "";
  return "A kendra position makes this placement structurally important — it shapes the visible architecture of life";
}

export function synthesize(
  planetId: PlanetId,
  rashiId: RashiId,
  houseNum: number
): Synthesis {
  const planet = PLANETS.find((p) => p.id === planetId)!;
  const rashi = RASHIS.find((r) => r.id === rashiId)!;
  const house = HOUSES.find((h) => h.num === houseNum)!;
  const dignity = dignityOf(planetId, rashiId);

  const headline = `${planet.english} in ${rashi.english} · House ${house.num} (${house.english})`;

  const dignityNote = `${planet.english} ${DIGNITY_NOTES[dignity]}.`;

  const houseLine = `In House ${house.num} (${house.sanskrit}), this ${HOUSE_VERB[houseNum]}.`;

  const rashiLine = `Through ${rashi.english} (${rashi.element}, ${rashi.modality}, ruled by ${rashi.ruler}), ${PLANET_INFLECTION[planetId]} in a ${rashi.element}-and-${rashi.modality} key.`;

  // Compose synthesis paragraph
  const fit = ELEMENT_HOUSE_FIT[`${rashi.element}-${houseNum}`];
  const trikona = trikonaBoost(houseNum, dignity);
  const kendra = kendraBoost(houseNum);
  const dusthana = dusthanaCaveat(houseNum);

  const opening =
    dignity === "exalted"
      ? `${planet.english} reaches its highest expression in ${rashi.english}, and from House ${houseNum} it ${HOUSE_VERB[houseNum]}.`
      : dignity === "debilitated"
        ? `${planet.english} struggles in ${rashi.english} — its natural force is muted or distorted, and from House ${houseNum} it ${HOUSE_VERB[houseNum]}.`
        : dignity === "own" || dignity === "moolatrikona"
          ? `${planet.english} sits in its own ground in ${rashi.english}, comfortable to act, and from House ${houseNum} it ${HOUSE_VERB[houseNum]}.`
          : `${planet.english} colors itself with ${rashi.english}'s ${rashi.element}-${rashi.modality} qualities, and from House ${houseNum} ${HOUSE_VERB[houseNum]}.`;

  const middle =
    dignity === "friend"
      ? `Because ${rashi.english} is ruled by a friend (${rashi.ruler}), the planet feels welcomed and supported.`
      : dignity === "enemy"
        ? `Because ${rashi.english}'s ruler (${rashi.ruler}) is unfriendly to ${planet.english}, the placement requires extra effort to express cleanly.`
        : "";

  const fitLine = fit ? `Note that ${fit}.` : "";

  const closingParts = [trikona, kendra, dusthana].filter(Boolean);
  const closing = closingParts.length ? closingParts.join(". ") + "." : "";

  const paragraph = [opening, middle, fitLine, closing].filter(Boolean).join(" ");

  return {
    headline,
    dignity,
    dignityNote,
    houseLine,
    rashiLine,
    paragraph,
    flavor: DIGNITY_FLAVOR[dignity],
  };
}
