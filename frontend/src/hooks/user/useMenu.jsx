import { useUser } from '../auth/useUser';
import { useQuery } from '@tanstack/react-query';
import { getUserRecipeMenu } from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

export function useMenu() {
  const { user } = useUser();
  const fallback = [];
  const { data: recipeMenu = fallback } = useQuery([queryKeys.recipeMenu], () =>
    getUserRecipeMenu(user._id, user.token)
  );

  return { recipeMenu };
}
