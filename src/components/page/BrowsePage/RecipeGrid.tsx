"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useMemo } from "react";
import { getRecipes } from "@/actions";
import RecipeCard from "@/components/page/BrowsePage/RecipeCard";
import NoResults from "@/components/page/BrowsePage/NoResults";
import type { RecipeWithCategories } from "@/data/recipes";
import { useFilters } from "./FilterProvider";

export default function RecipeGrid({ pageSize = 10 }: { pageSize: number }) {
  const { filters, timeRange } = useFilters();

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

  // Check if we have no results after loading is complete
  const allRecipes = data?.pages.flatMap((page) => page.recipes) || [];
  const hasNoResults = isFetched && !isLoading && allRecipes.length === 0;

  if (hasNoResults) {
    return <NoResults timeRange={timeRange} />;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {isLoading || !isFetched
        ? Array.from({ length: 6 }).map((_, i) => (
            <RecipeCard key={i} skeleton />
          ))
        : allRecipes.map((recipe: RecipeWithCategories, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              priority={index < 6} // First 6 items get priority
              skeleton={false}
            />
          ))}
      <div ref={loader}>{isFetchingNextPage && "Loading more..."}</div>
    </div>
  );
}
