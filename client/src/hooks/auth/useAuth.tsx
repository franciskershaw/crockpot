import { mutate } from 'swr';
import useAxios from '../axios/useAxios';

const useAuth = () => {
  const api = useAxios();

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await api.post('/api/users/login', credentials, {
        withCredentials: true,
      });
      mutate('/api/users', response.data, false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (data: { username: string; password: string }) => {
    try {
      const response = await api.post('/api/users', data);
      mutate('/api/users', response.data, false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post('/api/users/logout');
      mutate('/api/users', null, false);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return { login, register, logout };
};

export default useAuth;
