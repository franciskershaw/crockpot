import { UserRole } from "@/data/types";

export const queryKeys = {
  RECIPES: "recipes",
  INFINITE_RECIPES: "infinite-recipes",
  USER_RECIPES: "user-recipes",
  RECIPE_COUNT: "recipe-count",
  SHOPPING_LIST: "shopping-list",
  MENU: "menu",
  FAVOURITES: "favourites",
  ITEMS: "items",
  INGREDIENTS: "ingredients",
};

export const tags = {
  RECIPES: "recipes",
  TIME_RANGE: "time-range",
  RECIPE_TIME_RANGE: "recipe-time-range",
  RECIPE_CATEGORIES: "recipe-categories",
  CATEGORIES: "categories",
  RELEVANCE: "relevance",
  FILTERED: "filtered",
  UNITS: "units",
  ITEMS: "items",
};

export const roleColours = {
  [UserRole.FREE]: "bg-gray-100 text-gray-800",
  [UserRole.PREMIUM]: "bg-blue-100 text-blue-800",
  [UserRole.PRO]: "bg-purple-100 text-purple-800",
  [UserRole.ADMIN]: "bg-red-100 text-red-800",
} as const;
