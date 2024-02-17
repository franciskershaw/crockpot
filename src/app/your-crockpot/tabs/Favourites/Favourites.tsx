import useRecipes from '@/hooks/recipes/useRecipes';
import useFavourites from '@/hooks/users/useFavourites';

import EmptyState from '@/components/EmptyState/EmptyState';
import RecipeCardList from '@/components/RecipeCardList/RecipeCardList';

const Favourites = () => {
	const { shuffledRecipes } = useRecipes();
	const { favouriteRecipes } = useFavourites();

	const suggestedRecipes = shuffledRecipes.slice(0, 4);

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
