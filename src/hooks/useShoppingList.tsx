"use client";

import {
  getShoppingList,
  removeShoppingListItem,
  toggleObtained,
  updateShoppingListItemQuantity,
} from "@/actions/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { ShoppingListWithDetails } from "@/data/types";
import { useMemo } from "react";

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
  shoppingList: ShoppingListWithDetails | null | undefined
) {
  const { grouped, categories } = useMemo(() => {
    const byCategory: Record<
      string,
      NonNullable<typeof shoppingList>["items"]
    > = {} as Record<string, NonNullable<typeof shoppingList>["items"]>;
    const cats: Record<string, { id: string; name: string; faIcon: string }> =
      {};
    for (const item of shoppingList?.items || []) {
      const cat = item.item.category;
      if (!byCategory[cat.id])
        byCategory[cat.id] = [] as NonNullable<typeof shoppingList>["items"];
      byCategory[cat.id] = [...byCategory[cat.id], item];
      if (!cats[cat.id])
        cats[cat.id] = { id: cat.id, name: cat.name, faIcon: cat.faIcon };
    }
    return { grouped: byCategory, categories: cats };
  }, [shoppingList?.items]);

  const categoryIds = Object.keys(categories);

  return { grouped, categories, categoryIds };
}
