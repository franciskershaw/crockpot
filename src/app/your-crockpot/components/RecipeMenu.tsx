import RecipeCard from "@/app/recipes/components/RecipeCard";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import type { RecipeMenu } from "@/data/types";
import ShoppingList from "./ShoppingList";

const RecipeMenu = async ({ menu }: { menu: RecipeMenu | null }) => {
  if (!menu || menu.entries.length === 0) {
    return <div className="text-center">Empty state - improve this later</div>;
  }
  return (
    <div className="md:grid md:grid-cols-3 md:gap-4">
      <div className="hidden md:block col-span-1">
        <ShoppingList />
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
