"use server";

import { getRecipes, getRecipeTimeRange } from "@/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BrowseHeader from "@/components/page/BrowsePage/Header";
import RecipeGrid from "@/components/page/BrowsePage/RecipeGrid";
import Filters from "@/components/page/BrowsePage/Filters";
import FilterProvider from "@/components/page/BrowsePage/FilterProvider";

export default async function Browse() {
  const queryClient = new QueryClient();

  // Fetch initial data and time range
  const [timeRange] = await Promise.all([
    getRecipeTimeRange(),
    queryClient.prefetchQuery({
      queryKey: ["recipes", { 
        pageSize: 10, 
        filters: { approved: true },
      }],
      queryFn: () => getRecipes({ 
        page: 1, 
        pageSize: 10, 
        filters: { approved: true },
      }),
    }),
  ]);

  return (
    <div className="container mx-auto py-4">
      <FilterProvider timeRange={timeRange}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BrowseHeader />
          <div className="grid lg:grid-cols-6 gap-6">
            {/* Filters sidebar */}
            <div className="lg:col-span-2 mb-6 lg:mb-0">
              <Filters />
            </div>
            {/* Recipe grid */}
            <div className="lg:col-span-4">
              <RecipeGrid pageSize={10} />
            </div>
          </div>
        </HydrationBoundary>
      </FilterProvider>
    </div>
  );
}
