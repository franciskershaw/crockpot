import { Hono } from "hono";

import {
  authenticate,
  requireRole,
} from "../../../core/middleware/auth.middleware";
import { validateObjectId } from "../../../core/middleware/validateObjectId.middleware";
import { validate } from "../../../core/utils/validate";
import { UserRole } from "../../../shared/types";
import itemControllers from "../controllers/_items.controller";
import {
  createItemSchema,
  getItemsQuerySchema,
  updateItemSchema,
} from "../validation/getItems.item.validation";

const itemRoutes = new Hono();

// Public routes
itemRoutes.get(
  "/",
  validate("query", getItemsQuerySchema),
  itemControllers.getItems
);
itemRoutes.get("/categories", itemControllers.getItemCategories);

// Admin-only routes for item management
itemRoutes.post(
  "/",
  authenticate,
  requireRole(UserRole.ADMIN),
  validate("json", createItemSchema),
  itemControllers.createItem
);

itemRoutes.patch(
  "/:id",
  authenticate,
  requireRole(UserRole.ADMIN),
  validateObjectId("id"),
  validate("json", updateItemSchema),
  itemControllers.updateItem
);

itemRoutes.delete(
  "/:id",
  authenticate,
  requireRole(UserRole.ADMIN),
  validateObjectId("id"),
  itemControllers.deleteItem
);

export default itemRoutes;
