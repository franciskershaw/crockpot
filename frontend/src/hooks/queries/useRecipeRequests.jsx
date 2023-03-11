import useAxios from '../axios/useAxios';
import { createConfig } from './helper';

export const useRecipeRequests = () => {
  const api = useAxios()

  const fetchAllRecipes = async () => {
    const response = await api.get(`/api/recipes`);
    return response.data;
  };

  const fetchSingleRecipe = async (recipeId) => {
    const response = await api.get(`/api/recipes/${recipeId}`);
    return response.data;
  };

  const fetchAllRecipeCategories = async () => {
    const response = await api.get(`/api/recipeCategories`);
    return response.data;
  };

  const addNewRecipe = async (token, formData) => {
    const config = createConfig(token);
    const response = await api.post(`/api/recipes`, formData, config);
    return response.data;
  };

  return {
    fetchAllRecipes,
    fetchSingleRecipe,
    fetchAllRecipeCategories,
    addNewRecipe,
  };
};
