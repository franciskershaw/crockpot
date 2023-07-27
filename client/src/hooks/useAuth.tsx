import { mutate } from 'swr';
import useAxios from './useAxios';

export function useLogin() {
  const api = useAxios();

  const login = async (data: { username: string; password: string }) => {
    // Use mutate to optimistically update the UI, then make a POST request to login.
    mutate('/api/login', data, false);
    try {
      const result = await api.post('/api/users/login', data);
      console.log(result);
      mutate('/api/login', result.data);
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error...
    }
  };

  return { login };
}
