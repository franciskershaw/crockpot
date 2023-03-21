import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserRequests } from '../queries/useUserRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { toast } from 'react-toastify';

export function useShoppingList() {
  const { user } = useUser();
  const { editUserShoppingList, getUserShoppingList } = useUserRequests();
  const editUser = useEditUser();
  const queryClient = useQueryClient();

  const { data: shoppingList = [] } = useQuery([queryKeys.shoppingList], () =>
    getUserShoppingList(user._id, user.token)
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

  return { shoppingList, toggleItemObtained, addExtraShoppingItem };
}
