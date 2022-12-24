import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from '../../hooks/user/useMenu';
import { useItemCategories } from '../../hooks/items/useItemCategories';

const MenuPage = () => {
  const { recipeMenu, shoppingList } = useMenu();
  const { itemCategories } = useItemCategories();
  console.log('menu', recipeMenu);
  console.log('shoppingList', shoppingList);
	console.log('categories', itemCategories)
  return (
    <>
      <Header title="Menu">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faUtensils} />
        </Icon>
      </Header>
      <div className="container">
        <Toggle left={'Menu'} right={'Shopping List'} fixed>
          <div className="flex flex-wrap justify-evenly space-y-3">
            {/* <RecipeCardLong></RecipeCardLong> */}
            {/* <RecipeCard></RecipeCard> */}
						recipes here
          </div>
          <div className="flex flex-wrap justify-evenly">
						shopping list here
					</div>
        </Toggle>
      </div>
    </>
  );
};

export default MenuPage;
