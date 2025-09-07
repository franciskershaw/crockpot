import {
  Recipe as PrismaRecipe,
  RecipeCategory as PrismaRecipeCategory,
  Item as PrismaItem,
  ItemCategory as PrismaItemCategory,
  Unit as PrismaUnit,
  RecipeMenu as PrismaRecipeMenu,
  RecipeMenuEntry as PrismaRecipeMenuEntry,
  MenuHistoryEntry as PrismaMenuHistoryEntry,
  ShoppingList as PrismaShoppingList,
  ShoppingListItem as PrismaShoppingListItem,
  UserRole,
} from "@prisma/client";

// Relevance information for recipes when filters are applied
export interface RecipeRelevance {
  score: number; // Total relevance score
  maxPossibleScore: number; // Maximum possible score for current filters
  highestScoreInResults: number; // Highest score among all results in this query
  hasContentFilters: boolean; // Whether meaningful content filters (not just time) are applied
  matchedIngredients: number; // Number of ingredients that matched the filter
  matchedCategories: number; // Number of categories that matched the filter
  hasTimeMatch: boolean; // Whether the recipe time is within the filtered range
  hasQueryMatch: boolean; // Whether the recipe name matches the search query
}

// Ingredient type for enhanced recipe (populated item and unit)
export interface Ingredient {
  itemId: string;
  unitId?: string | null;
  quantity: number;
  item?: PrismaItem & {
    category?: {
      id: string;
      name: string;
      faIcon: string;
      defaultUnitIds: string[];
      createdAt: Date;
      updatedAt: Date;
    };
  };
  unit?: PrismaUnit | null;
}

// Main Recipe type that includes categories, ingredients, createdBy, and optional relevance
export type Recipe = PrismaRecipe & {
  categories: RecipeCategory[];
  ingredients: Ingredient[];
  createdBy?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  relevance?: RecipeRelevance; // Optional, only present when filters are applied
};

export type RecipeCategory = PrismaRecipeCategory;
export type Item = PrismaItem;
export type ItemCategory = PrismaItemCategory;

export interface CreateRecipeInput {
  name: string;
  timeInMinutes: number;
  instructions: string[];
  notes?: string[];
  serves: number;
  categoryIds: string[];
  ingredients: CreateRecipeIngredient[];
  image?: {
    url: string;
    filename: string;
  } | null;
}

export interface CreateRecipeIngredient {
  itemId: string;
  unitId?: string | null;
  quantity: number;
}

export interface RecipeFilters {
  query?: string;
  categoryIds?: string[];
  categoryMode?: "include" | "exclude";
  ingredientIds?: string[];
  approved?: boolean;
  minTime?: number;
  maxTime?: number;
}

export interface GetRecipesDALParams {
  page?: number;
  pageSize?: number;
  filters?: RecipeFilters;
}

// Menu types
export type RecipeMenu = Omit<PrismaRecipeMenu, "entries"> & {
  entries: RecipeMenuEntry[];
  history: MenuHistoryEntry[];
};

export type RecipeMenuEntry = PrismaRecipeMenuEntry & {
  recipe: Recipe;
};

export type MenuHistoryEntry = PrismaMenuHistoryEntry;

// Shopping list types
export type ShoppingList = PrismaShoppingList & {
  items: ShoppingListItem[];
};

export type ShoppingListItem = PrismaShoppingListItem;

export type PopulatedShoppingListItem = ShoppingListItem & {
  item: Item & { category: ItemCategory };
  unit?: PrismaUnit | null;
};

export type ShoppingListWithDetails = Omit<ShoppingList, "items"> & {
  items: PopulatedShoppingListItem[];
};

export type Unit = PrismaUnit;

export { UserRole };

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    createdRecipes: number;
    favouriteRecipes: number;
  };
}
