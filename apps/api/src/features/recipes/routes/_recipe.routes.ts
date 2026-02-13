import { Hono } from "hono";

import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import { validate } from "../../../core/utils/validate";
import recipeControllers from "../controllers/_recipes.controller";
import { getRecipesQuerySchema } from "../validation/getRecipes.recipe.validation";

const recipeRoutes = new Hono();

recipeRoutes.get("/time-range", recipeControllers.getRecipeTimeRange);
recipeRoutes.get("/categories", recipeControllers.getRecipeCategories);

recipeRoutes.get(
  "/",
  validate("query", getRecipesQuerySchema),
  recipeControllers.getRecipes
);

recipeRoutes.get(
  "/:id",
  validateObjectId("id"),
  recipeControllers.getRecipeById
);

// recipeRoutes.post("/", authenticate, validate("json", createRecipeSchema), recipeControllers.createRecipe);

// recipeRoutes.patch("/:id", authenticate, validateObjectId("id"), validate("json", updateRecipeSchema), recipeControllers.editRecipe);

// recipeRoutes.delete("/:id", authenticate, validateObjectId("id"), recipeControllers.deleteRecipe);

export default recipeRoutes;
