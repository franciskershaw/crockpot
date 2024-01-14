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
				<RecipeCardList recipes={myRecipes} fullWidth />
			) : (
				<div className='text-center mb-4'>
					<h2 className='mb-2'>No recipes yet?</h2>
					<p className='h3 !leading-5'>
						Click the plus button to add your own recipes to Your Crockpot.
					</p>
				</div>
			)}
		</div>
	);
};

export default MyRecipes;
