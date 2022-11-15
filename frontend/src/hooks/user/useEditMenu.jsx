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
          // const shoppingList = generateShoppingList(user.shoppingList, 'editServes', [recipe._id, menuData.serves])
          editUser({
            recipeMenu: user.recipeMenu.map((menuRecipe) => {
              if (menuRecipe._id === recipe._id) {
                return { ...menuRecipe, serves: menuData.serves };
              }
              return menuRecipe;
            }),
          });
        }
      }
    }
  }, [menuData.serves]);

  const generateShoppingList = (prevShoppingList, method, newRecipe) => {
    let shoppingList = [...prevShoppingList];
    // Needs to return an array of objects: IDs, quantities, units, obtained
    console.log('Generating shopping list...');
    console.log('previous shoppingList:', prevShoppingList);
    console.log('method:', method);
    console.log('recipe:', newRecipe);

    if (method === 'add') {
      if (!prevShoppingList.length) {
        for (let ingredient of newRecipe.ingredients) {
          shoppingList.push({
            _id: ingredient._id,
            quantity: ingredient.quantity * newRecipe.serves,
            unit: ingredient.unit,
            obtained: false,
          });
        }
      } else {
        let attemptAtNewShoppingList = [] 
        newRecipe.ingredients.forEach((ingredient) => {
          attemptAtNewShoppingList = shoppingList.map(item => {
              if (item._id === ingredient._id) {
                console.log(item)
                console.log(ingredient)
                return ingredient
              }
            })
          }
        );
        console.log('Attempt:', attemptAtNewShoppingList);
      }
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
        // shoppingList
      });
      setMenuData((prev) => ({
        ...prev,
        inMenu: false,
      }));
    }
  };

  return { onClickMenu, menuData, setMenuData };
}
