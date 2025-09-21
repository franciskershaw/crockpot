"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  const [showInfiniteSkeletons, setShowInfiniteSkeletons] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastTriggerTime = useRef(0);

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

  // Callback ref for intersection observer - more reliable than useEffect
  const loaderRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage &&
            !isLoadingMore
          ) {
            const now = Date.now();
            // Debounce rapid triggers (minimum 500ms between triggers)
            if (now - lastTriggerTime.current < 500) return;

            lastTriggerTime.current = now;
            setIsLoadingMore(true);
            setShowInfiniteSkeletons(true);
            fetchNextPage();
          }
        },
        {
          // Trigger earlier - when loader is 200px away from viewport
          rootMargin: "200px 0px",
          // More stable threshold
          threshold: 0.1,
        }
      );

      observer.observe(node);

      // Cleanup function
      return () => observer.disconnect();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, isLoadingMore]
  );

  // Track when new page data becomes available
  const [prevPageCount, setPrevPageCount] = useState(0);

  // Improved loading state management for smoother transitions
  useEffect(() => {
    const currentPageCount = data?.pages.length || 0;

    if (
      !isFetchingNextPage &&
      isLoadingMore &&
      currentPageCount > prevPageCount
    ) {
      // New data has loaded - reset loading states
      const timer = setTimeout(() => {
        setShowInfiniteSkeletons(false);
        setIsLoadingMore(false);
        setPrevPageCount(currentPageCount);
      }, 150); // Faster transition for better UX
      return () => clearTimeout(timer);
    } else if (currentPageCount > prevPageCount) {
      // Update page count even if not showing skeletons
      setPrevPageCount(currentPageCount);
    }
  }, [isFetchingNextPage, isLoadingMore, data?.pages.length, prevPageCount]);

  // Reset loading states when query changes (filters, etc.)
  useEffect(() => {
    setIsLoadingMore(false);
    setShowInfiniteSkeletons(false);
    setPrevPageCount(0);
  }, [queryKey]);

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

  // Hide server-side skeletons once client-side content is ready
  useEffect(() => {
    if (isFetched) {
      const serverSkeletons = document.querySelector(".recipe-skeletons");
      if (serverSkeletons) {
        (serverSkeletons as HTMLElement).style.display = "none";
      }
    }
  }, [isFetched]);

  // Check if we have no results after loading is complete
  const allRecipes = data?.pages.flatMap((page) => page.recipes) || [];
  const hasNoResults = isFetched && !isLoading && allRecipes.length === 0;

  if (hasNoResults) {
    return <NoResults />;
  }

  return (
    <div className="relative z-10 bg-surface-warm">
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
          : allRecipes.map((recipe: Recipe, index) => {
              // Calculate if this is a new item (from the latest page)
              const pagesLoaded = data?.pages.length || 1;
              const totalPreviousItems = Math.max(
                0,
                (pagesLoaded - 1) * pageSize
              );
              const isNewItem = index >= totalPreviousItems;
              const newItemIndex = isNewItem ? index - totalPreviousItems : 0;

              return (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: isNewItem
                      ? newItemIndex * 0.08 + 0.1 // Faster stagger for new items, shorter base delay
                      : Math.min(index * 0.03, 0.3), // Faster for existing items
                    duration: 0.35,
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
              );
            })}

        {/* Loading skeletons for infinite scroll */}
        <AnimatePresence>
          {showInfiniteSkeletons && (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`loading-skeleton-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    delay: i * 0.05,
                    duration: 0.25,
                  }}
                >
                  <RecipeCard skeleton />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Intersection observer target */}
        <div ref={loaderRef} className="col-span-full flex justify-center py-8">
          <AnimatePresence>
            {isLoadingMore && (
              <motion.div
                className="text-gray-500 flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Loading more recipes...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ResponsiveRecipeGrid>
    </div>
  );
}
