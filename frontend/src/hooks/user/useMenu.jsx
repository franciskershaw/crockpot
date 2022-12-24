import { useUser } from '../auth/useUser';
import { useQuery } from '@tanstack/react-query';
import {
  getUserRecipeMenu,
  getUserShoppingList,
} from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

export function useMenu() {
  const { user } = useUser();

  const menuFallback = [];
  const { data: recipeMenu = menuFallback } = useQuery(
    [queryKeys.recipeMenu],
    () => getUserRecipeMenu(user._id, user.token)
  );

  const shoppingFallback = [];
  const { data: shoppingList = shoppingFallback } = useQuery(
    [queryKeys.shoppingList],
    () => getUserShoppingList(user._id, user.token)
  );

  return { recipeMenu, shoppingList };
}
