import Button from '@/src/components/Button/Button';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Modal from '@/src/components/Modal/Modal';

const Menu = () => {
	const { recipeMenuRecipes } = useRecipeMenu();

	return (
		<>
			<div className="container flex justify-center space-x-4 py-4 bg-white/90 sticky top-[74px] z-searchBar md:hidden">
				<Modal
					title={`Shopping List`}
					trigger={<Button type="primary" border text="Shopping List" />}
				>
					<ShoppingList />
				</Modal>
				<Button type="primary" border text="Clear Menu" />
			</div>
			<div className="container !px-0 md:flex md:pt-4">
				<div className="container md:w-1/3 md:border-2 md:border-black md:rounded md:pt-2 md:mx-4 xl:ml-0 md:my-0 md:h-fit md:max-h-[85vh] md:overflow-scroll md:sticky md:top-[110px]">
					<div className="hidden md:block">
						<ShoppingList />
					</div>
				</div>
				<div className="container md:w-2/3 md:pl-4">
					<RecipeCardList recipes={recipeMenuRecipes} />
				</div>
			</div>
		</>
	);
};

export default Menu;
