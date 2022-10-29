import axios from 'axios';

export const fetchSingleUser = async (id) => {
  const response = await axios.get(`/api/users/${id}`);

  return response.data;
};
