import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useFavourites from '@/src/hooks/users/useFavourites';

const Favourites = () => {
	const { favouriteRecipes } = useFavourites();

	return (
		<div>
			<RecipeCardList recipes={favouriteRecipes} />
		</div>
	);
};

export default Favourites;
