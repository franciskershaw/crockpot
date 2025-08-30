"use server";

import {
  getRecipes,
  getRecipeTimeRange,
  getRecipeCategories,
} from "@/actions/recipes";
import { getIngredients } from "@/actions/items";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BrowseHeader from "./components/Header";
import RecipeGrid from "./components/RecipeGrid";
import Filters from "./components/Filters";
import FilterProvider from "./context/FilterProvider";
import type { RecipeFilters } from "@/data/types";
import {
  createRecipeQueryKey,
  createInfiniteQueryConfig,
} from "@/lib/query-utils";

export default async function Recipes() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  // Fetch initial data
  const [timeRange, categories, ingredients] = await Promise.all([
    getRecipeTimeRange(),
    getRecipeCategories(),
    getIngredients(),
  ]);

  // Create initial filters that match the client defaults
  const initialFilters: RecipeFilters = {
    approved: true,
    minTime: timeRange.min,
    maxTime: timeRange.max,
    categoryIds: [],
    categoryMode: "include" as const,
    ingredientIds: [],
    query: undefined,
  };

  // Generate query key using the same utility as client
  const prefetchQueryKey = createRecipeQueryKey(10, initialFilters);

  await queryClient.prefetchInfiniteQuery(
    createInfiniteQueryConfig(prefetchQueryKey, ({ pageParam }) =>
      getRecipes({
        page: pageParam,
        pageSize: 10,
        filters: initialFilters,
      })
    )
  );

  return (
    <FilterProvider timeRange={timeRange}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrowseHeader
          categories={categories}
          timeRange={timeRange}
          ingredients={ingredients}
        />
        <div className="flex gap-6">
          {/* Desktop Filters - Hidden on mobile */}
          <div className="hidden md:block w-80">
            <Filters />
          </div>
          <div className="flex-1">
            <RecipeGrid pageSize={10} />
          </div>
        </div>
      </HydrationBoundary>
    </FilterProvider>
  );
}
