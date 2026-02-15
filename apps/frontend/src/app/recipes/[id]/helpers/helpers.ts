import { Package } from "lucide-react";

import { getIconComponent } from "@/lib/icon-map";
import { Ingredient } from "@/shared/types";

export interface CategorizedIngredients {
  [categoryName: string]: Ingredient[];
}

export function groupIngredientsByCategory(
  ingredients: Ingredient[]
): CategorizedIngredients {
  return ingredients.reduce((acc, ingredient) => {
    // Handle both formats: ingredient.item.category OR ingredient.itemId.categoryId
    const categoryName = ingredient.itemId?.categoryId?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(ingredient);
    return acc;
  }, {} as CategorizedIngredients);
}

export function getCategoryIcon(ingredients: Ingredient[]) {
  // Handle both formats: ingredient.item.category OR ingredient.itemId.categoryId
  const categoryIcon = ingredients[0]?.itemId?.categoryId?.faIcon;
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
