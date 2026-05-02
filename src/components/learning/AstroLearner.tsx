"use client";

import { useMemo, useState } from "react";
import VedicChart from "@components/VedicChart";
import {
  HOUSES,
  PLANETS,
  PlanetId,
  RASHIS,
  RashiId,
} from "@/data/learning";
import { synthesize } from "@/lib/synthesis";
import { Button } from "@/components/ui/button";
import VisualLayers from "@/components/learning/VisualLayers";

const DIGNITY_BADGE: Record<string, string> = {
  exalted: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  moolatrikona: "bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200",
  own: "bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200",
  friend: "bg-blue-50 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  enemy: "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  debilitated: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
};

const PLANET_NAME_TO_ID: Record<string, PlanetId> = {
  Sun: "sun",
  Moon: "moon",
  Mars: "mars",
  Mercury: "mercury",
  Jupiter: "jupiter",
  Venus: "venus",
  Saturn: "saturn",
  Rahu: "rahu",
  Ketu: "ketu",
};

const PLANET_ID_TO_NAME: Record<PlanetId, string> = {
  sun: "Sun",
  moon: "Moon",
  mars: "Mars",
  mercury: "Mercury",
  jupiter: "Jupiter",
  venus: "Venus",
  saturn: "Saturn",
  rahu: "Rahu",
  ketu: "Ketu",
};

interface Placement {
  planetId: PlanetId;
  house: number;
}

