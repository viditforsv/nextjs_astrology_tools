import Link from "next/link";
import AstroLearner from "@/components/learning/AstroLearner";

export const metadata = {
  title: "Learn · Vedic Astrology Tools",
  description:
    "Explore the 1,296 combinations of planet × rashi × house with a layered, animated visualization.",
};

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black px-4 py-12">
      <main className="flex flex-col items-center gap-6 w-full max-w-6xl">
        <div className="w-full flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Astro Learning Lab
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Place planets in houses · pick a Lagna · study the synthesis of each placement
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            ← Back to chart
          </Link>
        </div>

        <AstroLearner />
      </main>
    </div>
  );
}
