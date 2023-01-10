import Header from '../../layout/header/Header';
import Icon from '../../components/icons/Icon';
import RecipeCardLong from '../../components/recipeCard/RecipeCardLong';
import Toggle from '../../components/toggles/Toggle';
import AccordionCustom from '../../components/accordions/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { useMenu } from '../../hooks/user/useMenu';
import { useItemCategories } from '../../hooks/items/useItemCategories';
import { useState } from 'react';
import { useItems } from '../../hooks/items/useItems';

const MenuPage = () => {
  const { recipeMenu, shoppingList, addExtraShoppingItem } = useMenu();
  const { itemCategories } = useItemCategories();
  const { allItems } = useItems();

  const [extraItem, setExtraItem] = useState({
    _id: '',
    quantity: 1,
    unit: '',
    obtained: false,
  });

  const categorisedShoppingList = itemCategories.map((category) =>
    shoppingList.filter((item) => item.item.category === category._id)
  );

  let shoppingListData = [];

  itemCategories.forEach((itemCategory, i) => {
    if (categorisedShoppingList[i].length) {
      shoppingListData.push({
        title: itemCategory.name,
        icon: itemCategory.faIcon,
        content: categorisedShoppingList[i],
      });
    }
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    setExtraItem((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    if (extraItem._id != '') {
      addExtraShoppingItem(extraItem);
      setExtraItem({ _id: '', quantity: 1, unit: '', obtained: false });
    }
  };

  const onClear = () => {
    addExtraShoppingItem();
  };

  return (
    <>
      <Header title="Menu">
        <Icon classes={'mr-3'} type={'no-hover'}>
          <FontAwesomeIcon icon={faUtensils} />
        </Icon>
      </Header>
      <div className="container">
        <Toggle
          left={`Menu (${recipeMenu.length})`}
          right={'Shopping List'}
          fixed>
          <div className="recipe-card-container">
            {recipeMenu.map((recipe) => (
              <RecipeCardLong
                key={recipe.recipe._id}
                recipe={recipe.recipe}
                serves={recipe.serves}
              />
            ))}
          </div>
          <div className="mx-auto max-w-4xl">
            <AccordionCustom data={shoppingListData} />

            {/* Extra items */}
            <div className="form mt-5" id="addExtraItem">
              {/* Ingredients - 50 25 25, select */}
              <div className="space-y-1">
                <label htmlFor="ingredients">Add Extra Items</label>
                <div className="flex justify-between flex-wrap">
                  <div className="form__input form__input--50">
                    <select
                      name="_id"
                      onChange={onChange}
                      value={
                        extraItem._id ? extraItem._id : 'Please select an item'
                      }>
                      <option disabled value="Please select an item">
                        Please select an extra item to add
                      </option>
                      {allItems.map((ingredient) => (
                        <option key={ingredient.name} value={ingredient._id}>
                          {ingredient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form__input form__input--25">
                    <input
                      name="quantity"
                      onChange={onChange}
                      value={extraItem.quantity}
                      type="number"
                      min="0"
                      step="any"
                    />
                  </div>
                  <div className="form__input form__input--25">
                    <select
                      name="unit"
                      value={extraItem.unit}
                      onChange={onChange}>
                      <option value="">-</option>
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="tsp">tsp</option>
                      <option value="tbsp">Tbsp</option>
                      <option value="cans">cans</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 space-x-3 text-center">
              <button
                className="btn btn--secondary"
                type="submit"
                form="addExtraItem"
                value="Add Item"
                onClick={onSubmit}>
                Add Item
              </button>
              <button
                onClick={onClear}
                className="btn btn--secondary"
                value="Clear Items">
                Clear Items
              </button>
            </div>
          </div>
        </Toggle>
      </div>
    </>
  );
};

export default MenuPage;
