import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import type { RecipeMenu } from "@/data/types";
import ShoppingList from "./ShoppingList";
import { getShoppingList } from "@/actions/menu";
import { getItems } from "@/actions/items";

const RecipeMenu = async ({ menu }: { menu: RecipeMenu | null }) => {
  const shoppingList = await getShoppingList();
  const items = await getItems();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      <div className="hidden md:block col-span-1">
        <ShoppingList initialData={shoppingList} items={items} />
      </div>
      <div className="col-span-2">
        <ResponsiveRecipeGrid>
          {menu?.entries.map((entry, index) => (
            <RecipeCard
              key={entry.recipeId}
              recipe={entry.recipe}
              priority={index < 6}
            />
          ))}
        </ResponsiveRecipeGrid>
      </div>
    </div>
  );
};

export default RecipeMenu;
