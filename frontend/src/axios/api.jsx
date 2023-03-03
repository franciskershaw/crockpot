import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../reactQuery/queryKeys';
import { useNavigate } from 'react-router-dom';

const useAxios = () => {
  const api = axios.create();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (
        error.response.status === 401 &&
        (error.response.data.errorCode === 'SESSION_EXPIRED' ||
          error.response.data.errorCode === 'INVALID_TOKEN')
      ) {
        try {
          const originalRequest = error.config;
          const response = await api.get('/api/users/refreshToken');
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          queryClient.setQueryData([queryKeys.user], (oldData) => ({
            ...oldData,
            token: response.data.token,
          }));
          return api(originalRequest);
        } catch (err) {
          queryClient.setQueryData([queryKeys.user], null);
          navigate('/login');
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;
