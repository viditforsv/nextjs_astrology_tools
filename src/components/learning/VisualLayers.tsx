"use client";

import {
  Dignity,
  HOUSES,
  PLANETS,
  PLANET_COLORS,
  PlanetId,
  RASHIS,
  RashiId,
  dignityOf,
} from "@/data/learning";

const RASHI_EMOJI: Record<RashiId, string> = {
  mesha: "🐏",
  vrishabha: "🐂",
  mithuna: "👥",
  karka: "🦀",
  simha: "🦁",
  kanya: "👧",
  tula: "⚖️",
  vrischika: "🦂",
  dhanu: "🏹",
  makara: "🐐",
  kumbha: "🪣",
  meena: "🐟",
};

const ELEMENT_COLORS: Record<string, { ring: string; tint: string }> = {
  fire: { ring: "#E8763B", tint: "#FFE0C7" },
  earth: { ring: "#7A6240", tint: "#EAE0CC" },
  air: { ring: "#7BAFCB", tint: "#DCEDF7" },
  water: { ring: "#4979A8", tint: "#D2E2F2" },
};

const HOUSE_CATEGORY: Record<string, { stroke: string; label: string }> = {
  kendra: { stroke: "#2C5F8D", label: "Kendra" },
  trikona: { stroke: "#9F7A2C", label: "Trikona" },
  dusthana: { stroke: "#8C3A2A", label: "Dusthana" },
  upachaya: { stroke: "#356B4D", label: "Upachaya" },
  neutral: { stroke: "#5C5C5C", label: "Neutral" },
};

interface DignityViz {
  glow: string;
  glowOuter: string;
  intensity: number;
  label: string;
  rays?: boolean;
}

const DIGNITY_VIZ: Record<Dignity, DignityViz> = {
  exalted: { glow: "#FFD24A", glowOuter: "#FF8A00", intensity: 1.0, label: "exalted ✦", rays: true },
  moolatrikona: { glow: "#FFC04A", glowOuter: "#E08A1A", intensity: 0.8, label: "moolatrikona ✦" },
  own: { glow: "#7BD3A0", glowOuter: "#3A8C5E", intensity: 0.7, label: "own sign" },
  friend: { glow: "#7AB8E8", glowOuter: "#3A6B96", intensity: 0.55, label: "friend's sign" },
  neutral: { glow: "#BBBBBB", glowOuter: "#777777", intensity: 0.3, label: "neutral" },
  enemy: { glow: "#E89B6E", glowOuter: "#A04C24", intensity: 0.4, label: "enemy's sign" },
  debilitated: { glow: "#5C4040", glowOuter: "#2A1818", intensity: 0.55, label: "debilitated ▾" },
};

interface Props {
  planetId: PlanetId;
  rashiId: RashiId;
  houseNum: number;
  size?: number;
}

