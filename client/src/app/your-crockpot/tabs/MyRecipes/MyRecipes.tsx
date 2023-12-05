import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import useUser from '@/src/hooks/auth/useUser';
import useRecipes from '@/src/hooks/recipes/useRecipes';

const MyRecipes = () => {
	const { allRecipes } = useRecipes();
	const { user } = useUser();

	const myRecipes = user
		? allRecipes.filter((recipe) => recipe.createdBy._id === user._id)
		: null;

	return (
		<div className="pt-4">
			{myRecipes ? (
				<RecipeCardList recipes={myRecipes} fullWidth />
			) : (
				<h2>YOUVE GOT NAY RECIPES</h2>
			)}
		</div>
	);
};

export default MyRecipes;
