import { useQuery, useQueryClient } from '@tanstack/react-query';
import useAxios from '../axios/api.jsx';
import { queryKeys } from '../../reactQuery/queryKeys.js';
import { useUserRequests } from '../queries/useUserRequests.jsx';

// Hook
export function useUser() {
  const api = useAxios();
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
  async function clearUser() {
    console.log('Clearing refreshToken cookie...');
    // Make a POST request to the logout endpoint
    const logout = await api.post('/api/users/logout');
    if (logout.status === 200) {
      console.log('refreshToken cookie cleared.');
      // Reset user to null
      queryClient.setQueryData([queryKeys.user], null);
    } else {
      console.error('Error clearing refreshToken cookie:', error);
    }
  }

  return { user, updateUser, clearUser };
}
