"use client";
import ResponsiveRecipeGrid from "@/components/layout/wrapper/ResponsiveRecipeGrid";
import RecipeCard from "@/app/recipes/components/RecipeCard";
import EmptyState from "@/components/ui/empty-state";
import { ChefHat, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGetMenu } from "@/hooks/useMenu";

function MenuGrid() {
  const { menu } = useGetMenu();

  if (!menu?.entries?.length) {
    return (
      <EmptyState minHeight="min-h-[calc(100vh-20rem)] md:min-h-[calc(100vh-16rem)]">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-amber-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-8 w-8 text-orange-600" />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Your menu is empty
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Start building your meal plan by adding recipes to your menu.
          </p>
        </div>
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
        <p className="text-xs text-gray-500">
          Add recipes to your menu to generate shopping lists and plan meals
        </p>
      </EmptyState>
    );
  }

  return (
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
  );
}

export default MenuGrid;
