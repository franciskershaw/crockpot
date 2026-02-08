"use client";

import { useCallback, useEffect, useRef } from "react";

import { AnimatePresence, motion } from "motion/react";

import { useFilters } from "@/app/recipes/context/FilterProvider";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";

import useGetRecipes from "../hooks/useGetRecipes";

import NoResults from "./NoResults";
import RecipeCard from "./RecipeCard";
import RecipeGridSkeleton from "./RecipeGridSkeleton";

export default function RecipeGrid({ pageSize = 10 }: { pageSize: number }) {
  const { setTotalRecipeCount } = useFilters();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    recipes,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetched,
  } = useGetRecipes(pageSize);

  useEffect(() => {
    const total = data?.pages?.[0]?.total;
    if (typeof total === "number") setTotalRecipeCount(total);
  }, [data?.pages, setTotalRecipeCount]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (!entry?.isIntersecting || !hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "200px",
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  if (isLoading) {
    return <RecipeGridSkeleton count={pageSize} />;
  }

  if (isFetched && recipes.length === 0) {
    return <NoResults />;
  }

  const pagesLoaded = data?.pages?.length ?? 1;
  const totalPreviousItems = Math.max(0, (pagesLoaded - 1) * pageSize);

  return (
    <div className="relative z-10 bg-surface-warm">
      <ResponsiveRecipeGrid>
        {recipes.map((recipe, index) => {
          const isNewItem = index >= totalPreviousItems;
          const newItemIndex = isNewItem ? index - totalPreviousItems : 0;
          return (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: isNewItem
                  ? newItemIndex * 0.08 + 0.1
                  : Math.min(index * 0.03, 0.3),
                duration: 0.35,
                ease: "easeOut",
              }}
            >
              <RecipeCard recipe={recipe} priority={index < 6} />
            </motion.div>
          );
        })}

        {/* Loading skeletons for infinite scroll */}
        <AnimatePresence>
          {isFetchingNextPage && (
            <>
              {Array.from({ length: Math.min(3, pageSize) }, (_, i) => (
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

        {/* Sentinel for infinite scroll */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="col-span-full min-h-[120px] w-full py-8"
            aria-hidden
          />
        )}
      </ResponsiveRecipeGrid>
    </div>
  );
}
