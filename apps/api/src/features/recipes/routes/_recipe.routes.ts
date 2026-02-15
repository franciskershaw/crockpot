import { Hono } from "hono";

import {
  authenticate,
  requireRole,
} from "../../../core/middleware/auth.middleware";
import validateObjectId from "../../../core/middleware/validateObjectId.middleware";
import { validate } from "../../../core/utils/validate";
import { UserRole } from "../../../shared/types";
import recipeControllers from "../controllers/_recipes.controller";
import {
  createRecipeSchema,
  getRecipesQuerySchema,
  updateRecipeSchema,
  updateRecipeStatusSchema,
} from "../validation/getRecipes.recipe.validation";

const recipeRoutes = new Hono();

// Public routes
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

// Authenticated routes - create/edit/delete recipes
recipeRoutes.post(
  "/",
  authenticate,
  validate("json", createRecipeSchema),
  recipeControllers.createRecipe
);

recipeRoutes.patch(
  "/:id",
  authenticate,
  validateObjectId("id"),
  validate("json", updateRecipeSchema),
  recipeControllers.updateRecipe
);

recipeRoutes.delete(
  "/:id",
  authenticate,
  validateObjectId("id"),
  recipeControllers.deleteRecipe
);

// Admin-only route - update recipe approval status
recipeRoutes.patch(
  "/:id/status",
  authenticate,
  requireRole(UserRole.ADMIN),
  validateObjectId("id"),
  validate("json", updateRecipeStatusSchema),
  recipeControllers.updateRecipeStatus
);

export default recipeRoutes;
