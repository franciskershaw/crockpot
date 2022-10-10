import axios from 'axios';

export const fetchAllItemCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`/api/itemCategories`, config);

  return response.data;
};