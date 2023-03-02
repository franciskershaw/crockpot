import { useQuery } from '@tanstack/react-query';
import { useItemRequests } from '../../queries/itemRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

// Hook
export function useItems() {
  const { fetchAllItems } = useItemRequests();
  const fallback = [];
  const { data: allItems = fallback } = useQuery(
    [queryKeys.items],
    fetchAllItems,
    {
      staleTime: 10000000,
    }
  );

  // Filter out household items for when adding recipes
  const ingredients = allItems.filter(
    (item) => item.category !== '6310a881b61a0ace3a1281ec'
  );

  return { allItems, ingredients };
}
