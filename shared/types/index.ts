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

export interface Recipe {
  _id: string;
  name: string;
  timeInMinutes: number;
  instructions: string[];
  notes: string[];
  approved: boolean;
  serves: number;
  createdAt: Date;
  updatedAt: Date;
  categoryIds: string[];
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
