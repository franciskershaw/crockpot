import useRecipes from '@/src/hooks/recipes/useRecipes';
import useFavourites from '@/src/hooks/users/useFavourites';

import EmptyState from '@/src/components/EmptyState/EmptyState';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';

const Favourites = () => {
	const { allRecipes } = useRecipes();
	const { favouriteRecipes } = useFavourites();

	const suggestedRecipes = allRecipes.slice(0, 3);

	return (
		<>
			{favouriteRecipes.length !== 0 ? (
				<RecipeCardList recipes={favouriteRecipes} fullWidth />
			) : (
				<>
					<EmptyState
						title="No favourites yet?"
						description="How about some of these? Click the heart button to add them to Your Crockpot."
					/>
					<RecipeCardList recipes={suggestedRecipes} fullWidth />
				</>
			)}
		</>
	);
};

export default Favourites;
