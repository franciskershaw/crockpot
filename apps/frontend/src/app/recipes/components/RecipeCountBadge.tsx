"use client";

import { useFilters } from "@/app/recipes/context/FilterProvider";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function RecipeCountBadge() {
  const { totalRecipeCount, isHydrated } = useFilters();
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Update display count when totalRecipeCount changes
  useEffect(() => {
    if (totalRecipeCount !== undefined && totalRecipeCount > 0) {
      setDisplayCount(totalRecipeCount);
      setHasLoadedOnce(true);
    } else if (totalRecipeCount === 0 && hasLoadedOnce) {
      // Only show 0 if we've actually loaded data and confirmed there are 0 results
      setDisplayCount(0);
    }
  }, [totalRecipeCount, hasLoadedOnce]);

  // Show loading state if we haven't loaded any data yet and are hydrated
  if (isHydrated && displayCount === null) {
    return (
      <Badge className="bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 transition-all duration-200">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          Loading...
        </motion.div>
      </Badge>
    );
  }

  // Use displayCount (which persists previous value) or fallback to loading state
  const count = displayCount ?? 0;
  const recipeText = count === 1 ? "recipe" : "recipes";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-all duration-200">
        {count.toLocaleString()} {recipeText}
      </Badge>
    </motion.div>
  );
}
