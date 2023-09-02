// need a few more types later: recipe, item

export interface User {
  _id: string;
  username: string;
  isAdmin: false;
  favouriteRecipes: [];
  shoppingList: [];
  regularItems: [];
  extraItems: [];
  accessToken: string;
}
