import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllRecipes,
  fetchSingleRecipe,
} from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hooks
export function useRecipes() {
  const fallback = [];
  const { data: allRecipes = fallback } = useQuery(
    [queryKeys.recipes],
    fetchAllRecipes
  );

  return { allRecipes };
}

export function usePrefetchRecipes() {
  const queryClient = useQueryClient();
  queryClient.prefetchQuery([queryKeys.recipes], fetchAllRecipes);
}
