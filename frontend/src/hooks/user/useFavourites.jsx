import { useUser } from '../auth/useUser';
import { useQuery } from '@tanstack/react-query';
import { useUserRequests } from '../../queries/userRequests';
import { queryKeys } from '../../reactQuery/queryKeys';

export function useFavourites() {
  const { user } = useUser();
  const { getUserFavourites } = useUserRequests();

  const fallback = [];
  const { data: favourites = fallback } = useQuery([queryKeys.favourites], () =>
    getUserFavourites(user._id, user.token)
  );

  return { favourites };
}
