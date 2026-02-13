import { ROLE } from "../constants";

export interface IUser {
  _id: string;
  email: string;
  name: string;
  emailVerified: Date | null;
  image?: string;
  role: typeof ROLE;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
}

/**
 * Example recipe response from the API
 * See the full example structure in comments above this interface definition
 */

export interface RecipeCategory {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemCategory {
  _id: string;
  name: string;
  faIcon: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeImage {
  url: string;
  filename: string;
}

export interface RecipeCreator {
  _id: string;
  name: string | null;
  image: string | null;
}

export interface RecipeIngredient {
  itemId: string;
  unitId: string | null;
  quantity: number;
  item?: {
    _id: string;
    name: string;
    categoryId: string;
    allowedUnitIds: string[];
    createdAt: Date;
    updatedAt: Date;
    category?: ItemCategory;
  };
  unit?: Unit | null;
}

export interface Recipe {
  _id: string;
  name: string;
  timeInMinutes: number;
  instructions: string[];
  notes: string[];
  approved: boolean;
  serves: number;
  createdById: string | null;
  createdAt: Date;
  updatedAt: Date;
  categoryIds?: RecipeCategory[]; // Array of populated category objects (legacy from mongoose populate)
  image?: RecipeImage | null;
  ingredients: RecipeIngredient[];
  createdBy?: RecipeCreator | null;
}

export interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  _id: string;
  name: string;
  categoryId: string;
  allowedUnitIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ShoppingListItem {
  _id: string;
  itemId: string;
  unit: Unit;
  quantity: number;
  obtained: boolean;
  isManual?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum Permission {
  VIEW_RECIPES = "VIEW_RECIPES", // Not logged in + all others
  MANAGE_FAVOURITES = "MANAGE_FAVOURITES", // FREE + paid + admin
  MANAGE_MENU = "MANAGE_MENU", // FREE + paid + admin
  CREATE_RECIPES = "CREATE_RECIPES", // PREMIUM + PRO + admin
  CREATE_ITEMS = "CREATE_ITEMS", // PREMIUM + PRO + admin
  AI_FEATURES = "AI_FEATURES", // PRO + admin
  ADMIN_PANEL = "ADMIN_PANEL", // ADMIN only
  APPROVE_CONTENT = "APPROVE_CONTENT", // ADMIN only
  CREATE_UNITS = "CREATE_UNITS", // ADMIN only
}

/** User role – values: "FREE" | "PREMIUM" | "PRO" | "ADMIN" */
export enum UserRole {
  FREE = "FREE",
  PREMIUM = "PREMIUM",
  PRO = "PRO",
  ADMIN = "ADMIN",
}

/**
 * Role hierarchy mapping - higher values include permissions of lower values
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  FREE: 1,
  PREMIUM: 2,
  PRO: 3,
  ADMIN: 4,
};

/**
 * Permission requirements mapping
 */
export const PERMISSION_REQUIREMENTS: Record<Permission, UserRole[]> = {
  [Permission.VIEW_RECIPES]: [], // No authentication required
  [Permission.MANAGE_FAVOURITES]: [
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.PRO,
    UserRole.ADMIN,
  ],
  [Permission.MANAGE_MENU]: [
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.PRO,
    UserRole.ADMIN,
  ],
  [Permission.CREATE_RECIPES]: [
    UserRole.FREE,
    UserRole.PREMIUM,
    UserRole.PRO,
    UserRole.ADMIN,
  ],
  [Permission.CREATE_ITEMS]: [UserRole.ADMIN],
  [Permission.AI_FEATURES]: [UserRole.PRO, UserRole.ADMIN],
  [Permission.ADMIN_PANEL]: [UserRole.ADMIN],
  [Permission.APPROVE_CONTENT]: [UserRole.ADMIN],
  [Permission.CREATE_UNITS]: [UserRole.ADMIN],
};
