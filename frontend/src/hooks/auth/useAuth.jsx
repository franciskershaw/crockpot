import { toast } from 'react-toastify';
import { useUser } from './useUser';
import axios from 'axios';

export function useAuth() {
  const { clearUser, updateUser } = useUser();

  const signin = async (userData) => {
    try {
      const response = await axios.post('/api/users/login', userData);

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      updateUser(response.data);
      toast.info(`Logged in as ${response.data.username}`);
      return response.data;

    } catch (err) {
      toast.error(err.response.data.message)
    }
  };

  const signup = async (userData) => {
    const response = await axios.post('/api/users/', userData);

    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    updateUser(response.data);
    toast.info(`Logged in as ${response.data.username}`);
    return response.data;
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
