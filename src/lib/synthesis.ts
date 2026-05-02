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
  oneLine: string;
  paragraph: string;
  strengths: string[];
  challenges: string[];
  flavor: "very-positive" | "positive" | "neutral" | "challenging" | "very-challenging";
}

const DIGNITY_NOTES: Record<Dignity, string> = {
  exalted:
    "is exalted here — its highest expression, where it acts with full force and clean intent",
  moolatrikona:
    "is in moolatrikona — strong, dignified, acting from its natural seat",
  own:
    "is in its own sign — comfortable, undistracted, free to be itself",
  friend:
    "is in a friend's sign — supported and well-disposed, even if not at peak",
  neutral:
    "is in a neutral sign — neither helped nor hindered; expression depends on aspects and conjunctions",
  enemy:
    "is in an enemy's sign — uncomfortable; must work harder to express its nature cleanly",
  debilitated:
    "is debilitated here — at its weakest, expressing in distorted, suppressed, or crooked form",
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

interface PlanetProfile {
  drive: string;
  bodyMark: string;
  strengths: string[];
  challenges: string[];
}

const PLANET_PROFILE: Record<PlanetId, PlanetProfile> = {
  sun: {
    drive: "to be central, respected, and visibly authoritative",
    bodyMark:
      "upright frame, strong forehead, warm complexion, presence that turns heads",
    strengths: [
      "Natural authority that doesn't have to argue for itself",
      "High vitality, courage, and willpower",
      "Clear sense of purpose and direction",
    ],
    challenges: [
      "Ego friction and authority struggles",
      "Identity tied to status — fragile when status slips",
      "Father / authority wounds repeated through life",
    ],
  },
  moon: {
    drive: "to feel safe, cared for, and emotionally seen",
    bodyMark:
      "round face, soft features, expressive eyes; physical state visibly mirrors mood",
    strengths: [
      "Emotional intelligence — reads rooms and people accurately",
      "Caretaking instinct that builds deep loyalty",
      "Strong memory and imaginative depth",
    ],
    challenges: [
      "Mood-driven decisions and emotional dependency",
      "Inner restlessness, fluctuating sense of safety",
      "Mother themes — over-attachment or absence",
    ],
  },
  mars: {
    drive: "to push through obstacles, fight, and prove physical capability",
    bodyMark: "athletic, lean and muscular, sharp features, often visible scars or marks",
    strengths: [
      "Physical strength and fearlessness",
      "Decisive action under pressure",
      "Protective instinct toward family and team",
    ],
    challenges: [
      "Quick anger and conflicts that escalate",
      "Impatience that costs opportunities",
      "Risk-taking that doesn't account for cost",
    ],
  },
  mercury: {
    drive: "to communicate, learn, network, and stay quick",
    bodyMark: "youthful look, quick movement, sharp eyes, light frame",
    strengths: [
      "Quick learning and articulate communication",
      "Versatility — slips between roles, topics, and registers",
      "Commercial intelligence and skill in trade",
    ],
    challenges: [
      "Scattered focus, indecision from too many options",
      "Talk that runs ahead of substance",
      "Anxiety and nervous-system strain",
    ],
  },
  jupiter: {
    drive: "to teach, expand, find meaning, and bestow",
    bodyMark: "fuller build, cheerful face, presence that reassures on contact",
    strengths: [
      "Wisdom that draws students and followers without effort",
      "Genuine luck in education, children, and counsel",
      "Optimism that survives setback",
    ],
    challenges: [
      "Over-reach — taking on more than you can carry",
      "Beliefs that calcify into dogma",
      "Weight gain, liver and metabolism issues",
    ],
  },
  venus: {
    drive: "to love, beautify, harmonize, and enjoy",
    bodyMark: "graceful proportions, attractive features, easy aesthetic taste",
    strengths: [
      "Magnetic charm and refined taste",
      "Easy, harmonious relationships",
      "Creative gifts and a feel for beauty",
    ],
    challenges: [
      "Indulgence in comfort and pleasure as escape",
      "Relationship dramas, settling for harmony over truth",
      "Reproductive and kidney-related concerns",
    ],
  },
  saturn: {
    drive: "to discipline, endure, structure, and earn through time",
    bodyMark: "lean, serious face, tall or unusually structured frame; ages slowly",
    strengths: [
      "Discipline and endurance beyond peers",
      "Quiet authority earned over decades, not granted",
      "Honesty about limits — and how to work within them",
    ],
    challenges: [
      "Delays, restrictions, and depressive episodes",
      "Loneliness and pessimism that becomes self-fulfilling",
      "Joints, bones, and chronic conditions",
    ],
  },
  rahu: {
    drive: "to obsess, amplify desire, and chase the foreign or forbidden",
    bodyMark: "unusual or striking features, often foreign-looking, magnetic but slightly disquieting",
    strengths: [
      "Drive to push beyond conventional limits",
      "Foreign opportunities and unusual paths to wealth",
      "Magnetism in fields others find taboo",
    ],
    challenges: [
      "Obsessions that consume — addictions, manias, debts",
      "Confusion of foreign for better; chasing illusions",
      "Anxiety, identity crises, restless dissatisfaction",
    ],
  },
  ketu: {
    drive: "to detach, dissolve, and retreat into past-life mastery",
    bodyMark: "distinctive scars or marks, withdrawn presence, eyes that look past you",
    strengths: [
      "Mastery of subjects without obvious training (past-life recall)",
      "Detachment that frees from petty conflicts",
      "Mystical or research orientation",
    ],
    challenges: [
      "Sense of meaninglessness, withdrawal from ordinary life",
      "Vague health issues without clear cause",
      "Existential crises and sudden losses",
    ],
  },
};

interface HouseFocus {
  area: string;
  channel: string;
  strongPlanet: string;
  weakPlanet: string;
}

const HOUSE_FOCUS: Record<number, HouseFocus> = {
  1: {
    area: "the body, identity, and first impression",
    channel: "becomes the personality itself, not a layer of it",
    strongPlanet:
      "Strong vitality, recognizable presence, an identity that opens doors",
    weakPlanet:
      "Health complaints, low self-image, an identity that strangers misread",
  },
  2: {
    area: "wealth, family, food, and speech",
    channel: "shapes how money flows in, how family treats you, and how words come out",
    strongPlanet:
      "Steady accumulation of wealth, supportive family, eloquent and persuasive speech",
    weakPlanet:
      "Erratic finances, family friction, and speech that lands wrong",
  },
  3: {
    area: "courage, siblings, hands-on skill, and short journeys",
    channel: "drives the courage and effort behind self-made gain",
    strongPlanet:
      "Self-effort that pays off, supportive siblings, hands-on competence",
    weakPlanet:
      "Sibling friction, courage that fails when needed, persistent small obstacles",
  },
  4: {
    area: "home, mother, vehicles, comfort, and inner peace",
    channel: "settles into home, mother, and the things that nourish you",
    strongPlanet:
      "Stable home, nurturing mother, emotional groundedness, real estate gains",
    weakPlanet:
      "Unstable home life, mother themes, restlessness in domestic settings",
  },
  5: {
    area: "creativity, children, intelligence, romance, and merit (purva-punya)",
    channel: "expresses through creative output and the children of body or mind",
    strongPlanet:
      "Easy rapport with children, creative gifts, intelligence and genuine luck",
    weakPlanet:
      "Difficulties with children or conception, blocked creativity, gambling losses",
  },
  6: {
    area: "enemies, debt, disease, daily service, and the obstacles you fight",
    channel: "fights through conflict and grinds through the routine of daily service",
    strongPlanet:
      "Defeats enemies and disease, loyal subordinates, daily discipline that pays off",
    weakPlanet:
      "Chronic conflict, debt or disease, exhaustion from service work",
  },
  7: {
    area: "marriage, partnership, business, and the public mirror",
    channel: "shows up most clearly in the partner you attract and the public's read of you",
    strongPlanet:
      "Marriage of true partnership, public recognition, fair business dealings",
    weakPlanet:
      "Marriage strain, public conflicts, partners who undermine or destabilize",
  },
  8: {
    area: "transformation, the occult, longevity, sudden change, and inheritance",
    channel: "moves through hidden, sudden, and transformative themes",
    strongPlanet:
      "Inheritances, occult or research ability, longevity, capacity for deep change",
    weakPlanet:
      "Sudden losses, accidents, secrets that surface painfully",
  },
  9: {
    area: "dharma, father, guru, fortune, and long-distance travel",
    channel: "operates through teachers, beliefs, and what feels right at a deep level",
    strongPlanet:
      "Genuine luck, wise teachers, dharmic clarity, blessed travels",
    weakPlanet:
      "Crisis of faith, distant or troubled father, journeys go wrong",
  },
  10: {
    area: "career, public reputation, and visible action in the world",
    channel: "stamps itself onto career and what you become known for",
    strongPlanet:
      "Career success, public visibility, authority that's genuinely earned",
    weakPlanet:
      "Career stalls, reputation damage, authority that doesn't stick",
  },
  11: {
    area: "gains, friends, network, and the fulfillment of desires",
    channel: "flows in through friends, networks, and accumulated income",
    strongPlanet:
      "Steady gains, supportive friends, dreams that actually come true",
    weakPlanet:
      "Disappointing gains, fair-weather friends, ambitions that get deferred",
  },
  12: {
    area: "loss, foreign lands, monasteries, the bedroom, and what you release",
    channel: "dissolves into solitude, foreign work, or spiritual practice",
    strongPlanet:
      "Spiritual depth, productive solitude, gainful foreign work",
    weakPlanet:
      "Hidden enemies, expenditures that don't return, isolation that hurts",
  },
};

const isStrong = (d: Dignity) =>
  d === "exalted" || d === "moolatrikona" || d === "own" || d === "friend";
const isWeak = (d: Dignity) => d === "enemy" || d === "debilitated";

function composeOneLine(
  planetEnglish: string,
  rashiEnglish: string,
  houseNum: number,
  dignity: Dignity,
  focus: HouseFocus
): string {
  const dignityFrag: Record<Dignity, string> = {
    exalted: `${planetEnglish} is at peak strength in ${rashiEnglish} (exalted)`,
    moolatrikona: `${planetEnglish} is in moolatrikona in ${rashiEnglish} — strong and dignified`,
    own: `${planetEnglish} sits in its own sign in ${rashiEnglish} — comfortable and undistracted`,
    friend: `${planetEnglish} is welcomed by ${rashiEnglish} as a friend's sign`,
    neutral: `${planetEnglish} is in neutral ${rashiEnglish}`,
    enemy: `${planetEnglish} is uncomfortable in ${rashiEnglish} (enemy's sign)`,
    debilitated: `${planetEnglish} is at its weakest in ${rashiEnglish} (debilitated)`,
  };
  return `${dignityFrag[dignity]}. From House ${houseNum} it ${focus.channel} — ${focus.area}.`;
}

function composeOpening(
  planetEnglish: string,
  rashiEnglish: string,
  rulerName: string,
  dignity: Dignity,
  profile: PlanetProfile
): string {
  switch (dignity) {
    case "exalted":
      return `${planetEnglish} blazes at full strength in ${rashiEnglish} — exalted, undiluted. The drive ${profile.drive} comes through cleanly.`;
    case "moolatrikona":
      return `${planetEnglish} is in moolatrikona in ${rashiEnglish} — its natural seat of strength. The drive ${profile.drive} is dignified and well-grounded.`;
    case "own":
      return `${planetEnglish} sits in its own sign in ${rashiEnglish} — comfortable, free to act on its drive ${profile.drive} without negotiation.`;
    case "friend":
      return `${planetEnglish} is in ${rashiEnglish}, ruled by friendly ${rulerName}. The drive ${profile.drive} flows without resistance, well-disposed if not at peak.`;
    case "enemy":
      return `${planetEnglish} sits uneasily in ${rashiEnglish}, whose ruler ${rulerName} is unfriendly. The drive ${profile.drive} runs into friction and must work harder to express cleanly.`;
    case "debilitated":
      return `${planetEnglish} struggles in ${rashiEnglish} — debilitated, with its drive ${profile.drive} distorted, suppressed, or expressed crookedly.`;
    default:
      return `${planetEnglish} is in neutral ${rashiEnglish}, ruled by ${rulerName}. The drive ${profile.drive} is neither helped nor hindered — expression depends on context.`;
  }
}

function composeHouseBlend(
  planetEnglish: string,
  houseNum: number,
  profile: PlanetProfile,
  focus: HouseFocus
): string {
  if (houseNum === 1) {
    return `Anchored to House 1, that force ${focus.channel} — physically: ${profile.bodyMark}.`;
  }
  return `From House ${houseNum} (${focus.area.split(",")[0]}), the planet ${focus.channel}.`;
}

function composeVerdict(
  dignity: Dignity,
  houseNum: number,
  focus: HouseFocus
): string {
  const trikona = houseNum === 1 || houseNum === 5 || houseNum === 9;
  const kendra = houseNum === 1 || houseNum === 4 || houseNum === 7 || houseNum === 10;
  const dusthana = houseNum === 6 || houseNum === 8 || houseNum === 12;

  const parts: string[] = [];
  if (isStrong(dignity)) {
    if (trikona && kendra)
      parts.push(
        "Trikona-and-kendra placement amplifies the favor — this is structurally important and auspicious."
      );
    else if (trikona)
      parts.push("Trikona placement adds genuine luck — things tend to go right here without obvious reason.");
    else if (kendra)
      parts.push("Kendra placement makes this structurally important — it shapes the visible architecture of life.");
    else if (dusthana)
      parts.push(`Dignity protects against the dusthana, but the house theme still bites — expect: ${focus.weakPlanet.toLowerCase()}, even if outcomes ultimately favor you.`);
  } else if (isWeak(dignity)) {
    if (dusthana)
      parts.push(`Compounded by the dusthana — expect: ${focus.weakPlanet.toLowerCase()}.`);
    else if (kendra)
      parts.push("Kendra placement amplifies the difficulty across visible life areas.");
    else if (trikona)
      parts.push("Trikona placement softens the difficulty — but doesn't erase it.");
  }
  return parts.join(" ");
}

function selectStrengths(
  dignity: Dignity,
  profile: PlanetProfile,
  focus: HouseFocus
): string[] {
  if (isStrong(dignity)) {
    return [...profile.strengths, focus.strongPlanet];
  }
  if (isWeak(dignity)) {
    return [`Even afflicted, this placement can still offer: ${focus.strongPlanet.toLowerCase()}`];
  }
  return [profile.strengths[0], focus.strongPlanet];
}

function selectChallenges(
  dignity: Dignity,
  profile: PlanetProfile,
  focus: HouseFocus
): string[] {
  if (isWeak(dignity)) {
    return [...profile.challenges, focus.weakPlanet];
  }
  if (isStrong(dignity)) {
    return [`Watch for the planet's shadow even when dignified: ${profile.challenges[0].toLowerCase()}`];
  }
  return [profile.challenges[0], focus.weakPlanet];
}

export function synthesize(
  planetId: PlanetId,
  rashiId: RashiId,
  houseNum: number
): Synthesis {
  const planet = PLANETS.find((p) => p.id === planetId)!;
  const rashi = RASHIS.find((r) => r.id === rashiId)!;
  const house = HOUSES.find((h) => h.num === houseNum)!;
  const ruler = PLANETS.find((p) => p.id === rashi.ruler)!;
  const dignity = dignityOf(planetId, rashiId);
  const profile = PLANET_PROFILE[planetId];
  const focus = HOUSE_FOCUS[houseNum];

  const headline = `${planet.english} in ${rashi.english} · House ${house.num} (${house.english})`;
  const dignityNote = `${planet.english} ${DIGNITY_NOTES[dignity]}.`;
  const oneLine = composeOneLine(planet.english, rashi.english, house.num, dignity, focus);

  const opening = composeOpening(planet.english, rashi.english, ruler.english, dignity, profile);
  const houseBlend = composeHouseBlend(planet.english, house.num, profile, focus);
  const verdict = composeVerdict(dignity, house.num, focus);
  const paragraph = [opening, houseBlend, verdict].filter(Boolean).join(" ");

  return {
    headline,
    dignity,
    dignityNote,
    oneLine,
    paragraph,
    strengths: selectStrengths(dignity, profile, focus),
    challenges: selectChallenges(dignity, profile, focus),
    flavor: DIGNITY_FLAVOR[dignity],
  };
}
