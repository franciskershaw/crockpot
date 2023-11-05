import Button from '@/src/components/Button/Button';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import useFavourites from '@/src/hooks/users/useFavourites';

const Favourites = () => {
	const { favouriteRecipes } = useFavourites();
	console.log(favouriteRecipes);

	return (
		<div>
			<RecipeCardList recipes={favouriteRecipes} />
		</div>
	);
};

export default Favourites;
