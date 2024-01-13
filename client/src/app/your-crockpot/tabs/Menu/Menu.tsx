import Button from '@/src/components/Button/Button';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Modal from '@/src/components/Modal/Modal';
import useRecipes from '@/src/hooks/recipes/useRecipes';
import EmptyState from '@/src/components/EmptyState/EmptyState';

const Menu = () => {
	const { allRecipes } = useRecipes();
	const { recipeMenuRecipes } = useRecipeMenu();

	const suggestedRecipes = allRecipes.slice(0, 4);

	return (
		<>
			<div className="container flex justify-center space-x-4 py-4 bg-white/90 sticky top-[74px] z-searchBar lg:hidden">
				<Modal
					title={`Shopping List`}
					trigger={<Button type="primary" border text="Shopping List" />}
				>
					<ShoppingList />
				</Modal>
				<Button type="primary" border text="Clear Menu" />
			</div>
			<div className="container !px-0 lg:flex lg:pt-4">
				<div className="container lg:w-1/3 lg:border-2 lg:border-black lg:rounded lg:pt-2 lg:mx-4 xl:ml-0 lg:my-0 lg:h-fit lg:max-h-[85vh] lg:overflow-scroll lg:sticky lg:top-[110px] xl:px-4">
					<div className="hidden lg:block">
						<ShoppingList />
					</div>
				</div>
				<div className="lg:hidden">
					{recipeMenuRecipes.length !== 0 ? (
						<RecipeCardList recipes={recipeMenuRecipes} />
					) : (
						<>
							<EmptyState
								title="Nothing on the menu yet?"
								description="How about some of these? Click the shopping cart button to add them to Your Crockpot."
							/>
							<RecipeCardList recipes={suggestedRecipes} />
						</>
					)}
				</div>
				<div className="hidden container lg:block lg:w-2/3 lg:pl-4">
					{recipeMenuRecipes.length !== 0 ? (
						<RecipeCardList recipes={recipeMenuRecipes} />
					) : (
						<>
							<EmptyState
								title="Nothing on the menu yet?"
								description="How about some of these? Click the shopping cart button to add them to Your Crockpot."
							/>
							<RecipeCardList recipes={suggestedRecipes} />
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Menu;
