import ClearMenuDialog from "./ClearMenuDialog";
import MobileShoppingListSheet from "./MobileShoppingListSheet";
import ShoppingList from "./ShoppingList";

import { getItems } from "@/actions/items";
import { getUnits } from "@/actions/units";
import { getShoppingList, getUserMenu } from "@/actions/menu";

import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/constants";
import MenuGrid from "./MenuGrid";

// Server component
const RecipeMenu = async () => {
  // 1) Fetch static catalogs on the server (your preference)
  const [items, units] = await Promise.all([getItems(), getUnits()]);

  // 2) Prefetch dynamic data into React Query (menu, shopping list)
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [queryKeys.MENU],
      queryFn: getUserMenu,
    }),
    queryClient.prefetchQuery({
      queryKey: [queryKeys.SHOPPING_LIST],
      queryFn: getShoppingList,
    }),
  ]);
  const state = dehydrate(queryClient);

  return (
    <HydrationBoundary state={state}>
      <div className="md:grid md:grid-cols-3 md:gap-4">
        <div className="hidden md:block col-span-1">
          <ShoppingList items={items} units={units} />
        </div>
        <div className="col-span-2">
          <div className="md:hidden mb-3 flex gap-2 justify-center">
            <div className="flex-1 max-w-48">
              <MobileShoppingListSheet items={items} units={units} />
            </div>
            <div className="flex-1">
              <ClearMenuDialog />
            </div>
          </div>

          <MenuGrid />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default RecipeMenu;
