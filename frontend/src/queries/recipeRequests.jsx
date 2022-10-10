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