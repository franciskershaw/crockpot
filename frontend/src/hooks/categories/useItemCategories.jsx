import { useQuery } from '@tanstack/react-query';
import { fetchAllItemCategories } from '../../queries/itemCategoryRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';

// Hook
export function useItemCategories() {
  const { user } = useUser();

  const fallback = [];
  const { data: categories = fallback } = useQuery(
    [queryKeys.categories],
    () => fetchAllItemCategories(user.token),
    {
      staleTime: 10000000,
    }
  );

  return { categories };
}
