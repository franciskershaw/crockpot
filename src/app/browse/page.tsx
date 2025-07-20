"use server";

import {
  getRecipes,
  getRecipeTimeRange,
  getRecipeCategories,
  getRecipeIngredients,
} from "@/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BrowseHeader from "@/components/page/BrowsePage/BrowseHeader";
import RecipeGrid from "@/components/page/BrowsePage/RecipeGrid";
import Filters from "@/components/page/BrowsePage/Filters";
import FilterProvider from "@/components/page/BrowsePage/FilterProvider";

export default async function Browse() {
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
    getRecipeIngredients(),
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
