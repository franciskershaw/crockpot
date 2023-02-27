import api from '../axios/api';

export const fetchAllItems = async () => {
  const response = await api.get(`/api/items`);

  return response.data;
};

export const fetchAllItemCategories = async () => {
  const response = await api.get(`/api/itemCategories`);

  return response.data;
};

export const addNewItem = async (token, formData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await api.post(`/api/items`, formData, config);
  return response.data;
};

// export const addNewRecipe = async (token, formData) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'multipart/form-data',
//     },
//   };

//   const response = await api.post(`/api/recipes`, formData, config);

//   return response.data;
// };
