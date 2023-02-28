import api from '../axios/api';

// Get user info
export const getUser = async (user) => {
  if (!user) return null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const response = await api.get(`/api/users/${user.id}`, config);
  return response.data;
};
