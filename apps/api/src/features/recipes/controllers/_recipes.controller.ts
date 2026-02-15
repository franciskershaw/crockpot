import createRecipe from "./createRecipe.controller";
import deleteRecipe from "./deleteRecipe.controller";
import getRecipeById from "./getRecipeById.controller";
import getRecipeCategories from "./getRecipeCategories.controller";
import getRecipes from "./getRecipes.controller";
import getRecipeTimeRange from "./getRecipeTimeRange.controller";
import updateRecipe from "./updateRecipe.controller";
import updateRecipeStatus from "./updateRecipeStatus.controller";

export default {
  getRecipeById,
  getRecipeCategories,
  getRecipes,
  getRecipeTimeRange,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  updateRecipeStatus,
};
