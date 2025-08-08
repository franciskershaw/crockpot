import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import type { RecipeMenu } from "@/data/types";
import ShoppingList from "./ShoppingList";
import MobileShoppingListSheet from "./MobileShoppingListSheet";
import { getShoppingList } from "@/actions/menu";
import { getItems } from "@/actions/items";
import { getUnits } from "@/actions/units";

const RecipeMenu = async ({ menu }: { menu: RecipeMenu | null }) => {
  const shoppingList = await getShoppingList();
  const items = await getItems();
  const units = await getUnits();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      <div className="hidden md:block col-span-1">
        <ShoppingList initialData={shoppingList} items={items} units={units} />
      </div>
      <div className="col-span-2">
        {/* Mobile: inline button to open Shopping List sheet */}
        <div className="md:hidden mb-3">
          <MobileShoppingListSheet
            initialData={shoppingList}
            items={items}
            units={units}
          />
        </div>
        <ResponsiveRecipeGrid>
          {menu?.entries.map((entry, index) => (
            <RecipeCard
              key={entry.recipeId}
              recipe={entry.recipe}
              priority={index < 6}
              fromPage="/your-crockpot"
            />
          ))}
        </ResponsiveRecipeGrid>
      </div>
    </div>
  );
};

export default RecipeMenu;
