import useSWR from 'swr';
import useAxios from '../axios/useAxios';
import swrOptions from '@/src/swr/swrOptions';

const useUser = () => {
  const api = useAxios();

  const getUser = async () => {
    const response = await api.get('/api/users/refreshToken');
    if (response.status === 200) {
      const user = await api.get('/api/users', {
        headers: {
          Authorization: `Bearer ${response.data.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return user.data;
    }
  };

  const { data, error, isLoading } = useSWR('/api/users', getUser, swrOptions);

  if (data) {
    return {
      user: data,
      isLoading,
      error,
    };
  }
  return {
    user: null,
  };
};

export default useUser;
