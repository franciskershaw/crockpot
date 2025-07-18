"use server";

import { getRecipes } from "@/actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import RecipeGrid from "@/components/page/BrowsePage/RecipeGrid";

export default async function Browse() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["recipes", { page: 1, pageSize: 10, approved: true }],
    queryFn: () => getRecipes({ page: 1, pageSize: 10, approved: true }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RecipeGrid pageSize={10} />
    </HydrationBoundary>
  );
}
