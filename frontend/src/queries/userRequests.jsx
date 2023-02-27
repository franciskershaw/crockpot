import api from '../axios/api';

export const editUser = async (id, token, body) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await api.put(`/api/users/${id}`, body, config);

  return response.data;
};

export const editUserShoppingList = async (id, token, body) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await api.put(
    `/api/users/${id}/shoppingList`,
    body,
    config
  );

  return response.data;
};

export const getUserRecipeMenu = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/api/users/${id}/recipeMenu`, config);

  return response.data;
};

export const getUserShoppingList = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/api/users/${id}/shoppingList`, config);

  return response.data;
};

export const getUserFavourites = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.get(`/api/users/${id}/favourites`, config);

  return response.data;
};
