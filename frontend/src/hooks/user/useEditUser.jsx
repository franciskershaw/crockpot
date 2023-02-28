import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editUser } from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';
import { useUser } from '../auth/useUser';
import { toast } from 'react-toastify';

// Hook
export function useEditUser() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (body) => editUser(user._id, user.token, body),
    {
      onSuccess: (response, variables) => {
        // Update user in query cache
        const key = Object.keys(variables)[0];
        queryClient.setQueryData([queryKeys.user], (prevUserData) => {
          const newUserData = prevUserData;
          newUserData[key] = response[key];
          if (key === 'recipeMenu') {
            newUserData.shoppingList = response.shoppingList;
          }
          return newUserData;
        });
        // Ensure favourites, menu and shopping list are also updated
        if (variables.favouriteRecipes) {
          queryClient.refetchQueries([queryKeys.favourites]);
        } else if (variables.recipeMenu) {
          queryClient.refetchQueries([queryKeys.recipeMenu]);
          queryClient.refetchQueries([queryKeys.shoppingList]);
        } else if (variables.extraItems) {
          queryClient.refetchQueries([queryKeys.shoppingList]);
        }
      },
      onError: (data) => {
        console.log(data);
        toast.error(data);
      },
    }
  );

  return mutate;
}
