"use client";

import { useState } from "react";
import Link from "next/link";
import D1Chart from "@/components/D1Chart";
import D1VedicChart from "@/components/D1VedicChart";
import ChartForm from "@/components/ChartForm";
import { sampleChartData } from "@/data/sampleChart";
import { ChartData, RASHIS } from "@/types/astrology";

export default function Home() {
  const [chartData, setChartData] = useState<ChartData>(sampleChartData);
  const [isLoading, setIsLoading] = useState(false);
  const [lagnaRashi, setLagnaRashi] = useState<string>("Aries");

  const handleCalculate = (data: ChartData) => {
    setIsLoading(true);
    setChartData(data);
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black px-4 py-12">
      <main className="flex flex-col items-center gap-8 w-full max-w-4xl">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vedic Astrology Tools
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Calculate planetary positions using Swiss Ephemeris
          </p>
          <Link
            href="/learn"
            className="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            → Open Astro Learning Lab (1,296 combinations)
          </Link>
        </div>
        
        <ChartForm onCalculate={handleCalculate} isLoading={isLoading} />

        <div className="w-full max-w-2xl flex flex-col items-center gap-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6">
          <div className="w-full flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              D1 Chart (North Indian)
            </h2>
            <div className="flex items-center gap-2">
              <label
                htmlFor="lagna"
                className="text-sm text-zinc-600 dark:text-zinc-400"
              >
                Lagna
              </label>
              <select
                id="lagna"
                value={lagnaRashi}
                onChange={(e) => setLagnaRashi(e.target.value)}
                className="text-sm rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1"
              >
                {RASHIS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <D1VedicChart chartData={chartData} lagnaRashi={lagnaRashi} size={440} />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
            House positions are derived from the selected Lagna. Each rashi has been
            placed sequentially counter-clockwise from House 1.
          </p>
        </div>

        <D1Chart chartData={chartData} />
        
        <p className="text-sm text-zinc-500 dark:text-zinc-500 text-center">
          Calculations powered by Moshier Ephemeris (local computation)
        </p>
      </main>
    </div>
  );
}
