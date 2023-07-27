import { mutate } from 'swr';
import useAxios from '../axios/useAxios';

export function useAuth() {
  const api = useAxios();

  const login = async (data: { username: string; password: string }) => {
    try {
      const user = await api.post('/api/users/login', data);
      console.log(user);
      mutate('/api/users/login', user, false); // update the local data immediately, but disable revalidation
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (data: { username: string; password: string }) => {
    try {
      const user = await api.post('/api/users', data);
      console.log(user);
      mutate('/api/users', user, false); // update the local data immediately, but disable revalidation
    } catch (error) {
      console.log(error);
    }
  };

  return { login, register };
}
