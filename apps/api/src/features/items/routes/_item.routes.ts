import { Hono } from "hono";

const itemRoutes = new Hono();

// GET /?mode=all|ingredients — all items, or only ingredients (e.g. for recipe filters / create recipe)
// itemRoutes.get("/", validate("query", getItemsQuerySchema), itemControllers.getItems);
// itemRoutes.post("/", authenticate, validate("json", createItemSchema), itemControllers.createItem);

// ---- Item categories (port from data/item-categories + actions/item-categories) ----
// Fixed paths before /:id so they are not matched as ids.
// itemRoutes.get("/categories", itemControllers.getItemCategories);
// itemRoutes.get("/categories/with-usage", itemControllers.getItemCategoriesWithUsage);
// itemRoutes.get("/categories/:id/usage-count", validateObjectId("id"), itemControllers.getItemCategoryUsageCount);
// itemRoutes.post("/categories", authenticate, validate("json", createItemCategorySchema), itemControllers.createItemCategory);
// itemRoutes.patch("/categories/:id", authenticate, validateObjectId("id"), validate("json", updateItemCategorySchema), itemControllers.updateItemCategory);
// itemRoutes.delete("/categories/:id", authenticate, validateObjectId("id"), itemControllers.deleteItemCategory);

// ---- Item by id (after /categories so param does not catch it) ----
// itemRoutes.get("/:id", validateObjectId("id"), itemControllers.getItemById);
// itemRoutes.patch("/:id", authenticate, validateObjectId("id"), validate("json", updateItemSchema), itemControllers.updateItem);
// itemRoutes.delete("/:id", authenticate, validateObjectId("id"), itemControllers.deleteItem);

export default itemRoutes;
