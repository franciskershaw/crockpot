import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../reactQuery/queryKeys.js';
import { useUserRequests } from '../queries/useUserRequests.jsx';

// Hook
export function useUser() {
  const queryClient = useQueryClient();
  const { getUser } = useUserRequests();

  const { data: user } = useQuery([queryKeys.user], () => {
    return getUser(user);
  });

  // called from useAuth
  function updateUser(newUser) {
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  // called from useAuth
  function clearUser() {
    // reset user to null
    queryClient.setQueryData([queryKeys.user], null);
  }

  return { user, updateUser, clearUser };
}
