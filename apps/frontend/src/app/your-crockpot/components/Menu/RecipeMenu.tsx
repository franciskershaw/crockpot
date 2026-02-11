"use client";

import useGetMenu from "@/app/menu/hooks/useGetMenu";
import useGetShoppingList from "@/app/shopping-list/hooks/useGetShoppingList";
import type { Item, Unit } from "@/data/types";
// import { useGetMenu } from "@/hooks/useMenu";
import useUser from "@/hooks/user/useUser";

// import { useGetShoppingList } from "@/hooks/useShoppingList";

// import { useGetUserRecipes } from "@/hooks/useUserRecipes";

import ClearMenuDialog from "./ClearMenuDialog";
import MenuGrid from "./MenuGrid";
import MenuSkeleton from "./MenuSkeleton";
import MobileShoppingListSheet from "./MobileShoppingListSheet";
import ShoppingList from "./ShoppingList";

export default function RecipeMenu() {
  const { fetchingUser } = useUser();
  const { menu, isLoading: menuLoading } = useGetMenu();
  const { shoppingList, isLoading: shoppingListLoading } = useGetShoppingList();
  // const { userRecipes, isLoading: userRecipesLoading } = useGetUserRecipes();

  // Show skeleton if:
  // 1. Session is still loading (queries can't start yet), OR
  // 2. Any query is loading AND no cached data exists
  // const isInitialLoad =
  //   fetchingUser ||
  //   ((menuLoading || shoppingListLoading
  //   // || userRecipesLoading) &&
  //     !menu &&
  //     !shoppingList
  //     && !userRecipes);

  const isInitialLoad =
    fetchingUser ||
    ((menuLoading || shoppingListLoading) && !menu && !shoppingList);

  if (isInitialLoad) {
    return <MenuSkeleton />;
  }

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      <div className="hidden md:block col-span-1">
        <ShoppingList />
      </div>
      <div className="col-span-2">
        <div className="md:hidden mb-3 flex gap-2 justify-center">
          <div className="flex-1 max-w-48">
            {/* <MobileShoppingListSheet items={items} units={units} /> */}
          </div>
          {/* {!menu?.entries || menu.entries.length === 0 ? null : (
            <div className="flex-1">
              <ClearMenuDialog />
            </div>
          )} */}
        </div>

        <MenuGrid />
      </div>
    </div>
  );
}
