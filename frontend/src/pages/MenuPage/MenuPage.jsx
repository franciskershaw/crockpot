import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import TogglePills from '../../components/pills/TogglePills';
import AccordionCustom from '../../components/accordions/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from '../../hooks/user/useMenu';
import { useItemCategories } from '../../hooks/items/useItemCategories';

const MenuPage = () => {
  const { recipeMenu, shoppingList } = useMenu();
  const { itemCategories } = useItemCategories();
  // console.log('menu', recipeMenu);
  // console.log('shoppingList', shoppingList);
	// console.log('categories', itemCategories)

  const categorisedShoppingList = itemCategories.map((category) =>
    shoppingList.filter((item) => item.item.category === category._id)
  );

  let shoppingListData = []

  for (let i = 0; i < itemCategories.length; i++) {
    if (categorisedShoppingList[i].length > 0) {
      shoppingListData.push({
        title: itemCategories[i].name,
        icon: itemCategories[i].faIcon,
        content: categorisedShoppingList[i]
      })
    }
  }

  // console.log(shoppingListData)

  // let shoppingListItems = []

  // for (let i = 0; i < shoppingList.length; i++) {
  //   const itemName = shoppingList[i].item.name
  //   const itemQuantity = Math.round(shoppingList[i].quantity * 100) / 100
  //   let itemUnit = shoppingList[i].unit

  //   if (itemUnit == "cans") {
  //     itemUnit = " cans"
  //   }

  //   shoppingListItems.push(
  //     itemName.concat(" x ", itemQuantity, itemUnit)
  //   )
  // }

  // console.log(shoppingListItems)


  return (
    <>
      <Header title="Menu">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faUtensils} />
        </Icon>
      </Header>
      <div className="container">
        <Toggle left={`Menu (${recipeMenu.length})`} right={'Shopping List'} fixed>
          <div className="flex flex-wrap justify-evenly space-y-3">
            {recipeMenu.map((recipe) => (
                <RecipeCardLong key={recipe.recipe._id} recipe={recipe.recipe} serves={recipe.serves} />
              )
            )}
          </div>
          <div className="">
						<AccordionCustom data={shoppingListData} />
					</div>
        </Toggle>
      </div>
    </>
  );
};

export default MenuPage;
