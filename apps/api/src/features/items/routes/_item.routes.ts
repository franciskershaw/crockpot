import { Hono } from "hono";

import { validate } from "../../../core/utils/validate";
import itemControllers from "../controllers/_items.controller";
import { getItemsQuerySchema } from "../validation/getItems.item.validation";

const itemRoutes = new Hono();

itemRoutes.get(
  "/",
  validate("query", getItemsQuerySchema),
  itemControllers.getItems
);
itemRoutes.get("/categories", itemControllers.getItemCategories);

// itemRoutes.post("/", authenticate, validate("json", createItemSchema), itemControllers.createItem);

// itemRoutes.get("/categories/with-usage", itemControllers.getItemCategoriesWithUsage);
// itemRoutes.get("/categories/:id/usage-count", validateObjectId("id"), itemControllers.getItemCategoryUsageCount);
// itemRoutes.post("/categories", authenticate, validate("json", createItemCategorySchema), itemControllers.createItemCategory);
// itemRoutes.patch("/categories/:id", authenticate, validateObjectId("id"), validate("json", updateItemCategorySchema), itemControllers.updateItemCategory);
// itemRoutes.delete("/categories/:id", authenticate, validateObjectId("id"), itemControllers.deleteItemCategory);

// itemRoutes.get("/:id", validateObjectId("id"), itemControllers.getItemById);
// itemRoutes.patch("/:id", authenticate, validateObjectId("id"), validate("json", updateItemSchema), itemControllers.updateItem);
// itemRoutes.delete("/:id", authenticate, validateObjectId("id"), itemControllers.deleteItem);

export default itemRoutes;
