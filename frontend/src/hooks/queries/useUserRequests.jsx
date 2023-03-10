import useAxios from '../axios/api';
import { createConfig } from './helper';

export const useUserRequests = () => {
  const api = useAxios();

  const getUser = async (user) => {
    if (!user) {
      try {
        const response = await api.get(`/api/users/refreshToken`);
        if (response.status === 200) {
          const config = createConfig(response.data.token)
          const user = await api.get(`/api/users/${response.data._id}`, config)
          return user.data
        }
      } catch (error) {
        return null;
      }
    } else {
      const config = createConfig(user.token);
      const response = await api.get(`/api/users/${user.id}`, config);
      return response.data;
    }
  };

  const editUser = async (id, token, body) => {
    const config = createConfig(token);
    const response = await api.put(`/api/users/${id}`, body, config);
    return response.data;
  };

  const editUserShoppingList = async (id, token, body) => {
    const config = createConfig(token);
    const response = await api.put(
      `/api/users/${id}/shoppingList`,
      body,
      config
    );
    return response.data;
  };

  const getUserRecipeMenu = async (id, token) => {
    const config = createConfig(token);
    const response = await api.get(`/api/users/${id}/recipeMenu`, config);
    return response.data;
  };

  const getUserShoppingList = async (id, token) => {
    const config = createConfig(token);
    const response = await api.get(`/api/users/${id}/shoppingList`, config);
    return response.data;
  };

  const getUserFavourites = async (id, token) => {
    const config = createConfig(token);
    const response = await api.get(`/api/users/${id}/favourites`, config);
    return response.data;
  };

  return {
    getUser,
    editUser,
    editUserShoppingList,
    getUserRecipeMenu,
    getUserShoppingList,
    getUserFavourites,
  };
};