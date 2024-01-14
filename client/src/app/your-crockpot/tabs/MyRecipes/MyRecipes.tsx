import EmptyState from '@/src/components/EmptyState/EmptyState';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useUser from '@/src/hooks/auth/useUser';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import { Recipe } from '@/src/types/types';

const MyRecipes = () => {
	const { allRecipes } = useRecipes();
	const { user } = useUser();

	const myRecipes = user
		? allRecipes.filter((recipe: Recipe) => recipe.createdBy._id === user._id)
		: null;

	return (
		<div className='pt-4 px-4'>
			{myRecipes ? (
				<RecipeCardList recipes={myRecipes} />
			) : (
				<EmptyState
					title="No recipes yet?"
					description="Click the plus button to add your own recipes to Your Crockpot."
				/>
			)}
		</div>
	);
};

export default MyRecipes;
