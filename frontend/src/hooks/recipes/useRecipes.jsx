import { useQuery } from '@tanstack/react-query';
import { useRecipeRequests } from '../queries/useRecipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Returns all recipes
export function useRecipes() {
  const { fetchAllRecipes } = useRecipeRequests();
  const fallback = [];
  const { data: allRecipes = fallback } = useQuery(
    [queryKeys.recipes],
    fetchAllRecipes
  );

  return { allRecipes };
}
