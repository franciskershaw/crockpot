import { Recipe } from '@/src/types/types';

export const getCategories = (recipes: Recipe[]): string[] => {
	const categories: string[] = [];

	recipes.forEach((recipe) => {
		recipe.categories.forEach((category) => {
			if (!categories.includes(category._id)) {
				categories.push(category._id);
			}
		});
	});

	return categories.sort();
};

export const getIngredients = (recipes: Recipe[]): string[] => {
	const ingredients: string[] = [];

	recipes.forEach((recipe) => {
		recipe.ingredients.forEach((ingredient) => {
			if (!ingredients.includes(ingredient._id)) {
				ingredients.push(ingredient._id);
			}
		});
	});

	return ingredients.sort();
};

export const getMinMaxTimeInMinutes = (
	recipes: Recipe[],
): { min: number; max: number } => {
	if (recipes.length === 0) {
		return { min: 0, max: 0 };
	}

	let minTime = recipes[0].timeInMinutes;
	let maxTime = recipes[0].timeInMinutes;

	for (const recipe of recipes) {
		if (recipe.timeInMinutes < minTime) {
			minTime = recipe.timeInMinutes;
		}
		if (recipe.timeInMinutes > maxTime) {
			maxTime = recipe.timeInMinutes;
		}
	}

	return { min: minTime, max: maxTime };
};
