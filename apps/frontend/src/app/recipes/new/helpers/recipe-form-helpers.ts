import type { CreateRecipeInput } from "@/lib/validations";
import type { Item, Recipe, RecipeCategory, Unit } from "@/shared/types";

import type { IngredientItem } from "../components/IngredientManager";
import type { Instruction } from "../components/Instructions";

// Form ingredient shape: IDs only (from API payload or form state)
type FormIngredient = CreateRecipeInput["ingredients"][number];

// Extended type for editing that includes the recipe ID
export type EditRecipeInput = CreateRecipeInput & {
  id: string;
};

function getCategoryId(cat: RecipeCategory | string): string {
  return typeof cat === "string" ? cat : cat._id;
}

function getItemId(itemId: { _id: string } | string): string {
  return typeof itemId === "string" ? itemId : itemId._id;
}

function getUnitIdOrNull(
  unitId: { _id: string } | string | null | undefined
): string | null {
  if (unitId == null) return null;
  return typeof unitId === "string" ? unitId : unitId._id;
}

// API recipe ingredient: itemId/unitId may be populated objects or null (unitId)
type ApiRecipeIngredient = {
  itemId: { _id: string } | string;
  unitId?: { _id: string } | string | null;
  quantity: number;
};

/**
 * Transform a recipe from database format to form format for editing.
 * Handles populated API response (itemId/unitId as objects) and null unitId.
 */
export function transformRecipeForForm(recipe: Recipe): EditRecipeInput {
  const ingredients = (recipe.ingredients as ApiRecipeIngredient[]) || [];
  return {
    id: recipe._id,
    name: recipe.name,
    timeInMinutes: recipe.timeInMinutes,
    serves: recipe.serves,
    categoryIds: recipe.categoryIds.map(getCategoryId),
    ingredients: ingredients.map((ing) => ({
      itemId: getItemId(ing.itemId),
      unitId: getUnitIdOrNull(ing.unitId),
      quantity: ing.quantity,
    })),
    instructions: recipe.instructions,
    notes: recipe.notes || [],
    image:
      recipe.image && recipe.image.url && recipe.image.filename
        ? { url: recipe.image.url, filename: recipe.image.filename }
        : undefined,
  };
}

/**
 * Transform recipe ingredients (ID-only form shape) to IngredientManager format.
 */
export function transformIngredientsForForm(
  recipeIngredients: CreateRecipeInput["ingredients"],
  availableIngredients: Item[],
  units: Unit[]
): IngredientItem[] {
  return recipeIngredients.map((ingredient: FormIngredient) => {
    const item = availableIngredients.find((i) => i._id === ingredient.itemId);
    const unit = ingredient.unitId
      ? (units.find((u) => u._id === ingredient.unitId) ?? null)
      : null;

    return {
      id: crypto.randomUUID(),
      itemId: ingredient.itemId,
      itemName: item?.name ?? "Unknown Item",
      unitId: ingredient.unitId ?? null,
      unitName: unit?.name ?? null,
      quantity: ingredient.quantity,
      allowedUnits: item?.allowedUnitIds ?? [],
    };
  });
}

/**
 * Transform recipe instructions to Instructions component format
 */
export function transformInstructionsForForm(
  instructions: string[]
): Instruction[] {
  if (!instructions || instructions.length === 0) {
    return [{ id: crypto.randomUUID(), text: "" }];
  }

  return instructions.map((instruction) => ({
    id: crypto.randomUUID(),
    text: instruction,
  }));
}

/**
 * Transform notes array to textarea string
 */
export function transformNotesForTextarea(notes: string[] | undefined): string {
  return Array.isArray(notes) ? notes.join("\n") : "";
}

/**
 * Transform textarea string to notes array
 */
export function transformTextareaToNotes(value: string): string[] {
  return value
    .split("\n")
    .map((note: string) => note.trim())
    .filter((note: string) => note.length > 0);
}
