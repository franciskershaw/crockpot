import { useMemo } from 'react';

import { MenuRecipe } from '@/types/types';

import useRecipeMenu from '../../hooks/useRecipeMenu';
import useRecipes from '@/hooks/recipes/useRecipes';

import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Button from '@/components/Button/Button';
import EmptyState from '@/components/EmptyState/EmptyState';
import Modal from '@/components/Modal/Modal';
import OpenModal from '@/components/Modal/OpenModal';
import RecipeCardList from '@/components/RecipeCardList/RecipeCardList';

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
					<OpenModal name="ShoppingList">
						<Button type="primary" text="Shopping List" />
					</OpenModal>
					{recipeMenu.length ? (
						<Button
							onClick={() => updateRecipeMenu({ type: 'clear' })}
							type="primary"
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
			<Modal title="Shopping List" name="ShoppingList">
				<ShoppingList />
			</Modal>
		</div>
	);
};

export default Menu;
