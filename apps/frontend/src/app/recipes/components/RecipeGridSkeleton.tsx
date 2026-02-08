"use client";

import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";

import RecipeCard from "./RecipeCard";

/**
 * Full-grid skeleton matching the recipe grid layout. Renders `count` skeleton
 * cards so initial load shows the same layout as real content (no jump).
 */
export default function RecipeGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div
      className="relative z-10 bg-surface-warm"
      aria-busy
      aria-label="Loading recipes"
    >
      <ResponsiveRecipeGrid>
        {Array.from({ length: count }, (_, i) => (
          <RecipeCard key={i} skeleton />
        ))}
      </ResponsiveRecipeGrid>
    </div>
  );
}
