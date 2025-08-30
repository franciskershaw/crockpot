"use client";

import {
  getShoppingList,
  removeShoppingListItem,
  toggleObtained,
  updateShoppingListItemQuantity,
  addManualShoppingListItem,
  clearShoppingList,
} from "@/actions/menu";
import type { Item, ShoppingListWithDetails } from "@/data/types";
import { useMemo } from "react";
import { WATER_ITEM_ID } from "@/data/items/getItems";
import { useAuthenticatedQuery } from "./shared/useAuthenticatedQuery";
import { useOptimisticMutation } from "./shared/useOptimisticMutation";

export function useGetShoppingList(
  initialData?: ShoppingListWithDetails | null
) {
  return useAuthenticatedQuery(["shopping-list"], getShoppingList, {
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const useToggleObtainedMutation = createShoppingListMutation({
  mutationFn: toggleObtained,
  itemMatcher: (item, input) =>
    item.itemId === input.itemId &&
    (item.unitId ?? null) === (input.unitId ?? null),
  itemUpdater: (item) => ({ ...item, obtained: !item.obtained }),
  errorMessage: "Failed to toggle obtained",
  requireAuth: true, // Enable authentication checks
});

export const useRemoveShoppingListItemMutation =
  createShoppingListRemovalMutation({
    mutationFn: removeShoppingListItem,
    itemMatcher: (item, input) =>
      item.itemId === input.itemId &&
      (item.unitId ?? null) === (input.unitId ?? null),
    successMessage: "Removed from shopping list",
    errorMessage: "Failed to remove item",
    requireAuth: true, // Enable authentication checks
  });

export const useUpdateShoppingListItemQuantityMutation =
  createShoppingListMutation({
    mutationFn: updateShoppingListItemQuantity,
    itemMatcher: (item, input) =>
      item.itemId === input.itemId &&
      (item.unitId ?? null) === (input.unitId ?? null),
    itemUpdater: (item, input) => ({ ...item, quantity: input.quantity }),
    errorMessage: "Failed to update quantity",
    requireAuth: true, // Enable authentication checks
  });

export function useShoppingListCategories(
  shoppingList: ShoppingListWithDetails | null | undefined,
  catalogItems?: Item[]
) {
  type DisplayItem = ShoppingListWithDetails["items"][number] & {
    displayLabel: string;
    displayUnitAbbr: string;
  };

  const { grouped, categories } = useMemo(() => {
    const catalogById = new Map<string, Item>(
      (catalogItems ?? []).map((it) => [it.id, it])
    );
    const reduced = (shoppingList?.items ?? []).reduce(
      (acc, listItem) => {
        // Skip water items
        if (listItem.itemId === WATER_ITEM_ID) return acc;

        const itemRecord = listItem.item ?? catalogById.get(listItem.itemId);
        const category = itemRecord?.category;
        if (!category) return acc; // skip until relations load; prevents crashes

        const displayItem: DisplayItem = {
          ...listItem,
          displayLabel: itemRecord?.name ?? "",
          displayUnitAbbr: listItem.unit?.abbreviation ?? "",
        };

        acc.groupedByCategory[category.id] = [
          ...(acc.groupedByCategory[category.id] ?? []),
          displayItem,
        ];

        if (!acc.categoriesById[category.id]) {
          acc.categoriesById[category.id] = {
            id: category.id,
            name: category.name,
            faIcon: category.faIcon,
          };
        }

        return acc;
      },
      {
        groupedByCategory: {} as Record<string, DisplayItem[]>,
        categoriesById: {} as Record<
          string,
          { id: string; name: string; faIcon: string }
        >,
      }
    );

    return {
      grouped: reduced.groupedByCategory,
      categories: reduced.categoriesById,
    };
  }, [shoppingList?.items, catalogItems]);

  // Sort category IDs by category ID for consistent ordering
  const categoryIds = Object.keys(categories).sort((a, b) =>
    a.localeCompare(b)
  );

  return { grouped, categories, categoryIds };
}

export const useAddManualShoppingListItemMutation = () => {
  return useOptimisticMutation<
    { itemId: string; unitId?: string | null; quantity: number },
    unknown,
    ShoppingListWithDetails
  >({
    mutationFn: addManualShoppingListItem,
    queryKey: ["shopping-list"],
    optimisticUpdate: (previous, input) => {
      if (!previous) return previous;

      const keyMatches = (it: ShoppingListWithDetails["items"][number]) =>
        it.itemId === input.itemId &&
        (it.unitId ?? null) === (input.unitId ?? null) &&
        it.isManual === true;

      const existingIndex = previous.items.findIndex(keyMatches);
      let nextItems;

      if (existingIndex >= 0) {
        nextItems = previous.items.map((it, idx) =>
          idx === existingIndex
            ? { ...it, quantity: it.quantity + input.quantity }
            : it
        );
      } else {
        nextItems = [
          ...previous.items,
          {
            itemId: input.itemId,
            unitId: input.unitId ?? null,
            quantity: input.quantity,
            obtained: false,
            isManual: true,
            // optimistic relations are not needed for grouping as we only read category from items list which is already fetched
          },
        ];
      }

      return {
        ...previous,
        items: nextItems as ShoppingListWithDetails["items"],
      };
    },
    errorMessage: "Failed to add item",
    requireAuth: true, // Enable authentication checks
  });
};

export const useClearShoppingListMutation = () => {
  return useOptimisticMutation<void, unknown, ShoppingListWithDetails>({
    mutationFn: clearShoppingList,
    queryKey: ["shopping-list"],
    optimisticUpdate: (previous) => {
      if (!previous) return previous;
      return { ...previous, items: [] };
    },
    successMessage: "Shopping list cleared",
    errorMessage: "Failed to clear shopping list",
    requireAuth: true, // Enable authentication checks
  });
};

interface ShoppingListItem {
  itemId: string;
  unitId: string | null;
  quantity: number;
  obtained: boolean;
  isManual?: boolean;
  // Allow additional properties
  [key: string]: unknown;
}

interface ShoppingListData {
  items: ShoppingListItem[];
  // Allow additional properties
  [key: string]: unknown;
}

export function createShoppingListMutation<TInput>(config: {
  mutationFn: (input: TInput) => Promise<unknown>;
  itemMatcher: (item: ShoppingListItem, input: TInput) => boolean;
  itemUpdater: (item: ShoppingListItem, input: TInput) => ShoppingListItem;
  successMessage?: string;
  errorMessage?: string;
  requireAuth?: boolean; // Add authentication flag
}) {
  return () =>
    useOptimisticMutation<TInput, unknown, ShoppingListData>({
      mutationFn: config.mutationFn,
      queryKey: ["shopping-list"],
      optimisticUpdate: (previous, input) => {
        if (!previous) return previous;

        return {
          ...previous,
          items: previous.items.map((item: ShoppingListItem) =>
            config.itemMatcher(item, input)
              ? config.itemUpdater(item, input)
              : item
          ),
        };
      },
      successMessage: config.successMessage,
      errorMessage: config.errorMessage,
      requireAuth: config.requireAuth,
    });
}

/**
 * Factory for creating shopping list removal mutations
 */
export function createShoppingListRemovalMutation<TInput>(config: {
  mutationFn: (input: TInput) => Promise<unknown>;
  itemMatcher: (item: ShoppingListItem, input: TInput) => boolean;
  successMessage?: string;
  errorMessage?: string;
  requireAuth?: boolean; // Add authentication flag
}) {
  return () =>
    useOptimisticMutation<TInput, unknown, ShoppingListData>({
      mutationFn: config.mutationFn,
      queryKey: ["shopping-list"],
      optimisticUpdate: (previous, input) => {
        if (!previous) return previous;

        return {
          ...previous,
          items: previous.items.filter(
            (item: ShoppingListItem) => !config.itemMatcher(item, input)
          ),
        };
      },
      successMessage: config.successMessage,
      errorMessage: config.errorMessage,
      requireAuth: config.requireAuth,
    });
}
