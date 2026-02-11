import mongoose from "mongoose";

import Item from "../../items/model/item.model";
import RecipeMenu from "../../menu/model/recipeMenu.model";
import Recipe from "../../recipes/model/recipe.model";
import Unit from "../../units/model/unit.model";
import ShoppingList, {
  IShoppingList,
  IShoppingListItem,
} from "../model/shoppingList.model";

/**
 * Rebuilds a user's shopping list based on their current menu entries.
 * Aggregates ingredient quantities per itemId+unitId, scaled by serves ratio.
 * - One list per user is enforced at the schema level (unique userId)
 * - If the menu is empty, the shopping list is upserted with empty items
 * - Manual items are preserved during rebuild
 */
export async function rebuildShoppingListForUser(
  userId: mongoose.Types.ObjectId
): Promise<IShoppingList> {
  // Preserve any manual items the user has added
  const existingList = await ShoppingList.findOne({ userId });
  const manualItems = (existingList?.items || []).filter((i) => i.isManual);

  // Load the user's current menu
  const menu = await RecipeMenu.findOne({ userId });

  if (!menu || menu.entries.length === 0) {
    // Upsert only manual items if there's no menu or entries
    const emptyList = await ShoppingList.findOneAndUpdate(
      { userId },
      {
        userId,
        items: manualItems,
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return emptyList;
  }

  // Collect all recipe IDs from the menu
  const recipeIds = menu.entries.map((e) => e.recipeId);

  // Fetch recipes with embedded ingredients
  const recipes = await Recipe.find({ _id: { $in: recipeIds } }).lean();

  // Index recipes by id for O(1) lookup
  const recipeById = new Map(
    recipes.map((r) => [r._id.toString(), r as (typeof recipes)[0]])
  );

  // Aggregate quantities by (itemId, unitId)
  const aggregate = new Map<
    string,
    {
      itemId: mongoose.Types.ObjectId;
      unitId: mongoose.Types.ObjectId | null;
      quantity: number;
    }
  >();

  for (const entry of menu.entries) {
    const recipe = recipeById.get(entry.recipeId.toString());
    if (!recipe) continue;

    const baseServes = recipe.serves || 1; // guard against divide-by-zero
    const scale = entry.serves / baseServes;

    for (const ingredient of recipe.ingredients) {
      const key = `${ingredient.itemId.toString()}|${ingredient.unitId?.toString() ?? ""}`;
      const current = aggregate.get(key) ?? {
        itemId: ingredient.itemId,
        unitId: ingredient.unitId ?? null,
        quantity: 0,
      };

      current.quantity += (ingredient.quantity || 0) * scale;
      aggregate.set(key, current);
    }
  }

  const aggregatedItems: IShoppingListItem[] = Array.from(
    aggregate.values()
  ).map((a) => ({
    itemId: a.itemId,
    unitId: a.unitId,
    quantity: a.quantity,
    obtained: false,
    isManual: false,
  }));

  const items = [...aggregatedItems, ...manualItems];

  // Upsert the shopping list with aggregated items
  const list = await ShoppingList.findOneAndUpdate(
    { userId },
    {
      userId,
      items,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return list;
}

/**
 * Get user's shopping list with populated item and unit details
 */
export async function getUserShoppingListWithDetails(
  userId: mongoose.Types.ObjectId
) {
  const list = await ShoppingList.findOne({ userId }).lean();

  if (!list) {
    return null;
  }

  // Load item and unit details
  const itemIds = list.items.map((i) => i.itemId);
  const unitIds = list.items
    .map((i) => i.unitId)
    .filter((id): id is mongoose.Types.ObjectId => id !== null);

  const [items, units] = await Promise.all([
    Item.find({ _id: { $in: itemIds } })
      .populate("categoryId")
      .lean(),
    unitIds.length > 0 ? Unit.find({ _id: { $in: unitIds } }).lean() : [],
  ]);

  const itemsMap = new Map(items.map((i) => [i._id.toString(), i]));
  const unitsMap = new Map(units.map((u) => [u._id.toString(), u]));

  return {
    ...list,
    items: list.items.map((i) => {
      const item = itemsMap.get(i.itemId.toString());
      const unit = i.unitId ? unitsMap.get(i.unitId.toString()) : null;
      return {
        ...i,
        item,
        unit: unit || null,
      };
    }),
  };
}

/**
 * Toggle the obtained status of a shopping list item
 */
export async function toggleObtainedForItem(
  userId: mongoose.Types.ObjectId,
  itemId: mongoose.Types.ObjectId,
  unitId?: mongoose.Types.ObjectId | null,
  isManual?: boolean
): Promise<IShoppingList> {
  const list = await ShoppingList.findOne({ userId });

  if (!list) {
    // Create empty shopping list if it doesn't exist
    return await ShoppingList.create({ userId, items: [] });
  }

  const keyMatches = (i: IShoppingListItem) =>
    i.itemId.toString() === itemId.toString() &&
    (i.unitId?.toString() ?? null) === (unitId?.toString() ?? null) &&
    (typeof isManual === "boolean" ? i.isManual === isManual : true);

  const nextItems = list.items.map((i) =>
    keyMatches(i) ? { ...i, obtained: !i.obtained } : i
  );

  list.items = nextItems;
  list.updatedAt = new Date();
  await list.save();

  return list;
}

/**
 * Remove an item from the shopping list
 */
export async function removeItemFromShoppingList(
  userId: mongoose.Types.ObjectId,
  itemId: mongoose.Types.ObjectId,
  unitId?: mongoose.Types.ObjectId | null,
  isManual?: boolean
): Promise<IShoppingList> {
  const list = await ShoppingList.findOne({ userId });

  if (!list) {
    // Create empty shopping list if it doesn't exist
    return await ShoppingList.create({ userId, items: [] });
  }

  const keyMatches = (i: IShoppingListItem) =>
    i.itemId.toString() === itemId.toString() &&
    (i.unitId?.toString() ?? null) === (unitId?.toString() ?? null) &&
    (typeof isManual === "boolean" ? i.isManual === isManual : true);

  const nextItems = list.items.filter((i) => !keyMatches(i));

  list.items = nextItems;
  list.updatedAt = new Date();
  await list.save();

  return list;
}

/**
 * Update the quantity of a shopping list item
 */
export async function updateShoppingListItemQuantity(
  userId: mongoose.Types.ObjectId,
  itemId: mongoose.Types.ObjectId,
  unitId: mongoose.Types.ObjectId | null,
  quantity: number,
  isManual?: boolean
): Promise<IShoppingList> {
  const list = await ShoppingList.findOne({ userId });

  if (!list) {
    // Create empty shopping list if it doesn't exist
    return await ShoppingList.create({ userId, items: [] });
  }

  const nextItems = list.items.map((i) => {
    const matches =
      i.itemId.toString() === itemId.toString() &&
      (i.unitId?.toString() ?? null) === (unitId?.toString() ?? null) &&
      (typeof isManual === "boolean" ? i.isManual === isManual : true);
    return matches ? { ...i, quantity } : i;
  });

  list.items = nextItems;
  list.updatedAt = new Date();
  await list.save();

  return list;
}

/**
 * Add a manual item to the shopping list
 * If the item already exists as manual with the same unit, increment the quantity
 */
export async function addManualItemToShoppingList(
  userId: mongoose.Types.ObjectId,
  itemId: mongoose.Types.ObjectId,
  unitId: mongoose.Types.ObjectId | null,
  quantity: number
): Promise<IShoppingList> {
  const list = await ShoppingList.findOne({ userId });

  const items = list?.items || [];

  // Try to find existing manual item with same key
  const keyMatches = (i: IShoppingListItem) =>
    i.itemId.toString() === itemId.toString() &&
    (i.unitId?.toString() ?? null) === (unitId?.toString() ?? null) &&
    i.isManual === true;

  let nextItems: IShoppingListItem[];
  const existingIndex = items.findIndex(keyMatches);

  if (existingIndex >= 0) {
    // Update existing manual item
    nextItems = items.map((i, idx) =>
      idx === existingIndex
        ? { ...i, quantity: (i.quantity || 0) + quantity }
        : i
    );
  } else {
    // Add new manual item
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

  if (list) {
    list.items = nextItems;
    list.updatedAt = new Date();
    await list.save();
    return list;
  } else {
    return await ShoppingList.create({ userId, items: nextItems });
  }
}

/**
 * Clear all items from the shopping list
 */
export async function clearAllItemsFromShoppingList(
  userId: mongoose.Types.ObjectId
): Promise<IShoppingList> {
  const list = await ShoppingList.findOneAndUpdate(
    { userId },
    {
      userId,
      items: [],
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  return list;
}
