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
