import useAxios from '../axios/api';
import { createConfig } from './helper';

export const useItemRequests = () => {
  const api = useAxios()
  const fetchAllItems = async () => {
    const response = await api.get(`/api/items`);
    return response.data;
  };

  const fetchAllItemCategories = async () => {
    const response = await api.get(`/api/itemCategories`);
    return response.data;
  };

  const addNewItem = async (token, formData) => {
    const config = createConfig(token);
    const response = await api.post(`/api/items`, formData, config);
    return response.data;
  };

  return { fetchAllItems, fetchAllItemCategories, addNewItem };
};
