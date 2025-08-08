"use client";

import {
  getShoppingList,
  removeShoppingListItem,
  toggleObtained,
  updateShoppingListItemQuantity,
  addManualShoppingListItem,
  clearShoppingList,
} from "@/actions/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { Item, ShoppingListWithDetails } from "@/data/types";
import { useMemo } from "react";
import { WATER_ITEM_ID } from "@/data/items/getItems";

export function useGetShoppingList(
  initialData?: ShoppingListWithDetails | null
) {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const query = useQuery<ShoppingListWithDetails | null>({
    queryKey: ["shopping-list"],
    queryFn: getShoppingList,
    enabled: isAuthenticated,
    initialData: initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return query;
}

export function useToggleObtainedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleObtained,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>(
        ["shopping-list"]
      );
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.map((it) =>
            it.itemId === input.itemId &&
            (it.unitId ?? null) === (input.unitId ?? null)
              ? { ...it, obtained: !it.obtained }
              : it
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["shopping-list"], ctx.previous);
      toast.error("Failed to toggle obtained");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

export function useRemoveShoppingListItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeShoppingListItem,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>(
        ["shopping-list"]
      );
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.filter(
            (it) =>
              !(
                it.itemId === input.itemId &&
                (it.unitId ?? null) === (input.unitId ?? null)
              )
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["shopping-list"], ctx.previous);
      toast.error("Failed to remove item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast.success("Removed from shopping list");
    },
  });
}

export function useUpdateShoppingListItemQuantityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShoppingListItemQuantity,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>(
        ["shopping-list"]
      );
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.map((it) =>
            it.itemId === input.itemId &&
            (it.unitId ?? null) === (input.unitId ?? null)
              ? { ...it, quantity: input.quantity }
              : it
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["shopping-list"], ctx.previous);
      toast.error("Failed to update quantity");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

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

export function useAddManualShoppingListItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addManualShoppingListItem,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>(
        ["shopping-list"]
      );
      if (previous) {
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
        const next: ShoppingListWithDetails = {
          ...previous,
          items: nextItems as ShoppingListWithDetails["items"],
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["shopping-list"], ctx.previous);
      toast.error("Failed to add item");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
  });
}

export function useClearShoppingListMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearShoppingList,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>(
        ["shopping-list"]
      );
      if (previous) {
        const next: ShoppingListWithDetails = { ...previous, items: [] };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(["shopping-list"], ctx.previous);
      toast.error("Failed to clear shopping list");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast.success("Shopping list cleared");
    },
  });
}
