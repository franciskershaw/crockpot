import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../reactQuery/queryKeys.js';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../reactQuery/userStorage.js';
import { getUser } from '../../queries/authRequests.jsx';

// Hook
export function useUser() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery(
    [queryKeys.user],
    ({ signal }) => getUser(user, signal),
    {
      initialData: getStoredUser,
      onSuccess: (received) => {
        if (!received) {
          clearStoredUser();
        } else {
          setStoredUser(received);
        }
      },
    }
  );

  // called from useAuth
  function updateUser(newUser) {
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  // called from useAuth
  function clearUser() {
    // reset user to null
    queryClient.setQueryData([queryKeys.user], null);
    clearStoredUser();
  }

  return { user, updateUser, clearUser };
}
