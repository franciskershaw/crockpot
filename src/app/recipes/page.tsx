"use server";

import {
  getRecipes,
  getRecipeTimeRange,
  getRecipeCategories,
} from "@/actions/recipes";
import { getItems } from "@/actions/items";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BrowseHeader from "./components/Header";
import RecipeGrid from "./components/RecipeGrid";
import Filters from "./components/Filters";
import FilterProvider from "./context/FilterProvider";

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
    getItems(),
  ]);

  // Now prefetch with the same filters that the client will use
  await queryClient.prefetchQuery({
    queryKey: [
      "recipes",
      {
        pageSize: 10,
        filters: {
          approved: true,
          minTime: timeRange.min,
          maxTime: timeRange.max,
          categoryIds: [],
          categoryMode: "include",
          ingredientIds: [],
          query: undefined,
        },
      },
    ],
    queryFn: () =>
      getRecipes({
        page: 1,
        pageSize: 10,
        filters: {
          approved: true,
          minTime: timeRange.min,
          maxTime: timeRange.max,
          categoryIds: [],
          categoryMode: "include",
          ingredientIds: [],
          query: undefined,
        },
      }),
  });

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
