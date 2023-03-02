import { useQuery } from '@tanstack/react-query';
import { useRecipeRequests } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hook
export function useRecipeCategories() {
  const { fetchAllRecipeCategories } = useRecipeRequests();
  const fallback = [];
  const { data: recipeCategories = fallback } = useQuery(
    [queryKeys.recipeCategories],
    fetchAllRecipeCategories,
    {
      staleTime: 10000000,
    }
  );

  return { recipeCategories };
}
