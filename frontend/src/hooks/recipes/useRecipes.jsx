import { useQuery } from '@tanstack/react-query';
import { fetchAllRecipes } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hook
export function useRecipes() {
  const fallback = [];
  const { data: allRecipes = fallback } = useQuery(
    [queryKeys.recipes],
    fetchAllRecipes
  );

  return { allRecipes };
}
