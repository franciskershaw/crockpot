import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import AccordionCustom from '../../components/accordions/Accordion';
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

  let shoppingListData = []

  for (let i = 0; i < itemCategories.length; i++) {
    console.log(itemCategories[i].name)
  }

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
						<AccordionCustom data={
              [
                {
                  title: "Title 1",
                  content: "Bacon ipsum dolor amet turducken swine pancetta doner t-bone tongue, ground round landjaeger shoulder picanha. Meatloaf alcatra prosciutto pork. Ball tip shank leberkas, filet mignon sausage alcatra short loin bacon swine. Picanha pig bresaola fatback shoulder. Pork belly kevin landjaeger chislic ball tip. Shankle tri-tip cupim drumstick t-bone ribeye. Prosciutto shankle beef ribeye drumstick."
                }
              ]
            }>

            </AccordionCustom>
					</div>
        </Toggle>
      </div>
    </>
  );
};

export default MenuPage;
