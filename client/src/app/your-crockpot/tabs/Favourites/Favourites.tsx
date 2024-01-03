import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import useFavourites from '@/src/hooks/users/useFavourites';

const Favourites = () => {
	const { allRecipes } = useRecipes();
	const { favouriteRecipes } = useFavourites();

	const suggestedRecipes = allRecipes.slice(0, 4);

	return (
		<div className="pt-4 px-4">
			{favouriteRecipes.length !== 0 ? (
				<RecipeCardList recipes={favouriteRecipes} fullWidth />
			) : (
				<>
					<div className="text-center mb-4">
						<h2 className="mb-2">No favourites?</h2>
						<p className="h3 !leading-5">
							How about some of these? Click the heart button to add them to
							your list.
						</p>
					</div>
					<RecipeCardList recipes={suggestedRecipes} fullWidth />
				</>
			)}
		</div>
	);
};

export default Favourites;
