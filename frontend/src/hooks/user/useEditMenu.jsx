import { useUser } from '../auth/useUser';
import { useEditUser } from './useEditUser';
import { useCurrentRecipe } from '../recipes/useCurrentRecipe';
import { useEffect, useState } from 'react';

export function useEditMenu() {
  const { recipe } = useCurrentRecipe();
  const { user } = useUser();
  const editUser = useEditUser();
  const [menuData, setMenuData] = useState({
    inMenu: false,
    serves: 4,
  });

  useEffect(() => {
    if (
      user &&
      recipe &&
      user.recipeMenu.length &&
      user.recipeMenu.find(
        (menuRecipe) =>
          menuRecipe._id === recipe._id && menuRecipe.serves !== menuData.serves
      )
    ) {
      setMenuData((prev) => ({
        ...prev,
        inMenu: true,
        serves: user.recipeMenu.find(
          (menuRecipe) => recipe._id === menuRecipe._id
        )['serves'],
      }));
    }
  }, [user, recipe]);

  useEffect(() => {
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
    }
  }, [menuData.serves]);

  const onClickMenu = () => {
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
    }
  };

  return { onClickMenu, menuData, setMenuData };
}
