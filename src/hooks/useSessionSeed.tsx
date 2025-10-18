// src/hooks/useSessionSeed.ts
import { useEffect, useState } from "react";

const SEED_KEY = "recipe-browse-seed";
const SEED_DATE_KEY = "recipe-browse-seed-date";

function generateDailySeed(): number {
  const today = new Date().toDateString();

  // Check if we have a seed for today
  const storedDate = sessionStorage.getItem(SEED_DATE_KEY);
  const storedSeed = sessionStorage.getItem(SEED_KEY);

  if (storedDate === today && storedSeed) {
    return parseFloat(storedSeed);
  }

  // Generate new seed and store it
  const newSeed = Math.random();
  sessionStorage.setItem(SEED_KEY, newSeed.toString());
  sessionStorage.setItem(SEED_DATE_KEY, today);

  return newSeed;
}

export function useSessionSeed() {
  const [seed, setSeed] = useState<number>(() => {
    // Only access sessionStorage on client
    if (typeof window === "undefined") return 0;
    return generateDailySeed();
  });

  useEffect(() => {
    // Ensure we have the seed after hydration
    setSeed(generateDailySeed());
  }, []);

  return seed;
}
