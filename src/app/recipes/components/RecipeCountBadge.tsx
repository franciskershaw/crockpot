"use client";

import { useQuery } from "@tanstack/react-query";
import { getRecipeCount } from "@/actions";
import { useFilters } from "../context/FilterProvider";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState, useEffect } from "react";

export default function RecipeCountBadge() {
  const { filters } = useFilters();
  const [displayCount, setDisplayCount] = useState<number | null>(null);

  // Create a more intelligent query key that only includes relevant filters
  const queryKey = useMemo(() => {
    const relevantFilters = { ...filters };

    // Only include categoryMode if there are actually categories selected
    if (!filters.categoryIds || filters.categoryIds.length === 0) {
      delete relevantFilters.categoryMode;
    }

    // Only include ingredientIds if there are actually ingredients selected
    if (!filters.ingredientIds || filters.ingredientIds.length === 0) {
      delete relevantFilters.ingredientIds;
    }

    return ["recipeCount", relevantFilters];
  }, [filters]);

  const { data: recipeCount, isFetching } = useQuery({
    queryKey,
    queryFn: () => getRecipeCount(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update display count only when we have new data
  useEffect(() => {
    if (recipeCount !== undefined) {
      setDisplayCount(recipeCount);
    }
  }, [recipeCount]);

  // Use displayCount (which persists previous value) or fallback to 0 for initial load
  const count = displayCount ?? 0;
  const recipeText = count === 1 ? "recipe" : "recipes";

  return (
    <Badge
      className={`bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-all duration-200 ${
        isFetching ? "opacity-60" : "opacity-100"
      }`}
    >
      {count.toLocaleString()} {recipeText}
    </Badge>
  );
}
