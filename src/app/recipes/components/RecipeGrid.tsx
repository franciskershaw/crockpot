"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useMemo } from "react";
import { getRecipes } from "@/actions/recipes";
import RecipeCard from "./RecipeCard";
import NoResults from "./NoResults";
import type { Recipe } from "@/data/types";
import { useFilters } from "../context/FilterProvider";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";

export default function RecipeGrid({ pageSize = 10 }: { pageSize: number }) {
  const { filters } = useFilters();
  const { restoreScrollPosition } = useScrollRestoration();

  // Create intelligent query key that only includes relevant filters
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

    return [
      "recipes",
      {
        pageSize,
        filters: {
          ...relevantFilters,
          pageSize,
        },
      },
    ];
  }, [filters, pageSize]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) =>
      getRecipes({
        page: pageParam,
        pageSize,
        filters,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });

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
