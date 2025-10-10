import { Package } from "lucide-react";
import { getIconComponent } from "@/lib/icon-map";
import { Ingredient } from "@/data/types";

export interface CategorizedIngredients {
  [categoryName: string]: Ingredient[];
}

export function groupIngredientsByCategory(
  ingredients: Ingredient[]
): CategorizedIngredients {
  return ingredients.reduce((acc, ingredient) => {
    const categoryName = ingredient.item?.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(ingredient);
    return acc;
  }, {} as CategorizedIngredients);
}

export function getCategoryIcon(ingredients: Ingredient[]) {
  const categoryIcon = ingredients[0]?.item?.category?.faIcon;
  return categoryIcon ? getIconComponent(categoryIcon) : Package;
}

/**
 * Scale ingredient quantities based on new serving size
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  originalServes: number,
  newServes: number
): Ingredient[] {
  if (originalServes <= 0 || newServes <= 0) {
    return ingredients;
  }

  const scaleFactor = newServes / originalServes;

  return ingredients.map((ingredient) => ({
    ...ingredient,
    quantity: Math.round(ingredient.quantity * scaleFactor * 100) / 100, // Round to 2 decimal places
  }));
}
