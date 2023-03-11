import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../axios/useAxios.jsx';
import { queryKeys } from '../../reactQuery/queryKeys.js';
import { useUserRequests } from '../queries/useUserRequests.jsx';

// Hook
export function useUser() {
  const api = useAxios();
  const queryClient = useQueryClient();
  const { getUser } = useUserRequests();

  const { data: user, isFetching: fetchingUser } = useQuery(
    [queryKeys.user],
    () => getUser(user)
  );

  // called from useAuth
  function updateUser(newUser) {
    queryClient.setQueryData([queryKeys.user], newUser);
  }

  // called from useAuth
  async function clearUser() {
    // Make a POST request to the logout endpoint
    const logout = await api.post('/api/users/logout');
    if (logout.status === 200) {
      // Reset user to null
      queryClient.setQueryData([queryKeys.user], null);
    } else {
      console.error('Error clearing refreshToken cookie:', error);
    }
  }

  return { user, fetchingUser, updateUser, clearUser };
}
