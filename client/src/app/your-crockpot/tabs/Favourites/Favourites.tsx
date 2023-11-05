import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useFavourites from '@/src/hooks/users/useFavourites';

const Favourites = () => {
	const { favouriteRecipes } = useFavourites();
	console.log(favouriteRecipes);

	return (
		<div>
			{favouriteRecipes.length !== 0 ? (
				<RecipeCardList recipes={favouriteRecipes} />
			) : (
				<h2>YOUVE GOT NAY RECIPES</h2>
			)}
		</div>
	);
};

export default Favourites;
