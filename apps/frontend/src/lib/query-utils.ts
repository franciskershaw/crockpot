/**
 * Centralized query key generation utilities
 * Ensures consistent cache keys across server prefetch and client queries
 */

import { queryKeys } from "./constants";
import type { RecipeFilters } from "@/data/types";

/**
 * Generates a standardized query key for recipe queries
 * Applies consistent filter stripping logic to avoid cache key mismatches
 */
export function createRecipeQueryKey(
  pageSize: number,
  filters: RecipeFilters,
  seed?: number
): [
  string,
  { pageSize: number; filters: Record<string, unknown>; seed?: number }
] {
  const relevantFilters: Record<string, unknown> = { ...filters };

  // Only include categoryMode if there are actually categories selected
  if (!filters.categoryIds || filters.categoryIds.length === 0) {
    delete relevantFilters.categoryMode;
  }

  // Only include ingredientIds if there are actually ingredients selected
  if (!filters.ingredientIds || filters.ingredientIds.length === 0) {
    delete relevantFilters.ingredientIds;
  }

  return [
    queryKeys.RECIPES,
    {
      pageSize,
      filters: {
        ...relevantFilters,
        pageSize, // Include pageSize in filters for consistency
      },
      ...(seed !== undefined && { seed }),
    },
  ];
}

/**
 * Standard parameters for infinite query prefetch and client usage
 */
export interface InfiniteQueryParams {
  pageSize: number;
  filters: RecipeFilters;
}

/**
 * Creates standardized infinite query configuration
 * Ensures server prefetch and client infinite queries use identical structure
 */
export function createInfiniteQueryConfig<
  TData extends { page: number; totalPages: number }
>(
  queryKey: ReturnType<typeof createRecipeQueryKey>,
  queryFn: (params: { pageParam: number }) => Promise<TData>
) {
  return {
    queryKey,
    queryFn,
    initialPageParam: 1 as const,
    getNextPageParam: (lastPage: TData) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  };
}
