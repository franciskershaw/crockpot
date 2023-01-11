import axios from 'axios';
import url from '../reactQuery/url';

export const fetchAllRecipes = async () => {
  const response = await axios.get(`${url}/api/recipes`);

  return response.data;
};

export const fetchSingleRecipe = async (recipeId) => {
  const response = await axios.get(`${url}/api/recipes/${recipeId}`);

  return response.data;
};

export const fetchAllRecipeCategories = async () => {
  const response = await axios.get(`${url}/api/recipeCategories`);

  return response.data;
};

export const addNewRecipe = async (token, formData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axios.post(`${url}/api/recipes`, formData, config);

  return response.data;
};