export default function VisualLayers({
  planetId,
  rashiId,
  houseNum,
  size = 240,
}: Props) {
  const planet = PLANETS.find((p) => p.id === planetId)!;
  const rashi = RASHIS.find((r) => r.id === rashiId)!;
  const house = HOUSES.find((h) => h.num === houseNum)!;
  const dignity = dignityOf(planetId, rashiId);
  const ruler = PLANETS.find((p) => p.id === rashi.ruler)!;

  const cx = size / 2;
  const cy = size / 2;
  const houseR = size * 0.47;
  const rashiR = size * 0.34;
  const planetR = size * 0.16;

  const houseStyle = HOUSE_CATEGORY[house.category];
  const elementColors = ELEMENT_COLORS[rashi.element];
  const planetColors = PLANET_COLORS[planetId];
  const viz = DIGNITY_VIZ[dignity];

  const modalityDash =
    rashi.modality === "cardinal"
      ? "8,4"
      : rashi.modality === "mutable"
        ? "2,3"
        : "";

  const uid = `${planetId}-${rashiId}-${houseNum}`;

  // For exalted/moolatrikona: render solar rays from center
  const rays = viz.rays
    ? Array.from({ length: 12 }).map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const r1 = planetR + 4;
        const r2 = rashiR - 4;
        return (
          <line
            key={i}
            x1={cx + r1 * Math.cos(a)}
            y1={cy + r1 * Math.sin(a)}
            x2={cx + r2 * Math.cos(a)}
            y2={cy + r2 * Math.sin(a)}
            stroke={viz.glow}
            strokeWidth="1.2"
            opacity="0.55"
          />
        );
      })
    : null;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Strong dignity halo — radiates from planet outward */}
          <radialGradient id={`halo-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={viz.glow} stopOpacity={viz.intensity} />
            <stop offset="35%" stopColor={viz.glow} stopOpacity={viz.intensity * 0.65} />
            <stop offset="70%" stopColor={viz.glowOuter} stopOpacity={viz.intensity * 0.25} />
            <stop offset="100%" stopColor={viz.glowOuter} stopOpacity="0" />
          </radialGradient>
          {/* Dim wash for debilitated — desaturating overlay */}
          {dignity === "debilitated" && (
            <radialGradient id={`dim-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000" stopOpacity="0" />
              <stop offset="55%" stopColor="#000" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.32" />
            </radialGradient>
          )}
        </defs>

        {/* ── Layer 0: dignity halo as the base, dominates the composition ── */}
        <circle cx={cx} cy={cy} r={houseR + 6} fill={`url(#halo-${uid})`} />

        {/* ── Layer 1: HOUSE — thin frame only, label outside-top, category outside-bottom ── */}
        <circle
          cx={cx}
          cy={cy}
          r={houseR}
          fill="none"
          stroke={houseStyle.stroke}
          strokeWidth="1.5"
          opacity="0.7"
        />
        <text
          x={cx}
          y={cy - houseR - 6}
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={houseStyle.stroke}
        >
          H{house.num} · {house.english}
        </text>
        <text
          x={cx}
          y={cy + houseR + 14}
          textAnchor="middle"
          fontSize="9"
          fill={houseStyle.stroke}
          opacity="0.85"
          fontWeight="600"
          style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {houseStyle.label}
        </text>

        {/* ── Layer 2: RASHI — translucent fill so halo bleeds through, modality stroke pattern ── */}
        <circle
          cx={cx}
          cy={cy}
          r={rashiR}
          fill={elementColors.tint}
          fillOpacity="0.55"
          stroke={elementColors.ring}
          strokeWidth="2.5"
          strokeDasharray={modalityDash}
        />

        {/* solar rays for exalted/moolatrikona, rendered between rashi ring and planet */}
        {rays}

        {/* rashi label — top arc */}
        <text
          x={cx}
          y={cy - rashiR + 14}
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill={elementColors.ring}
          style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
        >
          {rashi.english}
        </text>
        {/* rashi creature emoji — bottom of ring */}
        <text x={cx} y={cy + rashiR - 16} textAnchor="middle" fontSize="20">
          {RASHI_EMOJI[rashiId]}
        </text>
        {/* element · modality — under emoji */}
        <text
          x={cx}
          y={cy + rashiR - 4}
          textAnchor="middle"
          fontSize="8"
          fill={elementColors.ring}
          opacity="0.85"
          fontWeight="600"
          style={{ textTransform: "uppercase", letterSpacing: "0.07em" }}
        >
          {rashi.element} · {rashi.modality}
        </text>
        {/* rashi ruler — small chip on the rashi ring */}
        <g
          transform={`translate(${cx + rashiR - 4}, ${cy - rashiR * 0.55})`}
          aria-label={`Ruled by ${ruler.english}`}
        >
          <circle r="11" fill={PLANET_COLORS[rashi.ruler].bg} stroke={PLANET_COLORS[rashi.ruler].ring} strokeWidth="1.5" />
          <text textAnchor="middle" y="4" fontSize="11" fill={PLANET_COLORS[rashi.ruler].glyph} fontWeight="600">
            {ruler.symbol}
          </text>
        </g>

        {/* ── Layer 3: PLANET — central, in its own color ── */}
        <circle
          cx={cx}
          cy={cy}
          r={planetR}
          fill={planetColors.bg}
          stroke={planetColors.ring}
          strokeWidth="3"
        />
        <text
          x={cx}
          y={cy + 7}
          textAnchor="middle"
          fontSize="22"
          fontWeight="600"
          fill={planetColors.glyph}
        >
          {planet.symbol}
        </text>

        {/* dim wash on top for debilitated only */}
        {dignity === "debilitated" && (
          <circle cx={cx} cy={cy} r={houseR + 6} fill={`url(#dim-${uid})`} pointerEvents="none" />
        )}
      </svg>

      <div className="flex flex-col items-center gap-0.5 mt-1">
        <div className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
          {planet.english} → {rashi.english} → H{house.num}
        </div>
        <div
          className="text-[10px] font-medium"
          style={{ color: viz.glowOuter }}
        >
          {viz.label}
        </div>
        <div className="text-[9px] text-zinc-400 dark:text-zinc-500">
          ruled by {ruler.english} · {rashi.element} ·{" "}
          {rashi.modality === "cardinal"
            ? "long-dash = cardinal"
            : rashi.modality === "fixed"
              ? "solid = fixed"
              : "dotted = mutable"}
        </div>
      </div>
    </div>
  );
}
