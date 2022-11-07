import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useState } from 'react';
// import { useUser } from '../auth/useUser';

export function useGenerateShoppingList() {

  const [shoppingList, setShoppingList] = useState([]);

  const generateShoppingList = (user) => {
    for (let recipe of user.recipeMenu) {
			console.log(recipe)
		}
  };

  return { generateShoppingList };
}
