import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useFavourites from '@/src/hooks/users/useFavourites';

const Favourites = () => {
	const { favouriteRecipes } = useFavourites();

	return (
		<div className="pt-4 px-4">
			{favouriteRecipes.length !== 0 ? (
				<RecipeCardList recipes={favouriteRecipes} fullWidth />
			) : (
				<h2>YOUVE GOT NAY RECIPES</h2>
			)}
		</div>
	);
};

export default Favourites;
