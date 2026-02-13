import { Hono } from "hono";

import { authenticate } from "../../../core/middleware/auth.middleware";
import { validate } from "../../../core/utils/validate";
import menuControllers from "../controllers/_menu.controller";
import {
  addToMenuSchema,
  removeFromMenuSchema,
} from "../validation/menu.validation";

const menuRoutes = new Hono();

// Get user's menu with recipes
menuRoutes.get("/", authenticate, menuControllers.getUserMenu);

// Add recipe to menu (or update serves if already exists)
menuRoutes.post(
  "/",
  authenticate,
  validate("json", addToMenuSchema),
  menuControllers.addToMenu
);

// Remove recipe from menu
menuRoutes.delete(
  "/",
  authenticate,
  validate("json", removeFromMenuSchema),
  menuControllers.removeFromMenu
);

// Clear entire menu
menuRoutes.delete("/clear", authenticate, menuControllers.clearMenu);

export default menuRoutes;
