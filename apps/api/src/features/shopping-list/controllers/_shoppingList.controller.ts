import addManualShoppingListItem from "./addManualShoppingListItem.controller";
import clearShoppingList from "./clearShoppingList.controller";
import getShoppingList from "./getShoppingList.controller";
import removeShoppingListItem from "./removeShoppingListItem.controller";
import toggleObtained from "./toggleObtained.controller";
import updateShoppingListItemQuantity from "./updateShoppingListItemQuantity.controller";

const shoppingListControllers = {
  getShoppingList,
  toggleObtained,
  removeShoppingListItem,
  updateShoppingListItemQuantity,
  addManualShoppingListItem,
  clearShoppingList,
};

export default shoppingListControllers;
