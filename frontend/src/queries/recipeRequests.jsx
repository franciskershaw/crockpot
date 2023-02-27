import api from '../axios/api';

export const fetchAllRecipes = async () => {
  const response = await api.get(`/api/recipes`);

  return response.data;
};

export const fetchSingleRecipe = async (recipeId) => {
  const response = await api.get(`/api/recipes/${recipeId}`);

  return response.data;
};

export const fetchAllRecipeCategories = async () => {
  const response = await api.get(`/api/recipeCategories`);

  return response.data;
};

export const addNewRecipe = async (token, formData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await api.post(`/api/recipes`, formData, config);

  return response.data;
};
