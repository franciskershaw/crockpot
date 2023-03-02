import { toast } from 'react-toastify';
import { useUser } from './useUser';
import useAxios from '../../axios/api';

export function useAuth() {
  const { clearUser, updateUser } = useUser();
  const api = useAxios()

  const signin = async (userData) => {
    try {
      const response = await api.post('/api/users/login', userData);
      updateUser(response.data);
      toast.success(`Logged in as ${response.data.username}`);
      return response.data;
    } catch (err) {
      toast.error(err.response.data.message);
      return null;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await api.post('/api/users/', userData);
      updateUser(response.data);
      toast.success(`Logged in as ${response.data.username}`);
      return response.data;
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
      return null;
    }
  };

  const signout = () => {
    clearUser();
    toast.info('You have successfully logged out');
  };

  return {
    signin,
    signup,
    signout,
  };
}
