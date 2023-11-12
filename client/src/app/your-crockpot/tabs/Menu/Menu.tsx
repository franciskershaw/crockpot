import Button from '@/src/components/Button/Button';
import useRecipeMenu from '../../hooks/useRecipeMenu';
import RecipeCardList from '@/src/components/RecipeCardList/RecipeCardList';
import ShoppingList from '../../components/ShoppingList/ShoppingList';
import Modal from '@/src/components/Modal/Modal';

const Menu = () => {
  const { recipeMenuRecipes } = useRecipeMenu();

  return (
    <div className={`xl:flex xl:mt-8 gap-4 mx-8`}>
      <div className={`flex justify-center my-3 xl:hidden`}>
        {/* Error caused by the Modal component and button below */}
        <Modal
          title={`Shopping List`}
          trigger={<Button border text='Shopping List' />}
        >
          <ShoppingList />
        </Modal>
      </div>
      <div className={`hidden xl:block w-1/3`}>
        <ShoppingList />
      </div>
      <div>
        <RecipeCardList recipes={recipeMenuRecipes} />
      </div>
    </div>
  );
};

export default Menu;
