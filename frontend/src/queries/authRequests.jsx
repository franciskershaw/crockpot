import api from '../axios/api';

// Get user info
export const getUser = async (user, signal) => {
  if (!user) return null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    signal,
  };
  const response = await api.get(`/api/users/${user.id}`, config);
  return response.data;
};
