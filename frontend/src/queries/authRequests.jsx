import axios from 'axios'

// Get user info
export const getUser = async (user, signal) => {
  if (!user) return null;
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
    signal,
  };
  const response = await axios.get(`/api/users/${user.id}`, config);
  return response.data;
};