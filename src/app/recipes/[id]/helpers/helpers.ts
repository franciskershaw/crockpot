import { Package } from "lucide-react";
import { getIconComponent } from "@/lib/icon-map";

export interface Ingredient {
  itemId: string;
  unitId?: string | null; // Allow null for compatibility with backend
  quantity: number; // Changed from string to number to match Prisma Float
  item?: {
    id: string;
    name: string;
    categoryId: string;
    allowedUnitIds: string[];
    createdAt: Date;
    updatedAt: Date;
    category?: {
      id: string;
      name: string;
      faIcon: string;
      defaultUnitIds: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  };
  unit?: {
    id: string;
    name: string;
    abbreviation: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

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
