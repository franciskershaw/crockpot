/**
 * Reusable Prisma query fragments to eliminate duplication
 * and ensure consistency across the data access layer
 */

/**
 * Standard recipe category include
 * Used in: getRecipes, getUserFavourites, getUserCreatedRecipes, getRecipeById
 */
export const recipeCategoriesInclude = {
  categories: true,
} as const;

/**
 * Standard user profile selection for recipe creators
 * Used in: getRecipeById, getUserCreatedRecipes
 */
export const createdByUserSelect = {
  select: {
    id: true,
    name: true,
    image: true,
  },
} as const;

/**
 * Complete recipe include with categories and creator
 * Used in: getUserCreatedRecipes, getRecipeById
 */
export const recipeWithDetailsInclude = {
  categories: true,
  createdBy: createdByUserSelect,
} as const;

/**
 * Standard item include with category
 * Used in: getItems, getIngredients, ingredient population in getRecipeById
 */
export const itemWithCategoryInclude = {
  category: true,
} as const;

/**
 * Favourite recipes include pattern
 * Used in: getUserFavourites
 */
export const favouriteRecipesInclude = {
  favouriteRecipes: {
    include: recipeCategoriesInclude,
  },
} as const;

/**
 * Standard recipe ordering for most recent first
 * Used in: getUserCreatedRecipes, unfiltered recipe queries
 */
export const recentFirstOrderBy = {
  createdAt: "desc" as const,
};

/**
 * Base where clause for approved recipes
 * Used across most recipe queries
 */
export const approvedRecipesWhere = {
  approved: true,
} as const;
