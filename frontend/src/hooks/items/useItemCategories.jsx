import { useQuery } from '@tanstack/react-query';
import { fetchAllItemCategories } from '../../queries/itemRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hook
export function useItemCategories() {
  const fallback = [];
  const { data: itemCategories = fallback } = useQuery(
    [queryKeys.itemCategories],
    fetchAllItemCategories,
    {
      staleTime: 10000000,
    }
  );

  return { itemCategories };
}
