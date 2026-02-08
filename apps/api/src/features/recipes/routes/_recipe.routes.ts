import { Hono } from "hono";

// import { validate } from "../../../core/utils/validate";
// import { validateObjectId } from "../../../core/middleware/validateObjectId.middleware";
// import { authenticate } from "../../../core/middleware/auth.middleware";
// import recipeControllers from "../controllers/_recipe.controllers";
// import { getRecipesQuerySchema } from "../validation/getRecipes.recipe.validation";
// import { createRecipeSchema } from "../validation/createRecipe.recipe.validation";
// import { updateRecipeSchema } from "../validation/updateRecipe.recipe.validation";
// import { updateRecipeStatusSchema } from "../validation/updateRecipeStatus.recipe.validation";
// import { bulkUpdateRecipeStatusSchema } from "../validation/bulkUpdateRecipeStatus.recipe.validation";

import recipeControllers from "../controllers/_recipes.controller";

const recipeRoutes = new Hono();

recipeRoutes.get("/time-range", recipeControllers.getRecipeTimeRange);
recipeRoutes.get("/categories", recipeControllers.getRecipeCategories);

// recipeRoutes.get("/", validate("query", getRecipesQuerySchema), recipeControllers.getRecipes);

// recipeRoutes.get("/:id", validateObjectId("id"), recipeControllers.getRecipeById);

// recipeRoutes.post("/", authenticate, validate("json", createRecipeSchema), recipeControllers.createRecipe);

// recipeRoutes.patch("/:id", authenticate, validateObjectId("id"), validate("json", updateRecipeSchema), recipeControllers.editRecipe);

// recipeRoutes.delete("/:id", authenticate, validateObjectId("id"), recipeControllers.deleteRecipe);

// recipeRoutes.get("/admin", authenticate, recipeControllers.getRecipesForAdmin);

// recipeRoutes.patch("/:id/status", authenticate, validateObjectId("id"), validate("json", updateRecipeStatusSchema), recipeControllers.updateRecipeStatus);

// recipeRoutes.post("/admin/status", authenticate, validate("json", bulkUpdateRecipeStatusSchema), recipeControllers.bulkUpdateRecipeStatus);

export default recipeRoutes;
