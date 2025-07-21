import {
  Recipe as PrismaRecipe,
  RecipeCategory as PrismaRecipeCategory,
  Item as PrismaItem,
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

// Main Recipe type that includes categories and optional relevance
export type Recipe = PrismaRecipe & {
  categories: RecipeCategory[];
  relevance?: RecipeRelevance; // Optional, only present when filters are applied
};

export type RecipeCategory = PrismaRecipeCategory;
export type Item = PrismaItem;

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
