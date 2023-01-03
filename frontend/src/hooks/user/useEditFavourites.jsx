import { useEditUser } from './useEditUser';
import { toast } from 'react-toastify';

export function useEditFavourites(recipe, user) {
	const editUser = useEditUser()

  const onFavourite = () => {
    if (!user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: [...user.favouriteRecipes, recipe._id],
      });
      toast.success(`${recipe.name} added to Favourites`)
    } else if (user.favouriteRecipes.includes(recipe._id)) {
      editUser({
        favouriteRecipes: user.favouriteRecipes.filter(
          (id) => id !== recipe._id
        ),
      });
      toast.success(`${recipe.name} removed from Favourites`)
    }
  };

  return onFavourite;
}
