import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useCurrentRecipe } from '../recipes/useCurrentRecipe';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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
      toast.success(`${recipe.name} serves amount amended.`)
    }
  }, [menuData.serves]);

  const onClickMenu = () => {
    // Adds recipe into menu
    if (!menuData.inMenu) {
      editUser({
        recipeMenu: [
          ...user.recipeMenu,
          {
            _id: recipe._id,
            serves: menuData.serves,
          },
        ],
      });
      setMenuData((prev) => ({
        ...prev,
        inMenu: true,
      }));
      toast.success(`${recipe.name} added to menu`);

      // Removes recipe from menu
    } else if (menuData.inMenu) {
      editUser({
        recipeMenu: user.recipeMenu.filter(
          (menuRecipe) => menuRecipe._id !== recipe._id
        ),
      });
      setMenuData((prev) => ({
        ...prev,
        inMenu: false,
      }));
      toast.success(`${recipe.name} removed from menu`)
    }
  };

  return { onClickMenu, menuData, setMenuData };
}
