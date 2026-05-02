"use client";

import { useMemo } from "react";
import VedicChart from "@components/VedicChart";
import { ChartData, RASHIS } from "@/types/astrology";

interface Props {
  chartData: ChartData;
  lagnaRashi: string;
  size?: number;
}

const RASHI_NUMBER: Record<string, number> = {
  Aries: 1,
  Taurus: 2,
  Gemini: 3,
  Cancer: 4,
  Leo: 5,
  Virgo: 6,
  Libra: 7,
  Scorpio: 8,
  Sagittarius: 9,
  Capricorn: 10,
  Aquarius: 11,
  Pisces: 12,
};

export default function D1VedicChart({ chartData, lagnaRashi, size = 360 }: Props) {
  const lagnaIdx = RASHIS.indexOf(lagnaRashi);

  const planetsInHouses = useMemo(() => {
    if (lagnaIdx < 0) return [];
    return chartData.planets.map((p) => {
      const planetRashiIdx = RASHIS.indexOf(p.rashi);
      const house = ((planetRashiIdx - lagnaIdx + 12) % 12) + 1;
      return { name: p.name, house };
    });
  }, [chartData.planets, lagnaIdx]);

  const houseRashis = useMemo(() => {
    if (lagnaIdx < 0) return {};
    const map: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      const rashiIdx = (lagnaIdx + h - 1) % 12;
      map[h] = rashiIdx + 1;
    }
    return map;
  }, [lagnaIdx]);

  return <VedicChart planets={planetsInHouses} houseRashis={houseRashis} size={size} />;
}
