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

export function useGetShoppingList() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated" && !!session?.user;

  const query = useQuery<ShoppingListWithDetails | null>({
    queryKey: ["shopping-list"],
    queryFn: getShoppingList,
    enabled: isAuthenticated,
  });

  return query;
}

export function useToggleObtainedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleObtained,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>([
        "shopping-list",
      ]);
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.map((it) =>
            it.itemId === input.itemId && (it.unitId ?? null) === (input.unitId ?? null)
              ? { ...it, obtained: !it.obtained }
              : it
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["shopping-list"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
    onError: (error: any) => toast.error(error?.message || "Failed to update item"),
  });
}

export function useRemoveShoppingListItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeShoppingListItem,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>([
        "shopping-list",
      ]);
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.filter(
            (it) => !(it.itemId === input.itemId && (it.unitId ?? null) === (input.unitId ?? null))
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["shopping-list"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
      toast.success("Removed from shopping list");
    },
    onError: (error: any) => toast.error(error?.message || "Failed to remove item"),
  });
}

export function useUpdateShoppingListItemQuantityMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShoppingListItemQuantity,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-list"] });
      const previous = queryClient.getQueryData<ShoppingListWithDetails | null>([
        "shopping-list",
      ]);
      if (previous) {
        const next: ShoppingListWithDetails = {
          ...previous,
          items: previous.items.map((it) =>
            it.itemId === input.itemId && (it.unitId ?? null) === (input.unitId ?? null)
              ? { ...it, quantity: input.quantity }
              : it
          ),
        };
        queryClient.setQueryData(["shopping-list"], next);
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) queryClient.setQueryData(["shopping-list"], ctx.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-list"] });
    },
    onError: (error: any) => toast.error(error?.message || "Failed to update quantity"),
  });
}


