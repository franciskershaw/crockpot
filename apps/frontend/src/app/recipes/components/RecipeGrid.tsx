"use client";

import { useCallback, useEffect } from "react";

import { useFilters } from "@/app/recipes/context/FilterProvider";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import type { Recipe } from "@/data/types";

import useGetRecipes from "../hooks/useGetRecipes";

import NoResults from "./NoResults";
import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ pageSize = 10 }: { pageSize: number }) {
  const { setTotalRecipeCount } = useFilters();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
  } = useGetRecipes(pageSize);

  console.log(data);

  const allRecipes = data?.pages.flatMap((page) => page.recipes) ?? [];
  const hasNoResults = isFetched && !isLoading && allRecipes.length === 0;

  useEffect(() => {
    const total = data?.pages?.[0]?.total;
    if (total !== undefined) setTotalRecipeCount(total);
  }, [data?.pages, setTotalRecipeCount]);

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node || !hasNextPage || isFetchingNextPage) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) fetchNextPage();
        },
        { rootMargin: "200px 0px", threshold: 0.1 }
      );
      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  if (hasNoResults) return <NoResults />;

  return (
    <div className="relative z-10 bg-surface-warm">
      <ResponsiveRecipeGrid>
        {/* {allRecipes.map((recipe: Recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} fromPage="/recipes" />
        ))} */}

        {/* <div ref={loadMoreRef} className="col-span-full min-h-[1px]" />
        {isFetchingNextPage && (
          <div className="col-span-full flex justify-center py-6 text-gray-500">
            Loading more…
          </div>
        )} */}
      </ResponsiveRecipeGrid>
    </div>
  );
}
