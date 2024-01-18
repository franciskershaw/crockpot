import { Recipe } from '@/src/types/types';

import useUser from '@/src/hooks/auth/useUser';
import useRecipes from '@/src/hooks/recipes/useRecipes';

import EmptyState from '@/src/components/EmptyState/EmptyState';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';

const MyRecipes = () => {
	const { allRecipes } = useRecipes();
	const { user } = useUser();

	const myRecipes = user
		? allRecipes.filter((recipe: Recipe) => recipe.createdBy._id === user._id)
		: null;

	return (
		<>
			{myRecipes ? (
				<RecipeCardList recipes={myRecipes} fullWidth />
			) : (
				<EmptyState
					title="No recipes yet?"
					description="Click the plus button to add your own recipes to Your Crockpot."
				/>
			)}
		</>
	);
};

export default MyRecipes;
