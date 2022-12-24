import axios from 'axios';

export const fetchSingleUser = async (id) => {
  const response = await axios.get(`/api/users/${id}`);

  return response.data;
};

export const editUser = async (id, token, body) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  const response = await axios.put(`/api/users/${id}`, body, config);

  return response.data;
};

export const getUserRecipeMenu = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`/api/users/${id}/recipeMenu`, config);

  return response.data;
};

export const getUserShoppingList = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`/api/users/${id}/shoppingList`, config);

  return response.data;
};
