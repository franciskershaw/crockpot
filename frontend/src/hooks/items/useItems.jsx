import { useQuery } from '@tanstack/react-query';
import { fetchAllItems } from '../../queries/itemRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';

// Hook
export function useItems() {
  const { user } = useUser();

  const fallback = [];
  const { data: allItems = fallback } = useQuery(
    [queryKeys.items],
    () => fetchAllItems(user.token),
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
