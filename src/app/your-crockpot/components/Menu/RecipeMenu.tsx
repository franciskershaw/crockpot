import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import type { RecipeMenu } from "@/data/types";
import ShoppingList from "./ShoppingList";
import MobileShoppingListSheet from "./MobileShoppingListSheet";
import { getShoppingList } from "@/actions/menu";
import { getItems } from "@/actions/items";
import { getUnits } from "@/actions/units";
import ClearMenuDialog from "./ClearMenuDialog";
import EmptyState from "@/components/ui/empty-state";
import { ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const RecipeMenu = async ({ menu }: { menu: RecipeMenu | null }) => {
  const shoppingList = await getShoppingList();
  const items = await getItems();
  const units = await getUnits();

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      <div className="hidden md:block col-span-1">
        <ShoppingList
          initialData={shoppingList}
          items={items}
          units={units}
          menu={menu}
        />
      </div>
      <div className="col-span-2">
        {/* Mobile: inline button to open Shopping List sheet */}
        <div className="md:hidden mb-3 flex gap-2 justify-center">
          <div className="flex-1 max-w-48">
            <MobileShoppingListSheet
              initialData={shoppingList}
              items={items}
              units={units}
            />
          </div>
          {!menu?.entries || menu.entries.length === 0 ? null : (
            <div className="flex-1">
              <ClearMenuDialog />
            </div>
          )}
        </div>

        {!menu?.entries || menu.entries.length === 0 ? (
          <EmptyState minHeight="min-h-[calc(100vh-20rem)] md:min-h-[calc(100vh-16rem)]">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full flex items-center justify-center">
                <ChefHat className="h-8 w-8 text-orange-600" />
              </div>
            </div>

            {/* Title and Description */}
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">
                Your menu is empty
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Start building your meal plan by adding recipes to your menu.
                Browse our collection and add your favorites to get started with
                meal planning and shopping list generation.
              </p>
            </div>

            {/* Action Button */}
            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full bg-brand-primary hover:bg-brand-secondary text-white"
              >
                <Link href="/recipes">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Recipes
                </Link>
              </Button>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500">
              Add recipes to your menu to generate shopping lists and plan meals
            </p>
          </EmptyState>
        ) : (
          <ResponsiveRecipeGrid>
            {menu.entries.map((entry, index) => (
              <RecipeCard
                key={entry.recipeId}
                recipe={entry.recipe}
                priority={index < 6}
                fromPage="/your-crockpot"
              />
            ))}
          </ResponsiveRecipeGrid>
        )}
      </div>
    </div>
  );
};

export default RecipeMenu;
