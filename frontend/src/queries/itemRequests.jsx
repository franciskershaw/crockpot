import api from '../axios/api';

export const fetchAllItems = async () => {
  const response = await api.get(`/api/items`);

  return response.data;
};

export const fetchAllItemCategories = async () => {
  const response = await api.get(`/api/itemCategories`);

  return response.data;
};
