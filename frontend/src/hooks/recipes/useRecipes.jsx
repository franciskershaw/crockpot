import { useQuery } from '@tanstack/react-query';
import { fetchAllRecipes } from '../../queries/recipeRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';

// Hook
export function useRecipes() {
  const { user } = useUser();

  const fallback = [];
  const { data: allRecipes = fallback } = useQuery(
    [queryKeys.recipes],
    fetchAllRecipes,
    {
      staleTime: 10000000,
    }
  );

  return { allRecipes };
}
