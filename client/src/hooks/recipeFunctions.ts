interface Recipe {
  imageUrl: string;
  cookingTime: number;
  recipeName: string;
  ingredients: string[];
  categories: string[];
}

export const getCategories = (recipes: Recipe[]): string[] => {
  const categories: string[] = [];

  recipes.forEach((recipe) => {
    recipe.categories.forEach((category) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });
  });

  return categories;
};

export const getIngredients = (recipes: Recipe[]): string[] => {
  const ingredients: string[] = [];

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
      }
    });
  });

  return ingredients;
};

export const getMinMaxCookingTime = (
  recipes: Recipe[]
): { min: number; max: number } => {
  if (recipes.length === 0) {
    return { min: 0, max: 0 };
  }

  let minTime = recipes[0].cookingTime;
  let maxTime = recipes[0].cookingTime;

  for (const recipe of recipes) {
    if (recipe.cookingTime < minTime) {
      minTime = recipe.cookingTime;
    }
    if (recipe.cookingTime > maxTime) {
      maxTime = recipe.cookingTime;
    }
  }

  return { min: minTime, max: maxTime };
};
