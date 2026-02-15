import { UserRole } from "@/shared/types";

export const queryKeys = {
  RECIPES: "recipes",
  RECIPE_CATEGORIES: "recipe-categories",
  TIME_RANGE: "time-range",
  USER_RECIPES: "user-recipes",
  USER_RECIPE_COUNT: "user-recipe-count",
  RECIPE_COUNT: "recipe-count",
  SHOPPING_LIST: "shopping-list",
  MENU: "menu",
  FAVOURITES: "favourites",
  ITEMS: "items",
  INGREDIENTS: "ingredients",
  USERS: "users",
  UNITS: "units",
  USER: "user",
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
  ITEM_CATEGORIES: "item-categories",
};

export const roleColours = {
  [UserRole.FREE]: "bg-gray-100 text-gray-800",
  [UserRole.PREMIUM]: "bg-blue-100 text-blue-800",
  [UserRole.PRO]: "bg-purple-100 text-purple-800",
  [UserRole.ADMIN]: "bg-red-100 text-red-800",
} as const;

export const INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN";
