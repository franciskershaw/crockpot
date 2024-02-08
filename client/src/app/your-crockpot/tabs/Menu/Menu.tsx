import { useMemo } from 'react';

import { MenuRecipe } from '@/src/types/types';

import useRecipeMenu from '../../hooks/useRecipeMenu';
import useRecipes from '@/src/hooks/recipes/useRecipes';

import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Button from '@/src/components/Button/Button';
import EmptyState from '@/src/components/EmptyState/EmptyState';
import Modal from '@/src/components/Modal/Modal';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';

const Menu = () => {
	const { allRecipes } = useRecipes();
	const { recipeMenu, updateRecipeMenu } = useRecipeMenu();

	const suggestedRecipes = useMemo(() => {
		return allRecipes.slice(0, 4);
	}, [allRecipes]);

	return (
		<div className="container--1-2">
			<div className="container--1-2__1">
				<div className="container--1-2__1__sticky-menu">
					<ShoppingList />
				</div>
			</div>
			<div className="container--1-2__2">
				<div className="container--1-2__2__sticky-menu p-3 flex justify-center space-x-4 md:hidden">
					<Modal
						title="Shopping List"
						trigger={<Button type="secondary" text="Shopping List" />}
						size="sm"
					>
						<ShoppingList />
					</Modal>
					{recipeMenu.length ? (
						<Button
							onClick={() => updateRecipeMenu({ type: 'clear' })}
							type="secondary"
							text="Clear Menu"
						/>
					) : null}
				</div>
				{recipeMenu.length !== 0 ? (
					<RecipeCardList
						recipes={recipeMenu.map((recipe: MenuRecipe) => recipe.recipe)}
					/>
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