export default function AstroLearner() {
  // Lagna = which rashi sits in House 1
  const [lagnaIdx, setLagnaIdx] = useState<number>(0); // mesha
  const [placements, setPlacements] = useState<Placement[]>([
    { planetId: "sun", house: 1 },
  ]);
  const [armedPlanet, setArmedPlanet] = useState<PlanetId | null>(null);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [quizMode, setQuizMode] = useState(false);
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  // House → Rashi from Lagna (House N = lagnaIdx + N − 1 mod 12)
  const houseToRashi = (house: number): RashiId =>
    RASHIS[(lagnaIdx + house - 1) % 12].id;

  const houseRashisMap = useMemo(() => {
    const m: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) m[h] = ((lagnaIdx + h - 1) % 12) + 1;
    return m;
  }, [lagnaIdx]);

  const chartPlanets = useMemo(
    () =>
      placements.map((p) => ({
        name: PLANET_ID_TO_NAME[p.planetId],
        house: p.house,
      })),
    [placements]
  );

  function placeOrMove(planetId: PlanetId, house: number) {
    setPlacements((prev) => {
      const without = prev.filter((p) => p.planetId !== planetId);
      const next = [...without, { planetId, house }];
      setExpandedIdx(next.length - 1);
      return next;
    });
    setArmedPlanet(null);
    setRevealedSet(new Set());
  }

  function removePlacement(planetId: PlanetId) {
    setPlacements((prev) => prev.filter((p) => p.planetId !== planetId));
  }

  function clearAll() {
    setPlacements([]);
    setArmedPlanet(null);
    setExpandedIdx(null);
  }

  function randomCombo() {
    const planetId = PLANETS[Math.floor(Math.random() * PLANETS.length)].id;
    const house = Math.floor(Math.random() * 12) + 1;
    const newLagna = Math.floor(Math.random() * 12);
    setLagnaIdx(newLagna);
    setPlacements([{ planetId, house }]);
    setExpandedIdx(0);
    setRevealedSet(new Set());
  }

  function handlePlanetDrop(planetName: string, house: number) {
    const id = PLANET_NAME_TO_ID[planetName];
    if (!id) return;
    placeOrMove(id, house);
  }

  function handleHouseClick(house: number) {
    if (armedPlanet) {
      placeOrMove(armedPlanet, house);
    }
  }

  return (
    <div className="w-full max-w-6xl space-y-5">
      {/* Top toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label htmlFor="lagna" className="text-sm text-zinc-600 dark:text-zinc-400">
            Lagna
          </label>
          <select
            id="lagna"
            value={lagnaIdx}
            onChange={(e) => setLagnaIdx(parseInt(e.target.value))}
            className="text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1"
          >
            {RASHIS.map((r, i) => (
              <option key={r.id} value={i}>
                {r.sanskrit} ({r.english}) {r.devanagari}
              </option>
            ))}
          </select>
        </div>

        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="outline" onClick={randomCombo}>
            Random combo
          </Button>
          <Button
            size="sm"
            variant={quizMode ? "default" : "outline"}
            onClick={() => {
              setQuizMode((q) => !q);
              setRevealedSet(new Set());
            }}
          >
            {quizMode ? "Quiz: on" : "Quiz mode"}
          </Button>
          <Button size="sm" variant="outline" onClick={clearAll}>
            Clear chart
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[500px_1fr] gap-6 items-start">
        {/* Left: chart + palette */}
        <div className="space-y-4">
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4">
            <VedicChart
              planets={chartPlanets}
              houseRashis={houseRashisMap}
              size={460}
              onHouseClick={handleHouseClick}
              onPlanetDrop={handlePlanetDrop}
              highlightedHouse={
                expandedIdx !== null && placements[expandedIdx]
                  ? placements[expandedIdx].house
                  : undefined
              }
            />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center mt-2">
              House numbers on chart show the rashi number in each house
            </p>
          </div>

          {/* Planet palette */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3">
            <div className="text-[11px] uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-400 mb-2">
              {armedPlanet
                ? `Tap a house to place ${PLANET_ID_TO_NAME[armedPlanet]} (or drag)`
                : "Tap a planet, then tap a house — or drag onto a house"}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PLANETS.map((p) => {
                const isPlaced = placements.some((pl) => pl.planetId === p.id);
                const isArmed = armedPlanet === p.id;
                return (
                  <button
                    key={p.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("planet", PLANET_ID_TO_NAME[p.id]);
                      e.dataTransfer.setData("text/plain", PLANET_ID_TO_NAME[p.id]);
                    }}
                    onClick={() =>
                      setArmedPlanet((curr) => (curr === p.id ? null : p.id))
                    }
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                      isArmed
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : isPlaced
                          ? "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800"
                          : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                    }`}
                    title={`${p.sanskrit} — ${p.english}`}
                  >
                    <span className="mr-1">{p.symbol}</span>
                    {p.english}
                    {isPlaced && (
                      <span
                        className="ml-1 opacity-60 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePlacement(p.id);
                        }}
                      >
                        ✕
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: synthesis cards */}
        <div className="space-y-3">
          {placements.length === 0 ? (
            <EmptyState />
          ) : (
            placements.map((pl, idx) => {
              const rashiId = houseToRashi(pl.house);
              const synth = synthesize(pl.planetId, rashiId, pl.house);
              const planet = PLANETS.find((p) => p.id === pl.planetId)!;
              const rashi = RASHIS.find((r) => r.id === rashiId)!;
              const house = HOUSES.find((h) => h.num === pl.house)!;
              const expanded = expandedIdx === idx;
              const revealed = revealedSet.has(idx);
              return (
                <div
                  key={`${pl.planetId}-${pl.house}`}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIdx(expanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl shrink-0">{planet.symbol}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {planet.english} in {rashi.english} · House {house.num}{" "}
                          <span className="text-zinc-500 font-normal">({house.english})</span>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                          {planet.sanskrit} · {rashi.sanskrit} {rashi.devanagari} ·{" "}
                          {house.sanskrit}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${DIGNITY_BADGE[synth.dignity]}`}
                      >
                        {synth.dignity}
                      </span>
                      <span className="text-zinc-400 text-xs">{expanded ? "▾" : "▸"}</span>
                    </div>
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-zinc-100 dark:border-zinc-800">
                      {/* Visual layers */}
                      <div className="pt-3 flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                        <div className="shrink-0 rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800">
                          <div className="text-[10px] uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-400 mb-2 text-center">
                            Visual layers
                          </div>
                          <VisualLayers
                            planetId={pl.planetId}
                            rashiId={rashiId}
                            houseNum={pl.house}
                            size={220}
                          />
                        </div>
                        <Legend />
                      </div>

                      {/* Synthesis */}
                      <div className="pt-1">
                        <div className="text-[11px] uppercase tracking-wider font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                          Synthesis
                        </div>
                        {quizMode && !revealed ? (
                          <div className="space-y-2">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 italic">
                              How would <strong>{planet.english}</strong> behave in{" "}
                              <strong>{rashi.english}</strong> in House{" "}
                              <strong>{house.num}</strong>? Think about dignity, element fit,
                              and house theme.
                            </p>
                            <Button
                              size="sm"
                              onClick={() => {
                                const next = new Set(revealedSet);
                                next.add(idx);
                                setRevealedSet(next);
                              }}
                            >
                              Reveal
                            </Button>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
                              {synth.paragraph}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                              <strong>Dignity:</strong> {synth.dignityNote}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Layer cards */}
                      <div className="grid sm:grid-cols-3 gap-2">
                        <MiniLayer
                          label="House"
                          color="emerald"
                          title={`H${house.num} · ${house.sanskrit}`}
                          desc={house.description}
                          keywords={house.keywords}
                        />
                        <MiniLayer
                          label="Rashi"
                          color="rose"
                          title={`${rashi.sanskrit} (${rashi.english})`}
                          desc={rashi.description}
                          keywords={rashi.keywords}
                        />
                        <MiniLayer
                          label="Planet"
                          color="indigo"
                          title={`${planet.sanskrit} (${planet.english})`}
                          desc={planet.description}
                          keywords={planet.keywords}
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removePlacement(pl.planetId)}
                        >
                          Remove from chart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function Legend() {
  return (
    <div className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed flex-1 min-w-0">
      <div className="font-medium text-zinc-700 dark:text-zinc-300 text-xs">
        How to read this
      </div>
      <ul className="space-y-1 list-none">
        <li>
          <span className="font-medium">The halo (dominant)</span> = dignity. Bright
          gold + rays = exalted. Green = own sign. Blue = friend. Grey = neutral. Orange
          = enemy. Dark/dim = debilitated.
        </li>
        <li>
          <span className="font-medium">Middle ring</span> = the <em>rashi</em>. Tint =
          element (fire/earth/air/water). Stroke = modality (solid fixed, long dash
          cardinal, dots mutable). The small chip on the ring = the rashi&apos;s ruler.
        </li>
        <li>
          <span className="font-medium">Outer thin ring</span> = the <em>house</em> and
          its category (Kendra / Trikona / Dusthana / Upachaya).
        </li>
        <li>
          <span className="font-medium">Center</span> = the <em>planet</em> in its own
          color and glyph.
        </li>
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center">
      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        No planets placed yet
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        Tap a planet from the palette, then tap a house on the chart. Or drag a planet
        onto a house. Use <em>Random combo</em> to get a starting point.
      </div>
    </div>
  );
}

function MiniLayer({
  label,
  color,
  title,
  desc,
  keywords,
}: {
  label: string;
  color: "emerald" | "rose" | "indigo";
  title: string;
  desc: string;
  keywords: string[];
}) {
  const cls = {
    emerald: {
      badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
      kw: "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    },
    rose: {
      badge: "bg-rose-100 text-rose-900 dark:bg-rose-900/40 dark:text-rose-200",
      kw: "bg-rose-50 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
    },
    indigo: {
      badge: "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-200",
      kw: "bg-indigo-50 text-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-200",
    },
  }[color];
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-2.5">
      <div className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mb-1 ${cls.badge}`}>
        {label}
      </div>
      <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{title}</div>
      <div className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-snug mt-1 line-clamp-3">
        {desc}
      </div>
      <div className="flex flex-wrap gap-1 mt-1.5">
        {keywords.slice(0, 3).map((k) => (
          <span key={k} className={`text-[10px] px-1.5 py-0.5 rounded ${cls.kw}`}>
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
