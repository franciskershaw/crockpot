// need a few more types later: recipe, item

export interface User {
	_id: string;
	username: string;
	isAdmin: false;
	favouriteRecipes: [];
	shoppingList: ShoppingItem[];
	recipeMenu: RecipeMenuData[];
	regularItems: [];
	extraItems: IShoppingListItem[];
	accessToken: string;
}

export interface RecipeMenuData {
	_id: string;
	serves: number;
}

export interface Item {
	_id: string;
	name: string;
	category: string;
}

export interface Image {
	url: string;
	filename: string;
}

export type Unit = '' | 'cans' | 'g' | 'tbsp' | 'tsp' | 'ml';

export interface AddRecipeIngredient {
	_id: string;
	name: string;
	quantity: number | null;
	unit: Unit;
}

export interface Ingredient {
	_id: {
		name: string;
		_id: string;
	};
	quantity: number;
	unit: Unit;
}

export interface Category {
	_id: string;
	name: string;
	__v: number;
}

export interface Recipe {
	image: Image;
	_id: string;
	name: string;
	timeInMinutes: number;
	ingredients: Ingredient[];
	instructions: string[];
	notes: string[];
	categories: Category[];
	createdBy: {
		_id: string;
		username: string;
	};
	approved: boolean;
	serves: number;
	__v: number;
}

export interface MenuRecipe {
	recipe: Recipe;
	serves: number;
}

export interface ItemCategory {
	_id: string;
	name: string;
	faIcon: string;
	__v: number;
}

export interface ShoppingItem {
	_id: string;
	name: string;
	category: string;
	__v: number;
}

export interface IShoppingListItem {
	item: ShoppingItem;
	quantity: number;
	unit: Unit;
	obtained: boolean;
	extra?: boolean;
}

export interface GroupedShoppingList {
	categoryId: string;
	categoryName: string;
	faIcon: string;
	items: IShoppingListItem[];
}
