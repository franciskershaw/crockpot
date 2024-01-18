import useRecipeMenu from '../../hooks/useRecipeMenu';
import useRecipes from '@/src/hooks/recipes/useRecipes';

import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Button from '@/src/components/Button/Button';
import EmptyState from '@/src/components/EmptyState/EmptyState';
import Modal from '@/src/components/Modal/Modal';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';

const Menu = () => {
	const { allRecipes } = useRecipes();
	const { recipeMenuRecipes, recipeMenu, updateRecipeMenu } = useRecipeMenu();

	const suggestedRecipes = allRecipes.slice(0, 4);

	return (
		<div className="container--1-2">
			<div className="hidden md:block relative">
				<div className="bg-white/90 sticky top-0 left-0 right-0 z-searchBar border border-black">
					<ShoppingList />
				</div>
			</div>
			<div className="relative">
				<div className="bg-white/90 sticky top-0 left-0 right-0 p-3 z-searchBar flex justify-center space-x-4 md:hidden">
					<Modal
						title={`Shopping List`}
						trigger={<Button type="primary" border text="Shopping List" />}
					>
						<ShoppingList />
					</Modal>
					{recipeMenu.length ? (
						<Button
							onClick={() => updateRecipeMenu({ type: 'clear' })}
							type="primary"
							border
							text="Clear Menu"
						/>
					) : null}
				</div>
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
	);
};

export default Menu;
