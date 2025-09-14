"use client";

import { useFilters } from "@/app/recipes/context/FilterProvider";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function RecipeCountBadge() {
  const { totalRecipeCount } = useFilters();
  const [displayCount, setDisplayCount] = useState<number | null>(null);

  // Update display count when totalRecipeCount changes
  useEffect(() => {
    if (totalRecipeCount !== undefined) {
      setDisplayCount(totalRecipeCount);
    }
  }, [totalRecipeCount]);

  // Use displayCount (which persists previous value) or fallback to 0 for initial load
  const count = displayCount ?? 0;
  const recipeText = count === 1 ? "recipe" : "recipes";

  return (
    <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-all duration-200">
      {count.toLocaleString()} {recipeText}
    </Badge>
  );
}
