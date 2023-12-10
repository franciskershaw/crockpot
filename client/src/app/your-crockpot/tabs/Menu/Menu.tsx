import Button from '@/src/components/Button/Button';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Modal from '@/src/components/Modal/Modal';

const Menu = () => {
	const { recipeMenuRecipes } = useRecipeMenu();

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
				<div className="container lg:w-1/3 lg:border-2 lg:border-black lg:rounded lg:pt-2 lg:mx-4 xl:ml-0 lg:my-0 lg:h-fit lg:max-h-[85vh] lg:overflow-scroll lg:sticky lg:top-[110px]">
					<div className="hidden lg:block">
						<ShoppingList />
					</div>
				</div>
				<div className="container lg:hidden">
					<RecipeCardList recipes={recipeMenuRecipes} fullWidth />
				</div>
				<div className="hidden container lg:block lg:w-2/3 lg:pl-4">
					<RecipeCardList recipes={recipeMenuRecipes} />
				</div>
			</div>
		</>
	);
};

export default Menu;
