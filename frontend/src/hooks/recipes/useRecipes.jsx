import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRecipeRequests } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hooks
export function useRecipes() {
  const { fetchAllRecipes } = useRecipeRequests();
  const fallback = [];
  const { data: allRecipes = fallback } = useQuery(
    [queryKeys.recipes],
    fetchAllRecipes
  );

  return { allRecipes };
}

export function usePrefetchRecipes() {
  const { fetchAllRecipes } = useRecipeRequests();
  const queryClient = useQueryClient();
  queryClient.prefetchQuery([queryKeys.recipes], fetchAllRecipes);
}
