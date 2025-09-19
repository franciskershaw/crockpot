"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useMemo } from "react";
import { motion } from "motion/react";
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
  const { filters, setTotalRecipeCount } = useFilters();
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
    refetch,
  } = useInfiniteQuery({
    ...createInfiniteQueryConfig(queryKey, ({ pageParam }) =>
      getRecipes({
        page: pageParam,
        pageSize,
        filters,
      })
    ),
  });

  const loader = useRef<HTMLDivElement | null>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });

    if (loader.current) observer.observe(loader.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Track previous query key to detect filter changes
  const prevQueryKey = useRef(queryKey);

  // Reset query and scroll to top when filters change
  useEffect(() => {
    const isFilterChange = prevQueryKey.current !== queryKey;

    if (isFilterChange && prevQueryKey.current !== null) {
      // Reset the infinite query to start from page 1
      refetch();
      // Scroll to top when filters change
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    prevQueryKey.current = queryKey;
  }, [queryKey, refetch]);

  // Restore scroll position for normal navigation (not filter changes)
  useEffect(() => {
    if (isFetched && !isLoading) {
      const isFilterChange = prevQueryKey.current !== queryKey;

      if (!isFilterChange) {
        // Restore scroll position for normal navigation
        setTimeout(() => {
          restoreScrollPosition();
        }, 100);
      }
    }
  }, [isFetched, isLoading, restoreScrollPosition, queryKey]);

  // Update total count when data is available
  useEffect(() => {
    if (data?.pages?.[0]?.total !== undefined) {
      setTotalRecipeCount(data.pages[0].total);
    }
  }, [data, setTotalRecipeCount]);

  // Check if we have no results after loading is complete
  const allRecipes = data?.pages.flatMap((page) => page.recipes) || [];
  const hasNoResults = isFetched && !isLoading && allRecipes.length === 0;

  if (hasNoResults) {
    return <NoResults />;
  }

  return (
    <ResponsiveRecipeGrid>
      {/* Show skeletons while loading initial data */}
      {(isLoading || !isFetched) && allRecipes.length === 0
        ? Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={`skeleton-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <RecipeCard skeleton />
            </motion.div>
          ))
        : allRecipes.map((recipe: Recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index * 0.05, 0.5), // Cap delay to prevent long waits
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <RecipeCard
                recipe={recipe}
                priority={index < 6} // First 6 items get priority
                skeleton={false}
                fromPage="/recipes"
              />
            </motion.div>
          ))}

      {/* Loading skeletons for infinite scroll */}
      {isFetchingNextPage && (
        <>
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`loading-skeleton-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <RecipeCard skeleton />
            </motion.div>
          ))}
        </>
      )}

      {/* Intersection observer target */}
      <div ref={loader} className="col-span-full flex justify-center py-8">
        {isFetchingNextPage && (
          <motion.div
            className="text-gray-500 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Loading more recipes...
          </motion.div>
        )}
      </div>
    </ResponsiveRecipeGrid>
  );
}
