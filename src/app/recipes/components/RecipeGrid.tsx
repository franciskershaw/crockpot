"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useMemo } from "react";
import { getRecipes } from "@/actions/recipes";
import RecipeCard from "./RecipeCard";
import NoResults from "./NoResults";
import type { Recipe } from "@/data/types";
import { useFilters } from "@/app/recipes/context/FilterProvider";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import {
  createRecipeQueryKey,
  createInfiniteQueryConfig,
} from "@/lib/query-utils";

export default function RecipeGrid({ pageSize = 10 }: { pageSize: number }) {
  const { filters } = useFilters();
  const { restoreScrollPosition } = useScrollRestoration();

  // Generate consistent query key using centralized utility
  const queryKey = useMemo(
    () => createRecipeQueryKey(pageSize, filters),
    [filters, pageSize]
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
  } = useInfiniteQuery(
    createInfiniteQueryConfig(queryKey, ({ pageParam }) =>
      getRecipes({
        page: pageParam,
        pageSize,
        filters,
      })
    )
  );

  const loader = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Restore scroll position after data loads
  useEffect(() => {
    if (isFetched && !isLoading) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        restoreScrollPosition();
      }, 100);
    }
  }, [isFetched, isLoading, restoreScrollPosition]);

  // Check if we have no results after loading is complete
  const allRecipes = data?.pages.flatMap((page) => page.recipes) || [];
  const hasNoResults = isFetched && !isLoading && allRecipes.length === 0;

  if (hasNoResults) {
    return <NoResults />;
  }

  return (
    <ResponsiveRecipeGrid>
      {isLoading || !isFetched
        ? Array.from({ length: 6 }).map((_, i) => (
            <RecipeCard key={i} skeleton />
          ))
        : allRecipes.map((recipe: Recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              priority={index < 6} // First 6 items get priority
              skeleton={false}
              fromPage="/recipes"
            />
          ))}
      <div ref={loader}>{isFetchingNextPage && "Loading more..."}</div>
    </ResponsiveRecipeGrid>
  );
}
