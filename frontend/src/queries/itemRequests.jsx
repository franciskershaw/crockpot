import axios from 'axios';

export const fetchAllItems = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`/api/items`, config);

  return response.data;
};

export const fetchAllItemCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`/api/itemCategories`, config);

  return response.data;
};
