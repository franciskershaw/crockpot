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

export interface Item {
	_id: string;
	name: string;
	category: string;
}

export interface Image {
	url: string;
	filename: string;
}

export interface Ingredient {
	_id: string;
	quantity: number;
	unit: string;
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
	createdBy: string;
	approved: boolean;
	__v: number;
}
