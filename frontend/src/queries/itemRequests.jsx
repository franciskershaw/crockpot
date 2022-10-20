import axios from 'axios';

export const fetchAllItems = async () => {
  const response = await axios.get(`/api/items`);

  return response.data;
};

export const fetchAllItemCategories = async () => {
  const response = await axios.get(`/api/itemCategories`);

  return response.data;
};
