import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserRequests } from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { toast } from 'react-toastify';

export function useMenu() {
  const { user } = useUser();
  const { getUserRecipeMenu, editUserShoppingList, getUserShoppingList } = useUserRequests();
  const editUser = useEditUser();
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

  const { mutate: toggleObtained } = useMutation(
    (body) => editUserShoppingList(user._id, user.token, body),
    {
      onSuccess: (response) => {
        queryClient.setQueryData([queryKeys.user], (prevUserData) => {
          const newUserData = prevUserData;
          newUserData.shoppingList = response;
          return newUserData;
        });
        queryClient.refetchQueries([queryKeys.shoppingList]);
      },
      onError: (data) => {
        console.log(data);
      },
    }
  );

  const toggleItemObtained = (recipeId) => {
    toggleObtained({ recipeId });
  };

  const addExtraShoppingItem = (extraItem) => {
    if (extraItem) {
      editUser({ extraItems: [extraItem] });
      toast.success(`Added extra item to shopping list`);
    } else {
      editUser({ extraItems: [] });
      toast.success('Extra items removed from shopping list');
    }
  };

  return { recipeMenu, shoppingList, toggleItemObtained, addExtraShoppingItem };
}
