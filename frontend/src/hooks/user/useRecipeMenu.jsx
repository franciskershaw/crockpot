import { useUser } from '../auth/useUser';
import { useQuery } from '@tanstack/react-query';
import { useUserRequests } from '../queries/useUserRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

export function useRecipeMenu() {
  const { user } = useUser();
  const { getUserRecipeMenu } = useUserRequests();

  const { data: recipeMenu = [] } = useQuery([queryKeys.recipeMenu], () =>
    getUserRecipeMenu(user._id, user.token)
  );

  return recipeMenu;
}
