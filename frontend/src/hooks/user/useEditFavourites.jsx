import { useEditUser } from './useEditUser';

export function useEditFavourites(recipe, user) {
	const editUser = useEditUser()

  const onFavourite = () => {
    if (!user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: [...user.favouriteRecipes, recipe._id],
      });
    } else if (user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: user.favouriteRecipes.filter(
          (id) => id !== recipe._id
        ),
      });
    }
  };

  return onFavourite;
}
