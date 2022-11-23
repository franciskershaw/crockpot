import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useCurrentRecipe } from '../recipes/useCurrentRecipe';
import { useEffect, useState } from 'react';

export function useEditMenu(recipeId) {
  const { recipe } = useCurrentRecipe(recipeId);
  const { user } = useUser();
  const editUser = useEditUser();
  const [menuData, setMenuData] = useState({
    inMenu: false,
    serves: 4,
  });

  useEffect(() => {
    // Sets menuData state when mounting a recipe component
    if (
      user &&
      recipe &&
      user.recipeMenu.length &&
      user.recipeMenu.find((menuRecipe) => menuRecipe._id === recipe._id)
    ) {
      setMenuData((prev) => ({
        ...prev,
        inMenu: true,
        serves: user.recipeMenu.find(
          (menuRecipe) => recipe._id === menuRecipe._id
        )['serves'],
      }));
    }
  }, [user, recipe, recipeId]);

  useEffect(() => {
    // Edits menu when user clicks on the serves input if recipe is in menu already
    if (user && menuData.inMenu) {
      for (let menuRecipe of user.recipeMenu) {
        if (
          menuRecipe._id === recipe._id &&
          menuRecipe.serves !== menuData.serves
        ) {
          const shoppingList = generateShoppingList(user.shoppingList, 'amendServes', {
            ingredients: recipe.ingredients,
            serves: menuData.serves,
          })
          editUser({
            recipeMenu: user.recipeMenu.map((menuRecipe) => {
              if (menuRecipe._id === recipe._id) {
                return { ...menuRecipe, serves: menuData.serves };
              }
              return menuRecipe;
            }),
            shoppingList
          });
        }
      }
    }
  }, [menuData.serves]);

  const generateShoppingList = (prevShoppingList, method, newRecipe) => {
    let shoppingList = [];
    // Needs to return an array of objects: IDs, quantities, units, obtained
    console.log('-----------------------------');
    console.log('Generating shopping list...');
    console.log('previous shoppingList:', prevShoppingList);
    console.log('method:', method);
    console.log('recipe:', newRecipe);
    if (method === 'add') {
      for (let ingredient of newRecipe.ingredients) {
        let existingItem = prevShoppingList.find((item) => item._id === ingredient._id);
        if (existingItem) {
          existingItem.quantity = existingItem.quantity + (ingredient.quantity * newRecipe.serves);
          shoppingList.push(existingItem);
        } else if (!existingItem) {
          shoppingList.push({
            _id: ingredient._id,
            quantity: ingredient.quantity * newRecipe.serves,
            unit: ingredient.unit,
            obtained: false,
          });
        }
      }
      for (let item of prevShoppingList) {
        if (!newRecipe.ingredients.find((ingredient) => ingredient._id === item._id)) {
          shoppingList.push(item);
        }
      }
    } else if (method === 'remove') {
      prevShoppingList.forEach((item) => {
        let itemToBeAmended = newRecipe.ingredients.find(ingredient => ingredient._id === item._id)
        if (itemToBeAmended) {
          item.quantity = item.quantity - (itemToBeAmended.quantity * newRecipe.serves)
          if (item.quantity !== 0) {
            shoppingList.push(item)
          }     
        } else {
          shoppingList.push(item)
        }
      })
    } else if (method === 'amendServes') {
      let temp = prevShoppingList.map((item) => {
        return item
      })
      console.log(temp)
    }
    console.log(shoppingList);
    console.log('-----------------------------');
    return shoppingList;
  };

  const onClickMenu = () => {
    // Adds recipe into menu
    if (!menuData.inMenu) {
      const shoppingList = generateShoppingList(user.shoppingList, 'add', {
        ingredients: recipe.ingredients,
        serves: menuData.serves,
      });
      editUser({
        recipeMenu: [
          ...user.recipeMenu,
          {
            _id: recipe._id,
            serves: menuData.serves,
          },
        ],
        shoppingList,
      });
      setMenuData((prev) => ({
        ...prev,
        inMenu: true,
      }));

      // Removes recipe from menu
    } else if (menuData.inMenu) {
      const shoppingList = generateShoppingList(user.shoppingList, 'remove', {
        ingredients: recipe.ingredients,
        serves: menuData.serves,
      });
      editUser({
        recipeMenu: user.recipeMenu.filter(
          (menuRecipe) => menuRecipe._id !== recipe._id
        ),
        shoppingList,
      });
      setMenuData((prev) => ({
        ...prev,
        inMenu: false,
      }));
    }
  };

  return { onClickMenu, menuData, setMenuData };
}
