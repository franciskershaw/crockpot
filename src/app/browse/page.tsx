"use server";

import { getRecipes } from "@/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import BrowseHeader from "@/components/page/BrowsePage/Header";
import RecipeGrid from "@/components/page/BrowsePage/RecipeGrid";

export default async function Browse() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipes", { page: 1, pageSize: 10, approved: true }],
    queryFn: () => getRecipes({ page: 1, pageSize: 10, approved: true }),
  });

  return (
    <div className="container mx-auto py-4">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BrowseHeader />
        <RecipeGrid pageSize={10} />
      </HydrationBoundary>
    </div>
  );
}
