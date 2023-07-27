import useAxios from './useAxios';

export function useAuth() {
  const api = useAxios();

  const login = async (data: { username: string; password: string }) => {
    try {
      const user = await api.post('/api/users/login', data);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  };

  const register = async (data: { username: string; password: string }) => {
    try {
      const user = await api.post('/api/users', data);
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  return { login, register };
}
