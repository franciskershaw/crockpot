import { prisma } from "@/lib/prisma";
import type { ShoppingList, ShoppingListWithDetails } from "../types";
//

/**
 * Rebuilds a user's shopping list based on their current menu entries.
 * Aggregates ingredient quantities per itemId+unitId, scaled by serves ratio.
 * - One list per user is enforced at the schema level (unique userId)
 * - If the menu is empty, the shopping list is upserted with empty items
 */
export async function rebuildShoppingListForUser(
  userId: string
): Promise<ShoppingList> {
  // Preserve any manual items the user has added
  const existingList = await prisma.shoppingList.findUnique({ where: { userId } });
  const manualItems = (existingList?.items || []).filter((i) => i.isManual);

  // Load the user's current menu
  const menu = await prisma.recipeMenu.findUnique({ where: { userId } });

  if (!menu || menu.entries.length === 0) {
    // Upsert only manual items if there's no menu or entries
    const emptyList = await prisma.shoppingList.upsert({
      where: { userId },
      create: { userId, items: manualItems },
      update: {
        items: manualItems,
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

  const aggregatedItems = Array.from(aggregate.values()).map((a) => ({
    itemId: a.itemId,
    unitId: a.unitId,
    quantity: a.quantity,
    obtained: false,
    isManual: false,
  }));

  const items = [...aggregatedItems, ...manualItems];

  // Upsert the shopping list with aggregated items
  const list = await prisma.shoppingList.upsert({
    where: { userId },
    create: { userId, items },
    update: {
      items,
      updatedAt: new Date(),
    },
  });

  return list as ShoppingList;
}

export async function getUserShoppingListWithDetails(
  userId: string
): Promise<ShoppingListWithDetails | null> {
  const list = await prisma.shoppingList.findUnique({ where: { userId } });
  if (!list) return null;

  // Load item and unit details
  const itemIds = list.items.map((i) => i.itemId);
  const unitIds = list.items.map((i) => i.unitId).filter(Boolean) as string[];

  const [items, units] = await Promise.all([
    prisma.item.findMany({
      where: { id: { in: itemIds } },
      include: { category: true },
    }),
    unitIds.length
      ? prisma.unit.findMany({ where: { id: { in: unitIds } } })
      : Promise.resolve([] as { id: string }[]),
  ]);

  const itemsMap = new Map(items.map((i) => [i.id, i]));
  const unitsMap = new Map(units.map((u) => [u.id, u]));

  return {
    ...list,
    items: list.items.map((i) => ({
      ...i,
      item: itemsMap.get(i.itemId)!,
      unit: i.unitId ? unitsMap.get(i.unitId) || null : null,
    })),
  } as ShoppingListWithDetails;
}

export async function toggleObtainedForItem(
  userId: string,
  itemId: string,
  unitId?: string | null,
  isManual?: boolean
): Promise<ShoppingList> {
  const list = await prisma.shoppingList.findUnique({ where: { userId } });
  if (!list) return await prisma.shoppingList.create({ data: { userId, items: [] } });

  const keyMatches = (i: { itemId: string; unitId?: string | null; isManual?: boolean }) =>
    i.itemId === itemId && (i.unitId ?? null) === (unitId ?? null) &&
    (typeof isManual === "boolean" ? i.isManual === isManual : true);

  const nextItems = list.items.map((i) =>
    keyMatches(i) ? { ...i, obtained: !i.obtained } : i
  );

  const updated = await prisma.shoppingList.update({
    where: { userId },
    data: { items: nextItems, updatedAt: new Date() },
  });
  return updated as ShoppingList;
}

export async function removeItemFromShoppingList(
  userId: string,
  itemId: string,
  unitId?: string | null,
  isManual?: boolean
): Promise<ShoppingList> {
  const list = await prisma.shoppingList.findUnique({ where: { userId } });
  if (!list) return await prisma.shoppingList.create({ data: { userId, items: [] } });

  const keyMatches = (i: { itemId: string; unitId?: string | null; isManual?: boolean }) =>
    i.itemId === itemId && (i.unitId ?? null) === (unitId ?? null) &&
    (typeof isManual === "boolean" ? i.isManual === isManual : true);

  const nextItems = list.items.filter((i) => !keyMatches(i));

  const updated = await prisma.shoppingList.update({
    where: { userId },
    data: { items: nextItems, updatedAt: new Date() },
  });
  return updated as ShoppingList;
}

export async function updateShoppingListItemQuantity(
  userId: string,
  itemId: string,
  unitId: string | null,
  quantity: number,
  isManual?: boolean
): Promise<ShoppingList> {
  const list = await prisma.shoppingList.findUnique({ where: { userId } });
  if (!list) return await prisma.shoppingList.create({ data: { userId, items: [] } });

  const nextItems = list.items.map((i) => {
    const matches =
      i.itemId === itemId &&
      (i.unitId ?? null) === (unitId ?? null) &&
      (typeof isManual === "boolean" ? i.isManual === isManual : true);
    return matches ? { ...i, quantity } : i;
  });

  const updated = await prisma.shoppingList.update({
    where: { userId },
    data: { items: nextItems, updatedAt: new Date() },
  });
  return updated as ShoppingList;
}

export async function addManualItemToShoppingList(
  userId: string,
  itemId: string,
  unitId: string | null,
  quantity: number
): Promise<ShoppingList> {
  const list = await prisma.shoppingList.findUnique({ where: { userId } });

  const items = list?.items || [];

  // Try to find existing manual item with same key
  const keyMatches = (i: { itemId: string; unitId?: string | null; isManual?: boolean }) =>
    i.itemId === itemId && (i.unitId ?? null) === (unitId ?? null) && i.isManual === true;

  let nextItems;
  const existingIndex = items.findIndex(keyMatches);
  if (existingIndex >= 0) {
    nextItems = items.map((i, idx) =>
      idx === existingIndex ? { ...i, quantity: (i.quantity || 0) + quantity } : i
    );
  } else {
    nextItems = [
      ...items,
      {
        itemId,
        unitId,
        quantity,
        obtained: false,
        isManual: true,
      },
    ];
  }

  const updated = await prisma.shoppingList.upsert({
    where: { userId },
    create: { userId, items: nextItems },
    update: { items: nextItems, updatedAt: new Date() },
  });

  return updated as ShoppingList;
}

