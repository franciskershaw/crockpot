import { useUser } from '../auth/useUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUserRecipeMenu,
  getUserShoppingList,
  getUserExtraItems,
  editUserShoppingList,
} from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { setStoredUser } from '../../reactQuery/userStorage';

export function useMenu() {
  const { user } = useUser();
  const queryClient = useQueryClient();

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

  const extraItemsFallback = [];
  const { data: extraItems = extraItemsFallback } = useQuery(
    [queryKeys.extraItems],
    () => getUserExtraItems(user._id, user.token)
  );

  const { mutate } = useMutation(
    (body) => editUserShoppingList(user._id, user.token, body),
    {
      onSuccess: (response) => {
        queryClient.setQueryData([queryKeys.user], (prevUserData) => {
          const newUserData = prevUserData;
          newUserData.shoppingList = response;
          setStoredUser(newUserData);
          return newUserData;
        });
        queryClient.refetchQueries([queryKeys.shoppingList]);
        queryClient.refetchQueries([queryKeys.extraItems]);
      },
      onError: (data) => {
        console.log(data);
      },
    }
  );

  const toggleItemObtained = (recipeId) => {
    mutate({ recipeId });
  };

  return { recipeMenu, shoppingList, extraItems, toggleItemObtained };
}
