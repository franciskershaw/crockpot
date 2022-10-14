import axios from 'axios';

export const fetchAllRecipeCategories = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`/api/recipeCategories`, config);

  return response.data;
};

export const addNewRecipe = async (token, formData) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }

  const response = await axios.post(`/api/recipes`, formData, config)

  return response.data
}