"use server";

import { getRecipes, getRecipeTimeRange } from "@/actions";
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
  const queryClient = new QueryClient();

  // Fetch initial data and time range
  const timeRange = await getRecipeTimeRange();

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
        <div className="container mx-auto">
          <BrowseHeader />
          <div className="flex gap-6">
            <div className="w-80">
              <Filters />
            </div>
            <div className="flex-1">
              <RecipeGrid pageSize={10} />
            </div>
          </div>
        </div>
      </HydrationBoundary>
    </FilterProvider>
  );
}
