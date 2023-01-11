import axios from 'axios';
import url from '../reactQuery/url';

export const fetchAllItems = async () => {
  const response = await axios.get(`${url}/api/items`);

  return response.data;
};

export const fetchAllItemCategories = async () => {
  const response = await axios.get(`${url}/api/itemCategories`);

  return response.data;
};
