import { prisma } from "@/lib/prisma";
import type { ShoppingList } from "../types";

/**
 * Rebuilds a user's shopping list based on their current menu entries.
 * Aggregates ingredient quantities per itemId+unitId, scaled by serves ratio.
 * - One list per user is enforced at the schema level (unique userId)
 * - If the menu is empty, the shopping list is upserted with empty items
 */
export async function rebuildShoppingListForUser(
  userId: string
): Promise<ShoppingList> {
  // Load the user's current menu
  const menu = await prisma.recipeMenu.findUnique({ where: { userId } });

  if (!menu || menu.entries.length === 0) {
    // Upsert an empty shopping list if there's no menu or entries
    const emptyList = await prisma.shoppingList.upsert({
      where: { userId },
      create: {
        userId,
        name: "My Shopping List",
        items: [],
      },
      update: {
        items: [],
        updatedAt: new Date(),
      },
    });

    return emptyList as ShoppingList;
  }

  // Collect all recipe IDs from the menu
  const recipeIds = menu.entries.map((e) => e.recipeId);

  // Fetch recipes with embedded ingredients
  const recipes = await prisma.recipe.findMany({
    where: { id: { in: recipeIds } },
    // No need to include categories/relations for aggregation
  });

  // Index recipes by id for O(1) lookup
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  // Aggregate quantities by (itemId, unitId)
  const aggregate = new Map<
    string,
    { itemId: string; unitId: string | null; quantity: number }
  >();

  for (const entry of menu.entries) {
    const recipe = recipeById.get(entry.recipeId);
    if (!recipe) continue;

    const baseServes = recipe.serves || 1; // guard against divide-by-zero
    const scale = entry.serves / baseServes;

    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.itemId}|${ingredient.unitId ?? ""}`;
      const current = aggregate.get(key) ?? {
        itemId: ingredient.itemId,
        unitId: ingredient.unitId ?? null,
        quantity: 0,
      };

      current.quantity += (ingredient.quantity || 0) * scale;
      aggregate.set(key, current);
    }
  }

  const items = Array.from(aggregate.values()).map((a) => ({
    itemId: a.itemId,
    unitId: a.unitId,
    quantity: a.quantity,
    obtained: false,
  }));

  // Upsert the shopping list with aggregated items
  const list = await prisma.shoppingList.upsert({
    where: { userId },
    create: {
      userId,
      name: "My Shopping List",
      items,
    },
    update: {
      items,
      updatedAt: new Date(),
    },
  });

  return list as ShoppingList;
}
